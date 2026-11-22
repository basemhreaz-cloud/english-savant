'use strict';
(()=>{
const $=s=>document.querySelector(s),content=$('#k2-content'),status=$('#k2-audio-status'),player=new Audio();player.preload='none';
const V='20261122-preunit1';
let finishAudio=null;let data,audio={},index=0,traceIndex=0,ticket=0,activeButton=null;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset=p=>'assets/kg2/'+p+'?v='+V;
const UNITS={'kg2-t1-u2':'u2','kg2-t1-u3':'u3','kg2-t1-u4':'u4','kg2-t1-review':'review','kg2-t1-preunit':'preunit'};
function clip(id){const c=audio[id];return c?.verified===true&&/^[a-f0-9]{64}$/.test(c.sha256||'')?c.src+'?v='+c.sha256.slice(0,12):null;}
function stop(){ticket++;player.pause();player.removeAttribute('src');player.load();if(finishAudio){finishAudio(null);finishAudio=null;}if(activeButton)activeButton.classList.remove('is-speaking');activeButton=null;document.querySelectorAll('#k2-content video').forEach(v=>v.pause());status.textContent='';}
async function playSeq(ids,button){stop();const urls=ids.map(clip);if(urls.some(x=>!x)){status.textContent='الصوت ده لسه بيتراجع.';return false;}const mine=ticket;activeButton=button||null;if(button)button.classList.add('is-speaking');for(const src of urls){if(mine!==ticket)return null;status.textContent='الصوت بيحمّل…';const ok=await new Promise(resolve=>{let done=false;const finish=value=>{if(done)return;done=true;player.onended=player.onerror=null;if(finishAudio===finish)finishAudio=null;resolve(value);};finishAudio=finish;player.onended=()=>finish(true);player.onerror=()=>finish(false);player.src=src;player.play().then(()=>{if(mine===ticket)status.textContent='اسمع وردّد براحتك.';}).catch(()=>finish(false));});if(mine!==ticket)return null;if(ok!==true){if(button)button.classList.remove('is-speaking');activeButton=null;status.textContent='الصوت ما فتحش. اضغط تاني.';return false;}}if(mine===ticket){if(button)button.classList.remove('is-speaking');activeButton=null;status.textContent='اضغط تاني لو تحب تسمعها كمان مرة.';}return true;}
const listen=(ids,label,cls='')=>{const seq=[].concat(ids);return seq.every(id=>clip(id))?`<button type="button" class="k2-listen ${cls}" data-seq="${esc(seq.join(' '))}">${esc(label)}</button>`:`<span class="k2-note-held">الصوت ده لسه بيتراجع.</span>`;};
const hints=(a,txt)=>`<p class="k2-help">${esc(txt||a.help||'')}</p>${a.instr?`<div class="k2-instructions">${listen(a.instr,'اسمع المطلوب بالعربي')}</div>`:''}`;
const tapCard=w=>`<button type="button" class="k2-picture" data-seq="${esc(w.ar+' '+w.en)}" aria-label="اسمع: ${esc(w.label_en)}"><img src="${asset(w.img)}" alt="${esc(w.label_en)}" width="400" height="400" loading="lazy"><span lang="en" dir="ltr">${esc(w.label_en)}</span><small>اضغط على الصورة واسمع</small></button>`;
function fb(msg,ok){return `<p class="k2-fb ${ok?'ok':'no'}" role="status">${msg}</p>`}
function passage(a){return a.context?`<section class="k2-passage" aria-label="الحوار قبل الأسئلة"><h3>${esc(a.context.title_ar)}</h3>${a.context.lines.map(l=>`<p lang="en" dir="ltr">${l.speaker?`<b>${esc(l.speaker)}:</b> `:''}${esc(l.text)}</p>`).join('')}${listen(a.context.lines.map(l=>l.audio),'اسمع الحوار بالترتيب')}</section>`:'';}
function render(){
  stop();traceIndex=0;const a=data.activities[index];
  $('#k2-title').textContent=a.title_ar;$('#k2-picker').value=String(index);$('#k2-count').textContent=`${index+1} من ${data.activities.length}`;
  $('#k2-prev').disabled=index===0;$('#k2-next').disabled=index===data.activities.length-1;
  if(location.hash!=='#'+a.id)location.hash=a.id;
  let b='';
  if(a.kind==='tap-words')b=hints(a)+`<div class="k2-pictures">${a.words.map(tapCard).join('')}</div>`;
  if(a.kind==='lines'){b=hints(a,a.help||'اسمعوا كل سطر وردّدوه مع شخص كبير.')+(a.whole?`<div class="k2-instructions">${listen(a.whole,'اسمع الأغنية كاملة')}</div>`:'')+`<div class="k2-values">${a.lines.map(l=>`<article>${l.speaker?`<small class="k2-speaker" lang="en" dir="ltr">${esc(l.speaker)}</small>`:''}<p lang="en" dir="ltr">${esc(l.text)}</p>${l.audio?listen(l.audio,'اسمع الجملة'):''}</article>`).join('')}</div>`+(a.lines.every(l=>l.audio)?`<div class="k2-instructions">${listen(a.lines.map(l=>l.audio),'اسمع كله بالترتيب')}</div>`:'')}
  if(a.kind==='trace'||a.kind==='count-trace'){b=hints(a,'شوف الحركة، وبعدها اتتبّع بإصبعك من نقطة البداية. تدريب حر من غير درجات.');
    if(a.counts)b+=`<div class="k2-pictures k2-count-wide">${a.counts.map(c=>`<button type="button" class="k2-picture" data-seq="${esc(c.ar+' '+c.en)}" aria-label="${esc(c.alt)}"><img src="${asset(c.img)}" alt="${esc(c.alt)}" width="800" height="280" loading="lazy"><span dir="ltr">${c.n}</span><small>اسمع العدد بالعربي ثم الإنجليزي</small></button>`).join('')}</div>`;
    b+=`<div class="k2-trace-tabs">${a.items.map((x,i)=>`<button type="button" data-trace="${i}" aria-pressed="${i===0}"><span dir="ltr">${esc(x.glyph)}</span></button>`).join('')}</div><div id="k2-trace-area"></div>`+(a.held_text?`<p class="k2-note-held">${esc(a.held_text)}</p>`:'')}
  if(a.kind==='colour-pick'){b=hints(a)+`<div class="k2-instructions">${listen(a.prompt.audio,'اسمع الجملة')}</div><p lang="en" dir="ltr" class="k2-q">${esc(a.prompt.text)}</p><div class="k2-pictures k2-three">${a.choices.map((c,i)=>`<button type="button" class="k2-picture" data-pick="${i}" aria-label="${esc(c.alt)}"><img src="${asset(c.img)}" alt="${esc(c.alt)}" width="400" height="400"></button>`).join('')}</div><div id="k2-fb"></div>`}
  if(a.kind==='true-false'){b=hints(a)+passage(a)+a.items.map((it,i)=>`<article class="k2-q-card" data-i="${i}"><p lang="en" dir="ltr" class="k2-q">${esc(it.text)}</p>${listen(it.audio,'اسمع الجملة')}<div class="k2-choices"><button type="button" data-tf="${i}:1">صح</button><button type="button" data-tf="${i}:0">غلط</button></div><div class="k2-fbslot"></div></article>`).join('')+`<p class="k2-note-held">${esc(a.note||'')}</p>`}
  if(a.kind==='choose-word'){b=hints(a)+passage(a)+a.items.map((it,i)=>`<article class="k2-q-card"><p lang="en" dir="ltr" class="k2-q">${esc(it.text)}</p>${listen(it.audio,'اسمع الجملة')}<div class="k2-choices">${it.choices.map(c=>`<button type="button" lang="en" dir="ltr" data-cw="${i}:${esc(c)}">${esc(c)}</button>`).join('')}</div><div class="k2-fbslot"></div></article>`).join('')}
  if(a.kind==='review-letter'||a.kind==='review-count'||a.kind==='review-match'){b=hints(a)+a.items.map((it,i)=>`<article class="k2-q-card k2-rv"><img src="${asset(it.img)}" alt="${esc(it.alt)}" class="${a.kind==='review-count'?'wide':''}" loading="lazy"><div class="k2-choices">${it.choices.map(c=>`<button type="button" ${a.kind==='review-letter'?'lang="en" dir="ltr"':''} data-rv="${i}:${esc(c)}">${esc(it.labels?it.labels[c]:c)}</button>`).join('')}</div><div class="k2-fbslot"></div></article>`).join('')}
  if(a.kind==='review-pic'){b=hints(a)+a.items.map((it,i)=>`<article class="k2-q-card"><p class="k2-q" dir="ltr" lang="en">${esc(it.letter)}</p><div class="k2-pictures k2-three">${it.choices.map(c=>`<button type="button" class="k2-picture" data-rp="${i}:${esc(c.k)}" aria-label="${esc(c.alt)}"><img src="${asset(c.img)}" alt="${esc(c.alt)}" width="400" height="400"></button>`).join('')}</div><div class="k2-fbslot"></div></article>`).join('')}
  if(a.kind==='review-tf'){b=hints(a)+a.items.map((it,i)=>`<article class="k2-q-card k2-rv"><img src="${asset(it.img)}" alt="${esc(it.alt)}"><p lang="en" dir="ltr" class="k2-q">${esc(it.text)}</p><div class="k2-choices"><button type="button" data-tf="${i}:1">صح</button><button type="button" data-tf="${i}:0">غلط</button></div><div class="k2-fbslot"></div></article>`).join('')+`<p class="k2-note-held">${esc(a.note||'')}</p>`}
  if(a.kind==='sort-bag'){b=hints(a)+a.items.map((it,i)=>`<article class="k2-q-card k2-rv"><button type="button" class="k2-picture is-small" ${it.ar?`data-seq="${esc(it.ar+' '+it.en)}"`:''} aria-label="${esc(it.alt)}"><img src="${asset(it.img)}" alt="${esc(it.alt)}" width="300" height="300"><span lang="en" dir="ltr">${esc(it.word)}</span></button><div class="k2-choices"><button type="button" data-bag="${i}:1">في الشنطة</button><button type="button" data-bag="${i}:0">مش في الشنطة</button></div><div class="k2-fbslot"></div></article>`).join('')+`<p class="k2-note-held">${esc(a.note||'')}</p>`}
  if(a.kind==='tap-colour'){b=hints(a)+a.items.map((it,i)=>`<article class="k2-q-card" data-cl="${i}"><p class="k2-q">لوّن ${it.target} من ${it.available} سحابات.</p><div class="k2-clouds">${Array.from({length:it.available},(_,j)=>`<button type="button" class="k2-cloud" data-cloud="${i}:${j}" aria-pressed="false" aria-label="سحابة ${j+1}"><img src="${asset(a.img)}" alt="" width="80" height="80"></button>`).join('')}</div><p class="k2-cl-count" role="status">ملوّن 0 من ${it.target}</p><button type="button" data-clear="${i}">امسح وجرب تاني</button></article>`).join('')}
  content.innerHTML=b;if(a.kind==='trace'||a.kind==='count-trace')drawTrace();
}
function drawTrace(){
  const a=data.activities[index],t=a.items[traceIndex];
  $('#k2-trace-area').innerHTML=`<div class="k2-trace-layout"><section><h3>شوف اتجاه الحركة: <span dir="ltr">${esc(t.glyph)}</span></h3><video class="k2-animation" controls playsinline preload="none" poster="${asset(t.poster.replace('assets/kg2/',''))}" src="${asset(t.mp4.replace('assets/kg2/',''))}" aria-label="اتجاه تتبع ${esc(t.glyph)}"></video><button type="button" class="k2-trace-play">شغّل حركة التتبع</button></section><section><h3>دلوقتي جرّب بإصبعك</h3><div class="k2-canvas-wrap"><img src="${asset(t.poster.replace('assets/kg2/',''))}" alt="دليل ترتيب تتبع ${esc(t.glyph)}" width="500" height="600"><canvas id="k2-canvas" width="500" height="600" role="img" aria-label="مساحة تتبع حر بالإصبع أو الفأرة"></canvas></div><button type="button" class="k2-clear">امسح وجرب تاني</button><p class="k2-help">حرّك إصبعك فوق الدليل. مفيش تصحيح آلي أو تقييم لخطك.</p></section></div>`;
  const c=$('#k2-canvas'),x=c.getContext('2d');let d=false;x.strokeStyle='#315d4b';x.lineWidth=16;x.lineCap='round';x.lineJoin='round';
  const pt=e=>{const r=c.getBoundingClientRect();return [(e.clientX-r.left)*500/r.width,(e.clientY-r.top)*600/r.height]};
  c.addEventListener('pointerdown',e=>{e.preventDefault();d=true;c.setPointerCapture(e.pointerId);const [a,b]=pt(e);x.beginPath();x.moveTo(a,b);x.lineTo(a+.1,b+.1);x.stroke()});
  c.addEventListener('pointermove',e=>{if(!d)return;e.preventDefault();const [a,b]=pt(e);x.lineTo(a,b);x.stroke()});
  const end=()=>{d=false};c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);
}
const mark=(slot,ok,btn)=>{slot.innerHTML=fb(ok?'أحسنت! ✓':'جرّب تاني، مفيش مشكلة.',ok);if(btn)btn.setAttribute('aria-pressed','true')};
content.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;const a=data.activities[index];
  if(b.dataset.seq){playSeq(b.dataset.seq.split(' '),b);return}
  if(b.dataset.trace!==undefined){stop();traceIndex=+b.dataset.trace;content.querySelectorAll('[data-trace]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));drawTrace();return}
  if(b.classList.contains('k2-trace-play')){const v=$('.k2-animation');stop();v.currentTime=0;v.play().catch(()=>status.textContent='الحركة ما حمّلتش. اضغط تاني.');return}
  if(b.classList.contains('k2-clear')){const c=$('#k2-canvas');c.getContext('2d').clearRect(0,0,500,600);return}
  if(b.dataset.pick!==undefined){const ok=a.choices[+b.dataset.pick].ok;$('#k2-fb').innerHTML=fb(ok?'أحسنت! ده التيشيرت الأصفر ✓':'جرّب تاني، مفيش مشكلة.',ok);return}
  if(b.dataset.tf){const [i,v]=b.dataset.tf.split(':');mark(b.closest('.k2-q-card').querySelector('.k2-fbslot'),(v==='1')===a.items[+i].ok);return}
  if(b.dataset.cw){const [i,v]=b.dataset.cw.split(':');mark(b.closest('.k2-q-card').querySelector('.k2-fbslot'),v===a.items[+i].ok);return}
  if(b.dataset.bag){const [i,v]=b.dataset.bag.split(':');mark(b.closest('.k2-q-card').querySelector('.k2-fbslot'),(v==='1')===a.items[+i].inbag);return}
  if(b.dataset.rp){const [i,v]=b.dataset.rp.split(':');mark(b.closest('.k2-q-card').querySelector('.k2-fbslot'),v===a.items[+i].ok);return}
  if(b.dataset.rv){const [i,v]=b.dataset.rv.split(':');mark(b.closest('.k2-q-card').querySelector('.k2-fbslot'),v===String(a.items[+i].ok));return}
  if(b.dataset.cloud){const [i,j]=b.dataset.cloud.split(':');const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));b.classList.toggle('on',on);const card=b.closest('.k2-q-card'),n=card.querySelectorAll('.k2-cloud.on').length,t=a.items[+i].target;card.querySelector('.k2-cl-count').textContent=n===t?`ملوّن ${n} من ${t}. أحسنت! ✓`:`ملوّن ${n} من ${t}`;return}
  if(b.dataset.clear!==undefined){const card=b.closest('.k2-q-card');card.querySelectorAll('.k2-cloud').forEach(x=>{x.classList.remove('on');x.setAttribute('aria-pressed','false')});card.querySelector('.k2-cl-count').textContent=`ملوّن 0 من ${a.items[+b.dataset.clear].target}`}
});
$('#k2-prev').addEventListener('click',()=>{if(index>0){index--;render()}});
$('#k2-next').addEventListener('click',()=>{if(index<data.activities.length-1){index++;render()}});
$('#k2-picker').addEventListener('change',e=>{index=+e.target.value;render()});
window.addEventListener('pagehide',stop);window.addEventListener('hashchange',()=>{if(!data)return;const next=data.activities.findIndex(a=>'#'+a.id===location.hash);if(next>=0&&next!==index){index=next;render();}});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
const unit=new URLSearchParams(location.search).get('unit');
if(!UNITS[unit]){$('#k2-title').textContent='نختار الوحدة';content.innerHTML='<p>'+Object.keys(UNITS).map(k=>`<a class="button" href="?unit=${k}">${k.replace('kg2-t1-','')}</a>`).join(' ')+'</p>'}
else Promise.all([fetch(`kg2-unit-${unit}.json?v=${V}`).then(r=>{if(!r.ok)throw Error('x');return r.json()}),fetch(`kg2-unit-audio.json?v=${V}`).then(r=>{if(!r.ok)throw Error('x');return r.json()})]).then(([d,au])=>{
  data=d;audio=au.audio;document.title=`${d.unit.title_ar} | KG2 | ENGLISH SAVANT`;$('#k2-eyebrow').textContent=d.unit.eyebrow;$('#k2-h1').textContent=d.unit.title_ar;$('#k2-sub').textContent=d.unit.title_en;$('#k2-kicker').textContent=d.unit.title_en;
  $('#k2-picker').innerHTML=d.activities.map((a,i)=>`<option value="${i}">${esc(a.title_ar)}</option>`).join('');
  $('#k2-held').innerHTML=(d.held&&d.held.length?'<p>لسه قريبًا في الوحدة دي:</p><ul>'+d.held.map(h=>`<li>${esc(h)}</li>`).join('')+'</ul>':'');
  const n=d.activities.findIndex(a=>'#'+a.id===location.hash);if(n>=0)index=n;render();
}).catch(err=>{window.__err=String(err&&err.stack||err);console.error(window.__err);$('#k2-title').textContent='الجزء ده مش متاح دلوقتي';content.innerHTML='<p>جرّب تاني بعد شوية.</p>'});
})();
