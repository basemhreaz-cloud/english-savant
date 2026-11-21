/* ENGLISH SAVANT quiz feedback: full-screen flash, emoji burst, spoken voice. No dependencies. */
(function(){
if(window.__esFx)return;window.__esFx=1;
var css='.esfx-wash{position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:3;opacity:0}'
+'.esfx-wash.ok{background:radial-gradient(circle at 50% 50%,rgba(52,211,99,.38),rgba(34,197,94,.14) 70%)}'
+'.esfx-wash.no{background:radial-gradient(circle at 50% 50%,rgba(248,81,73,.36),rgba(239,68,68,.13) 70%)}'
+'.esfx-wash.go{animation:esfxWash .9s ease-out forwards}'
+'@keyframes esfxWash{0%{opacity:0}20%{opacity:1}100%{opacity:0}}'
+'.esfx-big{position:fixed;z-index:99999;pointer-events:none;font-size:68px;line-height:1;filter:drop-shadow(0 6px 14px rgba(0,0,0,.3));opacity:0;transform:translate(-50%,-50%) scale(.2)}'
+'.esfx-big.go.ok{animation:esfxPop 1s cubic-bezier(.2,1.4,.4,1) forwards}'
+'.esfx-big.go.no{animation:esfxShakeBig .9s ease-out forwards}'
+'@keyframes esfxPop{0%{opacity:0;transform:translate(-50%,-50%) scale(.2) rotate(-25deg)}35%{opacity:1;transform:translate(-50%,-50%) scale(1.25) rotate(8deg)}60%{transform:translate(-50%,-50%) scale(.95) rotate(-3deg)}80%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}100%{opacity:0;transform:translate(-50%,-70%) scale(1)}}'
+'@keyframes esfxShakeBig{0%{opacity:0;transform:translate(-50%,-50%) scale(.3)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}30%{transform:translate(-62%,-50%) scale(1.05)}45%{transform:translate(-38%,-50%) scale(1.05)}60%{transform:translate(-57%,-50%) scale(1)}75%{opacity:1;transform:translate(-45%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(.9)}}'
+'.esfx-bit{position:fixed;z-index:99999;pointer-events:none;font-size:20px;line-height:1}'
+'.esfx-card-ok{animation:esfxCardOk .6s ease-out}.esfx-card-no{animation:esfxCardNo .55s ease-out}'
+'@keyframes esfxCardOk{0%{transform:scale(1)}30%{transform:scale(1.025);box-shadow:0 0 0 4px rgba(34,197,94,.55),0 0 26px rgba(34,197,94,.55)}100%{transform:scale(1)}}'
+'@keyframes esfxCardNo{0%,100%{transform:translateX(0)}15%{transform:translateX(-9px)}35%{transform:translateX(8px)}55%{transform:translateX(-6px)}75%{transform:translateX(4px);box-shadow:0 0 0 4px rgba(239,68,68,.55),0 0 24px rgba(239,68,68,.5)}}'
+'@media (prefers-reduced-motion:reduce){.esfx-big.go.ok,.esfx-big.go.no{animation:esfxFade 1s ease-out forwards}.esfx-bit{display:none}.esfx-card-ok,.esfx-card-no{animation:none}}'
+'@keyframes esfxFade{0%{opacity:0;transform:translate(-50%,-50%) scale(1)}25%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(1)}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var base=(function(){var s=document.currentScript;return s&&s.src?s.src.replace(/[^\/]*$/,''):''})();
var snd={};['ok','no'].forEach(function(k){var a=new Audio();a.preload='auto';a.src=base+'audio/'+k+'-'+(window.ES_FX_LANG||'ar')+'.mp3';a.addEventListener('error',function(){a.__bad=1});snd[k]=a});
var unlocked=false;
function unlock(){if(unlocked)return;unlocked=true;['ok','no'].forEach(function(k){var a=snd[k];a.muted=true;var p=a.play();if(p&&p.then)p.then(function(){a.pause();a.currentTime=0;a.muted=false}).catch(function(){a.muted=false})})}
['pointerdown','touchstart','keydown'].forEach(function(e){document.addEventListener(e,unlock,{once:true,passive:true,capture:true})});
function say(ok){
 var a=snd[ok?'ok':'no'];
 try{a.muted=false;a.currentTime=0;var p=a.play();if(p&&p.catch)p.catch(function(){tts(ok)});if(a.__bad)tts(ok)}catch(e){tts(ok)}
}
function tts(ok){try{if(!window.speechSynthesis)return;var u=new SpeechSynthesisUtterance(ok?'الإجابة صحيحة':'الإجابة خاطئة');u.lang='ar-EG';u.rate=.95;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
function run(ok,card){
 var big=document.createElement('div');big.className='esfx-big '+(ok?'ok':'no');big.textContent=ok?'🎉':'❌';
 var cx=innerWidth/2,cy=innerHeight/2,W=300;
 if(card){var r=card.getBoundingClientRect();
  cx=Math.min(Math.max(r.left+r.width/2,40),innerWidth-40);
  cy=Math.min(Math.max(r.top+Math.min(r.height/2,90),50),innerHeight-50);W=Math.min(r.width,360);
  if(getComputedStyle(card).position==='static')card.style.position='relative';
  var w=document.createElement('div');w.className='esfx-wash '+(ok?'ok':'no');card.appendChild(w);void w.offsetWidth;w.classList.add('go');setTimeout(function(){w.remove()},1000);
  var c=ok?'esfx-card-ok':'esfx-card-no';card.classList.remove('esfx-card-ok','esfx-card-no');void card.offsetWidth;card.classList.add(c);setTimeout(function(){card.classList.remove(c)},700)}
 big.style.left=cx+'px';big.style.top=cy+'px';document.body.appendChild(big);void big.offsetWidth;big.classList.add('go');
 setTimeout(function(){big.remove()},1100);
 if(ok&&document.body.animate&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
  var set=['🎉','✅','⭐','✨','🎊','👏'];
  for(var i=0;i<14;i++){(function(i){var b=document.createElement('div');b.className='esfx-bit';b.textContent=set[i%set.length];b.style.left=cx+'px';b.style.top=cy+'px';document.body.appendChild(b);
   var ang=Math.random()*Math.PI*2,d=W*(.25+Math.random()*.35),dx=Math.cos(ang)*d,dy=Math.sin(ang)*d*.8-30;
   var an=b.animate([{transform:'translate(-50%,-50%) scale(.3)',opacity:1},{transform:'translate(calc(-50% + '+dx+'px),calc(-50% + '+dy+'px)) scale(1.1) rotate('+(Math.random()*360-180)+'deg)',opacity:1,offset:.6},{transform:'translate(calc(-50% + '+dx+'px),calc(-50% + '+(dy+60)+'px)) scale(.8)',opacity:0}],{duration:900+Math.random()*300,easing:'cubic-bezier(.15,.8,.3,1)'});
   an.onfinish=function(){b.remove()}})(i)}
 }
 try{navigator.vibrate&&navigator.vibrate(ok?[40,30,60]:[120,60,120])}catch(e){}
 say(ok);
}
function watch(el){
 if(el.__esfx)return;el.__esfx=1;
 new MutationObserver(function(){var t=el.textContent.trim();if(t==='✅'||t==='❌'){var card=el.closest('.q-card')||el.parentNode.parentNode;run(t==='✅',card)}}).observe(el,{childList:true,characterData:true,subtree:true});
}
function scan(r){(r.querySelectorAll?r.querySelectorAll('.q-state'):[]).forEach(watch)}
scan(document);
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1){if(n.classList&&n.classList.contains('q-state'))watch(n);scan(n)}})})}).observe(document.documentElement,{childList:true,subtree:true});
window.__esFxTest=run;
})();
