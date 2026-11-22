import React from 'react';
import { useNafas } from '../context/NafasContext';
import { NafasLogoLockup } from './Navbar';

export const Footer: React.FC = () => {
  const { language, navigateTo } = useNafas();
  const isAr = language === 'ar';

  return (
    <footer className="bg-[#0B2D40] text-[#F3F7F8] border-t border-[#285064]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-3">
        {/* Top Row: Official Chosen Logo + Tagline | Subtle ECG Wave | References & Contact */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs sm:text-sm">
            <button
              type="button"
              data-testid="footer-logo-link"
              onClick={() => navigateTo('home')}
              className="cursor-pointer focus-visible:outline-2 focus-visible:outline-[#13B8B0] focus-visible:outline-offset-4 rounded-lg inline-flex items-center"
              aria-label="NAFAS نَفَس"
            >
              <NafasLogoLockup size="footer" />
            </button>
            <span className="text-[#285064]" aria-hidden="true">
              |
            </span>
            <span className="text-[#A9C0CC] font-medium">
              {isAr ? 'تعلّم. تصرّف. أنقذ حياة.' : 'Learn. Act. Save a Life.'}
            </span>
            <span className="hidden sm:inline text-[#285064]" aria-hidden="true">
              ·
            </span>
            <span className="text-xs text-[#43C7D1]">
              {isAr
                ? 'مشروع الإسعافات الأولية والذكاء الاصطناعي'
                : 'First Aid & Artificial Intelligence Project'}
            </span>
          </div>

          {/* Center: Subtle Cyan ECG Waveform */}
          <div
            className="hidden lg:flex items-center justify-center flex-1 max-w-xs mx-4"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 260 32"
              className="w-full h-6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="footerEcgGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#43C7D1" stopOpacity="0" />
                  <stop offset="35%" stopColor="#13B8B0" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#43C7D1" stopOpacity="1" />
                  <stop offset="65%" stopColor="#13B8B0" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#43C7D1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 16H95L104 16L110 8L117 25L125 3L133 28L140 11L146 20L151 16H260"
                stroke="url(#footerEcgGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Right: References | Credits | Contact */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-medium text-[#A9C0CC]">
            <button
              type="button"
              onClick={() => navigateTo('learning')}
              className="hover:text-[#43C7D1] transition-colors cursor-pointer"
            >
              {isAr ? 'المراجع الطبية' : 'References'}
            </button>
            <span className="text-[#285064]" aria-hidden="true">
              |
            </span>
            <a
              href="/credits"
              data-testid="footer-credits-link"
              className="hover:text-[#43C7D1] transition-colors cursor-pointer"
            >
              {isAr ? 'حقوق الصوتيات' : 'Credits'}
            </a>
            <span className="text-[#285064]" aria-hidden="true">
              |
            </span>
            <button
              type="button"
              onClick={() => navigateTo('about')}
              className="hover:text-[#43C7D1] transition-colors cursor-pointer"
            >
              {isAr ? 'تواصل معنا' : 'Contact'}
            </button>
          </div>
        </div>

        {/* Bottom Row: Educational Prototype Disclaimer */}
        <div className="pt-3 border-t border-[#285064] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#A9C0CC] text-center sm:text-start">
          <p>
            {isAr
              ? 'نَفَس هو نموذج أولي تعليمي ولا يُغني عن الخدمات الطبية المتخصصة أو التدريب المعتمد على الإسعافات الأولية.'
              : 'NAFAS is an educational prototype and does not replace professional medical services or certified first-aid training.'}
          </p>
          <p className="text-[#A9C0CC]/75 shrink-0">
            {isAr
              ? '© مشروع نَفَس الأكاديمي'
              : '© NAFAS Academic Prototype'}
          </p>
        </div>
      </div>
    </footer>
  );
};
