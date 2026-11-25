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
  if (!document.querySelector('[data-es-bank^="es-bank-p2-"]')) return;
  const style = document.createElement("style");
  style.textContent = `.esb-strip:has(.p2-picker-list:not([hidden])){position:relative;z-index:60}.esb-strip:has(.p2-picker-list:not([hidden])) .esb-filter{position:relative;z-index:60}.p2-picker{position:relative;min-width:220px;max-width:100%;margin-top:7px}.p2-picker button{font:inherit;color:inherit;border:1px solid #929d89;border-radius:9px;min-height:44px;padding:8px 12px;background:rgba(111,130,97,.12);cursor:pointer;text-align:start}.p2-picker-toggle{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px}.p2-picker-list{position:absolute;inset:100% 0 auto;z-index:30;background:#f6f4ef;border:1px solid #929d89;border-radius:10px;padding:5px;max-height:320px;overflow:auto;box-shadow:0 8px 24px #0002}.dark .p2-picker-list{background:#242b22}.p2-picker-list[hidden]{display:none}.p2-picker-list button{display:block;width:100%;border:0;background:transparent;margin:2px 0}.p2-picker-list button[aria-current=true]{background:rgba(111,130,97,.18);font-weight:600}.p2-picker button:focus-visible{outline:3px solid #9eac8a;outline-offset:2px}`;
  document.head.append(style);
  function init(sel) {
    if (sel.dataset.p2Custom) return;
    sel.dataset.p2Custom = "true";
    sel.hidden = true;
    sel.style.display = "none";
    sel.tabIndex = -1;
    const wrap = document.createElement("div"), toggle = document.createElement("button"), list = document.createElement("div");
    wrap.className = "p2-picker";
    toggle.className = "p2-picker-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", sel.getAttribute("aria-label") || "نوع السؤال");
    list.className = "p2-picker-list";
    list.id = "p2-type-options";
    list.hidden = true;
    toggle.setAttribute("aria-controls", list.id);
    function close() {
      list.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }
    function update() {
      var _a;
      toggle.replaceChildren(document.createTextNode(((_a = sel.options[sel.selectedIndex]) == null ? void 0 : _a.textContent) || "اختار"), Object.assign(document.createElement("span"), { textContent: "⌄" }));
      [...list.children].forEach((b, i) => b.setAttribute("aria-current", String(i === sel.selectedIndex)));
    }
    [...sel.options].forEach((o, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = o.textContent;
      b.onclick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        sel.value = o.value;
        sel.dispatchEvent(new Event("change", { bubbles: true }));
        update();
        close();
        toggle.focus();
      };
      list.append(b);
    });
    toggle.onclick = (ev) => {
      var _a;
      ev.preventDefault();
      list.hidden = !list.hidden;
      toggle.setAttribute("aria-expanded", String(!list.hidden));
      if (!list.hidden) (_a = list.children[sel.selectedIndex]) == null ? void 0 : _a.focus();
    };
    wrap.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        close();
        toggle.focus();
      }
      if (["ArrowDown", "ArrowUp", "Home", "End"].includes(ev.key) && !list.hidden) {
        ev.preventDefault();
        const bs = [...list.children], n = bs.indexOf(document.activeElement);
        bs[ev.key === "Home" ? 0 : ev.key === "End" ? bs.length - 1 : (n + (ev.key === "ArrowDown" ? 1 : -1) + bs.length) % bs.length].focus();
      }
    });
    document.addEventListener("click", (ev) => {
      if (!wrap.contains(ev.target)) close();
    });
    sel.addEventListener("change", update);
    wrap.append(toggle, list);
    sel.after(wrap);
    let old = sel.value;
    setInterval(() => {
      if (sel.value !== old) {
        old = sel.value;
        update();
      }
    }, 400);
    update();
  }
  const scan = () => document.querySelectorAll("select.esb-select").forEach(init);
  scan();
  new MutationObserver(scan).observe(document.querySelector("[data-es-bank]"), { childList: true, subtree: true });
})();
