import { StoryLevel } from '../types/nafas';
import { CHARACTER_REGISTRY } from './characterRegistry';

const youssefEn = CHARACTER_REGISTRY.child.name.en;
const youssefAr = CHARACTER_REGISTRY.child.name.ar;

export const CHILD_CORE_LEVELS: StoryLevel[] = [
  // =========================================================================
  // C1 · إنذار الكافيتريا (يوسف، 6 سنوات، كافيتريا المدرسة) — شديد (Slide 18)
  // =========================================================================
  {
    id: 'C1',
    levelNumber: 5,
    ageGroup: 'child',
    severity: 'severe',
    patientState: 'conscious',
    clinicalReview: true,
    clinicalReviewReason:
      'Doctor confirmation requested for Choice C (random blows to the neck / ضربات عشوائية على الرقبة — R-NOSLAP) in C1 — Section 4 C1 & Section 7 Q5.',
    lectureSlideRefs: ['Slide 18', 'Slide 25'],
    ruleTags: ['R-CHILD', 'R-NOSLAP'],
    title: {
      en: 'Cafeteria Alarm',
      ar: 'إنذار الكافيتريا',
    },
    subtitle: {
      en: `${youssefEn} (6 yrs) • School Cafeteria (Severe Choking)`,
      ar: `${youssefAr} (٦ سنوات) • كافيتريا المدرسة (اختناق شديد)`,
    },
    setting: {
      en: 'School Cafeteria',
      ar: 'كافيتريا المدرسة',
    },
    character: {
      name: CHARACTER_REGISTRY.child.name,
      age: CHARACTER_REGISTRY.child.ageDisplay,
      role: CHARACTER_REGISTRY.child.defaultRole,
    },
    hook: {
      en: `${youssefEn} (6 years old) clutches his neck silently in the school cafeteria with wide eyes, zero sound, and zero cough. What will you do?`,
      ar: `${youssefAr} (٦ سنوات) يمسك رقبته بصمت في كافيتريا المدرسة وعيونه متسعة مع صفر صوت وصفر سعال. ماذا ستفعل؟`,
    },
    objective: {
      en: 'Kneel to the child’s height, call early for help, and alternate up to 5 back blows and up to 5 abdominal thrusts (Slide 18).',
      ar: 'انزل لمستوى طول الطفل، اطلب المساعدة مبكراً، وبدّل بين حتى ٥ ضربات ظهر وحتى ٥ ضغطات بطن (شريحة ١٨).',
    },
    EstimatedMinutes: 3,
    PlainLanguageMap: {
      spO2: { en: 'Oxygen level', ar: 'مستوى الأكسجين' },
      airway: { en: 'Breathing passage', ar: 'مجرى التنفس' },
      cyanosis: { en: 'Blue lips', ar: 'زرقة الشفاه' },
      epiglottis: { en: 'Throat valve', ar: 'صمام الحلق' },
    },
    afterCareNote: {
      en: 'Tip: Adjust your position by kneeling to the child’s height and use child-appropriate force (Slide 18).',
      ar: 'نصيحة: اضبط وضعك للطفل بالنزول لمستوى طوله وبقوة مناسبة لحجم الطفل (شريحة ١٨).',
    },
    sceneVisual: {
      environment: 'school_cafeteria',
      accentColor: '#13B8B0',
      mood: 'critical',
      obstructionLevel: 95,
      spO2Start: 88,
      spO2Critical: 84,
      heartRateStart: 132,
      respiratoryRate: 0,
      hasCyanosis: true,
      hasStridor: false,
      canSpeak: false,
      canCough: false,
      caption: {
        en: `${youssefEn} stands frozen clutching his neck with both hands — zero sound, zero cough, and pale-bluish lips.`,
        ar: `${youssefAr} يقف متجمداً ويمسك رقبته بكلتا يديه — صفر صوت، صفر سعال، وشفتان تميلان للزرقة.`,
      },
      hotspots: [
        {
          id: 'c1-hs-hands',
          x: 49,
          y: 34,
          type: 'symptom',
          label: { en: 'Hands clutching neck', ar: 'يداه على رقبته' },
          detail: {
            en: `${youssefEn} clutches his throat with both hands and wide frightened eyes (Slide 18).`,
            ar: `${youssefAr} يمسك رقبته بكلتا يديه وعيونه متسعة من الخوف (شريحة ١٨).`,
          },
        },
        {
          id: 'c1-hs-sound',
          x: 47,
          y: 25,
          type: 'airway',
          label: { en: 'Zero sound, zero cough', ar: 'صفر صوت، صفر سعال' },
          detail: {
            en: 'Complete silence — no crying, no coughing, and no air passing.',
            ar: 'صمت تام — لا بكاء، لا سعال، ولا مرور للهواء.',
          },
        },
        {
          id: 'c1-hs-height',
          x: 53,
          y: 58,
          type: 'anatomy',
          label: { en: 'Child height — kneel down', ar: 'طول الطفل — انزل لمستواه' },
          detail: {
            en: 'Rescuer must kneel or bend to the child’s height to align back blows and abdominal thrusts safely (Slide 18).',
            ar: 'يجب أن ينزل المسعف على ركبتيه لمستوى طول الطفل لضبط زاوية ضربات الظهر وضغطات البطن (شريحة ١٨).',
          },
        },
      ],
    },
    storyBeats: [
      {
        id: 'c1-s1',
        phase: 'intro',
        durationSec: 4,
        mediaKey: 'c1_s1_cafeteria_wide',
        speaker: { en: 'S1 · School Cafeteria', ar: 'S1 · كافيتريا المدرسة' },
        text: {
          en: `In the busy school cafeteria, 6-year-old ${youssefEn} is eating his lunch at the table.`,
          ar: `في كافيتريا المدرسة، يجلس ${youssefAr} (٦ سنوات) على طاولة الغداء ويتناول طعامه.`,
        },
        clinicalCue: {
          en: 'School-age child eating lunch • Oxygen level 99%',
          ar: 'طفل في سن المدرسة يتناول الغداء • مستوى الأكسجين ٩٩٪',
        },
        spO2: 99,
        heartRate: 96,
      },
      {
        id: 'c1-s2',
        phase: 'escalation',
        durationSec: 4,
        mediaKey: 'c1_s2_youssef_laughs_eats',
        speaker: { en: 'S2 · Laughing While Eating', ar: 'S2 · يأكل ويضحك' },
        text: {
          en: `${youssefEn} laughs with his classmates while chewing a piece of food.`,
          ar: `${youssefAr} يأكل ويضحك مع زملائه على طاولة المدرسة.`,
        },
        clinicalCue: {
          en: 'Laughing while food is in the mouth triggers sudden aspiration',
          ar: 'الضحك والطعام في الفم يزيد خطر استنشاق اللقمة فجأة',
        },
        spO2: 96,
        heartRate: 108,
      },
      {
        id: 'c1-s3',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'c1_s3_clutch_neck_wide_eyes',
        speaker: { en: 'S3 · Silent Choking Onset', ar: 'S3 · يمسك رقبته بصمت' },
        text: {
          en: `Suddenly ${youssefEn} stops making any sound, clutches his neck, and looks up with wide terrified eyes.`,
          ar: `فجأة يمسك ${youssefAr} رقبته وعيونه متسعة من الرعب دون أن يصدر أي صوت.`,
        },
        clinicalCue: {
          en: 'Zero sound • Zero cough • Severe child choking (Slide 18)',
          ar: 'صفر صوت • صفر سعال • اختناق شديد عند الطفل (شريحة ١٨)',
        },
        spO2: 91,
        heartRate: 124,
      },
      {
        id: 'c1-s4',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'c1_s4_supervisor_approaches_kneel',
        speaker: { en: 'S4 · Supervisor Steps In', ar: 'S4 · المشرف يقترب وينزل لمستواه' },
        text: {
          en: `The supervisor rushes to ${youssefEn} and prepares to kneel down to match the child’s height.`,
          ar: `يقترب المشرف بسرعة من ${youssefAr} ويستعد للنزول على ركبتيه لمستوى طوله.`,
        },
        clinicalCue: {
          en: 'Kneel to child height • Call early for emergency help',
          ar: 'النزول لمستوى طول الطفل • طلب المساعدة مبكراً',
        },
        spO2: 88,
        heartRate: 132,
      },
      {
        id: 'c1-s5',
        phase: 'decision_prompt',
        durationSec: 5,
        mediaKey: 'c1_s5_decision_moment',
        speaker: { en: 'S5 · Decision Moment', ar: 'S5 · لحظة القرار' },
        text: {
          en: `${youssefEn} cannot cough, speak, or breathe. How do you intervene right now?`,
          ar: `${youssefAr} لا يقدر يسعل أو يتكلم أو يتنفس. كيف تتدخل الآن؟`,
        },
        clinicalCue: {
          en: 'Inspect the 3 signs in the Info Rail, then decide',
          ar: 'افحص العلامات الثلاث في اللوحة الجانبية ثم قرّر',
        },
        spO2: 88,
        heartRate: 134,
      },
    ],
    decisionNode: {
      id: 'c1-d1',
      prompt: {
        en: `${youssefEn} (6 yrs) is severely choking and silent. What is the correct protocol?`,
        ar: `${youssefAr} (٦ سنوات) يختنق بشدة وبلا صوت. ما البروتوكول الصحيح؟`,
      },
      contextNote: {
        en: 'Lecture Slide 18: Kneel to child’s height, call early, and alternate up to 5 back blows & up to 5 abdominal thrusts.',
        ar: 'شريحة ١٨: انزل لمستوى طول الطفل، اطلب المساعدة مبكراً، وبدّل بين حتى ٥ ضربات ظهر وحتى ٥ ضغطات بطن.',
      },
      timeLimitSec: 20,
      choices: [
        {
          id: 'c1-c1',
          label: {
            en: 'Kneel to his height, call early, and alternate up to 5 back blows and up to 5 abdominal thrusts',
            ar: 'انزل لمستوى طول الطفل، اطلب المساعدة مبكراً، وبدّل بين حتى ٥ ضربات ظهر وحتى ٥ ضغطات بطن',
          },
          subLabel: {
            en: 'Rule R-CHILD (Slide 18)',
            ar: 'قاعدة R-CHILD (شريحة ١٨)',
          },
          outcome: 'optimal',
          spO2Delta: 10,
          obstructionDelta: -95,
          consequenceBeat: {
            mediaKey: 'c1_o3_airway_cleared',
            playbackFrames: [
              {
                id: 'c1-o1',
                stageLabel: { en: '1. Kneel & Lean Forward', ar: '١. النزول لمستوى الطفل وإمالته' },
                mediaKey: 'c1_o1_kneel_back_blows',
                caption: {
                  en: `You kneel behind ${youssefEn} to match his height, lean him forward, and give up to 5 back blows.`,
                  ar: `تنزل على ركبتيك خلف ${youssefAr} لمستوى طوله، تميله للأمام وتنفّذ حتى ٥ ضربات ظهر.`,
                },
                spO2: 90,
                heartRate: 126,
              },
              {
                id: 'c1-o2',
                stageLabel: { en: '2. Child Abdominal Thrusts', ar: '٢. حتى ٥ ضغطات بطن بقوة مناسبة' },
                mediaKey: 'c1_o2_child_abdominal_thrusts',
                caption: {
                  en: `Still kneeling behind ${youssefEn}, you deliver up to 5 inward-and-upward abdominal thrusts with child-appropriate force.`,
                  ar: `وأنت على ركبتيك خلف ${youssefAr}، تنفّذ حتى ٥ ضغطات بطن للداخل وللأعلى بقوة مناسبة للطفل.`,
                },
                spO2: 95,
                heartRate: 112,
              },
              {
                id: 'c1-o3',
                stageLabel: { en: '3. Obstruction Cleared', ar: '٣. خروج الجسم وعودة التنفس' },
                mediaKey: 'c1_o3_airway_cleared',
                caption: {
                  en: `The food piece is expelled and ${youssefEn} breathes and cries out in relief!`,
                  ar: `تخرج قطعة الطعام ويعود ${youssefAr} للتنفس والبكاء براحة!`,
                },
                spO2: 98,
                heartRate: 98,
              },
            ],
            title: {
              en: 'Child Airway Cleared Safely!',
              ar: 'تم فتح مجرى تنفس الطفل بأمان!',
            },
            narrative: {
              en: `Kneeling to ${youssefEn}'s height allowed you to lean him forward and alternate up to 5 back blows and up to 5 abdominal thrusts until the food popped out.`,
              ar: `النزول لمستوى طول ${youssefAr} سمح لك بإمالته للأمام والتبديل بين حتى ٥ ضربات ظهر وحتى ٥ ضغطات بطن حتى خرجت قطعة الطعام.`,
            },
            clinicalWhy: {
              en: 'Slide 18: For a severely choking child, kneel behind to match their height, call early, and alternate up to 5 back blows with up to 5 abdominal thrusts.',
              ar: 'شريحة ١٨: للطفل المصاب باختناق شديد، انزل لمستوى طوله، اطلب المساعدة مبكراً، وبدّل بين حتى ٥ ضربات ظهر وحتى ٥ ضغطات بطن.',
            },
            internalEffect: {
              en: 'Properly aligned back blows and child-sized abdominal thrusts expel the blockage safely.',
              ar: 'ضربات الظهر وضغطات البطن المضبوطة لطول الطفل تطرد الانسداد بأمان.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'complete',
          },
        },
        {
          id: 'c1-c2',
          label: {
            en: 'Give him water to swallow the food',
            ar: 'أعطه ماءً ليبلع الطعام',
          },
          subLabel: {
            en: 'Forbidden in choking (Rule R-WATER)',
            ar: 'ممنوع أثناء الاختناق (قاعدة R-WATER)',
          },
          outcome: 'harmful',
          spO2Delta: -10,
          obstructionDelta: 5,
          consequenceBeat: {
            mediaKey: 'c1_o4_err_water',
            title: {
              en: 'Dangerous Error — Water Cannot Pass a Blocked Airway (R-WATER)',
              ar: 'خطأ خطير — الماء لا يمر مع انسداد مجرى الهواء (R-WATER)',
            },
            narrative: {
              en: `Pouring water into ${youssefEn}'s mouth while his airway is blocked worsens choking and delays rescue thrusts.`,
              ar: `إعطاء الماء لـ ${youssefAr} ومجرى التنفس مسدود يزيد الاختناق ويؤخر خطوات الإنقاذ.`,
            },
            clinicalWhy: {
              en: 'Rule R-WATER (Slide 25): Never give water or food to a choking child.',
              ar: 'قاعدة R-WATER (شريحة ٢٥): لا تعطِ الماء أو الطعام لطفل يختنق.',
            },
            internalEffect: {
              en: 'Fluid pools above the blocked airway and steals critical seconds.',
              ar: 'السوائل تتجمع فوق المجرى المسدود وتضيع ثواني حاسمة.',
            },
            guidelineBadge: 'ARC',
            nextAction: 'retry',
          },
        },
        {
          id: 'c1-c3',
          label: {
            en: 'Hit his neck with random blows',
            ar: 'اضرب رقبته بضربات عشوائية',
          },
          subLabel: {
            en: 'Random neck blows injure the throat (Rule R-NOSLAP)',
            ar: 'الضرب العشوائي على الرقبة يؤذي الحلق (قاعدة R-NOSLAP)',
          },
          outcome: 'harmful',
          spO2Delta: -12,
          obstructionDelta: 5,
          consequenceBeat: {
            mediaKey: 'c1_o5_err_random_neck_blows',
            title: {
              en: 'Harmful Action — Never Strike the Neck Randomly (R-NOSLAP)',
              ar: 'تصرف ضار — لا تضرب الرقبة بضربات عشوائية (R-NOSLAP)',
            },
            narrative: {
              en: `Random blows on ${youssefEn}'s neck traumatize the throat without creating the upward pressure needed to expel the blockage.`,
              ar: `الضربات العشوائية على رقبة ${youssefAr} تؤذي الحنجرة ولا تولّد الضغط اللازم لطرد الانسداد.`,
            },
            clinicalWhy: {
              en: 'Rule R-NOSLAP (Slides 11 & 18): Back blows must be delivered accurately between the shoulder blades while leaning forward, never randomly on the neck.',
              ar: 'قاعدة R-NOSLAP (شريحة ١١ و١٨): ضربات الظهر تكون بين لوحي الكتف مع إمالة الطفل للأمام، وليس بضربات عشوائية على الرقبة.',
            },
            internalEffect: {
              en: 'Direct blows to the neck risk airway trauma while leaving the obstruction wedged.',
              ar: 'ضرب الرقبة مباشرة يعرّض المجرى الهوائي للإصابة مع بقاء الجسم العالق.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'retry',
          },
        },
      ],
    },
    takeaways: [
      {
        en: 'Kneel or bend down behind the child to match their height before giving back blows or abdominal thrusts (Slide 18).',
        ar: 'انزل على ركبتيك خلف الطفل لمستوى طوله قبل تنفيذ ضربات الظهر أو ضغطات البطن (شريحة ١٨).',
      },
      {
        en: 'Alternate up to 5 back blows and up to 5 abdominal thrusts with force adjusted for the child.',
        ar: 'بدّل بين حتى ٥ ضربات ظهر وحتى ٥ ضغطات بطن بقوة مناسبة لحجم الطفل.',
      },
    ],
  },

  // =========================================================================
  // C2 · الطفل فاقد الوعي (يوسف، 6 سنوات) — فاقد الوعي (Slides 18–19, 16–17)
  // =========================================================================
  {
    id: 'C2',
    levelNumber: 6,
    ageGroup: 'child',
    severity: 'unresponsive',
    patientState: 'unconscious',
    lectureSlideRefs: ['Slide 18', 'Slide 19', 'Slide 16', 'Slide 17'],
    ruleTags: ['R-UNRESP', 'R-SWEEP', 'R-EMS'],
    title: {
      en: 'The Unresponsive Child',
      ar: 'الطفل فاقد الوعي',
    },
    subtitle: {
      en: `${youssefEn} (6 yrs) • School Cafeteria Floor (Unresponsive)`,
      ar: `${youssefAr} (٦ سنوات) • أرضية الكافيتريا (فاقد الوعي)`,
    },
    setting: {
      en: 'School Cafeteria Floor',
      ar: 'أرضية كافيتريا المدرسة',
    },
    character: {
      name: CHARACTER_REGISTRY.child.name,
      age: CHARACTER_REGISTRY.child.ageDisplay,
      role: CHARACTER_REGISTRY.child.defaultRole,
    },
    hook: {
      en: `The obstruction persists and ${youssefEn} loses consciousness in the supervisor’s arms. What is your immediate protocol?`,
      ar: `الانسداد مستمر و${youssefAr} يفقد الوعي بين يدي المشرف. ما هو البروتوكول الفوري؟`,
    },
    objective: {
      en: 'Lower the child safely to a firm flat surface, ensure EMS is called, and start CPR according to your training without blind finger sweeps (Slides 18–19, 16–17).',
      ar: 'أنزل الطفل بأمان على سطح ثابت، تأكد من الاتصال بالإسعاف، وابدأ الإنعاش حسب تدريبك بدون مسح أعمى (شرائح ١٨–١٩، ١٦–١٧).',
    },
    EstimatedMinutes: 3,
    PlainLanguageMap: {
      spO2: { en: 'Oxygen level', ar: 'مستوى الأكسجين' },
      airway: { en: 'Breathing passage', ar: 'مجرى التنفس' },
      cyanosis: { en: 'Blue lips', ar: 'زرقة الشفاه' },
      epiglottis: { en: 'Throat valve', ar: 'صمام الحلق' },
    },
    afterCareNote: {
      en: 'Tip: Once unresponsive, stop upright thrusts, place on a firm surface, and start CPR according to your training (Slides 18–19).',
      ar: 'نصيحة: عند فقدان الوعي، أوقف المناورات وقوفاً، ضعه على سطح ثابت، وابدأ الإنعاش حسب تدريبك (شريحة ١٨–١٩).',
    },
    sceneVisual: {
      environment: 'school_cafeteria',
      accentColor: '#DC5252',
      mood: 'critical',
      obstructionLevel: 100,
      spO2Start: 80,
      spO2Critical: 76,
      heartRateStart: 138,
      respiratoryRate: 0,
      hasCyanosis: true,
      hasStridor: false,
      canSpeak: false,
      canCough: false,
      caption: {
        en: `${youssefEn} is lowered gently onto a firm flat surface after losing consciousness — unresponsive and not breathing.`,
        ar: `يتم إنزال ${youssefAr} بأمان على سطح ثابت بعد فقدان الوعي — لا يستجيب ولا يتنفس.`,
      },
      hotspots: [
        {
          id: 'c2-hs-unresp',
          x: 48,
          y: 32,
          type: 'symptom',
          label: { en: 'Unresponsive child', ar: 'فاقد الوعي' },
          detail: {
            en: `${youssefEn} is limp and does not respond to voice or touch (Slides 18–19).`,
            ar: `${youssefAr} مرتخٍ تماماً ولا يستجيب للصوت أو اللمس (شريحة ١٨–١٩).`,
          },
        },
        {
          id: 'c2-hs-breath',
          x: 50,
          y: 48,
          type: 'airway',
          label: { en: 'Not breathing', ar: 'لا يتنفس' },
          detail: {
            en: 'No normal chest rise or air movement.',
            ar: 'لا يوجد ارتفاع طبيعي للصدر أو مرور للهواء.',
          },
        },
        {
          id: 'c2-hs-surface',
          x: 54,
          y: 65,
          type: 'environment',
          label: { en: 'On a firm surface', ar: 'على سطح ثابت' },
          detail: {
            en: 'Positioned flat on his back on the firm floor ready for CPR according to your training.',
            ar: 'ممدد على ظهره فوق أرضية ثابتة استعداداً للإنعاش حسب تدريبك.',
          },
        },
      ],
    },
    storyBeats: [
      {
        id: 'c2-s1',
        phase: 'intro',
        durationSec: 4,
        mediaKey: 'c2_s1_obstruction_persists',
        speaker: { en: 'S1 · Obstruction Persists', ar: 'S1 · استمرار الانسداد' },
        text: {
          en: `Despite initial efforts in the cafeteria, ${youssefEn}'s airway remains completely blocked.`,
          ar: `الانسداد مستمر عند ${youssefAr} في الكافيتريا ولا يدخل الهواء إلى رئتيه.`,
        },
        clinicalCue: {
          en: 'Persistent complete obstruction • Oxygen dropping',
          ar: 'استمرار الانسداد الكامل • هبوط الأكسجين',
        },
        spO2: 84,
        heartRate: 136,
      },
      {
        id: 'c2-s2',
        phase: 'escalation',
        durationSec: 4,
        mediaKey: 'c2_s2_youssef_collapses_in_arms',
        speaker: { en: 'S2 · Loss of Consciousness', ar: 'S2 · فقدان الوعي' },
        text: {
          en: `${youssefEn} suddenly goes limp and loses consciousness in the supervisor’s arms.`,
          ar: `يرتخي ${youssefAr} فجأة ويفقد الوعي بين يدي المشرف.`,
        },
        clinicalCue: {
          en: 'Child becomes unresponsive (Slides 18–19)',
          ar: 'الطفل يصبح فاقداً للوعي (شريحة ١٨–١٩)',
        },
        spO2: 81,
        heartRate: 138,
      },
      {
        id: 'c2-s3',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'c2_s3_lower_to_firm_surface',
        speaker: { en: 'S3 · Lower Safely to Floor', ar: 'S3 · إنزاله على سطح ثابت' },
        text: {
          en: `The supervisor gently lowers ${youssefEn} onto his back on the firm, flat floor while protecting his head.`,
          ar: `يتم إنزال ${youssefAr} برفق على ظهره فوق الأرضية الثابتة مع حماية رأسه.`,
        },
        clinicalCue: {
          en: 'Support to firm flat surface (Slides 15 & 19)',
          ar: 'وضعه على سطح ثابت ومسطح (شريحة ١٥ و١٩)',
        },
        spO2: 80,
        heartRate: 138,
      },
      {
        id: 'c2-s4',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'c2_s4_call_ems_confirmed',
        speaker: { en: 'S4 · Confirm Emergency Call', ar: 'S4 · تأكيد طلب الإسعاف' },
        text: {
          en: `A colleague calls Emergency Medical Services immediately while you kneel beside ${youssefEn}.`,
          ar: `زميل يتصل بالإسعاف فوراً بينما تجثو بجانب ${youssefAr}.`,
        },
        clinicalCue: {
          en: 'Rule R-EMS: Ensure ambulance is called immediately',
          ar: 'قاعدة R-EMS: تأكد من الاتصال بالإسعاف فوراً',
        },
        spO2: 80,
        heartRate: 138,
      },
      {
        id: 'c2-s5',
        phase: 'decision_prompt',
        durationSec: 5,
        mediaKey: 'c2_s5_decision_moment',
        speaker: { en: 'S5 · Decision Moment', ar: 'S5 · لحظة القرار' },
        text: {
          en: `${youssefEn} is unresponsive, not breathing, on a firm surface. What will you do now?`,
          ar: `${youssefAr} فاقد الوعي ولا يتنفس وعلى سطح ثابت. ماذا ستفعل الآن؟`,
        },
        clinicalCue: {
          en: 'Inspect the 3 signs in the Info Rail, then decide',
          ar: 'افحص العلامات الثلاث في اللوحة الجانبية ثم قرّر',
        },
        spO2: 80,
        heartRate: 138,
      },
    ],
    decisionNode: {
      id: 'c2-d1',
      prompt: {
        en: `${youssefEn} is unresponsive on the floor. What is the right action?`,
        ar: `${youssefAr} فاقد الوعي على الأرض. ما هو التصرف الصحيح؟`,
      },
      contextNote: {
        en: 'Lecture Slides 18–19, 16–17: Unresponsive child protocol & no blind finger sweep.',
        ar: 'شرائح ١٨–١٩، ١٦–١٧: بروتوكول الطفل فاقد الوعي ومنع المسح الأعمى بالإصبع.',
      },
      timeLimitSec: 20,
      choices: [
        {
          id: 'c2-c1',
          label: {
            en: 'Lower him safely, ensure EMS is called, and start CPR according to your training',
            ar: 'أنزله بأمان، تأكد من الاتصال بالإسعاف، وابدأ الإنعاش حسب تدريبك',
          },
          subLabel: {
            en: 'Rules R-UNRESP & R-SWEEP (Slides 18–19, 16–17)',
            ar: 'قواعد R-UNRESP و R-SWEEP (شرائح ١٨–١٩، ١٦–١٧)',
          },
          outcome: 'optimal',
          spO2Delta: 15,
          obstructionDelta: -100,
          consequenceBeat: {
            mediaKey: 'c2_o3_visible_removed_ems_arrives',
            playbackFrames: [
              {
                id: 'c2-o1',
                stageLabel: { en: '1. Position & Confirm EMS', ar: '١. التثبيت وتأكيد الإسعاف' },
                mediaKey: 'c2_o1_firm_surface_ems',
                caption: {
                  en: `${youssefEn} is positioned flat on the firm surface as the ambulance call is confirmed.`,
                  ar: `تثبيت ${youssefAr} على السطح الثابت مع تأكيد الاتصال بالإسعاف.`,
                },
                spO2: 82,
                heartRate: 130,
              },
              {
                id: 'c2-o2',
                stageLabel: { en: '2. Start CPR According to Training', ar: '٢. بدء الإنعاش حسب تدريبك' },
                mediaKey: 'c2_o2_start_child_cpr',
                caption: {
                  en: `You start CPR according to your training and check the mouth visually without a blind sweep.`,
                  ar: `تبدأ الإنعاش حسب تدريبك وتفحص الفم بالنظر فقط بدون مسح أعمى.`,
                },
                spO2: 90,
                heartRate: 114,
              },
              {
                id: 'c2-o3',
                stageLabel: { en: '3. Visible Object Removed & EMS', ar: '٣. إزالة الجسم المرئي فقط' },
                mediaKey: 'c2_o3_visible_removed_ems_arrives',
                caption: {
                  en: `You remove the food only when clearly visible, and ${youssefEn} begins breathing as EMS arrives.`,
                  ar: `تزيل قطعة الطعام فقط بعد رؤيتها بوضوح، ويعود تنفس ${youssefAr} مع وصول الإسعاف.`,
                },
                spO2: 96,
                heartRate: 100,
              },
            ],
            title: {
              en: 'Correct Unresponsive Child Protocol!',
              ar: 'تطبيق صحيح لبروتوكول الطفل فاقد الوعي!',
            },
            narrative: {
              en: `You lowered ${youssefEn} safely, ensured EMS was called, started CPR according to your training, and removed the object only when it became clearly visible.`,
              ar: `أنزلت ${youssefAr} بأمان، تأكدت من طلب الإسعاف، بدأت الإنعاش حسب تدريبك، وأزلت الجسم فقط عندما أصبح مرئياً بوضوح.`,
            },
            clinicalWhy: {
              en: 'Slides 18–19 & 16–17: When a choking child becomes unresponsive, place them on a firm surface, ensure EMS is called, start CPR according to your training, and never perform a blind finger sweep.',
              ar: 'شرائح ١٨–١٩ و١٦–١٧: عند فقدان الطفل للوعي، ضعه على سطح ثابت، تأكد من الاتصال بالإسعاف، ابدأ الإنعاش حسب تدريبك، ولا تقم أبداً بمسح أعمى بالإصبع.',
            },
            internalEffect: {
              en: 'Chest compressions generate airway pressure that helps dislodge the blockage while maintaining circulation.',
              ar: 'الإنعاش يولّد ضغطاً يساعد على زحزحة الانسداد مع الحفاظ على الدورة الدموية.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'complete',
          },
        },
        {
          id: 'c2-c2',
          label: {
            en: 'Perform a blind finger sweep inside his mouth',
            ar: 'اعمل مسحاً أعمى بالإصبع داخل فمه',
          },
          subLabel: {
            en: 'Pushes object deeper (Rule R-SWEEP)',
            ar: 'يدفع الجسم للداخل (قاعدة R-SWEEP)',
          },
          outcome: 'harmful',
          spO2Delta: -12,
          obstructionDelta: 0,
          consequenceBeat: {
            mediaKey: 'c2_o4_err_blind_sweep',
            title: {
              en: 'Critical Error — Never Perform a Blind Finger Sweep (R-SWEEP)',
              ar: 'خطأ حرج — لا تقم أبداً بمسح أعمى بالإصبع (R-SWEEP)',
            },
            narrative: {
              en: `Sweeping your finger blindly inside ${youssefEn}'s throat pushes the unseen object deeper into the narrow airway.`,
              ar: `المسح الأعمى بالإصبع داخل فم ${youssefAr} يدفع الجسم غير المرئي أعمق داخل مجرى التنفس.`,
            },
            clinicalWhy: {
              en: 'Rule R-SWEEP (Slide 17 & 25): Never perform a blind finger sweep; only remove an object if you can see it clearly.',
              ar: 'قاعدة R-SWEEP (شريحة ١٧ و٢٥): يُمنع المسح الأعمى بالإصبع؛ أزل الجسم فقط إذا رأيته بوضوح.',
            },
            internalEffect: {
              en: 'The finger acts like a plunger, wedging the obstruction tighter into the larynx.',
              ar: 'الإصبع يدفع الجسم الغريب كالسدادة داخل الحنجرة.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'retry',
          },
        },
        {
          id: 'c2-c3',
          label: {
            en: 'Keep giving back blows while he is standing limp',
            ar: 'استمر في ضربات الظهر وهو واقف وفاقد الوعي',
          },
          subLabel: {
            en: 'Delays CPR on a firm surface (Rule R-UNRESP)',
            ar: 'يؤخر الإنعاش على سطح ثابت (قاعدة R-UNRESP)',
          },
          outcome: 'suboptimal',
          spO2Delta: -10,
          obstructionDelta: 0,
          consequenceBeat: {
            mediaKey: 'c2_o5_err_standing_back_blows',
            title: {
              en: 'Dangerous Delay — Upright Back Blows Are for Conscious Victims Only',
              ar: 'تأخير خطير — ضربات الظهر وقوفاً للمصاب الواعي فقط',
            },
            narrative: {
              en: `Trying to hold an unresponsive child upright for back blows wastes critical seconds when CPR must begin on a firm surface.`,
              ar: `محاولة إسناد طفل فاقد الوعي وقوفاً لضرب ظهره تضيع ثواني حاسمة يجب فيها بدء الإنعاش على سطح ثابت.`,
            },
            clinicalWhy: {
              en: 'Rule R-UNRESP (Slides 16, 18–19): As soon as the child becomes unresponsive, place them on a firm surface and start CPR according to your training.',
              ar: 'قاعدة R-UNRESP (شرائح ١٦، ١٨–١٩): بمجرد فقدان الطفل للوعي، ضعه على سطح ثابت وابدأ الإنعاش حسب تدريبك.',
            },
            internalEffect: {
              en: 'Circulation and oxygen delivery remain stopped while upright blows fail.',
              ar: 'يتأخر ضخ الأكسجين للدماغ مع عدم جدوى الضرب وقوفاً.',
            },
            guidelineBadge: 'ARC',
            nextAction: 'retry',
          },
        },
      ],
    },
    takeaways: [
      {
        en: 'When a choking child loses consciousness, lower them to a firm flat surface, ensure EMS is called, and start CPR according to your training (Slides 18–19).',
        ar: 'عندما يفقد الطفل المختنق وعيه، أنزله على سطح ثابت، تأكد من الاتصال بالإسعاف، وابدأ الإنعاش حسب تدريبك (شريحة ١٨–١٩).',
      },
      {
        en: 'Never perform a blind finger sweep; only remove an object if clearly visible in the mouth (Slide 17).',
        ar: 'لا تقم أبداً بمسح أعمى بالإصبع؛ أزل الجسم فقط إذا كان مرئياً بوضوح في الفم (شريحة ١٧).',
      },
    ],
  },

  // =========================================================================
  // C3 · سعال في الفسحة (يوسف، 6 سنوات، فناء المدرسة) — خفيف (Slides 5, 7)
  // =========================================================================
  {
    id: 'C3',
    levelNumber: 7,
    ageGroup: 'child',
    severity: 'mild',
    patientState: 'conscious',
    clinicalReview: true,
    clinicalReviewReason:
      'Doctor confirmation requested for C3 child mild choking wrong choices rationale (abdominal thrusts during strong cough vs giving water) — Section 4 C3 & Section 7 Q6.',
    lectureSlideRefs: ['Slide 5', 'Slide 7', 'Slide 25'],
    ruleTags: ['R-ASK', 'R-WATER'],
    title: {
      en: 'Cough at Recess',
      ar: 'سعال في الفسحة',
    },
    subtitle: {
      en: `${youssefEn} (6 yrs) • Schoolyard at Recess (Mild Choking)`,
      ar: `${youssefAr} (٦ سنوات) • فناء المدرسة (اختناق خفيف)`,
    },
    setting: {
      en: 'Schoolyard at Recess',
      ar: 'فناء المدرسة وقت الفسحة',
    },
    character: {
      name: CHARACTER_REGISTRY.child.name,
      age: CHARACTER_REGISTRY.child.ageDisplay,
      role: CHARACTER_REGISTRY.child.defaultRole,
    },
    hook: {
      en: `${youssefEn} is eating a snack in the schoolyard and starts coughing loudly while still able to speak and cry. What will you do?`,
      ar: `${youssefAr} يأكل سناك في الفسحة ويبدأ بسعال قوي ومسموع ويقدر يتكلم ويبكي. ماذا ستفعل؟`,
    },
    objective: {
      en: 'Encourage the child to keep coughing and stay with him to monitor closely (Slides 5 & 7).',
      ar: 'شجّع الطفل على السعال وابقَ معه وراقبه عن قرب (شريحة ٥ و٧).',
    },
    EstimatedMinutes: 2,
    PlainLanguageMap: {
      spO2: { en: 'Oxygen level', ar: 'مستوى الأكسجين' },
      airway: { en: 'Breathing passage', ar: 'مجرى التنفس' },
      cyanosis: { en: 'Blue lips', ar: 'زرقة الشفاه' },
      epiglottis: { en: 'Throat valve', ar: 'صمام الحلق' },
    },
    afterCareNote: {
      en: 'Tip: If the child’s cough becomes silent or weak, switch immediately to the severe choking protocol (Slide 7 & 18).',
      ar: 'نصيحة: لو تحوّل سعال الطفل إلى صامت أو ضعيف، انتقل فوراً لبروتوكول الاختناق الشديد (شريحة ٧ و١٨).',
    },
    sceneVisual: {
      environment: 'school_cafeteria',
      accentColor: '#13B8B0',
      mood: 'focused',
      obstructionLevel: 25,
      spO2Start: 97,
      spO2Critical: 95,
      heartRateStart: 102,
      respiratoryRate: 22,
      hasCyanosis: false,
      hasStridor: false,
      canSpeak: true,
      canCough: true,
      caption: {
        en: `${youssefEn} coughs loudly in the schoolyard and can still speak, cry, and breathe between coughs.`,
        ar: `${youssefAr} يسعل بصوت قوي في فناء المدرسة ويستطيع الكلام والبكاء والتنفس بين السعال.`,
      },
      hotspots: [
        {
          id: 'c3-hs-cough',
          x: 49,
          y: 34,
          type: 'airway',
          label: { en: 'Strong audible cough', ar: 'سعال قوي ومسموع' },
          detail: {
            en: `${youssefEn} has a loud, effective cough that moves air forcefully (Slide 5).`,
            ar: `${youssefAr} يسعل بصوت عالٍ وفعّال يدفع الهواء بقوة (شريحة ٥).`,
          },
        },
        {
          id: 'c3-hs-speak',
          x: 46,
          y: 24,
          type: 'symptom',
          label: { en: 'Can speak / cry', ar: 'بيتكلم أو يبكي' },
          detail: {
            en: 'Speaking and crying confirm the airway is only partially obstructed.',
            ar: 'القدرة على الكلام والبكاء تؤكد أن مجرى الهواء مفتوح جزئياً.',
          },
        },
        {
          id: 'c3-hs-color',
          x: 52,
          y: 52,
          type: 'anatomy',
          label: { en: 'Normal color', ar: 'لونه طبيعي' },
          detail: {
            en: 'Lips and face have normal pink color with good oxygen flow.',
            ar: 'لون الوجه والشفاه طبيعي مع دخول الهواء بين السعلات.',
          },
        },
      ],
    },
    storyBeats: [
      {
        id: 'c3-s1',
        phase: 'intro',
        durationSec: 4,
        mediaKey: 'c3_s1_schoolyard_recess',
        speaker: { en: 'S1 · Schoolyard at Recess', ar: 'S1 · فناء المدرسة وقت الفسحة' },
        text: {
          en: `During recess in the schoolyard, 6-year-old ${youssefEn} stands with his snack.`,
          ar: `في فناء المدرسة وقت الفسحة، يقف ${youssefAr} (٦ سنوات) ويتناول سناك خفيف.`,
        },
        clinicalCue: {
          en: 'Child eating at recess • Airway clear (99%)',
          ar: 'طفل يأكل في الفسحة • مجرى التنفس مفتوح (٩٩٪)',
        },
        spO2: 99,
        heartRate: 94,
      },
      {
        id: 'c3-s2',
        phase: 'escalation',
        durationSec: 4,
        mediaKey: 'c3_s2_eating_snack_talking',
        speaker: { en: 'S2 · Eating & Talking', ar: 'S2 · يأكل السناك' },
        text: {
          en: `${youssefEn} takes a quick bite while talking eagerly with his friends.`,
          ar: `يأكل ${youssefAr} لقمة سريعة وهو يتحدث بحماس مع أصدقائه.`,
        },
        clinicalCue: {
          en: 'Talking while chewing triggers a mild gag/cough',
          ar: 'الكلام أثناء المضغ يسبب شرقة بسيطة',
        },
        spO2: 98,
        heartRate: 98,
      },
      {
        id: 'c3-s3',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'c3_s3_strong_audible_cough',
        speaker: { en: 'S3 · Loud Forceful Cough', ar: 'S3 · سعال قوي ومسموع' },
        text: {
          en: `${youssefEn} bends slightly forward and starts coughing loudly and forcefully.`,
          ar: `يبدأ ${youssefAr} بسعال قوي ومسموع في فناء المدرسة.`,
        },
        clinicalCue: {
          en: 'Loud forceful cough = Effective cough (Slide 5)',
          ar: 'سعال قوي ومسموع = سعال فعّال (شريحة ٥)',
        },
        spO2: 97,
        heartRate: 102,
      },
      {
        id: 'c3-s4',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'c3_s4_can_speak_and_cry',
        speaker: { en: 'S4 · Speaking & Crying', ar: 'S4 · يقدر يتكلم ويبكي' },
        text: {
          en: `Between coughs, ${youssefEn} draws a breath, cries out, and tells you his throat tickles.`,
          ar: `بين السعلات يأخذ ${youssefAr} نفساً ويقدر يتكلم ويبكي بصوت واضح.`,
        },
        clinicalCue: {
          en: 'Can speak, cry, and breathe = Mild Choking (Slide 5)',
          ar: 'يتكلم ويبكي ويتنفس = اختناق خفيف (شريحة ٥)',
        },
        spO2: 97,
        heartRate: 104,
      },
      {
        id: 'c3-s5',
        phase: 'decision_prompt',
        durationSec: 5,
        mediaKey: 'c3_s5_decision_moment',
        speaker: { en: 'S5 · Decision Moment', ar: 'S5 · لحظة القرار' },
        text: {
          en: `${youssefEn} has a strong cough, can speak and cry, and has normal color. What will you do?`,
          ar: `${youssefAr} يسعل بقوة، يقدر يتكلم ويبكي، ولونه طبيعي. ماذا ستفعل؟`,
        },
        clinicalCue: {
          en: 'Inspect the 3 signs in the Info Rail, then decide',
          ar: 'افحص العلامات الثلاث في اللوحة الجانبية ثم قرّر',
        },
        spO2: 97,
        heartRate: 104,
      },
    ],
    decisionNode: {
      id: 'c3-d1',
      prompt: {
        en: `${youssefEn} is coughing strongly and speaking. What is the right action?`,
        ar: `${youssefAr} يسعل بقوة ويتكلم. ما هو التصرف الصحيح؟`,
      },
      contextNote: {
        en: 'Lecture Slides 5 & 7: Encourage effective cough in mild choking and monitor closely.',
        ar: 'شريحة ٥ و٧: شجّع السعال الفعّال في الاختناق الخفيف وراقب الطفل عن قرب.',
      },
      timeLimitSec: 20,
      choices: [
        {
          id: 'c3-c1',
          label: {
            en: 'Encourage him to keep coughing and stay with him to monitor closely',
            ar: 'شجّعه على السعال وابقَ معه وراقبه',
          },
          subLabel: {
            en: 'Rule R-ASK (Slides 5 & 7)',
            ar: 'قاعدة R-ASK (شريحة ٥ و٧)',
          },
          outcome: 'optimal',
          spO2Delta: 2,
          obstructionDelta: -25,
          consequenceBeat: {
            mediaKey: 'c3_o3_snack_cleared_relief',
            playbackFrames: [
              {
                id: 'c3-o1',
                stageLabel: { en: '1. Reassure & Encourage', ar: '١. طمأنة الطفل وتشجيع السعال' },
                mediaKey: 'c3_o1_encourage_child_cough',
                caption: {
                  en: `You kneel at ${youssefEn}'s level, calm him, and encourage him to keep coughing.`,
                  ar: `تطمئن ${youssefAr} بهدوء وتشجّعه على الاستمرار في السعال.`,
                },
                spO2: 97,
                heartRate: 100,
              },
              {
                id: 'c3-o2',
                stageLabel: { en: '2. Stay & Monitor', ar: '٢. البقاء بجانبه ومراقبته' },
                mediaKey: 'c3_o2_watch_closely',
                caption: {
                  en: `${youssefEn} gives another strong cough while you watch his breathing closely.`,
                  ar: `يسعل ${youssefAr} بقوة مرة أخرى بينما تراقب تنفسه عن قرب.`,
                },
                spO2: 98,
                heartRate: 96,
              },
              {
                id: 'c3-o3',
                stageLabel: { en: '3. Snack Piece Cleared', ar: '٣. خروج القطعة والارتياح' },
                mediaKey: 'c3_o3_snack_cleared_relief',
                caption: {
                  en: `The cough clears the snack piece naturally and ${youssefEn} breathes comfortably!`,
                  ar: `السعال يطرد قطعة السناك، و${youssefAr} يرتاح ويتنفس بهدوء!`,
                },
                spO2: 99,
                heartRate: 90,
              },
            ],
            title: {
              en: 'Effective Cough Cleared the Airway!',
              ar: 'السعال الفعّال طرد القطعة بأمان!',
            },
            narrative: {
              en: `By encouraging ${youssefEn} to cough and staying right beside him, his strong natural cough expelled the snack piece safely.`,
              ar: `بتشجيع ${youssefAr} على السعال والبقاء بجانبه، نجح سعاله القوي في طرد القطعة بأمان.`,
            },
            clinicalWhy: {
              en: 'Slides 5 & 7: When a child has a strong cough and can speak or cry, encourage coughing and monitor closely.',
              ar: 'شريحة ٥ و٧: عندما يسعل الطفل بقوة ويقدر يتكلم أو يبكي، شجّعه على السعال وراقبه عن قرب.',
            },
            internalEffect: {
              en: 'Natural cough airflow clears the mild obstruction safely.',
              ar: 'اندفاع هواء السعال الطبيعي يطرد الانسداد الخفيف بأمان.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'complete',
          },
        },
        {
          id: 'c3-c2',
          label: {
            en: 'Perform forceful abdominal thrusts immediately',
            ar: 'نفّذ ضغطات بطن قوية فوراً',
          },
          subLabel: {
            en: 'Not indicated during an effective cough (Slide 7)',
            ar: 'غير مطلوبة أثناء السعال الفعّال (شريحة ٧)',
          },
          outcome: 'suboptimal',
          spO2Delta: -3,
          obstructionDelta: 10,
          consequenceBeat: {
            mediaKey: 'c3_o4_err_forceful_thrusts',
            title: {
              en: 'Unnecessary — Do Not Thrust During a Strong Cough',
              ar: 'تدخل غير لازم — لا تنفّذ ضغطات بطن أثناء السعال القوي',
            },
            narrative: {
              en: `Performing forceful abdominal thrusts while ${youssefEn} is coughing strongly frightens him and disrupts his natural cough.`,
              ar: `تنفيذ ضغطات بطن قوية بينما ${youssefAr} يسعل بفعالية يربك تنفسه ويقطع سعاله الطبيعي.`,
            },
            clinicalWhy: {
              en: 'Slides 5 & 7: Abdominal thrusts are for severe choking when the child cannot cough or speak.',
              ar: 'شريحة ٥ و٧: ضغطات البطن مخصصة للاختناق الشديد عندما يعجز الطفل عن السعال أو الكلام.',
            },
            internalEffect: {
              en: 'External thrusts interfere with the child’s coordinated cough reflex.',
              ar: 'الضغط الخارجي يتعارض مع منعكس السعال الطبيعي عند الطفل.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'retry',
          },
        },
        {
          id: 'c3-c3',
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
            mediaKey: 'c3_o5_err_water',
            title: {
              en: 'Wrong Action — Do Not Give Water During Choking (R-WATER)',
              ar: 'خطأ — لا تعطِ الماء أثناء الاختناق (R-WATER)',
            },
            narrative: {
              en: `Giving water interrupts ${youssefEn}'s effective cough and risks turning mild choking into severe blockage.`,
              ar: `إعطاء الماء يقطع سعال ${youssefAr} الفعّال وقد يحوّل الاختناق الخفيف إلى انسداد شديد.`,
            },
            clinicalWhy: {
              en: 'Rule R-WATER (Slide 25): Do not give water to a choking child; keep encouraging them to cough.',
              ar: 'قاعدة R-WATER (شريحة ٢٥): لا تعطِ الماء لطفل يختنق؛ استمر في تشجيعه على السعال.',
            },
            internalEffect: {
              en: 'Swallowing liquid interrupts the upward airflow of the cough.',
              ar: 'محاولة بلع السائل تعطل اندفاع الهواء اللازم للسعال.',
            },
            guidelineBadge: 'ARC',
            nextAction: 'retry',
          },
        },
      ],
    },
    takeaways: [
      {
        en: 'A child who is coughing loudly, speaking, or crying has a mild obstruction — encourage coughing and watch closely (Slides 5 & 7).',
        ar: 'الطفل الذي يسعل بقوة أو يتكلم أو يبكي لديه اختناق خفيف — شجّعه على السعال وراقبه عن قرب (شريحة ٥ و٧).',
      },
      {
        en: 'Do not give water or perform abdominal thrusts while the child’s cough remains strong and effective.',
        ar: 'لا تعطِ الماء ولا تنفّذ ضغطات بطن طالما أن سعال الطفل قوي وفعّال.',
      },
    ],
  },
];
