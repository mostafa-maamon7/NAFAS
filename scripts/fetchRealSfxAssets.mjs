import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const OUT_ROOT = path.join(ROOT, 'public', 'audio');
const TMP_DIR = '/tmp/nafas_audio_raw';

fs.mkdirSync(path.join(OUT_ROOT, 'ambience'), { recursive: true });
fs.mkdirSync(path.join(OUT_ROOT, 'sfx'), { recursive: true });
fs.mkdirSync(TMP_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = 'NAFAS-FirstAid-Educational-App/1.0 (https://github.com/nafas-firstaid)';

function stripHtml(str = '') {
  return String(str)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
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
    startSec = 0,
    maxDuration = null,
    fadeIn = 0,
    fadeOut = 0,
    targetI = -16,
    trimSilence = false,
    lowpassHz = null,
    highpassHz = null,
    volumeDb = 0,
  } = options;

  const rawDur = Math.max(0, getDurationSec(inputPath) - startSec);
  const effectiveDur =
    maxDuration && rawDur > maxDuration ? maxDuration : rawDur;

  const filters = [];
  if (trimSilence) {
    filters.push('silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.02');
  }
  if (highpassHz) {
    filters.push(`highpass=f=${highpassHz}`);
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
  if (fadeOut > 0 && effectiveDur > fadeOut + 0.15) {
    const startOut = Math.max(0.05, Number((effectiveDur - fadeOut).toFixed(2)));
    filters.push(`afade=t=out:st=${startOut}:d=${fadeOut}`);
  }

  const mp3Out = `${outBaseNoExt}.mp3`;
  const oggOut = `${outBaseNoExt}.ogg`;

  const commonArgs = ['-y'];
  if (startSec > 0) {
    commonArgs.push('-ss', String(startSec));
  }
  commonArgs.push('-i', inputPath);
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

  return {
    durationSec: Number(getDurationSec(mp3Out).toFixed(2)),
    mp3Bytes: fs.statSync(mp3Out).size,
    oggBytes: fs.statSync(oggOut).size,
  };
}

async function fetchBuffer(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

// =========================================================================
// WIKIMEDIA COMMONS AUDIO SEARCH (CC0 / Public Domain / CC BY / CC BY-SA)
// =========================================================================
function isAllowedLicense(lic) {
  const l = (lic || '').toLowerCase();
  if (!l) return false;
  if (l.includes('nc') || l.includes('nd') || l.includes('fair use') || l.includes('copyrighted')) {
    return false;
  }
  return (
    l.includes('cc0') ||
    l.includes('public domain') ||
    l.includes('pd') ||
    l.includes('cc by') ||
    l.includes('cc-by')
  );
}

async function searchWikimediaAudio(query, limit = 15) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `${query} filetype:audio`,
    gsrnamespace: '6',
    gsrlimit: String(limit),
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size|mime',
    format: 'json',
  });
  const url = `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return [];
  const data = await res.json();
  const pages = Object.values(data?.query?.pages || {});
  const results = [];
  for (const p of pages) {
    const info = p.imageinfo?.[0];
    if (!info || !info.url) continue;
    // Skip tiny/corrupt or huge >15MB files
    if ((info.size || 0) < 3000 || (info.size || 0) > 14_000_000) continue;
    const ext = info.extmetadata || {};
    const licenseShort = stripHtml(ext.LicenseShortName?.value || '');
    if (!isAllowedLicense(licenseShort)) continue;
    const author =
      stripHtml(ext.Artist?.value || '') ||
      stripHtml(ext.Credit?.value || '') ||
      'Wikimedia Commons Contributor';
    const title = String(p.title || '')
      .replace(/^File:/i, '')
      .replace(/\.(ogg|oga|wav|mp3|flac|opus)$/i, '')
      .replace(/_/g, ' ')
      .trim();
    const descUrl =
      info.descriptionurl ||
      `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title || '')}`;
    const licenseUrl = stripHtml(ext.LicenseUrl?.value || '');

    results.push({
      source: 'wikimedia',
      uniqueId: `wm_${p.pageid}`,
      title,
      author: author.slice(0, 80),
      license: licenseShort,
      licenseUrl,
      sourceUrl: descUrl,
      downloadUrl: info.url,
      size: info.size || 0,
    });
  }
  return results;
}

// =========================================================================
// POLITE FREESOUND PUBLIC SEARCH (CC0 FIRST, 2.8s DELAY BETWEEN CALLS)
// =========================================================================
let lastFreesoundCall = 0;
let freesoundBlocked = false;

function parseFreesoundHtml(html) {
  const results = [];
  const playerRegex =
    /<div class="bw-player"[^>]*data-mp3="([^"]+)"[^>]*data-ogg="([^"]+)"[^>]*data-title="([^"]+)"[^>]*data-sound-id="(\d+)"[^>]*data-duration="([^"]+)"/g;
  let match;
  while ((match = playerRegex.exec(html)) !== null) {
    const [, mp3Url, oggUrl, titleRaw, soundId, durStr] = match;
    const slice = html.slice(match.index, match.index + 2400);
    const authorMatch =
      slice.match(/href="\/people\/([^/"]+)\/sounds\/\d+\/"/) ||
      slice.match(/href="\/people\/([^/"]+)\/"/);
    const author = authorMatch
      ? decodeURIComponent(authorMatch[1])
      : 'Freesound Contributor';
    const title = stripHtml(titleRaw);
    results.push({
      source: 'freesound',
      uniqueId: `fs_${soundId}`,
      title,
      author,
      duration: Number.parseFloat(durStr) || 0,
      license: 'CC0 1.0',
      licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      sourceUrl: `https://freesound.org/people/${encodeURIComponent(author)}/sounds/${soundId}/`,
      downloadUrl: mp3Url,
    });
  }
  return results;
}

async function searchFreesoundPolite(query, minDur = 0.08, maxDur = 30) {
  if (freesoundBlocked) return [];
  const wait = Math.max(0, 2800 - (Date.now() - lastFreesoundCall));
  if (wait > 0) await sleep(wait);
  lastFreesoundCall = Date.now();

  const params = new URLSearchParams({
    q: query,
    f: `license:"Creative Commons 0" duration:[${minDur} TO ${maxDur}]`,
    s: 'Downloads (high-low)',
  });
  const url = `https://freesound.org/search/?${params.toString()}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'text/html' },
  });
  if (res.status === 429) {
    console.warn(`  [Freesound 429] pausing Freesound queries; continuing with Wikimedia Commons.`);
    freesoundBlocked = true;
    return [];
  }
  if (!res.ok) return [];
  return parseFreesoundHtml(await res.text());
}

// Grouped broad pool queries — 1 query populates multiple slots cleanly!
const SLOT_SPECS = [
  // Ambience
  {
    id: 'amb_family_dining',
    folder: 'ambience',
    category: 'ambience',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['restaurant ambience', 'dinner dining room', 'kitchen ambience'],
    fsQuery: 'restaurant dining room ambience',
    fsRange: [8, 120],
    filterMatch: /restaurant|dining|dinner|cafe|kitchen|table|room|chatter/i,
    transcode: { maxDuration: 22, fadeIn: 1.5, fadeOut: 1.5, targetI: -22 },
  },
  {
    id: 'amb_office_lounge',
    folder: 'ambience',
    category: 'ambience',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['office ambience', 'room tone indoor', 'library quiet ambience'],
    fsQuery: 'office room tone quiet ambience',
    fsRange: [8, 120],
    filterMatch: /office|room|library|indoor|lounge|quiet|ambience|hall/i,
    transcode: { maxDuration: 22, fadeIn: 1.5, fadeOut: 1.5, targetI: -22 },
  },
  {
    id: 'amb_school_cafeteria',
    folder: 'ambience',
    category: 'ambience',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['cafeteria', 'school ambience', 'crowd chatter indoor'],
    fsQuery: 'cafeteria school chatter ambience',
    fsRange: [8, 120],
    filterMatch: /cafeteria|school|crowd|chatter|cafe|hall|students|murmur/i,
    transcode: { maxDuration: 22, fadeIn: 1.5, fadeOut: 1.5, targetI: -22 },
  },
  {
    id: 'amb_home_nursery',
    folder: 'ambience',
    category: 'ambience',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['clock ticking quiet', 'room ambience quiet', 'bedroom night quiet'],
    fsQuery: 'quiet room clock ticking ambience',
    fsRange: [8, 120],
    filterMatch: /clock|tick|room|quiet|home|bedroom|nursery|house/i,
    transcode: { maxDuration: 22, fadeIn: 1.5, fadeOut: 1.5, targetI: -22 },
  },

  // Body & Vocal sounds (Medical Rule for Sound)
  {
    id: 'body_cough_adult_strong',
    folder: 'sfx',
    category: 'body',
    isVocal: true,
    isBodySound: true,
    wmQueries: ['cough man', 'cough sound'],
    fsQuery: 'man cough',
    fsRange: [0.3, 6],
    filterMatch: /cough/i,
    rejectMatch: /whooping|pertussis|asthma|wheez|speech|pronunciation|en-us|nl-|de-/i,
    transcode: { maxDuration: 2.5, fadeIn: 0.02, fadeOut: 0.15, targetI: -16, trimSilence: true },
  },
  {
    id: 'body_cough_child_strong',
    folder: 'sfx',
    category: 'body',
    isVocal: true,
    isBodySound: true,
    wmQueries: ['cough sound', 'coughing'],
    fsQuery: 'child cough',
    fsRange: [0.3, 6],
    filterMatch: /cough/i,
    rejectMatch: /whooping|pertussis|speech|pronunciation|en-us|nl-|de-/i,
    transcode: { maxDuration: 2.4, fadeIn: 0.02, fadeOut: 0.15, targetI: -16, trimSilence: true },
  },
  {
    id: 'body_cough_infant',
    folder: 'sfx',
    category: 'body',
    isVocal: true,
    isBodySound: true,
    wmQueries: ['baby cough', 'infant cough', 'cough sound'],
    fsQuery: 'baby cough',
    fsRange: [0.3, 6],
    filterMatch: /cough|baby/i,
    rejectMatch: /whooping|pertussis|pronunciation|en-us|nl-|de-/i,
    transcode: { maxDuration: 2.2, fadeIn: 0.02, fadeOut: 0.15, targetI: -16, trimSilence: true },
  },
  {
    id: 'body_cry_infant_loud',
    folder: 'sfx',
    category: 'body',
    isVocal: true,
    isBodySound: true,
    wmQueries: ['baby crying', 'infant cry'],
    fsQuery: 'baby crying',
    fsRange: [0.8, 15],
    filterMatch: /baby|infant|cry/i,
    rejectMatch: /pronunciation|en-us|nl-|de-|song|music|lullaby/i,
    transcode: { maxDuration: 3.0, fadeIn: 0.08, fadeOut: 0.45, targetI: -17, trimSilence: true },
  },
  {
    id: 'body_gasp_male',
    folder: 'sfx',
    category: 'body',
    isVocal: true,
    isBodySound: true,
    wmQueries: ['gasp', 'inhale breath'],
    fsQuery: 'male gasp',
    fsRange: [0.2, 4],
    filterMatch: /gasp|inhale|breath/i,
    rejectMatch: /pronunciation|en-us|nl-|de-|asthma|wheeze/i,
    transcode: { maxDuration: 1.3, fadeIn: 0.02, fadeOut: 0.15, targetI: -16, trimSilence: true },
  },
  {
    id: 'body_gasp_female',
    folder: 'sfx',
    category: 'body',
    isVocal: true,
    isBodySound: true,
    wmQueries: ['gasp female', 'gasp breath'],
    fsQuery: 'female gasp',
    fsRange: [0.2, 4],
    filterMatch: /gasp|inhale|breath/i,
    rejectMatch: /pronunciation|en-us|nl-|de-/i,
    transcode: { maxDuration: 1.3, fadeIn: 0.02, fadeOut: 0.15, targetI: -16, trimSilence: true },
  },
  {
    id: 'body_gasp_child',
    folder: 'sfx',
    category: 'body',
    isVocal: true,
    isBodySound: true,
    wmQueries: ['gasp', 'breath inhale'],
    fsQuery: 'short gasp breath',
    fsRange: [0.2, 4],
    filterMatch: /gasp|inhale|breath/i,
    rejectMatch: /pronunciation|en-us|nl-|de-/i,
    transcode: { maxDuration: 1.2, fadeIn: 0.02, fadeOut: 0.15, targetI: -16, trimSilence: true },
  },
  {
    id: 'body_inhale_relief_male',
    folder: 'sfx',
    category: 'body',
    isVocal: true,
    isBodySound: true,
    wmQueries: ['sigh relief', 'deep breath exhale'],
    fsQuery: 'sigh of relief male breath',
    fsRange: [0.6, 8],
    filterMatch: /sigh|breath|exhale|inhale|relief/i,
    rejectMatch: /pronunciation|en-us|nl-|de-/i,
    transcode: { maxDuration: 2.8, fadeIn: 0.04, fadeOut: 0.35, targetI: -17, trimSilence: true },
  },
  {
    id: 'body_inhale_relief_female',
    folder: 'sfx',
    category: 'body',
    isVocal: true,
    isBodySound: true,
    wmQueries: ['sigh exhale', 'breath exhale'],
    fsQuery: 'female sigh relief exhale',
    fsRange: [0.6, 8],
    filterMatch: /sigh|breath|exhale|relief/i,
    rejectMatch: /pronunciation|en-us|nl-|de-/i,
    transcode: { maxDuration: 2.8, fadeIn: 0.04, fadeOut: 0.35, targetI: -17, trimSilence: true },
  },
  {
    id: 'body_heartbeat_calm',
    folder: 'sfx',
    category: 'body',
    isVocal: false,
    isBodySound: true,
    wmQueries: ['normal heart sounds', 'heartbeat sound'],
    fsQuery: 'heartbeat slow',
    fsRange: [0.5, 15],
    filterMatch: /heart|lub/i,
    rejectMatch: /murmur|stenosis|regurg|gallop|pronunciation|en-us/i,
    transcode: { maxDuration: 1.05, fadeIn: 0.02, fadeOut: 0.12, targetI: -16, lowpassHz: 320, trimSilence: true },
  },

  // Rescue action pools (distinct real hits/thumps)
  ...[1, 2, 3, 4, 5].map((n) => ({
    id: `sfx_back_blow_${n}`,
    folder: 'sfx',
    category: 'rescue',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['slap sound', 'drum thud hand', 'bodhran hand hit', 'pat hit sound'],
    fsQuery: 'slap thud hit pillow',
    fsRange: [0.1, 3],
    filterMatch: /slap|thud|hit|pat|drum|hand|tap|punch/i,
    rejectMatch: /pronunciation|en-us|nl-|de-|song|music/i,
    transcode: { maxDuration: 0.55, fadeIn: 0.005, fadeOut: 0.1, targetI: -14, lowpassHz: 1800, trimSilence: true },
  })),
  ...[1, 2, 3, 4, 5].map((n) => ({
    id: `sfx_thrust_${n}`,
    folder: 'sfx',
    category: 'rescue',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['thump sound', 'muffled thud', 'bass drum soft hit', 'cushion hit'],
    fsQuery: 'muffled thud cushion thump',
    fsRange: [0.1, 3],
    filterMatch: /thump|thud|hit|punch|drum|kick|knock/i,
    rejectMatch: /pronunciation|en-us|nl-|de-|song|music/i,
    transcode: { maxDuration: 0.55, fadeIn: 0.005, fadeOut: 0.1, targetI: -14, lowpassHz: 1350, trimSilence: true },
  })),
  ...[1, 2, 3, 4].map((n) => ({
    id: `sfx_infant_blow_${n}`,
    folder: 'sfx',
    category: 'rescue',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['soft tap hand', 'gentle knock', 'drum soft tap'],
    fsQuery: 'soft hand pat tap cloth',
    fsRange: [0.08, 3],
    filterMatch: /tap|pat|knock|soft|hand|thud|drum/i,
    rejectMatch: /pronunciation|en-us|nl-|de-|song|music/i,
    transcode: { maxDuration: 0.45, fadeIn: 0.005, fadeOut: 0.1, targetI: -16, lowpassHz: 1450, trimSilence: true },
  })),
  ...[1, 2, 3, 4].map((n) => ({
    id: `sfx_infant_thrust_${n}`,
    folder: 'sfx',
    category: 'rescue',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['finger tap', 'soft thump', 'cloth tap'],
    fsQuery: 'finger tap soft cushion',
    fsRange: [0.08, 3],
    filterMatch: /tap|finger|press|soft|thump|knock|cloth/i,
    rejectMatch: /pronunciation|en-us|nl-|de-|song|music/i,
    transcode: { maxDuration: 0.45, fadeIn: 0.005, fadeOut: 0.1, targetI: -17, lowpassHz: 1200, trimSilence: true },
  })),

  // Object, Environment, Arrival & UI
  {
    id: 'sfx_hand_place',
    folder: 'sfx',
    category: 'rescue',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['cloth rustle', 'fabric sound', 'paper rustle'],
    fsQuery: 'cloth rustle fabric movement',
    fsRange: [0.1, 3.5],
    filterMatch: /cloth|fabric|rustle|brush|clothing|paper/i,
    rejectMatch: /pronunciation|en-us|nl-|de-/i,
    transcode: { maxDuration: 0.55, fadeIn: 0.01, fadeOut: 0.12, targetI: -18, trimSilence: true },
  },
  {
    id: 'sfx_object_pop',
    folder: 'sfx',
    category: 'object',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['cork pop', 'mouth pop', 'bubble pop'],
    fsQuery: 'mouth pop cork pop',
    fsRange: [0.06, 2.5],
    filterMatch: /pop|cork/i,
    rejectMatch: /pronunciation|en-us|nl-|de-|music|song|popcorn/i,
    transcode: { maxDuration: 0.5, fadeIn: 0.005, fadeOut: 0.1, targetI: -15, trimSilence: true },
  },
  {
    id: 'sfx_chair_scrape',
    folder: 'sfx',
    category: 'environment',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['chair scrape', 'chair wood', 'scraping wood'],
    fsQuery: 'chair scrape wooden floor',
    fsRange: [0.2, 4.5],
    filterMatch: /chair|scrape|drag|wood/i,
    rejectMatch: /pronunciation|en-us|nl-|de-/i,
    transcode: { maxDuration: 1.1, fadeIn: 0.02, fadeOut: 0.2, targetI: -17, trimSilence: true },
  },
  {
    id: 'sfx_utensil_drop',
    folder: 'sfx',
    category: 'environment',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['fork spoon clink', 'cutlery plate', 'spoon cup'],
    fsQuery: 'fork drop plate cutlery clink',
    fsRange: [0.1, 3.5],
    filterMatch: /fork|spoon|plate|cutlery|clink|cup|dish|silverware/i,
    rejectMatch: /pronunciation|en-us|nl-|de-/i,
    transcode: { maxDuration: 0.85, fadeIn: 0.005, fadeOut: 0.15, targetI: -17, trimSilence: true },
  },
  {
    id: 'sfx_body_collapse',
    folder: 'sfx',
    category: 'environment',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['fall thud', 'heavy drop thud', 'body fall'],
    fsQuery: 'body fall soft thud carpet',
    fsRange: [0.2, 4],
    filterMatch: /fall|thud|drop|slump|carpet|heavy/i,
    rejectMatch: /pronunciation|en-us|nl-|de-/i,
    transcode: { maxDuration: 1.0, fadeIn: 0.01, fadeOut: 0.2, targetI: -16, lowpassHz: 1100, trimSilence: true },
  },
  {
    id: 'sfx_phone_dial',
    folder: 'sfx',
    category: 'arrival',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['telephone dial tone', 'DTMF dial', 'phone keypad'],
    fsQuery: 'phone dial keypad',
    fsRange: [0.2, 6],
    filterMatch: /dial|dtmf|phone|telephone|keypad|tone/i,
    rejectMatch: /pronunciation|en-us|nl-|de-/i,
    transcode: { maxDuration: 1.4, fadeIn: 0.02, fadeOut: 0.2, targetI: -18, trimSilence: true },
  },
  {
    id: 'sfx_aed_beep',
    folder: 'sfx',
    category: 'arrival',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['chime notification', 'bell chime soft', 'medical beep'],
    fsQuery: 'soft notification chime bell',
    fsRange: [0.15, 4],
    filterMatch: /chime|beep|bell|tone|notification|ping/i,
    rejectMatch: /pronunciation|en-us|nl-|de-|alarm|siren/i,
    transcode: { maxDuration: 1.0, fadeIn: 0.01, fadeOut: 0.15, targetI: -18, trimSilence: true },
  },
  {
    id: 'sfx_ambulance_distant',
    folder: 'sfx',
    category: 'arrival',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['ambulance siren', 'emergency siren distant'],
    fsQuery: 'distant ambulance siren',
    fsRange: [2, 45],
    filterMatch: /ambulance|siren/i,
    rejectMatch: /pronunciation|en-us|nl-|de-/i,
    transcode: { maxDuration: 5.5, fadeIn: 1.2, fadeOut: 1.8, targetI: -25, lowpassHz: 1350 },
  },
  {
    id: 'sfx_ui_page',
    folder: 'sfx',
    category: 'ui',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['page turn', 'paper flip', 'book page'],
    fsQuery: 'page turn book paper',
    fsRange: [0.1, 3],
    filterMatch: /page|paper|book|flip/i,
    rejectMatch: /pronunciation|en-us|nl-|de-/i,
    transcode: { maxDuration: 0.55, fadeIn: 0.01, fadeOut: 0.12, targetI: -19, trimSilence: true },
  },
  {
    id: 'sfx_ui_select',
    folder: 'sfx',
    category: 'ui',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['woodblock tap', 'click button', 'wooden click'],
    fsQuery: 'soft wooden click ui',
    fsRange: [0.04, 2],
    filterMatch: /click|tap|wood|button|tick/i,
    rejectMatch: /pronunciation|en-us|nl-|de-/i,
    transcode: { maxDuration: 0.3, fadeIn: 0.005, fadeOut: 0.08, targetI: -18, trimSilence: true },
  },
  {
    id: 'sfx_ui_star',
    folder: 'sfx',
    category: 'ui',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['glockenspiel note', 'harp note', 'kalimba note', 'chime bell'],
    fsQuery: 'warm kalimba chime bell',
    fsRange: [0.2, 5],
    filterMatch: /chime|bell|harp|kalimba|glockenspiel|celesta|piano/i,
    rejectMatch: /pronunciation|en-us|nl-|de-/i,
    transcode: { maxDuration: 1.5, fadeIn: 0.01, fadeOut: 0.35, targetI: -17, trimSilence: true },
  },
  {
    id: 'sfx_ui_wrong_soft',
    folder: 'sfx',
    category: 'ui',
    isVocal: false,
    isBodySound: false,
    wmQueries: ['marimba low', 'piano note C3', 'cello note'],
    fsQuery: 'soft low piano marimba note',
    fsRange: [0.2, 4.5],
    filterMatch: /piano|marimba|cello|wood|note|tone/i,
    rejectMatch: /pronunciation|en-us|nl-|de-/i,
    transcode: { maxDuration: 1.15, fadeIn: 0.01, fadeOut: 0.3, targetI: -19, trimSilence: true },
  },
];

async function run() {
  const prevReport = JSON.parse(
    fs.readFileSync('/tmp/audio_fetch_report.json', 'utf8')
  );
  const musicEntries = prevReport.filter(
    (m) => m.category === 'music' && m.status === 'ready'
  );
  console.log(`Loaded ${musicEntries.length} ready music tracks.`);

  const wmCache = new Map();
  const fsCache = new Map();
  const usedUniqueIds = new Set();
  const sfxEntries = [];

  for (const spec of SLOT_SPECS) {
    let picked = null;

    // 1) Try Freesound CC0 first (grouped cache avoids redundant HTTP hits!)
    if (spec.fsQuery && !freesoundBlocked) {
      const cacheKey = `${spec.fsQuery}|${spec.fsRange.join('-')}`;
      let list = fsCache.get(cacheKey);
      if (!list) {
        try {
          list = await searchFreesoundPolite(spec.fsQuery, spec.fsRange[0], spec.fsRange[1]);
          fsCache.set(cacheKey, list);
        } catch {
          list = [];
        }
      }
      const avail = list.filter((c) => !usedUniqueIds.has(c.uniqueId));
      if (avail.length > 0) {
        picked = avail[0];
      }
    }

    // 2) Fallback / primary via Wikimedia Commons Audio API (CC0 / PD / CC-BY)
    if (!picked) {
      for (const q of spec.wmQueries) {
        let list = wmCache.get(q);
        if (!list) {
          try {
            await sleep(220);
            list = await searchWikimediaAudio(q, 18);
            wmCache.set(q, list);
          } catch (err) {
            console.warn(`  WM error "${q}": ${err.message}`);
            list = [];
          }
        }
        const avail = list.filter((c) => {
          if (usedUniqueIds.has(c.uniqueId)) return false;
          if (spec.rejectMatch && spec.rejectMatch.test(c.title)) return false;
          if (spec.filterMatch && !spec.filterMatch.test(c.title)) return false;
          return true;
        });
        if (avail.length > 0) {
          picked = avail[0];
          break;
        }
      }
    }

    if (!picked) {
      console.warn(`  MISSING: ${spec.id}`);
      sfxEntries.push({
        id: spec.id,
        title: spec.id,
        file: '',
        oggFile: '',
        category: spec.category,
        levelMapping: ['CUE_SHEET'],
        sourceUrl: '',
        author: '',
        license: '',
        attribution: '',
        status: 'missing',
        isVocal: spec.isVocal,
        isBodySound: spec.isBodySound,
        searchTerms: [spec.fsQuery, ...spec.wmQueries].filter(Boolean),
      });
      continue;
    }

    usedUniqueIds.add(picked.uniqueId);
    const ext = path.extname(new URL(picked.downloadUrl).pathname) || '.audio';
    const rawPath = path.join(TMP_DIR, `${spec.id}_raw${ext}`);
    const outBase = path.join(OUT_ROOT, spec.folder, spec.id);

    try {
      const buf = await fetchBuffer(picked.downloadUrl);
      fs.writeFileSync(rawPath, buf);
      const stats = transcodeAudio(rawPath, outBase, spec.transcode);
      const attribution =
        picked.license.toLowerCase().includes('cc0') ||
        picked.license.toLowerCase().includes('public domain')
          ? `"${picked.title}" by ${picked.author} (${picked.sourceUrl}), ${picked.license}`
          : `"${picked.title}" by ${picked.author} (${picked.sourceUrl}), licensed under ${picked.license}${
              picked.licenseUrl ? ` (${picked.licenseUrl})` : ''
            }`;

      console.log(
        `  OK [${picked.source}] ${spec.id}: "${picked.title}" by ${picked.author} [${picked.license}] (${stats.durationSec}s)`
      );
      sfxEntries.push({
        id: spec.id,
        title: picked.title,
        file: `/audio/${spec.folder}/${spec.id}.mp3`,
        oggFile: `/audio/${spec.folder}/${spec.id}.ogg`,
        category: spec.category,
        levelMapping: ['CUE_SHEET'],
        durationSec: stats.durationSec,
        sourceUrl: picked.sourceUrl,
        author: picked.author,
        license: picked.license,
        attribution,
        status: 'ready',
        isVocal: spec.isVocal,
        isBodySound: spec.isBodySound,
      });
    } catch (err) {
      console.error(`  FAIL ${spec.id} (${picked.title}): ${err.message}`);
      sfxEntries.push({
        id: spec.id,
        title: picked.title,
        file: '',
        oggFile: '',
        category: spec.category,
        levelMapping: ['CUE_SHEET'],
        sourceUrl: picked.sourceUrl,
        author: picked.author,
        license: picked.license,
        attribution: '',
        status: 'missing',
        isVocal: spec.isVocal,
        isBodySound: spec.isBodySound,
        searchTerms: [spec.fsQuery, ...spec.wmQueries].filter(Boolean),
      });
    }
  }

  const allEntries = [...musicEntries, ...sfxEntries];
  fs.writeFileSync('/tmp/audio_fetch_report_v2.json', JSON.stringify(allEntries, null, 2));

  const ready = allEntries.filter((e) => e.status === 'ready').length;
  const missing = allEntries.filter((e) => e.status !== 'ready');
  console.log(`\nFINAL AUDIO FETCH: ${ready}/${allEntries.length} ready, ${missing.length} missing.`);
  if (missing.length > 0) {
    console.log('Missing IDs:', missing.map((m) => m.id).join(', '));
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
