/* ENGLISH SAVANT · Sage Olive Design System v1 · ds.js
   Mounts the responsive shell (pill, dock/rail), theme + language, hash router, i18n and UI helpers.
   Usage: DS.route('/x/:g/:u', function(ctx){ DS.tab('grades'); DS.title('شرح','Explain'); return htmlStringOrPromise });  DS.start({root:document.getElementById('app')}); */
(function(){
'use strict';
var IC={"home": "<path d=\"M3.8 10.6 12 3.9l8.2 6.7\"/><path d=\"M5.8 9.4V18a2.3 2.3 0 0 0 2.3 2.3h7.8a2.3 2.3 0 0 0 2.3-2.3V9.4\"/><path d=\"M10 20.3v-4.4a1.1 1.1 0 0 1 1.1-1.1h1.8a1.1 1.1 0 0 1 1.1 1.1v4.4\"/>", "grid": "<rect x=\"4\" y=\"4\" width=\"6.6\" height=\"6.6\" rx=\"2\"/><rect x=\"13.4\" y=\"4\" width=\"6.6\" height=\"6.6\" rx=\"2\"/><rect x=\"4\" y=\"13.4\" width=\"6.6\" height=\"6.6\" rx=\"2\"/><rect x=\"13.4\" y=\"13.4\" width=\"6.6\" height=\"6.6\" rx=\"2\"/>", "pen": "<path d=\"M4.6 19.4l.9-3.9L16.1 4.9a2.1 2.1 0 0 1 3 3L8.5 18.5z\"/><path d=\"M14.4 6.6l3 3\"/>", "play": "<rect x=\"3.5\" y=\"5.5\" width=\"17\" height=\"13\" rx=\"3.8\"/><path d=\"M10.3 9.4v5.2l4.4-2.6z\"/>", "gear": "<path d=\"M4 7.5h8.2M17.2 7.5H20M4 16.5h2.8M11.8 16.5H20\"/><rect x=\"12.2\" y=\"5.2\" width=\"5\" height=\"4.6\" rx=\"1.6\"/><rect x=\"6.8\" y=\"14.2\" width=\"5\" height=\"4.6\" rx=\"1.6\"/>", "search": "<rect x=\"4\" y=\"4\" width=\"12.6\" height=\"12.6\" rx=\"6\"/><path d=\"M15.2 15.2 20 20\"/>", "check": "<path d=\"M5 12.5l4.5 4.5L19 7.5\"/>", "close": "<path d=\"M6 6l12 12M18 6L6 18\"/>", "chev": "<path d=\"M9 6l6 6-6 6\"/>", "back": "<path d=\"M15 6l-6 6 6 6\"/>", "volume": "<path d=\"M4 10v4h4l5 4V6L8 10H4z\"/><path d=\"M16.5 9a4.2 4.2 0 010 6\"/>", "refresh": "<path d=\"M19.5 12a7.5 7.5 0 10-2.2 5.3\"/><path d=\"M19.5 5v4.5H15\"/>", "up": "<path d=\"M6 14l6-6 6 6\"/>", "book": "<path d=\"M5 5h6a2 2 0 012 2v12a2 2 0 00-2-2H5zM19 5h-6\"/><path d=\"M19 5v12h-6\"/>"};
var D=document,DE=D.documentElement,Q=new URLSearchParams(location.search);
var DS=window.DS={version:1};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
DS.esc=esc;
DS.icon=function(n,cls){return '<svg viewBox="0 0 24 24" aria-hidden="true"'+(cls?' class="'+cls+'"':'')+'>'+(IC[n]||'')+'</svg>'};
/* ---------- storage (same keys as the old site: es-theme is JSON, es-interface-language is plain) ---------- */
DS.store={get:function(k,d){try{var v=JSON.parse(localStorage.getItem('es-pv-'+k));return v==null?d:v}catch(e){return d}},set:function(k,v){try{localStorage.setItem('es-pv-'+k,JSON.stringify(v))}catch(e){}}};
/* ---------- language ---------- */
DS.lang=function(){if(Q.get('lang')==='en'||Q.get('lang')==='ar')return Q.get('lang');try{return localStorage.getItem('es-interface-language')==='en'?'en':'ar'}catch(e){return 'ar'}};
DS.t=function(ar,en){return DS.lang()==='en'?(en==null?ar:en):ar};
DS.num=function(n,lang){var s=String(n);return (lang||DS.lang())==='ar'?s.replace(/\d/g,function(d){return '٠١٢٣٤٥٦٧٨٩'[d]}):s};
DS.setLang=function(l){l=l==='en'?'en':'ar';try{localStorage.setItem('es-interface-language',l)}catch(e){}applyLang();try{var ev=new CustomEvent('es:interface-language',{detail:{language:l}});window.dispatchEvent(ev);D.dispatchEvent(new CustomEvent('es:interface-language',{detail:{language:l}}))}catch(e){}};
function applyLang(){var l=DS.lang();DE.lang=l;DE.dir=l==='ar'?'rtl':'ltr';chrome();if(started)render()}
/* ---------- theme: 'light' | 'dark' | 'auto' (auto follows the system) ---------- */
DS.themePref=function(){if(Q.get('mode')==='dark'||Q.get('mode')==='light')return Q.get('mode');var t=null;try{t=localStorage.getItem('es-theme')}catch(e){}try{t=JSON.parse(t)}catch(e){}return t==='dark'||t==='light'?t:'auto'};
DS.theme=function(){var p=DS.themePref();return p==='auto'?(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p};
DS.setTheme=function(v){try{if(v==='auto')localStorage.removeItem('es-theme');else localStorage.setItem('es-theme',JSON.stringify(v))}catch(e){}applyTheme()};
function applyTheme(){var t=DS.theme();DE.setAttribute('data-theme',t);if(D.body)D.body.classList.toggle('dark',t==='dark');var m=D.querySelector('meta[name=theme-color]');if(!m){m=D.createElement('meta');m.name='theme-color';D.head.appendChild(m)}m.content=t==='dark'?'#0e150c':'#cbd6b8'}
try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',applyTheme)}catch(e){}
window.addEventListener('storage',function(e){if(e.key==='es-theme')applyTheme();if(e.key==='es-interface-language')applyLang()});
/* ---------- search helpers ---------- */
DS.norm=function(s){return String(s||'').toLowerCase().replace(/[\u064B-\u0652\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/[۰-۹]/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)}).replace(/\s+/g,' ').trim()};
DS.match=function(hay,q){var h=DS.norm(hay),ws=DS.norm(q).split(' ').filter(Boolean);return ws.every(function(w){return h.indexOf(w)>-1})};
/* ---------- chrome ---------- */
var TABS=[['home','home','الرئيسية','Home','#/'],['grades','grid','الصفوف','Grades','#/grades'],['practice','pen','التدريب','Practice','#/practice'],['videos','play','الفيديوهات','Videos','#/videos'],['me','gear','الإعدادات','Settings','#/me']];
var cur='home',ttl=null,pill,tt,dock,rail,lastT='',logo='assets/adults-logo.webp',started=false,ROOT=null,MAIN=null,BASE=Q.get('base')||'';
DS.assetBase=function(b){if(b!=null)BASE=b;return BASE};
function tabsHtml(){return TABS.map(function(x){return '<a href="'+x[4]+'"'+(x[0]===cur?' class="on" aria-current="page"':'')+' aria-label="'+esc(DS.t(x[2],x[3]))+'">'+DS.icon(x[1])+'<span>'+esc(DS.t(x[2],x[3]))+'</span></a>'}).join('')}
function chrome(){
 if(!D.body)return;
 if(!pill){pill=D.createElement('div');pill.className='ds-pill';pill.setAttribute('role','status');pill.innerHTML='<div class="in"><img src="'+BASE+logo+'" width="26" height="26" alt=""><span class="tt"></span></div>';D.body.appendChild(pill);tt=pill.querySelector('.tt');
  var sk=D.createElement('a');sk.className='ds-skip';sk.href='#ds-main';sk.setAttribute('data-ds','skip');D.body.insertBefore(sk,D.body.firstChild);var mi=D.createElement('div');mi.className='ds-sr';mi.setAttribute('data-ds','mini');mi.innerHTML='<span>\u2630 ENGLISH SAVANT</span><span>\u0641\u062A\u062D \u0634\u0631\u064A\u0637 \u0627\u0644\u062A\u0646\u0642\u0644</span>';D.body.insertBefore(mi,sk.nextSibling);var sb=D.createElement('a');sb.className='ds-search';sb.href='#/search';sb.setAttribute('data-ds','search');sb.innerHTML=DS.icon('search');D.body.appendChild(sb);
  dock=D.createElement('nav');dock.className='ds-dock';D.body.appendChild(dock);rail=D.createElement('nav');rail.className='ds-rail';D.body.appendChild(rail)}
 var sk2=D.querySelector('[data-ds=skip]');if(sk2)sk2.textContent=DS.t('\u062A\u062E\u0637\u0651\u064E \u0625\u0644\u0649 \u0627\u0644\u0645\u062D\u062A\u0648\u0649','Skip to content');var sb2=D.querySelector('[data-ds=search]');if(sb2)sb2.setAttribute('aria-label',DS.t('بحث في الموقع','Search the site'));
 var h=tabsHtml();dock.innerHTML=h;rail.innerHTML=h;dock.setAttribute('aria-label',DS.t('التنقل الرئيسي','Main navigation'));rail.setAttribute('aria-label',DS.t('التنقل الرئيسي','Main navigation'));
 pillText(true);
}
function pillText(first,force){var txt=ttl?DS.t(ttl[0],ttl[1]):'';if(!txt){for(var i=0;i<TABS.length;i++)if(TABS[i][0]===cur)txt=DS.t(TABS[i][2],TABS[i][3])}
 var inn=pill.querySelector('.in');if(txt===lastT&&pill.style.width){if(force){pill.style.width='max-content';pill.style.width=Math.ceil(inn.getBoundingClientRect().width)+2+'px'}return}lastT=txt;pill.classList.add('sw');setTimeout(function(){tt.textContent=txt;pill.style.width='max-content';pill.style.width=Math.ceil(inn.getBoundingClientRect().width)+2+'px';pill.classList.remove('sw')},first&&!pill.style.width?0:110)}
DS.tab=function(name){cur=name;if(dock){var h=tabsHtml();dock.innerHTML=h;rail.innerHTML=h}};
DS.title=function(ar,en){ttl=[ar,en==null?ar:en];if(pill)pillText();D.title=DS.t(ar,en)+' | ENGLISH SAVANT'};
DS.toast=function(msg){var e=D.createElement('div');e.className='ds-toast';e.setAttribute('role','status');e.textContent=msg;D.body.appendChild(e);setTimeout(function(){e.remove()},2600)};
/* ---------- UI builders (all return html strings) ---------- */
var UI=DS.ui={};
UI.crumbs=function(items){var n=items.length,L=function(c){return esc(DS.t(c[1],c[2]))},B=function(c){return '<bdi>'+L(c)+'</bdi>'};
 var h=items.map(function(c,i){var last=i===n-1,mid=n>3&&i>0&&i<n-1,cls=mid?' class="mid"':'';
  var s=last?'<span aria-current="page" title="'+L(c)+'">'+B(c)+'</span>':'<a'+cls+' href="'+esc(c[0])+'">'+B(c)+'</a>';
  if(n>3&&i===0)s+='<a class="ell" href="'+esc(items[n-2][0])+'" aria-label="'+esc(DS.t('المستوى الأعلى','Up one level'))+'">\u2026</a>';return s}).join('');
 return '<nav class="ds-crumbs" aria-label="'+esc(DS.t('مسار الصفحة','Breadcrumbs'))+'">'+h+'</nav>'};
UI.back=function(href,ar,en){return '<a class="ds-back" href="'+esc(href)+'">'+DS.icon('back')+'<span>'+esc(DS.t(ar,en))+'</span></a>'};
UI.rowlink=function(o){return '<a class="ds-rowlink" href="'+esc(o.href)+'"><span class="ds-tile">'+(o.tile||'')+'</span><span class="tx"><b'+(o.ltr?' class="ds-ltr"':'')+'>'+esc(o.title)+'</b>'+(o.sub?'<small>'+esc(o.sub)+'</small>':'')+'</span><span class="go">'+DS.icon('chev')+'</span></a>'};
UI.qnum=function(n){return '<b class="num">'+DS.num(n)+'</b>'};
UI.skeleton=function(n){var h='';for(var i=0;i<(n||3);i++)h+='<div class="ds-skel"></div>';return '<div class="ds-stack" aria-busy="true" aria-label="'+esc(DS.t('بنحمّل','Loading'))+'">'+h+'</div>'};
UI.empty=function(msgAr,msgEn,withHome){return '<div class="ds-empty"><p>'+esc(DS.t(msgAr,msgEn))+'</p>'+(withHome===false?'':'<a class="ds-btn ds-btn--soft" href="#/">'+esc(DS.t('الرئيسية','Home'))+'</a>')+'</div>'};
UI.error=function(retry){return '<div class="ds-empty"><p>'+esc(DS.t('حصلت مشكلة في التحميل. اتأكد من النت وجرّب تاني.','Something went wrong loading this. Check your connection and try again.'))+'</p><button class="ds-btn" type="button" data-ds-retry>'+esc(DS.t('جرّب تاني','Try again'))+'</button> <a class="ds-btn ds-btn--soft" href="#/">'+esc(DS.t('الرئيسية','Home'))+'</a></div>'};
UI.progress=function(p){p=Math.max(0,Math.min(100,p||0));return '<div class="ds-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+Math.round(p)+'"><i style="width:'+p+'%"></i></div>'};
/* ---------- router ---------- */
var routes=[];
DS.route=function(pattern,fn){var keys=[];var re=new RegExp('^'+pattern.replace(/\/+$/,'').replace(/:([a-z]+)/gi,function(_,k){keys.push(k);return '([^/]+)'})+'/?$');routes.push({re:re,keys:keys,fn:fn})};
DS.go=function(h){location.hash=h};
function current(){var h=(location.hash||'#/').slice(1).split('?')[0]||'/';return h}
var token=0;
function render(){
 if(!MAIN)return;var path=current(),tk=++token,hit=null,params={};
 for(var i=0;i<routes.length;i++){var m=routes[i].re.exec(path);if(m){hit=routes[i];routes[i].keys.forEach(function(k,j){params[k]=decodeURIComponent(m[j+1])});break}}
 ttl=null;cur=path.split('/')[1]||'home';cur={'':'home',grades:'grades',practice:'practice',videos:'videos',me:'me'}[cur]||'grades';
 MAIN.innerHTML=UI.skeleton(3);
 function put(h){if(tk!==token)return;MAIN.innerHTML=h;chrome();window.scrollTo(0,0);D.dispatchEvent(new CustomEvent('ds:rendered',{detail:{path:path}}))}
 if(!hit){DS.title('مش لاقيين الصفحة دي','Page not found');put(UI.empty('الصفحة دي مش موجودة.','This page does not exist.'));return}
 var ctx={params:params,path:path,go:DS.go};
 try{Promise.resolve(hit.fn(ctx)).then(function(h){if(h!=null)put(h)}).catch(function(e){if(tk!==token)return;DS.title('حصلت مشكلة','Something went wrong');put(UI.error())})}catch(e){DS.title('حصلت مشكلة','Something went wrong');put(UI.error())}
}
D.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-ds-retry]'))render()});
DS.render=render;
DS.start=function(o){
 o=o||{};ROOT=o.root||D.getElementById('app');if(o.assetBase!=null)BASE=o.assetBase;
 D.body.classList.add('ds');ROOT.className='ds-app';ROOT.innerHTML='<main class="ds-page'+(o.wide?' ds-page--wide':'')+'" id="ds-main" tabindex="-1"></main>';MAIN=D.getElementById('ds-main');
 var v=D.querySelector('meta[name=viewport]');if(v&&!/viewport-fit/.test(v.content))v.content+=',viewport-fit=cover';
 try{D.fonts.ready.then(function(){pill&&pillText(0,1)})}catch(e){}window.addEventListener('load',function(){pill&&pillText(0,1)});started=true;applyTheme();applyLang();window.addEventListener('hashchange',render);render();
};

/* ---------- ds-select: styled dropdown wrapping a hidden native <select> (values, change events and engine logic stay on the native element) ---------- */
(function(){
var openS=null;
function close(){if(openS){openS.wrap.classList.remove('open');openS.btn.setAttribute('aria-expanded','false');openS.list.hidden=true;if(openS.list.parentNode)openS.list.parentNode.removeChild(openS.list);openS=null}}
function enhance(sel){
 if(sel._ds)return;var wrap=D.createElement('span');wrap.className='ds-select';sel.parentNode.insertBefore(wrap,sel);wrap.appendChild(sel);
 sel.classList.add('ds-select-native');sel.tabIndex=-1;sel.setAttribute('aria-hidden','true');
 var btn=D.createElement('button');btn.type='button';btn.className='ds-select-btn';btn.setAttribute('aria-haspopup','listbox');btn.setAttribute('aria-expanded','false');
 var lab=sel.getAttribute('aria-label')||(sel.id&&D.querySelector('label[for="'+sel.id+'"]')&&D.querySelector('label[for="'+sel.id+'"]').textContent);if(lab)btn.setAttribute('aria-label',lab);
 btn.innerHTML='<span class="v"></span>'+DS.icon('chev');
 var list=D.createElement('ul');list.className='ds-select-list';list.setAttribute('role','listbox');list.hidden=true;list.tabIndex=-1;
 wrap.appendChild(btn);wrap.appendChild(list);var o={sel:sel,wrap:wrap,btn:btn,list:list,idx:0};sel._ds=o;
 function items(){return [].slice.call(sel.options)}
 function sync(){var opts=items();list.innerHTML=opts.map(function(op,i){return '<li role="option" data-i="'+i+'"'+(op.disabled?' aria-disabled="true"':'')+(op.selected?' aria-selected="true"':'')+'>'+esc(op.textContent)+'</li>'}).join('');
  var cur=sel.options[sel.selectedIndex];btn.querySelector('.v').textContent=cur?cur.textContent:'';btn.className='ds-select-btn '+(sel.className||'').replace(/ds-select-native/g,'').trim();btn.disabled=sel.disabled;
  if(!cur||cur.value===''){btn.classList.add('empty')}}
 function hl(i){var li=list.children;for(var k=0;k<li.length;k++)li[k].classList.toggle('hl',k===i);o.idx=i;if(li[i])li[i].scrollIntoView({block:'nearest'})}
 function pick(i){var op=sel.options[i];if(!op||op.disabled)return;sel.selectedIndex=i;sel.dispatchEvent(new Event('input',{bubbles:true}));sel.dispatchEvent(new Event('change',{bubbles:true}));sync();close();btn.focus()}
 function place(){var r=btn.getBoundingClientRect(),top=72,bot=innerHeight-(innerWidth<1024?104:16),below=bot-r.bottom-6,above=r.top-top-6,up=below<200&&above>below,avail=Math.max(120,Math.min(260,up?above:below));
  list.style.maxHeight=avail+'px';list.style.minWidth=r.width+'px';list.style.top=up?'auto':(r.bottom+6)+'px';list.style.bottom=up?(innerHeight-r.top+6)+'px':'auto';
  var rtl=DE.dir==='rtl',w=list.offsetWidth;list.style.left=Math.max(8,Math.min(innerWidth-w-8,rtl?r.right-w:r.left))+'px'}
 o.place=place;
 function open(){close();sync();var r0=btn.getBoundingClientRect(),lim=innerHeight-(innerWidth<1024?104:16);if(r0.bottom>lim-60||r0.top<80){window.scrollBy(0,r0.top-innerHeight/2)}
  D.body.appendChild(list);list.hidden=false;wrap.classList.add('open');btn.setAttribute('aria-expanded','true');openS=o;place();hl(Math.max(0,sel.selectedIndex))}
 btn.addEventListener('click',function(e){e.preventDefault();openS===o?close():open()});
 btn.addEventListener('keydown',function(e){var n=sel.options.length,k=e.key;
  if(k==='ArrowDown'||k==='ArrowUp'){e.preventDefault();if(openS!==o)open();else hl(Math.max(0,Math.min(n-1,o.idx+(k==='ArrowDown'?1:-1))))}
  else if(k==='Home'&&openS===o){e.preventDefault();hl(0)}else if(k==='End'&&openS===o){e.preventDefault();hl(n-1)}
  else if((k==='Enter'||k===' ')&&openS===o){e.preventDefault();pick(o.idx)}else if(k==='Escape'&&openS===o){e.preventDefault();close()}else if(k==='Tab')close();
  else if(k.length===1&&/\S/.test(k)){var q=k.toLowerCase();for(var s=1;s<=n;s++){var i=(o.idx+s)%n;if(sel.options[i].textContent.trim().toLowerCase().indexOf(q)===0){if(openS!==o)open();hl(i);break}}}});
 list.addEventListener('mousedown',function(e){e.preventDefault()});
 list.addEventListener('click',function(e){var li=e.target.closest('li');if(li)pick(+li.dataset.i)});
 sel.addEventListener('change',sync);
 try{new MutationObserver(sync).observe(sel,{childList:true,attributes:true,subtree:true,attributeFilter:['class','disabled','selected','label']})}catch(e){}
 sync();
}
D.addEventListener('click',function(e){if(openS&&!openS.wrap.contains(e.target)&&!openS.list.contains(e.target))close()});window.addEventListener('scroll',function(){if(openS&&openS.place)openS.place()},true);
window.addEventListener('resize',close);
DS.select={enhance:function(root){(root||D).querySelectorAll('select[data-ds-select]').forEach(enhance)},close:close};
D.addEventListener('ds:rendered',function(){DS.select.enhance()});
})();
/* fonts */
(function(){var l=D.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Baloo+Bhaijaan+2:wght@600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap';D.head.appendChild(l)})();
})();
/* ---------- v1.6.3 ---------- */
(function(){var D=document;
DS.bdi=function(s){return '<bdi>'+String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})+'</bdi>'};
DS.feedback=function(kind,html){return '<div class="ds-feedback '+(kind==='ok'?'ok':'bad')+'" role="status"><span class="ds-fb-t">'+html+'</span></div>'};
function fade(){D.querySelectorAll('.ds-chips').forEach(function(c){var rtl=getComputedStyle(c).direction==='rtl',max=c.scrollWidth-c.clientWidth,x=Math.abs(c.scrollLeft),f=[];
 if(max>2){if(x>2)f.push('start');if(x<max-2)f.push('end')}c.setAttribute('data-fade',f.join(' '))})}
D.addEventListener('ds:rendered',function(){setTimeout(fade,0)});window.addEventListener('resize',fade);D.addEventListener('scroll',function(e){if(e.target&&e.target.classList&&e.target.classList.contains('ds-chips'))fade()},true);
function sp(){var s=D.querySelector('.ds-search'),p=D.querySelector('.ds-pill');if(!s||!p)return;
 if(innerWidth<1024){s.style.left='';s.style.right='';return}
 var r=p.getBoundingClientRect(),rtl=D.documentElement.dir==='rtl';var want=Math.round(rtl?r.left-14-44:r.right+14);s.style.right='auto';s.style.left=want+'px';var off=s.getBoundingClientRect().left-want;if(Math.abs(off)>0.5)s.style.left=(want-off)+'px'}
function init(){var p=D.querySelector('.ds-pill');if(!p){setTimeout(init,200);return}
 try{new ResizeObserver(sp).observe(p)}catch(e){}window.addEventListener('resize',sp);D.addEventListener('ds:lang',sp);setTimeout(sp,400);setTimeout(sp,1200)}
init()})();
DS.scrollTo=function(el,smooth){if(!el)return;var y=el.getBoundingClientRect().top+scrollY-(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ds-top-px'))||(Math.max(12,0)+44+20));scrollTo({top:Math.max(0,y),behavior:smooth&&!matchMedia('(prefers-reduced-motion:reduce)').matches?'smooth':'auto'})};
DS.LN=function(n){return String(n)};
DS.searchPH=function(){return DS.t('ابحث عن صف، وحدة، درس أو أداة…','Search for a grade, unit, lesson or tool…')};
DS.links=DS.links||{};DS.links.waGroup='https://chat.whatsapp.com/D1CvIcqPdeSCn4QCreC4QY?s=cl&p=a&iam=2';
