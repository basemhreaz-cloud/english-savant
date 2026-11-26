(async () => {
  "use strict";
  var _a;
  const $ = (s) => document.querySelector(s), el = (t, c, text) => {
    const n = document.createElement(t);
    if (c) n.className = c;
    if (text !== void 0) n.textContent = text;
    return n;
  }, content = $("#lesson-content");
  class AudioBus {
    constructor() {
      this.current = null;
      this.finish = null;
      this.generation = 0;
    }
    stop() {
      this.generation++;
      if (this.current) {
        this.current.pause();
        this.current.removeAttribute("src");
        this.current.load();
        this.current = null;
      }
      if (this.finish) {
        this.finish(null);
        this.finish = null;
      }
    }
    async playSequence(urls) {
      this.stop();
      const token = this.generation;
      for (const src of urls) {
        if (token !== this.generation) return null;
        const ok = await new Promise((resolve) => {
          const a = new Audio();
          this.current = a;
          let settled = false;
          const finish = (v) => {
            if (settled) return;
            settled = true;
            a.onended = a.onerror = null;
            if (this.current === a) this.current = null;
            if (this.finish === finish) this.finish = null;
            resolve(v);
          };
          this.finish = finish;
          a.preload = "none";
          a.onended = () => finish(true);
          a.onerror = () => finish(false);
          a.src = src;
          try {
            Promise.resolve(a.play()).catch(() => finish(false));
          } catch {
            finish(false);
          }
        });
        if (!ok) return ok;
      }
      return true;
    }
  }
  let letterAudio = null, pictureAudio = null;
  const bus = new AudioBus();
  let data, media, unit, activityIndex = 0, epoch = 0, cleanups = [], progress = { tried: {}, games: {}, pads: {} };
  function readState() {
    try {
      const p = JSON.parse(localStorage.getItem("es-kg1:" + data.source_hash));
      if (p && typeof p === "object") progress = { tried: p.tried || {}, games: p.games || {}, pads: p.pads || {} };
    } catch {
    }
  }
  function save() {
    try {
      localStorage.setItem("es-kg1:" + data.source_hash, JSON.stringify(progress));
    } catch {
    }
  }
  function asset(id, type) {
    const a = media.assets[id] || (pictureAudio == null ? void 0 : pictureAudio.assets[id]) || (letterAudio == null ? void 0 : letterAudio.assets[id]);
    if (!a || a.verified !== true || a.type !== type || !/^[a-f0-9]{64}$/i.test(a.sha256 || "")) return null;
    if (/^assets\/kg1\/(?:u2|u3|u4|review|shared|picture-audio|letter-audio)\/[A-Za-z0-9_.-]+$/.test(a.src || "")) return a.src + "?v=" + a.sha256.slice(0, 12);
    const s = a.inline_src || "";
    if (type === "image" && /^data:image\/(webp|png|svg\+xml);base64,/.test(s)) return s;
    if (type === "animation" && s.startsWith("data:video/mp4;base64,")) return s;
    return null;
  }
  function gate(title = "النشاط ده لسه بيتجهّز", text = "الصورة والصوت لازم يخلصوا ويتراجعوا الأول. نختار نشاطًا تاني أو نرجع له لما يجهز.") {
    const box = el("div", "availability");
    box.append(el("h3", "", title), el("p", "", text));
    content.replaceChildren(box);
  }
  function feedback(text, retry = false) {
    let n = $("#activity-feedback");
    if (!n) {
      n = el("div", "feedback");
      n.id = "activity-feedback";
      n.setAttribute("role", "status");
      content.append(n);
    }
    n.className = "feedback" + (retry ? " retry" : "");
    n.textContent = text;
  }
  function audioButton(ids, label = "اسمع تاني") {
    const urls = ids.map((id) => asset(id, "audio"));
    if (urls.some((x) => !x)) return null;
    const b = el("button", "", label);
    b.type = "button";
    b.onclick = async () => {
      const n = epoch;
      b.disabled = true;
      const ok = await bus.playSequence(urls);
      if (n === epoch) {
        b.disabled = false;
        if (ok === false) feedback("الصوت ما فتحش. جرّب تسمعه تاني، ومش هنحسب إجابة من غيره.", true);
      }
      return ok && n === epoch;
    };
    return b;
  }
  function loadImage(id, alt) {
    const src = asset(id, "image");
    if (!src) return Promise.reject(Error("unavailable"));
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.alt = alt || "";
      img.decoding = "async";
      img.onload = () => img.naturalWidth > 0 ? resolve(img) : reject(Error("empty-image"));
      img.onerror = () => reject(Error("image-load"));
      img.src = src;
    });
  }
  function updateProgress() {
    const total = unit.activities.length, n = unit.activities.filter((a) => progress.tried[a.id]).length;
    $("#parent-progress").textContent = "جرّبنا " + n + " من " + total + " أنشطة مع بعض على الجهاز ده.";
  }
  function stopCurrent() {
    bus.stop();
    cleanups.splice(0).forEach((f) => f());
    epoch++;
  }
  function labelKind(a) {
    if (a.original_practice) return a.original_practice.title_ar;
    return { "look-listen-point": "الصور والكلمات", "hear-and-tap": "اسمع واختار", "sound-and-trace": "الحروف والتتبّع", "count-color-shape": "العدد واللون والشكل", "match-picture-phrase": "نمثّل التحية", "say-and-act": "نقول ونمثّل", "practice-beginning-letter": "أول حرف", "story": "وقت الحكاية", "color": "نلوّن", "draw": "نرسم", "project": "نعمل حاجة بإيدينا", "trace-letters": "نجرّب الحروف" }[a.kind] || "نتعلّم ونجرب";
  }
  function chooseUnit(id, first = false) {
    const next = data.units.find((u) => u.id === id) || data.units[0];
    unit = next;
    activityIndex = 0;
    document.querySelectorAll(".units button").forEach((b) => b.setAttribute("aria-current", String(b.dataset.unit === unit.id)));
    $("#unit-count").textContent = unit.n ? "الوحدة " + unit.n : "مراجعة مع بعض";
    $("#unit-title").textContent = unit.title_en;
    const sel = $("#activity-select");
    sel.replaceChildren();
    unit.activities.forEach((a, i) => {
      const opt = el("option", "", "نشاط " + a.id.split("-a")[1] + " · " + labelKind(a));
      opt.value = i;
      sel.append(opt);
    });
    if (!first) history.replaceState(null, "", "?unit=" + encodeURIComponent(unit.n || "review"));
    render(!first);
  }
  async function render(focus = false) {
    var _a2;
    stopCurrent();
    const n = epoch, a = unit.activities[activityIndex];
    $("#activity-select").value = activityIndex;
    $("#activity-count").textContent = activityIndex + 1 + " من " + unit.activities.length + " أنشطة متاحة";
    $("#previous").disabled = activityIndex === 0;
    $("#next").disabled = activityIndex === unit.activities.length - 1;
    $("#parent-guide").textContent = a.parent_guide;
    $("#mark-tried").textContent = progress.tried[a.id] ? "جرّبناه مع بعض" : "جرّبنا النشاط مع بعض";
    updateProgress();
    content.replaceChildren();
    if (focus) requestAnimationFrame(() => window.scrollTo({ top: Math.max(0, document.querySelector(".lesson").getBoundingClientRect().top + scrollY - 16), behavior: "instant" }));
    try {
      if (a.original_practice) await originalPractice(a, n);
      else if (a.kind === "look-listen-point") await gallery(a, n);
      else if (a.practice === "picture-words") await listenChoice(a, n);
      else if (a.kind === "hear-and-tap" || ((_a2 = a.game_definitions) == null ? void 0 : _a2.length)) await gameActivity(a, n);
      else if (a.kind === "sound-and-trace" || a.kind === "trace-letters") traceActivity(a);
      else if (a.kind === "count-color-shape") geometry(a);
      else if (a.kind === "draw") drawing(a);
      else if (a.kind === "story") await story(a, n);
      else if (a.kind === "say-and-act") await actCards(a, n);
      else if (a.kind === "color") await colorPage(a, n);
      else if (a.kind === "project") {
        if (a.project_config) sharedProject(a, n);
        else paperProject(a, n);
      } else if (a.kind === "hygiene-actions") await actCards(a, n);
      else if (a.kind === "count-and-circle") await reviewCounting(a, n);
      else gate("التجهيز للنشاط ده مستمر", "الفكرة موجودة في الدليل تحت، لكن النسخة المصوّرة المسموعة لسه ما اتفتحتش. مش هنعتبر النشاط مكتملًا بزرار بس.");
    } catch {
      if (n === epoch) gate("الوسائط ما فتحتش", "نرجع للنشاط بعد ما الصورة والصوت يفتحوا. مفيش إجابة هتتحسب من غيرهم.");
    }
  }
  async function originalPracticeWordPair(r, answer) {
    const word = answer ? r.answer_letter_word : r.letter_word;
    if (word) {
      if (!letterAudio) await loadLetterAudio();
      return letterPair({ word });
    }
    if (!pictureAudio) await loadPictureAudio();
    return picturePair({ id: answer ? r.answer_word : r.word });
  }
  async function originalPractice(a, n) {
    let index = 0, revision = 0;
    const rounds = a.original_practice.rounds;
    const show = async () => {
      const ticket = ++revision, r = rounds[index];
      const images = await Promise.all((r.picture_choices || [r.image]).map((id) => loadImage(id, "")));
      const reference = r.reference_image ? await loadImage(r.reference_image, "الصورة اللي بندوّر على ظلها") : null;
      if (n !== epoch || ticket !== revision) return;
      content.replaceChildren();
      content.append(el("h3", "", a.original_practice.title_ar), el("p", "trace-caption", "لعبة من إعداد الموقع، بفكرة من كتاب الوزارة. نجرب مع شخص كبير، من غير درجات أو وقت."), el("p", "", r.prompt_ar));
      const pos = el("p", "trace-caption", "جولة " + (index + 1) + " من " + rounds.length);
      content.append(pos);
      let done = false, turn = 0;
      const next = el("button", "secondary", index + 1 < rounds.length ? "نجرب اللي بعدها" : "نلعب من الأول");
      next.type = "button";
      next.disabled = true;
      next.onclick = () => {
        bus.stop();
        index = (index + 1) % rounds.length;
        show();
      };
      const choose = async (value, b) => {
        if (done || n !== epoch || ticket !== revision) return;
        const correct = value === r.answer;
        if (!correct) {
          b.classList.add("try-again");
          b.setAttribute("aria-pressed", "false");
          feedback(r.retry_ar || "نبص على الصورة واحدة واحدة ونجرب تاني.", true);
          return;
        }
        done = true;
        turn++;
        next.disabled = true;
        const controls = [...content.querySelectorAll("button")];
        controls.forEach((x) => x.disabled = true);
        if (r.answer_word || r.answer_letter_word) {
          let ok = false;
          try {
            const pair = await originalPracticeWordPair(r, true);
            if (n !== epoch || ticket !== revision) return;
            ok = pair ? await bus.playSequence(pair) : false;
          } catch {
            ok = false;
          }
          if (n !== epoch || ticket !== revision) return;
          if (ok !== true) {
            done = false;
            controls.forEach((x) => x.disabled = false);
            next.disabled = true;
            feedback("الصوت ما فتحش. نضغط على الصورة ونجرب تاني.", true);
            return;
          }
        }
        if (n !== epoch || ticket !== revision) return;
        controls.forEach((x) => x.disabled = false);
        b.classList.add("correct");
        b.setAttribute("aria-pressed", "true");
        feedback(r.success_ar || "برافو، لقيناها!");
        next.disabled = false;
        if (r.trace_letter) {
          const letter = data.letters.find((l) => l.lower === r.trace_letter);
          if (letter) {
            const trace = el("button", "secondary original-practice-trace", "نتتبّع الحرف اللي اخترناه");
            trace.type = "button";
            trace.onclick = () => {
              if (n !== epoch || ticket !== revision) return;
              bus.stop();
              cleanups.splice(0).forEach((f) => f());
              revision++;
              traceActivity({ id: a.id + "-round-" + index, letters: [letter.id], kind: "sound-and-trace" });
              const restoreReturn = () => {
                if (!content.querySelector(".original-practice-back")) {
                  const back = el("button", "secondary original-practice-back", "نرجع لنفس الجولة");
                  back.type = "button";
                  back.onclick = () => {
                    bus.stop();
                    cleanups.splice(0).forEach((f) => f());
                    show();
                  };
                  content.append(back);
                }
                content.querySelectorAll(".case-tabs button,.trace-head .trace-tabs button").forEach((button) => {
                  if (button.dataset.practiceReturn) return;
                  button.dataset.practiceReturn = "1";
                  const previous = button.onclick;
                  button.onclick = (event) => {
                    previous == null ? void 0 : previous.call(button, event);
                    restoreReturn();
                  };
                });
              };
              restoreReturn();
            };
            next.before(trace);
          }
        }
      };
      if (r.kind === "count" || r.kind === "category") {
        const fig = el("figure", "picture-card original-count-picture");
        fig.append(images[0]);
        content.append(fig);
        if (r.word || r.letter_word) {
          const sound = el("button", "secondary", r.sound_label || "نسمع اسم الصورة: عربي ثم إنجليزي");
          sound.type = "button";
          sound.onclick = async () => {
            const stamp = ++turn;
            const pair = await originalPracticeWordPair(r, false);
            if (n !== epoch || ticket !== revision || stamp !== turn) return;
            if (!pair) {
              feedback("صوت اسم الصورة مش متاح دلوقتي. نقدر نكمل بالصورة مع شخص كبير.", true);
              return;
            }
            sound.disabled = true;
            await bus.playSequence(pair);
            if (n === epoch && ticket === revision && stamp === turn) sound.disabled = false;
          };
          content.append(sound);
        }
        const row = el("div", "trace-tabs");
        r.choices.forEach((option) => {
          const value = typeof option === "object" ? option.id : option;
          const label = typeof option === "object" ? option.label : String(option);
          const b = el("button", r.kind === "count" ? "number-choice" : "secondary category-choice", label);
          b.type = "button";
          b.setAttribute("aria-pressed", "false");
          b.onclick = () => choose(value, b);
          row.append(b);
        });
        content.append(row);
      } else {
        if (reference) {
          const fig = el("figure", "picture-card original-count-picture original-reference-picture");
          fig.append(reference);
          content.append(fig, el("p", "trace-caption", "نختار الظل اللي شكله زي الصورة."));
        }
        const grid = el("div", "picture-grid original-practice-grid" + (reference ? " original-shadow-grid" : ""));
        r.picture_choices.forEach((id, i) => {
          const b = el("button", "picture-card");
          b.type = "button";
          b.setAttribute("aria-label", "اختيار الصورة " + (i + 1));
          b.setAttribute("aria-pressed", "false");
          b.append(images[i]);
          b.onclick = () => choose(id, b);
          grid.append(b);
        });
        content.append(grid);
      }
      content.append(next);
    };
    await show();
  }
  function picturePair(word) {
    const ids = pictureAudio == null ? void 0 : pictureAudio.pairs[word.id];
    if (!Array.isArray(ids) || ids.length !== 2) return null;
    const urls = ids.map((id) => asset(id, "audio"));
    return urls.every(Boolean) ? urls : null;
  }
  async function loadPictureAudio() {
    var _a2, _b;
    try {
      const r = await fetch("assets/kg1/picture-audio/registry.json?v=069d620dd034", { cache: "no-cache" });
      if (!r.ok) return false;
      const incoming = await r.json(), group = (_a2 = incoming.units) == null ? void 0 : _a2[data.units[0].id];
      if (incoming.version !== 1 || (group == null ? void 0 : group.source_hash) !== data.source_hash || !incoming.assets || !incoming.pairs) return false;
      const expected = (_b = data.units[0].activities.find((a) => a.kind === "look-listen-point")) == null ? void 0 : _b.words;
      if (!expected || JSON.stringify(expected) !== JSON.stringify(group.words)) return false;
      pictureAudio = incoming;
      const available = expected.filter((id) => picturePair({ id })).length;
      if (available) {
        document.querySelector(".release-note").textContent = data.units[0].activities.length + " أنشطة متاحة. صوت صور الكلمات المتاحة بيبدأ بالعربي وبعده الإنجليزي. باقي الصوت وألعاب السماع والتدريبات لسه بتتجهز.";
        document.querySelector(".source-note").textContent = "أنشطة من كتاب الوزارة، مع صور وصوت تعليمي للموقع. صوت صور الكلمات متاح، وباقي الألعاب والتدريبات لسه بتتجهز. مفيش تصحيح آلي للنطق أو الخط.";
      }
      return available > 0;
    } catch {
      return false;
    }
  }
  async function gallery(a, n) {
    const words = a.words.map((id) => data.vocab.find((w) => w.id === id)).filter(Boolean);
    if (!words.length || words.some((w) => !asset(w.image_id, "image"))) return gate();
    const images = await Promise.all(words.map((w) => loadImage(w.image_id, w.en)));
    if (n !== epoch) return;
    const grid = el("div", "picture-grid");
    let playing = 0;
    const ready = words.filter((w) => picturePair(w)).length;
    words.forEach((w, i) => {
      const urls = picturePair(w), b = el(urls ? "button" : "figure", "picture-card");
      b.dataset.word = w.id;
      if (urls) {
        b.type = "button";
        b.setAttribute("aria-label", "اسمع معنى " + w.en + " بالعربي وبعده الكلمة بالإنجليزي");
        b.setAttribute("aria-busy", "false");
      }
      b.append(images[i], el("span", "", w.en));
      if (urls) {
        b.append(el("small", "picture-audio-label", "🔊 عربي ثم إنجليزي"));
        b.onclick = async () => {
          const turn = ++playing;
          grid.querySelectorAll('[aria-busy="true"]').forEach((x) => x.setAttribute("aria-busy", "false"));
          b.setAttribute("aria-busy", "true");
          const ok = await bus.playSequence(urls);
          if (n !== epoch || turn !== playing) return;
          b.setAttribute("aria-busy", "false");
          if (ok === false) feedback("الصوت ما فتحش. جرّب تلمس الصورة تاني.", true);
        };
      } else b.append(el("small", "picture-audio-label", "الصوت قيد التجهيز"));
      grid.append(b);
    });
    content.append(el("h3", "", ready ? "المس الصورة: عربي ثم إنجليزي" : "معاينة الصور"));
    content.append(el("p", "trace-caption", ready === words.length ? "اسمع المعنى بالعربي الأول، وبعده الكلمة بالإنجليزي. تقدر تلمس صورة تانية في أي وقت." : ready ? "الصورة اللي عليها علامة السماعة بس هي اللي صوتها متاح. باقي الصور للمعاينة." : "الصور هنا للمعاينة. الصوت لسه بيتجهز، ومفيش إجابات بتتسجل."));
    content.append(grid);
  }
  async function gameActivity(a, n) {
    var _a2;
    const ids = a.game_ids || ((_a2 = a.games) == null ? void 0 : _a2.map((g) => g.id)) || [];
    const games = a.game_definitions || ids.map((id) => data.games.find((g) => g.game === id));
    if (games.some((g) => !g)) return gate("في تدريب لسه متحجز للمراجعة", "مش هنفتح لعبة قبل ما بياناتها وصورها وصوتها يتراجعوا مع بعض.");
    if (!games.length) return gate();
    let i = 0, view = 0;
    const show = async () => {
      const stamp = ++view;
      if (n !== epoch) return;
      const g = games[i], imageIds = g.kind === "picture" ? g.option_images : [g.word_image], audioIds = g.prompt_audio.concat(g.feedback_audio);
      if (imageIds.some((id) => !asset(id, "image")) || audioIds.some((id) => !asset(id, "audio"))) return gate();
      if (g.kind === "sound-letter" && g.prompt_audio.some((id) => {
        var _a3;
        return id.startsWith("aud-phoneme-") || ((_a3 = media.assets[id]) == null ? void 0 : _a3.kind) === "phoneme";
      })) {
        const clips = g.prompt_audio.filter((id) => {
          var _a3;
          return id.startsWith("aud-phoneme-") || ((_a3 = media.assets[id]) == null ? void 0 : _a3.kind) === "phoneme";
        });
        if (clips.some((id) => {
          var _a3;
          return !((_a3 = media.assets[id]) == null ? void 0 : _a3.pronunciation_verified);
        })) return gate("صوت الحرف لسه بيتراجع", "صوت الحرف مختلف عن اسمه. الصوت المنفصل مش هيفتح قبل مراجعته.");
      }
      const pictures = await Promise.all(imageIds.map((id) => loadImage(id, "")));
      if (n !== epoch || stamp !== view) return;
      content.replaceChildren();
      const row = el("div", "listen-row"), play = audioButton(g.prompt_audio, "اسمع السؤال");
      row.append(play, el("p", "", "المس الصورة أو الحرف المناسب"));
      content.append(row);
      let heard = false;
      const original = play.onclick;
      play.onclick = async () => {
        heard = await original() === true;
      };
      const grid = el("div", "picture-grid"), options = [...g.kind === "picture" ? g.option_images : g.option_letters];
      for (let k = options.length - 1; k > 0; k--) {
        const q = Math.floor(Math.random() * (k + 1));
        [options[k], options[q]] = [options[q], options[k]];
      }
      const answers = g.kind === "picture" ? [g.answer_image] : [g.answer_letter];
      if (g.kind !== "picture") {
        const pic = el("div", "geometry");
        pic.append(pictures[0]);
        content.append(pic);
      }
      let done = false, turn = 0;
      options.forEach((id, j) => {
        const b = el("button", "picture-card");
        b.type = "button";
        b.dataset.option = id;
        b.setAttribute("aria-pressed", "false");
        b.setAttribute("aria-label", g.kind === "picture" ? "الصورة " + (j + 1) : id.replace("l-", ""));
        if (g.kind === "picture") b.append(pictures[imageIds.indexOf(id)]);
        else {
          const l = data.letters.find((x) => x.id === id), pair = el("div", "letter-choice");
          pair.append(template(l.upper), template(l.lower));
          b.append(pair);
        }
        b.onclick = async () => {
          var _a3, _b;
          if (done || stamp !== view) return;
          const attempt = ++turn;
          if (!heard) {
            feedback("نسمع السؤال الأول.", true);
            return;
          }
          grid.querySelectorAll("button").forEach((x) => {
            var _a4;
            x.classList.remove("try-again", "correct");
            x.setAttribute("aria-pressed", "false");
            (_a4 = x.querySelector(".selection")) == null ? void 0 : _a4.remove();
          });
          b.setAttribute("aria-pressed", "true");
          b.append(el("span", "selection", "●"));
          const correct = answers.includes(id);
          b.classList.add(correct ? "correct" : "try-again");
          const clip = g.feedback_audio[correct ? 0 : 1];
          const raw = (_a3 = a.game_feedback) == null ? void 0 : _a3[g.game];
          feedback((raw == null ? void 0 : raw[correct ? "feedback_correct_ar" : "feedback_wrong_ar"]) || (correct ? "برافو، نجرب اللي بعده؟" : "نجرب تاني ونسمع الكلمة."), !correct);
          const ok = await bus.playSequence([asset(clip, "audio")]);
          if (n !== epoch || stamp !== view || attempt !== turn) return;
          if (ok !== true) {
            if (ok === false) {
              heard = false;
              feedback("الصوت ما فتحش. نسمعه تاني الأول.", true);
            }
            return;
          }
          if (correct) {
            done = true;
            progress.games[g.game] = true;
            save();
            const next = el("button", "", "نجرب كمان");
            next.type = "button";
            next.onclick = () => {
              next.disabled = true;
              i = (i + 1) % games.length;
              show();
            };
            content.append(next);
          } else {
            const target = options.findIndex((id2) => answers.includes(id2));
            (_b = grid.querySelectorAll("button")[target]) == null ? void 0 : _b.classList.add("correct");
            await bus.playSequence(g.prompt_audio.map((x) => asset(x, "audio")));
          }
        };
        grid.append(b);
      });
      content.append(grid);
    };
    await show();
  }
  function traceDemo(id) {
    const src = asset(id, "animation"), record = media.assets[id], poster = (record == null ? void 0 : record.poster_id) && asset(record.poster_id, "image");
    if (!src || !poster) return;
    const button = el("button", "secondary", "شوف الحركة، وبعدين جرّب");
    button.type = "button";
    button.onclick = () => {
      button.disabled = true;
      const box = el("div", "trace-demo"), video = el("video"), close = el("button", "secondary", "نرجع نجرب بإيدينا");
      video.controls = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = "none";
      video.src = src;
      video.poster = poster;
      video.setAttribute("aria-label", "طريقة تتبّع الحرف أو الرقم");
      video.onplay = () => bus.stop();
      close.type = "button";
      close.onclick = () => {
        video.pause();
        video.removeAttribute("src");
        video.load();
        box.remove();
        button.disabled = false;
      };
      box.append(video, close);
      button.after(box);
      if (id === "anim-trace-n-1") box.append(el("p", "trace-caption", "حركة الرقم نموذج توضيحي، مش ترتيب أسهم من الكتاب."));
      cleanups.push(() => {
        video.pause();
        video.removeAttribute("src");
        video.load();
      });
      video.play().catch(() => {
        box.prepend(el("p", "trace-caption", "اضغط تشغيل لمشاهدة الحركة. لو ما فتحتش، النموذج الثابت متاح للتتبّع."));
      });
      box.scrollIntoView({ block: "center", behavior: "instant" });
    };
    content.append(button);
  }
  async function actCards(a, n) {
    const binding = data.activity_media.find((x) => x.activity === a.id);
    if (!binding || binding.images.some((id) => !asset(id, "image"))) return gate();
    const pics = await Promise.all(binding.images.map((id) => loadImage(id, "")));
    if (n !== epoch) return;
    const aud = (a.items || []).map((_, i) => "aud-say-" + a.id + "-" + (i + 1)), hasAudio = aud.length === pics.length && aud.every((id) => asset(id, "audio")), grid = el("div", "picture-grid");
    content.append(el("h3", "", "نقول ونمثّل"));
    if (!hasAudio) content.append(el("p", "trace-caption", "معاينة الصور فقط، الصوت لسه بيتجهّز."));
    pics.forEach((img, i) => {
      var _a2, _b;
      const card = el(hasAudio ? "button" : "figure", "picture-card");
      card.append(img, el("span", "", ((_b = (_a2 = a.items) == null ? void 0 : _a2[i]) == null ? void 0 : _b.say) || ""));
      if (hasAudio) {
        card.type = "button";
        card.onclick = () => bus.playSequence([asset(aud[i], "audio")]);
      }
      grid.append(card);
    });
    content.append(grid);
  }
  async function colorPage(a, n) {
    const binding = data.activity_media.find((x) => x.activity === a.id), id = binding == null ? void 0 : binding.images[0];
    if (!id || !asset(id, "image")) return gate();
    const image = await loadImage(id, "رسم للتلوين");
    if (n !== epoch) return;
    content.append(el("h3", "", "نلوّن بطريقتنا"));
    addPad("", a.id + ":color", true, image);
    const palette = el("div", "swatches");
    Object.entries(colors).forEach(([name, value]) => {
      var _a2;
      const b = el("button");
      b.type = "button";
      b.style.backgroundColor = value;
      b.setAttribute("aria-label", ((_a2 = data.colors.find((c) => c.en === name)) == null ? void 0 : _a2.ar) || name);
      b.onclick = () => {
        content.querySelector(".trace-board").dataset.ink = value;
        palette.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
      };
      palette.append(b);
    });
    content.append(palette);
  }
  function template(symbol) {
    var _a2;
    const paths = (_a2 = window.KG1TraceTemplates) == null ? void 0 : _a2[symbol];
    if (!paths) return null;
    const ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 200 240");
    svg.setAttribute("aria-hidden", "true");
    for (const d of paths) {
      const p = document.createElementNS(ns, "path");
      p.setAttribute("d", d);
      p.setAttribute("fill", "none");
      p.setAttribute("stroke", "currentColor");
      p.setAttribute("stroke-width", "14");
      p.setAttribute("stroke-linecap", "round");
      p.setAttribute("stroke-linejoin", "round");
      svg.append(p);
    }
    return svg;
  }
  function addPad(symbol, key, free = false, background = null) {
    const wrap = el("div", "trace-board"), model = el("div", "model"), canvas = el("canvas");
    if (background) {
      model.append(background);
      wrap.dataset.paint = "true";
    } else if (!free) model.append(template(symbol) || document.createTextNode(symbol));
    wrap.append(model, canvas);
    content.append(wrap);
    const ctx = canvas.getContext("2d"), paths = progress.pads[key] || [], size = () => wrap.getBoundingClientRect();
    let active = null, pointer = null;
    function redraw() {
      const r = size(), d = devicePixelRatio || 1;
      canvas.width = Math.round(r.width * d);
      canvas.height = Math.round(r.height * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
      ctx.clearRect(0, 0, r.width, r.height);
      ctx.strokeStyle = "#56634d";
      ctx.fillStyle = "#56634d";
      ctx.lineWidth = 7;
      ctx.lineCap = ctx.lineJoin = "round";
      for (const pathData of paths.concat(active ? [active] : [])) {
        const path = pathData.points || pathData;
        ctx.strokeStyle = ctx.fillStyle = pathData.ink || "#56634d";
        ctx.globalAlpha = background ? 0.65 : 1;
        if (!path.length) continue;
        ctx.beginPath();
        ctx.moveTo(path[0][0] * r.width, path[0][1] * r.height);
        if (path.length === 1) {
          ctx.arc(path[0][0] * r.width, path[0][1] * r.height, 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          path.slice(1).forEach((p) => ctx.lineTo(p[0] * r.width, p[1] * r.height));
          ctx.stroke();
        }
      }
    }
    const point = (e) => {
      const r = size();
      return [Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), Math.max(0, Math.min(1, (e.clientY - r.top) / r.height))];
    };
    canvas.onpointerdown = (e) => {
      if (pointer !== null || e.button > 0) return;
      pointer = e.pointerId;
      active = { ink: wrap.dataset.ink || "#56634d", points: [point(e)] };
      canvas.setPointerCapture(pointer);
      redraw();
    };
    canvas.onpointermove = (e) => {
      if (e.pointerId !== pointer || !active) return;
      active.points.push(point(e));
      redraw();
    };
    const end = (e) => {
      var _a2;
      if (e.pointerId !== pointer) return;
      if ((_a2 = active == null ? void 0 : active.points) == null ? void 0 : _a2.length) paths.push(active);
      active = null;
      pointer = null;
      progress.pads[key] = paths;
      save();
      redraw();
    };
    canvas.onpointerup = canvas.onpointercancel = end;
    const obs = new ResizeObserver(redraw);
    obs.observe(wrap);
    cleanups.push(() => obs.disconnect());
    const tools = el("div", "trace-tools");
    for (const [label, fn] of [["ارجع خطوة", () => paths.pop()], ["نمْسح ونجرب تاني", () => paths.splice(0)]]) {
      const b = el("button", "secondary", label);
      b.type = "button";
      b.onclick = () => {
        fn();
        progress.pads[key] = paths;
        save();
        redraw();
      };
      tools.append(b);
    }
    content.append(tools, el("p", "trace-caption", "نجرّب بصُباعنا. مفيش درجة للخط، ومش بنقيّم شكل الرسمة آليًا."));
    requestAnimationFrame(redraw);
  }
  function letterPair(w) {
    var _a2, _b;
    const ids = ((_a2 = letterAudio == null ? void 0 : letterAudio.pairs) == null ? void 0 : _a2["lw-" + w.word]) || ((_b = pictureAudio == null ? void 0 : pictureAudio.pairs) == null ? void 0 : _b["w-" + w.word]);
    if (!Array.isArray(ids) || ids.length !== 2) return null;
    const urls = ids.map((id) => asset(id, "audio"));
    return urls.every(Boolean) ? urls : null;
  }
  function letterExamples(letter, host, n) {
    const words = data.letter_words.filter((w) => w.letter === letter.id);
    if (!words.length || words.some((w) => !asset(w.image, "image"))) return;
    Promise.all(words.map((w) => loadImage(w.image, w.word))).then((pics) => {
      if (n !== epoch || !host.isConnected) return;
      host.append(el("p", "trace-caption", "المس كل صورة: هنسمع المعنى بالعربي، وبعده الكلمة بالإنجليزي. نكرّر الكلمة ونركّز على أول صوت في الإنجليزي. الشخص الكبير يساعد الطفل يجرّب أول الصوت زي بداية الكلمة، مش اسم الحرف."));
      const pairs = words.map((w) => letterPair(w)), ready = pairs.filter(Boolean).length, grid = el("div", "picture-grid");
      if (ready < words.length) host.append(el("p", "trace-caption", ready ? "بعض الكلمات صوتها جاهز. باقي الصوت قيد التجهيز والمراجعة." : "صور الكلمات للمعاينة، والصوت قيد التجهيز والمراجعة."));
      words.forEach((w, i) => {
        const urls = pairs[i], card = el(urls ? "button" : "figure", "picture-card");
        const label = el("span");
        label.dir = "ltr";
        const initial = el("strong", "", w.word.slice(0, 1));
        initial.style.color = "#963d3d";
        initial.style.textDecoration = "underline";
        label.append(initial, document.createTextNode(w.word.slice(1)));
        card.append(pics[i], label);
        if (urls) {
          card.type = "button";
          card.setAttribute("aria-label", w.word);
          card.onclick = () => bus.playSequence(urls);
        }
        grid.append(card);
      });
      host.append(grid);
    }).catch(() => {
    });
  }
  async function loadLetterAudio() {
    try {
      const r = await fetch("assets/kg1/letter-audio/registry.json?v=562e803548be", { cache: "no-cache" });
      if (!r.ok) return false;
      const inc = await r.json();
      if (inc.version !== 1 || inc.source_hash !== data.source_hash || !inc.assets || !inc.pairs) return false;
      letterAudio = inc;
      return true;
    } catch {
      return false;
    }
  }
  function addListenPractice() {
    if (!pictureAudio) return;
    data.units.forEach((u) => {
      if (u.activities.some((x) => x.practice === "picture-words")) return;
      const g = u.activities.find((x) => x.kind === "look-listen-point");
      if (!g || !g.words || g.words.filter((id) => picturePair({ id })).length < 4) return;
      const idx = u.activities.indexOf(g) + 1;
      u.activities.splice(idx, 0, { id: u.id.replace("kg1-t1-", "") + "-a2", kind: "hear-and-tap", practice: "picture-words", words: g.words.filter((id) => picturePair({ id })), game_ids: [], parent_guide: "تدريب سماع من كلمات الوحدة نفسها: بنسمع الكلمة بالإنجليزي والطفل يلمس الصورة. مفيش درجات ولا تقييم، ولو غلط نسمعها تاني." });
    });
    if (unit) {
      const sel = $("#activity-select");
      sel.replaceChildren();
      unit.activities.forEach((a, i) => {
        const opt = el("option", "", "نشاط " + a.id.split("-a")[1] + " · " + labelKind(a));
        opt.value = i;
        sel.append(opt);
      });
      sel.value = activityIndex;
    }
    document.querySelector(".release-note").textContent = unit.activities.length + " أنشطة متاحة. صور الكلمات وأمثلة الحروف المتاحة بتبدأ بالعربي وبعده الإنجليزي، ومعاها تدريب اسمع واختار الصورة وأنشطة أصلية. السرد الصوتي متاح لقصص الوحدات ١–٤. مفيش تقييم آلي للنطق أو الخط.";
    document.querySelector(".source-note").textContent = "أنشطة من كتاب الوزارة، مع صور وصوت وتدريب سماع أصلي للموقع. مفيش امتحان رسمي أو تقييم آلي للنطق والخط.";
  }
  async function listenChoice(a, n) {
    const words = a.words.map((id) => data.vocab.find((w) => w.id === id)).filter((w) => w && picturePair(w));
    if (words.length < 4 || words.some((w) => !asset(w.image_id, "image"))) return gate();
    const imgs = await Promise.all(words.map((w) => loadImage(w.image_id, w.en)));
    if (n !== epoch) return;
    let r = 0, locked = false;
    const host = el("div", "");
    content.append(el("h3", "", "اسمع واختار الصورة"), el("p", "trace-caption", "اسمع الكلمة بالإنجليزي الأول، وبعدين اختار الصورة. لما تلمس صورة هتسمع معناها بالعربي وبعدها كلمتها بالإنجليزي. تدريب بسيط، مفيش درجات."), host);
    const show = () => {
      host.replaceChildren();
      let heard = false;
      const t = r % words.length, opts = [t, (t + 3) % words.length, (t + 7) % words.length].filter((v, i, s) => s.indexOf(v) === i);
      for (let k = 0; opts.length < 3; k++) if (!opts.includes(k % words.length)) opts.push(k % words.length);
      const order = opts.map((_, i) => opts[(i + r + 1) % 3]), play = el("button", "", "اسمع الكلمة");
      play.type = "button";
      play.dataset.practiceListen = "true";
      const grid = el("div", "picture-grid"), buttons = [];
      const enable = (value) => buttons.forEach((b) => b.disabled = !value);
      const say = async () => {
        if (locked) return;
        heard = false;
        enable(false);
        play.disabled = true;
        const ok = await bus.playSequence([picturePair(words[t])[1]]);
        if (n !== epoch) return;
        play.disabled = false;
        heard = ok === true;
        enable(heard);
        if (ok === false) feedback("الصوت ما فتحش. جرّب زر اسمع الكلمة تاني قبل الاختيار.", true);
      };
      play.onclick = say;
      order.forEach((k) => {
        const b = el("button", "picture-card");
        b.type = "button";
        b.disabled = true;
        b.dataset.word = words[k].id;
        b.dataset.practiceChoice = "true";
        b.setAttribute("aria-label", "صورة");
        b.append(imgs[k].cloneNode(true));
        b.onclick = async () => {
          if (locked || !heard) return;
          locked = true;
          enable(false);
          play.disabled = true;
          const ok = await bus.playSequence(picturePair(words[k]));
          if (n !== epoch) return;
          if (ok !== true) {
            locked = false;
            heard = false;
            play.disabled = false;
            feedback("الصوت ما فتحش. نسمع الكلمة تاني قبل ما نكمل.", true);
            return;
          }
          if (k === t) {
            feedback("برافو!");
            setTimeout(() => {
              if (n !== epoch) return;
              locked = false;
              r++;
              feedback("");
              show();
            }, 900);
          } else {
            locked = false;
            play.disabled = false;
            enable(true);
            feedback("جرّب تاني. تقدر تسمع الكلمة تاني.", true);
          }
        };
        buttons.push(b);
        grid.append(b);
      });
      host.append(play, grid);
    };
    show();
  }
  function traceActivity(a) {
    const ls = (a.letters || a.items || []).map((id) => data.letters.find((l) => l.id === id)).filter(Boolean);
    if (!ls.length) return gate();
    let index = 0, lower = false;
    const show = () => {
      var _a2, _b;
      content.replaceChildren();
      const head = el("div", "trace-head");
      head.append(el("h3", "", "نجرّب الحرف بصُباعنا"));
      const tabs = el("div", "trace-tabs");
      ls.forEach((l, i) => {
        const b = el("button");
        b.append(template(l.upper) || document.createTextNode(l.upper));
        b.className = "letter-template-button";
        b.setAttribute("aria-label", "حرف " + l.upper);
        b.type = "button";
        b.setAttribute("aria-pressed", String(i === index));
        b.onclick = () => {
          bus.stop();
          cleanups.splice(0).forEach((f) => f());
          index = i;
          show();
        };
        tabs.append(b);
      });
      head.append(tabs);
      content.append(head);
      const wordHost = el("div", "letter-examples");
      content.append(wordHost);
      letterExamples(ls[index], wordHost, epoch);
      const cases = el("div", "trace-tabs case-tabs");
      [false, true].forEach((isLower) => {
        const b = el("button", "letter-template-button");
        b.type = "button";
        b.setAttribute("aria-label", isLower ? "الحرف الصغير" : "الحرف الكبير");
        b.setAttribute("aria-pressed", String(lower === isLower));
        b.append(template(isLower ? ls[index].lower : ls[index].upper));
        b.onclick = () => {
          bus.stop();
          cleanups.splice(0).forEach((f) => f());
          lower = isLower;
          show();
        };
        cases.append(b);
      });
      content.append(cases);
      const symbol = lower ? ls[index].lower : ls[index].upper;
      addPad(symbol, a.id + ":" + ls[index].id + ":" + (lower ? "lower" : "upper"));
      traceDemo("anim-trace-" + ls[index].lower + "-" + (lower ? "lower" : "upper"));
      if (((_a2 = a.game_ids) == null ? void 0 : _a2.length) || ((_b = a.games) == null ? void 0 : _b.length)) {
        const b = el("button", "secondary", "نسمع الكلمة ونختار الحرف");
        b.type = "button";
        b.onclick = () => {
          cleanups.splice(0).forEach((f) => f());
          bus.stop();
          gameActivity(a, epoch);
        };
        content.append(b);
      }
    };
    show();
  }
  function numberPictures(number, host, status, n) {
    const ids = ["img-count-" + number.number + "-a", "img-count-" + number.number + "-b"];
    if (ids.some((id) => !asset(id, "image"))) return;
    Promise.all(ids.map((id) => loadImage(id, "صورة للعد"))).then((pics) => {
      if (n !== epoch || !host.isConnected) return;
      const sounds = ids.map((_, i) => "aud-count-" + number.number + "-" + (i + 1)), hasAudio = sounds.every((id) => asset(id, "audio")), grid = el("div", "picture-grid");
      status.textContent = hasAudio ? "المس كل صورة واسمع العدّ." : "صور العدّ موجودة. الصوت لسه بيتجهّز، فدي معاينة بصرية فقط.";
      pics.forEach((img, i) => {
        const card = el(hasAudio ? "button" : "figure", "picture-card");
        card.append(img, el("span", "", number.count_sentences[i]));
        if (hasAudio) {
          card.type = "button";
          card.onclick = () => bus.playSequence([asset(sounds[i], "audio")]);
        }
        grid.append(card);
      });
      host.append(grid);
    }).catch(() => {
      if (n === epoch && host.isConnected) status.textContent = "صورة العدّ ما فتحتش. نرجع لها بعدين.";
    });
  }
  const colors = { red: "#db5050", blue: "#4d82c4", yellow: "#e6bf38", green: "#64a46a", orange: "#ec913c" };
  function geometry(a, index = 0) {
    var _a2;
    const list = (a.numbers || []).map((id) => data.numbers.find((x) => x.id === id)).filter(Boolean), number = list[index];
    if (!number) return gate();
    content.replaceChildren();
    if (list.length > 1) {
      const tabs = el("div", "trace-tabs");
      list.forEach((num, i) => {
        const b = el("button", "", String(num.number));
        b.type = "button";
        b.setAttribute("aria-pressed", String(i === index));
        b.onclick = () => {
          cleanups.splice(0).forEach((f) => f());
          geometry(a, i);
        };
        tabs.append(b);
      });
      content.append(tabs);
    }
    const row = el("div", "geometry"), image = new Image();
    image.alt = ((_a2 = data.shapes.find((x) => x.en === number.shape)) == null ? void 0 : _a2.ar) || number.shape;
    image.src = data.geometry[number.shape + ".svg"];
    row.append(image, el("span", "digit", String(number.number)));
    const status = el("p", "trace-caption geometry-status", "لوحة تجريبية للون والشكل. صور العدّ والصوت لسه بيتجهزوا."), countHost = el("div", "count-media");
    content.append(el("h3", "", "نكتشف اللون والشكل"), row, status, countHost);
    numberPictures(number, countHost, status, epoch);
    const sw = el("div", "swatches");
    Object.entries(colors).forEach(([name, value]) => {
      var _a3;
      const b = el("button");
      b.type = "button";
      b.style.backgroundColor = value;
      b.setAttribute("aria-label", ((_a3 = data.colors.find((x) => x.en === name)) == null ? void 0 : _a3.ar) || name);
      b.setAttribute("aria-pressed", String(name === number.color));
      b.onclick = () => {
        image.style.filter = "none";
        image.src = data.geometry[number.shape + "-" + name + ".svg"];
        sw.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
      };
      sw.append(b);
    });
    content.append(sw);
    image.src = data.geometry[number.shape + "-" + number.color + ".svg"];
    addPad(String(number.number), a.id + ":number:" + number.number);
    traceDemo("anim-trace-n-" + number.number);
  }
  function drawing(a) {
    content.append(el("h3", "", "ارسم اللي شايفه في الجنينة"));
    addPad("", a.id + ":free", true);
  }
  function sharedProject(a, n) {
    const cfg = a.project_config, ids = ["img-project-" + a.id + "-sample", "img-project-" + a.id + "-template"];
    if (!cfg || ids.some((id) => !asset(id, "image"))) return gate();
    const host = el("div", "paper-project");
    content.append(el("h3", "", cfg.title), host);
    Promise.all(ids.map((id) => loadImage(id, cfg.title))).then((images) => {
      if (n !== epoch || !host.isConnected) return;
      const grid = el("div", "picture-grid");
      images.forEach((image, i) => {
        const f = el("figure", "picture-card");
        f.append(image, el("figcaption", "", i ? "قالب مساعد، مش صفحة من الكتاب" : "نموذج توضيحي، نقدر نغيّره"));
        grid.append(f);
      });
      host.append(grid);
      host.append(el("p", "", cfg.materials + " شخص كبير يساعد في القص واللصق."));
      const list = el("ol");
      cfg.steps.forEach((t) => list.append(el("li", "", t)));
      host.append(list);
      const phrase = el("p", "story-lines", cfg.phrase);
      phrase.dir = "ltr";
      host.append(phrase);
      for (const label of ["جهّزنا الخامات", "جرّبنا النشاط", "عرضنا شغلنا وحكينا عنه"]) {
        const b = el("button", "secondary", label);
        b.type = "button";
        b.setAttribute("aria-pressed", "false");
        b.onclick = () => {
          const on = b.getAttribute("aria-pressed") === "true";
          b.setAttribute("aria-pressed", String(!on));
          b.textContent = (on ? "" : "✓ ") + label;
        };
        host.append(b);
      }
      host.append(el("p", "trace-caption", "دي متابعة للتجربة مع ولي الأمر، مش اختبار نطق أو خط. مفيش صور أو تسجيلات بتترفع."));
    }).catch(() => {
      if (n === epoch) gate("الصورة ما فتحتش", "نرجع للنشاط لما الصور تفتح.");
    });
  }
  async function reviewCounting(a, n) {
    let index = 0, stamp = 0;
    const show = async () => {
      const ticket = ++stamp, item = a.items[index], img = await loadImage("img-revcount-" + a.id + "-" + (index + 1), "أشكال للعدّ");
      if (n !== epoch || ticket !== stamp) return;
      content.replaceChildren();
      content.append(el("h3", "", "نعدّ ونختار الرقم"), el("p", "trace-caption", "تدريب بصري مع ولي الأمر. الصوت لسه بيتجهّز."));
      const host = el("div", "review-count-picture");
      host.append(img);
      content.append(host);
      const choices = el("div", "trace-tabs");
      let done = false;
      for (const value of item.options) {
        const b = el("button", "number-choice", String(value));
        b.type = "button";
        b.onclick = () => {
          if (done) return;
          if (value === item.answer) {
            done = true;
            b.setAttribute("aria-pressed", "true");
            feedback("برافو، عدّينا صح!");
            next.disabled = false;
          } else feedback("نعدّ الأشكال واحدة واحدة ونجرّب تاني.", true);
        };
        choices.append(b);
      }
      const next = el("button", "secondary", index + 1 < a.items.length ? "نكمل العدّ" : "نجرّب العدّ تاني");
      next.type = "button";
      next.disabled = true;
      next.onclick = () => {
        index = (index + 1) % a.items.length;
        show();
      };
      content.append(choices, next);
    };
    await show();
  }
  function paperProject(a, n) {
    const ids = ["img-project-" + a.id + "-sample", "img-project-" + a.id + "-template"];
    if (ids.some((id) => !asset(id, "image"))) return gate();
    const host = el("div", "paper-project");
    content.append(el("h3", "", "شنطتي بإيدي"), host);
    Promise.all(ids.map((id) => loadImage(id, "نموذج مساعد لشنطة ورقية"))).then((images) => {
      if (n !== epoch || !host.isConnected) return;
      const grid = el("div", "picture-grid");
      images.forEach((image, i) => {
        const f = el("figure", "picture-card");
        f.append(image, el("figcaption", "", i ? "قالب مساعد، مش صفحة من الكتاب" : "شكل توضيحي للشنطة"));
        grid.append(f);
      });
      host.append(grid);
      host.append(el("p", "", "نجهّز ورق، وألوان، وصمغ، ومقص، وعصيان أشغال يدوية. شخص كبير يساعد في القص واللصق."));
      const list = el("ol");
      ["نلوّن أجزاء الشنطة على الورق.", "نجمع الأجزاء مع شخص كبير. مش لازم تطلع زي النموذج.", "الطفل يعرض شنطته ويحكي عنها."].forEach((t) => list.append(el("li", "", t)));
      host.append(list);
      const phrase = el("p", "story-lines", "This is my school bag.");
      phrase.dir = "ltr";
      host.append(phrase);
      for (const label of ["جهّزنا الخامات", "جرّبنا تركيب الشنطة", "عرضنا الشنطة وحكينا عنها"]) {
        const b = el("button", "secondary", label);
        b.type = "button";
        b.setAttribute("aria-pressed", "false");
        b.onclick = () => {
          const on = b.getAttribute("aria-pressed") === "true";
          b.setAttribute("aria-pressed", String(!on));
          b.textContent = (on ? "" : "✓ ") + label;
        };
        host.append(b);
      }
      host.append(el("p", "trace-caption", "دي متابعة للتجربة مع ولي الأمر، مش اختبار نطق أو خط. مفيش صور أو تسجيلات بتترفع."));
    }).catch(() => {
      if (n === epoch) gate("الصورة ما فتحتش", "نرجع للنشاط لما الصور تفتح.");
    });
  }
  async function story(a, n) {
    var _a2;
    const binding = (_a2 = data.stories) == null ? void 0 : _a2.find((s) => s.activity === a.id);
    if (!binding || binding.panels.some((p) => !asset(p.image, "image"))) return gate("الحكاية لسه بتتجهّز", "كل لوحة لازم يكون معاها رسم واضح وصوتها قبل ما نفتح الحكاية.");
    const hasAudio = binding.panels.every((p) => p.narration_audio.every((id) => asset(id, "audio")));
    let index = 0, view = 0;
    const show = async () => {
      const stamp = ++view, panel = binding.panels[index], image = await loadImage(panel.image, "صورة من الحكاية");
      if (n !== epoch || stamp !== view) return;
      content.replaceChildren();
      image.className = "story-picture";
      content.append(image);
      const lines = el("div", "story-lines");
      (a.panels[index] || "").split(" / ").forEach((text) => lines.append(el("p", "", text)));
      content.append(lines);
      if (!hasAudio) content.append(el("p", "trace-caption", "معاينة صور الحكاية فقط، السرد الصوتي لسه بيتجهّز."));
      const row = el("div", "listen-row"), sound = hasAudio ? audioButton(panel.narration_audio, "نسمع الحكاية") : null, next = el("button", "secondary", index === binding.panels.length - 1 ? "نرجع لأول صورة" : "الصورة اللي بعدها");
      next.type = "button";
      next.onclick = () => {
        index = (index + 1) % binding.panels.length;
        bus.stop();
        show();
      };
      if (sound) row.append(sound);
      row.append(next);
      content.append(row);
    };
    await show();
  }
  try {
    data = JSON.parse($("#kg1-data").textContent);
    media = JSON.parse($("#kg1-media").textContent);
    const target = new URLSearchParams(location.search).get("unit");
    const route = { "kg1-t1-u2": "u2", "2": "u2", "kg1-t1-u3": "u3", "3": "u3", "kg1-t1-u4": "u4", "4": "u4", "kg1-t1-review": "review", "review": "review" }[target];
    if (route) {
      const name = { u2: "الوحدة الثانية", u3: "الوحدة الثالثة", u4: "الوحدة الرابعة", review: "المراجعة" }[route];
      document.title = "KG1 · أنشطة " + name + " | ENGLISH SAVANT";
      document.querySelector(".release-note").textContent = "بنحمّل أنشطة " + name + "...";
      document.querySelector('a[href*="course-kg1.html"]').href = "course-kg1.html#" + (route === "review" ? "review" : "unit-" + route.slice(1));
      const responses = await Promise.all(["data.json", "media.json"].map((file) => fetch("assets/kg1/" + route + "/" + file + "?v=20261123-story-audio1", { cache: "no-cache" })));
      if (responses.some((r) => !r.ok)) throw Error("unit-load");
      [data, media] = await Promise.all(responses.map((r) => r.json()));
      document.querySelector(".release-note").textContent = data.units[0].activities.length + " أنشطة بصرية من " + name + " متاحة. الصوت العربي والإنجليزي وألعاب السماع لسه قيد التجهيز والمراجعة. الأعداد بنماذج ثابتة، مش حركة كتابة معتمدة.";
      document.querySelector(".source-note").textContent = "أنشطة بصرية من كتاب الوزارة. الصوت وألعاب السماع والتدريبات أجزاء منفصلة لسه بتتجهز. مفيش تقييم آلي للنطق أو الخط.";
    }
    if (!data.source_hash || !Array.isArray(data.units) || !media.assets) throw Error("schema");
    readState();
    const nav = $("#units");
    data.units.forEach((u) => {
      const b = el("button", "", u.n ? "الوحدة " + u.n : "نراجع سوا");
      b.type = "button";
      b.dataset.unit = u.id;
      b.onclick = () => chooseUnit(u.id);
      nav.append(b);
    });
    $("#activity-select").onchange = (e) => {
      activityIndex = Number(e.target.value);
      render(true);
    };
    $("#previous").onclick = () => {
      if (activityIndex > 0) {
        activityIndex--;
        render(true);
      }
    };
    $("#next").onclick = () => {
      if (activityIndex < unit.activities.length - 1) {
        activityIndex++;
        render(true);
      }
    };
    $("#mark-tried").onclick = () => {
      const a = unit.activities[activityIndex];
      progress.tried[a.id] = true;
      save();
      updateProgress();
      $("#mark-tried").textContent = "جرّبناه مع بعض";
    };
    const wanted = new URLSearchParams(location.search).get("unit");
    chooseUnit((_a = data.units.find((u) => String(u.n || "review") === wanted)) == null ? void 0 : _a.id, true);
    window.addEventListener("pagehide", () => bus.stop());
    loadLetterAudio().then((ok) => {
      var _a2;
      if (ok && ((_a2 = unit.activities[activityIndex]) == null ? void 0 : _a2.kind) && /trace/.test(unit.activities[activityIndex].kind)) render(false);
    });
    loadPictureAudio().then((ready) => {
      if (ready) addListenPractice();
      if (ready) render(false);
    });
    window.esKG1 = { AudioBus, asset, getState: () => structuredClone(progress), getData: () => structuredClone(data), setTestMedia: (v) => {
      if (location.hostname === "127.0.0.1" || location.hostname === "localhost") media = v;
    }, render };
  } catch {
    content.replaceChildren(el("div", "load-error", "المعاينة ما فتحتش. جرّب تحديث الصفحة."));
    $("#previous").disabled = $("#next").disabled = true;
  }
})();
