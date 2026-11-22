import React, { useMemo, useState } from 'react';
import {
  Play,
  CheckCircle2,
  Star,
  Sparkles,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useNafas } from '../context/NafasContext';
import {
  CORE_STORY_LEVELS,
  SPECIAL_LEARN_CARDS,
  STORY_LEVELS,
  getStoryLevelById,
  validateStoryLevels,
} from '../data/storyLevels';
import { AgeCategory, StoryLevel } from '../types/nafas';
import { CinematicStoryPlayer } from '../components/CinematicStoryPlayer';
import { STORY_MEDIA } from '../data/storyMedia';
import { InteractiveLearnCard } from '../components/InteractiveLearnCard';

// 3 Final Quick Self-Check Quiz Questions (Warm, plain-language explanations, zero slide numbers in UI)
const LECTURE_MINI_QUIZ = [
  {
    id: 'q1-slide26',
    slideRef: 'Slides 26–27',
    question: {
      en: '1. What is the single most important sign that tells you choking is MILD rather than SEVERE?',
      ar: '١. ما هي العلامة الأهم التي تميّز الاختناق الخفيف عن الاختناق الشديد؟',
    },
    options: [
      {
        id: 'a',
        text: {
          en: 'Whether the person has a loud, effective cough and can speak or breathe between coughs',
          ar: 'ما إذا كان المصاب يكح بصوت مسموع وفعّال ويقدر يتكلم أو ياخد نفس بين الكحة',
        },
        correct: true,
      },
      {
        id: 'b',
        text: {
          en: 'What type of food the person was eating',
          ar: 'نوع الأكل اللي كان المصاب بياكله',
        },
        correct: false,
      },
      {
        id: 'c',
        text: {
          en: 'Whether the person is sitting or standing',
          ar: 'ما إذا كان المصاب قاعد ولا واقف',
        },
        correct: false,
      },
    ],
    explanation: {
      en: 'A loud cough with the ability to talk or cry means air is still passing (mild choking — encourage coughing and stay close). A silent throat with no sound or cough means severe choking that needs immediate rescue.',
      ar: 'الكحة القوية المسموعة مع القدرة على الكلام أو البكاء معناها إن الهوا لسه بيمر (اختناق خفيف — شجّعه يكح وخليك جنبه). أما الصمت وعدم خروج صوت أو كحة فمعناه اختناق شديد محتاج تدخل فوري.',
    },
  },
  {
    id: 'q2-slide28',
    slideRef: 'Slides 28–29',
    question: {
      en: '2. For a conscious adult or child over 1 year with SEVERE choking, what is the right rescue sequence?',
      ar: '٢. للبالغ أو الطفل فوق عمر سنة الواعي والمصاب باختناق شديد، ما هو الترتيب الصحيح للإنقاذ؟',
    },
    options: [
      {
        id: 'a',
        text: {
          en: 'Lean forward for up to 5 back blows between the shoulder blades, reassess, then up to 5 inward-and-upward belly thrusts',
          ar: 'إمالة للأمام مع حتى ٥ ضربات ضهر بين لوحي الكتف، الفحص، ثم حتى ٥ ضغطات بطن للداخل وللأعلى',
        },
        correct: true,
      },
      {
        id: 'b',
        text: {
          en: 'Give a glass of water first, then reach fingers blindly into the mouth',
          ar: 'تقديم كوباية مية الأول وبعدين إدخال الصوابع في الفم بدون رؤية',
        },
        correct: false,
      },
      {
        id: 'c',
        text: {
          en: 'Hit the back of the neck while they stand straight up',
          ar: 'الضرب العشوائي على الرقبة والمصاب واقف مفرود',
        },
        correct: false,
      },
    ],
    explanation: {
      en: 'Call for emergency help, support the chest and lean forward for up to 5 back blows, check if it cleared, and alternate with up to 5 inward-and-upward belly thrusts above the navel until the airway opens.',
      ar: 'اطلب الإسعاف، اسند الصدر وميّل المصاب لقدام لعمل حتى ٥ ضربات ضهر بين الكتفين، افحص، وبدّل مع حتى ٥ ضغطات بطن للداخل وللأعلى فوق السرة لحد ما مجرى النفس يتفتح.',
    },
  },
  {
    id: 'q3-slide30',
    slideRef: 'Slides 30–31',
    question: {
      en: '3. In which of these situations must you NEVER press the belly (and use chest thrusts instead)?',
      ar: '٣. في أي من الحالات التالية يُمنع الضغط على البطن تماماً ونستخدم ضغطات الصدر بدلاً منها؟',
    },
    options: [
      {
        id: 'a',
        text: {
          en: 'Infants under 1 year old, women in late pregnancy, and very large individuals whose belly you cannot wrap your arms around',
          ar: 'الرضّع أقل من سنة، الحوامل في الشهور الأخيرة، والأشخاص ذوو البطن الكبير الذي يتعذر إحاطته بالذراعين',
        },
        correct: true,
      },
      {
        id: 'b',
        text: {
          en: 'Children aged 6 years in a school cafeteria',
          ar: 'الأطفال بعمر ٦ سنوات في كافيتريا المدرسة',
        },
        correct: false,
      },
      {
        id: 'c',
        text: {
          en: 'Adults choking in a computer lab',
          ar: 'البالغون المختنقون في معمل الكمبيوتر',
        },
        correct: false,
      },
    ],
    explanation: {
      en: 'Infants under 1 year receive up to 5 forearm back blows and up to 5 two-finger chest thrusts to protect their delicate liver. Women in late pregnancy and very large patients also receive chest thrusts instead of belly thrusts.',
      ar: 'الرضّع أقل من سنة بنعملهم حتى ٥ ضربات ضهر على الساعد وحتى ٥ ضغطات صدر بإصبعين لحماية أعضائهم الداخلية؛ وكذلك الحوامل في آخر الحمل أو أصحاب البطن الكبير بنعملهم ضغطات على الصدر بدل البطن.',
    },
  },
];

// Take-Home Messages (Warm, plain-language summary without slide/rule numbers)
const SLIDE_32_TAKE_HOME_MESSAGES = [
  {
    en: 'Ask "Are you choking?" right away — a loud effective cough needs calm encouragement and close watching, while a silent cough needs immediate action.',
    ar: 'اسأل «هل أنت بتشرق؟» فوراً — الكحة القوية المسموعة محتاجة تشجيع ومراقبة هادية، أما الاختناق الصامت فمحتاج تدخل فوري.',
  },
  {
    en: 'For adults and children over 1 year with severe choking: lean forward and alternate up to 5 back blows with up to 5 inward-and-upward belly thrusts.',
    ar: 'للبالغين والأطفال فوق سنة في الاختناق الشديد: ميّل لقدام وبدّل بين حتى ٥ ضربات ضهر وحتى ٥ ضغطات بطن للداخل وللأعلى.',
  },
  {
    en: 'Never give water to a choking person, and never sweep the mouth blindly with your fingers.',
    ar: 'ممنوع تقديم المية لمصاب بيشرق، وممنوع إدخال الصوابع بشكل أعمى في الفم.',
  },
  {
    en: 'For infants under 1 year, late pregnancy, or a very large belly: never press the abdomen — use chest thrusts instead.',
    ar: 'للرضّع أقل من سنة، أو أواخر الحمل، أو البطن الكبير: ممنوع الضغط على البطن — استخدم ضغطات الصدر بدلاً منها.',
  },
  {
    en: 'If a choking person goes limp and unresponsive, lower them to a firm flat floor, make sure the ambulance is called, and start CPR according to your training.',
    ar: 'لو المصاب فقد الوعي وارتخى، نزّله بأمان على أرض صلبة ومستوية، تأكد من طلب الإسعاف، وابدأ الإنعاش حسب تدريبك.',
  },
];

export const SimulationCenterView: React.FC = () => {
  const {
    language,
    activeLevelId,
    simulationCampaignFilter,
    setSimulationCampaignFilter,
    startLevel,
    navigateTo,
  } = useNafas();

  const isAr = language === 'ar';

  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

  const activeLevel = useMemo(
    () => (activeLevelId ? getStoryLevelById(activeLevelId) : undefined),
    [activeLevelId]
  );

  // Reference Level A2 ("Silence in the Lab" — Tariq, 34 yrs) per NAFAS-Levels-Restructure.md
  const referenceLevelA2 = useMemo(
    () => STORY_LEVELS.find((l) => l.id === 'A2') || STORY_LEVELS[1],
    []
  );

  const validationReport = useMemo(() => validateStoryLevels(STORY_LEVELS), []);

  const filteredCoreLevels = useMemo(() => {
    if (simulationCampaignFilter === 'all') return CORE_STORY_LEVELS;
    return CORE_STORY_LEVELS.filter(
      (lvl) => lvl.ageGroup === simulationCampaignFilter
    );
  }, [simulationCampaignFilter]);

  if (activeLevel) {
    return <CinematicStoryPlayer level={activeLevel} />;
  }

  const filterTabs: {
    id: AgeCategory | 'all';
    label: string;
    count: number;
  }[] = [
    {
      id: 'all',
      label: isAr ? 'كل المستويات (١٠)' : 'All Story Levels (10)',
      count: CORE_STORY_LEVELS.length,
    },
    {
      id: 'adult',
      label: isAr ? 'البالغ — A1–A4 (٤)' : 'Adult — A1–A4 (4)',
      count: CORE_STORY_LEVELS.filter((l) => l.ageGroup === 'adult').length,
    },
    {
      id: 'child',
      label: isAr ? 'الطفل — C1–C3 (٣)' : 'Child — C1–C3 (3)',
      count: CORE_STORY_LEVELS.filter((l) => l.ageGroup === 'child').length,
    },
    {
      id: 'infant',
      label: isAr ? 'الرضيعة — I1–I3 (٣)' : 'Infant — I1–I3 (3)',
      count: CORE_STORY_LEVELS.filter((l) => l.ageGroup === 'infant').length,
    },
  ];

  const renderLevelCard = (lvl: StoryLevel) => {
    const coverKey = lvl.storyBeats[0]?.mediaKey || 'hero_nafas_awareness';
    const coverAsset = STORY_MEDIA[coverKey] || STORY_MEDIA.hero_nafas_awareness;

    const severityBadge =
      lvl.severity === 'mild'
        ? {
            ar: 'خفيف',
            en: 'Mild',
            cls: 'bg-[#16A36A]/20 text-[#16A36A] border-[#16A36A]/50',
          }
        : lvl.severity === 'unresponsive'
        ? {
            ar: 'فاقد الوعي',
            en: 'Unresponsive',
            cls: 'bg-[#DC5252]/20 text-[#DC5252] border-[#DC5252]/50',
          }
        : {
            ar: 'شديد',
            en: 'Severe',
            cls: 'bg-[#E9A23B]/20 text-[#E9A23B] border-[#E9A23B]/50',
          };

    return (
      <div
        key={lvl.id}
        className="bg-[#0B2D40] border border-[#285064] hover:border-[#43C7D1] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all"
      >
        <div>
          {/* Scene Preview */}
          <div className="relative aspect-video w-full bg-[#071F2E] overflow-hidden">
            <img
              src={coverAsset.src}
              alt={coverAsset.alt[language]}
              className={`w-full h-full object-cover ${
                coverAsset.cameraCrop || ''
              }`}
            />
            <div className="absolute top-3 start-3 flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-lg bg-[#071F2E]/90 border border-[#285064] text-xs font-extrabold text-[#43C7D1]">
                {lvl.id}
              </span>
              <span
                className={`px-2 py-0.5 rounded-lg border text-[11px] font-extrabold backdrop-blur-sm ${severityBadge.cls}`}
              >
                {isAr ? severityBadge.ar : severityBadge.en}
              </span>
              {lvl.id === 'A2' && (
                <span className="px-2.5 py-1 rounded-lg bg-[#13B8B0] text-[#071F2E] text-[11px] font-extrabold">
                  {isAr ? 'المستوى المرجعي ★' : 'Reference Level ★'}
                </span>
              )}
            </div>

            {/* 3 Stars Display (Always fresh 0/3 because scores are not saved) */}
            <div className="absolute top-3 end-3 px-2.5 py-1 rounded-lg bg-[#071F2E]/90 border border-[#285064] flex items-center gap-1">
              {[1, 2, 3].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 text-[#285064]" />
              ))}
            </div>
          </div>

          <div className="p-5 space-y-2.5">
            <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#43C7D1]">
              <span>
                {lvl.character.name[language]} • {lvl.character.age[language]}
              </span>
              <span>{lvl.setting[language]}</span>
            </div>

            <h3 className="text-lg font-extrabold text-[#F3F7F8]">
              {lvl.id} · {lvl.title[language]}
            </h3>

            <p className="text-xs sm:text-sm text-[#A9C0CC] line-clamp-2 leading-relaxed">
              {lvl.hook[language]}
            </p>
          </div>
        </div>

        <div className="p-5 pt-0">
          <button
            type="button"
            onClick={() => startLevel(lvl.id)}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] font-extrabold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              {isAr
                ? `العب المستوى ${lvl.id} (قابل للتكرار)`
                : `Play Level ${lvl.id} (Unlimited Replay)`}
            </span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* =================================================================== */}
      {/* FEATURED REFERENCE LEVEL BANNER: LEVEL A2 ("SILENCE IN THE LAB")    */}
      {/* =================================================================== */}
      <section className="bg-[#0B2D40] text-[#F3F7F8] rounded-2xl p-5 sm:p-7 border-2 border-[#13B8B0] shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#13B8B0] text-[#071F2E] text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isAr
                    ? 'المستوى المرجعي الأساسي · A2'
                    : 'PRIMARY REFERENCE LEVEL · A2'}
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#123B50] border border-[#285064] text-xs font-bold text-[#43C7D1]">
                <RotateCcw className="w-3.5 h-3.5 text-[#13B8B0]" />
                <span>
                  {isAr
                    ? '١٠ مستويات (٠/٣٠★) • بدون حفظ السكور للتكرار الحر'
                    : '10 Levels (0/30★) • Scores Not Saved for Free Replay'}
                </span>
              </span>

              {validationReport.valid && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#16A36A]/15 border border-[#16A36A]/40 text-[11px] font-bold text-[#16A36A]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {isAr
                      ? '١٠٠ لقطة فريدة (٥ قصة + ٥ نتيجة لكل مستوى)'
                      : '100 Unique Frames Verified (5 Story + 5 Outcome per level)'}
                  </span>
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F7F8]">
                A2 · {referenceLevelA2.title[language]} —{' '}
                {referenceLevelA2.character.name[language]} (
                {referenceLevelA2.character.age[language]})
              </h1>
              <p className="text-sm sm:text-base text-[#A9C0CC] leading-relaxed">
                {referenceLevelA2.hook[language]}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => startLevel('A2')}
                className="min-h-[50px] px-6 py-3 rounded-xl bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] font-extrabold text-sm sm:text-base inline-flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {isAr
                    ? 'ابدأ المستوى المرجعي A2 (طارق — المعمل)'
                    : 'Start Reference Level A2 (Tariq — Lab)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => startLevel('C1')}
                className="min-h-[50px] px-5 py-3 rounded-xl bg-[#123B50] hover:bg-[#19465B] border border-[#43C7D1]/50 text-[#F3F7F8] font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-[#43C7D1]" />
                <span>
                  {isAr
                    ? 'جرّب المستوى C1 (يوسف — كافيتريا المدرسة)'
                    : 'Play Level C1 (Youssef — School Cafeteria)'}
                </span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div
              onClick={() => startLevel('A2')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  startLevel('A2');
                }
              }}
              className="relative aspect-video rounded-xl overflow-hidden border border-[#43C7D1]/50 bg-[#071F2E] cursor-pointer"
            >
              <img
                src={STORY_MEDIA.a2_s3_clutch_throat_silent.src}
                alt={STORY_MEDIA.a2_s3_clutch_throat_silent.alt[language]}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 10 RESTRUCTURED STORY LEVELS (A1–A4, C1–C3, I1–I3)                  */}
      {/* =================================================================== */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#F3F7F8]">
              {isAr
                ? 'خريطة المستويات القصصية العشرة (A1–A4 · C1–C3 · I1–I3)'
                : 'The 10 Story Simulation Levels (A1–A4 · C1–C3 · I1–I3)'}
            </h2>
            <p className="text-xs sm:text-sm text-[#A9C0CC]">
              {isAr
                ? '٤ مستويات للبالغ + ٣ للطفل + ٣ للرضيع • ١٠ لقطات فريدة لكل مستوى • يمكنك تكرار أي مستوى بلا حدود دون حفظ السكور'
                : '4 Adult + 3 Child + 3 Infant levels • 10 unique frames per level • Replay any level unlimited times without saving scores'}
            </p>
          </div>

          {/* Age Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => {
              const active = simulationCampaignFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSimulationCampaignFilter(tab.id)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#13B8B0] text-[#071F2E]'
                      : 'bg-[#0B2D40] hover:bg-[#123B50] text-[#A9C0CC] border border-[#285064]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoreLevels.map(renderLevelCard)}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2 SPECIAL CASE LEARN CARDS (WHEELCHAIR & CHOKING ALONE)             */}
      {/* =================================================================== */}
      <section className="space-y-5 pt-4 border-t border-[#285064]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#43C7D1] mb-1">
              <ShieldCheck className="w-4 h-4 text-[#13B8B0]" />
              <span>
                {isAr
                  ? 'بطاقتا تعلّم وتدريب تفاعلي (٤ خطوات — بدون نجوم)'
                  : 'Interactive Special-Situation Learn Cards (4 Steps — No Stars)'}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#F3F7F8]">
              {isAr
                ? 'حالتان خاصتان: الكرسي المتحرك والاختناق وأنت لوحدك'
                : '2 Special Situations: Wheelchair & Choking When Alone'}
            </h2>
            <p className="text-xs sm:text-sm text-[#A9C0CC]">
              {isAr
                ? 'اقرأ الخطوات الأربع المصوّرة أو اضغط «جرّبها» لتطبيق كل خطوة بنفسك.'
                : 'Read the 4 illustrated steps or tap "Try it" to step through each action yourself.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('learning')}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#123B50] hover:bg-[#19465B] border border-[#43C7D1]/50 text-xs font-extrabold text-[#43C7D1] inline-flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>
              {isAr ? 'افتح مركز التعلّم' : 'Open in Learning Hub'}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SPECIAL_LEARN_CARDS.map((card) => (
            <InteractiveLearnCard
              key={card.id}
              card={card}
              language={language}
            />
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* KEY TAKE-HOME MESSAGES CARD                                         */}
      {/* =================================================================== */}
      <section className="bg-[#0B2D40] border border-[#285064] rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-[#43C7D1]">
          <BookOpen className="w-5 h-5 text-[#13B8B0]" />
          <h2 className="text-xl font-extrabold text-[#F3F7F8]">
            {isAr
              ? 'الخلاصة الذهبية لإسعاف الاختناق'
              : 'Key Take-Home Messages'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SLIDE_32_TAKE_HOME_MESSAGES.map((msg, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#071F2E] border border-[#285064] flex items-start gap-3 text-xs sm:text-sm text-[#F3F7F8]"
            >
              <CheckCircle2 className="w-4 h-4 text-[#13B8B0] shrink-0 mt-0.5" />
              <span className="leading-relaxed">{msg[language]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* FINAL QUICK SELF-CHECK QUIZ (3 MCQs)                                */}
      {/* =================================================================== */}
      <section
        data-testid="final-self-check-quiz"
        className="bg-[#0B2D40] border border-[#285064] rounded-2xl p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-[#13B8B0]" />
            <h2 className="text-xl font-extrabold text-[#F3F7F8]">
              {isAr
                ? 'الاختبار الختامي السريع'
                : 'Final Quick Self-Check Quiz'}
            </h2>
          </div>
          <span className="text-xs font-bold text-[#43C7D1]">
            {isAr
              ? '٣ أسئلة لمراجعة أهم قواعد الإنقاذ'
              : '3 Questions to Check Your Core Rescue Decisions'}
          </span>
        </div>

        <div className="space-y-5">
          {LECTURE_MINI_QUIZ.map((q) => {
            const selectedOptId = quizAnswers[q.id];
            const selectedOpt = q.options.find((o) => o.id === selectedOptId);

            return (
              <div
                key={q.id}
                className="p-5 rounded-xl bg-[#071F2E] border border-[#285064] space-y-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm sm:text-base font-extrabold text-[#F3F7F8]">
                    {q.question[language]}
                  </h3>
                </div>

                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isPicked = selectedOptId === opt.id;
                    let btnClass =
                      'bg-[#0B2D40] hover:bg-[#123B50] border-[#285064] text-[#F3F7F8]';
                    if (isPicked) {
                      btnClass = opt.correct
                        ? 'bg-[#16A36A]/20 border-[#16A36A] text-[#F3F7F8]'
                        : 'bg-[#DC5252]/20 border-[#DC5252] text-[#F3F7F8]';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setQuizAnswers((prev) => ({
                            ...prev,
                            [q.id]: opt.id,
                          }))
                        }
                        className={`w-full min-h-[48px] p-3 rounded-xl border text-start text-xs sm:text-sm font-bold transition-colors cursor-pointer ${btnClass}`}
                      >
                        {opt.text[language]}
                      </button>
                    );
                  })}
                </div>

                {selectedOpt && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold ${
                      selectedOpt.correct
                        ? 'bg-[#16A36A]/15 text-[#16A36A]'
                        : 'bg-[#E9A23B]/15 text-[#E9A23B]'
                    }`}
                  >
                    {q.explanation[language]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
