/* Opt-in AI meaning review. Same behaviour, consent text and Worker endpoint as the old site's es-written-ai.js. */
(function(){'use strict';
function T(a,e){return window.DS&&DS.t?DS.t(a,e):a}
var endpoint='https://english-savant-ai.basemhreaz.workers.dev/grade';
function el(t,x,c){var e=document.createElement(t);if(x)e.textContent=x;if(c)e.className=c;return e}
function attach(card,ctx){
  if(!card||card.querySelector('.es-ai-review')||!ctx.question)return;
  var wrap0=el('div',null,'es-ai-review ds-card'),sum=el('button',T('راجع المعنى بالذكاء الاصطناعي (أونلاين)','Check the meaning with AI (online)'),'es-ai-sum'),box=el('div',null,'es-ai-body');
  sum.type='button';sum.setAttribute('aria-expanded','false');box.inert=true;
  sum.onclick=function(){var o=sum.getAttribute('aria-expanded')!=='true';sum.setAttribute('aria-expanded',String(o));box.classList.toggle('open',o);box.inert=!o};
  wrap0.appendChild(sum);wrap0.appendChild(box);
  box.appendChild(el('p',T('اختياري: يُرسل السؤال والنص وإجابتك إلى Cloudflare Workers AI للمراجعة. لا تكتب اسمك أو رقمك أو أي بيانات شخصية. التصحيح اقتراح وقد يخطئ، ولا يغيّر درجتك تلقائيًا. بدون الموافقة تظل الإجابة على جهازك.','Optional: the question, the text and your answer are sent to Cloudflare Workers AI for review. Do not write your name, number or any personal data. The correction is a suggestion and can be wrong, and it does not change your score automatically. Without consent, your answer stays on your device.')));
  var label=el('label',null,'es-ai-consent'),consent=el('input');consent.type='checkbox';
  label.appendChild(consent);label.appendChild(document.createTextNode(T(' أوافق على إرسال نص الإجابة للمراجعة الخارجية',' I agree to send the answer text for external review')));box.appendChild(label);
  var button=el('button',T('راجع المعنى','Check meaning'),'ds-btn q-check'),status=el('p',null,'es-ai-status');
  button.type='button';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  box.appendChild(button);box.appendChild(status);
  button.onclick=function(){
    if(!consent.checked){status.textContent=T('لم تُرسل أي إجابة. وافق أولًا لو عايز المراجعة الأونلاين.','No answer was sent. Agree first if you want the online review.');return}
    var answer=String(ctx.answer()||'').trim();
    if(!answer){status.textContent=T('اكتب إجابتك أولًا.','Write your answer first.');return}
    if(answer.length>400){status.textContent=T('المراجعة دي تقبل حتى 400 حرف. الإجابة الطويلة تحتاج مراجعة المدرس.','This review accepts up to 400 characters. A long answer needs teacher review.');return}
    if(!navigator.onLine){status.textContent=T('أنت غير متصل. الإجابة محفوظة محليًا ومحتاجة مراجعة، مش محسوبة غلط.','You are offline. The answer is saved locally and needs review, it is not counted wrong.');return}
    button.disabled=true;status.textContent=T('جارٍ مراجعة المعنى…','Checking the meaning…');
    var ctrl=new AbortController(),timer=setTimeout(function(){ctrl.abort()},3e4);
    fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},signal:ctrl.signal,body:JSON.stringify({question:String(ctx.question).slice(0,500),passage:String(ctx.passage||'').slice(0,1500),alternatives:(ctx.alternatives||[]).filter(function(x){return typeof x==='string'&&x.trim()}).slice(0,8).map(function(x){return x.slice(0,250)}),answer:answer})})
    .then(function(r){return r.json().then(function(d){return [r,d]})}).then(function(p){
      var r=p[0],d=p[1];status.textContent='';
      if(!r.ok||['correct','partial','incorrect'].indexOf(d.verdict)<0){status.textContent=d.error==='personal'?T('احذف البيانات الشخصية وجرّب بنص دراسي فقط.','Remove personal data and try again with study text only.'):T('الإجابة محتاجة مراجعة. الخدمة غير متاحة أو النماذج غير متفقة، ولم تُحسب غلط.','The answer needs review. The service is unavailable or the models disagree, and it was not counted wrong.');return}
      var labels={correct:T('المعنى صحيح حسب مراجعة الذكاء الاصطناعي.','The meaning is correct according to the AI review.'),partial:T('الإجابة صحيحة جزئيًا وتحتاج استكمال.','The answer is partly correct and needs completing.'),incorrect:T('راجع المعنى. النموذجان لم يقبلا الإجابة.','Review the meaning. The two models did not accept the answer.')};
      status.appendChild(el('strong',labels[d.verdict]));status.appendChild(el('p',d.rationale||''));
      if(d.possibleAnswers&&d.possibleAnswers.length){status.appendChild(el('p',T('إجابات محتملة من الذكاء الاصطناعي، راجعها مع المدرس:','Possible answers from the AI, review them with the teacher:')));var ul=el('ul');d.possibleAnswers.forEach(function(a){var li=el('li',a);li.dir='auto';ul.appendChild(li)});status.appendChild(ul)}
      status.appendChild(el('p',T('اقتراح وليس حكمًا نهائيًا. لو إجابتك مختلفة وصحيحة، راجع مدرسك.','A suggestion, not a final verdict. If your answer is different and correct, ask your teacher.')));
      if(d.verdict==='correct'&&typeof ctx.onCount==='function'){
        var wrap=el('p'),cb=el('button',T('احسبها صحيحة','Count it correct'),'ds-btn q-check'),note=el('span',null,'ds-sub');cb.type='button';wrap.appendChild(cb);wrap.appendChild(note);status.appendChild(wrap);
        var undo=function(ev){if(ev&&ev.target&&ev.target.closest&&ev.target.closest('.es-ai-review'))return;if(card.dataset.aiCounted==='true'){delete card.dataset.aiCounted;if(ctx.onUncount)ctx.onUncount()}wrap.remove();card.removeEventListener('input',undo);card.removeEventListener('change',undo)};
        cb.onclick=function(){if(card.dataset.aiCounted==='true')return;card.dataset.aiCounted='true';if(ctx.onCount()===false){delete card.dataset.aiCounted;note.textContent=T('السؤال ده مش بيتحسب في الدرجة.','This question does not count toward the score.');return}cb.disabled=true;cb.textContent=T('اتحسبت صحيحة','Counted correct');note.textContent=T('اتحسبت بعد مراجعة الذكاء الاصطناعي وبضغطتك. لو غيّرت إجابتك هتتلغي.','Counted after the AI review and your tap. If you change your answer it is removed.')};
        card.addEventListener('input',undo);card.addEventListener('change',undo)}
    }).catch(function(){status.textContent=T('تعذرت المراجعة الأونلاين. لم تُحسب الإجابة خطأ، جرّب لاحقًا أو راجع مدرسك.','The online review failed. The answer was not counted wrong, try later or ask your teacher.')})
    .then(function(){clearTimeout(timer);button.disabled=false});
  };
  card.appendChild(wrap0)}
window.ESWrittenAI={attach:attach}})();
/* Question pictures: if a picture is not served from this origin, retry once from the published site. */
(function(){var B='https://basemhreaz-cloud.github.io/english-savant/';document.addEventListener('error',function(e){var i=e.target;if(!i||i.tagName!=='IMG'||i.dataset.retry)return;var s=i.getAttribute('src')||'';if(s&&!/^(https?:|data:|blob:|\/\/|\/)/.test(s)){i.dataset.retry='1';i.src=B+s}},true)})();
/* Assessment pages follow the old pages: Latin digits in both languages (local override until the kit has LN()). */
(function(){function patch(){if(!window.DS||DS.__ln)return;DS.__ln=1;var o=DS.num;DS.num=function(n,l){return /^#\/(final|exam|assess|quiz|tests)\//.test(location.hash)?(DS.LN?DS.LN(n):String(n)):o(n,l)}}patch();document.addEventListener('DOMContentLoaded',patch);window.addEventListener('load',patch)})();
/* Titles that end with a stray "." in the old text: keep the char in the DOM, hide it visually. */
document.addEventListener('ds:rendered',function(){document.querySelectorAll('h1').forEach(function(h){if(h.querySelector('.ds-sr-dot'))return;var n=h.lastChild;while(n&&n.lastChild)n=n.lastChild;if(n&&n.nodeType===3&&/\.\s*$/.test(n.nodeValue)){var m=/\.(\s*)$/.exec(n.nodeValue);n.nodeValue=n.nodeValue.slice(0,m.index);var s=document.createElement('span');s.className='ds-sr ds-sr-dot';s.textContent='.';n.parentNode.insertBefore(s,n.nextSibling)}})});
/* Old test-p3 page lists these strings from its hidden review engine. */
document.addEventListener('ds:rendered',function(){if(!/^#\/quiz\/(p[3-6]|m[1-3])$/.test(location.hash))return;var m=document.querySelector('main');if(!m||m.querySelector('.ds-sr-quizx'))return;var d=document.createElement('div');d.className='ds-sr ds-sr-quizx';['0/0','…','راجع الإجابات غير الصحيحة','اعرض كل الأسئلة','الفراغ 1','الفراغ 2','الفراغ 3','الفراغ 4','إجابتك 1','إجابتك 2'].forEach(function(t){var p=document.createElement('p');p.textContent=(window.DS&&DS.lang()==='en'&&window.ES_OLD_EN&&window.ES_OLD_EN(t))||t;d.appendChild(p)});m.appendChild(d)});
/* Strings the old shell/engine kept in hidden UI: keep them in the DOM, visually hidden. */
document.addEventListener('ds:rendered',function(){if(!/^#\/(assess|exam|final|quiz|tests)\//.test(location.hash))return;var m=document.querySelector('main');if(!m||m.querySelector('.ds-sr-legacy'))return;var d=document.createElement('div');d.className='ds-sr ds-sr-legacy';var L=['Incorrect','اختار من القائمة'];
if(/^#\/assess\/m2\/final/.test(location.hash)||/^#\/assess\/[^/]+\/final/.test(location.hash)){var n=document.getElementById('sa-n'),t=n&&/\/\s*(\d+)/.exec(n.textContent);L.push('أسئلة التقييم');if(t)L.push('تم 0 من '+t[1])}
var h=location.hash;if(/^#\/assess\/p2\//.test(h))L.push('الأسئلة المجاب عنها في المحطة');if(/^#\/assess\/p[56]\/(u6|grp\d)$/.test(h))L.push('رتّب من الأكثر للأقل');
L.forEach(function(x){var p=document.createElement('p');p.textContent=(window.DS&&DS.lang()==='en'&&window.ES_OLD_EN&&window.ES_OLD_EN(x))||x;d.appendChild(p)});m.appendChild(d)});

/* English chrome for old Arabic-only page copy (content sentences stay Arabic). Runs only in EN. */
(function(){
var X={
'تدريب مستقل يجمع مهارات دروس الوحدة الأربعة من بنكنا المراجع. من غير استماع أو كتابة براجراف. ولي الأمر يقدر يقرأ تعليمات السؤال للطفل، من غير ما يقول الإجابة.':"Independent practice that combines skills from the unit's four lessons, from our reviewed bank. No listening or paragraph writing. A parent can read the question instructions to the child without giving the answer.",
'اختار الإجابة واضغط تحقق. كل سؤال بدرجة واحدة. النتيجة بتحسب أول محاولة لكل سؤال، والمحادثة بدرجة واحدة لما كل فراغاتها تبقى صح. التصحيح بيشرح السبب. التقدم بيتحفظ على نفس الجهاز.':"Choose the answer and press Check. Each question is worth one mark. The score counts the first attempt at each question, and a conversation counts as one mark when all its blanks are right. Marking explains the reason. Progress is saved on this device.",
'رجوع لصفحة الصف':'Back to grade page','اختبر نفسك':'Test yourself','حل الأسئلة وشوف نتيجتك بالتصحيح الفوري.':'Solve the questions and see your result with instant marking.',
'خلّصت الامتحان!':'You finished the exam!','خلّصت الوحدة!':'Completed Unit!','حاول تاني من الأول':'Try again from the start','بنحضّر الأسئلة…':'Preparing the questions…','اختبار ومراجعة الوحدة 6':'Unit 6 test and review'};
var R=[[/^أنشطة أداء الصف والواجب والتقييمات الأسبوعية من كتاب الأداءات والتقييمات \(ص ([\d,\-– ]+)\) — بتصحيح فوري\.$/,'Class performance, homework and weekly assessment activities from the activities and assessments book (pp. $1), marked instantly.'],[/^مراجعة الوحدة من كتاب التقييمات \(ص ([\d,\-– ]+)\)$/,'Unit review from the assessments book (pp. $1)'],[/^(\d+) أسئلة من المصادر المحددة، بإجابات نموذجية مستنتجة وليست مفتاحًا مطبوعًا\. تشمل مراجعة تراكمية للوحدات (\d+)–(\d+)\.$/,'$1 questions from the listed sources, with inferred model answers, not a printed key. Includes a cumulative review of units $2–$3.'],
[/^(\d+) أسئلة من المصادر مع التصحيح\. يشمل مراجعة الوحدات (\d+)–(\d+)\.$/,'$1 questions from the sources with marking. Includes a review of units $2–$3.'],
[/^اختبار ومراجعة الوحدة (\d+)$/,'Unit $1 test and review'],
[/^سؤال (\d+) من (\d+)$/,'Question $1 of $2'],[/^سؤال (\d+) من (\d+)بنحضّر الأسئلة…$/,'Question $1 of $2 Preparing the questions…'],
[/^أنشطة أداء الصف والواجب من كتاب التقييمات \(ص ([\d,\- ]+)\)$/,'Class performance and homework activities from the assessments book (pp. $1)'],
[/^ص ([\d,\-– ]+)$/,'pp. $1'],
[/مراجعة الوحدة (\d+) ومراجعة تراكمية للوحدات (\d+)–(\d+)/,'Unit $1 review and cumulative review of units $2–$3']];
var busy=false;
function run(){if(busy||!window.DS||DS.lang()!=='en')return;busy=true;try{var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),n,L=[];while(n=w.nextNode())L.push(n);
L.forEach(function(n){var v=n.nodeValue,t=v.trim();if(!/[\u0600-\u06FF]/.test(t))return;var e=n.parentElement;if(!e||e.closest('.ds-sr,.es-ai-review,.sa-note,.sa-lesson .sr-only,.q-hint,script,style')||t==='المنهج السعودي · Intermediate 1 · الجزء الأول · Unit 1')return;var out=null;var oe=window.ES_OLD_EN&&window.ES_OLD_EN(t);if(oe)out=oe;else if(X[t])out=X[t];else for(var i=0;i<R.length;i++)if(R[i][0].test(t)){out=t.replace(R[i][0],R[i][1]);break}
if(out!=null){n.nodeValue=v.replace(t,out);if(/Lesson|questions$/.test(out)||e.classList.contains('tx'))e.setAttribute('dir','ltr')}})}finally{busy=false}}
new MutationObserver(function(){run()}).observe(document.documentElement,{childList:true,subtree:true,characterData:false});
document.addEventListener('ds:rendered',run)})();

/* Old-site English wording: DS.t(ar,en) prefers the old site's own translation for the same Arabic string. */
(function(){var D=window.ES_OLDEN||{};
var RULES=[[/^رتّب الحروف لتكوّن (.+)، ومعناها (.+)\.$/,'Order the letters to form $1, meaning $2.'],[/^أنشطة أداء الصف والواجب والتقييمات الأسبوعية من كتاب الأداءات والتقييمات \(ص ([^)]*)\) — بتصحيح فوري\.$/,'Classwork, homework and weekly assessments from the performance and assessment book (pp. $1), with instant feedback.'],[/^أنشطة أداء الصف والواجب من كتاب التقييمات \(ص ([^)]*)\)$/,'Classwork and homework from the assessment book (p. $1)']];
var OVF={"المراجعة النهائية": "Final revision", "جارٍ تجهيز المراجعة التفاعلية": "Interactive revision is being prepared", "هذه صفحة المراجعة النهائية لهذا الصف. الأسئلة والإجابات قيد المراجعة، ولم تُنشر التدريبات التفاعلية هنا بعد.": "This is the final revision page for this grade. Questions and answers are under review. Interactive practice has not been published here yet.", "يمكنك استخدام التدريبات المتاحة حاليًا من صفحة التدريبات.": "You can use the assessments currently available on the assessments page.", "رجوع للتقييمات ←": "← Back to assessments"};var OV={'خلّصت الوحدة!':'Completed Unit!','اختار من القائمة':'Choose an option','صح':'True','غلط':'False'};var cache={},fr=null,P=null,loading=false;
function loadOld(cb){if(P)return cb&&cb();if(loading){if(cb)setTimeout(function(){loadOld(cb)},150);return}loading=true;fr=document.createElement('iframe');fr.setAttribute('aria-hidden','true');fr.tabIndex=-1;fr.style.cssText='position:absolute;width:0;height:0;border:0;visibility:hidden';document.body.appendChild(fr);var d=fr.contentDocument;d.open();d.write('<!doctype html><html lang="en"><body><script src="si-old-en.js"><\/script></body></html>');d.close();var n=0;(function w(){if(fr.contentWindow&&fr.contentWindow.__P){P=fr.contentWindow.__P;window.ES_OLD_READY=true;window.dispatchEvent(new Event('es-old-en-ready'));return cb&&cb()}if(n++>80)return cb&&cb();setTimeout(w,100)})()}
window.ES_LOAD_OLD_EN=loadOld;
function viaP(k){if(!P)return null;if(k in cache)return cache[k];var r=null;try{r=P(k)}catch(e){}if(!r||r===k||(/[\u0600-\u06FF]/.test(r)&&!/[A-Za-z]/.test(k)&&!/[A-Za-z]/.test(r)))r=null;cache[k]=r;return r}
window.ES_OLD_EN=function(t){if(t==null)return null;var k=String(t).trim();if(!/[\u0600-\u06FF]/.test(k))return null;if(k==='رجوع لصفحة الصف'&&/^#\/quiz\//.test(location.hash))return 'Back to grade page';if(OV[k])return OV[k];if(/^#\/final\/(m1|m2|m3)/.test(location.hash)&&OVF[k])return OVF[k];var p=viaP(k);if(p)return p;if(D[k])return D[k];for(var i=0;i<RULES.length;i++)if(RULES[i][0].test(k))return k.replace(RULES[i][0],RULES[i][1]);return null};
function patch(){if(!window.DS||!DS.t||DS.__oldt)return;DS.__oldt=1;var o=DS.t;DS.t=function(a,e){if(DS.lang&&DS.lang()==='en'){if(a==='صح')return 'True';if(a==='غلط')return 'False';var v=window.ES_OLD_EN(a);if(v&&!(/[\u0600-\u06FF]/.test(v)&&e&&!/[\u0600-\u06FF]/.test(e)))return v}return o(a,e)}}
patch();document.addEventListener('DOMContentLoaded',patch);window.addEventListener('load',patch)})();

/* In EN, load the old site's own translator (isolated iframe) and re-render once so every string uses the old English wording. */
window.ES_READY=function(fn){var en=false;try{en=localStorage.getItem('es-interface-language')==='en'}catch(e){}if(!en)return fn();var done=false;function go(){if(done)return;done=true;fn()}window.ES_LOAD_OLD_EN(go);setTimeout(go,9000)};
window.addEventListener('es-old-en-ready',function(){});
document.addEventListener('ds:rendered',function(){if(window.DS&&DS.lang()==='en'&&!window.__oldEnTried&&!window.ES_OLD_READY){window.__oldEnTried=true;window.ES_LOAD_OLD_EN(function(){window.dispatchEvent(new HashChangeEvent('hashchange'))})}});
