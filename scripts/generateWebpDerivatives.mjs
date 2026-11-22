#!/usr/bin/env node
/**
 * Build-time WebP Derivative Generator for NAFAS Level Images
 * Converts all 102 native-resolution (640x357) PNGs in public/assets/levels/
 * into lightweight WebP derivatives in public/assets/levels/webp/
 * while keeping original PNG files 100% untouched.
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const SRC_DIR = path.resolve('public/assets/levels');
const OUT_DIR = path.resolve('public/assets/levels/webp');

fs.mkdirSync(OUT_DIR, { recursive: true });

const pngFiles = fs
  .readdirSync(SRC_DIR)
  .filter((f) => f.toLowerCase().endsWith('.png'))
  .sort();

let totalPngBytes = 0;
let totalWebpBytes = 0;
let convertedCount = 0;

for (const file of pngFiles) {
  const id = file.replace(/\.png$/i, '');
  const inPath = path.join(SRC_DIR, file);
  const outPath = path.join(OUT_DIR, `${id}.webp`);

  const pngSize = fs.statSync(inPath).size;
  totalPngBytes += pngSize;

  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      '-i',
      inPath,
      '-c:v',
      'libwebp',
      '-quality',
      '84',
      '-compression_level',
      '5',
      '-preset',
      'picture',
      outPath,
    ],
    { stdio: 'pipe' }
  );

  const webpSize = fs.statSync(outPath).size;
  totalWebpBytes += webpSize;
  convertedCount += 1;
}

const savedPct = ((1 - totalWebpBytes / Math.max(1, totalPngBytes)) * 100).toFixed(1);
console.log(
  JSON.stringify(
    {
      convertedCount,
      totalPngKB: Math.round(totalPngBytes / 1024),
      totalWebpKB: Math.round(totalWebpBytes / 1024),
      savedPercent: `${savedPct}%`,
      outputDir: 'public/assets/levels/webp',
    },
    null,
    2
  )
);
