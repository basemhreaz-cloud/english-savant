/* Small WebView 66 API fallbacks, loaded before this script uses them. */
(function(){if(!Array.prototype.flatMap)Object.defineProperty(Array.prototype,'flatMap',{configurable:true,writable:true,value:function(fn,ctx){return this.reduce(function(out,v,i,a){return out.concat(fn.call(ctx,v,i,a))},[])}});if(!String.prototype.matchAll)Object.defineProperty(String.prototype,'matchAll',{configurable:true,writable:true,value:function(p){var f=p.flags||'';if(f.indexOf('g')<0)f+='g';var r=new RegExp(p.source,f),a=[],m;while((m=r.exec(String(this)))){a.push(m);if(!m[0])r.lastIndex++}return a}});if(typeof Element!=='undefined'&&!Element.prototype.replaceChildren)Object.defineProperty(Element.prototype,'replaceChildren',{configurable:true,writable:true,value:function(){while(this.firstChild)this.removeChild(this.firstChild);for(var i=0;i<arguments.length;i++)this.append(arguments[i])}})})();
"use strict";
(() => {
  const $ = (s) => document.querySelector("#u4p " + s), root = $("#content"), player = new Audio();
  player.preload = "none";
  const ar = { "morning": "الصبح", "noon": "الظهر", "night": "بالليل", "breakfast": "فطار", "lunch": "غدا", "dinner": "عشا", "wolf": "ذئب", "water": "ميّه", "watch": "ساعة إيد", "camel": "جمل", "cat": "قطة", "ruler": "مسطرة", "rice": "رز", "rabbit": "أرنب", "under": "تحت", "umbrella": "شمسية", "color": "لون" };
  let firstRender = true;
  let data, audio, idx = 0, round = 0, ticket = 0, selected = null, busy = false, finishAudio = null, promptReady = false, solved = false;
  const V = "20261123-kgfix2-20261122-u4practice2", esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const image = (p, alt = "") => `<img src="assets/kg2/${p}?v=${V}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
  const pair = (w) => [w.ar, w.en].every((id) => {
    var _a;
    return ((_a = audio[id]) == null ? void 0 : _a.ready_for_picture_pair) === true;
  });
  function stop() {
    ticket++;
    if (finishAudio) finishAudio(null);
    player.pause();
    player.removeAttribute("src");
    busy = false;
    root.querySelectorAll(".is-speaking").forEach((b) => b.classList.remove("is-speaking"));
    $("#audio-status").textContent = "";
  }
  async function play(ids, button) {
    var _a;
    stop();
    const mine = ticket;
    busy = true;
    if (button) button.classList.add("is-speaking");
    for (const id of ids) {
      if (mine !== ticket) return null;
      const src = (_a = audio[id]) == null ? void 0 : _a.src;
      if (!src) {
        busy = false;
        if (button) button.classList.remove("is-speaking");
        $("#audio-status").textContent = "الصوت مش متاح دلوقتي. جرّب تاني.";
        return false;
      }
      $("#audio-status").textContent = "الصوت بيحمّل…";
      const ok = await new Promise((resolve) => {
        let done = false;
        const timeout = setTimeout(() => finish(false), 18e3);
        const finish = (value) => {
          if (done) return;
          done = true;
          clearTimeout(timeout);
          player.onended = player.onerror = null;
          if (finishAudio === finish) finishAudio = null;
          resolve(value);
        };
        finishAudio = finish;
        player.onended = () => finish(true);
        player.onerror = () => finish(false);
        player.src = src + "?v=" + V;
        player.play().then(() => {
          if (mine === ticket) $("#audio-status").textContent = "اسمع براحتك.";
        }).catch(() => finish(false));
      });
      if (mine !== ticket) return null;
      if (ok !== true) {
        busy = false;
        if (button) button.classList.remove("is-speaking");
        $("#audio-status").textContent = "الصوت ما فتحش، اضغط على السماعة وجرّب تاني.";
        return false;
      }
    }
    if (mine === ticket) {
      busy = false;
      if (button) button.classList.remove("is-speaking");
      $("#audio-status").textContent = "تقدر تسمعها تاني.";
    }
    return true;
  }
  function explore(w, attrs = "") {
    return `<button type="button" class="card" ${attrs} data-word="${esc(w.word)}" aria-label="اسمع: ${esc(w.label_en)}">${image(w.img, ar[w.word] || w.word)}<span dir="ltr">${esc(w.label_en)}</span><span>${esc(ar[w.word] || "")}</span><small>عربي ثم إنجليزي</small></button>`;
  }
  const row = (values, attr) => `<div class="row">${values.map((v) => `<button type="button" ${/^[A-Za-z]+$/.test(String(v)) ? 'dir="ltr"' : ""} ${attr}="${esc(v)}">${esc(v)}</button>`).join("")}</div>`;
  function feedback(ok, slot = $("#feedback")) {
    slot.textContent = ok ? "😊 برافو!" : "💪 جرّب تاني براحتك.";
  }
  function bucket(a) {
    return a.items.map((w, i) => `<article class="panel">${explore(w)}${row(a.buckets, `data-bucket="${i}" data-value`)}<p class="fb" role="status"></p></article>`).join("");
  }
  function open(a) {
    return `<p class="bigframe">I can ...</p><div class="grid">${a.choices.map((w, i) => explore(w, `data-open="${i}"`)).join("")}</div><p id="chosen" class="bigframe" role="status"></p>`;
  }
  function scrollGame() {
    requestAnimationFrame(() => document.querySelector("#u4p").scrollIntoView({ block: "start", behavior: "instant" }));
  }
  function render() {
    stop();
    round = 0;
    selected = null;
    promptReady = false;
    $("#feedback").textContent = "";
    const a = data.activities[idx];
    $("#picker").value = idx;
    $("#title").textContent = a.title_ar;
    $("#help").textContent = a.help;
    $("#position").textContent = `اللعبة ${idx + 1} من ${data.activities.length}`;
    $("#prev").disabled = idx === 0;
    $("#next").disabled = idx === data.activities.length - 1;
    location.hash = a.id;
    let h = "";
    if (["listen-choose", "count-choose", "choose-story", "meal-choice", "build-count"].includes(a.kind)) h = '<div id="round"></div>';
    if (a.kind === "match-pairs") h = `<div class="paircols">${["left", "right"].map((side) => `<div>${a[side].map((w, i) => explore(w, `data-match="${side}:${i}"`)).join("")}</div>`).join("")}</div>`;
    if (a.kind === "open-choice") h = open(a);
    if (a.kind === "find-initial") h = `<div class="grid">${a.choices.map((w) => `<article class="panel">${explore(w)}<button type="button" data-initial="${esc(w.word)}" aria-pressed="false">اختار ${a.letter}</button></article>`).join("")}</div>`;
    if (a.kind === "bucket") h = bucket(a);
    if (a.kind === "reflect") h = a.prompts.map((p, i) => `<article class="panel"><h3>${esc(p)}</h3>${row(["أيوه", "نجرب المرة الجاية", "نحكي مع بعض"], `data-reflect="${i}" data-value`)}</article>`).join("");
    if (a.kind === "review-mix") h = "<h3>أول حرف</h3>" + bucket(a.letters) + "<h3>اختيارك أنت</h3>" + open({ choices: a.personal }) + "<h3>رقم ولون</h3><p>لوّن 1 بالأحمر و2 بالأزرق.</p>" + a.tiles.map((n, i) => `<article class="panel"><div class="numtile" data-tile="${i}">${n}</div><div class="row"><button type="button" class="swatch red" data-colour="${i}:red">أحمر</button><button type="button" class="swatch blue" data-colour="${i}:blue">أزرق</button></div><p class="fb" role="status"></p></article>`).join("");
    root.innerHTML = h;
    if (["listen-choose", "count-choose", "choose-story", "meal-choice", "build-count"].includes(a.kind)) showRound();
    if (!firstRender) scrollGame();
    firstRender = false;
  }
  function showRound() {
    stop();
    solved = false;
    promptReady = false;
    const a = data.activities[idx], r = a.rounds[round];
    $("#feedback").textContent = "";
    const host = $("#round");
    if (!r) {
      host.innerHTML = '<h3>جرّبنا كل الجولات!</h3><button type="button" data-restart>نلعب تاني</button>';
      return;
    }
    let h = `<p>جولة ${round + 1} من ${a.rounds.length}</p>`;
    if (a.kind === "meal-choice") promptReady = true;
    if (a.kind === "listen-choose") h += `<button type="button" data-listen>🔊 اسمع الكلمة بالإنجليزي</button><div class="grid three" data-answer-options hidden>${r.choices.map((w, i) => `<button type="button" class="card" data-answer="${i}" aria-pressed="false" aria-label="اختيار ${i + 1}" disabled>${image(w.img, "اختيار صورة")}</button>`).join("")}</div>`;
    else if (a.kind === "meal-choice") h += `<div class="contextpanel">${image(r.context.img, ar[r.context.word])}<p><bdi>${esc(r.context.word)}</bdi> (${esc(ar[r.context.word])})</p><button type="button" data-context>🔊 اسمع الوجبة: عربي ثم إنجليزي</button><h3>في روتين الوحدة، بناكل الوجبة دي إمتى؟</h3></div><div class="grid three">${r.choices.map((w, i) => `<button type="button" class="card" data-answer="${i}">${image(w.img, w.word)}</button>`).join("")}</div>`;
    else if (a.kind === "build-count") h += `<h3>اختار ${r.target} صور ورق شجر</h3><div class="buildgrid">${Array.from({ length: 10 }, (_, i) => `<button type="button" class="card" data-build="${i}" aria-pressed="false" aria-label="ورقة شجر ${i + 1}">${image(r.word.img, "ورقة شجر")}</button>`).join("")}</div><p id="build-total" role="status">اخترنا 0 من ${r.target}</p><button type="button" data-build-check>نجرب نعدّهم</button>`;
    else if (a.kind === "choose-story") h += `<div class="storyimage">${image(r.img, r.alt)}</div><div class="storypassage" aria-label="نص الحكاية">${r.lines.map((l) => `<p><strong>${esc(l.speaker_ar)}:</strong> ${esc(l.meaning_ar)}</p><p lang="en" dir="ltr"><strong>${esc(l.speaker)}:</strong> ${esc(l.text)}</p>`).join("")}</div><h3>${esc(r.q_ar)}</h3>` + row(r.choices, "data-story");
    else h += `<h3>عدّ: ${esc(r.alt)}</h3><div class="countobjects">${(r.imgs || Array(r.repeat).fill(r.img)).map((p) => image(p, r.alt)).join("")}</div>` + row(a.choices, "data-number");
    h += '<button type="button" data-round-next hidden>الجولة اللي بعدها</button>';
    host.innerHTML = h;
  }
  function allWords(a) {
    var _a;
    return [...(a.choices || []).filter((x) => typeof x === "object"), ...a.items || [], ...a.left || [], ...a.right || [], ...a.personal || [], ...((_a = a.letters) == null ? void 0 : _a.items) || []];
  }
  function gate(locked) {
    root.querySelectorAll("[data-answer]").forEach((b2) => b2.disabled = locked || solved);
    const b = $("[data-listen]");
    if (b) b.disabled = busy;
  }
  root.onclick = async (e) => {
    const b = e.target.closest("button");
    if (!b || b.disabled || busy) return;
    const a = data.activities[idx];
    if (b.hasAttribute("data-context")) {
      const w = a.rounds[round].context;
      promptReady = false;
      const p = play([w.ar, w.en], b);
      gate(true);
      const ok = await p;
      if (ok === null) return;
      promptReady = solved || ok === true;
      const opts = $("[data-answer-options]");
      if (opts) opts.hidden = !promptReady;
      gate(!promptReady);
      return;
    }
    if (b.dataset.build !== void 0) {
      const w = a.rounds[round].word;
      if (!pair(w)) return;
      const played = await play([w.ar, w.en], b);
      if (played !== true) return;
      const on = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", String(on));
      const n = root.querySelectorAll("[data-build][aria-pressed=true]").length;
      $("#build-total").textContent = `اخترنا ${n} من ${a.rounds[round].target}`;
      $("#feedback").textContent = "";
      $("[data-round-next]").hidden = true;
      return;
    }
    if (b.hasAttribute("data-build-check")) {
      const n = root.querySelectorAll("[data-build][aria-pressed=true]").length, ok = n === a.rounds[round].target;
      feedback(ok);
      $("[data-round-next]").hidden = !ok;
      return;
    }
    if (b.hasAttribute("data-listen")) {
      promptReady = false;
      gate(true);
      const p = play([a.rounds[round].target.en], b);
      gate(true);
      const ok = await p;
      if (ok === null) return;
      promptReady = solved || ok === true;
      const opts = $("[data-answer-options]");
      if (opts) opts.hidden = !promptReady;
      gate(!promptReady);
      return;
    }
    if (b.dataset.answer !== void 0) {
      if (!promptReady) return;
      const r = a.rounds[round], w = r.choices[+b.dataset.answer];
      const correct = w.word === r.target.word;
      solved = correct;
      root.querySelectorAll("[data-answer]").forEach((x) => {
        x.classList.remove("is-chosen", "is-correct", "is-wrong");
        x.setAttribute("aria-pressed", "false");
      });
      b.classList.add("is-chosen", correct ? "is-correct" : "is-wrong");
      b.setAttribute("aria-pressed", "true");
      b.dataset.result = correct ? "correct" : "retry";
      feedback(correct);
      gate(correct);
      if (correct) $("[data-round-next]").hidden = false;
      return;
    }
    if (b.dataset.word) {
      const w = allWords(a).find((x) => x.word === b.dataset.word);
      if (!w || !pair(w)) return;
      const ok = await play([w.ar, w.en], b);
      if (ok !== true) return;
    }
    if (b.dataset.story !== void 0) {
      const ok = b.dataset.story === a.rounds[round].ok;
      feedback(ok);
      $("[data-round-next]").hidden = !ok;
      return;
    }
    if (b.dataset.number !== void 0) {
      const ok = +b.dataset.number === a.rounds[round].ok;
      feedback(ok);
      $("[data-round-next]").hidden = !ok;
      return;
    }
    if (b.hasAttribute("data-round-next")) {
      round++;
      showRound();
      scrollGame();
      return;
    }
    if (b.hasAttribute("data-restart")) {
      round = 0;
      showRound();
      scrollGame();
      return;
    }
    if (b.dataset.match) {
      const [side, i] = b.dataset.match.split(":"), w = a[side][+i];
      if (side === "left") {
        selected = w.word;
        root.querySelectorAll('[data-match^="left"]').forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        $("#feedback").textContent = "اختار نفس الصورة من العمود التاني.";
      } else if (selected) {
        feedback(w.word === selected);
        if (w.word === selected) b.setAttribute("aria-pressed", "true");
      } else $("#feedback").textContent = "اختار صورة من العمود الأول.";
      return;
    }
    if (b.dataset.open !== void 0) {
      const w = (a.choices || a.personal)[+b.dataset.open];
      $("#chosen").textContent = "I can " + w.word + ".";
      return;
    }
    if (b.dataset.initial) {
      const ok = a.answers.includes(b.dataset.initial);
      feedback(ok);
      b.setAttribute("aria-pressed", String(ok));
      return;
    }
    if (b.dataset.bucket !== void 0) {
      const p = a.kind === "review-mix" ? a.letters : a;
      feedback(b.dataset.value === p.items[+b.dataset.bucket].ok, b.closest(".panel").querySelector(".fb"));
      return;
    }
    if (b.dataset.reflect !== void 0) {
      b.parentElement.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      return;
    }
    if (b.dataset.colour) {
      const [i, c] = b.dataset.colour.split(":"), ok = c === a.colours[String(a.tiles[+i])];
      const tile = root.querySelector(`[data-tile="${i}"]`);
      tile.className = "numtile " + c;
      feedback(ok, b.closest(".panel").querySelector(".fb"));
    }
  };
  $("#picker").onchange = (e) => {
    idx = +e.target.value;
    render();
  };
  $("#prev").onclick = () => {
    if (idx > 0) {
      idx--;
      render();
    }
  };
  $("#next").onclick = () => {
    if (idx < data.activities.length - 1) {
      idx++;
      render();
    }
  };
  window.addEventListener("pagehide", stop);
  document.addEventListener("visibilitychange", () => {
    var _a;
    if (document.hidden) {
      stop();
      promptReady = ((_a = data == null ? void 0 : data.activities[idx]) == null ? void 0 : _a.kind) === "meal-choice";
      gate(!promptReady);
    }
  });
  window.addEventListener("hashchange", () => {
    if (!data) return;
    const n = data.activities.findIndex((a) => "#" + a.id === location.hash);
    if (n >= 0 && n !== idx) {
      idx = n;
      render();
    }
  });
  Promise.all(["kg2-u4-practice.json", "kg2-u4-practice-audio.json"].map((p) => fetch(p + "?v=" + V, { cache: "no-cache" }).then((r) => {
    if (!r.ok) throw Error("Content unavailable");
    return r.json();
  }))).then(([d, au]) => {
    data = d;
    audio = au.audio;
    $("#picker").innerHTML = data.activities.map((a, i) => `<option value="${i}">${esc(a.title_ar)}</option>`).join("");
    const n = data.activities.findIndex((a) => "#" + a.id === location.hash);
    if (n >= 0) idx = n;
    render();
  }).catch(() => {
    $("#feedback").textContent = "المحتوى ما فتحش. جرّب تفتح الصفحة تاني.";
  });
})();
