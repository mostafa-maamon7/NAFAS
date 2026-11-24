import React, { useRef, useState } from 'react';
import {
  Play,
  BookOpen,
  Monitor,
  Users,
  ShieldPlus,
  BrainCircuit,
  Crosshair,
  Hand,
  CheckCircle2,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Volume2,
  VolumeX,
  RotateCcw,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import { useNafas } from '../context/NafasContext';
import { HeroRespiratoryModel3D } from '../components/HeroRespiratoryModel3D';
import { getStoryLevelById } from '../data/storyLevels';
import { imagePreloader } from '../utils/imagePreloader';
import { nafasAudio } from '../utils/nafasAudio';

const DEMO_VIDEO_CAPTIONS: {
  start: number;
  end: number;
  ar: string;
  en: string;
}[] = [
  {
    start: 0,
    end: 6,
    ar: 'محمد في معمل الكمبيوتر يتناول ساندويتش سريعاً أثناء العمل.',
    en: 'Mohamed is in the computer lab taking a quick bite of his sandwich while working.',
  },
  {
    start: 6,
    end: 12,
    ar: 'فجأة يمسك محمد رقبته بكلتا يديه — علامة الاختناق العالمية.',
    en: 'Suddenly Mohamed clutches his throat with both hands — the universal choking sign.',
  },
  {
    start: 12,
    end: 18,
    ar: 'اختناق شديد صامت — لا صوت ولا سعال وشفاهه تميل للزرقة.',
    en: 'Severe silent choking — no sound, no cough, and his lips begin turning blue.',
  },
  {
    start: 18,
    end: 24,
    ar: 'اطلب الإسعاف فوراً، اسند صدر محمد وأمِله للأمام.',
    en: "Call emergency services immediately, support Mohamed's chest, and lean him forward.",
  },
  {
    start: 24,
    end: 30,
    ar: 'بدّل بين حتى ٥ ضربات ظهر بين الكتفين وحتى ٥ ضغطات بطن للداخل وللأعلى.',
    en: 'Alternate up to 5 firm back blows between the shoulder blades with up to 5 abdominal thrusts.',
  },
  {
    start: 30,
    end: 40,
    ar: 'خرج الجسم الغريب وعاد التنفس الطبيعي — طمئن المصاب وتابع التقييم الطبي.',
    en: 'The blockage is expelled and normal breathing returns — reassure him and seek medical follow-up.',
  },
];

export const HomeView: React.FC = () => {
  const {
    language,
    isRtl,
    navigateTo,
    startLevel,
    openSmartLearningComingSoon,
  } = useNafas();

  const isAr = language === 'ar';

  // Self-hosted A2 Demo Video Player State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  const activeDemoCaption =
    DEMO_VIDEO_CAPTIONS.find(
      (c) => videoCurrentTime >= c.start && videoCurrentTime < c.end
    ) || DEMO_VIDEO_CAPTIONS[0];

  const handleStartSimulation = () => {
    startLevel('C1');
  };

  const handlePlayDemoVideo = () => {
    const vid = videoRef.current;
    if (!vid) return;
    setVideoError(false);
    setHasStartedOnce(true);
    vid
      .play()
      .then(() => {
        setIsVideoPlaying(true);
      })
      .catch(() => {
        setVideoError(true);
      });
  };

  const handleToggleVideoMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    const nextMuted = !vid.muted;
    vid.muted = nextMuted;
    setIsVideoMuted(nextMuted);
  };

  const handleRetryDemoVideo = () => {
    setVideoError(false);
    const vid = videoRef.current;
    if (vid) {
      vid.load();
      vid
        .play()
        .then(() => {
          setHasStartedOnce(true);
          setIsVideoPlaying(true);
        })
        .catch(() => {
          setVideoError(true);
        });
    }
  };

  const featureCards = [
    {
      id: 'interactive-sim',
      title: { ar: 'محاكاة تفاعلية', en: 'Interactive Simulation' },
      subtitle: {
        ar: 'مع سيناريوهات واقعية',
        en: 'With realistic scenarios',
      },
      icon: Monitor,
      onClick: () => navigateTo('simulation'),
      badge: null,
    },
    {
      id: 'age-tracks',
      title: { ar: 'مسارات حسب العمر', en: 'Age-Specific Paths' },
      subtitle: { ar: 'بالغ • طفل • رضيع', en: 'Adult • Child • Infant' },
      icon: Users,
      onClick: () => navigateTo('simulation'),
      badge: null,
    },
    {
      id: 'trusted-medical',
      title: { ar: 'محتوى طبي موثوق', en: 'Trusted Medical Content' },
      subtitle: {
        ar: 'مبني على إرشادات طبية معتمدة',
        en: 'Based on certified medical guidelines',
      },
      icon: ShieldPlus,
      onClick: () => navigateTo('learning'),
      badge: null,
    },
    {
      id: 'smart-learning',
      title: { ar: 'التعلم الذكي', en: 'Smart Learning' },
      subtitle: {
        ar: 'محتوى مخصص لاحتياجاتك التعليمية',
        en: 'Content tailored to your educational needs',
      },
      icon: BrainCircuit,
      onClick: () => openSmartLearningComingSoon(),
      badge: { ar: 'قريبًا', en: 'Coming soon' },
    },
  ];

  const howItWorksSteps = [
    {
      num: '01',
      title: { ar: 'تعلّم', en: 'Learn' },
      desc: {
        ar: 'افهم حالات الاختناق من محتوى تعليمي موثوق',
        en: 'Understand choking cases from trusted educational content',
      },
      icon: BookOpen,
      onClick: () => navigateTo('learning'),
    },
    {
      num: '02',
      title: { ar: 'قيّم', en: 'Assess' },
      desc: {
        ar: 'اكتشف الحالة وحدد درجة الخطورة',
        en: 'Explore the case and determine the severity level',
      },
      icon: Crosshair,
      onClick: () => navigateTo('simulation'),
    },
    {
      num: '03',
      title: { ar: 'تصرّف', en: 'Act' },
      desc: {
        ar: 'اختر الاستجابة المناسبة',
        en: 'Choose the appropriate first-aid response',
      },
      icon: Hand,
      onClick: () => handleStartSimulation(),
    },
    {
      num: '04',
      title: { ar: 'راجع', en: 'Review' },
      desc: {
        ar: 'احصل على تقييم وتعلّم من الخطأ',
        en: 'Receive feedback and learn from mistakes',
      },
      icon: CheckCircle2,
      onClick: () => navigateTo('simulation'),
    },
  ];

  const StepArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="relative min-h-[calc(100vh-70px)] bg-[#071F2E] text-[#F3F7F8] flex flex-col justify-between overflow-hidden select-none">
      {/* Subtle Ambient Radial Glow Background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 32% 30%, rgba(19, 184, 176, 0.16) 0%, rgba(11, 45, 64, 0.55) 40%, rgba(7, 31, 46, 0.98) 78%)',
        }}
      />

      {/* Main Dashboard Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 pb-6 space-y-6">
        {/* ================================================================= */}
        {/* 1. HERO SECTION: HEADING & CTAs + 3D RESPIRATORY ANATOMICAL MODEL */}
        {/* ================================================================= */}
        <section
          data-testid="homepage-hero-section"
          className="relative min-h-[360px] sm:min-h-[430px] lg:min-h-[470px] grid grid-cols-1 lg:grid-cols-12 items-center gap-4 sm:gap-6"
        >
          {/* Text & CTAs Column (Staggered Entrance) */}
          <div
            data-testid="hero-text-column"
            className="lg:col-span-5 xl:col-span-5 space-y-4 sm:space-y-5 text-start z-20 order-2 lg:order-1 py-2"
          >
            {/* Brand Line: نَفَس - NAFAS */}
            <div
              data-testid="hero-brand-line"
              className="hero-stagger-1 text-[clamp(1.3rem,1.9vw,1.8rem)] font-bold tracking-tight leading-[1.2] flex items-center gap-2.5"
            >
              {isAr ? (
                <>
                  <span className="text-[#13B8B0] drop-shadow-[0_0_14px_rgba(19,184,176,0.28)]">
                    نَفَس
                  </span>
                  <span className="text-[#A9C0CC]/70 font-light" aria-hidden="true">
                    -
                  </span>
                  <span className="text-[#F3F7F8] tracking-wide">NAFAS</span>
                </>
              ) : (
                <>
                  <span className="text-[#F3F7F8] tracking-wide">NAFAS</span>
                  <span className="text-[#A9C0CC]/70 font-light" aria-hidden="true">
                    -
                  </span>
                  <span className="text-[#13B8B0] drop-shadow-[0_0_14px_rgba(19,184,176,0.28)]">
                    نَفَس
                  </span>
                </>
              )}
            </div>

            {/* Main Headline */}
            <h1
              data-testid="hero-main-headline"
              className="hero-stagger-2 text-[clamp(1.5rem,2.35vw,2.3rem)] font-extrabold text-[#F3F7F8] leading-[1.36] max-w-[36ch] text-balance"
            >
              {isAr
                ? 'التوعية بطوارئ الاختناق ومحاكاة الإسعافات الأولية التفاعلية'
                : 'Choking Emergency Awareness & Interactive First Aid Simulation'}
            </h1>

            {/* Tagline: Learn. Act. Save a Life. + Self-Drawing ECG Pulse */}
            <div className="hero-stagger-3 flex items-center gap-3 pt-0.5">
              <div className="hidden sm:flex items-center" aria-hidden="true">
                <div className="w-12 h-[1.5px] bg-gradient-to-r from-transparent to-[#13B8B0]" />
              </div>

              <span
                data-testid="hero-tagline"
                className="text-[clamp(0.95rem,1.2vw,1.125rem)] font-semibold text-[#13B8B0] tracking-wide"
                dir="ltr"
              >
                Learn. Act. Save a Life.
              </span>

              <svg
                viewBox="0 0 110 36"
                className="w-20 sm:w-24 h-7 text-[#13B8B0]/85 shrink-0"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 18H28L34 8L41 30L49 4L56 26L62 15L67 18H108"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="hero-ecg-draw"
                />
              </svg>
            </div>

            {/* Subtitle */}
            <p
              data-testid="hero-subtitle"
              className="hero-stagger-4 text-[clamp(0.95rem,1.15vw,1.0625rem)] text-[#B8CDD7] font-normal leading-[1.7] max-w-[38ch]"
            >
              {isAr
                ? 'تعلم من خلال سيناريوهات واقعية وتجربة تفاعلية آمنة'
                : 'Learn through realistic scenarios and a safe interactive experience'}
            </p>

            {/* Primary & Secondary Action Buttons (Primary gets one soft glow pulse) */}
            <div className="hero-stagger-5 pt-2 flex flex-wrap items-center gap-3.5 sm:gap-4">
              <button
                type="button"
                data-testid="hero-start-simulation-btn"
                onMouseEnter={() => {
                  const c1 = getStoryLevelById('C1');
                  if (c1) imagePreloader.warmLevelOnHover(c1);
                  nafasAudio.prefetchLevelAudio('C1');
                }}
                onPointerDown={() => {
                  const c1 = getStoryLevelById('C1');
                  if (c1) imagePreloader.preloadLevelSequence(c1);
                  nafasAudio.prefetchLevelAudio('C1');
                }}
                onClick={handleStartSimulation}
                className="hero-cta-pulse-once min-h-[48px] px-7 sm:px-8 py-3 rounded-full bg-gradient-to-r from-[#13B8B0] to-[#43C7D1] hover:from-[#18C8C0] hover:to-[#53D5DF] text-[#071F2E] font-bold text-[15px] sm:text-base inline-flex items-center justify-center gap-2.5 shadow-[0_0_24px_rgba(19,184,176,0.38)] transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isAr ? 'ابدأ المحاكاة' : 'Start Simulation'}</span>
              </button>

              <button
                type="button"
                data-testid="hero-explore-learning-btn"
                onClick={() => navigateTo('learning')}
                className="min-h-[48px] px-6 sm:px-7 py-3 rounded-full bg-[#0B2D40]/90 hover:bg-[#123B50] text-[#F3F7F8] border border-[#13B8B0]/65 font-semibold text-[15px] sm:text-base inline-flex items-center justify-center gap-2.5 shadow-[0_0_16px_rgba(19,184,176,0.14)] transition-colors cursor-pointer whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4 text-[#43C7D1]" />
                <span>{isAr ? 'استكشف التعلم' : 'Explore Learning'}</span>
              </button>
            </div>

            {/* Clear, Refined Academic Supervision Attribution */}
            <div className="hero-stagger-5 pt-2">
              <button
                type="button"
                data-testid="hero-supervision-credit"
                onClick={() => navigateTo('about')}
                className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0B2D40]/90 hover:bg-[#10384E] border border-[#13B8B0]/45 hover:border-[#43C7D1]/80 shadow-[0_6px_24px_rgba(7,31,46,0.45)] transition-all cursor-pointer text-start"
              >
                <span className="w-8 h-8 rounded-lg bg-[#13B8B0]/15 border border-[#43C7D1]/35 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4 text-[#43C7D1]" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[11px] font-semibold text-[#9EC4D4]">
                    {isAr ? 'مشروع أكاديمي تحت إشراف' : 'Academic project supervised by'}
                  </span>
                  <span className="text-sm sm:text-[15px] font-extrabold text-[#F3F7F8] group-hover:text-[#43C7D1] transition-colors mt-0.5">
                    {isAr ? 'د. مي مهران' : 'Dr. Mai Mahran'}
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Upgraded Interactive 3D Respiratory Anatomical Model Stage */}
          <div
            data-testid="hero-visual-stage"
            className="lg:col-span-7 xl:col-span-7 relative flex flex-col items-center justify-center order-1 lg:order-2 pt-1 pb-1"
          >
            <div className="relative w-full max-w-[640px] flex items-center justify-center h-[340px] sm:h-[420px] lg:h-[470px]">
              {/* Soft Volumetric Cyan-Cobalt Radial Glow Strictly Behind Model */}
              <div
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[290px] h-[290px] sm:w-[375px] sm:h-[375px] lg:w-[445px] lg:h-[445px] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.18)_0%,rgba(19,184,176,0.09)_46%,transparent_72%)] shadow-[0_0_90px_rgba(14,165,233,0.16)]"
                aria-hidden="true"
              />

              {/* Subtle Holographic Circular Scanning Ring Behind Model */}
              <svg
                viewBox="0 0 460 460"
                className="pointer-events-none hero-orbit-cw absolute top-1/2 left-1/2 w-[295px] h-[295px] sm:w-[380px] sm:h-[380px] lg:w-[450px] lg:h-[450px] text-[#38BDF8]/30"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="230"
                  cy="230"
                  r="214"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="6 9"
                />
                <circle
                  cx="230"
                  cy="230"
                  r="202"
                  stroke="currentColor"
                  strokeOpacity="0.4"
                  strokeWidth="0.85"
                />
                {Array.from({ length: 24 }).map((_, idx) => {
                  const angle = (idx * 15 * Math.PI) / 180;
                  const isMajor = idx % 3 === 0;
                  const r1 = isMajor ? 206 : 210;
                  const r2 = 220;
                  const x1 = 230 + Math.cos(angle) * r1;
                  const y1 = 230 + Math.sin(angle) * r1;
                  const x2 = 230 + Math.cos(angle) * r2;
                  const y2 = 230 + Math.sin(angle) * r2;
                  return (
                    <line
                      key={idx}
                      x1={x1.toFixed(1)}
                      y1={y1.toFixed(1)}
                      x2={x2.toFixed(1)}
                      y2={y2.toFixed(1)}
                      stroke="#38BDF8"
                      strokeWidth={isMajor ? 1.35 : 0.85}
                      strokeOpacity={isMajor ? 0.55 : 0.28}
                    />
                  );
                })}
              </svg>

              {/* Inner Counter-Rotating Technical Orbit Ring */}
              <svg
                viewBox="0 0 380 380"
                className="pointer-events-none hero-orbit-ccw absolute top-1/2 left-1/2 w-[235px] h-[235px] sm:w-[305px] sm:h-[305px] lg:w-[365px] lg:h-[365px] text-[#13B8B0]/28"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="190"
                  cy="190"
                  r="176"
                  stroke="currentColor"
                  strokeWidth="0.95"
                  strokeDasharray="18 12 4 12"
                />
              </svg>

              {/* Interactive Real-3D Anatomical Respiratory Model */}
              <div
                data-testid="hero-3d-body-container"
                className="relative z-10 w-full h-full max-w-[540px] flex items-center justify-center"
              >
                <HeroRespiratoryModel3D language={language} />
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. FOUR HORIZONTAL FEATURE CARDS                                  */}
        {/* ================================================================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {featureCards.map((card) => {
            const IconComp = card.icon;
            return (
              <button
                key={card.id}
                type="button"
                data-testid={`feature-card-${card.id}`}
                onClick={card.onClick}
                className="relative group rounded-2xl bg-gradient-to-b from-[#123B50]/90 to-[#0B2D40]/95 hover:from-[#19465B] hover:to-[#123B50] border border-[#285064] hover:border-[#43C7D1] px-5 py-4 flex items-center justify-between gap-4 text-start shadow-[0_6px_24px_rgba(3,12,20,0.55)] transition-all cursor-pointer"
              >
                {/* Top Badge ("قريبًا / Coming soon") */}
                {card.badge && (
                  <span
                    data-testid={`feature-badge-${card.id}`}
                    className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#E9A23B] text-[#071F2E] text-[11px] font-extrabold shadow-md"
                  >
                    {isAr ? card.badge.ar : card.badge.en}
                  </span>
                )}

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-extrabold text-[#F3F7F8] group-hover:text-[#43C7D1] transition-colors">
                    {isAr ? card.title.ar : card.title.en}
                  </h3>
                  <p className="text-xs text-[#A9C0CC] font-medium">
                    {isAr ? card.subtitle.ar : card.subtitle.en}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#071F2E]/90 border border-[#285064] flex items-center justify-center text-[#13B8B0] shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(19,184,176,0.2)]">
                  <IconComp className="w-6 h-6" />
                </div>
              </button>
            );
          })}
        </section>

        {/* ================================================================= */}
        {/* 3. LOWER SPLIT: "كيف يعمل نظام NAFAS؟" + WORKING DEMO VIDEO PLAYER*/}
        {/* ================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
          {/* Right Column in RTL (7 cols): كيف يعمل نظام NAFAS؟ (4 Circular Connected Steps) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-center gap-4">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#13B8B0]/50 to-[#13B8B0]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#13B8B0]" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#F3F7F8] whitespace-nowrap">
                {isAr ? 'كيف يعمل نظام NAFAS؟' : 'How Does NAFAS Work?'}
              </h2>
              <div className="w-1.5 h-1.5 rounded-full bg-[#13B8B0]" />
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#13B8B0]/50 to-[#13B8B0]" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
              {howItWorksSteps.map((step, index) => {
                const IconComp = step.icon;
                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={step.onClick}
                    className="relative flex flex-col items-center text-center space-y-2.5 group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#43C7D1] rounded-xl p-1"
                  >
                    {index < howItWorksSteps.length - 1 && (
                      <div className="hidden sm:flex absolute top-8 -end-3 z-20 text-[#43C7D1]">
                        <StepArrowIcon className="w-5 h-5" />
                      </div>
                    )}

                    <div className="relative pt-2">
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full bg-[#13B8B0] text-[#071F2E] text-[11px] font-black tabular-nums shadow-[0_0_10px_#13B8B0]">
                        {step.num}
                      </span>
                      <div className="w-16 h-16 rounded-full bg-[#0B2D40] group-hover:bg-[#123B50] border-2 border-[#13B8B0]/70 group-hover:border-[#43C7D1] flex items-center justify-center text-[#43C7D1] shadow-[0_0_20px_rgba(19,184,176,0.2)] transition-colors">
                        <IconComp className="w-7 h-7" />
                      </div>
                    </div>

                    <div className="space-y-1 px-1">
                      <h3 className="text-base font-extrabold text-[#F3F7F8] group-hover:text-[#43C7D1] transition-colors">
                        {isAr ? step.title.ar : step.title.en}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-[#A9C0CC] leading-relaxed">
                        {isAr ? step.desc.ar : step.desc.en}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Left Column in RTL (5 cols): Self-Hosted Native <video> Player ("Watch a quick demo") */}
          <div className="lg:col-span-5">
            <div
              data-testid="homepage-demo-video-card"
              className="relative aspect-[16/9] rounded-2xl overflow-hidden border-2 border-[#13B8B0]/75 hover:border-[#43C7D1] bg-[#0B2D40] shadow-[0_0_28px_rgba(19,184,176,0.28)] group"
            >
              {!videoError ? (
                <>
                  <video
                    ref={videoRef}
                    data-testid="homepage-demo-video"
                    controls
                    playsInline
                    preload="metadata"
                    muted={isVideoMuted}
                    poster="/media/nafas-a2-poster.png"
                    onPlay={() => {
                      setHasStartedOnce(true);
                      setIsVideoPlaying(true);
                    }}
                    onPause={() => setIsVideoPlaying(false)}
                    onEnded={() => setIsVideoPlaying(false)}
                    onTimeUpdate={(e) =>
                      setVideoCurrentTime(e.currentTarget.currentTime)
                    }
                    onVolumeChange={(e) =>
                      setIsVideoMuted(e.currentTarget.muted)
                    }
                    onError={() => setVideoError(true)}
                    className="w-full h-full object-cover bg-[#071F2E]"
                  >
                    <source
                      src="/media/nafas-a2-demo.mp4"
                      type="video/mp4"
                    />
                    <source
                      src="/media/nafas-a2-demo.webm"
                      type="video/webm"
                    />
                    <track
                      kind="captions"
                      src="/media/nafas-a2-demo.ar.vtt?v=2"
                      srcLang="ar"
                      label="العربية"
                      default={isAr}
                    />
                    <track
                      kind="captions"
                      src="/media/nafas-a2-demo.en.vtt?v=2"
                      srcLang="en"
                      label="English"
                      default={!isAr}
                    />
                  </video>

                  {/* Visible Unmute / Mute Button in Top Corner */}
                  <button
                    type="button"
                    data-testid="demo-video-unmute-btn"
                    onClick={handleToggleVideoMute}
                    className="absolute top-2.5 end-2.5 z-20 px-3 py-1.5 rounded-full bg-[#071F2E]/90 hover:bg-[#123B50] border border-[#13B8B0]/60 text-xs font-extrabold text-[#F3F7F8] inline-flex items-center gap-1.5 shadow-lg cursor-pointer transition-colors"
                    aria-label={
                      isVideoMuted
                        ? isAr
                          ? 'تشغيل الصوت'
                          : 'Unmute video'
                        : isAr
                        ? 'كتم الصوت'
                        : 'Mute video'
                    }
                  >
                    {isVideoMuted ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-[#E9A23B]" />
                        <span>{isAr ? 'تشغيل الصوت' : 'Unmute'}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-[#13B8B0]" />
                        <span>{isAr ? 'الصوت مفعّل' : 'Sound On'}</span>
                      </>
                    )}
                  </button>

                  {/* Synchronized Live Caption Pill Following Site Language */}
                  {hasStartedOnce && (
                    <div
                      data-testid="demo-video-live-caption"
                      className="pointer-events-none absolute bottom-11 inset-x-3 z-15 px-3 py-1.5 rounded-xl bg-[#071F2E]/90 border border-[#13B8B0]/50 text-center shadow-lg"
                    >
                      <p className="text-[11px] sm:text-xs font-bold text-[#F3F7F8] leading-snug">
                        {isAr ? activeDemoCaption.ar : activeDemoCaption.en}
                      </p>
                    </div>
                  )}

                  {/* Initial Translucent Play Overlay before First Play */}
                  {!hasStartedOnce && !isVideoPlaying && (
                    <button
                      type="button"
                      data-testid="demo-video-play-overlay"
                      onClick={handlePlayDemoVideo}
                      className="absolute inset-0 z-10 flex flex-col justify-between p-3 bg-gradient-to-t from-[#071F2E]/80 via-[#071F2E]/20 to-transparent cursor-pointer text-start focus-visible:outline-2 focus-visible:outline-[#43C7D1]"
                      aria-label={
                        isAr
                          ? 'شاهد محاكاة توضيحية سريعة'
                          : 'Watch a quick demo'
                      }
                    >
                      <div />
                      <div className="self-center w-14 h-14 rounded-full bg-[#0B2D40]/90 border-2 border-[#43C7D1] text-[#F3F7F8] flex items-center justify-center shadow-[0_0_20px_rgba(19,184,176,0.5)] group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ms-0.5" />
                      </div>
                      <div className="self-start px-3.5 py-1.5 rounded-full bg-[#071F2E]/90 border border-[#13B8B0]/50 text-xs font-extrabold text-[#F3F7F8] inline-flex items-center gap-2">
                        <Play className="w-3.5 h-3.5 text-[#13B8B0] fill-current" />
                        <span>
                          {isAr
                            ? 'شاهد محاكاة توضيحية سريعة'
                            : 'Watch a quick demo'}
                        </span>
                      </div>
                    </button>
                  )}
                </>
              ) : (
                /* Error Fallback with "Try again" & Link to Start Simulation */
                <div
                  data-testid="demo-video-error-fallback"
                  className="w-full h-full bg-[#0B2D40] p-4 flex flex-col items-center justify-center text-center space-y-3"
                >
                  <AlertCircle className="w-8 h-8 text-[#E9A23B]" />
                  <p className="text-xs sm:text-sm font-bold text-[#F3F7F8]">
                    {isAr
                      ? 'تعذّر تحميل الفيديو التوضيحي حالياً.'
                      : 'Unable to load the demo video right now.'}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={handleRetryDemoVideo}
                      className="px-4 py-2 rounded-xl bg-[#123B50] hover:bg-[#19465B] border border-[#285064] text-xs font-extrabold text-[#F3F7F8] inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isAr ? 'أعد المحاولة' : 'Try again'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleStartSimulation}
                      className="px-4 py-2 rounded-xl bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>
                        {isAr ? 'ابدأ المحاكاة' : 'Start simulation'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* =================================================================== */}
      {/* 4. BOTTOM STRIP: QUICK TIPS (نصائح سريعة) + LEARN MORE (اعرف المزيد)*/}
      {/* =================================================================== */}
      <div className="relative z-10 bg-[#051622]/95 border-t border-[#285064] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-start">
            <div className="w-10 h-10 rounded-full bg-[#0B2D40] border border-[#13B8B0]/50 flex items-center justify-center text-[#13B8B0] shrink-0 shadow-[0_0_12px_rgba(19,184,176,0.25)]">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-[#13B8B0]">
                {isAr ? 'نصائح سريعة' : 'Quick Tips'}
              </div>
              <p className="text-xs sm:text-sm text-[#A9C0CC] font-medium">
                {isAr
                  ? 'في حالات الاختناق، حاول تشجيع المصاب على السعال أولاً إن كان واعياً وقادراً على السعال الفعّال.'
                  : 'In choking emergencies, encourage the person to cough first if they are conscious and coughing effectively.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('about')}
            className="min-h-[40px] px-6 py-2 rounded-full bg-[#0B2D40] hover:bg-[#123B50] border border-[#13B8B0]/65 text-xs sm:text-sm font-extrabold text-[#F3F7F8] inline-flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <span>{isAr ? 'اعرف المزيد' : 'Learn More'}</span>
            <StepArrowIcon className="w-4 h-4 text-[#43C7D1]" />
          </button>
        </div>
      </div>
    </div>
  );
};
