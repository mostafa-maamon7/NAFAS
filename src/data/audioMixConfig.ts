/**
 * NAFAS Measured Audio Mix Configuration
 *
 * Every self-hosted file is normalized at build time with ffmpeg loudnorm to
 * -23.0 LUFS integrated / -2.0 dBTP true peak.
 *
 * Relative mix hierarchy at default sliders:
 *   • Effects (body, rescue, object, environment, arrival): 0 dB reference (loudest, crisp & intelligible)
 *   • Music: -9.0 dB below effects (within -8 to -10 dB target; ~5 dB lower than earlier default)
 *   • Ambience: -13.5 dB below effects (within -12 to -15 dB target)
 *   • Auto-ducking:
 *       - Music:    -6.0 dB during body/rescue cues (attack 80 ms, release 600 ms)
 *       - Ambience: -8.0 dB during key cues         (attack 80 ms, release 600 ms)
 */

import { AudioAssetCategory } from './audioManifest';

export interface DuckingConfig {
  musicDuckDb: number;
  ambienceDuckDb: number;
  attackMs: number;
  releaseMs: number;
}

export interface CueMixEntry {
  /** Per-cue gain trim in dB relative to its category bus */
  gainDb: number;
  /** Default stereo pan (-1 left .. +1 right) */
  pan: number;
  /** Random pitch jitter ±% (e.g. 3 => ±3%) */
  pitchJitterPct: number;
  /** Random gain jitter ±dB (e.g. 1.5 => ±1.5 dB) */
  gainJitterDb: number;
  /** Optional low-pass filter trim in Hz (keeps sharp transients warm & non-harsh) */
  filterHz?: number;
  /** Whether this cue triggers music & ambience ducking */
  triggersDuck: boolean;
  /** Short clinical / acoustic role description */
  role: string;
}

export const DEFAULT_MIX_SLIDERS = {
  /** Lowered ~5 dB vs earlier default (was 0.45 * 0.55; now combined with -9 dB category offset) */
  musicVolume: 0.36,
  effectsVolume: 0.78,
};

export const DEFAULT_CATEGORY_GAIN_DB: Record<AudioAssetCategory, number> = {
  music: -9.0, // 8–10 dB below effects at default slider
  ambience: -13.5, // 12–15 dB below effects
  body: 0.0, // Reference: coughs, gasps, cries, relieved breaths clear above ambience
  rescue: 0.5, // Tactile back blows & thrusts crisp and grounded
  object: -1.5, // Chair scrape, utensil clink, dry pop, cushioned collapse
  environment: -2.0, // Phone dial, distant siren
  arrival: -1.5, // Calm AED chime
  ui: -3.5, // Gentle non-intrusive clicks & warm star chimes
};

export const DEFAULT_DUCKING_CONFIG: DuckingConfig = {
  musicDuckDb: -6.0,
  ambienceDuckDb: -8.0,
  attackMs: 80,
  releaseMs: 600,
};

export const DEFAULT_CUE_MIX_TABLE: Record<string, CueMixEntry> = {
  // Body & Vocal Clinical Cues (Clear above ambience; heartbeat subtle)
  body_cough_adult_strong: {
    gainDb: 1.5,
    pan: 0,
    pitchJitterPct: 2,
    gainJitterDb: 1.0,
    triggersDuck: true,
    role: 'Mild adult effective cough — clear diagnostic cue',
  },
  body_cough_child_strong: {
    gainDb: 1.5,
    pan: 0,
    pitchJitterPct: 2,
    gainJitterDb: 1.0,
    triggersDuck: true,
    role: 'Mild child effective cough — clear diagnostic cue',
  },
  body_cough_infant: {
    gainDb: 1.0,
    pan: 0,
    pitchJitterPct: 2,
    gainJitterDb: 1.0,
    triggersDuck: true,
    role: 'Infant mild cough / post-clearance breath',
  },
  body_cry_infant_loud: {
    gainDb: 0.5,
    pan: 0,
    pitchJitterPct: 1.5,
    gainJitterDb: 0.8,
    filterHz: 6500,
    triggersDuck: true,
    role: 'Infant cry (mild choking or post-clearance relief)',
  },
  body_cry_infant_short: {
    gainDb: 0.0,
    pan: 0,
    pitchJitterPct: 1.5,
    gainJitterDb: 0.8,
    filterHz: 6200,
    triggersDuck: true,
    role: 'Short first cry confirming open infant airway',
  },
  body_gasp_male: {
    gainDb: 1.0,
    pan: 0,
    pitchJitterPct: 2,
    gainJitterDb: 1.0,
    triggersDuck: true,
    role: 'Brief onset gasp before severe adult silence',
  },
  body_gasp_female: {
    gainDb: 1.0,
    pan: 0,
    pitchJitterPct: 2,
    gainJitterDb: 1.0,
    triggersDuck: true,
    role: 'Brief onset gasp before severe pregnant adult silence',
  },
  body_gasp_child: {
    gainDb: 1.0,
    pan: 0,
    pitchJitterPct: 2,
    gainJitterDb: 1.0,
    triggersDuck: true,
    role: 'Brief onset gasp before severe child silence',
  },
  body_inhale_relief_male: {
    gainDb: 0.5,
    pan: 0,
    pitchJitterPct: 1.5,
    gainJitterDb: 0.8,
    triggersDuck: true,
    role: 'Deep relieved breath on adult recovery',
  },
  body_inhale_relief_female: {
    gainDb: 0.5,
    pan: 0,
    pitchJitterPct: 1.5,
    gainJitterDb: 0.8,
    triggersDuck: true,
    role: 'Relieved exhale on recovery',
  },
  body_heartbeat_calm: {
    gainDb: -7.5, // Subtle and calm, never dominant or alarming
    pan: 0,
    pitchJitterPct: 0,
    gainJitterDb: 0.5,
    filterHz: 420,
    triggersDuck: false,
    role: 'Subtle low-frequency heartbeat tied to falling SpO2',
  },

  // Rescue Variation Pools (±3% pitch, ±1.5 dB gain so repeated thumps never sound mechanical)
  sfx_back_blow_1: { gainDb: 1.0, pan: -0.08, pitchJitterPct: 3, gainJitterDb: 1.5, triggersDuck: true, role: 'Padded adult/child back blow #1' },
  sfx_back_blow_2: { gainDb: 1.0, pan: -0.04, pitchJitterPct: 3, gainJitterDb: 1.5, triggersDuck: true, role: 'Padded adult/child back blow #2' },
  sfx_back_blow_3: { gainDb: 1.0, pan: 0.0, pitchJitterPct: 3, gainJitterDb: 1.5, triggersDuck: true, role: 'Padded adult/child back blow #3' },
  sfx_back_blow_4: { gainDb: 1.0, pan: 0.04, pitchJitterPct: 3, gainJitterDb: 1.5, triggersDuck: true, role: 'Padded adult/child back blow #4' },
  sfx_back_blow_5: { gainDb: 1.0, pan: 0.08, pitchJitterPct: 3, gainJitterDb: 1.5, triggersDuck: true, role: 'Padded adult/child back blow #5' },

  sfx_thrust_1: { gainDb: 1.0, pan: 0.06, pitchJitterPct: 3, gainJitterDb: 1.5, triggersDuck: true, role: 'Inward-upward thrust #1' },
  sfx_thrust_2: { gainDb: 1.0, pan: 0.02, pitchJitterPct: 3, gainJitterDb: 1.5, triggersDuck: true, role: 'Inward-upward thrust #2' },
  sfx_thrust_3: { gainDb: 1.0, pan: 0.0, pitchJitterPct: 3, gainJitterDb: 1.5, triggersDuck: true, role: 'Inward-upward thrust #3' },
  sfx_thrust_4: { gainDb: 1.0, pan: -0.04, pitchJitterPct: 3, gainJitterDb: 1.5, triggersDuck: true, role: 'Inward-upward thrust #4' },
  sfx_thrust_5: { gainDb: 1.0, pan: -0.06, pitchJitterPct: 3, gainJitterDb: 1.5, triggersDuck: true, role: 'Inward-upward thrust #5' },

  sfx_infant_blow_1: { gainDb: -1.5, pan: -0.06, pitchJitterPct: 3, gainJitterDb: 1.5, filterHz: 3600, triggersDuck: true, role: 'Softer infant back blow #1' },
  sfx_infant_blow_2: { gainDb: -1.5, pan: -0.02, pitchJitterPct: 3, gainJitterDb: 1.5, filterHz: 3600, triggersDuck: true, role: 'Softer infant back blow #2' },
  sfx_infant_blow_3: { gainDb: -1.5, pan: 0.02, pitchJitterPct: 3, gainJitterDb: 1.5, filterHz: 3600, triggersDuck: true, role: 'Softer infant back blow #3' },
  sfx_infant_blow_4: { gainDb: -1.5, pan: 0.06, pitchJitterPct: 3, gainJitterDb: 1.5, filterHz: 3600, triggersDuck: true, role: 'Softer infant back blow #4' },

  sfx_infant_thrust_1: { gainDb: -1.5, pan: 0.05, pitchJitterPct: 3, gainJitterDb: 1.5, filterHz: 3200, triggersDuck: true, role: 'Softer infant two-finger thrust #1' },
  sfx_infant_thrust_2: { gainDb: -1.5, pan: 0.02, pitchJitterPct: 3, gainJitterDb: 1.5, filterHz: 3200, triggersDuck: true, role: 'Softer infant two-finger thrust #2' },
  sfx_infant_thrust_3: { gainDb: -1.5, pan: -0.02, pitchJitterPct: 3, gainJitterDb: 1.5, filterHz: 3200, triggersDuck: true, role: 'Softer infant two-finger thrust #3' },
  sfx_infant_thrust_4: { gainDb: -1.5, pan: -0.05, pitchJitterPct: 3, gainJitterDb: 1.5, filterHz: 3200, triggersDuck: true, role: 'Softer infant two-finger thrust #4' },

  sfx_hand_place: { gainDb: -1.0, pan: 0, pitchJitterPct: 2, gainJitterDb: 1.0, triggersDuck: false, role: 'Soft cloth hand placement confirmation' },

  // Object, Environment, Arrival & UI Cues
  sfx_object_pop: { gainDb: 1.0, pan: 0, pitchJitterPct: 2, gainJitterDb: 0.8, triggersDuck: true, role: 'Clear dry pop when obstruction expels' },
  sfx_chair_scrape: { gainDb: -1.0, pan: -0.15, pitchJitterPct: 2, gainJitterDb: 1.0, triggersDuck: true, role: 'Chair pushed back during onset' },
  sfx_utensil_drop: { gainDb: -1.5, pan: 0.15, pitchJitterPct: 2, gainJitterDb: 1.0, triggersDuck: false, role: 'Cutlery clink on table' },
  sfx_body_collapse: { gainDb: -0.5, pan: 0, pitchJitterPct: 1.5, gainJitterDb: 0.8, triggersDuck: true, role: 'Cushioned collapse onto floor' },
  sfx_phone_dial: { gainDb: 0.0, pan: 0.2, pitchJitterPct: 0, gainJitterDb: 0.5, triggersDuck: true, role: 'Calling EMS (123/911) tone' },
  sfx_ambulance_distant: { gainDb: -4.5, pan: 0.25, pitchJitterPct: 0, gainJitterDb: 0.5, filterHz: 2400, triggersDuck: false, role: 'Very soft distant EMS arrival on OA3 only' },
  sfx_aed_beep: { gainDb: -2.0, pan: 0.1, pitchJitterPct: 0, gainJitterDb: 0.5, filterHz: 5200, triggersDuck: false, role: 'Calm AED instruction chime' },
  sfx_ui_page: { gainDb: -2.5, pan: 0, pitchJitterPct: 2, gainJitterDb: 0.8, triggersDuck: false, role: 'Subtle story beat page turn' },
  sfx_ui_select: { gainDb: -2.5, pan: 0, pitchJitterPct: 2, gainJitterDb: 0.6, triggersDuck: false, role: 'Crisp tactile hotspot / card click' },
  sfx_ui_star: { gainDb: -3.5, pan: 0, pitchJitterPct: 0, gainJitterDb: 0.4, filterHz: 5500, triggersDuck: false, role: 'Warm pleasant star bell — smooth, never sharp' },
  sfx_ui_wrong_soft: { gainDb: -3.0, pan: 0, pitchJitterPct: 0, gainJitterDb: 0.5, filterHz: 3200, triggersDuck: false, role: 'Gentle non-punitive feedback tap' },
};

export function dbToGain(db: number): number {
  return Math.pow(10, db / 20);
}

export function gainToDb(gain: number): number {
  if (gain <= 0.0001) return -80;
  return Number((20 * Math.log10(gain)).toFixed(1));
}
