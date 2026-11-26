/* ENGLISH SAVANT · native "جرّب التدريب" check for explain-p1-u* steps. Route #/explain-check/:unit/:id
   Grading logic is ported unchanged from p1-explanation-check.js (norm, join, option order, accept lists). */
(function(){'use strict';
var BASE=new URL(window.ES_LEGACY_BASE||'../',location.href).href,h=DS.esc;
function abs(u){try{return new URL(u,BASE).href}catch(e){return u}}
function eat(v){return String(v).replace(/[0-9#*]\uFE0F?\u20E3/g,' ').replace(/[\u{1F000}-\u{1FAFF}\u2600-\u27BF\u{1F1E6}-\u{1F1FF}]/gu,' ').replace(/[\u200D\uFE0E\uFE0F]/g,'').normalize('NFKC')}
function norm(x){return eat(x).normalize('NFKC').replace(/[\u2019\u2018]/g,"'").trim().toLowerCase().replace(/\s+/g,' ').replace(/\s+([.!?,])/g,'$1').replace(/[.!?\u060c]+$/,'')}
function join(xs,letters){return letters?xs.join(''):xs.join(' ').replace(/\s+([.!?,])/g,'$1')}
function optionOrder(q){var seed=2166136261;for(var k=0;k<q.id.length;k++)seed=Math.imul(seed^q.id.charCodeAt(k),16777619)>>>0;var xs=q.options.slice();for(var i=xs.length-1;i>0;i--){seed=Math.imul(seed,1664525)+1013904223>>>0;var j=seed%(i+1);var t=xs[i];xs[i]=xs[j];xs[j]=t}return xs}
function mount(unit,id){
  var root=document.getElementById('chk');if(!root)return;
  fetch(abs('lesson-assessment-p1-u'+unit+'.json'),{cache:'no-store'}).then(function(r){if(!r.ok)throw Error('b');return r.json()}).then(function(data){
    var q=data.filter(function(x){return x.id===id})[0];if(!q)throw Error('u');
    var en=DS.lang()==='en',prompt=en&&q.prompt_en?q.prompt_en:q.prompt;
    var o='<article class="ds-q" data-item-id="'+h(q.id)+'">';
    if(q.passage)o+='<div class="ds-passage ds-ltr" dir="ltr">'+h(q.passage)+'</div>';
    o+='<h3 dir="auto">'+h(prompt)+'</h3>';
    if(q.image)o+='<img class="ex-img" src="'+h(abs(q.image))+'" alt="'+h(q.alt||'')+'">';
    o+='<div class="ex-ctrl ds-ltr" dir="ltr">';
    var tokens=[],selected,inputs=[],source=null;
    if(q.type==='dialogue'){
      q.dialogue.forEach(function(t){o+='<div class="ex-turn"><strong>'+h(t.speaker)+': </strong>'+t.text.split(/\{(\d+)\}/g).map(function(p,n){return n%2?'<input class="ex-in" type="text" autocomplete="off" aria-label="Blank '+h(p)+'" data-blank="'+h(p)+'">':h(p)}).join('')+'</div>'});
    }else if(q.type==='reorder'||q.type==='unscramble'){
      source=q.type==='reorder'?q.words:q.letters;
      o+='<p class="ds-letters ex-res" aria-live="polite"></p><div class="ds-chips ex-bank">'+source.map(function(w,i){return '<button type="button" class="ds-chip ex-tok" data-token="'+i+'">'+h(w)+'</button>'}).join('')+'</div><button type="button" class="ds-btn ds-btn--soft ex-undo">'+DS.t('ارجع خطوة','Undo a step')+'</button>';
    }else if(q.type==='tf'||q.type==='mcq'){
      o+='<div class="ds-opts">'+(q.type==='tf'?['True','False']:optionOrder(q)).map(function(x){return '<button type="button" class="ds-opt" aria-pressed="false" data-v="'+h(x)+'"><span>'+h(x)+'</span></button>'}).join('')+'</div>';
    }else{o+='<label class="ds-field"><input class="ex-in" type="text" autocomplete="off" aria-label="Your answer"></label>'}
    o+='</div><button type="button" class="ds-btn ex-check">'+DS.t('تحقق','Check')+'</button><div class="ex-feed" aria-live="polite"></div>';
    o+='<button type="button" class="ds-btn ds-btn--soft ex-retry">'+DS.t('حاول تاني','Try again')+'</button></article>';
    root.innerHTML=o;
    var card=root.querySelector('.ds-q'),feed=card.querySelector('.ex-feed'),check=card.querySelector('.ex-check');
    inputs=[].slice.call(card.querySelectorAll('input'));
    if(q.type==='dialogue'){var mp={};inputs.forEach(function(i){mp[+i.dataset.blank]=i});inputs=q.blanks.map(function(b){return mp[b.n]})}
    function upd(){var r=card.querySelector('.ex-res');r.textContent=join(tokens.map(function(i){return source[i]}),q.type==='unscramble');[].forEach.call(card.querySelectorAll('.ex-tok'),function(b,i){b.disabled=tokens.indexOf(i)>-1})}
    [].forEach.call(card.querySelectorAll('.ex-tok'),function(b){b.onclick=function(){tokens.push(+b.dataset.token);upd()}});
    var un=card.querySelector('.ex-undo');if(un)un.onclick=function(){tokens.pop();upd()};
    [].forEach.call(card.querySelectorAll('.ds-opt'),function(b){b.onclick=function(){selected=b.dataset.v;[].forEach.call(card.querySelectorAll('.ds-opt'),function(x){x.setAttribute('aria-pressed',x===b?'true':'false')})}});
    check.onclick=function(){
      var isTok=q.type==='reorder'||q.type==='unscramble';
      if(inputs.some(function(i){return !i.value.trim()})||(isTok?tokens.length!==source.length:(!inputs.length&&selected===undefined))){feed.innerHTML='<p class="ds-sub">'+DS.t('جاوب على كل الفراغات أو رتّب كل الكلمات والحروف الأول.','Answer every blank or arrange all the words and letters first.')+'</p>';return}
      var ok,fields;
      if(q.type==='dialogue'){fields=q.blanks.map(function(b,i){return b.accept.some(function(a){return norm(a)===norm(inputs[i].value)})});ok=fields.every(Boolean)}
      else if(isTok)ok=q.accept.some(function(a){return norm(a)===norm(join(tokens.map(function(i){return source[i]}),q.type==='unscramble'))});
      else if(inputs.length)ok=q.accept.some(function(a){return norm(a)===norm(inputs[0].value)});
      else ok=selected===q.answer;
      check.disabled=true;[].forEach.call(card.querySelectorAll('button,input'),function(e){if(!e.classList.contains('ex-retry'))e.disabled=true});
      var f='<div class="ds-feedback '+(ok?'ok':'bad')+'">'+DS.icon(ok?'check':'close')+'<span>'+(ok?DS.t('أحسنت، إجابة صحيحة','Well done, correct answer'):DS.t('راجع الإجابة','Check your answer'))+'</span>';
      if(fields)fields.forEach(function(k,i){inputs[i].classList.add(k?'ok':'no');if(!k)f+='<p>'+DS.t('فراغ ','Blank ')+h(q.blanks[i].n)+': '+h(q.blanks[i].accept[0])+'</p>'});
      else if(!ok)f+='<p class="ds-ltr" dir="ltr">'+DS.t('الإجابة الصحيحة: ','Correct answer: ')+h(q.answer)+'</p>';
      f+='</div><p class="ex-p" dir="auto">'+h(q.explanation_ar)+'</p>';feed.innerHTML=f;
      card.querySelector('.ex-retry').style.display='inline-flex';
    };
    card.querySelector('.ex-retry').onclick=function(){mount(unit,id)};
    window.__P1={unit:+unit,lesson:q.lesson,index:0,item:q};document.body.dataset.checkReady='1';
  }).catch(function(){root.innerHTML=DS.ui.empty('التقييم ده لسه في المراجعة، ومش متاح للحل دلوقتي.','This check is still being reviewed and is not available yet.')});
}
DS.route('/explain-check/:unit/:id',function(ctx){
  DS.tab('grades');DS.title('جرّب التدريب','Try the exercise');
  var back='#/explain/explain-p1-u'+ctx.params.unit;
  setTimeout(function(){mount(ctx.params.unit,ctx.params.id)},0);
  return DS.ui.crumbs([['#/','الرئيسية','Home'],[back,'شرح دروس الوحدة '+ctx.params.unit,'Unit '+ctx.params.unit+' lessons explained'],['','جرّب التدريب','Try the exercise']])+DS.ui.back(back,'رجوع للشرح','Back to the explanation')+'<div id="chk" class="ds-stack ex-chk">'+DS.ui.skeleton(1)+'</div>';
});
})();
