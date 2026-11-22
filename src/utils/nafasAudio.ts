/**
 * NAFAS Real-Recording Audio Engine (Zero Synthesized Music or Beeps)
 *
 * Uses Web Audio API strictly as a mixer/playback engine for real licensed audio files
 * self-hosted in /public/audio/ (192 kbps MP3 with OGG fallback), all loudness-normalized
 * at build time via ffmpeg loudnorm (-23.0 LUFS integrated, -2.0 dBTP true peak):
 *  - Measured per-category gain hierarchy (effects 0 dB ref, music -9 dB, ambience -13.5 dB)
 *  - Independent auto-ducking: music -6 dB & ambience -8 dB during body/rescue cues
 *    (80 ms attack, 600 ms release)
 *  - Per-cue mix table (gainDb, pan, pitchJitterPct ±3%, gainJitterDb ±1.5 dB, optional LP filter)
 *  - Variation pools (4-5 distinct recordings) with zero immediate repeat
 *  - Strict Medical Rule for Sound (severe silent after onset gasp; unresponsive zero vocals & zero CPR metronome)
 *  - "Body sounds" toggle (default ON, persisted) + one-time sensitivity notice flag
 *  - Live QA track & mix overrides (localStorage) for /qa/audio without code changes
 *  - Tab-hidden automatic fade-out & pause; completely silent on Homepage and Learn pages
 */

import {
  AUDIO_MANIFEST,
  AUDIO_MANIFEST_BY_ID,
  AudioAssetCategory,
  AudioAssetEntry,
} from '../data/audioManifest';
import {
  BeatAudioBlock,
  BeatKey,
  DEFAULT_LEVEL_CALM_TRACK,
  DEFAULT_MOOD_TRACK,
  getLevelAudioCueSheet,
  MusicMood,
  OutcomeKey,
  SOUND_VARIATION_POOLS,
  SoundPoolId,
} from '../data/audioCueSheet';
import {
  CueMixEntry,
  dbToGain,
  DEFAULT_CATEGORY_GAIN_DB,
  DEFAULT_CUE_MIX_TABLE,
  DEFAULT_DUCKING_CONFIG,
  DEFAULT_MIX_SLIDERS,
  DuckingConfig,
} from '../data/audioMixConfig';

export type { MusicMood };

export interface AudioCaptionEvent {
  id: number;
  en: string;
  ar: string;
}

export interface CueFireEvent {
  id: number;
  timestamp: number;
  levelId: string;
  contextKey: string;
  soundId: string;
  title: string;
  category: string;
  volume: number;
  at: number;
  skippedReason?: string;
}

export interface AudioTrackOverrides {
  levelCalm: Record<string, string>;
  mood: Partial<Record<Exclude<MusicMood, 'calm'>, string>>;
}

export interface AudioMixOverrides {
  categoryGainDb: Partial<Record<AudioAssetCategory, number>>;
  cueOverrides: Record<string, Partial<CueMixEntry>>;
}

export interface NafasAudioState {
  muted: boolean;
  musicVolume: number; // 0..1
  effectsVolume: number; // 0..1
  bodySoundsEnabled: boolean; // default true
  bodySoundNoticeSeen: boolean;
  captionsEnabled: boolean; // default false
  voiceOverEnabled: boolean; // default false
  autoplayBlocked: boolean;
  activeLevelId: string | null;
  activeMood: MusicMood;
  activeMusicTrackId: string | null;
  activeAmbienceId: string | null;
}

const STORAGE_KEY = 'nafas_audio_prefs_v4';
const OVERRIDES_STORAGE_KEY = 'nafas_qa_audio_overrides_v1';
const MIX_OVERRIDES_STORAGE_KEY = 'nafas_qa_audio_mix_overrides_v1';

class NafasAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private musicFilter: BiquadFilterNode | null = null;
  private musicDuckGain: GainNode | null = null;
  private ambienceBus: GainNode | null = null;
  private ambienceFilter: BiquadFilterNode | null = null;
  private ambienceDuckGain: GainNode | null = null;
  private sfxBus: GainNode | null = null;

  private bufferCache = new Map<string, AudioBuffer>();
  private loadingPromises = new Map<string, Promise<AudioBuffer | null>>();

  // Currently playing looped sources
  private currentMusicSource: AudioBufferSourceNode | null = null;
  private currentMusicGain: GainNode | null = null;
  private currentMusicTrackId: string | null = null;
  private musicTransitionToken = 0;

  private currentAmbienceSource: AudioBufferSourceNode | null = null;
  private currentAmbienceGain: GainNode | null = null;
  private currentAmbienceId: string | null = null;
  private ambienceTransitionToken = 0;

  // Looping beat cues (e.g. subtle heartbeat tied to falling SpO2)
  private heartbeatTimer: number | null = null;
  private heartbeatActive = false;
  private heartbeatIntervalMs = 1050;
  private heartbeatVolume = 0.42;

  // Scheduled cue timeouts for active beat/outcome
  private cueTimers: number[] = [];

  // Variation pool history (never repeat same clip twice in a row)
  private lastPoolPick = new Map<string, number>();

  // Audition playback reference (for /qa/audio)
  private auditionSource: AudioBufferSourceNode | null = null;

  private state: NafasAudioState;
  private overrides: AudioTrackOverrides;
  private mixOverrides: AudioMixOverrides;
  private stateListeners = new Set<(st: NafasAudioState) => void>();
  private captionListeners = new Set<(evt: AudioCaptionEvent) => void>();
  private cueListeners = new Set<(evt: CueFireEvent) => void>();
  private captionSeq = 1;
  private cueSeq = 1;
  private recentCueLog: CueFireEvent[] = [];
  private currentContextKey = 'IDLE';

  constructor() {
    this.state = this.loadPrefs();
    this.overrides = this.loadOverrides();
    this.mixOverrides = this.loadMixOverrides();

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pauseForHiddenTab();
        } else {
          this.resumeFromHiddenTab();
        }
      });
    }
  }

  // =========================================================================
  // PREFERENCES & QA OVERRIDES
  // =========================================================================
  private loadPrefs(): NafasAudioState {
    const defaults: NafasAudioState = {
      muted: false,
      musicVolume: DEFAULT_MIX_SLIDERS.musicVolume,
      effectsVolume: DEFAULT_MIX_SLIDERS.effectsVolume,
      bodySoundsEnabled: true,
      bodySoundNoticeSeen: false,
      captionsEnabled: false,
      voiceOverEnabled: false,
      autoplayBlocked: false,
      activeLevelId: null,
      activeMood: 'calm',
      activeMusicTrackId: null,
      activeAmbienceId: null,
    };
    if (typeof window === 'undefined') return defaults;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...defaults,
          muted: Boolean(parsed.muted),
          musicVolume:
            typeof parsed.musicVolume === 'number'
              ? Math.max(0, Math.min(1, parsed.musicVolume))
              : defaults.musicVolume,
          effectsVolume:
            typeof parsed.effectsVolume === 'number'
              ? Math.max(0, Math.min(1, parsed.effectsVolume))
              : defaults.effectsVolume,
          bodySoundsEnabled:
            typeof parsed.bodySoundsEnabled === 'boolean'
              ? parsed.bodySoundsEnabled
              : true,
          bodySoundNoticeSeen: Boolean(parsed.bodySoundNoticeSeen),
          captionsEnabled: Boolean(parsed.captionsEnabled),
          voiceOverEnabled: Boolean(parsed.voiceOverEnabled),
        };
      }
    } catch {
      // Ignore storage errors
    }
    return defaults;
  }

  private savePrefs() {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          muted: this.state.muted,
          musicVolume: this.state.musicVolume,
          effectsVolume: this.state.effectsVolume,
          bodySoundsEnabled: this.state.bodySoundsEnabled,
          bodySoundNoticeSeen: this.state.bodySoundNoticeSeen,
          captionsEnabled: this.state.captionsEnabled,
          voiceOverEnabled: this.state.voiceOverEnabled,
        })
      );
    } catch {
      // Ignore storage errors
    }
  }

  private loadOverrides(): AudioTrackOverrides {
    const empty: AudioTrackOverrides = { levelCalm: {}, mood: {} };
    if (typeof window === 'undefined') return empty;
    try {
      const raw = window.localStorage.getItem(OVERRIDES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          levelCalm:
            parsed.levelCalm && typeof parsed.levelCalm === 'object'
              ? parsed.levelCalm
              : {},
          mood: parsed.mood && typeof parsed.mood === 'object' ? parsed.mood : {},
        };
      }
    } catch {
      // Ignore storage errors
    }
    return empty;
  }

  private saveOverrides() {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        OVERRIDES_STORAGE_KEY,
        JSON.stringify(this.overrides)
      );
    } catch {
      // Ignore storage errors
    }
  }

  private loadMixOverrides(): AudioMixOverrides {
    const empty: AudioMixOverrides = { categoryGainDb: {}, cueOverrides: {} };
    if (typeof window === 'undefined') return empty;
    try {
      const raw = window.localStorage.getItem(MIX_OVERRIDES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          categoryGainDb:
            parsed.categoryGainDb && typeof parsed.categoryGainDb === 'object'
              ? parsed.categoryGainDb
              : {},
          cueOverrides:
            parsed.cueOverrides && typeof parsed.cueOverrides === 'object'
              ? parsed.cueOverrides
              : {},
        };
      }
    } catch {
      // Ignore storage errors
    }
    return empty;
  }

  private saveMixOverrides() {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        MIX_OVERRIDES_STORAGE_KEY,
        JSON.stringify(this.mixOverrides)
      );
    } catch {
      // Ignore storage errors
    }
  }

  public getCategoryGainDb(category: AudioAssetCategory): number {
    const override = this.mixOverrides.categoryGainDb[category];
    if (typeof override === 'number' && Number.isFinite(override)) {
      return override;
    }
    return DEFAULT_CATEGORY_GAIN_DB[category] ?? 0;
  }

  public getEffectiveCueMix(soundId: string): CueMixEntry {
    const base: CueMixEntry = DEFAULT_CUE_MIX_TABLE[soundId] ?? {
      gainDb: 0,
      pan: 0,
      pitchJitterPct: 0,
      gainJitterDb: 0,
      triggersDuck: false,
      role: 'Standard cue',
    };
    const patch = this.mixOverrides.cueOverrides[soundId];
    return patch ? { ...base, ...patch } : base;
  }

  public getMixSnapshot(): {
    sliders: { musicVolume: number; effectsVolume: number };
    ducking: DuckingConfig;
    categoryGainDb: Record<AudioAssetCategory, number>;
    cueTable: Record<string, CueMixEntry>;
  } {
    const categoryGainDb = {} as Record<AudioAssetCategory, number>;
    (Object.keys(DEFAULT_CATEGORY_GAIN_DB) as AudioAssetCategory[]).forEach(
      (cat) => {
        categoryGainDb[cat] = this.getCategoryGainDb(cat);
      }
    );
    const cueTable: Record<string, CueMixEntry> = {};
    Object.keys(DEFAULT_CUE_MIX_TABLE).forEach((id) => {
      cueTable[id] = this.getEffectiveCueMix(id);
    });
    return {
      sliders: {
        musicVolume: this.state.musicVolume,
        effectsVolume: this.state.effectsVolume,
      },
      ducking: { ...DEFAULT_DUCKING_CONFIG },
      categoryGainDb,
      cueTable,
    };
  }

  public setCategoryGainDb(category: AudioAssetCategory, db: number) {
    this.mixOverrides.categoryGainDb[category] = Math.max(-24, Math.min(6, db));
    this.saveMixOverrides();
    this.applyBusVolumes(0.12);
    this.emitState();
  }

  public setCueMixOverride(soundId: string, patch: Partial<CueMixEntry>) {
    const current = this.mixOverrides.cueOverrides[soundId] || {};
    this.mixOverrides.cueOverrides[soundId] = { ...current, ...patch };
    this.saveMixOverrides();
    this.emitState();
  }

  public resetMixOverrides() {
    this.mixOverrides = { categoryGainDb: {}, cueOverrides: {} };
    this.saveMixOverrides();
    this.applyBusVolumes(0.15);
    this.emitState();
  }

  public getTrackOverrides(): AudioTrackOverrides {
    return {
      levelCalm: { ...this.overrides.levelCalm },
      mood: { ...this.overrides.mood },
    };
  }

  public setLevelCalmTrackOverride(levelId: string, trackId: string) {
    this.overrides.levelCalm[levelId.toUpperCase()] = trackId;
    this.saveOverrides();
    if (
      this.state.activeLevelId?.toUpperCase() === levelId.toUpperCase() &&
      this.state.activeMood === 'calm'
    ) {
      this.switchMusicTrack(trackId, 0.72, 18000, 1.5);
    }
    this.emitState();
  }

  public setMoodTrackOverride(
    mood: Exclude<MusicMood, 'calm'>,
    trackId: string
  ) {
    this.overrides.mood[mood] = trackId;
    this.saveOverrides();
    if (this.state.activeLevelId && this.state.activeMood === mood) {
      const hz = mood === 'tension' ? 1200 : mood === 'hopeful' ? 20000 : 8500;
      const vol = mood === 'tension' ? 0.5 : mood === 'hopeful' ? 0.78 : 0.58;
      this.switchMusicTrack(trackId, vol, hz, 1.5);
    }
    this.emitState();
  }

  public resetTrackOverrides() {
    this.overrides = { levelCalm: {}, mood: {} };
    this.saveOverrides();
    this.emitState();
  }

  public resolveTrackForLevelAndMood(levelId: string, mood: MusicMood): string {
    const lvl = levelId.toUpperCase();
    if (mood === 'calm') {
      return (
        this.overrides.levelCalm[lvl] ||
        DEFAULT_LEVEL_CALM_TRACK[lvl] ||
        'music_calm_adult_1'
      );
    }
    return this.overrides.mood[mood] || DEFAULT_MOOD_TRACK[mood];
  }

  // =========================================================================
  // STATE SUBSCRIPTIONS & PUBLIC CONTROLS
  // =========================================================================
  public getState(): NafasAudioState {
    return { ...this.state };
  }

  public getRecentCueLog(): CueFireEvent[] {
    return [...this.recentCueLog];
  }

  public subscribeState(fn: (st: NafasAudioState) => void): () => void {
    this.stateListeners.add(fn);
    fn(this.getState());
    return () => this.stateListeners.delete(fn);
  }

  public subscribeCaptions(fn: (evt: AudioCaptionEvent) => void): () => void {
    this.captionListeners.add(fn);
    return () => this.captionListeners.delete(fn);
  }

  public subscribeCues(fn: (evt: CueFireEvent) => void): () => void {
    this.cueListeners.add(fn);
    return () => this.cueListeners.delete(fn);
  }

  private emitState() {
    const snap = this.getState();
    this.stateListeners.forEach((fn) => fn(snap));
  }

  private emitCaption(en: string, ar: string) {
    if (!this.state.captionsEnabled) return;
    const evt: AudioCaptionEvent = { id: this.captionSeq++, en, ar };
    this.captionListeners.forEach((fn) => fn(evt));
  }

  private emitCueFire(
    soundId: string,
    volume: number,
    at: number,
    skippedReason?: string
  ) {
    const meta = AUDIO_MANIFEST_BY_ID[soundId];
    const evt: CueFireEvent = {
      id: this.cueSeq++,
      timestamp: Date.now(),
      levelId: this.state.activeLevelId || 'QA',
      contextKey: this.currentContextKey,
      soundId,
      title: meta?.title || soundId,
      category: meta?.category || 'sfx',
      volume: Number(volume.toFixed(2)),
      at,
      skippedReason,
    };
    this.recentCueLog = [evt, ...this.recentCueLog].slice(0, 30);
    this.cueListeners.forEach((fn) => fn(evt));
  }

  public setMuted(muted: boolean) {
    this.state.muted = muted;
    this.savePrefs();
    this.applyBusVolumes(0.2);
    if (!muted && this.state.activeLevelId) {
      this.unlockAudio();
    }
    this.emitState();
  }

  public toggleMute() {
    this.setMuted(!this.state.muted);
  }

  public setMusicVolume(v: number) {
    this.state.musicVolume = Math.max(0, Math.min(1, v));
    this.savePrefs();
    this.applyBusVolumes(0.15);
    this.emitState();
  }

  public setEffectsVolume(v: number) {
    this.state.effectsVolume = Math.max(0, Math.min(1, v));
    this.savePrefs();
    this.applyBusVolumes(0.15);
    this.emitState();
  }

  public setBodySoundsEnabled(enabled: boolean) {
    this.state.bodySoundsEnabled = enabled;
    this.savePrefs();
    if (!enabled) {
      this.stopHeartbeat();
    }
    this.emitState();
  }

  public dismissBodySoundNotice() {
    if (!this.state.bodySoundNoticeSeen) {
      this.state.bodySoundNoticeSeen = true;
      this.savePrefs();
      this.emitState();
    }
  }

  public setCaptionsEnabled(enabled: boolean) {
    this.state.captionsEnabled = enabled;
    this.savePrefs();
    this.emitState();
  }

  public setVoiceOverEnabled(enabled: boolean) {
    this.state.voiceOverEnabled = enabled;
    this.savePrefs();
    if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.emitState();
  }

  // =========================================================================
  // WEB AUDIO MIXING GRAPH (MEASURED CATEGORY BUSES + INDEPENDENT DUCKING)
  // =========================================================================
  private computeMusicBusGain(): number {
    // At default slider (0.36) and -9 dB offset, music sits ~9 dB below effects (~5 dB quieter than v3)
    const catGain = dbToGain(this.getCategoryGainDb('music'));
    return this.state.musicVolume * catGain * 1.15;
  }

  private computeAmbienceBusGain(): number {
    // Ambience sits 12–15 dB below effects (-13.5 dB default)
    const catGain = dbToGain(this.getCategoryGainDb('ambience'));
    return this.state.effectsVolume * catGain * 1.15;
  }

  private ensureGraph(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.state.muted ? 0 : 1;
      this.masterGain.connect(this.ctx.destination);

      // Independent ducking nodes: Music ducks -6 dB, Ambience ducks -8 dB (80ms attack, 600ms release)
      this.musicDuckGain = this.ctx.createGain();
      this.musicDuckGain.gain.value = 1;
      this.musicDuckGain.connect(this.masterGain);

      this.ambienceDuckGain = this.ctx.createGain();
      this.ambienceDuckGain.gain.value = 1;
      this.ambienceDuckGain.connect(this.masterGain);

      this.musicFilter = this.ctx.createBiquadFilter();
      this.musicFilter.type = 'lowpass';
      this.musicFilter.frequency.value = 18000;
      this.musicFilter.Q.value = 0.7;

      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = this.computeMusicBusGain();
      this.musicBus.connect(this.musicFilter);
      this.musicFilter.connect(this.musicDuckGain);

      this.ambienceFilter = this.ctx.createBiquadFilter();
      this.ambienceFilter.type = 'lowpass';
      this.ambienceFilter.frequency.value = 18000;
      this.ambienceFilter.Q.value = 0.7;

      this.ambienceBus = this.ctx.createGain();
      this.ambienceBus.gain.value = this.computeAmbienceBusGain();
      this.ambienceBus.connect(this.ambienceFilter);
      this.ambienceFilter.connect(this.ambienceDuckGain);

      this.sfxBus = this.ctx.createGain();
      this.sfxBus.gain.value = this.state.effectsVolume;
      this.sfxBus.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx
        .resume()
        .then(() => {
          if (this.state.autoplayBlocked) {
            this.state.autoplayBlocked = false;
            this.emitState();
          }
        })
        .catch(() => {
          if (!this.state.autoplayBlocked) {
            this.state.autoplayBlocked = true;
            this.emitState();
          }
        });
    }
    return this.ctx;
  }

  private applyBusVolumes(rampSec = 0.2) {
    if (
      !this.ctx ||
      !this.masterGain ||
      !this.musicBus ||
      !this.ambienceBus ||
      !this.sfxBus
    ) {
      return;
    }
    const now = this.ctx.currentTime;
    const masterTarget = this.state.muted ? 0 : 1;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(
      masterTarget,
      now,
      Math.max(0.02, rampSec / 3)
    );

    this.musicBus.gain.cancelScheduledValues(now);
    this.musicBus.gain.setTargetAtTime(this.computeMusicBusGain(), now, 0.08);

    this.ambienceBus.gain.cancelScheduledValues(now);
    this.ambienceBus.gain.setTargetAtTime(
      this.computeAmbienceBusGain(),
      now,
      0.08
    );

    this.sfxBus.gain.cancelScheduledValues(now);
    this.sfxBus.gain.setTargetAtTime(this.state.effectsVolume, now, 0.06);
  }

  /**
   * Independent Auto-Ducking:
   *  - Music ducks by -6 dB (gain ~0.501)
   *  - Ambience ducks by -8 dB (gain ~0.398)
   *  - Attack ~80 ms, Release ~600 ms
   */
  private duckBackground(durationSec = 0.85) {
    if (!this.ctx || !this.musicDuckGain || !this.ambienceDuckGain) return;
    const now = this.ctx.currentTime;
    const attackSec = DEFAULT_DUCKING_CONFIG.attackMs / 1000; // 0.08s
    const releaseTau = DEFAULT_DUCKING_CONFIG.releaseMs / 1000 / 3; // ~0.2s time constant => ~600ms full release
    const holdSec = Math.max(0.22, Math.min(1.8, durationSec));

    const musicTarget = dbToGain(DEFAULT_DUCKING_CONFIG.musicDuckDb);
    const ambTarget = dbToGain(DEFAULT_DUCKING_CONFIG.ambienceDuckDb);

    this.musicDuckGain.gain.cancelScheduledValues(now);
    this.musicDuckGain.gain.setValueAtTime(this.musicDuckGain.gain.value, now);
    this.musicDuckGain.gain.linearRampToValueAtTime(musicTarget, now + attackSec);
    this.musicDuckGain.gain.setTargetAtTime(1.0, now + holdSec, releaseTau);

    this.ambienceDuckGain.gain.cancelScheduledValues(now);
    this.ambienceDuckGain.gain.setValueAtTime(
      this.ambienceDuckGain.gain.value,
      now
    );
    this.ambienceDuckGain.gain.linearRampToValueAtTime(ambTarget, now + attackSec);
    this.ambienceDuckGain.gain.setTargetAtTime(1.0, now + holdSec, releaseTau);
  }

  public unlockAudio() {
    const ctx = this.ensureGraph();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx
        .resume()
        .then(() => {
          this.state.autoplayBlocked = false;
          this.applyBusVolumes(0.25);
          this.emitState();
        })
        .catch(() => {
          this.state.autoplayBlocked = true;
          this.emitState();
        });
    } else if (this.state.autoplayBlocked) {
      this.state.autoplayBlocked = false;
      this.emitState();
    }
  }

  private pauseForHiddenTab() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(0, now, 0.12);
    window.setTimeout(() => {
      if (document.hidden && this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend().catch(() => {});
      }
    }, 350);
  }

  private resumeFromHiddenTab() {
    if (!this.ctx || !this.state.activeLevelId) return;
    if (this.ctx.state === 'suspended') {
      this.ctx
        .resume()
        .then(() => this.applyBusVolumes(0.35))
        .catch(() => {});
    } else {
      this.applyBusVolumes(0.35);
    }
  }

  // =========================================================================
  // REAL AUDIO BUFFER LOADER (MP3 PRIMARY + OGG FALLBACK, PRELOAD CACHE)
  // =========================================================================
  private canPlayOgg(): boolean {
    if (typeof document === 'undefined') return false;
    const el = document.createElement('audio');
    return el.canPlayType('audio/ogg; codecs="vorbis"') !== '';
  }

  public async loadBuffer(soundId: string): Promise<AudioBuffer | null> {
    if (this.bufferCache.has(soundId)) {
      return this.bufferCache.get(soundId) || null;
    }
    const existing = this.loadingPromises.get(soundId);
    if (existing) return existing;

    const entry: AudioAssetEntry | undefined = AUDIO_MANIFEST_BY_ID[soundId];
    if (!entry || entry.status !== 'ready' || !entry.file) {
      return null;
    }

    const ctx = this.ensureGraph();
    if (!ctx) return null;

    const promise = (async () => {
      const urls = [entry.file];
      if (entry.oggFile && this.canPlayOgg()) {
        urls.push(entry.oggFile);
      }
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const arrayBuf = await res.arrayBuffer();
          const decoded = await ctx.decodeAudioData(arrayBuf.slice(0));
          this.bufferCache.set(soundId, decoded);
          return decoded;
        } catch {
          // Try fallback format
        }
      }
      return null;
    })();

    this.loadingPromises.set(soundId, promise);
    const result = await promise;
    this.loadingPromises.delete(soundId);
    return result;
  }

  /** Preload all sounds required for a level so interactive taps have zero latency */
  public preloadLevelAssets(levelId: string) {
    const sheet = getLevelAudioCueSheet(levelId);
    const ids = new Set<string>();
    ids.add(this.resolveTrackForLevelAndMood(levelId, 'calm'));
    ids.add(this.resolveTrackForLevelAndMood(levelId, 'tension'));
    ids.add(this.resolveTrackForLevelAndMood(levelId, 'hopeful'));
    ids.add(this.resolveTrackForLevelAndMood(levelId, 'neutral'));
    ids.add(sheet.ambienceId);

    Object.values(sheet.beats).forEach((b) =>
      b.cues.forEach((c) => ids.add(c.sound))
    );
    Object.values(sheet.outcomes).forEach((o) =>
      o.cues.forEach((c) => ids.add(c.sound))
    );

    ids.add(sheet.userActions.hotspotTap);
    ids.add(sheet.userActions.choiceSelect);
    ids.add(sheet.userActions.handPlace);
    ids.add(sheet.userActions.pageTurn);
    ids.add(sheet.userActions.starChime);
    if (sheet.userActions.unresponsiveStep) {
      ids.add(sheet.userActions.unresponsiveStep);
    }
    if (sheet.userActions.backBlowPool) {
      SOUND_VARIATION_POOLS[sheet.userActions.backBlowPool].forEach((id) =>
        ids.add(id)
      );
    }
    if (sheet.userActions.frontThrustPool) {
      SOUND_VARIATION_POOLS[sheet.userActions.frontThrustPool].forEach((id) =>
        ids.add(id)
      );
    }

    ids.forEach((id) => {
      this.loadBuffer(id).catch(() => {});
    });
  }

  // =========================================================================
  // LOOPING MUSIC & AMBIENCE WITH SMOOTH 1–3s CROSSFADES
  // =========================================================================
  private async switchMusicTrack(
    trackId: string,
    volumeMultiplier: number,
    filterHz: number,
    fadeSec = 1.8
  ) {
    const ctx = this.ensureGraph();
    if (!ctx || !this.musicBus || !this.musicFilter) return;

    const now = ctx.currentTime;
    this.musicFilter.frequency.cancelScheduledValues(now);
    this.musicFilter.frequency.setTargetAtTime(
      Math.max(400, Math.min(20000, filterHz)),
      now,
      Math.max(0.25, fadeSec * 0.35)
    );

    if (
      this.currentMusicTrackId === trackId &&
      this.currentMusicSource &&
      this.currentMusicGain
    ) {
      this.currentMusicGain.gain.cancelScheduledValues(now);
      this.currentMusicGain.gain.setTargetAtTime(
        volumeMultiplier,
        now,
        Math.max(0.25, fadeSec * 0.35)
      );
      return;
    }

    const token = ++this.musicTransitionToken;
    const buffer = await this.loadBuffer(trackId);
    if (
      token !== this.musicTransitionToken ||
      !buffer ||
      !this.ctx ||
      !this.musicBus
    ) {
      return;
    }

    const startNow = this.ctx.currentTime;
    if (this.currentMusicSource && this.currentMusicGain) {
      const oldSource = this.currentMusicSource;
      const oldGain = this.currentMusicGain;
      oldGain.gain.cancelScheduledValues(startNow);
      oldGain.gain.setValueAtTime(oldGain.gain.value, startNow);
      oldGain.gain.linearRampToValueAtTime(0.0001, startNow + fadeSec);
      window.setTimeout(() => {
        try {
          oldSource.stop();
          oldSource.disconnect();
          oldGain.disconnect();
        } catch {
          // Already stopped
        }
      }, Math.ceil((fadeSec + 0.15) * 1000));
    }

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const trackGain = this.ctx.createGain();
    trackGain.gain.setValueAtTime(0.0001, startNow);
    trackGain.gain.linearRampToValueAtTime(
      Math.max(0.001, volumeMultiplier),
      startNow + fadeSec
    );

    src.connect(trackGain);
    trackGain.connect(this.musicBus);
    src.start(startNow);

    this.currentMusicSource = src;
    this.currentMusicGain = trackGain;
    this.currentMusicTrackId = trackId;
    this.state.activeMusicTrackId = trackId;
    this.emitState();
  }

  private async switchAmbience(
    ambienceId: string,
    volumeMultiplier: number,
    filterHz = 18000,
    fadeSec = 1.6
  ) {
    const ctx = this.ensureGraph();
    if (!ctx || !this.ambienceBus || !this.ambienceFilter) return;

    const now = ctx.currentTime;
    this.ambienceFilter.frequency.cancelScheduledValues(now);
    this.ambienceFilter.frequency.setTargetAtTime(
      Math.max(500, Math.min(20000, filterHz)),
      now,
      0.35
    );

    if (
      this.currentAmbienceId === ambienceId &&
      this.currentAmbienceSource &&
      this.currentAmbienceGain
    ) {
      this.currentAmbienceGain.gain.cancelScheduledValues(now);
      this.currentAmbienceGain.gain.setTargetAtTime(
        volumeMultiplier,
        now,
        0.35
      );
      return;
    }

    const token = ++this.ambienceTransitionToken;
    const buffer = await this.loadBuffer(ambienceId);
    if (
      token !== this.ambienceTransitionToken ||
      !buffer ||
      !this.ctx ||
      !this.ambienceBus
    ) {
      return;
    }

    const startNow = this.ctx.currentTime;
    if (this.currentAmbienceSource && this.currentAmbienceGain) {
      const oldSrc = this.currentAmbienceSource;
      const oldGain = this.currentAmbienceGain;
      oldGain.gain.cancelScheduledValues(startNow);
      oldGain.gain.setValueAtTime(oldGain.gain.value, startNow);
      oldGain.gain.linearRampToValueAtTime(0.0001, startNow + fadeSec);
      window.setTimeout(() => {
        try {
          oldSrc.stop();
          oldSrc.disconnect();
          oldGain.disconnect();
        } catch {
          // Already stopped
        }
      }, Math.ceil((fadeSec + 0.15) * 1000));
    }

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const ambGain = this.ctx.createGain();
    ambGain.gain.setValueAtTime(0.0001, startNow);
    ambGain.gain.linearRampToValueAtTime(
      Math.max(0.001, volumeMultiplier),
      startNow + fadeSec
    );

    src.connect(ambGain);
    ambGain.connect(this.ambienceBus);
    src.start(startNow);

    this.currentAmbienceSource = src;
    this.currentAmbienceGain = ambGain;
    this.currentAmbienceId = ambienceId;
    this.state.activeAmbienceId = ambienceId;
    this.emitState();
  }

  private clearScheduledCues() {
    this.cueTimers.forEach((id) => window.clearTimeout(id));
    this.cueTimers = [];
  }

  // =========================================================================
  // ONE-SHOT BUFFER PLAYBACK (MEASURED CATEGORY + PER-CUE MIX TABLE + DUCKING)
  // =========================================================================
  public playCueById(
    soundId: string,
    volume = 0.78,
    options?: {
      pan?: number;
      pitchVariation?: boolean;
      gainVariation?: boolean;
      duckBg?: boolean;
      caption?: { en: string; ar: string };
      at?: number;
      bypassBodyToggle?: boolean;
    }
  ) {
    const meta = AUDIO_MANIFEST_BY_ID[soundId];
    if (!meta || meta.status !== 'ready') {
      this.emitCueFire(soundId, volume, options?.at ?? 0, 'missing_asset');
      return;
    }

    // Respect Body Sounds toggle (default ON) for coughs, gasps, cries, breathing, heartbeat
    if (
      meta.isBodySound &&
      !this.state.bodySoundsEnabled &&
      !options?.bypassBodyToggle
    ) {
      this.emitCueFire(soundId, volume, options?.at ?? 0, 'body_sounds_off');
      return;
    }

    if (options?.caption) {
      this.emitCaption(options.caption.en, options.caption.ar);
    }

    const cueMix = this.getEffectiveCueMix(soundId);
    const catGain = dbToGain(this.getCategoryGainDb(meta.category));
    const cueTrimGain = dbToGain(cueMix.gainDb);
    const computedGain = volume * catGain * cueTrimGain;

    this.emitCueFire(soundId, computedGain, options?.at ?? 0);

    if (this.state.muted || this.state.effectsVolume <= 0.005) return;

    const ctx = this.ensureGraph();
    if (!ctx || !this.sfxBus) return;

    const playDecoded = (buf: AudioBuffer) => {
      if (!this.ctx || !this.sfxBus) return;
      const src = this.ctx.createBufferSource();
      src.buffer = buf;

      // Per-cue pitch jitter (e.g. ±3% for rescue variation pools)
      const pitchPct =
        options?.pitchVariation === false ? 0 : cueMix.pitchJitterPct;
      if (pitchPct > 0) {
        const delta = (Math.random() * 2 - 1) * (pitchPct / 100);
        src.playbackRate.value = Math.max(0.85, Math.min(1.15, 1 + delta));
      }

      // Per-cue gain jitter (e.g. ±1.5 dB for repeated thumps)
      const jitterDb =
        options?.gainVariation === false ? 0 : cueMix.gainJitterDb;
      const gainJitter =
        jitterDb > 0 ? dbToGain((Math.random() * 2 - 1) * jitterDb) : 1.0;

      const g = this.ctx.createGain();
      g.gain.value = Math.max(0.01, Math.min(1.6, computedGain * gainJitter));

      let tailNode: AudioNode = src;
      if (cueMix.filterHz && cueMix.filterHz < 16000) {
        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = cueMix.filterHz;
        lp.Q.value = 0.7;
        tailNode.connect(lp);
        tailNode = lp;
      }

      tailNode.connect(g);
      tailNode = g;

      const panVal = typeof options?.pan === 'number' ? options.pan : cueMix.pan;
      if (
        typeof this.ctx.createStereoPanner === 'function' &&
        Math.abs(panVal) > 0.01
      ) {
        const panner = this.ctx.createStereoPanner();
        panner.pan.value = Math.max(-1, Math.min(1, panVal));
        tailNode.connect(panner);
        panner.connect(this.sfxBus);
      } else {
        tailNode.connect(this.sfxBus);
      }

      const shouldDuck =
        options?.duckBg !== undefined ? options.duckBg : cueMix.triggersDuck;
      if (shouldDuck && meta.category !== 'ui') {
        this.duckBackground(Math.min(1.6, buf.duration));
      }

      src.start(this.ctx.currentTime);
    };

    const cached = this.bufferCache.get(soundId);
    if (cached) {
      playDecoded(cached);
    } else {
      this.loadBuffer(soundId).then((buf) => {
        if (buf) playDecoded(buf);
      });
    }
  }

  /** Play a random sound from a variation pool with ZERO immediate repeat + ±3% pitch & ±1.5 dB gain */
  public playFromPool(poolId: SoundPoolId, volume = 0.85) {
    const pool = SOUND_VARIATION_POOLS[poolId].filter(
      (id) => AUDIO_MANIFEST_BY_ID[id]?.status === 'ready'
    );
    if (pool.length === 0) return;

    const prevIdx = this.lastPoolPick.get(poolId) ?? -1;
    let idx = Math.floor(Math.random() * pool.length);
    if (pool.length > 1 && idx === prevIdx) {
      idx =
        (idx + 1 + Math.floor(Math.random() * (pool.length - 1))) % pool.length;
    }
    this.lastPoolPick.set(poolId, idx);

    this.playCueById(pool[idx], volume, {
      pitchVariation: true,
      gainVariation: true,
      duckBg: true,
    });
  }

  // =========================================================================
  // LEVEL LIFECYCLE & CUE-SHEET RUNNER
  // =========================================================================
  public enterLevel(levelId: string) {
    const upper = levelId.toUpperCase();
    const isSame = this.state.activeLevelId === upper;
    this.state.activeLevelId = upper;
    this.currentContextKey = 'ENTER';
    this.unlockAudio();
    this.preloadLevelAssets(upper);

    if (!isSame) {
      const sheet = getLevelAudioCueSheet(upper);
      const trackId = this.resolveTrackForLevelAndMood(upper, 'calm');
      this.state.activeMood = 'calm';
      this.switchMusicTrack(trackId, 0.72, 18000, 1.8);
      this.switchAmbience(sheet.ambienceId, 0.42, 18000, 1.6);
    }
    this.emitState();
  }

  public leaveLevel() {
    this.clearScheduledCues();
    this.stopHeartbeat();
    this.stopAudition();
    this.state.activeLevelId = null;
    this.state.activeMusicTrackId = null;
    this.state.activeAmbienceId = null;
    this.currentContextKey = 'IDLE';

    if (this.ctx) {
      const now = this.ctx.currentTime;
      if (this.currentMusicSource && this.currentMusicGain) {
        const s = this.currentMusicSource;
        const g = this.currentMusicGain;
        g.gain.cancelScheduledValues(now);
        g.gain.setValueAtTime(g.gain.value, now);
        g.gain.linearRampToValueAtTime(0.0001, now + 0.6);
        window.setTimeout(() => {
          try {
            s.stop();
            s.disconnect();
            g.disconnect();
          } catch {}
        }, 700);
      }
      if (this.currentAmbienceSource && this.currentAmbienceGain) {
        const s = this.currentAmbienceSource;
        const g = this.currentAmbienceGain;
        g.gain.cancelScheduledValues(now);
        g.gain.setValueAtTime(g.gain.value, now);
        g.gain.linearRampToValueAtTime(0.0001, now + 0.6);
        window.setTimeout(() => {
          try {
            s.stop();
            s.disconnect();
            g.disconnect();
          } catch {}
        }, 700);
      }
    }
    this.currentMusicSource = null;
    this.currentMusicGain = null;
    this.currentMusicTrackId = null;
    this.currentAmbienceSource = null;
    this.currentAmbienceGain = null;
    this.currentAmbienceId = null;
    this.emitState();
  }

  /** Execute an explicit BeatAudioBlock from audioCueSheet.ts */
  public applyAudioBlock(
    levelId: string,
    contextKey: string,
    block: BeatAudioBlock
  ) {
    this.clearScheduledCues();
    this.currentContextKey = contextKey;

    const trackId = this.resolveTrackForLevelAndMood(levelId, block.music.mood);
    this.state.activeMood = block.music.mood;
    this.switchMusicTrack(
      trackId,
      block.music.volume,
      block.music.filterHz,
      block.music.fadeSec ?? 1.8
    );
    this.switchAmbience(
      block.ambience.id,
      block.ambience.volume,
      block.ambience.filterHz ?? 18000,
      1.5
    );

    let hasLoopingHeartbeat = false;
    block.cues.forEach((cue) => {
      if (cue.loop && cue.sound === 'body_heartbeat_calm') {
        hasLoopingHeartbeat = true;
        this.heartbeatVolume = cue.volume;
        const t = window.setTimeout(() => {
          this.startHeartbeat(this.heartbeatIntervalMs, cue.volume);
        }, Math.max(0, cue.at * 1000));
        this.cueTimers.push(t);
        if (cue.caption) {
          this.emitCaption(cue.caption.en, cue.caption.ar);
        }
        return;
      }

      const t = window.setTimeout(() => {
        this.playCueById(cue.sound, cue.volume, {
          pan: cue.pan,
          caption: cue.caption,
          at: cue.at,
        });
      }, Math.max(0, cue.at * 1000));
      this.cueTimers.push(t);
    });

    if (!hasLoopingHeartbeat) {
      this.stopHeartbeat();
    }

    this.emitState();
  }

  public triggerBeat(levelId: string, beatIndexZeroBased: number) {
    const keys: BeatKey[] = ['S1', 'S2', 'S3', 'S4', 'S5'];
    const key = keys[Math.max(0, Math.min(4, beatIndexZeroBased))];
    const sheet = getLevelAudioCueSheet(levelId);
    this.applyAudioBlock(levelId, key, sheet.beats[key]);
  }

  public triggerOutcome(levelId: string, outcomeKey: OutcomeKey) {
    const sheet = getLevelAudioCueSheet(levelId);
    this.applyAudioBlock(levelId, outcomeKey, sheet.outcomes[outcomeKey]);
  }

  public setMusicMood(mood: MusicMood) {
    const levelId = this.state.activeLevelId || 'A2';
    this.state.activeMood = mood;
    const trackId = this.resolveTrackForLevelAndMood(levelId, mood);
    const filterHz =
      mood === 'tension'
        ? 1200
        : mood === 'hopeful'
        ? 20000
        : mood === 'neutral'
        ? 8500
        : 18000;
    const volume =
      mood === 'tension'
        ? 0.48
        : mood === 'hopeful'
        ? 0.78
        : mood === 'neutral'
        ? 0.56
        : 0.72;
    const fadeSec = mood === 'hopeful' ? 3.5 : 1.8;
    this.switchMusicTrack(trackId, volume, filterHz, fadeSec);
    this.emitState();
  }

  /** Tie slow calm heartbeat pacing & low-pass depth to falling SpO2 (capped calm rate — subtle, never dominant) */
  public updateOxygenTension(spO2: number) {
    if (!this.state.activeLevelId) return;
    const sheet = getLevelAudioCueSheet(this.state.activeLevelId);
    if (sheet.severity !== 'severe') return;

    if (spO2 <= 90) {
      const drop = Math.max(0, 90 - spO2);
      this.heartbeatIntervalMs = Math.max(780, Math.round(1040 - drop * 18));
      this.heartbeatVolume = Math.min(0.48, 0.34 + drop * 0.012);
      if (this.heartbeatActive && this.ctx && this.ambienceFilter) {
        const hz = Math.max(850, 1400 - drop * 45);
        this.ambienceFilter.frequency.setTargetAtTime(
          hz,
          this.ctx.currentTime,
          0.4
        );
      }
    } else if (spO2 >= 95 && this.heartbeatActive) {
      this.stopHeartbeat();
    }
  }

  private startHeartbeat(intervalMs = 1000, volume = 0.4) {
    if (!this.state.bodySoundsEnabled) return;
    this.stopHeartbeat();
    this.heartbeatActive = true;
    this.heartbeatIntervalMs = intervalMs;
    this.heartbeatVolume = volume;

    const pulse = () => {
      if (!this.heartbeatActive || !this.state.bodySoundsEnabled) return;
      this.playCueById('body_heartbeat_calm', this.heartbeatVolume, {
        duckBg: false,
      });
      this.heartbeatTimer = window.setTimeout(pulse, this.heartbeatIntervalMs);
    };
    pulse();
  }

  public stopHeartbeat() {
    this.heartbeatActive = false;
    if (this.heartbeatTimer !== null) {
      window.clearTimeout(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // =========================================================================
  // USER INTERACTION SFX (ZERO-LATENCY REAL RECORDINGS)
  // =========================================================================
  public playPageTurn() {
    this.playCueById('sfx_ui_page', 0.52, { duckBg: false });
  }

  public playRingTick() {
    this.playCueById('sfx_ui_select', 0.62, { duckBg: false });
  }

  public playCardSelect() {
    this.playCueById('sfx_ui_select', 0.66, { duckBg: false });
  }

  public playHandPlacement() {
    this.playCueById('sfx_hand_place', 0.64, { duckBg: false });
  }

  public playBackBlow(_count?: number) {
    const lvl = this.state.activeLevelId || 'A2';
    const sheet = getLevelAudioCueSheet(lvl);
    const pool = sheet.userActions.backBlowPool || 'back_blow_pool';
    this.playFromPool(pool, 0.88);
  }

  public playAbdominalThrust(_count?: number, isChestOrInfant = false) {
    const lvl = this.state.activeLevelId || 'A2';
    const sheet = getLevelAudioCueSheet(lvl);
    const pool =
      sheet.ageGroup === 'infant'
        ? 'infant_thrust_pool'
        : sheet.userActions.frontThrustPool ||
          (isChestOrInfant ? 'thrust_pool' : 'thrust_pool');
    this.playFromPool(pool, 0.88);
  }

  public playUnresponsiveStep() {
    this.playCueById('sfx_aed_beep', 0.54, { duckBg: false });
  }

  public playEmsCall() {
    this.playCueById('sfx_phone_dial', 0.64, {
      caption: { en: 'Calling emergency services', ar: 'جاري الاتصال بالإسعاف' },
    });
  }

  public playStarPing(starIdx = 0) {
    this.playCueById('sfx_ui_star', 0.64 + starIdx * 0.04, {
      pitchVariation: false,
      duckBg: false,
    });
  }

  public playMistakeCue() {
    this.playCueById('sfx_ui_wrong_soft', 0.58, { duckBg: false });
  }

  /** Optional speechSynthesis Voice-Over hook (OFF by default) */
  public speakText(text: string, lang: 'en' | 'ar') {
    if (!this.state.voiceOverEnabled || this.state.muted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang === 'ar' ? 'ar-EG' : 'en-US';
      utter.rate = 0.95;
      window.speechSynthesis.speak(utter);
    } catch {
      // Ignore speech synthesis errors
    }
  }

  // =========================================================================
  // QA AUDITION HELPERS (/qa/audio)
  // =========================================================================
  public stopAudition() {
    if (this.auditionSource) {
      try {
        this.auditionSource.stop();
        this.auditionSource.disconnect();
      } catch {}
      this.auditionSource = null;
    }
  }

  public async auditionSound(soundId: string, volume = 0.85): Promise<boolean> {
    this.stopAudition();
    const entry = AUDIO_MANIFEST_BY_ID[soundId];
    if (!entry || entry.status !== 'ready') return false;

    const ctx = this.ensureGraph();
    if (!ctx || !this.masterGain) return false;
    if (ctx.state === 'suspended') {
      await ctx.resume().catch(() => {});
    }

    const buf = await this.loadBuffer(soundId);
    if (!buf || !this.ctx || !this.masterGain) return false;

    const cueMix = this.getEffectiveCueMix(soundId);
    const catGain =
      entry.category === 'music' || entry.category === 'ambience'
        ? 1.0
        : dbToGain(this.getCategoryGainDb(entry.category));
    const cueTrim = dbToGain(cueMix.gainDb);

    const src = this.ctx.createBufferSource();
    src.buffer = buf;

    const g = this.ctx.createGain();
    g.gain.value = Math.max(0.05, Math.min(1.5, volume * catGain * cueTrim));

    let tail: AudioNode = src;
    if (cueMix.filterHz && cueMix.filterHz < 16000) {
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = cueMix.filterHz;
      tail.connect(lp);
      tail = lp;
    }
    tail.connect(g);
    if (
      typeof this.ctx.createStereoPanner === 'function' &&
      Math.abs(cueMix.pan) > 0.01
    ) {
      const panner = this.ctx.createStereoPanner();
      panner.pan.value = Math.max(-1, Math.min(1, cueMix.pan));
      g.connect(panner);
      panner.connect(this.ctx.destination);
    } else {
      g.connect(this.ctx.destination);
    }

    src.start(this.ctx.currentTime);
    this.auditionSource = src;
    src.onended = () => {
      if (this.auditionSource === src) {
        this.auditionSource = null;
      }
    };
    return true;
  }

  public getAllManifestAssets(): AudioAssetEntry[] {
    return AUDIO_MANIFEST;
  }
}

export const nafasAudio = new NafasAudioEngine();
