import { VerifiedQaItem } from '../types/nafas';

export const VERIFIED_QA_ITEMS: VerifiedQaItem[] = [
  {
    id: 'qa-infant-no-abdominal-thrusts',
    category: 'infant',
    question: {
      en: 'Why are abdominal thrusts (the Heimlich maneuver) strictly prohibited for infants under 1 year old?',
      ar: 'لماذا تُمنع ضغطات البطن (مناورة هيمليك) منعاً باتاً للرضّع دون عمر السنة؟',
    },
    shortAnswer: {
      en: 'An infant’s liver and internal abdominal organs are fragile and extend below the rib cage; abdominal thrusts can cause severe internal organ injury.',
      ar: 'لأن كبد الرضيع وأعضاءه البطنية تكون حساسة وتمتد أسفل القفص الصدري، مما يجعل ضغطات البطن سبباً لإصابة الأعضاء الداخلية.',
    },
    detailedExplanation: {
      en: 'In infants under 12 months, the rib cage does not fully shield the upper abdominal organs, especially the liver. Instead, support the infant face-down along your forearm/thigh with the head lower than the chest for up to 5 back blows, then turn face-up for up to 5 two-finger chest thrusts on the breastbone.',
      ar: 'لدى الرضّع دون عمر ١٢ شهراً، لا يغطي القفص الصدري أعضاء البطن العلوية بالكامل وخصوصاً الكبد. وبدلاً من ذلك، يُسند الرضيع على بطنه فوق الساعد/الفخذ مع خفض الرأس عن الصدر لتوجيه حتى ٥ ضربات ظهر، تليها حتى ٥ ضغطات صدر بإصبعين.',
    },
    criticalRule: {
      en: 'Under 1 Year = Up to 5 Back Blows + Up to 5 Two-Finger Chest Thrusts. Never compress an infant’s abdomen.',
      ar: 'أقل من سنة = حتى ٥ ضربات ظهر + حتى ٥ ضغطات صدر بإصبعين. لا تضغط على بطن الرضيع أبداً.',
    },
    sourceArticleId: 'infant-choking-protocol',
    guidelineCitation: {
      en: 'Dr. Mai Mahran Lecture (Slide 21) • Resuscitation Council UK (2025) & American Red Cross',
      ar: 'محاضرة د. مي مهران (شريحة ٢١) • مجلس الإنعاش البريطاني (2025) والصليب الأحمر الأمريكي',
    },
  },
  {
    id: 'qa-mild-vs-severe-cough',
    category: 'general',
    question: {
      en: 'Why shouldn’t I perform abdominal thrusts or back blows when a choking person is coughing loudly?',
      ar: 'لماذا لا يجب تطبيق ضغطات البطن أو ضربات الظهر عندما يكون المصاب يسعل بصوت مرتفع؟',
    },
    shortAnswer: {
      en: 'A loud, forceful cough indicates mild airway obstruction—the body’s natural cough reflex clears partial blockages more safely than external blows.',
      ar: 'يدل السعال القوي والمسموع على انسداد بسيط؛ ومنعكس السعال الطبيعي للجسم يطرد الانسداد الجزئي بأمان.',
    },
    detailedExplanation: {
      en: 'Lecture Slide 10 & 11: To produce a loud cough, air must still be passing into the lungs. Stay with the person, reassure them, and encourage them to keep coughing. Do not give water or slap their back while the cough remains effective. Intervene physically only if the cough becomes silent/ineffective.',
      ar: 'شريحة المحاضرة ١٠ و١١: لكي يصدر سعال قوي ومسموع، لا بد أن الهواء لا يزال يمر نحو الرئتين. ابقَ مع المصاب، طمئنه وشجّعه على مواصلة السعال، ولا تعطِه ماءً أو تضرب ظهره طالما السعال فعّال. تدخّل فوراً إذا أصبح السعال صامتاً.',
    },
    criticalRule: {
      en: 'Loud Effective Cough = Encourage Coughing & Monitor. Silent Cough / Cannot Speak = Up to 5 Back Blows & Up to 5 Thrusts.',
      ar: 'سعال قوي ومسموع = شجّع على السعال وراقب. سعال صامت أو عجز عن الكلام = حتى ٥ ضربات ظهر وحتى ٥ ضغطات.',
    },
    sourceArticleId: 'recognizing-mild-vs-severe-obstruction',
    guidelineCitation: {
      en: 'Dr. Mai Mahran Lecture (Slides 10–11) • Resuscitation Council UK (2025)',
      ar: 'محاضرة د. مي مهران (شرائح ١٠–١١) • مجلس الإنعاش البريطاني (2025)',
    },
  },
  {
    id: 'qa-blind-finger-sweep',
    category: 'general',
    question: {
      en: 'Why are blind finger sweeps dangerous in choking emergencies?',
      ar: 'لماذا يُعد المسح العشوائي بالإصبع داخل الفم خطيراً في حالات الاختناق؟',
    },
    shortAnswer: {
      en: 'Reaching fingers into the throat without clearly seeing a loose object pushes the blockage deeper into the breathing passage.',
      ar: 'إدخال الإصبع في الحلق دون رؤية الجسم الغريب بوضوح يدفع الجسم أعمق داخل مجرى التنفس ويسد الحنجرة تماماً.',
    },
    detailedExplanation: {
      en: 'In addition to wedging a partial blockage completely into the larynx, blind sweeping can injure delicate throat tissues. Only remove an object from the mouth if you can clearly see it.',
      ar: 'بالإضافة إلى دفع الجسم الغريب لسد الحنجرة بالكامل، قد يسبب إدخال الإصبع جرح أنسجة البلعوم. لا تُخرج أي جسم بأصابعك إلا إذا نظرت داخل الفم ورأيته بوضوح أمامك.',
    },
    criticalRule: {
      en: 'Look First: Remove a foreign object from the mouth ONLY if it is clearly visible.',
      ar: 'انظر أولاً: لا تلتقط أي جسم غريب من الفم إلا إذا كان مرئياً بوضوح.',
    },
    sourceArticleId: 'common-choking-first-aid-mistakes',
    guidelineCitation: {
      en: 'Resuscitation Council UK (2025) & American Red Cross First Aid Guidelines',
      ar: 'إرشادات مجلس الإنعاش البريطاني (2025) والصليب الأحمر الأمريكي',
    },
  },
  {
    id: 'qa-pregnancy-or-large-abdomen',
    category: 'adult',
    question: {
      en: 'How do you modify choking rescue maneuvers for a pregnant woman or a large person whose abdomen you cannot reach around?',
      ar: 'كيف يتم تعديل إسعاف الاختناق للمرأة الحامل أو للشخص الذي يتعذر إحاطة بطنه؟',
    },
    shortAnswer: {
      en: 'Give up to 5 back blows, then perform up to 5 backward CHEST thrusts at the middle of the breastbone (sternum) instead of abdominal thrusts.',
      ar: 'وجّه حتى ٥ ضربات ظهر، ثم نفّذ حتى ٥ ضغطات صدر في منتصف عظمة القص للخلف بدلاً من ضغطات البطن.',
    },
    detailedExplanation: {
      en: 'Lecture Slide 22: Standing behind the pregnant woman or large adult, pass your arms under their armpits to encircle the chest. Place the thumb side of your fist on the middle of the chest (breastbone), grasp your fist with your other hand, and pull straight backward up to 5 times.',
      ar: 'شريحة المحاضرة ٢٢: قف خلف المصاب ومرّر ذراعيك تحت إبطيه لإحاطة الصدر. ضع قبضة يدك في منتصف الصدر (عظمة القص)، وأمسكها باليد الأخرى، ثم اسحب للخلف مباشرة حتى ٥ مرات.',
    },
    criticalRule: {
      en: 'Pregnancy or Large Abdomen = Up to 5 Back Blows + Up to 5 Chest Thrusts (Never Abdominal Thrusts).',
      ar: 'الحمل أو البطن الكبير = حتى ٥ ضربات ظهر + حتى ٥ ضغطات صدر (يُمنع ضغط البطن).',
    },
    sourceArticleId: 'adult-choking-protocol',
    guidelineCitation: {
      en: 'Dr. Mai Mahran Lecture (Slide 22) • American Red Cross & Resuscitation Council UK',
      ar: 'محاضرة د. مي مهران (شريحة ٢٢) • الصليب الأحمر الأمريكي ومجلس الإنعاش البريطاني',
    },
  },
  {
    id: 'qa-wheelchair-and-alone',
    category: 'adult',
    question: {
      en: 'What should you do if a choking person is in a wheelchair, or if you are choking while completely alone?',
      ar: 'ماذا تفعل إذا كان المصاب بالاختناق على كرسي متحرك، أو إذا اختنقت وأنت بمفردك تماماً؟',
    },
    shortAnswer: {
      en: 'For a wheelchair user (Slide 24): lock the brakes, keep them seated, and kneel behind the wheelchair for back blows and thrusts. If alone (Slide 23): call emergency services and press your upper abdomen over a firm blunt edge like a chair back.',
      ar: 'لمستخدم الكرسي المتحرك (شريحة ٢٤): ثبّت المكابح وأبقِه جالساً واركع خلف الكرسي لضربات الظهر والضغطات. وإذا كنت وحيداً (شريحة ٢٣): اتصل بالإسعاف واضغط بأعلى بطنك فوق حافة ثابتة غير حادة كظهر كرسي.',
    },
    detailedExplanation: {
      en: 'Do not waste time trying to lift a choking person out of their wheelchair—stabilize the chair and work from behind. When alone, dialing emergency services on speakerphone ensures dispatchers can locate you while you perform self-abdominal thrusts with your fist or against a sturdy chair back or countertop.',
      ar: 'لا تضيع الوقت في محاولة رفع المصاب من الكرسي المتحرك — ثبّت الكرسي واعمل من خلف المسند. وعندما تكون وحيداً، اتصل بالإسعاف عبر مكبر الصوت، ونفّذ ضغطات البطن لنفسك بقبضتك أو بالانحناء والضغط فوق حافة كرسي متين أو طاولة.',
    },
    criticalRule: {
      en: 'Wheelchair = Lock Brakes & Kneel Behind. Alone = Call EMS + Self-Thrusts Over a Firm Blunt Chair Edge.',
      ar: 'الكرسي المتحرك = ثبّت المكابح واركع خلفه. وحيداً = اتصل بالإسعاف + ضغطات ذاتية فوق حافة كرسي ثابتة.',
    },
    sourceArticleId: 'adult-choking-protocol',
    guidelineCitation: {
      en: 'Dr. Mai Mahran Lecture (Slides 23–24) • American Red Cross',
      ar: 'محاضرة د. مي مهران (شريحتا ٢٣–٢٤) • الصليب الأحمر الأمريكي',
    },
  },
  {
    id: 'qa-unresponsive-transition',
    category: 'adult',
    question: {
      en: 'What should I do immediately if a choking adult, child, or infant loses consciousness and goes limp?',
      ar: 'ماذا أفعل فوراً إذا فقد المصاب بالاختناق (بالغ أو طفل أو رضيع) وعيه وارتخى جسمه؟',
    },
    shortAnswer: {
      en: 'Lower them safely onto a firm flat surface, ensure emergency services are called, check the mouth only for a visible object, and start CPR / basic life support according to your training.',
      ar: 'أنزله بأمان على سطح صلب ومستوٍ، وتأكد من الاتصال بالإسعاف، وافحص الفم لإزالة أي جسم مرئي بوضوح فقط، وابدأ الإنعاش الأساسي حسب التدريب.',
    },
    detailedExplanation: {
      en: 'Lecture Slide 17: When a choking victim becomes unresponsive, stop standing thrusts immediately and place them flat on their back on a firm surface. Call emergency services, open the mouth to look for any clearly visible object (never do a blind finger sweep), and begin CPR according to your training.',
      ar: 'شريحة المحاضرة ١٧: عند فقدان المصاب لوعيه، أوقف ضغطات البطن القائمة فوراً وضعه على ظهره فوق سطح صلب. اطلب الإسعاف، وافتح الفم للنظر وإزالة أي جسم مرئي فقط (دون مسح عشوائي بالأصابع)، وابدأ الإنعاش حسب التدريب.',
    },
    criticalRule: {
      en: 'Unresponsive Choking Victim = Firm Flat Surface → Call Ambulance → Visual Mouth Check Only → Start CPR According to Training.',
      ar: 'فقدان الوعي أثناء الاختناق = سطح صلب ← اتصال بالإسعاف ← فحص بصري للفم فقط ← بدء الإنعاش حسب التدريب.',
    },
    sourceArticleId: 'unresponsive-transition-and-cpr',
    guidelineCitation: {
      en: 'Dr. Mai Mahran Lecture (Slide 17) • Resuscitation Council UK (2025)',
      ar: 'محاضرة د. مي مهران (شريحة ١٧) • مجلس الإنعاش البريطاني (2025)',
    },
  },
  {
    id: 'qa-child-positioning',
    category: 'child',
    question: {
      en: 'How does choking first aid for a child over 1 year differ from an adult and an infant?',
      ar: 'كيف يختلف إسعاف الاختناق لدى الطفل فوق عمر سنة عن كل من البالغ والرضيع؟',
    },
    shortAnswer: {
      en: 'A child over 1 year receives up to 5 back blows and up to 5 abdominal thrusts like an adult, but you must kneel or bend behind the child to match their height—and never pick a child up and shake them upside down!',
      ar: 'يتلقى الطفل فوق عمر سنة حتى ٥ ضربات ظهر وحتى ٥ ضغطات بطن مثل البالغ، ولكن يجب الركوع خلف الطفل لمطابقة طوله — ويُمنع تماماً رفع الطفل وهزّه مقلوباً!',
    },
    detailedExplanation: {
      en: 'Lecture Slides 19–20: Kneeling behind the child ensures proper hand placement between the navel and breastbone with force calibrated to the child’s size. Slide 20 explicitly warns: "Never pick up a child and shake him upside down!"',
      ar: 'شريحتا المحاضرة ١٩–٢٠: الركوع خلف الطفل يضمن دقة موضع القبضة فوق السرة وأسفل عظمة القص مع توجيه قوة متوازنة. وتحذر شريحة ٢٠ صراحةً: «لا ترفع الطفل وتهزّه مقلوباً أبداً!».',
    },
    criticalRule: {
      en: 'Child (>1 Year) = Kneel to Match Height + Up to 5 Back Blows & Up to 5 Abdominal Thrusts. Never Shake Upside Down.',
      ar: 'الطفل (فوق سنة) = الركوع لمستوى طوله + حتى ٥ ضربات ظهر وحتى ٥ ضغطات بطن. لا تهزّه مقلوباً أبداً.',
    },
    sourceArticleId: 'child-choking-protocol',
    guidelineCitation: {
      en: 'Dr. Mai Mahran Lecture (Slides 19–20) • Resuscitation Council UK (2025) & American Red Cross',
      ar: 'محاضرة د. مي مهران (شريحتا ١٩–٢٠) • مجلس الإنعاش البريطاني (2025) والصليب الأحمر الأمريكي',
    },
  },
];
