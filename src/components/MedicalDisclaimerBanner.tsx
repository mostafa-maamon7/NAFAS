import React from 'react';
import { ShieldAlert, PhoneCall } from 'lucide-react';
import { useNafas } from '../context/NafasContext';

const EGYPT_EMERGENCY_NUMBERS = [
  {
    number: '123',
    ar: 'هيئة الإسعاف المصرية',
    en: 'Egypt Ambulance',
    primary: true,
  },
  {
    number: '122',
    ar: 'النجدة',
    en: 'Emergency Police',
    primary: false,
  },
  {
    number: '180',
    ar: 'الحماية المدنية',
    en: 'Civil Defense',
    primary: false,
  },
];

export const MedicalDisclaimerBanner: React.FC<{ compact?: boolean }> = ({
  compact = false,
}) => {
  const { t, language } = useNafas();
  const isAr = language === 'ar';

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
          <span className="font-bold text-[#F3F7F8] text-xs sm:text-sm">
            {isAr ? 'طوارئ مصر الرسمية:' : 'Egypt Emergency:'}
          </span>
          <div
            data-testid="emergency-numbers-ltr"
            className="flex flex-wrap items-center gap-1.5"
          >
            {EGYPT_EMERGENCY_NUMBERS.map((item) => (
              <span
                key={item.number}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-0.5 text-xs whitespace-nowrap border ${
                  item.primary
                    ? 'bg-[#DC5252]/15 border-[#DC5252]/60 text-[#F3F7F8] font-extrabold'
                    : 'bg-[#071F2E] border-[#285064] text-[#C8DCE6] font-semibold'
                }`}
              >
                <span>{isAr ? item.ar : item.en}</span>
                <span
                  dir="ltr"
                  className={`[unicode-bidi:isolate] tabular-nums font-extrabold ${
                    item.primary ? 'text-[#FF7A85]' : 'text-[#43C7D1]'
                  }`}
                >
                  {item.number}
                </span>
              </span>
            ))}
          </div>
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

        <div className="bg-[#071F2E] border border-[#DC5252]/45 rounded-xl p-4 md:min-w-[270px] shrink-0 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#FF7A85]">
            <PhoneCall className="w-4 h-4 shrink-0" />
            <span>
              {isAr
                ? 'أرقام الطوارئ الرسمية في مصر'
                : 'Official Egypt Emergency Numbers'}
            </span>
          </div>
          <div
            data-testid="emergency-numbers-ltr"
            className="space-y-1.5"
          >
            {EGYPT_EMERGENCY_NUMBERS.map((item) => (
              <div
                key={item.number}
                className={`flex items-center justify-between gap-3 rounded-lg px-3 py-1.5 text-xs ${
                  item.primary
                    ? 'bg-[#DC5252]/15 border border-[#DC5252]/50 text-[#F3F7F8]'
                    : 'bg-[#0B2D40]/75 border border-[#1E4B63] text-[#C8DCE6]'
                }`}
              >
                <span className={item.primary ? 'font-bold' : 'font-medium'}>
                  {isAr ? item.ar : item.en}
                </span>
                <span
                  dir="ltr"
                  className={`[unicode-bidi:isolate] tabular-nums font-extrabold text-sm ${
                    item.primary ? 'text-[#FF7A85]' : 'text-[#43C7D1]'
                  }`}
                >
                  {item.number}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
