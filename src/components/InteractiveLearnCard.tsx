import React, { useState } from 'react';
import { CheckCircle2, Play, RotateCcw } from 'lucide-react';
import { SpecialCaseLearnCard } from '../data/storyLevels';
import { STORY_MEDIA } from '../data/storyMedia';
import { Language } from '../types/nafas';

interface InteractiveLearnCardProps {
  card: SpecialCaseLearnCard;
  language: Language;
}

export const InteractiveLearnCard: React.FC<InteractiveLearnCardProps> = ({
  card,
  language,
}) => {
  const isAr = language === 'ar';
  const [tryModeActive, setTryModeActive] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const asset = STORY_MEDIA[card.mediaKey] || STORY_MEDIA.hero_nafas_awareness;
  const currentTryStep = card.tryItSteps[activeStepIdx];
  const isFinished = activeStepIdx >= card.tryItSteps.length;

  return (
    <div
      data-testid={`interactive-learn-card-${card.id}`}
      className="bg-[#123B50] border border-[#285064] rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
    >
      <div>
        <div className="relative aspect-[16/9] w-full bg-[#071F2E] overflow-hidden">
          <img
            src={asset.src}
            alt={asset.alt[language]}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 start-3">
            <span className="px-3 py-1 rounded-lg bg-[#071F2E]/90 border border-[#13B8B0]/60 text-xs font-extrabold text-[#43C7D1]">
              {card.badge[language]}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-[#F3F7F8] leading-snug">
                {card.title[language]}
              </h3>
              <p className="text-sm text-[#A9C0CC] leading-relaxed">
                {card.subtitle[language]}
              </p>
            </div>
            <button
              type="button"
              data-testid={`learn-card-try-btn-${card.id}`}
              onClick={() => {
                setTryModeActive((prev) => !prev);
                setActiveStepIdx(0);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-extrabold shrink-0 inline-flex items-center gap-1.5 transition-all min-h-[42px] cursor-pointer ${
                tryModeActive
                  ? 'bg-[#19465B] text-[#43C7D1] border border-[#43C7D1]'
                  : 'bg-[#13B8B0] text-[#071F2E] hover:bg-[#43C7D1]'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {tryModeActive
                  ? isAr
                    ? 'عرض القراءة'
                    : 'Read Steps'
                  : isAr
                  ? 'جرّبها'
                  : 'Try it'}
              </span>
            </button>
          </div>

          {!tryModeActive ? (
            <ul className="space-y-2.5 pt-1">
              {card.steps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-sm text-[#F3F7F8] leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#13B8B0] shrink-0 mt-1" />
                  <span>{step[language]}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div
              data-testid={`learn-card-stepper-${card.id}`}
              className="rounded-2xl bg-[#0B2D40] border border-[#43C7D1]/60 p-4 space-y-3"
            >
              {/* Progress Dots */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[#43C7D1]">
                  {isAr ? 'تدريب عملي خطوة بخطوة' : 'Step-by-step practice'}
                </span>
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {card.tryItSteps.map((st, idx) => (
                    <span
                      key={st.stepNumber}
                      className={`h-2 rounded-full transition-all ${
                        idx < activeStepIdx
                          ? 'w-4 bg-[#16A36A]'
                          : idx === activeStepIdx
                          ? 'w-6 bg-[#13B8B0]'
                          : 'w-2 bg-[#285064]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {!isFinished && currentTryStep ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="text-base font-extrabold text-[#F3F7F8]">
                      {currentTryStep.title[language]}
                    </h4>
                    <p className="text-sm text-[#A9C0CC] leading-relaxed">
                      {currentTryStep.detail[language]}
                    </p>
                  </div>

                  {activeStepIdx > 0 && (
                    <div className="rounded-xl bg-[#16A36A]/15 border border-[#16A36A]/40 p-3 text-sm font-bold text-[#16A36A] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>
                        {card.tryItSteps[activeStepIdx - 1].feedback[language]}
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    data-testid={`learn-card-step-action-${card.id}`}
                    onClick={() => setActiveStepIdx((prev) => prev + 1)}
                    className="w-full py-3 px-4 rounded-xl bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] font-extrabold text-sm min-h-[46px] transition-colors cursor-pointer"
                  >
                    {currentTryStep.actionButton[language]}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl bg-[#16A36A]/15 border border-[#16A36A]/50 p-3 text-sm font-bold text-[#F3F7F8] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />
                    <span>
                      {
                        card.tryItSteps[card.tryItSteps.length - 1].feedback[
                          language
                        ]
                      }
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveStepIdx(0)}
                    className="w-full py-2.5 rounded-xl bg-[#123B50] hover:bg-[#19465B] border border-[#285064] text-sm font-extrabold text-[#43C7D1] inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>
                      {isAr ? 'أعد التدريب مرة أخرى' : 'Practice Again'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-5 sm:pb-6">
        <div className="p-3.5 rounded-xl bg-[#071F2E] border border-[#285064] text-sm font-semibold text-[#43C7D1] leading-relaxed">
          {card.safetyRule[language]}
        </div>
      </div>
    </div>
  );
};
