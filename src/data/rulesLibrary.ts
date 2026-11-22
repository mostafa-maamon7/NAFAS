import { BilingualText } from '../types/nafas';

export type RuleTag =
  | 'mild'
  | 'severe'
  | 'unresponsive'
  | 'infant'
  | 'child'
  | 'adult'
  | 'pregnancy'
  | 'wheelchair'
  | 'alone'
  | 'resolved';

export type RuleId =
  | 'R-EMS'
  | 'R-ASK'
  | 'R-SWEEP'
  | 'R-WATER'
  | 'R-NOSLAP'
  | 'R-AFTER'
  | 'R-INFANT'
  | 'R-PREG'
  | 'R-WHEEL'
  | 'R-ALONE';

export interface NafasClinicalRule {
  id: RuleId;
  tags: RuleTag[];
  title: BilingualText;
  guideline: BilingualText;
  slideRef: string;
  sourceOrg: 'Resuscitation Council UK 2025' | 'American Red Cross';
}

/**
 * Shared Clinical Rules Library (Section 5 of Master Plan)
 * Sourced exclusively from Dr. Mai Mahran's "Choking" Lecture
 * (Resuscitation Council UK 2025 & American Red Cross).
 */
export const RULES_LIBRARY: Record<RuleId, NafasClinicalRule> = {
  'R-EMS': {
    id: 'R-EMS',
    tags: ['severe', 'unresponsive', 'alone'],
    title: {
      en: 'Activate Emergency Services Early',
      ar: 'تفعيل الإسعاف مبكراً',
    },
    guideline: {
      en: 'Stay calm. Tell someone to call emergency medical services. Use speakerphone if you are alone and need to call.',
      ar: 'اهدأ، اطلب من شخص الاتصال بالإسعاف، واستخدم مكبر الصوت (السبيكر) إذا كنت لوحدك.',
    },
    slideRef: 'Slide 8, 16, 18',
    sourceOrg: 'Resuscitation Council UK 2025',
  },
  'R-ASK': {
    id: 'R-ASK',
    tags: ['mild'],
    title: {
      en: 'Ask & Encourage Effective Cough',
      ar: 'اسأل وشجّع السعال الفعّال',
    },
    guideline: {
      en: 'Ask clearly: "Are you choking?" If they can speak or cough forcefully, encourage coughing and stay with them to watch for deterioration.',
      ar: 'اسأل بوضوح: «هل تختنق؟» لو يقدر يتكلم أو يسعل بقوة، شجّعه على السعال وابقَ بجانبه وراقبه.',
    },
    slideRef: 'Slide 5, 7, 26–27',
    sourceOrg: 'Resuscitation Council UK 2025',
  },
  'R-SWEEP': {
    id: 'R-SWEEP',
    tags: ['severe', 'unresponsive'],
    title: {
      en: 'No Blind Finger Sweeps',
      ar: 'ممنوع المسح العشوائي بالأصابع',
    },
    guideline: {
      en: 'NEVER blindly put your fingers into the mouth. Only remove an object if it is clearly visible and can be safely removed. Blind sweeps push the object deeper.',
      ar: 'لا تدخل أصابعك في الفم بشكل أعمى أبداً. أزل الجسم فقط إذا كان مرئياً بوضوح؛ المسح الأعمى يدفع الجسم أعمق.',
    },
    slideRef: 'Slide 16, 17, 25',
    sourceOrg: 'Resuscitation Council UK 2025',
  },
  'R-WATER': {
    id: 'R-WATER',
    tags: ['severe'],
    title: {
      en: 'No Water or Swallowing',
      ar: 'لا ماء ولا طلب البلع',
    },
    guideline: {
      en: 'Do not give water to a person with severe choking and do not ask them to swallow food.',
      ar: 'لا تعطِ ماءً لمصاب باختناق شديد، ولا تطلب منه ابتلاع الطعام.',
    },
    slideRef: 'Slide 25, 28',
    sourceOrg: 'American Red Cross',
  },
  'R-NOSLAP': {
    id: 'R-NOSLAP',
    tags: ['severe'],
    title: {
      en: 'Proper Back Blows Only',
      ar: 'ضربات ظهر صحيحة فقط',
    },
    guideline: {
      en: 'Do not give random blows to the neck, do not use weak tapping, and do not keep the person upright when giving back blows—lean them well forward.',
      ar: 'لا تضرب عشوائياً على الرقبة، ولا تبقِ المصاب منتصباً أثناء ضربات الظهر—بل أمِله جيداً للأمام.',
    },
    slideRef: 'Slide 10, 11, 25',
    sourceOrg: 'Resuscitation Council UK 2025',
  },
  'R-AFTER': {
    id: 'R-AFTER',
    tags: ['resolved'],
    title: {
      en: 'Post-Rescue Medical Assessment',
      ar: 'التقييم الطبي بعد خروج الجسم',
    },
    guideline: {
      en: 'Check that the person can breathe normally and keep observing them. Anyone treated with abdominal thrusts or chest compressions must be medically assessed.',
      ar: 'تأكد من عودة التنفس الطبيعي واستمر في المراقبة؛ أي شخص خضع لضغطات البطن أو الصدر يجب أن يخضع لتقييم طبي.',
    },
    slideRef: 'Slide 14',
    sourceOrg: 'Resuscitation Council UK 2025',
  },
  'R-INFANT': {
    id: 'R-INFANT',
    tags: ['infant'],
    title: {
      en: 'Infant Protocol: Chest Thrusts Instead of Abdominal',
      ar: 'قاعدة الرضّع: ضغطات صدر وممنوع البطن',
    },
    guideline: {
      en: 'Infants are managed differently: alternate up to 5 back blows and up to 5 chest thrusts. Do NOT use abdominal thrusts in an infant.',
      ar: 'الرضّع يُسعفون بالتبادل: حتى ٥ ضربات ظهر وحتى ٥ ضغطات صدر. ممنوع تماماً استخدام ضغطات البطن للرضيع.',
    },
    slideRef: 'Slide 20, 21, 32',
    sourceOrg: 'Resuscitation Council UK 2025',
  },
  'R-PREG': {
    id: 'R-PREG',
    tags: ['pregnancy'],
    title: {
      en: 'Late Pregnancy / Large Person Protocol',
      ar: 'قاعدة الحمل المتقدم / الشخص الكبير جداً',
    },
    guideline: {
      en: 'If abdominal thrusts cannot be performed safely—such as in late pregnancy or when the person is very large—use chest thrusts instead and call EMS early.',
      ar: 'إذا تعذر تنفيذ ضغطات البطن بأمان—مثل أواخر الحمل أو الشخص الكبير جداً—استخدم ضغطات الصدر بدلاً منها واتصل بالإسعاف مبكراً.',
    },
    slideRef: 'Slide 22',
    sourceOrg: 'Resuscitation Council UK 2025',
  },
  'R-WHEEL': {
    id: 'R-WHEEL',
    tags: ['wheelchair'],
    title: {
      en: 'Wheelchair Choking Protocol',
      ar: 'قاعدة إسعاف الكرسي المتحرك',
    },
    guideline: {
      en: 'Give abdominal thrusts when possible; kneel behind the wheelchair if needed and remove armrests if they prevent access. If abdominal thrusts are difficult, use chest thrusts.',
      ar: 'طبّق ضغطات البطن إن أمكن؛ اركع خلف الكرسي المتحرك وأزل مساند اليدين لو تمنع الوصول. وإن صعبت ضغطات البطن استخدم ضغطات الصدر.',
    },
    slideRef: 'Slide 23',
    sourceOrg: 'American Red Cross',
  },
  'R-ALONE': {
    id: 'R-ALONE',
    tags: ['alone'],
    title: {
      en: 'Self-Rescue When Choking Alone',
      ar: 'قاعدة الاختناق وأنت وحدك',
    },
    guideline: {
      en: 'Call EMS using a mobile phone if possible. Attempt abdominal thrusts on yourself or bend over a firm object like the back of a chair—avoiding sharp edges or unstable objects.',
      ar: 'اتصل بالإسعاف بالهاتف إن أمكن، ونفّذ ضغطات بطنية على نفسك أو انحنِ على جسم صلب كظهر كرسي ثابت مع تجنب الحواف الحادة.',
    },
    slideRef: 'Slide 24',
    sourceOrg: 'American Red Cross',
  },
};

export function getRulesByIds(ruleIds: RuleId[]): NafasClinicalRule[] {
  return ruleIds.map((id) => RULES_LIBRARY[id]).filter(Boolean);
}

export function getRulesMatchingTags(levelTags: RuleTag[]): NafasClinicalRule[] {
  return Object.values(RULES_LIBRARY).filter((rule) =>
    rule.tags.some((t) => levelTags.includes(t))
  );
}

export function getGuidanceForLevel(levelTagsOrIds: string[] = []): NafasClinicalRule[] {
  if (!levelTagsOrIds || levelTagsOrIds.length === 0) {
    return [RULES_LIBRARY['R-AFTER']];
  }
  const byId = levelTagsOrIds
    .map((key) => RULES_LIBRARY[key as RuleId])
    .filter(Boolean);
  if (byId.length > 0) {
    return byId;
  }
  const byTag = Object.values(RULES_LIBRARY).filter((rule) =>
    rule.tags.some((t) => levelTagsOrIds.includes(t))
  );
  return byTag.length > 0 ? byTag : [RULES_LIBRARY['R-AFTER']];
}

export function auditDuplicateLevelGuidance(
  payload: Array<{
    levelId: string;
    afterCareEn: string;
    ruleIds: string[];
  }>
): {
  passed: boolean;
  duplicateWarnings: string[];
} {
  const seenAfterCare = new Map<string, string>();
  const duplicateWarnings: string[] = [];

  payload.forEach((item) => {
    const normalized = item.afterCareEn.trim().toLowerCase();
    if (seenAfterCare.has(normalized)) {
      duplicateWarnings.push(
        `Level ${item.levelId} shares identical afterCareNote with ${seenAfterCare.get(normalized)}`
      );
    } else {
      seenAfterCare.set(normalized, item.levelId);
    }
  });

  return {
    passed: duplicateWarnings.length === 0,
    duplicateWarnings,
  };
}

