import React from 'react';
import { ShieldAlert, PhoneCall } from 'lucide-react';
import { useNafas } from '../context/NafasContext';

const EMERGENCY_NUMBERS = '997 / 911 / 999 / 123 / 112';

export const MedicalDisclaimerBanner: React.FC<{ compact?: boolean }> = ({
  compact = false,
}) => {
  const { t } = useNafas();

  if (compact) {
    return (
      <div
        data-testid="medical-disclaimer-banner"
        className="bg-[#0B2D40] border border-[#E9A23B]/45 rounded-2xl px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-sm text-[#A9C0CC]"
      >
        <div className="flex items-start sm:items-center gap-2.5 leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-[#E9A23B] shrink-0 mt-1 sm:mt-0" />
          <p>
            <strong className="font-semibold text-[#F3F7F8]">
              {t.disclaimer.badge}:
            </strong>{' '}
            {t.disclaimer.shortText}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <PhoneCall className="w-4 h-4 text-[#DC5252] shrink-0" />
          <span className="font-bold text-[#F3F7F8]">
            {t.disclaimer.emergencyAction}
          </span>
          <span
            dir="ltr"
            data-testid="emergency-numbers-ltr"
            className="inline-block [unicode-bidi:isolate] font-extrabold text-[#DC5252] tabular-nums whitespace-nowrap bg-[#071F2E] border border-[#DC5252]/40 rounded-lg px-2.5 py-0.5"
          >
            {EMERGENCY_NUMBERS}
          </span>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-label={t.disclaimer.badge}
      data-testid="medical-disclaimer-banner"
      className="bg-[#123B50] border border-[#285064] rounded-2xl p-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E9A23B]">
            <ShieldAlert className="w-4 h-4" />
            <span>{t.disclaimer.badge}</span>
          </div>
          <p className="text-sm font-medium text-[#F3F7F8] leading-relaxed">
            {t.disclaimer.shortText}
          </p>
          <p className="text-sm text-[#A9C0CC] leading-relaxed">
            {t.disclaimer.reviewNotice}
          </p>
        </div>

        <div className="bg-[#071F2E] border border-[#DC5252]/50 rounded-xl p-4 md:max-w-xs shrink-0 space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#DC5252]">
            <PhoneCall className="w-4 h-4 shrink-0" />
            <span
              dir="ltr"
              data-testid="emergency-numbers-ltr"
              className="inline-block [unicode-bidi:isolate] tabular-nums"
            >
              {EMERGENCY_NUMBERS}
            </span>
          </div>
          <p className="text-xs text-[#A9C0CC] leading-snug">
            {t.disclaimer.emergencyAction}
          </p>
        </div>
      </div>
    </section>
  );
};
