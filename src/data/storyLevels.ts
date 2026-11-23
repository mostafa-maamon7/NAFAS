import { StoryLevel, EmergencyContact, LearningModule, BilingualText } from '../types/nafas';
import { ADULT_CORE_LEVELS } from './adultCoreLevels';
import { CHILD_CORE_LEVELS } from './childCoreLevels';
import { INFANT_CORE_LEVELS } from './infantCoreLevels';
import { validateCharacterRegistryIntegrity } from './characterRegistry';
import { getGuidanceForLevel, auditDuplicateLevelGuidance } from './rulesLibrary';
import { getChoiceExplanation } from './levelExplanations';
import { getLookHotspotsForImage, CalibratedHotspot } from './hotspotCalibration';

/**
 * Strips lecture slide numbers and internal rule codes (e.g. "(Slide 14)", "(شريحة ١٤)", "(R-WATER)")
 * from player-facing copy while keeping lectureSlideRefs and ruleTags in data for /qa.
 */
export function stripPlayerSlideAndRuleRefs(text: string): string {
  return text
    .replace(/^(?:Lecture\s*)?Slides?\s*[\d–\-,\s&]+(?:\s*\(R-[A-Z]+\))?\s*[:—\-]\s*/gi, '')
    .replace(/^(?:شريحة|شرائح|سلايد|سلايدات)\s*[٠-٩\d–\-،,\sو]+(?:\s*\(R-[A-Z]+\))?\s*[:—\-]\s*/g, '')
    .replace(/^(?:Rule\s*|Rules\s*|قاعدة\s*|قواعد\s*)R-[A-Z]+\s*(?:\([^)]*\))?\s*[:—\-]?\s*/gi, '')
    .replace(/\s*\((?:Lecture\s*)?Slides?\s*[\d–\-,\s&]+(?:\s*&\s*[\d–\-]+)*\)/gi, '')
    .replace(/\s*\((?:شريحة|شرائح|سلايد|سلايدات)\s*[٠-٩\d–\-،,\sو]+\)/g, '')
    .replace(/\s*\((?:Rule\s*|Rules\s*|قاعدة\s*|قواعد\s*)?R-[A-Z]+[^)]*\)/gi, '')
    .replace(/\s*—\s*R-[A-Z]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanBilingual(b: BilingualText): BilingualText {
  return {
    en: stripPlayerSlideAndRuleRefs(b.en),
    ar: stripPlayerSlideAndRuleRefs(b.ar),
  };
}

function enrichStoryLevel(level: StoryLevel): StoryLevel {
  const calibratedLook = getLookHotspotsForImage(
    `${level.id}_S5`,
    level.sceneVisual.hotspots
  ).filter((h: CalibratedHotspot) => h.kind === 'look_ring');

  const syncedHotspots =
    calibratedLook.length > 0
      ? calibratedLook.map((hs: CalibratedHotspot) => ({
          id: hs.id,
          x: hs.x,
          y: hs.y,
          type: (hs.region === 'mouth' || hs.region === 'throat' ? 'airway' : 'symptom') as
            | 'airway'
            | 'symptom'
            | 'anatomy'
            | 'environment',
          label: hs.label,
          detail: hs.meaning,
        }))
      : level.sceneVisual.hotspots.map((h) => ({
          ...h,
          label: cleanBilingual(h.label),
          detail: cleanBilingual(h.detail),
        }));

  return {
    ...level,
    character: {
      ...level.character,
      role: cleanBilingual(level.character.role),
    },
    objective: cleanBilingual(level.objective),
    afterCareNote: level.afterCareNote ? cleanBilingual(level.afterCareNote) : undefined,
    sceneVisual: {
      ...level.sceneVisual,
      caption: cleanBilingual(level.sceneVisual.caption),
      hotspots: syncedHotspots,
    },
    storyBeats: level.storyBeats.map((beat) => ({
      ...beat,
      text: cleanBilingual(beat.text),
      clinicalCue: cleanBilingual(beat.clinicalCue),
    })),
    decisionNode: {
      ...level.decisionNode,
      prompt: cleanBilingual(level.decisionNode.prompt),
      contextNote: cleanBilingual(level.decisionNode.contextNote),
      choices: level.decisionNode.choices.map((choice) => {
        const exp = getChoiceExplanation(choice.id);
        return {
          ...choice,
          label: cleanBilingual(choice.label),
          subLabel: undefined,
          consequenceBeat: {
            ...choice.consequenceBeat,
            title: exp ? exp.verdict : cleanBilingual(choice.consequenceBeat.title),
            narrative: exp ? exp.whatHappened : cleanBilingual(choice.consequenceBeat.narrative),
            clinicalWhy: exp ? exp.why : cleanBilingual(choice.consequenceBeat.clinicalWhy),
            explanation: exp,
          },
        };
      }),
    },
    takeaways: level.takeaways.map(cleanBilingual),
  };
}

export const CORE_STORY_LEVELS: StoryLevel[] = [
  ...CHILD_CORE_LEVELS,
  ...ADULT_CORE_LEVELS,
  ...INFANT_CORE_LEVELS,
].map((level, index) =>
  enrichStoryLevel({
    ...level,
    levelNumber: index + 1,
  })
);

/**
 * Per NAFAS-Levels-Restructure.md Section 5:
 * Wheelchair (Slide 23) and Choking-Alone (Slide 24) are Learn Cards in the Learning Hub (no stars),
 * so STORY_LEVELS has exactly 10 levels (4 Adult + 3 Child + 3 Infant = 30 stars max).
 */
export const SPECIAL_MISSIONS: StoryLevel[] = [];

export const STORY_LEVELS: StoryLevel[] = [...CORE_STORY_LEVELS];

export interface LearnCardInteractiveStep {
  stepNumber: number;
  actionButton: BilingualText;
  title: BilingualText;
  detail: BilingualText;
  feedback: BilingualText;
}

export interface SpecialCaseLearnCard {
  id: string;
  slideRef: string;
  badge: BilingualText;
  title: BilingualText;
  subtitle: BilingualText;
  mediaKey: string;
  steps: BilingualText[];
  tryItSteps: LearnCardInteractiveStep[];
  safetyRule: BilingualText;
}

export const SPECIAL_LEARN_CARDS: SpecialCaseLearnCard[] = [
  {
    id: 'learn-card-wheelchair-slide-23',
    slideRef: 'Slide 23',
    badge: {
      en: 'Illustrated Learn Card • Interactive Practice',
      ar: 'بطاقة تعلّم مصوّرة • تدريب تفاعلي',
    },
    title: {
      en: 'Choking in a Wheelchair',
      ar: 'الاختناق في الكرسي المتحرك',
    },
    subtitle: {
      en: 'How to deliver back blows and thrusts while the person stays safely seated in their wheelchair',
      ar: 'إزاي تنفّذ ضربات الضهر والضغطات والمصاب قاعد بأمان في كرسيه المتحرك',
    },
    mediaKey: 's2_kneel_behind_wheelchair',
    steps: [
      {
        en: '1. Lock the wheelchair brakes right away so the chair cannot roll backward.',
        ar: '١. ثبّت فرامل الكرسي المتحرك فوراً عشان الكرسي ميتحركش لورا وقت الإنقاذ.',
      },
      {
        en: '2. Keep the person seated in the wheelchair — never try to lift them out to stand.',
        ar: '٢. خلّي المصاب قاعد في الكرسي المتحرك — ومتحاولش ترفعه أو توقفه.',
      },
      {
        en: '3. Stand or kneel behind the wheelchair, support their chest forward, and give up to 5 firm back blows between the shoulder blades.',
        ar: '٣. قف أو انزل ورا الكرسي، اسند صدره وميّله لقدام، واعمل حتى ٥ ضربات ضهر بين لوحي الكتف.',
      },
      {
        en: '4. If still blocked, wrap your arms from behind the chair for up to 5 inward-and-upward belly thrusts (or chest thrusts if needed).',
        ar: '٤. لو الانسداد مستمر، حوّط من ورا الكرسي واعمل حتى ٥ ضغطات بطن للداخل وللأعلى (أو ضغطات صدر عند الحاجة).',
      },
    ],
    tryItSteps: [
      {
        stepNumber: 1,
        actionButton: { en: 'Lock both wheelchair brakes', ar: 'اقفل فرامل الكرسي المتحرك' },
        title: { en: 'Step 1 · Stabilize the Chair', ar: 'خطوة ١ · تثبيت الكرسي' },
        detail: {
          en: 'Before touching the patient, click both wheel locks so your thrusts push the airway, not the wheels.',
          ar: 'قبل ما تلمس المصاب، اقفل فرامل العجلتين عشان قوّة الضغط تروح لمجرى النفس مش لتحريك الكرسي.',
        },
        feedback: {
          en: 'Brakes locked — the wheelchair is now completely stable.',
          ar: 'تم قفل الفرامل — الكرسي دلوقتي ثابت تماماً.',
        },
      },
      {
        stepNumber: 2,
        actionButton: { en: 'Lean patient forward in seat', ar: 'ميّل المصاب لقدام وهو قاعد' },
        title: { en: 'Step 2 · Keep Seated & Lean Forward', ar: 'خطوة ٢ · إمالة المصاب للأمام بدون رفعه' },
        detail: {
          en: 'Keep them safely in the seat, place one hand across their chest, and lean their upper body forward.',
          ar: 'سيبه قاعد بأمان في كرسيه، اسند صدره بإيد، وميّل جذعه العلوي لقدام.',
        },
        feedback: {
          en: 'Upper body leaned forward — gravity now helps the object exit.',
          ar: 'تمت الإمالة للأمام — الجاذبية دلوقتي بتساعد الجسم الغريب يخرج لبره.',
        },
      },
      {
        stepNumber: 3,
        actionButton: { en: 'Deliver up to 5 back blows', ar: 'نفّذ حتى ٥ ضربات ضهر' },
        title: { en: 'Step 3 · Up to 5 Back Blows', ar: 'خطوة ٣ · حتى ٥ ضربات بين لوحي الكتف' },
        detail: {
          en: 'From behind or beside the backrest, deliver up to 5 firm blows between the shoulder blades with the heel of your hand.',
          ar: 'من ورا مسند الكرسي، وجّه حتى ٥ ضربات حاسمة بكعب الإيد بين لوحي الكتف.',
        },
        feedback: {
          en: 'Back blows delivered — check if the blockage popped out.',
          ar: 'تمت ضربات الضهر — افحص هل خرج الجسم الغريب.',
        },
      },
      {
        stepNumber: 4,
        actionButton: { en: 'Deliver up to 5 thrusts from behind', ar: 'نفّذ حتى ٥ ضغطات من خلف الكرسي' },
        title: { en: 'Step 4 · Up to 5 Seated Thrusts', ar: 'خطوة ٤ · حتى ٥ ضغطات بطن أو صدر من الخلف' },
        detail: {
          en: 'Kneel or bend behind the chair back, reach around the person, and give up to 5 inward-and-upward belly thrusts (or chest thrusts if belly thrusts do not fit).',
          ar: 'انزل ورا ضهر الكرسي، حوّط بذراعيك، ونفّذ حتى ٥ ضغطات بطن للداخل وللأعلى (أو ضغطات صدر لو البطن غير مناسب).',
        },
        feedback: {
          en: 'Practice complete! You mastered seated wheelchair choking rescue.',
          ar: 'اكتمل التدريب! أتقنت خطوات الإنقاذ في الكرسي المتحرك بأمان.',
        },
      },
    ],
    safetyRule: {
      en: 'Always lock the wheelchair brakes first and work from behind the seated person.',
      ar: 'ثبّت فرامل الكرسي المتحرك أولاً دايماً ونفّذ الخطوات من ورا المصاب وهو جالس.',
    },
  },
  {
    id: 'learn-card-choking-alone-slide-24',
    slideRef: 'Slide 24',
    badge: {
      en: 'Illustrated Learn Card • Interactive Practice',
      ar: 'بطاقة تعلّم مصوّرة • تدريب تفاعلي',
    },
    title: {
      en: 'Choking When You Are Alone',
      ar: 'الاختناق وأنت لوحدك',
    },
    subtitle: {
      en: 'How to save yourself when severe choking strikes and no one is around to help',
      ar: 'إزاي تنقذ نفسك لو شرقت شرقة شديدة ومفيش حد جنبك يساعدك',
    },
    mediaKey: 's3_self_thrust_decision',
    steps: [
      {
        en: '1. Call Egyptian Ambulance (123) and put the phone on speaker immediately so responders can trace and hear you.',
        ar: '١. اتصل بهيئة الإسعاف المصرية (١٢٣) فوراً وافتح السبيكر جنبك عشان المسعفين يتحركوا لمكانك حتى لو مش قادر تتكلم.',
      },
      {
        en: '2. Make a fist with one hand above your navel and below your breastbone, grasp it with your other hand, and thrust inward and upward.',
        ar: '٢. اعمل قبضة بإيدك فوق السرة وتحت عظمة الصدر، امسكها بإيدك التانية، واضغط للداخل وللأعلى بقوة.',
      },
      {
        en: '3. Or lean forward and press your upper belly firmly over a sturdy, blunt edge like a heavy chair back or kitchen counter.',
        ar: '٣. أو ميّل جسمك لقدام واضغط بأعلى بطنك فوق حافة ثابتة وغير حادة زي ضهر كرسي متين أو رخامة المطبخ.',
      },
      {
        en: '4. Keep repeating firm inward-and-upward thrusts until the food pops out or help arrives.',
        ar: '٤. كرّر الضغطات للداخل وللأعلى لحد ما اللقمة تخرج أو يوصل فريق الإسعاف.',
      },
    ],
    tryItSteps: [
      {
        stepNumber: 1,
        actionButton: { en: 'Dial emergency on speakerphone', ar: 'اتصل بالإسعاف وافتح السبيكر' },
        title: { en: 'Step 1 · Call Emergency on Speaker', ar: 'خطوة ١ · طلب الإسعاف على مكبر الصوت' },
        detail: {
          en: 'Do not wait to see if it clears alone. Dial emergency services and tap speakerphone so your hands stay free.',
          ar: 'متستناش تجرب لوحدك من غير تليفون؛ اطلب الإسعاف وافتح السبيكر عشان إيديك تفضل فاضية للإنقاذ.',
        },
        feedback: {
          en: 'Emergency line open on speaker — help is on the way.',
          ar: 'خط الإسعاف مفتوح على السبيكر — المساعدة في الطريق.',
        },
      },
      {
        stepNumber: 2,
        actionButton: { en: 'Position fist above your navel', ar: 'حط قبضتك فوق السرة' },
        title: { en: 'Step 2 · Self-Fist Placement', ar: 'خطوة ٢ · وضع القبضة فوق السرة' },
        detail: {
          en: 'Place your thumb-side fist right above your navel and well below your ribs, holding it tightly with your other hand.',
          ar: 'حط قبضة إيدك فوق السرة وتحت القفص الصدري، وامسكها بقوة بإيدك التانية.',
        },
        feedback: {
          en: 'Fist positioned in the safe upper-belly zone.',
          ar: 'القبضة في المكان الصح فوق السرة مباشرة.',
        },
      },
      {
        stepNumber: 3,
        actionButton: { en: 'Use a sturdy blunt chair back', ar: 'استند على ضهر كرسي متين وغير حاد' },
        title: { en: 'Step 3 · Brace Against a Firm Blunt Edge', ar: 'خطوة ٣ · الاستعانة بحافة كرسي متينة وغير حادة' },
        detail: {
          en: 'If your hands tire, lean your upper abdomen over the rounded back of a heavy chair or a solid countertop — never a sharp corner.',
          ar: 'لو إيدك مش كافية، ميّل أعلى بطنك فوق ضهر كرسي تقيل أو حافة طاولة عريضة وثابتة — وإياك تستخدم حافة حادة.',
        },
        feedback: {
          en: 'Aligned over a firm, blunt chair back for extra upward leverage.',
          ar: 'تم الارتكاز على ضهر كرسي ثابت وغير حاد لمضاعفة قوة الدفع.',
        },
      },
      {
        stepNumber: 4,
        actionButton: { en: 'Push inward and upward firmly', ar: 'اضغط للداخل وللأعلى بقوة' },
        title: { en: 'Step 4 · Thrust Inward & Upward Until Clear', ar: 'خطوة ٤ · ضغطات للداخل وللأعلى حتى خروج الجسم' },
        detail: {
          en: 'Drive your upper belly sharply inward and upward to pop air from your lungs until the blockage flies out.',
          ar: 'اضغط للداخل وللأعلى بحسم عشان الهوا المحبوس في الرئة يطرد اللقمة لبره.',
        },
        feedback: {
          en: 'Practice complete! You know the exact 4 steps for choking when alone.',
          ar: 'اكتمل التدريب! عرفت الـ ٤ خطوات الأساسية لإنقاذ نفسك لو كنت لوحدك.',
        },
      },
    ],
    safetyRule: {
      en: 'Never press against a sharp or wobbly object; always use a heavy, blunt chair back or counter edge.',
      ar: 'متضغطش أبداً على جسم حاد أو كرسي بيتهز؛ استخدم دايماً ضهر كرسي تقيل أو حافة عريضة وثابتة.',
    },
  },
];

export function getStoryLevelById(id: string): StoryLevel | undefined {
  return STORY_LEVELS.find(
    (lvl) => lvl.id.toLowerCase() === id.toLowerCase()
  );
}

export function validateStoryLevels(levels: StoryLevel[] = STORY_LEVELS): {
  valid: boolean;
  issues: string[];
} {
  const report = runStoryLevelsMasterAudit();
  const issues: string[] = [
    ...report.duplicateMediaKeys,
    ...report.characterViolations,
    ...report.guidanceDuplicateWarnings,
  ];
  if (!report.allHaveMinFiveBeats) {
    issues.push('One or more levels have fewer than 5 unique story beats.');
  }
  return {
    valid: issues.length === 0 && levels.length === 10,
    issues,
  };
}

export interface StoryLevelsAuditReport {
  totalLevels: number;
  coreLevelsCount: number;
  specialMissionsCount: number;
  specialLearnCardsCount: number;
  allHaveMinFiveBeats: boolean;
  uniqueBeatMediaKeysCount: number;
  totalBeatMediaKeysCount: number;
  uniqueOutcomeMediaKeysCount: number;
  totalOutcomeMediaKeysCount: number;
  totalUniqueFramesCount: number;
  duplicateMediaKeys: string[];
  characterRegistryPassed: boolean;
  characterViolations: string[];
  guidanceAuditPassed: boolean;
  guidanceDuplicateWarnings: string[];
  clinicalReviewItems: Array<{
    levelId: string;
    title: { en: string; ar: string };
    reason: string;
  }>;
  perLevelSummary: Array<{
    levelId: string;
    titleEn: string;
    titleAr: string;
    characterEn: string;
    characterAr: string;
    beatsCount: number;
    outcomeFramesCount: number;
    mediaKeys: string[];
    outcomeMediaKeys: string[];
    lectureSlides: string[];
    guidanceRuleIds: string[];
    clinicalReview: boolean;
  }>;
}

export function runStoryLevelsMasterAudit(): StoryLevelsAuditReport {
  const allTexts: string[] = [];
  const allBeatMediaKeys: string[] = [];
  const allOutcomeMediaKeys: string[] = [];
  const seenMediaKeys = new Set<string>();
  const seenOutcomeKeys = new Set<string>();
  const duplicateMediaKeys: string[] = [];

  let allHaveMinFiveBeats = true;

  const perLevelGuidancePayload: Array<{
    levelId: string;
    afterCareEn: string;
    ruleIds: string[];
  }> = [];

  const clinicalReviewItems: Array<{
    levelId: string;
    title: { en: string; ar: string };
    reason: string;
  }> = [];

  const perLevelSummary = STORY_LEVELS.map((level) => {
    if (level.storyBeats.length < 5) {
      allHaveMinFiveBeats = false;
    }

    const levelMediaKeys: string[] = [];
    level.storyBeats.forEach((beat) => {
      allBeatMediaKeys.push(beat.mediaKey);
      levelMediaKeys.push(beat.mediaKey);
      if (seenMediaKeys.has(beat.mediaKey)) {
        duplicateMediaKeys.push(`${level.id}:${beat.id}:${beat.mediaKey}`);
      }
      seenMediaKeys.add(beat.mediaKey);

      allTexts.push(beat.text.en, beat.text.ar, beat.clinicalCue.en, beat.clinicalCue.ar);
    });

    const levelOutcomeKeys: string[] = [];
    level.decisionNode.choices.forEach((choice) => {
      if (choice.consequenceBeat.playbackFrames && choice.consequenceBeat.playbackFrames.length > 0) {
        choice.consequenceBeat.playbackFrames.forEach((pf) => {
          allOutcomeMediaKeys.push(pf.mediaKey);
          levelOutcomeKeys.push(pf.mediaKey);
          if (seenOutcomeKeys.has(pf.mediaKey) || seenMediaKeys.has(pf.mediaKey)) {
            duplicateMediaKeys.push(`${level.id}:${pf.id}:${pf.mediaKey}`);
          }
          seenOutcomeKeys.add(pf.mediaKey);
          allTexts.push(pf.caption.en, pf.caption.ar);
        });
      } else {
        const mk = choice.consequenceBeat.mediaKey;
        allOutcomeMediaKeys.push(mk);
        levelOutcomeKeys.push(mk);
        if (seenOutcomeKeys.has(mk) || seenMediaKeys.has(mk)) {
          duplicateMediaKeys.push(`${level.id}:${choice.id}:${mk}`);
        }
        seenOutcomeKeys.add(mk);
      }
    });

    allTexts.push(
      level.title.en,
      level.title.ar,
      level.subtitle.en,
      level.subtitle.ar,
      level.hook.en,
      level.hook.ar,
      level.objective.en,
      level.objective.ar,
      level.sceneVisual.caption.en,
      level.sceneVisual.caption.ar,
      level.decisionNode.prompt.en,
      level.decisionNode.prompt.ar
    );

    if (level.afterCareNote) {
      allTexts.push(level.afterCareNote.en, level.afterCareNote.ar);
    }

    const matchingRules = getGuidanceForLevel(level.ruleTags || []);
    const ruleIds = matchingRules.map((r) => r.id);

    perLevelGuidancePayload.push({
      levelId: level.id,
      afterCareEn: level.afterCareNote?.en || level.objective.en,
      ruleIds,
    });

    if (level.clinicalReview && level.clinicalReviewReason) {
      clinicalReviewItems.push({
        levelId: level.id,
        title: level.title,
        reason:
          typeof level.clinicalReviewReason === 'string'
            ? level.clinicalReviewReason
            : level.clinicalReviewReason.en,
      });
    }

    const normalizedSlides = Array.isArray(level.lectureSlideRefs)
      ? level.lectureSlideRefs
      : level.lectureSlideRefs
      ? [level.lectureSlideRefs]
      : [];

    return {
      levelId: level.id,
      titleEn: level.title.en,
      titleAr: level.title.ar,
      characterEn: level.character.name.en,
      characterAr: level.character.name.ar,
      beatsCount: level.storyBeats.length,
      outcomeFramesCount: levelOutcomeKeys.length,
      mediaKeys: levelMediaKeys,
      outcomeMediaKeys: levelOutcomeKeys,
      lectureSlides: normalizedSlides,
      guidanceRuleIds: ruleIds,
      clinicalReview: Boolean(level.clinicalReview),
    };
  });

  const charCheck = validateCharacterRegistryIntegrity(allTexts);
  const guidanceCheck = auditDuplicateLevelGuidance(perLevelGuidancePayload);

  return {
    totalLevels: STORY_LEVELS.length,
    coreLevelsCount: CORE_STORY_LEVELS.length,
    specialMissionsCount: SPECIAL_MISSIONS.length,
    specialLearnCardsCount: SPECIAL_LEARN_CARDS.length,
    allHaveMinFiveBeats,
    uniqueBeatMediaKeysCount: seenMediaKeys.size,
    totalBeatMediaKeysCount: allBeatMediaKeys.length,
    uniqueOutcomeMediaKeysCount: seenOutcomeKeys.size,
    totalOutcomeMediaKeysCount: allOutcomeMediaKeys.length,
    totalUniqueFramesCount: seenMediaKeys.size + seenOutcomeKeys.size,
    duplicateMediaKeys,
    characterRegistryPassed: charCheck.passed,
    characterViolations: charCheck.violations,
    guidanceAuditPassed: guidanceCheck.passed,
    guidanceDuplicateWarnings: guidanceCheck.duplicateWarnings,
    clinicalReviewItems,
    perLevelSummary,
  };
}

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    country: { en: 'Egypt Ambulance', ar: 'هيئة الإسعاف المصرية' },
    number: '123',
    notes: {
      en: 'Official 24/7 Medical Emergency & Choking Response',
      ar: 'الرقم الرسمي لطوارئ الإسعاف على مدار الساعة في مصر',
    },
  },
  {
    country: { en: 'Egypt Emergency Police', ar: 'شرطة النجدة المصرية' },
    number: '122',
    notes: {
      en: 'Official National Police & Emergency Dispatch',
      ar: 'الرقم الرسمي لبلاغات الطوارئ والنجدة في مصر',
    },
  },
  {
    country: { en: 'Egypt Civil Defense & Fire', ar: 'الحماية المدنية والمطافئ' },
    number: '180',
    notes: {
      en: 'Official Fire & Rapid Rescue Services',
      ar: 'الرقم الرسمي للحماية المدنية والإنقاذ السريع في مصر',
    },
  },
];

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'mod-recognition',
    category: 'recognition',
    title: {
      en: 'Mild vs. Severe Choking: Spotting the Difference',
      ar: 'الفرق بين الاختناق الخفيف والاختناق الشديد',
    },
    summary: {
      en: 'The single question that determines your entire rescue plan: Is the cough loud and effective, or silent and weak?',
      ar: 'السؤال الوحيد اللي بيحدد خطة الإنقاذ بالكامل: هل الكحة صوتها قوي وفعّال، ولا صامتة وضعيفة؟',
    },
    readTimeMin: 3,
    guidelineSource: {
      en: 'Dr. Mai Mahran First Aid Guide • Resuscitation Council UK',
      ar: 'دليل د. مي مهران للإسعافات الأولية • مجلس الإنعاش البريطاني',
    },
    keyPoints: [
      {
        en: 'Effective Cough (Mild): The person can speak, cry, cough loudly, and draw a breath → Ask "Are you choking?", encourage coughing, and stay right beside them.',
        ar: 'كحة فعّالة (اختناق خفيف): المصاب يقدر يتكلم أو يبكي ويكح بصوت مسموع وياخد نفس ← اسأله «هل بتشرق؟»، شجّعه يكمل كحة، وخليك جنبه وراقبه.',
      },
      {
        en: 'Ineffective Cough (Severe): The person cannot speak, has a silent or weak cough, cannot breathe, and clutches their neck → Call for help and act immediately.',
        ar: 'كحة غير فعّالة (اختناق شديد): المصاب مش قادر يتكلم، كحته صامتة أو ضعيفة، مش بيتنفس، وماسك رقبته ← اطلب المساعدة وتدخّل فوراً.',
      },
      {
        en: 'Never give water and never hit the back of someone who is coughing strongly.',
        ar: 'ممنوع تقديم المية وممنوع الضرب على ضهر شخص بيكح بقوة وبفعالية.',
      },
    ],
  },
  {
    id: 'mod-adult-child',
    category: 'adult',
    title: {
      en: 'Up to 5 Back Blows & Up to 5 Belly Thrusts',
      ar: 'حتى ٥ ضربات ضهر وحتى ٥ ضغطات بطن',
    },
    summary: {
      en: 'Step-by-step technique for conscious adults and children over 1 year old with severe choking.',
      ar: 'الخطوات العملية للبالغين والأطفال فوق سن سنة في حالات الاختناق الشديد.',
    },
    readTimeMin: 4,
    guidelineSource: {
      en: 'Dr. Mai Mahran First Aid Guide • Resuscitation Council UK & American Red Cross',
      ar: 'دليل د. مي مهران للإسعافات الأولية • مجلس الإنعاش البريطاني والصليب الأحمر',
    },
    keyPoints: [
      {
        en: 'Support the chest with one hand, lean the person well forward, and give up to 5 firm back blows between the shoulder blades with the heel of your hand.',
        ar: 'اسند الصدر بإيد، ميّل المصاب لقدام بوضوح، ووجّه حتى ٥ ضربات ضهر حاسمة بين لوحي الكتف بكعب الإيد التانية.',
      },
      {
        en: 'Reassess after each blow. If still blocked, stand or kneel behind, place your fist above the navel and below the breastbone, and give up to 5 inward-and-upward belly thrusts.',
        ar: 'افحص بعد كل ضربة؛ لو الانسداد لسه موجود، قف وراه وحط قبضة إيدك فوق السرة وتحت عظمة الصدر، واعمل حتى ٥ ضغطات بطن للداخل وللأعلى.',
      },
      {
        en: 'For a child over 1 year: kneel behind to match their height and adjust your force to fit the child.',
        ar: 'مع الطفل فوق سن سنة: انزل على ركبتيك وراه لمستوى طوله واضبط قوتك بما يناسب جسم الطفل.',
      },
    ],
  },
  {
    id: 'mod-infant-special',
    category: 'infant',
    title: {
      en: 'Infants (<1 Year) & Special Situations',
      ar: 'الرضّع (أقل من سنة) والحالات الخاصة',
    },
    summary: {
      en: 'Why infants and late-pregnancy patients receive chest thrusts instead of belly thrusts, plus wheelchair and self-rescue guides.',
      ar: 'ليه الرضّع والحوامل في الشهور الأخيرة بنعملهم ضغطات صدر بدل البطن، مع خطوات الكرسي المتحرك والاختناق لوحدك.',
    },
    readTimeMin: 4,
    guidelineSource: {
      en: 'Dr. Mai Mahran First Aid Guide • Resuscitation Council UK & American Red Cross',
      ar: 'دليل د. مي مهران للإسعافات الأولية • مجلس الإنعاش البريطاني والصليب الأحمر',
    },
    keyPoints: [
      {
        en: 'Infant (<1 yr): Support face-down on your forearm for up to 5 back blows, then turn onto the back for up to 5 two-finger chest thrusts — never press an infant’s belly. Hands-on practical training is essential.',
        ar: 'الرضيع (أقل من سنة): اسنده على ساعدك لعمل حتى ٥ ضربات ضهر، ثم اقلبه على ضهره لعمل حتى ٥ ضغطات صدر بإصبعين — وممنوع لمس بطن الرضيع نهائياً. التدريب العملي ضروري.',
      },
      {
        en: 'Late Pregnancy or Large Abdomen: Use firm chest thrusts on the middle of the chest instead of belly thrusts.',
        ar: 'آخر الحمل أو البطن الكبير: استخدم ضغطات الصدر في منتصف الصدر بدلاً من ضغطات البطن.',
      },
      {
        en: 'Wheelchair & Choking Alone: Lock the wheelchair brakes and work from behind; if alone, call emergency on speaker and thrust your upper belly with your fist or over a sturdy blunt chair back.',
        ar: 'الكرسي المتحرك والاختناق لوحدك: اقفل فرامل الكرسي واشتغل من الخلف؛ ولو لوحدك اتصل بالإسعاف على السبيكر واضغط بأعلى بطنك بقبضتك أو فوق ضهر كرسي متين وغير حاد.',
      },
    ],
  },
];
