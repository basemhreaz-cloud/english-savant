/* Small WebView 66 API fallbacks, loaded before this script uses them. */
(function(){if(!Array.prototype.flatMap)Object.defineProperty(Array.prototype,'flatMap',{configurable:true,writable:true,value:function(fn,ctx){return this.reduce(function(out,v,i,a){return out.concat(fn.call(ctx,v,i,a))},[])}});if(!String.prototype.matchAll)Object.defineProperty(String.prototype,'matchAll',{configurable:true,writable:true,value:function(p){var f=p.flags||'';if(f.indexOf('g')<0)f+='g';var r=new RegExp(p.source,f),a=[],m;while((m=r.exec(String(this)))){a.push(m);if(!m[0])r.lastIndex++}return a}});if(typeof Element!=='undefined'&&!Element.prototype.replaceChildren)Object.defineProperty(Element.prototype,'replaceChildren',{configurable:true,writable:true,value:function(){while(this.firstChild)this.removeChild(this.firstChild);for(var i=0;i<arguments.length;i++)this.append(arguments[i])}})})();
(function() {
  if (window.__esFx) return;
  window.__esFx = 1;
  var css = ".esfx-wash{position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:3;opacity:0}.esfx-wash.ok{background:radial-gradient(circle at 50% 50%,rgba(52,211,99,.38),rgba(34,197,94,.14) 70%)}.esfx-wash.no{background:radial-gradient(circle at 50% 50%,rgba(248,81,73,.36),rgba(239,68,68,.13) 70%)}.esfx-wash.go{animation:esfxWash .9s ease-out forwards}@keyframes esfxWash{0%{opacity:0}20%{opacity:1}100%{opacity:0}}.esfx-big{position:fixed;z-index:99999;pointer-events:none;font-size:68px;line-height:1;filter:drop-shadow(0 6px 14px rgba(0,0,0,.3));opacity:0;transform:translate(-50%,-50%) scale(.2)}.esfx-big.go.ok{animation:esfxPop 1s cubic-bezier(.2,1.4,.4,1) forwards}.esfx-big.go.no{animation:esfxShakeBig .9s ease-out forwards}@keyframes esfxPop{0%{opacity:0;transform:translate(-50%,-50%) scale(.2) rotate(-25deg)}35%{opacity:1;transform:translate(-50%,-50%) scale(1.25) rotate(8deg)}60%{transform:translate(-50%,-50%) scale(.95) rotate(-3deg)}80%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}100%{opacity:0;transform:translate(-50%,-70%) scale(1)}}@keyframes esfxShakeBig{0%{opacity:0;transform:translate(-50%,-50%) scale(.3)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}30%{transform:translate(-62%,-50%) scale(1.05)}45%{transform:translate(-38%,-50%) scale(1.05)}60%{transform:translate(-57%,-50%) scale(1)}75%{opacity:1;transform:translate(-45%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(.9)}}.esfx-bit{position:fixed;z-index:99999;pointer-events:none;font-size:20px;line-height:1}.esfx-card-ok{animation:esfxCardOk .6s ease-out}.esfx-card-no{animation:esfxCardNo .55s ease-out}@keyframes esfxCardOk{0%{transform:scale(1)}30%{transform:scale(1.025);box-shadow:0 0 0 4px rgba(34,197,94,.55),0 0 26px rgba(34,197,94,.55)}100%{transform:scale(1)}}@keyframes esfxCardNo{0%,100%{transform:translateX(0)}15%{transform:translateX(-9px)}35%{transform:translateX(8px)}55%{transform:translateX(-6px)}75%{transform:translateX(4px);box-shadow:0 0 0 4px rgba(239,68,68,.55),0 0 24px rgba(239,68,68,.5)}}@media (prefers-reduced-motion:reduce){.esfx-big.go.ok,.esfx-big.go.no{animation:esfxFade 1s ease-out forwards}.esfx-bit{display:none}.esfx-card-ok,.esfx-card-no{animation:none}}@keyframes esfxFade{0%{opacity:0;transform:translate(-50%,-50%) scale(1)}25%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(1)}}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);
  var base = (function() {
    var s = document.currentScript;
    return s && s.src ? s.src.replace(/[^\/]*$/, "") : "";
  })();
  var snd = {}, lastAudio = null, counts = {};
  function language() {
    return /^(en)(-|$)/i.test(window.ES_FX_LANG || document.documentElement.lang || "ar") ? "en" : "ar";
  }
  function audioFor(key) {
    if (snd[key]) return snd[key];
    var a = new Audio();
    a.preload = /-1$/.test(key) ? "auto" : "none";
    a.src = base + "audio/achird/" + key + ".mp3?v=71";
    snd[key] = a;
    return a;
  }
  ["ok", "no"].forEach(function(k) {
    audioFor(k + "-" + language() + "-1");
  });
  function stopFeedback() {
    if (lastAudio) {
      lastAudio.pause();
      try {
        lastAudio.currentTime = 0;
      } catch (e) {
      }
    }
    lastAudio = null;
  }
  function say(ok) {
    var stem = (ok ? "ok" : "no") + "-" + language();
    var index = (counts[stem] || 0) % 3 + 1;
    counts[stem] = (counts[stem] || 0) + 1;
    stopFeedback();
    var a = audioFor(stem + "-" + index);
    lastAudio = a;
    a.muted = false;
    try {
      a.currentTime = 0;
      var p = a.play();
      if (p && p.catch) p.catch(function() {
        if (index !== 1 && lastAudio === a) {
          var fallback = audioFor(stem + "-1");
          lastAudio = fallback;
          fallback.currentTime = 0;
          var q = fallback.play();
          if (q && q.catch) q.catch(function() {
          });
        }
      });
    } catch (e) {
    }
  }
  window.addEventListener("pagehide", stopFeedback);
  function run(ok, card) {
    if (!ok && card && window.__esExplain) window.__esExplain(card);
    var big = document.createElement("div");
    big.className = "esfx-big " + (ok ? "ok" : "no");
    big.innerHTML = window.ESIconSVG ? window.ESIconSVG(ok ? "celebrate" : "cross") : ok ? "✓" : "×";
    var cx = innerWidth / 2, cy = innerHeight / 2, W = 300;
    if (card) {
      var r = card.getBoundingClientRect();
      cx = Math.min(Math.max(r.left + r.width / 2, 40), innerWidth - 40);
      cy = Math.min(Math.max(r.top + Math.min(r.height / 2, 90), 50), innerHeight - 50);
      W = Math.min(r.width, 360);
      if (getComputedStyle(card).position === "static") card.style.position = "relative";
      var w = document.createElement("div");
      w.className = "esfx-wash " + (ok ? "ok" : "no");
      card.appendChild(w);
      void w.offsetWidth;
      w.classList.add("go");
      setTimeout(function() {
        w.remove();
      }, 1e3);
      var c = ok ? "esfx-card-ok" : "esfx-card-no";
      card.classList.remove("esfx-card-ok", "esfx-card-no");
      void card.offsetWidth;
      card.classList.add(c);
      setTimeout(function() {
        card.classList.remove(c);
      }, 700);
    }
    big.style.left = cx + "px";
    big.style.top = cy + "px";
    document.body.appendChild(big);
    void big.offsetWidth;
    big.classList.add("go");
    setTimeout(function() {
      big.remove();
    }, 1100);
    if (ok && document.body.animate && !matchMedia("(prefers-reduced-motion:reduce)").matches) {
      var set = ["🎉", "✅", "⭐", "✨", "🎊", "👏"];
      for (var i = 0; i < 14; i++) {
        (function(i2) {
          var b = document.createElement("div");
          b.className = "esfx-bit";
          b.innerHTML = window.ESIconSVG ? window.ESIconSVG(i2 % 2 ? "star" : "celebrate") : "+";
          b.style.left = cx + "px";
          b.style.top = cy + "px";
          document.body.appendChild(b);
          var ang = Math.random() * Math.PI * 2, d = W * (0.25 + Math.random() * 0.35), dx = Math.cos(ang) * d, dy = Math.sin(ang) * d * 0.8 - 30;
          var an = b.animate([{ transform: "translate(-50%,-50%) scale(.3)", opacity: 1 }, { transform: "translate(calc(-50% + " + dx + "px),calc(-50% + " + dy + "px)) scale(1.1) rotate(" + (Math.random() * 360 - 180) + "deg)", opacity: 1, offset: 0.6 }, { transform: "translate(calc(-50% + " + dx + "px),calc(-50% + " + (dy + 60) + "px)) scale(.8)", opacity: 0 }], { duration: 900 + Math.random() * 300, easing: "cubic-bezier(.15,.8,.3,1)" });
          an.onfinish = function() {
            b.remove();
          };
        })(i);
      }
    }
    try {
      navigator.vibrate && navigator.vibrate(ok ? [40, 30, 60] : [120, 60, 120]);
    } catch (e) {
    }
    say(ok);
  }
  function watch(el) {
    if (el.__esfx) return;
    el.__esfx = 1;
    new MutationObserver(function() {
      var _a;
      if (el.dataset.fxHandled === "true") return;
      var t = el.textContent.trim(), feed = (_a = el.closest(".q-card")) == null ? void 0 : _a.querySelector(".q-feed"), svg = el.querySelector("svg");
      if (svg && !t && feed) t = feed.classList.contains("ok") ? "✅" : feed.classList.contains("no") ? "❌" : "";
      if ((t === "✅" || t === "❌") && el.__esfxLast !== t) {
        el.__esfxLast = t;
        var card = el.closest(".q-card") || el.parentNode.parentNode;
        run(t === "✅", card);
      }
    }).observe(el, { childList: true, characterData: true, subtree: true });
  }
  function scan(r) {
    (r.querySelectorAll ? r.querySelectorAll(".q-state") : []).forEach(watch);
  }
  scan(document);
  new MutationObserver(function(ms) {
    ms.forEach(function(m) {
      m.addedNodes.forEach(function(n) {
        if (n.nodeType === 1) {
          if (n.classList && n.classList.contains("q-state")) watch(n);
          scan(n);
        }
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
  window.ESFeedback = run;
  window.__esFxTest = run;
})();
(function() {
  var DICT = null, loading = null;
  function dict(cb) {
    if (DICT) return cb(DICT);
    if (!loading) {
      loading = fetch((window.ES_BASE || "") + "data/explain-ar.json?v=1").then(function(r) {
        return r.json();
      }).catch(function() {
        return { words: {}, sentences: {} };
      });
    }
    loading.then(function(d) {
      DICT = d;
      cb(d);
    });
  }
  var css = ".esx-note{margin-top:10px;border:1px solid rgba(214,158,46,.5);background:rgba(250,240,205,.55);border-radius:10px;padding:10px 12px;font-size:13px;line-height:1.9;color:inherit}.esx-note b{font-weight:700}.esx-note .esx-en{direction:ltr;unicode-bidi:isolate;font-weight:600}.esx-note button{margin-top:6px;border:1px solid rgba(214,158,46,.7);background:transparent;border-radius:100px;padding:3px 12px;font-size:12px;cursor:pointer;color:inherit}.dark .esx-note{background:rgba(120,90,20,.25)}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);
  function chosen(card, q) {
    try {
      if (q.type === "mcq" || q.type === "tf") {
        var n = card.querySelector(".opt.no");
        return n ? n.textContent.replace(/[✓✗]/g, "").trim() : "";
      }
      if (q.type === "typein" || q.type === "unscramble") {
        var i = card.querySelector(".q-input");
        return i ? i.value.trim() : "";
      }
      if (q.type === "reorder") {
        return [].map.call(card.querySelectorAll(".built .wchip"), function(b) {
          return b.dataset.w;
        }).join(" ");
      }
      if (q.type === "cloze") {
        return [].map.call(card.querySelectorAll("select.no"), function(s) {
          return s.value;
        }).join(" · ");
      }
    } catch (e) {
    }
    return "";
  }
  function build(card, q, d) {
    var ch = chosen(card, q), L = [], speak = [], ar, cor, full;
    function en(t) {
      return '<span class="esx-en">' + t.replace(/[&<>]/g, function(c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
      }) + "</span>";
    }
    if (q.type === "unscramble") {
      var miss = q.letters.indexOf("_") >= 0;
      full = miss ? q.letters.replace("_", q.answer[0]) : q.answer[0];
      ar = d.words[full];
      if (miss) {
        L.push("الحرف الناقص هو <b>" + en(q.answer[0]) + "</b> عشان الكلمة تبقى " + en(full) + (ar ? " ومعناها " + ar : "") + ".");
        speak.push("الحرف الناقص هو " + q.answer[0] + "، والكلمة " + full + (ar ? " ومعناها " + ar : ""));
      } else {
        L.push("الكلمة الصح هي " + en(full) + (ar ? " ومعناها " + ar : "") + ". رتّب حروفها " + en(q.letters.split("").join(" - ")) + " على الترتيب الصح.");
        speak.push("الكلمة الصح هي " + full + (ar ? " ومعناها " + ar : ""));
      }
      if (ch) L.push("إنت كتبت " + en(ch) + "، وده مش مظبوط في الحروف.");
    } else if (q.type === "reorder") {
      full = q.answer.join(" ");
      ar = d.sentences[full];
      L.push((ar ? "معنى الجملة: <b>" + ar + "</b><br>" : "") + "الترتيب الصح: " + en(full));
      if (ch) L.push("إنت رتّبتها " + en(ch) + ". الجملة الإنجليزي بتبدأ بالفاعل وبعده الفعل.");
      speak.push((ar ? "معنى الجملة: " + ar + ". " : "") + "الترتيب الصح هو: " + full);
    } else if (q.type === "mcq") {
      cor = q.options[q.answer];
      full = q.q.replace(/_{2,}/, cor);
      ar = d.sentences[full];
      L.push((ar ? "معنى الجملة: <b>" + ar + "</b><br>" : "") + "الإجابة الصح: " + en(cor) + " فتبقى الجملة " + en(full));
      if (ch) L.push("اختيارك " + en(ch) + " مش بيكمّل معنى الجملة دي.");
      speak.push((ar ? "معنى الجملة: " + ar + ". " : "") + "الإجابة الصح هي " + cor + (ch ? ". واختيارك " + ch + " مش مناسب لمعنى الجملة" : ""));
    } else if (q.type === "tf") {
      L.push("الجملة دي " + (q.answer ? "<b>صح</b>" : "<b>غلط</b>") + ". ارجع للقطعة وقارن.");
      speak.push("الجملة دي " + (q.answer ? "صح" : "غلط"));
    } else {
      var a = q.answer ? q.answer[0] || q.answers && q.answers.join(" ") : "";
      if (typeof a !== "string" && typeof a !== "number") {
        return;
      }
      L.push("الإجابة الصح: " + en(String(a || "")));
      if (ch) L.push("إنت كتبت " + en(ch) + ". راجع الكلمة والإملاء.");
      speak.push("الإجابة الصح هي " + a);
    }
    var n = document.createElement("div");
    n.className = "esx-note";
    n.innerHTML = L.join("<br>");
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = "🔊 اسمع الشرح";
    var txt = speak.join(". ");
    b.addEventListener("click", function() {
      say(txt);
    });
    n.appendChild(document.createElement("br"));
    n.appendChild(b);
    card.appendChild(n);
    setTimeout(function() {
      say(txt);
    }, 1500);
  }
  function say(t) {
    if (window.ESSpeech) {
      window.ESSpeech.speak(t, { lang: "ar-EG" });
      return;
    }
    try {
      if (!window.speechSynthesis) return;
      var u = new SpeechSynthesisUtterance(t);
      u.lang = "ar-EG";
      u.rate = 0.95;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch (e) {
    }
  }
  window.__esExplain = function(card) {
    try {
      var q = card.__q;
      if (!q || card.querySelector(".esx-note")) return;
      dict(function(d) {
        build(card, q, d);
      });
    } catch (e) {
    }
  };
})();
;
(function() {
  document.querySelectorAll("a[href]").forEach(function(a) {
    if (!/^(?:\.\/)?adults\.html(?:[?#]|$)/.test(a.getAttribute("href") || "")) return;
    var w = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
    var n;
    while (n = w.nextNode()) n.nodeValue = n.nodeValue.replace(/اتكلم إنجليزي|اتكلم انجليزي/g, "اتعلم بنفسك");
  });
})();
