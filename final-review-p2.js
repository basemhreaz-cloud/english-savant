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
  function esContr(s) {
    return String(s).replace(/[\u2018\u2019]/g, "'").replace(/\b(it|that|what|he|she|there|here|who|where|how)'s\b/gi, "$1 is").replace(/\bi'm\b/gi, "i am").replace(/\b(you|we|they)'re\b/gi, "$1 are").replace(/\b(i|you|we|they)'ve\b/gi, "$1 have").replace(/\b(i|you|he|she|it|we|they)'ll\b/gi, "$1 will").replace(/\blet's\b/gi, "let us").replace(/\b(is|are|was|were|do|does|did|have|has|had|would|should|could|must)n't\b/gi, "$1 not").replace(/\b(can't|cannot)\b/gi, "can not").replace(/\bwon't\b/gi, "will not");
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
          if (i < parts.length - 1) n.append(document.createTextNode(" \xB7 "));
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
      status.textContent = "\u062A\u0639\u0630\u0651\u0631 \u0627\u0644\u062D\u0641\u0638 \u0639\u0644\u0649 \u0647\u0630\u0627 \u0627\u0644\u062C\u0647\u0627\u0632.";
    }
  }
  const status = e("p", "\u0625\u062C\u0627\u0628\u0627\u062A\u0643 \u0645\u062D\u0641\u0648\u0638\u0629 \u0639\u0644\u0649 \u0647\u0630\u0627 \u0627\u0644\u062C\u0647\u0627\u0632 \u0641\u0642\u0637. \u0627\u0636\u063A\u0637 \u062A\u062D\u0642\u0642 \u0644\u0644\u0623\u0633\u0626\u0644\u0629 \u0630\u0627\u062A \u0627\u0644\u0625\u062C\u0627\u0628\u0627\u062A \u0627\u0644\u0645\u0648\u062B\u0642\u0629. \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0623\u062E\u0631\u0649 \u062A\u062D\u062A\u0627\u062C \u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0645\u062F\u0631\u0633. / Responses stay on this device. Verify is available for source-checked answers; other questions need teacher review.", "final-note");
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
    wrap.append(e("legend", "\u0627\u062E\u062A\u0627\u0631 \u0625\u062C\u0627\u0628\u062A\u0643 / Choose your response"));
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
    if (words.length < 2) return field(id, "\u0625\u062C\u0627\u0628\u062A\u0643 / Your response");
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
    const clear = e("button", "\u0627\u0645\u0633\u062D / Clear");
    clear.type = "button";
    clear.addEventListener("click", () => {
      ans.textContent = "";
      save(id, "");
    });
    wrap.append(row, ans, clear, field(id + ":typed", "\u0623\u0648 \u0627\u0643\u062A\u0628 \u0627\u0644\u062A\u0631\u062A\u064A\u0628 \u0628\u0646\u0641\u0633\u0643 / Or type your order"));
    return wrap;
  }
  function addVerification(c, q, s) {
    const r = addVerification0(c, q, s);
    if (q.explanation_ar && r && !r.querySelector(".final-explanation")) {
      const explanation = e("details", void 0, "final-explanation");
      const summary = e("summary", "افهم الإجابة");
      const text = e("p", q.explanation_ar, "final-explanation-text");
      text.dir = "auto";
      if (window.ESInterface) window.ESInterface.bindExplanation(text, q);
      explanation.append(summary, text);
      explanation.style.cssText = "border:1px solid var(--line, #b0aa98);border-radius:18px;padding:12px 14px;margin-top:12px;line-height:1.9";
      summary.style.cursor = "pointer";
      r.append(explanation);
    }
    return r;
  }
  function addVerification0(c, q, s) {
    var _a, _b;
    if (!q.answerability_hold && !q.listening_excluded && s.type !== "punctuate" && c.querySelector("textarea,input:not([type=radio]):not([type=checkbox])")) (_b = window.ESWrittenAI) == null ? void 0 : _b.attach(c, { ...(s.type === "piclines" && !/unscramble|reorder|rearrange|punctuate|correct|rewrite|complete|circle|count/i.test(s.instruction || "") && !/\(|_{2}|\.{4}|…|[–—-]/.test(String(q.text || "")) ? { onCount: () => { if (typeof active === "undefined" || !active) return false; feed.dataset.state = "correct"; uiText(feed, "اتحسبت صحيحة بعد مراجعة الذكاء الاصطناعي. / Counted correct after AI review."); return true; }, onUncount: () => { feed.textContent = ""; delete feed.dataset.state; } } : {}), question: q.text || q.title || s.instruction, passage: q.passage, alternatives: ((_a = answerKeys[q.item_id]) == null ? void 0 : _a.accepted_answers) || [], answer: () => Array.from(c.querySelectorAll("textarea,input:not([type=radio]):not([type=checkbox])")).map((x) => x.value).join(" ") });
    if (q.answerability_hold || q.listening_excluded) return c;
    const k = answerKeys[q.item_id], active = k && ["verified", "partial"].includes(k.status), actions = e("div", void 0, "final-verify-actions"), b = e("button", active ? "\u062A\u062D\u0642\u0642 / Verify" : "\u0631\u0627\u062C\u0639 \u0645\u0639 \u0627\u0644\u0645\u062F\u0631\u0633 / Teacher review", "q-check final-verify"), feed = e("p", void 0, "final-feedback");
    b.type = "button";
    b.setAttribute("data-interface-protected", "true");
    feed.setAttribute("role", "status");
    feed.setAttribute("aria-live", "polite");
    feed.setAttribute("data-interface-protected", "true");
    b.onclick = () => {
      var _a2;
      if (!active) {
        feed.dataset.state = "review";
        uiText(feed, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0625\u062C\u0627\u0628\u0629 \u0645\u0648\u062B\u0642\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u0633\u0624\u0627\u0644 \u0628\u0639\u062F. \u0625\u062C\u0627\u0628\u062A\u0643 \u0645\u062D\u0641\u0648\u0638\u0629\u060C \u0631\u0627\u062C\u0639\u0647\u0627 \u0645\u0639 \u0627\u0644\u0645\u062F\u0631\u0633. / No verified answer key yet. Your response is saved for teacher review.");
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
          let t = (punctuation ? String(x) : esContr(esAnswerText(x))).normalize("NFKC").replace(/[’‘]/g, "'").trim().replace(/\s+/g, " ").replace(/\s+([.!?,;:])/g, "$1");
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
        uiText(feed, "\u0627\u0643\u062A\u0628 \u0625\u062C\u0627\u0628\u062A\u0643 \u0627\u0644\u0623\u0648\u0644. / Enter your response first.");
        return;
      }
      const known = checks.filter((x) => !x.hold), ok = known.every((x) => x.ok), partial = checks.some((x) => x.hold);
      feed.dataset.state = ok ? "correct" : "retry";
      if (known.length) (_a2 = window.ESFeedback) == null ? void 0 : _a2.call(window, ok, c);
      if (ok) uiText(feed, partial ? "\u0627\u0644\u0625\u062C\u0627\u0628\u0627\u062A \u0627\u0644\u0645\u0648\u062B\u0642\u0629 \u0635\u062D\u064A\u062D\u0629. \u0628\u0627\u0642\u064A \u0627\u0644\u0641\u0631\u0627\u063A\u0627\u062A \u062A\u062D\u062A\u0627\u062C \u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0645\u062F\u0631\u0633. / Verified blanks are correct. The remaining blanks need teacher review." : "\u0625\u062C\u0627\u0628\u0629 \u0635\u062D\u064A\u062D\u0629. / Correct.");
      else uiText(feed, "\u0631\u0627\u062C\u0639 \u0625\u062C\u0627\u0628\u062A\u0643 \u0648\u062D\u0627\u0648\u0644 \u062A\u0627\u0646\u064A. / Check your response and try again.");
      if (known.some((x) => x.formIssue)) uiText(feed, "\u0627\u0644\u0645\u0639\u0646\u0649 \u0635\u062D\u064A\u062D. \u0631\u0627\u062C\u0639 \u0627\u0644\u062D\u0631\u0648\u0641 \u0627\u0644\u0643\u0628\u064A\u0631\u0629 \u0648\u0627\u0644\u062A\u0631\u0642\u064A\u0645 \u0645\u0639 \u0627\u0644\u0646\u0645\u0648\u0630\u062C. / Content correct. Check capitalization and punctuation against the model.");
      if (!ok || known.some((x) => x.formIssue)) {
        const model = known.map((x, i) => (k.blanks ? String(i + 1) + ": " : "") + x.answers.join(" / ")).join(" \xB7 ");
        feed.append(e("span", " \u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0627\u0644\u0645\u0648\u062B\u0642\u0629 / Verified answer: " + model, "final-verified-model"));
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
      c.append(e("p", "\u0627\u0644\u0633\u0624\u0627\u0644 \u0645\u062A\u0648\u0642\u0641 \u0645\u0624\u0642\u062A\u064B\u0627", "final-hold-title"), e("p", q.answerability_hold, "final-note"));
      return addVerification(c, q, s);
    }
    if (q.illustration_note) c.append(e("p", q.illustration_note, "final-note"));
    if (q.response_lines) {
      c.append(e("p", q.text, "final-prompt"));
      q.response_lines.forEach((t, i) => c.append(e("p", t), field(q.item_id + ":" + i, "\u0625\u062C\u0627\u0628\u062A\u0643 / Your response")));
      return addVerification(c, q, s);
    }
    if (q.image) c.append(pic(q.image));
    if (q.pronunciation_audio) {
      c.append(e("p", q.text, "final-prompt"));
      c.append(e("p", "\u0635\u0648\u0631\u0629 \u0648\u0635\u0648\u062A \u0646\u0637\u0642 \u0644\u0644\u062A\u062F\u0631\u064A\u0628\u060C \u0648\u0644\u064A\u0633\u0627 \u0635\u0648\u0631\u0629 \u0623\u0648 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0643\u062A\u0627\u0628 \u0627\u0644\u0623\u0635\u0644\u064A. \u0627\u0646\u0638\u0631 \u0648\u0627\u0633\u0645\u0639 \u062B\u0645 \u0627\u0643\u062A\u0628 \u0627\u0644\u062D\u0631\u0641 \u0627\u0644\u0646\u0627\u0642\u0635.", "final-audio-note"));
      const a = e("audio");
      a.controls = true;
      a.preload = "none";
      a.src = q.pronunciation_audio + "?v=20261123-40";
      a.setAttribute("aria-label", "\u062A\u0634\u063A\u064A\u0644 \u0646\u0637\u0642 \u0627\u0644\u0643\u0644\u0645\u0629 / Play word pronunciation");
      c.append(a, field(q.item_id, "\u0627\u0644\u062D\u0631\u0641 \u0627\u0644\u0646\u0627\u0642\u0635 / Missing letter"));
      return addVerification(c, q, s);
    }
    if (q.listening_excluded) {
      c.append(e("p", q.text), e("p", "\u0647\u0630\u0627 \u0627\u0644\u0633\u0624\u0627\u0644 \u064A\u0639\u062A\u0645\u062F \u0639\u0644\u0649 \u0627\u0644\u0627\u0633\u062A\u0645\u0627\u0639. \u0627\u0644\u0635\u0648\u062A \u063A\u064A\u0631 \u0645\u0631\u0641\u0642 \u0647\u0646\u0627\u060C \u0644\u0630\u0644\u0643 \u0644\u0646 \u064A\u064F\u0637\u0644\u0628 \u0645\u0646\u0643 \u062A\u062E\u0645\u064A\u0646 \u0625\u062C\u0627\u0628\u0629 \u0645\u0643\u062A\u0648\u0628\u0629.", "final-listening"));
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
      c.append(e("p", q.wordbank.join(" \xB7 "), "final-wordbank"));
      q.lines.forEach((t, i) => {
        c.append(e("p", t), field(q.item_id + ":" + i, "\u0625\u062C\u0627\u0628\u062A\u0643 / Your response"));
      });
      return addVerification(c, q, s);
    }
    if ((_a = answerKeys[q.item_id]) == null ? void 0 : _a.blanks) {
      c.append(e("p", q.text, "final-prompt"));
      answerKeys[q.item_id].blanks.forEach((_, i) => c.append(field(q.item_id + ":" + i, "\u0627\u0644\u0641\u0631\u0627\u063A " + (i + 1) + " / Blank " + (i + 1))));
      if (saved[q.item_id]) c.append(e("p", "\u0625\u062C\u0627\u0628\u062A\u0643 \u0627\u0644\u0633\u0627\u0628\u0642\u0629 \u0645\u062D\u0641\u0648\u0638\u0629 / Previous saved response: " + saved[q.item_id], "final-note"));
      return addVerification(c, q, s);
    }
    let text = (_d = (_c = (_b = q.scrambled) != null ? _b : q.text) != null ? _c : q.title) != null ? _d : "";
    c.append(e("p", text, "final-prompt"));
    if ((_e = q.keywords) == null ? void 0 : _e.length) c.append(e("p", q.keywords.join(" \xB7 "), "final-wordbank"));
    if (s.type === "reorder" && s.instruction.startsWith("Reorder")) c.append(tokens(q.item_id, text));
    else if (s.instruction.includes("True or")) c.append(choices(q.item_id, ["True", "False"]));
    else if (s.instruction.includes("circle") || s.instruction === "Choose the correct answer:") {
      const m = text.match(/\(([^()]+)\)/), opts = m == null ? void 0 : m[1].split(/\s*[–—]\s*|\s+-\s+|\s*\/\s*/).filter(Boolean);
      c.append((opts == null ? void 0 : opts.length) > 1 ? choices(q.item_id, opts) : field(q.item_id, "\u0625\u062C\u0627\u0628\u062A\u0643 / Your response"));
    } else c.append(field(q.item_id, "\u0625\u062C\u0627\u0628\u062A\u0643 / Your response", s.type === "paragraphs" || s.instruction.includes("sentence")));
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
    label.append(e("p", "\u0627\u062E\u062A\u0627\u0631 \u0642\u0633\u0645 \u0627\u0644\u0645\u0630\u0643\u0631\u0629 / Choose a booklet section"), toggle, list);
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
      const b = e("button", void 0, "final-section-option"), n = e("span", String(i + 1), "section-index"), text = e("span", title(s), "section-name"), count = e("span", String(s.items.filter(canVerify).length) + "/" + s.items.length, "section-count");
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
    ["\u0627\u0644\u0633\u0627\u0628\u0642 / Previous", "\u0627\u0644\u062A\u0627\u0644\u064A / Next"].forEach((t, i) => {
      const b = e("button", t);
      b.type = "button";
      b.addEventListener("click", () => {
        current = Math.max(0, Math.min(d.sections.length - 1, current + (i ? 1 : -1)));
        show();
        toggle.scrollIntoView({ block: "center", behavior: "instant" });
      });
      nav.append(b);
    });
    function canVerify(q) {
      var k = answerKeys[q.item_id];
      return !q.answerability_hold && !q.listening_excluded && k && ["verified", "partial"].includes(k.status);
    }
    function updateProgress() {
      var s = d.sections[current], n = s.items.filter(canVerify).length;
      document.querySelector("#final-section-progress").textContent = document.documentElement.dataset.interfaceLanguage === "en" ? "Section " + (current + 1) + " of " + d.sections.length + " \xB7 " + s.items.length + " items \xB7 " + n + " checks available \xB7 " + (s.items.length - n) + " teacher review" : "\u0627\u0644\u0642\u0633\u0645 " + (current + 1) + " \u0645\u0646 " + d.sections.length + " \xB7 " + s.items.length + " \u0633\u062C\u0644\u064B\u0627 \xB7 " + n + " \u0645\u062A\u0627\u062D \u0644\u0644\u062A\u062D\u0642\u0642 \xB7 " + (s.items.length - n) + " \u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0645\u062F\u0631\u0633";
    }
    document.addEventListener("es:interface-language", updateProgress);
    function show() {
      const s = d.sections[current];
      meter.setAttribute("aria-valuenow", String(current + 1));
      meter.setAttribute("aria-valuetext", "\u0627\u0644\u0642\u0633\u0645 " + (current + 1) + " \u0645\u0646 " + d.sections.length);
      fill.style.width = (current + 1) / d.sections.length * 100 + "%";
      toggle.replaceChildren(e("span", String(current + 1), "section-index"), e("b", title(s), "section-name"), e("span", String(s.items.filter(canVerify).length) + "/" + s.items.length, "section-count"), e("span", "\u2304"));
      toggle.querySelector("b").dir = "ltr";
      list.querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-current", String(i === current)));
      host.dataset.section = current;
      content.replaceChildren(e("h2", s.instruction));
      s.items.forEach((q, i) => content.append(renderItem(q, s, i)));
      updateProgress();
    }
    const progress = e("p");
    progress.id = "final-section-progress";
    const meter = e("div", void 0, "quiz-progress"), fill = e("span");
    meter.append(fill);
    meter.setAttribute("role", "progressbar");
    meter.setAttribute("aria-label", "\u0645\u0648\u0636\u0639 \u0642\u0633\u0645 \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629");
    meter.setAttribute("aria-valuemin", "1");
    meter.setAttribute("aria-valuemax", String(d.sections.length));
    const reset = e("button", "\u0627\u0645\u0633\u062D \u0625\u062C\u0627\u0628\u0627\u062A\u064A \u0627\u0644\u0645\u062D\u0641\u0648\u0638\u0629");
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
  start().catch(() => host.replaceChildren(e("p", "\u062A\u0639\u0630\u0651\u0631 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0623\u0633\u0626\u0644\u0629. \u062D\u062F\u0651\u062B \u0627\u0644\u0635\u0641\u062D\u0629 \u0644\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649.")));
})();
