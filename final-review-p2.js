/* Small WebView 66 API fallbacks, loaded before this script uses them. */
(function(){if(!Array.prototype.flatMap)Object.defineProperty(Array.prototype,'flatMap',{configurable:true,writable:true,value:function(fn,ctx){return this.reduce(function(out,v,i,a){return out.concat(fn.call(ctx,v,i,a))},[])}});if(!String.prototype.matchAll)Object.defineProperty(String.prototype,'matchAll',{configurable:true,writable:true,value:function(p){var f=p.flags||'';if(f.indexOf('g')<0)f+='g';var r=new RegExp(p.source,f),a=[],m;while((m=r.exec(String(this)))){a.push(m);if(!m[0])r.lastIndex++}return a}});if(typeof Element!=='undefined'&&!Element.prototype.replaceChildren)Object.defineProperty(Element.prototype,'replaceChildren',{configurable:true,writable:true,value:function(){while(this.firstChild)this.removeChild(this.firstChild);for(var i=0;i<arguments.length;i++)this.append(arguments[i])}})})();
(function() {
  if (typeof Element !== "undefined" && !Element.prototype.replaceChildren) {
    Object.defineProperty(Element.prototype, "replaceChildren", { configurable: true, writable: true, value: function() {
      var fragment = this.ownerDocument.createDocumentFragment();
      for (var i = 0; i < arguments.length; i++) fragment.append(arguments[i]);
      while (this.firstChild) this.removeChild(this.firstChild);
      this.appendChild(fragment);
    } });
  }
})();
(() => {
  "use strict";
  function esAnswerText(value) {
    return String(value).replace(/[0-9#*]\uFE0F?\u20E3/g, " ").replace(/[\u{1F000}-\u{1FAFF}\u2600-\u27BF\u{1F1E6}-\u{1F1FF}]/gu, " ").replace(/[\u200D\uFE0E\uFE0F]/g, "").normalize("NFKC");
  }
  function esAnswerContent(value) {
    return esAnswerText(value).toLowerCase().replace(/[’‘]/g, "'").replace(/[.,!?؟،;:]/g, " ").trim().replace(/\s+/g, " ");
  }
  const host = document.querySelector("#final-review-practice");
  if (!host) return;
  const KEY = "es-final-review-p2-v1";
  let answerKeys = {};
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
  }
  const uiRecords = [];
  const uiText = (node, text) => {
    if (typeof text === "string" && text.includes(" / ")) {
      const parts = text.split(" / ");
      if (parts.length === 2 && /[\u0600-\u06ff]/.test(parts[0])) {
        const record = uiRecords.find((r) => r.node === node);
        if (record) {
          record.ar = parts[0];
          record.en = parts[1];
        } else uiRecords.push({ node, ar: parts[0], en: parts[1] });
        node.setAttribute("data-interface-protected", "true");
        node.textContent = document.documentElement.dataset.interfaceLanguage === "en" ? parts[1] : parts[0];
        return true;
      }
    }
    return false;
  };
  document.addEventListener("es:interface-language", () => {
    const en = document.documentElement.dataset.interfaceLanguage === "en";
    for (const r of uiRecords) r.node.textContent = en ? r.en : r.ar;
  });
  function e(t, text, cls) {
    const n = document.createElement(t);
    if (text !== void 0) {
      if (uiText(n, text)) {
      } else if (typeof text === "string" && text.includes(" / ")) {
        const parts = text.split(" / ");
        parts.forEach((part, i) => {
          const b = document.createElement("span");
          b.textContent = part;
          b.dir = /[\u0600-\u06ff]/.test(part) ? "rtl" : "ltr";
          b.style.unicodeBidi = "isolate";
          n.append(b);
          if (i < parts.length - 1) n.append(document.createTextNode(" · "));
        });
      } else n.textContent = text;
    }
    if (cls) n.className = cls;
    return n;
  }
  function save(id, v) {
    saved[id] = v;
    try {
      localStorage.setItem(KEY, JSON.stringify(saved));
    } catch {
      status.textContent = "تعذّر الحفظ على هذا الجهاز.";
    }
  }
  const status = e("p", "إجاباتك محفوظة على هذا الجهاز فقط. اضغط تحقق للأسئلة ذات الإجابات الموثقة. الأسئلة الأخرى تحتاج مراجعة المدرس. / Responses stay on this device. Verify is available for source-checked answers; other questions need teacher review.", "final-note");
  function field(id, label, long) {
    const wrap = e("label", label, "final-field"), t = e(long ? "textarea" : "input");
    if (long) t.rows = 3;
    else t.type = "text";
    t.value = saved[id] || "";
    t.setAttribute("aria-label", label || "Your response");
    t.dir = "auto";
    t.addEventListener("input", () => save(id, t.value));
    wrap.append(t);
    return wrap;
  }
  function pic(src) {
    const im = e("img");
    im.src = src;
    im.alt = "Question picture";
    im.loading = "lazy";
    im.className = "final-picture";
    return im;
  }
  function choices(id, opts) {
    const wrap = e("fieldset", void 0, "final-choices");
    wrap.append(e("legend", "اختار إجابتك / Choose your response"));
    opts.forEach((v, i) => {
      const l = e("label"), b = e("input");
      b.type = "radio";
      b.name = id;
      b.value = i;
      b.checked = String(saved[id]) === String(i);
      b.addEventListener("change", () => save(id, b.value));
      l.append(b, document.createTextNode(v));
      wrap.append(l);
    });
    return wrap;
  }
  function tokens(id, text) {
    const wrap = e("div", void 0, "final-tokens"), words = text.split(/\s*\/\s*|\s+-\s+/).filter(Boolean);
    if (words.length < 2) return field(id, "إجابتك / Your response");
    const ans = e("p", saved[id] || "", "final-built"), row = e("div");
    words.forEach((w) => {
      const b = e("button", w);
      b.type = "button";
      b.addEventListener("click", () => {
        ans.textContent = (ans.textContent + " " + w).trim();
        save(id, ans.textContent);
      });
      row.append(b);
    });
    const clear = e("button", "امسح / Clear");
    clear.type = "button";
    clear.addEventListener("click", () => {
      ans.textContent = "";
      save(id, "");
    });
    wrap.append(row, ans, clear, field(id + ":typed", "أو اكتب الترتيب بنفسك / Or type your order"));
    return wrap;
  }
  function addVerification(c, q, s) {
    var _a, _b;
    if (!q.answerability_hold && !q.listening_excluded && s.type !== "punctuate" && c.querySelector("textarea,input:not([type=radio]):not([type=checkbox])")) (_b = window.ESWrittenAI) == null ? void 0 : _b.attach(c, { question: q.text || q.title || s.instruction, passage: q.passage, alternatives: ((_a = answerKeys[q.item_id]) == null ? void 0 : _a.accepted_answers) || [], answer: () => Array.from(c.querySelectorAll("textarea,input:not([type=radio]):not([type=checkbox])")).map((x) => x.value).join(" ") });
    if (q.answerability_hold || q.listening_excluded) return c;
    const k = answerKeys[q.item_id], active = k && ["verified", "partial"].includes(k.status), actions = e("div", void 0, "final-verify-actions"), b = e("button", active ? "تحقق / Verify" : "راجع مع المدرس / Teacher review", "q-check final-verify"), feed = e("p", void 0, "final-feedback");
    b.type = "button";
    b.setAttribute("data-interface-protected", "true");
    feed.setAttribute("role", "status");
    feed.setAttribute("aria-live", "polite");
    feed.setAttribute("data-interface-protected", "true");
    b.onclick = () => {
      var _a2;
      if (!active) {
        feed.dataset.state = "review";
        uiText(feed, "لا توجد إجابة موثقة لهذا السؤال بعد. إجابتك محفوظة، راجعها مع المدرس. / No verified answer key yet. Your response is saved for teacher review.");
        return;
      }
      const fields = k.blanks || [{ answers: k.accepted_answers }], checks = fields.map((f, i) => {
        var _a3;
        const id = k.blanks ? q.item_id + ":" + i : q.item_id;
        let v = (_a3 = saved[id]) != null ? _a3 : "";
        if (s.type === "reorder" && s.instruction.startsWith("Reorder") && String(saved[id + ":typed"] || "").trim()) v = saved[id + ":typed"];
        if (s.instruction.includes("True or")) v = v === "0" ? "True" : v === "1" ? "False" : v;
        else if (s.instruction.includes("circle") || s.instruction === "Choose the correct answer:") {
          const selected = c.querySelector("input[type=radio]:checked");
          if (selected) v = selected.parentElement.textContent.trim();
        }
        const answers = f.answers || [];
        if (f.status === "hold" || !answers.length) return { hold: true };
        if (!String(v).trim()) return { empty: true };
        const punctuation = s.instruction.startsWith("Punctuate"), normalize = (x) => {
          let t = (punctuation ? String(x) : esAnswerText(x)).normalize("NFKC").replace(/[’‘]/g, "'").trim().replace(/\s+/g, " ").replace(/\s+([.!?,;:])/g, "$1");
          if (!punctuation) t = t.toLowerCase().replace(/[.!?]+$/, "");
          if (s.instruction.includes("True or")) t = { t: "true", f: "false" }[t] || t;
          return t;
        };
        const exact = answers.some((a) => normalize(a) === normalize(v));
        const formIssue = punctuation && !exact && answers.some((a) => esAnswerContent(a) === esAnswerContent(v));
        return { ok: exact || formIssue, formIssue, answers };
      });
      if (checks.some((x) => x.empty)) {
        feed.dataset.state = "empty";
        uiText(feed, "اكتب إجابتك الأول. / Enter your response first.");
        return;
      }
      const known = checks.filter((x) => !x.hold), ok = known.every((x) => x.ok), partial = checks.some((x) => x.hold);
      feed.dataset.state = ok ? "correct" : "retry";
      if (known.length) (_a2 = window.ESFeedback) == null ? void 0 : _a2.call(window, ok, c);
      if (ok) uiText(feed, partial ? "الإجابات الموثقة صحيحة. باقي الفراغات تحتاج مراجعة المدرس. / Verified blanks are correct. The remaining blanks need teacher review." : "إجابة صحيحة. / Correct.");
      else uiText(feed, "راجع إجابتك وحاول تاني. / Check your response and try again.");
      if (known.some((x) => x.formIssue)) uiText(feed, "المعنى صحيح. راجع الحروف الكبيرة والترقيم مع النموذج. / Content correct. Check capitalization and punctuation against the model.");
      if (!ok || known.some((x) => x.formIssue)) {
        const model = known.map((x, i) => (k.blanks ? String(i + 1) + ": " : "") + x.answers.join(" / ")).join(" · ");
        feed.append(e("span", " الإجابة الموثقة / Verified answer: " + model, "final-verified-model"));
      }
    };
    c.addEventListener("input", () => {
      feed.textContent = "";
      delete feed.dataset.state;
    });
    c.addEventListener("change", () => {
      feed.textContent = "";
      delete feed.dataset.state;
    });
    actions.append(b);
    c.append(actions, feed);
    return c;
  }
  function renderItem(q, s, index) {
    var _a, _b, _c, _d, _e;
    const c = e("article", void 0, "glass final-question");
    c.id = q.item_id.replace(/:/g, "-");
    c.append(e("p", String(index + 1), "final-number"));
    if (q.answerability_hold) {
      c.dataset.held = "true";
      c.append(e("p", "السؤال متوقف مؤقتًا", "final-hold-title"), e("p", q.answerability_hold, "final-note"));
      return addVerification(c, q, s);
    }
    if (q.illustration_note) c.append(e("p", q.illustration_note, "final-note"));
    if (q.response_lines) {
      c.append(e("p", q.text, "final-prompt"));
      q.response_lines.forEach((t, i) => c.append(e("p", t), field(q.item_id + ":" + i, "إجابتك / Your response")));
      return addVerification(c, q, s);
    }
    if (q.image) c.append(pic(q.image));
    if (q.pronunciation_audio) {
      c.append(e("p", q.text, "final-prompt"));
      c.append(e("p", "صورة وصوت نطق للتدريب، وليسا صورة أو تسجيل الكتاب الأصلي. انظر واسمع ثم اكتب الحرف الناقص.", "final-audio-note"));
      const a = e("audio");
      a.controls = true;
      a.preload = "none";
      a.src = q.pronunciation_audio + "?v=20261123-40";
      a.setAttribute("aria-label", "تشغيل نطق الكلمة / Play word pronunciation");
      c.append(a, field(q.item_id, "الحرف الناقص / Missing letter"));
      return addVerification(c, q, s);
    }
    if (q.listening_excluded) {
      c.append(e("p", q.text), e("p", "هذا السؤال يعتمد على الاستماع. الصوت غير مرفق هنا، لذلك لن يُطلب منك تخمين إجابة مكتوبة.", "final-listening"));
      return addVerification(c, q, s);
    }
    if (q.images) {
      const row = e("div", void 0, "final-image-grid");
      q.images.forEach((im, i) => {
        const f = e("figure");
        f.append(pic(im), e("figcaption", String(i + 1)));
        row.append(f);
      });
      c.append(row);
      q.sentences.forEach((t, i) => {
        const l = e("fieldset", void 0, "final-match"), legend = e("legend", t), row2 = e("div", void 0, "final-number-options");
        l.append(legend, row2);
        q.images.forEach((_, j) => {
          const b = e("button", String(j + 1));
          b.type = "button";
          const key = q.item_id + ":" + i;
          const update = () => b.setAttribute("aria-pressed", String(saved[key]) === String(j + 1) ? "true" : "false");
          update();
          b.onclick = () => {
            save(key, String(j + 1));
            row2.querySelectorAll("button").forEach((b2, k) => b2.setAttribute("aria-pressed", k === j ? "true" : "false"));
          };
          row2.append(b);
        });
        c.append(l);
      });
      return addVerification(c, q, s);
    }
    if (q.wordbank) {
      c.append(e("p", q.wordbank.join(" · "), "final-wordbank"));
      q.lines.forEach((t, i) => {
        c.append(e("p", t), field(q.item_id + ":" + i, "إجابتك / Your response"));
      });
      return addVerification(c, q, s);
    }
    if ((_a = answerKeys[q.item_id]) == null ? void 0 : _a.blanks) {
      c.append(e("p", q.text, "final-prompt"));
      answerKeys[q.item_id].blanks.forEach((_, i) => c.append(field(q.item_id + ":" + i, "الفراغ " + (i + 1) + " / Blank " + (i + 1))));
      if (saved[q.item_id]) c.append(e("p", "إجابتك السابقة محفوظة / Previous saved response: " + saved[q.item_id], "final-note"));
      return addVerification(c, q, s);
    }
    let text = (_d = (_c = (_b = q.scrambled) != null ? _b : q.text) != null ? _c : q.title) != null ? _d : "";
    c.append(e("p", text, "final-prompt"));
    if ((_e = q.keywords) == null ? void 0 : _e.length) c.append(e("p", q.keywords.join(" · "), "final-wordbank"));
    if (s.type === "reorder" && s.instruction.startsWith("Reorder")) c.append(tokens(q.item_id, text));
    else if (s.instruction.includes("True or")) c.append(choices(q.item_id, ["True", "False"]));
    else if (s.instruction.includes("circle") || s.instruction === "Choose the correct answer:") {
      const m = text.match(/\(([^()]+)\)/), opts = m == null ? void 0 : m[1].split(/\s*[–—]\s*|\s+-\s+|\s*\/\s*/).filter(Boolean);
      c.append((opts == null ? void 0 : opts.length) > 1 ? choices(q.item_id, opts) : field(q.item_id, "إجابتك / Your response"));
    } else c.append(field(q.item_id, "إجابتك / Your response", s.type === "paragraphs" || s.instruction.includes("sentence")));
    return addVerification(c, q, s);
  }
  async function start() {
    const kr = await fetch("final-review-p2-answers.json?v=20261123-verify64", { cache: "no-cache" });
    if (!kr.ok) throw Error("Verified keys unavailable");
    answerKeys = await kr.json();
    const r = await fetch("final-review-p2-questions.json?v=20261123-40");
    if (!r.ok) throw Error();
    const d = await r.json();
    let current = 0;
    const content = e("div", void 0, "final-section-items"), label = e("div", void 0, "final-section-picker"), toggle = e("button", void 0, "final-section-toggle"), list = e("div", void 0, "final-section-list");
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "final-section-list");
    list.id = "final-section-list";
    list.hidden = true;
    label.append(e("p", "اختار قسم المذكرة / Choose a booklet section"), toggle, list);
    function title(s) {
      return s.items.some((q) => q.pronunciation_audio) ? "Listen & complete" : s.instruction;
    }
    function close() {
      list.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }
    toggle.onclick = () => {
      var _a;
      list.hidden = !list.hidden;
      toggle.setAttribute("aria-expanded", String(!list.hidden));
      if (!list.hidden) (_a = list.querySelector('[aria-current="true"]')) == null ? void 0 : _a.focus();
    };
    label.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        close();
        toggle.focus();
      }
      if (["ArrowDown", "ArrowUp", "Home", "End"].includes(ev.key) && !list.hidden) {
        ev.preventDefault();
        const bs = [...list.querySelectorAll("button")], n = bs.indexOf(document.activeElement), at = ev.key === "Home" ? 0 : ev.key === "End" ? bs.length - 1 : (n + (ev.key === "ArrowDown" ? 1 : -1) + bs.length) % bs.length;
        bs[at].focus();
      }
    });
    document.addEventListener("click", (ev) => {
      if (!label.contains(ev.target)) close();
    });
    d.sections.forEach((s, i) => {
      const b = e("button", void 0, "final-section-option"), n = e("span", String(i + 1), "section-index"), text = e("span", title(s), "section-name"), count = e("span", String(s.items.filter((q) => !q.answerability_hold).length) + "/" + s.items.length, "section-count");
      b.type = "button";
      b.dataset.section = i;
      text.dir = "ltr";
      count.dir = "ltr";
      b.append(n, text, count);
      b.onclick = () => {
        current = i;
        show();
        close();
        toggle.focus();
      };
      list.append(b);
    });
    const nav = e("div", void 0, "final-nav");
    ["السابق / Previous", "التالي / Next"].forEach((t, i) => {
      const b = e("button", t);
      b.type = "button";
      b.addEventListener("click", () => {
        current = Math.max(0, Math.min(d.sections.length - 1, current + (i ? 1 : -1)));
        show();
        toggle.scrollIntoView({ block: "center", behavior: "instant" });
      });
      nav.append(b);
    });
    function show() {
      const s = d.sections[current];
      meter.setAttribute("aria-valuenow", String(current + 1));
      meter.setAttribute("aria-valuetext", "القسم " + (current + 1) + " من " + d.sections.length);
      fill.style.width = (current + 1) / d.sections.length * 100 + "%";
      toggle.replaceChildren(e("span", String(current + 1), "section-index"), e("b", title(s), "section-name"), e("span", String(s.items.filter((q) => !q.answerability_hold).length) + "/" + s.items.length, "section-count"), e("span", "⌄"));
      toggle.querySelector("b").dir = "ltr";
      list.querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-current", String(i === current)));
      host.dataset.section = current;
      content.replaceChildren(e("h2", s.instruction));
      s.items.forEach((q, i) => content.append(renderItem(q, s, i)));
      document.querySelector("#final-section-progress").textContent = "القسم " + (current + 1) + " من " + d.sections.length + " · " + s.items.length + " سجلًا · " + s.items.filter((q) => !q.answerability_hold).length + " متاح · " + s.items.filter((q) => q.answerability_hold).length + " متوقف للمراجعة";
    }
    const progress = e("p");
    progress.id = "final-section-progress";
    const meter = e("div", void 0, "quiz-progress"), fill = e("span");
    meter.append(fill);
    meter.setAttribute("role", "progressbar");
    meter.setAttribute("aria-label", "موضع قسم المراجعة");
    meter.setAttribute("aria-valuemin", "1");
    meter.setAttribute("aria-valuemax", String(d.sections.length));
    const reset = e("button", "امسح إجاباتي المحفوظة");
    reset.type = "button";
    reset.addEventListener("click", () => {
      saved = {};
      try {
        localStorage.removeItem(KEY);
      } catch {
      }
      show();
    });
    host.replaceChildren(status, reset, label, progress, meter, nav, content);
    show();
    host.dataset.ready = "true";
  }
  start().catch(() => host.replaceChildren(e("p", "تعذّر تحميل الأسئلة. حدّث الصفحة للمحاولة مرة أخرى.")));
})();
