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
  let saved = {};
  const KEY = "es-p3-final-self-v1";
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
  function save(id, v) {
    saved[id] = v;
    try {
      localStorage.setItem(KEY, JSON.stringify(saved));
    } catch {
    }
  }
  function field(id, long = false) {
    const n = e(long ? "textarea" : "input");
    if (long) n.rows = 3;
    else n.type = "text";
    n.dir = "auto";
    n.setAttribute("aria-label", "Your response / إجابتك");
    n.value = saved[id] || "";
    n.oninput = () => save(id, n.value);
    const w = e("label", "إجابتك / Your response", "final-field");
    w.append(n);
    return w;
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
  function tokens(id, text) {
    const wrap = e("div", void 0, "final-tokens"), row = e("div"), result = e("p", saved[id] || "", "final-built");
    text.split(/\s+-\s+|\s*\/\s*/).forEach((w) => {
      const b = e("button", w);
      b.type = "button";
      b.onclick = () => {
        result.textContent = (result.textContent + " " + w).trim();
        save(id, result.textContent);
      };
      row.append(b);
    });
    const clear = e("button", "امسح / Clear");
    clear.type = "button";
    clear.onclick = () => {
      result.textContent = "";
      save(id, "");
    };
    wrap.append(row, result, clear, field(id + ":typed"));
    return wrap;
  }
  const norm = (v) => esAnswerText(v).toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const concepts = {
    "P3:s1:i0": [["tala"], ["help|helps|helping", "homework"], ["helpful|helpul", "funny"]],
    "P3:s1:i2": [["sunday"], ["camels|camel", "horses|horse"]],
    "P3:s1:i3": [["first", "football|soccer", "match|game"], ["team", "won|win"]],
    "P3:s1:i4": [["garden"], ["hurt|pain|painful|injured"]]
  };
  function acceptReading(v, expected, id, k) {
    var _a;
    const n = norm(v);
    if (!n) return false;
    const ex = norm(expected);
    if (n === ex) return true;
    const rules = (_a = concepts[id]) == null ? void 0 : _a[k];
    if (!rules) return null;
    if (/\b(?:not|never|no|didn|wasn|isn|doesn|don)\b/.test(n)) return null;
    const words = n.split(" ");
    return rules.every((r) => r.split("|").some((w) => words.includes(w))) ? true : null;
  }
  function addGrading(c, q, s) {
    var _a;
    if (!q.held && !q.options && s.section_index !== 8 && c.querySelector("input,textarea")) (_a = window.ESWrittenAI) == null ? void 0 : _a.attach(c, { question: q.text || q.question || q.title || s.instruction, passage: q.passage, alternatives: Array.isArray(q.answer) ? q.answer : [q.answer].filter((x) => typeof x === "string"), answer: () => Array.from(c.querySelectorAll("textarea,input:not([type=checkbox])")).map((x) => x.value).join(" ") });
    if (q.grading_mode !== "checked") {
      if (!q.held) c.append(e("p", q.grading_reason, "final-note"));
      return;
    }
    let a = q.answer;
    const multiple = Array.isArray(a) || typeof a === "object";
    const arr = Array.isArray(a) ? a : typeof a === "object" ? Object.values(a) : [a];
    if (multiple && !q.questions && !q.items && !q.lines) {
      c.querySelectorAll(".final-field").forEach((n) => n.remove());
      arr.forEach((v, k) => {
        const f = field(q.item_id + ":" + k);
        [...f.childNodes].filter((n) => n.nodeType === 3).forEach((n) => n.remove());
        f.prepend(document.createTextNode("الإجابة " + (k + 1) + " / Answer " + (k + 1)));
        c.append(f);
      });
    }
    const feedback = e("p", "", "final-grade-result");
    feedback.setAttribute("aria-live", "polite");
    const button = e("button", "تحقق / Check");
    button.type = "button";
    button.className = "q-check";
    button.onclick = () => {
      var _a2, _b;
      let vals;
      if (q.options) {
        const chosen = c.querySelector("input:checked");
        vals = [chosen ? q.options[Number(chosen.value)] : ""];
      } else if (s.section_index === 6) {
        vals = [((_a2 = c.querySelector("input")) == null ? void 0 : _a2.value) || c.querySelector(".final-built").textContent];
      } else vals = [...c.querySelectorAll("input:not([type=radio]):not([type=checkbox]),textarea")].map((n) => n.value);
      let uncertain = false, formIssue = false;
      const ok = arr.every((ex, k) => {
        const v = vals[k] || "";
        if (s.section_index === 1 && q.questions && !q.questions[k].includes("…")) {
          const r = acceptReading(v, ex, q.item_id, k);
          if (r === null) uncertain = true;
          return r === true;
        }
        if (s.section_index === 8) {
          const exact = v.trim().replace(/\s+/g, " ") === String(ex).trim().replace(/\s+/g, " ");
          const content = esAnswerContent(v) === esAnswerContent(ex);
          if (!exact && content) formIssue = true;
          return exact || content;
        }
        if (s.section_index === 9) {
          const want = norm(ex), got = norm(v), miss = String(q.text).match(/_+/);
          let blank = "";
          if (miss) {
            const bits = String(q.text).split(/_+/).map(norm);
            const prefix = bits[0], suffix = bits[1] || "";
            if (want.startsWith(prefix) && want.endsWith(suffix)) blank = want.slice(prefix.length, suffix ? want.length - suffix.length : void 0);
          }
          return got === want || got === blank;
        }
        if (s.section_index === 5) return norm(v) === norm(ex);
        return norm(v) === norm(ex);
      });
      const empty = vals.some((v) => !v.trim());
      c.dataset.grade = empty ? "empty" : ok ? "correct" : uncertain ? "review" : "incorrect";
      if (!empty && (ok || !uncertain)) (_b = window.ESFeedback) == null ? void 0 : _b.call(window, ok, c);
      feedback.textContent = empty ? "اكتب كل الإجابات أولًا." : ok && formIssue ? "المعنى صحيح. راجع الحروف الكبيرة والترقيم: " + arr.join(" / ") : ok ? "صح ✓" : uncertain ? "صياغتك تحتاج مراجعة المدرس. لم تُحسب خطأ." : "راجع إجابتك وحاول مرة أخرى.";
      updateScore();
    };
    c.append(button, feedback);
  }
  function updateScore() {
    const cards = [...document.querySelectorAll(".final-question")];
    let score = document.querySelector(".final-score");
    if (!score) {
      score = e("p", "", "final-score");
      host.prepend(score);
    }
    const correct = cards.filter((c) => c.dataset.grade === "correct").length, wrong = cards.filter((c) => c.dataset.grade === "incorrect").length, review = cards.filter((c) => c.dataset.grade === "review").length;
    score.textContent = "نتيجة القسم الحالي: " + correct + " صحيحة من " + (correct + wrong) + " مصححة · " + review + " تحتاج مراجعة. المهام المفتوحة والأسئلة غير المؤكدة لا تدخل في الدرجة.";
  }
  function item(q, s, i) {
    const c = e("article", void 0, "glass final-question");
    c.id = q.item_id.replace(/:/g, "-");
    c.dataset.itemId = q.item_id;
    c.append(e("p", String(i + 1), "final-number"));
    if (q.held) {
      c.dataset.held = "true";
      c.append(e("p", "يحتاج مراجعة المدرس. لا توجد إجابة مؤكدة لهذا السؤال.", "final-note"));
    }
    if (q.illustration_note) c.append(e("p", q.illustration_note, "final-note"));
    if (q.passage) {
      const p = e("div", q.passage, "q-passage");
      p.dir = "ltr";
      c.append(p);
    }
    if (q.image) {
      const im = e("img");
      im.src = q.image;
      im.alt = "Original booklet picture";
      im.loading = "lazy";
      im.className = "final-picture";
      c.append(im);
    }
    if (q.wordbank) c.append(e("p", q.wordbank.join(" · "), "final-wordbank"));
    if (q.keywords) c.append(e("p", q.keywords.join(" · "), "final-wordbank"));
    if (q.parts) {
      const p = e("p", void 0, "final-prompt");
      q.parts.forEach((part, k) => p.append(k === 1 ? e("u", part) : document.createTextNode(part)));
      p.dir = "ltr";
      c.append(p);
    } else if (q.question || q.text || q.title) {
      const p = e("p", q.question || q.text || q.title, "final-prompt");
      p.dir = "ltr";
      c.append(p);
    }
    if (q.pronunciation_audio) {
      const a = e("audio");
      a.controls = true;
      a.preload = "none";
      a.src = q.pronunciation_audio + "?v=85";
      a.setAttribute("aria-label", "Listen to the word");
      c.append(e("p", "تسجيل تعليمي جديد، مش تسجيل الكتاب الأصلي.", "final-note"), a);
    } else if (s.section_index === 9) c.append(e("p", "سؤال استماع بدون تسجيل أو كلمة مؤكدة. لا تخمّن الإجابة.", "final-note"));
    if (q.options) c.append(choices(q.item_id, q.options));
    else if (q.questions || q.items || q.lines) {
      (q.questions || q.items || q.lines).forEach((t, k) => {
        c.append(e("p", t, "final-prompt"), field(q.item_id + ":" + k));
      });
    } else if (s.section_index === 6) c.append(tokens(q.item_id, q.text));
    else if (s.section_index !== 9 || q.pronunciation_audio) c.append(field(q.item_id, s.type === "paragraphs" || s.type === "passage_write"));
    addGrading(c, q, s);
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
  fetch("final-review-p3-questions.json?v=85", { cache: "no-cache" }).then((r) => {
    if (!r.ok) throw Error();
    return r.json();
  }).then((d) => {
    let current = 0;
    const picker = e("div", void 0, "final-section-picker"), toggle = e("button", void 0, "final-section-toggle"), list = e("div", void 0, "final-section-list"), content = e("div", void 0, "final-section-items"), progress = e("p");
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
      (_a = document.querySelector(".final-score")) == null ? void 0 : _a.remove();
      const s = d.sections[current];
      host.dataset.section = current;
      toggle.textContent = String(current + 1) + " · " + s.instruction;
      progress.textContent = "القسم " + (current + 1) + " من " + d.sections.length + " · " + s.items.length + " سجلًا · تصحيح للأسئلة ذات الإجابات المؤكدة";
      content.replaceChildren(e("h2", s.instruction));
      s.items.forEach((q, i) => content.append(item(q, s, i)));
    }
    const note = e("p", "التصحيح متاح لـ395 سجلًا. 44 سؤالًا ملتبسًا و18 كتابة مفتوحة للمراجعة مع المدرس، خارج الدرجة. إجابات القراءة تُقبل بصيغ متعددة؛ الصياغة غير المعروفة تُحال للمراجعة بدل احتسابها خطأ.", "final-note");
    host.replaceChildren(note, picker, progress, nav, content);
    show();
    host.dataset.ready = "true";
  }).catch(() => host.replaceChildren(e("p", "تعذّر تحميل المراجعة. حدّث الصفحة للمحاولة مرة أخرى.")));
})();
