/* Content loading hints. Never cover or delay usable content. */
(()=>{'use strict';
const selector='#stations,#teach,#lesson-assessment,#quiz-body,#lesson-content,#k2-content,[id^=u][id$=p] #content';
const seen=new WeakSet(),active=new Set();
function shape(kind){const e=document.createElement('div');e.className='es-skeleton';e.setAttribute('aria-hidden','true');e.innerHTML='<div class="es-brand-wait"><img src="assets/adults-logo.webp" width="48" height="48" alt=""><span></span></div><span class="es-skeleton-line"></span><span class="es-skeleton-line"></span><span class="es-skeleton-line"></span>'+(kind==='media'?'<span class="es-skeleton-media"></span>':'<div class="es-skeleton-grid"><span class="es-skeleton-card"></span><span class="es-skeleton-card"></span></div>');return e}
function loading(el){const nodes=[...el.childNodes].filter(n=>!n.classList?.contains('es-skeleton'));if(!nodes.length)return true;return nodes.every(n=>n.nodeType===3?!n.textContent.trim():n.nodeType===1&&n.classList.contains('lesson-empty')&&/بنحض|بنجه|جاري.*تحميل|Loading/i.test(n.textContent))||/^(بنحضّر|بنجهّز|جاري تحميل|Loading)[^.!؟]*[….]*$/i.test(el.textContent.trim())}
function clear(el){const sk=[...el.children].find(c=>c.classList.contains('es-skeleton'));if(sk)sk.remove();el.removeAttribute('aria-busy');active.delete(el)}
function scan(){document.querySelectorAll('main img:not(.es-image-pending)').forEach(im=>{if(im.complete)return;im.classList.add('es-image-pending');const done=()=>im.classList.remove('es-image-pending');im.addEventListener('load',done,{once:true});im.addEventListener('error',done,{once:true})});for(const el of active)if(!el.isConnected||!loading(el))clear(el);document.querySelectorAll(selector).forEach(el=>{if(seen.has(el)||!loading(el)||!el.getClientRects().length)return;seen.add(el);el.append(shape(el.id==='teach'?'media':'cards'));el.setAttribute('aria-busy','true');active.add(el);setTimeout(()=>clear(el),20000)})}
let queued=false;const observer=new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;scan()})});observer.observe(document.documentElement,{childList:true,subtree:true});
function ready(){document.querySelectorAll('.es-skeleton-initial').forEach(e=>e.remove());scan()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
window.addEventListener('error',()=>active.forEach(clear),{once:true});window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
})();
