import { LearningCategoryId } from '../types/nafas';

export const LEARNING_CATEGORIES: {
  id: LearningCategoryId | 'all';
  label: { en: string; ar: string };
}[] = [
  { id: 'all', label: { en: 'All Topics', ar: 'جميع المواضيع' } },
  {
    id: 'understanding-choking',
    label: { en: 'Understanding Choking', ar: 'فهم الاختناق' },
  },
  {
    id: 'recognizing-obstruction',
    label: { en: 'Recognizing Airway Obstruction', ar: 'التعرف على انسداد مجرى الهواء' },
  },
  {
    id: 'adult-education',
    label: { en: 'Adult Choking Education', ar: 'إسعاف اختناق البالغين' },
  },
  {
    id: 'child-education',
    label: { en: 'Child Choking Education', ar: 'إسعاف اختناق الأطفال' },
  },
  {
    id: 'infant-education',
    label: { en: 'Infant Choking Education', ar: 'إسعاف اختناق الرضع' },
  },
  {
    id: 'prevention-safety',
    label: { en: 'Prevention and Safety', ar: 'الوقاية والسلامة' },
  },
  {
    id: 'common-mistakes',
    label: { en: 'Common Mistakes', ar: 'الأخطاء الشائعة' },
  },
  {
    id: 'emergency-awareness',
    label: { en: 'Emergency Awareness', ar: 'الوعي بالطوارئ' },
  },
];

export const UI_TRANSLATIONS = {
  en: {
    brandName: 'NAFAS',
    brandArabic: 'نَفَس',
    tagline: 'Learn. Act. Save a Life.',
    heroTagline: 'Breathe. Learn. Respond.',
    nav: {
      home: 'Home',
      about: 'About NAFAS',
      learning: 'Learning Hub',
      simulation: 'Simulation Center',
      aiAssistant: 'AI Assistant',
      startLearning: 'Start Learning',
      languageToggle: 'العربية',
    },
    disclaimer: {
      badge: 'Medical Education Disclaimer',
      shortText:
        'NAFAS is an educational and simulation platform. It does not replace emergency medical services or certified hands-on first-aid training.',
      emergencyAction:
        'In a real emergency in Egypt, call Egyptian Ambulance (123) or Emergency Services immediately:',
      reviewNotice:
        'All medical educational content and scenario logic are aligned with Resuscitation Council UK (2025) and American Red Cross first-aid guidelines and Dr. Mai Mahran’s choking lecture.',
    },
    home: {
      kicker: 'Interactive First Aid Learning & Simulation Platform',
      headlinePart1: 'Breathe. Learn.',
      headlineAccent: 'Respond.',
      subheadline:
        'Learn how to recognize and respond to choking emergencies across adults, children, and infants through structured medical guidance and interactive decision-based scenarios.',
      primaryCta: 'Start Learning',
      secondaryCta: 'Explore Simulations',
      trustStrip: {
        item1Title: 'Recognized Medical Guidelines',
        item1Desc: 'Aligned with Resuscitation Council UK (2025) & American Red Cross principles',
        item2Title: 'Age-Specific Protocols',
        item2Desc: 'Distinct procedures for Adults (18+), Children (1–8), and Infants (<1 yr)',
        item3Title: 'Decision-Based Feedback',
        item3Desc: 'Real-time feedback on assessment and clinical intervention choices',
      },
      ageSectionTitle: 'Choose Your Learning Path',
      ageSectionSubtitle:
        'Anatomical differences require distinct rescue procedures for each age group. Select a category to explore dedicated guidance or launch a simulation.',
      ageCards: {
        adult: {
          title: 'Adult',
          ageRange: '18+ years',
          summary:
            'Recognize the universal choking sign, differentiate effective coughing from severe obstruction, and perform abdominal thrusts safely.',
          learnBtn: 'Adult Guide',
          simBtn: 'Adult Simulation',
        },
        child: {
          title: 'Child',
          ageRange: '1 – 8 years',
          summary:
            'Adjust posture and force appropriately for a child’s anatomy, combine back blows and abdominal thrusts, and transition to CPR if unresponsive.',
          learnBtn: 'Child Guide',
          simBtn: 'Child Simulation',
        },
        infant: {
          title: 'Infant',
          ageRange: 'Under 1 year',
          summary:
            'Never apply abdominal thrusts to an infant. Learn the head-supported 5 back blows and 5 two-finger chest thrusts technique.',
          learnBtn: 'Infant Guide',
          simBtn: 'Infant Simulation',
        },
      },
      howItWorksTitle: 'How NAFAS Works',
      howItWorksSubtitle: 'A structured journey from clinical awareness to confident emergency response.',
      steps: [
        {
          number: '01',
          title: 'Learn',
          desc: 'Study concise, medically referenced guides on airway obstruction signs and age-specific response steps.',
        },
        {
          number: '02',
          title: 'Practice',
          desc: 'Enter realistic branching scenarios where every assessment and action choice leads to clinical consequences.',
        },
        {
          number: '03',
          title: 'Get Evaluated',
          desc: 'Receive immediate educational feedback explaining why an action is indicated, suboptimal, or dangerous.',
        },
        {
          number: '04',
          title: 'Be Ready',
          desc: 'Review targeted areas for improvement and reinforce critical distinctions before an emergency happens.',
        },
      ],
      benefitsTitle: 'Why Structured Choking Education Matters',
      benefitsSubtitle:
        'During severe airway obstruction, cerebral hypoxia begins within minutes. Knowing what to do—and what mistakes to avoid—protects lives.',
      benefits: [
        {
          title: 'Mild vs. Severe Differentiation',
          desc: 'Understand why effective coughing should be encouraged while silent, severe obstruction requires immediate physical intervention.',
        },
        {
          title: 'Protecting Infant Anatomy',
          desc: 'Master why abdominal thrusts are strictly contraindicated in infants under 1 year old due to the risk of liver and organ injury.',
        },
        {
          title: 'Eliminating Dangerous Myths',
          desc: 'Learn why blind finger sweeps can push foreign objects deeper into the larynx and convert a partial obstruction into a complete one.',
        },
      ],
      featuredContentTitle: 'Featured Learning Content',
      featuredContentSubtitle: 'Essential medical modules from the NAFAS Learning Hub.',
      viewAllArticles: 'Explore Full Learning Hub',
    },
    about: {
      kicker: 'About the Platform',
      title: 'NAFAS – نَفَس: Bridging the Gap in Choking First-Aid Awareness',
      subtitle:
        'A university digital health education initiative combining structured first-aid curriculum with interactive clinical decision simulations.',
      whatIsTitle: 'What is NAFAS?',
      whatIsBody:
        'NAFAS (meaning "Breath" in Arabic) is a bilingual educational web platform built to equip students, parents, caregivers, and community members with accurate, actionable knowledge for recognizing and responding to foreign-body airway obstruction (choking).',
      problemTitle: 'The Problem We Address',
      problemBody:
        'Choking is a time-critical emergency where bystanders are almost always the first on the scene before ambulance services arrive. Yet many bystanders confuse mild coughing with complete obstruction, apply adult techniques to fragile infants, or perform harmful actions such as blind finger sweeps or offering water to a choking victim.',
      missionTitle: 'Our Educational Mission',
      missionBody:
        'To transform passive reading into active recall through accessible bilingual content and decision-driven simulations that reinforce internationally recognized resuscitation protocols.',
      objectivesTitle: 'Platform Objectives',
      objectives: [
        'Provide clear, medically referenced first-aid articles across 8 essential airway safety categories.',
        'Teach critical anatomical and procedural differences between Adult (18+), Child (1–8 years), and Infant (<1 year) choking care.',
        'Allow learners to practice high-stakes assessment and intervention decisions in a safe, feedback-rich simulation sandbox.',
        'Deliver a cohesive, accessible Arabic (RTL) and English (LTR) experience tailored for broad community reach.',
      ],
      ageSpecificTitle: 'Why Age-Specific Choking Education Matters',
      ageSpecificBody:
        'An infant’s airway is narrow, funnel-shaped, and easily compressed, and their abdominal organs—particularly the liver—extend beyond the protective rib cage. Applying adult abdominal thrusts to an infant can cause severe internal hemorrhage. Conversely, older children and adults require different body positioning and thrust mechanics to generate sufficient intrathoracic pressure to expel an airway blockage.',
      interactiveRoleTitle: 'The Role of Interactive Simulation Learning',
      interactiveRoleBody:
        'Static posters and videos rarely test whether a learner can assess a situation under pressure. By presenting branching clinical scenarios—where users must first assess cough effectiveness, call for emergency help at the right time, and transition to CPR if a patient becomes unresponsive—NAFAS builds structured decision habits.',
      guidelinesSectionTitle: 'Guideline Foundation & Academic Review',
      guidelinesSectionBody:
        'NAFAS educational modules and scenario trees are structured around Dr. Mai Mahran’s Choking Lecture and published guidance from the Resuscitation Council UK (2025) and the American Red Cross (ARC). All simulation pathways are strictly educational and clearly demarcated for medical research team verification.',
    },
    learning: {
      kicker: 'Structured Educational Content Center',
      title: 'NAFAS Learning Hub',
      subtitle:
        'Explore medically referenced modules covering airway anatomy, recognition of mild vs. severe choking, age-specific rescue protocols, and prevention.',
      searchPlaceholder: 'Search articles by topic, symptom, or procedure...',
      ageFilterAll: 'All Ages',
      ageFilterAdult: 'Adult (18+)',
      ageFilterChild: 'Child (1–8 yrs)',
      ageFilterInfant: 'Infant (<1 yr)',
      minRead: 'min read',
      readArticle: 'Read Guide',
      backToHub: 'Back to Learning Hub',
      keyTakeaways: 'Key Clinical Takeaways',
      medicalReferences: 'Medical Guidelines & References',
      relatedArticles: 'Related Learning Modules',
      practiceSimulationPrompt: 'Ready to test this knowledge in an interactive scenario?',
      launchRelatedSim: 'Practice Simulation Now',
      emptySearchTitle: 'No matching educational articles found',
      emptySearchDesc: 'Try adjusting your search keywords or selecting a different category filter.',
      resetFilters: 'Reset All Filters',
    },
    simulation: {
      kicker: 'Interactive Decision-Based Scenarios',
      title: 'NAFAS Simulation Center',
      subtitle:
        'Select an age category to enter a branching clinical scenario. Assess the victim, choose your action, and receive immediate guideline-based feedback.',
      selectScenarioTitle: 'Select a Clinical Simulation Track',
      startScenarioBtn: 'Start Simulation',
      restartScenarioBtn: 'Restart Scenario',
      exitToLobbyBtn: 'All Simulations',
      stepIndicator: 'Step',
      of: 'of',
      patientProfile: 'Patient Profile',
      clinicalStatus: 'Clinical Status',
      observedSigns: 'Observed Clinical Signs',
      situationAssessment: 'Situation Assessment',
      decisionPanelTitle: 'Decision Panel — Choose Your Next Action',
      feedbackHeaderCorrect: 'Optimal Clinical Decision',
      feedbackHeaderSuboptimal: 'Suboptimal / Delayed Action',
      feedbackHeaderCritical: 'Critical Safety Error',
      guidelineReferenceLabel: 'Guideline Rationale',
      continueNextStep: 'Continue Scenario',
      objectivesLabel: 'Scenario Objectives',
      estTimeLabel: 'min interactive scenario',
    },
    aiAssistant: {
      badge: 'Research Phase — Experimental Feature',
      title: 'NAFAS Guided Learning Assistant (Proposed)',
      subtitle:
        'Explore verified answers to common questions about choking recognition, age-specific mechanics, and simulation feedback using strictly reviewed NAFAS educational sources.',
      researchNoticeTitle: 'Important Notice on AI Integration Status',
      researchNoticeBody:
        'In accordance with NAFAS medical safety governance, unverified generative AI chatbots are not permitted to generate live emergency treatment instructions. This experimental module demonstrates how a structured assistant retrieves verified answers strictly from approved NAFAS learning modules and Resuscitation Council UK (2025) / American Red Cross guidelines.',
      searchPrompt: 'Filter verified questions by keyword (e.g., infant, finger sweep, unresponsive, cough)...',
      filterAll: 'All Topics',
      filterAdult: 'Adult Care',
      filterChild: 'Child Care',
      filterInfant: 'Infant Care',
      filterGeneral: 'Core Principles',
      selectQuestionPrompt: 'Select a Clinical Question to Inspect Verified Guidance',
      shortAnswerLabel: 'Direct Guideline Summary',
      detailedExplanationLabel: 'Detailed Clinical Explanation',
      criticalRuleLabel: 'Critical Safety Rule',
      verifiedSourceLabel: 'Verified Source & Guideline Reference',
      openSourceArticleBtn: 'Read Full Learning Hub Article',
    },
    footer: {
      description:
        'NAFAS (نَفَس) is a bilingual university educational platform dedicated to choking emergency awareness, age-specific first-aid learning, and interactive decision-based simulations.',
      quickLinks: 'Platform Navigation',
      ageTracks: 'Simulation Tracks',
      projectInfoTitle: 'Academic & Medical Governance',
      projectInfoText:
        'Developed as an academic digital health education platform. Content is structured around Resuscitation Council UK (2025) and American Red Cross guidelines for educational simulation purposes.',
      copyright: '© 2026 NAFAS – نَفَس Educational Platform. Built for Choking Awareness & First-Aid Education.',
      everySecondCounts: 'Because every second counts...',
    },
  },
  ar: {
    brandName: 'NAFAS',
    brandArabic: 'نَفَس',
    tagline: 'تعلّم. بادر. أنقذ حياة.',
    heroTagline: 'تنفّس. تعلّم. استجب.',
    nav: {
      home: 'الرئيسية',
      about: 'عن نَفَس',
      learning: 'مركز التعلّم',
      simulation: 'مركز المحاكاة',
      aiAssistant: 'المساعد الذكي',
      startLearning: 'ابدأ التعلّم',
      languageToggle: 'English',
    },
    disclaimer: {
      badge: 'تنبيه تعليمي وطبي هام',
      shortText:
        'منصة «نَفَس» هي منصة تعليمية وتدريبية قائمة على المحاكاة، ولا تُعد بديلاً عن خدمات الطوارئ الطبية أو دورات الإسعافات الأولية المعتمدة.',
      emergencyAction:
        'في حالات الطوارئ الحقيقية داخل مصر، اتصل فوراً بهيئة الإسعاف المصرية (123) أو الطوارئ:',
      reviewNotice:
        'جميع المحتويات التعليمية ومسارات المحاكاة مبنية على محاضرة د. مي مهران وإرشادات مجلس الإنعاش البريطاني (2025) والصليب الأحمر الأمريكي، وتخضع للمراجعة الأكاديمية والطبية.',
    },
    home: {
      kicker: 'منصة تفاعلية لتعلّم ومحاكاة الإسعافات الأولية للاختناق',
      headlinePart1: 'تنفّس. تعلّم.',
      headlineAccent: 'استجب.',
      subheadline:
        'تعلّم كيفية التعرّف على حالات الاختناق الطارئة والتعامل معها لدى البالغين والأطفال والرضّع من خلال محتوى طبي منظّم وسيناريوهات محاكاة تفاعلية قائمة على اتخاذ القرار.',
      primaryCta: 'ابدأ التعلّم',
      secondaryCta: 'استكشف المحاكاة',
      trustStrip: {
        item1Title: 'إرشادات طبية معتمدة',
        item1Desc: 'مبنية على معايير مجلس الإنعاش البريطاني (2025) والصليب الأحمر الأمريكي',
        item2Title: 'بروتوكولات حسب الفئة العمرية',
        item2Desc: 'إجراءات مخصصة للبالغين (+18)، والأطفال (1–8 سنوات)، والرضّع (أقل من سنة)',
        item3Title: 'تقييم وتغذية راجعة فورية',
        item3Desc: 'تحليل فوري لقرارات التقييم والتدخل الإسعافي في كل خطوة',
      },
      ageSectionTitle: 'اختر مسار التعلّم حسب الفئة العمرية',
      ageSectionSubtitle:
        'تفرض الفروقات التشريحية إجراءات إسعافية مختلفة لكل فئة عمرية. اختر الفئة لاستعراض الدليل الطبي أو بدء محاكاة تفاعلية.',
      ageCards: {
        adult: {
          title: 'البالغون',
          ageRange: '18 سنة فأكثر',
          summary:
            'تعرّف على علامة الاختناق العالمية، وفرّق بين السعال الفعّال والانسداد الشديد، وطبّق ضغطات البطن (مناورة هيمليك) بأمان.',
          learnBtn: 'دليل البالغين',
          simBtn: 'محاكاة البالغين',
        },
        child: {
          title: 'الأطفال',
          ageRange: '1 – 8 سنوات',
          summary:
            'اضبط وضعية الجسم ومقدار القوة بما يناسب بنية الطفل، واجمع بين الضربات الظهرية وضغطات البطن، وانتقل للإنعاش القلبي الرئوي عند فقدان الوعي.',
          learnBtn: 'دليل الأطفال',
          simBtn: 'محاكاة الأطفال',
        },
        infant: {
          title: 'الرضّع',
          ageRange: 'أقل من سنة واحدة',
          summary:
            'يُمنع منعاً باتاً تطبيق ضغطات البطن للرضيع. تعلّم تقنية 5 ضربات بين لوحي الكتف و5 ضغطات صدرية بإصبعين مع تثبيت الرأس.',
          learnBtn: 'دليل الرضّع',
          simBtn: 'محاكاة الرضّع',
        },
      },
      howItWorksTitle: 'كيف تعمل منصة نَفَس؟',
      howItWorksSubtitle: 'رحلة تعليمية منظمة من المعرفة الطبية إلى الجاهزية لاتخاذ القرار الصحيح.',
      steps: [
        {
          number: '01',
          title: 'تعلّم',
          desc: 'ادرس أدلة طبية واضحة وموثقة حول علامات انسداد مجرى الهواء وخطوات الإسعاف لكل فئة عمرية.',
        },
        {
          number: '02',
          title: 'تدرّب',
          desc: 'خُض سيناريوهات تفاعلية متفرعة حيث يؤدي كل قرار تتخذه إلى مسار ونتيجة سريرية محددة.',
        },
        {
          number: '03',
          title: 'تقييم فوري',
          desc: 'احصل على تغذية راجعة تعليمية تشرح الأساس الطبي وراء صحة الإجراء أو خطورته.',
        },
        {
          number: '04',
          title: 'كن مستعداً',
          desc: 'راجع نقاط التحسين ورسّخ الفروقات الجوهرية بين الفئات العمرية للتصرف بثقة عند الطوارئ.',
        },
      ],
      benefitsTitle: 'لماذا يُعد التعليم المنظّم لإسعاف الاختناق ضرورياً؟',
      benefitsSubtitle:
        'في حالات الانسداد الشديد لمجرى الهواء، يبدأ نقص الأكسجين الدماغي خلال دقائق معدودة. معرفة الإجراء الصحيح وتجنب الأخطاء الشائعة ينقذ الأرواح.',
      benefits: [
        {
          title: 'التفريق بين الانسداد الجزئي والكلي',
          desc: 'افهم لماذا يجب تشجيع المصاب على السعال إذا كان سعاله فعّالاً، بينما يتطلب الانسداد الصامت الشديد تدخلاً بدنياً فورياً.',
        },
        {
          title: 'حماية البنية التشريحية للرضّع',
          desc: 'تعرّف على سبب منع ضغطات البطن لدى الرضّع دون عمر السنة لحماية الكبد والأعضاء الداخلية من الإصابات البالغة.',
        },
        {
          title: 'تجنب الممارسات الخاطئة والخطيرة',
          desc: 'تعلّم لماذا يؤدي المسح العشوائي بالإصبع داخل الفم إلى دفع الجسم الغريب أعمق داخل الحنجرة وتحويل الانسداد الجزئي إلى كامل.',
        },
      ],
      featuredContentTitle: 'محتوى تعليمي مختار',
      featuredContentSubtitle: 'وحدات معرفية أساسية من مركز التعلّم في منصة نَفَس.',
      viewAllArticles: 'استكشف مركز التعلّم بالكامل',
    },
    about: {
      kicker: 'عن المنصة والمشروع',
      title: 'نَفَس – NAFAS: سد الفجوة المعرفية في إسعاف حالات الاختناق',
      subtitle:
        'مبادرة جامعية للتثقيف الصحي الرقمي تجمع بين المحتوى الطبي الموثق ومحاكاة اتخاذ القرار السريري.',
      whatIsTitle: 'ما هي منصة نَفَس؟',
      whatIsBody:
        '«نَفَس» هي منصة ويب تعليمية ثنائية اللغة صُممت لتزويد الطلاب وأولياء الأمور ومقدمي الرعاية وأفراد المجتمع بالمعرفة الدقيقة والعملية للتعرف على حالات انسداد مجرى الهواء بجسم غريب (الاختناق) والاستجابة لها بشكل صحيح.',
      problemTitle: 'المشكلة التي تعالجها المنصة',
      problemBody:
        'الاختناق حالة طارئة حرجة يكون فيها المتواجدون في المكان هم خط الاستجابة الأول قبل وصول فرق الإسعاف. ومع ذلك، يخلط الكثيرون بين السعال البسيط والانسداد الشديد، أو يطبقون مناورات البالغين على الرضّع، أو يلجؤون لممارسات خطيرة مثل إدخال الأصابع بشكل عشوائي في الفم أو إعطاء الماء للمصاب.',
      missionTitle: 'رسالتنا التعليمية',
      missionBody:
        'تحويل القراءة النظرية إلى مهارة استحضار وتقييم عملي من خلال محتوى ثنائي اللغة وسيناريوهات محاكاة تفاعلية ترسّخ بروتوكولات الإنعاش العالمية.',
      objectivesTitle: 'أهداف المنصة',
      objectives: [
        'تقديم مقالات تعليمية موثقة طبياً موزعة على 8 تصنيفات رئيسية لسلامة مجرى الهواء.',
        'توضيح الفروقات التشريحية والإسعافية الجوهرية بين البالغين (+18)، والأطفال (1–8 سنوات)، والرضّع (أقل من سنة).',
        'تمكين المتعلمين من ممارسة قرارات التقييم والتدخل في بيئة محاكاة آمنة غنية بالتغذية الراجعة.',
        'توفير تجربة مستخدم احترافية ومتكافئة باللغتين العربية (RTL) والإنجليزية (LTR).',
      ],
      ageSpecificTitle: 'لماذا تهم التوعية المخصصة لكل فئة عمرية؟',
      ageSpecificBody:
        'مجرى الهواء لدى الرضيع ضيق ومخروطي الشكل، كما أن أعضاءه البطنية—وخاصة الكبد—تكون بارزة وأقل محمية بالقفص الصدري؛ لذا فإن ضغطات البطن قد تسبب نزيفاً داخلياً خطيراً. في المقابل، يحتاج الأطفال والبالغون إلى وضعيات ومناورات محددة لتوليد ضغط كافٍ داخل الصدر لدفع الجسم الغريب للخارج.',
      interactiveRoleTitle: 'دور التعلّم التفاعلي القائم على المحاكاة',
      interactiveRoleBody:
        'الكتيبات الثابتة نادراً ما تختبر قدرة المتعلم على تقييم الموقف تحت الضغط. من خلال تقديم سيناريوهات متفرعة تتطلب من المستخدم تقييم كفاءة السعال أولاً، وطلب الطوارئ في الوقت المناسب، والانتقال إلى الإنعاش القلبي الرئوي إذا فقد المصاب وعيه، تبني منصة «نَفَس» منهجية تفكير إسعافي سليمة.',
      guidelinesSectionTitle: 'المرجعية الطبية والمراجعة الأكاديمية',
      guidelinesSectionBody:
        'تستند وحدات التعلّم ومنطق المحاكاة في منصة «نَفَس» إلى محاضرة د. مي مهران والإرشادات المنشورة من مجلس الإنعاش في المملكة المتحدة (Resuscitation Council UK 2025) والصليب الأحمر الأمريكي (American Red Cross)، مع خضوع المحتوى لمراجعة فريق البحث الطبي بالمشروع.',
    },
    learning: {
      kicker: 'مركز المحتوى الطبي والتعليمي المنظّم',
      title: 'مركز التعلّم – نَفَس',
      subtitle:
        'استعرض وحدات تعليمية موثقة تغطي تشريح مجرى الهواء، وعلامات الاختناق الجزئي والكلي، وبروتوكولات الإسعاف حسب العمر، وطرق الوقاية.',
      searchPlaceholder: 'ابحث في المقالات حسب الموضوع أو العرض أو الإجراء الإسعافي...',
      ageFilterAll: 'جميع الأعمار',
      ageFilterAdult: 'البالغون (+18)',
      ageFilterChild: 'الأطفال (1–8 سنوات)',
      ageFilterInfant: 'الرضّع (أقل من سنة)',
      minRead: 'دقائق قراءة',
      readArticle: 'اقرأ الدليل',
      backToHub: 'العودة إلى مركز التعلّم',
      keyTakeaways: 'أهم النقاط السريرية المستفادة',
      medicalReferences: 'المراجع والإرشادات الطبية',
      relatedArticles: 'وحدات تعليمية ذات صلة',
      practiceSimulationPrompt: 'هل أنت مستعد لتطبيق هذه المعرفة في سيناريو محاكاة تفاعلي؟',
      launchRelatedSim: 'ابدأ المحاكاة الآن',
      emptySearchTitle: 'لم يتم العثور على مقالات مطابقة',
      emptySearchDesc: 'جرّب تعديل كلمات البحث أو اختيار تصنيف آخر.',
      resetFilters: 'إعادة ضبط الفلاتر',
    },
    simulation: {
      kicker: 'سيناريوهات تفاعلية قائمة على اتخاذ القرار',
      title: 'مركز المحاكاة – نَفَس',
      subtitle:
        'اختر الفئة العمرية لبدء سيناريو سريري متفرع. قيّم حالة المصاب، واختر الإجراء المناسب، واحصل على تغذية راجعة فورية مبنية على الإرشادات الطبية.',
      selectScenarioTitle: 'اختر مسار المحاكاة السريرية',
      startScenarioBtn: 'ابدأ المحاكاة',
      restartScenarioBtn: 'إعادة السيناريو',
      exitToLobbyBtn: 'جميع مسارات المحاكاة',
      stepIndicator: 'الخطوة',
      of: 'من',
      patientProfile: 'ملف المصاب',
      clinicalStatus: 'الحالة السريرية',
      observedSigns: 'العلامات السريرية المرصودة',
      situationAssessment: 'تقييم الموقف',
      decisionPanelTitle: 'لوحة القرار — اختر الإجراء التالي',
      feedbackHeaderCorrect: 'قرار إسعافي صحيح ومثالي',
      feedbackHeaderSuboptimal: 'إجراء غير مثالي أو متأخر',
      feedbackHeaderCritical: 'خطأ سلامة حرج',
      guidelineReferenceLabel: 'الأساس الطبي والإرشادي',
      continueNextStep: 'متابعة السيناريو',
      objectivesLabel: 'أهداف السيناريو',
      estTimeLabel: 'دقائق محاكاة تفاعلية',
    },
    aiAssistant: {
      badge: 'مرحلة البحث — ميزة تجريبية مقترحة',
      title: 'المساعد التعليمي الموجّه (نسخة بحثية تجريبية)',
      subtitle:
        'استكشف إجابات موثقة لأهم الأسئلة الشائعة حول علامات الاختناق، والفروقات العمرية، وتفسير قرارات المحاكاة بالاعتماد الحصري على مصادر «نَفَس» المعتمدة.',
      researchNoticeTitle: 'تنبيه هام حول حالة دمج الذكاء الاصطناعي',
      researchNoticeBody:
        'التزاماً بمعايير السلامة الطبية في مشروع «نَفَس»، يُحظر استخدام روبوتات المحادثة التوليدية غير الموثقة لإصدار تعليمات علاجية طارئة. يوضح هذا النموذج التجريبي كيف يمكن لمساعد تعليمي موجّه تقديم إجابات مستمدة حصرياً من المحتوى المراجع طبياً وإرشادات مجلس الإنعاش البريطاني (2025) والصليب الأحمر الأمريكي.',
      searchPrompt: 'ابحث في الأسئلة الموثقة (مثال: رضيع، مسح الإصبع، فقدان الوعي، سعال)...',
      filterAll: 'جميع المواضيع',
      filterAdult: 'إسعاف البالغين',
      filterChild: 'إسعاف الأطفال',
      filterInfant: 'إسعاف الرضّع',
      filterGeneral: 'مبادئ أساسية',
      selectQuestionPrompt: 'اختر سؤالاً سريرياً لاستعراض الإجابة الموثقة',
      shortAnswerLabel: 'الملخص الإرشادي المباشر',
      detailedExplanationLabel: 'الشرح الطبي التفصيلي',
      criticalRuleLabel: 'قاعدة السلامة الحرجة',
      verifiedSourceLabel: 'المصدر الموثق والمرجع الإرشادي',
      openSourceArticleBtn: 'قراءة المقال الكامل في مركز التعلّم',
    },
    footer: {
      description:
        'منصة «نَفَس» (NAFAS) هي منصة تعليمية جامعية ثنائية اللغة مخصصة للتوعية بحالات الاختناق الطارئة، وتعلّم الإسعافات الأولية حسب الفئة العمرية، والمحاكاة التفاعلية.',
      quickLinks: 'أقسام المنصة',
      ageTracks: 'مسارات المحاكاة',
      projectInfoTitle: 'الحوكمة الأكاديمية والطبية',
      projectInfoText:
        'طُوّرت كمنصة تثقيف صحي رقمي جامعية. المحتوى مبني على محاضرة د. مي مهران وإرشادات مجلس الإنعاش البريطاني (2025) والصليب الأحمر الأمريكي لأغراض التعليم والمحاكاة.',
      copyright: '© 2026 منصة نَفَس – NAFAS التعليمية. للتوعية بحالات الاختناق والإسعافات الأولية.',
      everySecondCounts: 'لأن كل ثانية تصنع فارقاً...',
    },
  },
} as const;
