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
  const root = document.querySelector("#explanation"), unit = Number(root.dataset.unit || 1);
  let data, lesson, index = 0;
  const saved = /* @__PURE__ */ new Map();
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    e.className = cls || "";
    if (text !== void 0) e.textContent = text;
    return e;
  };
  function bilingual(node, ar, en) {
    if (!en) {
      node.textContent = ar;
      return node;
    }
    node.dataset.p1Ar = ar;
    node.dataset.p1En = en;
    node.setAttribute("data-no-interface-translation", "");
    node.textContent = document.documentElement.dataset.interfaceLanguage === "en" ? en : ar;
    node.dir = document.documentElement.dataset.interfaceLanguage === "en" ? "ltr" : "rtl";
    return node;
  }
  document.addEventListener("es:interface-language", () => {
    const frame = root.querySelector("iframe");
    if (frame && frame.contentWindow.ESInterface) frame.contentWindow.ESInterface.setLanguage(document.documentElement.dataset.interfaceLanguage);
    root.querySelectorAll("[data-p1-ar]").forEach((node) => {
      var en = document.documentElement.dataset.interfaceLanguage === "en";
      node.textContent = en ? node.dataset.p1En : node.dataset.p1Ar;
      node.dir = en ? "ltr" : "rtl";
    });
  });
  function menu() {
    root.replaceChildren();
    for (const l of data.lessons) {
      const b = el("button", "lesson-choice", "\u0627\u0644\u062F\u0631\u0633 " + l.lesson + " \xB7 " + l.lesson_title);
      b.onclick = () => {
        lesson = l;
        index = saved.get(l.lesson) || 0;
        render();
      };
      root.append(b);
    }
  }
  function render() {
    const s = lesson.steps[index];
    saved.set(lesson.lesson, index);
    root.replaceChildren();
    const home = el("button", "q-check", "\u0627\u062E\u062A\u0627\u0631 \u062F\u0631\u0633 \u062A\u0627\u0646\u064A");
    home.onclick = menu;
    root.append(home, el("h2", "", lesson.lesson_title), bilingual(el("p", "ex-goal"), lesson.goal_ar, lesson.goal_en), bilingual(el("p", "lesson-position"), "\u062E\u0637\u0648\u0629 " + (index + 1) + " \u0645\u0646 " + lesson.steps.length, "Step " + (index + 1) + " of " + lesson.steps.length));
    const card = el("article", "q-card explanation-card");
    card.dataset.step = s.id;
    card.append(bilingual(el("h3"), s.title_ar, s.title_en), bilingual(el("p", "ex-body"), s.body_ar, s.body_en));
    if (s.en) {
      const text = el("div", "ex-english");
      text.dir = "ltr";
      s.en.forEach((t) => text.append(el("p", "", t)));
      card.append(text);
    }
    if (s.image) {
      const img = el("img", "assessment-image");
      img.src = s.image;
      img.alt = s.title_ar;
      card.append(img);
    }
    if (s.source_page) card.append(bilingual(el("small", "ex-source"), "\u0645\u0631\u062C\u0639 \u0627\u0644\u0643\u062A\u0627\u0628: \u0635\u0641\u062D\u0629 " + s.source_page, "Book reference: page " + s.source_page));
    if (s.check_ref) {
      const b = el("button", "q-check ex-try", "\u062C\u0631\u0651\u0628 \u0627\u0644\u062A\u062F\u0631\u064A\u0628");
      b.onclick = () => {
        b.disabled = true;
        const frame = el("iframe", "ex-check");
        frame.title = "\u062A\u062F\u0631\u064A\u0628 " + s.title_ar;
        frame.onload = () => {
          if (frame.contentWindow.ESInterface) frame.contentWindow.ESInterface.setLanguage(document.documentElement.dataset.interfaceLanguage);
        };
        frame.src = "p1-explanation-check.html?v=20261125-en222&unit=" + unit + "&id=" + encodeURIComponent(s.check_ref) + (document.body.classList.contains("dark") ? "&dark=1" : "");
        card.append(frame);
      };
      card.append(b);
    }
    root.append(card);
    const nav = el("div", "lesson-nav"), prev = el("button", "q-check", "\u0627\u0644\u0633\u0627\u0628\u0642"), next = el("button", "q-check", index === lesson.steps.length - 1 ? "\u0631\u062C\u0648\u0639 \u0644\u0644\u062F\u0631\u0648\u0633" : "\u0627\u0644\u062A\u0627\u0644\u064A");
    prev.disabled = index === 0;
    prev.onclick = () => {
      index--;
      render();
    };
    next.onclick = () => {
      if (index === lesson.steps.length - 1) menu();
      else {
        index++;
        render();
      }
    };
    nav.append(prev, next);
    root.append(nav);
    window.__P1Explanation = { lesson: lesson.lesson, index, step: s };
    root.scrollIntoView({ block: "start", behavior: "instant" });
  }
  new MutationObserver(() => {
    var _a;
    const d = (_a = root.querySelector("iframe")) == null ? void 0 : _a.contentDocument;
    if (d) d.body.classList.toggle("dark", document.body.classList.contains("dark"));
  }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("message", (e) => {
    var _a;
    if (e.origin !== location.origin || ((_a = e.data) == null ? void 0 : _a.type) !== "p1checkheight") return;
    const f = root.querySelector("iframe");
    if (f && e.source === f.contentWindow) f.style.height = Math.max(300, Math.min(2400, Number(e.data.height) || 300)) + "px";
  });
  fetch("p1-explanations-u" + unit + ".json?v=20261125-en222", { cache: "no-store" }).then((r) => {
    if (!r.ok) throw Error("Explanation unavailable");
    return r.json();
  }).then((j) => {
    var _a;
    if (((_a = j.lessons) == null ? void 0 : _a.length) !== 4) throw Error("Lesson schema");
    const ids = /* @__PURE__ */ new Set();
    for (const l of j.lessons) for (const s of l.steps) {
      if (!s.id || ids.has(s.id) || !s.title_ar || !s.body_ar) throw Error("Step schema");
      ids.add(s.id);
      if (s.image && !/^p1-lessons-assets\/img\/[a-z0-9-]+\.png$/.test(s.image)) throw Error("Image schema");
    }
    data = j;
    menu();
  }).catch((e) => {
    root.textContent = "\u0627\u0644\u0634\u0631\u062D \u062F\u0647 \u0644\u0633\u0647 \u0641\u064A \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629\u060C \u062C\u0631\u0651\u0628 \u062A\u0627\u0646\u064A \u0628\u0639\u062F \u0634\u0648\u064A\u0629.";
    console.error(e);
  });
})();
