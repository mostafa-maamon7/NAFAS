import React, { useMemo, useState } from 'react';
import {
  Search,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Play,
  BookmarkCheck,
  XCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useNafas } from '../context/NafasContext';
import {
  LEARNING_GUIDES,
  LearningGuide,
  getLearningGuideById,
} from '../data/learningGuides';
import { SPECIAL_LEARN_CARDS } from '../data/storyLevels';
import { AgeCategory } from '../types/nafas';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';
import { InteractiveLearnCard } from '../components/InteractiveLearnCard';

const SOURCES_LINE = {
  en: 'Based on Resuscitation Council UK (2025) and American Red Cross guidance.',
  ar: 'مبني على إرشادات مجلس الإنعاش البريطاني (2025) والصليب الأحمر الأمريكي.',
};

const GuideCardVisual: React.FC<{
  guide: LearningGuide;
  language: 'ar' | 'en';
}> = ({ guide, language }) => {
  const isAr = language === 'ar';

  if (guide.comparisonPair) {
    const { left, right } = guide.comparisonPair;
    return (
      <div className="relative aspect-[16/9] w-full bg-[#071F2E] overflow-hidden grid grid-cols-2 gap-0.5 border-b border-[#285064]">
        <div className="relative h-full w-full overflow-hidden">
          <img
            src={left.imageSrc}
            alt={left.imageAlt[language]}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071F2E]/95 via-[#071F2E]/70 to-transparent px-2.5 pt-5 pb-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6CE2B3] leading-snug">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{left.label[language]}</span>
            </span>
          </div>
        </div>

        <div className="relative h-full w-full overflow-hidden">
          <img
            src={right.imageSrc}
            alt={right.imageAlt[language]}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071F2E]/95 via-[#071F2E]/70 to-transparent px-2.5 pt-5 pb-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#F58A8A] leading-snug">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>{right.label[language]}</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] w-full bg-[#071F2E] overflow-hidden border-b border-[#285064]">
      <img
        src={guide.heroImageSrc}
        alt={guide.heroImageAlt[language]}
        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02] ${
          guide.isDontGuide ? 'brightness-90' : ''
        }`}
        loading="lazy"
      />
      {guide.isDontGuide && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#DC5252]/10 ring-2 ring-inset ring-[#DC5252]/55 pointer-events-none"
          />
          <div className="absolute top-3 start-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#071F2E]/92 border border-[#DC5252]/75 text-sm font-extrabold text-[#F58A8A]">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'تجنّب هذا' : 'Avoid this'}</span>
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export const LearningHubView: React.FC = () => {
  const {
    language,
    selectedArticleId,
    openArticle,
    closeArticle,
    learningAgeFilter,
    setLearningAgeFilter,
    startLevel,
  } = useNafas();

  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');

  const selectedGuide = useMemo(
    () => getLearningGuideById(selectedArticleId),
    [selectedArticleId]
  );

  const filteredGuides = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return LEARNING_GUIDES.filter((guide) => {
      const matchesAge =
        learningAgeFilter === 'all' ||
        guide.ageGroups.includes(learningAgeFilter);
      if (!matchesAge) return false;
      if (!q) return true;

      const titleMatch = guide.title[language].toLowerCase().includes(q);
      const summaryMatch = guide.summary[language].toLowerCase().includes(q);
      const stepMatch = guide.steps.some(
        (s) =>
          s.title[language].toLowerCase().includes(q) ||
          s.body[language].toLowerCase().includes(q)
      );
      return titleMatch || summaryMatch || stepMatch;
    });
  }, [searchQuery, learningAgeFilter, language]);

  // =========================================================================
  // GUIDE DETAIL PAGE
  // =========================================================================
  if (selectedGuide) {
    const currentIndex = LEARNING_GUIDES.findIndex(
      (g) => g.id === selectedGuide.id
    );
    const nextGuide =
      LEARNING_GUIDES[(currentIndex + 1) % LEARNING_GUIDES.length];

    return (
      <div
        data-testid={`guide-detail-${selectedGuide.id}`}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8"
      >
        <button
          type="button"
          onClick={closeArticle}
          data-testid="guide-back-btn"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#43C7D1] hover:text-[#13B8B0] transition-colors cursor-pointer min-h-[40px]"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{isAr ? 'العودة إلى مركز التعلّم' : 'Back to Learning Hub'}</span>
        </button>

        <article className="bg-[#123B50] border border-[#285064] rounded-2xl overflow-hidden shadow-xl">
          {/* Hero Visual */}
          {selectedGuide.comparisonPair ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 bg-[#071F2E] border-b border-[#285064]">
              {[selectedGuide.comparisonPair.left, selectedGuide.comparisonPair.right].map(
                (side) => (
                  <div
                    key={side.imageId}
                    className="relative aspect-[16/9] w-full overflow-hidden bg-[#071F2E]"
                  >
                    <img
                      src={side.imageSrc}
                      alt={side.imageAlt[language]}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071F2E]/95 via-[#071F2E]/70 to-transparent px-4 pt-6 pb-3">
                      <span
                        className={`inline-flex items-center gap-2 text-sm sm:text-base font-extrabold ${
                          side.tone === 'safe'
                            ? 'text-[#6CE2B3]'
                            : 'text-[#F58A8A]'
                        }`}
                      >
                        {side.tone === 'safe' ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 shrink-0" />
                        )}
                        <span>{side.label[language]}</span>
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="relative aspect-[16/9] w-full bg-[#071F2E] overflow-hidden border-b border-[#285064]">
              <img
                src={selectedGuide.heroImageSrc}
                alt={selectedGuide.heroImageAlt[language]}
                className="w-full h-full object-cover"
              />
              {selectedGuide.isDontGuide && (
                <>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[#DC5252]/10 ring-2 ring-inset ring-[#DC5252]/60 pointer-events-none"
                  />
                  <div className="absolute top-4 start-4">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#071F2E]/92 border border-[#DC5252]/75 text-sm font-extrabold text-[#F58A8A]">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>{isAr ? 'أخطاء يجب تجنّبها' : 'Mistakes to avoid'}</span>
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Header Copy */}
          <div className="p-6 sm:p-8 lg:p-10 space-y-8">
            <header className="space-y-3 border-b border-[#285064] pb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F3F7F8] leading-snug">
                {selectedGuide.title[language]}
              </h1>
              <p className="text-base sm:text-lg text-[#C7D9E2] leading-relaxed max-w-2xl">
                {selectedGuide.summary[language]}
              </p>
            </header>

            {/* Illustrated Steps (Each with its own real NAFAS 16:9 image) */}
            <div className="space-y-8">
              {selectedGuide.steps.map((step) => (
                <section
                  key={step.id}
                  data-testid={`guide-step-${step.id}`}
                  className={`rounded-2xl overflow-hidden border ${
                    step.isDont
                      ? 'bg-[#0B2637] border-[#DC5252]/45'
                      : 'bg-[#0B2D40] border-[#285064]'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
                    <div className="md:col-span-5 relative aspect-[16/9] md:aspect-auto md:min-h-[210px] bg-[#071F2E] overflow-hidden">
                      <img
                        src={step.imageSrc}
                        alt={step.imageAlt[language]}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {step.isDont && (
                        <>
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-[#DC5252]/10 ring-2 ring-inset ring-[#DC5252]/50 pointer-events-none"
                          />
                          <div className="absolute top-3 start-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#071F2E]/92 border border-[#DC5252]/75 text-sm font-extrabold text-[#F58A8A]">
                              <XCircle className="w-4 h-4 shrink-0" />
                              <span>{isAr ? 'ممنوع' : 'Don’t'}</span>
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-center space-y-2.5">
                      <h2 className="text-lg sm:text-xl font-extrabold text-[#F3F7F8] leading-snug">
                        {step.title[language]}
                      </h2>
                      <p className="text-base text-[#C7D9E2] leading-relaxed">
                        {step.body[language]}
                      </p>
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* Embedded Interactive Special Practice Cards (Guide 6 Only) */}
            {selectedGuide.includeSpecialPracticeCards && (
              <section
                data-testid="guide-special-practice-cards"
                className="pt-2 space-y-4"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-[#43C7D1]">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>
                      {isAr ? 'تدريب سريع خطوة بخطوة' : 'Quick hands-on walkthrough'}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#F3F7F8]">
                    {isAr
                      ? 'جرّب الخطوات بنفسك: الكرسي المتحرك والاختناق وحدك'
                      : 'Try the steps yourself: wheelchair and choking alone'}
                  </h2>
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
            )}

            {/* Single Remember Box */}
            <aside
              data-testid="guide-remember-box"
              className="rounded-2xl bg-[#0B2D40] border-2 border-[#13B8B0]/60 p-5 sm:p-6 space-y-2"
            >
              <div className="inline-flex items-center gap-2 text-base font-extrabold text-[#43C7D1]">
                <BookmarkCheck className="w-5 h-5 text-[#13B8B0] shrink-0" />
                <span>{isAr ? 'تذكّر' : 'Remember'}</span>
              </div>
              <p className="text-base text-[#F3F7F8] leading-relaxed font-medium">
                {selectedGuide.remember[language]}
              </p>
            </aside>

            {/* Primary Practice CTA + Next Guide Link */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#285064] pt-6">
              <button
                type="button"
                data-testid="guide-practice-sim-btn"
                onClick={() => startLevel(selectedGuide.simulationLevelId)}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-extrabold text-[#071F2E] bg-[#13B8B0] hover:bg-[#43C7D1] rounded-xl transition-colors cursor-pointer min-h-[48px] shadow-md"
              >
                <Play className="w-4 h-4 fill-current shrink-0" />
                <span>{selectedGuide.simulationButtonLabel[language]}</span>
              </button>

              {nextGuide && (
                <button
                  type="button"
                  data-testid="guide-next-link"
                  onClick={() => openArticle(nextGuide.id)}
                  className="inline-flex items-center justify-between sm:justify-end gap-2.5 px-4 py-3 rounded-xl bg-[#0B2D40] hover:bg-[#19465B] border border-[#285064] hover:border-[#43C7D1] text-sm font-bold text-[#F3F7F8] transition-colors cursor-pointer min-h-[48px]"
                >
                  <span className="text-[#A9C0CC] font-semibold">
                    {isAr ? 'الدليل التالي:' : 'Next guide:'}
                  </span>
                  <span className="text-[#43C7D1] line-clamp-1">
                    {nextGuide.title[language]}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#43C7D1] shrink-0 rtl:rotate-180" />
                </button>
              )}
            </div>
          </div>
        </article>

        <MedicalDisclaimerBanner compact />

        <p
          data-testid="learn-sources-line"
          className="text-sm text-[#A9C0CC] text-center"
        >
          {SOURCES_LINE[language]}
        </p>
      </div>
    );
  }

  // =========================================================================
  // LEARNING HUB DIRECTORY (6 ILLUSTRATED GUIDES)
  // =========================================================================
  const ageFilters: { id: AgeCategory | 'all'; label: string }[] = [
    { id: 'all', label: isAr ? 'الكل' : 'All' },
    { id: 'adult', label: isAr ? 'البالغون' : 'Adults' },
    { id: 'child', label: isAr ? 'الأطفال' : 'Children' },
    { id: 'infant', label: isAr ? 'الرضّع' : 'Infants' },
  ];

  return (
    <div
      data-testid="learning-hub-view"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8"
    >
      {/* Clean Header: Title, 1 Short Sentence, Small Search Box, ONE Age Filter */}
      <section className="bg-[#0B2D40] border border-[#285064] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F3F7F8] leading-tight">
              {isAr ? 'مركز التعلّم' : 'Learning Hub'}
            </h1>
            <p className="text-base text-[#C7D9E2] leading-relaxed">
              {isAr
                ? 'أدلة مصوّرة بسيطة تساعدك على التصرّف بهدوء وثقة في حالات الاختناق.'
                : 'Simple illustrated guides to help you act calmly and clearly in choking emergencies.'}
            </p>
          </div>

          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="w-4 h-4 text-[#A9C0CC] absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
            <input
              type="search"
              data-testid="learn-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث في الأدلة...' : 'Search guides...'}
              className="w-full ps-10 pe-4 py-2.5 text-sm bg-[#123B50] border border-[#285064] rounded-xl text-[#F3F7F8] placeholder:text-[#A9C0CC] focus:outline-none focus:border-[#13B8B0] min-h-[44px]"
            />
          </div>
        </div>

        {/* Single Age Filter */}
        <div className="pt-4 border-t border-[#285064] flex flex-wrap items-center justify-between gap-4">
          <div
            role="group"
            aria-label={isAr ? 'تصفية حسب الفئة العمرية' : 'Filter by age group'}
            data-testid="learn-age-filter"
            className="grid grid-cols-4 sm:inline-flex items-center gap-1 sm:gap-1.5 p-1 bg-[#071F2E] rounded-xl border border-[#285064] w-full sm:w-auto"
          >
            {ageFilters.map((af) => {
              const active = learningAgeFilter === af.id;
              return (
                <button
                  key={af.id}
                  type="button"
                  data-testid={`learn-age-btn-${af.id}`}
                  onClick={() => setLearningAgeFilter(af.id)}
                  className={`px-2 sm:px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer min-h-[38px] text-center ${
                    active
                      ? 'bg-[#13B8B0] text-[#071F2E]'
                      : 'text-[#C7D9E2] hover:text-[#F3F7F8] hover:bg-[#123B50]/60'
                  }`}
                >
                  {af.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6 Illustrated Guide Cards Grid */}
      {filteredGuides.length > 0 ? (
        <div
          data-testid="learn-guides-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredGuides.map((guide) => (
            <article
              key={guide.id}
              data-testid={`guide-card-${guide.id}`}
              className={`group bg-[#123B50] border rounded-2xl overflow-hidden flex flex-col justify-between transition-all shadow-md hover:shadow-xl ${
                guide.isDontGuide
                  ? 'border-[#DC5252]/45 hover:border-[#DC5252]'
                  : 'border-[#285064] hover:border-[#13B8B0]'
              }`}
            >
              <div>
                <GuideCardVisual guide={guide} language={language} />

                <div className="p-5 sm:p-6 space-y-2.5">
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#F3F7F8] leading-snug">
                    {guide.title[language]}
                  </h2>
                  <p className="text-sm sm:text-[15px] text-[#C7D9E2] leading-relaxed">
                    {guide.summary[language]}
                  </p>
                </div>
              </div>

              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-4 border-t border-[#285064]/80 flex items-center justify-between gap-3">
                <button
                  type="button"
                  data-testid={`guide-open-btn-${guide.id}`}
                  onClick={() => openArticle(guide.id)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B2D40] hover:bg-[#13B8B0] text-[#43C7D1] hover:text-[#071F2E] border border-[#285064] hover:border-[#13B8B0] text-sm font-extrabold transition-colors cursor-pointer min-h-[42px]"
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>{isAr ? 'اقرأ الدليل' : 'Read guide'}</span>
                  <ArrowRight className="w-4 h-4 shrink-0 rtl:rotate-180" />
                </button>

                <button
                  type="button"
                  onClick={() => startLevel(guide.simulationLevelId)}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#13B8B0] hover:text-[#43C7D1] transition-colors cursor-pointer min-h-[42px] px-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>{isAr ? 'تدرّب' : 'Practice'}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-[#123B50] border border-[#285064] rounded-2xl p-10 text-center space-y-4">
          <p className="text-lg font-bold text-[#F3F7F8]">
            {isAr ? 'لم يتم العثور على أدلة مطابقة' : 'No matching guides found'}
          </p>
          <p className="text-sm text-[#C7D9E2] max-w-md mx-auto">
            {isAr
              ? 'جرّب كلمات بحث أخرى أو اختر «الكل» لعرض جميع الأدلة.'
              : 'Try different keywords or select “All” to view every guide.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setLearningAgeFilter('all');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-extrabold text-[#071F2E] bg-[#13B8B0] hover:bg-[#43C7D1] rounded-xl transition-colors cursor-pointer min-h-[44px]"
          >
            {isAr ? 'عرض جميع الأدلة' : 'Show all guides'}
          </button>
        </div>
      )}

      {/* Single Clean Medical Disclaimer (Emergency Numbers Shown Once, LTR-Isolated) */}
      <MedicalDisclaimerBanner compact />

      {/* Sources Line (RCUK 2025 + American Red Cross; zero AHA) */}
      <p
        data-testid="learn-sources-line"
        className="text-sm text-[#A9C0CC] text-center"
      >
        {SOURCES_LINE[language]}
      </p>
    </div>
  );
};
