(function(){
"use strict";
var Q=new URLSearchParams(location.search);
var BASE=Q.get('base')||'../';
var V=document.body.getAttribute('data-v')||'1';
var NAVS={1:'pill',2:'dock',3:'top',4:'fab',5:'pill',6:'dock',7:'top',8:'fab'};
var NAV=NAVS[V];
if(Q.get('nofx'))document.body.classList.add('nofx');
if(NAV==='top')document.body.classList.add('top-nav');
var APP=document.getElementById('app');
var GR=[['kg1','KG1','كي جي ١'],['kg2','KG2','كي جي ٢'],['p1','1','الصف الأول الابتدائي'],['p2','2','الصف التاني الابتدائي'],['p3','3','الصف التالت الابتدائي'],['p4','4','الصف الرابع الابتدائي'],['p5','5','الصف الخامس الابتدائي'],['p6','6','الصف السادس الابتدائي'],['m1','1','الصف الأول الإعدادي'],['m2','2','الصف التاني الإعدادي'],['m3','3','الصف التالت الإعدادي']];
var IC={home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',play:'<rect x="3" y="5" width="18" height="14" rx="4"/><path d="M10 9l5 3-5 3z"/>',user:'<rect x="4" y="3" width="16" height="18" rx="4"/><path d="M8 9h8M8 13h8M8 17h5"/>',pen:'<path d="M4 20l4-1 11-11a2.1 2.1 0 0 0-3-3L5 16z"/>',star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',bot:'<rect x="4" y="7" width="16" height="12" rx="4"/><path d="M12 3v4M9 12h.01M15 12h.01"/>',chat:'<path d="M4 5h16v11H9l-5 4z"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'};
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
 var items=[['#/','home','الرئيسية'],['#/grades','grid','الصفوف'],['#/videos','play','الفيديوهات'],['#/me','user','تواصل']];
 var h='<nav class="nav nav-'+NAV+'">';
 items.forEach(function(it,i){
  if(NAV==='fab'&&i===2)h+='<a class="mid" href="#/practice" aria-label="تدريب">'+ic('pen')+'</a>';
  h+='<a class="nv'+(cur===it[0]?' on':'')+'" href="'+it[0]+'">'+ic(it[1])+'<span>'+it[2]+'</span></a>';
 });
 return h+'</nav>';
}
function shell(cur,html){APP.innerHTML='<div class="scr">'+html+'</div>'+nav(cur);window.scrollTo(0,0)}
function head(sub){return '<div class="top"><div class="brand">ENGLISH SAVANT<small>With Basem Hreaz</small></div><a class="ib" href="#/search" aria-label="بحث">'+ic('search')+'</a></div>'}
function gradeList(items){
 var s=NAV==='dock'?'grid':NAV==='fab'?'tl':NAV==='top'?'car':'list';
 var h='';
 items.forEach(function(g){
  var n=g[0],lb=g[1],nm=g[2];
  if(s==='grid')h+='<a class="card" href="#/g/'+n+'"><span class="big">'+lb+'</span><span><b style="font-size:14px">'+nm+'</b></span></a>';
  else if(s==='car')h+='<a class="card" href="#/g/'+n+'"><span class="tag" style="align-self:flex-start">'+(n[0]==='p'?'ابتدائي':n[0]==='m'?'إعدادي':'رياض أطفال')+'</span><b style="font-size:15px">'+nm+'</b></a>';
  else h+='<a class="card gl" href="#/g/'+n+'"><span class="num">'+lb+'</span><span class="tx"><b>'+nm+'</b><small>الوحدات والفيديوهات والتدريبات</small></span><span class="go">‹</span></a>';
 });
 if(s==='grid')return '<div class="grid2">'+h+'</div>';
 if(s==='car')return '<div class="car">'+h+'</div>';
 if(s==='tl')return '<div class="tl list">'+h+'</div>';
 return '<div class="list">'+h+'</div>';
}
function home(){
 var last=load("last",{g:"p3",u:"u1",t:"الصف التالت الابتدائي · Let's Learn Together!",p:30});
 J('lessons.json').then(function(d){
  var vc=d?d.lessons.filter(function(l){return !l.soon}).length:70;
  var hero=last?'<a class="card hero glass" href="#/u/'+last.g+'/'+last.u+'"><div class="t">كمّل من حيث وقفت</div><b>'+esc(last.t)+'</b><div class="bar"><i style="width:'+(last.p||35)+'%"></i></div></a>':
   '<div class="card hero glass"><div class="t">ابدأ رحلتك</div><b style="direction:rtl">اختار صفك وابدأ أول وحدة</b><a class="btn" href="#/grades">اختار الصف</a></div>';
  shell('#/',head()+'<div class="sub">أهلاً بيك يا بطل</div><h1>English with a<br>Genius Mindset</h1><div style="height:12px"></div>'+hero+
  '<div class="row" style="margin-top:12px"><div class="card stat"><div class="n">'+vc+'</div><div class="l">فيديو شرح</div></div><div class="card stat"><div class="n">11</div><div class="l">صف من KG لإعدادي</div></div></div>'+
  '<h2>ابدأ من هنا</h2><div class="qa"><a class="card" href="#/grades"><span class="ic">'+ic('grid')+'</span>الصفوف والوحدات</a><a class="card" href="#/videos"><span class="ic">'+ic('play')+'</span>فيديوهات الشرح</a><a class="card" href="#/practice"><span class="ic">'+ic('pen')+'</span>تدريبات بتصحيح فوري</a><a class="card" target="_blank" href="'+BASE+'assistant.html"><span class="ic">'+ic('bot')+'</span>مساعد الذكاء الاصطناعي</a></div>'+
  '<h2>الصفوف <a href="#/grades">عرض الكل</a></h2>'+gradeList(GR.slice(0,6)));
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
 shell('#/grades','<a class="back" href="#/grades">‹ الصفوف</a><h1>'+esc(gname(g))+'</h1><div class="sk"></div><div class="sk"></div><div class="sk"></div>');
 unitsOf(g).then(function(us){
  var h='<div class="list">';
  us.forEach(function(u){
   var isR=/^r/.test(u.id);
   h+='<a class="card gl" href="#/u/'+g+'/'+u.id+'"><span class="num">'+(isR?'R':u.n)+'</span><span class="tx"><b dir="ltr" style="text-align:right">'+esc(u.title)+'</b><small>'+(isR?'مراجعة':'وحدة '+u.n)+(u.lessons?' · '+u.lessons+' دروس':'')+(u.video&&!u.video.soon?' · فيديو':'')+'</small></span><span class="go">‹</span></a>';
  });
  h+='</div>';
  shell('#/grades','<a class="back" href="#/grades">‹ الصفوف</a><h1>'+esc(gname(g))+'</h1><div class="sub">اختار الوحدة: شرح، فيديو، وتدريبات</div><div style="height:14px"></div>'+h+orig('grade-'+g+'.html'));
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
  if(!u){shell('#/grades','<a class="back" href="#/g/'+g+'">‹ رجوع</a><div class="card">الوحدة مش موجودة</div>');return}
  save('last',{g:g,u:uid,t:gname(g)+' · '+u.title,p:30});
  var h='<a class="back" href="#/g/'+g+'">‹ '+esc(gname(g))+'</a><span class="tag">'+(/^r/.test(uid)?'مراجعة':'وحدة '+u.n)+'</span><h1 dir="ltr" style="text-align:right;margin-top:8px">'+esc(u.title)+'</h1><div style="height:12px"></div>'+vidHtml(u.video);
  h+='<div class="tabs"><a class="on" href="#/u/'+g+'/'+uid+'">الشرح</a><a href="#/p/'+g+'/'+uid+'">التدريبات</a><a href="'+BASE+'test-'+g+'.html" target="_blank">اختبر نفسك</a></div>';
  var d=u.u;
  if(d&&d.lessons&&d.lessons.length){h+='<h2>دروس الوحدة</h2><div class="list">'+d.lessons.map(function(l){return '<a class="card gl" href="#/p/'+g+'/'+uid+'/'+l.n+'"><span class="num">'+l.n+'</span><span class="tx"><b dir="ltr" style="text-align:right">'+esc(l.title)+'</b><small>ابدأ تدريبات الدرس</small></span><span class="go">‹</span></a>'}).join('')+'</div>'}
  if(d&&d.vocab&&d.vocab.length){h+='<h2>كلمات الوحدة</h2><div class="vocab">'+d.vocab.slice(0,40).map(function(w){return '<span>'+esc(w)+'</span>'}).join('')+'</div>'}
  if(d&&d.sentences&&d.sentences.length){h+='<h2>جمل مهمة</h2><div class="list">'+d.sentences.slice(0,6).map(function(s){return '<div class="card" dir="ltr" style="text-align:left">'+esc(typeof s==='string'?s:(s.en||s.text||s[0]||''))+'</div>'}).join('')+'</div>'}
  h+='<div style="margin-top:18px"><a class="btn" style="width:100%" href="#/p/'+g+'/'+uid+'">ابدأ التدريبات</a></div>';
  h+=orig(/^r/.test(uid)?('explain-'+g+'-'+uid+'.html'):('explain-'+g+'-'+uid+'.html'));
  shell('#/grades',h);
 });
}
function norm(s){return String(s).toLowerCase().replace(/\s+/g,' ').trim()}
function practice(g,uid,les){
 shell('#/grades','<div class="sk"></div><div class="sk"></div>');
 var n=(uid||'').replace('u','');
 var f='lesson-assessment-'+g+'-'+uid+'.json';
 Promise.all([J(f),J('curr-'+g+'.json')]).then(function(r){
  var bank=r[0],qs=[];
  if(bank){qs=bank.filter(function(x){return !les||String(x.lesson)===String(les)})}
  else if(r[1]){var u=r[1].units.filter(function(x){return x.id===uid})[0];if(u)(u.stations||[]).forEach(function(s){(s.questions||[]).forEach(function(q){if(q.type==='unscramble')qs.push({type:'unscramble',prompt:'رتّب الحروف: '+(q.hint&&q.hint.indexOf('images/')<0?q.hint:''),answer:q.answer[0],accept:q.answer,letters:String(q.letters).split(''),explanation_ar:'الإجابة الصح: '+q.answer[0]})})})}
  if(!qs.length){shell('#/grades','<a class="back" href="#/g/'+g+'">‹ رجوع</a><h1>التدريبات</h1><div class="card" style="margin-top:14px">تدريبات الوحدة دي بتفتح في الموقع الأصلي.</div><a class="btn" style="margin-top:14px" target="_blank" href="'+BASE+'assessments-'+g+'.html">افتح التدريبات ↗</a>');return}
  var pick=qs.filter(function(q){return ['mcq','typein','unscramble','reorder'].indexOf(q.type)>-1}).slice(0,10),i=0,score=0;
  function render(){
   if(i>=pick.length){shell('#/grades','<a class="back" href="#/u/'+g+'/'+uid+'">‹ الوحدة</a><div class="card hero" style="text-align:center"><div class="t">النتيجة</div><div class="big-t" style="margin:10px 0">'+score+' / '+pick.length+'</div><div class="sub">'+(score>=pick.length*.8?'ممتاز! كمّل بنفس المستوى':'كويس، جرّب تاني وهتتحسن')+'</div><div class="row" style="margin-top:16px"><a class="btn alt" href="#/u/'+g+'/'+uid+'">رجوع للوحدة</a><a class="btn" href="javascript:location.reload()">مرة تانية</a></div></div>');return}
   var q=pick[i],h='<a class="back" href="#/u/'+g+'/'+uid+'">‹ الوحدة</a><div class="bar"><i style="width:'+(i/pick.length*100)+'%"></i></div><div class="sub" style="margin-top:8px">سؤال '+(i+1)+' من '+pick.length+'</div><div class="q" id="q">'+esc(q.prompt)+'</div><div id="ans"></div><div id="fb"></div>';
   shell('#/grades',h);
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
function me(){shell('#/me',head()+'<h1>تواصل مع مستر باسم</h1><div class="sub">القراجة، كفر صقر، الشرقية · من السبت للخميس</div><div style="height:14px"></div><div class="list"><a class="card gl" target="_blank" href="https://wa.me/201156176205"><span class="num">'+ic('chat')+'</span><span class="tx"><b>واتساب</b><small>01156176205</small></span></a><a class="card gl" target="_blank" href="https://www.facebook.com/mrbasemhreaz"><span class="num">f</span><span class="tx"><b>فيسبوك</b></span></a><a class="card gl" target="_blank" href="https://www.instagram.com/mr.basemhreaz/"><span class="num">in</span><span class="tx"><b>إنستجرام</b></span></a><a class="card gl" target="_blank" href="https://www.tiktok.com/@mr.basemhreaz"><span class="num">tk</span><span class="tx"><b>تيك توك</b></span></a><a class="card gl" target="_blank" href="https://www.youtube.com/@EnglishSavantEG"><span class="num">yt</span><span class="tx"><b>يوتيوب</b></span></a></div>')}
function route(){
 var p=(location.hash||'#/').slice(2).split('/');
 var r=p[0];
 try{
 if(r===''||r==='search')home();else if(r==='grades')grades();else if(r==='g')grade(p[1]);else if(r==='u')unit(p[1],p[2]);else if(r==='p')practice(p[1],p[2],p[3]);else if(r==='videos')videos();else if(r==='practice')pickPractice();else if(r==='me')me();else home();
 }catch(e){home()}
}
window.addEventListener('hashchange',route);route();
})();
