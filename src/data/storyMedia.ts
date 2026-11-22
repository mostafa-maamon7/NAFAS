import heroNafasAwareness from '../assets/images/hero_nafas_awareness_1795050365056.jpg';
import adultDinnerStory from '../assets/images/adult_dinner_story_1795050364398.jpg';
import adultChokingCrisis from '../assets/images/adult_choking_crisis_1795050364985.jpg';
import adultAbdominalThrusts from '../assets/images/adult_abdominal_thrusts_1795050365870.jpg';
import adultCprRecovery from '../assets/images/adult_cpr_recovery_1795050363730.jpg';
import pregnantAnatomyImg from '../assets/images/medical_pregnant_sternal_anatomy_1795127850237.jpg';
import childCafeteriaStory from '../assets/images/child_cafeteria_story_1795050365220.jpg';
import childChokingCrisis from '../assets/images/child_choking_crisis_1795050364465.jpg';
import childChokingRescue from '../assets/images/child_choking_rescue_1795050364080.jpg';
import childAnatomyImg from '../assets/images/medical_child_pediatric_anatomy_1795127851097.jpg';
import infantNurseryStory from '../assets/images/infant_nursery_story_1795050390253.jpg';
import infantBackBlows from '../assets/images/infant_back_blows_1795050363659.jpg';
import infantChestThrusts from '../assets/images/infant_chest_thrusts_1795050363978.jpg';

import { BilingualText } from '../types/nafas';
import { CHARACTER_REGISTRY, SUPPORTING_ROLES } from './characterRegistry';
import { getManifestImageSrc } from './imageManifest';

export interface StoryMediaAsset {
  src: string;
  manifestId?: string;
  alt: BilingualText;
  fallbackGradient: string;
  cameraCrop?: string;
  sceneTheme?: 'adult' | 'child' | 'infant' | 'special';
  beatIndex?: number;
}

const tariqEn = CHARACTER_REGISTRY.adult.name.en;
const tariqAr = CHARACTER_REGISTRY.adult.name.ar;
const youssefEn = CHARACTER_REGISTRY.child.name.en;
const youssefAr = CHARACTER_REGISTRY.child.name.ar;
const layanEn = CHARACTER_REGISTRY.infant.name.en;
const layanAr = CHARACTER_REGISTRY.infant.name.ar;
const pregEn = SUPPORTING_ROLES.pregnant_colleague.en;
const pregAr = SUPPORTING_ROLES.pregnant_colleague.ar;
const wheelEn = SUPPORTING_ROLES.wheelchair_colleague.en;
const wheelAr = SUPPORTING_ROLES.wheelchair_colleague.ar;

export const STORY_MEDIA: Record<string, StoryMediaAsset> = {
  // Base / Shared keys for non-level preview components
  hero_nafas_awareness: {
    src: heroNafasAwareness,
    alt: {
      en: 'Calm NAFAS first-aid responder ready to assist in a sunlit modern room',
      ar: 'مسعف منصة نَفَس مستعد بهدوء وثقة لتقديم الإسعافات الأولية',
    },
    fallbackGradient: 'from-[#103B56] via-[#135375] to-[#079D9A]',
  },
  adult_dinner_story: {
    src: adultDinnerStory,
    alt: {
      en: `${tariqEn} at the cafeteria table during lunch`,
      ar: `${tariqAr} حول طاولة الكافتيريا`,
    },
    fallbackGradient: 'from-[#1E3A52] via-[#103B56] to-[#2B5D7A]',
  },
  adult_choking_crisis: {
    src: adultChokingCrisis,
    alt: {
      en: `${tariqEn} standing abruptly clutching his throat with both hands`,
      ar: `${tariqAr} يقف فجأة ممسكاً برقبته بكلتا يديه في علامة الاختناق العالمية`,
    },
    fallbackGradient: 'from-[#2A2033] via-[#103B56] to-[#6E2D35]',
  },
  adult_abdominal_thrusts: {
    src: adultAbdominalThrusts,
    alt: {
      en: `Rescuer standing behind ${tariqEn} performing inward-upward abdominal thrusts above the navel`,
      ar: `مسعف يقف خلف ${tariqAr} ويطبق ضغطات البطن للداخل وللأعلى فوق السرة`,
    },
    fallbackGradient: 'from-[#103B56] via-[#0B5F70] to-[#079D9A]',
  },
  adult_cpr_recovery: {
    src: adultCprRecovery,
    alt: {
      en: `Rescuer kneeling beside unresponsive ${tariqEn} starting CPR according to training`,
      ar: `مسعف يركع بجانب ${tariqAr} فاقد الوعي ويبدأ الإنعاش حسب التدريب`,
    },
    fallbackGradient: 'from-[#103B56] via-[#1C4D6D] to-[#079D9A]',
  },
  adult_pregnant_sternal: {
    src: pregnantAnatomyImg,
    alt: {
      en: `Chest thrusts on the middle of the breastbone for ${pregEn}`,
      ar: `ضغطات الصدر على منتصف عظمة القص لـ ${pregAr}`,
    },
    fallbackGradient: 'from-[#103B56] via-[#1C4D6D] to-[#079D9A]',
  },
  child_cafeteria_story: {
    src: childCafeteriaStory,
    alt: {
      en: `${youssefEn} (6 yrs) sitting in the school cafeteria at lunch`,
      ar: `${youssefAr} (٦ سنوات) يجلس في كافيتريا المدرسة أثناء الغداء`,
    },
    fallbackGradient: 'from-[#195370] via-[#079D9A] to-[#35B9C8]',
  },
  child_choking_crisis: {
    src: childChokingCrisis,
    alt: {
      en: `${youssefEn} clutching his throat silently in the school cafeteria`,
      ar: `${youssefAr} يمسك برقبته بصمت في كافيتريا المدرسة`,
    },
    fallbackGradient: 'from-[#1D3B56] via-[#103B56] to-[#8C3939]',
  },
  child_choking_rescue: {
    src: childChokingRescue,
    alt: {
      en: `Rescuer kneeling to ${youssefEn}'s height to perform up to 5 back blows and up to 5 abdominal thrusts`,
      ar: `مسعف ينزل لمستوى طول ${youssefAr} لتنفيذ حتى ٥ ضربات ظهر وحتى ٥ ضغطات بطن`,
    },
    fallbackGradient: 'from-[#103B56] via-[#0E6D77] to-[#079D9A]',
  },
  child_recess_cough: {
    src: childCafeteriaStory,
    alt: {
      en: `${youssefEn} coughing loudly and effectively at school recess`,
      ar: `${youssefAr} يسعل بقوة وفعالية في فناء المدرسة`,
    },
    fallbackGradient: 'from-[#103B56] via-[#0E6D77] to-[#16A36A]',
  },
  child_hallway_cpr: {
    src: childAnatomyImg,
    alt: {
      en: `Unresponsive ${youssefEn} on a firm surface receiving CPR according to training`,
      ar: `${youssefAr} فاقد للوعي على سطح صلب يتلقى الإنعاش حسب التدريب`,
    },
    fallbackGradient: 'from-[#103B56] via-[#1C4D6D] to-[#43C7D1]',
  },
  infant_nursery_story: {
    src: infantNurseryStory,
    alt: {
      en: `8-month-old ${layanEn} sitting on a nursery playmat`,
      ar: `الرضيعة ${layanAr} (٨ شهور) تجلس على بساط اللعب`,
    },
    fallbackGradient: 'from-[#1E4F6B] via-[#103B56] to-[#079D9A]',
  },
  infant_back_blows: {
    src: infantBackBlows,
    alt: {
      en: `Caregiver supporting ${layanEn} face-down along forearm for up to 5 back blows`,
      ar: `المربّي يسند الرضيعة ${layanAr} على بطنها فوق ساعده لعمل حتى ٥ ضربات ظهر`,
    },
    fallbackGradient: 'from-[#103B56] via-[#0A6C76] to-[#079D9A]',
  },
  infant_chest_thrusts: {
    src: infantChestThrusts,
    alt: {
      en: `Caregiver supporting ${layanEn} face-up performing up to 5 two-finger chest thrusts`,
      ar: `المربّي يسند الرضيعة ${layanAr} على ظهرها لعمل حتى ٥ ضغطات صدر بإصبعين`,
    },
    fallbackGradient: 'from-[#103B56] via-[#0E6478] to-[#35B9C8]',
  },
  infant_highchair_cough: {
    src: infantNurseryStory,
    alt: {
      en: `${layanEn} in high chair crying loudly and coughing effectively`,
      ar: `الرضيعة ${layanAr} في الكرسي العالي تبكي بصوت مرتفع وتسعل بفعالية`,
    },
    fallbackGradient: 'from-[#103B56] via-[#0E6478] to-[#16A36A]',
  },
  infant_unresponsive_cpr: {
    src: infantChestThrusts,
    alt: {
      en: `Unresponsive ${layanEn} on a firm surface receiving infant CPR according to training`,
      ar: `الرضيعة ${layanAr} فاقدة للوعي على سطح ثابت تتلقى إنعاش الرضيع حسب التدريب`,
    },
    fallbackGradient: 'from-[#103B56] via-[#0E6478] to-[#DC5252]',
  },

  // =========================================================================
  // LEVEL A1: 10 AUTHENTIC MANIFEST FRAMES (A1_S1..S5, A1_OA1..OA3, A1_OB, A1_OC)
  // =========================================================================
  a1_s1_cafeteria_wide: {
    src: getManifestImageSrc('A1_S1'),
    manifestId: 'A1_S1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 1,
    alt: { en: `Lunchtime at the university cafeteria, calm between lectures`, ar: `وقت الغداء في كافتيريا الجامعة، والجو هادئ بين المحاضرات.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#13B8B0]',
  },
  a1_s2_eating_laughing: {
    src: getManifestImageSrc('A1_S2'),
    manifestId: 'A1_S2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 2,
    alt: { en: `${tariqEn} eating and laughing with his colleagues at the same table`, ar: `${tariqAr} بياكل ويضحك مع زملائه على نفس الطاولة.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#13B8B0]',
  },
  a1_s3_sudden_cough: {
    src: getManifestImageSrc('A1_S3'),
    manifestId: 'A1_S3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 3,
    alt: { en: `Suddenly ${tariqEn} starts coughing strongly while still able to breathe`, ar: `فجأة، ${tariqAr} بدأ يسعل بقوة وهو قادر ياخد نفسه.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#E9A23B]',
  },
  a1_s4_colleague_approaches: {
    src: getManifestImageSrc('A1_S4'),
    manifestId: 'A1_S4',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 4,
    alt: { en: `His colleague notices immediately and steps closer to check on him`, ar: `زميله انتبه فوراً وقام يقرب منه عشان يطمن.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#43C7D1]',
  },
  a1_s5_decision_moment: {
    src: getManifestImageSrc('A1_S5'),
    manifestId: 'A1_S5',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 5,
    alt: { en: `${tariqEn} coughs strongly and speaks: "I'm fine".. What will you do?`, ar: `${tariqAr} بيسعل بقوة وبيتكلم: "أنا كويس".. هتعمل إيه؟` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#13B8B0]',
  },
  a1_o1_ask_choking: {
    src: getManifestImageSrc('A1_OA1'),
    manifestId: 'A1_OA1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `Colleague asks "Are you choking?" and encourages him to keep coughing`, ar: `الزميل بيسأله: "هل أنت تختنق؟" ويشجّعه يكمل سعال.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#13B8B0]',
  },
  a1_o2_encourage_cough: {
    src: getManifestImageSrc('A1_OA2'),
    manifestId: 'A1_OA2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `Strong cough expels the foreign object without forceful intervention`, ar: `السعال القوي قدر يطرد الجسم الغريب من غير تدخل عنيف.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  a1_o3_food_cleared: {
    src: getManifestImageSrc('A1_OA3'),
    manifestId: 'A1_OA3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `${tariqEn} breathes normally again while his colleague stays beside him`, ar: `${tariqAr} رجع يتنفس طبيعي، والزميل لسه جنبه بيطمن عليه.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#16A36A]',
  },
  a1_o4_err_water: {
    src: getManifestImageSrc('A1_OB'),
    manifestId: 'A1_OB',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `Offering water during coughing interrupts the cough and can worsen choking`, ar: `تقديم الماء وقت السعال بيقطعه وممكن يزود الاختناق.` },
    fallbackGradient: 'from-[#071F2E] via-[#2A1B24] to-[#DC5252]',
  },
  a1_o5_err_thrusts: {
    src: getManifestImageSrc('A1_OC'),
    manifestId: 'A1_OC',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `Abdominal thrusts here are unnecessary while the cough is strong`, ar: `ضغطات البطن هنا تدخل مش لازم طالما السعال قوي.` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#E9A23B]',
  },

  // =========================================================================
  // LEVEL A2 (PRIMARY REFERENCE): 10 AUTHENTIC MANIFEST FRAMES (A2_S1..S5, A2_OA1..OA3, A2_OB, A2_OC)
  // =========================================================================
  a2_s1_lab_snack_wide: {
    src: getManifestImageSrc('A2_S1'),
    manifestId: 'A2_S1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 1,
    alt: { en: `In the university computer lab, students are focused on their work at the computers`, ar: `في معمل الجامعة، الطلاب مركزين في شغلهم على الأجهزة.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#13B8B0]',
  },
  a2_s2_stands_pushes_chair: {
    src: getManifestImageSrc('A2_S2'),
    manifestId: 'A2_S2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 2,
    alt: { en: `${tariqEn} eating a sandwich quickly in front of his computer`, ar: `${tariqAr} بياكل ساندوتش بسرعة قدام الجهاز.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#E9A23B]',
  },
  a2_s3_clutch_throat_silent: {
    src: getManifestImageSrc('A2_S3'),
    manifestId: 'A2_S3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 3,
    alt: { en: `Suddenly he stands and clutches his throat with both hands, no sound coming out`, ar: `فجأة وقف ومسك رقبته بإيديه، ومفيش أي صوت طالع!` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },
  a2_s4_cyanosis_colleague_rushes: {
    src: getManifestImageSrc('A2_S4'),
    manifestId: 'A2_S4',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 4,
    alt: { en: `No voice and no effective cough, and colleagues begin to notice the danger`, ar: `لا صوت ولا سعال فعّال، والزملاء بدأوا ينتبهوا للخطر.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  a2_s5_decision_moment: {
    src: getManifestImageSrc('A2_S5'),
    manifestId: 'A2_S5',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 5,
    alt: { en: `${tariqEn} cannot speak or cough, and his lips are turning pale/bluish.. What is your decision?`, ar: `${tariqAr} لا يتكلم ولا يسعل، وشفاهه بتشحب.. قرارك إيه؟` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },
  a2_o1_lean_forward_back_blows: {
    src: getManifestImageSrc('A2_OA1'),
    manifestId: 'A2_OA1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `Call emergency services, support his chest, and lean him forward before back blows`, ar: `اتصل بالإسعاف، سند صدره، وميّله للأمام قبل الضربات.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#13B8B0]',
  },
  a2_o2_abdominal_thrusts_in_up: {
    src: getManifestImageSrc('A2_OA2'),
    manifestId: 'A2_OA2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `Alternate between up to 5 back blows and up to 5 abdominal thrusts until the object comes out`, ar: `بدّل بين حتى ٥ ضربات ظهر وحتى ٥ ضغطات بطن لحد ما يخرج الجسم.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  a2_o3_object_expelled_breathing: {
    src: getManifestImageSrc('A2_OA3'),
    manifestId: 'A2_OA3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `The foreign object came out! Check breathing and continue monitoring and medical evaluation`, ar: `خرج الجسم الغريب! تأكد من التنفس واستمر في المراقبة والتقييم الطبي.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#16A36A]',
  },
  a2_o4_err_water: {
    src: getManifestImageSrc('A2_OB'),
    manifestId: 'A2_OB',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `Cannot swallow during severe choking; water blocks air further`, ar: `مفيش بلع والاختناق شديد؛ الماء هيمنع الهواء أكتر.` },
    fallbackGradient: 'from-[#071F2E] via-[#2A1B24] to-[#DC5252]',
  },
  a2_o5_err_blind_sweep: {
    src: getManifestImageSrc('A2_OC'),
    manifestId: 'A2_OC',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `Blind finger sweep can push the object deeper into the airway`, ar: `المسح الأعمى بالأصابع ممكن يدفع الجسم أعمق جوه مجرى الهواء.` },
    fallbackGradient: 'from-[#071F2E] via-[#2A1B24] to-[#DC5252]',
  },

  // =========================================================================
  // LEVEL A3: 10 AUTHENTIC MANIFEST FRAMES
  // =========================================================================
  a3_s1_severe_choking_persists: {
    src: getManifestImageSrc('A3_S1'),
    manifestId: 'A3_S1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 1,
    alt: { en: `Rescue attempts continue, but his condition worsens rapidly`, ar: `محاولات الإنقاذ لسه مستمرة، لكن الحالة بتسوء بسرعة.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#DC5252]',
  },
  a3_s2_loses_balance: {
    src: getManifestImageSrc('A3_S2'),
    manifestId: 'A3_S2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 2,
    alt: { en: `Suddenly ${tariqEn}'s body goes limp and begins falling to the floor`, ar: `فجأة ${tariqAr} جسمه ارتخى وبدأ يقع على الأرض!` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },
  a3_s3_supported_to_floor: {
    src: getManifestImageSrc('A3_S3'),
    manifestId: 'A3_S3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 3,
    alt: { en: `Colleague supports him quickly to protect him from a hard fall`, ar: `الزميل بيسنده بسرعة عشان يحميه من السقوط العنيف.` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },
  a3_s4_unresponsive_on_back: {
    src: getManifestImageSrc('A3_S4'),
    manifestId: 'A3_S4',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 4,
    alt: { en: `${tariqEn} does not respond and has no movement or normal breathing`, ar: `${tariqAr} مش بيرد ومفيش أي حركة أو نفس طبيعي.` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },
  a3_s5_decision_moment: {
    src: getManifestImageSrc('A3_S5'),
    manifestId: 'A3_S5',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 5,
    alt: { en: `No response and no normal breathing.. What is the right step now?`, ar: `لا استجابة ولا تنفس طبيعي.. إيه الخطوة الصح دلوقتي؟` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },
  a3_o1_lower_call_ems: {
    src: getManifestImageSrc('A3_OA1'),
    manifestId: 'A3_OA1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `Lower him safely onto a firm flat surface and ensure EMS is activated`, ar: `أنزله بأمان على سطح صلب مستوٍ وتأكد إن الإسعاف اتفعّل.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  a3_o2_start_cpr_training: {
    src: getManifestImageSrc('A3_OA2'),
    manifestId: 'A3_OA2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `Start CPR immediately according to your training and follow dispatcher instructions`, ar: `ابدأ الإنعاش فوراً حسب تدريبك واتبع تعليمات المرسل.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#13B8B0]',
  },
  a3_o3_remove_visible_only: {
    src: getManifestImageSrc('A3_OA3'),
    manifestId: 'A3_OA3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `Continue following AED and dispatcher instructions until EMS arrives`, ar: `استمر حسب تعليمات AED والمرسل لحد وصول الإسعاف.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#16A36A]',
  },
  a3_o4_err_blind_sweep: {
    src: getManifestImageSrc('A3_OC'),
    manifestId: 'A3_OC',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `Blind finger sweep is a critical mistake and can push the object deeper`, ar: `المسح الأعمى بالأصابع خطأ حرج وممكن يزق الجسم أعمق.` },
    fallbackGradient: 'from-[#071F2E] via-[#2A1B24] to-[#DC5252]',
  },
  a3_o5_err_upright_thrusts: {
    src: getManifestImageSrc('A3_OB'),
    manifestId: 'A3_OB',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `Sitting him on a chair and waiting wastes critical time and does not open the airway`, ar: `إقعاده على كرسي والانتظار بيضيع وقت حرج ومش بيفتح النفس.` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },

  // =========================================================================
  // LEVEL A4: 10 AUTHENTIC MANIFEST FRAMES
  // =========================================================================
  a4_s1_lab_pregnant_colleague: {
    src: getManifestImageSrc('A4_S1'),
    manifestId: 'A4_S1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 1,
    alt: { en: `In the lab, a colleague in late pregnancy stands with the team`, ar: `في المعمل، زميلة في آخر شهور الحمل واقفة مع الفريق.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#13B8B0]',
  },
  a4_s2_sudden_silent_choke: {
    src: getManifestImageSrc('A4_S2'),
    manifestId: 'A4_S2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 2,
    alt: { en: `She was eating while talking with her colleagues in the lab`, ar: `كانت بتاكل وهي بتتكلم مع زميلاتها في المعمل.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#E9A23B]',
  },
  a4_s3_clutch_throat_pregnant: {
    src: getManifestImageSrc('A4_S3'),
    manifestId: 'A4_S3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 3,
    alt: { en: `Suddenly she goes completely silent and clutches her throat without a sound`, ar: `فجأة سكتت تماماً ومسكت رقبتها من غير أي صوت!` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },
  a4_s4_rescuer_behind_chest_cue: {
    src: getManifestImageSrc('A4_S4'),
    manifestId: 'A4_S4',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 4,
    alt: { en: `Colleagues hesitate, unsure where to place their hands because of the pregnancy`, ar: `الزملاء اتلخبطوا ومش عارفين يحطوا إيديهم فين بسبب الحمل.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  a4_s5_decision_moment: {
    src: getManifestImageSrc('A4_S5'),
    manifestId: 'A4_S5',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    beatIndex: 5,
    alt: { en: `No speech, no effective cough, and late pregnancy.. How will you act?`, ar: `لا كلام ولا سعال فعّال، والبطن في آخر الحمل.. هتتصرف إزاي؟` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },
  a4_o1_back_blows_pregnant: {
    src: getManifestImageSrc('A4_OA1'),
    manifestId: 'A4_OA1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `Call EMS early and prepare to intervene safely from behind`, ar: `اتصل بالإسعاف بدري واستعد للتدخل من الخلف بأمان.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#13B8B0]',
  },
  a4_o2_chest_thrusts_sternum: {
    src: getManifestImageSrc('A4_OA2'),
    manifestId: 'A4_OA2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `Use chest thrusts instead of abdominal thrusts to protect mother and fetus`, ar: `استخدم ضغطات الصدر بدل ضغطات البطن لحماية الأم والجنين.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  a4_o3_airway_cleared_safe: {
    src: getManifestImageSrc('A4_OA3'),
    manifestId: 'A4_OA3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `Continue cycles until the foreign object comes out or she becomes unresponsive`, ar: `كمّل الدورات لحد ما يخرج الجسم الغريب أو تفقد الوعي.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#16A36A]',
  },
  a4_o4_err_abdominal_on_pregnant: {
    src: getManifestImageSrc('A4_OB'),
    manifestId: 'A4_OB',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `Abdominal thrusts are completely unsafe in late pregnancy`, ar: `ضغطات البطن غير آمنة تماماً في آخر شهور الحمل.` },
    fallbackGradient: 'from-[#071F2E] via-[#2A1B24] to-[#DC5252]',
  },
  a4_o5_err_water: {
    src: getManifestImageSrc('A4_OC'),
    manifestId: 'A4_OC',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'adult',
    alt: { en: `Giving water during severe choking is forbidden and increases danger`, ar: `إعطاء الماء وقت الاختناق الشديد ممنوع وبيزيد الخطر.` },
    fallbackGradient: 'from-[#071F2E] via-[#2A1B24] to-[#DC5252]',
  },

  // =========================================================================
  // LEVEL C1: 10 AUTHENTIC MANIFEST FRAMES
  // =========================================================================
  c1_s1_cafeteria_wide: {
    src: getManifestImageSrc('C1_S1'),
    manifestId: 'C1_S1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    beatIndex: 1,
    alt: { en: `Lunchtime at the school cafeteria under teacher supervision`, ar: `وقت الأكل في كافتيريا المدرسة تحت إشراف المعلمة.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#13B8B0]',
  },
  c1_s2_youssef_laughs_eats: {
    src: getManifestImageSrc('C1_S2'),
    manifestId: 'C1_S2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    beatIndex: 2,
    alt: { en: `${youssefEn} laughing and moving around with a whole grape in his mouth`, ar: `${youssefAr} بيضحك ويتحرك وفي بقه حبة عنب كاملة.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#E9A23B]',
  },
  c1_s3_clutch_neck_wide_eyes: {
    src: getManifestImageSrc('C1_S3'),
    manifestId: 'C1_S3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    beatIndex: 3,
    alt: { en: `Suddenly ${youssefEn} stops and clutches his neck with no sound coming out`, ar: `فجأة ${youssefAr} وقف ومسك رقبته ومفيش أي صوت طالع!` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },
  c1_s4_supervisor_approaches_kneel: {
    src: getManifestImageSrc('C1_S4'),
    manifestId: 'C1_S4',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    beatIndex: 4,
    alt: { en: `His lips start turning blue, and the teacher notices and runs to him`, ar: `شفاهه بدأت تزرق، والمعلمة انتبهت وجريت عليه.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  c1_s5_decision_moment: {
    src: getManifestImageSrc('C1_S5'),
    manifestId: 'C1_S5',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    beatIndex: 5,
    alt: { en: `${youssefEn} cannot speak or cough and his lips are blue.. What will you do?`, ar: `${youssefAr} لا يتكلم ولا يسعل وشفاهه زرقاء.. هتعمل إيه؟` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },
  c1_o1_kneel_back_blows: {
    src: getManifestImageSrc('C1_OA1'),
    manifestId: 'C1_OA1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    alt: { en: `Call for help early, contact EMS, and kneel to the child's height`, ar: `نادِ للنجدة بدري، اتصل بالإسعاف، واركع بمستوى طول الطفل.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#13B8B0]',
  },
  c1_o2_child_abdominal_thrusts: {
    src: getManifestImageSrc('C1_OA2'),
    manifestId: 'C1_OA2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    alt: { en: `Alternate between up to 5 back blows and up to 5 abdominal thrusts at the child's level`, ar: `بدّل بين حتى ٥ ضربات ظهر وحتى ٥ ضغطات بطن بمستوى الطفل.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  c1_o3_airway_cleared: {
    src: getManifestImageSrc('C1_OA3'),
    manifestId: 'C1_OA3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    alt: { en: `The foreign object came out! ${youssefEn} breathes normally as the teacher checks on him`, ar: `خرج الجسم الغريب! ${youssefAr} بيتنفس عادي والمعلمة بتطمن عليه.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#16A36A]',
  },
  c1_o4_err_water: {
    src: getManifestImageSrc('C1_OB'),
    manifestId: 'C1_OB',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    alt: { en: `Drinking water or trying to swallow during severe choking increases danger`, ar: `شرب الماء أو البلع وقت الاختناق الشديد بيزود الخطر.` },
    fallbackGradient: 'from-[#071F2E] via-[#2A1B24] to-[#DC5252]',
  },
  c1_o5_err_random_neck_blows: {
    src: getManifestImageSrc('C1_OC'),
    manifestId: 'C1_OC',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    alt: { en: `Random blows on the neck are a critical error and harm the child`, ar: `الضرب العشوائي على الرقبة خطأ حرج وبيؤذي الطفل.` },
    fallbackGradient: 'from-[#071F2E] via-[#2A1B24] to-[#DC5252]',
  },

  // =========================================================================
  // LEVEL C2: 10 AUTHENTIC MANIFEST FRAMES
  // =========================================================================
  c2_s1_obstruction_persists: {
    src: getManifestImageSrc('C2_S1'),
    manifestId: 'C2_S1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    beatIndex: 1,
    alt: { en: `Rescue attempts are ongoing, but the blockage has not cleared yet`, ar: `محاولات الإنقاذ شغالة، لكن الانسداد لسه ما اتفتحش.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#DC5252]',
  },
  c2_s2_youssef_collapses_in_arms: {
    src: getManifestImageSrc('C2_S2'),
    manifestId: 'C2_S2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    beatIndex: 2,
    alt: { en: `${youssefEn}'s body suddenly goes limp and he loses consciousness`, ar: `${youssefAr} جسمه ارتخى فجأة وفقد وعيه!` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },
  c2_s3_lower_to_firm_surface: {
    src: getManifestImageSrc('C2_S3'),
    manifestId: 'C2_S3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    beatIndex: 3,
    alt: { en: `The teacher supports him quickly and carefully so he does not hit his head`, ar: `المعلمة بتسنده بسرعة وبحرص عشان ما يتخبطش.` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },
  c2_s4_call_ems_confirmed: {
    src: getManifestImageSrc('C2_S4'),
    manifestId: 'C2_S4',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    beatIndex: 4,
    alt: { en: `${youssefEn} is unresponsive, motionless, and not breathing normally`, ar: `${youssefAr} لا يستجيب ولا يتحرك ومفيش نفس طبيعي.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  c2_s5_decision_moment: {
    src: getManifestImageSrc('C2_S5'),
    manifestId: 'C2_S5',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    beatIndex: 5,
    alt: { en: `The child is unresponsive and not breathing normally.. What is the next step?`, ar: `الطفل فاقد الوعي ولا يتنفس طبيعياً.. الخطوة الجاية إيه؟` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },
  c2_o1_firm_surface_ems: {
    src: getManifestImageSrc('C2_OA1'),
    manifestId: 'C2_OA1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    alt: { en: `Lower him onto a firm flat surface and confirm EMS is on the way`, ar: `أنزله على سطح صلب مستوٍ وتأكد إن الإسعاف في الطريق.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#13B8B0]',
  },
  c2_o2_start_child_cpr: {
    src: getManifestImageSrc('C2_OA2'),
    manifestId: 'C2_OA2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    alt: { en: `Start pediatric CPR immediately according to training and follow dispatcher instructions`, ar: `ابدأ إنعاش الأطفال فوراً حسب التدريب واتبع تعليمات المرسل.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  c2_o3_visible_removed_ems_arrives: {
    src: getManifestImageSrc('C2_OA3'),
    manifestId: 'C2_OA3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    alt: { en: `Continue following AED and dispatcher guidance until emergency services arrive`, ar: `استمر حسب توجيهات AED والمرسل لحد وصول الطوارئ.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#16A36A]',
  },
  c2_o4_err_blind_sweep: {
    src: getManifestImageSrc('C2_OC'),
    manifestId: 'C2_OC',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    alt: { en: `Blind finger sweep is forbidden and can push the object deeper`, ar: `المسح الأعمى ممنوع وممكن يدفع الجسم أعمق.` },
    fallbackGradient: 'from-[#071F2E] via-[#2A1B24] to-[#DC5252]',
  },
  c2_o5_err_standing_back_blows: {
    src: getManifestImageSrc('C2_OB'),
    manifestId: 'C2_OB',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    alt: { en: `Sitting him up and waiting is a dangerous delay when unresponsive`, ar: `إقعاده والانتظار تأخير خطير في حالة فقدان الوعي.` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },

  // =========================================================================
  // LEVEL C3: 10 AUTHENTIC MANIFEST FRAMES
  // =========================================================================
  c3_s1_schoolyard_recess: {
    src: getManifestImageSrc('C3_S1'),
    manifestId: 'C3_S1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    beatIndex: 1,
    alt: { en: `Recess time in the schoolyard as students play`, ar: `وقت الفسحة في حوش المدرسة والطلاب بيلعبوا.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#13B8B0]',
  },
  c3_s2_eating_snack_talking: {
    src: getManifestImageSrc('C3_S2'),
    manifestId: 'C3_S2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    beatIndex: 2,
    alt: { en: `${youssefEn} eating while running and playing with his friends`, ar: `${youssefAr} بياكل وهو بيجري ويلعب مع أصحابه.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#13B8B0]',
  },
  c3_s3_strong_audible_cough: {
    src: getManifestImageSrc('C3_S3'),
    manifestId: 'C3_S3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    beatIndex: 3,
    alt: { en: `Suddenly he stops and starts coughing strongly while still breathing`, ar: `فجأة وقف وبدأ يسعل بقوة، ونفسه لسه طالع.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#E9A23B]',
  },
  c3_s4_can_speak_and_cry: {
    src: getManifestImageSrc('C3_S4'),
    manifestId: 'C3_S4',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    beatIndex: 4,
    alt: { en: `The teacher approaches quickly to assess the situation`, ar: `المعلمة قربت منه بسرعة عشان تقيم الموقف.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  c3_s5_decision_moment: {
    src: getManifestImageSrc('C3_S5'),
    manifestId: 'C3_S5',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    beatIndex: 5,
    alt: { en: `His cough is strong, he can speak, and his color is normal.. How will you act?`, ar: `سعاله قوي وبيتكلم ولونه طبيعي.. هتتصرف إزاي؟` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#13B8B0]',
  },
  c3_o1_encourage_child_cough: {
    src: getManifestImageSrc('C3_OA1'),
    manifestId: 'C3_OA1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    alt: { en: `Encourage him calmly to keep coughing without hitting or alarming him`, ar: `شجّعه يكمل سعال بهدوء من غير ما تخبطه أو توتره.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#13B8B0]',
  },
  c3_o2_watch_closely: {
    src: getManifestImageSrc('C3_OA2'),
    manifestId: 'C3_OA2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    alt: { en: `The strong cough safely expels the piece without forceful intervention`, ar: `السعال القوي طرد القطعة بأمان من غير تدخل عنيف.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  c3_o3_snack_cleared_relief: {
    src: getManifestImageSrc('C3_OA3'),
    manifestId: 'C3_OA3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    alt: { en: `${youssefEn} breathes normally again as the reassured teacher monitors him`, ar: `${youssefAr} رجع يتنفس طبيعي والمعلمة مطمنة وبتراقبه.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#16A36A]',
  },
  c3_o4_err_forceful_thrusts: {
    src: getManifestImageSrc('C3_OB'),
    manifestId: 'C3_OB',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    alt: { en: `Abdominal thrusts are not needed as long as the cough is strong and effective`, ar: `ضغطات البطن مش مطلوبة طالما السعال قوي وفعّال.` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#E9A23B]',
  },
  c3_o5_err_water: {
    src: getManifestImageSrc('C3_OC'),
    manifestId: 'C3_OC',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'child',
    alt: { en: `Water interrupts the natural cough and is inappropriate right now`, ar: `الماء بيقطع السعال الطبيعي ومش مناسب دلوقتي.` },
    fallbackGradient: 'from-[#071F2E] via-[#2A1B24] to-[#DC5252]',
  },

  // =========================================================================
  // LEVEL I1: 10 AUTHENTIC MANIFEST FRAMES
  // =========================================================================
  i1_s1_nursery_wide: {
    src: getManifestImageSrc('I1_S1'),
    manifestId: 'I1_S1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    beatIndex: 1,
    alt: { en: `In the quiet nursery room, ${layanEn} sits playing on the rug`, ar: `في غرفة الحضانة الهادية، ${layanAr} قاعدة بتلعب على السجادة.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#13B8B0]',
  },
  i1_s2_layan_mouths_object: {
    src: getManifestImageSrc('I1_S2'),
    manifestId: 'I1_S2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    beatIndex: 2,
    alt: { en: `${layanEn} puts a small object into her mouth while playing`, ar: `${layanAr} حطت جسم صغير في بقها وهي بتلعب.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#E9A23B]',
  },
  i1_s3_silent_weak_cough_color: {
    src: getManifestImageSrc('I1_S3'),
    manifestId: 'I1_S3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    beatIndex: 3,
    alt: { en: `Suddenly she goes completely silent, eyes wide with no crying or sound`, ar: `فجأة سكتت خالص، عينيها وسعت ومفيش لا بكاء ولا صوت!` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },
  i1_s4_caregiver_lifts_layan: {
    src: getManifestImageSrc('I1_S4'),
    manifestId: 'I1_S4',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    beatIndex: 4,
    alt: { en: `Her mother panics and picks ${layanEn} up quickly to check on her`, ar: `الأم اتفزعت وشالت ${layanAr} بسرعة عشان تطمن عليها.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  i1_s5_decision_moment: {
    src: getManifestImageSrc('I1_S5'),
    manifestId: 'I1_S5',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    beatIndex: 5,
    alt: { en: `The infant is neither crying nor breathing.. How will you act immediately?`, ar: `الرضيعة مش بتبكي ومش بتتنفس.. هتتصرف إزاي فوراً؟` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },
  i1_o1_forearm_back_blows: {
    src: getManifestImageSrc('I1_OA1'),
    manifestId: 'I1_OA1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    alt: { en: `Call for help and position the infant along your forearm supporting the head`, ar: `نادِ للنجدة وابدأ بوضع الرضيعة على الساعد بدعم الرأس.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#13B8B0]',
  },
  i1_o2_turn_chest_thrusts: {
    src: getManifestImageSrc('I1_OA2'),
    manifestId: 'I1_OA2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    alt: { en: `Alternate between 5 back blows and 5 chest thrusts (abdominal thrusts strictly forbidden)`, ar: `بدّل بين ٥ ضربات ظهر و٥ ضغطات صدر (ممنوع البطن تماماً).` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  i1_o3_object_cleared_layan_cries: {
    src: getManifestImageSrc('I1_OA3'),
    manifestId: 'I1_OA3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    alt: { en: `The object came out and ${layanEn} starts breathing and crying. Hands-on training is essential`, ar: `خرج الجسم و${layanAr} بدأت تتنفس وتبكي. التدريب العملي ضروري.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#16A36A]',
  },
  i1_o4_err_infant_abdominal_thrusts: {
    src: getManifestImageSrc('I1_OB'),
    manifestId: 'I1_OB',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    alt: { en: `Abdominal thrusts are strictly forbidden for infants and cause serious injury`, ar: `ضغطات البطن ممنوعة نهائياً للرضّع وبتسبب إصابات خطيرة.` },
    fallbackGradient: 'from-[#071F2E] via-[#2A1B24] to-[#DC5252]',
  },
  i1_o5_err_blind_sweep: {
    src: getManifestImageSrc('I1_OC'),
    manifestId: 'I1_OC',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    alt: { en: `Blind finger sweep pushes the object deeper into the airway`, ar: `المسح الأعمى بالأصابع بيزق الجسم أعمق جوه مجرى الهواء.` },
    fallbackGradient: 'from-[#071F2E] via-[#2A1B24] to-[#DC5252]',
  },

  // =========================================================================
  // LEVEL I2: 10 AUTHENTIC MANIFEST FRAMES
  // =========================================================================
  i2_s1_layan_loses_response: {
    src: getManifestImageSrc('I2_S1'),
    manifestId: 'I2_S1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    beatIndex: 1,
    alt: { en: `Rescue attempts continue, but the blockage has not cleared`, ar: `المحاولات لسه مستمرة، لكن الانسداد ما اتفتحش.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#DC5252]',
  },
  i2_s2_limp_in_caregiver_arms: {
    src: getManifestImageSrc('I2_S2'),
    manifestId: 'I2_S2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    beatIndex: 2,
    alt: { en: `Suddenly ${layanEn}'s body goes completely limp and she loses consciousness`, ar: `فجأة ${layanAr} جسمها اتراخى خالص وفقدت الوعي!` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },
  i2_s3_place_on_firm_surface: {
    src: getManifestImageSrc('I2_S3'),
    manifestId: 'I2_S3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    beatIndex: 3,
    alt: { en: `Her mother holds her carefully and sees no movement`, ar: `الأم حاضناها بحرص ومش شايفة أي حركة.` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },
  i2_s4_confirm_ems_call: {
    src: getManifestImageSrc('I2_S4'),
    manifestId: 'I2_S4',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    beatIndex: 4,
    alt: { en: `No response and no normal breathing in the infant`, ar: `لا استجابة ولا نفس طبيعي عند الرضيعة.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  i2_s5_decision_moment: {
    src: getManifestImageSrc('I2_S5'),
    manifestId: 'I2_S5',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    beatIndex: 5,
    alt: { en: `${layanEn} is unresponsive in your arms.. What will you do now?`, ar: `${layanAr} فاقدة الوعي بين إيديك.. هتعمل إيه دلوقتي؟` },
    fallbackGradient: 'from-[#071F2E] via-[#123B50] to-[#DC5252]',
  },
  i2_o1_firm_surface_ems: {
    src: getManifestImageSrc('I2_OA1'),
    manifestId: 'I2_OA1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    alt: { en: `Ensure EMS is activated and place ${layanEn} on a firm flat surface`, ar: `اتأكد إن الإسعاف اتفعل وحط ${layanAr} على سطح صلب مستوٍ.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#13B8B0]',
  },
  i2_o2_start_infant_cpr: {
    src: getManifestImageSrc('I2_OA2'),
    manifestId: 'I2_OA2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    alt: { en: `Start pediatric/infant CPR according to training and follow dispatcher instructions`, ar: `ابدأ إنعاش الأطفال حسب التدريب واتبع تعليمات المرسل.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  i2_o3_visible_removed_ems_arrives: {
    src: getManifestImageSrc('I2_OA3'),
    manifestId: 'I2_OA3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    alt: { en: `Continue according to your training and dispatcher guidance until EMS arrives`, ar: `استمر حسب تدريبك وتوجيهات المرسل لحد وصول الطوارئ.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#16A36A]',
  },
  i2_o4_err_blind_sweep: {
    src: getManifestImageSrc('I2_OC'),
    manifestId: 'I2_OC',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    alt: { en: `Blind finger sweep pushes the object deeper and harms the infant`, ar: `المسح الأعمى بيزق الجسم أعمق وبيضر الرضيعة.` },
    fallbackGradient: 'from-[#071F2E] via-[#2A1B24] to-[#DC5252]',
  },
  i2_o5_err_wait_to_wake: {
    src: getManifestImageSrc('I2_OB'),
    manifestId: 'I2_OB',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    alt: { en: `Abdominal thrusts are forbidden for infants and are not the action for unresponsiveness`, ar: `ضغطات البطن ممنوعة للرضّع ومش هي التصرف لفاقد الوعي.` },
    fallbackGradient: 'from-[#071F2E] via-[#2A1B24] to-[#DC5252]',
  },

  // =========================================================================
  // LEVEL I3: 10 AUTHENTIC MANIFEST FRAMES
  // =========================================================================
  i3_s1_high_chair_wide: {
    src: getManifestImageSrc('I3_S1'),
    manifestId: 'I3_S1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    beatIndex: 1,
    alt: { en: `Lunchtime, ${layanEn} sits in the high chair eating`, ar: `وقت الغداء، ${layanAr} قاعدة في الكرسي العالي بتاكل.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#13B8B0]',
  },
  i3_s2_layan_eating_soft_food: {
    src: getManifestImageSrc('I3_S2'),
    manifestId: 'I3_S2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    beatIndex: 2,
    alt: { en: `Suddenly ${layanEn} starts coughing strongly and crying out loud`, ar: `فجأة ${layanAr} بدأت تسعل بقوة وتعيط بصوت عالي.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#13B8B0]',
  },
  i3_s3_strong_audible_cough: {
    src: getManifestImageSrc('I3_S3'),
    manifestId: 'I3_S3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    beatIndex: 3,
    alt: { en: `Her mother stands beside her watching her breathing and coughing closely`, ar: `الأم واقفة جنبها تراقب تنفسها وسعالها بتركيز.` },
    fallbackGradient: 'from-[#123B50] via-[#19465B] to-[#E9A23B]',
  },
  i3_s4_loud_cry_normal_color: {
    src: getManifestImageSrc('I3_S4'),
    manifestId: 'I3_S4',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    beatIndex: 4,
    alt: { en: `No forceful intervention because the cough is strong and expelling the piece`, ar: `مفيش تدخل عنيف لأن السعال قوي وبيطرد اللقمة.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  i3_s5_decision_moment: {
    src: getManifestImageSrc('I3_S5'),
    manifestId: 'I3_S5',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    beatIndex: 5,
    alt: { en: `Strong cough and audible crying.. What is the right decision?`, ar: `سعال قوي وبكاء بصوت مسموع.. القرار الصح إيه؟` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#13B8B0]',
  },
  i3_o1_watch_closely_high_chair: {
    src: getManifestImageSrc('I3_OA1'),
    manifestId: 'I3_OA1',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    alt: { en: `Stay close and monitor closely, ready to act if the cough weakens`, ar: `خليك قريب وراقب عن قرب، واستعد لو السعال ضعف.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#13B8B0]',
  },
  i3_o2_strong_cough_clears: {
    src: getManifestImageSrc('I3_OA2'),
    manifestId: 'I3_OA2',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    alt: { en: `The effective cough expels the morsel on its own in complete safety`, ar: `السعال الفعّال طرد اللقمة لوحده بأمان تام.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  i3_o3_layan_calms_breathes: {
    src: getManifestImageSrc('I3_OA3'),
    manifestId: 'I3_OA3',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    alt: { en: `${layanEn} calms down and breathes normally while her mother continues watching her`, ar: `${layanAr} هديت وبتتنفس طبيعي والأم لسه متابعاها.` },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#16A36A]',
  },
  i3_o4_err_infant_abdominal_thrusts: {
    src: getManifestImageSrc('I3_OB'),
    manifestId: 'I3_OB',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    alt: { en: `Forceful blows are unnecessary here and can disrupt effective coughing`, ar: `الضربات القوية مش لازمة هنا وممكن تربك السعال الفعّال.` },
    fallbackGradient: 'from-[#071F2E] via-[#2A1B24] to-[#DC5252]',
  },
  i3_o5_err_blind_sweep: {
    src: getManifestImageSrc('I3_OC'),
    manifestId: 'I3_OC',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'infant',
    alt: { en: `Offering water during coughing interrupts it and is unsafe right now`, ar: `تقديم الماء أثناء السعال بيقطعه ومش آمن دلوقتي.` },
    fallbackGradient: 'from-[#071F2E] via-[#2A1B24] to-[#DC5252]',
  },

  // =========================================================================
  // LEARN CARDS MEDIA KEYS (SLIDE 23 WHEELCHAIR & SLIDE 24 CHOKING ALONE)
  // =========================================================================
  s2_kneel_behind_wheelchair: {
    src: getManifestImageSrc('LH_Wheelchair'),
    manifestId: 'LH_Wheelchair',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'special',
    alt: {
      en: `Abdominal thrusts if possible; kneel behind wheelchair and remove armrests; if difficult perform chest thrusts; prioritize safety and EMS activation`,
      ar: `(${wheelAr}): دفعات بطن لو ممكن؛ اركع خلف الكرسي وشيل مساند الإيدين؛ لو صعب نفّذ ضغطات صدر؛ الأولوية للأمان وتفعيل الإسعاف.`,
    },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
  s3_self_thrust_decision: {
    src: getManifestImageSrc('LH_ChokingAlone'),
    manifestId: 'LH_ChokingAlone',
    cameraCrop: 'scale-100 object-center',
    sceneTheme: 'special',
    alt: {
      en: `Call EMS immediately on speaker; perform self-abdominal thrusts with your fist or lean over a firm chair back avoiding sharp edges`,
      ar: `(الاختناق وحدك): اتصل بالإسعاف فوراً (سبيكر)؛ نفّذ دفعات بطن على نفسك بقبضتك أو انحنِ على ظهر كرسي صلب وتجنب الحواف الحادة.`,
    },
    fallbackGradient: 'from-[#0B2D40] via-[#123B50] to-[#43C7D1]',
  },
};

// Register direct aliases used in adultCoreLevels.ts so every mediaKey resolves 1:1
const LEVEL_KEY_ALIASES: Record<string, string> = {
  // A2 aliases
  a2_s1_lab_wide: 'a2_s1_lab_snack_wide',
  a2_s2_sandwich_at_pc: 'a2_s2_stands_pushes_chair',
  a2_s3_stand_clutch_neck: 'a2_s3_clutch_throat_silent',
  a2_s4_silent_panic_blue_lips: 'a2_s4_cyanosis_colleague_rushes',
  a2_o1_call_ems_lean_forward: 'a2_o1_lean_forward_back_blows',
  a2_o2_up_to_5_back_blows: 'a2_o2_abdominal_thrusts_in_up',
  a2_o3_up_to_5_abdominal_expel: 'a2_o3_object_expelled_breathing',
  // A3 aliases
  a3_s1_rescue_ongoing: 'a3_s1_severe_choking_persists',
  a3_s2_tariq_collapses: 'a3_s2_loses_balance',
  a3_s3_colleague_supports_fall: 'a3_s3_supported_to_floor',
  a3_s4_unresponsive_floor: 'a3_s4_unresponsive_on_back',
  a3_o1_lower_firm_floor: 'a3_o1_lower_call_ems',
  a3_o2_activate_ems_aed: 'a3_o2_start_cpr_training',
  a3_o3_cpr_by_training: 'a3_o3_remove_visible_only',
  a3_o4_err_sit_chair_wait: 'a3_o5_err_upright_thrusts',
  a3_o5_err_blind_sweep: 'a3_o4_err_blind_sweep',
  // A4 aliases
  a4_s2_talking_while_eating: 'a4_s2_sudden_silent_choke',
  a4_s3_clutch_neck_silent: 'a4_s3_clutch_throat_pregnant',
  a4_s4_colleagues_hesitate_abdomen: 'a4_s4_rescuer_behind_chest_cue',
  a4_o1_call_ems_early: 'a4_o1_back_blows_pregnant',
  a4_o2_chest_thrusts_position: 'a4_o2_chest_thrusts_sternum',
  a4_o3_chest_thrusts_clear: 'a4_o3_airway_cleared_safe',
  a4_o4_err_abdominal_pregnancy: 'a4_o4_err_abdominal_on_pregnant',
};

for (const [aliasKey, targetKey] of Object.entries(LEVEL_KEY_ALIASES)) {
  if (STORY_MEDIA[targetKey]) {
    STORY_MEDIA[aliasKey] = STORY_MEDIA[targetKey];
  }
}

export function resolveStoryMedia(mediaKey?: string): StoryMediaAsset {
  if (!mediaKey) return STORY_MEDIA.hero_nafas_awareness;
  if (STORY_MEDIA[mediaKey]) return STORY_MEDIA[mediaKey];
  return STORY_MEDIA.hero_nafas_awareness;
}

