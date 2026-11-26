/* ENGLISH SAVANT · explain-p1-u1..u6 (step-by-step written explanation with pictures). Registered before the generic /explain/:p route. */
(function(){'use strict';
var BASE=new URL(window.ES_LEGACY_BASE||'../',location.href).href,h=DS.esc;
function abs(u){try{return new URL(u,BASE).href}catch(e){return u}}
var G=window.ES_EXPLAIN_GENERIC;
function route(f){var m=/^((?:explain|teach)-[\w-]+)\.html$/.exec(f||'');if(m)return '#/explain/'+m[1];if(/^https?:/.test(f))return f;if(window.ES_ROUTE){var r=window.ES_ROUTE(f);if(r)return r}return '#/page/'+f}
function mount(P,unit,legacy){
  var root=document.getElementById('p1x');if(!root)return;
  var data,lesson=null,index=0,saved={};
  var en=function(){return DS.lang()==='en'};
  function tx(ar,e){return en()&&e?e:ar}
  function menu(){
    lesson=null;
    var o='<div class="ds-list ds-list--cols">';
    data.lessons.forEach(function(l,i){o+='<button type="button" class="ds-rowlink ex-lesson" data-l="'+i+'"><span class="ds-tile">'+DS.num(l.lesson)+'</span><span class="tx"><b>'+(en()?'Lesson ':'الدرس ')+h(l.lesson)+' · <bdi>'+h(l.lesson_title)+'</bdi></b></span><span class="go">'+DS.icon('chev')+'</span></button>'});
    root.innerHTML=o+'</div>';
    [].forEach.call(root.querySelectorAll('.ex-lesson'),function(b){b.onclick=function(){lesson=data.lessons[+b.dataset.l];index=saved[lesson.lesson]||0;render()}});
  }
  function render(){
    var s=lesson.steps[index],n=lesson.steps.length;saved[lesson.lesson]=index;
    var o='<div class="ds-stack">';
    o+='<button type="button" class="ds-btn ds-btn--soft ex-home">'+tx('اختار درس تاني','Choose another lesson')+'</button>';
    o+='<h2>'+h(lesson.lesson_title)+'</h2><p class="ds-sub">'+h(tx(lesson.goal_ar,lesson.goal_en))+'</p>';
    o+='<p class="ds-sub ex-pos">'+(en()?'Step '+(index+1)+' of '+n:'خطوة '+DS.num(index+1)+' من '+DS.num(n))+'</p>'+DS.ui.progress((index+1)/n*100);
    o+='<article class="ds-card"><h3>'+h(tx(s.title_ar,s.title_en))+'</h3><p class="ex-p">'+h(tx(s.body_ar,s.body_en))+'</p>';
    if(s.en&&s.en.length)o+='<div class="ex-english ds-ltr" dir="ltr">'+s.en.map(function(t){return '<p>'+h(t)+'</p>'}).join('')+'</div>';
    if(s.image)o+='<img class="ex-img" src="'+h(abs(s.image))+'" alt="'+h(s.title_ar)+'" loading="lazy">';
    if(s.source_page)o+='<p class="ds-sub">'+h(en()?'Book reference: page '+s.source_page:'مرجع الكتاب: صفحة '+s.source_page)+'</p>';
    if(s.check_ref)o+='<a class="ds-btn ex-try" href="'+h('#/explain-check/'+unit+'/'+encodeURIComponent(s.check_ref))+'">'+tx('جرّب التدريب','Try the exercise')+'</a>';
    o+='</article><div class="ex-nav2"><button type="button" class="ds-btn ds-btn--soft ex-prev"'+(index===0?' disabled':'')+'>'+tx('السابق','Previous')+'</button><button type="button" class="ds-btn ex-next">'+(index===n-1?tx('رجوع للدروس','Back to lessons'):tx('التالي','Next'))+'</button></div></div>';
    root.innerHTML=o;
    root.querySelector('.ex-home').onclick=menu;
    root.querySelector('.ex-prev').onclick=function(){index--;render()};
    root.querySelector('.ex-next').onclick=function(){if(index===n-1)menu();else{index++;render()}};
    window.__P1Explanation={lesson:lesson.lesson,index:index,step:s};
    root.scrollIntoView({block:'start'});
  }
  document.addEventListener('es:interface-language',function(){if(document.getElementById('p1x')===root&&lesson)render()});
  fetch(abs('p1-explanations-u'+unit+'.json'),{cache:'no-store'}).then(function(r){if(!r.ok)throw Error('x');return r.json()}).then(function(j){data=j;menu();document.body.dataset.teachingReady='true'}).catch(function(){root.innerHTML=DS.ui.error()});
}
DS.route('/explain/explain-p1-:u',function(ctx){
  var m=/^u(\d)$/.exec(ctx.params.u);
  if(!m){return window.ES_EXPLAIN_RENDER?window.ES_EXPLAIN_RENDER('explain-p1-'+ctx.params.u):null}
  var unit=m[1],P='explain-p1-u'+unit;DS.tab('grades');DS.title('شرح دروس الوحدة '+unit,'Unit '+unit+' lessons');
  var o=DS.ui.crumbs([['#/','الرئيسية','Home'],[route('grades.html'),'مناهج مصر','Egyptian curriculum'],[route('grade-p1.html'),'الصف الأول الابتدائي','Grade 1'],['','شرح دروس الوحدة '+unit,'Unit '+unit+' lessons']]);
  o+='<header class="ds-hero"><a class="ds-back" href="'+route('teach-p1-u'+unit+'.html')+'">'+DS.icon('back')+'<span>'+DS.t('شرح الوحدة','Unit lesson')+'</span></a><h1>'+DS.t('شرح دروس الوحدة '+DS.num(unit),'Unit '+unit+' lessons')+'</h1><p class="ds-sub ex-lead">'+DS.t('شرح مكتوب بالصور وتدريب تفاعلي. في دروس الحروف: حركة كتابة وتدريب بإصبعك من غير درجات. مفيش تسجيل صوتي هنا.','Written explanation with pictures and interactive practice. In letter lessons: writing motion and finger tracing with no grades. No audio recording here.')+'</p></header>';
  o+='<div class="ds-split ex-split"><div class="ds-stack ex-main"><div id="p1x" class="ds-stack">'+DS.ui.skeleton(2)+'</div></div><aside class="ds-stack ex-aside"><a class="ds-btn ds-btn--block" href="'+route('watch.html?lesson=p1-u'+unit+'-full-lesson')+'">'+DS.icon('play')+'<span class="ex-vid">__VID__</span></a></aside></div>';
  /* video label comes from the legacy page (it carries the unit's duration) */
  return fetch(abs(P+'.html'),{cache:'no-cache'}).then(function(r){return r.text()}).then(function(t){
    var d=new DOMParser().parseFromString(t,'text/html'),a=d.querySelector('a[href^="watch.html"]'),lab=a?a.textContent.trim():'فيديو شرح الوحدة كاملة';lab=(window.ES_EXPLAIN?window.ES_EXPLAIN.L(lab):lab);
    o=o.replace('__VID__',h(lab));setTimeout(function(){mount(P,unit)},0);return o;
  });
});
})();
