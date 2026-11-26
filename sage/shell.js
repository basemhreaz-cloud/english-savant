/* ENGLISH SAVANT sage shell: settings + practice tab routes, global handlers */
(function(){
var D=document;
DS.route('/practice',function(){setTimeout(function(){location.replace('../exam-generator.html')},0);return '<div class="ds-empty"><p>'+DS.t('جارٍ فتح التدريب…','Opening practice…')+'</p></div>'});
DS.route('/me',function(){
 DS.tab('me');DS.title(DS.t('الإعدادات','Settings'),'Settings');
 var th=DS.themePref(),lg=DS.lang();
 function b(k,v,cur,ar,en){return '<button type="button" class="ds-btn'+(cur===v?'':' ds-btn--soft')+'" data-es-set="'+k+':'+v+'" aria-pressed="'+(cur===v)+'">'+DS.t(ar,en)+'</button>'}
 return '<section class="ds-hero"><h1>'+DS.t('الإعدادات','Settings')+'</h1></section><div class="ds-stack">'
 +'<div class="ds-card"><b>'+DS.t('المظهر','Appearance')+'</b><div class="ds-grid ds-grid--2" style="margin-top:8px">'+b('theme','auto',th,'تلقائي','Auto')+b('theme','light',th,'فاتح','Light')+b('theme','dark',th,'ليلي','Dark')+'</div></div>'
 +'<div class="ds-card"><b>'+DS.t('اللغة','Language')+'</b><div class="ds-grid ds-grid--2" style="margin-top:8px">'+b('lang','ar',lg,'العربية','العربية')+b('lang','en',lg,'English','English')+'</div></div>'
 +'<a class="ds-btn ds-btn--soft" href="#/download">'+DS.t('حمّل التطبيق','Download the app')+'</a>'
 +'<a class="ds-btn ds-btn--soft" href="../classic.html">'+DS.t('الموقع القديم','Classic site')+'</a></div>';
});
D.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-es-set]');if(!t)return;var p=t.getAttribute('data-es-set').split(':');if(p[0]==='theme')DS.setTheme(p[1]);else DS.setLang(p[1]);if(location.hash==='#/me'){D.dispatchEvent(new Event('hashchange'));window.dispatchEvent(new HashChangeEvent('hashchange'))}});
})();
