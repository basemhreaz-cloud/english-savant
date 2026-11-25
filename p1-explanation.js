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
  const root = document.querySelector("#explanation"), unit = Number(root.dataset.unit || 1);
  let data, lesson, index = 0;
  const saved = /* @__PURE__ */ new Map();
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    e.className = cls || "";
    if (text !== void 0) e.textContent = text;
    return e;
  };
  function menu() {
    root.replaceChildren();
    for (const l of data.lessons) {
      const b = el("button", "lesson-choice", "الدرس " + l.lesson + " · " + l.lesson_title);
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
    const home = el("button", "q-check", "اختار درس تاني");
    home.onclick = menu;
    root.append(home, el("h2", "", lesson.lesson_title), el("p", "ex-goal", lesson.goal_ar), el("p", "lesson-position", "خطوة " + (index + 1) + " من " + lesson.steps.length));
    const card = el("article", "q-card explanation-card");
    card.dataset.step = s.id;
    card.append(el("h3", "", s.title_ar), el("p", "ex-body", s.body_ar));
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
    if (s.source_page) card.append(el("small", "ex-source", "مرجع الكتاب: صفحة " + s.source_page));
    if (s.check_ref) {
      const b = el("button", "q-check ex-try", "جرّب التدريب");
      b.onclick = () => {
        b.disabled = true;
        const frame = el("iframe", "ex-check");
        frame.title = "تدريب " + s.title_ar;
        frame.src = "p1-explanation-check.html?v=20261122-2&unit=" + unit + "&id=" + encodeURIComponent(s.check_ref) + (document.body.classList.contains("dark") ? "&dark=1" : "");
        card.append(frame);
      };
      card.append(b);
    }
    root.append(card);
    const nav = el("div", "lesson-nav"), prev = el("button", "q-check", "السابق"), next = el("button", "q-check", index === lesson.steps.length - 1 ? "رجوع للدروس" : "التالي");
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
  fetch("p1-explanations-u" + unit + ".json", { cache: "no-store" }).then((r) => {
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
    root.textContent = "الشرح ده لسه في المراجعة، جرّب تاني بعد شوية.";
    console.error(e);
  });
})();
