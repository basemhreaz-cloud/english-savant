/* Small WebView 66 API fallbacks, loaded before this script uses them. */
(function(){if(!Array.prototype.flatMap)Object.defineProperty(Array.prototype,'flatMap',{configurable:true,writable:true,value:function(fn,ctx){return this.reduce(function(out,v,i,a){return out.concat(fn.call(ctx,v,i,a))},[])}});if(!String.prototype.matchAll)Object.defineProperty(String.prototype,'matchAll',{configurable:true,writable:true,value:function(p){var f=p.flags||'';if(f.indexOf('g')<0)f+='g';var r=new RegExp(p.source,f),a=[],m;while((m=r.exec(String(this)))){a.push(m);if(!m[0])r.lastIndex++}return a}});if(typeof Element!=='undefined'&&!Element.prototype.replaceChildren)Object.defineProperty(Element.prototype,'replaceChildren',{configurable:true,writable:true,value:function(){while(this.firstChild)this.removeChild(this.firstChild);for(var i=0;i<arguments.length;i++)this.append(arguments[i])}})})();
(() => {
  "use strict";
  const endpoint = "https://english-savant-ai.basemhreaz.workers.dev/grade";
  function el(tag, text, cls) {
    const e = document.createElement(tag);
    if (text) e.textContent = text;
    if (cls) e.className = cls;
    return e;
  }
  function attach(card, context) {
    if (!card || card.querySelector(".es-ai-review") || !context.question) return;
    const box = el("details", null, "es-ai-review");
    box.style.cssText = "margin:12px 0;padding:12px;border:1px solid currentColor;border-radius:18px;line-height:1.7";
    box.append(el("summary", "راجع المعنى بالذكاء الاصطناعي (أونلاين)"));
    box.append(el("p", "اختياري: يُرسل السؤال والنص وإجابتك إلى Cloudflare Workers AI للمراجعة. لا تكتب اسمك أو رقمك أو أي بيانات شخصية. التصحيح اقتراح وقد يخطئ، ولا يغيّر درجتك تلقائيًا. بدون الموافقة تظل الإجابة على جهازك."));
    const label = el("label"), consent = el("input");
    consent.type = "checkbox";
    consent.style.cssText = "appearance:auto;width:20px;min-width:20px;height:20px;min-height:20px;margin:6px;accent-color:#5A6657;vertical-align:middle";
    label.append(consent, document.createTextNode(" أوافق على إرسال نص الإجابة للمراجعة الخارجية"));
    box.append(label);
    const button = el("button", "راجع المعنى", "q-check"), status = el("p");
    button.type = "button";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    box.append(el("br"), button, status);
    button.onclick = async () => {
      var _a;
      if (!consent.checked) {
        status.textContent = "لم تُرسل أي إجابة. وافق أولًا لو عايز المراجعة الأونلاين.";
        return;
      }
      let answer = String(context.answer() || "").trim();
      if (!answer) {
        status.textContent = "اكتب إجابتك أولًا.";
        return;
      }
      if (answer.length > 400) {
        status.textContent = "المراجعة دي تقبل حتى 400 حرف. الإجابة الطويلة تحتاج مراجعة المدرس.";
        return;
      }
      if (!navigator.onLine) {
        status.textContent = "أنت غير متصل. الإجابة محفوظة محليًا ومحتاجة مراجعة، مش محسوبة غلط.";
        return;
      }
      button.disabled = true;
      status.textContent = "جارٍ مراجعة المعنى…";
      const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 3e4);
      try {
        const r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, signal: ctrl.signal, body: JSON.stringify({ question: String(context.question).slice(0, 500), passage: String(context.passage || "").slice(0, 1500), alternatives: (context.alternatives || []).filter((x) => typeof x === "string" && x.trim()).slice(0, 8).map((x) => x.slice(0, 250)), answer }) });
        const d = await r.json();
        status.replaceChildren();
        if (!r.ok || !["correct", "partial", "incorrect"].includes(d.verdict)) {
          status.textContent = d.error === "personal" ? "احذف البيانات الشخصية وجرّب بنص دراسي فقط." : "الإجابة محتاجة مراجعة. الخدمة غير متاحة أو النماذج غير متفقة، ولم تُحسب غلط.";
          return;
        }
        const labels = { correct: "المعنى صحيح حسب مراجعة الذكاء الاصطناعي.", partial: "الإجابة صحيحة جزئيًا وتحتاج استكمال.", incorrect: "راجع المعنى. النموذجان لم يقبلا الإجابة." };
        status.append(el("strong", labels[d.verdict]), el("p", d.rationale || ""));
        if ((_a = d.possibleAnswers) == null ? void 0 : _a.length) {
          status.append(el("p", "إجابات محتملة من الذكاء الاصطناعي، راجعها مع المدرس:"));
          const ul = el("ul");
          for (const a of d.possibleAnswers) {
            const li = el("li", a);
            li.dir = "auto";
            ul.append(li);
          }
          status.append(ul);
        }
        status.append(el("p", "اقتراح وليس حكمًا نهائيًا. لو إجابتك مختلفة وصحيحة، راجع مدرسك."));
      } catch {
        status.textContent = "تعذرت المراجعة الأونلاين. لم تُحسب الإجابة خطأ، جرّب لاحقًا أو راجع مدرسك.";
      } finally {
        clearTimeout(timer);
        button.disabled = false;
      }
    };
    card.append(box);
  }
  window.ESWrittenAI = { attach };
})();
