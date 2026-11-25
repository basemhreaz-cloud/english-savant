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
  const KEY = "es-prep1-final-v1";
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
  }
  const e = (tag, text, cls) => {
    const n = document.createElement(tag);
    if (text !== void 0) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  };
  const save = (id, v) => {
    saved[id] = v;
    try {
      localStorage.setItem(KEY, JSON.stringify(saved));
    } catch {
    }
  };
  const norm = (v) => esAnswerText(v).toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const strict = (v) => String(v).trim().replace(/[’‘]/g, "'").replace(/\s+/g, " ");
  function field(id, long = false, label = "إجابتك / Your response") {
    const wrap = e("label", label, "final-field"), n = e(long ? "textarea" : "input");
    if (long) n.rows = 4;
    else n.type = "text";
    n.dir = "auto";
    n.value = saved[id] || "";
    n.oninput = () => save(id, n.value);
    wrap.append(n);
    return wrap;
  }
  function choices(id, opts) {
    const f = e("fieldset", void 0, "final-choices");
    f.append(e("legend", "اختار إجابتك / Choose"));
    opts.forEach((o, i) => {
      const l = e("label"), b = e("input");
      b.type = "radio";
      b.name = id;
      b.value = String(i);
      b.checked = saved[id] === String(i);
      b.onchange = () => save(id, b.value);
      l.append(b, document.createTextNode(o));
      f.append(l);
    });
    return f;
  }
  function updateScore() {
    let out = host.querySelector(".final-score");
    if (!out) {
      out = e("p", "", "final-score");
      host.prepend(out);
    }
    const cards = [...host.querySelectorAll("[data-gradable]")], correct = cards.filter((c) => c.dataset.grade === "correct").length, wrong = cards.filter((c) => c.dataset.grade === "incorrect").length;
    out.textContent = "نتيجة القسم الحالي: " + correct + " صحيحة من " + (correct + wrong) + " مصححة · " + cards.length + " سؤالًا أو مجموعة قابلة للتصحيح. الأسئلة الموقوفة والكتابة لا تدخل في الدرجة.";
  }
  function grading(c, q, type) {
    if (q.held || q.grading_mode !== "checked") return;
    c.dataset.gradable = "true";
    const button = e("button", "تحقق / Check", "q-check"), feedback = e("p", "", "final-grade-result");
    feedback.setAttribute("aria-live", "polite");
    button.type = "button";
    button.onclick = () => {
      var _a;
      const vals = q.options ? [(() => {
        var _a2;
        const v = (_a2 = c.querySelector("input:checked")) == null ? void 0 : _a2.value;
        return v === void 0 ? "" : q.options[Number(v)];
      })()] : [...c.querySelectorAll("input:not([type=radio]):not([type=checkbox]),textarea")].map((n) => n.value);
      const expected = Array.isArray(q.answer) ? q.answer : [q.answer], empty = vals.length !== expected.length || vals.some((v) => !v.trim());
      const exact = !empty && expected.every((answer, i) => {
        var _a2;
        const candidates = ((_a2 = q.accept_blanks) == null ? void 0 : _a2[i]) ? [answer, ...q.accept_blanks[i]] : i === 0 && q.accept ? [answer, ...q.accept] : [answer];
        return candidates.some((v) => (type === "punctuate" ? strict : norm)(vals[i]) === (type === "punctuate" ? strict : norm)(v));
      });
      const formIssue = !empty && !exact && type === "punctuate" && expected.every((a, i) => (i === 0 && q.accept ? q.accept : [a]).some((v) => esAnswerContent(v) === esAnswerContent(vals[i])));
      const ok = exact || formIssue;
      c.dataset.grade = empty ? "empty" : ok ? "correct" : "incorrect";
      feedback.textContent = empty ? "اكتب كل الإجابات أولًا." : formIssue ? "المعنى صحيح. راجع الحروف الكبيرة والترقيم: " + expected.join(" / ") : ok ? "صح ✓" : "راجع إجابتك وحاول مرة أخرى.";
      if (!empty) (_a = window.ESFeedback) == null ? void 0 : _a.call(window, ok, c);
      updateScore();
    };
    c.append(button, feedback);
  }
  function prompt(c, t) {
    const p = e("p", t, "final-prompt");
    p.dir = "ltr";
    c.append(p);
  }
  function item(q, s, i) {
    var _a;
    const c = e("article", void 0, "glass final-question");
    c.dataset.itemId = q.item_id;
    c.id = q.item_id.replace(/:/g, "-");
    c.append(e("p", String(i + 1), "final-number"));
    if (q.held) {
      c.dataset.held = "true";
      c.append(e("p", q.grading_reason || "السؤال يحتاج مراجعة المدرس لأن إجابته غير مؤكدة. خارج الدرجة.", "final-note"));
    }
    if (q.passage) {
      const p = e("div", q.passage, "q-passage");
      p.dir = "ltr";
      c.append(p);
    }
    if (q.wordbank) c.append(e("p", q.wordbank.join(" · "), "final-wordbank"));
    if (q.keywords) c.append(e("p", q.keywords.join(" · "), "final-wordbank"));
    if (q.question || q.text || q.title) prompt(c, q.question || q.text || q.title);
    if (q.lines) q.lines.forEach((line, i2) => prompt(c, i2 + 1 + ". " + line));
    if (s.type === "reading_mcq") {
      q.mcq.forEach((m, k) => {
        const part = e("div", void 0, "final-reading-mcq");
        part.dataset.readingMcq = k;
        prompt(part, m.question);
        part.append(choices(q.item_id + ":mcq:" + k, m.options));
        if (m.held || !m.answer) {
          part.dataset.held = "true";
          part.append(e("p", m.grading_reason || "السؤال يحتاج مراجعة المدرس ولا يدخل في الدرجة.", "final-note"));
        } else grading(part, { ...m, grading_mode: "checked" }, "mcq");
        c.append(part);
      });
      c.append(e("p", "الإجابات المكتوبة تُراجع مع المدرس ولا تدخل في الدرجة.", "final-note"));
      q.questions.forEach((t, k) => {
        prompt(c, t);
        c.append(field(q.item_id + ":written:" + k, true));
      });
    } else if (q.options) c.append(choices(q.item_id, q.options));
    else if (Array.isArray(q.answer)) q.answer.forEach((a, k) => c.append(field(q.item_id + ":" + k, false, "الفراغ " + (k + 1) + " / Blank " + (k + 1))));
    else c.append(field(q.item_id, ["paragraphs", "qlines"].includes(s.type)));
    if (!q.options && !q.held && s.type !== "punctuate") (_a = window.ESWrittenAI) == null ? void 0 : _a.attach(c, { question: q.question || q.text || q.title || s.instruction, passage: q.passage, alternatives: q.accept || [q.answer].filter((x) => typeof x === "string"), answer: () => Array.from(c.querySelectorAll("input:not([type=checkbox]),textarea")).map((x) => x.value).join(" ") });
    if (s.type === "paragraphs") {
      c.append(e("p", (q.min_words ? "اكتب على الأقل " + q.min_words + " كلمة. " : "") + q.grading_reason, "final-note"));
      const count = e("p", "", "final-word-count"), input = c.querySelector("textarea");
      const refresh = () => {
        count.textContent = "عدد الكلمات: " + input.value.trim().split(/\s+/).filter(Boolean).length;
      };
      input.addEventListener("input", refresh);
      refresh();
      c.append(count);
    } else grading(c, q, s.type);
    if (q.explanation_ar) {
      const explanation = e("details", void 0, "final-explanation");
      const summary = e("summary", "افهم الإجابة");
      const text = e("p", q.explanation_ar, "final-explanation-text");
      text.dir = "auto";
      if (window.ESInterface) window.ESInterface.bindExplanation(text, q);
      explanation.append(summary, text);
      explanation.style.cssText = "border:1px solid var(--line, #b0aa98);border-radius:18px;padding:12px 14px;margin-top:12px;line-height:1.9";
      summary.style.cursor = "pointer";
      c.append(explanation);
    }
    return c;
  }
  fetch("final-review-prep1-questions.json?v=20261124-final123", { cache: "no-cache" }).then((r) => {
    if (!r.ok) throw Error();
    return r.json();
  }).then((d) => {
    let current = 0;
    window.__FINAL_PREP1 = d;
    const picker = e("div", void 0, "final-section-picker"), toggle = e("button", "", "final-section-toggle"), list = e("div", void 0, "final-section-list"), progress = e("p"), content = e("div", void 0, "final-section-items");
    list.hidden = true;
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.onclick = () => {
      list.hidden = !list.hidden;
      toggle.setAttribute("aria-expanded", String(!list.hidden));
    };
    picker.append(toggle, list);
    d.sections.forEach((s, i) => {
      const b = e("button", String(i + 1) + " · " + s.instruction + " · " + s.items.length);
      b.type = "button";
      b.dataset.section = i;
      b.onclick = () => {
        current = i;
        show();
        list.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      };
      list.append(b);
    });
    const nav = e("div", void 0, "final-nav");
    ["السابق / Previous", "التالي / Next"].forEach((t, i) => {
      const b = e("button", t);
      b.type = "button";
      b.onclick = () => {
        current = Math.max(0, Math.min(d.sections.length - 1, current + (i ? 1 : -1)));
        show();
        toggle.scrollIntoView({ block: "center", behavior: "instant" });
      };
      nav.append(b);
    });
    function show() {
      var _a;
      (_a = host.querySelector(".final-score")) == null ? void 0 : _a.remove();
      const s = d.sections[current];
      host.dataset.section = current;
      toggle.textContent = String(current + 1) + " · " + s.instruction;
      progress.textContent = "القسم " + (current + 1) + " من " + d.sections.length + " · " + s.items.length + " سجلًا";
      content.replaceChildren(e("h2", s.instruction));
      s.items.forEach((q, i) => content.append(item(q, s, i)));
      nav.children[0].disabled = current === 0;
      nav.children[1].disabled = current === d.sections.length - 1;
      updateScore();
    }
    const held = d.sections.flatMap((s) => s.items).filter((q) => q.held).length;
    const note = e("p", "389 سجلًا في21 أقسام. " + held + " سؤالًا موقوفًا لعدم وضوح الإجابة، والكتابة والأسئلة المكتوبة للقراءة تُراجع مع المدرس. اختيار القراءة يُصحح آليًا.", "final-note");
    host.replaceChildren(note, picker, progress, nav, content);
    show();
    host.dataset.ready = "true";
  }).catch(() => host.replaceChildren(e("p", "تعذّر تحميل المراجعة. حدّث الصفحة للمحاولة مرة أخرى.")));
})();
