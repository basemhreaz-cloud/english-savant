/* Small WebView 66 API fallbacks, loaded before this script uses them. */
(function(){if(!Array.prototype.flatMap)Object.defineProperty(Array.prototype,'flatMap',{configurable:true,writable:true,value:function(fn,ctx){return this.reduce(function(out,v,i,a){return out.concat(fn.call(ctx,v,i,a))},[])}});if(!String.prototype.matchAll)Object.defineProperty(String.prototype,'matchAll',{configurable:true,writable:true,value:function(p){var f=p.flags||'';if(f.indexOf('g')<0)f+='g';var r=new RegExp(p.source,f),a=[],m;while((m=r.exec(String(this)))){a.push(m);if(!m[0])r.lastIndex++}return a}});if(typeof Element!=='undefined'&&!Element.prototype.replaceChildren)Object.defineProperty(Element.prototype,'replaceChildren',{configurable:true,writable:true,value:function(){while(this.firstChild)this.removeChild(this.firstChild);for(var i=0;i<arguments.length;i++)this.append(arguments[i])}})})();
"use strict";
(() => {
  const $ = (s) => document.querySelector(s), content = $("#k2-content"), status = $("#k2-audio-status"), player = new Audio();
  player.preload = "none";
  const V = "20261122-closure1";
  const closureStyle = document.createElement("style");
  closureStyle.textContent = ".k2-q-card.k2-closure-card{background:var(--surface);color:var(--ink)}";
  document.head.appendChild(closureStyle);
  let colourReady = false;
  let finishAudio = null;
  let data, audio = {}, index = 0, traceIndex = 0, ticket = 0, activeButton = null;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const asset = (p) => "assets/kg2/" + p + "?v=" + V;
  const UNITS = { "kg2-t1-u2": "u2", "kg2-t1-u3": "u3", "kg2-t1-u4": "u4", "kg2-t1-review": "review", "kg2-t1-preunit": "preunit" };
  function clip(id) {
    const c = audio[id];
    return (c == null ? void 0 : c.verified) === true && /^[a-f0-9]{64}$/.test(c.sha256 || "") ? c.src + "?v=" + c.sha256.slice(0, 12) : null;
  }
  function stop() {
    ticket++;
    player.pause();
    player.removeAttribute("src");
    player.load();
    if (finishAudio) {
      finishAudio(null);
      finishAudio = null;
    }
    if (activeButton) activeButton.classList.remove("is-speaking");
    activeButton = null;
    document.querySelectorAll("#k2-content video").forEach((v) => v.pause());
    status.textContent = "";
  }
  async function playSeq(ids, button) {
    stop();
    const urls = ids.map(clip);
    if (urls.some((x) => !x)) {
      status.textContent = "الصوت ده لسه بيتراجع.";
      return false;
    }
    const mine = ticket;
    activeButton = button || null;
    if (button) button.classList.add("is-speaking");
    for (const src of urls) {
      if (mine !== ticket) return null;
      status.textContent = "الصوت بيحمّل…";
      const ok = await new Promise((resolve) => {
        let done = false;
        const finish = (value) => {
          if (done) return;
          done = true;
          player.onended = player.onerror = null;
          if (finishAudio === finish) finishAudio = null;
          resolve(value);
        };
        finishAudio = finish;
        player.onended = () => finish(true);
        player.onerror = () => finish(false);
        player.src = src;
        player.play().then(() => {
          if (mine === ticket) status.textContent = "اسمع وردّد براحتك.";
        }).catch(() => finish(false));
      });
      if (mine !== ticket) return null;
      if (ok !== true) {
        if (button) button.classList.remove("is-speaking");
        activeButton = null;
        status.textContent = "الصوت ما فتحش. اضغط تاني.";
        return false;
      }
    }
    if (mine === ticket) {
      if (button) button.classList.remove("is-speaking");
      activeButton = null;
      status.textContent = "اضغط تاني لو تحب تسمعها كمان مرة.";
    }
    return true;
  }
  const listen = (ids, label, cls = "") => {
    const seq = [].concat(ids);
    return seq.every((id) => clip(id)) ? `<button type="button" class="k2-listen ${cls}" data-seq="${esc(seq.join(" "))}">${esc(label)}</button>` : `<span class="k2-note-held">الصوت ده لسه بيتراجع.</span>`;
  };
  const hints = (a, txt) => `<p class="k2-help">${esc(txt || a.help || "")}</p>${a.instr ? `<div class="k2-instructions">${listen(a.instr, "اسمع المطلوب بالعربي")}</div>` : ""}`;
  const tapCard = (w) => `<button type="button" class="k2-picture" data-seq="${esc(w.ar + " " + w.en)}" aria-label="اسمع: ${esc(w.label_en)}"><img src="${asset(w.img)}" alt="${esc(w.label_en)}" width="400" height="400" loading="lazy"><span lang="en" dir="ltr">${esc(w.label_en)}</span><small>اضغط على الصورة واسمع</small></button>`;
  function fb(msg, ok) {
    return `<p class="k2-fb ${ok ? "ok" : "no"}" role="status">${msg}</p>`;
  }
  function passage(a) {
    return a.context ? `<section class="k2-passage" aria-label="الحوار قبل الأسئلة"><h3>${esc(a.context.title_ar)}</h3>${a.context.lines.map((l) => `<p lang="en" dir="ltr">${l.speaker ? `<b>${esc(l.speaker)}:</b> ` : ""}${esc(l.text)}</p>`).join("")}${listen(a.context.lines.map((l) => l.audio), "اسمع الحوار بالترتيب")}</section>` : "";
  }
  const storyMarkup = (a, image, escape, lineButton, seqButton) => `<div class="k2-instructions">${seqButton(a.panels.flatMap((p) => p.lines.map((l) => l.audio)), "اسمع القصة كلها بالترتيب")}</div><div class="k2-story">${a.panels.map((p, i) => `<section class="k2-story-card" aria-label="المشهد ${i + 1}"><h3>المشهد ${i + 1}</h3><img src="${image(p.image)}" alt="${escape(p.alt)}" width="600" height="450" loading="lazy">${p.lines.map((l) => `<div class="k2-story-line"><b>${escape(l.speaker_ar)}</b><p class="k2-story-ar">${escape(l.meaning_ar)}</p><p class="k2-story-en" dir="ltr" lang="en">${escape(l.text)}</p>${lineButton(l.audio, "اسمع الجملة بالإنجليزي")}</div>`).join("")}<div class="k2-instructions">${seqButton(p.lines.map((l) => l.audio), "اسمع المشهد بالترتيب")}</div></section>`).join("")}</div><p class="k2-note-held">${escape(a.adaptation_note)}</p>`;
  function render() {
    var _a;
    stop();
    colourReady = false;
    traceIndex = 0;
    const a = data.activities[index];
    $("#k2-title").textContent = a.title_ar;
    $("#k2-picker").value = String(index);
    $("#k2-count").textContent = `${index + 1} من ${data.activities.length}`;
    $("#k2-prev").disabled = index === 0;
    $("#k2-next").disabled = index === data.activities.length - 1;
    if (location.hash !== "#" + a.id) location.hash = a.id;
    let b = "";
    if (a.kind === "story") b = hints(a) + storyMarkup(a, asset, esc, listen, listen);
    if (a.kind === "tap-words") b = hints(a) + `<div class="k2-pictures">${a.words.map(tapCard).join("")}</div>`;
    if (a.kind === "lines") {
      b = hints(a, a.help || "اسمعوا كل سطر وردّدوه مع شخص كبير.") + (a.whole ? `<div class="k2-instructions">${listen(a.whole, "اسمع الأغنية كاملة")}</div>` : "") + `<div class="k2-values">${a.lines.map((l) => `<article>${l.speaker ? `<small class="k2-speaker" lang="en" dir="ltr">${esc(l.speaker)}</small>` : ""}<p lang="en" dir="ltr">${esc(l.text)}</p>${l.meaning_ar ? `<p>${esc(l.meaning_ar)}</p>` : ""}${l.audio ? listen(l.audio, "اسمع الجملة") : ""}</article>`).join("")}</div>` + (a.lines.every((l) => l.audio) ? `<div class="k2-instructions">${listen(a.lines.map((l) => l.audio), "اسمع كله بالترتيب")}</div>` : "");
    }
    if (a.kind === "picture-lines") {
      b = hints(a) + (a.question ? `<section class="k2-q-card k2-closure-card"><p lang="en" dir="ltr">${esc(a.question.text)}</p><p>${esc(a.question.meaning_ar)}</p>${listen(a.question.audio, "اسمع السؤال")}</section>` : "") + a.items.map((it) => `<article class="k2-q-card k2-rv k2-closure-card"><img src="${asset(it.img)}" alt="${esc(it.alt)}"><p lang="en" dir="ltr" class="k2-q">${esc(it.text)}</p><p>${esc(it.meaning_ar)}</p>${listen(it.audio, "اسمع الجملة بالإنجليزي")}</article>`).join("");
    }
    if (a.kind === "free-colour") {
      b = hints(a) + `<article class="k2-q-card k2-closure-card"><div class="k2-rv"><img id="k2-free-picture" src="${asset(a.choices[0].img)}" alt="فستان بلون من اختيارك"></div><div class="k2-choices">${a.choices.map((c, i) => `<button type="button" data-free-colour="${i}" aria-pressed="${i === 0}">${esc(c.label_ar)}</button>`).join("")}</div><p id="k2-free-choice" role="status">اختيارك: ${esc(a.choices[0].label_ar)}. كل الألوان متاحة.</p></article>`;
    }
    if (a.kind === "draw-count") {
      b = hints(a) + a.targets.map((n, i) => `<article class="k2-q-card k2-closure-card"><h3>ارسم ${n} دواير</h3><canvas class="k2-free-draw" data-pad="${i}" width="650" height="300" style="display:block;width:100%;height:auto;touch-action:none;background:white;border:2px solid var(--edge);border-radius:14px" role="img" aria-label="مساحة رسم حر: ${n} دواير"></canvas><p>عدّ اللي رسمته مع شخص كبير.</p><button type="button" data-pad-clear="${i}">امسح وجرب تاني</button></article>`).join("");
    }
    if (a.kind === "trace" || a.kind === "count-trace") {
      b = hints(a, "شوف الحركة، وبعدها اتتبّع بإصبعك من نقطة البداية. تدريب حر من غير درجات.");
      if (a.counts) b += `<div class="k2-pictures k2-count-wide">${a.counts.map((c) => `<button type="button" class="k2-picture" data-seq="${esc(c.ar + " " + c.en)}" aria-label="${esc(c.alt)}"><img src="${asset(c.img)}" alt="${esc(c.alt)}" width="800" height="280" loading="lazy"><span dir="ltr">${c.n}</span><small>اسمع العدد بالعربي ثم الإنجليزي</small></button>`).join("")}</div>`;
      b += `<div class="k2-trace-tabs">${a.items.map((x, i) => `<button type="button" data-trace="${i}" aria-pressed="${i === 0}"><span dir="ltr">${esc(x.glyph)}</span></button>`).join("")}</div><div id="k2-trace-area"></div>` + (a.held_text ? `<p class="k2-note-held">${esc(a.held_text)}</p>` : "");
    }
    if (a.kind === "colour-pick") {
      b = hints(a) + `<div class="k2-instructions">${listen(a.prompt.audio, "اسمع الجملة")}</div><p lang="en" dir="ltr" class="k2-q">${esc(a.prompt.text)}</p><div class="k2-pictures k2-three">${a.choices.map((c, i) => `<button type="button" class="k2-picture" data-pick="${i}" ${a.requirePrompt ? "disabled" : ""} aria-label="${esc(c.alt)}"><img src="${asset(c.img)}" alt="${esc(c.alt)}" width="400" height="400"></button>`).join("")}</div><div id="k2-fb"></div>`;
    }
    if (a.kind === "true-false") {
      b = hints(a) + passage(a) + a.items.map((it, i) => `<article class="k2-q-card" data-i="${i}"><p lang="en" dir="ltr" class="k2-q">${esc(it.text)}</p>${listen(it.audio, "اسمع الجملة")}<div class="k2-choices"><button type="button" data-tf="${i}:1">صح</button><button type="button" data-tf="${i}:0">غلط</button></div><div class="k2-fbslot"></div></article>`).join("") + `<p class="k2-note-held">${esc(a.note || "")}</p>`;
    }
    if (a.kind === "choose-word") {
      b = hints(a) + passage(a) + a.items.map((it, i) => `<article class="k2-q-card"><p lang="en" dir="ltr" class="k2-q">${esc(it.text)}</p>${listen(it.audio, "اسمع الجملة")}<div class="k2-choices">${it.choices.map((c) => `<button type="button" lang="en" dir="ltr" data-cw="${i}:${esc(c)}">${esc(c)}</button>`).join("")}</div><div class="k2-fbslot"></div></article>`).join("");
    }
    if (a.kind === "review-letter" || a.kind === "review-count" || a.kind === "review-match") {
      b = hints(a) + a.items.map((it, i) => `<article class="k2-q-card k2-rv"><img src="${asset(it.img)}" alt="${esc(it.alt)}" class="${a.kind === "review-count" ? "wide" : ""}" loading="lazy">${it.ar && it.en ? listen([it.ar, it.en], "اسمع الكلمة: عربي ثم إنجليزي") : ""}<div class="k2-choices">${it.choices.map((c) => `<button type="button" ${a.kind === "review-letter" ? 'lang="en" dir="ltr"' : ""} data-rv="${i}:${esc(c)}">${esc(it.labels ? it.labels[c] : c)}</button>`).join("")}</div><div class="k2-fbslot"></div></article>`).join("");
    }
    if (a.kind === "review-pic") {
      b = hints(a) + a.items.map((it, i) => `<article class="k2-q-card"><p class="k2-q" dir="ltr" lang="en">${esc(it.letter)}</p><div class="k2-pictures k2-three">${it.choices.map((c) => `<button type="button" class="k2-picture" data-rp="${i}:${esc(c.k)}" aria-label="${esc(c.alt)}"><img src="${asset(c.img)}" alt="${esc(c.alt)}" width="400" height="400"></button>`).join("")}</div><div class="k2-fbslot"></div></article>`).join("");
    }
    if (a.kind === "review-tf") {
      b = hints(a) + a.items.map((it, i) => `<article class="k2-q-card k2-rv"><img src="${asset(it.img)}" alt="${esc(it.alt)}"><p lang="en" dir="ltr" class="k2-q">${esc(it.text)}</p><div class="k2-choices"><button type="button" data-tf="${i}:1">صح</button><button type="button" data-tf="${i}:0">غلط</button></div><div class="k2-fbslot"></div></article>`).join("") + `<p class="k2-note-held">${esc(a.note || "")}</p>`;
    }
    if (a.kind === "sort-bag") {
      b = hints(a) + a.items.map((it, i) => `<article class="k2-q-card k2-rv"><button type="button" class="k2-picture is-small" ${it.ar ? `data-seq="${esc(it.ar + " " + it.en)}"` : ""} aria-label="${esc(it.alt)}"><img src="${asset(it.img)}" alt="${esc(it.alt)}" width="300" height="300"><span lang="en" dir="ltr">${esc(it.word)}</span></button><div class="k2-choices"><button type="button" data-bag="${i}:1">في الشنطة</button><button type="button" data-bag="${i}:0">مش في الشنطة</button></div><div class="k2-fbslot"></div></article>`).join("") + `<p class="k2-note-held">${esc(a.note || "")}</p>`;
    }
    if (a.kind === "tap-colour") {
      b = hints(a) + a.items.map((it, i) => `<article class="k2-q-card" data-cl="${i}"><p class="k2-q">لوّن ${it.target} من ${it.available} سحابات.</p><div class="k2-clouds">${Array.from({ length: it.available }, (_, j) => `<button type="button" class="k2-cloud" data-cloud="${i}:${j}" aria-pressed="false" aria-label="سحابة ${j + 1}"><img src="${asset(a.img)}" alt="" width="80" height="80"></button>`).join("")}</div><p class="k2-cl-count" role="status">ملوّن 0 من ${it.target}</p><button type="button" data-clear="${i}">امسح وجرب تاني</button></article>`).join("");
    }
    if ((a.kind === "trace" || a.kind === "count-trace") && ((_a = a.words) == null ? void 0 : _a.length)) b += `<section class="k2-letter-words"><h3>نسمع كلمات الحروف</h3><p class="k2-help">اضغط على الصورة: معناها بالعربي الأول، وبعدها الكلمة بالإنجليزي. دي كلمات كاملة، مش أصوات حروف منفردة.</p>${[...new Set(a.words.map((w) => w.letter || ""))].map((letter) => `<h4 lang="en" dir="ltr">${esc(letter)}</h4><div class="k2-pictures">${a.words.filter((w) => (w.letter || "") === letter).map(tapCard).join("")}</div>`).join("")}</section>`;
    content.innerHTML = b;
    if (a.kind === "trace" || a.kind === "count-trace") drawTrace();
    if (a.kind === "draw-count") initPads();
  }
  function initPads() {
    content.querySelectorAll(".k2-free-draw").forEach((c) => {
      const x = c.getContext("2d");
      let down = false;
      x.lineWidth = 7;
      x.lineCap = "round";
      x.lineJoin = "round";
      x.strokeStyle = "#315d4b";
      const pt = (e) => {
        const r = c.getBoundingClientRect();
        return [(e.clientX - r.left) * c.width / r.width, (e.clientY - r.top) * c.height / r.height];
      };
      c.onpointerdown = (e) => {
        e.preventDefault();
        down = true;
        c.setPointerCapture(e.pointerId);
        const [p, q] = pt(e);
        x.beginPath();
        x.moveTo(p, q);
        x.lineTo(p + 0.1, q + 0.1);
        x.stroke();
      };
      c.onpointermove = (e) => {
        if (!down) return;
        e.preventDefault();
        const [p, q] = pt(e);
        x.lineTo(p, q);
        x.stroke();
      };
      c.onpointerup = c.onpointercancel = () => {
        down = false;
      };
    });
  }
  function drawTrace() {
    const a = data.activities[index], t = a.items[traceIndex];
    $("#k2-trace-area").innerHTML = `<div class="k2-trace-layout"><section><h3>شوف اتجاه الحركة: <span dir="ltr">${esc(t.glyph)}</span></h3><video class="k2-animation" controls playsinline preload="none" poster="${asset(t.poster.replace("assets/kg2/", ""))}" src="${asset(t.mp4.replace("assets/kg2/", ""))}" aria-label="اتجاه تتبع ${esc(t.glyph)}"></video><button type="button" class="k2-trace-play">شغّل حركة التتبع</button>${t.note_ar ? `<p class="k2-note-held">${esc(t.note_ar)}</p>` : ""}</section><section><h3>دلوقتي جرّب بإصبعك</h3><div class="k2-canvas-wrap"><img src="${asset(t.poster.replace("assets/kg2/", ""))}" alt="دليل ترتيب تتبع ${esc(t.glyph)}" width="500" height="600"><canvas id="k2-canvas" width="500" height="600" role="img" aria-label="مساحة تتبع حر بالإصبع أو الفأرة"></canvas></div><button type="button" class="k2-clear">امسح وجرب تاني</button><p class="k2-help">حرّك إصبعك فوق الدليل. مفيش تصحيح آلي أو تقييم لخطك.</p></section></div>`;
    const c = $("#k2-canvas"), x = c.getContext("2d");
    let d = false;
    x.strokeStyle = "#315d4b";
    x.lineWidth = 16;
    x.lineCap = "round";
    x.lineJoin = "round";
    const pt = (e) => {
      const r = c.getBoundingClientRect();
      return [(e.clientX - r.left) * 500 / r.width, (e.clientY - r.top) * 600 / r.height];
    };
    c.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      d = true;
      c.setPointerCapture(e.pointerId);
      const [a2, b] = pt(e);
      x.beginPath();
      x.moveTo(a2, b);
      x.lineTo(a2 + 0.1, b + 0.1);
      x.stroke();
    });
    c.addEventListener("pointermove", (e) => {
      if (!d) return;
      e.preventDefault();
      const [a2, b] = pt(e);
      x.lineTo(a2, b);
      x.stroke();
    });
    const end = () => {
      d = false;
    };
    c.addEventListener("pointerup", end);
    c.addEventListener("pointercancel", end);
  }
  const mark = (slot, ok, btn) => {
    slot.innerHTML = fb(ok ? "أحسنت! ✓" : "جرّب تاني، مفيش مشكلة.", ok);
    if (btn) btn.setAttribute("aria-pressed", "true");
  };
  content.addEventListener("click", async (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const a = data.activities[index];
    if (b.dataset.padClear !== void 0) {
      const c = content.querySelector(`[data-pad="${+b.dataset.padClear}"]`);
      c.getContext("2d").clearRect(0, 0, c.width, c.height);
      return;
    }
    if (b.dataset.freeColour !== void 0) {
      const c = a.choices[+b.dataset.freeColour];
      $("#k2-free-picture").src = asset(c.img);
      content.querySelectorAll("[data-free-colour]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      $("#k2-free-choice").textContent = "اختيارك: " + c.label_ar + ". كل الألوان متاحة.";
      return;
    }
    if (b.dataset.seq) {
      const isPrompt = a.requirePrompt && b.dataset.seq === a.prompt.audio;
      if (isPrompt) {
        colourReady = false;
        content.querySelectorAll("[data-pick]").forEach((x) => x.disabled = true);
      }
      const ok = await playSeq(b.dataset.seq.split(" "), b);
      if (isPrompt && ok !== null && data.activities[index] === a) {
        colourReady = ok === true;
        content.querySelectorAll("[data-pick]").forEach((x) => x.disabled = !colourReady);
      }
      return;
    }
    if (b.dataset.trace !== void 0) {
      stop();
      traceIndex = +b.dataset.trace;
      content.querySelectorAll("[data-trace]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      drawTrace();
      return;
    }
    if (b.classList.contains("k2-trace-play")) {
      const v = $(".k2-animation");
      stop();
      v.currentTime = 0;
      v.play().catch(() => status.textContent = "الحركة ما حمّلتش. اضغط تاني.");
      return;
    }
    if (b.classList.contains("k2-clear")) {
      const c = $("#k2-canvas");
      c.getContext("2d").clearRect(0, 0, 500, 600);
      return;
    }
    if (b.dataset.pick !== void 0) {
      if (a.requirePrompt) {
        if (!colourReady) return;
        content.querySelectorAll("[data-pick]").forEach((x) => x.disabled = true);
        const heard = await playSeq(a.choice_pair, b);
        if (heard === null) return;
        colourReady = heard === true;
        content.querySelectorAll("[data-pick]").forEach((x) => x.disabled = !colourReady);
        if (!colourReady) return;
      }
      const ok = a.choices[+b.dataset.pick].ok;
      $("#k2-fb").innerHTML = fb(ok ? a.success_ar || "أحسنت! ده التيشيرت الأصفر ✓" : "جرّب تاني، مفيش مشكلة.", ok);
      return;
    }
    if (b.dataset.tf) {
      const [i, v] = b.dataset.tf.split(":");
      mark(b.closest(".k2-q-card").querySelector(".k2-fbslot"), v === "1" === a.items[+i].ok);
      return;
    }
    if (b.dataset.cw) {
      const [i, v] = b.dataset.cw.split(":");
      mark(b.closest(".k2-q-card").querySelector(".k2-fbslot"), v === a.items[+i].ok);
      return;
    }
    if (b.dataset.bag) {
      const [i, v] = b.dataset.bag.split(":");
      mark(b.closest(".k2-q-card").querySelector(".k2-fbslot"), v === "1" === a.items[+i].inbag);
      return;
    }
    if (b.dataset.rp) {
      const [i, v] = b.dataset.rp.split(":");
      const c = a.items[+i].choices.find((x) => x.k === v);
      if ((c == null ? void 0 : c.ar) && (c == null ? void 0 : c.en)) {
        const heard = await playSeq([c.ar, c.en], b);
        if (heard !== true) return;
      }
      mark(b.closest(".k2-q-card").querySelector(".k2-fbslot"), v === a.items[+i].ok);
      return;
    }
    if (b.dataset.rv) {
      const [i, v] = b.dataset.rv.split(":");
      mark(b.closest(".k2-q-card").querySelector(".k2-fbslot"), v === String(a.items[+i].ok));
      return;
    }
    if (b.dataset.cloud) {
      const [i, j] = b.dataset.cloud.split(":");
      const on = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", String(on));
      b.classList.toggle("on", on);
      const card = b.closest(".k2-q-card"), n = card.querySelectorAll(".k2-cloud.on").length, t = a.items[+i].target;
      card.querySelector(".k2-cl-count").textContent = n === t ? `ملوّن ${n} من ${t}. أحسنت! ✓` : `ملوّن ${n} من ${t}`;
      return;
    }
    if (b.dataset.clear !== void 0) {
      const card = b.closest(".k2-q-card");
      card.querySelectorAll(".k2-cloud").forEach((x) => {
        x.classList.remove("on");
        x.setAttribute("aria-pressed", "false");
      });
      card.querySelector(".k2-cl-count").textContent = `ملوّن 0 من ${a.items[+b.dataset.clear].target}`;
    }
  });
  function revealActivity() {
    requestAnimationFrame(() => {
      var _a;
      const title = $("#k2-title");
      const edge = Math.max(90, ((_a = document.querySelector(".header")) == null ? void 0 : _a.getBoundingClientRect().bottom) || 0) + 18;
      window.scrollTo({ top: Math.max(0, window.scrollY + title.getBoundingClientRect().top - edge), behavior: "instant" });
    });
  }
  $("#k2-prev").addEventListener("click", () => {
    if (index > 0) {
      index--;
      render();
      revealActivity();
    }
  });
  $("#k2-next").addEventListener("click", () => {
    if (index < data.activities.length - 1) {
      index++;
      render();
      revealActivity();
    }
  });
  $("#k2-picker").addEventListener("change", (e) => {
    index = +e.target.value;
    render();
    revealActivity();
  });
  window.addEventListener("pagehide", stop);
  window.addEventListener("hashchange", () => {
    if (!data) return;
    const next = data.activities.findIndex((a) => "#" + a.id === location.hash);
    if (next >= 0 && next !== index) {
      index = next;
      render();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
  });
  const unit = new URLSearchParams(location.search).get("unit");
  if (!UNITS[unit]) {
    $("#k2-title").textContent = "نختار الوحدة";
    content.innerHTML = "<p>" + Object.keys(UNITS).map((k) => `<a class="button" href="?unit=${k}">${k.replace("kg2-t1-", "")}</a>`).join(" ") + "</p>";
  } else Promise.all([fetch(`kg2-unit-${unit}.json?v=${V}`).then((r) => {
    if (!r.ok) throw Error("x");
    return r.json();
  }), fetch(`kg2-unit-audio.json?v=${V}`).then((r) => {
    if (!r.ok) throw Error("x");
    return r.json();
  })]).then(([d, au]) => {
    data = d;
    audio = au.audio;
    document.title = `${d.unit.title_ar} | KG2 | ENGLISH SAVANT`;
    $("#k2-eyebrow").textContent = d.unit.eyebrow;
    $("#k2-h1").textContent = d.unit.title_ar;
    $("#k2-sub").textContent = d.unit.title_en;
    $("#k2-kicker").textContent = d.unit.title_en;
    $("#k2-picker").innerHTML = d.activities.map((a, i) => `<option value="${i}">${esc(a.title_ar)}</option>`).join("");
    $("#k2-held").innerHTML = d.held && d.held.length ? "<p>لسه قريبًا في الوحدة دي:</p><ul>" + d.held.map((h) => `<li>${esc(h)}</li>`).join("") + "</ul>" : "";
    const n = d.activities.findIndex((a) => "#" + a.id === location.hash);
    if (n >= 0) index = n;
    render();
  }).catch((err) => {
    window.__err = String(err && err.stack || err);
    console.error(window.__err);
    $("#k2-title").textContent = "الجزء ده مش متاح دلوقتي";
    content.innerHTML = "<p>جرّب تاني بعد شوية.</p>";
  });
})();
