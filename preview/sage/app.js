(function(){
"use strict";
var Q=new URLSearchParams(location.search);
var BASE=Q.get('base')||'../';
var CFG={nav:'g2',home:'a',gl:'list'};
if(Q.get('cfg')){var cp=Q.get('cfg').split(',');CFG={nav:cp[0],home:cp[1],gl:cp[2]}}
var SK='es-app-';var EN={"كل الصفوف والفيديوهات والتدريبات في مكان واحد": "All grades, videos and practice in one place", "تدريبات الوحدة دي بتفتح في الموقع الأصلي": "Practice for this unit opens on the main site", "اختار صفك وابدأ تدريبات بتصحيح فوري": "Pick your grade and start practice with instant feedback", "اختار الوحدة: شرح، فيديو، وتدريبات": "Pick a unit: explanation, video and practice", "الوحدات والفيديوهات والتدريبات": "Units, videos and practice", "افتح الصفحة الأصلية في الموقع": "Open the original page on the site", "فاتح أو داكن أو حسب الموبايل": "Light, dark or follow the phone", "ممتاز! كمّل بنفس المستوى": "Excellent! Keep it up", "كويس، جرّب تاني وهتتحسن": "Good, try again and you will improve", "مساعد الذكاء الاصطناعي": "AI assistant", "فيديو الوحدة دي قريباً": "This unit video is coming soon", "خصّص التطبيق زي ما تحب": "Make the app yours", "الصف التاني الابتدائي": "Primary 2", "الصف التالت الابتدائي": "Primary 3", "الصف الرابع الابتدائي": "Primary 4", "الصف الخامس الابتدائي": "Primary 5", "الصف السادس الابتدائي": "Primary 6", "فيديوهات الشرح لكل صف": "Explainer videos per grade", "الصف الأول الابتدائي": "Primary 1", "الصف التاني الإعدادي": "Prep 2", "الصف التالت الإعدادي": "Prep 3", "هنتعلم إيه النهارده؟": "what shall we learn today?", "شرح كل وحدة بالفيديو": "Every unit explained on video", "الصف الأول الإعدادي": "Prep 1", "ابحث عن درس أو وحدة": "Search a lesson or unit", "تدريبات بتصحيح فوري": "Practice with instant feedback", "ابدأ تدريبات الدرس": "Start lesson practice", "تواصل مع مستر باسم": "Contact Mr. Basem", "أهلاً بيك يا بطل": "Welcome, champ", "كمّل من حيث وقفت": "Continue where you left off", "لحد تالتة إعدادي": "to Prep 3", "الوحدة مش موجودة": "Unit not found", "الصفوف الدراسية": "Grades", "الصفوف والوحدات": "Grades and units", "فيديوهات الشرح": "Explainer videos", "ابدأ التدريبات": "Start practice", "افتح التدريبات": "Open practice", "أهلاً يا بطل": "Welcome, champ", "إزيك يا بطل،": "Hey champ,", "كمّل التعلّم": "Keep learning", "كلمات الوحدة": "Unit words", "الإجابة الصح": "The right answer", "اسأل أي سؤال": "Ask any question", "ابدأ من هنا": "Start here", "دروس الوحدة": "Unit lessons", "رجوع للوحدة": "Back to unit", "شوف النتيجة": "See result", "إجابة صحيحة": "Correct answer", "رتّب الحروف": "Arrange the letters", "نراجعها سوا": "Let's review it together", "أقسام سريعة": "Quick links", "رياض أطفال": "Kindergarten", "الفيديوهات": "Videos", "اختبر نفسك": "Test yourself", "العربية أو": "Arabic or", "التدريبات": "Practice", "الإعدادات": "Settings", "فيديو شرح": "explainer videos", "مرة تانية": "Try again", "الرئيسية": "Home", "عرض الكل": "See all", "منهج مصر": "Egyptian curriculum", "جمل مهمة": "Key phrases", "إنستجرام": "Instagram", "كي جي ١": "KG1", "كي جي ٢": "KG2", "ابتدائي": "Primary", "التدريب": "Practice", "لإعدادي": "to Prep", "المساعد": "Assistant", "النتيجة": "Result", "الإجابة": "Answer", "العربية": "العربية", "الإصدار": "Version", "إعدادي": "Prep", "الصفوف": "Grades", "الوحدة": "Unit", "مراجعة": "Review", "التالي": "Next", "المظهر": "Appearance", "تلقائي": "Auto", "واتساب": "WhatsApp", "فيسبوك": "Facebook", "فيديو": "videos", "صف من": "grades from", "الشرح": "Explain", "اللغة": "Language", "رجوع": "Back", "وحدة": "unit", "دروس": "lessons", "الصف": "Grade", "سؤال": "Question", "تحقق": "Check", "فاتح": "Light", "داكن": "Dark", "الكل": "All", "من": "of", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9", "٠": "0"};var EK=Object.keys(EN);
var ORIG=new WeakMap();
function trText(s){var o=s;for(var i=0;i<EK.length;i++){if(o.indexOf(EK[i])>-1)o=o.split(EK[i]).join(EN[EK[i]])}return o}
function translate(root){
 var en=langPref()==='en';var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),n,L=[];
 while(n=w.nextNode())L.push(n);
 L.forEach(function(t){var src=ORIG.has(t)?ORIG.get(t):t.nodeValue;if(!/[\u0600-\u06FF]/.test(src))return;ORIG.set(t,src);var v=en?trText(src):src;if(t.nodeValue!==v)t.nodeValue=v});
 [].forEach.call(root.querySelectorAll('[aria-label]'),function(e){var a=e.getAttribute('data-ar')||e.getAttribute('aria-label');e.setAttribute('data-ar',a);e.setAttribute('aria-label',en?trText(a):a)});
}

function sget(k){try{return localStorage.getItem(SK+k)}catch(e){return null}}
function sset(k,v){try{localStorage.setItem(SK+k,v)}catch(e){}}
var SYS=window.matchMedia&&matchMedia('(prefers-color-scheme:dark)');
function themePref(){if(Q.get('mode'))return Q.get('mode');try{var t=localStorage.getItem('es-theme');return t==='dark'||t==='light'?t:'auto'}catch(e){return 'auto'}}
function themeNow(){var p=themePref();return p==='auto'?(SYS&&SYS.matches?'dark':'light'):p}
var BAR={light:'#cbd6b8',dark:'#1a2618'};
function applyTheme(){var t=themeNow();document.documentElement.setAttribute('data-theme',t);document.body.classList.toggle('dark',t==='dark');var m=document.querySelector('meta[name=theme-color]');if(!m){m=document.createElement('meta');m.name='theme-color';document.head.appendChild(m)}m.content=BAR[t]}
function langPref(){if(Q.get('lang'))return Q.get('lang');try{return localStorage.getItem('es-interface-language')==='en'?'en':'ar'}catch(e){return 'ar'}}
function applyLang(){var l=langPref();document.documentElement.setAttribute('data-lang',l);if(typeof APP!=='undefined'&&APP)translate(APP)}
applyTheme();applyLang();if(SYS&&SYS.addEventListener)SYS.addEventListener('change',function(){if(themePref()==='auto')applyTheme()});
var NAV=CFG.nav;
if(Q.get('nofx'))document.body.classList.add('nofx');document.body.classList.add('gx');

var APP=document.getElementById('app');
var GR=[['kg1','KG1','كي جي ١'],['kg2','KG2','كي جي ٢'],['p1','1','الصف الأول الابتدائي'],['p2','2','الصف التاني الابتدائي'],['p3','3','الصف التالت الابتدائي'],['p4','4','الصف الرابع الابتدائي'],['p5','5','الصف الخامس الابتدائي'],['p6','6','الصف السادس الابتدائي'],['m1','1','الصف الأول الإعدادي'],['m2','2','الصف التاني الإعدادي'],['m3','3','الصف التالت الإعدادي']];
var IC={home:'<path d="M3.8 10.6 12 3.9l8.2 6.7"/><path d="M5.8 9.4V18a2.3 2.3 0 0 0 2.3 2.3h7.8a2.3 2.3 0 0 0 2.3-2.3V9.4"/><path d="M10 20.3v-4.4a1.1 1.1 0 0 1 1.1-1.1h1.8a1.1 1.1 0 0 1 1.1 1.1v4.4"/>',grid:'<rect x="4" y="4" width="6.6" height="6.6" rx="2"/><rect x="13.4" y="4" width="6.6" height="6.6" rx="2"/><rect x="4" y="13.4" width="6.6" height="6.6" rx="2"/><rect x="13.4" y="13.4" width="6.6" height="6.6" rx="2"/>',play:'<rect x="3.5" y="5.5" width="17" height="13" rx="3.8"/><path d="M10.3 9.4v5.2l4.4-2.6z"/>',pen:'<path d="M4.6 19.4l.9-3.9L16.1 4.9a2.1 2.1 0 0 1 3 3L8.5 18.5z"/><path d="M14.4 6.6l3 3"/>',gear:'<path d="M4 7.5h8.2M17.2 7.5H20M4 16.5h2.8M11.8 16.5H20"/><rect x="12.2" y="5.2" width="5" height="4.6" rx="1.6"/><rect x="6.8" y="14.2" width="5" height="4.6" rx="1.6"/>',user:'<rect x="8.4" y="3.8" width="7.2" height="7.2" rx="3"/><path d="M5 20c.5-3.4 3.2-5.2 7-5.2s6.5 1.8 7 5.2"/>',bolt:'<path d="M13.2 3.6 6 13.4h5.2l-.9 7 7.6-10h-5.3z"/>',bot:'<path d="M11 4.2c.5 3.6 2.4 5.5 6 6-3.6.5-5.5 2.4-6 6-.5-3.6-2.4-5.5-6-6 3.6-.5 5.5-2.4 6-6z"/><path d="M18 15.4c.2 1.5 1 2.3 2.4 2.5-1.4.2-2.2 1-2.4 2.5-.2-1.500-1-2.300-2.400-2.500 1.400-.2 2.200-1 2.400-2.500z"/>',chat:'<path d="M6.5 4.5h11a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-5.2l-3.7 3v-3H6.5a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3z"/>',search:'<rect x="4" y="4" width="12.6" height="12.6" rx="6"/><path d="M15.2 15.2 20 20"/>',chev:'<path d="M14.5 6.5L9 12l5.5 5.5"/>',back:'<path d="M9.5 6.5L15 12l-5.5 5.5"/>'};
function ic(n){return '<svg viewBox="0 0 24 24">'+IC[n]+'</svg>'}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var cache={};
function J(f){if(cache[f])return cache[f];return cache[f]=fetch(BASE+f).then(function(r){if(!r.ok)throw 0;return r.json()}).catch(function(){return null})}
function gname(g){for(var i=0;i<GR.length;i++)if(GR[i][0]===g)return GR[i][2];return g}
function glab(g){for(var i=0;i<GR.length;i++)if(GR[i][0]===g)return GR[i][1];return g}
function orig(p){return '<a class="orig" target="_blank" rel="noopener" href="'+BASE+p+'">افتح الصفحة الأصلية في الموقع ↗</a>'}
function save(k,v){try{localStorage.setItem('es-pv-'+k,JSON.stringify(v))}catch(e){}}
function load(k,d){try{var v=JSON.parse(localStorage.getItem('es-pv-'+k));return v==null?d:v}catch(e){return d}}
function nav(cur){
 if(/^g/.test(NAV)){
  var gi=[['#/','home','الرئيسية'],['#/grades','grid','الصفوف'],['#/practice','pen','التدريب'],['#/videos','play','الفيديوهات'],['#/me','gear','الإعدادات']];
  var on=cur;if(cur.indexOf('#/p')===0||cur==='#/practice')on='#/practice';else if(cur!=='#/'&&cur!=='#/grades'&&cur!=='#/videos'&&cur!=='#/me')on='#/grades';
  return '<div class="gfade"></div><nav class="nav-g '+NAV+'">'+gi.map(function(x){return '<a class="gb'+(on===x[0]?' on':'')+'" href="'+x[0]+'" aria-label="'+x[2]+'">'+ic(x[1])+'<span>'+x[2]+'</span></a>'}).join('')+'</nav>';
 }

 var it=[['#/','home','الرئيسية'],['#/grades','grid','الصفوف'],['#/videos','play','الفيديوهات'],['#/me','gear','الإعدادات']];
 var h='<nav class="nav nav-'+NAV+'">';
 function tab(x){return '<a class="nv'+(cur===x[0]?' on':'')+'" href="'+x[0]+'" aria-label="'+x[2]+'">'+ic(x[1])+'<span>'+x[2]+'</span></a>'}
 h+=tab(it[0])+tab(it[1])+'<a class="mid" href="#/practice" aria-label="تدريب">'+ic('pen')+'</a>'+tab(it[2])+tab(it[3]);
 return h+'</nav>';
}
function shell(cur,html){APP.innerHTML='<div class="scr">'+html+'</div>'+nav(cur);window.scrollTo(0,0);if(langPref()==='en')translate(APP)}
function head(sub){return '<div class="top"><div class="brand"><img src="'+BASE+'assets/adults-logo.webp" width="40" height="40" alt=""><span>ENGLISH SAVANT<small>With Basem Hreaz</small></span></div></div>'}
function gradeList(items){
 var s=CFG.gl;
 var h='';
 items.forEach(function(g){
  var n=g[0],lb=g[1],nm=g[2];
  if(s==='grid')h+='<a class="card" href="#/g/'+n+'"><span class="big">'+lb+'</span><span><b style="font-size:14px">'+nm+'</b></span></a>';
  else if(s==='car')h+='<a class="card" href="#/g/'+n+'"><span class="tag" style="align-self:flex-start">'+(n[0]==='p'?'ابتدائي':n[0]==='m'?'إعدادي':'رياض أطفال')+'</span><b style="font-size:15px">'+nm+'</b></a>';
  else h+='<a class="card gl" href="#/g/'+n+'"><span class="num">'+lb+'</span><span class="tx"><b>'+nm+'</b><small>الوحدات والفيديوهات والتدريبات</small></span><span class="go">'+ic('chev')+'</span></a>';
 });
 if(s==='grid')return '<div class="grid2">'+h+'</div>';
 if(s==='car')return '<div class="car">'+h+'</div>';
 if(s==='tl')return '<div class="tl list">'+h+'</div>';
 return '<div class="list">'+h+'</div>';
}
function posterOf(l){return l&&l.poster?BASE+l.poster+(l.media_version?'?v='+l.media_version:''):''}
function home(){
 var last=load('last',{g:'p3',u:'u1',t:"Let's Learn Together!",gn:'الصف التالت الابتدائي',p:30});
 J('lessons.json').then(function(d){
  var L=d?d.lessons:[],vc=L.filter(function(l){return !l.soon}).length;
  var pv=L.filter(function(l){return l.id==='p3-u1-lesson'})[0];
  var cont='<a class="card hero" href="#/u/'+last.g+'/'+last.u+'" style="'+(CFG.home==='c'&&pv?'background-image:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.55)),url('+posterOf(pv)+');background-size:cover;background-position:center;color:#fff;min-height:190px;display:flex;flex-direction:column;justify-content:flex-end':'')+'"><div class="t">'+(last.gn||gname(last.g))+' · كمّل من حيث وقفت</div><b dir="auto">'+esc(last.t)+'</b><div class="bar"><i style="width:'+(last.p||30)+'%"></i></div></a>';
  var stats='<div class="row"><div class="card stat"><div class="n">'+vc+'</div><div class="l">فيديو شرح</div></div><div class="card stat"><div class="n">11</div><div class="l">صف من KG لإعدادي</div></div></div>';
  var qa='<div class="qa"><a class="card" href="#/grades"><span class="ic">'+ic('grid')+'</span><span>الصفوف والوحدات</span></a><a class="card" href="#/videos"><span class="ic">'+ic('play')+'</span><span>فيديوهات الشرح</span></a><a class="card" href="#/practice"><span class="ic">'+ic('pen')+'</span><span>تدريبات بتصحيح فوري</span></a><a class="card" target="_blank" href="'+BASE+'assistant.html"><span class="ic">'+ic('bot')+'</span><span>مساعد الذكاء الاصطناعي</span></a></div>';
  var hd='<div class="top"><div class="brand"><img src="'+BASE+'assets/adults-logo.webp" width="40" height="40" alt=""><span>ENGLISH SAVANT<small>With Basem Hreaz</small></span></div></div>';
  var h;
  if(CFG.home==='a'){h=hd+'<div class="sub">أهلاً بيك يا بطل</div><h1>English with a Genius Mindset</h1><div style="height:14px"></div>'+cont+'<div style="height:12px"></div>'+stats+'<h2>ابدأ من هنا</h2>'+qa+'<h2>الصفوف <a href="#/grades">عرض الكل</a></h2>'+gradeList(GR.slice(0,6));}
  else if(CFG.home==='b'){h=hd+'<h1 class="big-t">إزيك يا بطل،<br>هنتعلم إيه النهارده؟</h1><div style="height:14px"></div><div class="chips">'+GR.map(function(g,i){return '<a class="chip'+(g[0]==='p3'?' on':'')+'" href="#/g/'+g[0]+'">'+g[2].replace('الصف ','')+'</a>'}).join('')+'</div><div style="height:6px"></div>'+cont+'<h2>كمّل التعلّم</h2><div class="list">'+L.filter(function(l){return !l.soon&&l.grade==='p3'}).slice(0,3).map(function(l){var m=l.id.match(/-(u\d)/);return '<a class="card gl" href="#/u/p3/'+(m?m[1]:'u1')+'"><span class="thumb" style="background-image:url('+posterOf(l)+')"></span><span class="tx"><b dir="auto">'+esc(l.title)+'</b><small>'+esc(l.duration)+' · فيديو شرح</small></span></a>'}).join('')+'</div>'+'<h2>أقسام سريعة</h2>'+qa;}
  else{h=hd+'<h1>أهلاً يا بطل</h1><div class="sub">كل الصفوف والفيديوهات والتدريبات في مكان واحد</div><div style="height:14px"></div><div class="bento"><div class="b2">'+cont+'</div><a class="card" href="#/grades"><span class="ic">'+ic('grid')+'</span><b>الصفوف</b><small>11 صف</small></a><a class="card" href="#/videos"><span class="ic">'+ic('play')+'</span><b>الفيديوهات</b><small>'+vc+' فيديو</small></a><a class="card" href="#/practice"><span class="ic">'+ic('pen')+'</span><b>التدريبات</b><small>تصحيح فوري</small></a><a class="card" target="_blank" href="'+BASE+'assistant.html"><span class="ic">'+ic('bot')+'</span><b>المساعد</b><small>اسأل أي سؤال</small></a></div><h2>الصفوف <a href="#/grades">عرض الكل</a></h2>'+gradeList(GR.slice(2,8));}
  if(/^g/.test(NAV)){
   var cnt={};L.forEach(function(l){if(!l.soon)cnt[l.grade]=(cnt[l.grade]||0)+1});
   var ks=['p1','p2','p3','p4','p5','p6'],mx=Math.max.apply(null,ks.map(function(k){return cnt[k]||0}).concat([1]));
   var lab=['١','٢','٣','٤','٥','٦'];
   var chart='<div class="card chart"><div class="ct"><small>فيديوهات الشرح لكل صف</small><b>'+vc+' <span>فيديو</span></b></div><div class="bars">'+ks.map(function(k,i){var v=cnt[k]||0;return '<div class="bc"><i class="'+(k==='p3'?'hi':'')+'" style="height:'+Math.max(14,Math.round(v/mx*100))+'%"></i><span>'+lab[i]+'</span></div>'}).join('')+'</div></div><div style="height:6px"></div>';
   var sr='<div class="card search">'+ic('search')+'<span>ابحث عن درس أو وحدة</span></div><div style="height:12px"></div>';
   h=h.replace(hd,hd+sr).replace('<h2>',chart+'<h2>');
  }
  shell('#/',h);
 });
}
function grades(){shell('#/grades',head()+'<h1>الصفوف الدراسية</h1><div class="sub">منهج مصر · KG1 لحد تالتة إعدادي</div><div style="height:14px"></div>'+gradeList(GR)+orig('grades.html'))}
function unitsOf(g){
 return Promise.all([J('curr-'+g+'.json'),J('lessons.json')]).then(function(r){
  var c=r[0],L=r[1]?r[1].lessons:[],out=[];
  if(c){c.units.forEach(function(u){out.push({id:u.id,n:u.num,title:u.title,lessons:(u.lessons||[]).length,u:u})})}
  else{L.filter(function(l){return l.grade===g}).forEach(function(l,i){out.push({id:'u'+(i+1),n:i+1,title:l.title,lessons:0,kg:true})})}
  out.forEach(function(o){o.video=L.filter(function(l){return l.grade===g&&(new RegExp('^'+g+'-'+o.id+'(-|$)')).test(l.id)})[0]||(o.kg?L.filter(function(l){return l.grade===g})[o.n-1]:null)});
  return out;
 });
}
function grade(g){
 shell('#/grades','<a class="back" href="#/grades">'+ic('back')+' الصفوف</a><h1>'+esc(gname(g))+'</h1><div class="sk"></div><div class="sk"></div><div class="sk"></div>');
 unitsOf(g).then(function(us){
  var h='<div class="list">';
  us.forEach(function(u){
   var isR=/^r/.test(u.id);
   h+='<a class="card gl" href="#/u/'+g+'/'+u.id+'"><span class="num">'+(isR?'R':u.n)+'</span><span class="tx"><b dir="ltr" style="text-align:right">'+esc(u.title)+'</b><small>'+(isR?'مراجعة':'وحدة '+u.n)+(u.lessons?' · '+u.lessons+' دروس':'')+(u.video&&!u.video.soon?' · فيديو':'')+'</small></span><span class="go">'+ic('chev')+'</span></a>';
  });
  h+='</div>';
  shell('#/grades','<a class="back" href="#/grades">'+ic('back')+' الصفوف</a><h1>'+esc(gname(g))+'</h1><div class="sub">اختار الوحدة: شرح، فيديو، وتدريبات</div><div style="height:14px"></div>'+h+orig('grade-'+g+'.html'));
 });
}
function vidHtml(v){
 if(!v||v.soon)return '<div class="card noV">فيديو الوحدة دي قريباً</div>';
 if(v.mp4){var q=v.media_version?'?v='+v.media_version:'';return '<div class="vid"><video controls preload="none" playsinline poster="'+(v.poster?BASE+v.poster+q:'')+'" src="'+BASE+v.mp4+q+'"></video></div>'}
 if(v.youtube)return '<div class="vid"><iframe loading="lazy" allowfullscreen src="https://www.youtube.com/embed/'+esc(v.youtube)+'"></iframe></div>';
 return '<div class="card noV">فيديو الوحدة دي قريباً</div>';
}
function unit(g,uid){
 shell('#/grades','<div class="sk"></div><div class="sk"></div>');
 unitsOf(g).then(function(us){
  var u=us.filter(function(x){return x.id===uid})[0];
  if(!u){shell('#/grades','<a class="back" href="#/g/'+g+'">'+ic('back')+' رجوع</a><div class="card">الوحدة مش موجودة</div>');return}
  save('last',{g:g,u:uid,t:u.title,gn:gname(g),p:30});
  var h='<a class="back" href="#/g/'+g+'">'+ic('back')+' '+esc(gname(g))+'</a><span class="tag">'+(/^r/.test(uid)?'مراجعة':'وحدة '+u.n)+'</span><h1 dir="ltr" style="text-align:right;margin-top:8px">'+esc(u.title)+'</h1><div style="height:12px"></div>'+vidHtml(u.video);
  h+='<div class="tabs"><a class="on" href="#/u/'+g+'/'+uid+'">الشرح</a><a href="#/p/'+g+'/'+uid+'">التدريبات</a><a href="'+BASE+'test-'+g+'.html" target="_blank">اختبر نفسك</a></div>';
  var d=u.u;
  if(d&&d.lessons&&d.lessons.length){h+='<h2>دروس الوحدة</h2><div class="list">'+d.lessons.map(function(l){return '<a class="card gl" href="#/p/'+g+'/'+uid+'/'+l.n+'"><span class="num">'+l.n+'</span><span class="tx"><b dir="ltr" style="text-align:right">'+esc(l.title)+'</b><small>ابدأ تدريبات الدرس</small></span><span class="go">'+ic('chev')+'</span></a>'}).join('')+'</div>'}
  if(d&&d.vocab&&d.vocab.length){h+='<h2>كلمات الوحدة</h2><div class="vocab">'+d.vocab.slice(0,40).map(function(w){return '<span>'+esc(w)+'</span>'}).join('')+'</div>'}
  if(d&&d.sentences&&d.sentences.length){h+='<h2>جمل مهمة</h2><div class="list">'+d.sentences.slice(0,6).map(function(s){return '<div class="card" dir="ltr" style="text-align:left">'+esc(typeof s==='string'?s:(s.en||s.text||s[0]||''))+'</div>'}).join('')+'</div>'}
  h+='<div style="margin-top:18px"><a class="btn" style="width:100%" href="#/p/'+g+'/'+uid+'">ابدأ التدريبات</a></div>';
  h+=orig(/^r/.test(uid)?('explain-'+g+'-'+uid+'.html'):('explain-'+g+'-'+uid+'.html'));
  shell('#/grades',h);
 });
}
function norm(s){return String(s).toLowerCase().replace(/\s+/g,' ').trim()}
function practice(g,uid,les){
 shell('#/practice','<div class="sk"></div><div class="sk"></div>');
 var n=(uid||'').replace('u','');
 var f='lesson-assessment-'+g+'-'+uid+'.json';
 Promise.all([J(f),J('curr-'+g+'.json')]).then(function(r){
  var bank=r[0],qs=[];
  if(bank){qs=bank.filter(function(x){return !les||String(x.lesson)===String(les)})}
  else if(r[1]){var u=r[1].units.filter(function(x){return x.id===uid})[0];if(u)(u.stations||[]).forEach(function(s){(s.questions||[]).forEach(function(q){if(q.type==='unscramble')qs.push({type:'unscramble',prompt:'رتّب الحروف: '+(q.hint&&q.hint.indexOf('images/')<0?q.hint:''),answer:q.answer[0],accept:q.answer,letters:String(q.letters).split(''),explanation_ar:'الإجابة الصح: '+q.answer[0]})})})}
  if(!qs.length){shell('#/practice','<a class="back" href="#/g/'+g+'">'+ic('back')+' رجوع</a><h1>التدريبات</h1><div class="card" style="margin-top:14px">تدريبات الوحدة دي بتفتح في الموقع الأصلي.</div><a class="btn" style="margin-top:14px" target="_blank" href="'+BASE+'assessments-'+g+'.html">افتح التدريبات ↗</a>');return}
  var pick=qs.filter(function(q){return ['mcq','typein','unscramble','reorder'].indexOf(q.type)>-1}).slice(0,10),i=0,score=0;
  function render(){
   if(i>=pick.length){shell('#/practice','<a class="back" href="#/u/'+g+'/'+uid+'">'+ic('back')+' الوحدة</a><div class="card hero" style="text-align:center"><div class="t">النتيجة</div><div class="big-t" style="margin:10px 0">'+score+' / '+pick.length+'</div><div class="sub">'+(score>=pick.length*.8?'ممتاز! كمّل بنفس المستوى':'كويس، جرّب تاني وهتتحسن')+'</div><div class="row" style="margin-top:16px"><a class="btn alt" href="#/u/'+g+'/'+uid+'">رجوع للوحدة</a><a class="btn" href="javascript:location.reload()">مرة تانية</a></div></div>');return}
   var q=pick[i],h='<a class="back" href="#/u/'+g+'/'+uid+'">'+ic('back')+' الوحدة</a><div class="bar"><i style="width:'+(i/pick.length*100)+'%"></i></div><div class="sub" style="margin-top:8px">سؤال '+(i+1)+' من '+pick.length+'</div><div class="q" id="q">'+esc(q.prompt)+'</div><div id="ans"></div><div id="fb"></div>';
   shell('#/practice',h);
   var A=document.getElementById('ans'),FB=document.getElementById('fb');
   function done(ok){if(ok)score++;FB.innerHTML='<div class="card fb"><div class="h">'+(ok?'إجابة صحيحة ✓':'نراجعها سوا')+'</div>'+esc(q.explanation_ar||('الإجابة: '+q.answer))+'<div dir="ltr" style="text-align:left;margin-top:6px;color:var(--muted)">'+(ok?'':'Correct: '+esc(q.answer))+'</div></div><button class="btn" style="width:100%;margin-top:12px" id="nx">'+(i+1>=pick.length?'شوف النتيجة':'التالي')+'</button>';document.getElementById('nx').onclick=function(){i++;render()}}
   if(q.type==='mcq'){
    (q.options||[]).forEach(function(o){var b=document.createElement('button');b.className='opt';b.textContent=o;b.onclick=function(){var ok=norm(o)===norm(q.answer);[].forEach.call(A.children,function(x){x.disabled=true;if(norm(x.textContent)===norm(q.answer))x.classList.add('ok')});if(!ok)b.classList.add('no');done(ok)};A.appendChild(b)});
   }else if(q.type==='reorder'||q.type==='unscramble'){
    var tokens=(q.words||q.letters||[]).slice(),chosen=[],isW=q.type==='reorder';
    A.innerHTML='<div class="tk" id="ch" style="border-bottom:2px dashed var(--gb);padding-bottom:10px"></div><div class="tk" id="pl"></div><button class="btn" style="width:100%;margin-top:8px" id="ck">تحقق</button>';
    var ch=document.getElementById('ch'),pl=document.getElementById('pl');
    function draw(){ch.innerHTML='';pl.innerHTML='';chosen.forEach(function(t,k){var b=document.createElement('button');b.textContent=t[0];b.onclick=function(){chosen.splice(k,1);draw()};ch.appendChild(b)});tokens.forEach(function(t,k){if(chosen.some(function(c){return c[1]===k}))return;var b=document.createElement('button');b.textContent=t;b.onclick=function(){chosen.push([t,k]);draw()};pl.appendChild(b)})}
    draw();
    document.getElementById('ck').onclick=function(){var v=chosen.map(function(c){return c[0]}).join(isW?' ':'').replace(/ ([.,!?])/g,'$1');var ok=(q.accept||[q.answer]).some(function(a){return norm(a)===norm(v)});this.remove();done(ok)};
   }else{
    A.innerHTML='<input class="inp" id="in" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="btn" style="width:100%;margin-top:10px" id="ck">تحقق</button>';
    document.getElementById('ck').onclick=function(){var v=document.getElementById('in').value;var ok=(q.accept||[q.answer]).some(function(a){return norm(a)===norm(v)});this.remove();document.getElementById('in').disabled=true;done(ok)};
   }
   if(Q.get('shot')==='ans'&&i===0&&q.type==='mcq'){setTimeout(function(){[].forEach.call(A.children,function(x){if(norm(x.textContent)===norm(q.answer))x.click()})},50)}
  }
  render();
 });
}
function videos(){
 shell('#/videos',head()+'<h1>فيديوهات الشرح</h1><div class="sub">شرح كل وحدة بالفيديو</div><div class="sk"></div><div class="sk"></div>');
 J('lessons.json').then(function(d){
  var L=d?d.lessons.filter(function(l){return !l.soon&&l.mp4&&l.grade!=='sa-g1'}):[];
  var gsel=Q.get('g')||'';
  var chips='<div class="chips"><a class="chip on" href="#/videos">الكل</a>'+GR.map(function(g){return '<a class="chip" href="#/g/'+g[0]+'">'+g[2].replace('الصف ','')+'</a>'}).join('')+'</div>';
  var h=L.slice(0,12).map(function(l){var q=l.media_version?'?v='+l.media_version:'';var m=l.id.match(/^([a-z0-9]+)-(u\d|r\d)/);return '<a class="card" style="padding:10px" href="#/u/'+l.grade+'/'+(m?m[2]:'u1')+'"><div style="display:flex;gap:12px;align-items:center"><div style="width:120px;aspect-ratio:16/9;border-radius:14px;background:var(--soft) center/cover url('+(l.poster?BASE+l.poster+q:'')+');flex:none;display:flex;align-items:center;justify-content:center;color:#fff">▶</div><div style="min-width:0"><div class="tag">'+esc(gname(l.grade).replace('الصف ',''))+' · '+esc(l.duration)+'</div><b dir="ltr" style="display:block;text-align:right;font-size:14px;margin-top:6px">'+esc(l.title)+'</b></div></div></a>'}).join('');
  shell('#/videos',head()+'<h1>فيديوهات الشرح</h1><div class="sub">شرح كل وحدة بالفيديو</div><div style="height:12px"></div>'+chips+'<div class="list" style="margin-top:8px">'+h+'</div>');
 });
}
function pickPractice(){shell('#/practice',head()+'<h1>التدريبات</h1><div class="sub">اختار صفك وابدأ تدريبات بتصحيح فوري</div><div style="height:14px"></div>'+gradeList(GR.slice(2)))}
function me(){
 var tp=themePref(),lg=langPref();
 function seg(id,items,cur){return '<div class="seg" id="'+id+'">'+items.map(function(x){return '<a role="button" tabindex="0" data-v="'+x[0]+'" class="'+(cur===x[0]?'on':'')+'">'+x[1]+'</a>'}).join('')+'</div>'}
 function row(t,s,ctl){return '<div class="card srow"><div class="tx"><b>'+t+'</b><small>'+s+'</small></div>'+ctl+'</div>'}
 function lnk(n,t,s,h){return '<a class="card gl" target="_blank" rel="noopener" href="'+h+'"><span class="num">'+n+'</span><span class="tx"><b>'+t+'</b><small>'+s+'</small></span></a>'}
 shell('#/me',head()+'<h1>الإعدادات</h1><div class="sub">خصّص التطبيق زي ما تحب</div><div style="height:16px"></div>'+
 '<div class="list">'+row('المظهر','فاتح أو داكن أو حسب الموبايل',seg('sgT',[['light','فاتح'],['dark','داكن'],['auto','تلقائي']],tp))+row('اللغة','العربية أو English',seg('sgL',[['ar','العربية'],['en','English']],lg))+'</div>'+
 '<h2>تواصل مع مستر باسم</h2><div class="list">'+lnk(ic('chat'),'واتساب','01156176205','https://wa.me/201156176205')+lnk('f','فيسبوك','English Savant','https://www.facebook.com/mrbasemhreaz')+lnk('in','إنستجرام','@mr.basemhreaz','https://www.instagram.com/mr.basemhreaz/')+'</div>'+
 '<div class="sub" style="text-align:center;margin-top:24px">ENGLISH SAVANT · الإصدار 3.0</div>');
 function wire(id,fn){var s=document.getElementById(id);[].forEach.call(s.children,function(a){var go=function(){fn(a.getAttribute('data-v'));[].forEach.call(s.children,function(b){b.classList.toggle('on',b===a)})};a.addEventListener('click',go);a.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})})}
 wire('sgT',function(v){try{if(v==='auto')localStorage.removeItem('es-theme');else localStorage.setItem('es-theme',v)}catch(e){}applyTheme()});
 wire('sgL',function(v){try{localStorage.setItem('es-interface-language',v)}catch(e){}applyLang();try{window.dispatchEvent(new CustomEvent('es:interface-language',{detail:{language:v}}))}catch(e){}});
}
function route(){
 var p=(location.hash||'#/').slice(2).split('/');
 var r=p[0];
 try{
 if(r===''||r==='search')home();else if(r==='grades')grades();else if(r==='g')grade(p[1]);else if(r==='u')unit(p[1],p[2]);else if(r==='p')practice(p[1],p[2],p[3]);else if(r==='videos')videos();else if(r==='practice')pickPractice();else if(r==='me')me();else home();
 }catch(e){home()}
}
if(Q.get('audit')){setTimeout(function(){var bad=[],W=window.innerWidth;[].forEach.call(document.querySelectorAll('#app *'),function(e){if(e.closest('.chips,.car,.vid,.nav'))return;var r=e.getBoundingClientRect();if(!r.width)return;if(r.left<-1||r.right>W+1)bad.push('OUT '+e.tagName+'.'+e.className+' '+Math.round(r.left)+'..'+Math.round(r.right));var cs=getComputedStyle(e);if(e.scrollWidth>e.clientWidth+1&&cs.display!=='inline'&&cs.overflowX==='visible'&&e.children.length===0)bad.push('CLIP '+e.tagName+'.'+e.className+' '+e.textContent.slice(0,20))});var n=document.createElement('pre');n.id='audit';n.textContent='AUDIT '+W+' '+(bad.length?bad.join(' | '):'clean');document.body.appendChild(n)},3500)}
window.addEventListener('es:interface-language',function(){translate(APP)});window.addEventListener('hashchange',route);route();
})();

