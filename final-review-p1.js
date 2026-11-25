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
  const host = document.querySelector("#final-review-practice"), key = "es-p1-final-v1";
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
  }
  const en = () => document.documentElement.dataset.interfaceLanguage === "en";
  const text = (ar, english) => en() ? english : ar;
  const el = (tag, content, cls) => {
    const n = document.createElement(tag);
    if (content !== void 0) n.textContent = content;
    if (cls) n.className = cls;
    return n;
  };
  let data, book, current = 0, section = 0;
  const normalize = (s) => esAnswerText(s).trim().toLowerCase().replace(/\s+/g, " ");
  const sentence = (s) => normalize(s).replace(/[.,!?;:’']/g, "").replace(/\s+/g, " ");
  function show() {
    var _a;
    if (!data) return;
    host.replaceChildren();
    const note = el("p", text("متاح الآن: " + book.sections.reduce((n, s) => n + s.items.length, 0) + " سؤالًا من المذكرة النهائية. بقية الأسئلة قيد المراجعة والإضافة.", "Available now: " + book.sections.reduce((n, s) => n + s.items.length, 0) + " questions from the final booklet. More questions are being reviewed."), "final-note");
    const picker = el("div", void 0, "final-section-tabs");
    book.sections.forEach((part, i) => {
      const b = el("button", en() ? part.instruction : part.instruction_ar);
      b.type = "button";
      b.setAttribute("aria-pressed", String(i === section));
      b.onclick = () => {
        section = i;
        data = part.items;
        current = 0;
        show();
      };
      picker.append(b);
    });
    const nav = el("div", void 0, "final-nav");
    const prev = el("button", text("السابق", "Previous")), status = el("span", current + 1 + " / " + Math.ceil(data.length / 6)), next = el("button", text("التالي", "Next"));
    status.dir = "ltr";
    prev.disabled = current === 0;
    next.disabled = (current + 1) * 6 >= data.length;
    prev.onclick = () => {
      current--;
      show();
    };
    next.onclick = () => {
      current++;
      show();
    };
    nav.append(prev, status, next);
    const grid = el("div", void 0, "p1-final-grid");
    for (const q of data.slice(current * 6, current * 6 + 6)) {
      const card = el("article", void 0, "glass final-question");
      card.dataset.itemId = q.item_id;
      card.append(el("p", String(q.source_number), "final-number"));
      const img = el("img");
      if (q.image) img.src = q.image;
      else img.hidden = true;
      img.alt = text("صورة السؤال " + q.source_number, "Picture cue " + q.source_number);
      img.className = "final-picture";
      img.width = 180;
      img.height = 118;
      const prompt = el("p", q.question, "final-prompt");
      prompt.dir = "ltr";
      const label = el("label", book.sections[section].type === "reorder" ? text("اكتب الجملة بعد ترتيب الكلمات", "Write the reordered sentence") : book.sections[section].type === "missing-sound" ? text("اكتب الحرف الناقص فقط", "Write only the missing letter") : book.sections[section].type === "unscramble" ? text("رتّب الحروف واكتب الكلمة", "Unscramble and write") : text("انظر إلى الصورة واكتب الكلمة", "Look and write"), "final-field");
      const input = el("input");
      input.type = "text";
      input.autocomplete = "off";
      input.spellcheck = false;
      if (book.sections[section].type === "missing-sound") {
        input.maxLength = 1;
        input.autocapitalize = "none";
      }
      input.dir = "ltr";
      input.value = saved[q.item_id] || "";
      input.oninput = () => {
        saved[q.item_id] = input.value;
        try {
          localStorage.setItem(key, JSON.stringify(saved));
        } catch {
        }
        ;
        card.removeAttribute("data-grade");
        feedback.textContent = "";
      };
      label.append(input);
      const check = el("button", text("تحقق", "Check"), "q-check"), feedback = el("p", "", "final-grade-result");
      feedback.setAttribute("aria-live", "polite");
      check.onclick = () => {
        var _a2;
        const value = normalize(input.value);
        const ok = book.sections[section].type === "reorder" ? (q.accept || [q.answer]).some((x) => sentence(x) === sentence(value)) : (q.accept || [q.answer]).some((a) => normalize(a) === value);
        card.dataset.grade = !value ? "empty" : ok ? "correct" : "incorrect";
        feedback.textContent = !value ? text("اكتب إجابتك أولًا.", "Write your answer first.") : ok ? text("صح ✓", "Correct ✓") : book.sections[section].type === "reorder" ? text("راجع ترتيب الكلمات وحاول مرة أخرى.", "Check the word order, then try again.") : text("راجع الحروف والصورة وحاول مرة أخرى.", "Check the letters and picture, then try again.");
        if (value) (_a2 = window.ESFeedback) == null ? void 0 : _a2.call(window, ok, card);
      };
      const details = el("details", void 0, "final-explanation"), summary = el("summary", text("افهم الإجابة", "Understand the answer")), explain = el("p", en() ? book.sections[section].type === "reorder" ? "Arrange the given words: " + q.answer : book.sections[section].type === "missing-sound" ? "Write " + q.answer + " in the blank to make " + q.completed_word + "." : book.sections[section].type === "lookwrite" ? "The picture shows " + q.answer + "." : "The letters make " + q.answer + "." : q.explanation_ar);
      (_a = window.ESInterface) == null ? void 0 : _a.bindExplanation(explain, q);
      explain.dir = "auto";
      details.append(summary, explain);
      card.append(img, prompt, label, check, feedback, details);
      grid.append(card);
    }
    host.append(note, picker, nav, grid);
    host.dataset.ready = "true";
  }
  document.addEventListener("es:interface-language", show);
  fetch("final-review-p1-questions.json?v=165", { cache: "no-cache" }).then((r) => {
    if (!r.ok) throw Error("load");
    return r.json();
  }).then((d) => {
    window.__FINAL_P1 = d;
    book = d;
    data = d.sections[0].items;
    show();
  }).catch(() => host.textContent = text("تعذر تحميل الأسئلة. حدّث الصفحة للمحاولة.", "Could not load questions. Refresh to try again."));
})();
