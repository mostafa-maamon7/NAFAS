import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  Bug,
  CheckCircle2,
  Compass,
  Eye,
  Film,
  HelpCircle,
  Info,
  Music,
  Pause,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Subtitles,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
import {
  LevelPlayPhase,
  StoryLevel,
  StoryLevelChoice,
} from '../types/nafas';
import { useNafas } from '../context/NafasContext';
import { STORY_LEVELS } from '../data/storyLevels';
import { resolveStoryMedia } from '../data/storyMedia';
import { getManifestEntry } from '../data/imageManifest';
import {
  CalibratedHotspot,
  getHandTargetsForImage,
  getLookHotspotsForImage,
} from '../data/hotspotCalibration';
import {
  AudioCaptionEvent,
  CueFireEvent,
  NafasAudioState,
  nafasAudio,
} from '../utils/nafasAudio';
import { SharedSceneCanvas } from './SharedSceneCanvas';
import { imagePreloader } from '../utils/imagePreloader';

interface CinematicStoryPlayerProps {
  level: StoryLevel;
}

type InteractiveRescueStage =
  | 'idle'
  | 'ems_activated'
  | 'place_hands_back'
  | 'rhythm_back_blows'
  | 'reassess_mid'
  | 'place_hands_front'
  | 'rhythm_front_thrusts'
  | 'unresponsive_order'
  | 'mild_observe'
  | 'completed';

type RhythmTimingQuality = 'idle' | 'good' | 'steady' | 'slow';

export const CinematicStoryPlayer: React.FC<CinematicStoryPlayerProps> = ({
  level,
}) => {
  const {
    language,
    exitLevelToMap,
    startLevel,
  } = useNafas();
  const isAr = language === 'ar';

  // Parse URL query parameters (?debug=hotspots, ?testStep=..., ?kenBurns=on|off)
  const urlParams = useMemo(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const initialDebugMode = urlParams.get('debug') === 'hotspots';
  const cueOverlayEnabled = urlParams.get('cueOverlay') === '1';
  const urlTestStep = urlParams.get('testStep');
  const urlKenBurns = urlParams.get('kenBurns');

  const [debugHotspots, setDebugHotspots] = useState<boolean>(initialDebugMode);
  const [recentCues, setRecentCues] = useState<CueFireEvent[]>([]);

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Entry & Settings States
  const [entryStep, setEntryStep] = useState<'title_card' | 'mini_intro' | 'playing'>(
    urlTestStep ? 'playing' : 'title_card'
  );
  const [miniIntroSlide, setMiniIntroSlide] = useState<0 | 1 | 2>(0);
  const [showSoundPanel, setShowSoundPanel] = useState(
    urlParams.get('soundPanel') === 'open'
  );
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [audioState, setAudioState] = useState<NafasAudioState>(() =>
    nafasAudio.getState()
  );
  const [latestSoundCaption, setLatestSoundCaption] = useState<AudioCaptionEvent | null>(null);

  // Optional Challenge Timer (off by default, pausable)
  const [challengeTimerEnabled, setChallengeTimerEnabled] = useState(false);
  const [challengeTimeLeft, setChallengeTimeLeft] = useState(20);
  const [challengeTimerPaused, setChallengeTimerPaused] = useState(false);

  // 4-Step Flow: Watch (story_intro) -> Look (assess_signs) -> Decide (decision_crisis) -> See the result (final_debrief)
  const [phase, setPhase] = useState<LevelPlayPhase>('story_intro');
  const [introBeatIdx, setIntroBeatIdx] = useState(0);
  const [typedText, setTypedText] = useState('');

  // Step 2: Look (on S5)
  const [inspectedHotspots, setInspectedHotspots] = useState<string[]>([]);
  const [highlightedHotspotId, setHighlightedHotspotId] = useState<string | null>(null);

  // Step 3: Decide
  const [attemptSeed, setAttemptSeed] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<StoryLevelChoice | null>(null);
  const [mistakesMade, setMistakesMade] = useState(0);

  // Step 4: See the Result (Animated sequence BEFORE verdict)
  const [outcomeFrameIdx, setOutcomeFrameIdx] = useState(0);
  const [sequenceComplete, setSequenceComplete] = useState(false);
  const [isAnnotatedReplay, setIsAnnotatedReplay] = useState(false);

  // Interactive "Do it yourself" state (for severe, unresponsive, and mild levels)
  const [rescueStage, setRescueStage] = useState<InteractiveRescueStage>('idle');
  const [blowCount, setBlowCount] = useState(0);
  const [thrustCount, setThrustCount] = useState(0);
  const [rhythmQuality, setRhythmQuality] = useState<RhythmTimingQuality>('idle');
  const [punchPulse, setPunchPulse] = useState(false);
  const [reassessChecked, setReassessChecked] = useState(false);
  const [earnedPracticeBadge, setEarnedPracticeBadge] = useState(false);
  const [autoPerforming, setAutoPerforming] = useState(false);
  const [autoAnimateHand, setAutoAnimateHand] = useState(false);
  const [unresponsiveStepIdx, setUnresponsiveStepIdx] = useState(0);
  const [unresponsiveNudge, setUnresponsiveNudge] = useState<string | null>(null);
  const [mildStepStage, setMildStepStage] = useState<'ask' | 'encourage' | 'watch'>('ask');
  const [mildObserveProgress, setMildObserveProgress] = useState(0);

  // Tweened HUD numbers & post-result animations
  const [displayedSpO2, setDisplayedSpO2] = useState(level.sceneVisual.spO2Start);
  const [displayedStars, setDisplayedStars] = useState(0);
  const [displayedXp, setDisplayedXp] = useState(0);

  // Atomic image/caption sync state (never advance caption until incoming image is decoded)
  const [isLoadingNextImage, setIsLoadingNextImage] = useState(false);
  const [captionRevealKey, setCaptionRevealKey] = useState(0);
  const transitionTokenRef = useRef(0);
  const pendingWatchIdxRef = useRef<number | null>(null);

  const activeTimeoutsRef = useRef<Set<number>>(new Set());
  const activeIntervalsRef = useRef<Set<number>>(new Set());
  const lastRhythmTapRef = useRef<number>(0);

  // Subscribe to audio engine state, subtle sound captions & live QA cue events
  useEffect(() => {
    const unsubState = nafasAudio.subscribeState(setAudioState);
    const unsubCaptions = nafasAudio.subscribeCaptions((evt) => {
      setLatestSoundCaption(evt);
    });
    const unsubCues = nafasAudio.subscribeCues((evt) => {
      setRecentCues((prev) => [evt, ...prev].slice(0, 8));
    });
    return () => {
      unsubState();
      unsubCaptions();
      unsubCues();
    };
  }, []);

  // Preload Beat 1 (S1) with fetchPriority="high" and sequentially decode remaining beats in background
  useEffect(() => {
    imagePreloader.preloadLevelSequence(level);
  }, [level]);

  // Lookahead preload: keep next 2 beats decoded during Watch, and prioritize all outcomes on Look/Decide
  useEffect(() => {
    if (phase === 'story_intro') {
      imagePreloader.preloadLookaheadBeats(level, introBeatIdx);
    } else if (phase === 'assess_signs' || phase === 'decision_crisis') {
      imagePreloader.preloadOutcomesHighPriority(level);
    }
  }, [level, phase, introBeatIdx]);

  // Helper to extract canonical manifest ID (e.g. A2_S1, A2_OA2) from resolved media src
  const extractImageId = useCallback(
    (src: string): string => {
      const cleanSrc = src.split('?')[0];
      const match = cleanSrc.match(/\/([A-Za-z0-9_]+)\.(webp|png|jpg|jpeg)$/i);
      return match ? match[1] : `${level.id}_S5`;
    },
    [level.id]
  );

  // Atomic transition gate: holds current image AND current caption until incoming image is decoded
  const commitSceneTransition = useCallback(
    (targetMediaKey: string | undefined, applyAtomicState: () => void) => {
      const targetAsset = resolveStoryMedia(targetMediaKey);
      const targetSrc = targetAsset.src;
      const targetImageId = extractImageId(targetSrc);
      const tapTimestampMs = performance.now();
      const token = ++transitionTokenRef.current;

      if (imagePreloader.isDecoded(targetSrc)) {
        pendingWatchIdxRef.current = null;
        setIsLoadingNextImage(false);
        applyAtomicState();
        setCaptionRevealKey((k) => k + 1);
        const commitTimestampMs = performance.now();
        imagePreloader.recordBeatSyncMetric({
          levelId: level.id,
          targetImageId,
          src: targetSrc,
          wasCacheWarm: true,
          tapTimestampMs,
          commitTimestampMs,
          latencyMs: Number((commitTimestampMs - tapTimestampMs).toFixed(2)),
        });
        return;
      }

      // Incoming image not decoded yet: keep current image + caption steady and show thin progress line
      setIsLoadingNextImage(true);
      imagePreloader.preloadAndDecode(targetSrc, 'high').then(() => {
        if (token !== transitionTokenRef.current) return;
        pendingWatchIdxRef.current = null;
        setIsLoadingNextImage(false);
        applyAtomicState();
        setCaptionRevealKey((k) => k + 1);
        const commitTimestampMs = performance.now();
        imagePreloader.recordBeatSyncMetric({
          levelId: level.id,
          targetImageId,
          src: targetSrc,
          wasCacheWarm: false,
          tapTimestampMs,
          commitTimestampMs,
          latencyMs: Number((commitTimestampMs - tapTimestampMs).toFixed(2)),
        });
      });
    },
    [extractImageId, level.id]
  );

  const scheduleTimeout = useCallback((fn: () => void, ms: number): number => {
    const id = window.setTimeout(() => {
      activeTimeoutsRef.current.delete(id);
      fn();
    }, ms);
    activeTimeoutsRef.current.add(id);
    return id;
  }, []);

  const scheduleInterval = useCallback((fn: () => void, ms: number): number => {
    const id = window.setInterval(fn, ms);
    activeIntervalsRef.current.add(id);
    return id;
  }, []);

  const clearAutoTimers = useCallback(() => {
    activeTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
    activeTimeoutsRef.current.clear();
    activeIntervalsRef.current.forEach((id) => window.clearInterval(id));
    activeIntervalsRef.current.clear();
  }, []);

  // Calibrated Look rings for the current S5 image
  const lookHotspots: CalibratedHotspot[] = useMemo(() => {
    return getLookHotspotsForImage(`${level.id}_S5`, level.sceneVisual.hotspots);
  }, [level.id, level.sceneVisual.hotspots]);

  // Calibrated Hand targets for the current OA2 composite image (Left panel = back blows, Right panel = belly/chest thrusts)
  const oa2HandTargets: CalibratedHotspot[] = useMemo(() => {
    return getHandTargetsForImage(`${level.id}_OA2`);
  }, [level.id]);

  // Reset on level change (or jump directly to testStep if URL query requests it)
  useEffect(() => {
    clearAutoTimers();
    nafasAudio.stopHeartbeat();
    nafasAudio.enterLevel(level.id);

    const opt = level.decisionNode.choices.find((c) => c.outcome === 'optimal') || null;
    const wrong = level.decisionNode.choices.find((c) => c.outcome !== 'optimal') || null;

    if (urlTestStep === 'look') {
      setEntryStep('playing');
      setPhase('assess_signs');
      setIntroBeatIdx(level.storyBeats.length - 1);
      const firstTwo = lookHotspots.slice(0, 2).map((h) => h.id);
      setInspectedHotspots(firstTwo);
      setHighlightedHotspotId(lookHotspots[0]?.id ?? null);
      return;
    }

    if (urlTestStep === 'oa2_left' || urlTestStep === 'oa2_right') {
      setEntryStep('playing');
      setPhase('final_debrief');
      setSelectedChoice(opt);
      setSequenceComplete(false);
      setOutcomeFrameIdx(1);
      setRescueStage(urlTestStep === 'oa2_left' ? 'place_hands_back' : 'place_hands_front');
      return;
    }

    if (urlTestStep === 'rhythm') {
      setEntryStep('playing');
      setPhase('final_debrief');
      setSelectedChoice(opt);
      setSequenceComplete(false);
      setOutcomeFrameIdx(1);
      setRescueStage('rhythm_back_blows');
      setBlowCount(2);
      setRhythmQuality('good');
      return;
    }

    if (urlTestStep === 'unresponsive') {
      setEntryStep('playing');
      setPhase('final_debrief');
      setSelectedChoice(opt);
      setSequenceComplete(false);
      setOutcomeFrameIdx(0);
      setRescueStage('unresponsive_order');
      setUnresponsiveStepIdx(1);
      return;
    }

    if (urlTestStep === 'mild_watch') {
      setEntryStep('playing');
      setPhase('final_debrief');
      setSelectedChoice(opt);
      setSequenceComplete(false);
      setOutcomeFrameIdx(1);
      setRescueStage('mild_observe');
      setMildStepStage(level.id === 'A1' ? 'encourage' : 'watch');
      setMildObserveProgress(40);
      return;
    }

    if (urlTestStep === 'result_correct') {
      setEntryStep('playing');
      setPhase('final_debrief');
      setSelectedChoice(opt);
      setSequenceComplete(true);
      setOutcomeFrameIdx(2);
      setRescueStage('completed');
      setDisplayedStars(3);
      setDisplayedXp(120);
      setEarnedPracticeBadge(true);
      return;
    }

    if (urlTestStep === 'result_wrong') {
      setEntryStep('playing');
      setPhase('final_debrief');
      setSelectedChoice(wrong);
      setSequenceComplete(true);
      setOutcomeFrameIdx(0);
      setRescueStage('completed');
      setDisplayedStars(0);
      setDisplayedXp(0);
      return;
    }

    setEntryStep('title_card');
    setPhase('story_intro');
    setIntroBeatIdx(0);
    setOutcomeFrameIdx(0);
    setInspectedHotspots([]);
    setHighlightedHotspotId(null);
    setSelectedChoice(null);
    setMistakesMade(0);
    setSequenceComplete(false);
    setIsAnnotatedReplay(false);
    setRescueStage('idle');
    setBlowCount(0);
    setThrustCount(0);
    setRhythmQuality('idle');
    setPunchPulse(false);
    setReassessChecked(false);
    setEarnedPracticeBadge(false);
    setAutoPerforming(false);
    setAutoAnimateHand(false);
    setUnresponsiveStepIdx(0);
    setUnresponsiveNudge(null);
    setMildStepStage(level.id === 'A1' ? 'ask' : 'encourage');
    setMildObserveProgress(0);
    setDisplayedSpO2(level.storyBeats[0]?.spO2 ?? level.sceneVisual.spO2Start);
    setDisplayedStars(0);
    setDisplayedXp(0);
    setShowMoreMenu(false);
  }, [
    level.id,
    level.sceneVisual.spO2Start,
    level.storyBeats,
    level.decisionNode.choices,
    lookHotspots,
    clearAutoTimers,
    urlTestStep,
  ]);

  // Cleanup audio on unmount (ensure no music plays on homepage or learn pages)
  useEffect(() => {
    return () => {
      clearAutoTimers();
      nafasAudio.leaveLevel();
    };
  }, [clearAutoTimers]);

  const handleFullReplayLevel = useCallback(() => {
    clearAutoTimers();
    nafasAudio.playPageTurn();
    nafasAudio.enterLevel(level.id);
    nafasAudio.setMusicMood('calm');
    setPhase('story_intro');
    setIntroBeatIdx(0);
    setOutcomeFrameIdx(0);
    setInspectedHotspots([]);
    setHighlightedHotspotId(null);
    setSelectedChoice(null);
    setMistakesMade(0);
    setSequenceComplete(false);
    setIsAnnotatedReplay(false);
    setRescueStage('idle');
    setBlowCount(0);
    setThrustCount(0);
    setRhythmQuality('idle');
    setPunchPulse(false);
    setReassessChecked(false);
    setEarnedPracticeBadge(false);
    setAutoPerforming(false);
    setAutoAnimateHand(false);
    setUnresponsiveStepIdx(0);
    setUnresponsiveNudge(null);
    setMildStepStage(level.id === 'A1' ? 'ask' : 'encourage');
    setMildObserveProgress(0);
    setAttemptSeed((prev) => prev + 1);
    setDisplayedSpO2(level.storyBeats[0]?.spO2 ?? 98);
    setDisplayedStars(0);
    setDisplayedXp(0);
    setShowMoreMenu(false);
  }, [clearAutoTimers, level.id, level.storyBeats]);

  const nextLevel = useMemo(() => {
    const idx = STORY_LEVELS.findIndex((l) => l.id === level.id);
    if (idx >= 0 && idx < STORY_LEVELS.length - 1) {
      return STORY_LEVELS[idx + 1];
    }
    return null;
  }, [level.id]);

  // Seamlessly prefetch next level opening images & audio as soon as the user finishes the current level
  useEffect(() => {
    if (!sequenceComplete || !nextLevel) return;
    if (imagePreloader.shouldConserveBandwidth()) return;
    imagePreloader.warmLevelOnHover(nextLevel);
    nafasAudio.prefetchLevelAudio(nextLevel.id);
  }, [sequenceComplete, nextLevel]);

  // Current story beat (S1-S5)
  const currentBeat = useMemo(() => {
    const beats = level.storyBeats;
    const safeIdx = Math.min(Math.max(0, introBeatIdx), beats.length - 1);
    return beats[safeIdx];
  }, [level.storyBeats, introBeatIdx]);

  // Active outcome frame during Step 4 (See the Result)
  const activeOutcomePlaybackFrame = useMemo(() => {
    if (
      phase === 'final_debrief' &&
      selectedChoice?.consequenceBeat.playbackFrames &&
      selectedChoice.consequenceBeat.playbackFrames.length > 0
    ) {
      const frames = selectedChoice.consequenceBeat.playbackFrames;
      return frames[Math.min(outcomeFrameIdx, frames.length - 1)];
    }
    return null;
  }, [phase, selectedChoice, outcomeFrameIdx]);

  // Active media asset from manifest
  const activeMediaAsset = useMemo(() => {
    if (phase === 'final_debrief' && selectedChoice) {
      if (activeOutcomePlaybackFrame) {
        return resolveStoryMedia(activeOutcomePlaybackFrame.mediaKey);
      }
      return resolveStoryMedia(selectedChoice.consequenceBeat.mediaKey);
    }
    if (phase === 'assess_signs' || phase === 'decision_crisis') {
      const s5Beat = level.storyBeats[level.storyBeats.length - 1];
      return resolveStoryMedia(s5Beat?.mediaKey);
    }
    return resolveStoryMedia(currentBeat?.mediaKey);
  }, [phase, selectedChoice, activeOutcomePlaybackFrame, level.storyBeats, currentBeat]);

  // Extract canonical imageId (e.g., "A2_S5", "A2_OA2") from activeMediaAsset.src
  const activeImageId = useMemo(() => {
    return extractImageId(activeMediaAsset.src);
  }, [activeMediaAsset.src, extractImageId]);

  const activeHandTarget: CalibratedHotspot | null = useMemo(() => {
    if (phase !== 'final_debrief' || sequenceComplete) return null;
    if (rescueStage === 'place_hands_back') {
      return oa2HandTargets.find((t) => t.panel === 'left') ?? oa2HandTargets[0] ?? null;
    }
    if (rescueStage === 'place_hands_front') {
      return oa2HandTargets.find((t) => t.panel === 'right') ?? oa2HandTargets[1] ?? null;
    }
    return null;
  }, [phase, sequenceComplete, rescueStage, oa2HandTargets]);

  // Active caption text (max 2 lines)
  const activeCaptionText = useMemo(() => {
    if (phase === 'final_debrief' && selectedChoice) {
      if (activeOutcomePlaybackFrame) {
        return activeOutcomePlaybackFrame.caption[language];
      }
      return selectedChoice.consequenceBeat.narrative[language];
    }
    if (phase === 'assess_signs' || phase === 'decision_crisis') {
      const s5Beat = level.storyBeats[level.storyBeats.length - 1];
      return s5Beat ? s5Beat.text[language] : '';
    }
    return currentBeat ? currentBeat.text[language] : '';
  }, [phase, selectedChoice, activeOutcomePlaybackFrame, level.storyBeats, currentBeat, language]);

  // Instant synced caption reveal (never swallows clicks or lags behind scene image transitions)
  useEffect(() => {
    if (entryStep !== 'playing') return;
    setTypedText(activeCaptionText);
  }, [activeCaptionText, captionRevealKey, phase, entryStep]);

  // Speak caption if Voice-Over hook is enabled
  useEffect(() => {
    if (entryStep === 'playing' && activeCaptionText) {
      nafasAudio.speakText(activeCaptionText, language);
    }
  }, [activeCaptionText, entryStep, language]);

  // Target Oxygen (SpO2) value for smooth tabular number tweening
  const targetSpO2: number = useMemo(() => {
    if (phase === 'final_debrief' && selectedChoice) {
      if (
        activeOutcomePlaybackFrame &&
        typeof activeOutcomePlaybackFrame.spO2 === 'number'
      ) {
        return activeOutcomePlaybackFrame.spO2;
      }
      return Math.max(
        68,
        Math.min(99, level.sceneVisual.spO2Start + selectedChoice.spO2Delta)
      );
    }
    if (phase === 'story_intro') {
      return currentBeat?.spO2 ?? level.sceneVisual.spO2Start;
    }
    return level.storyBeats[level.storyBeats.length - 1]?.spO2 ?? level.sceneVisual.spO2Start;
  }, [phase, selectedChoice, activeOutcomePlaybackFrame, currentBeat, level]);

  // Smooth tween for displayedSpO2 + update audio tension
  useEffect(() => {
    if (entryStep === 'playing') {
      nafasAudio.updateOxygenTension(targetSpO2);
    }
    if (prefersReducedMotion) {
      setDisplayedSpO2(targetSpO2);
      return;
    }
    const interval = window.setInterval(() => {
      setDisplayedSpO2((prev) => {
        if (prev === targetSpO2) {
          window.clearInterval(interval);
          return prev;
        }
        return prev < targetSpO2 ? prev + 1 : prev - 1;
      });
    }, 45);
    return () => window.clearInterval(interval);
  }, [targetSpO2, entryStep, prefersReducedMotion]);

  // Sync per-level audio cue sheet across Watch (S1-S5) -> Look -> Decide -> Outcomes (OA1-OA3 / OB / OC)
  useEffect(() => {
    if (entryStep !== 'playing') return;
    if (phase === 'story_intro') {
      nafasAudio.triggerBeat(level.id, introBeatIdx);
    } else if (phase === 'assess_signs' || phase === 'decision_crisis') {
      nafasAudio.setMusicMood(level.severity === 'mild' ? 'calm' : 'tension');
    } else if (phase === 'final_debrief' && selectedChoice) {
      if (selectedChoice.outcome === 'optimal') {
        const key =
          outcomeFrameIdx === 0 ? 'OA1' : outcomeFrameIdx === 1 ? 'OA2' : 'OA3';
        nafasAudio.triggerOutcome(level.id, key);
      } else {
        const wrongChoices = level.decisionNode.choices.filter(
          (c) => c.outcome !== 'optimal'
        );
        const wrongIdx = wrongChoices.findIndex((c) => c.id === selectedChoice.id);
        nafasAudio.triggerOutcome(level.id, wrongIdx === 1 ? 'OC' : 'OB');
      }
    }
  }, [
    entryStep,
    phase,
    introBeatIdx,
    outcomeFrameIdx,
    level.id,
    level.severity,
    level.decisionNode.choices,
    selectedChoice,
  ]);

  // Shuffled 3 choices for DECIDE
  const shuffledChoices = useMemo(() => {
    const list = [...level.decisionNode.choices];
    const seed = attemptSeed + level.levelNumber;
    for (let i = list.length - 1; i > 0; i--) {
      const j = (seed * (i + 3) + i * 7) % (i + 1);
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [level.decisionNode.choices, attemptSeed, level.levelNumber]);

  // Optional challenge timer in DECIDE
  useEffect(() => {
    if (phase !== 'decision_crisis' || !challengeTimerEnabled || challengeTimerPaused) {
      return;
    }
    const timer = window.setInterval(() => {
      setChallengeTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase, challengeTimerEnabled, challengeTimerPaused]);

  const allSignsInspected = inspectedHotspots.length >= lookHotspots.length;

  // Visible chips in Info Rail (Simplicity Rule: max 3 chips in Info Rail, two-way linked to rings)
  const visibleInspectedHotspots = useMemo(() => {
    const inspectedObjs = lookHotspots.filter((h) =>
      inspectedHotspots.includes(h.id)
    );
    // If more than 3 are inspected, ensure the currently highlighted one is always included in the 3 visible chips
    if (inspectedObjs.length <= 3) return inspectedObjs;
    const lastThree = inspectedObjs.slice(-3);
    if (
      highlightedHotspotId &&
      !lastThree.some((h) => h.id === highlightedHotspotId)
    ) {
      const activeObj = inspectedObjs.find((h) => h.id === highlightedHotspotId);
      if (activeObj) {
        return [activeObj, ...lastThree.slice(0, 2)];
      }
    }
    return lastThree;
  }, [lookHotspots, inspectedHotspots, highlightedHotspotId]);

  // Active hotspot for the Magnifier Tile in the Info Rail
  const activeMagnifierHotspot: CalibratedHotspot | null = useMemo(() => {
    if (phase !== 'assess_signs') return null;
    if (highlightedHotspotId) {
      return lookHotspots.find((h) => h.id === highlightedHotspotId) ?? null;
    }
    if (visibleInspectedHotspots.length > 0) {
      return visibleInspectedHotspots[visibleInspectedHotspots.length - 1];
    }
    return null;
  }, [phase, highlightedHotspotId, lookHotspots, visibleInspectedHotspots]);

  const handleInspectHotspot = useCallback((hs: CalibratedHotspot) => {
    nafasAudio.playRingTick();
    setHighlightedHotspotId(hs.id);
    setInspectedHotspots((prev) =>
      prev.includes(hs.id) ? prev : [...prev, hs.id]
    );
  }, []);

  const handleShowMeNextHotspot = useCallback(() => {
    const nextUninspected = lookHotspots.find(
      (h) => !inspectedHotspots.includes(h.id)
    );
    if (nextUninspected) {
      handleInspectHotspot(nextUninspected);
    }
  }, [lookHotspots, inspectedHotspots, handleInspectHotspot]);

  // Advance WATCH beats (S1 -> S5 -> LOOK) immediately on every tap
  const handleAdvanceWatch = useCallback(() => {
    const baseIdx = pendingWatchIdxRef.current ?? introBeatIdx;
    const nextIdx = baseIdx + 1;
    if (nextIdx < level.storyBeats.length) {
      pendingWatchIdxRef.current = nextIdx;
      const nextBeat = level.storyBeats[nextIdx];
      commitSceneTransition(nextBeat?.mediaKey, () => {
        nafasAudio.playPageTurn();
        setIntroBeatIdx(nextIdx);
      });
    } else {
      pendingWatchIdxRef.current = null;
      const s5Beat = level.storyBeats[level.storyBeats.length - 1];
      commitSceneTransition(s5Beat?.mediaKey, () => {
        nafasAudio.playPageTurn();
        setPhase('assess_signs');
      });
    }
  }, [introBeatIdx, level.storyBeats, commitSceneTransition]);

  // Trigger a short 1.6% scene punch pulse and compute rhythm timing feedback
  const triggerRhythmTapFeedback = useCallback(() => {
    const now = performance.now();
    const delta = lastRhythmTapRef.current > 0 ? now - lastRhythmTapRef.current : 650;
    lastRhythmTapRef.current = now;
    if (delta > 1350) {
      setRhythmQuality('slow');
    } else if (delta >= 260 && delta <= 950) {
      setRhythmQuality('good');
    } else {
      setRhythmQuality('steady');
    }
    setPunchPulse(true);
    scheduleTimeout(() => {
      setPunchPulse(false);
    }, 120);
  }, [scheduleTimeout]);

  // Complete outcome sequence and reveal verdict + stars + XP (max 120 XP = 3 stars * 40)
  const finishOutcomeSequence = useCallback(
    (choice: StoryLevelChoice, currentMistakes: number) => {
      clearAutoTimers();
      setAutoPerforming(false);
      setAutoAnimateHand(false);
      setRescueStage('completed');
      setSequenceComplete(true);

      if (choice.outcome === 'optimal') {
        const earnedStars: 0 | 1 | 2 | 3 =
          currentMistakes === 0 ? 3 : currentMistakes === 1 ? 2 : 1;
        // Max 120 XP for 3 stars (40 XP per star)
        const targetXp = earnedStars * 40;

        // Animate stars & XP cleanly using tracked timers
        for (let s = 1; s <= earnedStars; s++) {
          scheduleTimeout(() => {
            setDisplayedStars(s);
            nafasAudio.playStarPing(s - 1);
          }, s * 160);
        }
        let xpStep = 0;
        const xpTimer = scheduleInterval(() => {
          xpStep += 15;
          if (xpStep >= targetXp) {
            setDisplayedXp(targetXp);
            window.clearInterval(xpTimer);
            activeIntervalsRef.current.delete(xpTimer);
          } else {
            setDisplayedXp(xpStep);
          }
        }, 30);
      } else {
        setDisplayedStars(0);
        setDisplayedXp(0);
      }
    },
    [clearAutoTimers, scheduleTimeout, scheduleInterval]
  );

  // Interactive handlers for severe choking "Do it yourself" on OA2
  const handlePlaceHandsBack = useCallback(() => {
    nafasAudio.playHandPlacement();
    setAutoAnimateHand(false);
    lastRhythmTapRef.current = 0;
    setRhythmQuality('idle');
    setRescueStage('rhythm_back_blows');
  }, []);

  const handleTapBackBlow = () => {
    const next = blowCount + 1;
    setBlowCount(next);
    triggerRhythmTapFeedback();
    nafasAudio.playBackBlow(next);
    if (next >= 5) {
      setReassessChecked(false);
      setRescueStage('reassess_mid');
    }
  };

  const handleCheckDidItComeOut = () => {
    nafasAudio.playRingTick();
    setReassessChecked(true);
  };

  const handleProceedToFrontLandmark = () => {
    nafasAudio.playPageTurn();
    setAutoAnimateHand(false);
    setRescueStage('place_hands_front');
  };

  const handlePlaceHandsFront = useCallback(() => {
    nafasAudio.playHandPlacement();
    setAutoAnimateHand(false);
    lastRhythmTapRef.current = 0;
    setRhythmQuality('idle');
    setRescueStage('rhythm_front_thrusts');
  }, []);

  const handleTapFrontThrust = () => {
    if (!selectedChoice) return;
    const next = thrustCount + 1;
    setThrustCount(next);
    triggerRhythmTapFeedback();
    const isChest = level.id === 'A4' || level.ageGroup === 'infant';
    nafasAudio.playAbdominalThrust(next, isChest);
    if (next >= 5) {
      setEarnedPracticeBadge(true);
      const oa3Key =
        selectedChoice.consequenceBeat.playbackFrames?.[2]?.mediaKey ??
        selectedChoice.consequenceBeat.mediaKey;
      commitSceneTransition(oa3Key, () => {
        setOutcomeFrameIdx(2);
      });
      scheduleTimeout(() => {
        finishOutcomeSequence(selectedChoice, mistakesMade);
      }, 550);
    }
  };

  // Auto-perform ("Do it for me") — animates the hand marker to exact target coordinates first, NEVER lowers stars!
  const handleAutoPerform = useCallback(
    (choiceParam?: StoryLevelChoice) => {
      const activeChoice = choiceParam || selectedChoice;
      if (!activeChoice) return;
      clearAutoTimers();
      setAutoPerforming(true);

      const oa2Key =
        activeChoice.consequenceBeat.playbackFrames?.[1]?.mediaKey ??
        activeChoice.consequenceBeat.mediaKey;
      const oa3Key =
        activeChoice.consequenceBeat.playbackFrames?.[2]?.mediaKey ??
        activeChoice.consequenceBeat.mediaKey;

      if (level.severity === 'severe' && level.patientState === 'conscious') {
        commitSceneTransition(oa2Key, () => {
          setOutcomeFrameIdx(1);
          setRescueStage('place_hands_back');
          setAutoAnimateHand(true);
        });

        scheduleTimeout(() => {
          setAutoAnimateHand(false);
          setRescueStage('rhythm_back_blows');
          let step = 0;
          scheduleInterval(() => {
            step += 1;
            if (step <= 5) {
              setBlowCount(step);
              setRhythmQuality('good');
              triggerRhythmTapFeedback();
              nafasAudio.playBackBlow(step);
            } else if (step === 6) {
              setRescueStage('place_hands_front');
              setAutoAnimateHand(true);
            } else if (step === 8) {
              setAutoAnimateHand(false);
              setRescueStage('rhythm_front_thrusts');
            } else if (step > 8 && step <= 13) {
              const tIdx = step - 8;
              setThrustCount(tIdx);
              setRhythmQuality('good');
              triggerRhythmTapFeedback();
              nafasAudio.playAbdominalThrust(
                tIdx,
                level.id === 'A4' || level.ageGroup === 'infant'
              );
            } else if (step > 13) {
              clearAutoTimers();
              commitSceneTransition(oa3Key, () => {
                setOutcomeFrameIdx(2);
              });
              scheduleTimeout(() => {
                finishOutcomeSequence(activeChoice, mistakesMade);
              }, 550);
            }
          }, 230);
        }, 420);
      } else {
        // Smoothly step through OA2 -> OA3 using commitSceneTransition
        commitSceneTransition(oa2Key, () => {
          setOutcomeFrameIdx(1);
        });
        scheduleTimeout(() => {
          commitSceneTransition(oa3Key, () => {
            setOutcomeFrameIdx(2);
          });
          scheduleTimeout(() => {
            finishOutcomeSequence(activeChoice, mistakesMade);
          }, 550);
        }, 550);
      }
    },
    [
      selectedChoice,
      clearAutoTimers,
      commitSceneTransition,
      scheduleTimeout,
      scheduleInterval,
      level.severity,
      level.patientState,
      level.id,
      level.ageGroup,
      triggerRhythmTapFeedback,
      finishOutcomeSequence,
      mistakesMade,
    ]
  );

  // Start calm watch timer for Mild levels (A1, C3, I3) once the learner reaches 'watch' stage
  const startMildWatchTimer = useCallback(
    (choice: StoryLevelChoice, currentMistakes: number) => {
      clearAutoTimers();
      const oa2Key =
        choice.consequenceBeat.playbackFrames?.[1]?.mediaKey ??
        choice.consequenceBeat.mediaKey;
      const oa3Key =
        choice.consequenceBeat.playbackFrames?.[2]?.mediaKey ??
        choice.consequenceBeat.mediaKey;

      commitSceneTransition(oa2Key, () => {
        setMildStepStage('watch');
        setOutcomeFrameIdx(1);
      });

      let prog = 20;
      setMildObserveProgress(20);
      scheduleInterval(() => {
        prog += 20;
        setMildObserveProgress(prog);
        if (prog >= 100) {
          clearAutoTimers();
          setEarnedPracticeBadge(true);
          commitSceneTransition(oa3Key, () => {
            setOutcomeFrameIdx(2);
          });
          scheduleTimeout(() => {
            finishOutcomeSequence(choice, currentMistakes);
          }, 500);
        }
      }, 340);
    },
    [clearAutoTimers, commitSceneTransition, scheduleInterval, scheduleTimeout, finishOutcomeSequence]
  );

  // Handle choosing one of the 3 decision cards (atomically gated on first outcome image decode)
  const handleSelectChoice = useCallback(
    (choice: StoryLevelChoice) => {
      clearAutoTimers();
      nafasAudio.playCardSelect();

      const firstOutcomeKey =
        choice.consequenceBeat.playbackFrames?.[0]?.mediaKey ??
        choice.consequenceBeat.mediaKey;
      const secondOutcomeKey =
        choice.consequenceBeat.playbackFrames?.[1]?.mediaKey ??
        choice.consequenceBeat.mediaKey;

      const updatedMistakes =
        choice.outcome === 'optimal' ? mistakesMade : mistakesMade + 1;

      commitSceneTransition(firstOutcomeKey, () => {
        setSelectedChoice(choice);
        setSequenceComplete(false);
        setIsAnnotatedReplay(false);
        setOutcomeFrameIdx(0);
        setBlowCount(0);
        setThrustCount(0);
        setRhythmQuality('idle');
        setReassessChecked(false);
        setAutoAnimateHand(false);
        setUnresponsiveStepIdx(0);
        setUnresponsiveNudge(null);
        setMildStepStage(level.id === 'A1' ? 'ask' : 'encourage');
        setMildObserveProgress(0);
        if (choice.outcome !== 'optimal') {
          setMistakesMade(updatedMistakes);
        }
        setPhase('final_debrief');

        if (choice.outcome !== 'optimal') {
          scheduleTimeout(() => {
            finishOutcomeSequence(choice, updatedMistakes);
          }, 850);
          return;
        }

        if (level.severity === 'severe' && level.patientState === 'conscious') {
          nafasAudio.playEmsCall();
          setRescueStage('ems_activated');
          scheduleTimeout(() => {
            commitSceneTransition(secondOutcomeKey, () => {
              setOutcomeFrameIdx(1);
              setRescueStage('place_hands_back');
            });
          }, 700);
        } else if (
          level.patientState === 'unconscious' ||
          level.severity === 'unresponsive'
        ) {
          setRescueStage('unresponsive_order');
        } else {
          setRescueStage('mild_observe');
        }
      });
    },
    [
      clearAutoTimers,
      commitSceneTransition,
      scheduleTimeout,
      mistakesMade,
      level.id,
      level.severity,
      level.patientState,
      finishOutcomeSequence,
    ]
  );

  // Interactive handler for Unresponsive levels (A3, C2, I2) 4-step order (wrong order gives gentle nudge, no penalty)
  const unresponsiveSteps = useMemo(
    () => [
      {
        ar: '١. أنزله بأمان على سطح صلب مستوٍ',
        en: '1. Lower safely onto a firm flat surface',
      },
      {
        ar: '٢. تأكد من الاتصال بالإسعاف',
        en: '2. Make sure emergency ambulance (EMS) is called',
      },
      {
        ar: '٣. ابدأ الإنعاش حسب تدريبك',
        en: '3. Start CPR according to your training',
      },
      {
        ar: '٤. اتبع تعليمات جهاز الصدمات (AED) ومسعف التليفون',
        en: '4. Follow AED and dispatcher instructions',
      },
    ],
    []
  );

  const handleTapUnresponsiveStep = (idx: number) => {
    if (!selectedChoice) return;
    if (idx < unresponsiveStepIdx) return;
    if (idx !== unresponsiveStepIdx) {
      const expectedStep = unresponsiveSteps[unresponsiveStepIdx];
      setUnresponsiveNudge(
        isAr
          ? `تنبيه لطيف (بدون خصم): ابدأ أولاً بـ «${expectedStep.ar}» قبل هذه الخطوة.`
          : `Gentle nudge (no penalty): do "${expectedStep.en}" first.`
      );
      return;
    }
    setUnresponsiveNudge(null);
    nafasAudio.playUnresponsiveStep();
    const next = unresponsiveStepIdx + 1;
    setUnresponsiveStepIdx(next);
    if (next === 2) {
      const oa2Key =
        selectedChoice.consequenceBeat.playbackFrames?.[1]?.mediaKey ??
        selectedChoice.consequenceBeat.mediaKey;
      commitSceneTransition(oa2Key, () => {
        setOutcomeFrameIdx(1);
      });
    }
    if (next >= unresponsiveSteps.length) {
      setEarnedPracticeBadge(true);
      const oa3Key =
        selectedChoice.consequenceBeat.playbackFrames?.[2]?.mediaKey ??
        selectedChoice.consequenceBeat.mediaKey;
      commitSceneTransition(oa3Key, () => {
        setOutcomeFrameIdx(2);
      });
      scheduleTimeout(() => {
        finishOutcomeSequence(selectedChoice, mistakesMade);
      }, 550);
    }
  };

  // Watch the correct technique (annotated replay of OA1 -> OA2 -> OA3)
  const handleWatchCorrectTechnique = () => {
    const optimalChoice = level.decisionNode.choices.find(
      (c) => c.outcome === 'optimal'
    );
    if (!optimalChoice) return;
    clearAutoTimers();
    const oa1Key =
      optimalChoice.consequenceBeat.playbackFrames?.[0]?.mediaKey ??
      optimalChoice.consequenceBeat.mediaKey;
    commitSceneTransition(oa1Key, () => {
      setSelectedChoice(optimalChoice);
      setIsAnnotatedReplay(true);
      setSequenceComplete(true);
      setRescueStage('completed');
      setOutcomeFrameIdx(0);
      nafasAudio.playPageTurn();
    });
  };

  // Keyboard Accessibility (Space/Enter to advance, 1/2/3 for choices, Esc for More menu)
  useEffect(() => {
    if (entryStep !== 'playing') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowMoreMenu((prev) => !prev);
        return;
      }
      if (phase === 'story_intro' && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        handleAdvanceWatch();
      } else if (
        phase === 'assess_signs' &&
        allSignsInspected &&
        (e.key === ' ' || e.key === 'Enter')
      ) {
        e.preventDefault();
        nafasAudio.playPageTurn();
        setChallengeTimeLeft(level.decisionNode.timeLimitSec || 20);
        setPhase('decision_crisis');
      } else if (phase === 'decision_crisis') {
        if (e.key === '1' && shuffledChoices[0]) {
          handleSelectChoice(shuffledChoices[0]);
        } else if (e.key === '2' && shuffledChoices[1]) {
          handleSelectChoice(shuffledChoices[1]);
        } else if (e.key === '3' && shuffledChoices[2]) {
          handleSelectChoice(shuffledChoices[2]);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    entryStep,
    phase,
    handleAdvanceWatch,
    allSignsInspected,
    level.decisionNode.timeLimitSec,
    shuffledChoices,
    handleSelectChoice,
  ]);

  // Start playing from title card (counts as user gesture — starts music + SFX automatically)
  const handleStartFromTitle = () => {
    nafasAudio.enterLevel(level.id);
    nafasAudio.unlockAudio();
    setEntryStep('playing');
  };

  // Subtle desaturation when oxygen falls (max ~15%)
  const desaturationPct = useMemo(() => {
    if (prefersReducedMotion) return 0;
    const drop = Math.max(0, 96 - displayedSpO2);
    return Math.min(15, Math.round(drop * 1.1));
  }, [displayedSpO2, prefersReducedMotion]);

  // Breathing passage plain-language status
  const airwayStatus = useMemo(() => {
    if (phase === 'final_debrief' && selectedChoice) {
      if (selectedChoice.outcome === 'optimal' && (outcomeFrameIdx === 2 || sequenceComplete)) {
        return {
          ar: 'مفتوح • يتنفس طبيعياً',
          en: 'Open • Breathing normally',
          color: 'text-[#16A36A] border-[#16A36A]/40 bg-[#16A36A]/10',
        };
      }
      if (selectedChoice.outcome !== 'optimal') {
        return {
          ar: 'مسدود • الخطر يزداد',
          en: 'Blocked • Danger worsening',
          color: 'text-[#DC5252] border-[#DC5252]/40 bg-[#DC5252]/10',
        };
      }
    }
    if (level.severity === 'mild') {
      return {
        ar: 'مفتوح جزئياً • سعال قوي',
        en: 'Partially open • Strong cough',
        color: 'text-[#13B8B0] border-[#13B8B0]/40 bg-[#13B8B0]/10',
      };
    }
    if (phase === 'story_intro' && introBeatIdx < 2) {
      return {
        ar: 'مفتوح • تنفس طبيعي',
        en: 'Open • Normal breathing',
        color: 'text-[#16A36A] border-[#16A36A]/40 bg-[#16A36A]/10',
      };
    }
    return {
      ar: 'مسدود • لا يخرج صوت أو سعال',
      en: 'Blocked • No voice or cough',
      color: 'text-[#DC5252] border-[#DC5252]/40 bg-[#DC5252]/10',
    };
  }, [phase, selectedChoice, outcomeFrameIdx, sequenceComplete, level.severity, introBeatIdx]);

  // Magnifier Tile SVG viewBox calculation (crops the SAME S5 image around activeMagnifierHotspot)
  const magnifierCrop = useMemo(() => {
    if (!activeMagnifierHotspot) return null;
    const entry = getManifestEntry(`${level.id}_S5`);
    const w = entry.width || 640;
    const h = entry.height || 357;
    const cx = activeMagnifierHotspot.x * w;
    const cy = activeMagnifierHotspot.y * h;
    // Zoom in ~3.6x around the symptom center
    const cropW = Math.round(w * 0.28);
    const cropH = Math.round(h * 0.28);
    const vx = Math.max(0, Math.min(w - cropW, Math.round(cx - cropW / 2)));
    const vy = Math.max(0, Math.min(h - cropH, Math.round(cy - cropH / 2)));
    return { w, h, cx, cy, vx, vy, cropW, cropH };
  }, [activeMagnifierHotspot, level.id]);

  // ============================================================================
  // RENDER 1: TITLE CARD (With One-Time Friendly Sound Prompt + Mini Intro Link)
  // ============================================================================
  if (entryStep === 'title_card') {
    const coverMedia = resolveStoryMedia(level.storyBeats[0]?.mediaKey);
    return (
      <div
        dir={isAr ? 'rtl' : 'ltr'}
        className="max-w-3xl mx-auto px-4 py-6 sm:py-10"
      >
        <div className="rounded-3xl bg-[#0B2D40] border border-[#285064] shadow-2xl overflow-hidden">
          <div className="relative aspect-[640/357] w-full bg-[#071F2E] overflow-hidden">
            <img
              src={coverMedia.src}
              alt={coverMedia.alt[language]}
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071F2E] via-[#071F2E]/45 to-transparent" />
            <div className="absolute top-4 inset-x-4 flex items-center justify-between">
              <button
                type="button"
                onClick={exitLevelToMap}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#071F2E]/85 border border-[#285064] text-xs font-bold text-[#F3F7F8] hover:border-[#13B8B0] transition-colors"
              >
                {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{isAr ? 'خريطة المستويات' : 'Level Map'}</span>
              </button>
              <span className="px-3.5 py-1.5 rounded-xl bg-[#071F2E]/90 border border-[#13B8B0]/50 text-xs font-extrabold text-[#43C7D1]">
                {level.id} • {level.setting[language]}
              </span>
            </div>
            <div className="absolute bottom-4 inset-x-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F7F8]">
                {level.id} · {level.title[language]}
              </h1>
              <p className="text-sm text-[#A9C0CC] mt-1">
                {level.character.name[language]} ({level.character.age[language]}) —{' '}
                {level.setting[language]}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <p className="text-base text-[#F3F7F8] leading-relaxed bg-[#123B50]/70 border border-[#285064] rounded-2xl p-4">
              {level.hook[language]}
            </p>

            {/* Single Primary Button + Skippable Quick Tour Link (No sound consent prompt) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setMiniIntroSlide(0);
                  setEntryStep('mini_intro');
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#123B50] border border-[#285064] text-xs font-bold text-[#A9C0CC] hover:text-[#F3F7F8] hover:border-[#43C7D1] transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-[#43C7D1]" />
                <span>
                  {isAr
                    ? 'كيف تلعب؟ (شاهد ← افحص ← قرّر)'
                    : 'How to play (Watch → Look → Decide)'}
                </span>
              </button>

              <button
                type="button"
                data-testid="title-card-start-btn"
                onClick={handleStartFromTitle}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] font-extrabold text-base shadow-lg transition-all min-h-[52px] cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{isAr ? 'ابدأ القصة الآن' : 'Start Now'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER 2: FIRST-TIME QUICK TOUR (Watch -> Look -> Decide, Skippable)
  // ============================================================================
  if (entryStep === 'mini_intro') {
    const tourSteps = [
      {
        icon: Film,
        title: { ar: 'شاهد القصة', en: 'Watch the Story' },
        desc: {
          ar: 'تابع أحداث الموقف؛ كل نقرة أو ضغطة مسافة تنقلك للجزء التالي مع تطور الحالة.',
          en: 'Follow the unfolding situation; tap or press Space to continue as it develops.',
        },
      },
      {
        icon: Search,
        title: { ar: 'افحص العلامات', en: 'Look at the Signs' },
        desc: {
          ar: 'اضغط على الحلقات المضيئة على المصاب (الرقبة، الشفاه، الصوت) لتكبير العلامة وقراءة معناها في الشريط الجانبي.',
          en: 'Tap the glowing rings on the patient to zoom into each sign and read what it means in the Info Rail.',
        },
      },
      {
        icon: Compass,
        title: { ar: 'قرّر وشاهد النتيجة', en: 'Decide & See the Result' },
        desc: {
          ar: 'اختر التصرف الصحيح من البطاقات الواضحة، وطبّق خطوات الإنقاذ بنفسك أو اختر التنفيذ التلقائي في أي وقت.',
          en: 'Pick the right action from clear cards and practice the rescue steps or use Auto-perform anytime.',
        },
      },
    ];
    const currentTour = tourSteps[miniIntroSlide];
    const TourIcon = currentTour.icon;

    return (
      <div
        dir={isAr ? 'rtl' : 'ltr'}
        className="max-w-xl mx-auto px-4 py-10"
      >
        <div className="rounded-3xl bg-[#0B2D40] border border-[#285064] p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#43C7D1]">
              {isAr ? 'جولة سريعة' : 'Quick Tour'}
            </span>
            <button
              type="button"
              onClick={handleStartFromTitle}
              className="text-xs font-bold text-[#A9C0CC] hover:text-[#F3F7F8] underline cursor-pointer"
            >
              {isAr ? 'تخطي وبدء اللعب' : 'Skip & Play'}
            </button>
          </div>

          <div className="py-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#13B8B0]/15 border border-[#13B8B0]/40 flex items-center justify-center text-[#13B8B0]">
              <TourIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-[#F3F7F8]">
              {currentTour.title[language]}
            </h2>
            <p className="text-sm text-[#A9C0CC] leading-relaxed">
              {currentTour.desc[language]}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === miniIntroSlide ? 'w-6 bg-[#13B8B0]' : 'w-2 bg-[#285064]'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                if (miniIntroSlide < 2) {
                  setMiniIntroSlide((miniIntroSlide + 1) as 0 | 1 | 2);
                } else {
                  handleStartFromTitle();
                }
              }}
              className="px-6 py-3 rounded-xl bg-[#13B8B0] text-[#071F2E] font-extrabold text-sm cursor-pointer"
            >
              {miniIntroSlide < 2
                ? isAr
                  ? 'التالي'
                  : 'Next'
                : isAr
                ? 'ابدأ الآن'
                : 'Start Now'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER 3: MAIN 4-STEP EXPERIENCE PLAYER (Watch -> Look -> Decide -> Result)
  // Stepper uses names + icons ONLY (zero 1-2-3-4 prefixes)
  // ============================================================================
  const stepsList: {
    key: LevelPlayPhase;
    ar: string;
    en: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { key: 'story_intro', ar: 'شاهد', en: 'Watch', icon: Film },
    { key: 'assess_signs', ar: 'افحص', en: 'Look', icon: Search },
    { key: 'decision_crisis', ar: 'قرّر', en: 'Decide', icon: Compass },
    { key: 'final_debrief', ar: 'النتيجة', en: 'Result', icon: Award },
  ];

  const isCriticalVignette =
    !prefersReducedMotion &&
    displayedSpO2 <= 90 &&
    !(phase === 'final_debrief' && selectedChoice?.outcome === 'optimal' && outcomeFrameIdx === 2);

  const isSuccessBloom =
    phase === 'final_debrief' &&
    selectedChoice?.outcome === 'optimal' &&
    (outcomeFrameIdx === 2 || sequenceComplete);

  // Rule 2e: Lock camera push to scale 1.0 during Look and hand-placement steps
  const isCameraLocked =
    urlKenBurns === 'on'
      ? false
      : urlKenBurns === 'off'
      ? true
      : phase !== 'story_intro';

  const activeExplanation = selectedChoice?.consequenceBeat.explanation;

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-5 space-y-4"
    >
      {/* Top Compact Bar: Back to Map + 4-Step Progress Pill + Always-Visible Mute + More Menu */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0B2D40] border border-[#285064] rounded-2xl px-3.5 py-2.5">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={exitLevelToMap}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#123B50] border border-[#285064] text-xs font-bold text-[#F3F7F8] hover:border-[#13B8B0] transition-colors"
          >
            {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{isAr ? 'المستويات' : 'Levels'}</span>
          </button>
          <span className="text-xs sm:text-sm font-extrabold text-[#F3F7F8]">
            {level.id} · {level.title[language]}
          </span>
        </div>

        {/* 4 Plain-Name + Icon Steps (No 1-2-3-4 Prefixes) */}
        <div
          data-testid="level-stepper"
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto"
        >
          {stepsList.map((st) => {
            const active = phase === st.key;
            const StepIcon = st.icon;
            return (
              <span
                key={st.key}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-extrabold whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-[#13B8B0] text-[#071F2E]'
                    : 'bg-[#123B50]/60 text-[#A9C0CC]'
                }`}
              >
                <StepIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{isAr ? st.ar : st.en}</span>
              </span>
            );
          })}
        </div>

        {/* Always-Visible Sound Mute Button + Sound Sliders Panel + Autoplay Recovery Chip + More Menu */}
        <div className="relative flex items-center gap-1.5 sm:gap-2">
          {audioState.autoplayBlocked && !audioState.muted && (
            <button
              type="button"
              data-testid="enable-sound-chip"
              onClick={() => nafasAudio.unlockAudio()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#E9A23B]/20 border border-[#E9A23B] text-[11px] font-extrabold text-[#E9A23B] hover:bg-[#E9A23B]/30 transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'اضغط لتفعيل الصوت' : 'Tap to enable sound'}</span>
            </button>
          )}

          {initialDebugMode && (
            <button
              type="button"
              onClick={() => setDebugHotspots((d) => !d)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-extrabold ${
                debugHotspots
                  ? 'bg-[#E9A23B]/20 border-[#E9A23B] text-[#E9A23B]'
                  : 'bg-[#123B50] border-[#285064] text-[#A9C0CC]'
              }`}
            >
              <Bug className="w-3.5 h-3.5" />
              <span>Debug</span>
            </button>
          )}

          {/* One-Tap Sound Mute/Unmute Button (Icon + Clear State) */}
          <div className="inline-flex items-center rounded-xl bg-[#123B50] border border-[#285064] overflow-hidden">
            <button
              type="button"
              data-testid="level-sound-mute-btn"
              onClick={() => nafasAudio.toggleMute()}
              aria-label={
                audioState.muted
                  ? isAr
                    ? 'تشغيل الصوت'
                    : 'Unmute sound'
                  : isAr
                  ? 'كتم الصوت'
                  : 'Mute sound'
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#F3F7F8] hover:bg-[#19465B] transition-colors cursor-pointer min-h-[36px]"
            >
              {audioState.muted ? (
                <VolumeX className="w-4 h-4 text-[#A9C0CC]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#13B8B0]" />
              )}
              <span>
                {audioState.muted
                  ? isAr
                    ? 'صامت'
                    : 'Muted'
                  : isAr
                  ? 'الصوت'
                  : 'Sound'}
              </span>
            </button>
            <button
              type="button"
              data-testid="level-sound-panel-btn"
              onClick={() => {
                setShowSoundPanel((prev) => !prev);
                setShowMoreMenu(false);
              }}
              aria-label={isAr ? 'إعدادات الموسيقى والمؤثرات' : 'Music & Effects Settings'}
              aria-expanded={showSoundPanel}
              className={`px-2 py-1.5 border-s border-[#285064] transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
                showSoundPanel
                  ? 'bg-[#13B8B0]/20 text-[#43C7D1]'
                  : 'text-[#A9C0CC] hover:text-[#F3F7F8] hover:bg-[#19465B]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowMoreMenu((prev) => !prev);
              setShowSoundPanel(false);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#123B50] border border-[#285064] text-xs font-bold text-[#A9C0CC] hover:text-[#F3F7F8] cursor-pointer min-h-[36px]"
          >
            {isAr ? 'المزيد' : 'More'}
          </button>

          {/* Dedicated Sound Panel: Music Slider, Effects Slider, Optional Sound Captions (Default OFF) */}
          {showSoundPanel && (
            <div
              data-testid="level-sound-panel"
              className="absolute top-12 end-0 z-40 w-72 rounded-2xl bg-[#0B2D40] border border-[#13B8B0]/55 shadow-2xl p-4 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#285064] pb-2.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#F3F7F8]">
                  <Music className="w-3.5 h-3.5 text-[#13B8B0]" />
                  <span>{isAr ? 'إعدادات الصوت' : 'Sound Controls'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => nafasAudio.toggleMute()}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                    audioState.muted
                      ? 'bg-[#123B50] text-[#A9C0CC]'
                      : 'bg-[#13B8B0] text-[#071F2E]'
                  }`}
                >
                  {audioState.muted
                    ? isAr
                      ? 'صامت'
                      : 'Muted'
                    : isAr
                    ? 'مفعّل'
                    : 'Active'}
                </button>
              </div>

              {/* Music Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label
                    htmlFor="nafas-music-slider"
                    className="font-bold text-[#F3F7F8]"
                  >
                    {isAr ? 'الموسيقى الهادئة' : 'Music'}
                  </label>
                  <span className="font-semibold text-[#43C7D1] tabular-nums">
                    {Math.round(audioState.musicVolume * 100)}%
                  </span>
                </div>
                <input
                  id="nafas-music-slider"
                  data-testid="music-volume-slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={audioState.musicVolume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    nafasAudio.setMusicVolume(v);
                    if (v > 0 && audioState.muted) {
                      nafasAudio.setMuted(false);
                    }
                  }}
                  className="w-full accent-[#13B8B0] cursor-pointer"
                />
              </div>

              {/* Effects Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label
                    htmlFor="nafas-effects-slider"
                    className="font-bold text-[#F3F7F8]"
                  >
                    {isAr ? 'المؤثرات الصوتية' : 'Effects'}
                  </label>
                  <span className="font-semibold text-[#43C7D1] tabular-nums">
                    {Math.round(audioState.effectsVolume * 100)}%
                  </span>
                </div>
                <input
                  id="nafas-effects-slider"
                  data-testid="effects-volume-slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={audioState.effectsVolume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    nafasAudio.setEffectsVolume(v);
                    if (v > 0 && audioState.muted) {
                      nafasAudio.setMuted(false);
                    }
                  }}
                  className="w-full accent-[#13B8B0] cursor-pointer"
                />
              </div>

              {/* Body Sounds Toggle (Default ON, 1-tap switch for sensitive learners) */}
              <div className="space-y-2 pt-2 border-t border-[#285064]">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F3F7F8]">
                    <Activity className="w-3.5 h-3.5 text-[#13B8B0]" />
                    <span>{isAr ? 'أصوات الجسم' : 'Body sounds'}</span>
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={audioState.bodySoundsEnabled}
                    data-testid="body-sounds-toggle"
                    onClick={() => {
                      nafasAudio.setBodySoundsEnabled(!audioState.bodySoundsEnabled);
                      nafasAudio.dismissBodySoundNotice();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      audioState.bodySoundsEnabled
                        ? 'bg-[#13B8B0] text-[#071F2E]'
                        : 'bg-[#123B50] text-[#A9C0CC]'
                    }`}
                  >
                    {audioState.bodySoundsEnabled
                      ? isAr
                        ? 'مفعّل'
                        : 'On'
                      : isAr
                      ? 'مغلق'
                      : 'Off'}
                  </button>
                </div>
                <p
                  data-testid="body-sounds-sensitivity-note"
                  className="text-[11px] leading-relaxed text-[#A9C0CC] bg-[#071F2E]/85 border border-[#285064] rounded-xl px-2.5 py-2"
                >
                  {isAr
                    ? 'بعض الأصوات (الكحة أو البكاء) قد تكون حساسة. يمكنك إيقافها بضغطة واحدة.'
                    : 'Some sounds (cough, crying) may be sensitive. You can turn them off.'}
                </p>
              </div>

              {/* Optional Subtle Sound Captions Toggle (Default OFF) */}
              <div className="flex items-center justify-between pt-2 border-t border-[#285064]">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A9C0CC]">
                  <Subtitles className="w-3.5 h-3.5 text-[#43C7D1]" />
                  <span>{isAr ? 'تسميات المؤثرات الصوتية' : 'Sound captions'}</span>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={audioState.captionsEnabled}
                  data-testid="sound-captions-toggle"
                  onClick={() =>
                    nafasAudio.setCaptionsEnabled(!audioState.captionsEnabled)
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    audioState.captionsEnabled
                      ? 'bg-[#13B8B0] text-[#071F2E]'
                      : 'bg-[#123B50] text-[#A9C0CC]'
                  }`}
                >
                  {audioState.captionsEnabled
                    ? isAr
                      ? 'مفعّل'
                      : 'On'
                    : isAr
                    ? 'مغلق'
                    : 'Off'}
                </button>
              </div>
            </div>
          )}

          {/* One-time Friendly Sensitivity Note Banner (dismissible or 1-tap mute body sounds) */}
          {!audioState.bodySoundNoticeSeen && !showSoundPanel && (
            <div
              data-testid="body-sounds-first-time-note"
              className="fixed bottom-4 start-4 z-40 max-w-sm rounded-2xl bg-[#0B2D40]/95 backdrop-blur-md border border-[#13B8B0]/50 shadow-2xl p-3.5 flex items-start gap-3"
            >
              <Activity className="w-4 h-4 text-[#43C7D1] shrink-0 mt-0.5" />
              <div className="space-y-2 text-xs">
                <p className="text-[#E5F0F4] leading-relaxed">
                  {isAr
                    ? 'بعض الأصوات (الكحة أو البكاء) قد تكون حساسة. يمكنك إيقافها من إعدادات الصوت.'
                    : 'Some sounds (cough, crying) may be sensitive. You can turn them off.'}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => nafasAudio.dismissBodySoundNotice()}
                    className="px-2.5 py-1 rounded-lg bg-[#13B8B0] text-[#071F2E] font-bold cursor-pointer"
                  >
                    {isAr ? 'حسناً' : 'Got it'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      nafasAudio.setBodySoundsEnabled(false);
                      nafasAudio.dismissBodySoundNotice();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#123B50] text-[#A9C0CC] hover:text-[#F3F7F8] font-bold cursor-pointer"
                  >
                    {isAr ? 'إيقاف أصوات الجسم' : 'Turn off body sounds'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Live QA Cue Overlay HUD (?cueOverlay=1) */}
          {cueOverlayEnabled && (
            <div
              data-testid="qa-live-cue-overlay"
              dir="ltr"
              className="fixed bottom-4 end-4 z-50 w-80 max-w-[92vw] rounded-2xl bg-[#051C2C]/95 border border-[#43C7D1]/70 shadow-2xl p-3.5 text-[11px] font-mono text-[#E5F0F4] space-y-2"
            >
              <div className="flex items-center justify-between border-b border-[#285064] pb-1.5">
                <span className="font-bold text-[#5CE2EA]">
                  AUDIO CUE OVERLAY · {level.id}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#123B50] text-[10px] text-[#43C7D1] uppercase">
                  {audioState.activeMood}
                </span>
              </div>
              <div className="text-[10px] text-[#A9C0CC] space-y-0.5">
                <div>Music: {audioState.activeMusicTrackId || '—'}</div>
                <div>Ambience: {audioState.activeAmbienceId || '—'}</div>
                <div>
                  Body sounds: {audioState.bodySoundsEnabled ? 'ON' : 'OFF'} ·
                  Muted: {audioState.muted ? 'YES' : 'NO'}
                </div>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto pt-1 border-t border-[#285064]/70">
                {recentCues.length === 0 ? (
                  <div className="text-[#8BA8B6] italic">
                    Waiting for cues to fire…
                  </div>
                ) : (
                  recentCues.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between gap-2 bg-[#0B2D40] rounded px-2 py-1"
                    >
                      <span className="truncate text-[#F3F7F8]">
                        [{c.contextKey}] {c.soundId}
                      </span>
                      <span
                        className={`shrink-0 text-[10px] ${
                          c.skippedReason ? 'text-[#E9A23B]' : 'text-[#13B8B0]'
                        }`}
                      >
                        {c.skippedReason ? c.skippedReason : `v=${c.volume}`}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {showMoreMenu && (
            <div className="absolute top-12 end-0 z-40 w-64 rounded-2xl bg-[#0B2D40] border border-[#285064] shadow-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#A9C0CC]">
                  {isAr ? 'قراءة صوتية للنصوص' : 'Voice-Over Reading'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    nafasAudio.setVoiceOverEnabled(!audioState.voiceOverEnabled)
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    audioState.voiceOverEnabled
                      ? 'bg-[#13B8B0] text-[#071F2E]'
                      : 'bg-[#123B50] text-[#A9C0CC]'
                  }`}
                >
                  {audioState.voiceOverEnabled
                    ? isAr
                      ? 'مفعّل'
                      : 'On'
                    : isAr
                    ? 'مغلق'
                    : 'Off'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#A9C0CC]">
                  {isAr ? 'مؤقت التحدي الاختياري' : 'Optional Challenge Timer'}
                </span>
                <button
                  type="button"
                  onClick={() => setChallengeTimerEnabled((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    challengeTimerEnabled
                      ? 'bg-[#13B8B0] text-[#071F2E]'
                      : 'bg-[#123B50] text-[#A9C0CC]'
                  }`}
                >
                  {challengeTimerEnabled ? (isAr ? 'مفعّل' : 'On') : isAr ? 'مغلق' : 'Off'}
                </button>
              </div>

              {initialDebugMode && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#A9C0CC]">
                    {isAr ? 'إظهار صناديق الفحص' : 'Hotspot Debug Boxes'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDebugHotspots((prev) => !prev)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      debugHotspots
                        ? 'bg-[#E9A23B] text-[#071F2E]'
                        : 'bg-[#123B50] text-[#A9C0CC]'
                    }`}
                  >
                    {debugHotspots ? 'ON' : 'OFF'}
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleFullReplayLevel}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#123B50] hover:bg-[#19465B] text-xs font-bold text-[#F3F7F8] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? 'إعادة المستوى من البداية' : 'Restart Level'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Responsive Split Grid: Left/Top = Clean Shared SVG Scene Viewport, Right/Bottom = Separate Info Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ====================================================================
            STAGE COLUMN (8 cols on desktop): Shared SVG ViewBox (640x357)
            ==================================================================== */}
        <div className="lg:col-span-8 space-y-3">
          <SharedSceneCanvas
            imageId={activeImageId}
            imageSrc={activeMediaAsset.src}
            imageAlt={activeMediaAsset.alt[language]}
            language={language}
            hotspots={phase === 'assess_signs' ? lookHotspots : []}
            inspectedIds={inspectedHotspots}
            highlightedId={highlightedHotspotId}
            onSelectHotspot={handleInspectHotspot}
            activeHandTarget={activeHandTarget}
            autoAnimateHandToTarget={autoAnimateHand}
            onHandTargetReached={() => {
              if (autoPerforming) return;
              if (rescueStage === 'place_hands_back') {
                handlePlaceHandsBack();
              } else if (rescueStage === 'place_hands_front') {
                handlePlaceHandsFront();
              }
            }}
            enableKenBurns={phase === 'story_intro' || urlKenBurns === 'on'}
            cameraPushLocked={isCameraLocked}
            prefersReducedMotion={prefersReducedMotion}
            punchPulse={punchPulse}
            desaturationPct={desaturationPct}
            isCriticalVignette={isCriticalVignette}
            isSuccessBloom={isSuccessBloom}
            isLoadingNext={isLoadingNextImage}
            onSceneTap={phase === 'story_intro' ? handleAdvanceWatch : undefined}
            debugMode={debugHotspots}
          />

          {/* Below-Image Caption Bar (Atomic sync with committed image — ZERO scene/beat/slide numbers) */}
          <div
            data-testid="scene-caption-bar"
            data-committed-image-id={activeImageId}
            data-committed-phase={phase}
            data-committed-beat-idx={introBeatIdx}
            data-committed-outcome-idx={outcomeFrameIdx}
            className="rounded-2xl bg-[#0B2D40] border border-[#285064] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-2 flex-1">
              {/* Watch step progress dots (no numbers) */}
              {phase === 'story_intro' && (
                <div
                  data-testid="watch-progress-dots"
                  className="flex items-center gap-1.5"
                  aria-hidden="true"
                >
                  {level.storyBeats.map((b, i) => (
                    <span
                      key={b.id}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === introBeatIdx
                          ? 'w-6 bg-[#13B8B0]'
                          : i < introBeatIdx
                          ? 'w-2 bg-[#43C7D1]/65'
                          : 'w-2 bg-[#285064]'
                      }`}
                    />
                  ))}
                </div>
              )}

              <p
                data-testid="scene-caption-text"
                data-caption-image-id={activeImageId}
                className="text-sm sm:text-base font-bold text-[#F3F7F8] line-clamp-2 leading-snug"
              >
                {phase === 'story_intro' ? typedText : activeCaptionText}
              </p>

              {/* Subtle Optional Sound Captions (Default OFF, toggleable in Sound Panel) */}
              {audioState.captionsEnabled && latestSoundCaption && (
                <p
                  data-testid="subtle-sound-caption"
                  aria-live="polite"
                  className="text-[11px] font-medium text-[#A9C0CC]/85 truncate max-w-md"
                >
                  ♪ {latestSoundCaption[language]}
                </p>
              )}
            </div>

            {/* Watch Step Primary Button */}
            {phase === 'story_intro' && (
              <button
                type="button"
                data-testid="watch-next-btn"
                onClick={handleAdvanceWatch}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] font-extrabold text-sm transition-all min-h-[48px] shrink-0 cursor-pointer"
              >
                <span>
                  {introBeatIdx < level.storyBeats.length - 1
                    ? isAr
                      ? 'التالي'
                      : 'Next'
                    : isAr
                    ? 'افحص المصاب'
                    : 'Inspect Patient'}
                </span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* ====================================================================
            SEPARATE INFO RAIL (4 cols on desktop, below on mobile)
            Houses Oxygen level, Breathing passage, Magnifier Tile, max 3 chips, interactions
            ==================================================================== */}
        <aside className="lg:col-span-4 space-y-3">
          {/* Plain-Language Live Vitals HUD in Info Rail (ARIA live region) */}
          <div
            aria-live="polite"
            className="rounded-2xl bg-[#0B2D40] border border-[#285064] p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#A9C0CC]">
                {isAr ? 'مؤشرات الحالة الحية' : 'Live Patient Status'}
              </span>
              <span className="text-xs font-bold text-[#43C7D1]">
                {level.character.name[language]} ({level.character.age[language]})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Oxygen Level (Tabular Numbers) */}
              <div className="rounded-xl bg-[#071F2E] border border-[#285064] p-3">
                <span className="text-[11px] font-bold text-[#A9C0CC] block">
                  {isAr ? 'مستوى الأكسجين' : 'Oxygen level'}
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span
                    className={`text-2xl font-extrabold tabular-nums ${
                      displayedSpO2 >= 94
                        ? 'text-[#16A36A]'
                        : displayedSpO2 >= 89
                        ? 'text-[#E9A23B]'
                        : 'text-[#DC5252]'
                    }`}
                  >
                    {displayedSpO2}%
                  </span>
                </div>
              </div>

              {/* Breathing Passage */}
              <div className={`rounded-xl border p-3 ${airwayStatus.color}`}>
                <span className="text-[11px] font-bold opacity-85 block">
                  {isAr ? 'مجرى التنفس' : 'Breathing passage'}
                </span>
                <span className="text-xs font-extrabold block mt-1.5 leading-tight">
                  {airwayStatus[language]}
                </span>
              </div>
            </div>
          </div>

          {/* WATCH Info Rail Card */}
          {phase === 'story_intro' && (
            <div className="rounded-2xl bg-[#0B2D40] border border-[#285064] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#43C7D1]">
                  {isAr ? 'شاهد القصة' : 'Watch the Story'}
                </span>
                <div className="flex gap-1.5">
                  {level.storyBeats.map((b, i) => (
                    <span
                      key={b.id}
                      className={`h-2 rounded-full transition-all ${
                        i === introBeatIdx
                          ? 'w-5 bg-[#13B8B0]'
                          : i < introBeatIdx
                          ? 'w-2 bg-[#43C7D1]/60'
                          : 'w-2 bg-[#285064]'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#A9C0CC] leading-relaxed">
                {currentBeat?.clinicalCue?.[language] ||
                  (isAr
                    ? 'اضغط على الصورة أو مفتاح المسافة للمتابعة.'
                    : 'Tap the image or press Space to continue.')}
              </p>
            </div>
          )}

          {/* LOOK Info Rail Card */}
          {phase === 'assess_signs' && (
            <div className="rounded-2xl bg-[#0B2D40] border border-[#285064] p-4 space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-[#F3F7F8]">
                    {isAr ? 'افحص العلامات' : 'Look at the Signs'}
                  </h3>
                  <p className="text-xs text-[#43C7D1] mt-0.5">
                    {isAr
                      ? 'اضغط على كل حلقة مضيئة على المصاب أو على البطاقة'
                      : 'Tap each glowing ring on the patient or tap a chip'}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#071F2E] border border-[#285064] text-xs font-extrabold text-[#13B8B0] tabular-nums">
                  {inspectedHotspots.length} / {lookHotspots.length}
                </span>
              </div>

              {/* Helper button: "Show me" */}
              {!allSignsInspected && (
                <button
                  type="button"
                  onClick={handleShowMeNextHotspot}
                  className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#123B50] hover:bg-[#19465B] border border-[#285064] text-xs font-extrabold text-[#43C7D1] transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>
                    {isAr ? 'أرني العلامة التالية' : 'Show me the next sign'}
                  </span>
                </button>
              )}

              {/* MAGNIFIER TILE: Zoomed viewBox crop of the SAME S5 image around the tapped symptom */}
              {activeMagnifierHotspot && magnifierCrop && (
                <div
                  data-testid="info-rail-magnifier-tile"
                  data-hotspot-id={activeMagnifierHotspot.id}
                  className="rounded-2xl bg-[#071F2E] border border-[#43C7D1]/60 overflow-hidden shadow-inner"
                >
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#123B50]/80 border-b border-[#285064]">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#43C7D1]">
                      <Search className="w-3.5 h-3.5" />
                      <span>
                        {isAr ? 'عدسة تكبير العلامة' : 'Symptom Magnifier'}
                      </span>
                    </span>
                    <span className="text-[11px] font-bold text-[#F3F7F8]">
                      {activeMagnifierHotspot.label[language]}
                    </span>
                  </div>
                  <div className="relative aspect-[16/9] w-full bg-[#071F2E]">
                    <svg
                      viewBox={`${magnifierCrop.vx} ${magnifierCrop.vy} ${magnifierCrop.cropW} ${magnifierCrop.cropH}`}
                      preserveAspectRatio="xMidYMid slice"
                      className="w-full h-full block"
                    >
                      <image
                        href={activeMediaAsset.src}
                        x={0}
                        y={0}
                        width={magnifierCrop.w}
                        height={magnifierCrop.h}
                        preserveAspectRatio="none"
                      />
                      <circle
                        cx={magnifierCrop.cx}
                        cy={magnifierCrop.cy}
                        r={16}
                        fill="none"
                        stroke="#43C7D1"
                        strokeWidth={1.8}
                        strokeDasharray="4 2"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                  <p className="px-3 py-2 text-xs font-bold text-[#F3F7F8] bg-[#0B2D40] border-t border-[#285064] truncate">
                    {activeMagnifierHotspot.label[language]} — {activeMagnifierHotspot.meaning[language]}
                  </p>
                </div>
              )}

              {/* Max 3 Two-Way Linked Symptom Chips in Info Rail (What you see + What it means) */}
              <div className="space-y-2" data-testid="info-rail-symptom-chips">
                {visibleInspectedHotspots.length === 0 ? (
                  <div className="rounded-xl bg-[#071F2E] border border-dashed border-[#285064] p-3 text-xs text-[#A9C0CC] text-center">
                    {isAr
                      ? 'انقر على الحلقات المضيئة فوق صورة المصاب لتكبير العلامة وعرض ما تراه ومعناه.'
                      : 'Tap the glowing rings on the patient image to zoom in and see what you see and what it means.'}
                  </div>
                ) : (
                  visibleInspectedHotspots.map((hs) => {
                    const isChipSelected = highlightedHotspotId === hs.id;
                    return (
                      <button
                        key={hs.id}
                        type="button"
                        data-testid={`symptom-chip-${hs.id}`}
                        onClick={() => {
                          nafasAudio.playRingTick();
                          setHighlightedHotspotId(hs.id);
                        }}
                        className={`w-full text-start rounded-xl border p-3 space-y-1 transition-all ${
                          isChipSelected
                            ? 'bg-[#19465B] border-[#43C7D1] ring-1 ring-[#43C7D1]'
                            : hs.isReassuring
                            ? 'bg-[#123B50] border-[#16A36A]/50 hover:border-[#43C7D1]'
                            : 'bg-[#123B50] border-[#13B8B0]/40 hover:border-[#43C7D1]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-extrabold text-[#F3F7F8]">
                            <span className="text-[#43C7D1]">
                              {isAr ? 'ما تراه: ' : 'What you see: '}
                            </span>
                            {hs.label[language]}
                          </span>
                          <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />
                        </div>
                        <p className="text-xs text-[#A9C0CC] leading-snug">
                          <span className="font-bold text-[#F3F7F8]">
                            {isAr ? 'معناه: ' : 'What it means: '}
                          </span>
                          {hs.meaning[language]}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Single Primary Button when all signs inspected */}
              {allSignsInspected && (
                <button
                  type="button"
                  onClick={() => {
                    nafasAudio.playPageTurn();
                    setHighlightedHotspotId(null);
                    setChallengeTimeLeft(level.decisionNode.timeLimitSec || 20);
                    setPhase('decision_crisis');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] font-extrabold text-sm shadow-lg transition-all min-h-[48px]"
                >
                  <span>{isAr ? 'انتقل إلى القرار الآن' : 'Proceed to Decide'}</span>
                  {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              )}
            </div>
          )}

          {/* ==================================================================
              STEP 3 (DECIDE): 3 Shuffled Choice Cards (≥48px, neutral styling)
              ================================================================== */}
          {phase === 'decision_crisis' && (
            <div className="rounded-2xl bg-[#0B2D40] border border-[#285064] p-4 space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-[#F3F7F8]">
                    {isAr ? 'قرّر الآن' : 'Decide Now'}
                  </h3>
                  <p className="text-xs text-[#A9C0CC] mt-0.5">
                    {level.decisionNode.prompt[language]}
                  </p>
                </div>

                {challengeTimerEnabled && (
                  <button
                    type="button"
                    onClick={() => setChallengeTimerPaused((p) => !p)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#071F2E] border border-[#285064] text-xs font-bold text-[#E9A23B] tabular-nums"
                  >
                    {challengeTimerPaused ? (
                      <Play className="w-3 h-3" />
                    ) : (
                      <Pause className="w-3 h-3" />
                    )}
                    <span>{challengeTimeLeft}s</span>
                  </button>
                )}
              </div>

              {/* Exactly 3 Choice Cards, Shuffled, Big Touch Targets (≥48px), Zero Spoilers */}
              <div className="space-y-2.5">
                {shuffledChoices.map((choice, idx) => (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => handleSelectChoice(choice)}
                    className="w-full text-start rounded-2xl bg-[#123B50] hover:bg-[#19465B] border border-[#285064] hover:border-[#43C7D1] p-4 transition-all min-h-[56px] flex items-start gap-3 focus:outline-none focus:ring-2 focus:ring-[#43C7D1]"
                  >
                    <span className="w-7 h-7 rounded-lg bg-[#071F2E] border border-[#285064] flex items-center justify-center text-xs font-extrabold text-[#43C7D1] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#F3F7F8] leading-relaxed">
                      {choice.label[language]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================================
              STEP 4A (SEE THE RESULT — IN-PROGRESS INTERACTION BEFORE VERDICT)
              ================================================================== */}
          {phase === 'final_debrief' && !sequenceComplete && selectedChoice && (
            <div className="rounded-2xl bg-[#0B2D40] border border-[#285064] p-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#43C7D1]">
                  {isAr ? 'طبّق الإجراء بنفسك' : 'Do It Yourself Step'}
                </span>
                {selectedChoice.outcome === 'optimal' && (
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    {[0, 1, 2].map((dotIdx) => (
                      <span
                        key={dotIdx}
                        className={`h-2 rounded-full transition-all ${
                          dotIdx === outcomeFrameIdx
                            ? 'w-5 bg-[#13B8B0]'
                            : dotIdx < outcomeFrameIdx
                            ? 'w-2.5 bg-[#16A36A]'
                            : 'w-2 bg-[#285064]'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Severe Choking Interactive Cycle (A2, A4, C1, I1) */}
              {selectedChoice.outcome === 'optimal' &&
                level.severity === 'severe' &&
                level.patientState === 'conscious' && (
                  <div className="space-y-3">
                    {/* High-level clinical review note for A4 (late pregnancy) & I1 (infant) */}
                    {(level.id === 'A4' || level.id === 'I1') && (
                      <div className="rounded-xl bg-[#071F2E] border border-[#43C7D1]/40 p-2.5 flex items-start gap-2">
                        <Info className="w-4 h-4 text-[#43C7D1] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-[#A9C0CC] leading-snug">
                          {level.id === 'I1'
                            ? isAr
                              ? 'تدريب الرضّع يركّز على اختيار الموضع الصحيح (الظهر ثم الصدر بدون لمس البطن) والإيقاع؛ التدريب العملي المباشر ضروري.'
                              : 'Infant practice focuses on landmark choice (back then chest, never belly) and rhythm; hands-on practical training is essential.'
                            : isAr
                            ? 'في آخر الحمل نركّز على اختيار موضع ضغطات الصدر بدلاً من البطن مع الإيقاع المحسوب.'
                            : 'In late pregnancy, focus on selecting the chest landmark instead of the abdomen with steady rhythm.'}
                        </p>
                      </div>
                    )}

                    {rescueStage === 'ems_activated' && (
                      <div className="rounded-xl bg-[#123B50] border border-[#13B8B0]/40 p-3 text-xs text-[#F3F7F8]">
                        {isAr
                          ? '١. تم تفعيل الإسعاف وإمالة المصاب للأمام مع دعم الصدر...'
                          : '1. EMS activated & patient leaned forward with chest support...'}
                      </div>
                    )}

                    {rescueStage === 'place_hands_back' && (
                      <div
                        data-testid="hand-placement-back-card"
                        className="rounded-xl bg-[#123B50] border border-[#13B8B0] p-3.5 space-y-2.5"
                      >
                        <p className="text-xs font-extrabold text-[#F3F7F8]">
                          {isAr
                            ? 'الجولة ١ (اللوحة اليسرى): ضع يدك في موضع ضربات الظهر'
                            : 'Round 1 (Left Panel): Place Hand on Back-Blows Target'}
                        </p>
                        <p className="text-xs text-[#43C7D1] font-bold">
                          {activeHandTarget?.directionHint?.[language] ||
                            (isAr
                              ? 'ضربة حاسمة بكعب اليد بين لوحي الكتف'
                              : 'Firm hit between the shoulder blades')}
                        </p>
                        <p className="text-xs text-[#A9C0CC]">
                          {isAr
                            ? 'اسحب علامة اليد لتنجذب مغناطيسياً إلى الهدف المضيء مع سهم الاتجاه (أو اضغط الهدف مباشرة).'
                            : 'Drag the hand marker to snap magnetically onto the ghost target with the direction arrow (or tap it).'}
                        </p>
                        <button
                          type="button"
                          onClick={handlePlaceHandsBack}
                          className="w-full py-2.5 rounded-xl bg-[#13B8B0] text-[#071F2E] font-extrabold text-xs min-h-[44px]"
                        >
                          {isAr
                            ? 'تثبيت اليد بين لوحَي الكتف'
                            : 'Snap Hand Between Shoulder Blades'}
                        </button>
                      </div>
                    )}

                    {rescueStage === 'rhythm_back_blows' && (
                      <div
                        data-testid="rhythm-step-card"
                        className="rounded-xl bg-[#123B50] border border-[#13B8B0] p-3.5 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#F3F7F8]">
                            {isAr ? 'الإيقاع: نفّذ حتى ٥ ضربات ظهر' : 'Rhythm: Deliver up to 5 Back Blows'}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-[#071F2E] text-xs font-extrabold text-[#13B8B0] tabular-nums">
                            {blowCount} / {isAr ? 'حتى ٥' : 'up to 5'}
                          </span>
                        </div>

                        {/* Visible Beat Counter 1...5 */}
                        <div className="grid grid-cols-5 gap-1.5" data-testid="rhythm-beat-counter">
                          {[1, 2, 3, 4, 5].map((num) => {
                            const done = num <= blowCount;
                            const nextUp = num === blowCount + 1;
                            return (
                              <div
                                key={num}
                                className={`py-1.5 rounded-lg text-center text-xs font-extrabold border transition-all ${
                                  done
                                    ? 'bg-[#16A36A]/25 border-[#16A36A] text-[#F3F7F8]'
                                    : nextUp
                                    ? 'bg-[#13B8B0]/20 border-[#43C7D1] text-[#43C7D1]'
                                    : 'bg-[#071F2E] border-[#285064] text-[#A9C0CC]'
                                }`}
                              >
                                {num}
                              </div>
                            );
                          })}
                        </div>

                        {/* Visual (Non-Color-Only) Timing Indicator */}
                        <div
                          data-testid="rhythm-timing-indicator"
                          className="rounded-lg bg-[#071F2E] border border-[#285064] px-3 py-2 flex items-center justify-between"
                        >
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F3F7F8]">
                            <Activity className="w-3.5 h-3.5 text-[#43C7D1]" />
                            <span>
                              {rhythmQuality === 'good'
                                ? isAr
                                  ? 'إيقاع ممتاز — قوي ومنتظم'
                                  : 'Good — Firm and steady'
                                : rhythmQuality === 'slow'
                                ? isAr
                                  ? 'بطيء قليلاً — استمر بحسم'
                                  : 'A bit slow — keep a firm steady pace'
                                : rhythmQuality === 'steady'
                                ? isAr
                                  ? 'ضربة قوية وثابتة'
                                  : 'Firm and steady'
                                : isAr
                                ? 'اضغط بانتظام (١…٥)'
                                : 'Tap steadily (1…5)'}
                            </span>
                          </span>
                          <span className="text-[11px] font-extrabold text-[#43C7D1]">
                            {rhythmQuality === 'slow' ? '◐' : '●'}
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={autoPerforming}
                          onClick={handleTapBackBlow}
                          className="w-full py-3.5 rounded-xl bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] font-extrabold text-sm shadow-md min-h-[48px]"
                        >
                          {isAr
                            ? `اضغط لتوجيه ضربة ظهر (${blowCount + 1} من حتى ٥)`
                            : `Tap for Back Blow (${blowCount + 1} of up to 5)`}
                        </button>
                      </div>
                    )}

                    {/* Interactive Reassess Step Between Round 1 and Round 2 */}
                    {rescueStage === 'reassess_mid' && (
                      <div
                        data-testid="reassess-mid-card"
                        className="rounded-xl bg-[#123B50] border border-[#E9A23B]/60 p-3.5 space-y-2.5"
                      >
                        <p className="text-xs font-extrabold text-[#E9A23B]">
                          {isAr
                            ? 'إعادة التقييم بين الجولتين'
                            : 'Reassess Between Rounds'}
                        </p>

                        {!reassessChecked ? (
                          <>
                            <p className="text-xs text-[#F3F7F8]">
                              {isAr
                                ? 'بعد حتى ٥ ضربات ظهر، افحص أولاً هل خرج الجسم الغريب وعاد التنفس:'
                                : 'After up to 5 back blows, check first whether the blockage came out:'}
                            </p>
                            <button
                              type="button"
                              data-testid="reassess-check-btn"
                              onClick={handleCheckDidItComeOut}
                              className="w-full py-3 rounded-xl bg-[#E9A23B] hover:bg-[#E9A23B]/90 text-[#071F2E] font-extrabold text-xs min-h-[46px]"
                            >
                              {isAr
                                ? 'افحص: هل خرج الجسم الغريب؟'
                                : 'Check: did it come out?'}
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="rounded-lg bg-[#071F2E] border border-[#E9A23B]/40 p-2.5 text-xs text-[#F3F7F8]">
                              {level.id === 'A4' || level.ageGroup === 'infant'
                                ? isAr
                                  ? 'نتيجة الفحص: لم يخرج الجسم بعد — انتقل فوراً للجولة ٢ (حتى ٥ ضغطات صدر).'
                                  : 'Check result: Still blocked — move immediately to Round 2 (up to 5 chest thrusts).'
                                : isAr
                                ? 'نتيجة الفحص: لم يخرج الجسم بعد — انتقل فوراً للجولة ٢ (حتى ٥ ضغطات بطن للداخل وللأعلى).'
                                : 'Check result: Still blocked — move immediately to Round 2 (up to 5 inward-and-upward belly thrusts).'}
                            </div>
                            <button
                              type="button"
                              onClick={handleProceedToFrontLandmark}
                              className="w-full py-2.5 rounded-xl bg-[#13B8B0] text-[#071F2E] font-extrabold text-xs min-h-[44px]"
                            >
                              {level.id === 'A4' || level.ageGroup === 'infant'
                                ? isAr
                                  ? 'انتقل لموضع ضغطات الصدر (الجولة ٢)'
                                  : 'Continue to Chest Thrusts (Round 2)'
                                : isAr
                                ? 'انتقل لموضع ضغطات البطن (الجولة ٢)'
                                : 'Continue to Belly Thrusts (Round 2)'}
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {rescueStage === 'place_hands_front' && (
                      <div
                        data-testid="hand-placement-front-card"
                        className="rounded-xl bg-[#123B50] border border-[#43C7D1] p-3.5 space-y-2.5"
                      >
                        <p className="text-xs font-extrabold text-[#F3F7F8]">
                          {level.id === 'A4' || level.ageGroup === 'infant'
                            ? isAr
                              ? 'الجولة ٢ (اللوحة اليمنى): حدد موضع ضغطات الصدر'
                              : 'Round 2 (Right Panel): Place Hands for Chest Thrusts'
                            : isAr
                            ? 'الجولة ٢ (اللوحة اليمنى): حدد موضع القبضة لضغطات البطن'
                            : 'Round 2 (Right Panel): Place Fist for Belly Thrusts'}
                        </p>
                        <p className="text-xs text-[#43C7D1] font-bold">
                          {activeHandTarget?.directionHint?.[language] ||
                            (level.id === 'A4' || level.ageGroup === 'infant'
                              ? isAr
                                ? 'ضغطات في منتصف الصدر — بعيداً عن البطن'
                                : 'Firm chest thrusts on sternum — never press belly'
                              : isAr
                              ? 'اضغط للداخل وللأعلى فوق السرة وتحت القص'
                              : 'Thrust inward and upward above the navel')}
                        </p>
                        <p className="text-xs text-[#A9C0CC]">
                          {isAr
                            ? 'اسحب علامة اليد لتنجذب إلى الهدف المضيء في اللوحة اليمنى (أو اضغط الهدف مباشرة).'
                            : 'Drag the hand marker to snap onto the ghost target on the right panel (or tap it).'}
                        </p>
                        <button
                          type="button"
                          onClick={handlePlaceHandsFront}
                          className="w-full py-2.5 rounded-xl bg-[#43C7D1] text-[#071F2E] font-extrabold text-xs min-h-[44px]"
                        >
                          {level.id === 'A4' || level.ageGroup === 'infant'
                            ? isAr
                              ? 'تثبيت الموضع في منتصف الصدر'
                              : 'Snap to Chest Thrust Landmark'
                            : isAr
                            ? 'تثبيت القبضة فوق السرة'
                            : 'Snap Fist Above Navel'}
                        </button>
                      </div>
                    )}

                    {rescueStage === 'rhythm_front_thrusts' && (
                      <div
                        data-testid="rhythm-front-step-card"
                        className="rounded-xl bg-[#123B50] border border-[#43C7D1] p-3.5 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#F3F7F8]">
                            {level.id === 'A4' || level.ageGroup === 'infant'
                              ? isAr
                                ? 'الإيقاع: نفّذ حتى ٥ ضغطات صدر'
                                : 'Rhythm: Deliver up to 5 Chest Thrusts'
                              : isAr
                              ? 'الإيقاع: نفّذ حتى ٥ ضغطات بطن (للداخل وللأعلى)'
                              : 'Rhythm: Deliver up to 5 Belly Thrusts (In & Up)'}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-[#071F2E] text-xs font-extrabold text-[#43C7D1] tabular-nums">
                            {thrustCount} / {isAr ? 'حتى ٥' : 'up to 5'}
                          </span>
                        </div>

                        {/* Visible Beat Counter 1...5 */}
                        <div className="grid grid-cols-5 gap-1.5">
                          {[1, 2, 3, 4, 5].map((num) => {
                            const done = num <= thrustCount;
                            const nextUp = num === thrustCount + 1;
                            return (
                              <div
                                key={num}
                                className={`py-1.5 rounded-lg text-center text-xs font-extrabold border transition-all ${
                                  done
                                    ? 'bg-[#16A36A]/25 border-[#16A36A] text-[#F3F7F8]'
                                    : nextUp
                                    ? 'bg-[#43C7D1]/20 border-[#43C7D1] text-[#43C7D1]'
                                    : 'bg-[#071F2E] border-[#285064] text-[#A9C0CC]'
                                }`}
                              >
                                {num}
                              </div>
                            );
                          })}
                        </div>

                        {/* Visual Timing Feedback */}
                        <div className="rounded-lg bg-[#071F2E] border border-[#285064] px-3 py-2 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F3F7F8]">
                            <Activity className="w-3.5 h-3.5 text-[#43C7D1]" />
                            <span>
                              {rhythmQuality === 'good'
                                ? isAr
                                  ? 'إيقاع ممتاز — قوي ومنتظم'
                                  : 'Good — Firm and steady'
                                : rhythmQuality === 'slow'
                                ? isAr
                                  ? 'بطيء قليلاً — استمر بحسم'
                                  : 'A bit slow — keep a firm steady pace'
                                : isAr
                                ? 'ضغطة حاسمة ومنتظمة (١…٥)'
                                : 'Firm and steady (1…5)'}
                            </span>
                          </span>
                          <span className="text-[11px] font-extrabold text-[#43C7D1]">
                            {rhythmQuality === 'slow' ? '◐' : '●'}
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={autoPerforming}
                          onClick={handleTapFrontThrust}
                          className="w-full py-3.5 rounded-xl bg-[#43C7D1] hover:bg-[#13B8B0] text-[#071F2E] font-extrabold text-sm shadow-md min-h-[48px]"
                        >
                          {level.id === 'A4' || level.ageGroup === 'infant'
                            ? isAr
                              ? `اضغط لضغطة صدر (${thrustCount + 1} من حتى ٥)`
                              : `Tap for Chest Thrust (${thrustCount + 1} of up to 5)`
                            : isAr
                            ? `اضغط لضغطة بطن (${thrustCount + 1} من حتى ٥)`
                            : `Tap for Belly Thrust (${thrustCount + 1} of up to 5)`}
                        </button>
                      </div>
                    )}

                    {/* ALWAYS Available "Do it for me" Button (Animates marker to target & never lowers stars) */}
                    <button
                      type="button"
                      onClick={() => handleAutoPerform(selectedChoice)}
                      className="w-full py-2.5 rounded-xl bg-[#071F2E] hover:bg-[#19465B] border border-[#285064] text-xs font-extrabold text-[#A9C0CC] hover:text-[#F3F7F8] transition-colors"
                    >
                      {isAr
                        ? 'نفّذها لي تلقائياً (لا ينقص النجوم)'
                        : 'Do it for me (never lowers stars)'}
                    </button>
                  </div>
                )}

              {/* Unresponsive Levels Interactive Ordered-Steps Tap Sequence (A3, C2, I2) */}
              {selectedChoice.outcome === 'optimal' &&
                (level.patientState === 'unconscious' ||
                  level.severity === 'unresponsive') && (
                  <div
                    data-testid="unresponsive-ordered-steps"
                    className="space-y-2.5"
                  >
                    <p className="text-xs font-bold text-[#A9C0CC]">
                      {isAr
                        ? 'اضغط الخطوات الأربع بالترتيب الصحيح (ترتيب خاطئ يعطي تنبيهاً لطيفاً بدون خصم):'
                        : 'Tap the 4 steps in order (wrong order gives a gentle nudge, no penalty):'}
                    </p>

                    {unresponsiveNudge && (
                      <div className="rounded-xl bg-[#E9A23B]/15 border border-[#E9A23B] p-2.5 text-xs font-bold text-[#E9A23B] flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{unresponsiveNudge}</span>
                      </div>
                    )}

                    {unresponsiveSteps.map((st, idx) => {
                      const done = idx < unresponsiveStepIdx;
                      const current = idx === unresponsiveStepIdx;
                      return (
                        <button
                          key={st.en}
                          type="button"
                          onClick={() => handleTapUnresponsiveStep(idx)}
                          className={`w-full text-start px-3.5 py-2.5 rounded-xl border text-xs font-extrabold transition-all min-h-[44px] flex items-center justify-between ${
                            done
                              ? 'bg-[#16A36A]/15 border-[#16A36A] text-[#16A36A]'
                              : current
                              ? 'bg-[#13B8B0] border-[#13B8B0] text-[#071F2E]'
                              : 'bg-[#123B50] border-[#285064] text-[#F3F7F8] hover:border-[#43C7D1]'
                          }`}
                        >
                          <span>{isAr ? st.ar : st.en}</span>
                          {done && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => handleAutoPerform(selectedChoice)}
                      className="w-full py-2.5 rounded-xl bg-[#071F2E] border border-[#285064] text-xs font-extrabold text-[#A9C0CC] hover:text-[#F3F7F8]"
                    >
                      {isAr ? 'نفّذها لي تلقائياً' : 'Do it for me'}
                    </button>
                  </div>
                )}

              {/* Mild Cough Levels Interactive "Stay Close and Watch" Sequence (A1, C3, I3) */}
              {selectedChoice.outcome === 'optimal' &&
                level.severity === 'mild' && (
                  <div
                    data-testid="mild-watch-interaction"
                    className="space-y-3"
                  >
                    <div className="rounded-xl bg-[#071F2E] border border-[#13B8B0]/50 p-3 space-y-1">
                      <p className="text-xs font-extrabold text-[#13B8B0]">
                        {isAr
                          ? 'قاعدة الاختناق الخفيف: التصرف الصحيح هو عدم اللمس أو الضرب'
                          : 'Mild Choking Rule: The right behavior is NOT to touch or hit'}
                      </p>
                      <p className="text-[11px] text-[#A9C0CC] leading-snug">
                        {isAr
                          ? 'تذكير مهم: لو السعال تحوّل إلى ضعيف أو صامت، اعتبرها اختناقاً شديداً وتدخّل فوراً.'
                          : 'Important reminder: If the cough becomes weak or silent, treat it immediately as severe choking.'}
                      </p>
                    </div>

                    {level.id === 'A1' && mildStepStage === 'ask' && (
                      <button
                        type="button"
                        onClick={() => {
                          nafasAudio.playRingTick();
                          setMildStepStage('encourage');
                        }}
                        className="w-full py-3 rounded-xl bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] font-extrabold text-xs min-h-[46px] cursor-pointer"
                      >
                        {isAr
                          ? 'اسأله: «هل أنت تختنق؟»'
                          : 'Ask: "Are you choking?"'}
                      </button>
                    )}

                    {mildStepStage === 'encourage' && (
                      <button
                        type="button"
                        onClick={() => {
                          nafasAudio.playRingTick();
                          startMildWatchTimer(selectedChoice, mistakesMade);
                        }}
                        className="w-full py-3 rounded-xl bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] font-extrabold text-xs min-h-[46px] cursor-pointer"
                      >
                        {isAr
                          ? 'شجّعه على الاستمرار في السعال وابدأ المراقبة الهادئة'
                          : 'Encourage coughing & start calm watch meter'}
                      </button>
                    )}

                    {mildStepStage === 'watch' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-[#F3F7F8]">
                          <span>
                            {isAr
                              ? 'عداد المراقبة الهادئة (بدون تدخل باليد)...'
                              : 'Calm observation meter (hands off, staying close)...'}
                          </span>
                          <span className="text-[#13B8B0] tabular-nums">
                            {mildObserveProgress}%
                          </span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-[#071F2E] overflow-hidden border border-[#285064]">
                          <div
                            style={{ width: `${mildObserveProgress}%` }}
                            className="h-full bg-[#13B8B0] transition-all duration-300"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleAutoPerform(selectedChoice)}
                      className="w-full py-2 rounded-xl bg-[#071F2E] border border-[#285064] text-xs font-extrabold text-[#A9C0CC] hover:text-[#F3F7F8] cursor-pointer"
                    >
                      {isAr ? 'تخطي المراقبة' : 'Skip observation timer'}
                    </button>
                  </div>
                )}
            </div>
          )}

          {/* ==================================================================
              STEP 4B (POST-SEQUENCE 6-PART STRUCTURED RESULT SCREEN)
              Appears ONLY after the outcome sequence finishes! Zero slide numbers!
              ================================================================== */}
          {phase === 'final_debrief' && sequenceComplete && selectedChoice && (
            <div
              data-testid="structured-result-screen"
              className="rounded-2xl bg-[#0B2D40] border border-[#285064] p-4 space-y-3.5"
            >
              {/* 1. Headline Verdict (max 8 words) + Stars + XP */}
              <div
                className={`rounded-2xl p-4 border ${
                  selectedChoice.outcome === 'optimal'
                    ? 'bg-[#16A36A]/15 border-[#16A36A]/50'
                    : 'bg-[#DC5252]/15 border-[#DC5252]/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {selectedChoice.outcome === 'optimal' ? (
                      <CheckCircle2 className="w-5 h-5 text-[#16A36A] shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#DC5252] shrink-0" />
                    )}
                    <h4
                      data-testid="result-headline-verdict"
                      className="text-sm font-extrabold text-[#F3F7F8] leading-snug"
                    >
                      {activeExplanation
                        ? activeExplanation.verdict[language]
                        : selectedChoice.consequenceBeat.title[language]}
                    </h4>
                  </div>

                  {/* 3 Stars Display */}
                  <div className="flex items-center gap-1 shrink-0">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-5 h-5 transition-transform duration-300 ${
                          s <= displayedStars
                            ? 'text-[#E9A23B] fill-[#E9A23B] scale-110'
                            : 'text-[#285064]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {selectedChoice.outcome === 'optimal' && (
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#071F2E] text-xs font-extrabold text-[#43C7D1] tabular-nums">
                      +{displayedXp} XP
                    </span>
                    {earnedPracticeBadge && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#13B8B0]/20 border border-[#13B8B0] text-[11px] font-extrabold text-[#13B8B0]">
                        <Award className="w-3.5 h-3.5" />
                        <span>
                          {isAr ? 'وسام تطبيق المهارة' : 'Practice Technique'}
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Annotated Technique Step Switcher (OA1 / OA2 / OA3) */}
              {selectedChoice.consequenceBeat.playbackFrames && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-extrabold text-[#43C7D1] block">
                    {isAnnotatedReplay
                      ? isAr
                        ? 'استعراض خطوات الطريقة الصحيحة:'
                        : 'Correct Technique Steps:'
                      : isAr
                      ? 'مراحل الإجراء الصحيح:'
                      : 'Action Stages:'}
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {selectedChoice.consequenceBeat.playbackFrames.map((fr, i) => (
                      <button
                        key={fr.id}
                        type="button"
                        onClick={() => {
                          commitSceneTransition(fr.mediaKey, () => {
                            nafasAudio.playPageTurn();
                            setOutcomeFrameIdx(i);
                          });
                        }}
                        className={`px-2 py-2 rounded-xl text-[11px] font-extrabold border transition-all cursor-pointer ${
                          outcomeFrameIdx === i
                            ? 'bg-[#13B8B0] text-[#071F2E] border-[#13B8B0]'
                            : 'bg-[#123B50] text-[#A9C0CC] border-[#285064]'
                        }`}
                      >
                        {fr.stageLabel[language]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. What Happened (1-2 lines describing what the learner just saw) */}
              <div
                data-testid="result-what-happened"
                className="rounded-xl bg-[#123B50] border border-[#285064] p-3 space-y-1"
              >
                <span className="text-[11px] font-extrabold text-[#43C7D1] block">
                  {isAr ? 'ماذا حدث؟' : 'What happened'}
                </span>
                <p className="text-xs text-[#F3F7F8] leading-relaxed">
                  {activeExplanation
                    ? activeExplanation.whatHappened[language]
                    : selectedChoice.consequenceBeat.narrative[language]}
                </p>
              </div>

              {/* 3. Why It Works / Why It Fails (2-3 short lines, plain language, empathetic) */}
              <div
                data-testid="result-why"
                className="rounded-xl bg-[#123B50] border border-[#285064] p-3 space-y-1"
              >
                <span className="text-[11px] font-extrabold text-[#43C7D1] block">
                  {selectedChoice.outcome === 'optimal'
                    ? isAr
                      ? 'لماذا نجح هذا التصرف؟'
                      : 'Why it works'
                    : isAr
                    ? 'لماذا يفشل هذا التصرف؟'
                    : 'Why it fails'}
                </span>
                <p className="text-xs text-[#F3F7F8] leading-relaxed">
                  {activeExplanation
                    ? activeExplanation.why[language]
                    : selectedChoice.consequenceBeat.clinicalWhy[language]}
                </p>
              </div>

              {/* 4. What To Do Next Time (max 3 short steps) */}
              {activeExplanation && activeExplanation.nextTime.length > 0 && (
                <div
                  data-testid="result-next-time"
                  className="rounded-xl bg-[#123B50] border border-[#285064] p-3 space-y-1.5"
                >
                  <span className="text-[11px] font-extrabold text-[#43C7D1] block">
                    {isAr ? 'ماذا تفعل في المرة القادمة؟' : 'What to do next time'}
                  </span>
                  <ol className="space-y-1">
                    {activeExplanation.nextTime.slice(0, 3).map((step, i) => (
                      <li
                        key={i}
                        className="text-xs text-[#F3F7F8] leading-snug flex items-start gap-2"
                      >
                        <span className="text-[#13B8B0] font-extrabold shrink-0">
                          {i + 1}.
                        </span>
                        <span>{step[language]}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* 5. Remember (One memorable line) */}
              {activeExplanation && (
                <div
                  data-testid="result-remember"
                  className="rounded-xl bg-[#13B8B0]/15 border border-[#13B8B0]/50 p-3 flex items-start gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#13B8B0] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-extrabold text-[#13B8B0] block">
                      {isAr ? 'تذكّر دائماً' : 'Remember'}
                    </span>
                    <p className="text-xs font-bold text-[#F3F7F8] leading-snug">
                      {activeExplanation.remember[language]}
                    </p>
                  </div>
                </div>
              )}

              {/* 6. After Care (Only when relevant) */}
              {activeExplanation?.afterCare && (
                <div
                  data-testid="result-after-care"
                  className="rounded-xl bg-[#071F2E] border border-[#43C7D1]/40 p-3 space-y-1"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#43C7D1]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isAr ? 'الرعاية بعد الإنقاذ' : 'After care'}</span>
                  </div>
                  <p className="text-xs text-[#A9C0CC] leading-snug">
                    {activeExplanation.afterCare[language]}
                  </p>
                </div>
              )}

              {/* Post-Sequence Action Buttons */}
              <div className="space-y-2 pt-1">
                {selectedChoice.outcome !== 'optimal' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        nafasAudio.playPageTurn();
                        setSelectedChoice(null);
                        setSequenceComplete(false);
                        setAttemptSeed((p) => p + 1);
                        setPhase('decision_crisis');
                      }}
                      className="w-full py-3.5 rounded-xl bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] font-extrabold text-sm min-h-[48px]"
                    >
                      {isAr ? 'جرّب قراراً آخر الآن' : 'Try Another Decision Now'}
                    </button>
                    <button
                      type="button"
                      onClick={handleWatchCorrectTechnique}
                      className="w-full py-2.5 rounded-xl bg-[#123B50] hover:bg-[#19465B] border border-[#285064] text-xs font-extrabold text-[#43C7D1]"
                    >
                      {isAr
                        ? 'شاهد الطريقة الصحيحة خطوة بخطوة'
                        : 'Watch the Correct Technique Step by Step'}
                    </button>
                  </>
                ) : (
                  <>
                    {nextLevel ? (
                      <button
                        type="button"
                        onMouseEnter={() => {
                          imagePreloader.warmLevelOnHover(nextLevel);
                          nafasAudio.prefetchLevelAudio(nextLevel.id);
                        }}
                        onPointerDown={() => {
                          imagePreloader.preloadLevelSequence(nextLevel);
                          nafasAudio.prefetchLevelAudio(nextLevel.id);
                        }}
                        onClick={() => startLevel(nextLevel.id)}
                        className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] font-extrabold text-sm shadow-lg min-h-[48px] cursor-pointer"
                      >
                        <span>
                          {isAr
                            ? `المستوى التالي (${nextLevel.id} · ${nextLevel.title.ar})`
                            : `Next Level (${nextLevel.id} · ${nextLevel.title.en})`}
                        </span>
                        {isAr ? (
                          <ArrowLeft className="w-4 h-4" />
                        ) : (
                          <ArrowRight className="w-4 h-4" />
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={exitLevelToMap}
                        className="w-full py-3.5 rounded-xl bg-[#13B8B0] text-[#071F2E] font-extrabold text-sm min-h-[48px]"
                      >
                        {isAr ? 'العودة لخريطة المستويات' : 'Back to Level Map'}
                      </button>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleWatchCorrectTechnique}
                        className="py-2.5 px-3 rounded-xl bg-[#123B50] hover:bg-[#19465B] border border-[#285064] text-xs font-extrabold text-[#43C7D1]"
                      >
                        {isAr ? 'شاهد الطريقة الصحيحة' : 'Watch Correct Technique'}
                      </button>
                      <button
                        type="button"
                        onClick={handleFullReplayLevel}
                        className="py-2.5 px-3 rounded-xl bg-[#123B50] hover:bg-[#19465B] border border-[#285064] text-xs font-extrabold text-[#F3F7F8] inline-flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isAr ? 'أعد المستوى' : 'Replay Level'}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
