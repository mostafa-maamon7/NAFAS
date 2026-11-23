import { BilingualText } from '../types/nafas';

export type ProtagonistId = 'adult_tariq' | 'child_youssef' | 'infant_layan' | 'adult' | 'child' | 'infant';

export interface CharacterDefinition {
  id: string;
  enName: string;
  arName: string;
  ageEn: string;
  ageAr: string;
  roleEn: string;
  roleAr: string;
  name: BilingualText;
  ageDisplay: BilingualText;
  role: BilingualText;
  defaultRole: BilingualText;
  levels: string[];
  avatarAsset: string;
  styleId: 'NAFAS-STYLE-01';
  visualLockEn: string;
  visualLockAr: string;
}

export interface SupportingRoleDefinition {
  id: string;
  enRole: string;
  arRole: string;
  en: string;
  ar: string;
}

const adultTariqDef: CharacterDefinition = {
  id: 'adult_tariq',
  enName: 'Mohamed',
  arName: 'محمد',
  ageEn: '34 yrs',
  ageAr: '34 سنة',
  roleEn: 'Adult (18+ yrs)',
  roleAr: 'بالغ (+18 سنة)',
  name: { en: 'Mohamed', ar: 'محمد' },
  ageDisplay: { en: '34 yrs', ar: '34 سنة' },
  role: { en: 'Adult (18+ yrs)', ar: 'بالغ (+18 سنة)' },
  defaultRole: { en: 'Adult (18+ yrs)', ar: 'بالغ (+18 سنة)' },
  levels: ['A1', 'A2', 'A3'],
  avatarAsset: 'a2_s1_lab_wide',
  styleId: 'NAFAS-STYLE-01',
  visualLockEn: '34-year-old Egyptian man, short neat dark hair, trimmed beard, warm olive skin, navy polo shirt, dark slate trousers.',
  visualLockAr: 'شاب مصري 34 سنة، شعر داكن قصير مرتب، لحية خفيفة مهندمة، قميص بولو كحلي وبنطلون رمادي داكن.',
};

const childYoussefDef: CharacterDefinition = {
  id: 'child_youssef',
  enName: 'Marwan',
  arName: 'مروان',
  ageEn: '6 yrs',
  ageAr: '6 سنوات',
  roleEn: 'Child (1–8 yrs)',
  roleAr: 'طفل (1–8 سنوات)',
  name: { en: 'Marwan', ar: 'مروان' },
  ageDisplay: { en: '6 yrs', ar: '6 سنوات' },
  role: { en: 'Child (1–8 yrs)', ar: 'طفل (1–8 سنوات)' },
  defaultRole: { en: 'Child (1–8 yrs)', ar: 'طفل (1–8 سنوات)' },
  levels: ['C1', 'C2', 'C3'],
  avatarAsset: 'c1_s1_cafeteria_wide',
  styleId: 'NAFAS-STYLE-01',
  visualLockEn: '6-year-old boy, curly dark brown hair, warm expressive eyes, light-blue school polo shirt, dark navy trousers, white sneakers.',
  visualLockAr: 'طفل 6 سنوات، شعر بني داكن مموج، قميص مدرسي أزرق فاتح، بنطلون كحلي وحذاء رياضي أبيض.',
};

const infantLayanDef: CharacterDefinition = {
  id: 'infant_layan',
  enName: 'Nelly',
  arName: 'نيللي',
  ageEn: '8 months',
  ageAr: '8 أشهر',
  roleEn: 'Infant (<1 yr)',
  roleAr: 'رضيعة (أقل من سنة)',
  name: { en: 'Nelly', ar: 'نيللي' },
  ageDisplay: { en: '8 months', ar: '8 أشهر' },
  role: { en: 'Infant (<1 yr)', ar: 'رضيعة (أقل من سنة)' },
  defaultRole: { en: 'Infant (<1 yr)', ar: 'رضيعة (أقل من سنة)' },
  levels: ['I1', 'I2', 'I3'],
  avatarAsset: 'i1_s1_nursery_calm',
  styleId: 'NAFAS-STYLE-01',
  visualLockEn: '8-month-old infant girl, soft dark wispy curl, chubby cheeks, soft pastel teal/cream footed onesie.',
  visualLockAr: 'رضيعة 8 أشهر، خصلة شعر ناعمة، خدود ممتلئة، ملابس أطفال ناعمة بلون تركواز هادئ وكريمي.',
};

/**
 * Single Source of Truth for all Character Names in NAFAS.
 * Strictly zero slash-pairs, zero aliases, zero old names.
 */
export const CHARACTER_REGISTRY: Record<ProtagonistId, CharacterDefinition> = {
  adult_tariq: adultTariqDef,
  child_youssef: childYoussefDef,
  infant_layan: infantLayanDef,
  adult: adultTariqDef,
  child: childYoussefDef,
  infant: infantLayanDef,
};

export const UNIQUE_PROTAGONISTS: CharacterDefinition[] = [
  adultTariqDef,
  childYoussefDef,
  infantLayanDef,
];

export const SUPPORTING_ROLES: Record<string, SupportingRoleDefinition> = {
  colleague: {
    id: 'colleague',
    enRole: 'the colleague',
    arRole: 'الزميل',
    en: 'the colleague',
    ar: 'الزميل',
  },
  pregnant_colleague: {
    id: 'pregnant_colleague',
    enRole: 'the pregnant colleague',
    arRole: 'الزميلة الحامل',
    en: 'the pregnant colleague',
    ar: 'الزميلة الحامل',
  },
  wheelchair_colleague: {
    id: 'wheelchair_colleague',
    enRole: 'the colleague in a wheelchair',
    arRole: 'الزميل على الكرسي المتحرك',
    en: 'the colleague in a wheelchair',
    ar: 'الزميل على الكرسي المتحرك',
  },
  teacher: {
    id: 'teacher',
    enRole: 'the teacher',
    arRole: 'المعلمة',
    en: 'the teacher',
    ar: 'المعلمة',
  },
  mother: {
    id: 'mother',
    enRole: 'the mother',
    arRole: 'الأم',
    en: 'the mother',
    ar: 'الأم',
  },
};

export function getCharacterByCode(levelCode: string): CharacterDefinition {
  const upper = levelCode.toUpperCase();
  if (upper.startsWith('C') || ['L4', 'L5', 'L6'].includes(upper)) {
    return CHARACTER_REGISTRY.child_youssef;
  }
  if (upper.startsWith('I') || ['L7', 'L8', 'L9'].includes(upper)) {
    return CHARACTER_REGISTRY.infant_layan;
  }
  return CHARACTER_REGISTRY.adult_tariq;
}

export function getPatientDisplayBadge(levelCode: string): BilingualText {
  const upper = levelCode.toUpperCase();
  if (upper === 'A4' || upper === 'S1') {
    return {
      en: `${SUPPORTING_ROLES.pregnant_colleague.enRole} (Late Pregnancy)`,
      ar: `${SUPPORTING_ROLES.pregnant_colleague.arRole} (في آخر الحمل)`,
    };
  }
  const c = getCharacterByCode(upper);
  return {
    en: `${c.enName} (${c.ageEn})`,
    ar: `${c.arName} (${c.ageAr})`,
  };
}

export function validateCharacterRegistryIntegrity(allTextBlobs: string[]): {
  passed: boolean;
  violations: string[];
} {
  const forbiddenPatterns = [
    /Mostafa/i,
    /مصطفى/,
    /Salma/i,
    /سلمى/,
    /\bTariq\b/i,
    /طارق/,
    /\bYoussef\b/i,
    /يوسف/,
    /\bLayan\b/i,
    /ليان/,
    /Mohamed\s*\/\s*Marwan/i,
    /Marwan\s*\/\s*Mohamed/i,
    /مروان\s*\/\s*محمد/,
    /محمد\s*\/\s*مروان/,
  ];

  const violations: string[] = [];
  allTextBlobs.forEach((blob, idx) => {
    forbiddenPatterns.forEach((regex) => {
      if (regex.test(blob)) {
        violations.push(`Text blob #${idx} matched forbidden pattern ${regex}: "${blob.slice(0, 70)}..."`);
      }
    });
  });

  return {
    passed: violations.length === 0,
    violations,
  };
}
