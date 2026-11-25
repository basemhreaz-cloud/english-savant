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
  const root = document.querySelector("#lesson-assessment"), unit = Number(root.dataset.unit || 1), grade = root.dataset.grade || "P1";
  const norm = (x) => esAnswerText(x).normalize("NFKC").replace(/[’‘]/g, "'").trim().toLowerCase().replace(/\s+/g, " ").replace(/\s+([.!?,])/g, "$1").replace(/[.!?،]+$/, "");
  const match = (a, b, q) => {
    const clean = (x) => String(x).normalize("NFKC").replace(/[’‘]/g, "'").trim().replace(/\s+/g, " ").replace(/\s+([.!?,])/g, "$1");
    if (q.strict_punctuation || q.strict_case) {
      a = clean(a);
      b = clean(b);
      return (q.strict_case ? a : a.toLowerCase()) === (q.strict_case ? b : b.toLowerCase());
    }
    return norm(a) === norm(b);
  };
  const join = (xs, letters) => letters ? xs.join("") : xs.join(" ").replace(/\s+([.!?,])/g, "$1");
  const resultIcon = (ok) => {
    const ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("aria-hidden", "true");
    svg.style.verticalAlign = "middle";
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", ok ? "M5 12l4 4L19 6" : "M6 6l12 12M18 6L6 18");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "2.5");
    path.setAttribute("stroke-linecap", "round");
    svg.append(path);
    return svg;
  };
  const node = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== void 0) e.textContent = text;
    return e;
  };
  function optionOrder(q) {
    let seed = 2166136261;
    for (const ch of q.id) seed = Math.imul(seed ^ ch.charCodeAt(0), 16777619) >>> 0;
    const xs = [...q.options];
    for (let i = xs.length - 1; i > 0; i--) {
      seed = Math.imul(seed, 1664525) + 1013904223 >>> 0;
      const j = seed % (i + 1);
      [xs[i], xs[j]] = [xs[j], xs[i]];
    }
    return xs;
  }
  function validate(items2, qa = false) {
    var _a, _b, _c, _d, _e, _f;
    if (!Array.isArray(items2) || !items2.length) throw Error("No records");
    const ids = /* @__PURE__ */ new Set();
    for (const q of items2) {
      if (!q.id || ids.has(q.id)) throw Error("Duplicate id");
      ids.add(q.id);
      if (q.grade !== grade || q.unit !== unit || ![1, 2, 3, 4].includes(q.lesson) || !q.source_ref || !q.prompt || !q.explanation_ar) throw Error("Invalid context " + q.id);
      if (q.requires_image && !q.image) throw Error("Required image missing " + q.id);
      if (q.image && !/^(p[12]-lessons-assets\/img|images\/words)\/[a-z0-9-]+\.(png|jpg)$/.test(q.image)) throw Error("Invalid image " + q.id);
      if (q.option_images && (!q.options || Object.keys(q.option_images).length !== q.options.length || q.options.some((o) => !q.option_images[o] || !/^(p[12]-lessons-assets\/img|images\/words)\/[a-z0-9-]+\.(png|jpg)$/.test(q.option_images[o])))) throw Error("Picture options " + q.id);
      if (q.type === "dialogue") {
        const marks = (_a = q.dialogue) == null ? void 0 : _a.flatMap((t) => [...t.text.matchAll(/\{(\d+)\}/g)].map((m) => +m[1]));
        if (!(marks == null ? void 0 : marks.length) || !((_b = q.blanks) == null ? void 0 : _b.length) || q.blanks.length !== marks.length || q.blanks.some((b) => {
          var _a2;
          return marks.filter((n) => n === b.n).length !== 1 || !((_a2 = b.accept) == null ? void 0 : _a2.length);
        }) || new Set(q.blanks.map((b) => b.n)).size !== q.blanks.length) throw Error("Dialogue contract " + q.id);
      } else if (q.type === "reorder" || q.type === "unscramble") {
        const tokens = q.type === "reorder" ? q.words : q.letters;
        if (!(tokens == null ? void 0 : tokens.length) || !((_c = q.accept) == null ? void 0 : _c.length) || ((_d = q.options) == null ? void 0 : _d.length)) throw Error("Token contract " + q.id);
        const expected = q.type === "reorder" ? q.answer_tokens : [...q.answer];
        if (!expected || JSON.stringify([...tokens].sort()) !== JSON.stringify([...expected].sort()) || !q.accept.some((a) => norm(a) === norm(join(expected, q.type === "unscramble")))) throw Error("Token key " + q.id);
      } else if (q.type === "tf") {
        if (!["True", "False"].includes(q.answer)) throw Error("TF key " + q.id);
      } else if (q.type === "mcq") {
        if (!((_e = q.options) == null ? void 0 : _e.length) || new Set(q.options).size !== q.options.length || q.options.filter((a) => a === q.answer).length !== 1) throw Error("MCQ key " + q.id);
      } else if (q.type === "typein") {
        if (!((_f = q.accept) == null ? void 0 : _f.length) || !q.accept.some((a) => norm(a) === norm(q.answer))) throw Error("Text key " + q.id);
      } else throw Error("Unsupported type " + q.type);
    }
    return items2;
  }
  window.P1AssessmentValidate = validate;
  let items = [], lesson = 0, index = 0, answers = /* @__PURE__ */ new Map();
  const STORAGE = "es-p2-exam-progress-v1-" + unit;
  function save() {
    try {
      localStorage.setItem(STORAGE, JSON.stringify({ ids: items.map((q) => q.id), answers: [...answers], index, lesson }));
    } catch {
    }
  }
  function reveal() {
    root.scrollIntoView({ block: "start", behavior: "instant" });
  }
  function menu() {
    root.replaceChildren(node("h2", null, "اختار الدرس"));
    for (let l = 1; l <= (Number(root.dataset.lessons) || 4); l++) {
      const qs = items.filter((q) => q.lesson === l), b = node("button", "lesson-choice", "الدرس " + l + " · " + qs[0].lesson_title + " · " + qs.length + " سؤال");
      b.onclick = () => {
        lesson = l;
        index = 0;
        save();
        render();
        reveal();
      };
      root.append(b);
    }
  }
  function blocks(list) {
    const out = [], passages = /* @__PURE__ */ new Map();
    let loose = null;
    for (const q of list) {
      if (q.passage) {
        loose = null;
        const key = q.lesson + "|" + q.passage;
        if (passages.has(key)) passages.get(key).push(q);
        else {
          const g = [q];
          passages.set(key, g);
          out.push(g);
        }
      } else {
        if (!loose || loose.length >= 5) {
          loose = [];
          out.push(loose);
        }
        loose.push(q);
      }
    }
    return out;
  }
  function render() {
    const list = items.filter((q2) => q2.lesson === lesson), pages = blocks(list);
    index = Math.min(index, pages.length - 1);
    const group = pages[index], q = group[0];
    window.__P1 = { unit, lesson, index, item: q, items: group };
    root.replaceChildren();
    const back = node("a", "q-check", "اختبارات الوحدات");
    back.href = "test-p2.html";
    root.append(back, node("h2", null, q.lesson_title), node("p", "lesson-position", "مجموعة " + (index + 1) + " من " + pages.length + " · " + group.length + " سؤال"));
    if (q.passage) {
      const passage = node("div", "q-passage", q.passage);
      passage.dir = "ltr";
      root.append(passage);
    }
    const nav = node("div", "lesson-nav"), prev = node("button", "q-check", "السابق"), next = node("button", "q-check", index === pages.length - 1 ? "نتيجة الوحدة" : "التالي");
    prev.disabled = index === 0;
    next.disabled = group.some((item) => !answers.has(item.id));
    prev.onclick = () => {
      index--;
      save();
      render();
      reveal();
    };
    next.onclick = () => {
      if (index < pages.length - 1) {
        index++;
        save();
        render();
      } else finish(list);
      reveal();
    };
    nav.append(prev, next);
    for (const item of group) mount(item);
    root.append(nav);
    function mount(q2) {
      var _a, _b, _c;
      const saved = answers.get(q2.id), card = node("article", "q-card");
      card.dataset.itemId = q2.id;
      const prompt = node("h3", "q-text", q2.prompt);
      prompt.dir = "auto";
      card.append(prompt);
      if (q2.image) {
        const img = node("img", "assessment-image");
        img.src = q2.image;
        img.alt = q2.alt || "";
        card.append(img);
      }
      if ((_a = q2.word_bank) == null ? void 0 : _a.length) card.append(node("p", "word-bank", q2.word_bank.join(" · ")));
      const controls = node("div", "answer-controls");
      controls.dir = "ltr";
      card.append(controls);
      let inputs = [], selected, tokens = [], tokenButtons = [];
      if (q2.type === "dialogue") {
        const map = /* @__PURE__ */ new Map();
        q2.dialogue.forEach((turn) => {
          const line = node("div", "dialogue-turn");
          line.append(node("strong", null, turn.speaker + ": "));
          turn.text.split(/\{(\d+)\}/g).forEach((part, n) => {
            if (n % 2) {
              const input = node("input", "q-input");
              input.type = "text";
              input.autocomplete = "off";
              input.setAttribute("aria-label", "Blank " + part);
              input.dataset.blank = part;
              line.append(input);
              map.set(+part, input);
            } else line.append(document.createTextNode(part));
          });
          controls.append(line);
        });
        inputs = q2.blanks.map((b) => map.get(b.n));
      } else if (q2.type === "reorder" || q2.type === "unscramble") {
        const result = node("p", "token-result", ""), bank = node("div", "token-bank");
        result.setAttribute("aria-live", "polite");
        const source = q2.type === "reorder" ? q2.words : q2.letters;
        const update = () => {
          result.textContent = join(tokens.map((i) => source[i]), q2.type === "unscramble");
          tokenButtons.forEach((b, i) => b.disabled = tokens.includes(i));
        };
        source.forEach((word, i) => {
          const b = node("button", "opt token", word);
          b.type = "button";
          b.dataset.token = i;
          b.onclick = () => {
            tokens.push(i);
            update();
          };
          tokenButtons.push(b);
          bank.append(b);
        });
        const undo = node("button", "q-check token-undo", "ارجع خطوة");
        undo.type = "button";
        undo.onclick = () => {
          tokens.pop();
          update();
        };
        controls.append(result, bank, undo);
      } else if (q2.type === "tf" || q2.type === "mcq") {
        (q2.type === "tf" ? ["True", "False"] : optionOrder(q2)).forEach((option) => {
          const b = node("button", "opt", q2.option_images ? "" : option);
          b.type = "button";
          b.dataset.option = option;
          if (q2.option_images) {
            const pic = node("img", "picture-option");
            pic.src = q2.option_images[option];
            pic.alt = "Picture option " + (q2.options.indexOf(option) + 1);
            pic.style.cssText = "width:100%;height:110px;object-fit:contain";
            b.append(pic);
            b.setAttribute("aria-label", pic.alt);
          }
          b.onclick = () => {
            selected = option;
            controls.querySelectorAll("button").forEach((x) => x.classList.toggle("selected", x === b));
          };
          controls.append(b);
        });
      } else {
        const input = node("input", "q-input");
        input.type = "text";
        input.autocomplete = "off";
        input.setAttribute("aria-label", "Your answer");
        controls.append(input);
        inputs = [input];
      }
      if (q2.type === "typein" && !q2.strict_case && !q2.strict_punctuation) (_b = window.ESWrittenAI) == null ? void 0 : _b.attach(card, { question: q2.prompt, passage: q2.passage, alternatives: q2.accept, answer: () => {
        var _a2;
        return (_a2 = inputs[0]) == null ? void 0 : _a2.value;
      } });
      const check = node("button", "q-check", "تحقق"), feed = node("div", "q-feed");
      feed.setAttribute("aria-live", "polite");
      card.append(check, feed);
      root.append(card);
      function apply(r, animate = true) {
        var _a2, _b2;
        check.disabled = true;
        controls.querySelectorAll("button,input").forEach((e) => e.disabled = true);
        feed.className = "q-feed " + (r.ok ? "ok" : "no");
        feed.replaceChildren(node("p", null, r.ok ? "أحسنت، إجابة صحيحة" : "راجع الإجابة"));
        if (r.fields) r.fields.forEach((ok, i) => {
          inputs[i].classList.add(ok ? "ok" : "no");
          if (!ok) feed.append(node("p", null, "فراغ " + q2.blanks[i].n + ": " + q2.blanks[i].accept[0]));
        });
        else if (!r.ok) feed.append(node("p", null, "الإجابة الصحيحة: " + q2.answer));
        const state = node("span", "q-state");
        state.setAttribute("aria-hidden", "true");
        feed.append(state);
        state.dataset.fxHandled = "true";
        if (animate) (_a2 = window.ESFeedback) == null ? void 0 : _a2.call(window, r.ok, card);
        if (animate) requestAnimationFrame(() => {
          if (state.isConnected) state.replaceChildren(resultIcon(r.ok));
        });
        if (r.formIssue) feed.append(node("p", "answer-form-note", "المعنى صحيح. راجع الحروف الكبيرة وعلامات الترقيم: " + q2.answer));
        const exp = node("p", "answer-explanation", q2.explanation_ar);
        exp.dir = "auto";
        (_b2 = window.ESInterface) == null ? void 0 : _b2.bindExplanation(exp, q2);
        feed.append(exp);
        next.disabled = group.some((item) => !answers.has(item.id));
      }
      check.onclick = () => {
        const isToken = ["reorder", "unscramble"].includes(q2.type), source = q2.type === "reorder" ? q2.words : q2.letters;
        if (inputs.some((i) => !i.value.trim()) || (isToken ? tokens.length !== source.length : !inputs.length && selected === void 0)) {
          feed.textContent = "جاوب على كل الفراغات أو رتّب كل الكلمات والحروف الأول.";
          return;
        }
        let ok, fields;
        if (q2.type === "dialogue") {
          fields = q2.blanks.map((b, i) => b.accept.some((a) => norm(a) === norm(inputs[i].value)));
          ok = fields.every(Boolean);
        } else if (isToken) ok = q2.accept.some((a) => norm(a) === norm(join(tokens.map((i) => source[i]), q2.type === "unscramble")));
        else if (inputs.length) ok = q2.accept.some((a) => match(a, inputs[0].value, q2));
        else ok = selected === q2.answer;
        const formIssue = !ok && inputs.length === 1 && (q2.strict_case || q2.strict_punctuation) && q2.accept.some((a) => esAnswerContent(a) === esAnswerContent(inputs[0].value));
        if (formIssue) ok = true;
        const r = { ok, formIssue, fields, values: inputs.map((i) => i.value), selected, tokens: [...tokens] };
        answers.set(q2.id, r);
        save();
        apply(r);
      };
      if (saved) {
        inputs.forEach((x, i) => x.value = saved.values[i]);
        selected = saved.selected;
        controls.querySelectorAll(".opt").forEach((b) => b.classList.toggle("selected", (b.dataset.option || b.textContent) === selected));
        if ((_c = saved.tokens) == null ? void 0 : _c.length) {
          const source = q2.type === "reorder" ? q2.words : q2.letters;
          controls.querySelector(".token-result").textContent = join(saved.tokens.map((i) => source[i]), q2.type === "unscramble");
        }
        apply(saved, false);
      }
    }
  }
  function finish(list) {
    root.replaceChildren(node("h2", null, "نتيجة الوحدة"), node("p", "lesson-score", list.filter((q) => {
      var _a;
      return (_a = answers.get(q.id)) == null ? void 0 : _a.ok;
    }).length + " / " + list.length));
    root.querySelector(".lesson-score").dir = "ltr";
    const wrong = list.filter((q) => answers.has(q.id) && !answers.get(q.id).ok);
    const review = node("section", "exam-wrong-review");
    review.append(node("h3", null, "مراجعة الإجابات غير الصحيحة"));
    if (!wrong.length) review.append(node("p", null, "لا توجد إجابات غير صحيحة في المحاولة."));
    for (const q of wrong) {
      const c = node("article", "q-card");
      if (q.passage) {
        const passage = node("div", "q-passage", q.passage);
        passage.dir = "ltr";
        c.append(passage);
      }
      if (q.image) {
        const im = node("img", "assessment-image");
        im.src = q.image;
        im.alt = q.alt || "Question picture";
        c.append(im);
      }
      c.append(node("h3", "q-text", q.prompt), node("p", null, "الإجابة: " + q.answer), node("p", "answer-explanation", q.explanation_ar));
      c.querySelectorAll(".answer-explanation").forEach((e) => {
        var _a;
        return (_a = window.ESInterface) == null ? void 0 : _a.bindExplanation(e, q);
      });
      review.append(c);
    }
    root.append(review);
    const again = node("button", "q-check", "ابدأ محاولة جديدة"), back = node("button", "q-check", "ابدأ الاختبار من جديد");
    again.onclick = () => {
      list.forEach((q) => answers.delete(q.id));
      index = 0;
      save();
      render();
    };
    back.onclick = () => {
      answers.clear();
      index = 0;
      save();
      render();
    };
    root.append(again, back);
  }
  fetch(root.dataset.bank || "p2-unit-exam-u" + unit + ".json", { cache: "no-store" }).then((r) => {
    if (!r.ok) throw Error("Bank unavailable");
    return r.json();
  }).then((data) => {
    items = validate(data);
    lesson = 1;
    try {
      const state = JSON.parse(localStorage.getItem(STORAGE));
      if (JSON.stringify(state == null ? void 0 : state.ids) === JSON.stringify(items.map((q) => q.id))) {
        answers = new Map(state.answers.filter(([id, v]) => items.some((q) => q.id === id) && typeof v.ok === "boolean"));
        index = Math.max(0, state.index || 0);
        lesson = state.lesson || 1;
      }
    } catch {
    }
    render();
  }).catch((e) => {
    root.replaceChildren(node("p", "lesson-error", "التقييم ده لسه في المراجعة، ومش متاح للحل دلوقتي."));
    console.error(e);
  });
})();
