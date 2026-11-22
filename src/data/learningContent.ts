import { LearningArticle } from '../types/nafas';

export const LEARNING_ARTICLES: LearningArticle[] = [
  {
    id: 'understanding-choking-fundamentals',
    categoryId: 'understanding-choking',
    ageRelevance: 'all',
    readingTimeMinutes: 4,
    featured: true,
    illustration: 'airway-anatomy',
    title: {
      en: 'Understanding Foreign-Body Airway Obstruction (Choking)',
      ar: 'فهم انسداد مجرى الهواء بجسم غريب (الاختناق)',
    },
    summary: {
      en: 'Learn the anatomical mechanism of choking, how food or small objects block the pharynx and trachea, and why rapid recognition prevents hypoxic brain injury.',
      ar: 'تعرّف على الآلية التشريحية للاختناق، وكيف تسد الأطعمة أو الأجسام الصغيرة البلعوم والقصبة الهوائية، ولماذا يمنع التدخل السريع نقص الأكسجين الدماغي.',
    },
    keyTakeaways: [
      {
        en: 'Choking occurs when a foreign object lodges in the pharynx, larynx, or trachea, restricting airflow to the lungs.',
        ar: 'يحدث الاختناق عندما يستقر جسم غريب في البلعوم أو الحنجرة أو القصبة الهوائية، مما يعيق وصول الهواء إلى الرئتين.',
      },
      {
        en: 'Brain cells begin suffering irreversible hypoxic injury within 4 to 6 minutes of complete oxygen deprivation.',
        ar: 'تبدأ خلايا الدماغ بالتأثر بنقص الأكسجين خلال 4 إلى 6 دقائق من الانقطاع الكامل للتنفس.',
      },
      {
        en: 'Rescue techniques work by artificially generating a sharp surge in intrathoracic (chest/airway) pressure to expel the object like a cork.',
        ar: 'تعتمد مناورات الإسعاف على توليد موجة ضغط مفاجئة داخل الصدر ومجرى الهواء لدفع الجسم العالق للخارج.',
      },
    ],
    sections: [
      {
        heading: {
          en: '1. The Shared Pathway: Pharynx, Epiglottis, and Trachea',
          ar: '1. المسار المشترك: البلعوم ولسان المزمار والقصبة الهوائية',
        },
        body: {
          en: 'In human anatomy, the upper pharynx serves as a shared passageway for both air and swallowed food. During normal swallowing, a cartilage flap called the epiglottis folds downward over the larynx (voice box) to shield the trachea (windpipe). Choking happens when inhalation occurs unexpectedly while food or an object is in the hypopharynx, drawing the item past the epiglottis into the airway.',
          ar: 'في التشريح البشري، يمثل البلعوم العلوي ممراً مشتركاً للهواء والطعام. أثناء البلع الطبيعي، ينثني غضروف يُسمى «لسان المزمار» ليغلق مدخل الحنجرة ويحمي القصبة الهوائية. يحدث الاختناق عندما يستنشق الشخص الهواء فجأة أثناء وجود طعام أو جسم في البلعوم، مما يؤدي لانزلاقه نحو مجرى التنفس.',
        },
        bulletPoints: [
          {
            en: 'In adults, choking most commonly involves inadequately chewed meat or eating while talking or laughing.',
            ar: 'لدى البالغين، غالباً ما يرتبط الاختناق بقطع الطعام الكبيرة غير الممضوغة جيداً أو التحدث والضحك أثناء الأكل.',
          },
          {
            en: 'In young children and infants, an immature swallowing reflex, narrow airway diameter, and tendency to place small objects in the mouth significantly elevate risk.',
            ar: 'لدى الأطفال والرضّع، يزداد الخطر بسبب ضيق قطر مجرى الهواء، وعدم اكتمال مهارة المضغ، ووضع الأشياء الصغيرة في الفم.',
          },
        ],
      },
      {
        heading: {
          en: '2. Why Time and Pressure Mechanics Matter',
          ar: '2. أهمية عامل الوقت وآلية الضغط داخل الصدر',
        },
        body: {
          en: 'Even when an airway is completely blocked, residual air remains inside the lungs. First-aid interventions—such as back blows, abdominal thrusts, and chest thrusts—compress this trapped residual air inside the lungs to create an artificial cough capable of dislodging the obstruction.',
          ar: 'حتى عند انسداد مجرى الهواء بالكامل، تظل كمية من الهواء المتبقي داخل الرئتين. تعمل إجراءات الإسعاف—مثل الضربات الظهرية وضغطات البطن وضغطات الصدر—على ضغط هذا الهواء المتبقي لتوليد قوة دفع شبيهة بالسعال القوي لطرد الجسم الغريب.',
        },
        calloutTitle: {
          en: 'Clinical Principle',
          ar: 'مبدأ سريري أساسي',
        },
        calloutText: {
          en: 'A person’s own natural, forceful cough generates higher airway pressure than any external physical maneuver. Therefore, physical thrusts are reserved strictly for severe obstruction where the victim cannot cough effectively.',
          ar: 'يولّد السعال الطبيعي القوي للمصاب ضغطاً هوائياً أعلى من أي مناورة خارجية؛ لذلك تُخصص المناورات البدنية لحالات الانسداد الشديد فقط عندما يعجز المصاب عن السعال الفعّال.',
        },
        calloutVariant: 'info',
      },
    ],
    references: [
      {
        organization: {
          en: 'Resuscitation Council UK (2025)',
          ar: 'مجلس الإنعاش في المملكة المتحدة (2025)',
        },
        documentTitle: {
          en: 'Adult, Paediatric and Infant Basic Life Support Guidelines — Choking Management',
          ar: 'إرشادات دعم الحياة الأساسي للبالغين والأطفال والرضّع — التعامل مع الاختناق',
        },
        year: '2025',
      },
      {
        organization: {
          en: 'American Red Cross (ARC)',
          ar: 'الصليب الأحمر الأمريكي (ARC)',
        },
        documentTitle: {
          en: 'First Aid Guidelines for Foreign-Body Airway Obstruction (Dr. Mai Mahran Lecture)',
          ar: 'إرشادات الإسعافات الأولية لانسداد مجرى الهواء (محاضرة د. مي مهران)',
        },
        year: '2025',
      },
    ],
    relatedArticleIds: ['recognizing-mild-vs-severe-obstruction', 'adult-choking-protocol'],
    relatedScenarioAge: 'adult',
  },
  {
    id: 'recognizing-mild-vs-severe-obstruction',
    categoryId: 'recognizing-obstruction',
    ageRelevance: 'all',
    readingTimeMinutes: 5,
    featured: true,
    illustration: 'mild-vs-severe',
    title: {
      en: 'Recognizing Airway Obstruction: Mild vs. Severe Choking',
      ar: 'التعرف على انسداد مجرى الهواء: الفرق بين الانسداد الجزئي والشديد',
    },
    summary: {
      en: 'The single most important assessment before touching a choking person is distinguishing an effective cough (mild obstruction) from an ineffective or silent cough (severe obstruction).',
      ar: 'أهم خطوة تقييمية قبل لمس المصاب بالاختناق هي التمييز بين السعال الفعّال (انسداد جزئي) والسعال الصامت أو غير الفعّال (انسداد شديد).',
    },
    keyTakeaways: [
      {
        en: 'Ask clearly: "Are you choking?" If the person can speak, cry, or cough loudly, the obstruction is mild (partial).',
        ar: 'اسأل المصاب بوضوح: «هل تختنق؟» إذا كان قادراً على الكلام أو البكاء أو السعال بصوت مسموع، فالانسداد جزئي (بسيط).',
      },
      {
        en: 'In mild obstruction, encourage continuous coughing and monitor closely—do not slap the back or perform thrusts while they are coughing effectively.',
        ar: 'في الانسداد الجزئي، شجّع المصاب على مواصلة السعال وراقبه عن كثب—ولا تقم بضغطات البطن طالما أن سعاله فعّال.',
      },
      {
        en: 'Clutching the throat with one or both hands (the Universal Choking Sign), inability to speak, silent coughing efforts, or high-pitched wheezing indicate severe obstruction requiring immediate physical action.',
        ar: 'إمساك الرقبة بيد واحدة أو باليدين (علامة الاختناق العالمية)، وعدم القدرة على الكلام، والسعال الصامت، أو صدور صفير حاد يدل على انسداد شديد يتطلب تدخلاً فورياً.',
      },
    ],
    sections: [
      {
        heading: {
          en: '1. Signs of Mild (Partial) Airway Obstruction',
          ar: '1. علامات الانسداد الجزئي (البسيط) لمجرى الهواء',
        },
        body: {
          en: 'When an airway is only partially obstructed, sufficient air can still pass into and out of the lungs to power a protective cough reflex. The rescuer’s role is supportive observation.',
          ar: 'عندما يكون مجرى الهواء مسدوداً جزئياً فقط، يظل بإمكان الهواء المرور من وإلى الرئتين لتشغيل منعكس السعال الطبيعي. دور المسعف هنا هو التشجيع والمراقبة الدقيقة.',
        },
        bulletPoints: [
          {
            en: 'Loud, forceful coughing with ability to take a breath before coughing.',
            ar: 'سعال قوي ومسموع مع القدرة على أخذ نَفَس قبل السعال.',
          },
          {
            en: 'Able to answer questions verbally or cry loudly (in children and infants).',
            ar: 'القدرة على الإجابة لفظياً أو البكاء بصوت مرتفع (لدى الأطفال والرضّع).',
          },
          {
            en: 'Fully alert and responsive with normal skin and lip color.',
            ar: 'وعي كامل واستجابة طبيعية مع لون طبيعي للجلد والشفتين.',
          },
        ],
      },
      {
        heading: {
          en: '2. Signs of Severe (Complete) Airway Obstruction',
          ar: '2. علامات الانسداد الشديد (الكلي) لمجرى الهواء',
        },
        body: {
          en: 'When the object blocks air exchange almost completely, the victim cannot move enough air to cough or vocalize. Immediate external intervention is mandatory.',
          ar: 'عندما يمنع الجسم الغريب تبادل الهواء بشكل شبه كامل، يعجز المصاب عن إخراج صوت أو سعال فعّال. هنا يصبح التدخل البدني الفوري إلزامياً لإنقاذ حياته.',
        },
        bulletPoints: [
          {
            en: 'Universal Choking Sign: Hands clutching the neck with a panicked expression.',
            ar: 'علامة الاختناق العالمية: إمساك الرقبة باليدين مع ملامح ذعر واضحة.',
          },
          {
            en: 'Silent cough or inability to speak, breathe, or emit vocal sounds.',
            ar: 'سعال صامت أو عدم القدرة على الكلام أو التنفس أو إصدار صوت.',
          },
          {
            en: 'High-pitched inspiratory noise (stridor) or bluish discoloration of lips and face (cyanosis).',
            ar: 'صوت صفير حاد عند محاولة الشهيق (صرير حنجري) أو ازرقاق الشفتين والوجه.',
          },
        ],
        calloutTitle: {
          en: 'Immediate Escalation Rule',
          ar: 'قاعدة التصعيد الفوري',
        },
        calloutText: {
          en: 'A mild obstruction can suddenly progress to a severe obstruction if the object shifts. Never leave a coughing person unattended.',
          ar: 'قد يتحول الانسداد الجزئي فجأة إلى انسداد شديد إذا تحرك الجسم الغريب؛ لذا لا تترك المصاب الذي يسعل بمفرده أبداً.',
        },
        calloutVariant: 'warning',
      },
    ],
    references: [
      {
        organization: {
          en: 'American Red Cross (ARC)',
          ar: 'الصليب الأحمر الأمريكي (ARC)',
        },
        documentTitle: {
          en: 'First Aid/CPR/AED Participant’s Manual: Conscious Choking Assessment',
          ar: 'دليل الإسعافات الأولية والإنعاش القلبي الرئوي: تقييم الاختناق لدى المصاب الواعي',
        },
        year: '2021',
      },
      {
        organization: {
          en: 'Resuscitation Council UK',
          ar: 'مجلس الإنعاش في المملكة المتحدة',
        },
        documentTitle: {
          en: 'assessing Severity of Foreign Body Airway Obstruction',
          ar: 'تقييم شدة انسداد مجرى الهواء بجسم غريب',
        },
        year: '2021',
      },
    ],
    relatedArticleIds: ['adult-choking-protocol', 'child-choking-protocol', 'infant-choking-protocol'],
    relatedScenarioAge: 'adult',
  },
  {
    id: 'adult-choking-protocol',
    categoryId: 'adult-education',
    ageRelevance: 'adult',
    readingTimeMinutes: 5,
    featured: true,
    illustration: 'adult-abdominal-thrusts',
    title: {
      en: 'Adult Choking First Aid (18+ Years): Step-by-Step Protocol',
      ar: 'إسعاف اختناق البالغين (18 سنة فأكثر): الدليل السريري خطوة بخطوة',
    },
    summary: {
      en: 'Master the evidence-based rescue sequence for a conscious choking adult, including positioning for inward-and-upward abdominal thrusts, back blows, and special considerations for pregnancy.',
      ar: 'أتقن خطوات الإنقاذ المبنية على الأدلة للبالغ الواعي المصاب بالاختناق، بما في ذلك وضعية ضغطات البطن للداخل وللأعلى، والضربات الظهرية، والحالات الخاصة كالحمل.',
    },
    keyTakeaways: [
      {
        en: 'Confirm severe obstruction first ("Are you choking?"), send someone to call emergency services, and obtain consent if the adult is conscious.',
        ar: 'تأكد أولاً من وجود انسداد شديد («هل تختنق؟»)، واطلب من شخص الاتصال بالطوارئ، وابدأ التدخل فوراً.',
      },
      {
        en: 'Place your fist thumb-side in just above the navel and well below the breastbone (xiphoid process), delivering quick inward and upward thrusts.',
        ar: 'ضع قبضة يدك (جهة الإبهام للداخل) فوق السرة مباشرة وأسفل عظمة القص بمسافة آمنة، ووجّه ضغطات سريعة للداخل وللأعلى.',
      },
      {
        en: 'For pregnant individuals or when you cannot reach around the abdomen, perform chest thrusts at the center of the sternum instead of abdominal thrusts.',
        ar: 'للحوامل أو عند تعذر إحاطة البطن، استبدل ضغطات البطن بضغطات صدرية في منتصف عظمة القص.',
      },
    ],
    sections: [
      {
        heading: {
          en: '1. Confirm Severe Obstruction and Activate Emergency Response',
          ar: '1. تأكيد الانسداد الشديد وتفعيل استجابة الطوارئ',
        },
        body: {
          en: 'If an adult clutches their throat and cannot speak, cough forcefully, or breathe, inform them you are going to help and instruct a bystander to call emergency medical services immediately.',
          ar: 'إذا أمسك البالغ برقبته وعجز عن الكلام أو السعال الفعّال أو التنفس، أخبره أنك ستساعده واطلب من أحد المتواجدين الاتصال بالإسعاف فوراً.',
        },
      },
      {
        heading: {
          en: '2. Performing Abdominal Thrusts (Heimlich Maneuver) & Back Blows',
          ar: '2. تطبيق ضغطات البطن (مناورة هيمليك) والضربات الظهرية',
        },
        body: {
          en: 'Lecture Slides 12–16 (Resuscitation Council UK 2025 & American Red Cross): Combine up to 5 sharp back blows between the shoulder blades followed by up to 5 inward-and-upward abdominal thrusts.',
          ar: 'شرائح المحاضرة ١٢–١٦ (مجلس الإنعاش البريطاني 2025 والصليب الأحمر الأمريكي): اجمع بين حتى ٥ ضربات ظهرية بين لوحي الكتف تليها حتى ٥ ضغطات بطنية للداخل وللأعلى.',
        },
        bulletPoints: [
          {
            en: 'Stand behind the adult and wrap your arms around their waist; place one foot slightly between theirs for stable balance.',
            ar: 'قف خلف المصاب ولف ذراعيك حول خصره، وضع إحدى قدميك بين قدميه لتأمين التوازن في حال فقد وعيه.',
          },
          {
            en: 'Make a fist with one hand and position the thumb side against the midline of the abdomen, just above the navel and well below the tip of the sternum.',
            ar: 'اصنع قبضة بإحدى يديك وضع جانب الإبهام على منتصف البطن فوق السرة مباشرة وبعيداً عن الطرف السفلي لعظمة القص.',
          },
          {
            en: 'Grasp your fist with your other hand and deliver up to 5 distinct, forceful inward and upward thrusts until the object is expelled or the person becomes unresponsive.',
            ar: 'أمسك قبضتك باليد الأخرى ووجّه حتى ٥ ضغطات قوية ومنفصلة للداخل وللأعلى حتى يخرج الجسم الغريب أو يفقد المصاب وعيه.',
          },
        ],
        calloutTitle: {
          en: 'Special Clinical Adaptation: Pregnancy or Large Abdomen (Slide 22)',
          ar: 'تعديل سريري هام: الحمل أو البطن الكبير (شريحة ٢٢)',
        },
        calloutText: {
          en: 'Never apply abdominal thrusts to a pregnant woman or large person. Instead, wrap your arms under the armpits, place your fist on the middle of the breastbone (sternum), and perform up to 5 firm backward chest thrusts.',
          ar: 'لا تطبّق ضغطات البطن أبداً على المرأة الحامل أو ذوي البطن الكبير. بدلاً من ذلك، مرّر ذراعيك تحت الإبطين، وضع قبضتك في منتصف عظمة القص، ووجّه حتى ٥ ضغطات صدرية للخلف.',
        },
        calloutVariant: 'warning',
      },
    ],
    references: [
      {
        organization: {
          en: 'Resuscitation Council UK (2025)',
          ar: 'مجلس الإنعاش في المملكة المتحدة (2025)',
        },
        documentTitle: {
          en: 'Adult Basic Life Support Algorithm for Foreign-Body Airway Obstruction',
          ar: 'خوارزمية دعم الحياة الأساسي للبالغين في حالات انسداد مجرى الهواء',
        },
        year: '2025',
      },
      {
        organization: {
          en: 'American Red Cross (ARC)',
          ar: 'الصليب الأحمر الأمريكي (ARC)',
        },
        documentTitle: {
          en: 'Care for a Conscious Choking Adult: Back Blows and Abdominal Thrusts',
          ar: 'رعاية البالغ الواعي المصاب بالاختناق: الضربات الظهرية وضغطات البطن',
        },
        year: '2025',
      },
    ],
    relatedArticleIds: ['recognizing-mild-vs-severe-obstruction', 'unresponsive-transition-and-cpr'],
    relatedScenarioAge: 'adult',
  },
  {
    id: 'child-choking-protocol',
    categoryId: 'child-education',
    ageRelevance: 'child',
    readingTimeMinutes: 5,
    featured: false,
    illustration: 'child-choking-care',
    title: {
      en: 'Child Choking First Aid (1 to 8 Years): Technique & Positioning',
      ar: 'إسعاف اختناق الأطفال (1 – 8 سنوات): التقنية وضبط وضعية الجسم',
    },
    summary: {
      en: 'Understand how to adapt airway obstruction response for children aged 1 year to puberty by kneeling to match their height and calibrating force safely.',
      ar: 'تعرّف على كيفية تكييف خطوات إسعاف الاختناق للأطفال من عمر سنة إلى 8 سنوات عبر النزول لمستوى طول الطفل وضبط مقدار القوة بأمان.',
    },
    keyTakeaways: [
      {
        en: 'Children aged 1 to 8 years receive the same core maneuvers as adults (back blows and abdominal thrusts), NOT the infant chest-thrust technique.',
        ar: 'يُطبّق للأطفال من عمر سنة إلى 8 سنوات نفس المبدأ الأساسي للبالغين (ضربات ظهرية وضغطات بطنية)، وليس تقنية الرضّع.',
      },
      {
        en: 'Kneel or crouch behind the child so your arms align properly with their waist and rib cage without lifting them dangerously off the floor.',
        ar: 'انحنِ أو ارتكز على ركبتيك خلف الطفل لتتناسب ذراعاك مع مستوى خصره دون رفعه عن الأرض بشكل عنيف.',
      },
      {
        en: 'Calibrate thrust force to the child’s body size—firm enough to expel the obstruction, but controlled to avoid rib or internal organ trauma.',
        ar: 'اضبط قوة الضغطات بما يتناسب مع حجم جسم الطفل—بحيث تكون حاسمة لطرد الجسم الغريب ومتوازنة لتجنب إصابة الأضلاع.',
      },
    ],
    sections: [
      {
        heading: {
          en: '1. Calm Assessment and Positioning at the Child’s Level',
          ar: '1. التقييم الهادئ والنزول إلى مستوى طول الطفل',
        },
        body: {
          en: 'A choking child is often terrified. Approach rapidly but calmly, kneel to eye level, and check if the child can cough loudly or speak. If the child is coughing effectively, keep them calm and encourage continued coughing. If the cough is silent or they cannot breathe, begin rescue maneuvers immediately.',
          ar: 'غالباً ما يشعر الطفل المختنق بذعر شديد. اقترب بسرعة وهدوء، وانزل لمستوى نظره للتحقق مما إذا كان قادراً على السعال بصوت مسموع أو الكلام. إذا كان السعال صامتاً وعجز عن التنفس، ابدأ خطوات الإنقاذ فوراً.',
        },
      },
      {
        heading: {
          en: '2. Back Blows and Abdominal Thrusts for a Child',
          ar: '2. الضربات الظهرية وضغطات البطن للطفل',
        },
        body: {
          en: 'Support the child’s upper chest with one hand while leaning them slightly forward so that when the object dislodges, gravity helps it exit the mouth rather than slipping back down the airway.',
          ar: 'ادعم أعلى صدر الطفل بيد واحدة مع إمالته قليلاً للأمام حتى يساعد اتجاه الجاذبية على خروج الجسم الغريب من الفم عند تحرره بدلاً من رجوعه للحنجرة.',
        },
        bulletPoints: [
          {
            en: 'Deliver up to 5 firm back blows between the shoulder blades using the heel of your hand (ARC / Resuscitation Council UK standard).',
            ar: 'وجّه حتى 5 ضربات حازمة بين لوحي الكتف باستخدام كعب اليد مع إمالة جذع الطفل للأمام.',
          },
          {
            en: 'If the obstruction persists, kneel behind the child, place your fist thumb-side in just above the navel, and give up to 5 quick inward-and-upward abdominal thrusts.',
            ar: 'إذا استمر الانسداد، ارتكز خلف الطفل وضع قبضتك فوق السرة مباشرة، ووجّه 5 ضغطات بطنية سريعة للداخل وللأعلى.',
          },
          {
            en: 'Continue alternating up to 5 back blows and up to 5 abdominal thrusts until the airway clears or the child becomes unresponsive. Never pick up a child and shake them upside down (Slide 20).',
            ar: 'استمر بالتناوب بين حتى ٥ ضربات ظهرية وحتى ٥ ضغطات بطنية حتى يفتح مجرى الهواء أو يفقد الطفل وعيه. ولا ترفع الطفل وتهزّه مقلوباً أبداً (شريحة ٢٠).',
          },
        ],
      },
    ],
    references: [
      {
        organization: {
          en: 'Resuscitation Council UK (2025)',
          ar: 'مجلس الإنعاش في المملكة المتحدة (2025)',
        },
        documentTitle: {
          en: 'Paediatric Basic Life Support — Paediatric Choking Algorithm',
          ar: 'دعم الحياة الأساسي للأطفال — خوارزمية اختناق الأطفال',
        },
        year: '2025',
      },
      {
        organization: {
          en: 'American Red Cross (ARC)',
          ar: 'الصليب الأحمر الأمريكي (ARC)',
        },
        documentTitle: {
          en: 'Child Choking First Aid Guidelines (Dr. Mai Mahran Lecture Slides 19–20)',
          ar: 'إرشادات إسعاف اختناق الأطفال (محاضرة د. مي مهران شرائح ١٩–٢٠)',
        },
        year: '2025',
      },
    ],
    relatedArticleIds: ['infant-choking-protocol', 'prevention-and-airway-safety'],
    relatedScenarioAge: 'child',
  },
  {
    id: 'infant-choking-protocol',
    categoryId: 'infant-education',
    ageRelevance: 'infant',
    readingTimeMinutes: 6,
    featured: true,
    illustration: 'infant-back-blows-chest-thrusts',
    title: {
      en: 'Infant Choking First Aid (Under 1 Year): 5 Back Blows & 5 Chest Thrusts',
      ar: 'إسعاف اختناق الرضّع (أقل من سنة): 5 ضربات ظهرية و5 ضغطات صدرية',
    },
    summary: {
      en: 'Critical protocol for infants under 12 months: why abdominal thrusts are strictly contraindicated and how to safely perform head-lowered back blows and two-finger chest thrusts.',
      ar: 'البروتوكول الحرج للرضّع دون عمر 12 شهراً: لماذا يُمنع تطبيق ضغطات البطن منعاً باتاً، وكيف تطبق 5 ضربات ظهرية و5 ضغطات صدرية بإصبعين بأمان.',
    },
    keyTakeaways: [
      {
        en: 'NEVER perform abdominal thrusts (Heimlich maneuver) on an infant under 1 year old due to extreme risk of rupturing the fragile liver and internal organs.',
        ar: 'يُمنع منعاً باتاً تطبيق ضغطات البطن (مناورة هيمليك) للرضيع دون عمر السنة بسبب الخطر الشديد لإصابة الكبد والأعضاء الداخلية.',
      },
      {
        en: 'Position the infant face-down along your forearm resting on your thigh, supporting the jaw and head lower than the chest, and deliver 5 firm back blows.',
        ar: 'ضع الرضيع على بطنه فوق ساعدك المستند على فخذك، مع تثبيت الفك وجعل الرأس أخفض من مستوى الصدر، ثم وجّه 5 ضربات ظهرية.',
      },
      {
        en: 'Turn the infant face-up as a supported unit, keeping the head lower than the chest, and deliver 5 two-finger chest thrusts on the lower half of the sternum.',
        ar: 'اقلب الرضيع على ظهره كوحدة واحدة مع إبقاء الرأس أخفض من الجذع، ووجّه 5 ضغطات صدرية بإصبعين على النصف السفلي لعظمة القص.',
      },
    ],
    sections: [
      {
        heading: {
          en: '1. Recognizing Severe Choking in an Infant',
          ar: '1. التعرف على الاختناق الشديد لدى الرضيع',
        },
        body: {
          en: 'An infant with severe airway obstruction cannot cry aloud, cough forcefully, or breathe effectively. You may observe sudden silence, wide eyes, weak gagging movements, or bluish tinting around the lips (cyanosis).',
          ar: 'الرضيع المصاب بانسداد شديد في مجرى الهواء لا يستطيع البكاء بصوت مسموع أو السعال بقوة أو التنفس. قد تلاحظ صمتاً مفاجئاً، ومحاولات تنفس ضعيفة، أو تغير لون الشفتين إلى الأزرق.',
        },
      },
      {
        heading: {
          en: '2. Step 1: 5 Supported Back Blows (Face-Down)',
          ar: '2. الخطوة الأولى: 5 ضربات ظهرية مع تثبيت الرأس (على البطن)',
        },
        body: {
          en: 'Sit or kneel for stability. Hold the infant face-down along your forearm, resting your forearm on your thigh. Support the infant’s head and jaw with your fingers—taking extreme care NOT to compress the soft tissues under the infant’s chin/throat. Keep the infant’s head lower than their chest and deliver 5 firm back blows between the shoulder blades with the heel of your free hand.',
          ar: 'اجلس أو ارتكز لتأمين ثباتك. احمل الرضيع على بطنه على طول ساعدك المسنود على فخذك. ثبّت رأس الرضيع وفكه بأصابعك—مع الحرص الشديد على عدم الضغط على الأنسجة الرخوة تحت الذقن والرقبة. اجعل رأس الرضيع أخفض من صدره ووجّه 5 ضربات حازمة بين لوحي الكتف بكعب يدك الأخرى.',
        },
      },
      {
        heading: {
          en: '3. Step 2: 5 Two-Finger Chest Thrusts (Face-Up)',
          ar: '3. الخطوة الثانية: 5 ضغطات صدرية بإصبعين (على الظهر)',
        },
        body: {
          en: 'If the object is not expelled after up to 5 back blows, place your free hand along the back of the infant’s head and spine, sandwiching the infant safely between your two forearms, and turn them face-up. Rest your arm on your thigh keeping the head lower than the torso. Place two fingers in the center of the chest just below the nipple line (lower half of the sternum) and deliver up to 5 quick two-finger chest thrusts.',
          ar: 'إذا لم يخرج الجسم الغريب بعد حتى ٥ ضربات ظهرية، ضع يدك الأخرى خلف رأس الرضيع وظهره لتثبيته بين ساعديك كوحدة واحدة واقلبه على ظهره. أبقِ الرأس أخفض من مستوى الصدر، وضع إصبعين في منتصف الصدر أسفل خط الحلمتين مباشرة، ووجّه حتى ٥ ضغطات صدرية بإصبعين.',
        },
        calloutTitle: {
          en: 'Strict Contraindication Warning',
          ar: 'تحذير طبي صارم',
        },
        calloutText: {
          en: 'Never perform abdominal thrusts on an infant under 1 year, and never shake an infant or hold them upside down by their feet.',
          ar: 'لا تطبّق ضغطات البطن أبداً على الرضيع دون عمر السنة، ولا تحاول هزّ الرضيع أو رفعه مقلوباً من قدميه.',
        },
        calloutVariant: 'danger',
      },
    ],
    references: [
      {
        organization: {
          en: 'Resuscitation Council UK (2025)',
          ar: 'مجلس الإنعاش في المملكة المتحدة (2025)',
        },
        documentTitle: {
          en: 'Paediatric Basic Life Support: Foreign-Body Airway Obstruction in Infants (<1 Year)',
          ar: 'دعم الحياة الأساسي للأطفال: انسداد مجرى الهواء لدى الرضّع (أقل من سنة)',
        },
        year: '2025',
      },
      {
        organization: {
          en: 'American Red Cross (ARC)',
          ar: 'الصليب الأحمر الأمريكي (ARC)',
        },
        documentTitle: {
          en: 'Conscious Choking Infant Care Protocol (Slide 21)',
          ar: 'بروتوكول رعاية الرضيع الواعي المصاب بالاختناق (شريحة ٢١)',
        },
        year: '2025',
      },
    ],
    relatedArticleIds: ['common-choking-first-aid-mistakes', 'unresponsive-transition-and-cpr'],
    relatedScenarioAge: 'infant',
  },
  {
    id: 'prevention-and-airway-safety',
    categoryId: 'prevention-safety',
    ageRelevance: 'all',
    readingTimeMinutes: 4,
    featured: false,
    illustration: 'prevention-safety-guide',
    title: {
      en: 'Choking Prevention & Airway Safety Across the Lifespan',
      ar: 'الوقاية من الاختناق وسلامة مجرى الهواء لجميع الأعمار',
    },
    summary: {
      en: 'Identify high-risk foods, household hazards for toddlers and infants, and simple behavioral practices that prevent most choking emergencies before they happen.',
      ar: 'تعرّف على الأطعمة عالية الخطورة، ومصادر الخطر المنزلية للرضّع والأطفال، والممارسات اليومية البسيطة التي تمنع معظم حالات الاختناق قبل وقوعها.',
    },
    keyTakeaways: [
      {
        en: 'Round, firm, or slippery foods (whole grapes, cherry tomatoes, hot dogs, nuts, hard candies) pose the highest choking risk for children under 4 years.',
        ar: 'الأطعمة الكروية أو الصلبة أو الزلقة (العنب الكامل، الطماطم الكرزية، النقانق، المكسرات، الحلوى الصلبة) تمثل الخطر الأكبر للأطفال دون 4 سنوات.',
      },
      {
        en: 'Always cut cylindrical or round foods lengthwise into quarters, and ensure children sit upright without running or playing while eating.',
        ar: 'قطّع دائماً الأطعمة الكروية أو الأسطوانية طولياً إلى أرباع صغيرة، وتأكد من جلوس الأطفال في وضعية مستقيمة وعدم الجري أثناء الأكل.',
      },
      {
        en: 'Keep coins, button batteries, latex balloons, and small toy parts out of reach of infants and toddlers.',
        ar: 'أبعد العملات المعدنية، وبطاريات الأزرار الصغيرة، والبالونات المطاطية، وقطع الألعاب الصغيرة عن متناول الرضّع.',
      },
    ],
    sections: [
      {
        heading: {
          en: '1. Food Preparation Safety for Young Children',
          ar: '1. قواعد تحضير الطعام الآمن للأطفال الصغار',
        },
        body: {
          en: 'Because young children do not develop mature molar grinding teeth and coordinated swallowing until around age 4, smooth round foods can easily plug the Pediatric larynx.',
          ar: 'نظراً لأن الأطفال الصغار لا تكتمل لديهم الأضراس الطاحنة وتناسق البلع الكامل قبل سن الرابعة، فإن الأطعمة الكروية الملساء قد تسد مدخل الحنجرة بسهولة.',
        },
        bulletPoints: [
          {
            en: 'Slice whole grapes, cherry tomatoes, and berries lengthwise into quarters before serving.',
            ar: 'قطّع حبات العنب والطماطم الكرزية طولياً إلى أربعة أجزاء قبل تقديمها للطفل.',
          },
          {
            en: 'Avoid giving whole nuts, popcorn, hard raw carrots, or sticky spoonfuls of peanut butter to children under 4 years.',
            ar: 'تجنب تقديم المكسرات الكاملة أو الفشار أو الجزر النيء الصلب للأطفال دون سن الرابعة.',
          },
        ],
      },
      {
        heading: {
          en: '2. Non-Food Household Hazards & Adult Prevention',
          ar: '2. المخاطر المنزلية غير الغذائية والوقاية لدى البالغين',
        },
        body: {
          en: 'Latex balloons are a leading cause of fatal non-food choking in children because they conform tightly to the airway contour. For adults and seniors, taking smaller bites, chewing thoroughly, and ensuring dentures fit properly substantially reduces choking incidence.',
          ar: 'تُعد البالونات المطاطية من أخطر مسببات الاختناق غير الغذائي لدى الأطفال لأنها تلتصق بجدار مجرى الهواء. أما لدى البالغين وكبار السن، فإن تقطيع الطعام لقيمات صغيرة والمضغ الجيد وعدم التحدث أثناء البلع يقلل خطر الاختناق بشكل كبير.',
        },
      },
    ],
    references: [
      {
        organization: {
          en: 'American Academy of Pediatrics & American Red Cross',
          ar: 'الأكاديمية الأمريكية لطب الأطفال والصليب الأحمر الأمريكي',
        },
        documentTitle: {
          en: 'Prevention of Choking Among Children and Household Safety Standards',
          ar: 'الوقاية من الاختناق لدى الأطفال ومعايير السلامة المنزلية',
        },
        year: '2021',
      },
    ],
    relatedArticleIds: ['child-choking-protocol', 'infant-choking-protocol'],
    relatedScenarioAge: 'child',
  },
  {
    id: 'common-choking-first-aid-mistakes',
    categoryId: 'common-mistakes',
    ageRelevance: 'all',
    readingTimeMinutes: 5,
    featured: true,
    illustration: 'common-mistakes-avoid',
    title: {
      en: 'Common Choking First-Aid Mistakes That Can Worsen Airway Obstruction',
      ar: 'الأخطاء الشائعة في إسعاف الاختناق التي قد تضاعف خطورة الانسداد',
    },
    summary: {
      en: 'Avoid critical bystander errors including blind finger sweeps, giving water to a choking victim, slapping a person who is coughing effectively, and applying abdominal thrusts to infants.',
      ar: 'تجنّب الأخطاء الحرجة الشائعة مثل المسح العشوائي بالإصبع داخل الفم، أو إعطاء الماء للمصاب، أو ضرب ظهر شخص يسعل بفعالية، أو تطبيق ضغطات البطن للرضّع.',
    },
    keyTakeaways: [
      {
        en: 'NEVER perform a blind finger sweep: reaching into the mouth without clearly seeing a loose object frequently wedges the object deeper into the vocal cords.',
        ar: 'لا تقم أبداً بالمسح العشوائي بالإصبع داخل الفم: إدخال الإصبع دون رؤية الجسم الغريب بوضوح يدفع الجسم أعمق داخل الأحبال الصوتية.',
      },
      {
        en: 'NEVER give water, bread, or liquids to a choking person: liquids cannot wash down a tracheal blockage and will worsen airway obstruction.',
        ar: 'لا تعطِ الماء أو الخبز أو السوائل للمصاب بالاختناق أبداً: السوائل لا تفتح القصبة الهوائية بل تزيد الانسداد سوءاً.',
      },
      {
        en: 'Do not intervene with thrusts while a person has a strong, effective cough—let their natural cough work while monitoring closely.',
        ar: 'لا تتدخل بضغطات البطن طالما أن المصاب يسعل بقوة وفعالية—دع سعاله الطبيعي يعمل مع البقاء بجانبه لمراقبته.',
      },
    ],
    sections: [
      {
        heading: {
          en: '1. The Danger of Blind Finger Sweeps',
          ar: '1. خطورة المسح العشوائي بالإصبع داخل الفم (Blind Finger Sweep)',
        },
        body: {
          en: 'Many well-meaning bystanders instinctively reach their fingers into a choking victim’s throat to fish out food. Medical guidelines strictly prohibit blind finger sweeps across all age groups. A finger sweep acts like a ramrod, pushing a supraglottic object tightly into the narrow glottic opening and causing tissue trauma or laryngospasm. Only remove an object if it is clearly visible in the mouth and easily grasped.',
          ar: 'يلجأ بعض المتواجدين بدافع الخوف إلى إدخال أصابعهم في حلق المصاب لمحاولة إخراج الطعام. تحظر الإرشادات الطبية العالمية المسح العشوائي بالإصبع في جميع الفئات العمرية؛ لأن الإصبع يدفع الجسم الغريب كالمكبس نحو الفتحة الضيقة للحنجرة، مما يحوّل الانسداد الجزئي إلى كامل. لا تُخرج الجسم إلا إذا رأيته بوضوح داخل الفم وكان يسهل التقاطه.',
        },
        calloutTitle: {
          en: 'Guideline Consensus (RCUK 2025 / ARC)',
          ar: 'إجماع الإرشادات الطبية المعتمدة (RCUK 2025 / ARC)',
        },
        calloutText: {
          en: 'Inspect the mouth during CPR airway opening, and remove a foreign object ONLY if you can directly see it.',
          ar: 'افحص الفم عند فتح مجرى الهواء في حالة فقدان الوعي، ولا تلتقط الجسم الغريب إلا إذا كان مرئياً بوضوح أمام عينيك.',
        },
        calloutVariant: 'danger',
      },
      {
        heading: {
          en: '2. Why Giving Water or Raising Arms Does Not Help',
          ar: '2. لماذا لا يفيد إعطاء الماء أو رفع الذراعين للأعلى؟',
        },
        body: {
          en: 'Offering water confuses esophageal food swallowing with tracheal airway obstruction. When an object is in the airway, water poured into the pharynx can aspirate into the lungs. Similarly, telling a choking victim to raise their arms over their head provides zero physiological benefit and wastes precious seconds.',
          ar: 'ينبع إعطاء الماء من الخلط بين صعوبة بلع الطعام في المريء وبين انسداد القصبة الهوائية. عند انسداد مجرى التنفس، قد يتسرب الماء نحو الرئتين ويزيد الاختناق. وكذلك فإن رفع ذراعي المصاب للأعلى لا يقدم أي فائدة فسيولوجية ويهدر ثواني ثمينة.',
        },
      },
    ],
    references: [
      {
        organization: {
          en: 'Resuscitation Council UK (2025)',
          ar: 'مجلس الإنعاش في المملكة المتحدة (2025)',
        },
        documentTitle: {
          en: 'First Aid Guidance on Airway Obstruction Removal',
          ar: 'إرشادات الإسعافات الأولية لإزالة انسداد مجرى الهواء',
        },
        year: '2025',
      },
      {
        organization: {
          en: 'American Red Cross (ARC)',
          ar: 'الصليب الأحمر الأمريكي (ARC)',
        },
        documentTitle: {
          en: 'Harm Prevention Against Blind Finger Sweeps in Choking',
          ar: 'منع المسح العشوائي بالإصبع في حالات انسداد مجرى الهواء',
        },
        year: '2025',
      },
    ],
    relatedArticleIds: ['recognizing-mild-vs-severe-obstruction', 'infant-choking-protocol'],
    relatedScenarioAge: 'infant',
  },
  {
    id: 'unresponsive-transition-and-cpr',
    categoryId: 'emergency-awareness',
    ageRelevance: 'all',
    readingTimeMinutes: 5,
    featured: false,
    illustration: 'unresponsive-cpr-transition',
    title: {
      en: 'Emergency Escalation: What to Do When a Choking Victim Becomes Unresponsive',
      ar: 'التصعيد الطارئ: ماذا تفعل عندما يفقد المصاب بالاختناق وعيه؟',
    },
    summary: {
      en: 'Learn the critical transition from conscious choking maneuvers to basic life support / CPR according to your training and visual mouth checks when a victim loses consciousness.',
      ar: 'تعلّم الانتقال الحاسم من مناورات الاختناق للمصاب الواعي إلى الإنعاش الأساسي حسب التدريب وفحص الفم البصري عند فقدان المصاب للوعي.',
    },
    keyTakeaways: [
      {
        en: 'If a choking adult, child, or infant becomes limp and unresponsive, carefully lower them to a firm, flat surface and ensure emergency services are called.',
        ar: 'إذا ارتخى جسم المصاب (بالغ أو طفل أو رضيع) وفقد وعيه، أنزله بحذر على سطح صلب ومستوٍ وتأكد من الاتصال بالإسعاف.',
      },
      {
        en: 'Immediately start CPR / basic life support according to your training—chest compressions generate intrathoracic pressure while circulating blood.',
        ar: 'ابدأ الإنعاش الأساسي فوراً حسب التدريب—حيث تولّد ضغطات الصدر ضغطاً قوياً لطرد الجسم الغريب مع الحفاظ على تدفق الدم.',
      },
      {
        en: 'Open the airway and look inside the mouth: remove the object ONLY if clearly visible. Never perform a blind finger sweep.',
        ar: 'افتح مجرى الهواء وانظر داخل الفم: أزل الجسم فقط إذا كان مرئياً بوضوح، ولا تقم أبداً بالمسح العشوائي بالأصابع.',
      },
    ],
    sections: [
      {
        heading: {
          en: '1. Safe Lowering and Emergency Activation (Slide 17)',
          ar: '1. إنزال المصاب بأمان والاتصال الفوري بالطوارئ (شريحة ١٧)',
        },
        body: {
          en: 'When oxygen levels drop, a choking victim will lose muscle tone and become unresponsive. Support their torso and guide them gently onto a firm flat surface while protecting their head from impact. Stop standing abdominal thrusts immediately once the person is on the ground.',
          ar: 'مع انخفاض مستوى الأكسجين، يفقد المصاب قوة عضلاته ويدخل في فقدان الوعي. اسند جذعه وأنزله برفق على سطح صلب ومستوٍ مع حماية رأسه، وتوقف فوراً عن ضغطات البطن القائمة بمجرد استلقائه.',
        },
      },
      {
        heading: {
          en: '2. Starting CPR With Visual Airway Inspection',
          ar: '2. بدء الإنعاش حسب التدريب مع الفحص البصري للفم',
        },
        body: {
          en: 'For an unresponsive choking victim, start CPR according to your training and look inside the mouth when opening the airway. As muscles relax during unconsciousness and chest compressions pressurize the airway, the foreign object is often pushed into the mouth where it can be clearly seen and removed.',
          ar: 'عند فقدان الوعي نتيجة الاختناق، ابدأ الإنعاش حسب التدريب مع فحص الفم بصرياً عند فتح مجرى التنفس؛ إذ يساعد ارتخاء العضلات مع ضغطات الصدر على دفع الجسم الغريب نحو الفم حيث يمكن رؤيته بوضوح وإزالته بأمان.',
        },
        calloutTitle: {
          en: 'Post-Incident Medical Evaluation (Slide 18)',
          ar: 'الفحص الطبي الإلزامي بعد الحادثة (شريحة ١٨)',
        },
        calloutText: {
          en: 'Anyone who receives abdominal thrusts, chest thrusts, or back blows—or experiences persistent coughing after choking—must be evaluated by a doctor to rule out internal injury or residual airway fragments.',
          ar: 'يجب عرض أي مصاب تلقى ضغطات بطنية أو صدرية أو ضربات ظهرية أو يعاني سعالاً مستمراً على الطبيب للتأكد من عدم وجود إصابات داخلية أو بقايا في مجرى التنفس.',
        },
        calloutVariant: 'info',
      },
    ],
    references: [
      {
        organization: {
          en: 'Resuscitation Council UK (2025) & American Red Cross',
          ar: 'مجلس الإنعاش البريطاني (2025) والصليب الأحمر الأمريكي',
        },
        documentTitle: {
          en: 'Unresponsive Choking Victim Management & CPR Integration (Dr. Mai Mahran Lecture Slide 17)',
          ar: 'التعامل مع المصاب بالاختناق فاقد الوعي وبدء الإنعاش (محاضرة د. مي مهران شريحة ١٧)',
        },
        year: '2025',
      },
    ],
    relatedArticleIds: ['adult-choking-protocol', 'infant-choking-protocol'],
    relatedScenarioAge: 'adult',
  },
];
