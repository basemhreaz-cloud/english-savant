(async function(){'use strict';
const root=document.querySelector('[data-video-grade]'),watch=document.getElementById('watch-video');if(!root&&!watch)return;
const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
const empty=(target,title,detail)=>{const e=node('div','grade-empty');e.append(node('h2','',title),node('p','',detail));target.replaceChildren(e)};
try{
 const r=await fetch('lessons.json?v=20261122-hub',{cache:'no-cache'});if(!r.ok)throw Error('library');const d=await r.json();const items=(d.lessons||[]).filter(l=>l&&typeof l.id==='string'&&!l.soon&&(l.mp4||l.youtube));
 if(root){
  const list=items.filter(l=>l.grade===root.dataset.videoGrade);root.replaceChildren();
  if(!list.length){empty(root,'فيديوهات الصف لسه بتتجهز','أول ما فيديو يخلص ويتراجع، هتلاقي كارت الوحدة بتاعه هنا. ارجع لصفحة الصف عشان تشوف الأقسام المتاحة.');return}
  list.forEach(l=>{const a=node('a','grade-card');a.href='watch.html?lesson='+encodeURIComponent(l.id);const label=node('span','grade-chip',l.part||'فيديو شرح');const title=node('b','',l.title);title.dir='auto';a.append(label,title,node('small','',(l.duration?l.duration+' · ':'')+'افتح فيديو الوحدة ←'));root.append(a)});return;
 }
 const id=new URLSearchParams(location.search).get('lesson');const l=items.find(l=>l.id===id);if(!l){empty(watch,'الفيديو مش موجود','ارجع لمكتبة الدروس واختار فيديو متاح.');const a=node('a','button','مكتبة الدروس');a.href='lessons.html';watch.append(a);return}
 const grade=/^(kg[12]|p[1-6]|m[1-3]|sa-g[1-6]|sa-m[1-3])$/.test(l.grade)?l.grade:null;
 const intro=document.querySelector('.page-intro');const h=intro.querySelector('h1');h.textContent=l.title;h.dir='auto';document.title=l.title+' | ENGLISH SAVANT';intro.querySelector('.lead').textContent=l.part||'فيديو شرح';
 const back=node('a','grade-back','← رجوع لفيديوهات الصف');back.href=grade?'videos-'+grade+'.html':'lessons.html';if(grade){const check=await fetch(back.href,{method:'HEAD'});if(!check.ok){back.href=(grade.startsWith('sa-')?grade:'grade-'+grade)+'.html';back.textContent='← رجوع لصفحة الصف'}}intro.prepend(back);
 const card=node('article','video-watch-card');let player;
 if(l.mp4){
  const local=/^videos\/[A-Za-z0-9_.-]+\.mp4$/.test(l.mp4),repoRelease=/^https:\/\/github\.com\/basemhreaz-cloud\/english-savant\/releases\/download\/(?:kg2-u[34]-hd-20261122|p1-u[123]-full-lesson-2026112[23])\/[A-Za-z0-9_.-]+\.mp4$/.test(l.mp4);if(!local&&!repoRelease)throw Error('source');
  const poster=local?l.mp4.replace(/\.mp4$/,'.jpg'):l.poster;if(!/^videos\/[A-Za-z0-9_.-]+\.jpg$/.test(poster||''))throw Error('poster');
  player=node('video');player.controls=true;player.preload='none';player.playsInline=true;const version=/^[a-f0-9]{12}$/.test(l.media_version||'')?'?v='+l.media_version:'';player.poster=poster+version;player.src=l.mp4+version;player.setAttribute('aria-label',l.title);
 }else{
  if(!/^[A-Za-z0-9_-]{11}$/.test(l.youtube))throw Error('youtube');
  player=node('iframe');player.src='https://www.youtube.com/embed/'+l.youtube;player.title=l.title;player.loading='lazy';player.allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture';player.allowFullscreen=true;
 }
 const wrap=node('div','video-wrap');wrap.append(player);card.append(wrap);if(l.duration)card.append(node('p','video-watch-meta','مدة الفيديو: '+l.duration));if(l.description)card.append(node('p','video-watch-meta',l.description));card.append(back.cloneNode(true));watch.replaceChildren(card);
}catch(e){empty(root||watch,'الصفحة مش راضية تفتح','جرّب تحدّث الصفحة، أو ارجع لصفحة الصف وحاول تاني.');}
})();
