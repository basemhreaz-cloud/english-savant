/* WebView 83: keep standalone scripts safe before native replaceChildren support. */
(function(){if(typeof Element!=='undefined'&&!Element.prototype.replaceChildren){Object.defineProperty(Element.prototype,'replaceChildren',{configurable:true,writable:true,value:function(){var fragment=this.ownerDocument.createDocumentFragment();for(var i=0;i<arguments.length;i++)fragment.append(arguments[i]);while(this.firstChild)this.removeChild(this.firstChild);this.appendChild(fragment);}});}})();
(function(){
const quizLayout=document.createElement('style');quizLayout.textContent=`
#quiz-body .q-opts{display:grid;grid-template-columns:minmax(0,1fr);gap:8px;align-items:stretch;justify-items:stretch}
#quiz-body .q-opts>.opt{box-sizing:border-box;width:100%;min-width:0;max-width:100%;margin:0;justify-self:stretch;animation:none!important;transform:none!important}
#quiz-body .q-feed{box-sizing:border-box;margin:12px 0;padding:8px 10px;line-height:1.75;animation:none!important;transform:none!important;overflow-wrap:anywhere}
#quiz-body .q-feed .corr{display:block;margin-top:4px}
`;document.head.append(quizLayout);

const resultIcon=ok=>{const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('width','24');svg.setAttribute('height','24');svg.setAttribute('aria-hidden','true');svg.style.verticalAlign='middle';const path=document.createElementNS(ns,'path');path.setAttribute('d',ok?'M5 12l4 4L19 6':'M6 6l12 12M18 6L6 18');path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');path.setAttribute('stroke-width','2.5');path.setAttribute('stroke-linecap','round');svg.append(path);return svg};
var gs=document.body.dataset.grade;
var LABELS={choose:'اختر الإجابة الصحيحة',sound:'اختر الصوت الناقص',form:'اكتب التصريف الصحيح',cloze:'أكمل الفراغ من الكلمات',unscramble:'رتّب الحروف واكتب الكلمة',reorder:'رتّب الكلمات وكوّن الجملة',tf:'صح أم غلط',typein:'اكتب الإجابة',mcq:'اختر الإجابة الصحيحة'};
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function norm(t){return String(t).trim().toLowerCase().replace(/\s+/g,' ').replace(/[.?!،]+$/,'')}
var total=0,done=0,score=0,progress={},progressKey='es-grade-quiz-v1-'+gs,restoring=false;
function persist(){if(restoring)return;try{localStorage.setItem(progressKey,JSON.stringify(progress))}catch{}}
function remember(card){if(restoring)return;const r=progress.answers[card.dataset.index]||{};r.values=[...card.querySelectorAll('input,select')].map(x=>x.value);r.tokens=[...card.querySelectorAll('.built .wchip')].map(x=>x.dataset.token);progress.answers[card.dataset.index]=r;persist()}

function updateBar(){
  document.getElementById('qprogress').textContent='سؤال '+done+' من '+total;
  document.getElementById('qbarfill').style.width=(total?(done/total*100):0)+'%';
  if(done===total&&total>0){
    var d=document.getElementById('quiz-done');d.classList.add('show');
    document.getElementById('done-score').textContent=score+' / '+total;
    var p=score/total,m;
    if(p===1)m='علامة كاملة! مستوى رائع 🌟';else if(p>=.8)m='ممتاز! قريب جدًا من العلامة الكاملة.';else if(p>=.5)m='كويس، راجع الغلط وحاول تاني.';else m='محتاج مراجعة، اتفرج على الدروس وجرب تاني.';
    document.getElementById('done-msg').textContent=m;
    d.scrollIntoView({behavior:'smooth',block:'center'});
  }
}
function feed(card,ok,corr){
  var f=card.querySelector('.q-feed');if(!restoring){remember(card);const record=progress.answers[card.dataset.index];record.ok=ok;record.corr=corr;record.chosen=card.dataset.chosen;persist()}card.dataset.result=ok?'correct':'incorrect';
  f.className='q-feed '+(ok?'ok':'no');
  f.innerHTML=ok?'أحسنت، إجابة صحيحة':'راجع الإجابة <span class="corr">الإجابة الصحيحة: '+esc(corr)+'</span>';
  card.querySelector('.q-state').dataset.fxHandled='true';card.querySelector('.q-state').replaceChildren(resultIcon(ok));if(!restoring)window.ESFeedback?.(ok,card);
  done++; if(ok)score++; updateBar();
}
function passage(q){return q.passage?'<div class="q-passage" dir="ltr">'+esc(q.passage)+'</div>':''}
function buildMcq(card,q,i){
  var h=passage(q)+'<div class="q-text" dir="ltr">'+esc(q.q)+'</div><div class="q-opts" dir="ltr">';
  q.options.forEach(function(o,j){h+='<button class="opt" data-j="'+j+'">'+esc(o)+'</button>'});
  card.innerHTML+=h+'</div>';
  card.querySelectorAll('.opt').forEach(function(b){b.addEventListener('click',function(){
    card.querySelectorAll('.opt').forEach(function(x){x.disabled=true});
    card.dataset.chosen=b.dataset.j;var j=+b.dataset.j,ok=j===q.answer;
    b.classList.add(ok?'ok':'no');
    if(!ok)card.querySelectorAll('.opt')[q.answer].classList.add('ok');
    feed(card,ok,q.options[q.answer]);
  })});
}
function buildTf(card,q){
  var h=passage(q)+'<div class="q-text" dir="ltr">'+esc(q.q)+'</div><div class="q-opts"><button class="opt" data-v="1">صح ✓</button><button class="opt" data-v="0">غلط ✗</button></div>';
  card.innerHTML+=h;
  card.querySelectorAll('.opt').forEach(function(b){b.addEventListener('click',function(){
    card.querySelectorAll('.opt').forEach(function(x){x.disabled=true});
    card.dataset.chosen=b.dataset.v;var ok=(b.dataset.v==='1')===q.answer;
    b.classList.add(ok?'ok':'no');
    if(!ok)card.querySelector('.opt[data-v="'+(q.answer?'1':'0')+'"]').classList.add('ok');
    feed(card,ok,q.answer?'صح':'غلط');
  })});
}
function buildTypein(card,q,placeholder){
  var extra=q.letters?'<div class="q-text" dir="ltr"><span class="q-letters">'+esc(q.letters)+'</span></div>':'<div class="q-text" dir="ltr">'+esc(q.q)+'</div>';
  card.innerHTML+=passage(q)+extra+'<div class="q-inline" dir="ltr"><input class="q-input" type="text" placeholder="'+(placeholder||'')+'" autocapitalize="off" autocomplete="off" spellcheck="false"/><button class="q-check">تحقق</button></div>';
  var inp=card.querySelector('.q-input'),btn=card.querySelector('.q-check');
  function go(){
    if(!inp.value.trim())return;
    var ok=q.answer.some(function(a){return norm(a)===norm(inp.value)});
    inp.classList.add(ok?'ok':'no');inp.disabled=true;btn.disabled=true;
    feed(card,ok,q.answer[0]);
  }
  btn.addEventListener('click',go);
  inp.addEventListener('keydown',function(e){if(e.key==='Enter')go()});
}
function buildCloze(card,q){
  var h=passage(q)+'<div class="q-text cloze-line" dir="ltr">';
  q.segments.forEach(function(seg,i){
    h+=esc(seg);
    if(i<q.answers.length){
      h+='<select data-i="'+i+'"><option value="">…</option>'+q.bank.map(function(b){return '<option>'+esc(b)+'</option>'}).join('')+'</select>';
    }
  });
  card.innerHTML+=h+'</div><div class="q-inline"><button class="q-check">تحقق</button></div>';
  var btn=card.querySelector('.q-check');
  btn.addEventListener('click',function(){
    var sels=[...card.querySelectorAll('select')];
    if(sels.some(function(s){return !s.value})) { card.querySelector('.q-feed').className='q-feed no'; card.querySelector('.q-feed').textContent='كمل كل الفراغات الأول.'; return; }
    btn.disabled=true;var allOk=true,wrong=[];
    sels.forEach(function(s){
      var ok=s.value===q.answers[+s.dataset.i];
      s.classList.add(ok?'ok':'no');s.disabled=true;
      if(!ok){allOk=false;wrong.push(q.answers[+s.dataset.i])}
    });
    feed(card,allOk,wrong.join(' · '));
  });
}
function buildReorder(card,q){
  var h=passage(q)+'<div class="q-words" dir="ltr">';
  q.words.forEach(function(w,i){h+='<button class="wchip" data-w="'+esc(w)+'">'+esc(w)+'</button>'});
  card.innerHTML+=h+'</div><div class="built" dir="ltr"></div><div class="q-inline"><button class="q-check">تحقق</button></div>';
  var pool=card.querySelector('.q-words'),built=card.querySelector('.built'),btn=card.querySelector('.q-check');
  pool.addEventListener('click',function(e){var b=e.target.closest('.wchip');if(b)built.appendChild(b)});
  built.addEventListener('click',function(e){var b=e.target.closest('.wchip');if(b)pool.appendChild(b)});
  btn.addEventListener('click',function(){
    var got=[...built.querySelectorAll('.wchip')].map(function(b){return b.dataset.w});
    if(got.length!==q.answer.length){card.querySelector('.q-feed').className='q-feed no';card.querySelector('.q-feed').textContent='استخدم كل الكلمات.';return}
    var ok=q.answer.every(function(w,i){return got[i]===w});
    btn.disabled=true;card.querySelectorAll('.wchip').forEach(x=>x.disabled=true);built.style.borderStyle='solid';
    feed(card,ok,q.answer.join(' '));
  });
}
fetch('quiz-'+gs+'.json').then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){
  var _qt=document.getElementById('quiz-title'); if(_qt)_qt.textContent='اختبر نفسك — '+d.gradeName+'.';
  var _qs=document.getElementById('quiz-sub'); if(_qs)_qs.textContent=d.examTitle+' · من امتحانات مستر باسم، والتصحيح فوري بعد كل سؤال.';
  document.title='اختبر نفسك — '+d.gradeName+' | ENGLISH SAVANT';
  var fingerprint=JSON.stringify(d.questions);try{progress=JSON.parse(localStorage.getItem(progressKey))||{}}catch{}if(progress.fingerprint!==fingerprint||!progress.answers)progress={fingerprint,answers:{}};var body=document.getElementById('quiz-body');body.innerHTML='';
  total=d.questions.length;updateBar();
  d.questions.forEach(function(q,i){
    var card=document.createElement('div');card.className='q-card';card.dataset.index=i;
    var label=LABELS[q.label||q.type]||LABELS[q.type]||'';
    card.innerHTML='<div class="q-head"><span class="q-num">'+(i+1)+'</span><span class="q-label">'+label+'</span><span class="q-state"></span></div><div class="q-feed"></div>';
    body.appendChild(card);
    if(q.type==='mcq')buildMcq(card,q,i);
    else if(q.type==='tf')buildTf(card,q);
    else if(q.type==='typein')buildTypein(card,q,'اكتب هنا…');
    else if(q.type==='unscramble')buildTypein(card,q,'الكلمة الصح…');
    else if(q.type==='cloze')buildCloze(card,q);
    else if(q.type==='reorder')buildReorder(card,q);
card.querySelectorAll('input').forEach((x,k)=>x.setAttribute('aria-label','إجابتك '+(k+1)));
card.querySelectorAll('select').forEach((x,k)=>x.setAttribute('aria-label','الفراغ '+(k+1)));
card.querySelector('.q-feed').setAttribute('role','status');
card.querySelectorAll('.q-words .wchip').forEach((x,k)=>x.dataset.token=k);
card.addEventListener('input',()=>remember(card));card.addEventListener('change',()=>remember(card));card.addEventListener('click',()=>remember(card));
const old=progress.answers[i];if(old){restoring=true;
card.querySelectorAll('input,select').forEach((x,k)=>x.value=old.values?.[k]||'');
for(const token of old.tokens||[]){const b=[...card.querySelectorAll('.wchip')].find(x=>x.dataset.token===token);if(b)card.querySelector('.built').append(b)}
if(typeof old.ok==='boolean'){
card.dataset.chosen=old.chosen??'';
if(q.type==='mcq'||q.type==='tf'){const attr=q.type==='mcq'?'j':'v',answer=q.type==='mcq'?String(q.answer):(q.answer?'1':'0');card.querySelectorAll('.opt').forEach(x=>{if(x.dataset[attr]===String(old.chosen))x.classList.add(old.ok?'ok':'no');if(!old.ok&&x.dataset[attr]===answer)x.classList.add('ok')})}
else if(q.type==='cloze')card.querySelectorAll('select').forEach((x,k)=>x.classList.add(x.value===q.answers[k]?'ok':'no'));
else card.querySelector('input')?.classList.add(old.ok?'ok':'no');
card.querySelectorAll('input,select,button').forEach(x=>x.disabled=true);feed(card,old.ok,old.corr)
}restoring=false}

  });
  document.getElementById('quiz-retry').addEventListener('click',function(){localStorage.removeItem(progressKey);location.reload()});
const review=document.createElement('button');review.className='q-check';review.textContent='راجع الإجابات غير الصحيحة';review.onclick=()=>{const wrong=[...body.querySelectorAll('.q-card[data-result=incorrect]')];if(!wrong.length){review.textContent='لا توجد إجابات غير صحيحة حتى الآن';return}body.querySelectorAll('.q-card').forEach(c=>c.hidden=c.dataset.result!=='incorrect');wrong[0].scrollIntoView({block:'center',behavior:'instant'})};document.getElementById('quiz-done').append(review);
const showAll=document.createElement('button');showAll.className='q-check';showAll.textContent='اعرض كل الأسئلة';showAll.onclick=()=>body.querySelectorAll('.q-card').forEach(c=>c.hidden=false);document.getElementById('quiz-done').append(showAll);

}).catch(function(){
  document.getElementById('quiz-body').innerHTML='<div class="lesson-empty">الاختبار ده لسه مش جاهز. جرب صفحة تانية من <a href="grades.html">الصفوف التعليمية</a>.</div>';
});
})();
