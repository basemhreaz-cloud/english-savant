/* ENGLISH SAVANT · explain-* and course-* family (native, built on ds v1.x). Routes: #/explain/:g/:u  #/course/:g
   Content comes from explain-data.js (static old-page text/links) + curr-<g>.json (teaching blocks, fetched at run time). */
(function(){
'use strict';
var esc=DS.esc,t=DS.t,E=window.EXPL,UI=DS.ui;
var DATA=(new URLSearchParams(location.search).get('data'))||'data/';
var ARW=/^[\s\u21A9\u21AA\u2196\u2197\u2190\u2192\u2199\u2198\u{1F4CD}]+|[\s\u21A9\u21AA\u2196\u2197\u2190\u2192\u2199\u2198\u{1F4CD}]+$/gu;
var AR=/[\u0600-\u06FF]/;
function lbl(s){var c=s.replace(ARW,'');return c===s?esc(s):esc(c)+'<span class="ds-sr">'+esc(s)+'</span>'}   /* arrows/pin become icons; exact original kept as hidden text */
function ltr(s,inner){return AR.test(s)?inner:'<bdi class="ds-ltr">'+inner+'</bdi>'}
function href(h){
 if(/^(https?:|tel:|mailto:)/.test(h))return h;
 var f=h.split('#')[0];
 if(window.ES_ROUTES&&ES_ROUTES[f])return ES_ROUTES[f];
 var m=/^explain-(.+?)-(u\d+|r\d+|exp\d+)\.html$/.exec(f);if(m)return '#/explain/'+m[1]+'/'+m[2];
 m=/^course-(.+)\.html$/.exec(f);if(m)return '#/course/'+m[1];
 m=/^grade-([a-z0-9]+)\.html$/.exec(f);if(m)return '#/g/'+m[1];
 if(f==='index.html')return '#/';
 return '#/page/'+h;   /* no native template yet: shell reader fallback; swap by supplying window.ES_ROUTES */
}
function ext(h){return /^https?:/.test(h)?' target="_blank" rel="noopener"':''}
var GL={kg1:['حضانة أولى','KG1'],kg2:['حضانة تانية','KG2']};
function gradeLabel(g){var m=/^p(\d)$/.exec(g);if(m)return ['الصف '+DS.num(m[1])+' الابتدائي','Primary '+m[1]];m=/^m(\d)$/.exec(g);if(m)return ['الصف '+DS.num(m[1])+' الإعدادي','Prep '+m[1]];m=/^sa-([gm])(\d)$/.exec(g);if(m)return ['السعودي '+(m[1]==='g'?'ابتدائي ':'متوسط ')+DS.num(m[2]),'Saudi '+(m[1]==='g'?'Primary ':'Intermediate ')+m[2]];return GL[g]||[g,g.toUpperCase()]}
function icon(h,txt){return /watch/.test(h)?'play':/^unit-|تدريب/.test(h+txt)?'pen':'chev'}
/* ---------- footer ---------- */
function footer(cred){
 var f=E.foot,hs=E.footl.slice(),out=[],ai=0;
 if(cred){hs.splice(2,0,'image-credits.html')}
 var h='<footer class="ds-foot"><div><b class="ds-ltr">'+esc(f[0][1])+'</b><p class="ds-sub ds-ltr">'+esc(f[1][1])+'</p><small class="ds-ltr">'+esc(f[2][1])+'</small></div>';
 h+='<div class="ds-stack"><h3>'+esc(f[3][1])+'</h3><p class="ds-sub">'+esc(f[4][1])+'</p><div class="ds-links">';
 var links=[],i;
 for(i=5;i<f.length;i++){if(f[i][0]==='a')links.push(f[i][1])}
 if(cred)links.splice(2,0,'حقوق الصور التعليمية');
 var rest=[];
 links.forEach(function(tx,j){var u=hs[j];var a='<a href="'+esc(href(u))+'"'+ext(u)+'>'+lbl(tx)+'</a>';rest.push(a)});
 h+=rest.slice(0,2).join('')+'</div></div><div class="ds-links">'+rest.slice(2).join('')+'</div>';
 for(i=5;i<f.length;i++)if(f[i][0]==='div')h+='<small class="ds-ltr">'+esc(f[i][1])+'</small>';
 return h+'</footer>';
}
/* ---------- teaching blocks (same behaviour as the old grade-teaching.js) ---------- */
function teach(u){
 var h='';
 if(u.lessons&&u.lessons.length){h+='<section class="ds-card ds-block"><ol class="ds-lessons">';u.lessons.forEach(function(l){h+='<li><bdi>\u0627\u0644\u062f\u0631\u0633 '+l.n+' \u00b7 '+esc(l.title)+'</bdi></li>'});h+='</ol></section>'}
 if(u.vocab&&u.vocab.length){h+='<section class="ds-card ds-block"><h3>اتعلّم كلمات الوحدة</h3><p class="ds-sub">دوس على البطاقة، والكلمة هتتبني حرف حرف.</p><div class="ds-tcards">';
  u.vocab.forEach(function(w){h+='<button class="ds-tcard" type="button" data-w="'+esc(w)+'" data-i="0" dir="ltr">؟</button>'});h+='</div></section>'}
 if(u.sentences&&u.sentences.length){h+='<section class="ds-card ds-block"><h3>اتعلّم جمل الوحدة</h3><p class="ds-sub">دوس على الجملة، وهتتبني كلمة كلمة بالترتيب الصح.</p><div class="ds-tsents">';
  u.sentences.forEach(function(s,i){h+='<button class="ds-tsent" type="button" data-s="'+esc(s)+'" dir="ltr">'+(i+1)+' …</button>'});h+='</div></section>'}
 var chips=(u.phonics||[]).filter(function(g){return !g.words||!g.words.length}),sounds=(u.phonics||[]).filter(function(g){return g.words&&g.words.length});
 if(chips.length){h+='<section class="ds-card ds-block"><h3>لغة الوحدة</h3>';chips.forEach(function(g){h+='<div class="ds-tgroup"><span class="ds-focus">'+esc(g.focus)+'</span></div>'});h+='</section>'}
 if(sounds.length){h+='<section class="ds-card ds-block"><h3>اتعلّم الأصوات</h3><p class="ds-sub">دوس على الكلمة، والصوت هيتحدد جواها.</p>';
  sounds.forEach(function(g){h+='<div class="ds-tgroup"><span class="ds-focus">'+esc(g.focus)+'</span>';g.words.forEach(function(w){h+='<button class="ds-tword" type="button" data-w="'+esc(w)+'" data-c="'+esc(g.cluster||'')+'">'+esc(w)+'</button>'});h+='</div>'});h+='</section>'}
 return h||'<div class="ds-empty"><p>الشرح بيتجهز.</p></div>';
}
function wire(root){
 root.querySelectorAll('.ds-tcard').forEach(function(b){b.addEventListener('click',function(){var w=b.dataset.w,i=+b.dataset.i;
  if(i>=w.length){b.dataset.i='0';b.textContent='؟';b.classList.remove('on');return}
  i++;b.dataset.i=i;b.textContent=w.slice(0,i);if(i>=w.length)b.classList.add('on')})});
 root.querySelectorAll('.ds-tsent').forEach(function(b){b.addEventListener('click',function(){
  if(b.dataset.busy)return;if(b.dataset.done){b.textContent=b.dataset.label;b.dataset.done='';b.classList.remove('on');return}
  b.dataset.busy='1';b.dataset.label=b.textContent;var words=b.dataset.s.split(' '),i=0;b.textContent='';
  var tm=setInterval(function(){b.textContent=(b.textContent?b.textContent+' ':'')+words[i];i++;if(i>=words.length){clearInterval(tm);delete b.dataset.busy;b.dataset.done='1';b.classList.add('on')}},350)})});
 root.querySelectorAll('.ds-tword').forEach(function(b){b.addEventListener('click',function(){var w=b.dataset.w,c=b.dataset.c;
  if(b.dataset.hl){b.textContent=w;b.dataset.hl='';b.classList.remove('on');return}
  var pos=c&&w.indexOf(c)>=0?w.indexOf(c):0,len=c&&w.indexOf(c)>=0?c.length:1;
  b.innerHTML=esc(w.slice(0,pos))+'<b>'+esc(w.slice(pos,pos+len))+'</b>'+esc(w.slice(pos+len));b.dataset.hl='1';b.classList.add('on')})});
}
var cache={};
function curr(g){return cache[g]||(cache[g]=fetch(DATA+'curr-'+g+'.json').then(function(r){if(!r.ok)throw Error('load');return r.json()}))}
/* ---------- generic content walker ---------- */
function walk(P){
 var it=P.items,nav='',m='',cta='',grid='',hero=false,seenH1=false,slot=false,i;
 function closeHero(){if(hero){m+='</div>';hero=false}}
 function flush(){if(cta){m+='<div class="ds-cta">'+cta+'</div>';cta=''}if(grid){m+='<div class="ds-grid">'+grid+'</div>';grid=''}}
 for(i=0;i<it.length;i++){
  var x=it[i],k=x[0],tx=x[1];
  if(k==='span'&&!seenH1){m+='<div class="ds-hero"><span class="ds-tag">'+esc(tx)+'</span>';hero=true;continue}
  if(k==='p'&&!seenH1&&it[i+1]&&it[i+1][0]==='h1'){m+='<p class="ds-kick ds-sub">'+esc(tx)+'</p>';continue}
  if(k==='h1'){seenH1=true;m+='<h1>'+ltr(tx,esc(tx))+'</h1>';continue}
  if(k==='p'){m+='<p class="ds-sub">'+ltr(tx,esc(tx))+'</p>';continue}
  if(k==='h2'){flush();closeHero();m+='<h2>'+esc(tx)+'</h2>';continue}
  if(k==='h3'&&it[i+1]&&it[i+1][0]==='p'){closeHero();grid+='<div class="ds-card ds-card--tight ds-stack"><h3>'+esc(tx)+'</h3><p>'+esc(it[i+1][1])+'</p></div>';i++;continue}
  if(k==='slot'){flush();closeHero();slot=true;m+='<div id="teach" class="ds-stack">'+UI.skeleton(2)+'</div>';continue}
  if(k==='a'){
   var u=x[2],h=href(u);
   if(slot){nav+='<a class="ds-rowlink" href="'+esc(h)+'"'+ext(u)+'><span class="ds-tile">'+DS.icon(/↩|←/.test(tx)?'back':'chev','ds-flip')+'</span><span class="tx"><b>'+lbl(tx)+'</b></span></a>';continue}
   cta+='<a class="ds-btn'+(/watch/.test(u)?' ds-btn--soft':'')+'" href="'+esc(h)+'"'+ext(u)+'>'+DS.icon(/watch/.test(u)?'play':'pen')+'<span>'+lbl(tx)+'</span></a>';continue}
 }
 flush();closeHero();
 return {main:m,nav:nav};
}
/* ---------- routes ---------- */
function crumbs(g,P,last){var gl=gradeLabel(g);return UI.crumbs([['#/','الرئيسية','Home'],['#/course/'+g,'الشرح التفاعلي · '+gl[0],'Interactive explainer · '+gl[1]],['',last[0],last[1]]])}
DS.route('/explain/:g/:u',function(c){
 var key='explain-'+c.params.g+'-'+c.params.u+'.html',P=E.pages[key];
 if(!P){DS.tab('grades');DS.title('مش لاقيين الشرح ده','Explainer not found');return UI.empty('الشرح ده مش موجود.','This explainer does not exist.')}
 DS.tab('grades');
 var u=c.params.u,n=u.replace(/\D/g,''),isR=/^r/.test(u)||/exp/.test(u);
 DS.title(isR?'شرح المراجعة':'شرح الوحدة '+DS.num(n),isR?'Review explained':'Unit '+n+' explained');
 var o=walk(P),body=o.main;
 return curr(P.g).then(function(d){
  var un=d.units.find(function(x){return x.id===P.u});
  var tc=un?teach(un):'<div class="ds-empty"><p>الشرح بيتجهز.</p></div>';
  return paint(P,body,o.nav,tc)
 },function(){return paint(P,body,o.nav,'<div class="ds-empty"><p>الشرح مش متاح دلوقتي. جرّب تحديث الصفحة بعد شوية.</p><button class="ds-btn" type="button" data-ds-retry>'+esc(t('جرّب تاني','Try again'))+'</button></div>')});
});
function paint(P,body,nav,tc){
 var h=crumbs(P.g,P,(function(){var u=P.u||'',n=u.replace(/\D/g,'');return /^u/.test(u)?['الوحدة '+DS.num(n),'Unit '+n]:['مراجعة','Review']})())+'<div class="ds-split"><div class="ds-stack">'+body.replace('<div id="teach" class="ds-stack">'+UI.skeleton(2)+'</div>','<div id="teach" class="ds-stack">'+tc+'</div>')+'</div><aside class="ds-stack"><nav class="ds-list" aria-label="'+esc(t('التنقل بين الشروحات','Explainer navigation'))+'">'+nav+'</nav></aside></div>'+footer(P.cred);
 setTimeout(function(){var r=document.getElementById('teach');if(r)wire(r)},0);
 return h;
}
DS.route('/course/:g',function(c){
 var key='course-'+c.params.g+'.html',P=E.pages[key];DS.tab('grades');
 if(!P){DS.title('مش لاقيين الصفحة دي','Page not found');return UI.empty('الصف ده مش موجود.','This grade does not exist.')}
 var gl=gradeLabel(P.g);DS.title('الشرح التفاعلي','Interactive explainer');
 var it=P.items,h='',i,cards='',cur=null,tail='',seenH2=0;
 function endCard(){if(cur){cards+='<article class="ds-card ds-ucard">'+cur+'</article>';cur=null}}
 for(i=0;i<it.length;i++){var x=it[i],k=x[0],tx=x[1];
  if(k==='a'&&/^←/.test(tx)){h+=UI.back(href(x[2]),tx.replace(ARW,''),gl[1]===undefined?'Back':'Back to grade').replace('</span></a>','<span class="ds-sr">'+esc(tx)+'</span></span></a>');continue}
  if(k==='h1'){h+='<h1 style="margin-top:12px">'+esc(tx)+'</h1>';continue}
  if(k==='span'){endCard();cur='<span class="ds-tag">'+esc(tx)+'</span>';continue}
  if(k==='article'){cur=(cur||'')+'<h3>'+ltr(tx,esc(tx))+'</h3>';continue}
  if(cur!==null&&k==='p'){cur+='<p class="ds-sub">'+esc(tx)+'</p>';continue}
  if(cur!==null&&k==='a'){cur+='<a class="ds-btn'+(/watch/.test(x[2])?' ds-btn--soft':'')+'" href="'+esc(href(x[2]))+'"'+ext(x[2])+'>'+DS.icon(/watch/.test(x[2])?'play':'pen')+'<span>'+lbl(tx)+'</span></a>';continue}
  if(k==='h2'){endCard();if(cards){h+='<div class="ds-grid">'+cards+'</div>';cards=''}h+='<h2>'+esc(tx)+'</h2>';continue}
  if(k==='p'){endCard();if(cards){h+='<div class="ds-grid">'+cards+'</div>';cards=''}h+='<p class="ds-sub">'+esc(tx)+'</p>';continue}
  if(k==='a'){endCard();if(cards){h+='<div class="ds-grid">'+cards+'</div>';cards=''}h+='<p><a class="ds-btn ds-btn--soft" href="'+esc(href(x[2]))+'"'+ext(x[2])+'>'+lbl(tx)+'</a></p>';continue}
 }
 endCard();if(cards)h+='<div class="ds-grid">'+cards+'</div>';
 return UI.crumbs([['#/','الرئيسية','Home'],['','الشرح التفاعلي · '+gl[0],'Interactive explainer · '+gl[1]]])+'<div class="ds-stack">'+h+'</div>'+footer(P.cred);
});
})();
