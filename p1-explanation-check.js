(function() {
  if (!Array.prototype.flatMap) Object.defineProperty(Array.prototype, "flatMap", { configurable: true, writable: true, value: function(fn, ctx) {
    return this.reduce(function(out, v, i, a) {
      return out.concat(fn.call(ctx, v, i, a));
    }, []);
  } });
  if (!String.prototype.matchAll) Object.defineProperty(String.prototype, "matchAll", { configurable: true, writable: true, value: function(p) {
    var f = p.flags || "";
    if (f.indexOf("g") < 0) f += "g";
    var r = new RegExp(p.source, f), a = [], m;
    while (m = r.exec(String(this))) {
      a.push(m);
      if (!m[0]) r.lastIndex++;
    }
    return a;
  } });
  if (typeof Element !== "undefined" && !Element.prototype.replaceChildren) Object.defineProperty(Element.prototype, "replaceChildren", { configurable: true, writable: true, value: function() {
    while (this.firstChild) this.removeChild(this.firstChild);
    for (var i = 0; i < arguments.length; i++) this.append(arguments[i]);
  } });
})();
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
  const root = document.querySelector("#lesson-assessment"), unit = Number(new URLSearchParams(location.search).get("unit") || 1);
  const norm = (x) => esAnswerText(x).normalize("NFKC").replace(/[’‘]/g, "'").trim().toLowerCase().replace(/\s+/g, " ").replace(/\s+([.!?,])/g, "$1").replace(/[.!?،]+$/, "");
  const join = (xs, letters) => letters ? xs.join("") : xs.join(" ").replace(/\s+([.!?,])/g, "$1");
  const node = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== void 0) e.textContent = text;
    const pairs = { "\u0623\u062D\u0633\u0646\u062A \u2705 \u0625\u062C\u0627\u0628\u0629 \u0635\u062D\u064A\u062D\u0629": "Well done. Correct answer \u2705", "\u0631\u0627\u062C\u0639 \u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u274C": "Check your answer \u274C", "\u062C\u0627\u0648\u0628 \u0639\u0644\u0649 \u0643\u0644 \u0627\u0644\u0641\u0631\u0627\u063A\u0627\u062A \u0623\u0648 \u0631\u062A\u0651\u0628 \u0643\u0644 \u0627\u0644\u0643\u0644\u0645\u0627\u062A \u0648\u0627\u0644\u062D\u0631\u0648\u0641 \u0627\u0644\u0623\u0648\u0644.": "Answer every blank or put all the words and letters in order first." };
    if (pairs[text]) {
      e.dataset.p1Ar = text;
      e.dataset.p1En = pairs[text];
      e.setAttribute("data-no-interface-translation", "");
      e.textContent = document.documentElement.lang === "en" ? pairs[text] : text;
    }
    if (text === "\u062D\u0627\u0648\u0644 \u062A\u0627\u0646\u064A") {
      e.dataset.p1Ar = text;
      e.dataset.p1En = "Try again";
      e.setAttribute("data-no-interface-translation", "");
      e.textContent = document.documentElement.lang === "en" ? "Try again" : text;
    }
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
      if (q.grade !== "P1" || q.unit !== unit || ![1, 2, 3, 4].includes(q.lesson) || !q.source_ref || !q.prompt || !q.explanation_ar) throw Error("Invalid context " + q.id);
      if (q.requires_image && !q.image) throw Error("Required image missing " + q.id);
      if (q.image && !/^(?:p1-lessons-assets\/img\/[a-z0-9-]+|images\/words\/(?:nurse|panda))\.png$/.test(q.image)) throw Error("Invalid image " + q.id);
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
    if (!qa) {
      for (let l = 1; l <= 4; l++) if (items2.filter((q) => q.lesson === l).length < 30) throw Error("Under30 lesson " + l);
    }
    return items2;
  }
  document.addEventListener("es:interface-language", () => {
    root.querySelectorAll("[data-p1-ar]").forEach((e) => e.textContent = document.documentElement.lang === "en" ? e.dataset.p1En : e.dataset.p1Ar);
  });
  window.P1AssessmentValidate = validate;
  let items = [], lesson = 0, index = 0, answers = /* @__PURE__ */ new Map();
  function reveal() {
    root.scrollIntoView({ block: "start", behavior: "instant" });
  }
  function menu() {
    root.replaceChildren(node("h2", null, "\u0627\u062E\u062A\u0627\u0631 \u0627\u0644\u062F\u0631\u0633"));
    for (let l = 1; l <= 4; l++) {
      const qs = items.filter((q) => q.lesson === l), b = node("button", "lesson-choice", "\u0627\u0644\u062F\u0631\u0633 " + l + " \xB7 " + qs[0].lesson_title + " \xB7 " + qs.length + " \u0633\u0624\u0627\u0644");
      b.onclick = () => {
        lesson = l;
        index = 0;
        render();
        reveal();
      };
      root.append(b);
    }
  }
  function render() {
    var _a;
    const list = items.filter((q2) => q2.lesson === lesson), q = list[index], saved = answers.get(q.id);
    window.__P1 = { unit, lesson, index, item: q };
    root.replaceChildren();
    const back = node("button", "q-check", "\u0631\u062C\u0648\u0639 \u0644\u0644\u062F\u0631\u0648\u0633");
    back.onclick = menu;
    root.append(back, node("h2", null, q.lesson_title), node("p", "lesson-position", "\u0633\u0624\u0627\u0644 " + (index + 1) + " \u0645\u0646 " + list.length));
    const card = node("article", "q-card");
    card.dataset.itemId = q.id;
    if (q.passage) {
      const p = node("div", "q-passage", q.passage);
      p.dir = "ltr";
      card.append(p);
    }
    const prompt = node("h3", "q-text", q.prompt);
    if (q.prompt_en) {
      prompt.dataset.p1Ar = q.prompt;
      prompt.dataset.p1En = q.prompt_en;
      prompt.setAttribute("data-no-interface-translation", "");
      prompt.textContent = document.documentElement.lang === "en" ? q.prompt_en : q.prompt;
    }
    prompt.dir = "auto";
    card.append(prompt);
    if (q.image) {
      const img = node("img", "assessment-image");
      img.src = q.image;
      img.alt = q.alt || "";
      card.append(img);
    }
    const controls = node("div", "answer-controls");
    controls.dir = "ltr";
    card.append(controls);
    let inputs = [], selected, tokens = [], tokenButtons = [];
    if (q.type === "dialogue") {
      const map = /* @__PURE__ */ new Map();
      q.dialogue.forEach((turn) => {
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
      inputs = q.blanks.map((b) => map.get(b.n));
    } else if (q.type === "reorder" || q.type === "unscramble") {
      const result = node("p", "token-result", ""), bank = node("div", "token-bank");
      result.setAttribute("aria-live", "polite");
      const source = q.type === "reorder" ? q.words : q.letters;
      const update = () => {
        result.textContent = join(tokens.map((i) => source[i]), q.type === "unscramble");
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
      const undo = node("button", "q-check token-undo", "\u0627\u0631\u062C\u0639 \u062E\u0637\u0648\u0629");
      undo.type = "button";
      undo.onclick = () => {
        tokens.pop();
        update();
      };
      controls.append(result, bank, undo);
    } else if (q.type === "tf" || q.type === "mcq") {
      (q.type === "tf" ? ["True", "False"] : optionOrder(q)).forEach((option) => {
        const b = node("button", "opt", option);
        b.type = "button";
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
    const check = node("button", "q-check", "\u062A\u062D\u0642\u0642"), feed = node("div", "q-feed");
    feed.setAttribute("aria-live", "polite");
    card.append(check, feed);
    root.append(card);
    const nav = node("div", "lesson-nav"), prev = node("button", "q-check", "\u0627\u0644\u0633\u0624\u0627\u0644 \u0627\u0644\u0633\u0627\u0628\u0642"), next = node("button", "q-check", index === list.length - 1 ? "\u0646\u062A\u064A\u062C\u0629 \u0627\u0644\u062F\u0631\u0633" : "\u0627\u0644\u0633\u0624\u0627\u0644 \u0627\u0644\u062A\u0627\u0644\u064A");
    prev.disabled = index === 0;
    next.disabled = !saved;
    prev.onclick = () => {
      index--;
      render();
      reveal();
    };
    next.onclick = () => {
      if (index < list.length - 1) {
        index++;
        render();
      } else finish(list);
      reveal();
    };
    nav.append(prev, next);
    root.append(nav);
    function apply(r, animate = true) {
      var _a2;
      check.disabled = true;
      controls.querySelectorAll("button,input").forEach((e) => e.disabled = true);
      feed.className = "q-feed " + (r.ok ? "ok" : "no");
      feed.replaceChildren(node("p", null, r.ok ? "\u0623\u062D\u0633\u0646\u062A \u2705 \u0625\u062C\u0627\u0628\u0629 \u0635\u062D\u064A\u062D\u0629" : "\u0631\u0627\u062C\u0639 \u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u274C"));
      if (r.fields) r.fields.forEach((ok, i) => {
        inputs[i].classList.add(ok ? "ok" : "no");
        if (!ok) feed.append(node("p", null, "\u0641\u0631\u0627\u063A " + q.blanks[i].n + ": " + q.blanks[i].accept[0]));
      });
      else if (!r.ok) feed.append(node("p", null, "\u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0627\u0644\u0635\u062D\u064A\u062D\u0629: " + q.answer));
      const state = node("span", "q-state");
      state.setAttribute("aria-hidden", "true");
      feed.append(state);
      if (animate) requestAnimationFrame(() => {
        if (state.isConnected) state.textContent = r.ok ? "\u2705" : "\u274C";
      });
      const exp = node("p", "answer-explanation", q.explanation_ar);
      exp.dir = "auto";
      (_a2 = window.ESInterface) == null ? void 0 : _a2.bindExplanation(exp, q);
      feed.append(exp);
      next.disabled = false;
    }
    check.onclick = () => {
      const isToken = ["reorder", "unscramble"].includes(q.type), source = q.type === "reorder" ? q.words : q.letters;
      if (inputs.some((i) => !i.value.trim()) || (isToken ? tokens.length !== source.length : !inputs.length && selected === void 0)) {
        feed.textContent = "\u062C\u0627\u0648\u0628 \u0639\u0644\u0649 \u0643\u0644 \u0627\u0644\u0641\u0631\u0627\u063A\u0627\u062A \u0623\u0648 \u0631\u062A\u0651\u0628 \u0643\u0644 \u0627\u0644\u0643\u0644\u0645\u0627\u062A \u0648\u0627\u0644\u062D\u0631\u0648\u0641 \u0627\u0644\u0623\u0648\u0644.";
        return;
      }
      let ok, fields;
      if (q.type === "dialogue") {
        fields = q.blanks.map((b, i) => b.accept.some((a) => norm(a) === norm(inputs[i].value)));
        ok = fields.every(Boolean);
      } else if (isToken) ok = q.accept.some((a) => norm(a) === norm(join(tokens.map((i) => source[i]), q.type === "unscramble")));
      else if (inputs.length) ok = q.accept.some((a) => norm(a) === norm(inputs[0].value));
      else ok = selected === q.answer;
      const r = { ok, fields, values: inputs.map((i) => i.value), selected, tokens: [...tokens] };
      answers.set(q.id, r);
      apply(r);
    };
    if (saved) {
      inputs.forEach((x, i) => x.value = saved.values[i]);
      selected = saved.selected;
      controls.querySelectorAll(".opt").forEach((b) => b.classList.toggle("selected", b.textContent === selected));
      if ((_a = saved.tokens) == null ? void 0 : _a.length) {
        const source = q.type === "reorder" ? q.words : q.letters;
        controls.querySelector(".token-result").textContent = join(saved.tokens.map((i) => source[i]), q.type === "unscramble");
      }
      apply(saved, false);
    }
  }
  function finish(list) {
    root.replaceChildren(node("h2", null, "\u0646\u062A\u064A\u062C\u0629 \u0627\u0644\u062F\u0631\u0633"), node("p", "lesson-score", list.filter((q) => {
      var _a;
      return (_a = answers.get(q.id)) == null ? void 0 : _a.ok;
    }).length + " / " + list.length));
    const again = node("button", "q-check", "\u062D\u0627\u0648\u0644 \u0627\u0644\u062F\u0631\u0633 \u062A\u0627\u0646\u064A"), back = node("button", "q-check", "\u0631\u062C\u0648\u0639 \u0644\u0644\u062F\u0631\u0648\u0633");
    again.onclick = () => {
      list.forEach((q) => answers.delete(q.id));
      index = 0;
      render();
    };
    back.onclick = menu;
    root.append(again, back);
  }
  fetch("lesson-assessment-p1-u" + unit + ".json?v=20261125-en222", { cache: "no-store" }).then((r) => {
    if (!r.ok) throw Error("Bank unavailable");
    return r.json();
  }).then((data) => {
    const id = new URLSearchParams(location.search).get("id");
    items = validate(data, true).filter((q) => q.id === id);
    if (items.length !== 1) throw Error("Unknown check");
    lesson = items[0].lesson;
    index = 0;
    render();
    document.querySelector(".lesson-nav").remove();
    root.querySelector(":scope>button").remove();
    const retry = node("button", "q-check check-retry", "\u062D\u0627\u0648\u0644 \u062A\u0627\u0646\u064A");
    retry.onclick = () => location.reload();
    root.append(retry);
  }).catch((e) => {
    root.replaceChildren(node("p", "lesson-error", "\u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u062F\u0647 \u0644\u0633\u0647 \u0641\u064A \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629\u060C \u0648\u0645\u0634 \u0645\u062A\u0627\u062D \u0644\u0644\u062D\u0644 \u062F\u0644\u0648\u0642\u062A\u064A."));
    console.error(e);
  });
})();
