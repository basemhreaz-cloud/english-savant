/* ENGLISH SAVANT · final review family (native). Routes: #/final/:k  (k = p1..p6 | prep1..prep3). m1..m3 = coming-soon page.
   Content: final-review-<k>-questions.json (+ final-review-p2-answers.json for p2) and the old page copy final-review-<k>.html.
   Grading follows the old engines. Saved answers use the old localStorage keys (read and written in the old shape, never deleted). */
(function(){
'use strict';
var D=document;
function E(tag,cls,txt,at){var e=D.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;if(at)for(var k in at)e.setAttribute(k,at[k]);return e}
function ico(n){var s=E('span','sa-i');s.innerHTML=DS.icon(n);return s}
function bi(s){var p=String(s).split(' / '),sp=E('span');if(p.length!==2||!/[\u0600-\u06FF]/.test(p[0])){sp.textContent=s;return sp}
  if(DS.lang()==='en'){sp.appendChild(E('span',null,(window.ES_OLD_EN&&window.ES_OLD_EN(s))||p[1]));sp.appendChild(E('span','ds-sr',p[0]+' / '))}else{sp.appendChild(E('span',null,p[0]));sp.appendChild(E('span','ds-sr',' / '+p[1]))}return sp}
function T(root,sel){var n=root.querySelector(sel);return n?n.textContent.trim():''}
function esAnswerText(v){return String(v).replace(/[0-9#*]\uFE0F?\u20E3/g,' ').replace(/[\u{1F000}-\u{1FAFF}\u2600-\u27BF\u{1F1E6}-\u{1F1FF}]/gu,' ').replace(/[\u200D\uFE0E\uFE0F]/g,'').normalize('NFKC')}
function esAnswerContent(v){return esAnswerText(v).toLowerCase().replace(/[\u2019\u2018]/g,"'").replace(/[.,!?\u061F\u060C;:]/g,' ').trim().replace(/\s+/g,' ')}
function esContr(s){return String(s).replace(/[\u2018\u2019]/g,"'").replace(/\b(it|that|what|he|she|there|here|who|where|how)'s\b/gi,'$1 is').replace(/\bi'm\b/gi,'i am').replace(/\b(you|we|they)'re\b/gi,'$1 are').replace(/\b(i|you|we|they)'ve\b/gi,'$1 have').replace(/\b(i|you|he|she|it|we|they)'ll\b/gi,'$1 will').replace(/\blet's\b/gi,'let us').replace(/\b(is|are|was|were|do|does|did|have|has|had|would|should|could|must)n't\b/gi,'$1 not').replace(/\b(can't|cannot)\b/gi,'can not').replace(/\bwon't\b/gi,'will not')}
var nrm=function(v){return esContr(esAnswerText(v)).toLowerCase().replace(/[\u2019\u2018]/g,"'").replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim()};
var strict=function(v){return String(v).trim().replace(/[\u2019\u2018]/g,"'").replace(/\s+/g,' ')};
var GRADE={p1:['الصف الأول الابتدائي','Primary 1'],p2:['الصف التاني الابتدائي','Primary 2'],p3:['الصف التالت الابتدائي','Primary 3'],p4:['الصف الرابع الابتدائي','Primary 4'],p5:['الصف الخامس الابتدائي','Primary 5'],p6:['الصف السادس الابتدائي','Primary 6'],prep1:['الصف الأول الإعدادي','Prep 1'],prep2:['الصف الثاني الإعدادي','Prep 2'],prep3:['الصف الثالث الإعدادي','Prep 3'],m1:['الصف الأول الإعدادي','Prep 1'],m2:['الصف الثاني الإعدادي','Prep 2'],m3:['الصف الثالث الإعدادي','Prep 3']};
var GID={prep1:'m1',prep2:'m2',prep3:'m3'};
var KEYS={p1:'es-p1-final-v1',p2:'es-final-review-p2-v1',p3:'es-p3-final-self-v1',p4:'es-p4-final-v1',p5:'es-p5-final-v1',p6:'es-p6-final-v1',prep1:'es-prep1-final-v1',prep2:'es-prep2-final-v1',prep3:'es-prep3-final-v1'};
var NOTE={p4:'205 سجلات في6 أقسام. ',p5:'409 سجلات في7 أقسام. ',p6:'333 سجلًا في9 أقسام. ',prep1:'389 سجلًا في21 أقسام. ',prep2:'402 سجلًا في18 أقسام. ',prep3:'388 سجلًا في11 أقسام. '};
var NOTE_EN={p4:'205 records in 6 sections. ',p5:'409 records in 7 sections. ',p6:'333 records in 9 sections. ',prep1:'389 records in 21 sections. ',prep2:'402 records in 18 sections. ',prep3:'388 records in 11 sections. '};
var P=null;
function R(h){var m=/^assessments-(p[1-6]|m[1-3]|kg[12])\.html/i.exec(h||'');if(m)return '#/practice/'+m[1];m=/^grade-(p[1-6]|m[1-3])\.html/i.exec(h||'');if(m)return '#/grade/'+m[1];return '#/grades'}
function oldMain(name){return fetch(name+'.html',{cache:'no-store'}).then(function(r){return r.ok?r.text():''}).catch(function(){return ''}).then(function(t){var d=new DOMParser().parseFromString(t||'<main></main>','text/html');return d.querySelector('main')||d.body})}
function dual(el){ /* node with es-ui-ar / es-ui-en spans, or plain */
  var ar=el.querySelector('.es-ui-ar'),en=el.querySelector('.es-ui-en');
  if(ar&&en){var a=ar.textContent.trim(),e=en.textContent.trim();var ot=DS.lang()==='en'&&window.ES_OLD_EN?window.ES_OLD_EN(a):null;return DS.lang()==='en'?DS.esc(e)+'<span class="ds-sr">'+DS.esc(a)+'</span>'+(ot&&ot!==e?'<span class="ds-sr"> '+DS.esc(ot)+'</span>':''):DS.esc(a)+'<span class="ds-sr">'+DS.esc(e)+'</span>'}
  return [].map.call(el.childNodes,function(c){if(c.nodeType===3)return DS.esc(c.textContent);if(c.tagName==='A')return '<a href="'+DS.esc(c.getAttribute('href'))+'" target="_blank" rel="noopener">'+DS.esc(c.textContent)+'</a>';if(c.classList&&c.classList.contains('es-ui-ar'))return DS.lang()==='en'?((!el.querySelector('.es-ui-en')&&window.ES_OLD_EN&&window.ES_OLD_EN(c.textContent.trim()))?DS.esc(window.ES_OLD_EN(c.textContent.trim()))+'<span class="ds-sr">'+DS.esc(c.textContent)+'</span>':'<span class="ds-sr">'+DS.esc(c.textContent)+'</span>'):DS.esc(c.textContent);if(c.classList&&c.classList.contains('es-ui-en'))return DS.lang()==='en'?DS.esc(c.textContent):'<span class="ds-sr">'+DS.esc(c.textContent)+'</span>';return DS.esc(c.textContent)}).join('')}

DS.route('/final/:k',function(ctx){
  var k=ctx.params.k;DS.tab('practice');
  if(!GRADE[k]){DS.title('مش لاقيين الصفحة دي','Page not found');return DS.ui.empty('الصفحة دي مش موجودة.','This page does not exist.')}
  var live=!!KEYS[k];
  return oldMain('final-review-'+k).then(function(main){
    var g=GID[k]||k,gid=/^m\d$/.test(g)?g:(GID[k]||k);
    if(!main.textContent.trim()){DS.title('مش لاقيين الصفحة دي','Page not found');return DS.ui.empty('الصفحة دي مش موجودة.','This page does not exist.')}
    var h1=T(main,'h1'),h1en=h1.replace('المراجعة النهائية','Final review').replace(/·.*$/,'· '+GRADE[k][1]);
    var back=main.querySelector('.grade-back'),backT=back?back.textContent.replace(/[←→]/g,'').trim():'',backH=back?R(back.getAttribute('href')):'#/grades';
    var intro=[].filter.call(main.querySelectorAll(':scope > p'),function(p){return !p.closest('details')});
    DS.title(h1,h1en);
    P={k:k,live:live,main:main};
    var crumbs=DS.ui.crumbs([['#/','الرئيسية','Home'],['#/grades','مناهج مصر','Egypt curriculum'],['#/grade/'+gid,GRADE[k][0],GRADE[k][1]],['',h1,h1en]]);
    var html=crumbs+'<header class="ds-hero sa-hero"><h1>'+DS.esc(DS.t(h1,h1en))+'</h1>'+intro.map(function(p){return '<p class="ds-sub">'+(p.querySelector('.es-ui-ar')?dual(p):DS.esc(DS.t(p.textContent.trim(),introEn(k,p.textContent.trim()))))+'</p>'}).join('')+'</header>';
    if(back)html+='<a class="ds-back fin-back" href="'+backH+'">'+DS.icon('back')+'<span><span class="sa-vh">\u2190 </span>'+DS.esc(DS.t(backT,backEn(backT,k)))+'</span></a>';
    if(!live){ /* coming soon (m1..m3) */
      var lead=main.querySelector('.page-intro .lead');html+='<div class="ds-stack">'+(lead?'<p class="ds-sub">'+DS.esc(DS.t(lead.getAttribute('data-final-ar')||lead.textContent,lead.getAttribute('data-final-en')||lead.textContent))+'</p>':'')+[].map.call(main.querySelectorAll('section.glass > h2, section.glass > p, section.glass > a'),function(n){if(n.tagName==='A')return '<a class="ds-btn ds-btn--soft" href="'+R(n.getAttribute('href'))+'">'+DS.esc(DS.t(n.getAttribute('data-final-ar')||n.textContent,n.getAttribute('data-final-en')||n.textContent))+'</a>';return n.tagName==='H2'?'<h2>'+DS.esc(DS.t(n.getAttribute('data-final-ar')||n.textContent,n.getAttribute('data-final-en')||n.textContent))+'</h2>':'<p class="ds-sub">'+DS.esc(DS.t(n.getAttribute('data-final-ar')||n.textContent,n.getAttribute('data-final-en')||n.textContent))+'</p>'}).join('')+'</div>';
      P.live=false;return html}
    html+='<div id="fin-main" class="ds-stack"></div>';
    var cr=main.querySelector('#final-media-credits');
    if(cr)html+='<section class="ds-card fin-credits" data-fin-credits><button type="button" class="ds-btn ds-btn--ghost fin-expl-btn" aria-expanded="false">'+dual(cr.querySelector('summary'))+'</button><div class="fin-credits-body ds-sr" aria-hidden="true">'+[].map.call(cr.querySelectorAll(':scope > p'),function(p){return '<p class="ds-sub">'+dual(p)+'</p>'}).join('')+'</div></section>';
    return html});
});
function introEn(k,t){
  if(/^اختار قسم التدريب/.test(t))return 'Pick a practice section, write your answer, then check and open the answer explanation. Your answers are saved on this device only.';
  if(/^أسئلة المراجعة من المذكرة/.test(t))return 'Review questions from the chosen booklet. Grading uses inferred and reviewed keys, not a printed key. Unclear questions and writing are reviewed with the teacher.';
  return t}
function backEn(t,k){if(/^التدريبات/.test(t))return 'Practice · '+GRADE[k][1];if(/^رجوع للتقييمات/.test(t))return (k==='p2'||k==='p3')?'Back to Assessments':'Back to assessments';return GRADE[k][1]}
D.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-fin-credits] > button');if(!b)return;var o=b.getAttribute('aria-expanded')==='true',body=b.nextElementSibling;b.setAttribute('aria-expanded',o?'false':'true');body.classList.toggle('ds-sr',o);body.setAttribute('aria-hidden',o?'true':'false')});
document.addEventListener('ds:rendered',function(){var h=D.getElementById('fin-main');if(!h||!P||!P.live)return;var p=P;P=null;
  var u=function(r){return r.ok?r.json():Promise.reject()};
  var load=[fetch('final-review-'+p.k+'-questions.json',{cache:'no-cache'}).then(u)];
  if(p.k==='p2')load.push(fetch('final-review-p2-answers.json',{cache:'no-cache'}).then(u));
  Promise.all(load).then(function(r){mount(h,p.k,r[0],r[1]||{})}).catch(function(){h.innerHTML=DS.ui.error()})});

/* ---------- shared widgets ---------- */
function mount(host,k,d,keys){
  var KEY=KEYS[k],saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
  function save(id,v){saved[id]=v;try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(e){}}
  function field(id,long,label){var w=E('label','ds-field fin-field'),cap=E('span','fin-cap');cap.appendChild(bi(label==null?'إجابتك / Your response':label));w.appendChild(cap);
    var n=long?E('textarea','q-input'):E('input','q-input');if(long)n.rows=4;else n.type='text';n.dir='auto';n.autocomplete='off';n.spellcheck=false;n.setAttribute('aria-label',cap.textContent||'');n.value=saved[id]||'';n.addEventListener('input',function(){save(id,n.value)});w.appendChild(n);return w}
  function choices(id,opts,legend){var f=E('fieldset','fin-choices ds-opts'),lg=E('legend','fin-cap');lg.appendChild(bi(legend||'اختار إجابتك / Choose'));f.appendChild(lg);
    opts.forEach(function(o,i){var l=E('label','ds-opt fin-opt'),b=E('input',null,null,{type:'radio',name:id,value:String(i)});b.checked=String(saved[id])===String(i);b.addEventListener('change',function(){save(id,b.value)});l.appendChild(b);l.appendChild(E('span','ds-ltr',o));f.appendChild(l)});return f}
  function prompt(c,t,cls){var p=E('p','q-text '+(cls||'final-prompt'),t,{dir:'ltr'});c.appendChild(p);return p}
  function card(q,i,label){var c=E('article','ds-q q-card fin-q');c.dataset.itemId=q.item_id||q.id||'';c.id=String(q.item_id||'').replace(/:/g,'-');var h=E('div','qh sa-qh');h.appendChild(E('span','num',DS.num(i+1)));if(label)h.appendChild(E('span','ds-tag q-label',label));h.appendChild(E('span','q-state'));c.appendChild(h);return c}
  function expl(c,q){if(!q.explanation_ar)return;var t=(DS.lang()==='en'&&q.explanation_en)?q.explanation_en:DS.t(q.explanation_ar||'',q.explanation_en||q.explanation_ar||''),w=E('div','fin-expl'),b=E('button','ds-btn ds-btn--ghost fin-expl-btn',DS.t('افهم الإجابة','Understand the answer'),{type:'button','aria-expanded':'false'}),p=E('p','final-explanation-text ds-sr',t,{dir:'auto','aria-hidden':'true'});
    b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',o?'false':'true');p.classList.toggle('ds-sr',o);p.setAttribute('aria-hidden',o?'true':'false')});w.appendChild(b);w.appendChild(p);c.appendChild(w)}
  function mark(c,ok,txt,more){var fb=c.querySelector('.final-grade-result');fb.className='ds-feedback final-grade-result '+(ok===true?'ok':ok===false?'no bad':'');fb.textContent='';if(ok===true||ok===false)fb.appendChild(ico(ok?'check':'close'));
    if(typeof txt==='string')fb.appendChild(D.createTextNode(txt));else if(txt)fb.appendChild(txt);if(more)fb.appendChild(D.createTextNode(more));
    var st=c.querySelector('.q-state');st.textContent='';c.classList.remove('is-ok','is-no');if(ok===true){st.appendChild(ico('check'));c.classList.add('is-ok')}else if(ok===false){st.appendChild(ico('close'));c.classList.add('is-no')}}
  function okText(){var s=E('span');s.appendChild(D.createTextNode(DS.t('صح ','Correct ')));s.appendChild(E('span','sa-vh','\u2713'));return s}
  function checkBtn(c,fn,label){var b=E('button','ds-btn q-check',null,{type:'button'});b.appendChild(bi(label||'تحقق / Check'));var fb=E('p','ds-feedback final-grade-result',null,{'aria-live':'polite'});b.addEventListener('click',fn);c.appendChild(b);c.appendChild(fb);return b}
  function section(){return E('div','final-section-items ds-grid sa-body')}
  function picker(labels,cur,onPick){var w=E('div','fin-pick'),s=E('select',null,null,{'data-ds-select':'','aria-label':DS.t('اختار قسم المذكرة','Choose a booklet section')});labels.forEach(function(t,i){var o=E('option',null,t,{value:i});if(i===cur)o.selected=true;s.appendChild(o)});s.addEventListener('change',function(){onPick(+s.value)});w.appendChild(s);w.appendChild(E('span','ds-sr',labels.join(' ')+' \u2304',{'aria-hidden':'true'}));return {el:w,sel:s}}
  function navBar(prevFn,nextFn){var n=E('div','ds-row fin-nav');var a=E('button','ds-btn ds-btn--soft',null,{type:'button'});a.appendChild(ico('back'));a.appendChild(bi('السابق / Previous'));var st=E('span','ds-tag ds-ltr fin-status',null,{dir:'ltr'});var b=E('button','ds-btn ds-btn--soft',null,{type:'button'});b.appendChild(bi('التالي / Next'));b.appendChild(ico('chev'));a.addEventListener('click',prevFn);b.addEventListener('click',nextFn);n.appendChild(a);n.appendChild(st);n.appendChild(b);return {el:n,prev:a,next:b,status:st}}
  function score(cards,mk){var out=host.querySelector('.final-score');if(!out){out=E('p','ds-card ds-card--tight final-score');host.insertBefore(out,host.firstChild)}out.textContent=mk(cards)}
  host.textContent='';
  if(k==='p1')return p1(host,d,{E:E,bi:bi,card:card,expl:expl,mark:mark,okText:okText,checkBtn:checkBtn,picker:picker,navBar:navBar,section:section,prompt:prompt,saved:saved,save:save});
  if(k==='p2')return p2(host,d,keys,{E:E,bi:bi,card:card,expl:expl,mark:mark,checkBtn:checkBtn,picker:picker,navBar:navBar,section:section,prompt:prompt,saved:saved,save:save,field:field,choices:choices});
  var p3=k==='p3';
  var cur=0,total=d.sections.length,held=d.sections.reduce(function(n,s){return n+s.items.filter(function(q){return q.held}).length},0);
  var noteTxt=p3?DS.t('التصحيح متاح لـ395 سجلًا. 44 سؤالًا ملتبسًا و18 كتابة مفتوحة للمراجعة مع المدرس، خارج الدرجة. إجابات القراءة تُقبل بصيغ متعددة؛ الصياغة غير المعروفة تُحال للمراجعة بدل احتسابها خطأ.','Grading is available for 395 records. 44 unclear questions and 18 open writing tasks are for teacher review and do not count. Reading answers accept several wordings; an unknown wording goes to review instead of counting as wrong.'):
    DS.t(NOTE[k]+held+' سؤالًا موقوفًا لعدم وضوح الإجابة، والكتابة والأسئلة المكتوبة للقراءة تُراجع مع المدرس. اختيار القراءة يُصحح آليًا.',NOTE_EN[k]+held+' questions are held because the answer is unclear. Writing and the written reading questions are reviewed with the teacher. Reading choices are graded automatically.');
  var note=E('p','ds-sub final-note',noteTxt);
  var labels=d.sections.map(function(s,i){return (i+1)+' · '+s.instruction+' · '+s.items.length});
  var pk=picker(labels,0,function(i){cur=i;show()});
  var prog=E('p','ds-sub fin-prog'),content=E('div'),nav=navBar(function(){cur=Math.max(0,cur-1);show();pk.el.scrollIntoView({block:'center'})},function(){cur=Math.min(total-1,cur+1);show();pk.el.scrollIntoView({block:'center'})});
  nav.status.style.display='none';
  host.appendChild(note);host.appendChild(pk.el);var stk=E('div','fin-sticky');stk.appendChild(prog);stk.appendChild(nav.el);host.appendChild(stk);host.appendChild(content);
  function updScore(){var cards=[].slice.call(content.querySelectorAll('[data-gradable]')),all=[].slice.call(content.querySelectorAll('.fin-q')),c=cards.filter(function(x){return x.dataset.grade==='correct'}).length,w=cards.filter(function(x){return x.dataset.grade==='incorrect'}).length,rv=all.filter(function(x){return x.dataset.grade==='review'}).length;
    score(cards,function(){return p3?DS.t('نتيجة القسم الحالي: '+DS.num(c)+' صحيحة من '+DS.num(c+w)+' مصححة · '+DS.num(rv)+' تحتاج مراجعة. المهام المفتوحة والأسئلة غير المؤكدة لا تدخل في الدرجة.','Current section: '+c+' correct of '+(c+w)+' graded · '+rv+' need review. Open tasks and unconfirmed questions do not count.'):DS.t('نتيجة القسم الحالي: '+DS.num(c)+' صحيحة من '+DS.num(c+w)+' مصححة · '+DS.num(cards.length)+' سؤالًا أو مجموعة قابلة للتصحيح. الأسئلة الموقوفة والكتابة لا تدخل في الدرجة.','Current section: '+c+' correct of '+(c+w)+' graded · '+cards.length+' gradable questions or groups. Held questions and writing do not count.')})}
  var CONCEPTS={'P3:s1:i0':[['tala'],['help|helps|helping','homework'],['helpful|helpul','funny']],'P3:s1:i2':[['sunday'],['camels|camel','horses|horse']],'P3:s1:i3':[['first','football|soccer','match|game'],['team','won|win']],'P3:s1:i4':[['garden'],['hurt|pain|painful|injured']]};
  function acceptReading(v,ex,id,kk){var n=nrm(v);if(!n)return false;if(n===nrm(ex))return true;var rules=(CONCEPTS[id]||[])[kk];if(!rules)return null;if(/\b(?:not|never|no|didn|wasn|isn|doesn|don)\b/.test(n))return null;var ws=n.split(' ');return rules.every(function(r){return r.split('|').some(function(w){return ws.indexOf(w)>-1})})?true:null}
  function grading(c,q,s,type){ /* family p4..prep3 */
    if(q.held||q.grading_mode!=='checked')return;c.dataset.gradable='true';
    checkBtn(c,function(){var vals=q.options?[(function(){var v=c.querySelector('input:checked');return v?q.options[Number(v.value)]:''})()]:[].map.call(c.querySelectorAll('input:not([type=radio]):not([type=checkbox]),textarea'),function(n){return n.value});
      var ex=Array.isArray(q.answer)?q.answer:[q.answer],empty=vals.length!==ex.length||vals.some(function(v){return !String(v).trim()});
      function cands(a,i){return (q.accept_blanks&&q.accept_blanks[i])?[a].concat(q.accept_blanks[i]):(i===0&&q.accept?[a].concat(q.accept):[a])}
      var exact=!empty&&ex.every(function(a,i){return cands(a,i).some(function(v){return (type==='punctuate'?strict:nrm)(vals[i])===(type==='punctuate'?strict:nrm)(v)})});
      var form=!empty&&!exact&&type==='punctuate'&&ex.every(function(a,i){return cands(a,i).some(function(v){return esAnswerContent(v)===esAnswerContent(vals[i])})});
      var ok=exact||form;c.dataset.grade=empty?'empty':ok?'correct':'incorrect';
      if(empty)mark(c,null,DS.t('اكتب كل الإجابات أولًا.','Write every answer first.'));else if(form)mark(c,true,DS.t('المعنى صحيح. راجع الحروف الكبيرة والترقيم: ','The meaning is right. Check capital letters and punctuation: ')+ex.join(' / '));else if(ok)mark(c,true,okText());else mark(c,false,DS.t('راجع إجابتك وحاول مرة أخرى.','Check your answer and try again.'));updScore()})}
  function grading3(c,q,s){
    if(q.grading_mode!=='checked'){if(!q.held&&q.grading_reason)c.appendChild(E('p','ds-sub final-note',q.grading_reason));return}
    c.dataset.gradable='true';var a=q.answer,multiple=Array.isArray(a)||(a&&typeof a==='object'),arr=Array.isArray(a)?a:(a&&typeof a==='object'?Object.keys(a).map(function(x){return a[x]}):[a]);
    if(multiple&&!q.questions&&!q.items&&!q.lines){[].forEach.call(c.querySelectorAll('.fin-field'),function(n){n.remove()});arr.forEach(function(v,kk){c.appendChild(field(q.item_id+':'+kk,false,'الإجابة '+(kk+1)+' / Answer '+(kk+1)))})}
    checkBtn(c,function(){var vals;if(q.options){var ch=c.querySelector('input:checked');vals=[ch?q.options[Number(ch.value)]:'']}else if(s.section_index===6){var bl=c.querySelector('.final-built');vals=[(c.querySelector('input[type=text]')||{}).value||(bl?bl.textContent:'')]}else vals=[].map.call(c.querySelectorAll('input:not([type=radio]):not([type=checkbox]),textarea'),function(n){return n.value});
      var unc=false,form=false,ok=arr.every(function(exp,kk){var v=vals[kk]||'';
        if(s.section_index===1&&q.questions&&q.questions[kk].indexOf('\u2026')<0){var r=acceptReading(v,exp,q.item_id,kk);if(r===null)unc=true;return r===true}
        if(s.section_index===8){var exact=v.trim().replace(/\s+/g,' ')===String(exp).trim().replace(/\s+/g,' '),cont=esAnswerContent(v)===esAnswerContent(exp);if(!exact&&cont)form=true;return exact||cont}
        if(s.section_index===9){var want=nrm(exp),got=nrm(v),miss=String(q.text).match(/_+/),blank='';if(miss){var bits=String(q.text).split(/_+/).map(nrm),pre=bits[0],suf=bits[1]||'';if(want.indexOf(pre)===0&&(!suf||want.slice(want.length-suf.length)===suf))blank=want.slice(pre.length,suf?want.length-suf.length:undefined)}return got===want||got===blank}
        return nrm(v)===nrm(exp)});
      var empty=vals.some(function(v){return !String(v).trim()});c.dataset.grade=empty?'empty':ok?'correct':unc?'review':'incorrect';
      if(empty)mark(c,null,DS.t('اكتب كل الإجابات أولًا.','Write every answer first.'));else if(ok&&form)mark(c,true,DS.t('المعنى صحيح. راجع الحروف الكبيرة والترقيم: ','The meaning is right. Check capital letters and punctuation: ')+arr.join(' / '));else if(ok)mark(c,true,okText());else if(unc)mark(c,null,DS.t('صياغتك تحتاج مراجعة المدرس. لم تُحسب خطأ.','Your wording needs teacher review. It was not counted as wrong.'));else mark(c,false,DS.t('راجع إجابتك وحاول مرة أخرى.','Check your answer and try again.'));updScore()})}
  function tokens(id,text){var wrap=E('div','final-tokens'),row=E('div','q-words'),res=E('p','built final-built',saved[id]||'');
    text.split(/\s+-\s+|\s*\/\s*/).forEach(function(w){var b=E('button','ds-word wchip',w,{type:'button'});b.addEventListener('click',function(){res.textContent=(res.textContent+' '+w).trim();save(id,res.textContent)});row.appendChild(b)});
    var cl=E('button','ds-btn ds-btn--soft',null,{type:'button'});cl.appendChild(bi('امسح / Clear'));cl.addEventListener('click',function(){res.textContent='';save(id,'')});wrap.appendChild(row);wrap.appendChild(res);wrap.appendChild(cl);wrap.appendChild(field(id+':typed'));return wrap}
  function item(q,s,i){
    var c=card(q,i);
    if(q.held){c.dataset.held='true';c.appendChild(E('p','ds-sub final-note',p3?DS.t('يحتاج مراجعة المدرس. لا توجد إجابة مؤكدة لهذا السؤال.','Needs teacher review. There is no confirmed answer for this question.'):DS.t(q.grading_reason||'السؤال يحتاج مراجعة المدرس لأن إجابته غير مؤكدة. خارج الدرجة.','This question needs teacher review because its answer is not confirmed. It does not count.')))}
    if(p3&&q.illustration_note)c.appendChild(E('p','ds-sub final-note',q.illustration_note));
    if(q.passage)c.appendChild(E('div','q-passage ds-passage',q.passage,{dir:'ltr'}));
    if(p3&&q.image)c.appendChild(E('img','final-picture',null,{src:q.image,alt:'Original booklet picture',loading:'lazy'}));
    if(q.wordbank)c.appendChild(E('p','final-wordbank ds-ltr',q.wordbank.join(' · ')));
    if(q.keywords)c.appendChild(E('p','final-wordbank ds-ltr',q.keywords.join(' · ')));
    if(q.parts){var pp=E('p','q-text final-prompt',null,{dir:'ltr'});q.parts.forEach(function(part,kk){pp.appendChild(kk===1?E('u',null,part):D.createTextNode(part))});c.appendChild(pp)}
    else if(q.question||q.text||q.title)prompt(c,q.question||q.text||q.title);
    if(!p3&&q.lines)q.lines.forEach(function(line,kk){prompt(c,(kk+1)+'. '+line)});
    if(p3&&q.pronunciation_audio){c.appendChild(E('p','ds-sub final-note',DS.t('تسجيل تعليمي جديد، مش تسجيل الكتاب الأصلي.','A new teaching recording, not the original book recording.')));c.appendChild(E('audio','fin-audio',null,{controls:'',preload:'none',src:q.pronunciation_audio,'aria-label':'Listen to the word'}))}
    else if(p3&&s.section_index===9)c.appendChild(E('p','ds-sub final-note',DS.t('سؤال استماع بدون تسجيل أو كلمة مؤكدة. لا تخمّن الإجابة.','A listening question with no recording or confirmed word. Do not guess the answer.')));
    if(!p3&&s.type==='reading_mcq'){
      q.mcq.forEach(function(m,kk){var part=E('div','final-reading-mcq ds-stack');part.dataset.readingMcq=kk;prompt(part,m.question);part.appendChild(choices(q.item_id+':mcq:'+kk,m.options));
        if(m.held||!m.answer){part.dataset.held='true';part.appendChild(E('p','ds-sub final-note',DS.t(m.grading_reason||'السؤال يحتاج مراجعة المدرس ولا يدخل في الدرجة.','This question needs teacher review and does not count.')))}else{part.appendChild(E('div','fin-sub'));var qq={},z;for(z in m)qq[z]=m[z];qq.grading_mode='checked';var pr=part;grading(pr,qq,s,'mcq')}
        c.appendChild(part)});
      c.appendChild(E('p','ds-sub final-note',DS.t('الإجابات المكتوبة تُراجع مع المدرس ولا تدخل في الدرجة.','Written answers are reviewed with the teacher and do not count.')));
      q.questions.forEach(function(t,kk){prompt(c,t);c.appendChild(field(q.item_id+':written:'+kk,true))})}
    else if(q.options)c.appendChild(choices(q.item_id,q.options));
    else if(q.questions||(p3&&(q.items))||(p3&&q.lines))(q.questions||q.items||q.lines).forEach(function(t,kk){prompt(c,t);c.appendChild(field(q.item_id+':'+kk))});
    else if(p3&&s.section_index===6)c.appendChild(tokens(q.item_id,q.text));
    else if(!p3&&Array.isArray(q.answer))q.answer.forEach(function(a,kk){c.appendChild(field(q.item_id+':'+kk,false,'الفراغ '+(kk+1)+' / Blank '+(kk+1)))});
    else if(!p3||s.section_index!==9||q.pronunciation_audio)c.appendChild(field(q.item_id,['paragraphs','qlines','passage_write'].indexOf(s.type)>-1&&!(k==='p6'&&s.type==='qlines')&&!(k==='p3'&&s.type==='qlines')));
    if(s.type==='paragraphs'){c.appendChild(E('p','ds-sub final-note',DS.t((q.min_words?'اكتب على الأقل '+q.min_words+' كلمة. ':'')+(q.grading_reason||''),(q.min_words?'Write at least '+q.min_words+' words. ':'')+(q.grading_reason||''))));
      var cnt=E('p','ds-sub final-word-count'),inp=c.querySelector('textarea');function rf(){cnt.textContent=DS.t('عدد الكلمات: ','Word count: ')+DS.num(inp.value.trim().split(/\s+/).filter(Boolean).length)}inp.addEventListener('input',rf);rf();c.appendChild(cnt)}
    else if(p3)grading3(c,q,s);else grading(c,q,s,s.type);
    expl(c,q);return c}
  function show(){var s=d.sections[cur],old=host.querySelector('.final-score');if(old)old.remove();host.dataset.section=cur;
    prog.textContent=DS.t('القسم '+DS.num(cur+1)+' من '+DS.num(total)+' · '+DS.num(s.items.length)+' سجلًا'+(p3?' · تصحيح للأسئلة ذات الإجابات المؤكدة':''),'Section '+(cur+1)+' of '+total+' · '+s.items.length+' records'+(p3?' · grading for questions with confirmed answers':''));
    content.textContent='';content.className='ds-stack';content.appendChild(E('h2',null,s.instruction,{dir:'ltr'}));var g=section();content.appendChild(g);s.items.forEach(function(q,i){g.appendChild(item(q,s,i))});
    nav.prev.disabled=cur===0;nav.next.disabled=cur===total-1;pk.sel.value=cur;if(pk.sel._ds&&pk.sel._ds.sync)pk.sel._ds.sync();updScore();if(DS.select)DS.select.enhance(content)}
  if(DS.select)DS.select.enhance(host);show();host.dataset.ready='true';
}

/* ---------- p1: look/write, missing sound, reorder, unscramble ---------- */
function p1(host,d,u){
  var E=u.E,bi=u.bi,saved=u.saved,save=u.save,cur=0,page=0;
  var sections=d.sections,n=sections.reduce(function(a,s){return a+s.items.length},0);
  var normalize=function(s){return esAnswerText(s).trim().toLowerCase().replace(/\s+/g,' ')},sentence=function(s){return normalize(s).replace(/[.,!?;:\u2019']/g,'').replace(/\s+/g,' ')};
  var note=E('p','ds-sub final-note',DS.t('متاح الآن: '+n+' سؤالًا من المذكرة النهائية. بقية الأسئلة قيد المراجعة والإضافة.','Available now: '+n+' questions from the final booklet. More questions are being reviewed.'));
  var pk=u.picker(sections.map(function(s,i){return DS.t(s.instruction_ar,s.instruction)}),0,function(i){cur=i;page=0;show()});
  var nav=u.navBar(function(){page--;show()},function(){page++;show()}),grid=E('div','p1-final-grid ds-grid sa-body');
  host.appendChild(note);host.appendChild(pk.el);host.appendChild(nav.el);host.appendChild(grid);
  function show(){var s=sections[cur],data=s.items,pages=Math.ceil(data.length/6);nav.status.textContent=(page+1)+' / '+pages;nav.prev.disabled=page===0;nav.next.disabled=(page+1)*6>=data.length;grid.textContent='';
    data.slice(page*6,page*6+6).forEach(function(q,idx){
      var c=u.card(q,page*6+idx,null);c.querySelector('.num').textContent=String(q.source_number);c.dataset.itemId=q.item_id;
      var img=E('img','final-picture',null,{alt:DS.t('صورة السؤال '+q.source_number,'Picture cue '+q.source_number),width:180,height:118});if(q.image)img.src=q.image;else img.hidden=true;c.appendChild(img);
      u.prompt(c,q.question);
      var t=s.type,lab=t==='reorder'?['اكتب الجملة بعد ترتيب الكلمات','Write the reordered sentence']:t==='missing-sound'?['اكتب الحرف الناقص فقط','Write only the missing letter']:t==='unscramble'?['رتّب الحروف واكتب الكلمة','Unscramble and write']:['انظر إلى الصورة واكتب الكلمة','Look and write'];
      var w=E('label','ds-field fin-field'),cap=E('span','fin-cap',DS.t(lab[0],lab[1]));w.appendChild(cap);var inp=E('input','q-input',null,{type:'text',autocomplete:'off',spellcheck:'false',dir:'ltr','aria-label':cap.textContent});if(t==='missing-sound'){inp.maxLength=1;inp.autocapitalize='none'}inp.value=saved[q.item_id]||'';
      inp.addEventListener('input',function(){save(q.item_id,inp.value);c.removeAttribute('data-grade');u.mark(c,null,'')});w.appendChild(inp);c.appendChild(w);
      u.checkBtn(c,function(){var v=normalize(inp.value),ok=t==='reorder'?(q.accept||[q.answer]).some(function(x){return sentence(x)===sentence(v)}):(q.accept||[q.answer]).some(function(a){return normalize(a)===v});c.dataset.grade=!v?'empty':ok?'correct':'incorrect';
        if(!v)u.mark(c,null,DS.t('اكتب إجابتك أولًا.','Write your answer first.'));else if(ok)u.mark(c,true,u.okText());else u.mark(c,false,t==='reorder'?DS.t('راجع ترتيب الكلمات وحاول مرة أخرى.','Check the word order, then try again.'):DS.t('راجع الحروف والصورة وحاول مرة أخرى.','Check the letters and the picture, then try again.'))},'تحقق / Check');
      var en=DS.lang()==='en'?(t==='reorder'?'Arrange the given words: '+q.answer:t==='missing-sound'?'Write '+q.answer+' in the blank to make '+q.completed_word+'.':t==='lookwrite'?'The picture shows '+q.answer+'.':(function(){var m=/^رتّب الحروف لتكوّن (.+)،\s*ومعناها (.+)\.$/.exec(q.explanation_ar||'');return m?'Order the letters to form '+m[1]+', meaning '+m[2]+'.':'The letters make '+q.answer+'.'})()):null;
      u.expl(c,en?{explanation_ar:en,explanation_en:en}:q);grid.appendChild(c)});
    pk.sel.value=cur;if(pk.sel._ds&&pk.sel._ds.sync)pk.sel._ds.sync();if(DS.select)DS.select.enhance(host)}
  if(DS.select)DS.select.enhance(host);show();host.dataset.ready='true';
}

/* ---------- p2: booklet with verified answer keys ---------- */
function p2(host,d,keys,u){
  var E=u.E,bi=u.bi,saved=u.saved,save=u.save,field=u.field,choices=u.choices,cur=0;
  var canVerify=function(q){var k=keys[q.item_id];return !q.answerability_hold&&!q.listening_excluded&&k&&['verified','partial'].indexOf(k.status)>-1};
  var title=function(s){return s.items.some(function(q){return q.pronunciation_audio})?'Listen & complete':s.instruction};
  host.appendChild(E('p','ds-sub final-note',DS.t('إجاباتك محفوظة على هذا الجهاز فقط. اضغط تحقق للأسئلة ذات الإجابات الموثقة. الأسئلة الأخرى تحتاج مراجعة المدرس.','Responses stay on this device. Verify is available for source-checked answers; other questions need teacher review.')));var rs=E('button','ds-btn ds-btn--soft',DS.t('امسح إجاباتي المحفوظة','Clear my saved answers'),{type:'button'});rs.addEventListener('click',function(){if(!confirm(DS.t('تمسح كل إجاباتك المحفوظة في المراجعة دي؟','Clear all your saved answers in this review?')))return;Object.keys(saved).forEach(function(x){delete saved[x]});try{localStorage.removeItem(KEYS.p2)}catch(e){}show()});host.appendChild(rs);
  var lbl=E('p','fin-cap',DS.t('اختار قسم المذكرة','Choose a booklet section'));host.appendChild(lbl);
  var pk=u.picker(d.sections.map(function(s,i){return (i+1)+' · '+title(s)+' · '+s.items.filter(canVerify).length+'/'+s.items.length}),0,function(i){cur=i;show()});host.appendChild(pk.el);
  var bar=DS.ui.progress(0),bw=E('div');bw.innerHTML=bar;host.appendChild(bw.firstChild);var meter=host.lastChild;meter.setAttribute('aria-label',DS.t('موضع قسم المراجعة','Review section position'));
  var prog=E('p','ds-sub',''),nav=u.navBar(function(){cur=Math.max(0,cur-1);show();pk.el.scrollIntoView({block:'center'})},function(){cur=Math.min(d.sections.length-1,cur+1);show();pk.el.scrollIntoView({block:'center'})});nav.status.style.display='none';
  var stk=E('div','fin-sticky');stk.appendChild(prog);stk.appendChild(nav.el);host.appendChild(stk);var content=E('div','ds-stack');host.appendChild(content);
  function pic(src){return E('img','final-picture',null,{src:src,alt:'Question picture',loading:'lazy'})}
  function verify(c,q,s){
    if(q.answerability_hold||q.listening_excluded)return;var kk=keys[q.item_id],active=kk&&['verified','partial'].indexOf(kk.status)>-1;
    var b=E('button','ds-btn q-check final-verify',active?DS.t('تحقق','Verify'):DS.t('راجع مع المدرس','Teacher review'),{type:'button'}),fb=E('p','ds-feedback final-feedback',null,{role:'status','aria-live':'polite'});
    b.addEventListener('click',function(){
      if(!active){u.mark(c,null,DS.t('لا توجد إجابة موثقة لهذا السؤال بعد. إجابتك محفوظة، راجعها مع المدرس.','No verified answer yet for this question. Your response is saved, review it with the teacher.'));return}
      var fields=kk.blanks||[{answers:kk.accepted_answers}];
      var checks=fields.map(function(f,i){var id=kk.blanks?q.item_id+':'+i:q.item_id,v=saved[id]!=null?saved[id]:'';
        if(s.type==='reorder'&&s.instruction.indexOf('Reorder')===0&&String(saved[id+':typed']||'').trim())v=saved[id+':typed'];
        if(s.instruction.indexOf('True or')>-1)v=v==='0'?'True':v==='1'?'False':v;
        else if(s.instruction.indexOf('circle')>-1||s.instruction==='Choose the correct answer:'){var sel=c.querySelector('input[type=radio]:checked');if(sel)v=sel.parentElement.textContent.trim()}
        var answers=f.answers||[];if(f.status==='hold'||!answers.length)return {hold:true};if(!String(v).trim())return {empty:true};
        var pn=s.instruction.indexOf('Punctuate')===0,nm=function(x){var t=(pn?String(x):esContr(esAnswerText(x))).normalize('NFKC').replace(/[\u2019\u2018]/g,"'").trim().replace(/\s+/g,' ').replace(/\s+([.!?,;:])/g,'$1');if(!pn)t=t.toLowerCase().replace(/[.!?]+$/,'');if(s.instruction.indexOf('True or')>-1)t={t:'true',f:'false'}[t]||t;return t};
        var exact=answers.some(function(a){return nm(a)===nm(v)}),form=pn&&!exact&&answers.some(function(a){return esAnswerContent(a)===esAnswerContent(v)});return {ok:exact||form,formIssue:form,answers:answers}});
      if(checks.some(function(x){return x.empty})){u.mark(c,null,DS.t('اكتب إجابتك الأول.','Enter your response first.'));return}
      var known=checks.filter(function(x){return !x.hold}),ok=known.every(function(x){return x.ok}),partial=checks.some(function(x){return x.hold}),form=known.some(function(x){return x.formIssue});
      var msg=form?DS.t('المعنى صحيح. راجع الحروف الكبيرة والترقيم مع النموذج.','Content correct. Check capitalization and punctuation against the model.'):ok?(partial?DS.t('الإجابات الموثقة صحيحة. باقي الفراغات تحتاج مراجعة المدرس.','Verified blanks are correct. The remaining blanks need teacher review.'):DS.t('إجابة صحيحة.','Correct.')):DS.t('راجع إجابتك وحاول تاني.','Check your response and try again.');
      var more=null;if(!ok||form)more=' '+DS.t('الإجابة الموثقة: ','Verified answer: ')+known.map(function(x,i){return (kk.blanks?(i+1)+': ':'')+x.answers.join(' / ')}).join(' · ');
      if(known.length)u.mark(c,ok,msg,more);else u.mark(c,null,msg,more)});
    c.addEventListener('input',function(){u.mark(c,null,'')});c.addEventListener('change',function(){u.mark(c,null,'')});
    if(window.ESWrittenAI&&s.type!=='punctuate'&&c.querySelector('textarea,input:not([type=radio]):not([type=checkbox])')){var ctx={question:q.text||q.title||s.instruction,passage:q.passage,alternatives:(kk&&kk.accepted_answers)||[],answer:function(){return [].map.call(c.querySelectorAll('textarea,input:not([type=radio]):not([type=checkbox])'),function(x){return x.value}).join(' ')}};
      if(s.type==='piclines'&&!/unscramble|reorder|rearrange|punctuate|correct|rewrite|complete|circle|count/i.test(s.instruction||'')&&!/\(|_{2}|\.{4}|…|[–—-]/.test(String(q.text||''))){ctx.onCount=function(){if(!active)return false;u.mark(c,true,DS.t('اتحسبت صحيحة بعد مراجعة الذكاء الاصطناعي.','Counted correct after AI review.'));return true};ctx.onUncount=function(){u.mark(c,null,'')}}
      window.ESWrittenAI.attach(c,ctx)}
    c.appendChild(b);var fb2=E('p','ds-feedback final-grade-result',null,{'aria-live':'polite'});c.appendChild(fb2);u.expl(c,q)}
  function tokensP2(id,text){var wrap=E('div','final-tokens ds-stack'),words=text.split(/\s*\/\s*|\s+-\s+/).filter(Boolean);if(words.length<2)return field(id,false);
    var ans=E('p','built final-built',saved[id]||''),row=E('div','q-words');words.forEach(function(w){var b=E('button','ds-word wchip',w,{type:'button'});b.addEventListener('click',function(){ans.textContent=(ans.textContent+' '+w).trim();save(id,ans.textContent)});row.appendChild(b)});
    var cl=E('button','ds-btn ds-btn--soft',DS.t('امسح','Clear'),{type:'button'});cl.addEventListener('click',function(){ans.textContent='';save(id,'')});wrap.appendChild(row);wrap.appendChild(ans);wrap.appendChild(cl);wrap.appendChild(field(id+':typed',false,'أو اكتب الترتيب بنفسك / Or type your order'));return wrap}
  function render(q,s,i){
    var c=u.card(q,i,null);
    if(q.answerability_hold){c.dataset.held='true';c.appendChild(E('p','final-hold-title',DS.t('السؤال متوقف مؤقتًا','This question is paused for now')));c.appendChild(E('p','ds-sub final-note',q.answerability_hold));verify(c,q,s);return c}
    if(q.illustration_note)c.appendChild(E('p','ds-sub final-note',q.illustration_note));
    if(q.response_lines){u.prompt(c,q.text);q.response_lines.forEach(function(t,j){c.appendChild(E('p',null,t));c.appendChild(field(q.item_id+':'+j,false))});verify(c,q,s);return c}
    if(q.image)c.appendChild(pic(q.image));
    if(q.pronunciation_audio){u.prompt(c,q.text);c.appendChild(E('p','ds-sub final-audio-note',DS.t('صورة وصوت نطق للتدريب، وليسا صورة أو تسجيل الكتاب الأصلي. انظر واسمع ثم اكتب الحرف الناقص.','A picture and a pronunciation sound for practice, not the picture or recording of the original book. Look and listen, then write the missing letter.')));
      c.appendChild(E('audio','fin-audio',null,{controls:'',preload:'none',src:q.pronunciation_audio,'aria-label':DS.t('تشغيل نطق الكلمة','Play word pronunciation')}));c.appendChild(field(q.item_id,false,'الحرف الناقص / Missing letter'));verify(c,q,s);return c}
    if(q.listening_excluded){c.appendChild(E('p',null,q.text));c.appendChild(E('p','ds-sub final-listening',DS.t('هذا السؤال يعتمد على الاستماع. الصوت غير مرفق هنا، لذلك لن يُطلب منك تخمين إجابة مكتوبة.','This question depends on listening. The audio is not attached here, so you will not be asked to guess a written answer.')));verify(c,q,s);return c}
    if(q.images){var row=E('div','final-image-grid');q.images.forEach(function(im,j){var f=E('figure');f.appendChild(pic(im));f.appendChild(E('figcaption',null,String(j+1)));row.appendChild(f)});c.appendChild(row);
      q.sentences.forEach(function(t,j){var l=E('fieldset','final-match'),lg=E('legend','q-text',t),r2=E('div','final-number-options');l.appendChild(lg);l.appendChild(r2);
        q.images.forEach(function(_,jj){var b=E('button','ds-btn ds-btn--soft',String(jj+1),{type:'button'}),key=q.item_id+':'+j;b.setAttribute('aria-pressed',String(saved[key])===String(jj+1)?'true':'false');b.addEventListener('click',function(){save(key,String(jj+1));[].forEach.call(r2.children,function(x,m){x.setAttribute('aria-pressed',m===jj?'true':'false')})});r2.appendChild(b)});c.appendChild(l)});verify(c,q,s);return c}
    if(q.wordbank){c.appendChild(E('p','final-wordbank ds-ltr',q.wordbank.join(' · ')));q.lines.forEach(function(t,j){c.appendChild(E('p',null,t));c.appendChild(field(q.item_id+':'+j,false))});verify(c,q,s);return c}
    if(keys[q.item_id]&&keys[q.item_id].blanks){u.prompt(c,q.text);keys[q.item_id].blanks.forEach(function(_,j){c.appendChild(field(q.item_id+':'+j,false,'الفراغ '+(j+1)+' / Blank '+(j+1)))});if(saved[q.item_id])c.appendChild(E('p','ds-sub final-note',DS.t('إجابتك السابقة محفوظة: ','Previous saved response: ')+saved[q.item_id]));verify(c,q,s);return c}
    var text=q.scrambled!=null?q.scrambled:q.text!=null?q.text:q.title!=null?q.title:'';u.prompt(c,text);
    if(q.keywords&&q.keywords.length)c.appendChild(E('p','final-wordbank ds-ltr',q.keywords.join(' · ')));
    if(s.type==='reorder'&&s.instruction.indexOf('Reorder')===0)c.appendChild(tokensP2(q.item_id,text));
    else if(s.instruction.indexOf('True or')>-1)c.appendChild(choices(q.item_id,['True','False'],'اختار إجابتك / Choose your response'));
    else if(s.instruction.indexOf('circle')>-1||s.instruction==='Choose the correct answer:'){var m=text.match(/\(([^()]+)\)/),opts=m&&m[1].split(/\s*[\u2013\u2014]\s*|\s+-\s+|\s*\/\s*/).filter(Boolean);c.appendChild(opts&&opts.length>1?choices(q.item_id,opts,'اختار إجابتك / Choose your response'):field(q.item_id,false))}
    else c.appendChild(field(q.item_id,s.type==='paragraphs'||s.instruction.indexOf('sentence')>-1));
    verify(c,q,s);return c}
  function show(){var s=d.sections[cur],tot=d.sections.length;meter.setAttribute('aria-valuenow',String(Math.round((cur+1)/tot*100)));meter.firstChild.style.width=(cur+1)/tot*100+'%';host.dataset.section=cur;
    var n=s.items.filter(canVerify).length;prog.textContent=DS.t('القسم '+DS.num(cur+1)+' من '+DS.num(tot)+' · '+DS.num(s.items.length)+' سجلًا · '+DS.num(n)+' متاح للتحقق · '+DS.num(s.items.length-n)+' مراجعة المدرس','Section '+(cur+1)+' of '+tot+' · '+s.items.length+' items · '+n+' checks available · '+(s.items.length-n)+' teacher review');
    content.textContent='';content.appendChild(E('h2',null,s.instruction,{dir:'ltr'}));var g=E('div','final-section-items ds-grid sa-body');content.appendChild(g);s.items.forEach(function(q,i){g.appendChild(render(q,s,i))});
    nav.prev.disabled=cur===0;nav.next.disabled=cur===tot-1;pk.sel.value=cur;if(pk.sel._ds&&pk.sel._ds.sync)pk.sel._ds.sync();if(DS.select)DS.select.enhance(content)}
  if(DS.select)DS.select.enhance(host);show();host.dataset.ready='true';
}
})();
