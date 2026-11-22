import { AgeCategory, BilingualText } from '../types/nafas';
import { getManifestImageSrc } from './imageManifest';

export interface GuideStep {
  id: string;
  imageId: string;
  imageSrc: string;
  imageAlt: BilingualText;
  title: BilingualText;
  body: BilingualText;
  /** True when illustrating an action the responder must NOT do */
  isDont?: boolean;
  /** Flagged for clinical image review (OC mistake frames) */
  clinicalReviewFlag?: boolean;
}

export interface ComparisonPair {
  left: {
    imageId: string;
    imageSrc: string;
    imageAlt: BilingualText;
    label: BilingualText;
    tone: 'safe' | 'danger';
  };
  right: {
    imageId: string;
    imageSrc: string;
    imageAlt: BilingualText;
    label: BilingualText;
    tone: 'safe' | 'danger';
  };
}

export interface LearningGuide {
  id: string;
  ageGroups: AgeCategory[];
  title: BilingualText;
  summary: BilingualText;
  heroImageId: string;
  heroImageSrc: string;
  heroImageAlt: BilingualText;
  /** Optional side-by-side comparison for Guide 1 (Mild vs Severe) */
  comparisonPair?: ComparisonPair;
  /** Visual treatment for Mistakes to Avoid */
  isDontGuide?: boolean;
  /** Embeds interactive Wheelchair & Choking Alone practice cards inside Guide 6 */
  includeSpecialPracticeCards?: boolean;
  steps: GuideStep[];
  remember: BilingualText;
  simulationLevelId: string;
  simulationButtonLabel: BilingualText;
}

export const LEARNING_GUIDES: LearningGuide[] = [
  // 1. Mild or severe?
  {
    id: 'mild-or-severe',
    ageGroups: ['adult', 'child', 'infant'],
    title: {
      en: 'Mild or severe?',
      ar: 'اختناق بسيط أم شديد؟',
    },
    summary: {
      en: 'Tell the difference in seconds: encourage a strong cough, act right away if it goes silent.',
      ar: 'فرّق بينهما في ثوانٍ: شجّع السعال القوي، وتدخّل فوراً إذا انقطع الصوت.',
    },
    heroImageId: 'A1_S5',
    heroImageSrc: getManifestImageSrc('A1_S5'),
    heroImageAlt: {
      en: 'Comparing a person coughing strongly with a person silently clutching their throat',
      ar: 'مقارنة بين شخص يسعل بقوة وشخص يمسك رقبته بصمت دون نفس',
    },
    comparisonPair: {
      left: {
        imageId: 'A1_S5',
        imageSrc: getManifestImageSrc('A1_S5'),
        imageAlt: {
          en: 'Person coughing strongly and able to breathe during mild choking',
          ar: 'شخص يسعل بقوة وقادر على التنفس في حالة اختناق بسيط',
        },
        label: {
          en: 'Mild · Coughing',
          ar: 'بسيط · يسعل',
        },
        tone: 'safe',
      },
      right: {
        imageId: 'A2_S5',
        imageSrc: getManifestImageSrc('A2_S5'),
        imageAlt: {
          en: 'Person clutching throat silently with pale lips during severe choking',
          ar: 'شخص يمسك رقبته بصمت وشحوب في الشفاه في حالة اختناق شديد',
        },
        label: {
          en: 'Severe · Silent',
          ar: 'شديد · صامت',
        },
        tone: 'danger',
      },
    },
    steps: [
      {
        id: 'ms-1',
        imageId: 'A1_S3',
        imageSrc: getManifestImageSrc('A1_S3'),
        imageAlt: {
          en: 'Person coughing loudly at a table while still taking breaths',
          ar: 'شخص يسعل بصوت مرتفع على الطاولة وهو ما زال يلتقط أنفاسه',
        },
        title: {
          en: 'Listen first: can they cough or speak?',
          ar: 'استمع أولاً: هل يستطيع السعال أو الكلام؟',
        },
        body: {
          en: 'Ask calmly, "Are you choking?" If they can answer, cry loudly, or cough with real force, air is still moving past the blockage. A strong cough is the safest way to clear it.',
          ar: 'اسأله بهدوء: «هل تختنق؟». إذا قدر أن يرد أو يبكي بصوت مسموع أو يسعل بقوة، فالهواء ما زال يمر. السعال القوي هو أكثر طريقة آمنة لطرد ما يغلق الحلق.',
        },
      },
      {
        id: 'ms-2',
        imageId: 'A1_OA1',
        imageSrc: getManifestImageSrc('A1_OA1'),
        imageAlt: {
          en: 'Helper staying close and encouraging the person to keep coughing calmly',
          ar: 'مساعد يقف قريباً ويشجع الشخص على الاستمرار في السعال بهدوء',
        },
        title: {
          en: 'Mild choking: encourage coughing and stay close',
          ar: 'في الاختناق البسيط: شجّع السعال وابقَ قريباً',
        },
        body: {
          en: 'Keep them upright, speak calmly, and encourage them to keep coughing. Do not hit their back or offer water while they are coughing well. Stay right beside them in case things change.',
          ar: 'دعه يستمر في السعال بهدوء دون ضرب على الظهر ودون تقديم ماء. ابقَ بجانبه مباشرة وراقب تنفسه ولونه، فالحالة البسيطة قد تتحول فجأة إلى شديدة.',
        },
      },
      {
        id: 'ms-3',
        imageId: 'A2_S3',
        imageSrc: getManifestImageSrc('A2_S3'),
        imageAlt: {
          en: 'Person standing suddenly and grabbing their throat with both hands',
          ar: 'شخص يقف فجأة ويمسك رقبته بكلتا يديه بصمت',
        },
        title: {
          en: 'Severe choking: silence and hands on the throat',
          ar: 'في الاختناق الشديد: صمت تام واليدان على الرقبة',
        },
        body: {
          en: 'When the airway is fully blocked, no voice or cry comes out. The person may clutch their throat with both hands, make a weak silent cough, or look panicked as they struggle for air.',
          ar: 'عندما يُغلق مجرى الهواء بالكامل لا يخرج صوت أو بكاء. غالباً يمسك الشخص رقبته بيديه، أو يحاول السعال دون صوت، وتظهر عليه علامات الذعر وهو يحاول التنفس.',
        },
      },
      {
        id: 'ms-4',
        imageId: 'A2_S5',
        imageSrc: getManifestImageSrc('A2_S5'),
        imageAlt: {
          en: 'Close view of pale bluish lips and silent distress',
          ar: 'لقطة قريبة لشحوب الشفاه وازرقاقها مع العجز عن الكلام',
        },
        title: {
          en: 'Act immediately when breathing stops',
          ar: 'تصرّف فوراً عند انقطاع النفس',
        },
        body: {
          en: 'Pale or bluish lips mean oxygen is dropping fast. Ask someone nearby to call emergency services right away and start back blows and thrusts immediately without waiting.',
          ar: 'شحوب الشفاه أو ازرقاقها يعني أن الأكسجين ينقص بسرعة. اطلب من شخص قريب الاتصال بالإسعاف فوراً وابدأ الإسعاف اليدوي مباشرة دون أي انتظار.',
        },
      },
    ],
    remember: {
      en: 'Strong cough = stay close and encourage coughing. Silent, unable to speak, or pale/blue lips = call emergency services and act right away.',
      ar: 'سعال قوي = ابقَ قريباً وشجّع السعال. صمت أو عجز عن الكلام أو شحوب الشفاه = اتصل بالإسعاف وتدخّل فوراً.',
    },
    simulationLevelId: 'A1',
    simulationButtonLabel: {
      en: 'Practice it in the simulation',
      ar: 'تدرّب عليها في المحاكاة',
    },
  },

  // 2. Adults and children: back blows + belly thrusts
  {
    id: 'adults-and-children',
    ageGroups: ['adult', 'child'],
    title: {
      en: 'Adults and children: back blows + belly thrusts',
      ar: 'البالغون والأطفال: ضربات الظهر وضغطات البطن',
    },
    summary: {
      en: 'Alternate up to 5 firm back blows and up to 5 inward-upward belly thrusts until they breathe.',
      ar: 'بدّل بين حتى ٥ ضربات ظهر وحتى ٥ ضغطات بطن للداخل وللأعلى حتى يعود التنفس.',
    },
    heroImageId: 'A2_OA1',
    heroImageSrc: getManifestImageSrc('A2_OA1'),
    heroImageAlt: {
      en: 'Helper supporting the chest and leaning the choking adult forward for back blows',
      ar: 'مسعف يسند صدر المصاب ويميله للأمام لتنفيذ ضربات الظهر',
    },
    steps: [
      {
        id: 'ac-1',
        imageId: 'A2_OA1',
        imageSrc: getManifestImageSrc('A2_OA1'),
        imageAlt: {
          en: 'Helper leaning the adult forward and preparing firm blows between the shoulder blades',
          ar: 'إمالة البالغ للأمام مع سند الصدر استعداداً لضربات الظهر بين لوحي الكتف',
        },
        title: {
          en: 'Call for help, lean forward, and give up to 5 back blows',
          ar: 'اطلب الإسعاف، أمِل الجسم للأمام، وأعطِ حتى ٥ ضربات ظهر',
        },
        body: {
          en: 'Stand to the side and slightly behind them. Support their chest with one hand and lean them well forward so the object can fall out. Give up to 5 firm blows between the shoulder blades with the heel of your hand.',
          ar: 'قف بجانبه وخلفه قليلاً، اسند صدره بيدك وأمله للأمام جيداً ليسهل خروج الجسم. أعطِ حتى ٥ ضربات حازمة بكعب يدك بين لوحي الكتف، وتوقف فوراً إذا خرج الجسم.',
        },
      },
      {
        id: 'ac-2',
        imageId: 'A2_OA2',
        imageSrc: getManifestImageSrc('A2_OA2'),
        imageAlt: {
          en: 'Helper standing behind adult alternating back blows and inward-upward belly thrusts',
          ar: 'التبديل بين ضربات الظهر وضغطات البطن للداخل وللأعلى فوق السرة',
        },
        title: {
          en: 'Follow with up to 5 belly thrusts',
          ar: 'أتبعها بحتى ٥ ضغطات على البطن',
        },
        body: {
          en: 'If the airway is still blocked, stand behind them and wrap your arms around their waist. Place your fist just above the belly button, hold it with your other hand, and pull sharply inward and upward up to 5 times.',
          ar: 'إذا بقي مجرى الهواء مغلقاً، قف خلفه وأحط خصره بذراعيك. ضع قبضتك فوق السرة مباشرة وأمسكها بيدك الأخرى، ثم اسحب للداخل وللأعلى بحركة واضحة حتى ٥ مرات.',
        },
      },
      {
        id: 'ac-3',
        imageId: 'C1_OA2',
        imageSrc: getManifestImageSrc('C1_OA2'),
        imageAlt: {
          en: 'Teacher kneeling to a child height to deliver back blows and gentle belly thrusts',
          ar: 'معلمة تركع لمستوى طول الطفل لتطبيق ضربات الظهر وضغطات البطن بأمان',
        },
        title: {
          en: 'For children: kneel down to their height',
          ar: 'للأطفال: اركع لمستوى طول الطفل',
        },
        body: {
          en: 'With a child, kneel behind them so your arms sit straight at their waist level. Use the same cycle of up to 5 back blows and up to 5 belly thrusts, adjusting your strength smoothly to the child’s size.',
          ar: 'مع الطفل، انزل على ركبتيك خلفه حتى تكون يداك في مستوى خصره تماماً. طبّق نفس الدورة بين حتى ٥ ضربات ظهر وحتى ٥ ضغطات بطن بقوة مناسبة لحجم الطفل.',
        },
      },
      {
        id: 'ac-4',
        imageId: 'A2_OA3',
        imageSrc: getManifestImageSrc('A2_OA3'),
        imageAlt: {
          en: 'Person breathing normally again after the object clears while helper stays beside them',
          ar: 'عودة التنفس الطبيعي بعد خروج الجسم الغريب مع بقاء المسعف للمراقبة',
        },
        title: {
          en: 'Keep checking and arrange a medical check afterward',
          ar: 'تحقّق بعد كل ضربة، واطلب فحصاً طبياً بعدها',
        },
        body: {
          en: 'Check after each blow or thrust to see if the object came out. Once they breathe easily again, keep them calm and resting. Anyone who received belly thrusts should be checked by a doctor.',
          ar: 'راقب بعد كل ضربة أو ضغطة لمعرفة هل خرج الجسم. عندما يعود التنفس طبيعياً، هدّئه ودعه يرتاح، ويجب أن يفحصه طبيب بعد ضغطات البطن للاطمئنان الكامل.',
        },
      },
    ],
    remember: {
      en: 'Up to 5 back blows, then up to 5 inward-and-upward belly thrusts. Stop the moment the object comes out, and always get a medical check after belly thrusts.',
      ar: 'حتى ٥ ضربات ظهر ثم حتى ٥ ضغطات بطن للداخل وللأعلى. توقف لحظة خروج الجسم، واحرص على الفحص الطبي بعد ضغطات البطن.',
    },
    simulationLevelId: 'A2',
    simulationButtonLabel: {
      en: 'Practice it in the simulation',
      ar: 'تدرّب عليها في المحاكاة',
    },
  },

  // 3. Infants: back blows + chest thrusts, never belly thrusts
  {
    id: 'infants-care',
    ageGroups: ['infant'],
    title: {
      en: 'Infants: back blows + chest thrusts, never belly thrusts',
      ar: 'الرضّع: ضربات الظهر وضغطات الصدر — ممنوع ضغطات البطن',
    },
    summary: {
      en: 'Support the baby’s head lower than the chest and alternate up to 5 back blows and 5 two-finger chest thrusts.',
      ar: 'اسند رأس الرضيع أخفض من صدره وبدّل بين حتى ٥ ضربات ظهر و٥ ضغطات صدر بإصبعين.',
    },
    heroImageId: 'I1_OA1',
    heroImageSrc: getManifestImageSrc('I1_OA1'),
    heroImageAlt: {
      en: 'Caregiver supporting an infant face-down along the forearm with head supported for back blows',
      ar: 'أم تسند رضيعتها على بطنها فوق ساعدها مع دعم الرأس لتنفيذ ضربات الظهر',
    },
    steps: [
      {
        id: 'inf-1',
        imageId: 'I1_S5',
        imageSrc: getManifestImageSrc('I1_S5'),
        imageAlt: {
          en: 'Infant silent with wide eyes and no cry while caregiver reacts immediately',
          ar: 'رضيعة صامتة بعينين واسعتين دون بكاء أو نفس والأم تستجيب فوراً',
        },
        title: {
          en: 'Spot silent choking and call for help right away',
          ar: 'انتبه للصمت المفاجئ واطلب المساعدة فوراً',
        },
        body: {
          en: 'If a baby under one year old cannot cry, cough loudly, or breathe, act at once. Shout for someone nearby to call emergency services, or put your phone on speaker while you help.',
          ar: 'إذا كان الرضيع (أقل من سنة) لا يبكي ولا يسعل بصوت ولا يتنفس، تصرّف فوراً. اطلب ممن حولك الاتصال بالإسعاف، أو افتح مكبر الصوت في هاتفك وأنت تبدأ الإسعاف.',
        },
      },
      {
        id: 'inf-2',
        imageId: 'I1_OA1',
        imageSrc: getManifestImageSrc('I1_OA1'),
        imageAlt: {
          en: 'Infant resting face-down on caregiver forearm for gentle firm back blows',
          ar: 'وضع الرضيع على بطنه فوق الساعد مع تثبيت الفك والرأس لإعطاء ضربات الظهر',
        },
        title: {
          en: 'Give up to 5 back blows face-down on your forearm',
          ar: 'أعطِ حتى ٥ ضربات ظهر والرضيع على ساعدك',
        },
        body: {
          en: 'Lay the baby face-down along your forearm, resting your arm on your thigh. Support the head and jaw firmly with your hand without covering the mouth, keeping the head lower than the chest. Give up to 5 controlled blows between the shoulder blades.',
          ar: 'ضع الرضيع على بطنه فوق ساعدك واسند ساعدك على فخذك. ثبّت الرأس والفك جيداً دون تغطية الفم، واجعل الرأس أخفض من الصدر. أعطِ حتى ٥ ضربات محسوبة بين لوحي الكتف.',
        },
      },
      {
        id: 'inf-3',
        imageId: 'I1_OA2',
        imageSrc: getManifestImageSrc('I1_OA2'),
        imageAlt: {
          en: 'Turning the infant face-up to deliver up to 5 two-finger chest thrusts',
          ar: 'قلب الرضيع على ظهره وتنفيذ حتى ٥ ضغطات صدر بإصبعين مع تجنب البطن تماماً',
        },
        title: {
          en: 'Turn face-up for up to 5 two-finger chest thrusts',
          ar: 'اقلبه على ظهره لعمل حتى ٥ ضغطات صدر بإصبعين',
        },
        body: {
          en: 'If still blocked, support the back of the head and turn the baby face-up on your other forearm. Place two fingers in the center of the chest just below the nipple line and give up to 5 steady chest thrusts. Never press a baby’s belly.',
          ar: 'إذا لم يخرج الجسم، اسند مؤخرة الرأس واقلب الرضيع على ظهره فوق ساعدك الآخر. ضع إصبعين في منتصف الصدر أسفل خط الحلمتين مباشرة وأعطِ حتى ٥ ضغطات صدرية منتظمة. لا تضغط على بطن الرضيع أبداً.',
        },
      },
      {
        id: 'inf-4',
        imageId: 'I1_OA3',
        imageSrc: getManifestImageSrc('I1_OA3'),
        imageAlt: {
          en: 'Infant crying and breathing again in mother arms after object clears',
          ar: 'الرضيعة تعود للتنفس والبكاء في حضن أمها بعد خروج الجسم الغريب',
        },
        title: {
          en: 'Continue cycles until clear, then see a doctor',
          ar: 'استمر حتى يخرج الجسم، ثم اعرض الرضيع على طبيب',
        },
        body: {
          en: 'Alternate 5 back blows and 5 chest thrusts until the object comes out and the baby cries or breathes normally. Have a doctor check the baby afterward, and consider hands-on infant first-aid training.',
          ar: 'بدّل بين ٥ ضربات ظهر و٥ ضغطات صدر حتى يخرج الجسم ويعود البكاء والتنفس الطبيعي. اعرض الرضيع على طبيب للاطمئنان بعدها، وتذكّر أن التدريب العملي المباشر ضروري دائماً.',
        },
      },
    ],
    remember: {
      en: 'Never do belly thrusts on an infant — their liver and internal organs are fragile. Always support the head and alternate 5 back blows with 5 two-finger chest thrusts.',
      ar: 'ممنوع تماماً ضغطات البطن للرضيع لحماية أعضائه الداخلية الحساسة. اسند الرأس دائماً وبدّل بين ٥ ضربات ظهر و٥ ضغطات صدر بإصبعين.',
    },
    simulationLevelId: 'I1',
    simulationButtonLabel: {
      en: 'Practice it in the simulation',
      ar: 'تدرّب عليها في المحاكاة',
    },
  },

  // 4. When the person goes limp
  {
    id: 'when-person-goes-limp',
    ageGroups: ['adult', 'child', 'infant'],
    title: {
      en: 'When the person goes limp',
      ar: 'عندما يرتخي الشخص ويفقد الوعي',
    },
    summary: {
      en: 'Lower them safely to a firm flat surface, make sure emergency help is coming, and begin resuscitation.',
      ar: 'أنزله بأمان على سطح صلب مستوٍ، تأكّد من اتصال الإسعاف، وابدأ الإنعاش فوراً.',
    },
    heroImageId: 'A3_OA1',
    heroImageSrc: getManifestImageSrc('A3_OA1'),
    heroImageAlt: {
      en: 'Helper lowering an unresponsive adult gently onto a firm flat floor while calling emergency services',
      ar: 'مسعف ينزل شخصاً فاقداً للوعي برفق على أرضية صلبة مستوية مع تفعيل الإسعاف',
    },
    steps: [
      {
        id: 'limp-1',
        imageId: 'A3_S4',
        imageSrc: getManifestImageSrc('A3_S4'),
        imageAlt: {
          en: 'Unresponsive person lying still on the floor with no normal breathing',
          ar: 'شخص فاقد للوعي ومستلقٍ دون حركة أو تنفس طبيعي',
        },
        title: {
          en: 'Recognize the change immediately',
          ar: 'لاحظ التغيّر فوراً ولا تضيّع ثانية',
        },
        body: {
          en: 'If choking lasts too long, the person’s body suddenly goes limp and stops responding. Do not try to hold them upright or sit them in a chair — standing thrusts no longer help.',
          ar: 'إذا استمر الانسداد دون أن ينفتح، يرتخي الجسم فجأة ويفقد المصاب وعيه. لا تحاول إبقاءه واقفاً أو إقعاده على كرسي، فضغطات الوقوف لم تعد تنفع في هذه اللحظة.',
        },
      },
      {
        id: 'limp-2',
        imageId: 'A3_OA1',
        imageSrc: getManifestImageSrc('A3_OA1'),
        imageAlt: {
          en: 'Laying the person flat on a firm surface and calling emergency services',
          ar: 'وضع المصاب على ظهره فوق سطح صلب مستوٍ وتفعيل الإسعاف على مكبر الصوت',
        },
        title: {
          en: 'Lower gently onto a firm flat surface and call emergency services',
          ar: 'أنزله برفق على سطح صلب واتصل بالإسعاف',
        },
        body: {
          en: 'Support their head and back as you lay them flat on the floor. Make sure emergency services are called on speakerphone right away and ask someone to bring a defibrillator if one is nearby.',
          ar: 'اسند الرأس والظهر وأنت تنزله برفق على الأرض الصلبة. تأكد من الاتصال بالإسعاف على مكبر الصوت فوراً، واطلب من شخص قريب إحضار جهاز الصدمات الآلي إن وُجد.',
        },
      },
      {
        id: 'limp-3',
        imageId: 'A3_OA2',
        imageSrc: getManifestImageSrc('A3_OA2'),
        imageAlt: {
          en: 'Helper beginning chest compressions on an unresponsive adult on the floor',
          ar: 'بدء ضغطات الإنعاش الصدرية لشخص فاقد للوعي على سطح صلب',
        },
        title: {
          en: 'Start resuscitation right away and follow the dispatcher',
          ar: 'ابدأ الإنعاش فوراً واتبع توجيهات المرسل',
        },
        body: {
          en: 'Start chest compressions right away according to your training and listen closely to the emergency dispatcher. Compressions keep blood moving and can also help dislodge the blockage.',
          ar: 'ابدأ ضغطات الصدر للإنعاش فوراً حسب تدريبك واتبع إرشادات موظف الطوارئ خطوة بخطوة. الضغطات تحافظ على وصول الدم للدماغ وقد تساعد أيضاً في إزاحة الجسم العالق.',
        },
      },
      {
        id: 'limp-4',
        imageId: 'C2_OA1',
        imageSrc: getManifestImageSrc('C2_OA1'),
        imageAlt: {
          en: 'Teacher gently placing an unresponsive child on a firm flat surface while emergency help is called',
          ar: 'معلمة تضع طفلاً فاقداً للوعي بحرص على سطح صلب مستوٍ مع تأكيد اتصال الإسعاف',
        },
        title: {
          en: 'Same calm transition for children and infants',
          ar: 'نفس التحوّل الهادئ للأطفال والرضّع',
        },
        body: {
          en: 'For a child or infant who goes limp, lay them on a firm flat surface and begin age-appropriate resuscitation immediately. Never reach blindly into the mouth — only remove an object if you can clearly see it.',
          ar: 'مع الطفل أو الرضيع الذي يفقد وعيه، ضعه على سطح صلب مستوٍ وابدأ الإنعاش المناسب لعمره فوراً. لا تُدخل أصابعك في الفم بشكل عشوائي أبداً، وأزل الجسم فقط إذا رأيته بوضوح.',
        },
      },
    ],
    remember: {
      en: 'If a choking person goes limp: firm flat surface, confirm emergency services are on speaker, start resuscitation right away, and never do a blind finger sweep.',
      ar: 'إذا ارتخى المصاب وفقد وعيه: سطح صلب مستوٍ، تأكد من اتصال الإسعاف، ابدأ الإنعاش فوراً، ولا تُدخل أصابعك في الفم بشكل أعمى أبداً.',
    },
    simulationLevelId: 'A3',
    simulationButtonLabel: {
      en: 'Practice it in the simulation',
      ar: 'تدرّب عليها في المحاكاة',
    },
  },

  // 5. Mistakes to avoid
  {
    id: 'mistakes-to-avoid',
    ageGroups: ['adult', 'child', 'infant'],
    isDontGuide: true,
    title: {
      en: 'Mistakes to avoid: water, blind finger sweeps, random slaps, waiting',
      ar: 'أخطاء يجب تجنّبها: الماء، المسح الأعمى، الضرب العشوائي، الانتظار',
    },
    summary: {
      en: 'Four common reactions that feel helpful in panic — and why each one makes choking more dangerous.',
      ar: 'أربعة تصرفات شائعة تبدو مفيدة وقت الذعر — ولماذا يجعل كل منها الاختناق أخطر.',
    },
    heroImageId: 'A2_OB',
    heroImageSrc: getManifestImageSrc('A2_OB'),
    heroImageAlt: {
      en: 'Illustration showing why offering water to a severely choking person is dangerous',
      ar: 'توضيح لخطورة تقديم الماء لشخص مصاب باختناق شديد',
    },
    steps: [
      {
        id: 'mist-1',
        imageId: 'A2_OB',
        imageSrc: getManifestImageSrc('A2_OB'),
        imageAlt: {
          en: 'Offering water to a choking adult blocks airflow further',
          ar: 'تقديم الماء لشخص يختنق يزيد من انسداد مجرى الهواء',
        },
        isDont: true,
        title: {
          en: 'Do not offer water or food',
          ar: 'لا تقدّم الماء أو أي مشروب',
        },
        body: {
          en: 'A person with a blocked airway cannot swallow safely. Water does not wash food down the windpipe — it pools above the blockage, blocks any remaining air, or stops a helpful cough.',
          ar: 'المصاب بانسداد مجرى الهواء لا يستطيع البلع بأمان. الماء لا يدفع الطعام لأسفل، بل يتجمع فوق الانسداد ويحرمه من أي هواء متبقٍ أو يقطع السعال الفعّال.',
        },
      },
      {
        id: 'mist-2',
        imageId: 'A2_OC',
        imageSrc: getManifestImageSrc('A2_OC'),
        imageAlt: {
          en: 'Reaching fingers blindly into the mouth risks pushing the object deeper',
          ar: 'إدخال الأصابع بشكل أعمى في الفم قد يدفع الجسم العالق إلى عمق أكبر',
        },
        isDont: true,
        clinicalReviewFlag: true,
        title: {
          en: 'Do not sweep the mouth blindly with your fingers',
          ar: 'لا تُدخل أصابعك في الفم بشكل أعمى',
        },
        body: {
          en: 'Reaching in when you cannot clearly see the object can push it deeper into the throat and turn a partial blockage into a total one. Only remove something you can clearly see and grasp easily.',
          ar: 'إدخال أصابعك دون رؤية واضحة قد يدفع الجسم العالق أعمق في الحلق ويحول الانسداد الجزئي إلى كامل. أزل الجسم فقط إذا كان ظاهراً بوضوح وسهل الإمساك.',
        },
      },
      {
        id: 'mist-3',
        imageId: 'C1_OC',
        imageSrc: getManifestImageSrc('C1_OC'),
        imageAlt: {
          en: 'Random slapping on the neck or upright back harms the child instead of clearing the airway',
          ar: 'الضرب العشوائي على الرقبة أو الظهر في وضع الوقوف يؤذي الطفل ولا يفتح مجرى الهواء',
        },
        isDont: true,
        clinicalReviewFlag: true,
        title: {
          en: 'Do not give random slaps on the neck or upright back',
          ar: 'لا تضرب بشكل عشوائي على الرقبة أو الظهر وهو واقف',
        },
        body: {
          en: 'Hitting the neck can injure delicate airways, and slapping someone standing straight upright can shake the object further down. Always lean them forward and aim cleanly between the shoulder blades.',
          ar: 'الضرب على الرقبة قد يؤذي القصبة الهوائية، والضرب على الظهر والشخص مستقيم قد ينزل الجسم أعمق. أمِله للأمام دائماً ووجّه الضربات بدقة بين لوحي الكتف.',
        },
      },
      {
        id: 'mist-4',
        imageId: 'C3_OC',
        imageSrc: getManifestImageSrc('C3_OC'),
        imageAlt: {
          en: 'Interrupting an effective cough or waiting passively when someone needs action',
          ar: 'مقاطعة السعال القوي بالماء أو الانتظار السلبي عند تفاقم الحالة',
        },
        isDont: true,
        clinicalReviewFlag: true,
        title: {
          en: 'Do not interrupt a strong cough — and never wait if breathing stops',
          ar: 'لا تقاطع السعال القوي — ولا تنتظر أبداً إذا توقف النفس',
        },
        body: {
          en: 'When someone coughs strongly, let their cough work without water or panic. And the moment coughing goes silent or the person becomes limp, never wait to see if they recover — act immediately.',
          ar: 'عندما يكون السعال قوياً اتركه يعمل دون ماء أو ارتباك. وفي اللحظة التي ينقطع فيها الصوت أو يرتخي الجسم، لا تنتظر أبداً على أمل التحسّن — تصرّف فوراً.',
        },
      },
    ],
    remember: {
      en: 'No water. No blind finger sweeps. No random neck slaps. No waiting once breathing stops. Calm, clear steps save lives.',
      ar: 'لا ماء. لا مسح أعمى بالأصابع. لا ضرب عشوائي على الرقبة. لا انتظار إذا توقف النفس. الخطوات الهادئة الصحيحة تنقذ الحياة.',
    },
    simulationLevelId: 'A2',
    simulationButtonLabel: {
      en: 'Practice it in the simulation',
      ar: 'تدرّب عليها في المحاكاة',
    },
  },

  // 6. Special situations: pregnancy / larger person, wheelchair, choking alone
  {
    id: 'special-situations',
    ageGroups: ['adult'],
    includeSpecialPracticeCards: true,
    title: {
      en: 'Special situations: pregnancy, wheelchair, choking alone',
      ar: 'حالات خاصة: الحمل، الكرسي المتحرك، الاختناق وحدك',
    },
    summary: {
      en: 'Simple adjustments when standard belly thrusts are not safe or nobody is around to help.',
      ar: 'تعديلات بسيطة وآمنة عندما لا تناسب ضغطات البطن العادية أو عندما تكون وحدك.',
    },
    heroImageId: 'A4_OA2',
    heroImageSrc: getManifestImageSrc('A4_OA2'),
    heroImageAlt: {
      en: 'Helper performing chest thrusts from behind on a colleague in late pregnancy',
      ar: 'مسعف ينفّذ ضغطات الصدر من الخلف لزميلة في أواخر الحمل',
    },
    steps: [
      {
        id: 'sp-1',
        imageId: 'A4_OA2',
        imageSrc: getManifestImageSrc('A4_OA2'),
        imageAlt: {
          en: 'Chest thrusts on the center of the breastbone for late pregnancy or a larger person',
          ar: 'ضغطات الصدر على منتصف عظمة القص في أواخر الحمل أو مع شخص كبير البنية',
        },
        title: {
          en: 'Late pregnancy or a larger person: switch to chest thrusts',
          ar: 'أواخر الحمل أو البنية الكبيرة: استخدم ضغطات الصدر',
        },
        body: {
          en: 'If you cannot safely wrap your arms around the belly, place your hands higher — right on the center of the breastbone — and pull straight inward. Call emergency services early and keep going until clear.',
          ar: 'إذا تعذّر الإمساك حول البطن بأمان في أواخر الحمل أو مع شخص كبير البنية، ارفع يديك إلى منتصف عظمة الصدر واسحب للداخل مباشرة. اتصل بالإسعاف مبكراً واستمر حتى يخرج الجسم.',
        },
      },
      {
        id: 'sp-2',
        imageId: 'LH_Wheelchair',
        imageSrc: getManifestImageSrc('LH_Wheelchair'),
        imageAlt: {
          en: 'Helper locking wheelchair brakes and kneeling behind the chair to give thrusts safely',
          ar: 'مسعف يثبّت فرامل الكرسي المتحرك ويركع خلفه لتنفيذ الضغطات بأمان',
        },
        title: {
          en: 'Person in a wheelchair: lock wheels and adjust safely',
          ar: 'شخص على كرسي متحرك: ثبّت العجلات وتكيّف بأمان',
        },
        body: {
          en: 'Lock the wheelchair brakes first. Remove armrests if you can, kneel behind the chair, and give belly thrusts. If the backrest blocks your reach, switch cleanly to chest thrusts and call emergency help early.',
          ar: 'أغلق فرامل الكرسي أولاً. أزل مساند الذراعين إن أمكن، واركع خلف الكرسي لتنفيذ ضغطات البطن. وإذا منع ظهر الكرسي وصولك، انتقل مباشرة إلى ضغطات الصدر واطلب الإسعاف مبكراً.',
        },
      },
      {
        id: 'sp-3',
        imageId: 'LH_ChokingAlone',
        imageSrc: getManifestImageSrc('LH_ChokingAlone'),
        imageAlt: {
          en: 'Person choking alone calling emergency services on speaker and leaning over a firm chair back',
          ar: 'شخص يختنق بمفرده يتصل بالإسعاف على مكبر الصوت وينحني فوق ظهر كرسي ثابت',
        },
        title: {
          en: 'Choking when you are alone: call on speaker, then press',
          ar: 'الاختناق وأنت وحدك: اتصل بمكبر الصوت ثم اضغط بنفسك',
        },
        body: {
          en: 'Dial emergency services and leave the line open on speaker even if you cannot talk. Give yourself upward belly thrusts with your fist, or lean your upper belly over the firm, rounded back of a chair — never a sharp corner.',
          ar: 'اتصل بالإسعاف واترك المكالمة مفتوحة على مكبر الصوت حتى لو لم تستطع الكلام. نفّذ ضغطات البطن لنفسك بقبضتك للأعلى، أو انحنِ بأعلى بطنك على ظهر كرسي صلب غير حاد، وتجنب الحواف الحادة.',
        },
      },
    ],
    remember: {
      en: 'When standard belly thrusts do not fit, adapt without losing time: chest thrusts for pregnancy or larger builds, locked wheels for wheelchairs, and speakerphone plus a firm chair back if you are alone.',
      ar: 'عندما لا تناسب ضغطات البطن العادية، عدّل الأسلوب دون إضاعة وقت: ضغطات الصدر للحامل أو كبير البنية، تثبيت الفرامل للكرسي المتحرك، ومكبر الصوت مع ظهر كرسي ثابت إذا كنت وحدك.',
    },
    simulationLevelId: 'A4',
    simulationButtonLabel: {
      en: 'Practice it in the simulation',
      ar: 'تدرّب عليها في المحاكاة',
    },
  },
];

export function getLearningGuideById(id: string | null): LearningGuide | null {
  if (!id) return null;
  return LEARNING_GUIDES.find((g) => g.id === id) ?? null;
}
