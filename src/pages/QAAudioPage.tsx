import React, { useMemo, useState } from 'react';
import {
  Play,
  Square,
  Download,
  RotateCcw,
  Music,
  Volume2,
  Eye,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Gauge,
} from 'lucide-react';
import {
  AUDIO_MANIFEST,
  AUDIO_MANIFEST_BY_ID,
  AudioAssetCategory,
  MUSIC_TRACKS,
  AMBIENCE_ASSETS,
  SFX_ASSETS,
} from '../data/audioManifest';
import {
  BeatAudioBlock,
  BeatKey,
  DEFAULT_LEVEL_CALM_TRACK,
  DEFAULT_MOOD_TRACK,
  LEVEL_AUDIO_CUE_SHEETS,
  MusicMood,
  OutcomeKey,
} from '../data/audioCueSheet';
import {
  DEFAULT_DUCKING_CONFIG,
  DEFAULT_MIX_SLIDERS,
} from '../data/audioMixConfig';
import { nafasAudio } from '../utils/nafasAudio';

const ALL_LEVEL_IDS = ['A1', 'A2', 'A3', 'A4', 'C1', 'C2', 'C3', 'I1', 'I2', 'I3'];
const BEAT_KEYS: BeatKey[] = ['S1', 'S2', 'S3', 'S4', 'S5'];
const OUTCOME_KEYS: OutcomeKey[] = ['OA1', 'OA2', 'OA3', 'OB', 'OC'];
const ALL_CATEGORIES: AudioAssetCategory[] = [
  'body',
  'rescue',
  'object',
  'environment',
  'arrival',
  'ui',
  'music',
  'ambience',
];

export const QAAudioPage: React.FC = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<string>('A2');
  const [overrides, setOverrides] = useState(() => nafasAudio.getTrackOverrides());
  const [mixSnapshot, setMixSnapshot] = useState(() => nafasAudio.getMixSnapshot());
  const [copiedJson, setCopiedJson] = useState(false);

  const activeSheet = LEVEL_AUDIO_CUE_SHEETS[selectedLevelId];

  const handlePlay = async (id: string, volume = 0.85) => {
    if (playingId === id) {
      nafasAudio.stopAudition();
      setPlayingId(null);
      return;
    }
    setPlayingId(id);
    const ok = await nafasAudio.auditionSound(id, volume);
    if (!ok) {
      setPlayingId(null);
    }
  };

  const handleStop = () => {
    nafasAudio.stopAudition();
    setPlayingId(null);
  };

  const handleLevelTrackChange = (lvl: string, trackId: string) => {
    nafasAudio.setLevelCalmTrackOverride(lvl, trackId);
    setOverrides(nafasAudio.getTrackOverrides());
  };

  const handleMoodTrackChange = (
    mood: Exclude<MusicMood, 'calm'>,
    trackId: string
  ) => {
    nafasAudio.setMoodTrackOverride(mood, trackId);
    setOverrides(nafasAudio.getTrackOverrides());
  };

  const handleResetOverrides = () => {
    nafasAudio.resetTrackOverrides();
    setOverrides(nafasAudio.getTrackOverrides());
  };

  const handleCategoryGainChange = (cat: AudioAssetCategory, db: number) => {
    nafasAudio.setCategoryGainDb(cat, db);
    setMixSnapshot(nafasAudio.getMixSnapshot());
  };

  const handleCueGainChange = (soundId: string, gainDb: number) => {
    nafasAudio.setCueMixOverride(soundId, { gainDb });
    setMixSnapshot(nafasAudio.getMixSnapshot());
  };

  const handleCuePanChange = (soundId: string, pan: number) => {
    nafasAudio.setCueMixOverride(soundId, { pan });
    setMixSnapshot(nafasAudio.getMixSnapshot());
  };

  const handleResetMix = () => {
    nafasAudio.resetMixOverrides();
    setMixSnapshot(nafasAudio.getMixSnapshot());
  };

  const categoryLufsSummary = useMemo(() => {
    const out: Record<
      AudioAssetCategory,
      { count: number; avgLufs: number; maxTp: number }
    > = {} as Record<
      AudioAssetCategory,
      { count: number; avgLufs: number; maxTp: number }
    >;

    ALL_CATEGORIES.forEach((cat) => {
      const items = AUDIO_MANIFEST.filter((a) => a.category === cat);
      const lufsVals = items
        .map((i) => i.integratedLufs)
        .filter((v): v is number => typeof v === 'number' && v > -55);
      const tpVals = items
        .map((i) => i.truePeakDbtp)
        .filter((v): v is number => typeof v === 'number');
      const avgLufs =
        lufsVals.length > 0
          ? Number(
              (lufsVals.reduce((a, b) => a + b, 0) / lufsVals.length).toFixed(2)
            )
          : -23.0;
      const maxTp = tpVals.length > 0 ? Math.max(...tpVals) : -2.0;
      out[cat] = { count: items.length, avgLufs, maxTp };
    });
    return out;
  }, []);

  const handleExportFinalMixJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      normalizationTarget: {
        integratedLufs: -23.0,
        truePeakDbtp: -2.0,
      },
      defaultSliders: DEFAULT_MIX_SLIDERS,
      ducking: DEFAULT_DUCKING_CONFIG,
      measuredCategoryLoudness: categoryLufsSummary,
      mixConfig: mixSnapshot,
      trackOverrides: overrides,
      levelCueSheets: LEVEL_AUDIO_CUE_SHEETS,
      manifestSummary: AUDIO_MANIFEST.map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category,
        durationSec: a.durationSec,
        integratedLufs: a.integratedLufs,
        truePeakDbtp: a.truePeakDbtp,
        lraLu: a.lraLu,
        license: a.license,
        status: a.status,
        file: a.file,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nafas-final-audio-mix-${selectedLevelId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedJson(true);
    window.setTimeout(() => setCopiedJson(false), 2000);
  };

  const stats = useMemo(() => {
    const ready = AUDIO_MANIFEST.filter((a) => a.status === 'ready').length;
    const missing = AUDIO_MANIFEST.filter((a) => a.status !== 'ready').length;
    return { ready, missing, total: AUDIO_MANIFEST.length };
  }, []);

  const renderBlockRow = (label: string, block: BeatAudioBlock) => {
    const resolvedTrack = nafasAudio.resolveTrackForLevelAndMood(
      selectedLevelId,
      block.music.mood
    );
    const trackMeta = AUDIO_MANIFEST_BY_ID[resolvedTrack];
    const ambMeta = AUDIO_MANIFEST_BY_ID[block.ambience.id];

    return (
      <tr key={label} className="border-b border-[#285064]/60 align-top">
        <td className="py-3 px-3 font-mono font-bold text-[#5CE2EA] whitespace-nowrap">
          {label}
        </td>
        <td className="py-3 px-3 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-[#123B50] text-[10px] font-bold uppercase text-[#43C7D1]">
              {block.music.mood}
            </span>
            <span className="text-xs font-semibold text-[#F3F7F8]">
              {trackMeta?.title || resolvedTrack}
            </span>
            <button
              type="button"
              onClick={() => handlePlay(resolvedTrack, block.music.volume)}
              className="p-1 rounded bg-[#123B50] hover:bg-[#13B8B0] hover:text-[#071F2E] text-[#43C7D1] cursor-pointer"
              title="Audition music track"
            >
              <Play className="w-3 h-3 fill-current" />
            </button>
          </div>
          <div className="text-[11px] text-[#A9C0CC] font-mono">
            vol: {block.music.volume} · LP: {block.music.filterHz} Hz · fade:{' '}
            {block.music.fadeSec ?? 1.8}s
          </div>
        </td>
        <td className="py-3 px-3 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#E5F0F4]">{block.ambience.id}</span>
            <button
              type="button"
              onClick={() => handlePlay(block.ambience.id, 0.7)}
              className="p-1 rounded bg-[#123B50] hover:bg-[#13B8B0] hover:text-[#071F2E] text-[#43C7D1] cursor-pointer"
              title={`Audition ${ambMeta?.title || block.ambience.id}`}
            >
              <Play className="w-3 h-3 fill-current" />
            </button>
          </div>
          <div className="text-[11px] text-[#A9C0CC] font-mono">
            vol: {block.ambience.volume} · LP: {block.ambience.filterHz ?? 18000} Hz
          </div>
        </td>
        <td className="py-3 px-3">
          {block.cues.length === 0 ? (
            <span className="text-[11px] italic text-[#8BA8B6]">
              Silent / no timed cues
            </span>
          ) : (
            <div className="space-y-1.5">
              {block.cues.map((cue, idx) => {
                const meta = AUDIO_MANIFEST_BY_ID[cue.sound];
                return (
                  <div
                    key={`${cue.sound}-${idx}`}
                    className="flex flex-wrap items-center gap-1.5 bg-[#071F2E] border border-[#285064] rounded-lg px-2 py-1"
                  >
                    <button
                      type="button"
                      onClick={() => handlePlay(cue.sound, cue.volume)}
                      className="p-1 rounded bg-[#13B8B0]/20 hover:bg-[#13B8B0] hover:text-[#071F2E] text-[#5CE2EA] cursor-pointer"
                      title="Play cue"
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                    <span className="font-mono text-[11px] text-[#F3F7F8]">
                      {cue.sound}
                    </span>
                    <span className="text-[10px] font-mono text-[#43C7D1]">
                      @{cue.at}s · v={cue.volume}
                      {cue.pan ? ` · pan=${cue.pan}` : ''}
                      {cue.loop ? ' · LOOP' : ''}
                    </span>
                    {meta?.isVocal && (
                      <span className="px-1.5 py-0.5 rounded bg-[#E9A23B]/20 text-[#E9A23B] text-[9px] font-bold">
                        VOCAL
                      </span>
                    )}
                    {meta?.isBodySound && (
                      <span className="px-1.5 py-0.5 rounded bg-[#43C7D1]/20 text-[#43C7D1] text-[9px] font-bold">
                        BODY
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </td>
        <td className="py-3 px-3 text-[11px] text-[#B8CDD7] max-w-xs">
          {block.notes}
        </td>
      </tr>
    );
  };

  return (
    <div
      className="min-h-screen bg-[#071F2E] text-[#F3F7F8] p-4 sm:p-6 lg:p-8 space-y-8"
      dir="ltr"
    >
      {/* Top Bar */}
      <header className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 border-b border-[#285064] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#43C7D1] font-bold">
            <a href="/" className="hover:underline">
              ← Home
            </a>
            <span>·</span>
            <a href="/credits" className="hover:underline">
              Public /credits
            </a>
            <span>·</span>
            <a href="/qa" className="hover:underline">
              /qa
            </a>
          </div>
          <h1
            data-testid="qa-audio-heading"
            className="text-2xl sm:text-3xl font-extrabold"
          >
            NAFAS Audio QA, Measured Loudness & Mix Console
          </h1>
          <p className="text-xs sm:text-sm text-[#A9C0CC]">
            All 53 files normalized to -23.0 LUFS / -2.0 dBTP at build time. Tune
            category gains, per-cue gain/pan, audition live, inspect cue sheets, and
            export Final Mix JSON.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B2D40] border border-[#13B8B0]/50 text-xs font-bold text-[#5CE2EA]">
            <CheckCircle2 className="w-4 h-4 text-[#13B8B0]" />
            {stats.ready}/{stats.total} Normalized (-23 LUFS)
          </span>
          {stats.missing > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E9A23B]/20 border border-[#E9A23B] text-xs font-bold text-[#E9A23B]">
              <AlertTriangle className="w-4 h-4" />
              {stats.missing} Missing
            </span>
          )}
          <button
            type="button"
            onClick={handleStop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#123B50] hover:bg-[#19465B] border border-[#285064] text-xs font-bold cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            Stop Audition
          </button>
          <button
            type="button"
            data-testid="qa-audio-export-json"
            onClick={handleExportFinalMixJson}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] text-xs font-extrabold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {copiedJson ? 'Exported Final Mix JSON!' : 'Export Final Mix JSON'}
          </button>
        </div>
      </header>

      {/* Section 0: Measured Loudness & Interactive Mix Table */}
      <section
        data-testid="qa-audio-mix-section"
        className="max-w-7xl mx-auto rounded-2xl bg-[#0B2D40] border border-[#285064] p-5 space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#13B8B0]" />
              <span>1. Measured Loudness & Interactive Mix Console</span>
            </h2>
            <p className="text-xs text-[#A9C0CC] font-mono">
              Auto-Ducking: Music {DEFAULT_DUCKING_CONFIG.musicDuckDb} dB · Ambience{' '}
              {DEFAULT_DUCKING_CONFIG.ambienceDuckDb} dB · Attack{' '}
              {DEFAULT_DUCKING_CONFIG.attackMs} ms · Release{' '}
              {DEFAULT_DUCKING_CONFIG.releaseMs} ms · Default Sliders: Music{' '}
              {Math.round(DEFAULT_MIX_SLIDERS.musicVolume * 100)}% / Effects{' '}
              {Math.round(DEFAULT_MIX_SLIDERS.effectsVolume * 100)}%
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetMix}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#123B50] hover:bg-[#19465B] text-xs font-bold text-[#A9C0CC] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Mix Defaults
          </button>
        </div>

        {/* Category Loudness & Gain Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ALL_CATEGORIES.map((cat) => {
            const summary = categoryLufsSummary[cat];
            const gainDb = mixSnapshot.categoryGainDb[cat] ?? 0;
            const effectiveLufs = Number((summary.avgLufs + gainDb).toFixed(1));
            return (
              <div
                key={cat}
                data-testid={`qa-mix-cat-${cat}`}
                className="rounded-xl bg-[#071F2E] border border-[#285064] p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase text-[#5CE2EA]">
                    {cat} ({summary.count})
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#43C7D1]">
                    {gainDb >= 0 ? `+${gainDb.toFixed(1)}` : gainDb.toFixed(1)} dB
                  </span>
                </div>
                <input
                  type="range"
                  aria-label={`${cat} bus gain in dB`}
                  min={-20}
                  max={6}
                  step={0.5}
                  value={gainDb}
                  onChange={(e) =>
                    handleCategoryGainChange(cat, parseFloat(e.target.value))
                  }
                  className="w-full accent-[#13B8B0] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] font-mono text-[#A9C0CC]">
                  <span>File avg: {summary.avgLufs} LUFS</span>
                  <span>Mix est: {effectiveLufs} LUFS</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Per-Cue Interactive Mix Table */}
        <div className="overflow-x-auto rounded-xl border border-[#285064] max-h-[380px] overflow-y-auto">
          <table className="w-full text-xs text-left" data-testid="qa-cue-mix-table">
            <thead className="bg-[#051C2C] text-[#A9C0CC] border-b border-[#285064] sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3">Cue ID</th>
                <th className="py-2.5 px-3">Measured File</th>
                <th className="py-2.5 px-3">Cue Gain (dB)</th>
                <th className="py-2.5 px-3">Stereo Pan</th>
                <th className="py-2.5 px-3">Jitter / Filter</th>
                <th className="py-2.5 px-3">Duck</th>
                <th className="py-2.5 px-3">Audition</th>
              </tr>
            </thead>
            <tbody>
              {SFX_ASSETS.map((asset) => {
                const entry = mixSnapshot.cueTable[asset.id] ?? {
                  gainDb: 0,
                  pan: 0,
                  pitchJitterPct: 0,
                  gainJitterDb: 0,
                  triggersDuck: false,
                  role: '',
                };
                const isPlaying = playingId === asset.id;
                return (
                  <tr
                    key={asset.id}
                    className="border-b border-[#285064]/50 hover:bg-[#123B50]/35"
                  >
                    <td className="py-2 px-3">
                      <div className="font-mono text-[11px] font-bold text-[#F3F7F8]">
                        {asset.id}
                      </div>
                      <div className="text-[10px] text-[#8BA8B6] truncate max-w-[220px]">
                        {entry.role || asset.title}
                      </div>
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-[#A9C0CC] whitespace-nowrap">
                      <div>
                        {typeof asset.integratedLufs === 'number'
                          ? `${asset.integratedLufs.toFixed(1)} LUFS`
                          : '—'}
                      </div>
                      <div className="text-[10px] text-[#8BA8B6]">
                        TP:{' '}
                        {typeof asset.truePeakDbtp === 'number'
                          ? `${asset.truePeakDbtp.toFixed(1)} dBTP`
                          : '—'}
                      </div>
                    </td>
                    <td className="py-2 px-3 min-w-[155px]">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          aria-label={`${asset.id} gain dB`}
                          min={-12}
                          max={6}
                          step={0.5}
                          value={entry.gainDb}
                          onChange={(e) =>
                            handleCueGainChange(
                              asset.id,
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-24 accent-[#13B8B0] cursor-pointer"
                        />
                        <span className="font-mono text-[11px] text-[#5CE2EA] w-12">
                          {entry.gainDb >= 0
                            ? `+${entry.gainDb.toFixed(1)}`
                            : entry.gainDb.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-3 min-w-[130px]">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          aria-label={`${asset.id} stereo pan`}
                          min={-0.6}
                          max={0.6}
                          step={0.05}
                          value={entry.pan}
                          onChange={(e) =>
                            handleCuePanChange(
                              asset.id,
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-20 accent-[#43C7D1] cursor-pointer"
                        />
                        <span className="font-mono text-[10px] text-[#A9C0CC] w-9">
                          {entry.pan.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-3 font-mono text-[10px] text-[#A9C0CC] whitespace-nowrap">
                      ±{entry.pitchJitterPct}% pitch · ±{entry.gainJitterDb} dB
                      {entry.filterHz ? ` · LP ${entry.filterHz}Hz` : ''}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          entry.triggersDuck
                            ? 'bg-[#13B8B0]/20 text-[#5CE2EA]'
                            : 'bg-[#123B50] text-[#8BA8B6]'
                        }`}
                      >
                        {entry.triggersDuck ? 'YES' : 'NO'}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <button
                        type="button"
                        onClick={() => handlePlay(asset.id, 0.85)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                          isPlaying
                            ? 'bg-[#E9A23B] text-[#071F2E]'
                            : 'bg-[#123B50] hover:bg-[#13B8B0] hover:text-[#071F2E] text-[#5CE2EA]'
                        }`}
                      >
                        {isPlaying ? (
                          <Square className="w-3 h-3 fill-current" />
                        ) : (
                          <Play className="w-3 h-3 fill-current" />
                        )}
                        {isPlaying ? 'Stop' : 'Play'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: Live Track Assignment per Mood & Level */}
      <section className="max-w-7xl mx-auto rounded-2xl bg-[#0B2D40] border border-[#285064] p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-[#13B8B0]" />
            <h2 className="text-lg font-extrabold">
              2. Music Track Assignment (Live Reassignment)
            </h2>
          </div>
          <button
            type="button"
            onClick={handleResetOverrides}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#123B50] hover:bg-[#19465B] text-xs font-bold text-[#A9C0CC] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(['tension', 'hopeful', 'neutral'] as const).map((mood) => {
            const currentId = overrides.mood[mood] || DEFAULT_MOOD_TRACK[mood];
            return (
              <div
                key={mood}
                className="rounded-xl bg-[#071F2E] border border-[#285064] p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase text-[#43C7D1]">
                    Shared {mood} Mood
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePlay(currentId, 0.75)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#123B50] hover:bg-[#13B8B0] hover:text-[#071F2E] text-[11px] font-bold cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Play
                  </button>
                </div>
                <select
                  aria-label={`Track for ${mood} mood`}
                  value={currentId}
                  onChange={(e) => handleMoodTrackChange(mood, e.target.value)}
                  className="w-full rounded-lg bg-[#0B2D40] border border-[#285064] px-2.5 py-1.5 text-xs text-[#F3F7F8]"
                >
                  {MUSIC_TRACKS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.mood})
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {ALL_LEVEL_IDS.map((lvl) => {
            const currentId =
              overrides.levelCalm[lvl] || DEFAULT_LEVEL_CALM_TRACK[lvl];
            return (
              <div
                key={lvl}
                className="rounded-xl bg-[#071F2E] border border-[#285064] p-2.5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#5CE2EA]">
                    {lvl} Calm
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePlay(currentId, 0.75)}
                    className="p-1 rounded bg-[#123B50] hover:bg-[#13B8B0] hover:text-[#071F2E] text-[#43C7D1] cursor-pointer"
                    title={`Audition ${lvl} calm track`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                </div>
                <select
                  aria-label={`Calm track for ${lvl}`}
                  value={currentId}
                  onChange={(e) => handleLevelTrackChange(lvl, e.target.value)}
                  className="w-full rounded-lg bg-[#0B2D40] border border-[#285064] px-2 py-1 text-[11px] text-[#F3F7F8]"
                >
                  {MUSIC_TRACKS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Per-Level Cue-Sheet Viewer */}
      <section className="max-w-7xl mx-auto rounded-2xl bg-[#0B2D40] border border-[#285064] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#13B8B0]" />
              <span>3. Cue-Sheet Viewer — Level {selectedLevelId}</span>
            </h2>
            <p className="text-xs text-[#A9C0CC]">
              Severity:{' '}
              <strong className="text-[#F3F7F8] uppercase">
                {activeSheet.severity}
              </strong>{' '}
              · Age Group:{' '}
              <strong className="text-[#F3F7F8] uppercase">
                {activeSheet.ageGroup}
              </strong>{' '}
              · Ambience:{' '}
              <strong className="text-[#43C7D1]">{activeSheet.ambienceId}</strong>
            </p>
          </div>

          <a
            href={`/?level=${selectedLevelId}&cueOverlay=1`}
            data-testid="qa-play-with-cue-overlay"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#13B8B0] to-[#43C7D1] text-[#071F2E] text-xs font-extrabold shadow-lg"
          >
            <Eye className="w-4 h-4" />
            Play {selectedLevelId} with Cue Overlay
          </a>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ALL_LEVEL_IDS.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setSelectedLevelId(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer border ${
                selectedLevelId === lvl
                  ? 'bg-[#13B8B0] text-[#071F2E] border-[#43C7D1]'
                  : 'bg-[#071F2E] text-[#A9C0CC] border-[#285064] hover:text-[#F3F7F8]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#285064]">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#051C2C] text-[#A9C0CC] border-b border-[#285064]">
              <tr>
                <th className="py-2.5 px-3">Beat / Outcome</th>
                <th className="py-2.5 px-3">Music (Mood / Track / Filter)</th>
                <th className="py-2.5 px-3">Ambience</th>
                <th className="py-2.5 px-3">Timed Cues (Play / Timing / Vol)</th>
                <th className="py-2.5 px-3">Clinical / Sound Notes</th>
              </tr>
            </thead>
            <tbody>
              {BEAT_KEYS.map((b) => renderBlockRow(b, activeSheet.beats[b]))}
              {OUTCOME_KEYS.map((o) => renderBlockRow(o, activeSheet.outcomes[o]))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4: Full Sound Library Audition with Measured LUFS */}
      <section className="max-w-7xl mx-auto rounded-2xl bg-[#0B2D40] border border-[#285064] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-[#43C7D1]" />
          <h2 className="text-lg font-extrabold">
            4. All Self-Hosted Recordings ({stats.total} Files with Measured LUFS)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {[...MUSIC_TRACKS, ...AMBIENCE_ASSETS, ...SFX_ASSETS].map((asset) => {
            const isPlaying = playingId === asset.id;
            return (
              <div
                key={asset.id}
                className="rounded-xl bg-[#071F2E] border border-[#285064] p-3 flex items-start justify-between gap-2.5"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-[11px] font-bold text-[#5CE2EA]">
                      {asset.id}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#123B50] text-[9px] font-bold uppercase text-[#A9C0CC]">
                      {asset.category}
                    </span>
                    {asset.isBodySound && (
                      <span className="px-1.5 py-0.5 rounded bg-[#43C7D1]/20 text-[9px] font-bold text-[#43C7D1]">
                        BODY
                      </span>
                    )}
                    {typeof asset.integratedLufs === 'number' && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#0B2D40] border border-[#285064] font-mono text-[9px] text-[#5CE2EA]">
                        <Gauge className="w-2.5 h-2.5" />
                        {asset.integratedLufs.toFixed(1)} LUFS
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-[#F3F7F8] truncate">
                    {asset.title}
                  </p>
                  <p className="text-[10px] text-[#A9C0CC] truncate">
                    {asset.author} · {asset.license} · {asset.durationSec ?? 0}s
                    {typeof asset.truePeakDbtp === 'number'
                      ? ` · TP ${asset.truePeakDbtp.toFixed(1)} dBTP`
                      : ''}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={asset.status !== 'ready'}
                  onClick={() => handlePlay(asset.id, 0.85)}
                  className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer ${
                    asset.status !== 'ready'
                      ? 'bg-[#E9A23B]/20 text-[#E9A23B] cursor-not-allowed'
                      : isPlaying
                      ? 'bg-[#E9A23B] text-[#071F2E]'
                      : 'bg-[#123B50] hover:bg-[#13B8B0] hover:text-[#071F2E] text-[#5CE2EA]'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-3 h-3 fill-current" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      Play
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
