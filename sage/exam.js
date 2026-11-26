/* ENGLISH SAVANT · unit tests / unit exams (native). Routes: #/exam/:g/:u  (p1/uN = test-p1-uN, p2/uN = test-p2-uN, p3/uN = unit-exam-p3-uN).
   Banks: p1-unit-exam-u<N>.json, p2-unit-exam-u<N>.json, unit-exam-p3-u<N>.json. Grading, saved-progress keys and group paging follow the old engines. */
(function(){
'use strict';
var D=document;
function E(tag,cls,txt,at){var e=D.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;if(at)for(var k in at)e.setAttribute(k,at[k]);return e}
function ico(n){var s=E('span','sa-i');s.innerHTML=DS.icon(n);return s}
function T(root,sel){var n=root.querySelector(sel);return n?n.textContent.trim():''}
function esAnswerText(v){return String(v).replace(/[0-9#*]\uFE0F?\u20E3/g,' ').replace(/[\u{1F000}-\u{1FAFF}\u2600-\u27BF\u{1F1E6}-\u{1F1FF}]/gu,' ').replace(/[\u200D\uFE0E\uFE0F]/g,'').normalize('NFKC')}
function esAnswerContent(v){return esAnswerText(v).toLowerCase().replace(/[\u2019\u2018]/g,"'").replace(/[.,!?\u061F\u060C;:]/g,' ').trim().replace(/\s+/g,' ')}
function esContr(s){return String(s).replace(/[\u2018\u2019]/g,"'").replace(/\b(it|that|what|he|she|there|here|who|where|how)'s\b/gi,'$1 is').replace(/\bi'm\b/gi,'i am').replace(/\b(you|we|they)'re\b/gi,'$1 are').replace(/\b(i|you|we|they)'ve\b/gi,'$1 have').replace(/\b(i|you|he|she|it|we|they)'ll\b/gi,'$1 will').replace(/\blet's\b/gi,'let us').replace(/\b(is|are|was|were|do|does|did|have|has|had|would|should|could|must)n't\b/gi,'$1 not').replace(/\b(can't|cannot)\b/gi,'can not').replace(/\bwon't\b/gi,'will not')}
var norm0=function(x){return esAnswerText(x).normalize('NFKC').replace(/[\u2019\u2018]/g,"'").trim().toLowerCase().replace(/\s+/g,' ').replace(/\s+([.!?,])/g,'$1').replace(/[.!?\u060C]+$/,'')};
var norm=function(x){return norm0(esContr(x))};
function match(a,b,q){var clean=function(x){return String(x).normalize('NFKC').replace(/[\u2019\u2018]/g,"'").trim().replace(/\s+/g,' ').replace(/\s+([.!?,])/g,'$1')};
  if(q.strict_punctuation||q.strict_case){a=clean(a);b=clean(b);return (q.strict_case?a:a.toLowerCase())===(q.strict_case?b:b.toLowerCase())}return norm(a)===norm(b)}
var join=function(xs,letters){return letters?xs.join(''):xs.join(' ').replace(/\s+([.!?,])/g,'$1')};
function optionOrder(q){var seed=2166136261;for(var i=0;i<q.id.length;i++)seed=Math.imul(seed^q.id.charCodeAt(i),16777619)>>>0;var xs=q.options.slice();
  for(var j=xs.length-1;j>0;j--){seed=Math.imul(seed,1664525)+1013904223>>>0;var k=seed%(j+1);var t=xs[j];xs[j]=xs[k];xs[k]=t}return xs}
var CFG={
  p1:{title:['الصف الأول الابتدائي','Primary 1'],bank:function(u){return 'p1-unit-exam-u'+u+'.json'},page:function(u){return 'test-p1-u'+u},key:function(u){return 'p1-unit-exam-v2-'+u},menu:false,byLesson:false,batch:true,review:true,second:false,hub:'#/tests/p1'},
  p2:{title:['الصف التاني الابتدائي','Primary 2'],bank:function(u){return 'p2-unit-exam-u'+u+'.json'},page:function(u){return 'test-p2-u'+u},key:function(u){return 'es-p2-exam-progress-v1-'+u},menu:false,byLesson:true,batch:true,review:true,second:true,hub:'#/tests/p2'},
  p3:{title:['الصف التالت الابتدائي','Primary 3'],bank:function(u){return 'unit-exam-p3-u'+u+'.json'},page:function(u){return 'unit-exam-p3-u'+u},key:function(u){return 'es-p3-exam-progress-v1-'+u},menu:true,byLesson:true,batch:true,review:false,second:false,hub:'#/quiz/p3'}
};
var pending=null;
DS.route('/exam/:g/:u',function(ctx){
  var g=ctx.params.g,u=ctx.params.u,cfg=CFG[g],un=/^u(\d+)$/.exec(u);DS.tab('practice');
  if(!cfg||!un){DS.title('مش لاقيين الصفحة دي','Page not found');return DS.ui.empty('الصفحة دي مش موجودة.','This page does not exist.')}
  var n=+un[1];
  return Promise.all([fetch(cfg.page(n)+'.html',{cache:'no-store'}).then(function(r){return r.ok?r.text():''}).catch(function(){return ''}),fetch(cfg.bank(n),{cache:'no-store'}).then(function(r){return r.ok?r.json():null}).catch(function(){return null})]).then(function(r){
    var doc=new DOMParser().parseFromString(r[0]||'<main></main>','text/html'),main=doc.querySelector('main')||doc.body,sec=main.querySelector('#lesson-assessment,[data-unit]');
    if(!main.textContent.trim()||!r[1]||!r[1].length){DS.title('الاختبار لسه مش جاهز','Not ready yet');return DS.ui.empty('الاختبار ده لسه مش جاهز.','This test is not ready yet.')}
    var h1=T(main,'h1'),h1en=g==='p3'?'Unit '+n+' test and review':g==='p2'?'Unit '+n+' test':'Unit '+n+' test · '+cfg.title[1];
    var intro=[].filter.call(main.querySelectorAll(':scope > p'),function(p){return true}).map(function(p){return p.textContent.trim()});
    DS.title(h1,h1en);
    pending={g:g,n:n,cfg:cfg,items:r[1],ds:sec?sec.dataset:{}};
    return DS.ui.crumbs([['#/','الرئيسية','Home'],['#/grades','مناهج مصر','Egypt curriculum'],['#/grade/'+g,cfg.title[0],cfg.title[1]],[cfg.hub,'اختبارات الوحدات','Unit tests'],['',h1,h1en]])+
     '<header class="ds-hero sa-hero"><h1>'+DS.esc(DS.t(h1,h1en))+'</h1>'+(sec&&sec.textContent.trim()?'<p class="ds-sr">'+DS.esc(sec.textContent.trim())+'</p>':'')+intro.map(function(t){return '<p class="ds-sub">'+DS.esc(DS.t(t,t))+'</p>'}).join('')+'</header>'+
     '<a class="ds-back fin-back" href="'+cfg.hub+'">'+DS.icon('back')+'<span><span class="sa-vh">\u2190 </span>'+DS.esc(DS.t('اختبارات الوحدات','Unit tests'))+'</span></a><div id="ex-main" class="ds-stack"></div>'});
});
document.addEventListener('ds:rendered',function(){var h=D.getElementById('ex-main');if(!h||!pending)return;var p=pending;pending=null;mount(h,p)});

function mount(root,P){
  var cfg=P.cfg,unit=P.n,g=P.g,items=P.items,available=(P.ds.availableLessons||'1,2,3,4').split(',').map(Number),examBatch=P.ds.examBatch==='true';
  var lesson=1,index=0,answers=new Map(),STORE=cfg.key(unit);
  try{var st=JSON.parse(localStorage.getItem(STORE));if(st&&JSON.stringify(st.ids)===JSON.stringify(items.map(function(q){return q.id}))){answers=new Map(st.answers.filter(function(a){return items.some(function(q){return q.id===a[0]})&&typeof a[1].ok==='boolean'}));index=Math.max(0,st.index||0);lesson=st.lesson||1}}catch(e){}
  function save(){try{localStorage.setItem(STORE,JSON.stringify({ids:items.map(function(q){return q.id}),answers:Array.from(answers.entries()),index:index,lesson:lesson}))}catch(e){}}
  function view(){return cfg.byLesson?items.filter(function(q){return q.lesson===lesson}):items}
  function blocks(list){var out=[],passages={},loose=null;
    list.forEach(function(q){if(q.passage){loose=null;var key=q.lesson+'|'+q.passage;if(passages[key])passages[key].push(q);else{var gg=[q];passages[key]=gg;out.push(gg)}}
      else{if(g==='p3'){var last=out[out.length-1];if(examBatch&&last&&!last[0].passage&&last.length<5)last.push(q);else out.push([q])}else{if(!loose||loose.length>=5){loose=[];out.push(loose)}loose.push(q)}}});return out}
  function reveal(){root.scrollIntoView({block:'start'})}
  function menu(){root.textContent='';root.appendChild(E('h2',null,DS.t('اختار الدرس','Choose a lesson')));var l=E('div','ds-list');
    available.forEach(function(n){var qs=items.filter(function(q){return q.lesson===n});if(!qs.length)return;var b=E('button','ds-rowlink fin-lesson',null,{type:'button'});var tx=E('span','tx');tx.appendChild(E('b',null,DS.t('الدرس '+DS.num(n)+' · '+qs[0].lesson_title+' · '+DS.num(qs.length)+' سؤال','Lesson '+n+' · '+qs[0].lesson_title+' · '+qs.length+' questions')));b.appendChild(tx);var go=E('span','go');go.innerHTML=DS.icon('chev');b.appendChild(go);
      b.addEventListener('click',function(){lesson=n;index=0;save();render();reveal()});l.appendChild(b)});root.appendChild(l)}
  function render(){
    var list=view(),pages=blocks(list);index=Math.min(index,pages.length-1);var group=pages[index],q=group[0];window.__EXAM={g:g,unit:unit,lesson:lesson,index:index,item:q,items:group};
    root.textContent='';
    if(g==='p3'){var bk=E('button','ds-btn ds-btn--soft',null,{type:'button'});bk.appendChild(ico('back'));bk.appendChild(D.createTextNode(DS.t('رجوع للدروس','Back to lessons')));bk.addEventListener('click',menu);root.appendChild(bk)}
    root.appendChild(E('h2',null,q.lesson_title,{dir:'auto'}));
    var pos=E('div','ds-row ds-row--between');pos.appendChild(E('p','ds-sub lesson-position',DS.t('مجموعة '+DS.num(index+1)+' من '+DS.num(pages.length)+' · '+DS.num(group.length)+' سؤال','Group '+(index+1)+' of '+pages.length+' · '+group.length+' questions')));root.appendChild(pos);
    var bw=E('div');bw.innerHTML=DS.ui.progress((index+1)/pages.length*100);var meter=bw.firstChild;meter.setAttribute('aria-label',DS.t('موضع مجموعة الأسئلة في الدرس','Position of the question group in the lesson'));root.appendChild(meter);
    if(q.passage)root.appendChild(E('div','q-passage ds-passage',q.passage,{dir:'ltr'}));
    var nav=E('div','ds-row fin-nav'),prev=E('button','ds-btn ds-btn--soft',null,{type:'button'}),next=E('button','ds-btn',null,{type:'button'});
    prev.appendChild(ico('back'));prev.appendChild(D.createTextNode(DS.t('السابق','Previous')));next.appendChild(D.createTextNode(index===pages.length-1?DS.t(g==='p3'?'نتيجة الدرس':'نتيجة الوحدة',g==='p3'?'Lesson result':'Unit result'):DS.t('التالي','Next')));next.appendChild(ico('chev'));
    prev.disabled=index===0;next.disabled=group.some(function(it){return !answers.has(it.id)});
    prev.addEventListener('click',function(){index--;save();render();reveal()});
    next.addEventListener('click',function(){if(index<pages.length-1){index++;save();render()}else finish(list);reveal()});
    var body=E('div','ds-grid sa-body');root.appendChild(body);group.forEach(function(it,i){mountQ(body,it,i,group,next)});nav.appendChild(prev);nav.appendChild(next);root.appendChild(nav);
    if(DS.select)DS.select.enhance(root)}
  function mountQ(body,q,qi,group,next){
    var saved=answers.get(q.id),card=E('article','ds-q q-card');card.dataset.itemId=q.id;
    var h=E('div','qh sa-qh');h.appendChild(E('span','num',DS.num(qi+1)));h.appendChild(E('span','q-state'));card.appendChild(h);
    if(g==='p3'&&/^orig-p2-/.test(q.id))card.appendChild(E('p','ds-sub lesson-position',DS.t(q.origin==='adaptation'?'تدريب مُعاد الصياغة من نشاط في كتاب الوزارة':'تدريب إضافي من إعدادنا على درس كتاب الوزارة، وليس سؤالًا مطبوعًا','Extra practice from us on a ministry book lesson, not a printed question'),{dir:'rtl'}));
    card.appendChild(E('div','q-text',q.prompt,{dir:'auto'}));
    if(q.image)card.appendChild(E('img','assessment-image final-picture',null,{src:q.image,alt:q.alt||''}));
    if(q.word_bank&&q.word_bank.length)card.appendChild(E('p','word-bank final-wordbank ds-ltr',q.word_bank.join(' \u00B7 ')));
    var controls=E('div','answer-controls ds-stack',null,{dir:'ltr'});card.appendChild(controls);
    var inputs=[],selected,tokens=[],tokenButtons=[],tokenResult=null;
    if(q.type==='dialogue'){var map={};q.dialogue.forEach(function(turn){var line=E('div','dialogue-turn ds-row');line.appendChild(E('strong',null,turn.speaker+': '));
        turn.text.split(/\{(\d+)\}/g).forEach(function(part,n){if(n%2){var inp=E('input','q-input',null,{type:'text',autocomplete:'off','aria-label':'Blank '+part});inp.dataset.blank=part;line.appendChild(inp);map[+part]=inp}else if(part)line.appendChild(D.createTextNode(part))});controls.appendChild(line)});
      inputs=q.blanks.map(function(b){return map[b.n]})}
    else if(q.type==='reorder'||q.type==='unscramble'){var source=q.type==='reorder'?q.words:q.letters,bank=E('div','token-bank q-words');tokenResult=E('p','token-result built',''),tokenResult.setAttribute('aria-live','polite');
      var update=function(){tokenResult.textContent=join(tokens.map(function(i){return source[i]}),q.type==='unscramble');tokenButtons.forEach(function(b,i){b.disabled=tokens.indexOf(i)>-1})};
      source.forEach(function(w,i){var b=E('button','ds-word wchip opt token',w,{type:'button'});b.dataset.token=i;b.addEventListener('click',function(){tokens.push(i);update()});tokenButtons.push(b);bank.appendChild(b)});
      var undo=E('button','ds-btn ds-btn--soft token-undo',DS.t('ارجع خطوة','Undo a step'),{type:'button'});undo.addEventListener('click',function(){tokens.pop();update()});controls.appendChild(tokenResult);controls.appendChild(bank);controls.appendChild(undo)}
    else if(q.type==='tf'||q.type==='mcq'){var o=E('div','ds-opts');(q.type==='tf'?['True','False']:optionOrder(q)).forEach(function(option){var b=E('button','ds-opt opt',q.option_images?'':option,{type:'button'});b.dataset.option=option;
        if(q.option_images){var pic=E('img','picture-option',null,{src:q.option_images[option],alt:'Picture option '+(q.options.indexOf(option)+1)});b.appendChild(pic);b.setAttribute('aria-label',pic.alt)}else{b.textContent='';b.appendChild(E('span','ds-ltr',option))}
        b.addEventListener('click',function(){selected=option;[].forEach.call(o.querySelectorAll('button'),function(x){x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',x===b?'true':'false')})});o.appendChild(b)});controls.appendChild(o)}
    else{var inp2=E('input','q-input',null,{type:'text',autocomplete:'off','aria-label':'Your answer'});controls.appendChild(inp2);inputs=[inp2];if(!q.strict_case&&!q.strict_punctuation&&window.ESWrittenAI)window.ESWrittenAI.attach(card,{question:q.prompt,passage:q.passage,alternatives:q.accept,answer:function(){return inp2.value}})}
    var check=E('button','ds-btn q-check',DS.t('تحقق','Check'),{type:'button'}),feed=E('div','ds-feedback q-feed',null,{'aria-live':'polite'});card.appendChild(check);card.appendChild(feed);body.appendChild(card);
    function apply(r,animate){check.disabled=true;[].forEach.call(controls.querySelectorAll('button,input'),function(e){e.disabled=true});
      feed.className='ds-feedback q-feed '+(r.ok?'ok':'no bad');feed.textContent='';feed.appendChild(ico(r.ok?'check':'close'));feed.appendChild(E('span',null,r.ok?DS.t('أحسنت، إجابة صحيحة','Well done, correct answer'):DS.t('راجع الإجابة','Check the answer')));
      if(r.fields)r.fields.forEach(function(ok,i){inputs[i].classList.toggle('ok',ok);inputs[i].classList.toggle('no',!ok);if(!ok)feed.appendChild(E('p','corr',DS.t('فراغ ','Blank ')+DS.num(q.blanks[i].n)+': '+q.blanks[i].accept[0]))});
      else if(!r.ok){feed.appendChild(E('p','corr',DS.t('الإجابة الصحيحة: ','Correct answer: ')+q.answer));if(q.type==='mcq'||q.type==='tf')[].forEach.call(controls.querySelectorAll('.opt'),function(b){b.classList.toggle('ok',b.dataset.option===q.answer);if(b.dataset.option===r.selected)b.classList.add('bad')})}
      else if(q.type==='mcq'||q.type==='tf')[].forEach.call(controls.querySelectorAll('.opt'),function(b){if(b.dataset.option===r.selected)b.classList.add('ok')});
      if(r.formIssue)feed.appendChild(E('p','answer-form-note',DS.t('المعنى صحيح. راجع الحروف الكبيرة وعلامات الترقيم: ','The meaning is right. Check capital letters and punctuation: ')+q.answer));
      feed.appendChild(E('p','answer-explanation',DS.lang()==='en'?(q.explanation_en||q.explanation_ar):q.explanation_ar,{dir:'auto'}));
      var stt=h.querySelector('.q-state');stt.textContent='';stt.appendChild(ico(r.ok?'check':'close'));card.classList.add(r.ok?'is-ok':'is-no');
      next.disabled=group.some(function(it){return !answers.has(it.id)})}
    check.addEventListener('click',function(){
      var isToken=q.type==='reorder'||q.type==='unscramble',src=q.type==='reorder'?q.words:q.letters;
      if(inputs.some(function(i){return !i.value.trim()})||(isToken?tokens.length!==src.length:(!inputs.length&&selected===undefined))){feed.className='ds-feedback q-feed no';feed.textContent=DS.t('جاوب على كل الفراغات أو رتّب كل الكلمات والحروف الأول.','Answer every blank or arrange all the words and letters first.');return}
      var ok,fields;
      if(q.type==='dialogue'){fields=q.blanks.map(function(b,i){return b.accept.some(function(a){return norm(a)===norm(inputs[i].value)})});ok=fields.every(Boolean)}
      else if(isToken)ok=q.accept.some(function(a){return norm(a)===norm(join(tokens.map(function(i){return src[i]}),q.type==='unscramble'))});
      else if(inputs.length)ok=q.accept.some(function(a){return match(a,inputs[0].value,q)});else ok=selected===q.answer;
      var form=!ok&&inputs.length===1&&(q.strict_case||q.strict_punctuation)&&q.accept.some(function(a){return esAnswerContent(a)===esAnswerContent(inputs[0].value)});if(form)ok=true;
      var r={ok:ok,formIssue:form,fields:fields,values:inputs.map(function(i){return i.value}),selected:selected,tokens:tokens.slice()};answers.set(q.id,r);save();apply(r,true)});
    if(saved){inputs.forEach(function(x,i){x.value=saved.values[i]});selected=saved.selected;[].forEach.call(controls.querySelectorAll('.opt'),function(b){b.classList.toggle('selected',b.dataset.option===selected)});
      if(saved.tokens&&saved.tokens.length){var s2=q.type==='reorder'?q.words:q.letters;tokens=saved.tokens.slice();tokenResult.textContent=join(tokens.map(function(i){return s2[i]}),q.type==='unscramble')}apply(saved,false)}
  }
  function finish(list){
    var unitMode=g!=='p3',sc=list.filter(function(q){var a=answers.get(q.id);return a&&a.ok}).length;
    root.textContent='';root.appendChild(E('h2',null,unitMode?DS.t('نتيجة الوحدة','Unit result'):DS.t('نتيجة الدرس','Lesson result')));
    var card=E('section','ds-card sa-done');card.appendChild(E('span','ds-score sa-score lesson-score',DS.num(sc)+' / '+DS.num(list.length),{dir:'ltr'}));
    if(g==='p1')card.appendChild(E('p','ds-sub',DS.t('دي نتيجة المحاولة الأولى لكل سؤال، وتدريب من إعدادنا، مش شهادة مستوى أو امتحان وزارة معتمد.','This is the first-try result for each question. It is practice we prepared, not a level certificate or an approved ministry exam.')));root.appendChild(card);
    if(cfg.review){var wrong=list.filter(function(q){return answers.has(q.id)&&!answers.get(q.id).ok}),rv=E('section','exam-wrong-review ds-stack');rv.appendChild(E('h3',null,DS.t('مراجعة الإجابات غير الصحيحة','Review the incorrect answers')));
      if(!wrong.length)rv.appendChild(E('p','ds-sub',DS.t('لا توجد إجابات غير صحيحة في المحاولة.','There are no incorrect answers in this attempt.')));
      wrong.forEach(function(q){var c=E('article','ds-q q-card');if(q.passage)c.appendChild(E('div','q-passage ds-passage',q.passage,{dir:'ltr'}));if(q.image)c.appendChild(E('img','assessment-image final-picture',null,{src:q.image,alt:q.alt||'Question picture'}));
        c.appendChild(E('div','q-text',q.prompt,{dir:'auto'}));c.appendChild(E('p',null,DS.t('الإجابة: ','Answer: ')+q.answer));c.appendChild(E('p','answer-explanation',DS.lang()==='en'?(q.explanation_en||q.explanation_ar):q.explanation_ar,{dir:'auto'}));rv.appendChild(c)});root.appendChild(rv)}
    var row=E('div','ds-row sa-nav'),again=E('button','ds-btn',DS.t(g==='p3'?'حاول الدرس تاني':'ابدأ محاولة جديدة',g==='p3'?'Try the lesson again':'Start a new attempt'),{type:'button'});
    again.addEventListener('click',function(){list.forEach(function(q){answers.delete(q.id)});index=0;save();render();reveal()});row.appendChild(again);
    if(cfg.second){var b2=E('button','ds-btn ds-btn--soft',DS.t('ابدأ الاختبار من جديد','Restart the test'),{type:'button'});b2.addEventListener('click',function(){answers.clear();index=0;save();render();reveal()});row.appendChild(b2)}
    if(g==='p3'){var b3=E('button','ds-btn ds-btn--soft',DS.t('رجوع للدروس','Back to lessons'),{type:'button'});b3.addEventListener('click',menu);row.appendChild(b3)}
    root.appendChild(row);window.__ExamResult={score:sc,total:list.length}}
  if(cfg.menu&&!(Number(new URLSearchParams((location.hash.split('?')[1])||'').get('lesson'))>0))menu();
  else render();
}
})();
