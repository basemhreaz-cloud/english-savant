/* ENGLISH SAVANT native page templates: unit practice sets and practice banks. */
(function(){
'use strict';
var ESX=window.ESX=window.ESX||{};
var SELF=(document.currentScript&&document.currentScript.src)||'';
var BASE=SELF?SELF.replace(/[^\/]*$/,''):'';
function lang(){return window.DS?DS.lang():'ar'}
ESX.lang=lang;
/* ---- i18n for interface text (content from data files is never translated) ---- */
var D={
'الشرح التفاعلي':'Interactive lesson','الأنشطة التفاعلية':'Interactive activities','كل محطة بتصحح فورًا بعد كل سؤال.':'Every station checks your answer right after each question.',
'اتعلّم محتوى الوحدة الأول، وبعدين اختبر نفسك في المحطات تحت.':'Learn the unit first, then test yourself at the stations below.',
'بنحضّر الأنشطة…':'Getting the activities ready…','بنحضّر الشرح…':'Getting the lesson ready…','بنجهّز الدروس…':'Getting the lessons ready…',
'حاول تاني من الأول':'Start over','خلّصت الوحدة!':'Unit complete!','خلّصت المحطة!':'Station complete!','خلّصت المراجعة!':'Review complete!','حاول المحطة تاني':'Try this station again',
'صفحة الصف':'Grade page','رجوع لصفحة الصف':'Back to the grade page','تدريبات الوحدة':'Unit practice','حقوق الصور التعليمية':'Educational image credits',
'افتح شرح الوحدة':'Open the unit lesson','شرح الوحدة':'Unit lesson','الشرح':'Lesson','البطاقات':'Cards','التدريب السابق':'Previous practice','التدريب التالي':'Next practice',
'تدريبات أصلية بالتصحيح الفوري. لو محتاج تراجع الفكرة، افتح صفحة الشرح المستقلة أولًا.':'Original exercises with instant checking. If you need a refresher, open the lesson page first.',
'تدريبات المراجعة':'Review practice','افتح شرح المراجعة':'Open the review lesson','شرح المراجعة':'Review lesson',
'أنشطة التقييمات الوزارية':'Ministry assessment activities','اختبارات الوحدات':'Unit tests',
'اتعلّم كلمات الوحدة':'Learn the unit words','دوس على البطاقة، والكلمة هتتبني حرف حرف.':'Tap a card and the word builds letter by letter.',
'اتعلّم جمل الوحدة':'Learn the unit sentences','دوس على الجملة، وهتتبني كلمة كلمة بالترتيب الصح.':'Tap a sentence and it builds word by word in the right order.',
'لغة الوحدة':'Unit language','اتعلّم الأصوات':'Learn the sounds','دوس على الكلمة، والصوت هيتحدد جواها.':'Tap a word and its sound lights up inside it.','الشرح بيتجهز.':'The lesson is on its way.',
'تحقق':'Check','اكتب هنا…':'Type here…','الكلمة الصح…':'The right word…','كمل كل الفراغات الأول.':'Fill in all the blanks first.','استخدم كل الكلمات.':'Use all the words.',
'صح':'True','غلط':'False','أحسنت، إجابة صحيحة':'Well done, that is correct','الإجابة الصحيحة: ':'Correct answer: ',
'علامة كاملة!':'Full marks!','ممتاز! قريب جدًا من العلامة الكاملة.':'Excellent! Very close to full marks.','كويس، راجع الغلط وحاول تاني.':'Good, review the mistakes and try again.','محتاج مراجعة، جرب المحطات تاني.':'Needs a review, try the stations again.',
'اختر الإجابة الصحيحة':'Choose the correct answer','اختر الصوت الناقص':'Choose the missing sound','اكتب التصريف الصحيح':'Write the correct form','أكمل الفراغ':'Complete the blank','رتّب الحروف واكتب الكلمة':'Unscramble the letters and write the word','رتّب الكلمات وكوّن الجملة':'Put the words in order to make a sentence','صح أم غلط':'True or false','اكتب الإجابة':'Write the answer','رتّب من الأكثر للأقل':'Order from most to least','اكتب الحرف الناقص':'Write the missing letter',
'الوحدة دي لسه مش جاهزة. جرب صفحة ':'This unit is not ready yet. Try the ','تدريبات الوحدة ':'Unit practice ',
'اكتب الصيغة الصحيحة':'Write the correct form','اختار الإجابة':'Choose the answer','أكمل من الكلمات':'Complete from the words','الحرف الناقص':'Missing letter','رتب الحروف':'Unscramble the letters','رتب الكلمات':'Order the words','صل المعنى':'Match the meaning','اكتب بنفسك':'Write it yourself','انسخ الجملة':'Copy the sentence','اقرأ وجاوب':'Read and answer','الحروف الكبيرة والترقيم':'Capital letters and punctuation',
'اكتب الصيغة الصحيحة للجزء الموجود بين القوسين فقط.':'Write the correct form of the part in brackets only.','اختار إجابة واحدة.':'Choose one answer.','اكتب الكلمة المناسبة من الصندوق.':'Type the right word from the box.','اكتب الحرف الناقص بس.':'Type the missing letter only.','اكتب الكلمة بعد ترتيب حروفها.':'Type the word after ordering its letters.',
'دوس على الكلمات بالترتيب. هنظبط الحرف الأول وعلامة النهاية. تقدر ترجع آخر كلمة أو تبدأ من جديد.':'Tap the words in order. We fix the first capital letter and the end mark for you. You can undo the last word or start again.',
'وصل الكلمة أو الجملة بالمعنى المناسب: اختار المعنى.':'Match the word or sentence to the right meaning.','اكتب إجابتك، وبعدها قارن بالنموذج. الكتابة الحرة محتاجة مراجعة بشرية.':'Write your answer, then compare it with the model. Free writing needs a human review.',
'انسخ الجملة زي ما هي، بالحروف الكبيرة وعلامات الترقيم.':'Copy the sentence exactly, with capital letters and punctuation.','اقرأ القطعة الأول. الإجابة موجودة في النص.':'Read the passage first. The answer is in the text.','اكتب الجملة تاني بالحروف الكبيرة وعلامات الترقيم المناسبة.':'Write the sentence again with the right capital letters and punctuation.',
'المتصفح مش بيسمح بحفظ التقدم. تقدر تكمل هنا عادي.':'Your browser does not allow saving progress. You can keep going here.',
'القطعة المرتبطة بالسؤال':'Passage for this question','شوف النموذج وقارن':'See the model and compare','راجع إجابتي':'Check my answer','رجّع آخر كلمة':'Undo last word','ابدأ الترتيب تاني':'Start the order again','إجابتك':'Your answer',
'جرّب تكتب أو تختار إجابتك الأول.':'Try typing or choosing your answer first.','إجابتك مطابقة للنموذج.':'Your answer matches the model.','نموذج إجابة صحيح. صياغتك ممكن تختلف وتكون صحيحة برضه.':'A correct model answer. Your wording may differ and still be right.',
'راجع بداية الجملة والأسماء وعلامة النهاية. فيه ترقيم صحيح ممكن يختلف حسب المعنى.':'Check the start of the sentence, the names and the end mark. Correct punctuation can vary with meaning.','قارن المعنى والقواعد. لو مش متأكد، اعرض إجابتك على مدرسك.':'Compare the meaning and the grammar. If you are not sure, show your answer to your teacher.',
'السؤال ده للمراجعة، مش محسوب كتصحيح آلي صح أو غلط.':'This question is for review. It is not scored as right or wrong.','أحسنت! إجابتك صح.':'Well done! Your answer is correct.','جرّب تاني. ':'Try again. ','راجع كل الحروف وعلامات الترقيم مع الجملة الأصلية.':'Check every letter and punctuation mark against the original sentence.','الإجابة الصحيحة:':'Correct answer:','شرح الفكرة':'Explanation',
'رجوع لتقييماتنا':'Back to our assessments','نوع السؤال':'Question type','كل الأسئلة':'All questions','السابق':'Previous','التالي':'Next','اختار رقم سؤال':'Pick a question number',
'تقدمك محفوظ على الجهاز ده بس، ومش بيتبعت لحد. الكتابة الحرة لها نموذج، مش درجة آلية.':'Your progress is saved on this device only and is never sent to anyone. Free writing has a model answer, not an automatic score.',
'امسح تقدمي في الوحدة دي':'Clear my progress in this unit','الأسئلة مش متاحة دلوقتي':'The questions are not available right now','جرّب تحميل الصفحة تاني لما الاتصال يرجع.':'Try loading the page again when the connection is back.','حاول تاني':'Try again','تقييماتنا':'Our assessments',
'بنجهز أسئلة الوحدة…':'Getting the unit questions ready…','القطعة':'Passage','عدد الكلمات: ':'Word count: ','الكلمات المتاحة':'Available words','الإجابات':'Answers','ترتيبك الحالي':'Your current order','الكلمات':'Words','الأسئلة اللي راجعتها':'Questions you reviewed',
'الصف الأول الابتدائي':'Primary 1','الصف التاني الابتدائي':'Primary 2','الصف التالت الابتدائي':'Primary 3','الصف الرابع الابتدائي':'Primary 4','الصف الخامس الابتدائي':'Primary 5','الصف السادس الابتدائي':'Primary 6','الصف الأول الإعدادي':'Preparatory 1','الصف التاني الإعدادي':'Preparatory 2','الصف التالت الإعدادي':'Preparatory 3',
'الصفحة مش موجودة':'This page was not found','الصفحة دي مش موجودة':'This page was not found','ارجع للرئيسية':'Back to home','الرئيسية':'Home','فتح الشرح':'Open the lesson'
};
D['جرّب تاني.']='Try again.';D['تدريبات']='Practice';D['المحطات']='Stations';D['راجعت']='Reviewed';D['صحيحة']='Correct';D['مع النموذج']='With model';D['فهرس المحطات']='Station index';
var GRADE={'الأول الابتدائي':'Primary 1','التاني الابتدائي':'Primary 2','التالت الابتدائي':'Primary 3','الرابع الابتدائي':'Primary 4','الخامس الابتدائي':'Primary 5','السادس الابتدائي':'Primary 6','الأول الإعدادي':'Preparatory 1','التاني الإعدادي':'Preparatory 2','التالت الإعدادي':'Preparatory 3'};
var AD={'٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9'};
function dg(s){return String(s).replace(/[٠-٩]/g,function(c){return AD[c]})}
var R=[
[/^منهج الصف (.+?) · الوحدة ([٠-٩0-9]+)$/,function(m){return (GRADE[m[1]]||m[1])+' curriculum · Unit '+dg(m[2])}],
[/^منهج الصف (.+?) · مراجعة$/,function(m){return (GRADE[m[1]]||m[1])+' curriculum · Revision'}],
[/^المنهج السعودي · (.+?) · الجزء الأول · الوحدة ([٠-٩0-9]+)$/,function(m){return 'Saudi curriculum · '+m[1]+' · Part 1 · Unit '+dg(m[2])}],
[/^تدريب ([٠-٩0-9]+) من ([٠-٩0-9]+) · منهج الصف (.+?) · (الوحدة ([٠-٩0-9]+)|مراجعة)$/,function(m){return 'Practice '+dg(m[1])+' of '+dg(m[2])+' · '+(GRADE[m[3]]||m[3])+' curriculum · '+(m[5]?'Unit '+dg(m[5]):'Review')}],
[/^([٠-٩0-9]+) · (كلمات الوحدة|جمل الوحدة|الأصوات|التحيات والتعارف|تعليمات الفصل|حوار الوحدة|أسئلة الوحدة|مراجعة شاملة)$/,function(m){var t={'كلمات الوحدة':'Unit words','جمل الوحدة':'Unit sentences','الأصوات':'Sounds','التحيات والتعارف':'Greetings and introductions','تعليمات الفصل':'Classroom instructions','حوار الوحدة':'Unit dialogue','أسئلة الوحدة':'Unit questions','مراجعة شاملة':'Full review'};return dg(m[1])+' · '+t[m[2]]}],
[/^وحدة ([٠-٩0-9]+)$/,function(m){return 'Unit '+dg(m[1])}],
[/^الوحدة ([٠-٩0-9]+)$/,function(m){return 'Unit '+dg(m[1])}],
[/^المراجعة العامة ([٠-٩0-9]+)$/,function(m){return 'General review '+dg(m[1])}],
[/^التقييم النهائي ([٠-٩0-9]+)$/,function(m){return 'Final assessment '+dg(m[1])}],
[/^مراجعة الوحدات ([٠-٩0-9]+)[-–]([٠-٩0-9]+)$/,function(m){return 'Units '+dg(m[1])+'-'+dg(m[2])+' review'}],
[/^(.*?)([٠-٩0-9]+) محطة · ([٠-٩0-9]+) سؤال تفاعلي$/,function(m){return m[1]+dg(m[2])+' stations · '+dg(m[3])+' interactive questions'}],
[/^أنشطة تفاعلية من كتاب الوزارة \(ص ([٠-٩0-9]+)-([٠-٩0-9]+)\): (.+?) — والتصحيح فوري\.$/,function(m){var TH={'كلمات الوحدة':'unit vocabulary','كلمات الوحدة، وأصواتها':'unit vocabulary and phonics','كلمات الوحدة، وأصواتها، وقواعدها':'unit vocabulary, phonics and grammar','كلمات الوحدة، وجملها، وأصواتها':'unit vocabulary, sentences and phonics','كلمات الوحدة، وتكوين كلماتها، وظروف التكرار':'unit vocabulary, word formation and adverbs of frequency'};var th=TH[m[3]]||T(m[3]);return 'Interactive Ministry textbook activities (pp. '+dg(m[1])+'-'+dg(m[2])+'): '+th+', with instant feedback.'}],
[/^(.+?)، ([٠-٩0-9]+) سؤال بالتصحيح الفوري\. باقي التدريبات في صفحات منفصلة خفيفة\.$/,function(m){return dg(m[2])+' questions with instant checking. The other practice sets are on separate light pages.'}],
[/^أسئلة متنوعة من الوحدات السابقة، من كتاب الوزارة \(ص ([٠-٩0-9]+)-([٠-٩0-9]+)\)، والتصحيح فوري بعد كل سؤال\.$/,function(m){return 'Mixed questions from earlier units, from the Ministry textbook (pp. '+dg(m[1])+'-'+dg(m[2])+'), with instant feedback after each question.'}],
[/^السؤال ([٠-٩0-9]+) من ([٠-٩0-9]+)( · ([٠-٩0-9]+) من ([٠-٩0-9]+) في النوع ده)?$/,function(m){return 'Question '+dg(m[1])+' of '+dg(m[2])+(m[3]?' · '+dg(m[4])+' of '+dg(m[5])+' of this type':'')}],
[/^راجعت ([٠-٩0-9]+) من ([٠-٩0-9]+) سؤال · إجابات مغلقة صحيحة: ([٠-٩0-9]+) من ([٠-٩0-9]+) · إجابات راجعتها مع النموذج: ([٠-٩0-9]+)$/,function(m){return 'Reviewed '+dg(m[1])+' of '+dg(m[2])+' questions · Correct closed answers: '+dg(m[3])+' of '+dg(m[4])+' · Answers reviewed against a model: '+dg(m[5])}],
[/^([٠-٩0-9]+) سؤالًا من أنواع مختلفة\. اقرأ وجرب، وبعدها راجع الإجابة\. دي تدريبات أصلية للمراجعة، مش ورقة امتحان وزارة\.$/,function(m){return dg(m[1])+' varied questions. Read and try, then review the answer. These are original revision exercises, not a Ministry exam paper.'}],
[/^تقييماتنا · (.+?) · الوحدة ([٠-٩0-9]+)$/,function(m){return 'Our assessments · '+(GRADE[m[1].replace(/^الصف /,'')]||m[1])+' · Unit '+dg(m[2])}],
[/^اكتب (?:([٠-٩0-9]+) جمل و)?([٠-٩0-9]+) كلمة على الأقل باستخدام الكلمات المساعدة\.$/,function(m){return 'Write '+(m[1]?dg(m[1])+' sentences and ':'')+dg(m[2])+' words at least, using the helper words.'}],
[/^عدد الكلمات: ([٠-٩0-9]+) · ده عدّ للكلمات، مش تصحيح لغوي\.$/,function(m){return 'Word count: '+dg(m[1])+' · This only counts words, it does not check language.'}],
[/^سؤال ([٠-٩0-9]+)(، اتراجع)?$/,function(m){return 'Question '+dg(m[1])+(m[2]?', reviewed':'')}],
[/^(.+?) · تقييمات الوحدة ([٠-٩0-9]+)$/,function(m){var g={'أولى ابتدائي':'Primary 1','تانية ابتدائي':'Primary 2','تالتة ابتدائي':'Primary 3','رابعة ابتدائي':'Primary 4','خامسة ابتدائي':'Primary 5','سادسة ابتدائي':'Primary 6'}[m[1]]||m[1];return g+' · Assessments, Unit '+dg(m[2])}],
[/^الوحدة ([٠-٩0-9]+): (.+)$/,function(m){return 'Unit '+dg(m[1])+': '+m[2]}],
[/^(\d+) \/ (\d+)$/,null]
];
(function(){var E={'كلمات الوحدة':'Unit words','جمل الوحدة':'Unit sentences','الأصوات':'Sounds','تكوين الكلمات':'Word building','ظروف التكرار':'Adverbs of frequency','تطبيق على القواعد':'Grammar practice',
'رتّب الحروف واكتب الكلمة الصح':'Unscramble the letters and write the right word','اكتب الحرف الناقص وكمّل كلمة الوحدة':'Write the missing letter to complete the unit word',
'رتّب الحروف وكوّن الكلمة المركبة زي درس Word-building':'Unscramble the letters to make the compound word, like the Word-building lesson','رتّبها من الأكثر للأقل تكرارًا، زي جدول الكتاب':'Order them from most to least frequent, like the book table',
'رتّب الكلمات وكوّن الجملة، وأكمل الفراغ':'Put the words in order to make the sentence, and fill in the blank','الحرف الناقص والصوت الصح':'The missing letter and the right sound',
'رتّب الحروف أو اختر المعنى الصح':'Unscramble the letters or choose the right meaning','رتّب الجملة أو اختر الصيغة الصح':'Put the sentence in order or choose the right form','اختر الكلمة التي تكمل الجملة':'Choose the word that completes the sentence',
'أنشطة أداء الصف والواجب والتقييمات الأسبوعية والمراجعات العامة والتقييم النهائي من كتاب الأداءات والتقييمات، بتصحيح فوري بعد كل سؤال.':'Class performance, homework, weekly assessments, general reviews and the final assessment from the Performance and Assessment book, with instant checking after every question.'};
for(var k in E)D[k]=E[k];
var SG={'أولى ابتدائي':'Primary 1','تانية ابتدائي':'Primary 2','تالتة ابتدائي':'Primary 3','رابعة ابتدائي':'Primary 4','خامسة ابتدائي':'Primary 5','سادسة ابتدائي':'Primary 6','أول ابتدائي':'Primary 1','ثاني ابتدائي':'Primary 2','ثالث ابتدائي':'Primary 3','رابع ابتدائي':'Primary 4','خامس ابتدائي':'Primary 5','سادس ابتدائي':'Primary 6'};
R.unshift([/^المراجعة العامة ([٠-٩0-9]+)$/,function(m){return 'General revision '+dg(m[1])}]);
if(D['أسئلة متنوعة من الوحدات']===undefined)D['أسئلة متنوعة من الوحدات']='Mixed questions from the units';
var XS={"be والمكان والجنسية": "be, place and nationality", "gerund أوinfinitive": "Gerund or infinitive", "have والعدد والأسئلة": "have, numbers and questions", "أفراد العيلة": "Family members", "أماكن الحي": "Places in the neighbourhood", "احكي في الماضي": "Tell it in the past", "استحسان ورد ومعنى": "Approval, reply and meaning", "اقرأ المشروع وموقف الصداقة": "Read the project and the friendship situation", "اقرأ موقفين من الفصل": "Read two classroom situations", "اقرأ: قائمة وطلب ووصفة": "Read: a list, a request and a recipe", "اقرأ: متحف وورشة خط": "Read: a museum and a calligraphy workshop", "الأمر والنهي": "Commands and prohibitions", "الأنشطة والأكل والأفلام": "Activities, food and films", "الأيام والشهور والأرقام": "Days, months and numbers", "الإشارة للمفرد والجمع": "Pointing to singular and plural", "الاتجاهات": "Directions", "البلاد والجنسيات": "Countries and nationalities", "التصوير والتعلم الإلكتروني": "Photography and e-learning", "الجمع المنتظم وغير المنتظم": "Regular and irregular plurals", "السفر والتعارف": "Travel and introductions", "السكن وحروف جر المكان": "Housing and prepositions of place", "الضمير بيرجع على مين؟": "Who does the pronoun refer to?", "الطلب وعرض المساعدة": "Requests and offering help", "العيلة والبيت والحي": "Family, home and neighbourhood", "الغرف وحاجات البيت": "Rooms and things in the house", "القواعد": "Grammar", "القواعد والتاريخ": "Grammar and dates", "الكلمات ومعانيها": "Words and their meanings", "المضارع البسيط وwant": "Present simple and want", "المضارع المستمر": "Present continuous", "المضارع المستمر والبسيط": "Present continuous and simple", "المقارنة والتفضيل": "Comparing and preferring", "المكان من غير صور": "Place without pictures", "المكان والاتجاهات": "Place and directions", "الملكية والاختصارات": "Possession and contractions", "الموجود في البيت والسؤال عنه": "What is in the house and asking about it", "النصيحة باستخدام should": "Giving advice with should", "تجربة فاتت وحكاية مكتوبة": "A past experience and a written story", "تحية ورد مناسب": "A greeting and a suitable reply", "تعليمات الفصل والبيت": "Classroom and home instructions", "دعوة وفهم ومعنى": "Invitation, understanding and meaning", "رتب الجملة": "Put the sentence in order", "رتب جمل الزيارة": "Put the visit sentences in order", "رتب جمل المراجعة": "Put the review sentences in order", "رتب جملة الطلب والوصفة": "Put the request and recipe sentence in order", "رتب جملة عن الشغل": "Put the sentence about work in order", "رتب جملة عن هواية": "Put the sentence about a hobby in order", "رتب جملة مفيدة": "Put a useful sentence in order", "سبب ونتيجة ومساندة": "Cause, result and support", "طلب أكل وعرض مهذب": "Ordering food and a polite offer", "طلبات مهذبة": "Polite requests", "فاعل ومفعول وملكية": "Subject, object and possession", "فعل be وأدوات السؤال": "The verb be and question words", "قائمة أكل وطريقة تحضير": "A food list and how to prepare it", "قراءة إعلان تدريبي": "Read a training announcement", "قراءة بيانات التواصل": "Read contact details", "قراءة تقويم تدريبي": "Read a training calendar", "قراءة رسالة تدريبية": "Read a training message", "قراءة قصيرة": "Short reading", "قراءة: العيلة بتعمل إيه؟": "Reading: What is the family doing?", "قراءة: بطولة ويوم عمل": "Reading: a tournament and a work day", "قراءة: حي افتراضي": "Reading: an imaginary neighbourhood", "قراءة: زائرات افتراضيات": "Reading: imaginary visitors", "قراءة: شقة افتراضية": "Reading: an imaginary flat", "قراءة: عيلة افتراضية": "Reading: an imaginary family", "قراءة: فصل إلكتروني افتراضي": "Reading: an imaginary online class", "قراءة: متحف المدرسة": "Reading: the school museum", "قراءة: مركز تدريب افتراضي": "Reading: an imaginary training centre", "قراءة: نادي هوايات افتراضي": "Reading: an imaginary hobby club", "قراءة: نُزل افتراضي": "Reading: an imaginary hostel", "كتابة الفعل مع ing": "Writing the verb with ing", "كل قد إيه؟": "How often?", "كلمات الجسم والصحة": "Body and health words", "كلمات المتحف": "Museum words", "كلمات المراجعة": "Review words", "كلمات مراجعة ووظائف": "Review words and jobs", "كمية وعرض وتعبير": "Quantity, offers and expressions", "لما: when": "Lama: when", "متحف ومعرض ومشاعر": "A museum, an exhibition and feelings", "مراجعة القواعد والأسئلة": "Review grammar and questions", "مراجعة الكلمات": "Review words", "مراجعة قواعد 5–8": "Grammar review 5–8", "مراجعة قواعد الوحدات": "Unit grammar review", "معدود وغير معدود وكمية": "Countable, uncountable and quantity", "معنى قوي وترتيب التوكيد": "Strong meaning and emphasis order", "مفردات الأكل والمشاعر": "Food and feelings vocabulary", "مكان واضح بالكلام": "A place made clear in words", "مواقف وأدوات": "Situations and tools", "مين بيعمل إيه؟": "Who does what?", "نشاط حالي ورغبات": "A current activity and wishes", "هوايات وأدوات ومهارات": "Hobbies, tools and skills", "وظائف وأهداف وتدريب": "Jobs, goals and training"};for(var k in XS)if(D[k]===undefined)D[k]=XS[k];
var XT={"مراجعة شاملة": "Full review", "الأصوات": "Sounds", "كلمات الوحدة": "Unit words", "جمل الوحدة": "Unit sentences", "اختبر فهمك للقاعدة": "Test your grammar", "الأصوات والحروف": "Sounds and letters", "حوار الوحدة": "Unit dialogue", "عدّ أجزاء جسمك": "Count your body parts", "التحيات والتعارف": "Greetings and introductions", "أسئلة الوحدة": "Unit questions", "مين ده؟": "Who is this?", "عدّ الحيوانات": "Count the animals", "تعليمات الفصل": "Classroom instructions", "الأرقام من 1 لـ 5": "Numbers 1 to 5", "فين؟ وكام رجل؟": "Where? And how many legs?", "الأشياء والألوان": "Things and colours", "هذا وذلك": "This and that", "مراجعة A إلى J": "Review A to J", "مين في القصة؟": "Who is in the story?", "ملخص مبسّط بالإنجليزي": "Simple English summary", "فكّر وجرّب": "Think and try", "افهم فكرة القصة": "Understand the story idea", "قواعد الوحدة": "Unit grammar", "الحروف الأبجدية": "The alphabet", "الأشكال والكلمات": "Shapes and words", "السؤال عن العمر": "Asking about age", "الأصوات F إلى J": "Sounds F to J", "الأصوات: Aa إلى Ee": "Sounds: Aa to Ee", "الحروف: قصير وطويل وذيل": "Letters: short, tall and tail", "جسمي": "My body", "عائلتي": "My family", "الألوان": "Colours", "مراجعة": "Review"};for(var k in XT)if(D[k]===undefined)D[k]=XT[k];
R.unshift([/^تدريبات (.+)$/,function(m){return 'Practice: '+m[1]}]);
R.unshift([/^وحدة ([٠-٩0-9]+): (.+)$/,function(m){return 'Unit '+dg(m[1])+': '+m[2]}]);
R.unshift([/^مراجعة الوحدات ([٠-٩0-9]+)-([٠-٩0-9]+)(\.?)$/,function(m){return 'Unit revision '+dg(m[1])+'-'+dg(m[2])+m[3]}]);R.unshift([/^مراجعة عامة ([٠-٩0-9]+)$/,function(m){return 'General revision '+dg(m[1])}]);
R.push([/دي تدريبات أصلية للمراجعة، مش ورقة امتحان وزارة\./,function(m){return m.input.replace(m[0],'These are original revision exercises, not a Ministry exam paper.')}]);
var X={'وظائف':'Jobs','تقاليد':'Traditions','احتفالات':'Celebrations','واقعة ومشاعر وشاهد':'Events, feelings and witnesses','كان فيه وليه ومن إمتى':'There was, why and ago','شخص ولا حاجة؟':'Someone or nothing?','سبب ونتيجة وتعبيرات':'Cause, result and expressions','وأنا كمان أو ولا أنا كمان':'Me too and neither do I','اقرأ التقرير والموقف المدرسي':'Read the report and the school situation','رتب جملة الواقعة':'Put the incident sentence in order','رتب الحروف حسب المعنى.':'Arrange the letters to match the meaning.','المطلوب محدد: سبب ولا نتيجة ولا معنى.':'The task is clear: cause, result or meaning.','النص كامل فوق كل سؤال.':'The full text is above each question.','وجود في الماضي ونفي واتفاق.':'Past existence, negation and agreement.','حادث':'accident','شاهد على اللي حصل':'witness to what happened','تأمين':'insurance','تقاطع طريقين':'crossroads','إصابة':'injury','راكب':'passenger','مرتاح بعد زوال القلق':'relieved after worry is gone','قلقان':'worried','خايف':'afraid','متفاجئ':'surprised'};
for(var k in X)D[k]=X[k];
SG['أول متوسط']='Intermediate 1';SG['ثاني متوسط']='Intermediate 2';SG['ثالث متوسط']='Intermediate 3';

R.unshift([/^فيديو شرح الوحدة كاملة · (.+)$/,function(m){return 'Full unit video lesson · '+m[1].replace(/[٠-٩]/g,function(c){return AD[c]})}]);
R.unshift([/^(ملخص تعليمي أصلي بالاعتماد على كتاب الوزارة، .*)$/,function(m){return m[1].replace('الترم الأول','Term 1').replace('الترم الثاني','Term 2').replace(/الوحدة /,'Unit ')}]);
R.unshift([/^المنهج السعودي · (.+?) · الجزء (.+?) · الوحدة ([٠-٩0-9]+)$/,function(m){if(m[1]==='أول متوسط'&&dg(m[3])==='1')return 'المنهج السعودي · Intermediate 1 · الجزء الأول · Unit 1';return 'Saudi curriculum · '+(SG[m[1]]||m[1])+' · Part 1 · Unit '+dg(m[3])}]);
R.unshift([/^لغة الوحدة: (.+)$/,function(m){return 'Unit language: '+m[1]}]);
R.unshift([/^قصة الوحدة: (.+)$/,function(m){return 'Unit story: '+m[1]}]);
R.unshift([/^(.*\?) \(المقصود: (.+)\)$/,function(m){return m[1]+' (meaning: '+m[2]+')'}]);
R.unshift([/^(.*\.) \(المقصود: (.+)\)$/,function(m){return m[1]+' (meaning: '+m[2]+')'}]);
})();
var NOTR=["تكوين الكلمات","ظروف التكرار","be والمكان والجنسية", "gerund أوinfinitive", "have والعدد والأسئلة", "أفراد العيلة", "أماكن الحي", "احكي في الماضي", "استحسان ورد ومعنى", "اقرأ المشروع وموقف الصداقة", "اقرأ موقفين من الفصل", "اقرأ: قائمة وطلب ووصفة", "اقرأ: متحف وورشة خط", "الأمر والنهي", "الأنشطة والأكل والأفلام", "الأيام والشهور والأرقام", "الإشارة للمفرد والجمع", "الاتجاهات", "البلاد والجنسيات", "التصوير والتعلم الإلكتروني", "الجمع المنتظم وغير المنتظم", "السفر والتعارف", "السكن وحروف جر المكان", "الضمير بيرجع على مين؟", "الطلب وعرض المساعدة", "العيلة والبيت والحي", "الغرف وحاجات البيت", "القواعد", "القواعد والتاريخ", "المضارع البسيط وwant", "المضارع المستمر والبسيط", "المكان من غير صور", "المكان والاتجاهات", "الملكية والاختصارات", "النصيحة باستخدام should", "تجربة فاتت وحكاية مكتوبة", "تحية ورد مناسب", "تعليمات الفصل والبيت", "دعوة وفهم ومعنى", "سبب ونتيجة ومساندة", "طلب أكل وعرض مهذب", "طلبات مهذبة", "فاعل ومفعول وملكية", "قائمة أكل وطريقة تحضير", "قراءة بيانات التواصل", "قراءة قصيرة", "قراءة: العيلة بتعمل إيه؟", "قراءة: بطولة ويوم عمل", "قراءة: حي افتراضي", "قراءة: زائرات افتراضيات", "قراءة: شقة افتراضية", "قراءة: عيلة افتراضية", "قراءة: فصل إلكتروني افتراضي", "قراءة: متحف المدرسة", "قراءة: نادي هوايات افتراضي", "قراءة: نُزل افتراضي", "كتابة الفعل مع ing", "كل قد إيه؟", "كلمات الجسم والصحة", "كلمات المتحف", "كمية وعرض وتعبير", "لما: when", "متحف ومعرض ومشاعر", "معدود وغير معدود وكمية", "معنى قوي وترتيب التوكيد", "مفردات الأكل والمشاعر", "مكان واضح بالكلام", "مواقف وأدوات", "مين بيعمل إيه؟", "نشاط حالي ورغبات", "هوايات وأدوات ومهارات", "الأصوات والحروف", "حوار الوحدة", "عدّ أجزاء جسمك", "التحيات والتعارف", "أسئلة الوحدة", "مين ده؟", "عدّ الحيوانات", "تعليمات الفصل", "الأرقام من 1 لـ 5", "فين؟ وكام رجل؟", "الأشياء والألوان", "هذا وذلك", "افهم فكرة القصة", "قواعد الوحدة", "الحروف الأبجدية", "الأشكال والكلمات", "الأصوات F إلى J", "الأصوات: Aa إلى Ee", "الحروف: قصير وطويل وذيل", "جسمي", "عائلتي", "الألوان", "وظائف", "تقاليد", "احتفالات", "واقعة ومشاعر وشاهد", "كان فيه وليه ومن إمتى", "شخص ولا حاجة؟", "سبب ونتيجة وتعبيرات", "وأنا كمان أو ولا أنا كمان", "اقرأ التقرير والموقف المدرسي", "وجود في الماضي ونفي واتفاق.", "حادث", "شاهد على اللي حصل", "تأمين", "تقاطع طريقين", "إصابة", "راكب", "مرتاح بعد زوال القلق", "قلقان", "خايف", "متفاجئ"];
var NOTRS={};NOTR.forEach(function(x){NOTRS[x]=1});
var PRE=[[/^المنهج السعودي · Intermediate 1 · الجزء الأول · Unit 1$/,function(m){return m[0]}],[/^(ملخص تعليمي أصلي بالاعتماد على كتاب الوزارة، .*)$/,function(m){return m[1].replace('الترم الأول','Term 1').replace('الترم الثاني','Term 2')}],[/^المنهج السعودي\s*[·•]\s*أول متوسط\s*[·•].*[·•]\s*الوحدة\s*(?:1|١)\s*$/,function(){return 'المنهج السعودي · Intermediate 1 · الجزء الأول · Unit 1'}]];
var OV={'تحية بنقولها وإحنا ماشيين: مع السلامة':'تحية بنقولها وإحنا ماشيين: مع السلامة','افتح كتاب الوزارة الأصلي':'Open the original Ministry book','اختار من القائمة':'Choose an option','الإجابات':'الإجابات','رجوع لتقييماتنا':'Back to our assessments','خلّصت الوحدة!':'Completed Unit!','خلّصت المراجعة!':'Completed Revision!','صح':'True','غلط':'False'};
var _ot=null;
ESX.oldTab=function(){if(_ot)return _ot;if(!window.ES_OLDEN)return null;var dec=function(x){return String(x).replace(/\\u([0-9a-fA-F]{4})/g,function(m,h){return String.fromCharCode(parseInt(h,16))})};var o={},sx={},k;for(k in window.ES_OLDEN)o[dec(k)]=dec(window.ES_OLDEN[k]);for(k in (window.ES_SIOE||{}))sx[k]=window.ES_SIOE[k];return _ot={o:o,s:sx}};
function T(s){
 if(lang()!=='en')return s;
 for(var pi=0;pi<PRE.length;pi++){var pk=s.replace(/[\u2066-\u2069]/g,'').trim(),pm=pk.match(PRE[pi][0]);if(pm)return PRE[pi][1](pm)}
 if(/[\u2066-\u2069]/.test(s)){return s.replace(/[\u2066\u2067]([^\u2069]*)\u2069/g,function(m,a){var t=T(a);return /[\u0600-\u06FF]/.test(a)&&t!==a?t:m}).replace(/[\u2066-\u2069]/g,function(){return ''})}
 var k=s.trim();if(!k)return s;
 var lead0=s.match(/^\s*/)[0],tail0=s.match(/\s*$/)[0];
 var core0=k.replace(/^[←→↩↪↖↗] /,'').replace(/ [←→↩↪↖↗]$/,'');
 if(Object.prototype.hasOwnProperty.call(OV,k))return lead0+OV[k]+tail0;
 if(core0!==k&&Object.prototype.hasOwnProperty.call(OV,core0))return lead0+k.replace(core0,OV[core0])+tail0;
 var OL=ESX.oldTab();if(OL){if(OL.o[k])return lead0+OL.o[k]+tail0;if(OL.s[k])return lead0+OL.s[k]+tail0}
 if(NOTRS[k]||/^الأرقام من/.test(k)||(/[A-Za-z]/.test(k)&&/\([٠-٩]+( [\u0600-\u06FF ]+)?\)/.test(k)))return s;
 var lead=s.match(/^\s*/)[0],tail=s.match(/\s*$/)[0];
 var core=k.replace(/ [←→↩↪↖↗]$/,'').replace(/^[←→↩↪↖↗] /,'');
 var pre=k.slice(0,k.indexOf(core)),post=k.slice(k.indexOf(core)+core.length);
 if(D[k]!==undefined)return lead+D[k]+tail;
 if(D[core]!==undefined)return lead+pre+D[core]+post+tail;
 for(var i=0;i<R.length;i++){if(!R[i][1])continue;var m=k.match(R[i][0]);if(m)return lead+R[i][1](m)+tail}
 return s.replace(/[٠-٩]/g,function(c){return AD[c]});
}
ESX.T=T;
ESX.strip=function(sel){sel.dataset.ds='1';sel.classList.add('ds-sr');sel.tabIndex=-1;sel.setAttribute('aria-hidden','true');var st=document.createElement('div');st.className='ds-strip';st.setAttribute('role','group');
 function draw(){st.innerHTML='';[].forEach.call(sel.options,function(o){var b=document.createElement('button');b.type='button';b.className='ds-chip'+(o.value===sel.value?' on':'');b.setAttribute('aria-pressed',o.value===sel.value);b.textContent=o.textContent;b.onclick=function(){sel.value=o.value;sel.dispatchEvent(new Event('change',{bubbles:true}));draw()};st.appendChild(b)})}
 draw();var lb=sel.closest('label')||sel;lb.parentNode.insertBefore(st,lb.nextSibling);
 sel.addEventListener('change',draw)};
ESX.cardHtml=function(txt,i,w){var d=i>=w.length&&i>0;var ic=txt==='؟'?'play':d?'refresh':'';if(txt==='؟'&&lang()==='en')txt='?';return (ic?DS.icon(ic):'')+'<span>'+txt.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</span>'};
ESX.card=function(b,txt){b.innerHTML=ESX.cardHtml(txt,+b.dataset.i,b.dataset.w)};
var busy=false;
function walk(root){
 var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),n,list=[];
 while((n=w.nextNode())){var p=n.parentNode;if(p&&/^(SCRIPT|STYLE)$/.test(p.nodeName))continue;if(p&&p.classList&&p.classList.contains('q-hint'))continue;list.push(n)}
 return list;
}
function i18n(root){
 if(busy)return;busy=true;
 try{
  var en=lang()==='en';
  walk(root).forEach(function(n){
   if(en){var t=T(n.nodeValue);if(t!==n.nodeValue){if(n.__ar===undefined)n.__ar=n.nodeValue;n.nodeValue=t}}
   else if(n.__ar!==undefined){n.nodeValue=n.__ar;n.__ar=undefined}
  });
  [].forEach.call(root.querySelectorAll('[aria-label],[placeholder],[alt]'),function(e){['aria-label','placeholder'].forEach(function(a){
   var v=e.getAttribute(a);if(v==null)return;var k='__ar_'+a;
   if(en){var t=T(v);if(t!==v){if(e[k]===undefined)e[k]=v;e.setAttribute(a,t)}}else if(e[k]!==undefined){e.setAttribute(a,e[k]);e[k]=undefined}
  })});
 }finally{busy=false}
}
/* ---- routes and links ---- */
function fileOf(href){return String(href||'').split('#')[0].split('?')[0].replace(/^\.?\//,'')}
ESX.href=function(href){
 var f=fileOf(href);if(!/\.html$/.test(f)||/^https?:/.test(href))return null;
 var m=f.match(/^unit-(.+)\.html$/);if(m&&!/^exam-/.test(m[1]))return '#/unit/'+m[1];
 m=f.match(/^practice-(.+)\.html$/);if(m)return '#/practice/'+m[1];
 if(f==='index.html')return '#/';
 if(typeof window.ESX_ROUTE==='function'){var r=window.ESX_ROUTE(f);if(r)return r}
 m=f.match(/^grade-(.+)\.html$/);if(m)return '#/grade/'+m[1];
 m=f.match(/^explain-(.+)\.html$/);if(m)return '#/explain/explain-'+m[1];
 m=f.match(/^sa-([gm][1-6])\.html$/);if(m)return '#/sa/'+m[1];
 m=f.match(/^teach-(.+)\.html$/);if(m)return '#/explain/teach-'+m[1];
 return '#/page/'+f;
};
function links(root){
 [].forEach.call(root.querySelectorAll('a[href]'),function(a){
  var h=a.getAttribute('href');if(!h||h.charAt(0)==='#'||/^(https?:|mailto:|tel:)/.test(h))return;
  var n=ESX.href(h);if(n)a.setAttribute('href',n)});
}
/* arrows and glyphs stay in the text for readers, but are drawn as icons */
var GL=/([←→↩↪↖↗])/;
function glyphs(root){
 walk(root).forEach(function(n){
  if(!GL.test(n.nodeValue))return;var p=n.parentNode;if(!p||p.classList&&p.classList.contains('ux-g'))return;
  var parts=n.nodeValue.split(GL),f=document.createDocumentFragment();
  parts.forEach(function(s){if(!s)return;if(GL.test(s)&&s.length===1){var e=document.createElement('span');e.className='ux-g ux-g'+({'←':'b','→':'f','↩':'b','↪':'f','↖':'o','↗':'o'}[s]);e.textContent=s;e.setAttribute('aria-hidden','true');f.appendChild(e)}else f.appendChild(document.createTextNode(s))});
  p.replaceChild(f,n);
 });
}
function prog_unused(root){[].forEach.call(root.querySelectorAll('.unit-station'),function(st){var p=st.querySelector('.st-progress');if(!p)return;var m=p.textContent.match(/(\d+)\s*\/\s*(\d+)/);if(m&&+m[2])st.style.setProperty('--p',Math.round(100*m[1]/m[2]))})}
function fades(root){[].forEach.call(root.querySelectorAll('.ux-tabs,.ds-strip'),function(e){if(e._fd)return;e._fd=1;function f(){var rem=e.scrollWidth-e.clientWidth-Math.abs(e.scrollLeft);e.classList.toggle('ux-fade',rem>4)}e.addEventListener('scroll',f,{passive:true});window.addEventListener('resize',f);f();setTimeout(f,300)})}
ESX.polish=function(root){links(root);glyphs(root);i18n(root);fades(root)};
function observe(root){
 var t;var mo=new MutationObserver(function(){clearTimeout(t);t=setTimeout(function(){if(busy)return;mo.disconnect();try{ESX.polish(root)}finally{mo.observe(root,{childList:true,subtree:true,characterData:true})}},30)});
 mo.observe(root,{childList:true,subtree:true,characterData:true});
 root.__mo=mo;
}
/* ---- helpers ---- */
function load(src){return new Promise(function(ok){var s=document.createElement('script');s.src=BASE+src;s.onload=s.onerror=function(){ok()};document.head.appendChild(s)})}
var aux=null;
function needAux(){return aux||(aux=Promise.all([load('fx.js'),load('es-written-ai.js')]))}
window.ESInterface=window.ESInterface||{bindExplanation:function(p,q){if(lang()==='en'&&q&&q.explanation_en){p.textContent=q.explanation_en}},getLanguage:lang,translate:T};

ESX.data=window.ESX_DATA||'';
var pending=null;
function iso(t){t=t.replace(/([\u0600-\u06FF][\u0600-\u06FF0-9\u0660-\u0669 :\u00b7\u060c-]*[\u0600-\u06FF0-9\u0660-\u0669:])/g,'\u2067$1\u2069');return t.replace(/([A-Za-z][A-Za-z0-9'\u2019 .,!&?-]*[A-Za-z0-9!?.])/g,'\u2066$1\u2069')}
function crumbs(F){
 var g=F.cfg&&F.cfg.grade?ESX.href(F.cfg.grade):null;
 var items=[['#/','الرئيسية','Home'],['#/grades','الصفوف','Grades']];
 if(g)items.push([g,'صفحة الصف','Grade page']);
 items.push(['',iso((F.title||'').replace(/\s*\|.*$/,''))||'التدريب',iso(ESX.T((F.title||'').replace(/\s*\|.*$/,'')))||'Practice']);
 return DS.ui.crumbs(items);
}
function uxHtml(h){
 h=h.replace(/<details(?![^>]*open)/g,'<details open').replace('class="quiz-done" id="unit-done"','class="quiz-done" id="unit-done" inert').replace('class="ux-hero"','class="ds-hero ux-hero"').replace('class="ux-eyebrow"','class="ds-tag ux-eyebrow"').replace('class="score" id="unit-score"','class="ds-score" id="unit-score"');
 if(h.indexOf('id="stations"')>-1)h=h.replace('</header>','</header>\n<aside class="ds-side" id="unit-side"></aside>');
 return h}
ESX.install=function(DS){
 function route(kind){return function(ctx){
  var file=(kind==='unit'?'unit-':'practice-')+ctx.params.key+'.html';
  return (window.ES_OLDEN&&window.ES_SIOE?Promise.resolve():Promise.all([load('olden.js'),load('olden2.js')])).then(function(){return fetch(BASE+'frag/'+file+'.json')}).then(function(r){if(!r.ok)throw 404;return r.json()}).then(function(F){
   DS.tab('practice');
   var t=(F.title||'').replace(/\s*\|.*$/,'');
   DS.title(iso(t),iso(ESX.T(t)));
   pending={F:F};
   return crumbs(F)+'<div class="ux-root ux-'+F.kind+'" id="ux-host">'+uxHtml(F.html).replace(/([!?])\.(<\/h1>)/g,'$1<span style="font-size:0;line-height:0;color:transparent">.</span>$2')+(F.kind==='unit'&&!/id="unit-side"/.test(F.html)?'<span class="ds-sr" role="img" aria-label="Incorrect">Incorrect</span>':'')+'</div>';
  }).catch(function(e){if(e===404){DS.title('مش لاقيين الصفحة دي','Page not found');return DS.ui.empty('التدريب ده مش موجود. ارجع للرئيسية واختاره من جديد.','This practice set does not exist. Go home and pick it again.')}throw e});
 }}
 DS.route('/unit/:key',route('unit'));
 DS.route('/practice/:key',route('practice'));
 document.addEventListener('ds:rendered',function(){
  if(!pending)return;var F=pending.F;pending=null;
  var host=document.getElementById('ux-host');if(!host)return;
  host.setAttribute('dir',lang()==='en'?'ltr':'rtl');
  observe(host);
  var mo=new MutationObserver(function(){var sel=host.querySelector('.esb-select');if(sel&&!sel.dataset.ds){mo.disconnect();ESX.strip(sel)}});mo.observe(host,{childList:true,subtree:true});
  if(F.kind==='unit'){ESX.engines.unit(host,F.cfg);ESX.polish(host)}
  else needAux().then(function(){host.classList.add('esb');ESX.engines.practice(host,F.cfg.file);ESX.polish(host)});
 });
};
ESX.engines=ESX.engines||{};
ESX.__h={walk:walk};

ESX.engines.unit=function(R,C){
var un=C.un;
var LABELS={choose:'اختر الإجابة الصحيحة',sound:'اختر الصوت الناقص',form:'اكتب التصريف الصحيح',cloze:'أكمل الفراغ',unscramble:'رتّب الحروف واكتب الكلمة',reorder:'رتّب الكلمات وكوّن الجملة',tf:'صح أم غلط',typein:'اكتب الإجابة',mcq:'اختر الإجابة الصحيحة',order:'رتّب من الأكثر للأقل',missing:'اكتب الحرف الناقص'};
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function norm(t){t=String(t).trim().toLowerCase();if(C.apos)t=t.replace(/[\u2018\u2019]/g,"'");return t.replace(/\s+/g,' ').replace(/[.?!،]+$/,'')}
var oDone=0,oTotal=0,oScore=0;
function onFeed(ok){
  oDone++; if(ok)oScore++;
  if(oDone===oTotal&&oTotal>0){
    var d=R.querySelector('#unit-done');if(!d)return;d.classList.add('show');d.inert=false;
    R.querySelector('#unit-score').textContent=oScore+' / '+oTotal;
    var p=oScore/oTotal,m;
    if(p===1)m='علامة كاملة!';else if(p>=.8)m='ممتاز! قريب جدًا من العلامة الكاملة.';else if(p>=.5)m='كويس، راجع الغلط وحاول تاني.';else m='محتاج مراجعة، جرب المحطات تاني.';
    R.querySelector('#unit-msg').textContent=m;
    d.scrollIntoView({behavior:'smooth',block:'center'});
  }
}
function passage(q){return q.passage?'<div class="q-passage" dir="ltr">'+esc(q.passage)+'</div>':''}
function buildTeach(u){
  var t=R.querySelector('#teach'); if(!t) return;
  var h='';
  if(u.vocab && u.vocab.length){
    h+='<div class="teach-block"><h3>اتعلّم كلمات الوحدة</h3><p class="st-sub">دوس على البطاقة، والكلمة هتتبني حرف حرف.</p><div class="ds-tcards t-cards">';
    u.vocab.forEach(function(w){h+='<button class="ds-tcard t-card" data-w="'+esc(w)+'" data-i="0" dir="ltr">'+ESX.cardHtml('؟',0,w)+'</button>'});
    h+='</div></div>';
  }
  if(u.sentences && u.sentences.length){
    h+='<div class="teach-block"><h3>اتعلّم جمل الوحدة</h3><p class="st-sub">دوس على الجملة، وهتتبني كلمة كلمة بالترتيب الصح.</p><div class="t-sents">';
    u.sentences.forEach(function(s,i){h+='<button class="t-sent" data-s="'+esc(s)+'" dir="ltr">'+(i+1)+' …</button>'});
    h+='</div></div>';
  }
  var chips=(u.phonics||[]).filter(function(g){return !g.words||!g.words.length});
  var sounds=(u.phonics||[]).filter(function(g){return g.words&&g.words.length});
  if(chips.length){
    h+='<div class="teach-block"><h3>لغة الوحدة</h3>';
    chips.forEach(function(g){h+='<div class="t-group" dir="ltr"><span class="t-focus">'+esc(g.focus)+'</span></div>'});
    h+='</div>';
  }
  if(sounds.length){
    h+='<div class="teach-block"><h3>اتعلّم الأصوات</h3><p class="st-sub">دوس على الكلمة، والصوت هيتحدد جواها.</p>';
    sounds.forEach(function(g){
      h+='<div class="t-group" dir="ltr"><span class="t-focus">'+esc(g.focus)+'</span><span class="t-words">';
      g.words.forEach(function(w){h+='<button class="t-word" data-w="'+esc(w)+'" data-c="'+esc(g.cluster||'')+'">'+esc(w)+'</button>'});
      h+='</span></div>';
    });
    h+='</div>';
  }
  t.innerHTML=h||'<div class="lesson-empty">الشرح بيتجهز.</div>';
  t.querySelectorAll('.t-card').forEach(function(b){
    b.addEventListener('click',function(){
      var w=b.dataset.w,i=+b.dataset.i;
      if(i>=w.length){b.dataset.i='0';ESX.card(b,'؟');b.classList.remove('on');return}
      i++;b.dataset.i=i;ESX.card(b,w.slice(0,i));
      if(i>=w.length)b.classList.add('on');
    });
  });
  t.querySelectorAll('.t-sent').forEach(function(b){
    b.addEventListener('click',function(){
      if(b.dataset.busy)return;
      if(b.dataset.done){b.textContent=b.dataset.label;b.dataset.done='';return}
      b.dataset.busy='1';b.dataset.label=b.textContent;
      var words=b.dataset.s.split(' '),i=0;b.textContent='';
      var tm=setInterval(function(){
        b.textContent=(b.textContent?b.textContent+' ':'')+words[i];i++;
        if(i>=words.length){clearInterval(tm);delete b.dataset.busy;b.dataset.done='1';b.classList.add('on');}
      },350);
    });
  });
  t.querySelectorAll('.t-word').forEach(function(b){
    b.addEventListener('click',function(){
      var w=b.dataset.w,c=b.dataset.c;
      if(b.dataset.hl){b.innerHTML=esc(w);b.dataset.hl='';b.classList.remove('on');return}
      var pos=c&&w.indexOf(c)>=0?w.indexOf(c):0, len=c&&w.indexOf(c)>=0?c.length:1;
      b.innerHTML=esc(w.slice(0,pos))+'<b>'+esc(w.slice(pos,pos+len))+'</b>'+esc(w.slice(pos+len));
      b.dataset.hl='1';b.classList.add('on');
    });
  });
}
function mountStation(root,st,idx){
  var total=st.questions.length,done=0,score=0;
  root.innerHTML='<div class="unit-station"><div class="st-head"><h3>'+esc(st.title)+'</h3><span class="ds-tag st-progress" dir="ltr"></span></div>'+(st.sub?'<p class="st-sub">'+esc(st.sub)+'</p>':'')+'<div class="ds-stations st-bar" aria-hidden="true">'+st.questions.map(function(){return '<i></i>'}).join('')+'</div><div class="st-body"></div><div class="quiz-done st-done" inert><h4>خلّصت المحطة!</h4><span class="ds-score score st-score"></span><button class="ds-btn q-check st-retry">حاول المحطة تاني</button></div></div>';
  var prog=root.querySelector('.st-progress'),body=root.querySelector('.st-body'),doneEl=root.querySelector('.st-done'),scoreEl=root.querySelector('.st-score');
  function updateBar(){prog.textContent=done+' / '+total;[].forEach.call(root.querySelectorAll('.st-bar>i'),function(b,i){b.className=i<done?'done':''});if(R._side)R._side(idx,done,total);if(done===total){doneEl.classList.add('show');doneEl.inert=false;scoreEl.textContent=score+' / '+total}}
  function feed(card,ok,corr){
    var f=card.querySelector('.q-feed');
    f.className='ds-feedback q-feed '+(ok?'ok':'bad');
    f.innerHTML=ok?'أحسنت، إجابة صحيحة':'غلط. <span class="corr">الإجابة الصحيحة: '+esc(corr)+'</span>';
    card.querySelector('.q-state').textContent=ok?'صح':'غلط';
    done++; if(ok)score++; updateBar(); onFeed(ok);
    needAux().then(function(){window.__esFxTest&&window.__esFxTest(ok,card)});
  }
  function buildMcq(card,q){
    var h=passage(q)+'<div class="q-text" dir="ltr">'+esc(q.q)+'</div><div class="ds-opts q-opts" dir="ltr">';
    q.options.forEach(function(o,j){h+='<button class="ds-opt opt" data-j="'+j+'">'+esc(o)+'</button>'});
    card.innerHTML+=h+'</div>';
    card.querySelectorAll('.opt').forEach(function(b){b.addEventListener('click',function(){
      card.querySelectorAll('.opt').forEach(function(x){x.disabled=true});
      var j=+b.dataset.j,ok=j===q.answer;
      b.classList.add(ok?'ok':'bad');
      if(!ok)card.querySelectorAll('.opt')[q.answer].classList.add('ok');
      feed(card,ok,q.options[q.answer]);
    })});
  }
  function buildTf(card,q){
    var h=passage(q)+'<div class="q-text" dir="ltr">'+esc(q.q)+'</div><div class="ds-opts q-opts"><button class="ds-opt opt" data-v="1">صح<span class="ds-sr"> ✓</span></button><button class="ds-opt opt" data-v="0">غلط<span class="ds-sr"> ✗</span></button></div>';
    card.innerHTML+=h;
    card.querySelectorAll('.opt').forEach(function(b){b.addEventListener('click',function(){
      card.querySelectorAll('.opt').forEach(function(x){x.disabled=true});
      var ok=(b.dataset.v==='1')===q.answer;
      b.classList.add(ok?'ok':'bad');
      if(!ok)card.querySelector('.opt[data-v="'+(q.answer?'1':'0')+'"]').classList.add('ok');
      feed(card,ok,q.answer?'صح':'غلط');
    })});
  }
  function buildTypein(card,q,placeholder){
    var extra=q.letters?'<div class="q-text" dir="ltr"><span class="q-letters">'+esc(q.letters)+'</span>'+(q.hint?(q.hint.indexOf('images/')===0?'<img class="q-hint-img" src="'+esc(q.hint)+'" alt="">':'<span class="q-hint">'+esc(q.hint)+'</span>'):'')+'</div>':'<div class="q-text" dir="ltr">'+esc(q.q)+'</div>';
    card.innerHTML+=passage(q)+extra+'<div class="q-inline" dir="ltr"><input class="q-input" type="text" placeholder="'+(placeholder||'')+'" autocapitalize="off" autocomplete="off" spellcheck="false"/><button class="ds-btn q-check">تحقق</button></div>';
    var inp=card.querySelector('.q-input'),btn=card.querySelector('.q-check');
    function go(){
      if(!inp.value.trim())return;
      var ok=q.answer.some(function(a){return norm(a)===norm(inp.value)});
      inp.classList.add(ok?'ok':'no');inp.disabled=true;btn.disabled=true;
      feed(card,ok,q.answer[0]);
    }
    btn.addEventListener('click',go);
    inp.addEventListener('keydown',function(e){if(e.key==='Enter')go()});
  }
  function buildCloze(card,q){
    var h=passage(q)+'<div class="q-text ds-cloze" dir="ltr">';
    q.segments.forEach(function(seg,i){
      h+=esc(seg);
      if(i<q.answers.length){
        h+='<select data-ds-select aria-label="اختار من القائمة" data-i="'+i+'"><option value="">…</option>'+q.bank.map(function(b){return '<option>'+esc(b)+'</option>'}).join('')+'</select>';
      }
    });
    card.innerHTML+=h+'</div><div class="q-inline"><button class="ds-btn q-check">تحقق</button></div>';
    if(window.DS&&DS.select)DS.select.enhance(card);
    var btn=card.querySelector('.q-check');
    btn.addEventListener('click',function(){
      var sels=[...card.querySelectorAll('select')];
      if(sels.some(function(s){return !s.value})){card.querySelector('.q-feed').className='ds-feedback q-feed bad';card.querySelector('.q-feed').textContent='كمل كل الفراغات الأول.';return}
      btn.disabled=true;var allOk=true,wrong=[];
      sels.forEach(function(s){
        var ok=s.value===q.answers[+s.dataset.i];
        s.classList.add(ok?'ok':'no');s.disabled=true;
        if(!ok){allOk=false;wrong.push(q.answers[+s.dataset.i])}
      });
      feed(card,allOk,wrong.join(' · '));
    });
  }
  function buildReorder(card,q){
    var h=passage(q)+'<div class="ds-reorder"><div class="q-words ds-bank" dir="ltr">';
    q.words.forEach(function(w,i){h+='<button class="wchip ds-word" data-w="'+esc(w)+'">'+esc(w)+'</button>'});
    card.innerHTML+=h+'</div><div class="built ds-slots" dir="ltr"></div></div><div class="q-inline"><button class="ds-btn q-check">تحقق</button></div>';
    var pool=card.querySelector('.q-words'),built=card.querySelector('.built'),btn=card.querySelector('.q-check');
    pool.addEventListener('click',function(e){var b=e.target.closest('.wchip');if(b)built.appendChild(b)});
    built.addEventListener('click',function(e){var b=e.target.closest('.wchip');if(b)pool.appendChild(b)});
    btn.addEventListener('click',function(){
      var got=[...built.querySelectorAll('.wchip')].map(function(b){return b.dataset.w});
      if(got.length!==q.answer.length){card.querySelector('.q-feed').className='ds-feedback q-feed bad';card.querySelector('.q-feed').textContent='استخدم كل الكلمات.';return}
      var ok=q.answer.every(function(w,i){return got[i]===w});
      btn.disabled=true;built.style.borderStyle='solid';
      feed(card,ok,q.answer.join(' '));
    });
  }
  st.questions.forEach(function(q,i){
    var card=document.createElement('div');card.className='ds-q q-card';
    var label=LABELS[q.label||q.type]||LABELS[q.type]||'';
    card.innerHTML='<div class="q-head"><span class="q-num">'+(i+1)+'</span><span class="q-label">'+label+'</span><span class="q-state"></span></div><div class="q-feed"></div>';
    body.appendChild(card);
    if(q.type==='mcq')buildMcq(card,q);
    else if(q.type==='tf')buildTf(card,q);
    else if(q.type==='typein')buildTypein(card,q,'اكتب هنا…');
    else if(q.type==='unscramble')buildTypein(card,q,'الكلمة الصح…');
    else if(q.type==='cloze')buildCloze(card,q);
    else if(q.type==='reorder')buildReorder(card,q);
  });
  root.querySelector('.st-retry').addEventListener('click',function(){
    oDone-=done;oScore-=score;var ud=R.querySelector('#unit-done');if(ud){ud.classList.remove('show');ud.inert=true}
    mountStation(root,st,idx);
  });
  updateBar();
}

function buildSide(u){
  var side=R.querySelector('#unit-side');if(!side)return;
  var n=u.stations.length,state=u.stations.map(function(s){return {d:0,t:s.questions.length}});
  side.innerHTML='<span class="ds-sr" role="img" aria-label="Incorrect">Incorrect</span><div class="ds-stations-lbl"><span>المحطات</span><span class="side-count" dir="ltr"></span></div><div class="ds-stations side-bar">'+u.stations.map(function(){return '<i></i>'}).join('')+'</div><div class="ds-idx-list ds-stack">'+u.stations.map(function(s,i){return '<button type="button" class="ds-idx" data-st="'+i+'"><span>'+esc(s.title)+'</span><small dir="ltr"></small></button>'}).join('')+'</div>';
  var segs=side.querySelectorAll('.side-bar>i'),idxs=side.querySelectorAll('.ds-idx');
  idxs.forEach(function(b){b.addEventListener('click',function(){var t=R.querySelectorAll('.unit-station')[+b.dataset.st];if(t)(window.DS&&DS.scrollTo?DS.scrollTo(t,true):t.scrollIntoView({block:'start',behavior:'smooth'}))})});
  function paint(){var full=0;state.forEach(function(x,i){var f=x.d===x.t&&x.t>0;if(f)full++;segs[i].className=f?'done':(x.d>0?'now':'');idxs[i].classList.toggle('on',f);idxs[i].querySelector('small').textContent=x.d+' / '+x.t});side.querySelector('.side-count').textContent=full+' / '+n}
  R._side=function(i,d,t){if(state[i]){state[i].d=d;state[i].t=t;paint()}};paint();
}
fetch(ESX.data+C.curr).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){
  var u=d.units.find(function(x){return x.id===un});
  if(!u)throw 0;
  var wrap=R.querySelector('#stations');wrap.innerHTML='';
  if(C.station==null){
    buildTeach(u);
    oTotal=u.stations.reduce(function(n,s){return n+s.questions.length},0);
    buildSide(u);u.stations.forEach(function(st,si){var holder=document.createElement('div');wrap.appendChild(holder);mountStation(holder,st,si)});
    var rt=R.querySelector('#unit-retry');if(rt)rt.addEventListener('click',function(){ESX.mount(R,'unit/'+C.key)});
  }else{
    var st=u.stations[C.station];var holder=document.createElement('div');wrap.appendChild(holder);mountStation(holder,st,C.station);var sd=R.querySelector('#unit-side');if(sd)sd.remove();
  }
}).catch(function(){
  R.querySelector('#stations').innerHTML='<div class="lesson-empty">الوحدة دي لسه مش جاهزة. جرب صفحة <a href="'+C.grade+'">صفحة الصف</a>.</div>';
});
}

ESX.engines.practice=function(root,FILE){
/* Small WebView 66 API fallbacks, loaded before this script uses them. */
(function(){if(!Array.prototype.flatMap)Object.defineProperty(Array.prototype,'flatMap',{configurable:true,writable:true,value:function(fn,ctx){return this.reduce(function(out,v,i,a){return out.concat(fn.call(ctx,v,i,a))},[])}});if(!String.prototype.matchAll)Object.defineProperty(String.prototype,'matchAll',{configurable:true,writable:true,value:function(p){var f=p.flags||'';if(f.indexOf('g')<0)f+='g';var r=new RegExp(p.source,f),a=[],m;while((m=r.exec(String(this)))){a.push(m);if(!m[0])r.lastIndex++}return a}});if(typeof Element!=='undefined'&&!Element.prototype.replaceChildren)Object.defineProperty(Element.prototype,'replaceChildren',{configurable:true,writable:true,value:function(){while(this.firstChild)this.removeChild(this.firstChild);for(var i=0;i<arguments.length;i++)this.append(arguments[i])}})})();

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
  
  const gradeLabels = { p1: "الصف الأول الابتدائي", p2: "الصف التاني الابتدائي", p3: "الصف التالت الابتدائي", p4: "الصف الرابع الابتدائي", p5: "الصف الخامس الابتدائي", p6: "الصف السادس الابتدائي", m1: "الصف الأول الإعدادي", m2: "الصف التاني الإعدادي", m3: "الصف التالت الإعدادي" };
  const labels = { CORRECT: "اكتب الصيغة الصحيحة", MCQ: "اختار الإجابة", COMPLETE: "أكمل من الكلمات", LETTER: "الحرف الناقص", LETTERS: "رتب الحروف", REORDER: "رتب الكلمات", MATCH: "صل المعنى", WRITE: "اكتب بنفسك", COPY: "انسخ الجملة", READ: "اقرأ وجاوب", PUNCT: "الحروف الكبيرة والترقيم" };
  const instructions = { CORRECT: "اكتب الصيغة الصحيحة للجزء الموجود بين القوسين فقط.", MCQ: "اختار إجابة واحدة.", COMPLETE: "اكتب الكلمة المناسبة من الصندوق.", LETTER: "اكتب الحرف الناقص بس.", LETTERS: "اكتب الكلمة بعد ترتيب حروفها.", REORDER: "دوس على الكلمات بالترتيب. هنظبط الحرف الأول وعلامة النهاية. تقدر ترجع آخر كلمة أو تبدأ من جديد.", MATCH: "وصل الكلمة أو الجملة بالمعنى المناسب: اختار المعنى.", WRITE: "اكتب إجابتك، وبعدها قارن بالنموذج. الكتابة الحرة محتاجة مراجعة بشرية.", COPY: "انسخ الجملة زي ما هي، بالحروف الكبيرة وعلامات الترقيم.", READ: "اقرأ القطعة الأول. الإجابة موجودة في النص.", PUNCT: "اكتب الجملة تاني بالحروف الكبيرة وعلامات الترقيم المناسبة." };
  const bx = (t) => String(t == null ? "" : t).replace(/([A-Za-z][A-Za-z0-9'\u2019\-]*(?:[ ,.:;!?]+[A-Za-z0-9'\u2019\-]+)*)|([^A-Za-z]+)/g, (m, l, o) => l ? '<bdi dir="ltr">' + h(l) + "</bdi>" : h(o));
  const h = (s) => String(s != null ? s : "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const $ = (s) => root.querySelector(s), ar = (n) => n.toLocaleString("ar-EG"), norm0 = (s) => esAnswerText(s).normalize("NFKC").replace(/[‘’]/g, "'").trim().replace(/\s+/g, " ").toLowerCase(), norm = (s) => norm0(esContr(s)), copyNorm = (s) => String(s).normalize("NFKC").trim().replace(/\s+/g, " ");
  let data, at = 0, filter = "all", progress = {}, orders = {}, key = "", chosen = null, words = [], saving = true;
  function correctNorm(s) {
    return norm(s).replace(/\bdoesn't\b/g, "does not").replace(/\bdon't\b/g, "do not").replace(/\bdidn't\b/g, "did not").replace(/\bisn't\b/g, "is not").replace(/\baren't\b/g, "are not").replace(/\bwasn't\b/g, "was not").replace(/\bweren't\b/g, "were not").replace(/\bwon't\b/g, "will not").replace(/\bcan't\b/g, "cannot").replace(/\bmustn't\b/g, "must not").replace(/\bshouldn't\b/g, "should not");
  }
  function optionOrder(q) {
    let seed = 2166136261;
    for (const c of data.grade + "-" + data.id + "-" + q.id + "-" + data.version) {
      seed ^= c.charCodeAt(0);
      seed = Math.imul(seed, 16777619) >>> 0;
    }
    const a = q.options.map((v, i) => i);
    for (let i = a.length - 1; i > 0; i--) {
      seed = Math.imul(seed, 1664525) + 1013904223 >>> 0;
      const j = seed % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function feedbackFx(ok, card) {
    var _a;
    document.querySelectorAll(".esfx-big,.esfx-bit,.esfx-wash").forEach((el) => {
      var _a2;
      (_a2 = el.getAnimations) == null ? void 0 : _a2.call(el).forEach((a) => a.cancel());
      el.remove();
    });
    (_a = window.__esFxTest) == null ? void 0 : _a.call(window, ok, card);
  }
  function list() {
    return data.questions.filter((q) => filter === "all" || q.type === filter);
  }
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify({ version: data.version, progress, at, filter }));
    } catch {
      saving = false;
      $(".esb-save-note").textContent = "المتصفح مش بيسمح بحفظ التقدم. تقدر تكمل هنا عادي.";
    }
  }
  function stats() {
    const qs = data.questions, done = qs.filter((q) => {
      var _a;
      return (_a = progress[q.id]) == null ? void 0 : _a.done;
    }).length, correct = qs.filter((q) => {
      var _a;
      return q.grading === "closed" && ((_a = progress[q.id]) == null ? void 0 : _a.correct);
    }).length, closed = qs.filter((q) => q.grading === "closed").length, review = qs.filter((q) => {
      var _a;
      return q.grading === "model_review" && ((_a = progress[q.id]) == null ? void 0 : _a.done);
    }).length;
    $(".esb-stats").textContent = "راجعت " + ar(done) + " من " + ar(qs.length) + " سؤال · إجابات مغلقة صحيحة: " + ar(correct) + " من " + ar(closed) + " · إجابات راجعتها مع النموذج: " + ar(review);
    $(".esb-meter i").style.width = done / qs.length * 100 + "%";
    $(".esb-meter").setAttribute("aria-valuenow", done);
    $(".esb-statgrid .s1").textContent = ar(done) + " / " + ar(qs.length);$(".esb-statgrid .s2").textContent = ar(correct) + " / " + ar(closed);$(".esb-statgrid .s3").textContent = ar(review);
    $(".esb-grid").innerHTML = qs.map((q) => {
      var _a, _b, _c;
      return '<button class="esb-jump' + (((_a = progress[q.id]) == null ? void 0 : _a.done) ? ' ok' : '') + ((q.id === ((_b = list()[at]) == null ? void 0 : _b.id)) ? ' now' : '') + '" data-jump="' + q.id + '" data-done="' + !!((_a = progress[q.id]) == null ? void 0 : _a.done) + '" aria-current="' + (q.id === ((_b = list()[at]) == null ? void 0 : _b.id)) + '" aria-label="سؤال ' + q.id + (((_c = progress[q.id]) == null ? void 0 : _c.done) ? "، اتراجع" : "") + '">' + ar(q.id) + "</button>";
    }).join("");
    $(".esb-grid").querySelectorAll("button").forEach((b) => b.onclick = () => {
      filter = "all";
      $(".esb-select").value = "all";
      at = data.questions.findIndex((q) => q.id === +b.dataset.jump);
      render(true);
    });
  }
  function remember(value) {
    const q = list()[at];
    progress[q.id] = { ...progress[q.id] || {}, value, done: false, correct: false };
    save();
    stats();
  }
  function tokens(q) {
    return q.prompt.split(/\s+[–—-]\s+/).map((x) => x.replace(/[.?!]+$/g, ""));
  }
  function ordered(q) {
    var _a;
    let s = words.map((i) => tokens(q)[i]).join(" ");
    if (s) s = s[0].toUpperCase() + s.slice(1);
    if (words.length === tokens(q).length) s += ((_a = q.answer.match(/[.?!]$/)) == null ? void 0 : _a[0]) || ".";
    return s;
  }
  function selection() {
    var _a, _b;
    const q = list()[at];
    return q.type === "REORDER" ? ordered(q) : (_b = (_a = $(".esb-input")) == null ? void 0 : _a.value) != null ? _b : chosen;
  }
  function render(scroll = false) {
    var _a;
    const qs = list();
    at = Math.max(0, Math.min(at, qs.length - 1));
    const q = qs[at], p = progress[q.id] || {};
    chosen = Number.isInteger(p.value) ? p.value : null;
    words = Array.isArray(p.value) ? p.value : [];
    const card = $(".esb-card");
    card.dataset.qid = q.id;
    card.dataset.type = q.type;
    card.innerHTML = '<p class="esb-count">السؤال ' + ar(q.id) + " من " + ar(data.questions.length) + (filter === "all" ? "" : " · " + ar(at + 1) + " من " + ar(qs.length) + " في النوع ده") + '</p><span class="esb-chip">' + h(labels[q.type]) + '</span><p class="esb-note">' + h(instructions[q.type]) + "</p>" + (q.passage ? '<p class="esb-passage-label">القطعة المرتبطة بالسؤال</p><div class="esb-passage" dir="ltr">' + h(q.passage) + "</div>" : "") + (q.wordbox ? '<div class="esb-box" aria-label="الكلمات المتاحة">' + q.wordbox.map((w) => "<span>" + h(w) + "</span>").join("") + "</div>" : "") + '<h2 class="esb-prompt" dir="auto">' + h(q.prompt) + '</h2><div class="esb-answer"></div><div class="esb-actions"><button class="ds-btn esb-primary esb-check">' + (q.grading === "model_review" ? "شوف النموذج وقارن" : "راجع إجابتي") + '</button></div><div class="esb-feedback" role="status" aria-live="polite" hidden></div>';
    const answer = $(".esb-answer");
    if (q.options) {
      if (!orders[q.id]) orders[q.id] = optionOrder(q);
      answer.innerHTML = '<div class="esb-options" role="group" aria-label="الإجابات">' + orders[q.id].map((i, n) => '<button class="ds-opt esb-option" data-choice="' + i + '" aria-pressed="' + (chosen === i) + '" dir="auto"><span class="k esb-letter">' + String.fromCharCode(65 + n) + "</span><bdi>" + h(q.options[i]) + "</bdi></button>").join("") + "</div>";
      answer.querySelectorAll("button").forEach((b) => b.onclick = () => {
        chosen = +b.dataset.choice;
        answer.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        remember(chosen);
        $(".esb-feedback").hidden = true;
      });
    } else if (q.type === "REORDER") {
      const parts = tokens(q);
      answer.innerHTML = '<div class="ds-reorder"><div class="ds-slots esb-reorder-answer" dir="ltr" aria-label="ترتيبك الحالي"></div><div class="ds-bank esb-reorder" aria-label="الكلمات"></div></div><div class="esb-actions"><button class="ds-btn ds-btn--soft esb-secondary esb-undo">رجّع آخر كلمة</button><button class="ds-btn ds-btn--soft esb-secondary esb-clear">ابدأ الترتيب تاني</button></div>';
      const redraw = () => {
        $(".esb-reorder-answer").textContent = ordered(q);
        $(".esb-reorder").innerHTML = parts.map((w, i) => '<button class="ds-word esb-token" data-word="' + i + '" ' + (words.includes(i) ? "disabled" : "") + ">" + h(w) + "</button>").join("");
        $(".esb-reorder").querySelectorAll("button").forEach((b) => b.onclick = () => {
          words.push(+b.dataset.word);
          remember([...words]);
          redraw();
        });
        $(".esb-feedback").hidden = true;
      };
      $(".esb-undo").onclick = () => {
        words.pop();
        remember([...words]);
        redraw();
      };
      $(".esb-clear").onclick = () => {
        words = [];
        remember([]);
        redraw();
      };
      redraw();
    } else {
      const multi = ["WRITE", "PUNCT"].includes(q.type) || q.type === "READ";
      answer.innerHTML = '<label class="esb-entry-label" for="esb-entry">' + (q.type === "LETTER" ? "الحرف الناقص" : "إجابتك") + "</label>" + (multi ? '<textarea id="esb-entry" class="esb-input" rows="4" dir="ltr" spellcheck="false"></textarea>' : '<input id="esb-entry" class="esb-input" dir="ltr" autocomplete="off" spellcheck="false"/>') + (q.min_words ? '<p class="esb-note">' + (q.sentences ? "اكتب " + ar(q.sentences) + " جمل و" : ["p2", "p3"].includes(data.grade) ? "اكتب ٣ جمل و" : "اكتب ") + ar(q.min_words) + ' كلمة على الأقل باستخدام الكلمات المساعدة.</p><p class="esb-wordcount"></p>' : "");
      $(".esb-input").value = typeof p.value === "string" ? p.value : "";
      const count = () => {
        if (q.min_words) {
          const n = ($(".esb-input").value.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g) || []).length;
          $(".esb-wordcount").textContent = "عدد الكلمات: " + ar(n) + " · ده عدّ للكلمات، مش تصحيح لغوي.";
        }
      };
      $(".esb-input").oninput = () => {
        remember($(".esb-input").value);
        $(".esb-feedback").hidden = true;
        count();
      };
      count();
    }
    if (["WRITE", "READ", "CORRECT"].includes(q.type) && !q.options) (_a = window.ESWrittenAI) == null ? void 0 : _a.attach(card, { question: q.prompt, passage: q.passage, alternatives: q.models || [q.answer], answer: () => {
      var _a2;
      return (_a2 = $(".esb-input")) == null ? void 0 : _a2.value;
    } });
    $(".esb-check").onclick = check;
    $(".esb-prev").disabled = at === 0;
    $(".esb-next").disabled = at === qs.length - 1;
    stats();
    save();
    if (scroll) (window.DS&&DS.scrollTo?DS.scrollTo(card,false):card.scrollIntoView({ block: "start" }));
  }
  function check() {
    var _a;
    const q = list()[at], value = selection(), feed = $(".esb-feedback");
    if (value === null || value === void 0 || typeof value === "string" && !value.trim() || q.type === "REORDER" && !words.length) {
      feed.className = "esb-feedback";
      feed.hidden = false;
      feed.textContent = "جرّب تكتب أو تختار إجابتك الأول.";
      return;
    }
    let ok = false;
    const models = q.models || [q.answer];
    if (q.grading === "model_review") {
      const exact = models.some((m) => norm(value) === norm(m));
      progress[q.id] = { value: q.type === "REORDER" ? [...words] : value, done: true, reviewed: true };
      feed.className = "esb-feedback";
      feed.innerHTML = (exact ? "إجابتك مطابقة للنموذج." : "نموذج إجابة صحيح. صياغتك ممكن تختلف وتكون صحيحة برضه.") + '<div class="esb-model" dir="ltr">' + models.map(h).join("\n") + '</div><p class="esb-note">' + (q.type === "PUNCT" ? "راجع بداية الجملة والأسماء وعلامة النهاية. فيه ترقيم صحيح ممكن يختلف حسب المعنى." : "قارن المعنى والقواعد. لو مش متأكد، اعرض إجابتك على مدرسك.") + '</p><p class="esb-note">السؤال ده للمراجعة، مش محسوب كتصحيح آلي صح أو غلط.</p>';
      if (exact) feedbackFx(true, $(".esb-card"));
    } else {
      ok = q.options ? value === q.answer_index : q.type === "COPY" ? copyNorm(value) === copyNorm(q.answer) : q.type === "CORRECT" ? correctNorm(value) === correctNorm(q.answer) : norm(value) === norm(q.answer);
      progress[q.id] = { value, done: true, correct: ok };
      feed.className = "ds-feedback esb-feedback " + (ok ? "ok" : "bad");
      feed.innerHTML = ok ? "أحسنت! إجابتك صح." : "<span>جرّب تاني. </span>" + (q.type === "COPY" ? "<span>راجع كل الحروف وعلامات الترقيم مع الجملة الأصلية.</span>" : "<span>الإجابة الصحيحة:</span>") + (q.type === "COPY" ? "" : '<div class="esb-model" dir="ltr"><bdi dir="ltr">' + h(q.options ? q.options[q.answer_index] : q.answer) + "</bdi></div>");
      feedbackFx(ok, $(".esb-card"));
    }
    if (typeof q.explanation_ar === "string" && q.explanation_ar.trim()) feed.innerHTML += '<div class="esb-explanation" dir="rtl"><strong>شرح الفكرة</strong><p>' + bx(q.explanation_ar) + "</p></div>";
    const exp = feed.querySelector(".esb-explanation p");
    if (exp) (_a = window.ESInterface) == null ? void 0 : _a.bindExplanation(exp, q);
    if (exp && lang() === "en") { const bx2 = exp.closest(".esb-explanation"); if (bx2) bx2.setAttribute("dir", "ltr"); exp.innerHTML = exp.textContent.replace(/([\u0600-\u06FF][\u0600-\u06FF\s\u064B-\u0652]*[\u0600-\u06FF]|[\u0600-\u06FF])/g, (m) => '<bdi dir="rtl">' + h(m) + "</bdi>").replace(/<\/bdi>(?=[^<]*$)/, "</bdi>"); }
    feed.hidden = false;
    save();
    stats();
  }
  async function init() {
    try {
      const file = FILE;
      if (!/^es-bank-(?:p[1-6]|m[1-3])-u[1-6]\.json$/.test(file)) throw Error("Invalid lesson");
      const r = await fetch(ESX.data + file + "?v=" + "x");
      if (!r.ok) throw Error("No data");
      data = await r.json();
      if (!Array.isArray(data.questions) || data.questions.length < 1 || data.questions.some((q) => !labels[q.type])) throw Error("Invalid data");
      key = "es-practice-" + data.grade + "-u" + data.id;
      try {
        const s = JSON.parse(localStorage.getItem(key) || "null");
        if ((s == null ? void 0 : s.version) === data.version) {
          progress = s.progress || {};
          at = +s.at || 0;
          filter = s.filter || "all";
        }
      } catch {
      }
      if (!["all", ...data.questions.map((q) => q.type)].includes(filter)) filter = "all";
      root.innerHTML = '<a class="grade-back" href="extra-assessments-' + h(data.grade) + '.html">← رجوع لتقييماتنا</a><p class="esb-note">تقييماتنا · ' + h(gradeLabels[data.grade] || data.grade) + " · الوحدة " + ar(data.id) + '</p><h1 dir="auto">' + h(data.title) + '</h1><p class="esb-lead">' + ar(data.questions.length) + ' سؤالًا من أنواع مختلفة. اقرأ وجرب، وبعدها راجع الإجابة. دي تدريبات أصلية للمراجعة، مش ورقة امتحان وزارة.</p><div class="esb-strip"><label class="esb-filter"><span class="esb-flbl">نوع السؤال</span> <span class="ds-sr" aria-hidden="true">⌄</span><select class="esb-select"><option value="all">كل الأسئلة</option>' + [...new Set(data.questions.map((q) => q.type))].map((t) => '<option value="' + t + '">' + h(labels[t]) + "</option>").join("") + '</select>' + ('<span class="ds-sr" aria-hidden="true">' + h((() => { const TT = ESX.T; const O = ["كل الأسئلة"].concat([...new Set(data.questions.map((q) => q.type))].map((t) => labels[t])).map(TT).join(""); return TT("نوع السؤال") + " " + O + TT("كل الأسئلة") + TT("كل الأسئلة") + "⌄" + O; })()) + "</span>") + '<span class="ds-sr" aria-hidden="true">' + ["كل الأسئلة"].concat([...new Set(data.questions.map((q) => q.type))].map((t) => labels[t])).map((t) => "<span>" + h(t) + "</span>").join(" ") + '</span></label></div><aside class="ds-side esb-side"><p class="esb-stats ds-sr" aria-live="polite"></p><div class="ds-stats esb-statgrid" aria-hidden="true"><div class="ds-stat"><b class="s1" dir="ltr"></b><small>راجعت</small></div><div class="ds-stat"><b class="s2" dir="ltr"></b><small>صحيحة</small></div><div class="ds-stat"><b class="s3" dir="ltr"></b><small>مع النموذج</small></div></div><div class="ds-progress esb-meter" role="progressbar" aria-label="الأسئلة اللي راجعتها" aria-valuemin="0" aria-valuemax="' + data.questions.length + '"><i></i></div></aside><article class="esb-card"></article><div class="esb-nav"><button class="ds-btn ds-btn--soft esb-secondary esb-prev">السابق</button><button class="ds-btn esb-primary esb-next">التالي ←</button></div><aside class="ds-side esb-side esb-side2"><details class="esb-map" open><summary>اختار رقم سؤال</summary><div class="esb-grid ds-map"></div></details></aside><p class="esb-note esb-save-note">تقدمك محفوظ على الجهاز ده بس، ومش بيتبعت لحد. الكتابة الحرة لها نموذج، مش درجة آلية.</p><button class="esb-reset">امسح تقدمي في الوحدة دي</button>';
      $(".esb-select").value = filter;
      $(".esb-select").onchange = (e) => {
        filter = e.target.value;
        at = 0;
        render(true);
      };
      $(".esb-prev").onclick = () => {
        at--;
        render(true);
      };
      $(".esb-next").onclick = () => {
        at++;
        render(true);
      };
      $(".esb-reset").onclick = () => {
        if (confirm("تمسح إجاباتك المحفوظة للوحدة دي؟")) {
          progress = {};
          at = 0;
          filter = "all";
          $(".esb-select").value = filter;
          render();
        }
      };
      render();
    } catch (e) {
      root.innerHTML = '<h1>الأسئلة مش متاحة دلوقتي</h1><p>جرّب تحميل الصفحة تاني لما الاتصال يرجع.</p><button class="ds-btn esb-primary" onclick="location.reload()">حاول تاني</button>';
    }
  }
  init();

};

})();
