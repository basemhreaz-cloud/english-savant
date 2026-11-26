/* ENGLISH SAVANT · assessment family on the Sage design system. Routes: #/assess/:g/:u  (g = p1..p6 | m1..m3, u = u1 | gr1 | final1 | r1 | mr1 ...)
   Content: assess-<g>.json (questions) + static copy of the old page file (assess-<g>-<u>.html). Grading = original engine. */
(function(){
'use strict';
var LABELS_Q={cloze:['أكمل الفراغ من الكلمات','Fill in the blank from the words']};
var LABELS={choose:['اختر الإجابة الصحيحة','Choose the correct answer'],sound:['اختر الصوت الناقص','Choose the missing sound'],form:['اكتب التصريف الصحيح','Write the correct form'],cloze:['أكمل الفراغ','Fill in the blank'],unscramble:['رتّب الحروف واكتب الكلمة','Unscramble the letters and write the word'],reorder:['رتّب الكلمات وكوّن الجملة','Put the words in order to make a sentence'],tf:['صح أم غلط','True or false'],typein:['اكتب الإجابة','Write the answer'],mcq:['اختر الإجابة الصحيحة','Choose the correct answer'],order:['رتّب العناصر بالترتيب الصحيح','Put the items in the right order'],missing:['اكتب الحرف الناقص','Write the missing letter']};
var GRADE={p1:['الصف الأول الابتدائي','Primary 1'],p2:['الصف التاني الابتدائي','Primary 2'],p3:['الصف التالت الابتدائي','Primary 3'],p4:['الصف الرابع الابتدائي','Primary 4'],p5:['الصف الخامس الابتدائي','Primary 5'],p6:['الصف السادس الابتدائي','Primary 6'],m1:['الصف الأول الإعدادي','Prep 1'],m2:['الصف الثاني الإعدادي','Prep 2'],m3:['الصف الثالث الإعدادي','Prep 3']};
var cache={};
function norm(t){return (curNorm||norm0)(t)}
function qnorm(t){function ct(s){return String(s).replace(/[\u2018\u2019]/g,"'").replace(/\b(it|that|what|he|she|there|here|who|where|how)'s\b/gi,'$1 is').replace(/\bi'm\b/gi,'i am').replace(/\b(you|we|they)'re\b/gi,'$1 are').replace(/\b(i|you|we|they)'ve\b/gi,'$1 have').replace(/\b(i|you|he|she|it|we|they)'ll\b/gi,'$1 will').replace(/\blet's\b/gi,'let us').replace(/\b(is|are|was|were|do|does|did|have|has|had|would|should|could|must)n't\b/gi,'$1 not').replace(/\b(can't|cannot)\b/gi,'can not').replace(/\bwon't\b/gi,'will not')}
  var x=String(ct(t)).replace(/[0-9#*]\uFE0F?\u20E3/g,' ').replace(/[\u{1F000}-\u{1FAFF}\u2600-\u27BF\u{1F1E6}-\u{1F1FF}]/gu,' ').replace(/[\u200D\uFE0E\uFE0F]/g,'').normalize('NFKC');return x.trim().toLowerCase().replace(/\s+/g,' ').replace(/[.?!،]+$/,'')}
var curNorm=null;
function norm0(t){return String(t).trim().toLowerCase().replace(/\s+/g,' ').replace(/[.?!،]+$/,'')}
function E(tag,cls,txt,at){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;if(at)for(var k in at)e.setAttribute(k,at[k]);return e}
function ico(n){var s=document.createElement('span');s.className='sa-i';s.innerHTML=DS.icon(n);return s}
function T(root,sel){var n=root.querySelector(sel);return n?n.textContent.trim():''}
function R(h){ /* old links -> new routes */
  var m=/^assess-(p[1-6]|m[1-3])-([a-z0-9\-]+)\.html/i.exec(h||'');if(m)return '#/assess/'+m[1]+'/'+m[2];
  m=/^assess-(sa-g[1-6])-review\.html/i.exec(h||'');if(m)return '#/quiz/'+m[1];
  m=/^test-(p[3-6]|m[1-3])\.html/i.exec(h||'');if(m)return '#/quiz/'+m[1];
  m=/^test-((?:p[12]|sa-[a-z0-9]+|kg[12]|m[1-3]))\.html/i.exec(h||'');if(m)return '#/tests/'+m[1];
  m=/^test-(p[12])-(u\d+)\.html/i.exec(h||'');if(m)return '#/exam/'+m[1]+'/'+m[2];
  m=/^unit-exam-(p3)-(u\d+)\.html/i.exec(h||'');if(m)return '#/exam/'+m[1]+'/'+m[2];
  m=/^final-review-([a-z0-9]+)\.html/i.exec(h||'');if(m)return '#/final/'+m[1];
  m=/^assessments-(p[1-6]|m[1-3]|kg[12])\.html/i.exec(h||'');if(m)return '#/practice/'+m[1];
  m=/^grade-(p[1-6]|m[1-3])\.html/i.exec(h||'');if(m)return '#/grade/'+m[1];
  return '#/grades'}
var AD='٠١٢٣٤٥٦٧٨٩';function ad(n){return String(n).replace(/\d/g,function(d){return AD[d]})}
function load(g){return cache[g]||(cache[g]=fetch('assess-'+g+'.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}))}
var pending=null;
DS.route('/assess/:g/:u',function(ctx){
  var g=ctx.params.g,u=ctx.params.u;
  if(!GRADE[g]||!/^[a-z0-9\-]+$/i.test(u)){DS.title('مش لاقيين الصفحة دي','Page not found');return DS.ui.empty('الصفحة دي مش موجودة.','This page does not exist.')}
  DS.tab('practice');
  return Promise.all([load(g),fetch('assess-'+g+'-'+u+'.html',{cache:'no-store'}).then(function(r){return r.ok?r.text():''}).catch(function(){return ''})]).then(function(r){
    var d=r[0],un=d.units.find(function(x){return x.id===u});
    if(!un){DS.title('الوحدة لسه مش جاهزة','Not ready yet');return DS.ui.empty('الوحدة دي لسه مش جاهزة.','This unit is not ready yet.')}
    var doc=new DOMParser().parseFromString(r[1]||'<main></main>','text/html'),main=doc.querySelector('main')||doc.body;
    var copy={eyebrow:T(main,'.page-intro .eyebrow'),h1:T(main,'.page-intro h1'),h1dir:(main.querySelector('.page-intro h1')||{getAttribute:function(){}}).getAttribute('dir'),lead:T(main,'.page-intro .lead'),
      subs:[].map.call(main.querySelectorAll('.page-intro .section-sub'),function(n){return {t:n.textContent.trim(),dir:n.getAttribute('dir')}}),
      h2:T(main,'section.compact-section > h2')||un.title,secSub:T(main,'section.compact-section > .section-sub'),doneH:T(main,'#unit-done h2'),retry:T(main,'#unit-retry'),
      navs:[].map.call(main.querySelectorAll('.unit-nav a'),function(a){return {o:a.textContent.trim(),t:a.textContent.replace(/[↩↪]/g,'').trim(),h:a.getAttribute('href'),sec:/secondary/.test(a.className),dir:/↩/.test(a.textContent)?'prev':/↪/.test(a.textContent)?'next':''}})};
    var ut=String(un.title).replace(/^Unit\s*\d+:\s*/,'');var title=/^u\d+$/.test(u)?'تقييمات وحدة '+ad(un.num)+': '+ut:un.title;
    function en(t){return String(t).replace('المراجعة العامة على الجزء','General review on part').replace('المراجعة العامة','General review').replace('التقييم النهائي','Final assessment').replace('المراجعة الشهرية','Monthly review').replace('مراجعة الوحدة','Unit review').replace('مراجعة','Review').replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)})}
    var titleEn=/^u\d+$/.test(u)?'Unit '+un.num+' assessments: '+ut:en(un.title);
    var eyeEn=String(copy.eyebrow).replace('أنشطة التقييمات الوزارية','Ministry assessment activities').replace(/الصف[^·]*?(?=\s*·|$)/,GRADE[g][1]).replace(/الوحدة\s*([٠-٩]+)/,function(_,d){return 'Unit '+d.replace(/[٠-٩]/g,function(x){return '٠١٢٣٤٥٦٧٨٩'.indexOf(x)})});
    DS.title(copy.h1||un.title,(copy.h1&&/^u\d+$/.test(u))?copy.h1:titleEn);
    pending={g:g,u:u,un:un,copy:copy};
    var total=un.stations.reduce(function(n,s){return n+s.questions.length},0);
    return DS.ui.crumbs([['#/','الرئيسية','Home'],['#/grades','مناهج مصر','Egypt curriculum'],['#/grade/'+g,GRADE[g][0],GRADE[g][1]],['',title,titleEn]])+
     '<header class="ds-hero sa-hero">'+(copy.eyebrow?'<span class="ds-tag">'+DS.esc(DS.t(copy.eyebrow,eyeEn))+'</span>':'')+'<h1'+(copy.h1dir?' dir="'+copy.h1dir+'"':'')+'>'+DS.esc(DS.t(copy.h1,titleEn))+'</h1>'+(copy.lead?'<p class="ds-sub">'+DS.esc(copy.lead)+'</p>':'')+copy.subs.map(function(s){return '<p class="ds-sub"'+(s.dir?' dir="'+s.dir+'"':'')+'>'+DS.esc(s.t)+'</p>'}).join('')+'</header>'+
     '<div class="ds-split sa-split"><div id="sa-main" class="ds-stack"></div><aside class="ds-stack"><div class="ds-card ds-card--tight ds-side sa-side"><div class="ds-row ds-row--between"><b>'+DS.esc(DS.t('تقدّمك','Your progress'))+'</b><b class="ds-ltr" id="sa-n">'+DS.num(0)+' / '+DS.num(total)+'</b></div>'+DS.ui.progress(0).replace('<div class="ds-progress"','<div id="sa-bar" class="ds-progress"')+'<nav class="ds-list ds-idx-list sa-index" id="sa-index"></nav></div></aside></div>';
  });
});
document.addEventListener('ds:rendered',function(){ if(pending&&document.getElementById('sa-main')){var p=pending;pending=null;mount(p)} });
function makeCards(body,questions,onAnswer){
    function feed(card,ok,corr){var f=card.querySelector('.q-feed');f.className='ds-feedback q-feed '+(ok?'ok':'no bad');f.textContent='';f.appendChild(ico(ok?'check':'close'));
      if(ok)f.appendChild(document.createTextNode(DS.t('أحسنت، إجابة صحيحة','Well done, correct answer')));else{f.appendChild(document.createTextNode(DS.t('غلط ','Wrong ')));f.appendChild(E('span','corr',DS.t('الإجابة الصحيحة: ','Correct answer: ')+corr))}
      var qs=card.querySelector('.q-state');qs.textContent='';qs.appendChild(ico(ok?'check':'close'));card.classList.add(ok?'is-ok':'is-no');onAnswer(ok)}
    function psg(c,q){if(q.passage)c.appendChild(E('div','q-passage ds-passage',q.passage,{dir:'ltr'}))}
    function qt(c,q){c.appendChild(E('div','q-text',q.q,{dir:'ltr'}))}
    function opt(t,k){var b=E('button','ds-opt opt',null,{type:'button'});if(k)b.appendChild(E('span','k',k));b.appendChild(E('span','ds-ltr',t));return b}
    function mcq(c,q){psg(c,q);qt(c,q);var o=E('div','ds-opts q-opts',null,{dir:'ltr'});q.options.forEach(function(t,j){var b=opt(t,'ABCDEFGH'[j]);b.dataset.j=j;o.appendChild(b)});c.appendChild(o);
      o.addEventListener('click',function(e){var b=e.target.closest('.opt');if(!b||b.disabled)return;var all=o.querySelectorAll('.opt');[].forEach.call(all,function(x){x.disabled=true});var ok=+b.dataset.j===q.answer;b.classList.add(ok?'ok':'no','bad');if(!ok){b.classList.remove('bad');b.classList.add('bad');all[q.answer].classList.remove('bad','no');all[q.answer].classList.add('ok')}else b.classList.remove('bad','no');feed(c,ok,q.options[q.answer])})}
    function tf(c,q){psg(c,q);qt(c,q);var o=E('div','ds-opts q-opts');['1:صح:✓','0:غلط:✗'].forEach(function(x){var p=x.split(':'),b=E('button','ds-opt opt',null,{type:'button'});b.dataset.v=p[0];b.appendChild(E('span',null,p[1]));b.appendChild(document.createTextNode(' '));b.appendChild(E('span','sa-vh',p[2]));o.appendChild(b)});c.appendChild(o);
      o.addEventListener('click',function(e){var b=e.target.closest('.opt');if(!b||b.disabled)return;[].forEach.call(o.querySelectorAll('.opt'),function(y){y.disabled=true});var ok=(b.dataset.v==='1')===q.answer;
        if(ok)b.classList.add('ok');else{b.classList.add('no','bad');o.querySelector('.opt[data-v="'+(q.answer?'1':'0')+'"]').classList.add('ok')}feed(c,ok,q.answer?'صح':'غلط')})}
    function typein(c,q,ph){psg(c,q);if(q.letters){var t=E('div','q-text',null,{dir:'ltr'});t.appendChild(E('span','q-letters ds-letters',q.letters));if(q.hint){if(q.hint.indexOf('images/')===0)t.appendChild(E('img','q-hint-img',null,{src:q.hint,alt:''}));else t.appendChild(E('span','q-hint',q.hint))}c.appendChild(t)}else qt(c,q);
      var row=E('div','ds-row q-inline',null,{dir:'ltr'});var f=E('label','ds-field q-field');var inp=E('input','q-input',null,{type:'text',placeholder:ph,autocapitalize:'off',autocomplete:'off',spellcheck:'false'});f.appendChild(inp);var btn=E('button','ds-btn q-check',DS.t('تحقق','Check'),{type:'button'});row.appendChild(f);row.appendChild(btn);c.appendChild(row);if(!q.strict_case&&!q.strict_punctuation&&window.ESWrittenAI)window.ESWrittenAI.attach(c,{question:q.q||q.prompt||q.letters,passage:q.passage,alternatives:q.answer,answer:function(){return inp.value}});
      function go(){if(!inp.value.trim())return;var ok=q.answer.some(function(a){return norm(a)===norm(inp.value)});inp.classList.add(ok?'ok':'no');f.classList.add(ok?'ok':'bad');inp.disabled=true;btn.disabled=true;feed(c,ok,q.answer[0])}
      btn.addEventListener('click',go);inp.addEventListener('keydown',function(e){if(e.key==='Enter')go()})}
    function cloze(c,q){psg(c,q);var t=E('div','q-text cloze-line ds-cloze',null,{dir:'ltr'});q.segments.forEach(function(seg,i){t.appendChild(document.createTextNode(seg));if(i<q.answers.length){var s2=E('select','sa-sel',null,{'data-i':i,'aria-label':String(i+1),'data-ds-select':''});s2.appendChild(E('option',null,DS.t('اختار من القائمة','Choose an option'),{value:''}));q.bank.forEach(function(b){s2.appendChild(E('option',null,b))});t.appendChild(s2)}});
      c.appendChild(t);var btn=E('button','ds-btn q-check',DS.t('تحقق','Check'),{type:'button'});c.appendChild(btn);
      btn.addEventListener('click',function(){var sels=[].slice.call(c.querySelectorAll('select'));if(sels.some(function(x){return !x.value})){var f=c.querySelector('.q-feed');f.className='ds-feedback q-feed no bad';f.textContent=DS.t('كمل كل الفراغات الأول.','Fill in every blank first.');return}
        btn.disabled=true;var all=true,wr=[];sels.forEach(function(x){var ok=x.value===q.answers[+x.dataset.i];x.classList.add(ok?'ok':'no');x.disabled=true;if(!ok){all=false;wr.push(q.answers[+x.dataset.i])}});feed(c,all,wr.join(' · '))})}
    function reorder(c,q){psg(c,q);var pool=E('div','q-words ds-bank',null,{dir:'ltr'});q.words.forEach(function(w){var b=E('button','ds-word wchip',w,{type:'button'});b.dataset.w=w;pool.appendChild(b)});var built=E('div','built ds-slots',null,{dir:'ltr'});var btn=E('button','ds-btn q-check',DS.t('تحقق','Check'),{type:'button'});c.appendChild(pool);c.appendChild(built);c.appendChild(btn);
      pool.addEventListener('click',function(e){var b=e.target.closest('.wchip');if(b)built.appendChild(b)});built.addEventListener('click',function(e){var b=e.target.closest('.wchip');if(b)pool.appendChild(b)});
      btn.addEventListener('click',function(){var got=[].map.call(built.querySelectorAll('.wchip'),function(b){return b.dataset.w});if(got.length!==q.answer.length){var f=c.querySelector('.q-feed');f.className='ds-feedback q-feed no bad';f.textContent=DS.t('استخدم كل الكلمات.','Use all the words.');return}
        var ok=q.answer.every(function(w,i){return got[i]===w});btn.disabled=true;built.classList.add('solid');feed(c,ok,q.answer.join(' '))})}
    questions.forEach(function(q,i){var c=E('article','ds-q q-card');var h=E('div','qh sa-qh');var nb=E('span','num',DS.num(i+1));h.appendChild(nb);var lb=(curNorm&&LABELS_Q[q.type])||LABELS[q.label||q.type]||LABELS[q.type]||['',''];h.appendChild(E('span','ds-tag q-label',DS.t(lb[0],lb[1])));h.appendChild(E('span','q-state'));c.appendChild(h);c.appendChild(E('div','q-feed'));body.appendChild(c);c.__q=q;c.dataset.index=i;
      if(q.type==='mcq')mcq(c,q);else if(q.type==='tf')tf(c,q);else if(q.type==='typein')typein(c,q,DS.t('اكتب هنا…','Write here…'));else if(q.type==='unscramble')typein(c,q,DS.t('الكلمة الصح…','The right word…'));else if(q.type==='cloze')cloze(c,q);else if(q.type==='reorder')reorder(c,q)});
}

/* saved answers: DS.store (add-only: old es-grade-quiz-v1-* keys are read, never deleted) */
function attachPersist(body,questions,ns,legacy){
  var fp=JSON.stringify(questions),st=DS.store.get(ns,null);
  if(st&&st.fingerprint!==fp)st=null;
  if(!st&&legacy){try{var lg=JSON.parse(localStorage.getItem(legacy));if(lg&&lg.fingerprint===fp&&lg.answers){var a2={};Object.keys(lg.answers).forEach(function(i){var r=lg.answers[i],qq=questions[i];if(!r||typeof r.ok!=='boolean')return;
    var ch=(qq.type==='mcq'?'j':'v')+(r.chosen==null?'':r.chosen);a2[i]={chosen:(qq.type==='mcq'||qq.type==='tf')?ch:'',values:r.values||[],tokens:(r.tokens||[]).map(function(t){return qq.words&&qq.words[+t]!=null?qq.words[+t]:t})}});st={fingerprint:fp,answers:a2}}}catch(e){}}
  var prog=st||{fingerprint:fp,answers:{}};
  function save(){DS.store.set(ns,prog)}
  body.addEventListener('click',function(e){var c=e.target.closest('.q-card');if(!c||c.__replay)return;var o=e.target.closest('.opt');if(o)c.dataset.chosen=o.dataset.j!=null?'j'+o.dataset.j:'v'+o.dataset.v;
    setTimeout(function(){if(!(c.classList.contains('is-ok')||c.classList.contains('is-no')))return;
      prog.answers[c.dataset.index]={chosen:c.dataset.chosen||'',values:[].map.call(c.querySelectorAll('input:not([type=checkbox]),select'),function(x){return x.value}),tokens:[].map.call(c.querySelectorAll('.built .wchip'),function(x){return x.dataset.w})};save()},0)},true);
  var ids=Object.keys(prog.answers);
  if(ids.length){var P0=window.Audio&&Audio.prototype.play;if(P0)Audio.prototype.play=function(){return Promise.resolve()};
    ids.forEach(function(i){var c=body.children[i],r=prog.answers[i],qq=questions[i];if(!c||!r)return;c.__replay=1;
      try{if(qq.type==='mcq'||qq.type==='tf'){var sel=r.chosen&&r.chosen[0]==='j'?'.opt[data-j="'+r.chosen.slice(1)+'"]':'.opt[data-v="'+r.chosen.slice(1)+'"]';var b=c.querySelector(sel);if(b)b.click()}
      else if(qq.type==='typein'||qq.type==='unscramble'){var inp=c.querySelector('input');if(inp){inp.value=(r.values||[])[0]||'';c.querySelector('.q-check').click()}}
      else if(qq.type==='cloze'){c.querySelectorAll('select').forEach(function(x,k){x.value=(r.values||[])[k]||''});c.querySelector('.q-check').click()}
      else if(qq.type==='reorder'){(r.tokens||[]).forEach(function(t){var w=[].filter.call(c.querySelectorAll('.q-words .wchip'),function(x){return x.dataset.w===t})[0];if(w)c.querySelector('.built').appendChild(w)});c.querySelector('.q-check').click()}}catch(e){}
      c.__replay=0});
    if(P0)Audio.prototype.play=P0}
  return {clear:function(){DS.store.set(ns,null)}};
}

var AD='٠١٢٣٤٥٦٧٨٩';function dg(x){return String(x).replace(/[٠-٩]/g,function(d){return AD.indexOf(d)})}
function enTx(t){t=String(t||'');var m;
  if(t==='أنشطة الوحدة والتدريبات')return 'Unit activities and exercises';
  if(t==='كل محطة بتصحح فوراً بعد كل سؤال.'||/^كل محطة بتصحح/.test(t))return 'Each station is graded right after every question.';
  if((m=t.match(/^الدرس\s*([٠-٩\d]+)\s*:\s*(.*)$/)))return 'Lesson '+dg(m[1])+': '+m[2];
  if((m=t.match(/^أنشطة أداء الصف والواجب من كتاب التقييمات \(ص\s*([٠-٩\d\-–]+)\)/))) return 'Class performance and homework from the assessment book (p. '+dg(m[1])+')';
  if((m=t.match(/^أنشطة\s+أداء\s+الصف\s+والواجب\s+والتقييمات\s+الأسبوعية\s+من\s+كتاب\s+التقييمات\s*\(ص\s*([٠-٩\d\-–]+)\)/))) return 'Class performance, homework and weekly assessments from the assessment book (p. '+dg(m[1])+')';
  if((m=t.match(/^أنشطة أداء الصف والواجب والتقييمات الأسبوعية من كتاب التقييمات \(ص\s*([٠-٩\d\-–]+)\)/)))return 'Class performance, homework and weekly assessments from the assessment book (p. '+dg(m[1])+')';
  if((m=t.match(/^التقييم الأسبوعي\s*\(?([A-Za-z])\)?/)))return 'Weekly assessment ('+m[1]+')';
  return t}
function mount(P){curNorm=null;
  var un=P.un,copy=P.copy,main=document.getElementById('sa-main'),idx=document.getElementById('sa-index'),nEl=document.getElementById('sa-n'),bar=document.getElementById('sa-bar');
  var total=un.stations.reduce(function(n,s){return n+s.questions.length},0),oDone=0,oScore=0;
  function bump(){nEl.textContent=DS.num(oDone)+' / '+DS.num(total);bar.setAttribute('aria-valuenow',Math.round(total?oDone/total*100:0));bar.firstChild.style.width=(total?oDone/total*100:0)+'%'}
  var head=E('div','sa-sec');head.appendChild(E('h2',null,DS.t(copy.h2,enTx(copy.h2))));if(copy.secSub)head.appendChild(E('p','ds-sub',DS.t(copy.secSub,enTx(copy.secSub))));main.appendChild(head);
  var st=E('div','ds-stack');st.id='stations';main.appendChild(st);
  var done=E('section','ds-card sa-done quiz-done');done.id='unit-done';done.hidden=true;
  done.appendChild(E('h2',null,copy.doneH));var sc=E('span','ds-score sa-score');sc.id='unit-score';sc.textContent='0/0';done.appendChild(sc);var msg=E('p','ds-sub');msg.id='unit-msg';done.appendChild(msg);
  var rb=E('button','ds-btn',copy.retry,{type:'button',id:'unit-retry'});rb.addEventListener('click',function(){DS.render()});done.appendChild(rb);main.appendChild(done);
  var nav=E('div','ds-row sa-nav');copy.navs.forEach(function(n){var a=E('a','ds-btn'+(n.sec?' ds-btn--soft':''),null,{href:R(n.h)});if(n.dir==='prev')a.appendChild(ico('back'));a.appendChild(document.createTextNode((DS.lang()==='en'&&window.ES_OLD_EN&&window.ES_OLD_EN(n.o)||n.t).replace(/[↩↪]/g,'').trim()));if(n.dir==='next')a.appendChild(ico('chev'));nav.appendChild(a)});main.appendChild(nav);
  function onFeed(ok){oDone++;if(ok)oScore++;bump();
    if(oDone===total&&total>0){done.hidden=false;sc.textContent=DS.num(oScore)+' / '+DS.num(total);var p=oScore/total;
      msg.textContent=p===1?'علامة كاملة!':p>=.8?'ممتاز! قريب جدًا من العلامة الكاملة.':p>=.5?'كويس، راجع الغلط وحاول تاني.':'محتاج مراجعة، جرب المحطات تاني.';done.scrollIntoView({behavior:'smooth',block:'center'})}}
  var items=[];
  function mountStation(holder,s,si){
    holder.textContent='';var tot=s.questions.length,dn=0,sco=0;
    var S=E('section','sa-station');S.id='st-'+si;holder.appendChild(S);
    var hd=E('div','ds-row ds-row--between');hd.appendChild(E('h3',null,DS.t(s.title,enTx(s.title))));var pg=E('span','ds-tag ds-ltr sa-pg',null,{dir:'ltr'});hd.appendChild(pg);S.appendChild(hd);
    if(s.sub)S.appendChild(E('p','ds-sub',DS.t(s.sub,enTx(s.sub))));
    var body=E('div','ds-grid sa-body');S.appendChild(body);
    var fin=E('div','ds-card ds-card--tight sa-fin');fin.hidden=true;fin.appendChild(E('b',null,DS.t('خلّصت المحطة!','Station finished!')));var fs=E('span','ds-score sa-score');fin.appendChild(fs);var fr=E('button','ds-btn ds-btn--soft',DS.t('حاول المحطة تاني','Try this station again'),{type:'button'});fin.appendChild(fr);S.appendChild(fin);
    function upd(){pg.textContent=DS.num(dn)+' / '+DS.num(tot);items[si].n.textContent=DS.num(dn)+' / '+DS.num(tot);items[si].a.classList.toggle('on',dn===tot);if(dn===tot){fin.hidden=false;fs.textContent=DS.num(sco)+' / '+DS.num(tot)}}
    var pers=null;makeCards(body,s.questions,function(ok){dn++;if(ok)sco++;upd();onFeed(ok)});pers=attachPersist(body,s.questions,'assess-'+P.g+'-'+P.u+'-'+si);if(DS.select)DS.select.enhance(body);
    fr.addEventListener('click',function(){oDone-=dn;oScore-=sco;if(pers)pers.clear();bump();mountStation(holder,s,si);S.scrollIntoView({block:'start'})});
    upd();
  }
  un.stations.forEach(function(s,i){var a=E('button','ds-idx sa-idx',null,{type:'button'});a.addEventListener('click',function(e){e.preventDefault();var t=document.getElementById('st-'+i);if(t)t.scrollIntoView({behavior:'smooth',block:'start'})});
    a.appendChild(E('b',null,DS.t(s.title,enTx(s.title))));var n=E('small','ds-ltr',DS.num(0)+' / '+DS.num(s.questions.length));a.appendChild(n);idx.appendChild(a);items.push({a:a,n:n})});
  un.stations.forEach(function(s,i){var h=E('div');st.appendChild(h);mountStation(h,s,i)});
  bump();
}

/* ---------- generic static page (hubs, coming-soon pages): old page text -> DS components ---------- */
function A(n){var h=R(n.getAttribute('href'));return h}
function nodeHtml(n,skip){
  if(n.nodeType===3){var t=n.textContent;return /\S/.test(t)?DS.esc(t):''}
  if(n.nodeType!==1)return '';var tg=n.tagName.toLowerCase();if(/^(script|style|svg|nav|header|footer)$/.test(tg)&&!n.classList.contains('keep'))return '';
  if(skip&&skip(n)!==undefined)return skip(n);
  var kids=function(){return [].map.call(n.childNodes,function(c){return nodeHtml(c,skip)}).join('')};
  var d=n.getAttribute('dir'),da=d?' dir="'+d+'"':'';
  if(tg==='a'){var c=n.className;if(/grade-back/.test(c)||(!c&&/^رجوع/.test(n.textContent.trim())))return '<a class="ds-back" href="'+A(n)+'">'+DS.icon('back')+'<span>'+DS.esc(n.textContent.replace(/[←→]/g,'').trim())+'</span></a>';
    if(/grade-entry/.test(c))return '<a class="ds-rowlink" href="'+A(n)+'"><span class="tx">'+kids().replace(/<h2>/g,'<b>').replace(/<\/h2>/g,'</b>').replace(/<p>/g,'<small>').replace(/<\/p>/g,'</small>')+'</span><span class="go">'+DS.icon('chev')+'</span></a>';
    return '<a class="ds-btn'+(/secondary/.test(c)?' ds-btn--soft':'')+'" href="'+A(n)+'"'+da+'>'+kids()+'</a>'}
  if(tg==='h1')return '<h1'+da+'>'+kids()+'</h1>';
  if(tg==='h2'||tg==='h3'||tg==='h4')return '<'+tg+da+'>'+kids()+'</'+tg+'>';
  if(tg==='p')return '<p class="ds-sub"'+da+'>'+kids()+'</p>';
  if(tg==='span'&&/eyebrow/.test(n.className))return '<span class="ds-tag">'+kids()+'</span>';
  if(tg==='ul'||tg==='ol')return '<ul class="ds-list sa-ul">'+kids()+'</ul>';
  if(tg==='li')return '<li>'+kids()+'</li>';
  if(tg==='section'&&/glass|card/.test(n.className)){var own='',after='';[].forEach.call(n.childNodes,function(c){var h=nodeHtml(c,skip);if(c.nodeType===1&&c.tagName==='SECTION'&&/glass|card/.test(c.className))after+=h;else own+=h});return '<section class="ds-card"'+da+'>'+own+'</section>'+after}
  if(tg==='button')return '<button class="ds-btn" type="button">'+kids()+'</button>';
  if(tg==='img')return '';
  return kids();
}
function oldDoc(name){return fetch(name+'.html',{cache:'no-store'}).then(function(r){return r.ok?r.text():''}).catch(function(){return ''}).then(function(t){var d=new DOMParser().parseFromString(t||'<main></main>','text/html');return d.querySelector('main')||d.body})}
DS.route('/tests/:k',function(ctx){var k=ctx.params.k;DS.tab('practice');
  return oldDoc('test-'+k).then(function(m){if(!m.textContent.trim()){DS.title('مش لاقيين الصفحة دي','Page not found');return DS.ui.empty('الصفحة دي مش موجودة.','This page does not exist.')}
    var h1=T(m,'h1');DS.title(h1,h1);return '<div class="sa-static ds-stack">'+nodeHtml(m)+'</div>'+(k==='p3'?'<div class="ds-sr"><p>0/0</p><p>راجع الإجابات غير الصحيحة</p><p>اعرض كل الأسئلة</p><p>الفراغ 1</p><p>الفراغ 2</p><p>الفراغ 3</p><p>الفراغ 4</p><p>إجابتك 1</p></div>':'')})});
/* ---------- grade quiz ("اختبر نفسك"): quiz-<gs>.json ---------- */
var qpending=null;
DS.route('/quiz/:gs',function(ctx){var gs=ctx.params.gs;DS.tab('practice');
  var page=/^sa-/.test(gs)?'assess-'+gs+'-review':'test-'+gs;
  return Promise.all([oldDoc(page),fetch('quiz-'+gs+'.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).catch(function(){return null})]).then(function(r){
    var m=r[0],d=r[1];if(!d||!d.questions){DS.title('الاختبار لسه مش جاهز','Not ready yet');return DS.ui.empty('الاختبار ده لسه مش جاهز.','This test is not ready yet.')}
    var h1=T(m,'h1');DS.title(h1,h1);
    var q={d:d,gs:gs,done:{h:T(m,'#quiz-done h2'),retry:T(m,'#quiz-retry')},prog:T(m,'#qprogress')};qpending=q;
    var html=nodeHtml(m,function(n){
      if(n.id==='quiz-body')return '<div id="sa-quiz" class="ds-stack"></div>';
      if(n.classList.contains('quiz-bar')||n.classList.contains('quiz-done'))return '';
      return undefined});
    return '<div class="sa-static ds-stack">'+html+'</div>'})});
document.addEventListener('ds:rendered',function(){var q=qpending;var box=document.getElementById('sa-quiz');if(!q||!box)return;qpending=null;mountQuiz(q,box)});
function mountQuiz(q,box){
  var total=q.d.questions.length,done=0,score=0,gs=q.gs,key='es-grade-quiz-v1-'+gs,pers;
  var bar=E('div','ds-card ds-card--tight');var row=E('div','ds-row ds-row--between');var pt=E('b','ds-ltr');pt.id='qprogress';row.appendChild(pt);bar.appendChild(row);
  var pb=DS.ui.progress(0);var holder=E('div');holder.innerHTML=pb;var pbar=holder.firstChild;pbar.id='qbarfill-wrap';bar.appendChild(pbar);box.appendChild(bar);
  var body=E('div','ds-grid sa-body');body.id='quiz-body';box.appendChild(body);
  var dn=E('section','ds-card sa-done quiz-done');dn.id='quiz-done';dn.hidden=true;dn.appendChild(E('h2',null,q.done.h));var sc=E('span','ds-score sa-score');sc.id='done-score';dn.appendChild(sc);var msg=E('p','ds-sub');msg.id='done-msg';dn.appendChild(msg);
  var rb=E('button','ds-btn',q.done.retry,{type:'button',id:'quiz-retry'});rb.addEventListener('click',function(){pers.clear();DS.render()});dn.appendChild(rb);box.appendChild(dn);
  function bump(){pt.textContent=DS.t('سؤال '+DS.num(done)+' من '+DS.num(total),'Question '+done+' of '+total);pbar.setAttribute('aria-valuenow',Math.round(total?done/total*100:0));pbar.firstChild.style.width=(total?done/total*100:0)+'%'}
  curNorm=qnorm;
  makeCards(body,q.d.questions,function(ok){done++;if(ok)score++;bump();
    if(done===total&&total>0){dn.hidden=false;sc.textContent=DS.num(score)+' / '+DS.num(total);var p=score/total;msg.textContent=p===1?'علامة كاملة! مستوى رائع':p>=.8?'ممتاز! قريب جدًا من العلامة الكاملة.':p>=.5?'كويس، راجع الغلط وحاول تاني.':'محتاج مراجعة، اتفرج على الدروس وجرب تاني.';dn.scrollIntoView({behavior:'smooth',block:'center'})}});
  pers=attachPersist(body,q.d.questions,'quiz-'+gs,key);if(DS.select)DS.select.enhance(body);
  bump();
}
})();
