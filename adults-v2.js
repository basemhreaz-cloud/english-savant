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
const DATA = { "levels": { "A1": { "goal": "تعرّف بنفسك، افهم عبارات بسيطة، واطلب احتياجًا يوميًا مع مساعدة المتحدث.", "units": ["أول مقابلة: الاسم والبلد والشغل", "الحروف وتهجئة الاسم والأرقام", "بياناتك: العمر والهاتف والعنوان", "أسرتك والناس اللي تعرفهم", "يومك العادي ومواعيدك", "في الكافيه: طلب بسيط وأسعار", "بيتك والأماكن القريبة", "المواصلات والاتجاهات البسيطة", "التسوق والمقاسات والاحتياجات", "مراجعة عملية: عرّف نفسك وخطّط ليومك"] }, "A2": { "goal": "تبادل معلومات روتينية، صف خبرات بسيطة واحتياجات مباشرة، واكتب رسائل قصيرة.", "units": ["تبادل الأخبار والمعلومات", "روتين الشغل والمسؤوليات", "مشتريات وخدمات وشكاوى بسيطة", "السفر والحجز", "الصحة ووصف الأعراض", "حكاية يوم حصل قبل كده", "خططك ومواعيدك الجاية", "مهمة ختامية: رحلة ومواقفها"] }, "B1": { "goal": "اتعامل مع مواقف سفر مألوفة، احكِ تجربة، واشرح رأيك وأسبابك بلغة مترابطة.", "units": ["خبراتك وقصصك الشخصية", "مواقف السفر غير المتوقعة", "محادثات الشغل ورسائل المتابعة", "رأي وأسباب وأمثلة", "توضيح مشكلة وطلب حل", "أهدافك وقراراتك", "فهم مقالات وأخبار مألوفة", "مهمة ختامية: عرض تجربة ومناقشتها"] }, "B2": { "goal": "ناقش أفكارًا بتفصيل، افهم حجج النصوص، وتواصل بطلاقة معقولة في نطاق واسع من الموضوعات.", "units": ["نقاش واتفاق واختلاف", "عروض واضحة وأسئلة الجمهور", "اجتماعات وتفاوض عملي", "مقارنة مصادر وحجج", "كتابة تقارير ورسائل مقنعة", "رواية موقف بدقة", "تعبير مناسب للجمهور", "مهمة ختامية: اقتراح ومناقشته"] }, "C1": { "goal": "استخدم اللغة بمرونة في الشغل والمواقف المعقدة، وافهم المعنى الضمني واكتب نصًا منظمًا ودقيقًا.", "units": ["المعنى الضمني وموقف الكاتب", "إدارة نقاش معقد", "صياغة مهنية دقيقة", "تلخيص ودمج مصادر", "عرض حجج متوازنة", "نبرة وسياق وجمهور", "تحرير نص طويل وترابطه", "مهمة ختامية: تقرير وعرض ودفاع عنه"] }, "C2": { "goal": "افهم نصوصًا شديدة التعقيد، ركّب معلومات من مصادر مختلفة، وعبّر بدقة عن فروق المعنى والأسلوب.", "units": ["فروق المعنى الدقيقة", "السخرية والتلميح والتأثير", "تركيب حجج متعارضة", "تكييف الخطاب لجماهير مختلفة", "تحليل أسلوب نص معقد", "نقاش تلقائي عالي الدقة", "تحرير مهني ونقد ذاتي", "مهمة ختامية: تركيب مصادر ودفاع نقدي"] } }, "test": [{ "band": "A1", "q": "Complete: I ___ from Egypt.", "options": ["is", "am", "are", "be"], "answer": 1 }, { "band": "A1", "q": "A colleague says, “Nice to meet you.” What fits?", "options": ["It is Tuesday.", "Nice to meet you too.", "Ten pounds.", "Two tickets, please."], "answer": 1 }, { "band": "A1", "q": "Sara: “I start work at nine.” When does she start?", "options": ["9:00", "7:00", "6:00", "12:00"], "answer": 0 }, { "band": "A1", "q": "Choose the question about a name.", "options": ["How much is it?", "Where do you live?", "What is your name?", "When is the class?"], "answer": 2 }, { "band": "A1", "q": "This is Rania. ___ is my sister.", "options": ["He", "It", "She", "They"], "answer": 2 }, { "band": "A1", "q": "Omar usually ___ coffee before work.", "options": ["drink", "drinking", "drank", "drinks"], "answer": 3 }, { "band": "A1", "q": "There ___ three chairs in the room.", "options": ["is", "are", "am", "be"], "answer": 1 }, { "band": "A1", "q": "What does Leila do?", "options": ["She is a driver.", "She is a shopkeeper.", "She is a pilot.", "She is a nurse."], "answer": 3, "passage": "My name is Leila. I live in Tanta. I am a nurse, and I start work at eight." }, { "band": "A2", "q": "Yesterday, I ___ the bus to work.", "options": ["take", "took", "am taking", "takes"], "answer": 1 }, { "band": "A2", "q": "Notice: “Closed on Fridays. Open 9–5 on other days.” Can you visit at 10 on Thursday?", "options": ["Yes.", "No, it is always closed.", "Only on Friday.", "Only before 9:00."], "answer": 0 }, { "band": "A2", "q": "Choose the polite request.", "options": ["Could you help me with this form?", "I helping you.", "You helped yesterday.", "She helps every day."], "answer": 0 }, { "band": "A2", "q": "I am going to visit my sister next weekend. This is a ___.", "options": ["daily habit", "past event", "future plan", "a finished trip"], "answer": 2 }, { "band": "A2", "q": "For the same journey, the car trip took two hours and the train trip took one hour. The train was ___.", "options": ["faster", "fastest", "more fast", "as slow"], "answer": 0 }, { "band": "A2", "q": "At six yesterday evening, we ___ at the station.", "options": ["was", "are", "were", "be"], "answer": 2 }, { "band": "A2", "q": "Listen! The children ___ in the next room.", "options": ["sang", "sings", "sing", "are singing"], "answer": 3 }, { "band": "A2", "q": "What time should the friend arrive at the station?", "options": ["7:30", "6:30", "7:00", "8:00"], "answer": 1, "passage": "Mona sends a message: Bring your passport. Our train leaves at seven, but please meet me at the station by half past six." }, { "band": "B1", "q": "If the train is late, we ___ a taxi.", "options": ["took", "had taken", "will take", "takes"], "answer": 2 }, { "band": "B1", "q": "“I used to work nights, but now I work mornings.” What changed?", "options": ["The speaker never worked nights.", "The speaker no longer works nights.", "The speaker still always works nights.", "The speaker never works mornings."], "answer": 1 }, { "band": "B1", "q": "“The room was small; however, it was clean and close to the station.” How does the writer see it?", "options": ["There are both drawbacks and benefits.", "Everything about it is bad.", "Its location is unknown.", "The writer mentions only the price."], "answer": 0 }, { "band": "B1", "q": "Which sentence gives a reason?", "options": ["I stayed home because I felt ill.", "I stay home?", "I stayed home tomorrow.", "I stayed home last night."], "answer": 0 }, { "band": "B1", "q": "The woman ___ bag was missing reported it to the police.", "options": ["who", "which", "whose", "where"], "answer": 2 }, { "band": "B1", "q": "If I had a bicycle, I ___ to the nearby college instead of taking the bus.", "options": ["will cycle", "would cycle", "cycled", "have cycled"], "answer": 1 }, { "band": "B1", "q": "These invitations ___ by email every year.", "options": ["are sent", "was sent", "is send", "have sending"], "answer": 0 }, { "band": "B1", "q": "Why did Dina choose the evening class?", "options": ["It was the cheapest class.", "She wanted a class during work.", "The morning teacher refused her.", "Its time fitted her work schedule."], "answer": 3, "passage": "Dina compared two courses. The morning course was cheaper, but it started while she was at work. She chose the evening course even though it cost more." }, { "band": "B2", "q": "If I had known about the delay, I ___ earlier.", "options": ["would leave", "would have left", "will have left", "would be left"], "answer": 1 }, { "band": "B2", "q": "“The scheme may reduce traffic, though its effect on local shops is less certain.” The writer ___.", "options": ["balances a possible benefit with an unresolved risk", "guarantees benefits for every shop", "rejects any traffic benefit", "reports no information about shops"], "answer": 0 }, { "band": "B2", "q": "Which option is most suitable in a formal complaint?", "options": ["Give my money back, mate.", "I would appreciate a written explanation of the charge.", "Money thing bad.", "Yo, what is this charge?"], "answer": 1 }, { "band": "B2", "q": "“Neither proposal is without drawbacks.” This means ___.", "options": ["Both proposals have some disadvantages.", "Both proposals are flawless.", "Only one proposal exists.", "They must be adopted together."], "answer": 0 }, { "band": "B2", "q": "The video proves that Samir was at home throughout the journey. The driver ___ Samir.", "options": ["must have been", "might have been", "cannot have been", "should have been"], "answer": 2 }, { "band": "B2", "q": "If we had checked the address before leaving, we ___ at the wrong building.", "options": ["would not arrive", "would not have arrived", "will not have arrived", "did not arrive"], "answer": 1 }, { "band": "B2", "q": "Which conclusion is best supported by the text?", "options": ["The increase does not yet establish lasting interest.", "The new timetable caused every extra visit.", "Interest will definitely remain high.", "The club had no visitors before the change."], "answer": 0, "passage": "A club changed its timetable and reported more visitors in the first week. However, that week also included free entry and a large advertising campaign. The club has not yet compared attendance after those offers ended. Its manager calls the timetable change a lasting success." }, { "band": "B2", "q": "What is the writer's main reservation?", "options": ["Remote work has no possible benefits.", "Everyone works more productively at home.", "The survey included no remote workers.", "The evidence may not represent people outside the survey."], "answer": 3, "passage": "A company surveyed employees who had volunteered for remote work. Most said they were more productive at home. The company then claimed that remote work would increase productivity for all employees. The writer notes that people who preferred the office were not included in the survey." }], "unit": [{ "q": "اختر تحية مناسبة لأول مقابلة.", "options": ["Hello. My name is Mona.", "Good night yesterday.", "I from Egypt."], "answer": 0, "why": "Hello تحية بسيطة. وبعدها My name is… علشان تقول اسمك." }, { "q": "Complete: I ___ Ahmed.", "options": ["is", "are", "am"], "answer": 2, "why": "مع I نستخدم am. الاختصار I’m." }, { "q": "“Where are you from?” السؤال عن إيه؟", "options": ["البلد أو المكان اللي أنت منه", "الاسم", "الساعة"], "answer": 0, "why": "from هنا معناها من. الرد مثلًا: I’m from Egypt." }, { "q": "اكتب الكلمة الناقصة: My ___ is Hany.", "accepted": ["name"], "why": "My name is Hany. = اسمي هاني." }, { "q": "Complete: She ___ a teacher.", "options": ["am", "are", "is"], "answer": 2, "why": "مع she نستخدم is. She’s a teacher." }, { "q": "Complete: I’m ___ engineer.", "options": ["a", "an", "are"], "answer": 1, "why": "engineer تبدأ بصوت متحرك، فنستخدم an." }, { "q": "Complete: I’m ___ teacher.", "options": ["an", "a", "is"], "answer": 1, "why": "teacher تبدأ بصوت ساكن، فنستخدم a." }, { "q": "اختار ردًا على: Nice to meet you.", "options": ["Nice to meet you too.", "What time is it?", "No, a teacher."], "answer": 0, "why": "Nice to meet you too. = وأنا كمان سعيد إني اتعرفت عليك." }, { "q": "اقرأ: “I’m Dina. I’m from Egypt. I’m an engineer.” What does Dina do?", "options": ["A teacher", "An engineer", "A doctor"], "answer": 1, "why": "Dina قالت I’m an engineer. يعني مهندسة." }, { "q": "اكتب الكلمة الناقصة: I’m ___ Egypt.", "accepted": ["from"], "why": "نقول from قبل البلد اللي إحنا منه." }, { "q": "رتّب الكلمات علشان تقول: اسمك إيه؟", "words": ["name?", "your", "is", "What"], "answerWords": ["What", "is", "your", "name?"], "why": "What is your name? والاختصار What’s your name?" }, { "q": "رتّب علشان تقول: أنا مدرس.", "words": ["teacher.", "a", "am", "I"], "answerWords": ["I", "am", "a", "teacher."], "why": "I am a teacher. أو I’m a teacher." }, { "q": "Complete: What ___ you do?", "options": ["do", "is", "am"], "answer": 0, "why": "What do you do? سؤال شائع عن الشغل. لو مش بتشتغل تقدر تقول I’m not working at the moment." }, { "q": "اختار جملة صحيحة.", "options": ["I from Cairo.", "My name Ahmed.", "My name is Ahmed."], "answer": 2, "why": "My name is… لازم is هنا." }, { "q": "اقرأ: “Hello, I’m Karim. I’m a nurse.” What is his name?", "options": ["Karim", "Nurse", "Hello"], "answer": 0, "why": "I’m Karim. بتحدد الاسم. a nurse بتحدد الوظيفة." }, { "q": "حد سأل: Are you from Egypt? وأنت من مصر. اختار الرد.", "options": ["Yes, I am.", "Yes, I is.", "Yes, from."], "answer": 0, "why": "مع Are you…? نرد عن نفسنا Yes, I am. أو No, I’m not." }] };
const { levels: LEVELS, unit: BASE_UNIT } = DATA;
let TEST = DATA.test.map((q) => ({ ...q, options: [...q.options] }));
const TEST_BANDS = ["A1", "A2", "B1", "B2"];
let UNIT = BASE_UNIT;
const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
let step = 0, answers = [], chosen = null, scores = null, suggested = "A1", goal = "", job = "general", detail = "", field = "", lesson = 0, exercise = 0, done = false, unitScore = 0;
const PATHS = { university: { name: "طلاب الجامعات", icon: "▤", desc: "إنجليزي على حسب تخصصك.", focus: "تعارف ومفردات ومواقف من دراستك الجامعية.", task: "قدّم نفسك لزميل في الجامعة.", example: "Hello. I’m Ali. I’m a university student.", next: "بداية متاحة الآن: 3 مفردات وحوار قصير و4 تدريبات للتخصص، مع أساسيات التعارف." }, work: { name: "الشغل", icon: "↗", desc: "عرّف بنفسك. وضّح فكرتك.", focus: "تعريف مهني بنفسك، أسئلة الشغل، ورسائل ومحادثات عملية.", task: "قدّم نفسك لزميل جديد. قول اسمك وبلدك ودورك بجمل بسيطة.", example: "Hello. My name is Ali. I’m an accountant. I’m from Egypt.", next: "بعد الأساسيات: رسائل قصيرة، مواعيد الشغل، ثم مواقف من مجالك." }, travel: { name: "السفر", icon: "⌁", desc: "اسأل. اطلب. واتحرك بثقة.", focus: "تواصل في المطار والفندق والمطعم، اتجاهات وطلب مساعدة.", task: "قدّم نفسك لشخص تقابله في رحلة، وقول البلد اللي أنت منها.", example: "Hello. My name is Ali. I’m from Egypt. Nice to meet you.", next: "بعد الأساسيات: أرقام وأسعار، طلبات بسيطة، مواصلات وحجز." }, study: { name: "الدراسة", icon: "▤", desc: "افهم. شارك. واسأل براحتك.", focus: "تعريف بنفسك في الفصل، سؤال عن معنى، ومشاركة دراسية.", task: "قدّم نفسك لزميل دراسة. استخدم student لو ده وضع الشخصية.", example: "Hello. My name is Ali. I’m a student. I’m from Egypt.", next: "بعد الأساسيات: أسئلة الفصل، تعليمات الدراسة، ثم قراءة وكتابة مناسبة لمستواك." }, daily: { name: "الحياة اليومية", icon: "◌", desc: "ابدأ حوارًا. وخلي الكلام أسهل.", focus: "تعارف وتواصل في مواقف مألوفة، خدمات ومشتريات بسيطة.", task: "قدّم نفسك لشخص جديد في منطقتك، باسمك وبلدك وشغلك أو وضعك الحالي.", example: "Hello. My name is Ali. I’m from Egypt. I’m a teacher.", next: "بعد الأساسيات: الأسرة، روتين اليوم، التسوق والخدمات." } };
const JOBS = { general: { name: "شغل عام", focus: "التعريف بالدور وطلب توضيح ومواعيد العمل.", example: "I’m an accountant.", meaning: "accountant = محاسب" }, service: { name: "خدمة عملاء ومبيعات", focus: "الترحيب بالعميل، فهم الطلب وشرح خطوة بسيطة.", example: "I’m a sales assistant.", meaning: "sales assistant = موظف مبيعات" }, health: { name: "المجال الصحي", focus: "التعريف بالدور والتواصل المهني البسيط. تدريب لغة فقط، مش تدريبًا أو نصيحة طبية.", example: "I’m a nurse.", meaning: "nurse = ممرض أو ممرضة" }, tech: { name: "تكنولوجيا وهندسة", focus: "التعريف بالتخصص، وصف مهمة وطلب توضيح مشكلة.", example: "I’m an engineer.", meaning: "engineer = مهندس" }, education: { name: "تعليم وتدريب", focus: "التعريف بنفسك لمتعلم، تعليمات بسيطة وطلب توضيح.", example: "I’m a teacher.", meaning: "teacher = مدرس" } };
const LESSONS = [{ title: "ابدأ باسمك.", label: "01 / أول كلمة", body: '<p>مش محتاج تحكي كل حاجة. ابدأ بتحية واسمك والبلد اللي أنت منها.</p><div class="rule en big-phrase">Hello.<br>My name is Mona.<br>I’m from Egypt.</div><details><summary>افتح المعنى</summary><p>Hello = أهلًا. My name is = اسمي. I’m from = أنا من.</p></details><p>الاختصار <b dir="ltr">I’m</b> هو <b dir="ltr">I am</b>. الاتنين صح.</p>' }, { title: "السؤال يفتح كلام.", label: "02 / حوار بسيط", body: '<div class="dialogue en"><p>A: Hi. What’s your name?</p><p>B: I’m Omar. Nice to meet you.</p><p>A: Nice to meet you too. Where are you from?</p><p>B: I’m from Egypt.</p></div><details><summary>افهم الحوار</summary><p>What’s your name? = اسمك إيه؟<br>Where are you from? = أنت منين؟<br>Nice to meet you. = سعيد إني اتعرفت عليك.<br>Nice to meet you too. = وأنا كمان.</p></details>' }, { title: "قول شغلك ببساطة.", label: "03 / كلمة عن دورك", body: '<p>مع وظيفة واحدة نستخدم غالبًا a أو an. الاختيار حسب أول <b>صوت</b>، مش اسم الحرف.</p><div class="rule en big-phrase">I’m a teacher.<br>I’m an engineer.<br>She’s a nurse.</div><p>teacher = مدرس، engineer = مهندس، nurse = ممرض أو ممرضة.</p><div class="note">مع I نستخدم am، ومع he أو she نستخدم is. ما نقولش I from Egypt، محتاجين I’m from Egypt.</div>' }, { title: "اسأل وردّ على راحتك.", label: "04 / خلي الحوار يكمل", body: '<div class="rule en">What do you do?<br>I’m not working at the moment.<br>I’m retired.</div><p>السؤال هنا عن الشغل، مش بتعمل إيه دلوقتي. لو مش شغال حاليًا أو متقاعد، تقدر تقول ده من غير تفاصيل شخصية.</p><div class="rule en">Are you from Egypt?<br>Yes, I am. / No, I’m not.</div><p>لو السؤال عنك بـ Are you…؟ نرد Yes, I am. لو أيوه، أو No, I’m not. لو لأ.</p><p class="muted">قول اسمك وبلدك ووضعك الحالي بصوتك. مفيش تسجيل أو إرسال للصوت.</p>' }];
const FIELDS = { "medicine": { "name": "الطب", "en": "medicine", "words": [["medical student", "طالب طب"], ["patient", "مريض"], ["hospital", "مستشفى"]], "situation": "التعارف مع زميل قبل محاضرة طب، وطلب توضيح كلمة.", "question": "What do you study?", "reply": "I study medicine.", "ask": "What does patient mean?", "answer": "It means a person receiving medical care.", "meaning": "يعني شخصًا بيتلقى رعاية طبية.", "task": "قدّم نفسك كطالب طب لزميل، واسأله عن معنى patient. لا تكتب أي بيانات مرضى.", "note": "تدريب لغة فقط، مش نصيحة طبية أو تدريبًا على التشخيص والعلاج." }, "chemistry": { "name": "الكيمياء", "en": "chemistry", "words": [["laboratory", "معمل"], ["experiment", "تجربة علمية"], ["sample", "عينة"]], "situation": "التعارف مع زميل قبل حصة المعمل، والسؤال عن مكانه.", "question": "What do you study?", "reply": "I study chemistry.", "ask": "Where is the laboratory?", "answer": "It is next to the classroom.", "meaning": "هو بجوار قاعة الدرس.", "task": "قدّم نفسك كطالب كيمياء لزميل، واسأله عن مكان المعمل.", "note": "تدريب لغة فقط. مفيش تعليمات لإجراء تجارب أو التعامل مع مواد كيميائية." }, "cs": { "name": "علوم الحاسب", "en": "computer science", "words": [["code", "كود برمجي"], ["program", "برنامج"], ["error", "خطأ"]], "situation": "التعارف مع زميل في مشروع برمجة، وطلب مساعدته.", "question": "What do you study?", "reply": "I study computer science.", "ask": "Can you help me with this program?", "answer": "Yes. What is the problem?", "meaning": "أيوه. إيه المشكلة؟", "task": "قدّم نفسك كطالب علوم حاسب لزميل، واطلب مساعدته في برنامج.", "note": "دي بداية للمحادثة عن الدراسة، مش دورة برمجة أو شرحًا تقنيًا للكود." }, "is": { "name": "نظم المعلومات", "en": "information systems", "words": [["data", "بيانات"], ["database", "قاعدة بيانات"], ["user", "مستخدم"]], "situation": "التعارف مع زميل في مشروع نظم معلومات، وطلب توضيح مصطلح.", "question": "What do you study?", "reply": "I study information systems.", "ask": "What does database mean?", "answer": "It is an organized collection of data.", "meaning": "هي مجموعة منظّمة من البيانات.", "task": "قدّم نفسك كطالب نظم معلومات، واسأل زميلك عن معنى database. لا تدخل بيانات حقيقية.", "note": "تدريب لغة عن مشروع دراسي، مش تصميم نظام أو التعامل مع بيانات حقيقية." }, "general": { "name": "تخصص آخر / جامعة بشكل عام", "en": "at university", "words": [["lecture", "محاضرة"], ["assignment", "تكليف دراسي"], ["classmate", "زميل دراسة"]], "situation": "التعارف مع زميل في الجامعة والسؤال عن المحاضرة.", "question": "Are you a university student?", "reply": "Yes, I am.", "ask": "Where is the lecture?", "answer": "It is in room ten.", "meaning": "في القاعة رقم عشرة.", "task": "قدّم نفسك كطالب جامعة، واسأل زميلك عن مكان المحاضرة.", "note": "التخصص ده له بداية جامعية عامة حاليًا، مش محتوى متخصص في مجالك." } };
function view(id, stage) {
  $("#welcome").classList.add("hide");
  $("#journey").classList.remove("hide");
  ["placement", "needs", "plan", "unit", "coach"].forEach((x) => $("#" + x).classList.toggle("hide", x !== id));
  $$("[data-stage]").forEach((x) => {
    x.classList.toggle("active", x.dataset.stage === (stage || id));
    if (x.dataset.stage === (stage || id)) x.setAttribute("aria-current", "step");
    else x.removeAttribute("aria-current");
  });
  window.scrollTo({ top: 0, behavior: "instant" });
  const h = $("#" + id + " h2");
  if (h) {
    h.setAttribute("tabindex", "-1");
    h.focus({ preventScroll: true });
  }
}
function startTest() {
  step = 0;
  answers = [];
  scores = null;
  TEST = DATA.test.map((q) => {
    const opts = q.options.map((text, i) => ({ text, correct: i === q.answer }));
    for (let i = opts.length - 1; i > 0; i--) {
      const a = new Uint32Array(1);
      crypto.getRandomValues(a);
      const j = a[0] % (i + 1);
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return { ...q, options: opts.map((o) => o.text), answer: opts.findIndex((o) => o.correct) };
  });
  view("placement");
  renderTest();
}
function renderTest() {
  chosen = null;
  let q = TEST[step];
  $("#test-card").innerHTML = '<div class="q-top"><span>السؤال ' + (step + 1) + " من " + TEST.length + '</span><span>اختار إجابة واحدة</span></div><div class="progress"><span style="width:' + step / TEST.length * 100 + '%"></span></div>' + (q.passage ? '<div class="placement-passage en" aria-label="Reading text">' + esc(q.passage) + "</div>" : "") + '<h3 class="en">' + esc(q.q) + '</h3><div class="opts">' + q.options.map((o, i) => '<button class="opt en" data-pick="' + i + '" aria-pressed="false"><span class="opt-letter">' + String.fromCharCode(65 + i) + "</span><span>" + esc(o) + "</span></button>").join("") + '</div><div class="q-actions"><button id="test-unknown" class="text-button">مش عارف</button><button id="test-next" class="button primary" disabled>' + (step === TEST.length - 1 ? "شوف نقطة بدايتك" : "التالي ←") + "</button></div>";
  $$("[data-pick]").forEach((b) => b.onclick = () => {
    chosen = +b.dataset.pick;
    $$("[data-pick]").forEach((x) => {
      x.classList.toggle("selected", x === b);
      x.setAttribute("aria-pressed", String(x === b));
    });
    $("#test-next").disabled = false;
  });
  $("#test-next").onclick = () => advance(chosen);
  $("#test-unknown").onclick = () => advance(-1);
}
function route(sc) {
  let confirmed = "A1";
  for (let i = 0; i < TEST_BANDS.length; i++) {
    const count = TEST.filter((q) => q.band === TEST_BANDS[i]).length;
    if (sc[i] < Math.ceil(count * 0.875)) break;
    confirmed = TEST_BANDS[i];
  }
  return confirmed;
}
function advance(a) {
  answers.push(a);
  if (++step < TEST.length) renderTest();
  else {
    scores = TEST_BANDS.map((l) => TEST.reduce((n, q, i) => n + (q.band === l && answers[i] === q.answer ? 1 : 0), 0));
    suggested = route(scores);
    openNeeds();
  }
}
function openNeeds() {
  view("needs");
  $("#placement-mini").classList.remove("hide");
  $("#placement-mini").innerHTML = scores ? 'نقطة البداية المقترحة: <strong dir="ltr">' + suggested + "</strong> تقدير مبدئي، مش شهادة." : 'اخترت البداية من <strong dir="ltr">A1</strong> من غير اختبار. ممكن ترجع للتقييم في أي وقت.';
  renderGoals();
}
function renderGoals() {
  $("#goal-choices").innerHTML = Object.entries(PATHS).map(([k, g]) => '<button class="goal-choice glass ' + (goal === k ? "selected" : "") + '" data-goal="' + k + '" aria-pressed="' + (goal === k) + '"><span class="goal-icon" aria-hidden="true">' + g.icon + "</span><b>" + g.name + "</b><small>" + g.desc + "</small></button>").join("");
  $$("[data-goal]").forEach((b) => b.onclick = () => {
    goal = b.dataset.goal;
    $("#needs-error").textContent = "";
    renderGoals();
  });
  $("#job-fields").classList.toggle("hide", goal !== "work");
  $("#university-fields").classList.toggle("hide", goal !== "university");
}
function saveNeeds() {
  if (!goal) {
    $("#needs-error").textContent = "اختار هدفك الأول علشان نعرف نقترح تركيزًا مناسبًا.";
    return;
  }
  field = $("#need-field").value;
  if (goal === "university" && !FIELDS[field]) {
    $("#needs-error").textContent = "اختار تخصصك الأول، أو اختار بداية جامعية عامة.";
    $("#need-field").focus();
    return;
  }
  job = $("#need-job").value;
  detail = $("#job-detail").value.trim();
  renderPlan();
  view("plan");
}
function renderPlan() {
  let keys = TEST_BANDS;
  $("#result").innerHTML = '<div class="plan-overview"><div class="result-block"><span class="eyebrow">' + (scores ? "نقطة بداية مقترحة" : "بدايتك المختارة") + '</span><h3 dir="ltr">' + suggested + "</h3><p>" + (scores ? "نقطة بداية تجريبية للقراءة واستخدام اللغة فقط، مش إثبات مستوى شامل." : "اخترت تبدأ الأساسيات من غير تقييم.") + '</p></div><div class="plan-copy"><span class="eyebrow">إيه اللي نستهدفه هنا؟</span><p>' + esc(LEVELS[suggested].goal) + "</p>" + (scores ? '<div class="score-grid">' + keys.map((l, i) => "<div><b>" + l + "</b>" + scores[i] + " / " + TEST.filter((q) => q.band === l).length + "</div>").join("") + "</div>" : "") + '<details><summary>افهم النتيجة وحدودها</summary><p class="micro">الاختبار فيه 32 سؤالًا أصليًا في القراءة واستخدام اللغة، 8 أسئلة لكل حزمة. نقترح آخر حزمة حققت فيها 7 من 8 على الأقل، بشرط تحقيق الحد نفسه في كل الحزم الأسهل. لو الأساسيات لسه محتاجة شغل، البداية A1. دي قاعدة بداية حذرة، مش اختبار CEFR معياريًا أو ضمانًا لمستواك. الاستماع والمحادثة والكتابة ما اتقاستش، ومش بنمنح C1 أو C2 من الاختبار ده. لتحديد أدق لازم تقييم المهارات مع مدرس.</p></details><button id="repeat-test" class="text-button">أعد الاختبار ↻</button></div></div>';
  $("#repeat-test").onclick = startTest;
  let p = PATHS[goal], j = JOBS[job];
  $("#personal-plan").innerHTML = '<div class="personal-card"><span class="eyebrow">تركيزك: ' + esc(p.name) + "</span><h3>لغة تنفعك في موقف حقيقي.</h3><p>" + esc(p.focus) + "</p>" + (goal === "work" ? "<p><b>" + esc(j.name) + ":</b> " + esc(j.focus) + "</p>" + (detail ? '<p class="muted">المسمى اللي كتبته: ' + esc(detail) + ". أمثلة النموذج حسب فئة المجال، مش تفصيل المسمى.</p>" : "") : "") + (goal === "university" ? "<p><b>" + esc(FIELDS[field].name) + ":</b> " + esc(FIELDS[field].situation) + '</p><p class="micro">' + esc(FIELDS[field].note) + "</p>" : "") + "<p>" + esc(p.next) + '</p><div class="note">' + (suggested !== "A1" ? "المحتوى المناسب لـ " + suggested + " لسه مخطط له. تقدر تستكشف وحدة A1 كنموذج للأسلوب، لكنها مش بديلًا عن مستواك." : "ابدأ بوحدة التعارف، ومهمتك فيها بتتغير حسب هدفك.") + ' المسار الكامل لكل وظيفة أو تخصص لسه مش جاهز.</div><div class="personal-actions"><button id="go-unit" class="button primary">' + (suggested === "A1" ? "ابدأ أول مقابلة" : "استكشف نموذج A1") + ' <span>←</span></button><button id="open-coach" class="button secondary">جرّب المساعد الذكي</button><button id="change-needs" class="text-button">عدّل هدفك</button></div></div>';
  $("#go-unit").onclick = () => {
    prepareUnit();
    renderContext();
    view("unit", "plan");
    showPart("learn");
  };
  $("#change-needs").onclick = openNeeds;
  $("#open-coach").onclick = openCoach;
  showLevel(suggested);
}
function showLevel(l) {
  $("#level-tabs").innerHTML = Object.keys(LEVELS).map((k) => '<button data-level="' + k + '" class="' + (k === l ? "selected" : "") + '" aria-pressed="' + (k === l) + '">' + k + "</button>").join("");
  $$("[data-level]").forEach((b) => b.onclick = () => showLevel(b.dataset.level));
  $("#level-content").innerHTML = '<span class="pill">' + l + "</span><h3>" + esc(LEVELS[l].goal) + "</h3><ol>" + LEVELS[l].units.map((u, i) => "<li>" + esc(u) + "<small>" + (l === "A1" && i === 0 ? "متاحة الآن للتجربة" : "وحدة مخطط لها، غير متاحة بعد") + "</small></li>").join("") + '</ol><p class="micro">كل وحدة مخطط لها قراءة واستماع ومحادثة وكتابة ومهمة عملية. وحدة A1 الحالية مكتوبة فقط، والفيديو لسه مش جاهز.</p>';
}
function renderContext() {
  let p = PATHS[goal], j = JOBS[job];
  $("#unit-context").innerHTML = "<b>على هدفك: " + esc(p.name) + "</b><p>" + esc(p.task) + "</p>";
  $("#task-prompt").textContent = p.task + " استخدم 3 جمل عن شخصية تختارها، مش لازم بياناتك الحقيقية.";
  $("#task-model").textContent = goal === "work" ? "Hello. My name is Ali. " + j.example + " I’m from Egypt." : p.example;
  if (goal === "work") $("#unit-context").innerHTML += '<p class="en">' + esc(j.example) + "</p><small>" + esc(j.meaning) + "</small>";
  if (goal === "university") {
    let f = FIELDS[field];
    $("#unit-context").innerHTML = "<b>من دراستك: " + esc(f.name) + "</b><p>" + esc(f.situation) + '</p><p class="en">' + esc(f.reply) + "</p><small>" + esc(f.note) + "</small>";
    $("#task-prompt").textContent = f.task + " استخدم شخصية خيالية لو تحب. جرّب الحوار بصوتك، من غير تسجيل أو إرسال.";
    $("#task-model").textContent = "Hello. My name is Ali. " + (field === "general" ? "I’m a university student." : f.reply) + " " + f.ask;
  }
}
function fieldLesson() {
  let f = FIELDS[field];
  return { title: "الإنجليزي في " + f.name + ".", label: "05 / من كليتك", body: "<p>" + esc(f.situation) + '</p><div class="rule en big-phrase">' + esc(field === "general" ? "I’m a university student." : f.reply) + '</div><p>قول أنا بدرس + اسم التخصص. في الاختيار الجامعي العام، قول I’m a university student.</p><div class="field-vocabulary">' + f.words.map((w) => '<div class="rule"><b dir="ltr">' + esc(w[0]) + "</b><p>" + esc(w[1]) + "</p></div>").join("") + '</div><div class="dialogue en"><p>A: ' + esc(f.question) + "</p><p>B: " + esc(f.reply) + "</p><p>A: " + esc(f.ask) + "</p><p>B: " + esc(f.answer) + "</p></div><details><summary>افهم آخر رد</summary><p>" + esc(f.meaning) + '</p></details><p class="note">' + esc(f.note) + "</p>" };
}
function activeLessons() {
  return goal === "university" ? [...LESSONS, fieldLesson()] : LESSONS;
}
function prepareUnit() {
  UNIT = BASE_UNIT;
  if (goal === "university") {
    let f = FIELDS[field];
    UNIT = [...BASE_UNIT, { q: "اختار الرد المناسب على: " + f.question, options: [f.reply, "I am from Egypt.", "Nice to meet you."], answer: 0, why: f.reply + " هنا بنجاوب عن الدراسة، مش البلد أو التحية." }, { q: "في سياق دراستك، معنى " + f.words[0][0] + " إيه؟", options: ["موعد سفر", f.words[0][1], "عنوان منزل"], answer: 1, why: f.words[0][0] + " = " + f.words[0][1] + "." }, { q: "اختار جملة مناسبة للموقف: " + f.situation, options: ["Good night.", "I am from Cairo.", f.ask], answer: 2, why: f.ask + " السؤال ده مناسب للموقف اللي اتدربنا عليه." }, { q: "في سياق دراستك، معنى " + f.words[1][0] + " إيه؟", options: [f.words[1][1], "وجبة غداء", "وسيلة مواصلات"], answer: 0, why: f.words[1][0] + " = " + f.words[1][1] + "." }];
  }
  lesson = 0;
  $("#unit-question").innerHTML = "";
  resetUnit();
  $("#lesson-task textarea").value = "";
}
function showPart(part) {
  ["learn", "practice", "task"].forEach((p) => $("#lesson-" + p).classList.toggle("hide", p !== part));
  $$("[data-part]").forEach((b) => {
    b.classList.toggle("active", b.dataset.part === part);
    b.setAttribute("aria-pressed", String(b.dataset.part === part));
  });
  if (part === "learn") renderLesson();
  if (part === "practice" && !$("#unit-question").innerHTML) renderExercise();
}
function renderLesson() {
  let lessons = activeLessons(), l = lessons[lesson];
  $("#lesson-card").innerHTML = '<span class="eyebrow">' + l.label + "</span><h3>" + l.title + "</h3>" + l.body;
  $("#lesson-count").textContent = lesson + 1 + " / " + lessons.length;
  $("#lesson-prev").disabled = lesson === 0;
  $("#lesson-next").textContent = lesson === lessons.length - 1 ? "يلا نجرّب ←" : "التالي ←";
}
function resetUnit() {
  exercise = 0;
  unitScore = 0;
  $("#unit-summary").classList.add("hide");
  $("#unit-question").classList.remove("hide");
  renderExercise();
}
function renderExercise() {
  done = false;
  let q = UNIT[exercise];
  $("#unit-count").textContent = exercise + 1 + " / " + UNIT.length;
  $("#unit-bar").style.width = exercise / UNIT.length * 100 + "%";
  $("#unit-question").innerHTML = '<div class="q-top"><span>تدريب ' + (exercise + 1) + " من " + UNIT.length + "</span><span>" + (q.options ? "اختار" : q.accepted ? "اكتب" : "رتب") + '</span></div><h3 dir="auto">' + esc(q.q) + "</h3>" + (q.options ? '<div class="opts">' + q.options.map((o, i) => '<button class="opt" dir="auto" data-answer="' + i + '">' + esc(o) + "</button>").join("") + "</div>" : q.accepted ? '<input id="unit-input" dir="ltr" aria-label="إجابتك" autocomplete="off"><button class="button secondary check" style="margin-top:15px">تحقق من إجابتي</button>' : '<div class="chips">' + q.words.map((w, i) => '<button data-token="' + i + '">' + esc(w) + "</button>").join("") + '</div><div class="built" aria-label="جملتك"></div><button class="button secondary check">تحقق من الترتيب</button>') + '<div class="feedback" role="status" aria-live="polite"></div><button id="unit-next" disabled class="button primary full hide" style="margin-top:18px">' + (exercise === UNIT.length - 1 ? "شوف نتيجة تدريبك" : "التالي ←") + "</button>";
  const card = $("#unit-question");
  const submit = (ok) => {
    if (done) return;
    done = true;
    if (ok) unitScore++;
    card.querySelectorAll("button,input").forEach((x) => x.disabled = true);
    let f = card.querySelector(".feedback");
    f.classList.toggle("warn", !ok);
    f.textContent = (ok ? "✓ صح. " : "راجعها بهدوء. ") + q.why;
    $("#unit-next").classList.remove("hide");
    $("#unit-next").disabled = false;
    $("#unit-bar").style.width = (exercise + 1) / UNIT.length * 100 + "%";
  };
  if (q.options) card.querySelectorAll("[data-answer]").forEach((b) => b.onclick = () => {
    let ok = +b.dataset.answer === q.answer;
    b.classList.add(ok ? "correct" : "wrong");
    card.querySelectorAll("[data-answer]")[q.answer].classList.add("correct");
    submit(ok);
  });
  else if (q.accepted) {
    const check = () => {
      let x = $("#unit-input").value.trim().toLowerCase().replace(/[.!?]+$/, "");
      if (!x) {
        card.querySelector(".feedback").textContent = "اكتب إجابتك الأول.";
        return;
      }
      submit(q.accepted.includes(x));
    };
    card.querySelector(".check").onclick = check;
    $("#unit-input").onkeydown = (e) => {
      if (e.key === "Enter") check();
    };
  } else {
    let pool = card.querySelector(".chips"), built = card.querySelector(".built");
    card.querySelectorAll("[data-token]").forEach((b) => b.onclick = () => (b.parentElement === pool ? built : pool).appendChild(b));
    card.querySelector(".check").onclick = () => {
      let got = [...built.querySelectorAll("button")].map((b) => b.textContent);
      if (got.length !== q.answerWords.length) {
        card.querySelector(".feedback").textContent = "استخدم كل الكلمات الأول.";
        return;
      }
      submit(got.every((w, i) => w === q.answerWords[i]));
    };
  }
  $("#unit-next").onclick = () => {
    if (++exercise < UNIT.length) {
      renderExercise();
      $("#unit-question").scrollIntoView({ block: "start", behavior: "instant" });
    } else finishUnit();
  };
}
function finishUnit() {
  $("#unit-question").classList.add("hide");
  $("#unit-summary").classList.remove("hide");
  $("#unit-count").textContent = UNIT.length + " / " + UNIT.length;
  $("#unit-summary").innerHTML = '<span class="eyebrow">خطوة اتحسبت.</span><h3>خلصت تدريب أول مقابلة.</h3><span class="completion-score" dir="ltr">' + unitScore + " / " + UNIT.length + '</span><p>دي نتيجة تدريب الوحدة، مش تحديد مستوى CEFR. راجع تفسير الإجابات، وخد الخطوة العملية.</p><button id="finish-task" class="button primary">دلوقتي اتكلم بطريقتك ←</button>';
  $("#finish-task").onclick = () => showPart("task");
}
$("#start-test").onclick = startTest;
$("#skip-test").onclick = () => {
  scores = null;
  suggested = "A1";
  openNeeds();
};
$("#needs-next").onclick = saveNeeds;
$("#back-plan").onclick = () => view("plan");
$$("[data-part]").forEach((b) => b.onclick = () => showPart(b.dataset.part));
$("#lesson-prev").onclick = () => {
  if (lesson > 0) {
    lesson--;
    renderLesson();
  }
};
$("#lesson-next").onclick = () => {
  if (lesson < activeLessons().length - 1) {
    lesson++;
    renderLesson();
  } else showPart("practice");
};
$("#retry-unit").onclick = resetUnit;
let coachHistory = [], coachBusy = false, coachController = null, coachVersion = 0, coachTurns = 0, coachLast = 0;
function clearCoach() {
  coachVersion++;
  coachController == null ? void 0 : coachController.abort();
  coachController = null;
  coachHistory = [];
  coachBusy = false;
  coachTurns = 0;
  coachLast = 0;
  $("#coach-log").replaceChildren();
  $("#coach-input").value = "";
  $("#coach-consent").checked = false;
  $("#coach-send").disabled = false;
  $("#coach-status").textContent = "المحادثة اتمسحت من الصفحة. المسح لا يلغي معالجة طلب سبق إرساله للمزود.";
}
function openCoach() {
  clearCoach();
  $("#coach-status").textContent = "مفيش إرسال تلقائي. راجع الخصوصية، ثم اكتب أو اختار بداية.";
  $("#coach-context").textContent = "تدريب: " + suggested + " · " + PATHS[goal].name + (goal === "university" ? " · " + FIELDS[field].name : goal === "work" ? " · " + JOBS[job].name : "") + "، تقدير تجريبي مش شهادة.";
  view("coach", "plan");
}
function coachBubble(role, text) {
  let b = document.createElement("div");
  b.className = "coach-message " + role;
  let label = document.createElement("small");
  label.textContent = role === "user" ? "جملتك الخيالية" : "المساعد الآلي";
  let content = document.createElement("div");
  content.dir = "auto";
  content.textContent = text;
  b.append(label, content);
  $("#coach-log").append(b);
  b.scrollIntoView({ block: "nearest", behavior: "instant" });
}
function privateCoachText(t) {
  return /[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?\d[\s().-]*){7,}|https?:|www\.|\b(my (?:full )?name is|my (?:phone|number|address|email)|i live (?:at|in)|password|passport|credit card)\b|(?:اسمي|إسمي|عنواني|رقمي|بريدي|كلمة السر|رقم قومي)/iu.test(t);
}
async function sendCoach() {
  if (coachBusy) return;
  const text = $("#coach-input").value.trim();
  if (!$("#coach-consent").checked) {
    $("#coach-status").textContent = "راجع وفعّل موافقة المعالجة الخارجية الأول. لسه مفيش حاجة اتبعتت.";
    return;
  }
  if (!text) {
    $("#coach-status").textContent = "اكتب جملة أو اضغط اقترح لي بداية.";
    return;
  }
  if (privateCoachText(text)) {
    $("#coach-status").textContent = "احذف الأسماء والأرقام والعناوين وأي بيانات شخصية. استخدم موقفًا خياليًا من غير تعريف بنفسك.";
    return;
  }
  if (coachTurns >= 12) {
    $("#coach-status").textContent = "وصلنا لنهاية التدريب القصير. راجع الحوار، أو امسحه وابدأ تدريبًا جديدًا.";
    return;
  }
  if (Date.now() - coachLast < 8e3) {
    $("#coach-status").textContent = "استنى ثواني قبل الرسالة التالية.";
    return;
  }
  coachBusy = true;
  $("#coach-send").disabled = true;
  $("#coach-status").textContent = "المساعد بيحضّر الرد…";
  const version = coachVersion;
  coachController = new AbortController();
  let timeout = setTimeout(() => coachController == null ? void 0 : coachController.abort(), 45e3);
  const history = [...coachHistory.slice(-6), { role: "user", content: text }];
  try {
    const r = await fetch("https://english-savant-ai.basemhreaz.workers.dev/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "adult-chat", level: suggested, goal, field: goal === "university" ? field : goal === "work" ? job : "general", messages: history }), signal: coachController.signal, credentials: "omit", cache: "no-store", referrerPolicy: "no-referrer" });
    const data = await r.json();
    if (version !== coachVersion) return;
    if (!r.ok || typeof data.text !== "string" || !data.text.trim()) throw Error(data.error === "personal" ? "personal" : "service");
    coachBubble("user", text);
    coachBubble("assistant", data.text.replace(/\*\*([^*]+)\*\*/g, "$1"));
    coachHistory = [...history, { role: "assistant", content: data.text }];
    coachTurns++;
    coachLast = Date.now();
    $("#coach-input").value = "";
    $("#coach-status").textContent = "رد آلي ممكن يغلط. " + coachTurns + " / 12 رسائل في التدريب القصير.";
  } catch (e) {
    if (version === coachVersion) $("#coach-status").textContent = e.message === "personal" ? "احذف البيانات الشخصية واستخدم جملًا خيالية. الرسالة لم تُعالج بالذكاء الاصطناعي." : "المساعد غير متاح دلوقتي أو الحد المجاني خلص. رسالتك لسه موجودة، جرّب لاحقًا أو افتح البديل الجاهز. مش هنحوّلك لخدمة مدفوعة.";
  } finally {
    clearTimeout(timeout);
    if (version === coachVersion) {
      coachBusy = false;
      $("#coach-send").disabled = false;
    }
  }
}
$("#coach-send").onclick = sendCoach;
$("#coach-clear").onclick = clearCoach;
$("#coach-back").onclick = () => {
  clearCoach();
  view("plan");
};
$("#coach-starter").onclick = () => {
  $("#coach-input").value = goal === "university" ? "Let us practise a fictional conversation with a classmate about " + FIELDS[field].en + ". Ask me one short question." : goal === "work" ? "Let us practise a fictional workplace conversation. Ask me one short question." : "Let us practise a fictional " + goal + " conversation. Ask me one short question.";
  $("#coach-input").focus();
};
window.PILOT = { get TEST() {
  return TEST;
}, get UNIT() {
  return UNIT;
}, route, FIELDS };
window.addEventListener("DOMContentLoaded", () => {
  const a = document.querySelector(".adult-menu a[aria-current]");
  if (a) a.addEventListener("click", (e) => {
    e.preventDefault();
    clearCoach();
    document.querySelector("#journey").classList.add("hide");
    document.querySelector("#welcome").classList.remove("hide");
    window.scrollTo({ top: 0, behavior: "instant" });
    document.querySelector("#start-test").focus();
  });
});
