/* ENGLISH SAVANT · family routes on ds.js: grades, grade hubs, video library, watch, courses overview. Content comes from fam-data.js (old pages, AR and EN verbatim). */
(function(){
'use strict';
var F=window.FAMD,esc=DS.esc,Q=new URLSearchParams(location.search);
var BASE=Q.get('fambase')||window.FAM_BASE||'';
var FAM=window.FAM={links:{}};
function L(o){return o[DS.lang()]}
function RT(h){
 if(!h)return '#/';
 if(/^https?:/.test(h))return h;
 var f=h.split('#')[0],q=f.indexOf('?')>-1?f.slice(f.indexOf('?')):'';f=f.split('?')[0];
 if(FAM.links[f])return FAM.links[f];
 var m;
 if(f==='index.html')return '#/';
 if(f==='grades.html')return '#/grades';
 if(f==='courses.html')return '#/courses';
 if(f==='lessons.html')return '#/videos';
 if(f==='watch.html'&&(m=/lesson=([^&]+)/.exec(q)))return '#/watch/'+m[1];
 if(m=/^grade-([a-z0-9-]+)\.html$/.exec(f))return '#/grade/'+m[1];
 if(m=/^videos-([a-z0-9-]+)\.html$/.exec(f))return '#/videos/'+m[1];
 return '#/page/'+f+q;
}
function A(h,cls,inner,extra){var ext=/^https?:/.test(h);return '<a'+(cls?' class="'+cls+'"':'')+' href="'+esc(ext?h:RT(h))+'"'+(ext?' target="_blank" rel="noopener"':'')+(extra||'')+'>'+inner+'</a>'}
function ltr(s){return '<span class="ds-ltr">'+esc(s)+'</span>'}
function crumbs(k){
 var a=F.hubs[k]?F.hubs[k].ar.crumbs:k.ar.crumbs,e=F.hubs[k]?F.hubs[k].en.crumbs:k.en.crumbs;
 return DS.ui.crumbs(a.map(function(c,i){return [c[0]?RT(c[0]):'',c[1],e[i][1]]}));
}
function crumbsOf(d){return DS.ui.crumbs(d.ar.crumbs.map(function(c,i){return [c[0]?RT(c[0]):'',c[1],d.en.crumbs[i][1]]}))}
function head(d,o){o=o||{};var x=L(d);
 return '<header class="fam-head">'+(o.back?'<a class="ds-back" href="'+esc(RT(o.back))+'">'+DS.icon('back')+'<span>'+esc(DS.t(d.ar.back[1],d.en.back[1]))+'</span></a>':'')+
 (x.eyebrow?'<span class="ds-tag">'+esc(x.eyebrow)+'</span>':'')+'<h1>'+(o.h1html?x.h1:esc(x.h1))+'</h1>'+(x.lead?'<p class="lead">'+esc(x.lead)+'</p>':'')+'</header>'}
/* ---------- grade hub ---------- */
function gradeRoute(ctx){
 var k='grade-'+ctx.params.g,d=F.hubs[k];
 if(!d){DS.title('مش لاقيين الصفحة دي','Page not found');return DS.ui.empty('الصف ده مش موجود.','This grade does not exist.')}
 DS.tab('grades');DS.title(d.ar.h1,d.en.h1);
 var x=L(d);
 var tiles=x.entries.map(function(e){
  return '<a class="ds-card fam-entry" href="'+esc(RT(e.href))+'"><span class="ds-tile ds-tile--lg">'+e.svg+'</span><h3>'+esc(e.h)+'</h3><p>'+esc(e.p)+'</p><span class="fam-open">'+esc(e.open)+DS.icon('chev')+'</span></a>'}).join('');
 var extras=(x.extras||[]).map(function(e){return '<div class="ds-card fam-cta"><h3>'+esc(e.h)+'</h3>'+(e.p?'<p class="ds-sub">'+esc(e.p)+'</p>':'')+'<div class="ds-row">'+e.links.map(function(l){return A(l[0],'ds-btn ds-btn--soft',esc(l[1]))}).join('')+'</div></div>'}).join('');
 return crumbsOf(d)+head(d)+'<div class="ds-grid ds-grid--2 fam-grid" role="group" aria-label="'+esc(DS.t('أقسام الصف','Grade sections'))+'">'+tiles+'</div>'+(extras?'<div class="ds-grid ds-grid--2" style="margin-top:16px">'+extras+'</div>':'');
}
/* ---------- grade videos ---------- */
function card(c,en){return ''}
function videosRoute(ctx){
 var g=ctx.params.g,k='videos-'+g,d=F.hubs[k];
 if(!d){DS.title('مش لاقيين الصفحة دي','Page not found');return DS.ui.empty('الفيديوهات دي مش موجودة.','These videos do not exist.')}
 DS.tab('videos');DS.title(d.ar.h1,d.en.h1);
 var x=L(d),body;
 var pre=(x.cards.length?lessons().catch(function(){return null}):Promise.resolve(null));
 return pre.then(function(items){
 if(items){var live=items.filter(function(l){return l.grade===g});
  if(live.length){var lab=x.cards[0].label,en=DS.lang()==='en';
   x=Object.assign({},x,{cards:live.map(function(l){return {href:'watch.html?lesson='+l.id,img:l.poster||(l.mp4?l.mp4.replace(/\.mp4$/,'.jpg'):'https://i.ytimg.com/vi/'+l.youtube+'/hqdefault.jpg'),alt:l.title,chip:en?(F.parts[l.part]||l.part):l.part,title:l.title,dur:l.duration||'',label:lab}})})}}
 if(x.cards.length){
  body='<div class="ds-grid fam-vgrid">'+x.cards.map(function(c){
   return A(c.href,'ds-card fam-vcard','<div class="ds-video"><img src="'+esc((/^https?:/.test(c.img)?'':BASE)+c.img)+'" alt="'+esc(c.alt)+'" loading="lazy" width="480" height="270"><span class="fam-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8.5 5.6v12.8a1 1 0 0 0 1.5.86l10.2-6.4a1 1 0 0 0 0-1.72L10 4.74a1 1 0 0 0-1.5.86z"/></svg></span></div><span class="ds-tag">'+esc(c.chip)+'</span><h3 dir="auto">'+esc(c.title)+'</h3><p class="meta">'+(c.dur?ltr(c.dur)+' · ':'')+esc(c.label)+'</p>')}).join('')+'</div>';
 }else if(x.empty){
  body='<div class="ds-empty fam-empty"><h2>'+esc(x.empty.h)+'</h2><p>'+esc(x.empty.p)+'</p><a class="ds-btn ds-btn--soft" href="'+esc(RT(d.ar.back[0]))+'">'+esc(x.back[1])+'</a></div>';
 }else body=DS.ui.empty('لسه مفيش فيديوهات هنا.','No videos here yet.');
  var cr=crumbsOf(d);
 return cr+head(d,{back:d.ar.back[0]})+body;
 });
}
/* ---------- video library ---------- */
var LJ=null;
function lessons(){return LJ||(LJ=fetch(BASE+'lessons.json?v=fam').then(function(r){if(!r.ok)throw Error('lessons');return r.json()}).then(function(j){return (j.lessons||[]).filter(function(l){return l&&typeof l.id==='string'&&!l.soon&&(l.mp4||l.youtube)})}))}
function unitOf(l){var m=/(?:^|-)u(\d+)(?:-|$)/.exec(l.id);if(m)return m[1];m=/Unit\s*(\d+)/i.exec(l.title||'');return m?m[1]:''}
function player(l){
 var el;
 if(l.mp4){var v=/^[a-f0-9]{12}$/.test(l.media_version||'')?'?v='+l.media_version:'';var poster=l.poster||l.mp4.replace(/\.mp4$/,'.jpg');
  return '<video controls playsinline preload="none" poster="'+esc(BASE+poster+v)+'" src="'+esc((/^https:/.test(l.mp4)?'':BASE)+l.mp4+v)+'" aria-label="'+esc(l.title)+'"></video>'}
 if(/^[A-Za-z0-9_-]{11}$/.test(l.youtube||''))return '<iframe src="https://www.youtube.com/embed/'+esc(l.youtube)+'?autoplay=1" title="'+esc(l.title)+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
 return '';
}
function libRoute(){
 var d=F.misc.lessons;DS.tab('videos');DS.title(d.ar.h1text.replace(/\.$/,''),d.en.h1text.replace(/\.$/,''));var x=L(d);
 var st={g:'all',u:'all'};
 return lessons().then(function(items){
  var byId={};items.forEach(function(l){byId[l.id]=l});
  var ORDER=['all','kg1','kg2','p1','p2','p3','p4','p5','p6','m1','m2','m3','sa-g1','sa-g2','sa-g3','sa-g4','sa-g5','sa-g6','sa-m1','sa-m2','general'];
  var gi=d.ar.grade_opts.map(function(o,i){return {v:o[0],ar:o[1],en:d.en.grade_opts[i][1]}});var gOld=gi.slice();gi.sort(function(a,b){var x=ORDER.indexOf(a.v),y=ORDER.indexOf(b.v);return (x<0?99:x)-(y<0?99:y)});
  var gname={};d.ar.grade_opts.forEach(function(o,i){gname[o[0]]=[o[1],d.en.grade_opts[i][1]]});
  var cards=d.ar.cards.map(function(c,i){var e=d.en.cards[i],l=byId[c.id];return {ar:c,en:e,l:l,g:l?l.grade:'',u:l?unitOf(l):''}});
  var seenC={};d.ar.cards.forEach(function(c){seenC[c.id]=1});items.forEach(function(l){if(seenC[l.id]||!l.grade)return;var img=l.poster||(l.mp4?l.mp4.replace(/\.mp4$/,'.jpg'):'');var base={id:l.id,img:img,alt:l.title,title:l.title,dur:l.duration||'',aria:'شغّل '+l.title};cards.push({ar:Object.assign({part:l.part},base),en:Object.assign({part:(F.parts&&F.parts[l.part])||l.part},base),l:l,g:l.grade,u:unitOf(l)})});
  var html=crumbsOf(d)+head(d,{}).replace('<span class="ds-tag">','<span class="ds-tag vh">')+
  '<div class="fam-filters"><div class="grp"><label for="video-grade">'+esc(x.labels[0])+'</label><select id="video-grade" data-ds-select data-f="g">'+gOld.map(function(o){return '<option value="'+esc(o.v)+'"'+(o.v==='all'?' selected':'')+'>'+esc(DS.t(o.ar,o.en))+'</option>'}).join('')+'</select></div>'+
  '<div class="grp"><label for="video-unit">'+esc(x.labels[1])+'</label><select id="video-unit" data-ds-select data-f="u">'+d.ar.unit_opts.map(function(o,i){return '<option value="'+esc(o[0])+'"'+(o[0]==='all'?' selected':'')+'>'+esc(DS.t(o[1],d.en.unit_opts[i][1]))+'</option>'}).join('')+'</select></div></div>'+
  '<p class="ds-sub fam-count" id="fam-count" role="status"></p><div class="fam-groups" id="fam-lib">'+gi.filter(function(o){return o.v!=='all'}).map(function(o){var mine=cards.filter(function(c){return c.g===o.v});if(!mine.length)return '';return '<section class="ds-card fam-grp" data-g="'+esc(o.v)+'"><button type="button" class="fam-sum" aria-expanded="false"><b>'+esc(DS.t(o.ar,o.en))+'</b><span class="ds-tag">'+DS.num(mine.length)+'</span>'+DS.icon('chev')+'</button><div class="ds-grid fam-vgrid" inert>'+mine.map(function(c,i){var cc=DS.lang()==='en'?c.en:c.ar;
   return '<article class="ds-card fam-vcard" data-g="'+esc(c.g)+'" data-u="'+esc(c.u)+'"><div class="ds-video" data-id="'+esc(cc.id)+'"><button type="button" class="fam-cover" data-lesson="'+esc(cc.id)+'" aria-label="'+esc(cc.aria)+'"><img src="'+esc(BASE+cc.img)+'" alt="'+esc(cc.alt)+'" loading="lazy" width="640" height="360"><span class="fam-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8.5 5.6v12.8a1 1 0 0 0 1.5.86l10.2-6.4a1 1 0 0 0 0-1.72L10 4.74a1 1 0 0 0-1.5.86z"/></svg></span></button></div><h3 dir="ltr" class="ds-ltr">'+esc(cc.title)+'</h3><p class="meta">'+esc(cc.part)+' '+ltr(cc.dur)+'</p></article>'}).join('')+'</div></section>'}).join('')+'</div>'+
  '<div class="ds-empty" id="fam-none" hidden><p>'+esc(DS.t('مفيش فيديوهات بالاختيار ده. جرّب اختيار تاني.','No videos match this choice. Try another one.'))+'</p></div>';
  setTimeout(function(){
   var root=document.getElementById('fam-lib');if(!root)return;
   var cnt=document.getElementById('fam-count');function setOpen(g,o){g.classList.toggle('open',o);g.querySelector('.fam-sum').setAttribute('aria-expanded',o);var b=g.querySelector('.fam-vgrid');if(o)b.removeAttribute('inert');else b.setAttribute('inert','')}
   root.addEventListener('click',function(e){var b=e.target.closest('.fam-sum');if(b)setOpen(b.parentNode,!b.parentNode.classList.contains('open'))});
   function apply(){var n=0;[].forEach.call(root.querySelectorAll('article'),function(a){var ok=(st.g==='all'||a.dataset.g===st.g)&&(st.u==='all'||a.dataset.u===st.u);a.hidden=!ok;if(ok)n++});
    [].forEach.call(root.querySelectorAll('.fam-grp'),function(g){var k=[].filter.call(g.querySelectorAll('article'),function(a){return !a.hidden}).length;g.hidden=!k;g.querySelector('.fam-sum .ds-tag').textContent=DS.num(k);setOpen(g,st.g!=='all'||st.u!=='all')});
    cnt.textContent=(DS.lang()==='en'?x.sub.replace(/\d+/,n):x.sub.replace(/\d+/,n));document.getElementById('fam-none').hidden=n>0}
   [].forEach.call(document.querySelectorAll('.fam-filters select'),function(g){g.addEventListener('change',function(){st[g.dataset.f]=g.value;apply()})});
   root.addEventListener('click',function(e){var b=e.target.closest('.fam-cover');if(!b)return;var l=byId[b.dataset.lesson];if(!l)return;var p=player(l);if(!p)return;var box=b.parentNode;box.innerHTML=p;var v=box.querySelector('video');if(v)v.play&&v.play().catch(function(){})});
   apply();
  },0);
  return html;
 });
}
/* ---------- watch ---------- */
var DESC_EN={'kg1-t1-u4':'Unit 4 explained with letters, words and pictures, plus tracing, the story and the family activity. This explains with words and letter names. It is not practice on the sound of each letter on its own. The separate interactive activities are available. The assessments are still being prepared.','kg2-t1-u1':'Unit 1 explained with pictures, movement, counting, words and letter names, plus the story and tracing. Letter names and words are not a substitute for separate practice on sounds. Part of the interactive activities is available in the explanation section, and the assessments are still being prepared.'};
function watchRoute(ctx){
 var id=ctx.params.id;DS.tab('videos');
 var home=[['#/','الرئيسية','Home'],['','فيديو الشرح','Lesson video']];
 return lessons().then(function(items){
  var l=items.filter(function(x){return x.id===id})[0];
  if(!l){DS.title('فيديو الشرح','Lesson video');
   return DS.ui.crumbs(home)+'<header class="fam-head"><span class="ds-tag">'+esc(DS.t('تعلّم خطوة بخطوة','Learn step by step'))+'</span><h1>'+esc(DS.t('فيديو الشرح','Lesson video'))+'</h1><p class="lead">'+esc(DS.t('افتح الفيديو وراجعه براحتك.','Open the video and review it at your own pace.'))+'</p></header><div class="ds-empty fam-empty"><h2>'+esc(DS.t('الفيديو مش موجود','Video not found'))+'</h2><p>'+esc(DS.t('ارجع لمكتبة الدروس واختار فيديو متاح.','Return to the lesson library and choose an available video.'))+'</p><a class="ds-btn" href="#/videos">'+esc(DS.t('مكتبة الدروس','Lesson library'))+'</a></div>'}
  DS.title(l.title,l.title);
  var grade=/^(kg[12]|p[1-6]|m[1-3]|sa-g[1-6]|sa-m[1-3])$/.test(l.grade)?l.grade:null;
  var back=grade?(F.hubs['videos-'+grade]?['#/videos/'+grade,'رجوع لفيديوهات الصف','Back to year videos']:['#/grade/'+grade,'رجوع لصفحة الصف','Back to the grade page']):['#/videos','رجوع لصفحة الصف','Back to the grade page'];
  var partEn=F.parts[l.part]||l.part,part=DS.t(l.part||'فيديو شرح',partEn||'Lesson video');
  var backBtn='<a class="ds-back" href="'+esc(back[0])+'">'+DS.icon('back')+'<span>'+esc(DS.t(back[1],back[2]))+'</span></a>';
  var sib=grade?items.filter(function(x){return x.grade===grade}):[];var ix=sib.indexOf(l);var prev=ix>0?sib[ix-1]:null,next=ix>-1&&ix<sib.length-1?sib[ix+1]:null;
  var gl=grade&&F.hubs['videos-'+grade]?F.hubs['videos-'+grade].ar.crumbs.slice(-1)[0][1].split(' · ').slice(1).join(' · '):'';var gle=grade&&F.hubs['videos-'+grade]?F.hubs['videos-'+grade].en.crumbs.slice(-1)[0][1].split(' · ').slice(1).join(' · '):'';
  function nb(x,ar,en,cls){return x?'<a class="ds-btn ds-btn--soft '+cls+'" href="#/watch/'+esc(x.id)+'"><span>'+esc(DS.t(ar,en))+'</span></a>':''}
  return DS.ui.crumbs(home)+'<header class="fam-head">'+backBtn+'<span class="ds-tag">'+esc(DS.t('تعلّم خطوة بخطوة','Learn step by step'))+'</span><h1 dir="auto">'+esc(l.title)+'</h1></header>'+
  '<div class="fam-watch"><div class="fam-pl"><div class="ds-video" id="fam-player">'+player(l).replace('&autoplay=1','').replace('?autoplay=1','')+'</div></div>'+
  '<aside class="ds-card fam-info"><div class="ds-row"><span class="ds-tag">'+esc(part)+'</span>'+(gl?'<span class="ds-tag">'+esc(DS.t(gl,gle))+'</span>':'')+'</div>'+(l.duration?'<p>'+esc(DS.t('مدة الفيديو: ','Video duration: '))+ltr(l.duration)+'</p>':'')+(l.description?'<p>'+esc(DS.lang()==='en'&&DESC_EN[l.id]?DESC_EN[l.id]:l.description)+'</p>':'')+((prev||next)?'<div class="ds-row fam-pn">'+nb(prev,'الفيديو السابق','Previous video','')+nb(next,'الفيديو التالي','Next video','')+'</div>':'')+'</aside></div>';
 });
}
/* ---------- grades overview ---------- */
function gradesRoute(){
 var d=F.misc.grades;DS.tab('grades');DS.title(d.ar.h1text.split('.')[0],d.en.h1text.split('.')[0]);var x=L(d);
 var picks=x.picks.map(function(p){return A(p[0],'ds-rowlink','<span class="ds-tile'+(/^[A-Za-z]/.test(p[1])?' ds-ltr':'')+'">'+esc(p[1].split(' ')[0])+(p[1].indexOf(' ')>0?'<span class="vh"> '+esc(p[1].split(' ').slice(1).join(' '))+'</span>':'')+'</span><span class="tx"><b>'+esc(p[2])+'</b></span><span class="go">'+DS.icon('chev')+'</span>')}).join('');
 var gen=x.gen.items.map(function(i){return '<article class="ds-card fam-vcard"><div class="ds-video"><iframe loading="lazy" src="'+esc(i.src)+'" title="'+esc(i.h)+'" allowfullscreen></iframe></div><h3>'+esc(i.h.replace(/ · .*$/,''))+(/ · /.test(i.h)?' · ':'')+(/ · /.test(i.h)?ltr(i.h.split(' · ').slice(1).join(' · ')):'')+'</h3><p class="meta">'+ltr(i.dur)+'</p></article>'}).join('');
 return crumbsOf(d)+'<header class="fam-head"><span class="ds-tag">'+esc(x.eyebrow)+'</span><h1>'+x.h1+'</h1><p class="lead">'+esc(x.lead)+'</p>'+(x.sub?'<p class="ds-sub" style="margin-top:12px">'+esc(x.sub)+'</p>':'')+'</header>'+
 '<div class="ds-grid ds-grid--3 fam-picks">'+picks+'</div>'+
 '<h2>'+esc(x.gen.h)+'</h2><p class="ds-sub">'+esc(x.gen.p)+'</p><div class="ds-grid fam-vgrid">'+gen+'</div>'+
 '<div class="ds-card fam-cta"><h2 style="margin-top:0">'+esc(x.cta.h)+'</h2><p>'+esc(x.cta.p)+'</p><div class="ds-row">'+A(x.cta.href,'ds-btn',esc(x.cta.btn))+'</div></div>';
}
/* ---------- courses overview ---------- */
function coursesRoute(){
 var d=F.misc.courses;DS.tab('grades');DS.title(d.ar.h1text,d.en.h1text);var x=L(d);var f=d.feat[DS.lang()];
 var st=x.stages.map(function(s){return '<article class="ds-card fam-entry"><span class="ds-tile ds-tile--lg ds-ltr">'+esc(s.num)+'</span><span class="ds-tag ds-ltr" style="align-self:flex-start">'+esc(s.eye)+'</span><h3>'+esc(s.h)+'</h3><p>'+esc(s.p)+'</p>'+A(s.href,'fam-open',esc(s.go)+DS.icon('chev'))+'</article>'}).join('');
 return crumbsOf(d)+'<header class="fam-head"><span class="ds-tag ds-ltr">'+esc(x.eyebrow)+'</span><h1>'+esc(x.h1)+'</h1><p class="lead">'+esc(x.lead)+'</p></header><div class="ds-grid ds-grid--2">'+st+'</div>'+
 '<div class="ds-card fam-cta"><span class="ds-tag">'+esc(f.eyebrow)+'</span><h2>'+esc(f.h)+'</h2><p>'+esc(f.p)+'</p><div class="ds-row">'+A(f.links[0][0],'ds-btn',esc(f.links[0][1]))+A(f.links[1][0],'ds-btn ds-btn--soft',esc(f.links[1][1]))+'</div></div>';
}
DS.route('/grades',gradesRoute);DS.route('/courses',coursesRoute);DS.route('/grade/:g',gradeRoute);
DS.route('/videos',libRoute);DS.route('/videos/:g',videosRoute);DS.route('/watch/:id',watchRoute);
})();
