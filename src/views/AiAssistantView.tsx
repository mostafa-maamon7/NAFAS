import React, { useMemo, useState } from 'react';
import {
  FlaskConical,
  Search,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Send,
  ShieldAlert,
} from 'lucide-react';
import { useNafas } from '../context/NafasContext';
import { VERIFIED_QA_ITEMS } from '../data/verifiedAiKnowledge';
import { AgeCategory } from '../types/nafas';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';

export const AiAssistantView: React.FC = () => {
  const { language, t, openArticle } = useNafas();
  const isAr = language === 'ar';

  const [selectedCategory, setSelectedCategory] = useState<
    AgeCategory | 'general' | 'all'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQaId, setSelectedQaId] = useState<string>(
    VERIFIED_QA_ITEMS[0].id
  );

  const [customPrompt, setCustomPrompt] = useState('');
  const [guardrailNotice, setGuardrailNotice] = useState<{
    type: 'emergency' | 'refusal' | 'matched';
    title: { en: string; ar: string };
    message: { en: string; ar: string };
  } | null>(null);

  const filteredQuestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return VERIFIED_QA_ITEMS.filter((item) => {
      const matchesCat =
        selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        item.question[language].toLowerCase().includes(q) ||
        item.shortAnswer[language].toLowerCase().includes(q) ||
        item.detailedExplanation[language].toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery, language]);

  const activeQa = useMemo(() => {
    const found = filteredQuestions.find((i) => i.id === selectedQaId);
    return found || filteredQuestions[0] || VERIFIED_QA_ITEMS[0];
  }, [filteredQuestions, selectedQaId]);

  const handleAskGuardrailedAssistant = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = customPrompt.trim();
    if (!raw) return;
    const lower = raw.toLowerCase();

    const emergencyKeywords = [
      'right now',
      'dying',
      'turning blue',
      'help now',
      'يختنق الآن',
      'ازرق',
      'طوارئ',
      'انقذوا',
    ];
    if (emergencyKeywords.some((kw) => lower.includes(kw))) {
      setGuardrailNotice({
        type: 'emergency',
        title: {
          en: 'URGENT: Active Choking Emergency Protocol',
          ar: 'عاجل: بروتوكول طوارئ الاختناق الفوري',
        },
        message: {
          en: 'If someone is choking right now, STOP using this app and call Egyptian Ambulance (123) or Emergency Police (122) on speakerphone immediately. If they cannot cough or speak: perform 5 back blows and 5 abdominal thrusts (or 5 back blows and 5 two-finger chest thrusts for an infant <1 yr).',
          ar: 'إذا كان هناك شخص يختنق الآن، توقف فوراً عن استخدام التطبيق واتصل بهيئة الإسعاف المصرية (123) أو النجدة (122) عبر مكبر الصوت. إذا لم يستطع السعال أو الكلام: نفّذ 5 ضربات ظهرية و5 ضغطات بطنية (أو 5 ضربات ظهرية و5 ضغطات صدرية بإصبعين للرضيع أقل من سنة).',
        },
      });
      return;
    }

    const refusalKeywords = [
      'medication',
      'drug',
      'dose',
      'antibiotic',
      'surgery',
      'tracheotomy',
      'cricothyrotomy',
      'knife',
      'pen',
      'diagnose',
      'دواء',
      'جرعة',
      'جراحة',
      'تشخيص',
      'ثقب القصبة',
    ];
    if (refusalKeywords.some((kw) => lower.includes(kw))) {
      setGuardrailNotice({
        type: 'refusal',
        title: {
          en: 'Clinical Safety Guardrail — Out of First-Aid Scope',
          ar: 'حاجز الأمان الطبي — خارج نطاق الإسعاف الأولي',
        },
        message: {
          en: 'NAFAS AI Assistant is strictly restricted to non-invasive, guideline-aligned choking first aid (AHA / ARC / Resuscitation Council UK). It cannot diagnose medical conditions, prescribe medications, or instruct on invasive airway procedures.',
          ar: 'مساعد "نَفَس" مقيد صارماً بالإسعافات الأولية غير الجراحية للاختناق وفق إرشادات (AHA / ARC / RCUK). لا يقدم المساعد أي تشخيص طبي أو وصف للأدوية أو إجراءات جراحية.',
        },
      });
      return;
    }

    const matched =
      VERIFIED_QA_ITEMS.find(
        (item) =>
          item.question.en.toLowerCase().includes(lower) ||
          item.question.ar.includes(raw) ||
          item.shortAnswer.en.toLowerCase().includes(lower) ||
          item.shortAnswer.ar.includes(raw) ||
          (lower.includes('infant') && item.category === 'infant') ||
          (lower.includes('رضيع') && item.category === 'infant') ||
          (lower.includes('pregnant') && item.id.includes('pregnant')) ||
          (lower.includes('حامل') && item.id.includes('pregnant')) ||
          (lower.includes('child') && item.category === 'child') ||
          (lower.includes('طفل') && item.category === 'child')
      ) || VERIFIED_QA_ITEMS[0];

    setSelectedCategory('all');
    setSelectedQaId(matched.id);
    setGuardrailNotice({
      type: 'matched',
      title: {
        en: 'Matched Verified Clinical Guideline Entry',
        ar: 'تمت المطابقة مع الدليل الطبي الموثّق',
      },
      message: {
        en: `Displaying the verified guideline answer for "${matched.question.en}" below, with direct Learning Hub citation.`,
        ar: `تم عرض الإجابة الطبية الموثقة لسؤال "${matched.question.ar}" بالأسفل مع الإحالة للدليل التعليمي.`,
      },
    });
  };

  const categoryTabs: {
    id: AgeCategory | 'general' | 'all';
    label: string;
  }[] = [
    { id: 'all', label: t.aiAssistant.filterAll },
    { id: 'general', label: t.aiAssistant.filterGeneral },
    { id: 'adult', label: t.aiAssistant.filterAdult },
    { id: 'child', label: t.aiAssistant.filterChild },
    { id: 'infant', label: t.aiAssistant.filterInfant },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Persistent Emergency Escalation Banner */}
      <section className="rounded-2xl bg-[#123B50] border border-[#DC5252] text-[#F3F7F8] p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DC5252] flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5 text-[#F3F7F8]" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#F3F7F8]">
              {isAr
                ? 'تحذير طوارئ مستمر: هل تواجه حالة اختناق حقيقية الآن؟'
                : 'Persistent Emergency Notice: Is This a Real, Ongoing Emergency?'}
            </h2>
            <p className="text-xs text-[#A9C0CC] mt-0.5">
              {isAr
                ? 'إذا كانت هناك حالة اختناق حقيقية الآن، لا تنتظر الإجابة هنا — اتصل فوراً بهيئة الإسعاف المصرية (123) أو الطوارئ وابدأ الإسعاف الأولي.'
                : 'If this is a real, ongoing choking emergency in Egypt, call Egyptian Ambulance (123) immediately and begin physical rescue maneuvers.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DC5252]/15 border border-[#DC5252]/60 text-[#F3F7F8] text-xs font-extrabold whitespace-nowrap">
            <span>{isAr ? 'الإسعاف' : 'Ambulance'}</span>
            <span dir="ltr" className="[unicode-bidi:isolate] tabular-nums text-[#FF7A85]">
              123
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#071F2E] border border-[#285064] text-[#C8DCE6] text-xs font-bold whitespace-nowrap">
            <span>{isAr ? 'النجدة' : 'Police'}</span>
            <span dir="ltr" className="[unicode-bidi:isolate] tabular-nums text-[#43C7D1]">
              122
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#071F2E] border border-[#285064] text-[#C8DCE6] text-xs font-bold whitespace-nowrap">
            <span>{isAr ? 'المطافئ' : 'Fire'}</span>
            <span dir="ltr" className="[unicode-bidi:isolate] tabular-nums text-[#43C7D1]">
              180
            </span>
          </span>
        </div>
      </section>

      {/* Header with Guardrailed Scope */}
      <section className="bg-[#0B2D40] border border-[#285064] rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#43C7D1]">
            <FlaskConical className="w-4 h-4 text-[#13B8B0]" />
            <span>{t.aiAssistant.badge}</span>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-[#E9A23B]/15 text-[#E9A23B] border border-[#E9A23B]/45 text-xs font-bold">
            {isAr ? 'قيد التقييم الأكاديمي' : 'Under Academic Evaluation'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F3F7F8]">
          {t.aiAssistant.title}
        </h1>

        <p className="text-sm sm:text-base text-[#A9C0CC] max-w-3xl leading-relaxed">
          {t.aiAssistant.subtitle}
        </p>

        {/* Interactive Guardrailed Ask Form */}
        <form
          onSubmit={handleAskGuardrailedAssistant}
          className="pt-2 flex flex-col sm:flex-row gap-2.5"
        >
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder={
              isAr
                ? 'اسأل سؤالاً حول إسعاف الاختناق (مثال: لماذا يُمنع ضغط بطن الرضيع؟)...'
                : 'Ask a choking first-aid question (e.g., Why are abdominal thrusts forbidden in infants?)...'
            }
            className="flex-1 px-4 py-3 text-xs sm:text-sm bg-[#123B50] border border-[#285064] rounded-xl text-[#F3F7F8] placeholder:text-[#A9C0CC] focus:outline-2 focus:outline-[#13B8B0]"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>
              {isAr ? 'استشر الدليل الموثّق' : 'Query Verified Guidelines'}
            </span>
          </button>
        </form>

        {/* Guardrail Response Banner */}
        {guardrailNotice && (
          <div
            className={`rounded-xl p-4 border flex items-start gap-3 ${
              guardrailNotice.type === 'emergency'
                ? 'bg-[#071F2E] border-[#DC5252] text-[#F3F7F8]'
                : guardrailNotice.type === 'refusal'
                ? 'bg-[#071F2E] border-[#E9A23B] text-[#F3F7F8]'
                : 'bg-[#123B50] border-[#13B8B0] text-[#F3F7F8]'
            }`}
          >
            <ShieldAlert
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                guardrailNotice.type === 'emergency'
                  ? 'text-[#DC5252]'
                  : guardrailNotice.type === 'refusal'
                  ? 'text-[#E9A23B]'
                  : 'text-[#43C7D1]'
              }`}
            />
            <div className="space-y-1">
              <div className="text-xs font-extrabold">
                {guardrailNotice.title[language]}
              </div>
              <p className="text-xs text-[#A9C0CC] leading-relaxed">
                {guardrailNotice.message[language]}
              </p>
            </div>
          </div>
        )}

        {/* Research Phase Governance Callout */}
        <div className="bg-[#123B50] border border-[#E9A23B]/45 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#E9A23B] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-[#F3F7F8]">
              {t.aiAssistant.researchNoticeTitle}
            </h2>
            <p className="text-xs text-[#A9C0CC] leading-relaxed">
              {t.aiAssistant.researchNoticeBody}
            </p>
          </div>
        </div>
      </section>

      {/* Search & Category Filters */}
      <section className="bg-[#0B2D40] border border-[#285064] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {categoryTabs.map((tab) => {
            const active = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#13B8B0] text-[#071F2E] font-bold'
                    : 'bg-[#123B50] text-[#A9C0CC] hover:text-[#F3F7F8] hover:bg-[#19465B]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#A9C0CC] absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.aiAssistant.searchPrompt}
            className="w-full ps-10 pe-4 py-2 text-xs bg-[#123B50] border border-[#285064] rounded-xl text-[#F3F7F8] placeholder:text-[#A9C0CC] focus:outline-none focus:border-[#13B8B0]"
          />
        </div>
      </section>

      {/* Two-Column Guided Q&A Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List of Verified Clinical Questions (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0B2D40] border border-[#285064] rounded-2xl p-5 space-y-3">
          <div className="text-xs font-bold text-[#F3F7F8] pb-2 border-b border-[#285064]">
            {t.aiAssistant.selectQuestionPrompt} ({filteredQuestions.length})
          </div>

          <div className="space-y-2.5">
            {filteredQuestions.map((qa) => {
              const isSelected = qa.id === activeQa.id;
              return (
                <button
                  key={qa.id}
                  type="button"
                  onClick={() => setSelectedQaId(qa.id)}
                  className={`w-full text-start p-4 rounded-xl border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#19465B] text-[#F3F7F8] border-[#43C7D1]'
                      : 'bg-[#123B50] text-[#A9C0CC] border-[#285064] hover:border-[#13B8B0] hover:text-[#F3F7F8]'
                  }`}
                >
                  <div className="text-sm font-bold leading-snug">
                    {qa.question[language]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Verified Answer & Source Inspector (7 Cols) */}
        <div className="lg:col-span-7 bg-[#123B50] border border-[#285064] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2 border-b border-[#285064] pb-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#43C7D1]">
              <ShieldCheck className="w-4 h-4 text-[#13B8B0]" />
              <span>{t.aiAssistant.verifiedSourceLabel}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#F3F7F8] leading-snug">
              {activeQa.question[language]}
            </h2>
          </div>

          {/* Direct Guideline Summary */}
          <div className="bg-[#0B2D40] border border-[#16A36A]/50 rounded-xl p-5 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#16A36A]">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.aiAssistant.shortAnswerLabel}</span>
            </div>
            <p className="text-sm font-semibold text-[#F3F7F8] leading-relaxed">
              {activeQa.shortAnswer[language]}
            </p>
          </div>

          {/* Detailed Clinical Explanation */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#43C7D1]">
              {t.aiAssistant.detailedExplanationLabel}
            </h3>
            <p className="text-sm sm:text-base text-[#A9C0CC] leading-relaxed">
              {activeQa.detailedExplanation[language]}
            </p>
          </div>

          {/* Critical Safety Rule Box */}
          <div className="bg-[#071F2E] border border-[#285064] text-[#F3F7F8] rounded-xl p-5 space-y-1.5">
            <div className="text-xs font-bold text-[#43C7D1]">
              {t.aiAssistant.criticalRuleLabel}
            </div>
            <p className="text-sm font-bold leading-relaxed">
              {activeQa.criticalRule[language]}
            </p>
          </div>

          {/* Guideline Citation & Source Learning Hub Link */}
          <div className="pt-4 border-t border-[#285064] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-[#A9C0CC]">
              <strong className="text-[#F3F7F8]">
                {t.aiAssistant.verifiedSourceLabel}:
              </strong>{' '}
              {activeQa.guidelineCitation[language]}
            </div>

            <button
              type="button"
              onClick={() => openArticle(activeQa.sourceArticleId)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold text-[#071F2E] bg-[#13B8B0] hover:bg-[#43C7D1] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.aiAssistant.openSourceArticleBtn}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>

      <MedicalDisclaimerBanner compact />
    </div>
  );
};
