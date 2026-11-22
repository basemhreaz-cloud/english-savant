(()=>{'use strict';const grade=document.body.dataset.grade;if(!/^kg[12]$/.test(grade||''))return;const hash=location.hash.slice(1);const video=/^u([1-4])-video(?:-title)?$/.exec(hash);if(video&&grade==='kg1'){location.replace('watch.html?lesson=kg1-t1-u'+video[1]);return;}if(/^(unit-[1-4]|review|term-one|term-two|pre-unit)$/.test(hash))location.replace('course-'+grade+'.html#'+hash);const crumb=document.querySelector('main>.breadcrumbs');
if(crumb&&!crumb.querySelector('a[href="grades.html"]')){
 const current=crumb.lastChild,sep=document.createElement('span'),link=document.createElement('a');
 sep.textContent=' / ';link.href='grades.html';link.textContent='مناهج مصر';
 crumb.insertBefore(sep,current);crumb.insertBefore(link,current);
}
})();
