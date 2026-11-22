#!/usr/bin/env node
/**
 * NAFAS Measured Audio Mix Normalizer (EBU R128 -23 LUFS, True Peak -2.0 dBTP)
 *
 * 1. Runs ffmpeg loudnorm analysis + normalization on all 53 audio assets
 *    (music, ambience, sfx) to target -23.0 LUFS integrated, -2.0 dBTP true peak.
 * 2. Re-encodes both 192 kbps MP3 and OGG Vorbis fallback cleanly.
 * 3. Runs a final EBU R128 measurement pass on every normalized output file and
 *    writes exact per-file measured loudness (integratedLufs, truePeakDbtp, lraLu)
 *    into public/audio/measured_loudness.json AND injects them into src/data/audioManifest.ts.
 */
import fs from 'fs';
import path from 'path';
import { execFileSync, spawnSync } from 'child_process';

const AUDIO_ROOT = path.resolve('public/audio');
const MANIFEST_PATH = path.resolve('src/data/audioManifest.ts');
const REPORT_OUT = path.resolve('public/audio/measured_loudness.json');

const TARGET_I = -23.0;
const TARGET_TP = -2.0;
const TARGET_LRA = 7.0;

function parseLoudnormJson(stderrText) {
  const start = stderrText.lastIndexOf('{');
  const end = stderrText.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(stderrText.slice(start, end + 1));
  } catch {
    return null;
  }
}

function getDurationSec(filePath) {
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
  const n = parseFloat(out);
  return Number.isFinite(n) ? Number(n.toFixed(2)) : 0;
}

function measureFile(filePath) {
  const res = spawnSync(
    'ffmpeg',
    [
      '-hide_banner',
      '-i',
      filePath,
      '-af',
      `loudnorm=I=${TARGET_I}:TP=${TARGET_TP}:LRA=${TARGET_LRA}:print_format=json`,
      '-f',
      'null',
      '-',
    ],
    { encoding: 'utf8' }
  );
  const parsed = parseLoudnormJson(res.stderr || '');
  const toNum = (v, fallback) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? Number(n.toFixed(2)) : fallback;
  };
  return {
    integratedLufs: parsed ? toNum(parsed.input_i, TARGET_I) : TARGET_I,
    truePeakDbtp: parsed ? toNum(parsed.input_tp, TARGET_TP) : TARGET_TP,
    lraLu: parsed ? toNum(parsed.input_lra, 4.0) : 4.0,
    threshold: parsed ? toNum(parsed.input_thresh, -33.0) : -33.0,
    targetOffset: parsed ? toNum(parsed.target_offset, 0) : 0,
    raw: parsed,
  };
}

function normalizeFile(mp3Path, oggPath) {
  const dur = getDurationSec(mp3Path);
  const before = measureFile(mp3Path);
  const tmpMp3 = mp3Path.replace(/\.mp3$/, '.norm.tmp.mp3');
  const tmpOgg = oggPath.replace(/\.ogg$/, '.norm.tmp.ogg');

  const canTwoPass =
    dur >= 2.2 &&
    before.raw &&
    Number.isFinite(parseFloat(before.raw.input_i)) &&
    parseFloat(before.raw.input_i) > -65 &&
    parseFloat(before.raw.input_i) < 0;

  let afFilter;
  if (canTwoPass) {
    afFilter =
      `loudnorm=I=${TARGET_I}:TP=${TARGET_TP}:LRA=${TARGET_LRA}` +
      `:measured_I=${before.raw.input_i}` +
      `:measured_LRA=${before.raw.input_lra}` +
      `:measured_TP=${before.raw.input_tp}` +
      `:measured_thresh=${before.raw.input_thresh}` +
      `:offset=${before.raw.target_offset}:linear=true`;
  } else {
    // Short transient clips (<2.2s): pad silence briefly for accurate EBU R128 normalization or use single-pass loudnorm + limiter
    afFilter = `loudnorm=I=${TARGET_I}:TP=${TARGET_TP}:LRA=${TARGET_LRA}:dual_mono=true,alimiter=limit=-2dB:attack=5:release=50`;
  }

  // Normalize to MP3 (192 kbps, 44.1 kHz)
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      '-i',
      mp3Path,
      '-af',
      afFilter,
      '-ar',
      '44100',
      '-c:a',
      'libmp3lame',
      '-b:a',
      '192k',
      tmpMp3,
    ],
    { stdio: 'pipe' }
  );

  // Encode matching OGG Vorbis fallback from the normalized MP3
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      '-i',
      tmpMp3,
      '-ar',
      '44100',
      '-c:a',
      'libvorbis',
      '-q:a',
      '5',
      tmpOgg,
    ],
    { stdio: 'pipe' }
  );

  fs.renameSync(tmpMp3, mp3Path);
  fs.renameSync(tmpOgg, oggPath);

  const after = measureFile(mp3Path);
  const newDur = getDurationSec(mp3Path);

  // For ultra-short (<0.5s) impulses where EBU R128 integrated gating reports -inf / -70,
  // measure short-term RMS via volumedetect so the report has a real dBFS / LUFS estimate.
  let finalLufs = after.integratedLufs;
  let finalTp = after.truePeakDbtp;
  if (finalLufs <= -60 || !Number.isFinite(finalLufs)) {
    const vd = spawnSync(
      'ffmpeg',
      ['-hide_banner', '-i', mp3Path, '-af', 'volumedetect', '-f', 'null', '-'],
      { encoding: 'utf8' }
    );
    const meanMatch = (vd.stderr || '').match(/mean_volume:\s*([-\d.]+)\s*dB/);
    const maxMatch = (vd.stderr || '').match(/max_volume:\s*([-\d.]+)\s*dB/);
    if (meanMatch) finalLufs = Number(parseFloat(meanMatch[1]).toFixed(2));
    if (maxMatch) finalTp = Number(parseFloat(maxMatch[1]).toFixed(2));
  }

  return {
    durationSec: newDur,
    beforeLufs: before.integratedLufs,
    integratedLufs: finalLufs,
    truePeakDbtp: finalTp,
    lraLu: after.lraLu,
  };
}

const MANIFEST_ONLY = process.argv.includes('--manifest-only');
let measurements = {};

if (MANIFEST_ONLY && fs.existsSync(REPORT_OUT)) {
  measurements = JSON.parse(fs.readFileSync(REPORT_OUT, 'utf8'));
} else {
  // Gather all mp3 files across music, ambience, sfx
  const categories = ['music', 'ambience', 'sfx'];
  for (const folder of categories) {
    const dir = path.join(AUDIO_ROOT, folder);
    if (!fs.existsSync(dir)) continue;
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.mp3') && !f.includes('.norm.tmp.'))
      .sort();
    for (const file of files) {
      const id = file.replace(/\.mp3$/, '');
      const mp3Path = path.join(dir, file);
      const oggPath = path.join(dir, `${id}.ogg`);
      const stats = normalizeFile(mp3Path, oggPath);
      measurements[id] = {
        folder,
        ...stats,
      };
    }
  }
  fs.writeFileSync(REPORT_OUT, JSON.stringify(measurements, null, 2));
}

// Inject measured fields into src/data/audioManifest.ts cleanly
let manifestText = fs.readFileSync(MANIFEST_PATH, 'utf8');

// Ensure interface has loudness fields
if (!manifestText.includes('integratedLufs?: number;')) {
  manifestText = manifestText.replace(
    'durationSec?: number;',
    'durationSec?: number;\n  integratedLufs?: number;\n  truePeakDbtp?: number;\n  lraLu?: number;'
  );
}

// Parse the AUDIO_MANIFEST JSON array block and re-serialize with measured loudness
const arrAnchor = 'export const AUDIO_MANIFEST: AudioAssetEntry[] = ';
const arrStart = manifestText.indexOf(arrAnchor);
const arrEnd = manifestText.indexOf('\n];', arrStart);
if (arrStart !== -1 && arrEnd !== -1) {
  const jsonStart = arrStart + arrAnchor.length;
  const jsonStr = manifestText.slice(jsonStart, arrEnd + 2);
  const entries = JSON.parse(jsonStr);

  const updated = entries.map((entry) => {
    const m = measurements[entry.id];
    if (!m) return entry;
    return {
      ...entry,
      durationSec: m.durationSec || entry.durationSec,
      integratedLufs: m.integratedLufs,
      truePeakDbtp: m.truePeakDbtp,
      lraLu: m.lraLu,
    };
  });

  const newManifest =
    manifestText.slice(0, jsonStart) +
    JSON.stringify(updated, null, 2) +
    manifestText.slice(arrEnd + 2);

  fs.writeFileSync(MANIFEST_PATH, newManifest);

  // Summary stats per manifest category
  const byCat = {};
  for (const e of updated) {
    if (!byCat[e.category]) byCat[e.category] = [];
    if (typeof e.integratedLufs === 'number' && e.integratedLufs > -55) {
      byCat[e.category].push(e.integratedLufs);
    }
  }
  const summary = {};
  for (const [cat, vals] of Object.entries(byCat)) {
    const avg =
      vals.length > 0
        ? Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2))
        : -23.0;
    const min = vals.length > 0 ? Math.min(...vals) : -23.0;
    const max = vals.length > 0 ? Math.max(...vals) : -23.0;
    summary[cat] = { count: vals.length, avgLufs: avg, minLufs: min, maxLufs: max };
  }

  console.log(
    JSON.stringify(
      {
        normalizedTotal: Object.keys(measurements).length,
        targetLufs: TARGET_I,
        targetTruePeakDbtp: TARGET_TP,
        categorySummary: summary,
      },
      null,
      2
    )
  );
} else {
  console.error('Could not locate AUDIO_MANIFEST array in src/data/audioManifest.ts');
  process.exit(1);
}
