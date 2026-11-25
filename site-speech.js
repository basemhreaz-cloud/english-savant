/* Small WebView 66 API fallbacks, loaded before this script uses them. */
(function(){if(!Array.prototype.flatMap)Object.defineProperty(Array.prototype,'flatMap',{configurable:true,writable:true,value:function(fn,ctx){return this.reduce(function(out,v,i,a){return out.concat(fn.call(ctx,v,i,a))},[])}});if(!String.prototype.matchAll)Object.defineProperty(String.prototype,'matchAll',{configurable:true,writable:true,value:function(p){var f=p.flags||'';if(f.indexOf('g')<0)f+='g';var r=new RegExp(p.source,f),a=[],m;while((m=r.exec(String(this)))){a.push(m);if(!m[0])r.lastIndex++}return a}});if(typeof Element!=='undefined'&&!Element.prototype.replaceChildren)Object.defineProperty(Element.prototype,'replaceChildren',{configurable:true,writable:true,value:function(){while(this.firstChild)this.removeChild(this.firstChild);for(var i=0;i<arguments.length;i++)this.append(arguments[i])}})})();
(() => {
  "use strict";
  if (window.ESSpeech) return;
  const endpoint = "https://english-savant-ai.basemhreaz.workers.dev/speech", cache = /* @__PURE__ */ new Map();
  let current = null, abort = null, serial = 0;
  const removeMarks = (s) => s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  function status(text, anchor) {
    let e = document.getElementById("es-speech-status");
    if (!e) {
      e = document.createElement("p");
      e.id = "es-speech-status";
      e.setAttribute("role", "status");
      e.style.cssText = "font-size:13px;line-height:1.8;margin:8px 0;color:inherit";
    }
    const host = (anchor == null ? void 0 : anchor.closest(".esx-note,.q-card,.esb-question,.tool,.card,section")) || document.querySelector("main") || document.body;
    if (!e.isConnected || e.parentNode !== host) host.append(e);
    e.textContent = text;
  }
  function stop() {
    var _a;
    serial++;
    abort == null ? void 0 : abort.abort();
    abort = null;
    if (current) {
      current.pause();
      current = null;
    }
    (_a = window.speechSynthesis) == null ? void 0 : _a.cancel();
  }
  function device(text, lang, anchor) {
    if (!window.speechSynthesis) {
      status("صوت Achird غير متاح دلوقتي. الشرح المكتوب موجود.", anchor);
      return false;
    }
    status("صوت Achird غير متاح دلوقتي. ده صوت الجهاز البديل.", anchor);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.95;
    u.onerror = () => status("تعذّر تشغيل الصوت. الشرح المكتوب موجود.", anchor);
    speechSynthesis.speak(u);
    return true;
  }
  async function speak(text, { lang = "ar-EG", question = "", answer = "", anchor = document.activeElement, staticUrl = "" } = {}) {
    text = removeMarks(String(text));
    if (!text) return false;
    stop();
    const mine = serial;
    let url = staticUrl;
    try {
      if (!url) {
        if (text.length > 450) return device(text, lang, anchor);
        const key = JSON.stringify({ text, question, answer });
        url = cache.get(key);
        if (!url) {
          status("بجهّز الشرح بصوت Achird…", anchor);
          abort = new AbortController();
          const controller = abort;
          const timer = setTimeout(() => controller.abort(), 28e3);
          let r;
          try {
            r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, question: String(question).slice(0, 120), answer: String(answer).slice(0, 120) }), signal: abort.signal });
          } finally {
            clearTimeout(timer);
          }
          if (mine !== serial) return false;
          if (!r.ok) throw Error("unavailable");
          const blob = await r.blob();
          if (!blob.type.startsWith("audio/")) throw Error("invalid");
          url = URL.createObjectURL(blob);
          cache.set(key, url);
          if (cache.size > 24) {
            const old = cache.keys().next().value;
            URL.revokeObjectURL(cache.get(old));
            cache.delete(old);
          }
        }
      }
      if (mine !== serial) return false;
      current = new Audio(url);
      await current.play();
      status("الشرح بصوت Achird", anchor);
      return true;
    } catch (e) {
      if (mine !== serial) return false;
      return device(text, lang, anchor);
    } finally {
      if (mine === serial) abort = null;
    }
  }
  window.ESSpeech = { speak, stop };
  window.addEventListener("pagehide", () => {
    stop();
    cache.forEach((url) => URL.revokeObjectURL(url));
    cache.clear();
  });
})();
(() => {
  "use strict";
  const selectors = ".answer-explanation,.final-feedback .final-note,.esb-explanation";
  function scan() {
    document.querySelectorAll(selectors).forEach((e) => {
      if (e.dataset.achirdListen || !e.textContent.trim()) return;
      e.dataset.achirdListen = "true";
      const b = document.createElement("button");
      b.type = "button";
      b.className = "q-check es-achird-listen";
      b.textContent = "اسمع الشرح 🔊";
      b.addEventListener("click", () => {
        const q = e.closest("[data-item-id],[id]");
        ESSpeech.speak(e.textContent, { lang: "ar-EG", question: (q == null ? void 0 : q.dataset.itemId) || (q == null ? void 0 : q.id) || "", answer: e.textContent, anchor: b });
      });
      e.after(b);
    });
  }
  let queued = false;
  new MutationObserver(() => {
    if (!queued) {
      queued = true;
      queueMicrotask(() => {
        queued = false;
        scan();
      });
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan, { once: true });
  else scan();
})();
