import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const errors = [];
const warnings = [];

// 1. Verify zero synthesized oscillators in src/
function scanForOscillators(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanForOscillators(full);
    } else if (/\.(ts|tsx|js|mjs)$/.test(entry.name)) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('createOscillator')) {
        errors.push(`Synthesized oscillator found in ${path.relative(ROOT, full)}`);
      }
      if (content.includes('playMetronomeTick')) {
        errors.push(`Forbidden CPR metronome call found in ${path.relative(ROOT, full)}`);
      }
    }
  }
}
scanForOscillators(path.join(ROOT, 'src'));

// 2. Load compiled or parsed audio manifest & cue sheet via tsx/node
const manifestPath = path.join(ROOT, 'src', 'data', 'audioManifest.ts');
const cueSheetPath = path.join(ROOT, 'src', 'data', 'audioCueSheet.ts');
const creditsPath = path.join(ROOT, 'src', 'pages', 'CreditsPage.tsx');
const footerPath = path.join(ROOT, 'src', 'components', 'Footer.tsx');

if (!fs.existsSync(manifestPath)) {
  errors.push('Missing src/data/audioManifest.ts');
}
if (!fs.existsSync(cueSheetPath)) {
  errors.push('Missing src/data/audioCueSheet.ts');
}
if (!fs.existsSync(creditsPath)) {
  errors.push('Missing src/pages/CreditsPage.tsx');
} else {
  const cSrc = fs.readFileSync(creditsPath, 'utf8');
  if (!cSrc.includes('MUSIC_TRACKS') || !cSrc.includes('SFX_ASSETS') || !cSrc.includes('attribution')) {
    errors.push('CreditsPage.tsx must render attributions from MUSIC_TRACKS and SFX_ASSETS');
  }
}
if (fs.existsSync(footerPath)) {
  const fSrc = fs.readFileSync(footerPath, 'utf8');
  if (!fSrc.includes('/credits')) {
    errors.push('Footer.tsx must include a public link to /credits');
  }
}

// Dynamic import using tsx runner or esbuild-free JSON check
const { AUDIO_MANIFEST, AUDIO_MANIFEST_BY_ID } = await import(
  path.join(ROOT, 'src', 'data', 'audioManifest.ts')
);
const {
  LEVEL_AUDIO_CUE_SHEETS,
  DEFAULT_LEVEL_CALM_TRACK,
  SOUND_VARIATION_POOLS,
} = await import(path.join(ROOT, 'src', 'data', 'audioCueSheet.ts'));

const ALL_LEVELS = ['A1', 'A2', 'A3', 'A4', 'C1', 'C2', 'C3', 'I1', 'I2', 'I3'];
const BEATS = ['S1', 'S2', 'S3', 'S4', 'S5'];
const OUTCOMES = ['OA1', 'OA2', 'OA3', 'OB', 'OC'];

// 3. Check consecutive level calm tracks never repeat
const tracksOrder = [
  ['A1', 'A2', 'A3', 'A4'],
  ['C1', 'C2', 'C3'],
  ['I1', 'I2', 'I3'],
];
for (const group of tracksOrder) {
  for (let i = 1; i < group.length; i++) {
    const prev = DEFAULT_LEVEL_CALM_TRACK[group[i - 1]];
    const curr = DEFAULT_LEVEL_CALM_TRACK[group[i]];
    if (prev === curr) {
      errors.push(`Consecutive levels ${group[i - 1]} and ${group[i]} share calm track ${curr}`);
    }
  }
}

// 4. Verify every manifest entry has metadata & physical files when status === 'ready'
let readyCount = 0;
let missingCount = 0;
for (const item of AUDIO_MANIFEST) {
  if (item.status === 'ready') {
    readyCount++;
    if (!item.sourceUrl || !item.author || !item.license || !item.attribution) {
      errors.push(`Manifest entry ${item.id} is missing sourceUrl/author/license/attribution`);
    }
    const mp3Full = path.join(ROOT, 'public', item.file.replace(/^\//, ''));
    const oggFull = path.join(ROOT, 'public', item.oggFile.replace(/^\//, ''));
    if (!fs.existsSync(mp3Full) || fs.statSync(mp3Full).size < 500) {
      errors.push(`Missing or empty MP3 file for ${item.id}: ${item.file}`);
    }
    if (!fs.existsSync(oggFull) || fs.statSync(oggFull).size < 500) {
      errors.push(`Missing or empty OGG file for ${item.id}: ${item.oggFile}`);
    }
  } else {
    missingCount++;
    warnings.push(`Manifest entry ${item.id} marked missing (searchTerms: ${(item.searchTerms || []).join(', ')})`);
  }
}

// 5. Verify every level, every beat, every outcome & enforce Medical Rule for Sound
for (const lvl of ALL_LEVELS) {
  const sheet = LEVEL_AUDIO_CUE_SHEETS[lvl];
  if (!sheet) {
    errors.push(`Missing cue sheet for level ${lvl}`);
    continue;
  }
  if (!AUDIO_MANIFEST_BY_ID[sheet.ambienceId]) {
    errors.push(`Level ${lvl} ambienceId "${sheet.ambienceId}" not in audioManifest`);
  }

  for (const beatKey of BEATS) {
    const block = sheet.beats?.[beatKey];
    if (!block || !block.music || !block.ambience || !Array.isArray(block.cues)) {
      errors.push(`Level ${lvl} beat ${beatKey} is missing required audio block`);
      continue;
    }
    for (const cue of block.cues) {
      const meta = AUDIO_MANIFEST_BY_ID[cue.sound];
      if (!meta) {
        errors.push(`Level ${lvl} beat ${beatKey} references unknown sound "${cue.sound}"`);
        continue;
      }
      // Medical Rule for Sound:
      // Severe choking (A2, A4, C1, I1) MUST be silent (no vocal sounds) after onset gasp (S4, S5; and S3 for I1)
      if (sheet.severity === 'severe') {
        const forbiddenSevereBeats = lvl === 'I1' ? ['S3', 'S4', 'S5'] : ['S4', 'S5'];
        if (forbiddenSevereBeats.includes(beatKey) && meta.isVocal) {
          errors.push(
            `MEDICAL RULE VIOLATION: Vocal sound "${cue.sound}" assigned to severe choking ${lvl} ${beatKey}`
          );
        }
      }
      // Unresponsive (A3, C2, I2) MUST have ZERO vocal sounds on ALL beats
      if (sheet.severity === 'unresponsive' && meta.isVocal) {
        errors.push(
          `MEDICAL RULE VIOLATION: Vocal sound "${cue.sound}" assigned to unresponsive ${lvl} ${beatKey}`
        );
      }
    }
  }

  for (const outKey of OUTCOMES) {
    const block = sheet.outcomes?.[outKey];
    if (!block || !block.music || !block.ambience || !Array.isArray(block.cues)) {
      errors.push(`Level ${lvl} outcome ${outKey} is missing required audio block`);
      continue;
    }
    for (const cue of block.cues) {
      const meta = AUDIO_MANIFEST_BY_ID[cue.sound];
      if (!meta) {
        errors.push(`Level ${lvl} outcome ${outKey} references unknown sound "${cue.sound}"`);
        continue;
      }
      // Severe choking outcomes OA1, OA2, OB, OC MUST have ZERO vocal sounds (recovery vocals only on OA3)
      if (sheet.severity === 'severe' && outKey !== 'OA3' && meta.isVocal) {
        errors.push(
          `MEDICAL RULE VIOLATION: Vocal sound "${cue.sound}" assigned to severe choking ${lvl} ${outKey}`
        );
      }
      // Unresponsive outcomes MUST have ZERO vocal sounds on ALL outcomes
      if (sheet.severity === 'unresponsive' && meta.isVocal) {
        errors.push(
          `MEDICAL RULE VIOLATION: Vocal sound "${cue.sound}" assigned to unresponsive ${lvl} ${outKey}`
        );
      }
    }
  }
}

// 6. Verify variation pools reference manifest entries
for (const [poolId, ids] of Object.entries(SOUND_VARIATION_POOLS)) {
  if (ids.length < 4) {
    errors.push(`Variation pool ${poolId} has fewer than 4 variations (${ids.length})`);
  }
  for (const id of ids) {
    if (!AUDIO_MANIFEST_BY_ID[id]) {
      errors.push(`Variation pool ${poolId} references unknown sound "${id}"`);
    }
  }
}

console.log(`Audio Compliance Summary:`);
console.log(`  Levels checked: ${ALL_LEVELS.length} (100 beats & outcomes verified)`);
console.log(`  Manifest assets: ${readyCount} ready, ${missingCount} missing`);
console.log(`  Errors: ${errors.length}, Warnings: ${warnings.length}`);

if (warnings.length > 0) {
  console.log('\nWarnings:');
  warnings.forEach((w) => console.log(`  - ${w}`));
}

if (errors.length > 0) {
  console.error('\nCOMPLIANCE FAILED:');
  errors.forEach((e) => console.error(`  [ERROR] ${e}`));
  process.exit(1);
}

console.log('\nAUDIO COMPLIANCE PASSED!');
