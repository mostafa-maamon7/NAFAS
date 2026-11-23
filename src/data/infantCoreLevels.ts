import { StoryLevel } from '../types/nafas';
import { CHARACTER_REGISTRY } from './characterRegistry';

const layanEn = CHARACTER_REGISTRY.infant.name.en;
const layanAr = CHARACTER_REGISTRY.infant.name.ar;

export const INFANT_CORE_LEVELS: StoryLevel[] = [
  // =========================================================================
  // I1 · الصمت في الحضانة (نيللي، 8 شهور، حضانة البيت) — شديد (Slides 20–21)
  // =========================================================================
  {
    id: 'I1',
    levelNumber: 8,
    ageGroup: 'infant',
    severity: 'severe',
    patientState: 'conscious',
    clinicalReview: true,
    clinicalReviewReason:
      'Doctor confirmation requested for exact hand-support angle, head-support detail, and exact chest-thrust finger placement wording on infant (Slides 20–21 & Section 7 Q4).',
    lectureSlideRefs: ['Slide 20', 'Slide 21', 'Slide 25'],
    ruleTags: ['R-INFANT', 'R-SWEEP'],
    title: {
      en: 'Silence in the Nursery',
      ar: 'الصمت في الحضانة',
    },
    subtitle: {
      en: `${layanEn} (8 mos) • Home Nursery (Severe Infant Choking)`,
      ar: `${layanAr} (٨ شهور) • حضانة البيت (اختناق شديد لرضيعة)`,
    },
    setting: {
      en: 'Home Nursery',
      ar: 'حضانة البيت',
    },
    character: {
      name: CHARACTER_REGISTRY.infant.name,
      age: CHARACTER_REGISTRY.infant.ageDisplay,
      role: CHARACTER_REGISTRY.infant.defaultRole,
    },
    hook: {
      en: `8-month-old ${layanEn} picks up a small object on the nursery mat and suddenly goes silent with a weak cough, no cry, and bluish lips. What will you do?`,
      ar: `الرضيعة ${layanAr} (٨ شهور) تضع شيئاً صغيراً في فمها في الحضانة وفجأة تسكت مع سعال ضعيف وبلا بكاء وتغيّر في اللون. ماذا ستفعل؟`,
    },
    objective: {
      en: 'Call for help and alternate up to 5 back blows and up to 5 chest thrusts — NEVER perform abdominal thrusts on an infant (Slides 20–21).',
      ar: 'اطلب المساعدة وبدّل بين حتى ٥ ضربات ظهر وحتى ٥ ضغطات صدر — ولا تضغط على بطن الرضيع أبداً (شريحة ٢٠–٢١).',
    },
    EstimatedMinutes: 3,
    PlainLanguageMap: {
      spO2: { en: 'Oxygen level', ar: 'مستوى الأكسجين' },
      airway: { en: 'Breathing passage', ar: 'مجرى التنفس' },
      cyanosis: { en: 'Blue lips', ar: 'زرقة الشفاه' },
      epiglottis: { en: 'Throat valve', ar: 'صمام الحلق' },
    },
    afterCareNote: {
      en: 'Important Note (Slide 21): Practical training is essential for infant choking care (التدريب العملي ضروري).',
      ar: 'تنبيه هام (شريحة ٢١): التدريب العملي ضروري لإتقان إسعاف اختناق الرضّع (Practical training is essential).',
    },
    sceneVisual: {
      environment: 'home_nursery',
      accentColor: '#13B8B0',
      mood: 'critical',
      obstructionLevel: 95,
      spO2Start: 86,
      spO2Critical: 82,
      heartRateStart: 152,
      respiratoryRate: 0,
      hasCyanosis: true,
      hasStridor: false,
      canSpeak: false,
      canCough: false,
      caption: {
        en: `${layanEn} (8 months) has a silent open mouth, no cry, weak ineffective cough, and bluish lips.`,
        ar: `${layanAr} (٨ شهور) بفم مفتوح بلا بكاء، سعال ضعيف غير فعّال، وتغيّر لون الشفاه للأزرق.`,
      },
      hotspots: [
        {
          id: 'i1-hs-cry',
          x: 47,
          y: 28,
          type: 'airway',
          label: { en: 'No cry / no sound', ar: 'مفيش بكاء أو صوت' },
          detail: {
            en: `${layanEn} cannot cry or make sound — severe airway obstruction (Slide 20).`,
            ar: `${layanAr} عاجزة عن البكاء أو إصدار صوت — انسداد شديد (شريحة ٢٠).`,
          },
        },
        {
          id: 'i1-hs-cough',
          x: 50,
          y: 38,
          type: 'symptom',
          label: { en: 'Weak cough & color change', ar: 'سعال ضعيف وتغيّر اللون' },
          detail: {
            en: 'Ineffective cough with bluish lips as oxygen drops.',
            ar: 'سعال ضعيف غير فعّال مع بدء تغيّر لون الشفاه.',
          },
        },
        {
          id: 'i1-hs-infant',
          x: 53,
          y: 56,
          type: 'anatomy',
          label: { en: 'Infant — No abdominal thrusts', ar: 'رضيع — ممنوع ضغطات البطن' },
          detail: {
            en: 'Rule R-INFANT (Slides 20–21): Use up to 5 back blows and up to 5 chest thrusts; never press the infant’s abdomen.',
            ar: 'قاعدة R-INFANT (شريحة ٢٠–٢١): استخدم حتى ٥ ضربات ظهر وحتى ٥ ضغطات صدر؛ ويُمنع ضغط بطن الرضيع نهائياً.',
          },
        },
      ],
    },
    storyBeats: [
      {
        id: 'i1-s1',
        phase: 'intro',
        durationSec: 4,
        mediaKey: 'i1_s1_nursery_wide',
        speaker: { en: 'S1 · Home Nursery', ar: 'S1 · حضانة البيت' },
        text: {
          en: `In the home nursery, 8-month-old ${layanEn} sits playing on her soft nursery mat.`,
          ar: `في حضانة البيت، تجلس الرضيعة ${layanAr} (٨ شهور) على بساط اللعب.`,
        },
        clinicalCue: {
          en: 'Infant (< 1 year) • Breathing passage open (99%)',
          ar: 'رضيعة (أقل من سنة) • مجرى التنفس مفتوح (٩٩٪)',
        },
        spO2: 99,
        heartRate: 124,
      },
      {
        id: 'i1-s2',
        phase: 'escalation',
        durationSec: 4,
        mediaKey: 'i1_s2_layan_mouths_object',
        speaker: { en: 'S2 · Small Object in Mouth', ar: 'S2 · تضع شيئاً صغيراً في فمها' },
        text: {
          en: `${layanEn} reaches for a small object on the mat and puts it into her mouth.`,
          ar: `تلتقط ${layanAr} شيئاً صغيراً وتضعه في فمها فجأة.`,
        },
        clinicalCue: {
          en: 'High choking risk in infants exploring small objects',
          ar: 'خطر اختناق مرتفع عند وضع الأشياء الصغيرة في فم الرضيع',
        },
        spO2: 95,
        heartRate: 136,
      },
      {
        id: 'i1-s3',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'i1_s3_silent_weak_cough_color',
        speaker: { en: 'S3 · Sudden Silence & Color Change', ar: 'S3 · صمت مفاجئ وتغيّر اللون' },
        text: {
          en: `Suddenly ${layanEn} goes silent with a weak cough, no cry, and bluish color around her lips.`,
          ar: `فجأة تسكت ${layanAr} مع سعال ضعيف، بدون بكاء، ويبدا تغيّر اللون حول شفتيها.`,
        },
        clinicalCue: {
          en: 'No cry • Weak cough • Color change = Severe Infant Choking (Slide 20)',
          ar: 'بلا بكاء • سعال ضعيف • تغيّر اللون = اختناق شديد للرضيع (شريحة ٢٠)',
        },
        spO2: 88,
        heartRate: 148,
      },
      {
        id: 'i1-s4',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'i1_s4_caregiver_lifts_layan',
        speaker: { en: 'S4 · Caregiver Picks Her Up', ar: 'S4 · المربّي يحمل نيللي' },
        text: {
          en: `The caregiver picks ${layanEn} up immediately and calls out for emergency help.`,
          ar: `يحمل المربّي ${layanAr} فوراً وينادي لطلب المساعدة والإسعاف.`,
        },
        clinicalCue: {
          en: 'Support head & jaw • Prepare infant back blows & chest thrusts',
          ar: 'اسند الرأس والفك • استعد لضربات الظهر وضغطات الصدر للرضيع',
        },
        spO2: 86,
        heartRate: 152,
      },
      {
        id: 'i1-s5',
        phase: 'decision_prompt',
        durationSec: 5,
        mediaKey: 'i1_s5_decision_moment',
        speaker: { en: 'S5 · Decision Moment', ar: 'S5 · لحظة القرار' },
        text: {
          en: `${layanEn} cannot cry or breathe effectively. What is the safe infant protocol?`,
          ar: `${layanAr} لا تقدر تبكي أو تتنفس بفعالية. ما هو البروتوكول الآمن للرضيع؟`,
        },
        clinicalCue: {
          en: 'Inspect the 3 signs in the Info Rail, then decide',
          ar: 'افحص العلامات الثلاث في اللوحة الجانبية ثم قرّر',
        },
        spO2: 86,
        heartRate: 154,
      },
    ],
    decisionNode: {
      id: 'i1-d1',
      prompt: {
        en: `${layanEn} (8 mos) is severely choking. How do you intervene safely?`,
        ar: `${layanAr} (٨ شهور) في حالة اختناق شديد. كيف تتدخل بأمان؟`,
      },
      contextNote: {
        en: 'Lecture Slides 20–21: Alternate up to 5 back blows & up to 5 chest thrusts. No abdominal thrusts in infants. Practical training is essential.',
        ar: 'شريحة ٢٠–٢١: بدّل بين حتى ٥ ضربات ظهر وحتى ٥ ضغطات صدر. ممنوع ضغطات البطن للرضيع. التدريب العملي ضروري.',
      },
      timeLimitSec: 20,
      choices: [
        {
          id: 'i1-c1',
          label: {
            en: 'Call for help and alternate up to 5 back blows and up to 5 chest thrusts',
            ar: 'اطلب المساعدة وبدّل بين حتى ٥ ضربات ظهر وحتى ٥ ضغطات صدر',
          },
          subLabel: {
            en: 'Rule R-INFANT (Slides 20–21)',
            ar: 'قاعدة R-INFANT (شريحة ٢٠–٢١)',
          },
          outcome: 'optimal',
          spO2Delta: 12,
          obstructionDelta: -95,
          consequenceBeat: {
            mediaKey: 'i1_o3_object_cleared_layan_cries',
            playbackFrames: [
              {
                id: 'i1-o1',
                stageLabel: { en: '1. Support on Forearm & Back Blows', ar: '١. وضع الرضيع على الساعد وضربات الظهر' },
                mediaKey: 'i1_o1_forearm_back_blows',
                caption: {
                  en: `Supporting ${layanEn}'s head and jaw face-down on your forearm, you deliver up to 5 gentle but firm back blows.`,
                  ar: `تسند رأس وفك ${layanAr} على ساعدك وتنفّذ حتى ٥ ضربات ظهر محسوبة.`,
                },
                spO2: 89,
                heartRate: 144,
              },
              {
                id: 'i1-o2',
                stageLabel: { en: '2. Turn & Up to 5 Chest Thrusts', ar: '٢. قلب الرضيع وحتى ٥ ضغطات صدر' },
                mediaKey: 'i1_o2_turn_chest_thrusts',
                caption: {
                  en: `You turn ${layanEn} safely onto her back while supporting her head and give up to 5 two-finger chest thrusts.`,
                  ar: `تقلب ${layanAr} بأمان مع دعم الرأس وتنفّذ حتى ٥ ضغطات صدر بإصبعين.`,
                },
                spO2: 94,
                heartRate: 134,
              },
              {
                id: 'i1-o3',
                stageLabel: { en: '3. Object Expelled & Crying', ar: '٣. خروج الجسم وبكاء نيللي' },
                mediaKey: 'i1_o3_object_cleared_layan_cries',
                caption: {
                  en: `The small object pops out and ${layanEn} cries out loudly with pink lips restored!`,
                  ar: `يخرج الجسم العالق وتبكي ${layanAr} بصوت واضح ويعود لونها الطبيعي!`,
                },
                spO2: 98,
                heartRate: 124,
              },
            ],
            title: {
              en: 'Infant Airway Cleared Without Abdominal Thrusts!',
              ar: 'تم فتح مجرى تنفس الرضيعة بدون ضغط على البطن!',
            },
            narrative: {
              en: `By supporting ${layanEn} on your forearm and alternating up to 5 back blows and up to 5 chest thrusts, the object cleared safely. Remember: practical training is essential (Slide 21).`,
              ar: `بإسناد ${layanAr} على ساعدك والتبديل بين حتى ٥ ضربات ظهر وحتى ٥ ضغطات صدر، خرج الجسم بأمان. تذكّر: التدريب العملي ضروري (شريحة ٢١).`,
            },
            clinicalWhy: {
              en: 'Slides 20–21: For an infant under 1 year with severe choking, alternate up to 5 back blows and up to 5 chest thrusts. Never perform abdominal thrusts (Rule R-INFANT). Practical training is essential.',
              ar: 'شريحة ٢٠–٢١: للرضيع المصاب باختناق شديد، بدّل بين حتى ٥ ضربات ظهر وحتى ٥ ضغطات صدر. يُمنع ضغط البطن للرضيع (R-INFANT)، والتدريب العملي ضروري.',
            },
            internalEffect: {
              en: 'Gravity-assisted back blows and two-finger chest thrusts expel the blockage while protecting fragile abdominal organs.',
              ar: 'ضربات الظهر وضغطات الصدر بإصبعين تطرد الانسداد مع حماية أعضاء بطن الرضيع الحساسة.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'complete',
          },
        },
        {
          id: 'i1-c2',
          label: {
            en: 'Perform abdominal thrusts on the infant',
            ar: 'نفّذ ضغطات بطن للرضيعة',
          },
          subLabel: {
            en: 'Strictly forbidden in infants (Rule R-INFANT)',
            ar: 'ممنوع نهائياً للرضيع (قاعدة R-INFANT)',
          },
          outcome: 'harmful',
          spO2Delta: -14,
          obstructionDelta: 0,
          consequenceBeat: {
            mediaKey: 'i1_o4_err_infant_abdominal_thrusts',
            title: {
              en: 'Critical Safety Violation — Never Perform Abdominal Thrusts on an Infant (R-INFANT)',
              ar: 'مخالفة خطيرة — ممنوع ضغطات البطن للرضيع (R-INFANT)',
            },
            narrative: {
              en: `Pressing on ${layanEn}'s abdomen risks severe injury to the infant’s fragile internal organs. Always use chest thrusts instead.`,
              ar: `ضغط بطن الرضيعة ${layanAr} يعرّض أعضاءها الداخلية لإصابة خطيرة. استخدم دائماً ضغطات الصدر بدلاً من البطن.`,
            },
            clinicalWhy: {
              en: 'Rule R-INFANT (Slides 20–21): Never perform abdominal thrusts on an infant; alternate up to 5 back blows and up to 5 chest thrusts.',
              ar: 'قاعدة R-INFANT (شريحة ٢٠–٢١): يُمنع تطبيق ضغطات البطن على الرضيع؛ بدّل بين حتى ٥ ضربات ظهر وحتى ٥ ضغطات صدر.',
            },
            internalEffect: {
              en: 'Abdominal compression risks liver and visceral trauma in infants.',
              ar: 'ضغط البطن عند الرضّع يسبب خطر إصابة الكبد والأحشاء.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'retry',
          },
        },
        {
          id: 'i1-c3',
          label: {
            en: 'Perform a blind finger sweep in her mouth',
            ar: 'اعمل مسحاً أعمى بالإصبع في فمها',
          },
          subLabel: {
            en: 'Pushes the object deeper (Rule R-SWEEP)',
            ar: 'يدفع الجسم أعمق (قاعدة R-SWEEP)',
          },
          outcome: 'harmful',
          spO2Delta: -12,
          obstructionDelta: 5,
          consequenceBeat: {
            mediaKey: 'i1_o5_err_blind_sweep',
            title: {
              en: 'Critical Error — Never Sweep an Infant’s Mouth Blindly (R-SWEEP)',
              ar: 'خطأ حرج — لا تقم أبداً بمسح أعمى في فم الرضيع (R-SWEEP)',
            },
            narrative: {
              en: `Inserting your finger blindly into ${layanEn}'s tiny mouth pushes the object deeper into the airway.`,
              ar: `إدخال إصبعك بشكل أعمى في فم ${layanAr} الصغير يدفع الجسم الغريب أعمق داخل مجرى التنفس.`,
            },
            clinicalWhy: {
              en: 'Rule R-SWEEP (Slides 17, 20, 25): Never perform a blind finger sweep in an infant or child.',
              ar: 'قاعدة R-SWEEP (شرائح ١٧، ٢٠، ٢٥): لا تقم أبداً بمسح أعمى بالإصبع في فم الرضيع.',
            },
            internalEffect: {
              en: 'The finger wedges the foreign body tightly against the infant glottis.',
              ar: 'الإصبع يحشر الجسم الغريب بإحكام في مدخل حنجرة الرضيع.',
            },
            guidelineBadge: 'ARC',
            nextAction: 'retry',
          },
        },
      ],
    },
    takeaways: [
      {
        en: 'For a severely choking infant, alternate up to 5 back blows and up to 5 chest thrusts — never abdominal thrusts (Slides 20–21).',
        ar: 'للرضيع المصاب باختناق شديد، بدّل بين حتى ٥ ضربات ظهر وحتى ٥ ضغطات صدر — ويُمنع ضغط البطن نهائياً (شريحة ٢٠–٢١).',
      },
      {
        en: 'Practical hands-on training is essential to master infant choking rescue safely (Slide 21).',
        ar: 'التدريب العملي ضروري لإتقان مهارة إنقاذ الرضيع المختنق بأمان (شريحة ٢١).',
      },
    ],
  },

  // =========================================================================
  // I2 · نيللي ساكتة بين إيديك (نيللي، 8 شهور) — فاقد الوعي (Slide 20)
  // =========================================================================
  {
    id: 'I2',
    levelNumber: 9,
    ageGroup: 'infant',
    severity: 'unresponsive',
    patientState: 'unconscious',
    lectureSlideRefs: ['Slide 20', 'Slide 17', 'Slide 25'],
    ruleTags: ['R-UNRESP', 'R-SWEEP', 'R-EMS'],
    title: {
      en: 'Nelly Limp in Your Arms',
      ar: 'نيللي ساكتة بين إيديك',
    },
    subtitle: {
      en: `${layanEn} (8 mos) • Nursery Firm Surface (Unresponsive Infant)`,
      ar: `${layanAr} (٨ شهور) • سطح ثابت في الحضانة (فاقدة الوعي)`,
    },
    setting: {
      en: 'Nursery Firm Surface',
      ar: 'سطح ثابت وآمن في الحضانة',
    },
    character: {
      name: CHARACTER_REGISTRY.infant.name,
      age: CHARACTER_REGISTRY.infant.ageDisplay,
      role: CHARACTER_REGISTRY.infant.defaultRole,
    },
    hook: {
      en: `8-month-old ${layanEn} loses responsiveness in your arms after choking. What is your immediate action?`,
      ar: `الرضيعة ${layanAr} (٨ شهور) تفقد الاستجابة بين يديك بعد الاختناق. ما هو تصرفك الفوري؟`,
    },
    objective: {
      en: 'Place her on a firm surface, ensure EMS is called, and start infant CPR according to your training without blind finger sweeps (Slide 20).',
      ar: 'ضعها على سطح ثابت، تأكد من الاتصال بالإسعاف، وابدأ إنعاش الرضيع حسب تدريبك بدون مسح أعمى (شريحة ٢٠).',
    },
    EstimatedMinutes: 3,
    PlainLanguageMap: {
      spO2: { en: 'Oxygen level', ar: 'مستوى الأكسجين' },
      airway: { en: 'Breathing passage', ar: 'مجرى التنفس' },
      cyanosis: { en: 'Blue lips', ar: 'زرقة الشفاه' },
      epiglottis: { en: 'Throat valve', ar: 'صمام الحلق' },
    },
    afterCareNote: {
      en: 'Tip: Only remove an object if you can see it clearly in the infant’s mouth — never perform a blind finger sweep (Slides 17 & 20).',
      ar: 'نصيحة: أزل الجسم فقط إذا رأيته بوضوح في فم الرضيع — ولا تقم أبداً بمسح أعمى بالإصبع (شريحة ١٧ و٢٠).',
    },
    sceneVisual: {
      environment: 'home_nursery',
      accentColor: '#DC5252',
      mood: 'critical',
      obstructionLevel: 100,
      spO2Start: 79,
      spO2Critical: 75,
      heartRateStart: 146,
      respiratoryRate: 0,
      hasCyanosis: true,
      hasStridor: false,
      canSpeak: false,
      canCough: false,
      caption: {
        en: `${layanEn} is placed flat on a firm, safe surface after becoming unresponsive and not breathing.`,
        ar: `توضع ${layanAr} على سطح ثابت وآمن بعد فقدان الاستجابة وتوقف التنفس.`,
      },
      hotspots: [
        {
          id: 'i2-hs-unresp',
          x: 47,
          y: 32,
          type: 'symptom',
          label: { en: 'Unresponsive infant', ar: 'فاقدة الاستجابة' },
          detail: {
            en: `${layanEn} is limp and does not respond to stimulation (Slide 20).`,
            ar: `${layanAr} مرتخية تماماً ولا تستجيب للتنبيه (شريحة ٢٠).`,
          },
        },
        {
          id: 'i2-hs-breath',
          x: 50,
          y: 46,
          type: 'airway',
          label: { en: 'Not breathing', ar: 'لا تتنفس' },
          detail: {
            en: 'No normal breathing or crying.',
            ar: 'لا يوجد تنفس طبيعي أو بكاء.',
          },
        },
        {
          id: 'i2-hs-surface',
          x: 54,
          y: 64,
          type: 'environment',
          label: { en: 'On a firm surface', ar: 'على سطح ثابت' },
          detail: {
            en: 'Placed on her back on a firm flat surface to start infant CPR according to your training.',
            ar: 'موضوعة على ظهرها فوق سطح ثابت ومستوٍ لبدء إنعاش الرضيع حسب تدريبك.',
          },
        },
      ],
    },
    storyBeats: [
      {
        id: 'i2-s1',
        phase: 'intro',
        durationSec: 4,
        mediaKey: 'i2_s1_layan_loses_response',
        speaker: { en: 'S1 · Loss of Responsiveness', ar: 'S1 · نيللي تفقد الاستجابة' },
        text: {
          en: `While choking in the nursery, 8-month-old ${layanEn} suddenly stops moving and loses responsiveness.`,
          ar: `أثناء الاختناق في الحضانة، تفقد الرضيعة ${layanAr} (٨ شهور) الاستجابة فجأة.`,
        },
        clinicalCue: {
          en: 'Infant becomes unresponsive (Slide 20)',
          ar: 'الرضيعة تصبح فاقدة للاستجابة (شريحة ٢٠)',
        },
        spO2: 83,
        heartRate: 150,
      },
      {
        id: 'i2-s2',
        phase: 'escalation',
        durationSec: 4,
        mediaKey: 'i2_s2_limp_in_caregiver_arms',
        speaker: { en: 'S2 · Limp in Your Arms', ar: 'S2 · ارتخاء بين يدي المربّي' },
        text: {
          en: `${layanEn}'s body goes limp in the caregiver’s arms with no cry and no breath.`,
          ar: `يرتخي جسم ${layanAr} بين يدي المربّي بدون بكاء وبدون تنفس.`,
        },
        clinicalCue: {
          en: 'Limp posture • Transition immediately to unresponsive protocol',
          ar: 'ارتخاء كامل • انتقل فوراً لبروتوكول فقدان الوعي',
        },
        spO2: 81,
        heartRate: 148,
      },
      {
        id: 'i2-s3',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'i2_s3_place_on_firm_surface',
        speaker: { en: 'S3 · Place on Firm Safe Surface', ar: 'S3 · وضعها على سطح ثابت وآمن' },
        text: {
          en: `The caregiver places ${layanEn} gently on her back on a firm, safe flat surface.`,
          ar: `يضعها المربّي برفق على ظهرها فوق سطح ثابت وآمن.`,
        },
        clinicalCue: {
          en: 'Firm flat surface required for infant CPR (Slide 20)',
          ar: 'السطح الثابت والمسطح ضروري لإنعاش الرضيع (شريحة ٢٠)',
        },
        spO2: 79,
        heartRate: 146,
      },
      {
        id: 'i2-s4',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'i2_s4_confirm_ems_call',
        speaker: { en: 'S4 · Confirm Emergency Call', ar: 'S4 · تأكيد طلب الإسعاف' },
        text: {
          en: `Emergency Medical Services are called on speakerphone right beside the firm surface.`,
          ar: `يتم تأكيد طلب الإسعاف على مكبر الصوت بجانب السطح الثابت.`,
        },
        clinicalCue: {
          en: 'Rule R-EMS: Ensure ambulance is dispatched',
          ar: 'قاعدة R-EMS: تأكد من طلب الإسعاف فوراً',
        },
        spO2: 79,
        heartRate: 146,
      },
      {
        id: 'i2-s5',
        phase: 'decision_prompt',
        durationSec: 5,
        mediaKey: 'i2_s5_decision_moment',
        speaker: { en: 'S5 · Decision Moment', ar: 'S5 · لحظة القرار' },
        text: {
          en: `${layanEn} is unresponsive and not breathing on the firm surface. What will you do now?`,
          ar: `${layanAr} فاقدة الاستجابة ولا تتنفس على السطح الثابت. ماذا ستفعل الآن؟`,
        },
        clinicalCue: {
          en: 'Inspect the 3 signs in the Info Rail, then decide',
          ar: 'افحص العلامات الثلاث في اللوحة الجانبية ثم قرّر',
        },
        spO2: 79,
        heartRate: 146,
      },
    ],
    decisionNode: {
      id: 'i2-d1',
      prompt: {
        en: `${layanEn} (8 mos) is unresponsive on a firm surface. What is the right action?`,
        ar: `${layanAr} (٨ شهور) فاقدة الوعي على سطح ثابت. ما هو التصرف الصحيح؟`,
      },
      contextNote: {
        en: 'Lecture Slide 20 & Slide 17: Ensure EMS is called, start infant CPR according to your training, and never perform a blind sweep.',
        ar: 'شريحة ٢٠ وشريحة ١٧: تأكد من الاتصال بالإسعاف، ابدأ إنعاش الرضيع حسب تدريبك، ولا تقم بمسح أعمى بالإصبع.',
      },
      timeLimitSec: 20,
      choices: [
        {
          id: 'i2-c1',
          label: {
            en: 'Ensure EMS is called and start infant CPR according to your training',
            ar: 'تأكد من الاتصال بالإسعاف وابدأ إنعاش الرضيع حسب تدريبك',
          },
          subLabel: {
            en: 'Rules R-UNRESP & R-SWEEP (Slides 20 & 17)',
            ar: 'قواعد R-UNRESP و R-SWEEP (شريحة ٢٠ و١٧)',
          },
          outcome: 'optimal',
          spO2Delta: 17,
          obstructionDelta: -100,
          consequenceBeat: {
            mediaKey: 'i2_o3_visible_removed_ems_arrives',
            playbackFrames: [
              {
                id: 'i2-o1',
                stageLabel: { en: '1. Firm Surface & EMS Confirmed', ar: '١. التثبيت على سطح ثابت وتأكيد الإسعاف' },
                mediaKey: 'i2_o1_firm_surface_ems',
                caption: {
                  en: `${layanEn} is supported on the firm flat surface while EMS dispatch is confirmed.`,
                  ar: `تثبيت ${layanAr} على السطح الثابت مع تأكيد الاتصال بالإسعاف.`,
                },
                spO2: 82,
                heartRate: 142,
              },
              {
                id: 'i2-o2',
                stageLabel: { en: '2. Start Infant CPR According to Training', ar: '٢. بدء إنعاش الرضيع حسب تدريبك' },
                mediaKey: 'i2_o2_start_infant_cpr',
                caption: {
                  en: `You start infant CPR according to your training and check the mouth visually without a blind finger sweep.`,
                  ar: `تبدأ إنعاش الرضيع حسب تدريبك وتفحص الفم بالنظر فقط بدون مسح أعمى بالإصبع.`,
                },
                spO2: 90,
                heartRate: 132,
              },
              {
                id: 'i2-o3',
                stageLabel: { en: '3. Visible Object Removed & EMS', ar: '٣. إزالة الجسم المرئي فقط ووصول الإسعاف' },
                mediaKey: 'i2_o3_visible_removed_ems_arrives',
                caption: {
                  en: `You remove the object only when clearly visible, and ${layanEn} resumes breathing as EMS arrives.`,
                  ar: `تزيل الجسم فقط بعد رؤيته بوضوح، وتستعيد ${layanAr} تنفسها مع وصول الإسعاف.`,
                },
                spO2: 96,
                heartRate: 124,
              },
            ],
            title: {
              en: 'Accurate Unresponsive Infant Rescue!',
              ar: 'تطبيق دقيق لبروتوكول الرضيع فاقد الوعي!',
            },
            narrative: {
              en: `You placed ${layanEn} on a firm surface, confirmed EMS, started infant CPR according to your training, and removed the object only when clearly visible.`,
              ar: `وضعت ${layanAr} على سطح ثابت، أكدت الاتصال بالإسعاف، بدأت إنعاش الرضيع حسب تدريبك، وأزلت الجسم فقط عندما ظهر بوضوح.`,
            },
            clinicalWhy: {
              en: 'Slide 20 & Slide 17: If an infant becomes unresponsive, place on a firm surface, ensure EMS is called, and start infant CPR according to your training without blind finger sweeps.',
              ar: 'شريحة ٢٠ وشريحة ١٧: إذا فقد الرضيع الوعي، ضعه على سطح ثابت، تأكد من الاتصال بالإسعاف، وابدأ إنعاش الرضيع حسب تدريبك بدون مسح أعمى.',
            },
            internalEffect: {
              en: 'Infant CPR maintains blood flow and helps dislodge the airway obstruction.',
              ar: 'إنعاش الرضيع يحافظ على تدفق الدم ويساعد على تحرير الانسداد.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'complete',
          },
        },
        {
          id: 'i2-c2',
          label: {
            en: 'Perform a blind finger sweep inside her mouth',
            ar: 'اعمل مسحاً أعمى بالإصبع داخل فمها',
          },
          subLabel: {
            en: 'Pushes the object deeper (Rule R-SWEEP)',
            ar: 'يدفع الجسم للداخل (قاعدة R-SWEEP)',
          },
          outcome: 'harmful',
          spO2Delta: -12,
          obstructionDelta: 0,
          consequenceBeat: {
            mediaKey: 'i2_o4_err_blind_sweep',
            title: {
              en: 'Critical Error — Never Perform a Blind Finger Sweep (R-SWEEP)',
              ar: 'خطأ حرج — يُمنع المسح الأعمى بالإصبع (R-SWEEP)',
            },
            narrative: {
              en: `Sweeping your finger blindly in ${layanEn}'s mouth pushes the unseen object deeper into her airway.`,
              ar: `المسح الأعمى بالإصبع في فم ${layanAr} يدفع الجسم غير المرئي أعمق داخل مجرى التنفس.`,
            },
            clinicalWhy: {
              en: 'Rule R-SWEEP (Slides 17 & 20): Never perform a blind finger sweep; only remove an object if you can clearly see it.',
              ar: 'قاعدة R-SWEEP (شريحة ١٧ و٢٠): لا تقم أبداً بمسح أعمى بالإصبع؛ أزل الجسم فقط إذا رأيته بوضوح.',
            },
            internalEffect: {
              en: 'Blind finger insertion impacts the object deeper into the infant subglottis.',
              ar: 'إدخال الإصبع بدون رؤية يدفع الجسم الغريب لسد الحنجرة بالكامل.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'retry',
          },
        },
        {
          id: 'i2-c3',
          label: {
            en: 'Wait for her to wake up on her own',
            ar: 'انتظر حتى تفيق وحدها',
          },
          subLabel: {
            en: 'Fatal delay in an unresponsive infant (Rule R-UNRESP)',
            ar: 'تأخير خطير مع رضيع فاقد الوعي (قاعدة R-UNRESP)',
          },
          outcome: 'harmful',
          spO2Delta: -15,
          obstructionDelta: 0,
          consequenceBeat: {
            mediaKey: 'i2_o5_err_wait_to_wake',
            title: {
              en: 'Dangerous Delay — Never Wait When an Infant Is Unresponsive',
              ar: 'تأخير قاتل — لا تنتظر أبداً عندما يكون الرضيع فاقداً للوعي',
            },
            narrative: {
              en: `Waiting without starting CPR leaves ${layanEn} without oxygen while her airway remains blocked.`,
              ar: `الانتظار دون بدء الإنعاش يترك ${layanAr} بلا أكسجين مع استمرار انسداد مجرى التنفس.`,
            },
            clinicalWhy: {
              en: 'Rule R-UNRESP (Slide 20): An unresponsive choking infant requires immediate EMS activation and infant CPR according to your training.',
              ar: 'قاعدة R-UNRESP (شريحة ٢٠): الرضيع فاقد الوعي يحتاج فوراً لتأكيد الإسعاف وبدء الإنعاش حسب تدريبك.',
            },
            internalEffect: {
              en: 'Hypoxia worsens rapidly every second CPR is delayed.',
              ar: 'نقص الأكسجين يتفاقم بسرعة مع كل ثانية يتأخر فيها الإنعاش.',
            },
            guidelineBadge: 'ARC',
            nextAction: 'retry',
          },
        },
      ],
    },
    takeaways: [
      {
        en: 'When an infant becomes unresponsive, place on a firm surface, ensure EMS is called, and start infant CPR according to your training (Slide 20).',
        ar: 'عند فقدان الرضيع للوعي، ضعه على سطح ثابت، تأكد من الاتصال بالإسعاف، وابدأ إنعاش الرضيع حسب تدريبك (شريحة ٢٠).',
      },
      {
        en: 'Never perform a blind finger sweep; only remove an object if clearly visible (Slide 17).',
        ar: 'لا تقم أبداً بمسح أعمى بالإصبع؛ أزل الجسم فقط إذا كان مرئياً بوضوح (شريحة ١٧).',
      },
    ],
  },

  // =========================================================================
  // I3 · سعال قوي في الكرسي العالي (نيللي، 8 شهور) — خفيف (Slide 5)
  // =========================================================================
  {
    id: 'I3',
    levelNumber: 10,
    ageGroup: 'infant',
    severity: 'mild',
    patientState: 'conscious',
    clinicalReview: true,
    clinicalReviewReason:
      'Doctor confirmation requested for infant mild choking wrong choices rationale in I3 — Section 4 I3 & Section 7 Q6.',
    lectureSlideRefs: ['Slide 5', 'Slide 7', 'Slide 20'],
    ruleTags: ['R-ASK', 'R-INFANT', 'R-SWEEP'],
    title: {
      en: 'Strong Cough in the High Chair',
      ar: 'سعال قوي في الكرسي العالي',
    },
    subtitle: {
      en: `${layanEn} (8 mos) • High Chair at Home (Mild Infant Choking)`,
      ar: `${layanAr} (٨ شهور) • الكرسي العالي بالبيت (اختناق خفيف)`,
    },
    setting: {
      en: 'High Chair at Home',
      ar: 'الكرسي العالي في البيت',
    },
    character: {
      name: CHARACTER_REGISTRY.infant.name,
      age: CHARACTER_REGISTRY.infant.ageDisplay,
      role: CHARACTER_REGISTRY.infant.defaultRole,
    },
    hook: {
      en: `8-month-old ${layanEn} is eating in her high chair and starts coughing loudly while crying with a strong voice and normal pink color. What will you do?`,
      ar: `الرضيعة ${layanAr} (٨ شهور) تأكل في الكرسي العالي وتبدأ بسعال مسموع وبكاء قوي ولونها طبيعي. ماذا ستفعل؟`,
    },
    objective: {
      en: 'Monitor her closely and stay ready to intervene if the cough weakens — do not perform abdominal thrusts or blind sweeps (Slide 5).',
      ar: 'راقبها عن قرب وكن مستعداً للتدخل لو السعال ضعف — بدون ضغطات بطن أو مسح أعمى (شريحة ٥).',
    },
    EstimatedMinutes: 2,
    PlainLanguageMap: {
      spO2: { en: 'Oxygen level', ar: 'مستوى الأكسجين' },
      airway: { en: 'Breathing passage', ar: 'مجرى التنفس' },
      cyanosis: { en: 'Blue lips', ar: 'زرقة الشفاه' },
      epiglottis: { en: 'Throat valve', ar: 'صمام الحلق' },
    },
    afterCareNote: {
      en: 'Tip: If the infant’s cough or cry becomes weak or silent, immediately start infant back blows and chest thrusts (Slides 5 & 20).',
      ar: 'نصيحة: لو تحوّل سعال الرضيعة أو بكاؤها إلى ضعيف أو صامت، ابدأ فوراً ضربات الظهر وضغطات الصدر للرضيع (شريحة ٥ و٢٠).',
    },
    sceneVisual: {
      environment: 'home_nursery',
      accentColor: '#13B8B0',
      mood: 'focused',
      obstructionLevel: 25,
      spO2Start: 97,
      spO2Critical: 95,
      heartRateStart: 126,
      respiratoryRate: 28,
      hasCyanosis: false,
      hasStridor: false,
      canSpeak: true,
      canCough: true,
      caption: {
        en: `${layanEn} sits in her high chair coughing audibly and crying with a strong voice and normal pink color.`,
        ar: `${layanAr} تجلس في الكرسي العالي وتسعل بصوت مسموع وتبكي بصوت قوي ولونها الوردي طبيعي.`,
      },
      hotspots: [
        {
          id: 'i3-hs-cough',
          x: 48,
          y: 33,
          type: 'airway',
          label: { en: 'Audible strong cough', ar: 'سعال مسموع' },
          detail: {
            en: `${layanEn} has a clear, audible cough moving air effectively (Slide 5).`,
            ar: `${layanAr} تسعل بصوت مسموع وواضح يدل على مرور الهواء بفعالية (شريحة ٥).`,
          },
        },
        {
          id: 'i3-hs-cry',
          x: 46,
          y: 24,
          type: 'symptom',
          label: { en: 'Strong crying / voice', ar: 'بكاء أو صوت قوي' },
          detail: {
            en: 'A loud cry between coughs shows the airway is not severely blocked.',
            ar: 'البكاء بصوت قوي بين السعلات يؤكد أن مجرى التنفس غير مسدود بشدة.',
          },
        },
        {
          id: 'i3-hs-color',
          x: 52,
          y: 50,
          type: 'anatomy',
          label: { en: 'Normal color', ar: 'لون طبيعي' },
          detail: {
            en: 'Face and lips remain pink with normal oxygen saturation.',
            ar: 'لون الوجه والشفاه وردي طبيعي مع مستوى أكسجين جيد.',
          },
        },
      ],
    },
    storyBeats: [
      {
        id: 'i3-s1',
        phase: 'intro',
        durationSec: 4,
        mediaKey: 'i3_s1_high_chair_wide',
        speaker: { en: 'S1 · High Chair at Home', ar: 'S1 · الكرسي العالي في البيت' },
        text: {
          en: `8-month-old ${layanEn} sits upright in her high chair at home during feeding time.`,
          ar: `تجلس الرضيعة ${layanAr} (٨ شهور) في الكرسي العالي في البيت وقت الأكل.`,
        },
        clinicalCue: {
          en: 'Supervised infant feeding • Oxygen level 99%',
          ar: 'إطعام الرضيعة تحت الملاحظة • مستوى الأكسجين ٩٩٪',
        },
        spO2: 99,
        heartRate: 120,
      },
      {
        id: 'i3-s2',
        phase: 'escalation',
        durationSec: 4,
        mediaKey: 'i3_s2_layan_eating_soft_food',
        speaker: { en: 'S2 · Tasting Soft Food', ar: 'S2 · نيللي تأكل' },
        text: {
          en: `${layanEn} swallows a spoonful of soft food quickly and sputters.`,
          ar: `تبلع ${layanAr} لقمة صغيرة بسرعة وتشرق أثناء الأكل.`,
        },
        clinicalCue: {
          en: 'Sudden gag reflex triggered during feeding',
          ar: 'تنبيه منعكس السعال الطبيعي أثناء الأكل',
        },
        spO2: 98,
        heartRate: 124,
      },
      {
        id: 'i3-s3',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'i3_s3_strong_audible_cough',
        speaker: { en: 'S3 · Strong Audible Cough', ar: 'S3 · سعال قوي ومسموع' },
        text: {
          en: `${layanEn} starts coughing loudly and audibly right away.`,
          ar: `تبدأ ${layanAr} بسعال قوي ومسموع فوراً.`,
        },
        clinicalCue: {
          en: 'Audible strong cough = Effective cough (Slide 5)',
          ar: 'سعال قوي ومسموع = سعال فعّال (شريحة ٥)',
        },
        spO2: 97,
        heartRate: 126,
      },
      {
        id: 'i3-s4',
        phase: 'symptoms',
        durationSec: 4,
        mediaKey: 'i3_s4_loud_cry_normal_color',
        speaker: { en: 'S4 · Loud Cry & Pink Color', ar: 'S4 · صوت بكاء واضح ولون طبيعي' },
        text: {
          en: `Between coughs, ${layanEn} cries out with a clear, strong voice and her face stays normal pink.`,
          ar: `بين السعلات يصدر من ${layanAr} صوت بكاء واضح ولون وجهها طبيعي تماماً.`,
        },
        clinicalCue: {
          en: 'Loud cry & normal color = Mild Infant Choking (Slide 5)',
          ar: 'بكاء واضح ولون طبيعي = اختناق خفيف (شريحة ٥)',
        },
        spO2: 97,
        heartRate: 128,
      },
      {
        id: 'i3-s5',
        phase: 'decision_prompt',
        durationSec: 5,
        mediaKey: 'i3_s5_decision_moment',
        speaker: { en: 'S5 · Decision Moment', ar: 'S5 · لحظة القرار' },
        text: {
          en: `${layanEn} has an audible cough, strong crying voice, and normal color. What will you do?`,
          ar: `${layanAr} لديها سعال مسموع، وبكاء قوي، ولون طبيعي. ماذا ستفعل؟`,
        },
        clinicalCue: {
          en: 'Inspect the 3 signs in the Info Rail, then decide',
          ar: 'افحص العلامات الثلاث في اللوحة الجانبية ثم قرّر',
        },
        spO2: 97,
        heartRate: 128,
      },
    ],
    decisionNode: {
      id: 'i3-d1',
      prompt: {
        en: `${layanEn} (8 mos) is coughing audibly and crying loudly. What is the right action?`,
        ar: `${layanAr} (٨ شهور) تسعل بصوت مسموع وتبكي بقوة. ما هو التصرف الصحيح؟`,
      },
      contextNote: {
        en: 'Lecture Slide 5: Effective cough and loud cry in mild choking — monitor closely and stay ready.',
        ar: 'شريحة ٥: السعال الفعّال والبكاء القوي في الاختناق الخفيف — راقبها عن قرب وكن مستعداً.',
      },
      timeLimitSec: 20,
      choices: [
        {
          id: 'i3-c1',
          label: {
            en: 'Monitor her closely and stay ready to intervene if the cough weakens',
            ar: 'راقبها عن قرب وكن مستعداً للتدخل لو السعال ضعف',
          },
          subLabel: {
            en: 'Mild choking with effective cough (Slide 5)',
            ar: 'اختناق خفيف مع سعال فعّال (شريحة ٥)',
          },
          outcome: 'optimal',
          spO2Delta: 2,
          obstructionDelta: -25,
          consequenceBeat: {
            mediaKey: 'i3_o3_layan_calms_breathes',
            playbackFrames: [
              {
                id: 'i3-o1',
                stageLabel: { en: '1. Stay Beside & Observe', ar: '١. البقاء بجانبها ومراقبة السعال' },
                mediaKey: 'i3_o1_watch_closely_high_chair',
                caption: {
                  en: `You stay right beside ${layanEn} in her high chair, letting her strong natural cough work without interference.`,
                  ar: `تبقى بجانب ${layanAr} وتراقبها عن قرب، تاركاً سعالها القوي يعمل دون تدخل ضار.`,
                },
                spO2: 97,
                heartRate: 126,
              },
              {
                id: 'i3-o2',
                stageLabel: { en: '2. Strong Cough Clears Bit', ar: '٢. السعال القوي يطرد اللقمة' },
                mediaKey: 'i3_o2_strong_cough_clears',
                caption: {
                  en: `${layanEn} gives a strong cough that clears the food bit while you stay ready.`,
                  ar: `تسعل ${layanAr} بقوة فتطرد بقايا اللقمة بينما تظل يدك مستعدة.`,
                },
                spO2: 98,
                heartRate: 122,
              },
              {
                id: 'i3-o3',
                stageLabel: { en: '3. Calm Breathing Restored', ar: '٣. هدوء نيللي وعودة التنفس' },
                mediaKey: 'i3_o3_layan_calms_breathes',
                caption: {
                  en: `${layanEn} calms down and breathes quietly with healthy pink cheeks!`,
                  ar: `تهدأ ${layanAr} وتتنفس براحة تامة ولونها طبيعي!`,
                },
                spO2: 99,
                heartRate: 118,
              },
            ],
            title: {
              en: 'Sound Judgment — Her Strong Cough Cleared It!',
              ar: 'تصرف سليم — سعالها القوي طرد اللقمة بأمان!',
            },
            narrative: {
              en: `Because ${layanEn} was coughing audibly and crying loudly, observing her closely while staying ready allowed her effective cough to clear the airway naturally.`,
              ar: `لأن ${layanAr} كانت تسعل بصوت مسموع وتبكي بقوة، فإن مراقبتها عن قرب والاستعداد للتدخل سمحا لسعالها الفعّال بتنظيف مجرى الهواء طبيعياً.`,
            },
            clinicalWhy: {
              en: 'Slide 5: An audible cough and strong cry indicate mild obstruction where air is still passing. Monitor closely and intervene only if the cough becomes ineffective.',
              ar: 'شريحة ٥: السعال المسموع والبكاء القوي يدلان على انسداد خفيف يمر فيه الهواء. راقب عن قرب وتدخّل فقط إذا ضعف السعال أو توقف الصوت.',
            },
            internalEffect: {
              en: 'The infant’s protective cough reflex expels the food bit without external trauma.',
              ar: 'منعكس السعال الطبيعي لدى الرضيعة يطرد اللقمة دون أذى.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'complete',
          },
        },
        {
          id: 'i3-c2',
          label: {
            en: 'Perform abdominal thrusts on the infant',
            ar: 'نفّذ ضغطات بطن للرضيعة',
          },
          subLabel: {
            en: 'Forbidden in infants at all times (Rule R-INFANT)',
            ar: 'ممنوع للرضيع في كل الأحوال (قاعدة R-INFANT)',
          },
          outcome: 'harmful',
          spO2Delta: -14,
          obstructionDelta: 20,
          consequenceBeat: {
            mediaKey: 'i3_o4_err_infant_abdominal_thrusts',
            title: {
              en: 'Critical Safety Violation — Never Perform Abdominal Thrusts on an Infant (R-INFANT)',
              ar: 'خطأ خطير — ممنوع ضغطات البطن للرضيع نهائياً (R-INFANT)',
            },
            narrative: {
              en: `Abdominal thrusts are never used on infants under 1 year old, and here ${layanEn} already had an effective cough.`,
              ar: `ضغطات البطن ممنوعة تماماً للرضّع، فضلاً عن أن ${layanAr} كانت تسعل وتبكي بفعالية.`,
            },
            clinicalWhy: {
              en: 'Rule R-INFANT (Slides 20–21): Never perform abdominal thrusts on an infant due to internal organ injury risk.',
              ar: 'قاعدة R-INFANT (شريحة ٢٠–٢١): يُمنع ضغط بطن الرضيع نهائياً بسبب خطر إصابة الأعضاء الداخلية.',
            },
            internalEffect: {
              en: 'Abdominal compression endangers the infant’s liver and disrupts breathing.',
              ar: 'ضغط البطن يعرّض كبد الرضيعة للإصابة ويربك تنفسها.',
            },
            guidelineBadge: 'RCUK',
            nextAction: 'retry',
          },
        },
        {
          id: 'i3-c3',
          label: {
            en: 'Perform a blind finger sweep in her mouth',
            ar: 'اعمل مسحاً أعمى بالإصبع في فمها',
          },
          subLabel: {
            en: 'Pushes food deeper into the throat (Rule R-SWEEP)',
            ar: 'يدفع اللقمة أعمق في الحلق (قاعدة R-SWEEP)',
          },
          outcome: 'harmful',
          spO2Delta: -12,
          obstructionDelta: 45,
          consequenceBeat: {
            mediaKey: 'i3_o5_err_blind_sweep',
            title: {
              en: 'Dangerous Error — Blind Sweep Turns Mild Choking Into Severe Blockage (R-SWEEP)',
              ar: 'خطأ خطير — المسح الأعمى يحوّل الاختناق الخفيف إلى انسداد شديد (R-SWEEP)',
            },
            narrative: {
              en: `Putting your finger blindly into ${layanEn}'s mouth pushes the food bit down into her narrow windpipe.`,
              ar: `إدخال إصبعك بشكل أعمى في فم ${layanAr} يدفع اللقمة إلى داخل القصبة الهوائية الضيقة.`,
            },
            clinicalWhy: {
              en: 'Rule R-SWEEP (Slide 17 & 25): Never perform a blind finger sweep in an infant’s mouth.',
              ar: 'قاعدة R-SWEEP (شريحة ١٧ و٢٥): لا تقم أبداً بمسح أعمى بالإصبع في فم الرضيع.',
            },
            internalEffect: {
              en: 'The finger pushes a partial obstruction into a complete airway block.',
              ar: 'الإصبع يحوّل الانسداد الجزئي إلى انسداد كامل في مجرى الهواء.',
            },
            guidelineBadge: 'ARC',
            nextAction: 'retry',
          },
        },
      ],
    },
    takeaways: [
      {
        en: 'An infant who is coughing audibly and crying loudly has an effective cough — monitor closely and stay ready (Slide 5).',
        ar: 'الرضيع الذي يسعل بصوت مسموع ويبكي بقوة لديه سعال فعّال — راقبه عن قرب وكن مستعداً (شريحة ٥).',
      },
      {
        en: 'Never perform abdominal thrusts on an infant (R-INFANT) and never perform a blind finger sweep (R-SWEEP).',
        ar: 'لا تنفّذ ضغطات البطن للرضيع أبداً (R-INFANT) ولا تقم بمسح أعمى بالإصبع (R-SWEEP).',
      },
    ],
  },
];
