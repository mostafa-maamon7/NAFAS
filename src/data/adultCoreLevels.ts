import { StoryLevel } from '../types/nafas';
import { CHARACTER_REGISTRY, SUPPORTING_ROLES } from './characterRegistry';

const tariqEn = CHARACTER_REGISTRY.adult.name.en;
const tariqAr = CHARACTER_REGISTRY.adult.name.ar;
const pregEn = SUPPORTING_ROLES.pregnant_colleague.en;
const pregAr = SUPPORTING_ROLES.pregnant_colleague.ar;

export const ADULT_CORE_LEVELS: StoryLevel[] = [
  // =========================================================================
  // A1 · السعال الأول (طارق، كافتيريا الجامعة) — خفيف (Slides 5, 6, 7, 26–27)
  // =========================================================================
  {
    id: 'A1',
    levelNumber: 1,
    ageGroup: 'adult',
    severity: 'mild',
    patientState: 'conscious',
    clinicalReview: true,
    clinicalReviewReason:
      'Doctor confirmation requested for exact rationale phrasing of wrong choices B (giving water) and C (immediate abdominal thrusts during effective cough) — Section 4 A1 & Section 7 Q6.',
    lectureSlideRefs: ['Slide 5', 'Slide 6', 'Slide 7', 'Slide 26', 'Slide 27'],
    ruleTags: ['R-ASK', 'R-WATER'],
    title: {
      en: 'The First Cough',
      ar: 'السعال الأول',
    },
    subtitle: {
      en: `${tariqEn} (34 yrs) • University Cafeteria (Mild Choking)`,
      ar: `${tariqAr} (٣٤ سنة) • كافتيريا الجامعة (اختناق خفيف)`,
    },
    setting: {
      en: 'University Cafeteria',
      ar: 'كافتيريا الجامعة',
    },
    character: {
      name: CHARACTER_REGISTRY.adult.name,
      age: CHARACTER_REGISTRY.adult.ageDisplay,
      role: CHARACTER_REGISTRY.adult.defaultRole,
    },
    hook: {
      en: `${tariqEn} is eating lunch with colleagues in the university cafeteria and starts coughing forcefully. What will you do?`,
      ar: `${tariqAr} يتناول الغداء مع زملائه في كافتيريا الجامعة ويبدأ بالسعال بقوة. ماذا ستفعل؟`,
    },
    objective: {
      en: 'Ask "Are you choking?", encourage him to keep coughing, and stay beside him to monitor closely.',
      ar: 'اسأله «هل أنت تختنق؟»، شجّعه على السعال، وابقَ بجانبه وراقبه.',
    },
    EstimatedMinutes: 2,
    PlainLanguageMap: {
      spO2: { en: 'Oxygen level', ar: 'مستوى الأكسجين' },
      airway: { en: 'Breathing passage', ar: 'مجرى التنفس' },
      cyanosis: { en: 'Blue lips', ar: 'زرقة الشفاه' },
      epiglottis: { en: 'Throat valve', ar: 'صمام الحلق' },
    },
    afterCareNote: {
      en: `Tip: If ${tariqEn}'s cough becomes weak or silent, treat it immediately as severe choking (Slide 7).`,
      ar: `نصيحة: لو السعال ضعف أو سكت، اعتبرها اختناقاً شديداً وتدخّل فوراً (شريحة ٧).`,
    },
    sceneVisual: {
      environment: 'family_dining',
      accentColor: '#13B8B0',
      mood: 'focused',
      obstructionLevel: 30,
      spO2Start: 97,
      spO2Critical: 95,
      heartRateStart: 88,
      respiratoryRate: 20,
      hasCyanosis: false,
      hasStridor: false,
      canSpeak: true,
      canCough: true,
      caption: {
        en: `${tariqEn} coughs forcefully at the cafeteria table and can still speak and breathe.`,
        ar: `${tariqAr} يسعل بقوة على طاولة الكافتيريا ويستطيع الكلام والتنفس.`,
      },
      hotspots: [
        {
          id: 'a1-hs-cough',
          x: 48,
          y: 33,
          type: 'airway',
          label: { en: 'Strong cough & speech', ar: 'سعال قوي وبيتكلم' },
          detail: {
            en: `${tariqEn} coughs loudly and says "I am okay!" — his cough is effective.`,
            ar: `${tariqAr} يسعل بقوة ويقول «أنا كويس!» — سعاله فعّال.`,
          },
        },
        {
          id: 'a1-hs-face',
          x: 45,
          y: 23,
          type: 'symptom',
          label: { en: 'Normal face color', ar: 'لون الوجه طبيعي' },
          detail: {
            en: 'No blue lips; he is breathing between coughs.',
            ar: 'لون الوجه طبيعي ولا توجد زرقة؛ يتنفس بين السعال.',
          },
        },
        {
          id: 'a1-hs-posture',
          x: 52,
          y: 54,
          type: 'anatomy',
          label: { en: 'Breathing normally', ar: 'بيتنفس طبيعياً' },
          detail: {
            en: 'Air passes in and out effectively to fuel his cough.',
            ar: 'الهواء يدخل ويخرج بفعالية لدعم السعال الطبيعي.',
          },
        },
      ],
    },
    storyBeats: [
      {
        id: 'a1-s1',
        phase: 'intro',
        durationSec: 4,
        mediaKey: 'a1_s1_cafeteria_wide',
        speaker: { en: 'S1 · University Cafeteria', ar: 'S1 · كافتيريا الجامعة' },
        text: {
          en: `It is lunchtime at the university cafeteria. ${tariqEn} sits at a busy table with his colleagues.`,
          ar: `كافتيريا الجامعة وقت الغداء، ويجلس ${tariqAr} مع زملائه حول الطاولة.`,
        },
        clinicalCue: {
          en: 'Breathing passage open • Oxygen level 99%',
          ar: 'مجرى التنفس مفتوح • مستوى الأكسجين ٩٩٪',
        },
        spO2: 99,
        heartRate: 76,
      },
      {
        id: 'a1-s2',
        phase: 'escalation',
        durationSec: 4,
        mediaKey: 'a1_s2_eating_laughing',
        speaker: { en: 'S2 · Eating & Laughing', ar: 'S2 · الأكل والضحك' },
        text: {
          en: `${tariqEn} eats and laughs with his colleagues at the table.`,
          ar: `${tariqAr} يأكل ويضحك مع زملائه على الطاولة.`,
        },
        clinicalCue: {
          en: 'Laughing while chewing food (Slide 3–4)',
          ar: 'الضحك أثناء مضغ الطعام (شريحة ٣–٤)',
        },
        spO2: 98,
        heartRate: 84,
      },
      {
        id: 'a1-s3',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'a1_s3_sudden_cough',
        speaker: { en: 'S3 · Sudden Forceful Cough', ar: 'S3 · سعال قوي مفاجئ' },
        text: {
          en: `Suddenly ${tariqEn} leans forward and coughs loudly and forcefully.`,
          ar: `فجأة يميل ${tariqAr} للأمام ويسعل بقوة وصوت مسموع.`,
        },
        clinicalCue: {
          en: 'Loud forceful cough • Airway partially open',
          ar: 'سعال قوي ومسموع • مجرى التنفس مفتوح جزئياً',
        },
        spO2: 96,
        heartRate: 92,
      },
      {
        id: 'a1-s4',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'a1_s4_colleague_approaches',
        speaker: { en: 'S4 · Colleague Steps In', ar: 'S4 · انتباه الزميل' },
        text: {
          en: `A colleague notices and moves toward him as ${tariqEn} says between coughs: "I am okay!"`,
          ar: `ينتبه زميله ويتحرك ناحيته بينما يقول ${tariqAr} بين السعال: «أنا كويس!»`,
        },
        clinicalCue: {
          en: 'Able to speak & cough forcefully = Mild Choking (Slide 5)',
          ar: 'يقدر يتكلم ويسعل بقوة = اختناق خفيف (شريحة ٥)',
        },
        spO2: 96,
        heartRate: 95,
      },
      {
        id: 'a1-s5',
        phase: 'decision_prompt',
        durationSec: 5,
        mediaKey: 'a1_s5_decision_moment',
        speaker: { en: 'S5 · Decision Moment', ar: 'S5 · لحظة القرار' },
        text: {
          en: `${tariqEn} is coughing strongly, speaking, and his face color is normal. What will you do?`,
          ar: `${tariqAr} يسعل بقوة ويتكلم ولون وجهه طبيعي. ماذا ستفعل؟`,
        },
        clinicalCue: {
          en: 'Inspect the 3 signs in the Info Rail, then decide',
          ar: 'افحص العلامات الثلاث في اللوحة الجانبية ثم قرّر',
        },
        spO2: 96,
        heartRate: 96,
      },
    ],
    decisionNode: {
      id: 'a1-d1',
      prompt: {
        en: `${tariqEn} has a strong cough and can speak. What is the right action?`,
        ar: `${tariqAr} يسعل بقوة ويقدر يتكلم. ما هو التصرف الصحيح؟`,
      },
      contextNote: {
        en: 'Lecture Slides 5, 7, 26–27: Effective cough in mild choking.',
        ar: 'شرائح المحاضرة ٥، ٧، ٢٦–٢٧: السعال الفعّال في الاختناق الخفيف.',
      },
      timeLimitSec: 20,
      choices: [
        {
          id: 'a1-c1',
          label: {
            en: 'Ask "Are you choking?", encourage him to cough, and stay beside him to watch',
            ar: 'اسأله «هل أنت تختنق؟»، شجّعه على السعال، وابقَ جنبه وراقب',
          },
          subLabel: {
            en: 'Rule R-ASK (Slides 5, 7, 26–27)',
            ar: 'قاعدة R-ASK (شرائح ٥، ٧، ٢٦–٢٧)',
          },
          outcome: 'optimal',
          spO2Delta: 3,
          obstructionDelta: -30,
          consequenceBeat: {
            mediaKey: 'a1_o3_food_cleared',
            playbackFrames: [
              {
                id: 'a1-o1',
                stageLabel: { en: '1. Ask & Reassure', ar: '١. السؤال والطمأنة' },
                mediaKey: 'a1_o1_ask_choking',
                caption: {
                  en: `You ask ${tariqEn}: "Are you choking?" and keep him calm.`,
                  ar: `تسأل ${tariqAr}: «هل أنت تختنق؟» وتطمئنه بهدوء.`,
                },
                spO2: 96,
                heartRate: 94,
              },
              {
                id: 'a1-o2',
                stageLabel: { en: '2. Encourage Coughing', ar: '٢. تشجيع السعال' },
                mediaKey: 'a1_o2_encourage_cough',
                caption: {
                  en: `${tariqEn} coughs forcefully twice while you stay right beside him.`,
                  ar: `يسعل ${tariqAr} بقوة بينما تقف بجانبه وتراقبه عن قرب.`,
                },
                spO2: 98,
                heartRate: 88,
              },
              {
                id: 'a1-o3',
                stageLabel: { en: '3. Airway Cleared', ar: '٣. خروج الجسم والمراقبة' },
                mediaKey: 'a1_o3_food_cleared',
                caption: {
                  en: `The cough expels the food piece and the colleague continues watching him.`,
                  ar: `السعال يطرد قطعة الطعام، والزميل يستمر في مراقبته.`,
                },
                spO2: 99,
                heartRate: 78,
              },
            ],
            title: {
              en: 'Cough Clears the Airway Safely!',
              ar: 'السعال يطرد الجسم بأمان!',
            },
            narrative: {
              en: `His strong natural cough expels the food piece while you stay beside him and monitor his breathing.`,
              ar: `سعاله القوي يطرد قطعة الطعام بينما تبقى بجانبه وتراقب تنفسه.`,
            },
            clinicalWhy: {
              en: 'When the person can speak and cough forcefully, encourage coughing and stay with them in case the obstruction worsens (Slides 5, 7, 26–27).',
              ar: 'عندما يقدر المصاب على الكلام والسعال بقوة، شجّعه على السعال وابقَ معه تحسباً لضعف السعال أو توقفه (شرائح ٥، ٧، ٢٦–٢٧).',
            },
            internalEffect: {
              en: 'Natural cough pressure clears the partial obstruction without external trauma.',
              ar: 'ضغط السعال الطبيعي يطرد الانسداد الجزئي بأمان.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'complete',
          },
        },
        {
          id: 'a1-c2',
          label: {
            en: 'Give him water to drink',
            ar: 'أعطه ماءً ليشرب',
          },
          subLabel: {
            en: 'Interrupts coughing (Rule R-WATER)',
            ar: 'يقطع السعال (قاعدة R-WATER)',
          },
          outcome: 'harmful',
          spO2Delta: -7,
          obstructionDelta: 35,
          consequenceBeat: {
            mediaKey: 'a1_o4_err_water',
            title: {
              en: 'Wrong Action — Water Interrupts Coughing (R-WATER)',
              ar: 'خطأ — الماء يقطع السعال ويزيد الخطر (R-WATER)',
            },
            narrative: {
              en: `Giving water interrupts ${tariqEn}'s protective cough and risks worsening the airway blockage.`,
              ar: `إعطاء الماء يقطع سعال ${tariqAr} الفعّال وقد يزيد خطر انسداد مجرى التنفس.`,
            },
            clinicalWhy: {
              en: 'Rule R-WATER: Do not give water or ask a choking person to swallow (Slides 25 & 28).',
              ar: 'قاعدة R-WATER: لا تعطِ الماء ولا تطلب من المصاب البلع (شريحة ٢٥ و٢٨).',
            },
            internalEffect: {
              en: 'Liquid disrupts the cough reflex while a foreign body is still in the airway.',
              ar: 'الماء يعطّل منعكس السعال الطبيعي مع وجود جسم عالق.',
            },
            guidelineBadge: 'ARC',
            nextAction: 'retry',
          },
        },
        {
          id: 'a1-c3',
          label: {
            en: 'Perform abdominal thrusts immediately',
            ar: 'نفّذ ضغطات بطن فوراً',
          },
          subLabel: {
            en: 'Unnecessary intervention during strong cough',
            ar: 'تدخل غير لازم مع وجود سعال قوي',
          },
          outcome: 'suboptimal',
          spO2Delta: -3,
          obstructionDelta: 10,
          consequenceBeat: {
            mediaKey: 'a1_o5_err_thrusts',
            title: {
              en: 'Unnecessary — His Strong Cough Is Enough',
              ar: 'تدخل غير لازم — السعال الفعّال كافٍ',
            },
            narrative: {
              en: `Abdominal thrusts are not needed when ${tariqEn} is coughing strongly and speaking clearly.`,
              ar: `ضغطات البطن غير مطلوبة طالما أن ${tariqAr} يسعل بقوة ويتكلم بوضوح.`,
            },
            clinicalWhy: {
              en: 'In mild choking with an effective cough, physical thrusts are not indicated; encourage coughing and observe (Slides 7 & 26).',
              ar: 'في الاختناق الخفيف مع سعال فعّال، لا تُستخدم ضغطات البطن؛ شجّعه على السعال وراقبه (شريحة ٧ و٢٦).',
            },
            internalEffect: {
              en: 'External abdominal pressure interferes with his own strong cough effort.',
              ar: 'الضغط الخارجي يربك مجهود السعال الطبيعي.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'retry',
          },
        },
      ],
    },
    takeaways: [
      {
        en: 'Ask "Are you choking?" — if they can speak and cough strongly, encourage coughing and stay watching.',
        ar: 'اسأل «هل تختنق؟» — لو يقدر يتكلم ويسعل بقوة، شجّعه على السعال وراقبه.',
      },
      {
        en: 'If the cough becomes weak or silent, treat it immediately as severe choking.',
        ar: 'لو السعال ضعف أو سكت، اعتبرها اختناقاً شديداً فوراً.',
      },
    ],
  },

  // =========================================================================
  // A2 · الصمت في المعمل (طارق، معمل الكمبيوتر/الورشة) — شديد (REFERENCE LEVEL)
  // =========================================================================
  {
    id: 'A2',
    levelNumber: 2,
    ageGroup: 'adult',
    severity: 'severe',
    patientState: 'conscious',
    isReferenceImplementation: true,
    clinicalReview: false,
    lectureSlideRefs: [
      'Slide 8',
      'Slide 9',
      'Slide 10',
      'Slide 11',
      'Slide 12',
      'Slide 13',
      'Slide 14',
      'Slide 17',
      'Slide 25',
      'Slide 28',
      'Slide 29',
    ],
    ruleTags: ['R-EMS', 'R-NOSLAP', 'R-WATER', 'R-SWEEP', 'R-AFTER'],
    title: {
      en: 'Silence in the Lab',
      ar: 'الصمت في المعمل',
    },
    subtitle: {
      en: `${tariqEn} (34 yrs) • Computer Lab (Severe Choking — Reference Level)`,
      ar: `${tariqAr} (٣٤ سنة) • معمل الكمبيوتر (اختناق شديد — المستوى المرجعي)`,
    },
    setting: {
      en: 'University Computer Lab',
      ar: 'معمل الكمبيوتر بالجامعة',
    },
    character: {
      name: CHARACTER_REGISTRY.adult.name,
      age: CHARACTER_REGISTRY.adult.ageDisplay,
      role: CHARACTER_REGISTRY.adult.defaultRole,
    },
    hook: {
      en: `${tariqEn} stands up suddenly in the computer lab clutching his neck with no sound or cough. What will you do?`,
      ar: `يقف ${tariqAr} فجأة في معمل الكمبيوتر ويمسك رقبته بلا صوت ولا سعال. ماذا ستفعل؟`,
    },
    objective: {
      en: 'Tell someone to call EMS (speakerphone if alone), stand to his side and slightly behind, support his chest and lean him forward for up to 5 back blows, then up to 5 abdominal thrusts, alternating until clear.',
      ar: 'اطلب من شخص الاتصال بالإسعاف (سبيكر لو لوحدك)، قف على جنبه وخلفه قليلاً، ادعم صدره وأمِله للأمام لعمل حتى ٥ ضربات ظهر، ثم حتى ٥ ضغطات بطن بالتبادل.',
    },
    EstimatedMinutes: 3,
    PlainLanguageMap: {
      spO2: { en: 'Oxygen level', ar: 'مستوى الأكسجين' },
      airway: { en: 'Breathing passage', ar: 'مجرى التنفس' },
      cyanosis: { en: 'Blue lips', ar: 'زرقة الشفاه' },
      epiglottis: { en: 'Throat valve', ar: 'صمام الحلق' },
    },
    afterCareNote: {
      en: `After-care (R-AFTER, Slide 14): Confirm ${tariqEn} is breathing normally, continue observing him, and ensure he receives a medical assessment after abdominal thrusts.`,
      ar: `ما بعد الإنقاذ (R-AFTER، شريحة ١٤): تأكد أن ${tariqAr} يتنفس طبيعياً، استمر في المراقبة، ولازم تقييم طبي بعد ضغطات البطن.`,
    },
    sceneVisual: {
      environment: 'home_workplace_lounge',
      accentColor: '#13B8B0',
      mood: 'critical',
      obstructionLevel: 95,
      spO2Start: 88,
      spO2Critical: 82,
      heartRateStart: 124,
      respiratoryRate: 0,
      hasCyanosis: true,
      hasStridor: false,
      canSpeak: false,
      canCough: false,
      caption: {
        en: `${tariqEn} clutches his neck in silence in the computer lab as his lips turn pale/blue.`,
        ar: `${tariqAr} يمسك رقبته بصمت في معمل الكمبيوتر مع شحوب وزرقة الشفاه.`,
      },
      hotspots: [
        {
          id: 'a2-hs-panic',
          x: 0.485,
          y: 0.315,
          type: 'symptom',
          label: { en: 'Wide panicked eyes & sweat', ar: 'ذعر واضح وعينان متسعتان' },
          detail: {
            en: 'Wide eyes and silent panic show he is conscious and needs immediate help.',
            ar: 'اتساع العينين وعلامات الذعر تؤكد أن المصاب واعٍ ويستغيث بصمت.',
          },
        },
        {
          id: 'a2-hs-lips',
          x: 0.483,
          y: 0.450,
          type: 'symptom',
          label: { en: 'Pale / bluish lips', ar: 'شفاه شاحبة/زرقاء' },
          detail: {
            en: 'Lips are turning pale and bluish because oxygen is dropping rapidly.',
            ar: 'شحوب وزرقة الشفاه يدل على هبوط مستوى الأكسجين بسرعة.',
          },
        },
        {
          id: 'a2-hs-voice',
          x: 0.548,
          y: 0.522,
          type: 'airway',
          label: { en: 'Cannot speak • No effective cough', ar: 'لا يقدر يتكلم · لا سعال فعّال' },
          detail: {
            en: 'The breathing passage in the throat is completely blocked so no voice or cough comes out.',
            ar: 'انسداد كامل في مجرى الهواء بالحلق يمنع خروج أي صوت أو سعال فعّال.',
          },
        },
        {
          id: 'a2-hs-throat',
          x: 0.508,
          y: 0.635,
          type: 'symptom',
          label: { en: 'Both hands on throat', ar: 'إيدين على الرقبة' },
          detail: {
            en: 'Both hands clutching the neck — the universal sign of severe choking (Slide 9).',
            ar: 'القبض باليدين حول الرقبة — العلامة العالمية للاختناق الشديد (سلايد ٩).',
          },
        },
      ],
    },
    storyBeats: [
      {
        id: 'a2-s1',
        phase: 'intro',
        durationSec: 4,
        mediaKey: 'a2_s1_lab_snack_wide',
        speaker: { en: 'Story 1 · Computer Lab', ar: 'قصة ١ · معمل الجامعة' },
        text: {
          en: `In the university lab, students are focused on their work at the computers.`,
          ar: `في معمل الجامعة، الطلاب مركزين في شغلهم على الأجهزة.`,
        },
        clinicalCue: {
          en: 'Breathing passage open • Oxygen level 99%',
          ar: 'مجرى التنفس مفتوح • مستوى الأكسجين ٩٩٪',
        },
        spO2: 99,
        heartRate: 76,
      },
      {
        id: 'a2-s2',
        phase: 'escalation',
        durationSec: 4,
        mediaKey: 'a2_s2_stands_pushes_chair',
        speaker: { en: 'Story 2 · Eating at the Computer', ar: 'قصة ٢ · الأكل قدام الجهاز' },
        text: {
          en: `${tariqEn} is eating a sandwich quickly in front of his computer.`,
          ar: `${tariqAr} بياكل ساندوتش بسرعة قدام الجهاز.`,
        },
        clinicalCue: {
          en: 'Eating quickly while distracted (Slide 4)',
          ar: 'الأكل بسرعة أثناء الانشغال بالجهاز (شريحة ٤)',
        },
        spO2: 96,
        heartRate: 92,
      },
      {
        id: 'a2-s3',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'a2_s3_clutch_throat_silent',
        speaker: { en: 'Story 3 · Sudden Silent Choking', ar: 'قصة ٣ · صمت مفاجئ' },
        text: {
          en: `Suddenly he stands up and clutches his throat with both hands — no sound comes out!`,
          ar: `فجأة وقف ومسك رقبته بإيديه، ومفيش أي صوت طالع!`,
        },
        clinicalCue: {
          en: 'Hands on throat • Breathing passage blocked',
          ar: 'إيدين على الرقبة • انسداد مجرى التنفس',
        },
        spO2: 91,
        heartRate: 115,
      },
      {
        id: 'a2-s4',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'a2_s4_cyanosis_colleague_rushes',
        speaker: { en: 'Story 4 · Colleagues Notice Danger', ar: 'قصة ٤ · انتباه الزملاء' },
        text: {
          en: `No sound and no effective cough, and his colleagues begin to notice the danger.`,
          ar: `لا صوت ولا سعال فعّال، والزملاء بدأوا ينتبهوا للخطر.`,
        },
        clinicalCue: {
          en: 'No voice • No effective cough • Oxygen level 88%',
          ar: 'لا صوت • لا سعال فعّال • مستوى الأكسجين ٨٨٪',
        },
        spO2: 88,
        heartRate: 122,
      },
      {
        id: 'a2-s5',
        phase: 'decision_prompt',
        durationSec: 5,
        mediaKey: 'a2_s5_decision_moment',
        speaker: { en: 'Story 5 + Look · Inspect & Decide', ar: 'قصة ٥ + الفحص · افحص وقرّر' },
        text: {
          en: `${tariqEn} cannot speak or cough, and his lips are turning pale.. What is your decision?`,
          ar: `${tariqAr} لا يتكلم ولا يسعل، وشفاهه بتشحب.. قرارك إيه؟`,
        },
        clinicalCue: {
          en: 'Tap the glowing circles on Tariq to inspect his signs',
          ar: 'اضغط على الدوائر المضيئة على طارق لفحص المؤشرات',
        },
        spO2: 86,
        heartRate: 126,
      },
    ],
    decisionNode: {
      id: 'a2-d1',
      prompt: {
        en: `${tariqEn} cannot speak or cough, and his lips are turning pale.. What is your decision?`,
        ar: `${tariqAr} لا يتكلم ولا يسعل، وشفاهه بتشحب.. قرارك إيه؟`,
      },
      contextNote: {
        en: 'Back-blow mistakes to avoid (Slide 11): standing upright, weak blows, random blows on the neck, delaying EMS.',
        ar: 'أخطاء الضربات الظهرية (سلايد ١١): الوقوف عمودياً، ضربات ضعيفة، ضربات عشوائية على الرقبة، تأخير الإسعاف.',
      },
      timeLimitSec: 20,
      choices: [
        {
          id: 'a2-c1',
          label: {
            en: 'Have someone call EMS (speaker if alone) · stand to his side/behind, support chest & lean forward · up to 5 back blows between shoulder blades · reassess · up to 5 belly thrusts (inward & upward) · alternate until clear',
            ar: 'اطلب من حد يتصل بالإسعاف (سبيكر لو لوحدك) · قف على جنبه وخلفه شوية، ادعم صدره، اميّله للأمام · حتى ٥ ضربات ظهر بكعب اليد بين لوحَي الكتف · أعد التقييم · حتى ٥ ضغطات بطن (فوق السرة وتحت عظمة القص، للداخل وللأعلى) · بدّل لحد ما يخرج الجسم',
          },
          subLabel: {
            en: 'Slides 8–14, 17, 25, 28–29 • Rules R-EMS, R-AFTER',
            ar: 'السلايدات ٨–١٤، ١٧، ٢٥، ٢٨–٢٩ • القواعد R-EMS, R-AFTER',
          },
          outcome: 'optimal',
          spO2Delta: 12,
          obstructionDelta: -95,
          consequenceBeat: {
            mediaKey: 'a2_o3_object_expelled_breathing',
            playbackFrames: [
              {
                id: 'a2-o1',
                stageLabel: { en: 'Correct Result — Start', ar: 'نتيجة صح — بداية' },
                mediaKey: 'a2_o1_lean_forward_back_blows',
                caption: {
                  en: `Call emergency services, support his chest, and lean him forward before back blows.`,
                  ar: `اتصل بالإسعاف، سند صدره، وميّله للأمام قبل الضربات.`,
                },
                spO2: 88,
                heartRate: 120,
              },
              {
                id: 'a2-o2',
                stageLabel: { en: 'Correct Result — Action', ar: 'نتيجة صح — تنفيذ' },
                mediaKey: 'a2_o2_abdominal_thrusts_in_up',
                caption: {
                  en: `Alternate between up to 5 back blows and up to 5 abdominal thrusts until the object comes out.`,
                  ar: `بدّل بين حتى ٥ ضربات ظهر وحتى ٥ ضغطات بطن لحد ما يخرج الجسم.`,
                },
                spO2: 93,
                heartRate: 108,
              },
              {
                id: 'a2-o3',
                stageLabel: { en: 'Correct Result — Outcome', ar: 'نتيجة صح — نتيجة' },
                mediaKey: 'a2_o3_object_expelled_breathing',
                caption: {
                  en: `The foreign object came out! Check breathing and continue monitoring and medical evaluation.`,
                  ar: `خرج الجسم الغريب! تأكد من التنفس واستمر في المراقبة والتقييم الطبي.`,
                },
                spO2: 98,
                heartRate: 88,
              },
            ],
            title: {
              en: 'The Foreign Object Came Out! Breathing Restored',
              ar: 'خرج الجسم الغريب! تأكد من التنفس واستمر في المراقبة والتقييم الطبي',
            },
            narrative: {
              en: `You activated EMS, leaned ${tariqEn} forward while supporting his chest, and alternated up to 5 back blows between the shoulder blades with up to 5 inward-and-upward abdominal thrusts above the navel until the blockage came out.`,
              ar: `اتصلت بالإسعاف، سندت صدر ${tariqAr} وميّلته للأمام، وبدّلت بين حتى ٥ ضربات ظهر بكعب اليد بين لوحَي الكتف وحتى ٥ ضغطات بطن للداخل وللأعلى فوق السرة حتى خرج الجسم الغريب.`,
            },
            clinicalWhy: {
              en: 'Slides 8–14 & 28–29: Call EMS early, lean the patient forward so gravity helps the object exit, give up to 5 separate back blows between shoulder blades, reassess, then give up to 5 inward-and-upward abdominal thrusts above the navel, followed by medical evaluation (R-AFTER).',
              ar: 'سلايدات ٨–١٤ و٢٨–٢٩: اتصل بالإسعاف، سند صدره وميّله للأمام، نفّذ حتى ٥ ضربات ظهر منفصلة بكعب اليد بين لوحَي الكتف مع إعادة التقييم، ثم حتى ٥ ضغطات بطن فوق السرة وتحت القص للداخل وللأعلى، وبعد الإنقاذ استمر في المراقبة والتقييم الطبي (R-AFTER).',
            },
            internalEffect: {
              en: 'Back blows and upward diaphragm thrusts generate sharp airway pressure that dislodges the obstruction.',
              ar: 'ضربات الظهر وضغطات البطن تولّد دفعة هوائية تطرد الانسداد من مجرى التنفس.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'complete',
          },
        },
        {
          id: 'a2-c2',
          label: {
            en: 'Ask him to drink water',
            ar: 'اطلب منه يشرب ماء',
          },
          subLabel: {
            en: 'No swallowing; oxygen drops (R-WATER)',
            ar: 'مفيش بلع والأكسجين ينزل (R-WATER)',
          },
          outcome: 'harmful',
          spO2Delta: -10,
          obstructionDelta: 5,
          consequenceBeat: {
            mediaKey: 'a2_o4_err_water',
            title: {
              en: 'Wrong Result B — No Swallowing & Water Blocks Air Further (R-WATER)',
              ar: 'نتيجة خطأ ب — مفيش بلع والاختناق شديد؛ الماء هيمنع الهواء أكتر (R-WATER)',
            },
            narrative: {
              en: `No swallowing is possible during severe choking; water blocks the breathing passage further and oxygen keeps falling (R-WATER).`,
              ar: `مفيش بلع والاختناق شديد؛ الماء هيمنع الهواء أكتر والأكسجين بينزل (R-WATER).`,
            },
            clinicalWhy: {
              en: 'Rule R-WATER (Slides 25 & 28): Never give water to a choking person; they cannot swallow and liquid worsens airway obstruction.',
              ar: 'قاعدة R-WATER (سلايد ٢٥ و٢٨): ممنوع إعطاء الماء وقت الاختناق؛ المصاب لا يقدر على البلع والماء يزيد انسداد مجرى الهواء.',
            },
            internalEffect: {
              en: 'Liquid pools above the blocked airway and prevents air entry.',
              ar: 'السائل يتجمع فوق الانسداد ويمنع مرور الهواء.',
            },
            guidelineBadge: 'ARC',
            nextAction: 'retry',
          },
        },
        {
          id: 'a2-c3',
          label: {
            en: 'Put your fingers into his mouth',
            ar: 'ادخل صوابعك في بقه',
          },
          subLabel: {
            en: 'Pushes object deeper — critical error (R-SWEEP)',
            ar: 'الجسم يتدفع أعمق — خطأ حرج (R-SWEEP)',
          },
          outcome: 'harmful',
          spO2Delta: -14,
          obstructionDelta: 5,
          consequenceBeat: {
            mediaKey: 'a2_o5_err_blind_sweep',
            title: {
              en: 'Wrong Result C — Blind Finger Sweep Pushes Object Deeper (R-SWEEP)',
              ar: 'نتيجة خطأ ج — المسح الأعمى بالأصابع ممكن يدفع الجسم أعمق جوه مجرى الهواء (R-SWEEP)',
            },
            narrative: {
              en: `A blind finger sweep can push the foreign object deeper into the breathing passage (R-SWEEP, critical mistake).`,
              ar: `المسح الأعمى بالأصابع ممكن يدفع الجسم أعمق جوه مجرى الهواء (R-SWEEP، خطأ حرج).`,
            },
            clinicalWhy: {
              en: 'Rule R-SWEEP (Slides 17 & 25): Never perform a blind finger sweep; only remove an object if it is clearly visible.',
              ar: 'قاعدة R-SWEEP (سلايد ١٧ و٢٥): ممنوع المسح الأعمى بالأصابع نهائياً؛ لأنه يدفع الجسم الغريب أعمق داخل مجرى التنفس.',
            },
            internalEffect: {
              en: 'Blind fingers wedge the obstruction deeper into the larynx.',
              ar: 'إدخال الأصابع بشكل أعمى يحشر الجسم الغريب أعمق في الحنجرة.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'retry',
          },
        },
      ],
    },
    takeaways: [
      {
        en: 'Lean the adult well forward and deliver up to 5 separate back blows between the shoulder blades (Slides 9–11).',
        ar: 'أمِل البالغ جيداً للأمام ووجّه حتى ٥ ضربات ظهر منفصلة بين لوحَي الكتف (شرائح ٩–١١).',
      },
      {
        en: 'If back blows fail, give up to 5 inward-and-upward abdominal thrusts with your fist above the navel and below the sternum (Slides 12–13).',
        ar: 'إذا لم تنجح ضربات الظهر، نفّذ حتى ٥ ضغطات بطن للداخل وللأعلى بقبضة اليد فوق السرة وتحت عظمة القص (شرائح ١٢–١٣).',
      },
      {
        en: 'After expulsion, confirm normal breathing, keep observing, and arrange medical assessment (Slide 14).',
        ar: 'بعد خروج الجسم، تأكد من التنفس الطبيعي، استمر في المراقبة، ووجّه المصاب لتقييم طبي (شريحة ١٤).',
      },
    ],
  },

  // =========================================================================
  // A3 · لما يقع فاقد الوعي (طارق) — فاقد الوعي (Slides 15–17)
  // =========================================================================
  {
    id: 'A3',
    levelNumber: 3,
    ageGroup: 'adult',
    severity: 'unresponsive',
    patientState: 'unconscious',
    clinicalReview: false,
    lectureSlideRefs: ['Slide 15', 'Slide 16', 'Slide 17', 'Slide 30', 'Slide 31'],
    ruleTags: ['R-EMS', 'R-SWEEP', 'R-AFTER'],
    title: {
      en: 'When He Collapses Unresponsive',
      ar: 'لما يقع فاقد الوعي',
    },
    subtitle: {
      en: `${tariqEn} (34 yrs) • Unresponsive Choking Victim`,
      ar: `${tariqAr} (٣٤ سنة) • مصاب اختناق فاقد الوعي`,
    },
    setting: {
      en: 'University Computer Lab',
      ar: 'معمل الكمبيوتر بالجامعة',
    },
    character: {
      name: CHARACTER_REGISTRY.adult.name,
      age: CHARACTER_REGISTRY.adult.ageDisplay,
      role: CHARACTER_REGISTRY.adult.defaultRole,
    },
    hook: {
      en: `Rescue attempts are still ongoing when ${tariqEn} collapses and becomes unresponsive. What will you do?`,
      ar: `محاولات الإنقاذ ما زالت مستمرة وفجأة يسقط ${tariqAr} ويفقد الاستجابة. ماذا ستفعل؟`,
    },
    objective: {
      en: 'Lower him safely onto a firm flat surface, ensure EMS is activated, start CPR according to your training, follow AED/dispatcher instructions, and never perform a blind finger sweep.',
      ar: 'أنزله بأمان على سطح صلب مستوٍ، تأكد من تفعيل الإسعاف، ابدأ الإنعاش حسب تدريبك، واتبع تعليمات AED/المرسل دون أي مسح أعمى بالأصابع.',
    },
    EstimatedMinutes: 3,
    PlainLanguageMap: {
      spO2: { en: 'Oxygen level', ar: 'مستوى الأكسجين' },
      airway: { en: 'Breathing passage', ar: 'مجرى التنفس' },
      cyanosis: { en: 'Blue lips', ar: 'زرقة الشفاه' },
      epiglottis: { en: 'Throat valve', ar: 'صمام الحلق' },
    },
    afterCareNote: {
      en: `Continue resuscitation according to your training and follow dispatcher/AED instructions until emergency services take over (Slides 15–17).`,
      ar: `استمر في الإنعاش حسب تدريبك واتبع تعليمات مرسل الإسعاف وجهاز AED حتى يتسلم المسعفون الحالة (شرائح ١٥–١٧).`,
    },
    sceneVisual: {
      environment: 'home_workplace_lounge',
      accentColor: '#E5484D',
      mood: 'critical',
      obstructionLevel: 100,
      spO2Start: 78,
      spO2Critical: 72,
      heartRateStart: 54,
      respiratoryRate: 0,
      hasCyanosis: true,
      hasStridor: false,
      canSpeak: false,
      canCough: false,
      caption: {
        en: `${tariqEn} is unresponsive, motionless, and not breathing normally.`,
        ar: `${tariqAr} لا يستجيب، لا يتحرك، ولا يتنفس طبيعياً.`,
      },
      hotspots: [
        {
          id: 'a3-hs-response',
          x: 47,
          y: 26,
          type: 'symptom',
          label: { en: 'Unresponsive & motionless', ar: 'لا يستجيب ولا يتحرك' },
          detail: {
            en: `${tariqEn} does not respond to voice or touch.`,
            ar: `${tariqAr} فاقد للوعي تماماً ولا يستجيب.`,
          },
        },
        {
          id: 'a3-hs-breathing',
          x: 50,
          y: 46,
          type: 'airway',
          label: { en: 'Not breathing normally', ar: 'لا يتنفس طبيعياً' },
          detail: {
            en: 'Normal breathing is absent — immediate CPR according to your training is required.',
            ar: 'التنفس الطبيعي متوقف — يلزم بدء الإنعاش حسب التدريب فوراً.',
          },
        },
        {
          id: 'a3-hs-mouth',
          x: 49,
          y: 32,
          type: 'anatomy',
          label: { en: 'Visible object check only', ar: 'إزالة الجسم المرئي فقط' },
          detail: {
            en: 'Only remove an object if clearly visible in the mouth; never do a blind sweep (Slide 17).',
            ar: 'أزل الجسم فقط إذا كان مرئياً بوضوح في الفم؛ وممنوع المسح الأعمى (شريحة ١٧).',
          },
        },
      ],
    },
    storyBeats: [
      {
        id: 'a3-s1',
        phase: 'intro',
        durationSec: 4,
        mediaKey: 'a3_s1_rescue_ongoing',
        speaker: { en: 'S1 · Rescue Ongoing', ar: 'S1 · المحاولات مستمرة' },
        text: {
          en: `Rescue attempts are still ongoing in the lab, but the obstruction has not cleared yet.`,
          ar: `محاولات الإنقاذ ما زالت مستمرة في المعمل، لكن الجسم العالق لم يخرج بعد.`,
        },
        clinicalCue: {
          en: 'Persistent severe obstruction • Oxygen dropping',
          ar: 'استمرار الانسداد الشديد • هبوط الأكسجين',
        },
        spO2: 82,
        heartRate: 108,
      },
      {
        id: 'a3-s2',
        phase: 'escalation',
        durationSec: 4,
        mediaKey: 'a3_s2_tariq_collapses',
        speaker: { en: 'S2 · Sudden Collapse', ar: 'S2 · سقوط المصاب' },
        text: {
          en: `${tariqEn} loses strength and begins to collapse.`,
          ar: `تنهار قوى ${tariqAr} ويبدأ في السقوط.`,
        },
        clinicalCue: {
          en: 'Loss of consciousness from hypoxia (Slide 15)',
          ar: 'فقدان الوعي بسبب نقص الأكسجين (شريحة ١٥)',
        },
        spO2: 79,
        heartRate: 76,
      },
      {
        id: 'a3-s3',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'a3_s3_colleague_supports_fall',
        speaker: { en: 'S3 · Supporting the Fall', ar: 'S3 · إسناد المصاب' },
        text: {
          en: `The colleague supports ${tariqEn} carefully to prevent his head from hitting the floor.`,
          ar: `يسنده الزميل بحذر ليمنع ارتطام رأسه بالأرض.`,
        },
        clinicalCue: {
          en: 'Lower safely to a firm flat surface (Slide 16)',
          ar: 'إنزال آمن على سطح صلب ومستوٍ (شريحة ١٦)',
        },
        spO2: 78,
        heartRate: 64,
      },
      {
        id: 'a3-s4',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'a3_s4_unresponsive_floor',
        speaker: { en: 'S4 · No Response', ar: 'S4 · لا استجابة' },
        text: {
          en: `${tariqEn} lies on the floor with no response, no movement, and no normal breathing.`,
          ar: `${tariqAr} على الأرض بلا استجابة، ولا حركة، ولا تنفس طبيعي.`,
        },
        clinicalCue: {
          en: 'Unresponsive • Not breathing normally',
          ar: 'لا يستجيب • لا يتنفس طبيعياً',
        },
        spO2: 77,
        heartRate: 56,
      },
      {
        id: 'a3-s5',
        phase: 'decision_prompt',
        durationSec: 5,
        mediaKey: 'a3_s5_decision_moment',
        speaker: { en: 'S5 · Decision Moment', ar: 'S5 · لحظة القرار' },
        text: {
          en: `${tariqEn} is now unresponsive. Check the signs and choose your immediate action!`,
          ar: `${tariqAr} فاقد للوعي الآن. افحص العلامات واختر تصرفك الفوري!`,
        },
        clinicalCue: {
          en: 'Slides 15–17 & 30–31: Unresponsive choking protocol',
          ar: 'شرائح ١٥–١٧ و٣٠–٣١: بروتوكول فاقد الوعي',
        },
        spO2: 76,
        heartRate: 54,
      },
    ],
    decisionNode: {
      id: 'a3-d1',
      prompt: {
        en: `${tariqEn} collapsed and is unresponsive. What should you do?`,
        ar: `${tariqAr} سقط فاقداً للوعي. ماذا يجب أن تفعل؟`,
      },
      contextNote: {
        en: 'Slides 15–17: Lower to firm flat surface, ensure EMS is activated, start CPR according to your training, and never sweep blindly.',
        ar: 'شرائح ١٥–١٧: أنزله على سطح صلب مستوٍ، تأكد من تفعيل الإسعاف، ابدأ الإنعاش حسب تدريبك، ولا تقم بالمسح الأعمى.',
      },
      timeLimitSec: 20,
      choices: [
        {
          id: 'a3-c1',
          label: {
            en: 'Lower him safely onto a firm flat surface, ensure EMS is activated, start CPR according to your training, and follow AED/dispatcher instructions',
            ar: 'أنزله بأمان على سطح صلب مستوٍ، تأكد أن الإسعاف مفعّل، ابدأ الإنعاش حسب تدريبك، واتبع تعليمات AED/المرسل',
          },
          subLabel: {
            en: 'Only remove an object from the mouth if clearly visible (Slides 15–17)',
            ar: 'أزل الجسم من الفم فقط إذا كان مرئياً بوضوح (شرائح ١٥–١٧)',
          },
          outcome: 'optimal',
          spO2Delta: 16,
          obstructionDelta: -100,
          consequenceBeat: {
            mediaKey: 'a3_o3_cpr_by_training',
            playbackFrames: [
              {
                id: 'a3-o1',
                stageLabel: { en: '1. Firm Flat Surface', ar: '١. سطح صلب ومستوٍ' },
                mediaKey: 'a3_o1_lower_firm_floor',
                caption: {
                  en: `You position ${tariqEn} flat on his back on the firm floor.`,
                  ar: `تضع ${tariqAr} بأمان على ظهره فوق أرضية صلبة ومستوية.`,
                },
                spO2: 78,
                heartRate: 58,
              },
              {
                id: 'a3-o2',
                stageLabel: { en: '2. Confirm EMS & Speakerphone', ar: '٢. تأكيد الإسعاف ومكبر الصوت' },
                mediaKey: 'a3_o2_activate_ems_aed',
                caption: {
                  en: `You confirm 123 ambulance is on speakerphone and request an AED.`,
                  ar: `تتأكد من تفعيل الإسعاف ١٢٣ على السبيكر وطلب جهاز AED.`,
                },
                spO2: 82,
                heartRate: 68,
              },
              {
                id: 'a3-o3',
                stageLabel: { en: '3. Start CPR According to Training', ar: '٣. بدء الإنعاش حسب التدريب' },
                mediaKey: 'a3_o3_cpr_by_training',
                caption: {
                  en: `You start CPR according to your training, checking the mouth only for a visible object, and follow dispatcher instructions.`,
                  ar: `تبدأ الإنعاش حسب تدريبك مع فحص الفم للجسم المرئي فقط، وتتبع تعليمات المرسل.`,
                },
                spO2: 92,
                heartRate: 84,
              },
            ],
            title: {
              en: 'Correct Unresponsive Choking Protocol!',
              ar: 'تطبيق صحيح لبروتوكول فاقد الوعي!',
            },
            narrative: {
              en: `You lowered ${tariqEn} onto a firm flat surface, ensured EMS was active, and began CPR according to your training while checking only for visible objects.`,
              ar: `أنزلت ${tariqAr} على سطح صلب مستوٍ، وتأكدت من تفعيل الإسعاف، وبدأت الإنعاش حسب تدريبك مع فحص الفم للجسم المرئي فقط.`,
            },
            clinicalWhy: {
              en: 'Slides 15–17 & 30–31: When a choking person becomes unresponsive, lower gently to a firm flat surface, activate EMS, start CPR according to your training, and never perform a blind finger sweep.',
              ar: 'شرائح ١٥–١٧ و٣٠–٣١: عند فقدان الوعي، أنزل المصاب على سطح صلب مستوٍ، فعّل الإسعاف، ابدأ الإنعاش حسب تدريبك، ولا تقم أبداً بالمسح الأعمى بالأصابع.',
            },
            internalEffect: {
              en: 'Chest compressions maintain blood flow and generate airway pressure to dislodge the obstruction.',
              ar: 'ضغطات الصدر تحافظ على تدفق الدم وتولّد ضغطاً يساعد على تحريك الجسم العالق.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'complete',
          },
        },
        {
          id: 'a3-c2',
          label: {
            en: 'Sit him upright on a chair and wait for the ambulance',
            ar: 'أقعده على كرسي وانتظر وصول الإسعاف',
          },
          subLabel: {
            en: 'Dangerous delay in resuscitation',
            ar: 'تأخير خطير للإنعاش',
          },
          outcome: 'harmful',
          spO2Delta: -12,
          obstructionDelta: 0,
          consequenceBeat: {
            mediaKey: 'a3_o4_err_sit_chair_wait',
            title: {
              en: 'Critical Delay — Unresponsive Victim Needs Immediate CPR',
              ar: 'تأخير خطير — فاقد الوعي يحتاج للإنعاش فوراً على سطح مستوٍ',
            },
            narrative: {
              en: `Sitting an unresponsive person on a chair leaves his airway blocked and delays life-saving resuscitation.`,
              ar: `إجلاس مصاب فاقد للوعي على كرسي يترك مجرى التنفس مسدوداً ويؤخر الإنعاش المنقذ للحياة.`,
            },
            clinicalWhy: {
              en: 'Slide 16 & 25: Do not delay resuscitation; place on a firm flat surface and start CPR immediately.',
              ar: 'شريحة ١٦ و٢٥: لا تؤخر الإنعاش؛ ضعه على سطح صلب مستوٍ وابدأ الإنعاش فوراً.',
            },
            internalEffect: {
              en: 'Zero oxygen delivery or circulation while waiting passively.',
              ar: 'انعدام وصول الأكسجين والدورة الدموية أثناء الانتظار السلبي.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'retry',
          },
        },
        {
          id: 'a3-c3',
          label: {
            en: 'Perform a blind finger sweep deep inside his mouth',
            ar: 'مسح أعمى بالأصابع داخل فمه',
          },
          subLabel: {
            en: 'Critical error (Rule R-SWEEP)',
            ar: 'خطأ حرج (قاعدة R-SWEEP)',
          },
          outcome: 'harmful',
          spO2Delta: -14,
          obstructionDelta: 5,
          consequenceBeat: {
            mediaKey: 'a3_o5_err_blind_sweep',
            title: {
              en: 'Critical Error — Never Sweep Blindly (R-SWEEP)',
              ar: 'خطأ حرج — ممنوع المسح الأعمى بالأصابع (R-SWEEP)',
            },
            narrative: {
              en: `Blindly sweeping inside ${tariqEn}'s mouth pushes the object deeper into the airway.`,
              ar: `المسح الأعمى بالأصابع يدفع الجسم الغريب أعمق داخل مجرى التنفس.`,
            },
            clinicalWhy: {
              en: 'Slide 17 & 31: NEVER blindly put your fingers into the mouth — only remove an object if clearly visible.',
              ar: 'شريحة ١٧ و٣١: لا تدخل أصابعك بشكل أعمى في الفم أبداً — أزل الجسم فقط إذا كان مرئياً بوضوح.',
            },
            internalEffect: {
              en: 'Impacts the unseen object deeper into the larynx.',
              ar: 'يحشر الجسم غير المرئي أعمق داخل الحنجرة.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'retry',
          },
        },
      ],
    },
    takeaways: [
      {
        en: 'Lower an unresponsive choking victim onto a firm flat surface and ensure EMS is activated (Slide 16).',
        ar: 'أنزل مصاب الاختناق الفاقد للوعي على سطح صلب مستوٍ وتأكد من تفعيل الإسعاف (شريحة ١٦).',
      },
      {
        en: 'Start CPR according to your training and never perform a blind finger sweep (Slide 16–17).',
        ar: 'ابدأ الإنعاش حسب تدريبك ولا تقم أبداً بالمسح الأعمى بالأصابع (شريحة ١٦–١٧).',
      },
    ],
  },

  // =========================================================================
  // A4 · لما الوضع العادي مايصلحش (زميلة حامل، المعمل) — Slide 22
  // =========================================================================
  {
    id: 'A4',
    levelNumber: 4,
    ageGroup: 'adult',
    severity: 'severe',
    patientState: 'conscious',
    clinicalReview: true,
    clinicalReviewReason:
      'Doctor confirmation requested for exact description of chest thrust hand placement and technique in late pregnancy / large person (Slide 22 — Section 4 A4 & Section 7 Q1).',
    lectureSlideRefs: ['Slide 22'],
    ruleTags: ['R-EMS', 'R-PREG', 'R-WATER', 'R-AFTER'],
    title: {
      en: 'When Standard Thrusts Do Not Fit',
      ar: 'لما الوضع العادي مايصلحش',
    },
    subtitle: {
      en: `${pregEn} (Late Pregnancy) • Chest Thrusts Instead of Abdominal`,
      ar: `${pregAr} (في آخر الحمل) • ضغطات الصدر بدل البطن`,
    },
    setting: {
      en: 'University Lab',
      ar: 'معمل الجامعة',
    },
    character: {
      name: { en: pregEn, ar: pregAr },
      age: { en: 'Late Pregnancy', ar: 'في آخر الحمل' },
      role: { en: 'Adult Special Case (Slide 22)', ar: 'حالة خاصة للبالغين (شريحة ٢٢)' },
    },
    hook: {
      en: `In the lab, ${pregEn} in late pregnancy suddenly clutches her neck and cannot make a sound. Abdominal thrusts cannot be done safely. What will you do?`,
      ar: `في المعمل، ${pregAr} في آخر الحمل تمسك رقبتها فجأة وتسكت، ولا يمكن تطبيق ضغطات البطن بأمان. ماذا ستفعل؟`,
    },
    objective: {
      en: 'Call EMS early, use chest thrusts instead of abdominal thrusts after back blows, and continue cycles until the object clears or she becomes unresponsive.',
      ar: 'اتصل بالإسعاف مبكراً، واستخدم ضغطات الصدر بدلاً من ضغطات البطن، وأكمل الدورات حتى يخرج الجسم أو تفقد الوعي.',
    },
    EstimatedMinutes: 3,
    PlainLanguageMap: {
      spO2: { en: 'Oxygen level', ar: 'مستوى الأكسجين' },
      airway: { en: 'Breathing passage', ar: 'مجرى التنفس' },
      cyanosis: { en: 'Blue lips', ar: 'زرقة الشفاه' },
      epiglottis: { en: 'Throat valve', ar: 'صمام الحلق' },
    },
    afterCareNote: {
      en: `Ensure ${pregEn} receives an immediate medical evaluation after chest thrusts to check both mother and baby (Slides 14 & 22).`,
      ar: `تأكد من خضوع ${pregAr} لتقييم طبي فوري بعد ضغطات الصدر للاطمئنان عليها وعلى الجنين (شريحة ١٤ و٢٢).`,
    },
    sceneVisual: {
      environment: 'home_workplace_lounge',
      accentColor: '#13B8B0',
      mood: 'critical',
      obstructionLevel: 95,
      spO2Start: 88,
      spO2Critical: 83,
      heartRateStart: 122,
      respiratoryRate: 0,
      hasCyanosis: true,
      hasStridor: false,
      canSpeak: false,
      canCough: false,
      caption: {
        en: `${pregEn} clutches her neck silently while colleagues hesitate over where to place their hands.`,
        ar: `${pregAr} تمسك رقبتها بصمت بينما يتردد الزملاء في موضع وضع اليدين.`,
      },
      hotspots: [
        {
          id: 'a4-hs-neck',
          x: 49,
          y: 31,
          type: 'symptom',
          label: { en: 'Hands on neck • Silent', ar: 'إيدين على الرقبة • لا صوت' },
          detail: {
            en: 'Cannot speak and has no effective cough — severe choking.',
            ar: 'لا تتكلم ولا يوجد سعال فعّال — اختناق شديد.',
          },
        },
        {
          id: 'a4-hs-chest',
          x: 50,
          y: 44,
          type: 'anatomy',
          label: { en: 'Use chest thrusts instead', ar: 'ضغطات الصدر بدلاً من البطن' },
          detail: {
            en: 'In late pregnancy or a very large person, use chest thrusts instead of abdominal thrusts (Slide 22).',
            ar: 'في آخر الحمل أو الشخص الكبير جداً، استخدم ضغطات الصدر بدل ضغطات البطن (شريحة ٢٢).',
          },
        },
        {
          id: 'a4-hs-abdomen',
          x: 50,
          y: 62,
          type: 'symptom',
          label: { en: 'Late pregnancy abdomen (Avoid)', ar: 'بطن في آخر الحمل (ممنوع الضغط)' },
          detail: {
            en: 'Abdominal thrusts cannot be performed safely in late pregnancy.',
            ar: 'لا يمكن تنفيذ ضغطات البطن بأمان في أواخر الحمل.',
          },
        },
      ],
    },
    storyBeats: [
      {
        id: 'a4-s1',
        phase: 'intro',
        durationSec: 4,
        mediaKey: 'a4_s1_lab_pregnant_colleague',
        speaker: { en: 'S1 · In the Lab', ar: 'S1 · في المعمل' },
        text: {
          en: `Colleagues are gathered in the lab with ${pregEn}, who is in late pregnancy.`,
          ar: `الزملاء في المعمل ومعهم ${pregAr} في آخر الحمل.`,
        },
        clinicalCue: {
          en: 'Late pregnancy • Calm baseline',
          ar: 'أواخر الحمل • حالة مستقرة',
        },
        spO2: 99,
        heartRate: 80,
      },
      {
        id: 'a4-s2',
        phase: 'escalation',
        durationSec: 4,
        mediaKey: 'a4_s2_talking_while_eating',
        speaker: { en: 'S2 · Talking While Eating', ar: 'S2 · الكلام أثناء الأكل' },
        text: {
          en: `She takes a bite of food while talking with her colleagues.`,
          ar: `تأكل وهي تتكلم مع زملائها في المعمل.`,
        },
        clinicalCue: {
          en: 'Talking while chewing increases choking risk (Slide 3)',
          ar: 'الكلام أثناء المضغ يزيد خطر الاختناق (شريحة ٣)',
        },
        spO2: 96,
        heartRate: 94,
      },
      {
        id: 'a4-s3',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'a4_s3_clutch_neck_silent',
        speaker: { en: 'S3 · Sudden Silent Choking', ar: 'S3 · تمسك رقبتها وتسكت' },
        text: {
          en: `Suddenly she clutches her neck with both hands and goes completely silent.`,
          ar: `فجأة تمسك رقبتها بكلتا يديها وتسكت تماماً.`,
        },
        clinicalCue: {
          en: 'Severe choking • Cannot speak or cough',
          ar: 'اختناق شديد • لا تتكلم ولا تسعل',
        },
        spO2: 90,
        heartRate: 116,
      },
      {
        id: 'a4-s4',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'a4_s4_colleagues_hesitate_abdomen',
        speaker: { en: 'S4 · Where to Place the Hands?', ar: 'S4 · حيرة في موضع اليدين' },
        text: {
          en: `Colleagues rush to help but hesitate over where to place their hands because she is in late pregnancy.`,
          ar: `الزملاء يقتربون ويترددون في مكان وضع اليدين لأنها في آخر الحمل.`,
        },
        clinicalCue: {
          en: 'Slide 22: Abdominal thrusts cannot be done safely in late pregnancy',
          ar: 'شريحة ٢٢: ضغطات البطن غير آمنة في آخر الحمل',
        },
        spO2: 88,
        heartRate: 122,
      },
      {
        id: 'a4-s5',
        phase: 'decision_prompt',
        durationSec: 5,
        mediaKey: 'a4_s5_decision_moment',
        speaker: { en: 'S5 · Decision Moment', ar: 'S5 · لحظة القرار' },
        text: {
          en: `${pregEn} is choking severely in late pregnancy. Inspect the signs and choose the safe technique!`,
          ar: `${pregAr} تختنق بشدة في آخر الحمل. افحص العلامات واختر الطريقة الآمنة!`,
        },
        clinicalCue: {
          en: 'Rule R-PREG (Slide 22)',
          ar: 'قاعدة R-PREG (شريحة ٢٢)',
        },
        spO2: 87,
        heartRate: 124,
      },
    ],
    decisionNode: {
      id: 'a4-d1',
      prompt: {
        en: `${pregEn} is in late pregnancy and has severe choking. What should you do?`,
        ar: `${pregAr} في آخر الحمل وتعاني من اختناق شديد. ماذا تفعل؟`,
      },
      contextNote: {
        en: 'Lecture Slide 22: Pregnant or very large person — if abdominal thrusts cannot be done safely, use chest thrusts instead.',
        ar: 'شريحة ٢٢: الحامل أو الشخص الكبير جداً — إذا تعذر عمل ضغطات البطن بأمان، استخدم ضغطات الصدر بدلاً منها.',
      },
      timeLimitSec: 20,
      choices: [
        {
          id: 'a4-c1',
          label: {
            en: 'Call EMS early, use chest thrusts instead of abdominal thrusts (alternating with up to 5 back blows), and continue cycles until clear',
            ar: 'اتصل بالإسعاف مبكراً، استخدم ضغطات الصدر بدل ضغطات البطن (بالتبادل مع حتى ٥ ضربات ظهر)، وكمّل الدورات حتى يخرج الجسم',
          },
          subLabel: {
            en: 'Rule R-PREG (Slide 22)',
            ar: 'قاعدة R-PREG (شريحة ٢٢)',
          },
          outcome: 'optimal',
          spO2Delta: 11,
          obstructionDelta: -95,
          consequenceBeat: {
            mediaKey: 'a4_o3_chest_thrusts_clear',
            playbackFrames: [
              {
                id: 'a4-o1',
                stageLabel: { en: '1. Call EMS Early', ar: '١. الاتصال بالإسعاف مبكراً' },
                mediaKey: 'a4_o1_call_ems_early',
                caption: {
                  en: `You have a colleague call 123 ambulance early and support her forward for up to 5 back blows.`,
                  ar: `تطلب الاتصال بالإسعاف ١٢٣ مبكراً، وتميلها للأمام لعمل حتى ٥ ضربات ظهر.`,
                },
                spO2: 88,
                heartRate: 120,
              },
              {
                id: 'a4-o2',
                stageLabel: { en: '2. Chest Thrusts Instead of Abdomen', ar: '٢. ضغطات الصدر بدل البطن' },
                mediaKey: 'a4_o2_chest_thrusts_position',
                caption: {
                  en: `Standing behind her, you wrap your arms under her armpits across the chest and deliver firm chest thrusts instead of pressing the abdomen.`,
                  ar: `تقف خلفها وتضع يديك على الصدر لتطبيق ضغطات الصدر بأمان بعيداً عن البطن.`,
                },
                spO2: 92,
                heartRate: 110,
              },
              {
                id: 'a4-o3',
                stageLabel: { en: '3. Obstruction Cleared Safely', ar: '٣. خروج الجسم بأمان' },
                mediaKey: 'a4_o3_chest_thrusts_clear',
                caption: {
                  en: `The chest thrusts expel the food piece safely and her breathing returns to normal!`,
                  ar: `ضغطات الصدر تطرد قطعة الطعام بأمان ويعود تنفسها طبيعياً!`,
                },
                spO2: 98,
                heartRate: 90,
              },
            ],
            title: {
              en: 'Chest Thrusts Clear the Airway Safely!',
              ar: 'ضغطات الصدر تفتح مجرى التنفس بأمان!',
            },
            narrative: {
              en: `Using chest thrusts instead of abdominal thrusts cleared the obstruction while protecting the pregnant abdomen.`,
              ar: `استخدام ضغطات الصدر بدلاً من ضغطات البطن طرد الجسم العالق مع حماية البطن في آخر الحمل.`,
            },
            clinicalWhy: {
              en: 'Slide 22 (R-PREG): If abdominal thrusts cannot be done safely (late pregnancy or very large person), use chest thrusts instead, call EMS early, and continue cycles until the object clears or the person becomes unresponsive.',
              ar: 'شريحة ٢٢ (R-PREG): إذا تعذر عمل ضغطات البطن بأمان (أواخر الحمل أو الشخص الكبير جداً)، استخدم ضغطات الصدر بدلاً منها، واتصل بالإسعاف مبكراً، واستمر حتى يخرج الجسم أو يفقد المصاب الوعي.',
            },
            internalEffect: {
              en: 'Direct thoracic compression increases intrathoracic pressure without compressing the gravid uterus.',
              ar: 'الضغط على الصدر يرفع الضغط داخل الرئتين لطرد الجسم دون الضغط على الرحم.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'complete',
          },
        },
        {
          id: 'a4-c2',
          label: {
            en: 'Perform standard abdominal thrusts over her pregnant abdomen',
            ar: 'نفّذ ضغطات البطن المعتادة فوق بطنها',
          },
          subLabel: {
            en: 'Unsafe in late pregnancy (Slide 22)',
            ar: 'غير آمن في آخر الحمل (شريحة ٢٢)',
          },
          outcome: 'harmful',
          spO2Delta: -10,
          obstructionDelta: 0,
          consequenceBeat: {
            mediaKey: 'a4_o4_err_abdominal_pregnancy',
            title: {
              en: 'Unsafe — Do Not Use Abdominal Thrusts in Late Pregnancy',
              ar: 'غير آمن — لا تستخدم ضغطات البطن في آخر الحمل',
            },
            narrative: {
              en: `Pressing inward on the abdomen in late pregnancy is unsafe and ineffective.`,
              ar: `الضغط على البطن في أواخر الحمل غير آمن ويعرّض الأم والجنين للخطر.`,
            },
            clinicalWhy: {
              en: 'Slide 22: Abdominal thrusts cannot be done safely in late pregnancy — always switch to chest thrusts.',
              ar: 'شريحة ٢٢: لا يمكن تنفيذ ضغطات البطن بأمان في آخر الحمل — استبدلها دائماً بضغطات الصدر.',
            },
            internalEffect: {
              en: 'Direct pressure over the gravid abdomen risks maternal and fetal injury.',
              ar: 'الضغط المباشر على البطن في الحمل المتقدم يسبب خطراً على الأم والجنين.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'retry',
          },
        },
        {
          id: 'a4-c3',
          label: {
            en: 'Give her water to drink',
            ar: 'أعطها ماءً لتشرب',
          },
          subLabel: {
            en: 'Forbidden in severe choking (Rule R-WATER)',
            ar: 'ممنوع في الاختناق الشديد (قاعدة R-WATER)',
          },
          outcome: 'harmful',
          spO2Delta: -10,
          obstructionDelta: 5,
          consequenceBeat: {
            mediaKey: 'a4_o5_err_water',
            title: {
              en: 'Harmful Error — Never Give Water in Severe Choking (R-WATER)',
              ar: 'خطأ خطر — لا تعطِ الماء في الاختناق الشديد (R-WATER)',
            },
            narrative: {
              en: `She cannot swallow water with a blocked airway, wasting critical seconds.`,
              ar: `لا تستطيع ابتلاع الماء مع انسداد مجرى التنفس، مما يهدر ثواني حرجة.`,
            },
            clinicalWhy: {
              en: 'Rule R-WATER (Slide 25): Do not give water to a choking victim.',
              ar: 'قاعدة R-WATER (شريحة ٢٥): لا تعطِ الماء أبداً لمصاب بالاختناق.',
            },
            internalEffect: {
              en: 'Water cannot pass the obstructed airway and increases aspiration risk.',
              ar: 'الماء لا يمر عبر المجرى المسدود ويزيد خطر الاستنشاق الرئوي.',
            },
            guidelineBadge: 'ARC',
            nextAction: 'retry',
          },
        },
      ],
    },
    takeaways: [
      {
        en: 'In late pregnancy or a very large person, use chest thrusts instead of abdominal thrusts (Slide 22).',
        ar: 'في أواخر الحمل أو مع الشخص الكبير جداً، استخدم ضغطات الصدر بدلاً من ضغطات البطن (شريحة ٢٢).',
      },
      {
        en: 'Call EMS early and continue cycles until the object clears or the person becomes unresponsive.',
        ar: 'اتصل بالإسعاف مبكراً واستمر في الدورات حتى يخرج الجسم أو يفقد المصاب الوعي.',
      },
    ],
  },
];
