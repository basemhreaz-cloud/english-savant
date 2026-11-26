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
(async function() {
  "use strict";
  const root = document.querySelector("[data-video-grade]"), watch = document.getElementById("watch-video");
  if (!root && !watch) return;
  const node = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== void 0) e.textContent = text;
    return e;
  };
  const empty = (target, title, detail) => {
    const e = node("div", "grade-empty");
    e.append(node("h2", "", title), node("p", "", detail));
    target.replaceChildren(e);
  };
  try {
    let syncBack = function() {
      const en = document.documentElement.getAttribute("data-interface-language") === "en";
      const gradePage = back.href.indexOf("videos-") < 0;
      document.querySelectorAll(".grade-back").forEach((e) => {
        e.setAttribute("data-no-interface-translation", "");
        e.textContent = en ? gradePage ? "\u2190 Back to the grade page" : "\u2190 Back to year videos" : gradePage ? "\u2190 \u0631\u062C\u0648\u0639 \u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0635\u0641" : "\u2190 \u0631\u062C\u0648\u0639 \u0644\u0641\u064A\u062F\u064A\u0648\u0647\u0627\u062A \u0627\u0644\u0635\u0641";
      });
    };
    const r = await fetch("lessons.json?v=20261122-hub", { cache: "no-cache" });
    if (!r.ok) throw Error("library");
    const d = await r.json();
    const items = (d.lessons || []).filter((l2) => l2 && typeof l2.id === "string" && !l2.soon && (l2.mp4 || l2.youtube));
    if (root) {
      const list = items.filter((l2) => l2.grade === root.dataset.videoGrade);
      root.replaceChildren();
      if (!list.length) {
        empty(root, "\u0641\u064A\u062F\u064A\u0648\u0647\u0627\u062A \u0627\u0644\u0635\u0641 \u0644\u0633\u0647 \u0628\u062A\u062A\u062C\u0647\u0632", "\u0623\u0648\u0644 \u0645\u0627 \u0641\u064A\u062F\u064A\u0648 \u064A\u062E\u0644\u0635 \u0648\u064A\u062A\u0631\u0627\u062C\u0639\u060C \u0647\u062A\u0644\u0627\u0642\u064A \u0643\u0627\u0631\u062A \u0627\u0644\u0648\u062D\u062F\u0629 \u0628\u062A\u0627\u0639\u0647 \u0647\u0646\u0627. \u0627\u0631\u062C\u0639 \u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0635\u0641 \u0639\u0634\u0627\u0646 \u062A\u0634\u0648\u0641 \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0627\u0644\u0645\u062A\u0627\u062D\u0629.");
        return;
      }
      list.forEach((l2) => {
        const a = node("a", "grade-card");
        a.href = "watch.html?lesson=" + encodeURIComponent(l2.id);
        const label = node("span", "grade-chip", l2.part || "\u0641\u064A\u062F\u064A\u0648 \u0634\u0631\u062D");
        const title = node("b", "", l2.title);
        title.dir = "auto";
        const poster = l2.poster || (l2.mp4 ? l2.mp4.replace(/\.mp4$/, ".jpg") : "https://i.ytimg.com/vi/" + encodeURIComponent(l2.youtube) + "/hqdefault.jpg");
        const image = node("img", "grade-video-thumb");
        image.src = poster;
        image.alt = l2.title;
        image.loading = "lazy";
        image.width = 480;
        image.height = 270;
        image.style.cssText = "width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:10px";
        a.append(image, label, title, node("small", "", (l2.duration ? l2.duration + " \xB7 " : "") + "\u0627\u0641\u062A\u062D \u0641\u064A\u062F\u064A\u0648 \u0627\u0644\u0648\u062D\u062F\u0629 \u2190"));
        root.append(a);
      });
      return;
    }
    const id = new URLSearchParams(location.search).get("lesson");
    const l = items.find((l2) => l2.id === id);
    if (!l) {
      empty(watch, "\u0627\u0644\u0641\u064A\u062F\u064A\u0648 \u0645\u0634 \u0645\u0648\u062C\u0648\u062F", "\u0627\u0631\u062C\u0639 \u0644\u0645\u0643\u062A\u0628\u0629 \u0627\u0644\u062F\u0631\u0648\u0633 \u0648\u0627\u062E\u062A\u0627\u0631 \u0641\u064A\u062F\u064A\u0648 \u0645\u062A\u0627\u062D.");
      const a = node("a", "button", "\u0645\u0643\u062A\u0628\u0629 \u0627\u0644\u062F\u0631\u0648\u0633");
      a.href = "lessons.html";
      watch.append(a);
      return;
    }
    const grade = /^(kg[12]|p[1-6]|m[1-3]|sa-g[1-6]|sa-m[1-3])$/.test(l.grade) ? l.grade : null;
    const intro = document.querySelector(".page-intro");
    const h = intro.querySelector("h1");
    h.textContent = l.title;
    h.dir = "auto";
    document.title = l.title + " | ENGLISH SAVANT";
    intro.querySelector(".lead").textContent = l.part || "\u0641\u064A\u062F\u064A\u0648 \u0634\u0631\u062D";
    const back = node("a", "grade-back", "\u2190 \u0631\u062C\u0648\u0639 \u0644\u0641\u064A\u062F\u064A\u0648\u0647\u0627\u062A \u0627\u0644\u0635\u0641");
    back.href = grade ? "videos-" + grade + ".html" : "lessons.html";
    if (grade) {
      const check = await fetch(back.href, { method: "HEAD" });
      if (!check.ok) {
        back.href = (grade.startsWith("sa-") ? grade : "grade-" + grade) + ".html";
        back.textContent = "\u2190 \u0631\u062C\u0648\u0639 \u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0635\u0641";
      }
    }
    back.setAttribute("data-no-interface-translation", "");
    intro.prepend(back);
    document.addEventListener("es:interface-language", syncBack);
    syncBack();
    const card = node("article", "video-watch-card");
    let player;
    if (l.mp4) {
      const local = /^videos\/[A-Za-z0-9_.-]+\.mp4$/.test(l.mp4), repoRelease = /^https:\/\/github\.com\/basemhreaz-cloud\/english-savant\/releases\/download\/(?:kg2-u[34]-hd-20261122|p1-u[123456]-full-lesson-2026112[23]|m2-u1-full-lesson-20261126|m2-u2-full-lesson-20261126|p3-u6-full-lesson-20261126|m2-u3-full-lesson-20261126)\/[A-Za-z0-9_.-]+\.mp4$/.test(l.mp4);
      if (!local && !repoRelease) throw Error("source");
      const poster = local ? l.mp4.replace(/\.mp4$/, ".jpg") : l.poster;
      if (!/^videos\/[A-Za-z0-9_.-]+\.jpg$/.test(poster || "")) throw Error("poster");
      player = node("video");
      player.controls = true;
      player.preload = "none";
      player.playsInline = true;
      const version = /^[a-f0-9]{12}$/.test(l.media_version || "") ? "?v=" + l.media_version : "";
      player.poster = poster + version;
      player.src = l.mp4 + version;
      player.setAttribute("aria-label", l.title);
    } else {
      if (!/^[A-Za-z0-9_-]{11}$/.test(l.youtube)) throw Error("youtube");
      player = node("iframe");
      player.src = "https://www.youtube.com/embed/" + l.youtube;
      player.title = l.title;
      player.loading = "lazy";
      player.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      player.allowFullscreen = true;
    }
    const wrap = node("div", "video-wrap");
    wrap.append(player);
    card.append(wrap);
    if (l.duration) card.append(node("p", "video-watch-meta", "\u0645\u062F\u0629 \u0627\u0644\u0641\u064A\u062F\u064A\u0648: " + l.duration));
    if (l.description) card.append(node("p", "video-watch-meta", l.description));
    card.append(back.cloneNode(true));
    watch.replaceChildren(card);
    syncBack();
  } catch (e) {
    empty(root || watch, "\u0627\u0644\u0635\u0641\u062D\u0629 \u0645\u0634 \u0631\u0627\u0636\u064A\u0629 \u062A\u0641\u062A\u062D", "\u062C\u0631\u0651\u0628 \u062A\u062D\u062F\u0651\u062B \u0627\u0644\u0635\u0641\u062D\u0629\u060C \u0623\u0648 \u0627\u0631\u062C\u0639 \u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0635\u0641 \u0648\u062D\u0627\u0648\u0644 \u062A\u0627\u0646\u064A.");
  }
})();
