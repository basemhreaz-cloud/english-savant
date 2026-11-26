/* ENGLISH SAVANT · family: explain-* and teach-* · registers DS route /explain/:page
   Content is read from the legacy page (text only) and the unit's curriculum JSON, then rendered with ds.css components.
   routes.json: {"explain-p3-u1.html":"#/explain/explain-p3-u1", ... "teach-p1-u1.html":"#/explain/teach-p1-u1"} */
(function(){'use strict';
var BASE=new URL(window.ES_LEGACY_BASE||'../',location.href).href;
var ARROW=/[\u2196\u2197\u21a9\u21aa\u2190\u2192\u2199\u2198]/g;
var h=DS.esc;
function Q(){return DS.lang()==='en'?'?':'؟'}
/* English strings: data from the site's translation table (explain-en.json, read as data) + pattern rules for the repeated lines the table lacks. No legacy engine runs. */
var SRC=(document.currentScript&&document.currentScript.src)||'';
var EN=null,ENP=null;
function enLoad(){if(ENP)return ENP;if(window.ES_EXPLAIN_EN&&typeof window.ES_EXPLAIN_EN==='object'){EN=window.ES_EXPLAIN_EN;ENP=Promise.resolve(EN);return ENP}ENP=fetch(window.ES_EXPLAIN_EN_URL||new URL('explain-en.json',SRC||location.href).href,{cache:'no-cache'}).then(function(r){return r.ok?r.json():{}}).catch(function(){return {}}).then(function(j){EN=j;return j});return ENP}
var LD='\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
function latin(x){return String(x).replace(/[\u0660-\u0669]/g,function(d){return LD.indexOf(d)})}
var GR={'الأول':'1','التاني':'2','التالت':'3','الرابع':'4','الخامس':'5','السادس':'6'};
var ORD={'الأولى':'1','الثانية':'2','الثالثة':'3','الرابعة':'4','الخامسة':'5','السادسة':'6'};
var PARTS={'كلمات الوحدة':'unit words','وتكوين كلماتها':'building its words','وظروف التكرار':'adverbs of frequency','وأصواتها':'its sounds','وجملها':'its sentences','وقواعدها':'its grammar'};
function gradeEn(g){var m=/^الصف (\S+) (الابتدائي|الإعدادي)$/.exec(g);if(!m||!GR[m[1]])return null;return (m[2]==='الابتدائي'?'Primary ':'Preparatory ')+GR[m[1]]}
var TAIL={'أولى ابتدائي':'Primary 1','تانية ابتدائي':'Primary 2','تالتة ابتدائي':'Primary 3','رابعة ابتدائي':'Primary 4','خامسة ابتدائي':'Primary 5','سادسة ابتدائي':'Primary 6','أولى إعدادي':'Preparatory 1','تانية إعدادي':'Preparatory 2','تالتة إعدادي':'Preparatory 3'};
function rules(t){var m;
  if(m=/^(.+?) · (\S+ (?:ابتدائي|إعدادي))(?: \| ENGLISH SAVANT)?$/.exec(t)){var tl=TAIL[m[2]],hd=latin((EN&&EN[m[1]])||rules(m[1])||'');if(tl&&hd&&!/[\u0600-\u06FF]/.test(hd))return hd+' · '+tl+(/ENGLISH SAVANT$/.test(t)?' | ENGLISH SAVANT':'')}
  if(m=/^مراجعة الوحدات ([\u0660-\u0669\d]+)-([\u0660-\u0669\d]+)(\.?)$/.exec(t))return 'Review of units '+m[1]+'-'+m[2]+m[3];
  if(m=/^أسئلة متنوعة من الوحدات السابقة، من كتاب الوزارة \(ص ([\u0660-\u0669\d]+)-([\u0660-\u0669\d]+)\)، والتصحيح فوري بعد كل سؤال\.$/.exec(t))return 'Mixed questions from the previous units, from the Ministry book (pages '+m[1]+'-'+m[2]+'), with instant marking after every question.';
  if(m=/^الوحدة ([\u0660-\u0669\d]+)$/.exec(t))return 'Unit '+m[1];
  if(m=/^شرح دروس الوحدة ([\u0660-\u0669\d]+)$/.exec(t))return 'Unit '+m[1]+' lessons explained';
  if(m=/^منهج (الصف .+) · الوحدة ([\u0660-\u0669\d]+)$/.exec(t)){var g=gradeEn(m[1]);if(g)return g+' curriculum · Unit '+m[2]}
  if(m=/^بطاقات تفاعلية · منهج (الصف .+?) · (مراجعة|الوحدة ([\u0660-\u0669\d]+))$/.exec(t)){var g2=gradeEn(m[1]);if(g2)return 'Interactive cards · '+g2+' curriculum · '+(m[3]?'Unit '+m[3]:'Review')}
  if(m=/^المنهج السعودي · أول متوسط · الجزء الأول · الوحدة ([\u0660-\u0669\d]+)$/.exec(t))return 'Saudi curriculum · First Intermediate · Part 1 · Unit '+m[1];
  if(m=/^أنشطة تفاعلية من كتاب الوزارة \(ص ([\u0660-\u0669\d]+)-([\u0660-\u0669\d]+)\): (.+?) — والتصحيح فوري\.$/.exec(t)){var ps=m[3].split('، '),ok=ps.every(function(x){return PARTS[x]});if(ok){var e=ps.map(function(x){return PARTS[x]});var lst=e.length>1?e.slice(0,-1).join(', ')+', and '+e[e.length-1]:e[0];return 'Interactive activities from the Ministry book (pages '+m[1]+'-'+m[2]+'): '+lst+', with instant marking.'}}
  if(m=/^شاهد فيديو شرح الوحدة (\S+)$/.exec(t)){var n=ORD[m[1]];if(n){var w=['','first','second','third','fourth','fifth','sixth'][+n];return 'Watch the video explaining the '+w+' unit'}}
  if(m=/^شرح الوحدة ([\u0660-\u0669\d]+)$/.exec(t))return 'Unit '+m[1]+' explained';
  if(t==='كلّم مستر على واتساب')return 'Message Mr. Basem on WhatsApp';
  if(t==='تابعنا على فيسبوك')return 'Follow us on Facebook';
  if(t==='رجوع للشرح التفاعلي')return 'Back to the interactive explanation';
  if(m=/^شرح المراجعة ([\u0660-\u0669\d]+)$/.exec(t))return 'Review '+m[1]+' explained';
  if(m=/^القراجة، كفر صقر، محافظة الشرقية ([\u0660-\u0669\d]+)، مصر$/.exec(t))return 'Al Qarajah, Kafr Saqr, Sharqia '+m[1]+', Egypt';
  if((m=/^لغة الوحدة: (.+)$/.exec(t))&&!/[\u0600-\u06FF]/.test(m[1]))return 'Unit language: '+m[1];
  if((m=/^قصة الوحدة: (.+)$/.exec(t))&&!/[\u0600-\u06FF]/.test(m[1]))return 'Unit story: '+m[1];
  if(m=/^شرح مراجعة الوحدات ([\u0660-\u0669\d]+)-([\u0660-\u0669\d]+)$/.exec(t))return 'Review of units '+m[1]+'-'+m[2]+' explained';
  if(m=/^شرح ([A-Za-z][^\u0600-\u06FF]*)$/.exec(t))return 'Explanation: '+m[1];
  if(t==='الكلمات ومعانيها')return 'Words and their meanings';
  if(t==='الجمل ومعانيها')return 'Sentences and their meanings';
  if(t==='شاهد شرح الوحدة بالفيديو')return 'Watch the unit explained in a video';
  if(m=/^فيديو شرح الوحدة كاملة · (.+)$/.exec(t))return 'Full unit explanation video · '+m[1];
  return null}
function L(s){s=String(s==null?'':s);if(DS.lang()!=='en')return s;var ar=(s.match(ARROW)||[]).join(''),t=s.replace(ARROW,'').replace(/[\u2066-\u2069]/g,'').replace(/\s+/g,' ').trim(),r=(EN&&EN[t])||rules(t);if(r==null){if(/[^\s\u2190-\u2199]\s*[\u2190\u2192]\s*[^\s\u2190-\u2199]/.test(s))return s.replace(/[\u2190\u2192]/g,function(c){return c==='\u2192'?'\u2190':'\u2192'});return s}if(/[\u0621-\u064a]/.test(r))return r+(ar?' '+ar:'');return latin(r).replace(/\u061f/g,'?')+(ar?' '+ar:'')}
/* native port of ESInterface.bindExplanation: shows explanation_en in English when present, explanation_ar otherwise; the element is never re-translated */
function bindExplanation(el,w){if(!el)return;var en=DS.lang()==='en'&&w.explanation_en;el.dataset.explanationAr=w.explanation_ar||'';el.dataset.explanationEn=w.explanation_en||'';el.textContent=en?w.explanation_en:(w.explanation_ar||'');el.dir=en?'ltr':'rtl'}
window.ES_EXPLAIN={L:L,bindExplanation:bindExplanation,ready:enLoad};
function abs(u){try{return new URL(u,BASE).href}catch(e){return u}}
function route(href){
  href=href||'';
  var m=/^((?:explain|teach)-[\w-]+)\.html(#.*)?$/.exec(href);if(m)return '#/explain/'+m[1];
  if(/^(https?:|mailto:|tel:)/.test(href))return href;
  if(href==='index.html'||href==='')return '#/';
  if(window.ES_ROUTE){var r=window.ES_ROUTE(href);if(r)return r}
  return '#/page/'+href.replace(/^\.\//,'');
}
var G={m3:'الصف التالت الإعدادي',p2:'الصف التاني الابتدائي','sa-g1':'الصف الأول الابتدائي — المنهج السعودي (We Can 1)',p5:'الصف الخامس الابتدائي',p3:'الصف التالت الابتدائي',m1:'الصف الأول الإعدادي',p4:'الصف الرابع الابتدائي',p1:'الصف الأول الابتدائي',m2:'الصف التاني الإعدادي',p6:'الصف السادس الابتدائي'};
var X={pin:'<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><rect x="10" y="8" width="4" height="4" rx="1"/>',out:'<path d="M7 17 17 7M8.5 7H17v8.5"/>'};
function icon(n){return X[n]?'<svg viewBox="0 0 24 24" aria-hidden="true">'+X[n]+'</svg>':DS.icon(n)}
function btn(a,nav){
  var raw=a.textContent,txt=L(raw.replace(ARROW,'').replace(/\s+/g,' ').trim()),arrow=(raw.match(ARROW)||[''])[0],href=a.getAttribute('href')||'';
  var play=/watch\.html/.test(href),prev=/[\u21a9\u2190]/.test(arrow),next=/[\u21aa\u2192]/.test(arrow);
  var soft=a.classList.contains('secondary');
  return '<a class="ds-btn'+(soft?' ds-btn--soft':'')+' ds-btn--block" href="'+h(route(href))+'">'+(play?icon('play'):'')+(prev?'<span class="ex-dir">'+icon('chev')+'</span>':'')+'<span>'+h(txt)+'</span>'+((next||(!soft&&!play&&nav&&!prev))?'<span class="ex-dir ex-dir--n">'+icon('chev')+'</span>':'')+'</a>';
}
function video(n){
  var v=n.querySelector('video');if(!v)return '<div class="ds-card">'+h(L(n.textContent))+'</div>';
  var s=v.getAttribute('src')||'',p=v.getAttribute('poster')||'';
  return '<div class="ds-video"><video controls playsinline preload="none"'+(p?' poster="'+h(abs(p))+'"':'')+(s?' src="'+h(abs(s))+'"':'')+'>'+[].map.call(v.querySelectorAll('source'),function(x){return '<source src="'+h(abs(x.getAttribute('src')))+'" type="'+h(x.getAttribute('type')||'')+'">'}).join('')+'</video></div>';
}
function note(n){
  var o='<article class="ds-card">';
  [].forEach.call(n.children,function(k){
    if(k.tagName==='H3')o+='<h3>'+h(L(k.textContent))+'</h3>';
    else if(k.tagName==='P')o+='<p class="ex-p">'+h(L(k.textContent))+'</p>';
    else o+='<div>'+h(L(k.textContent))+'</div>';
  });return o+'</article>';
}
function extLink(a){
  var raw=a.textContent,pin=/\u{1F4CD}/u.test(raw),txt=L(raw.replace(ARROW,'').replace(/\u{1F4CD}/gu,'').replace(/\s+/g,' ').trim()),hr=a.getAttribute('href')||'';
  var ext=/^https?:/.test(hr);
  return '<a class="ds-btn ds-btn--soft ex-fl" href="'+h(route(hr))+'"'+(ext?' target="_blank" rel="noopener"':'')+(a.getAttribute('dir')?' dir="'+h(a.getAttribute('dir'))+'"':'')+'>'+(pin?'<span class="ex-pin" aria-hidden="true">\u{1F4CD}</span>'+icon('pin'):'')+'<span>'+h(txt)+'</span>'+(/[\u2196\u2197]/.test(raw)?icon('out'):'')+'</a>';
}
function footer(ft){
  var top=ft.querySelector('.footer-top'),bot=ft.querySelector('.footer-bottom'),o='<footer class="ds-card ex-foot">';
  if(top){
    var br=top.querySelector('.footer-brand'),cc=[].filter.call(top.children,function(c){return c!==br})[0];
    if(br)o+='<div class="ex-brand ds-ltr" dir="ltr"><b>'+h(br.querySelector('.wordmark').textContent)+'</b><span>'+h(L(br.querySelector('.tagline').textContent))+'</span><small>'+h(L(br.querySelector('small').textContent))+'</small></div>';
    if(cc){o+='<div><h3>'+h(L(cc.querySelector('h3').textContent))+'</h3><p class="ex-p">'+h(L(cc.querySelector('p').textContent))+'</p><div class="ds-row ex-links">'+[].map.call(cc.querySelectorAll('a'),extLink).join('')+'</div></div>'}
  }
  if(bot){o+='<div class="ds-row ex-links">'+[].map.call(bot.children,function(k){return k.tagName==='A'?extLink(k):'<small class="ex-copy">'+h(L(k.textContent))+'</small>'}).join('')+'</div>'}
  return o+'</footer>';
}
function crumbs(P,label){
  var c=[['#/','الرئيسية','Home']],m;
  if((m=P.match(/(?:unit|explain|assess)-sa-g(\d+)/))){c.push([route('saudi.html'),'مناهج السعودية','Saudi curriculum'],[route('sa-g'+m[1]+'.html'),G['sa-g'+m[1]]||'الصف '+m[1],L(G['sa-g'+m[1]]||'')||'Grade '+m[1]])}
  else if((m=P.match(/(?:unit|explain|assess)-([pm]\d)-/))){c.push([route('grades.html'),'مناهج مصر','Egyptian curriculum'],[route('grade-'+m[1]+'.html'),G[m[1]]||'صفحة الصف',L(G[m[1]]||'صفحة الصف')])}
  c.push(['',label,L(label)]);
  return DS.ui.crumbs(c);
}
/* the legacy engine spaces an Arabic letter from an attached Latin word ("مع"+"drives"); data files carry them glued */
var SPON=false;
function sp(t){if(!SPON)return String(t==null?'':t);return String(t==null?'':t).replace(/([\u0621-\u064A\u0640])([A-Za-z]+)\u2019([A-Za-z]+)/g,'$1 $2 \u2019 $3').replace(/([\u0621-\u064A\u0640])([A-Za-z])/g,'$1 $2').replace(/([A-Za-z])\u060c/g,'$1 \u060c')}
function teachHtml(u){
  var o='';
  (u.explanation||[]).forEach(function(e){o+='<section class="ds-card"><h3>'+h(L(e.title))+'</h3><p class="ex-p">'+h(L(sp(e.text)))+'</p></section>'});
  var mk=Object.keys(u.meanings||{});
  o+='<section class="ds-card"><h3>'+h(L('الكلمات ومعانيها'))+'</h3><div class="ex-rows ex-mean">'+mk.map(function(w){return '<div class="ex-m"><b dir="ltr" class="ds-ltr">'+h(w)+'</b> : '+h((function(m){var r=L(': '+m);return r!==': '+m&&r.indexOf(': ')===0?r.slice(2):m})(u.meanings[w]))+'</div>'}).join('')+'</div></section>';
  o+='<section class="ds-card"><h3>'+h(L('الجمل ومعانيها'))+'</h3>'+Object.keys(u.sentenceMeanings||{}).map(function(w){return '<p class="ex-p ex-sm"><span class="ds-ltr" dir="ltr">'+h(w)+'</span>'+h(L(u.sentenceMeanings[w]))+'</p>'}).join('')+'</section>';
  if(u.vocab&&u.vocab.length){
    o+='<section class="ds-card"><h3>'+DS.t('اتعلّم كلمات الوحدة','Learn the unit words')+'</h3><p class="ds-sub">'+DS.t('دوس على البطاقة، والكلمة هتتبني حرف حرف.','Tap a card to build the word letter by letter.')+'</p><div class="ds-tcards">';
    u.vocab.forEach(function(w){o+='<button type="button" class="ds-tcard t-card ds-ltr" data-w="'+h(w)+'" data-i="0" aria-pressed="false" dir="ltr">'+Q()+'</button>'});
    o+='</div></section>';
  }
  if(u.sentences&&u.sentences.length){
    o+='<section class="ds-card"><h3>'+DS.t('اتعلّم جمل الوحدة','Learn unit sentences')+'</h3><p class="ds-sub">'+DS.t('دوس على الجملة، وهتتبني كلمة كلمة بالترتيب الصح.','Tap a sentence to build it word by word in the correct order.')+'</p><div class="ex-rows">';
    u.sentences.forEach(function(s,i){o+='<button type="button" class="ds-opt t-sent ds-ltr" data-s="'+h(s)+'" aria-pressed="false" dir="ltr">'+(i+1)+' …</button>'});
    o+='</div></section>';
  }
  var chips=(u.phonics||[]).filter(function(g){return !g.words||!g.words.length});
  var sounds=(u.phonics||[]).filter(function(g){return g.words&&g.words.length});
  if(chips.length){
    o+='<section class="ds-card"><h3>'+DS.t('لغة الوحدة','Unit language')+'</h3><div class="ex-lang">';
    chips.forEach(function(g){o+='<div class="t-group ds-tag ex-focus ds-ltr" dir="ltr"><span class="t-focus">'+h(L(g.focus))+'</span></div>'});
    o+='</div></section>';
  }
  if(sounds.length){
    o+='<section class="ds-card"><h3>'+DS.t('اتعلّم الأصوات','Learn the sounds')+'</h3><p class="ds-sub">'+DS.t('دوس على الكلمة، والصوت هيتحدد جواها.','Tap a word to highlight the sound inside it.')+'</p>';
    sounds.forEach(function(g){
      o+='<div class="t-group ex-grp ds-ltr" dir="ltr"><span class="t-focus ds-sub">'+h(L(g.focus))+'</span><span class="t-words ds-chips ex-chips">';
      g.words.forEach(function(w){o+='<button type="button" class="ds-chip t-word" aria-pressed="false" data-w="'+h(w)+'" data-c="'+h(g.cluster||'')+'">'+h(w)+'</button>'});
      o+='</span></div>';
    });
    o+='</section>';
  }
  return o||'<div class="ds-card ds-empty">'+h(DS.t('الشرح بيتجهز.','The explanation is getting ready.'))+'</div>';
}
function wire(root){
  [].forEach.call(root.querySelectorAll('.t-card'),function(b){b.addEventListener('click',function(){
    var w=b.dataset.w,i=+b.dataset.i;
    if(i>=w.length){b.dataset.i='0';b.textContent=Q();b.setAttribute('aria-pressed','false');b.classList.remove('on');return}
    i++;b.dataset.i=i;b.textContent=w.slice(0,i);
    if(i>=w.length){b.classList.add('on');b.setAttribute('aria-pressed','true')}
  })});
  [].forEach.call(root.querySelectorAll('.t-sent'),function(b){b.addEventListener('click',function(){
    if(b.dataset.busy)return;
    if(b.dataset.done){b.textContent=b.dataset.label;b.dataset.done='';b.setAttribute('aria-pressed','false');b.classList.remove('on');return}
    b.dataset.busy='1';b.dataset.label=b.textContent;
    var words=b.dataset.s.split(' '),i=0;b.textContent='';
    var tm=setInterval(function(){
      b.textContent=(b.textContent?b.textContent+' ':'')+words[i];i++;
      if(i>=words.length){clearInterval(tm);delete b.dataset.busy;b.dataset.done='1';b.classList.add('on');b.setAttribute('aria-pressed','true')}
    },350);
  })});
  [].forEach.call(root.querySelectorAll('.t-word'),function(b){b.addEventListener('click',function(){
    var w=b.dataset.w,c=b.dataset.c;
    if(b.dataset.hl){b.innerHTML=h(w);b.dataset.hl='';b.classList.remove('on');b.setAttribute('aria-pressed','false');return}
    var pos=c&&w.indexOf(c)>=0?w.indexOf(c):0,len=c&&w.indexOf(c)>=0?c.length:1;
    b.innerHTML=h(w.slice(0,pos))+'<b>'+h(w.slice(pos,pos+len))+'</b>'+h(w.slice(pos+len));
    b.dataset.hl='1';b.classList.add('on');b.setAttribute('aria-pressed','true');
  })});
}
window.ES_EXPLAIN_RENDER=renderGeneric;
DS.route('/explain/:p',function(ctx){return renderGeneric(ctx.params.p)});
function renderGeneric(pp){
  var P=pp.replace(/\.html$/,'').replace(/[^\w-]/g,'');
  DS.tab('grades');
  return enLoad().then(function(){return fetch(BASE+P+'.html',{cache:'no-cache'}).then(function(r){if(!r.ok)throw Error('x');return r.text()}).then(function(html){
    var doc=new DOMParser().parseFromString(html,'text/html'),m=doc.querySelector('main');if(!m)throw Error('m');
    var body=doc.body,label=body.dataset.navLabel||(doc.title||'').split(' | ')[0];
    var title=(m.querySelector('h1')||{}).textContent||label;
    DS.title(title.replace(/([!?])\.$/,'$1'),L(title).replace(/([!?])\.$/,'$1'));
    var head='',main='',aside='',teach=false,sec;
    [].forEach.call(m.children,function(s){
      if(s.tagName!=='SECTION')return;
      var intro=s.classList.contains('page-intro');
      [].forEach.call(s.childNodes,function(n){
        if(n.nodeType===3){if(n.textContent.trim())(intro?head:main).constructor;return}
        if(n.nodeType!==1)return;var cl=n.classList,t=n.tagName,o='';
        if(t==='SPAN'&&cl.contains('eyebrow')){head+='<span class="ds-tag ex-eb">'+h(L(n.textContent))+'</span> ';return}
        if(t==='P'&&cl.contains('eyebrow')){head+='<span class="ds-sub ex-eb2">'+h(L(n.textContent))+'</span> ';return}
        if(t==='H1'){head+='<h1'+(n.getAttribute('dir')?' dir="'+h(n.getAttribute('dir'))+'"':'')+'>'+(function(x){var m=x.match(/^(.*[!?])\.$/);return m?'<span aria-hidden="true">'+h(m[1])+'</span><span class="ds-sr" data-extra="1">'+h(x)+'</span>':h(x)})(L(n.textContent))+'</h1>';return}
        if(intro&&t==='P'){head+='<p class="ds-sub ex-lead"'+(n.getAttribute('dir')?' dir="'+h(n.getAttribute('dir'))+'"':'')+'>'+h(L(n.textContent))+'</p>';return}
        if(intro&&t==='A'){head+='<div class="ex-hcta">'+btn(n)+'</div>';return}
        if(t==='H2'){main+='<h2>'+h(L(n.textContent))+'</h2>';return}
        if(t==='P'){main+='<p class="ds-sub">'+h(L(n.textContent))+'</p>';return}
        if(n.id==='teach'){teach=true;main+='<div id="ex-teach" class="ds-stack"></div>';return}
        if(cl.contains('teach-block')){main+=note(n);return}
        if(n.querySelector('video')||cl.contains('video-wrap')){main+=video(n);return}
        if(cl.contains('actions')){main+='<div class="ex-actions">'+[].map.call(n.children,function(c){return btn(c)}).join('')+'</div>';return}
        if(cl.contains('unit-nav')){aside+='<div class="ex-nav">'+[].map.call(n.children,function(c){return btn(c,true)}).join('')+'</div>';return}
        if(cl.contains('es-skeleton'))return;
        main+='<div class="ds-card">'+h(L(n.textContent))+'</div>';
      });
    });
    var ft=doc.querySelector('footer');
    var out=crumbs(P,label)+'<header class="ds-hero">'+head+'</header><div class="ds-split ex-split"><div class="ds-stack ex-main">'+main+'</div><aside class="ds-stack ex-aside">'+aside+'</aside></div>'+(ft?footer(ft):'');
    var cur=body.dataset.curriculum,unit=body.dataset.unit;
    if(!cur){var a=/var un='([^']+)'/.exec(html),b=/fetch\('(curr-[^']+)'/.exec(html);if(a&&b){unit=a[1];cur=b[1]}}
    SPON=/^explain-sa-m2/.test(P);var need=teach&&cur;
    function fin(t){
      var wrap=document.createElement('div');wrap.innerHTML=out;
      var slot=wrap.querySelector('#ex-teach');if(slot){if(t!=null){slot.innerHTML=t}else slot.remove()}
      return wrap.innerHTML;
    }
    if(!need){setTimeout(wireAfter,0);return fin(teach?'<div class="ds-card ds-empty">'+DS.t('الشرح بيتجهز.','The explanation is getting ready.')+'</div>':null)}
    return fetch(abs(cur),{cache:'no-cache'}).then(function(r){if(!r.ok)throw Error('l');return r.json()}).then(function(d){
      var u=d.units.find(function(x){return x.id===unit});if(!u)throw Error('u');
      setTimeout(function(){wireAfter();document.body.dataset.teachingReady='true'},0);return fin(teachHtml(u));
    });
  });
  });
}
function wireAfter(){var r=document.getElementById('ds-main');if(r)wire(r)}
})();
