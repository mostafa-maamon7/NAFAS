import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  AgeCategory,
  Language,
  LearningCategoryId,
  NavSection,
} from '../types/nafas';
import { UI_TRANSLATIONS } from '../data/translations';
import { clinicalAudio } from '../utils/clinicalAudio';
import { nafasAudio } from '../utils/nafasAudio';

const PREFS_STORAGE_KEY = 'nafas_user_prefs_v1';

const LEGACY_ARTICLE_TO_GUIDE: Record<string, string> = {
  'recognizing-mild-vs-severe-obstruction': 'mild-or-severe',
  'adult-choking-protocol': 'adults-and-children',
  'child-choking-protocol': 'adults-and-children',
  'infant-choking-protocol': 'infants-care',
  'unresponsive-transition-and-cpr': 'when-person-goes-limp',
  'common-choking-first-aid-mistakes': 'mistakes-to-avoid',
  'special-situations': 'special-situations',
};

interface UserPrefs {
  language: Language;
  soundEnabled: boolean;
  reducedMotion: boolean;
  challengeMode: boolean;
}

interface NafasContextValue {
  language: Language;
  isRtl: boolean;
  t: (typeof UI_TRANSLATIONS)[Language];
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  activeSection: NavSection;
  navigateTo: (section: NavSection) => void;
  selectedArticleId: string | null;
  openArticle: (articleId: string) => void;
  closeArticle: () => void;
  learningCategoryFilter: LearningCategoryId | 'all';
  setLearningCategoryFilter: (cat: LearningCategoryId | 'all') => void;
  learningAgeFilter: AgeCategory | 'all';
  setLearningAgeFilter: (age: AgeCategory | 'all') => void;
  openLearningWithAge: (age: AgeCategory) => void;
  // Story Level Simulation navigation & state
  activeLevelId: string | null;
  simulationCampaignFilter: AgeCategory | 'all';
  setSimulationCampaignFilter: (campaign: AgeCategory | 'all') => void;
  startLevel: (levelId: string) => void;
  openCampaignMap: (campaign: AgeCategory | 'all') => void;
  exitLevelToMap: () => void;
  activeSimulationAge: AgeCategory | null;
  startSimulationTrack: (age: AgeCategory) => void;
  exitSimulationToLobby: () => void;
  // Smart Learning "Coming Soon" modal state (reachable from homepage card & /smart-learning route)
  smartLearningComingSoonOpen: boolean;
  openSmartLearningComingSoon: () => void;
  closeSmartLearningComingSoon: () => void;
  // Accessibility & Gameplay Preferences
  soundEnabled: boolean;
  toggleSound: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  challengeMode: boolean;
  toggleChallengeMode: () => void;
}

const NafasContext = createContext<NafasContextValue | undefined>(undefined);

export const NafasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const initialPrefs = useMemo<UserPrefs>(() => {
    const sysReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      const raw = window.localStorage.getItem(PREFS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          language: parsed.language === 'ar' ? 'ar' : 'en',
          soundEnabled: Boolean(parsed.soundEnabled),
          reducedMotion:
            typeof parsed.reducedMotion === 'boolean'
              ? parsed.reducedMotion
              : sysReduced,
          challengeMode: Boolean(parsed.challengeMode),
        };
      }
    } catch {
      // Ignore storage errors
    }
    return {
      language: 'ar',
      soundEnabled: false,
      reducedMotion: sysReduced,
      challengeMode: false,
    };
  }, []);

  const [language, setLanguageState] = useState<Language>(initialPrefs.language);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(
    initialPrefs.soundEnabled
  );
  const [reducedMotion, setReducedMotion] = useState<boolean>(
    initialPrefs.reducedMotion
  );
  const [challengeMode, setChallengeMode] = useState<boolean>(
    initialPrefs.challengeMode
  );

  const initialUrlLevel = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('level');
  }, []);

  const initialSmartLearningOpen = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    return (
      path === '/smart-learning' ||
      params.get('section') === 'smart-learning' ||
      window.location.hash === '#smart-learning'
    );
  }, []);

  const [activeSection, setActiveSection] = useState<NavSection>(
    initialUrlLevel ? 'simulation' : 'home'
  );
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [learningCategoryFilter, setLearningCategoryFilter] = useState<
    LearningCategoryId | 'all'
  >('all');
  const [learningAgeFilter, setLearningAgeFilter] = useState<AgeCategory | 'all'>(
    'all'
  );
  const [activeLevelId, setActiveLevelId] = useState<string | null>(
    initialUrlLevel
  );
  const [simulationCampaignFilter, setSimulationCampaignFilter] = useState<
    AgeCategory | 'all'
  >('all');
  const [smartLearningComingSoonOpen, setSmartLearningComingSoonOpen] =
    useState<boolean>(initialSmartLearningOpen);

  // Redirect any old /results URL to the homepage (/) and clean up legacy localStorage keys
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (
        path === '/results' ||
        path.startsWith('/results/') ||
        params.get('section') === 'results' ||
        window.location.hash === '#results'
      ) {
        window.history.replaceState(null, '', '/');
        setActiveSection('home');
      }
    }
    try {
      window.localStorage.removeItem('nafas_level_progress_v2');
      window.localStorage.removeItem('nafas_level_progress_v1');
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language]);

  useEffect(() => {
    clinicalAudio.muted = !soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  useEffect(() => {
    try {
      const prefs: UserPrefs = {
        language,
        soundEnabled,
        reducedMotion,
        challengeMode,
      };
      window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage errors
    }
  }, [language, soundEnabled, reducedMotion, challengeMode]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      clinicalAudio.muted = !next;
      if (next) {
        clinicalAudio.playInspectPing();
      }
      return next;
    });
  };

  const toggleReducedMotion = () => {
    setReducedMotion((prev) => !prev);
  };

  const toggleChallengeMode = () => {
    setChallengeMode((prev) => !prev);
  };

  const navigateTo = (section: NavSection) => {
    setSmartLearningComingSoonOpen(false);
    setActiveSection(section);
    nafasAudio.leaveLevel();
    if (section === 'simulation') {
      setActiveLevelId(null);
    }
    if (section !== 'learning') {
      setSelectedArticleId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSmartLearningComingSoon = () => {
    setSmartLearningComingSoonOpen(true);
  };

  const closeSmartLearningComingSoon = () => {
    setSmartLearningComingSoonOpen(false);
    if (
      typeof window !== 'undefined' &&
      window.location.pathname.toLowerCase() === '/smart-learning'
    ) {
      window.history.replaceState(null, '', '/');
    }
  };

  const openArticle = (articleId: string) => {
    nafasAudio.leaveLevel();
    setActiveLevelId(null);
    setSelectedArticleId(LEGACY_ARTICLE_TO_GUIDE[articleId] || articleId);
    setActiveSection('learning');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeArticle = () => {
    setSelectedArticleId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLearningWithAge = (age: AgeCategory) => {
    nafasAudio.leaveLevel();
    setSelectedArticleId(null);
    setLearningAgeFilter(age);
    const ageCategoryMap: Record<AgeCategory, LearningCategoryId> = {
      adult: 'adult-education',
      child: 'child-education',
      infant: 'infant-education',
    };
    setLearningCategoryFilter(ageCategoryMap[age]);
    setActiveSection('learning');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startLevel = (levelId: string) => {
    // User click counts as audio unlock gesture — fade in calm music + location ambience automatically
    nafasAudio.enterLevel(levelId);
    setActiveLevelId(levelId);
    setActiveSection('simulation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCampaignMap = (campaign: AgeCategory | 'all') => {
    nafasAudio.leaveLevel();
    setActiveLevelId(null);
    setSimulationCampaignFilter(campaign);
    setActiveSection('simulation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exitLevelToMap = () => {
    nafasAudio.leaveLevel();
    setActiveLevelId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startSimulationTrack = (age: AgeCategory) => {
    openCampaignMap(age);
  };

  const exitSimulationToLobby = () => {
    exitLevelToMap();
  };

  return (
    <NafasContext.Provider
      value={{
        language,
        isRtl: language === 'ar',
        t: UI_TRANSLATIONS[language],
        toggleLanguage,
        setLanguage,
        activeSection,
        navigateTo,
        selectedArticleId,
        openArticle,
        closeArticle,
        learningCategoryFilter,
        setLearningCategoryFilter,
        learningAgeFilter,
        setLearningAgeFilter,
        openLearningWithAge,
        activeLevelId,
        simulationCampaignFilter,
        setSimulationCampaignFilter,
        startLevel,
        openCampaignMap,
        exitLevelToMap,
        activeSimulationAge:
          simulationCampaignFilter === 'all' ? null : simulationCampaignFilter,
        startSimulationTrack,
        exitSimulationToLobby,
        smartLearningComingSoonOpen,
        openSmartLearningComingSoon,
        closeSmartLearningComingSoon,
        soundEnabled,
        toggleSound,
        reducedMotion,
        toggleReducedMotion,
        challengeMode,
        toggleChallengeMode,
      }}
    >
      {children}
    </NafasContext.Provider>
  );
};

export const useNafas = (): NafasContextValue => {
  const ctx = useContext(NafasContext);
  if (!ctx) {
    throw new Error('useNafas must be used within a NafasProvider');
  }
  return ctx;
};
