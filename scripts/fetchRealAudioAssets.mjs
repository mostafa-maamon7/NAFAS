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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchBuffer(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'NAFAS-FirstAid-Educational-App/1.0',
    },
    redirect: 'follow',
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'NAFAS-FirstAid-Educational-App/1.0',
      Accept: 'text/html,application/xhtml+xml',
    },
    redirect: 'follow',
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return await res.text();
}

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

function transcodeAudio(inputPath, outBaseNoExt, options = {}) {
  const {
    maxDuration = null,
    fadeIn = 0,
    fadeOut = 0,
    targetI = -16,
    trimSilence = false,
    lowpassHz = null,
    volumeDb = 0,
  } = options;

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
  // EBU R128 loudness normalization (single-pass is great for consistent playback)
  filters.push(`loudnorm=I=${targetI}:TP=-1.5:LRA=11`);
  if (fadeIn > 0) {
    filters.push(`afade=t=in:st=0:d=${fadeIn}`);
  }
  if (fadeOut > 0 && effectiveDur > fadeOut + 0.2) {
    const startOut = Math.max(0.1, Number((effectiveDur - fadeOut).toFixed(2)));
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

  // 192 kbps MP3
  execFileSync(
    'ffmpeg',
    [...commonArgs, '-ar', '44100', '-ac', '2', '-b:a', '192k', mp3Out],
    { stdio: 'pipe' }
  );

  // OGG fallback (Vorbis quality 5 ~ 160-192kbps)
  execFileSync(
    'ffmpeg',
    [...commonArgs, '-ar', '44100', '-ac', '2', '-c:a', 'libvorbis', '-q:a', '5', oggOut],
    { stdio: 'pipe' }
  );

  return {
    mp3Bytes: fs.statSync(mp3Out).size,
    oggBytes: fs.statSync(oggOut).size,
    durationSec: Number(getDurationSec(mp3Out).toFixed(2)),
  };
}

// =========================================================================
// 1. KEVIN MACLEOD (INCOMPETECH.COM) — CC BY 4.0 INSTRUMENTAL MUSIC
// =========================================================================
const MUSIC_SPEC = [
  {
    id: 'music_calm_adult_1',
    title: 'Meditation Impromptu 01',
    filename: 'Meditation Impromptu 01.mp3',
    mood: 'calm',
    levelMapping: ['A1', 'A3'],
    bpm: 60,
    notes: 'Warm gentle piano solo — calm adult scenes A1 & A3',
  },
  {
    id: 'music_calm_adult_2',
    title: 'Immersed',
    filename: 'Immersed.mp3',
    mood: 'calm',
    levelMapping: ['A2', 'A4'],
    bpm: 64,
    notes: 'Warm piano & soft strings — calm adult scenes A2 & A4',
  },
  {
    id: 'music_calm_child_1',
    title: 'Gymnopedie No. 1',
    filename: 'Gymnopedie No 1.mp3',
    mood: 'calm',
    levelMapping: ['C1', 'C3'],
    bpm: 77,
    notes: 'Gentle classical piano — calm child scenes C1 & C3',
  },
  {
    id: 'music_calm_child_2',
    title: 'Water Lily',
    filename: 'Water Lily.mp3',
    mood: 'calm',
    levelMapping: ['C2'],
    bpm: 62,
    notes: 'Warm piano & soft cellos — calm child scene C2',
  },
  {
    id: 'music_calm_infant_1',
    title: 'Avec Soin',
    filename: 'Avec Soin.mp3',
    mood: 'calm',
    levelMapping: ['I1', 'I3'],
    bpm: 64,
    notes: 'Gentle lullaby-like piano — calm infant scenes I1 & I3',
  },
  {
    id: 'music_calm_infant_2',
    title: 'Meditation Impromptu 02',
    filename: 'Meditation Impromptu 02.mp3',
    mood: 'calm',
    levelMapping: ['I2'],
    bpm: 58,
    notes: 'Soft lullaby piano — calm infant scene I2',
  },
  {
    id: 'music_tension',
    title: 'Disquiet',
    filename: 'Disquiet.mp3',
    mood: 'tension',
    levelMapping: ['ALL'],
    bpm: 70,
    notes: 'Subtle somber piano tension bed (played at -6 dB with ~1.2 kHz low-pass)',
  },
  {
    id: 'music_hopeful',
    title: 'Reawakening',
    filename: 'Reawakening.mp3',
    mood: 'hopeful',
    levelMapping: ['ALL'],
    bpm: 56,
    notes: 'Warm hopeful piano & cello — opens gently over 3-4s on rescue success',
  },
  {
    id: 'music_neutral',
    title: 'Calmant',
    filename: 'Calmant.mp3',
    mood: 'neutral',
    levelMapping: ['ALL'],
    bpm: 58,
    notes: 'Soft neutral piano reflection — non-punitive wrong-choice debrief',
  },
];

// =========================================================================
// 2. FREESOUND.ORG REAL RECORDINGS SEARCH (CC0 FIRST, CC-BY FALLBACK)
// =========================================================================
function parseFreesoundSearchHtml(html) {
  const results = [];
  // Each player card has data-mp3, data-ogg, data-title, data-sound-id, data-duration and author link
  const playerRegex =
    /<div class="bw-player"[^>]*data-mp3="([^"]+)"[^>]*data-ogg="([^"]+)"[^>]*data-title="([^"]+)"[^>]*data-sound-id="(\d+)"[^>]*data-duration="([^"]+)"/g;
  let match;
  while ((match = playerRegex.exec(html)) !== null) {
    const [, mp3Url, oggUrl, titleRaw, soundId, durStr] = match;
    // Find nearby author link in the surrounding ~1400 chars
    const slice = html.slice(match.index, match.index + 2400);
    const authorMatch = slice.match(/href="\/people\/([^/"]+)\/sounds\/\d+\/"/) ||
      slice.match(/href="\/people\/([^/"]+)\/"/);
    const author = authorMatch ? decodeURIComponent(authorMatch[1]) : 'Freesound Contributor';
    const duration = Number.parseFloat(durStr) || 0;
    const title = titleRaw
      .replace(/&amp;/g, '&')
      .replace(/&#x27;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    if (mp3Url && soundId) {
      results.push({
        soundId,
        title,
        author,
        duration,
        mp3Url,
        oggUrl,
        sourceUrl: `https://freesound.org/people/${encodeURIComponent(author)}/sounds/${soundId}/`,
      });
    }
  }
  return results;
}

async function searchFreesound(query, licenseFilter, minDur, maxDur, excludeIds = new Set()) {
  const params = new URLSearchParams({
    q: query,
    f: `license:"${licenseFilter}" duration:[${minDur} TO ${maxDur}]`,
    s: 'Downloads (high-low)',
  });
  const url = `https://freesound.org/search/?${params.toString()}`;
  const html = await fetchText(url);
  const items = parseFreesoundSearchHtml(html).filter((item) => !excludeIds.has(item.soundId));
  return items;
}

const SFX_SPEC = [
  // Ambience loops
  {
    id: 'amb_family_dining',
    folder: 'ambience',
    category: 'ambience',
    isVocal: false,
    isBodySound: false,
    queries: ['dinner table ambience room', 'restaurant dining quiet ambience', 'kitchen room tone ambience'],
    minDur: 8,
    maxDur: 180,
    transcode: { maxDuration: 24, fadeIn: 1.5, fadeOut: 1.5, targetI: -22 },
  },
  {
    id: 'amb_office_lounge',
    folder: 'ambience',
    category: 'ambience',
    isVocal: false,
    isBodySound: false,
    queries: ['office room tone quiet ambience', 'indoor room tone quiet'],
    minDur: 8,
    maxDur: 180,
    transcode: { maxDuration: 24, fadeIn: 1.5, fadeOut: 1.5, targetI: -22 },
  },
  {
    id: 'amb_school_cafeteria',
    folder: 'ambience',
    category: 'ambience',
    isVocal: false,
    isBodySound: false,
    queries: ['cafeteria chatter ambience', 'school hallway ambience', 'cafe murmur soft ambience'],
    minDur: 8,
    maxDur: 180,
    transcode: { maxDuration: 24, fadeIn: 1.5, fadeOut: 1.5, targetI: -22 },
  },
  {
    id: 'amb_home_nursery',
    folder: 'ambience',
    category: 'ambience',
    isVocal: false,
    isBodySound: false,
    queries: ['quiet bedroom room tone', 'soft home room ambience', 'clock ticking quiet room'],
    minDur: 8,
    maxDur: 180,
    transcode: { maxDuration: 24, fadeIn: 1.5, fadeOut: 1.5, targetI: -22 },
  },

  // Body & Vocal sounds (non-graphic real recordings)
  {
    id: 'body_cough_adult_strong',
    folder: 'sfx',
    category: 'body',
    isVocal: true,
    isBodySound: true,
    queries: ['man cough', 'male cough single', 'adult cough'],
    minDur: 0.4,
    maxDur: 5.5,
    transcode: { maxDuration: 2.8, fadeIn: 0.02, fadeOut: 0.15, targetI: -16, trimSilence: true },
  },
  {
    id: 'body_cough_child_strong',
    folder: 'sfx',
    category: 'body',
    isVocal: true,
    isBodySound: true,
    queries: ['child cough', 'kid cough', 'young cough', 'cough light'],
    minDur: 0.4,
    maxDur: 5.5,
    transcode: { maxDuration: 2.6, fadeIn: 0.02, fadeOut: 0.15, targetI: -16, trimSilence: true },
  },
  {
    id: 'body_cough_infant',
    folder: 'sfx',
    category: 'body',
    isVocal: true,
    isBodySound: true,
    queries: ['baby cough', 'infant cough', 'toddler cough'],
    minDur: 0.4,
    maxDur: 6.0,
    transcode: { maxDuration: 2.5, fadeIn: 0.02, fadeOut: 0.15, targetI: -16, trimSilence: true },
  },
  {
    id: 'body_cry_infant_loud',
    folder: 'sfx',
    category: 'body',
    isVocal: true,
    isBodySound: true,
    queries: ['baby cry short', 'infant crying', 'baby crying'],
    minDur: 0.8,
    maxDur: 12.0,
    transcode: { maxDuration: 3.2, fadeIn: 0.08, fadeOut: 0.45, targetI: -17, trimSilence: true },
  },
  {
    id: 'body_gasp_male',
    folder: 'sfx',
    category: 'body',
    isVocal: true,
    isBodySound: true,
    queries: ['male gasp', 'man gasp breath', 'gasp inhale'],
    minDur: 0.3,
    maxDur: 4.0,
    transcode: { maxDuration: 1.4, fadeIn: 0.02, fadeOut: 0.15, targetI: -16, trimSilence: true },
  },
  {
    id: 'body_gasp_female',
    folder: 'sfx',
    category: 'body',
    isVocal: true,
    isBodySound: true,
    queries: ['female gasp', 'woman gasp', 'girl gasp inhale'],
    minDur: 0.3,
    maxDur: 4.0,
    transcode: { maxDuration: 1.4, fadeIn: 0.02, fadeOut: 0.15, targetI: -16, trimSilence: true },
  },
  {
    id: 'body_gasp_child',
    folder: 'sfx',
    category: 'body',
    isVocal: true,
    isBodySound: true,
    queries: ['short gasp breath', 'sharp inhale breath', 'gasp surprise'],
    minDur: 0.3,
    maxDur: 4.0,
    transcode: { maxDuration: 1.3, fadeIn: 0.02, fadeOut: 0.15, targetI: -16, trimSilence: true },
  },
  {
    id: 'body_inhale_relief_male',
    folder: 'sfx',
    category: 'body',
    isVocal: true,
    isBodySound: true,
    queries: ['deep breath relief male', 'sigh of relief man', 'deep inhale exhale'],
    minDur: 0.8,
    maxDur: 8.0,
    transcode: { maxDuration: 3.2, fadeIn: 0.05, fadeOut: 0.35, targetI: -17, trimSilence: true },
  },
  {
    id: 'body_inhale_relief_female',
    folder: 'sfx',
    category: 'body',
    isVocal: true,
    isBodySound: true,
    queries: ['female sigh relief', 'woman exhale relief', 'sigh breath exhale'],
    minDur: 0.8,
    maxDur: 8.0,
    transcode: { maxDuration: 3.0, fadeIn: 0.05, fadeOut: 0.35, targetI: -17, trimSilence: true },
  },
  {
    id: 'body_heartbeat_calm',
    folder: 'sfx',
    category: 'body',
    isVocal: false,
    isBodySound: true,
    queries: ['heartbeat single', 'heart beat thump', 'heartbeat slow'],
    minDur: 0.5,
    maxDur: 15.0,
    transcode: { maxDuration: 1.15, fadeIn: 0.02, fadeOut: 0.12, targetI: -16, lowpassHz: 320, trimSilence: true },
  },

  // Rescue action pools (distinct real recordings per slot!)
  ...[1, 2, 3, 4, 5].map((n) => ({
    id: `sfx_back_blow_${n}`,
    folder: 'sfx',
    category: 'rescue',
    isVocal: false,
    isBodySound: false,
    queries: ['slap cushion thud', 'hand hit pillow thump', 'body thud dull', 'pat back slap'],
    minDur: 0.12,
    maxDur: 2.5,
    pickIndex: n - 1,
    transcode: { maxDuration: 0.65, fadeIn: 0.005, fadeOut: 0.1, targetI: -14, lowpassHz: 1800, trimSilence: true },
  })),
  ...[1, 2, 3, 4, 5].map((n) => ({
    id: `sfx_thrust_${n}`,
    folder: 'sfx',
    category: 'rescue',
    isVocal: false,
    isBodySound: false,
    queries: ['soft thump punch bag', 'muffled thud hit', 'cushion thump', 'whoosh thud'],
    minDur: 0.12,
    maxDur: 2.5,
    pickIndex: n - 1,
    transcode: { maxDuration: 0.65, fadeIn: 0.005, fadeOut: 0.1, targetI: -14, lowpassHz: 1350, trimSilence: true },
  })),
  ...[1, 2, 3, 4].map((n) => ({
    id: `sfx_infant_blow_${n}`,
    folder: 'sfx',
    category: 'rescue',
    isVocal: false,
    isBodySound: false,
    queries: ['soft pat tap cloth', 'gentle hand tap pillow', 'soft muffled tap'],
    minDur: 0.1,
    maxDur: 2.5,
    pickIndex: n - 1,
    transcode: { maxDuration: 0.55, fadeIn: 0.005, fadeOut: 0.1, targetI: -16, lowpassHz: 1500, trimSilence: true },
  })),
  ...[1, 2, 3, 4].map((n) => ({
    id: `sfx_infant_thrust_${n}`,
    folder: 'sfx',
    category: 'rescue',
    isVocal: false,
    isBodySound: false,
    queries: ['finger tap soft cushion', 'soft press thump', 'fabric press muffled'],
    minDur: 0.1,
    maxDur: 2.5,
    pickIndex: n - 1,
    transcode: { maxDuration: 0.5, fadeIn: 0.005, fadeOut: 0.1, targetI: -17, lowpassHz: 1200, trimSilence: true },
  })),

  // Object, Environment, Arrival & UI sounds
  {
    id: 'sfx_hand_place',
    folder: 'sfx',
    category: 'rescue',
    isVocal: false,
    isBodySound: false,
    queries: ['cloth rustle short', 'fabric brush hand', 'clothing movement soft'],
    minDur: 0.15,
    maxDur: 3.0,
    transcode: { maxDuration: 0.6, fadeIn: 0.01, fadeOut: 0.12, targetI: -18, trimSilence: true },
  },
  {
    id: 'sfx_object_pop',
    folder: 'sfx',
    category: 'object',
    isVocal: false,
    isBodySound: false,
    queries: ['mouth pop', 'cork pop soft', 'small pop'],
    minDur: 0.08,
    maxDur: 2.0,
    transcode: { maxDuration: 0.55, fadeIn: 0.005, fadeOut: 0.1, targetI: -15, trimSilence: true },
  },
  {
    id: 'sfx_chair_scrape',
    folder: 'sfx',
    category: 'environment',
    isVocal: false,
    isBodySound: false,
    queries: ['chair scrape wooden floor', 'chair drag wood', 'wooden chair move'],
    minDur: 0.3,
    maxDur: 4.0,
    transcode: { maxDuration: 1.2, fadeIn: 0.02, fadeOut: 0.2, targetI: -17, trimSilence: true },
  },
  {
    id: 'sfx_utensil_drop',
    folder: 'sfx',
    category: 'environment',
    isVocal: false,
    isBodySound: false,
    queries: ['fork drop plate', 'cutlery clink table', 'spoon clink ceramic'],
    minDur: 0.15,
    maxDur: 3.0,
    transcode: { maxDuration: 0.9, fadeIn: 0.005, fadeOut: 0.15, targetI: -17, trimSilence: true },
  },
  {
    id: 'sfx_body_collapse',
    folder: 'sfx',
    category: 'environment',
    isVocal: false,
    isBodySound: false,
    queries: ['soft thud fall carpet', 'body fall soft thud', 'heavy cloth drop thud'],
    minDur: 0.25,
    maxDur: 3.5,
    transcode: { maxDuration: 1.1, fadeIn: 0.01, fadeOut: 0.2, targetI: -16, lowpassHz: 1100, trimSilence: true },
  },
  {
    id: 'sfx_phone_dial',
    folder: 'sfx',
    category: 'arrival',
    isVocal: false,
    isBodySound: false,
    queries: ['phone dial tone beep', 'smartphone dial button', 'telephone keypad dial'],
    minDur: 0.3,
    maxDur: 6.0,
    transcode: { maxDuration: 1.5, fadeIn: 0.02, fadeOut: 0.2, targetI: -18, trimSilence: true },
  },
  {
    id: 'sfx_aed_beep',
    folder: 'sfx',
    category: 'arrival',
    isVocal: false,
    isBodySound: false,
    queries: ['medical monitor soft chime', 'soft electronic chime notification', 'calm double chime'],
    minDur: 0.2,
    maxDur: 4.0,
    transcode: { maxDuration: 1.1, fadeIn: 0.01, fadeOut: 0.15, targetI: -18, trimSilence: true },
  },
  {
    id: 'sfx_ambulance_distant',
    folder: 'sfx',
    category: 'arrival',
    isVocal: false,
    isBodySound: false,
    queries: ['distant ambulance siren', 'far away ambulance siren', 'ambulance siren distant city'],
    minDur: 2.0,
    maxDur: 40.0,
    transcode: { maxDuration: 5.5, fadeIn: 1.2, fadeOut: 1.8, targetI: -24, lowpassHz: 1400 },
  },
  {
    id: 'sfx_ui_page',
    folder: 'sfx',
    category: 'ui',
    isVocal: false,
    isBodySound: false,
    queries: ['page turn soft', 'paper flip gentle', 'book page turn'],
    minDur: 0.15,
    maxDur: 2.5,
    transcode: { maxDuration: 0.6, fadeIn: 0.01, fadeOut: 0.12, targetI: -19, trimSilence: true },
  },
  {
    id: 'sfx_ui_select',
    folder: 'sfx',
    category: 'ui',
    isVocal: false,
    isBodySound: false,
    queries: ['soft wooden click ui', 'gentle wood tap', 'soft button click'],
    minDur: 0.05,
    maxDur: 1.5,
    transcode: { maxDuration: 0.35, fadeIn: 0.005, fadeOut: 0.08, targetI: -18, trimSilence: true },
  },
  {
    id: 'sfx_ui_star',
    folder: 'sfx',
    category: 'ui',
    isVocal: false,
    isBodySound: false,
    queries: ['soft chime bell acoustic', 'warm kalimba note', 'harp chime gentle'],
    minDur: 0.3,
    maxDur: 4.5,
    transcode: { maxDuration: 1.6, fadeIn: 0.01, fadeOut: 0.35, targetI: -17, trimSilence: true },
  },
  {
    id: 'sfx_ui_wrong_soft',
    folder: 'sfx',
    category: 'ui',
    isVocal: false,
    isBodySound: false,
    queries: ['soft low piano note', 'gentle wood marimba low', 'soft muted thud ui'],
    minDur: 0.2,
    maxDur: 4.0,
    transcode: { maxDuration: 1.2, fadeIn: 0.01, fadeOut: 0.3, targetI: -19, trimSilence: true },
  },
];

async function run() {
  const manifest = [];
  const usedFreesoundIds = new Set();

  console.log('=== 1. Downloading & normalizing Kevin MacLeod CC BY 4.0 music ===');
  for (const track of MUSIC_SPEC) {
    const rawUrl = `https://incompetech.com/music/royalty-free/mp3-royaltyfree/${encodeURIComponent(
      track.filename
    ).replace(/%20/g, '%20')}`;
    const rawPath = path.join(TMP_DIR, `${track.id}_raw.mp3`);
    const outBase = path.join(OUT_ROOT, 'music', track.id);

    try {
      if (!fs.existsSync(rawPath)) {
        console.log(`Downloading ${track.title}...`);
        const buf = await fetchBuffer(rawUrl);
        fs.writeFileSync(rawPath, buf);
      }
      const stats = transcodeAudio(rawPath, outBase, {
        maxDuration: 84,
        fadeIn: 1.5,
        fadeOut: 3.0,
        targetI: -18,
      });
      console.log(
        `  OK ${track.id}: "${track.title}" (${stats.durationSec}s, mp3=${Math.round(
          stats.mp3Bytes / 1024
        )}KB, ogg=${Math.round(stats.oggBytes / 1024)}KB)`
      );
      manifest.push({
        id: track.id,
        title: track.title,
        file: `/audio/music/${track.id}.mp3`,
        oggFile: `/audio/music/${track.id}.ogg`,
        category: 'music',
        mood: track.mood,
        levelMapping: track.levelMapping,
        durationSec: stats.durationSec,
        bpm: track.bpm,
        sourceUrl: 'https://incompetech.com/music/royalty-free/music.html',
        downloadUrl: rawUrl,
        author: 'Kevin MacLeod (incompetech.com)',
        license: 'CC BY 4.0',
        attribution: `"${track.title}" by Kevin MacLeod (incompetech.com), licensed under Creative Commons: By Attribution 4.0 License (http://creativecommons.org/licenses/by/4.0/)`,
        status: 'ready',
        isVocal: false,
        isBodySound: false,
        notes: track.notes,
      });
    } catch (err) {
      console.error(`  FAIL ${track.id}: ${err.message}`);
      manifest.push({
        id: track.id,
        title: track.title,
        file: '',
        oggFile: '',
        category: 'music',
        mood: track.mood,
        levelMapping: track.levelMapping,
        sourceUrl: rawUrl,
        author: 'Kevin MacLeod (incompetech.com)',
        license: 'CC BY 4.0',
        attribution: `"${track.title}" by Kevin MacLeod (incompetech.com), licensed under Creative Commons: By Attribution 4.0 License (http://creativecommons.org/licenses/by/4.0/)`,
        status: 'missing',
        isVocal: false,
        isBodySound: false,
        searchTerms: [track.title, 'incompetech.com'],
      });
    }
  }

  console.log('\n=== 2. Downloading & normalizing Freesound CC0 / CC-BY recordings ===');
  const queryCache = new Map();

  for (const item of SFX_SPEC) {
    let picked = null;
    let pickedLicense = '';

    for (const license of ['Creative Commons 0', 'Attribution']) {
      for (const q of item.queries) {
        const cacheKey = `${license}|${q}|${item.minDur}|${item.maxDur}`;
        let list = queryCache.get(cacheKey);
        if (!list) {
          try {
            await sleep(160);
            list = await searchFreesound(q, license, item.minDur, item.maxDur);
            queryCache.set(cacheKey, list);
          } catch (err) {
            console.warn(`  Search error for "${q}" (${license}): ${err.message}`);
            list = [];
          }
        }

        const available = list.filter((c) => !usedFreesoundIds.has(c.soundId));
        if (available.length > 0) {
          picked = available[0];
          pickedLicense = license === 'Creative Commons 0' ? 'CC0 1.0' : 'CC BY 4.0';
          break;
        }
      }
      if (picked) break;
    }

    if (!picked) {
      console.warn(`  MISSING ${item.id} (queries: ${item.queries.join(' | ')})`);
      manifest.push({
        id: item.id,
        title: item.id,
        file: '',
        oggFile: '',
        category: item.category,
        levelMapping: ['CUE_SHEET'],
        sourceUrl: '',
        author: '',
        license: '',
        attribution: '',
        status: 'missing',
        isVocal: item.isVocal,
        isBodySound: item.isBodySound,
        searchTerms: item.queries,
      });
      continue;
    }

    usedFreesoundIds.add(picked.soundId);
    const rawPath = path.join(TMP_DIR, `${item.id}_raw.mp3`);
    const outBase = path.join(OUT_ROOT, item.folder, item.id);

    try {
      const buf = await fetchBuffer(picked.mp3Url);
      fs.writeFileSync(rawPath, buf);
      const stats = transcodeAudio(rawPath, outBase, item.transcode);
      console.log(
        `  OK ${item.id}: "${picked.title}" by ${picked.author} [${pickedLicense}] (${stats.durationSec}s)`
      );
      const attribution =
        pickedLicense === 'CC0 1.0'
          ? `"${picked.title}" by ${picked.author} on Freesound (${picked.sourceUrl}), CC0 1.0 Public Domain`
          : `"${picked.title}" by ${picked.author} on Freesound (${picked.sourceUrl}), licensed under Creative Commons Attribution (https://creativecommons.org/licenses/by/4.0/)`;
      manifest.push({
        id: item.id,
        title: picked.title,
        file: `/audio/${item.folder}/${item.id}.mp3`,
        oggFile: `/audio/${item.folder}/${item.id}.ogg`,
        category: item.category,
        levelMapping: ['CUE_SHEET'],
        durationSec: stats.durationSec,
        sourceUrl: picked.sourceUrl,
        author: picked.author,
        license: pickedLicense,
        attribution,
        status: 'ready',
        isVocal: item.isVocal,
        isBodySound: item.isBodySound,
      });
    } catch (err) {
      console.error(`  FAIL download/transcode ${item.id}: ${err.message}`);
      manifest.push({
        id: item.id,
        title: picked.title,
        file: '',
        oggFile: '',
        category: item.category,
        levelMapping: ['CUE_SHEET'],
        sourceUrl: picked.sourceUrl,
        author: picked.author,
        license: pickedLicense,
        attribution: '',
        status: 'missing',
        isVocal: item.isVocal,
        isBodySound: item.isBodySound,
        searchTerms: item.queries,
      });
    }
  }

  fs.writeFileSync('/tmp/audio_fetch_report.json', JSON.stringify(manifest, null, 2));
  const readyCount = manifest.filter((m) => m.status === 'ready').length;
  const missingCount = manifest.filter((m) => m.status === 'missing').length;
  console.log(`\nDONE: ${readyCount} ready, ${missingCount} missing. Saved /tmp/audio_fetch_report.json`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
