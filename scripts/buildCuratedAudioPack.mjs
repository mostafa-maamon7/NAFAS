import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const OUT_ROOT = path.join(ROOT, 'public', 'audio');
const TMP_DIR = '/tmp/nafas_audio_raw';

fs.mkdirSync(path.join(OUT_ROOT, 'music'), { recursive: true });
fs.mkdirSync(path.join(OUT_ROOT, 'ambience'), { recursive: true });
fs.mkdirSync(path.join(OUT_ROOT, 'sfx'), { recursive: true });
fs.mkdirSync(TMP_DIR, { recursive: true });

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 NAFAS-FirstAid/1.0';

function getDurationSec(filePath) {
  try {
    const out = execFileSync(
      'ffprobe',
      [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        filePath,
      ],
      { encoding: 'utf8' }
    ).trim();
    return Number.parseFloat(out) || 0;
  } catch {
    return 0;
  }
}

function transcode(inputPath, outBaseNoExt, opts = {}) {
  const {
    maxDuration = null,
    fadeIn = 0,
    fadeOut = 0,
    targetI = -16,
    trimSilence = false,
    lowpassHz = null,
    volumeDb = 0,
  } = opts;

  const rawDur = getDurationSec(inputPath);
  const effectiveDur =
    maxDuration && rawDur > maxDuration ? maxDuration : rawDur;

  const filters = [];
  if (trimSilence) {
    filters.push('silenceremove=start_periods=1:start_threshold=-42dB:start_silence=0.02');
  }
  if (lowpassHz) {
    filters.push(`lowpass=f=${lowpassHz}`);
  }
  if (volumeDb !== 0) {
    filters.push(`volume=${volumeDb}dB`);
  }
  filters.push(`loudnorm=I=${targetI}:TP=-1.5:LRA=11`);
  if (fadeIn > 0) {
    filters.push(`afade=t=in:st=0:d=${fadeIn}`);
  }
  if (fadeOut > 0 && effectiveDur > fadeOut + 0.1) {
    const startOut = Math.max(0.05, Number((effectiveDur - fadeOut).toFixed(2)));
    filters.push(`afade=t=out:st=${startOut}:d=${fadeOut}`);
  }

  const mp3Out = `${outBaseNoExt}.mp3`;
  const oggOut = `${outBaseNoExt}.ogg`;

  const commonArgs = ['-y', '-i', inputPath];
  if (maxDuration && rawDur > maxDuration) {
    commonArgs.push('-t', String(maxDuration));
  }
  if (filters.length > 0) {
    commonArgs.push('-af', filters.join(','));
  }

  execFileSync(
    'ffmpeg',
    [...commonArgs, '-ar', '44100', '-ac', '2', '-b:a', '192k', mp3Out],
    { stdio: 'pipe' }
  );
  execFileSync(
    'ffmpeg',
    [...commonArgs, '-ar', '44100', '-ac', '2', '-c:a', 'libvorbis', '-q:a', '5', oggOut],
    { stdio: 'pipe' }
  );

  return Number(getDurationSec(mp3Out).toFixed(2));
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
}

// Keep verified Wikimedia Commons entries from previous run
const KEEP_WIKIMEDIA_IDS = new Set([
  'amb_family_dining',
  'amb_office_lounge',
  'amb_school_cafeteria',
  'body_cough_adult_strong',
  'body_cough_child_strong',
  'body_cough_infant',
  'body_cry_infant_loud',
  'body_heartbeat_calm',
  'sfx_chair_scrape',
  'sfx_phone_dial',
  'sfx_ambulance_distant',
  'sfx_ui_page',
]);

// Curated Mixkit studio recordings (Mixkit Sound Effects Free License)
const MIXKIT_CURATED = [
  {
    id: 'amb_home_nursery',
    folder: 'ambience',
    category: 'ambience',
    title: 'Wall clock tick tock',
    mixkitId: 1060,
    pageSlug: 'clock',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 18, fadeIn: 1.2, fadeOut: 1.2, targetI: -24, lowpassHz: 3200 },
  },
  {
    id: 'body_gasp_male',
    folder: 'sfx',
    category: 'body',
    title: 'Male astonished gasp',
    mixkitId: 966,
    pageSlug: 'gasp',
    isVocal: true,
    isBodySound: true,
    transcode: { maxDuration: 1.15, fadeIn: 0.01, fadeOut: 0.14, targetI: -16, trimSilence: true },
  },
  {
    id: 'body_gasp_female',
    folder: 'sfx',
    category: 'body',
    title: 'Female astonished gasp',
    mixkitId: 964,
    pageSlug: 'gasp',
    isVocal: true,
    isBodySound: true,
    transcode: { maxDuration: 1.15, fadeIn: 0.01, fadeOut: 0.14, targetI: -16, trimSilence: true },
  },
  {
    id: 'body_gasp_child',
    folder: 'sfx',
    category: 'body',
    title: 'Female surprised gasp',
    mixkitId: 968,
    pageSlug: 'gasp',
    isVocal: true,
    isBodySound: true,
    transcode: { maxDuration: 1.05, fadeIn: 0.01, fadeOut: 0.14, targetI: -16, trimSilence: true },
  },
  {
    id: 'body_inhale_relief_male',
    folder: 'sfx',
    category: 'body',
    title: 'Strong breathing of a person',
    mixkitId: 2232,
    pageSlug: 'breath',
    isVocal: true,
    isBodySound: true,
    transcode: { maxDuration: 2.6, fadeIn: 0.04, fadeOut: 0.35, targetI: -17, trimSilence: true },
  },
  {
    id: 'body_inhale_relief_female',
    folder: 'sfx',
    category: 'body',
    title: 'Child deep breath',
    mixkitId: 2237,
    pageSlug: 'breath',
    isVocal: true,
    isBodySound: true,
    transcode: { maxDuration: 2.4, fadeIn: 0.04, fadeOut: 0.35, targetI: -17, trimSilence: true },
  },

  // 5 distinct firm padded back blows
  {
    id: 'sfx_back_blow_1',
    folder: 'sfx',
    category: 'rescue',
    title: 'Short slap or clap',
    mixkitId: 2167,
    pageSlug: 'slap',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.5, fadeIn: 0.005, fadeOut: 0.1, targetI: -14, lowpassHz: 1850, trimSilence: true },
  },
  {
    id: 'sfx_back_blow_2',
    folder: 'sfx',
    category: 'rescue',
    title: 'Body punch quick hit',
    mixkitId: 2153,
    pageSlug: 'punch',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.5, fadeIn: 0.005, fadeOut: 0.1, targetI: -14, lowpassHz: 1750, trimSilence: true },
  },
  {
    id: 'sfx_back_blow_3',
    folder: 'sfx',
    category: 'rescue',
    title: 'Soft quick punch',
    mixkitId: 2151,
    pageSlug: 'punch',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.5, fadeIn: 0.005, fadeOut: 0.1, targetI: -14, lowpassHz: 1750, trimSilence: true },
  },
  {
    id: 'sfx_back_blow_4',
    folder: 'sfx',
    category: 'rescue',
    title: 'Impact of a strong punch',
    mixkitId: 2155,
    pageSlug: 'punch',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.5, fadeIn: 0.005, fadeOut: 0.1, targetI: -14, lowpassHz: 1650, trimSilence: true },
  },
  {
    id: 'sfx_back_blow_5',
    folder: 'sfx',
    category: 'rescue',
    title: 'Hard and quick punch',
    mixkitId: 2143,
    pageSlug: 'punch',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.5, fadeIn: 0.005, fadeOut: 0.1, targetI: -14, lowpassHz: 1650, trimSilence: true },
  },

  // 5 distinct firm inward/upward thrusts
  {
    id: 'sfx_thrust_1',
    folder: 'sfx',
    category: 'rescue',
    title: 'Air in a hit',
    mixkitId: 2161,
    pageSlug: 'punch',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.52, fadeIn: 0.005, fadeOut: 0.1, targetI: -14, lowpassHz: 1450, trimSilence: true },
  },
  {
    id: 'sfx_thrust_2',
    folder: 'sfx',
    category: 'rescue',
    title: 'Punch through air',
    mixkitId: 2141,
    pageSlug: 'punch',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.52, fadeIn: 0.005, fadeOut: 0.1, targetI: -14, lowpassHz: 1450, trimSilence: true },
  },
  {
    id: 'sfx_thrust_3',
    folder: 'sfx',
    category: 'rescue',
    title: 'Martial arts fast punch',
    mixkitId: 2047,
    pageSlug: 'punch',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.52, fadeIn: 0.005, fadeOut: 0.1, targetI: -14, lowpassHz: 1350, trimSilence: true },
  },
  {
    id: 'sfx_thrust_4',
    folder: 'sfx',
    category: 'rescue',
    title: 'Strong punches to the body',
    mixkitId: 2198,
    pageSlug: 'punch',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.45, fadeIn: 0.005, fadeOut: 0.08, targetI: -14, lowpassHz: 1300, trimSilence: true },
  },
  {
    id: 'sfx_thrust_5',
    folder: 'sfx',
    category: 'rescue',
    title: 'Drum deep impact',
    mixkitId: 563,
    pageSlug: 'drum',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.52, fadeIn: 0.005, fadeOut: 0.12, targetI: -14, lowpassHz: 1200, trimSilence: true },
  },

  // 4 distinct softer infant back blows
  {
    id: 'sfx_infant_blow_1',
    folder: 'sfx',
    category: 'rescue',
    title: 'Weak hit impact',
    mixkitId: 2148,
    pageSlug: 'punch',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.42, fadeIn: 0.005, fadeOut: 0.1, targetI: -17, lowpassHz: 1350, trimSilence: true },
  },
  {
    id: 'sfx_infant_blow_2',
    folder: 'sfx',
    category: 'rescue',
    title: 'Hand tribal drum',
    mixkitId: 562,
    pageSlug: 'tap',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.42, fadeIn: 0.005, fadeOut: 0.1, targetI: -17, lowpassHz: 1300, trimSilence: true },
  },
  {
    id: 'sfx_infant_blow_3',
    folder: 'sfx',
    category: 'rescue',
    title: 'Tribal dry drum',
    mixkitId: 558,
    pageSlug: 'tap',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.42, fadeIn: 0.005, fadeOut: 0.1, targetI: -17, lowpassHz: 1300, trimSilence: true },
  },
  {
    id: 'sfx_infant_blow_4',
    folder: 'sfx',
    category: 'rescue',
    title: 'Small hit in a game',
    mixkitId: 2072,
    pageSlug: 'punch',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.42, fadeIn: 0.005, fadeOut: 0.1, targetI: -17, lowpassHz: 1250, trimSilence: true },
  },

  // 4 distinct softer infant two-finger chest thrusts
  {
    id: 'sfx_infant_thrust_1',
    folder: 'sfx',
    category: 'rescue',
    title: 'Short bass hit',
    mixkitId: 2299,
    pageSlug: 'drum',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.4, fadeIn: 0.005, fadeOut: 0.1, targetI: -18, lowpassHz: 1100, trimSilence: true },
  },
  {
    id: 'sfx_infant_thrust_2',
    folder: 'sfx',
    category: 'rescue',
    title: 'Deep heartbeat impact',
    mixkitId: 498,
    pageSlug: 'hit',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.42, fadeIn: 0.005, fadeOut: 0.1, targetI: -18, lowpassHz: 1050, trimSilence: true },
  },
  {
    id: 'sfx_infant_thrust_3',
    folder: 'sfx',
    category: 'rescue',
    title: 'Wood hard hit',
    mixkitId: 2182,
    pageSlug: 'hit',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.38, fadeIn: 0.005, fadeOut: 0.1, targetI: -18, lowpassHz: 950, trimSilence: true },
  },
  {
    id: 'sfx_infant_thrust_4',
    folder: 'sfx',
    category: 'rescue',
    title: 'Cinematic mystery trailer drum hit',
    mixkitId: 546,
    pageSlug: 'drum',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.42, fadeIn: 0.005, fadeOut: 0.12, targetI: -18, lowpassHz: 950, trimSilence: true },
  },

  // Object, Environment, Arrival & UI
  {
    id: 'sfx_hand_place',
    folder: 'sfx',
    category: 'rescue',
    title: 'Cloth slide out',
    mixkitId: 1898,
    pageSlug: 'cloth',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.5, fadeIn: 0.01, fadeOut: 0.12, targetI: -18, trimSilence: true },
  },
  {
    id: 'sfx_object_pop',
    folder: 'sfx',
    category: 'object',
    title: 'Dry pop up notification alert',
    mixkitId: 2356,
    pageSlug: 'pop',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.45, fadeIn: 0.005, fadeOut: 0.1, targetI: -15, trimSilence: true },
  },
  {
    id: 'sfx_utensil_drop',
    folder: 'sfx',
    category: 'environment',
    title: 'Stirring cutlery in ceramic plate',
    mixkitId: 2835,
    pageSlug: 'kitchen',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.85, fadeIn: 0.01, fadeOut: 0.15, targetI: -17, trimSilence: true },
  },
  {
    id: 'sfx_body_collapse',
    folder: 'sfx',
    category: 'environment',
    title: 'Fall on foam splash',
    mixkitId: 754,
    pageSlug: 'fall',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.95, fadeIn: 0.01, fadeOut: 0.2, targetI: -16, lowpassHz: 950, trimSilence: true },
  },
  {
    id: 'sfx_aed_beep',
    folder: 'sfx',
    category: 'arrival',
    title: 'Bell notification',
    mixkitId: 933,
    pageSlug: 'notification',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.95, fadeIn: 0.01, fadeOut: 0.18, targetI: -18, trimSilence: true },
  },
  {
    id: 'sfx_ui_select',
    folder: 'sfx',
    category: 'ui',
    title: 'Select click',
    mixkitId: 1109,
    pageSlug: 'click',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.28, fadeIn: 0.005, fadeOut: 0.06, targetI: -18, trimSilence: true },
  },
  {
    id: 'sfx_ui_star',
    folder: 'sfx',
    category: 'ui',
    title: 'Relaxing bell chime',
    mixkitId: 3109,
    pageSlug: 'bell',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 1.5, fadeIn: 0.01, fadeOut: 0.35, targetI: -17, trimSilence: true },
  },
  {
    id: 'sfx_ui_wrong_soft',
    folder: 'sfx',
    category: 'ui',
    title: 'Negative tone interface tap',
    mixkitId: 2569,
    pageSlug: 'drum',
    isVocal: false,
    isBodySound: false,
    transcode: { maxDuration: 0.95, fadeIn: 0.01, fadeOut: 0.25, targetI: -19, lowpassHz: 1800, trimSilence: true },
  },
];

async function run() {
  const prevV2 = JSON.parse(
    fs.readFileSync('/tmp/audio_fetch_report_v2.json', 'utf8')
  );

  const manifestMap = new Map();
  for (const entry of prevV2) {
    if (entry.category === 'music' && entry.status === 'ready') {
      manifestMap.set(entry.id, entry);
    } else if (KEEP_WIKIMEDIA_IDS.has(entry.id) && entry.status === 'ready') {
      manifestMap.set(entry.id, entry);
    }
  }

  console.log(`Kept ${manifestMap.size} verified Kevin MacLeod + Wikimedia recordings.`);

  for (const item of MIXKIT_CURATED) {
    const mp3Url = `https://assets.mixkit.co/active_storage/sfx/${item.mixkitId}/${item.mixkitId}-preview.mp3`;
    const sourceUrl = `https://mixkit.co/free-sound-effects/${item.pageSlug}/`;
    const rawPath = path.join(TMP_DIR, `mixkit_${item.mixkitId}.mp3`);
    const outBase = path.join(OUT_ROOT, item.folder, item.id);

    try {
      if (!fs.existsSync(rawPath)) {
        await downloadFile(mp3Url, rawPath);
      }
      const dur = transcode(rawPath, outBase, item.transcode);
      console.log(`  OK [mixkit #${item.mixkitId}] ${item.id}: "${item.title}" (${dur}s)`);
      manifestMap.set(item.id, {
        id: item.id,
        title: item.title,
        file: `/audio/${item.folder}/${item.id}.mp3`,
        oggFile: `/audio/${item.folder}/${item.id}.ogg`,
        category: item.category,
        levelMapping: ['CUE_SHEET'],
        durationSec: dur,
        sourceUrl,
        author: 'Mixkit Sound Effects Library',
        license: 'Mixkit Sound Effects Free License',
        attribution: `"${item.title}" from Mixkit (${sourceUrl}), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)`,
        status: 'ready',
        isVocal: item.isVocal,
        isBodySound: item.isBodySound,
      });
    } catch (err) {
      console.error(`  FAIL [mixkit #${item.mixkitId}] ${item.id}: ${err.message}`);
    }
  }

  const finalList = Array.from(manifestMap.values());
  const readyCount = finalList.filter((x) => x.status === 'ready').length;
  console.log(`\nTOTAL CURATED REAL AUDIO ASSETS READY: ${readyCount}/${finalList.length}`);

  // Generate /src/data/audioManifest.ts cleanly
  const tsContent = `/**
 * NAFAS Self-Hosted Real Audio Manifest (ZERO synthesized oscillators or beeps)
 *
 * All files are loudness-normalized (EBU R128) and self-hosted in /public/audio/
 * as 192 kbps MP3 with OGG Vorbis fallback.
 *
 * Music: Kevin MacLeod (incompetech.com) — CC BY 4.0
 * Ambience & Clinical Cough/Cry/Heartbeat/Ambulance: Wikimedia Commons (Public Domain / CC BY)
 * Curated Foley, Gasps, Breaths, Rescue Variation Pools & UI: Mixkit Sound Effects Free License
 */

export type AudioAssetCategory =
  | 'music'
  | 'ambience'
  | 'body'
  | 'rescue'
  | 'object'
  | 'environment'
  | 'arrival'
  | 'ui';

export interface AudioAssetEntry {
  id: string;
  title: string;
  file: string;
  oggFile: string;
  category: AudioAssetCategory;
  mood?: 'calm' | 'tension' | 'hopeful' | 'neutral';
  levelMapping: string[];
  durationSec?: number;
  bpm?: number;
  sourceUrl: string;
  author: string;
  license: string;
  attribution: string;
  status: 'ready' | 'missing';
  isVocal: boolean;
  isBodySound: boolean;
  notes?: string;
  searchTerms?: string[];
}

export const AUDIO_MANIFEST: AudioAssetEntry[] = ${JSON.stringify(finalList, null, 2)};

export const AUDIO_MANIFEST_BY_ID: Record<string, AudioAssetEntry> = Object.fromEntries(
  AUDIO_MANIFEST.map((item) => [item.id, item])
);

export const MUSIC_TRACKS: AudioAssetEntry[] = AUDIO_MANIFEST.filter(
  (a) => a.category === 'music'
);

export const AMBIENCE_ASSETS: AudioAssetEntry[] = AUDIO_MANIFEST.filter(
  (a) => a.category === 'ambience'
);

export const SFX_ASSETS: AudioAssetEntry[] = AUDIO_MANIFEST.filter(
  (a) => a.category !== 'music' && a.category !== 'ambience'
);
`;

  fs.writeFileSync(path.join(ROOT, 'src', 'data', 'audioManifest.ts'), tsContent);
  console.log('Wrote src/data/audioManifest.ts successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
