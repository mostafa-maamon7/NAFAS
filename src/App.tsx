import React from 'react';
import { BrainCircuit, Play, BookOpen, X } from 'lucide-react';
import { NafasProvider, useNafas } from './context/NafasContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { LearningHubView } from './views/LearningHubView';
import { SimulationCenterView } from './views/SimulationCenterView';
import { AiAssistantView } from './views/AiAssistantView';
import { QAPage } from './pages/QAPage';
import { QAHotspotsPage } from './pages/QAHotspotsPage';
import { QAAudioPage } from './pages/QAAudioPage';
import { CreditsPage } from './pages/CreditsPage';

const SmartLearningComingSoonDialog: React.FC = () => {
  const {
    language,
    smartLearningComingSoonOpen,
    closeSmartLearningComingSoon,
    navigateTo,
  } = useNafas();

  if (!smartLearningComingSoonOpen) return null;

  const isAr = language === 'ar';

  return (
    <div
      data-testid="smart-learning-coming-soon-modal"
      className="fixed inset-0 z-50 bg-[#071F2E]/85 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="smart-learning-coming-soon-title"
    >
      <div className="bg-[#0B2D40] border-2 border-[#13B8B0] rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-[0_12px_48px_rgba(3,12,20,0.85)] relative">
        <button
          type="button"
          onClick={closeSmartLearningComingSoon}
          className="absolute top-4 end-4 p-2 rounded-xl bg-[#123B50] hover:bg-[#19465B] text-[#A9C0CC] hover:text-[#F3F7F8] cursor-pointer transition-colors"
          aria-label={isAr ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#071F2E] border border-[#13B8B0]/60 flex items-center justify-center text-[#13B8B0] shrink-0 shadow-[0_0_20px_rgba(19,184,176,0.25)]">
            <BrainCircuit className="w-7 h-7" />
          </div>
          <div>
            <span className="inline-block px-3 py-0.5 rounded-full bg-[#E9A23B] text-[#071F2E] text-xs font-extrabold mb-1">
              {isAr ? 'قريبًا' : 'Coming soon'}
            </span>
            <h2
              id="smart-learning-coming-soon-title"
              className="text-xl sm:text-2xl font-extrabold text-[#F3F7F8]"
            >
              {isAr ? 'التعلم الذكي' : 'Smart Learning'}
            </h2>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#A9C0CC] leading-relaxed">
          {isAr
            ? 'ميزة التعلم الذكي ليست جاهزة بعد. نحن نعمل على بنائها وستكون متاحة قريبًا لتقديم مسارات تدريبية مخصصة لاحتياجاتك.'
            : "Smart learning isn't ready yet. We're building it and it will be available soon."}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              closeSmartLearningComingSoon();
              navigateTo('simulation');
            }}
            className="w-full sm:flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] font-extrabold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              {isAr ? 'العودة إلى المحاكاة' : 'Back to Simulation'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              closeSmartLearningComingSoon();
              navigateTo('learning');
            }}
            className="w-full sm:flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-[#123B50] hover:bg-[#19465B] text-[#F3F7F8] border border-[#13B8B0]/60 font-extrabold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#43C7D1]" />
            <span>{isAr ? 'صفحة التعلّم' : 'Go to Learn Page'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const NafasShell: React.FC = () => {
  const { activeSection } = useNafas();
  const path = window.location.pathname.toLowerCase();

  if (path === '/qa/hotspots') {
    return <QAHotspotsPage />;
  }

  if (path === '/qa/audio') {
    return <QAAudioPage />;
  }

  if (path === '/qa') {
    return <QAPage />;
  }

  if (path === '/credits') {
    return <CreditsPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#071F2E] text-[#F3F7F8]">
      <Navbar />
      <main className="flex-1">
        {activeSection === 'home' && <HomeView />}
        {activeSection === 'about' && <AboutView />}
        {activeSection === 'learning' && <LearningHubView />}
        {activeSection === 'simulation' && <SimulationCenterView />}
        {activeSection === 'ai-assistant' && <AiAssistantView />}
      </main>
      <SmartLearningComingSoonDialog />
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <NafasProvider>
      <NafasShell />
    </NafasProvider>
  );
}
