import React, { useState } from 'react';
import {
  UserCircle,
  BookOpen,
  Play,
  Sparkles,
  Menu,
  X,
  ArrowRight,
  Home,
} from 'lucide-react';
import { useNafas } from '../context/NafasContext';
import { NavSection } from '../types/nafas';

/**
 * Light transparent NAFAS logo v2 for dark surfaces (header & footer).
 * Emblem in original colors, wordmark in crisp white, transparent background (562x175).
 * Never redrawn or recolored.
 */
export const NAFAS_LIGHT_LOGO_PATH = '/assets/logo/nafas-logo-light-v2.png';
/** Original dark-wordmark trimmed logo — kept strictly for light backgrounds. */
export const NAFAS_TRIMMED_LOGO_PATH = '/assets/logo/nafas-logo-trimmed.png';
export const NAFAS_EMBLEM_SQUARE_PATH = '/assets/logo/apple-touch-icon-180x180.png';

/**
 * Integrated NAFAS Logo Lockup directly on dark header/footer (NO white plate).
 * Height: 34px mobile, 42px desktop (footer: 34px mobile, 38px desktop), natural aspect ratio,
 * crisp high-DPI scaling, vertically centered, never clipped.
 */
export const NafasLogoLockup: React.FC<{
  className?: string;
  size?: 'header' | 'footer';
}> = ({ className = '', size = 'header' }) => {
  const heightClass =
    size === 'footer'
      ? 'h-[34px] sm:h-[38px]'
      : 'h-[34px] sm:h-[42px]';

  return (
    <span
      data-testid={`nafas-logo-${size}`}
      className={`inline-flex items-center shrink-0 select-none overflow-visible leading-none ${heightClass} ${className}`}
      dir="ltr"
    >
      <img
        src={NAFAS_LIGHT_LOGO_PATH}
        alt="NAFAS نَفَس"
        width={562}
        height={175}
        decoding="async"
        className="h-full w-auto max-w-none object-contain block"
      />
    </span>
  );
};

export const NafasBrandEmblem: React.FC<{ className?: string }> = ({
  className = 'w-10 h-10',
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}
      dir="ltr"
    >
      <img
        src={NAFAS_EMBLEM_SQUARE_PATH}
        alt="NAFAS نَفَس"
        width={180}
        height={180}
        className="w-full h-full object-contain block"
      />
    </div>
  );
};

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, activeSection, navigateTo } = useNafas();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAr = language === 'ar';

  const navItems: {
    id: NavSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'home',
      label: isAr ? 'الرئيسية' : 'Home',
      icon: Home,
    },
    {
      id: 'about',
      label: isAr ? 'عن نَفَس' : 'About NAFAS',
      icon: UserCircle,
    },
    {
      id: 'learning',
      label: isAr ? 'التعلّم' : 'Learn',
      icon: BookOpen,
    },
    {
      id: 'simulation',
      label: isAr ? 'المحاكاة' : 'Simulation',
      icon: Play,
    },
    {
      id: 'ai-assistant',
      label: isAr ? 'المساعد الذكي' : 'AI Assistant',
      icon: Sparkles,
    },
  ];

  const handleNavClick = (section: NavSection) => {
    navigateTo(section);
    setMobileMenuOpen(false);
  };

  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-40 overflow-visible bg-[#051C2C]/95 backdrop-blur-md border-b border-[#13B8B0]/25 shadow-[0_4px_24px_rgba(3,12,20,0.55)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[64px] sm:min-h-[76px] py-3 sm:py-4 flex items-center justify-between gap-4 lg:gap-6 overflow-visible">
        {/* Zone 1: Integrated Transparent Light Brand Logo v2 (Links to Home) */}
        <button
          type="button"
          data-testid="header-logo-link"
          onClick={() => handleNavClick('home')}
          className="inline-flex items-center overflow-visible py-0.5 text-start focus-visible:outline-2 focus-visible:outline-[#13B8B0] focus-visible:outline-offset-4 rounded-lg cursor-pointer group shrink-0"
          aria-label="NAFAS نَفَس"
        >
          <NafasLogoLockup
            size="header"
            className="group-hover:opacity-95 transition-opacity"
          />
        </button>

        {/* Zone 2: Center Navigation Links — 15-16px, medium weight, single line, even gaps, soft active pill */}
        <nav
          data-testid="desktop-primary-nav"
          className="hidden lg:flex items-center justify-center gap-1.5 xl:gap-3"
          aria-label="Primary Navigation"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`min-h-[40px] inline-flex items-center justify-center px-3.5 xl:px-4 py-2 rounded-full text-[15px] xl:text-[16px] leading-none transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#43C7D1] ${
                  isActive
                    ? 'bg-[#13B8B0]/20 text-[#5CE2EA] border border-[#13B8B0]/50 font-semibold shadow-[0_0_16px_rgba(19,184,176,0.18)]'
                    : 'border border-transparent text-[#E5F0F4] hover:text-[#5CE2EA] hover:bg-[#123B50]/55 font-medium'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Language Switch (Aligned & Consistent) */}
        <div className="hidden lg:flex items-center shrink-0">
          <button
            type="button"
            data-testid="desktop-lang-toggle"
            onClick={toggleLanguage}
            className="min-h-[40px] inline-flex items-center px-4 py-1.5 rounded-full border border-[#13B8B0]/55 bg-[#072233]/90 hover:border-[#43C7D1] text-[14px] font-medium text-[#E5F0F4] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#43C7D1]"
          >
            <span
              className={
                language === 'ar'
                  ? 'text-[#5CE2EA] font-semibold'
                  : 'text-[#A9C0CC]'
              }
            >
              عربي
            </span>
            <span className="mx-2 text-[#43C7D1]/50" aria-hidden="true">
              |
            </span>
            <span
              className={
                language === 'en'
                  ? 'text-[#5CE2EA] font-semibold'
                  : 'text-[#A9C0CC]'
              }
            >
              EN
            </span>
          </button>
        </div>

        {/* Mobile & Tablet Controls (< 1024px) */}
        <div className="flex lg:hidden items-center gap-2.5 shrink-0">
          <button
            type="button"
            data-testid="mobile-lang-toggle"
            onClick={toggleLanguage}
            className="min-h-[40px] inline-flex items-center px-3.5 py-1.5 rounded-full border border-[#13B8B0]/55 bg-[#072233] text-[13px] font-medium text-[#E5F0F4] whitespace-nowrap shrink-0"
          >
            <span className={language === 'ar' ? 'text-[#5CE2EA] font-semibold' : 'text-[#A9C0CC]'}>
              عربي
            </span>
            <span className="mx-1.5 text-[#43C7D1]/50" aria-hidden="true">
              |
            </span>
            <span className={language === 'en' ? 'text-[#5CE2EA] font-semibold' : 'text-[#A9C0CC]'}>
              EN
            </span>
          </button>

          <button
            type="button"
            data-testid="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="min-h-[40px] min-w-[40px] p-2 text-[#F3F7F8] hover:bg-[#123B50] rounded-xl border border-[#285064] flex items-center justify-center cursor-pointer"
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          data-testid="mobile-nav-drawer"
          className="lg:hidden bg-[#072233] border-b border-[#285064] px-4 pt-2 pb-4 space-y-1.5"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full min-h-[46px] text-start px-4 py-2.5 rounded-xl text-[15px] transition-colors flex items-center justify-between border cursor-pointer ${
                  isActive
                    ? 'bg-[#13B8B0]/20 text-[#5CE2EA] border-[#13B8B0]/50 font-semibold'
                    : 'border-transparent text-[#E5F0F4] hover:bg-[#123B50] font-medium'
                }`}
              >
                <span className="inline-flex items-center gap-2.5">
                  <IconComponent
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#5CE2EA]' : 'text-[#13B8B0]'
                    }`}
                  />
                  <span>{item.label}</span>
                </span>
                <ArrowRight
                  className={`w-4 h-4 rtl:rotate-180 ${
                    isActive ? 'text-[#5CE2EA]' : 'text-[#A9C0CC]'
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
