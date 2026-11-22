(function(){'use strict';
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function buildTeach(u){
  var t=document.getElementById('teach'); if(!t) return;
  var h='';
  if(u.vocab && u.vocab.length){
    h+='<div class="teach-block"><h3>اتعلّم كلمات الوحدة</h3><p class="st-sub">دوس على البطاقة، والكلمة هتتبني حرف حرف.</p><div class="t-cards">';
    u.vocab.forEach(function(w){h+='<button class="t-card" data-w="'+esc(w)+'" data-i="0" dir="ltr">؟</button>'});
    h+='</div></div>';
  }
  if(u.sentences && u.sentences.length){
    h+='<div class="teach-block"><h3>اتعلّم جمل الوحدة</h3><p class="st-sub">دوس على الجملة، وهتتبني كلمة كلمة بالترتيب الصح.</p><div class="t-sents">';
    u.sentences.forEach(function(s,i){h+='<button class="t-sent" data-s="'+esc(s)+'" dir="ltr">'+(i+1)+' …</button>'});
    h+='</div></div>';
  }
  var chips=(u.phonics||[]).filter(function(g){return !g.words||!g.words.length});
  var sounds=(u.phonics||[]).filter(function(g){return g.words&&g.words.length});
  if(chips.length){
    h+='<div class="teach-block"><h3>لغة الوحدة</h3>';
    chips.forEach(function(g){h+='<div class="t-group" dir="ltr"><span class="t-focus">'+esc(g.focus)+'</span></div>'});
    h+='</div>';
  }
  if(sounds.length){
    h+='<div class="teach-block"><h3>اتعلّم الأصوات</h3><p class="st-sub">دوس على الكلمة، والصوت هيتحدد جواها.</p>';
    sounds.forEach(function(g){
      h+='<div class="t-group" dir="ltr"><span class="t-focus">'+esc(g.focus)+'</span><span class="t-words">';
      g.words.forEach(function(w){h+='<button class="t-word" data-w="'+esc(w)+'" data-c="'+esc(g.cluster||'')+'">'+esc(w)+'</button>'});
      h+='</span></div>';
    });
    h+='</div>';
  }
  t.innerHTML=h||'<div class="lesson-empty">الشرح بيتجهز.</div>';
  t.querySelectorAll('.t-card').forEach(function(b){
    b.addEventListener('click',function(){
      var w=b.dataset.w,i=+b.dataset.i;
      if(i>=w.length){b.dataset.i='0';b.textContent='؟';b.classList.remove('on');return}
      i++;b.dataset.i=i;b.textContent=w.slice(0,i);
      if(i>=w.length)b.classList.add('on');
    });
  });
  t.querySelectorAll('.t-sent').forEach(function(b){
    b.addEventListener('click',function(){
      if(b.dataset.busy)return;
      if(b.dataset.done){b.textContent=b.dataset.label;b.dataset.done='';return}
      b.dataset.busy='1';b.dataset.label=b.textContent;
      var words=b.dataset.s.split(' '),i=0;b.textContent='';
      var tm=setInterval(function(){
        b.textContent=(b.textContent?b.textContent+' ':'')+words[i];i++;
        if(i>=words.length){clearInterval(tm);delete b.dataset.busy;b.dataset.done='1';b.classList.add('on');}
      },350);
    });
  });
  t.querySelectorAll('.t-word').forEach(function(b){
    b.addEventListener('click',function(){
      var w=b.dataset.w,c=b.dataset.c;
      if(b.dataset.hl){b.innerHTML=esc(w);b.dataset.hl='';b.classList.remove('on');return}
      var pos=c&&w.indexOf(c)>=0?w.indexOf(c):0, len=c&&w.indexOf(c)>=0?c.length:1;
      b.innerHTML=esc(w.slice(0,pos))+'<b>'+esc(w.slice(pos,pos+len))+'</b>'+esc(w.slice(pos+len));
      b.dataset.hl='1';b.classList.add('on');
    });
  });
}

fetch(document.body.dataset.curriculum,{cache:'no-cache'}).then(function(r){if(!r.ok)throw Error('load');return r.json()}).then(function(d){var u=d.units.find(function(x){return x.id===document.body.dataset.unit});if(!u)throw Error('unit');buildTeach(u);document.body.dataset.teachingReady='true'}).catch(function(){document.getElementById('teach').innerHTML='<div class="lesson-empty">الشرح مش متاح دلوقتي. جرّب تحديث الصفحة بعد شوية.</div>';document.body.dataset.teachingReady='error'});})();
