/**
 * NAFAS Per-Level Audio Cue Sheet — All 10 Core Levels (A1–A4, C1–C3, I1–I3)
 *
 * Strictly enforces the Medical Rule for Sound:
 * 1. Severe conscious choking (A2, A4, C1, I1): SILENT after onset gasp.
 *    Zero cough, scream, crying, or speech on S4, S5, OA1, OA2, OB, OC.
 *    Ambience ducks & muffles (~1.1-1.2 kHz), slow calm heartbeat rises with falling SpO2.
 * 2. Mild choking (A1, C3, I3): Strong, loud effective coughs (and loud cry for I3).
 * 3. Unresponsive (A3, C2, I2): ZERO vocal sounds from patient, ZERO CPR metronome.
 *    Soft ambience, phone/AED neutral chime, very distant soft ambulance on final beat (OA3) only.
 * 4. Recovery (OA3 on conscious levels): small pop or single cough -> deep inhale -> relieved exhale
 *    (infant I1: small pop -> short first cry -> mother's relieved exhale) -> ambience opens, hopeful music over ~3.5s.
 */

export type MusicMood = 'calm' | 'tension' | 'hopeful' | 'neutral';

export type SoundPoolId =
  | 'back_blow_pool'
  | 'thrust_pool'
  | 'infant_blow_pool'
  | 'infant_thrust_pool';

export interface AudioCueItem {
  /** Manifest sound ID (e.g. 'body_gasp_male', 'sfx_object_pop') */
  sound: string;
  /** Delay offset in seconds from beat/outcome start */
  at: number;
  /** Relative gain 0..1 */
  volume: number;
  /** Stereo pan -1 (left) to +1 (right) */
  pan?: number;
  /** Loop continuously for the duration of this beat (e.g. slow calm heartbeat) */
  loop?: boolean;
  /** Optional subtle caption shown only when user enables Sound Captions */
  caption?: { en: string; ar: string };
}

export interface BeatAudioBlock {
  music: {
    mood: MusicMood;
    volume: number;
    filterHz: number;
    fadeSec?: number;
  };
  ambience: {
    id: string;
    volume: number;
    filterHz?: number;
  };
  cues: AudioCueItem[];
  notes: string;
}

export type BeatKey = 'S1' | 'S2' | 'S3' | 'S4' | 'S5';
export type OutcomeKey = 'OA1' | 'OA2' | 'OA3' | 'OB' | 'OC';

export interface LevelAudioCueSheet {
  levelId: string;
  ageGroup: 'adult' | 'child' | 'infant';
  severity: 'mild' | 'severe' | 'unresponsive';
  calmMusicTrackId: string;
  ambienceId: string;
  beats: Record<BeatKey, BeatAudioBlock>;
  outcomes: Record<OutcomeKey, BeatAudioBlock>;
  userActions: {
    hotspotTap: string;
    choiceSelect: string;
    handPlace: string;
    backBlowPool?: SoundPoolId;
    frontThrustPool?: SoundPoolId;
    unresponsiveStep?: string;
    pageTurn: string;
    starChime: string;
  };
}

/**
 * Default music assignment per level (ZERO consecutive repeats across A1->A4, C1->C3, I1->I3).
 * Can be overridden live in /qa/audio via localStorage without changing code.
 */
export const DEFAULT_LEVEL_CALM_TRACK: Record<string, string> = {
  A1: 'music_calm_adult_1', // Meditation Impromptu 01
  A2: 'music_calm_adult_2', // Immersed
  A3: 'music_calm_adult_1', // Meditation Impromptu 01
  A4: 'music_calm_adult_2', // Immersed
  C1: 'music_calm_child_1', // Gymnopedie No. 1
  C2: 'music_calm_child_2', // Water Lily
  C3: 'music_calm_child_1', // Gymnopedie No. 1
  I1: 'music_calm_infant_1', // Avec Soin
  I2: 'music_calm_infant_2', // Meditation Impromptu 02
  I3: 'music_calm_infant_1', // Avec Soin
};

export const DEFAULT_MOOD_TRACK: Record<Exclude<MusicMood, 'calm'>, string> = {
  tension: 'music_tension', // Disquiet
  hopeful: 'music_hopeful', // Reawakening
  neutral: 'music_neutral', // Calmant
};

export const SOUND_VARIATION_POOLS: Record<SoundPoolId, string[]> = {
  back_blow_pool: [
    'sfx_back_blow_1',
    'sfx_back_blow_2',
    'sfx_back_blow_3',
    'sfx_back_blow_4',
    'sfx_back_blow_5',
  ],
  thrust_pool: [
    'sfx_thrust_1',
    'sfx_thrust_2',
    'sfx_thrust_3',
    'sfx_thrust_4',
    'sfx_thrust_5',
  ],
  infant_blow_pool: [
    'sfx_infant_blow_1',
    'sfx_infant_blow_2',
    'sfx_infant_blow_3',
    'sfx_infant_blow_4',
  ],
  infant_thrust_pool: [
    'sfx_infant_thrust_1',
    'sfx_infant_thrust_2',
    'sfx_infant_thrust_3',
    'sfx_infant_thrust_4',
  ],
};

export const LEVEL_AUDIO_CUE_SHEETS: Record<string, LevelAudioCueSheet> = {
  // =========================================================================
  // A1 — ADULT MILD CHOKING (Mohamed, Family Dining — Strong Effective Coughs)
  // =========================================================================
  A1: {
    levelId: 'A1',
    ageGroup: 'adult',
    severity: 'mild',
    calmMusicTrackId: DEFAULT_LEVEL_CALM_TRACK.A1,
    ambienceId: 'amb_family_dining',
    beats: {
      S1: {
        music: { mood: 'calm', volume: 0.72, filterHz: 18000, fadeSec: 2.0 },
        ambience: { id: 'amb_family_dining', volume: 0.42, filterHz: 18000 },
        cues: [],
        notes: 'Warm family dining room; calm adult piano 1.',
      },
      S2: {
        music: { mood: 'calm', volume: 0.7, filterHz: 18000, fadeSec: 1.5 },
        ambience: { id: 'amb_family_dining', volume: 0.42, filterHz: 18000 },
        cues: [{ sound: 'sfx_utensil_drop', at: 0.35, volume: 0.45, pan: 0.15 }],
        notes: 'Mohamed laughs while eating; fork clinks on plate.',
      },
      S3: {
        music: { mood: 'calm', volume: 0.56, filterHz: 12000, fadeSec: 1.4 },
        ambience: { id: 'amb_family_dining', volume: 0.34, filterHz: 14000 },
        cues: [
          {
            sound: 'body_cough_adult_strong',
            at: 0.15,
            volume: 0.85,
            pan: 0,
            caption: { en: 'Strong, loud cough', ar: 'كحة قوية ومسموعة' },
          },
        ],
        notes: 'Mild choking onset — strong loud effective adult male cough.',
      },
      S4: {
        music: { mood: 'calm', volume: 0.55, filterHz: 12000, fadeSec: 1.4 },
        ambience: { id: 'amb_family_dining', volume: 0.32, filterHz: 14000 },
        cues: [
          {
            sound: 'body_cough_adult_strong',
            at: 0.3,
            volume: 0.82,
            pan: -0.05,
            caption: { en: 'Continues coughing loudly', ar: 'يستمر في الكحة بصوت واضح' },
          },
        ],
        notes: 'Still able to cough strongly and take breaths between coughs.',
      },
      S5: {
        music: { mood: 'calm', volume: 0.52, filterHz: 10000, fadeSec: 1.5 },
        ambience: { id: 'amb_family_dining', volume: 0.3, filterHz: 12000 },
        cues: [
          {
            sound: 'body_cough_adult_strong',
            at: 0.25,
            volume: 0.78,
            pan: 0,
            caption: { en: 'Clear effective cough', ar: 'كحة فعّالة واضحة' },
          },
        ],
        notes: 'Look & Decide moment — acoustic cue confirms effective mild cough.',
      },
    },
    outcomes: {
      OA1: {
        music: { mood: 'calm', volume: 0.58, filterHz: 14000, fadeSec: 1.5 },
        ambience: { id: 'amb_family_dining', volume: 0.34, filterHz: 16000 },
        cues: [
          {
            sound: 'body_cough_adult_strong',
            at: 0.3,
            volume: 0.82,
            caption: { en: 'Encouraged strong cough', ar: 'كحة قوية بتشجيع المسعف' },
          },
        ],
        notes: 'Rescuer asks "Are you choking?" and encourages coughing.',
      },
      OA2: {
        music: { mood: 'calm', volume: 0.62, filterHz: 16000, fadeSec: 1.5 },
        ambience: { id: 'amb_family_dining', volume: 0.36, filterHz: 18000 },
        cues: [
          {
            sound: 'body_cough_adult_strong',
            at: 0.2,
            volume: 0.84,
            caption: { en: 'One more strong cough', ar: 'كحة قوية إضافية' },
          },
        ],
        notes: 'Rescuer stays close and monitors without hitting back.',
      },
      OA3: {
        music: { mood: 'hopeful', volume: 0.78, filterHz: 20000, fadeSec: 3.5 },
        ambience: { id: 'amb_family_dining', volume: 0.44, filterHz: 20000 },
        cues: [
          {
            sound: 'sfx_object_pop',
            at: 0.12,
            volume: 0.7,
            caption: { en: 'Food piece clears', ar: 'خروج قطعة الطعام' },
          },
          {
            sound: 'body_inhale_relief_male',
            at: 0.65,
            volume: 0.8,
            caption: { en: 'Deep relieved breath', ar: 'نفس عميق مريح' },
          },
        ],
        notes: 'Food clears on its own -> deep relieved breath -> warm hopeful music opens.',
      },
      OB: {
        music: { mood: 'neutral', volume: 0.58, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_family_dining', volume: 0.28, filterHz: 9000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.1, volume: 0.55 }],
        notes: 'Non-punitive wrong choice reflection.',
      },
      OC: {
        music: { mood: 'neutral', volume: 0.58, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_family_dining', volume: 0.28, filterHz: 9000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.1, volume: 0.55 }],
        notes: 'Non-punitive wrong choice reflection.',
      },
    },
    userActions: {
      hotspotTap: 'sfx_ui_select',
      choiceSelect: 'sfx_ui_select',
      handPlace: 'sfx_hand_place',
      pageTurn: 'sfx_ui_page',
      starChime: 'sfx_ui_star',
    },
  },

  // =========================================================================
  // A2 — ADULT SEVERE CONSCIOUS CHOKING (Mohamed, Office Lounge — SILENT AFTER GASP)
  // =========================================================================
  A2: {
    levelId: 'A2',
    ageGroup: 'adult',
    severity: 'severe',
    calmMusicTrackId: DEFAULT_LEVEL_CALM_TRACK.A2,
    ambienceId: 'amb_office_lounge',
    beats: {
      S1: {
        music: { mood: 'calm', volume: 0.72, filterHz: 18000, fadeSec: 2.0 },
        ambience: { id: 'amb_office_lounge', volume: 0.38, filterHz: 18000 },
        cues: [],
        notes: 'Calm workplace lounge snack; adult calm track 2 (Immersed).',
      },
      S2: {
        music: { mood: 'calm', volume: 0.65, filterHz: 15000, fadeSec: 1.5 },
        ambience: { id: 'amb_office_lounge', volume: 0.36, filterHz: 16000 },
        cues: [{ sound: 'sfx_chair_scrape', at: 0.25, volume: 0.62, pan: -0.15 }],
        notes: 'Mohamed stands abruptly pushing chair back.',
      },
      S3: {
        music: { mood: 'tension', volume: 0.5, filterHz: 1200, fadeSec: 1.6 },
        ambience: { id: 'amb_office_lounge', volume: 0.18, filterHz: 1100 },
        cues: [
          {
            sound: 'body_gasp_male',
            at: 0.08,
            volume: 0.75,
            caption: { en: 'Sudden short gasp — then silence', ar: 'شهقة مفاجئة قصيرة — ثم صمت تام' },
          },
          { sound: 'sfx_utensil_drop', at: 0.32, volume: 0.42, pan: 0.2 },
        ],
        notes: 'Onset gasp ONLY — immediately transitions to severe silence + muffled tension.',
      },
      S4: {
        music: { mood: 'tension', volume: 0.5, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_office_lounge', volume: 0.14, filterHz: 1000 },
        cues: [
          {
            sound: 'body_heartbeat_calm',
            at: 0.2,
            volume: 0.48,
            loop: true,
            caption: { en: 'Silent airway — slow heartbeat', ar: 'صمت تام — نبض بطيء' },
          },
        ],
        notes: 'STRICT SILENCE: zero vocal sound; cyanosis develops with calm heartbeat.',
      },
      S5: {
        music: { mood: 'tension', volume: 0.5, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_office_lounge', volume: 0.14, filterHz: 950 },
        cues: [
          {
            sound: 'body_heartbeat_calm',
            at: 0.15,
            volume: 0.52,
            loop: true,
          },
        ],
        notes: 'STRICT SILENCE during Look & Decide; muffled ambience + low-pass tension.',
      },
    },
    outcomes: {
      OA1: {
        music: { mood: 'tension', volume: 0.5, filterHz: 1300, fadeSec: 1.2 },
        ambience: { id: 'amb_office_lounge', volume: 0.16, filterHz: 1100 },
        cues: [
          {
            sound: 'sfx_phone_dial',
            at: 0.1,
            volume: 0.55,
            pan: 0.25,
            caption: { en: 'Emergency call placed', ar: 'الاتصال بالإسعاف' },
          },
          { sound: 'sfx_hand_place', at: 0.7, volume: 0.5 },
        ],
        notes: 'EMS alerted & chest supported forward; patient remains silent.',
      },
      OA2: {
        music: { mood: 'tension', volume: 0.48, filterHz: 1400, fadeSec: 1.2 },
        ambience: { id: 'amb_office_lounge', volume: 0.15, filterHz: 1200 },
        cues: [],
        notes: 'Interactive 5 back blows + 5 belly thrusts — tap pools drive audio with zero latency.',
      },
      OA3: {
        music: { mood: 'hopeful', volume: 0.8, filterHz: 20000, fadeSec: 3.6 },
        ambience: { id: 'amb_office_lounge', volume: 0.4, filterHz: 20000 },
        cues: [
          {
            sound: 'sfx_object_pop',
            at: 0.12,
            volume: 0.78,
            caption: { en: 'Blockage pops out', ar: 'خروج الجسم العالق' },
          },
          {
            sound: 'body_cough_adult_strong',
            at: 0.52,
            volume: 0.75,
            caption: { en: 'Single clearing cough', ar: 'كحة واضحة لاستعادة النفس' },
          },
          {
            sound: 'body_inhale_relief_male',
            at: 1.35,
            volume: 0.84,
            caption: { en: 'Deep inhale and relieved exhale', ar: 'شهيق عميق وزفير مريح' },
          },
        ],
        notes: 'Recovery: pop -> single cough -> deep relieved inhale/exhale -> ambience & hopeful music open.',
      },
      OB: {
        music: { mood: 'neutral', volume: 0.55, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_office_lounge', volume: 0.2, filterHz: 4000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.12, volume: 0.55 }],
        notes: 'Wrong choice (water) — silent patient, gentle neutral music.',
      },
      OC: {
        music: { mood: 'neutral', volume: 0.55, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_office_lounge', volume: 0.2, filterHz: 4000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.12, volume: 0.55 }],
        notes: 'Wrong choice (blind sweep) — silent patient, gentle neutral music.',
      },
    },
    userActions: {
      hotspotTap: 'sfx_ui_select',
      choiceSelect: 'sfx_ui_select',
      handPlace: 'sfx_hand_place',
      backBlowPool: 'back_blow_pool',
      frontThrustPool: 'thrust_pool',
      pageTurn: 'sfx_ui_page',
      starChime: 'sfx_ui_star',
    },
  },

  // =========================================================================
  // A3 — ADULT UNRESPONSIVE (Mohamed — ZERO VOCALS, ZERO CPR METRONOME)
  // =========================================================================
  A3: {
    levelId: 'A3',
    ageGroup: 'adult',
    severity: 'unresponsive',
    calmMusicTrackId: DEFAULT_LEVEL_CALM_TRACK.A3,
    ambienceId: 'amb_office_lounge',
    beats: {
      S1: {
        music: { mood: 'calm', volume: 0.62, filterHz: 9000, fadeSec: 1.8 },
        ambience: { id: 'amb_office_lounge', volume: 0.25, filterHz: 8000 },
        cues: [{ sound: 'sfx_hand_place', at: 0.2, volume: 0.5 }],
        notes: 'Ongoing severe rescue; adult calm track 1 before collapse. Zero vocals.',
      },
      S2: {
        music: { mood: 'tension', volume: 0.5, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_office_lounge', volume: 0.16, filterHz: 1100 },
        cues: [
          {
            sound: 'sfx_body_collapse',
            at: 0.15,
            volume: 0.68,
            caption: { en: 'Person goes limp', ar: 'المصاب يفقد وعيه' },
          },
        ],
        notes: 'Soft cushioned slump; strictly zero vocal sound.',
      },
      S3: {
        music: { mood: 'tension', volume: 0.5, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_office_lounge', volume: 0.16, filterHz: 1100 },
        cues: [{ sound: 'sfx_hand_place', at: 0.25, volume: 0.52 }],
        notes: 'Colleague supports fall gently onto floor. Zero vocals.',
      },
      S4: {
        music: { mood: 'tension', volume: 0.48, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_office_lounge', volume: 0.15, filterHz: 1000 },
        cues: [],
        notes: 'Unresponsive on floor — complete quiet + muffled tension bed. Zero vocals.',
      },
      S5: {
        music: { mood: 'tension', volume: 0.48, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_office_lounge', volume: 0.15, filterHz: 1000 },
        cues: [],
        notes: 'Look & Decide unresponsive — zero vocals, no CPR metronome.',
      },
    },
    outcomes: {
      OA1: {
        music: { mood: 'tension', volume: 0.48, filterHz: 1400, fadeSec: 1.4 },
        ambience: { id: 'amb_office_lounge', volume: 0.18, filterHz: 1500 },
        cues: [{ sound: 'sfx_hand_place', at: 0.15, volume: 0.52 }],
        notes: 'Lower safely onto firm flat surface. Zero vocals.',
      },
      OA2: {
        music: { mood: 'tension', volume: 0.48, filterHz: 1600, fadeSec: 1.4 },
        ambience: { id: 'amb_office_lounge', volume: 0.2, filterHz: 1800 },
        cues: [
          {
            sound: 'sfx_phone_dial',
            at: 0.1,
            volume: 0.58,
            caption: { en: 'EMS called', ar: 'طلب الإسعاف' },
          },
          {
            sound: 'sfx_aed_beep',
            at: 1.15,
            volume: 0.52,
            caption: { en: 'AED ready tone', ar: 'تنبيه جهاز الصدمات' },
          },
        ],
        notes: 'EMS & AED tone — NO CPR metronome, ZERO vocals.',
      },
      OA3: {
        music: { mood: 'hopeful', volume: 0.76, filterHz: 20000, fadeSec: 3.5 },
        ambience: { id: 'amb_office_lounge', volume: 0.34, filterHz: 18000 },
        cues: [
          { sound: 'sfx_aed_beep', at: 0.15, volume: 0.46 },
          {
            sound: 'sfx_ambulance_distant',
            at: 0.85,
            volume: 0.26,
            pan: -0.25,
            caption: { en: 'Distant ambulance arriving', ar: 'صوت إسعاف بعيد يقترب' },
          },
        ],
        notes: 'Final beat only: very distant soft ambulance + warm hopeful music.',
      },
      OB: {
        music: { mood: 'neutral', volume: 0.55, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_office_lounge', volume: 0.2, filterHz: 4000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.12, volume: 0.55 }],
        notes: 'Wrong choice reflection — zero vocals.',
      },
      OC: {
        music: { mood: 'neutral', volume: 0.55, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_office_lounge', volume: 0.2, filterHz: 4000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.12, volume: 0.55 }],
        notes: 'Wrong choice reflection — zero vocals.',
      },
    },
    userActions: {
      hotspotTap: 'sfx_ui_select',
      choiceSelect: 'sfx_ui_select',
      handPlace: 'sfx_hand_place',
      unresponsiveStep: 'sfx_aed_beep',
      pageTurn: 'sfx_ui_page',
      starChime: 'sfx_ui_star',
    },
  },

  // =========================================================================
  // A4 — PREGNANT ADULT SEVERE CHOKING (Workplace Lounge — SILENT AFTER GASP)
  // =========================================================================
  A4: {
    levelId: 'A4',
    ageGroup: 'adult',
    severity: 'severe',
    calmMusicTrackId: DEFAULT_LEVEL_CALM_TRACK.A4,
    ambienceId: 'amb_office_lounge',
    beats: {
      S1: {
        music: { mood: 'calm', volume: 0.72, filterHz: 18000, fadeSec: 2.0 },
        ambience: { id: 'amb_office_lounge', volume: 0.38, filterHz: 18000 },
        cues: [],
        notes: 'Calm workplace lounge; adult calm track 2 (Immersed).',
      },
      S2: {
        music: { mood: 'calm', volume: 0.66, filterHz: 15000, fadeSec: 1.5 },
        ambience: { id: 'amb_office_lounge', volume: 0.36, filterHz: 16000 },
        cues: [{ sound: 'sfx_chair_scrape', at: 0.25, volume: 0.56, pan: 0.1 }],
        notes: 'Colleague pauses mid-meal.',
      },
      S3: {
        music: { mood: 'tension', volume: 0.5, filterHz: 1200, fadeSec: 1.6 },
        ambience: { id: 'amb_office_lounge', volume: 0.18, filterHz: 1100 },
        cues: [
          {
            sound: 'body_gasp_female',
            at: 0.08,
            volume: 0.74,
            caption: { en: 'Brief gasp — then silence', ar: 'شهقة قصيرة — ثم صمت' },
          },
          { sound: 'sfx_utensil_drop', at: 0.3, volume: 0.4 },
        ],
        notes: 'Female onset gasp ONLY -> immediate silence + tension filter.',
      },
      S4: {
        music: { mood: 'tension', volume: 0.5, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_office_lounge', volume: 0.14, filterHz: 1000 },
        cues: [{ sound: 'body_heartbeat_calm', at: 0.2, volume: 0.48, loop: true }],
        notes: 'STRICT SILENCE: zero vocals; colleagues notice late pregnancy.',
      },
      S5: {
        music: { mood: 'tension', volume: 0.5, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_office_lounge', volume: 0.14, filterHz: 950 },
        cues: [{ sound: 'body_heartbeat_calm', at: 0.15, volume: 0.52, loop: true }],
        notes: 'STRICT SILENCE during Look & Decide (chest thrusts needed).',
      },
    },
    outcomes: {
      OA1: {
        music: { mood: 'tension', volume: 0.5, filterHz: 1300, fadeSec: 1.2 },
        ambience: { id: 'amb_office_lounge', volume: 0.16, filterHz: 1100 },
        cues: [
          { sound: 'sfx_phone_dial', at: 0.1, volume: 0.55, pan: 0.2 },
          { sound: 'sfx_hand_place', at: 0.7, volume: 0.5 },
        ],
        notes: 'EMS alerted; patient silent.',
      },
      OA2: {
        music: { mood: 'tension', volume: 0.48, filterHz: 1400, fadeSec: 1.2 },
        ambience: { id: 'amb_office_lounge', volume: 0.15, filterHz: 1200 },
        cues: [],
        notes: 'Interactive 5 back blows + 5 chest thrusts on sternum.',
      },
      OA3: {
        music: { mood: 'hopeful', volume: 0.8, filterHz: 20000, fadeSec: 3.6 },
        ambience: { id: 'amb_office_lounge', volume: 0.4, filterHz: 20000 },
        cues: [
          {
            sound: 'sfx_object_pop',
            at: 0.12,
            volume: 0.78,
            caption: { en: 'Blockage clears', ar: 'خروج الجسم العالق' },
          },
          {
            sound: 'body_inhale_relief_female',
            at: 0.72,
            volume: 0.84,
            caption: { en: 'Deep relieved breath', ar: 'نفس عميق وزفير مريح' },
          },
        ],
        notes: 'Recovery: pop -> female relieved inhale/exhale -> hopeful music opens.',
      },
      OB: {
        music: { mood: 'neutral', volume: 0.55, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_office_lounge', volume: 0.2, filterHz: 4000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.12, volume: 0.55 }],
        notes: 'Wrong choice (belly thrusts) — zero vocals, neutral music.',
      },
      OC: {
        music: { mood: 'neutral', volume: 0.55, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_office_lounge', volume: 0.2, filterHz: 4000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.12, volume: 0.55 }],
        notes: 'Wrong choice (water) — zero vocals, neutral music.',
      },
    },
    userActions: {
      hotspotTap: 'sfx_ui_select',
      choiceSelect: 'sfx_ui_select',
      handPlace: 'sfx_hand_place',
      backBlowPool: 'back_blow_pool',
      frontThrustPool: 'thrust_pool',
      pageTurn: 'sfx_ui_page',
      starChime: 'sfx_ui_star',
    },
  },

  // =========================================================================
  // C1 — CHILD SEVERE CHOKING (Marwan, School Cafeteria — SILENT AFTER GASP)
  // =========================================================================
  C1: {
    levelId: 'C1',
    ageGroup: 'child',
    severity: 'severe',
    calmMusicTrackId: DEFAULT_LEVEL_CALM_TRACK.C1,
    ambienceId: 'amb_school_cafeteria',
    beats: {
      S1: {
        music: { mood: 'calm', volume: 0.72, filterHz: 18000, fadeSec: 2.0 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.42, filterHz: 18000 },
        cues: [],
        notes: 'Warm school cafeteria; child calm track 1 (Gymnopedie No. 1).',
      },
      S2: {
        music: { mood: 'calm', volume: 0.66, filterHz: 15000, fadeSec: 1.5 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.4, filterHz: 16000 },
        cues: [{ sound: 'sfx_utensil_drop', at: 0.25, volume: 0.45 }],
        notes: 'Marwan laughs while eating snack.',
      },
      S3: {
        music: { mood: 'tension', volume: 0.5, filterHz: 1200, fadeSec: 1.6 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.16, filterHz: 1100 },
        cues: [
          {
            sound: 'body_gasp_child',
            at: 0.08,
            volume: 0.72,
            caption: { en: 'Sudden silent gasp', ar: 'شهقة مفاجئة ثم صمت' },
          },
          { sound: 'sfx_chair_scrape', at: 0.28, volume: 0.52 },
        ],
        notes: 'Child onset gasp ONLY -> immediate silence, cafeteria muffles.',
      },
      S4: {
        music: { mood: 'tension', volume: 0.5, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.14, filterHz: 1000 },
        cues: [{ sound: 'body_heartbeat_calm', at: 0.2, volume: 0.48, loop: true }],
        notes: 'STRICT SILENCE: zero vocals; supervisor kneels to child height.',
      },
      S5: {
        music: { mood: 'tension', volume: 0.5, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.14, filterHz: 950 },
        cues: [{ sound: 'body_heartbeat_calm', at: 0.15, volume: 0.52, loop: true }],
        notes: 'STRICT SILENCE during Look & Decide.',
      },
    },
    outcomes: {
      OA1: {
        music: { mood: 'tension', volume: 0.5, filterHz: 1300, fadeSec: 1.2 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.16, filterHz: 1100 },
        cues: [
          { sound: 'sfx_phone_dial', at: 0.1, volume: 0.55 },
          { sound: 'sfx_hand_place', at: 0.65, volume: 0.5 },
        ],
        notes: 'Help alerted & kneeling support; child silent.',
      },
      OA2: {
        music: { mood: 'tension', volume: 0.48, filterHz: 1400, fadeSec: 1.2 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.15, filterHz: 1200 },
        cues: [],
        notes: 'Interactive kneeling 5 back blows + 5 child belly thrusts.',
      },
      OA3: {
        music: { mood: 'hopeful', volume: 0.8, filterHz: 20000, fadeSec: 3.6 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.4, filterHz: 20000 },
        cues: [
          {
            sound: 'sfx_object_pop',
            at: 0.12,
            volume: 0.78,
            caption: { en: 'Food piece clears', ar: 'خروج قطعة الطعام' },
          },
          {
            sound: 'body_cough_child_strong',
            at: 0.5,
            volume: 0.74,
            caption: { en: 'Clearing child cough', ar: 'كحة واضحة للطفل' },
          },
          {
            sound: 'body_inhale_relief_female',
            at: 1.3,
            volume: 0.8,
            caption: { en: 'Relieved deep breath', ar: 'نفس عميق مطمئن' },
          },
        ],
        notes: 'Recovery: pop -> single cough -> relieved exhale -> hopeful music opens.',
      },
      OB: {
        music: { mood: 'neutral', volume: 0.55, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.2, filterHz: 4000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.12, volume: 0.55 }],
        notes: 'Wrong choice reflection — zero vocals.',
      },
      OC: {
        music: { mood: 'neutral', volume: 0.55, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.2, filterHz: 4000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.12, volume: 0.55 }],
        notes: 'Wrong choice reflection — zero vocals.',
      },
    },
    userActions: {
      hotspotTap: 'sfx_ui_select',
      choiceSelect: 'sfx_ui_select',
      handPlace: 'sfx_hand_place',
      backBlowPool: 'back_blow_pool',
      frontThrustPool: 'thrust_pool',
      pageTurn: 'sfx_ui_page',
      starChime: 'sfx_ui_star',
    },
  },

  // =========================================================================
  // C2 — CHILD UNRESPONSIVE (Marwan — ZERO VOCALS, ZERO CPR METRONOME)
  // =========================================================================
  C2: {
    levelId: 'C2',
    ageGroup: 'child',
    severity: 'unresponsive',
    calmMusicTrackId: DEFAULT_LEVEL_CALM_TRACK.C2,
    ambienceId: 'amb_school_cafeteria',
    beats: {
      S1: {
        music: { mood: 'calm', volume: 0.62, filterHz: 9000, fadeSec: 1.8 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.24, filterHz: 8000 },
        cues: [{ sound: 'sfx_hand_place', at: 0.2, volume: 0.48 }],
        notes: 'Child calm track 2 (Water Lily); zero vocals.',
      },
      S2: {
        music: { mood: 'tension', volume: 0.5, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.16, filterHz: 1100 },
        cues: [
          {
            sound: 'sfx_body_collapse',
            at: 0.15,
            volume: 0.64,
            caption: { en: 'Child goes limp', ar: 'الطفل يفقد وعيه' },
          },
        ],
        notes: 'Child becomes limp; strictly zero vocals.',
      },
      S3: {
        music: { mood: 'tension', volume: 0.5, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.15, filterHz: 1050 },
        cues: [{ sound: 'sfx_hand_place', at: 0.25, volume: 0.5 }],
        notes: 'Carefully lowered to firm floor; zero vocals.',
      },
      S4: {
        music: { mood: 'tension', volume: 0.48, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.14, filterHz: 1000 },
        cues: [],
        notes: 'Unresponsive child — zero vocals, soft muffled ambience.',
      },
      S5: {
        music: { mood: 'tension', volume: 0.48, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.14, filterHz: 1000 },
        cues: [],
        notes: 'Look & Decide unresponsive — zero vocals, no CPR metronome.',
      },
    },
    outcomes: {
      OA1: {
        music: { mood: 'tension', volume: 0.48, filterHz: 1400, fadeSec: 1.4 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.18, filterHz: 1500 },
        cues: [{ sound: 'sfx_hand_place', at: 0.15, volume: 0.5 }],
        notes: 'Lowered flat on firm surface; zero vocals.',
      },
      OA2: {
        music: { mood: 'tension', volume: 0.48, filterHz: 1600, fadeSec: 1.4 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.2, filterHz: 1800 },
        cues: [
          { sound: 'sfx_phone_dial', at: 0.1, volume: 0.56 },
          { sound: 'sfx_aed_beep', at: 1.1, volume: 0.5 },
        ],
        notes: 'EMS call + AED tone; zero vocals, no CPR metronome.',
      },
      OA3: {
        music: { mood: 'hopeful', volume: 0.76, filterHz: 20000, fadeSec: 3.5 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.34, filterHz: 18000 },
        cues: [
          { sound: 'sfx_aed_beep', at: 0.15, volume: 0.45 },
          {
            sound: 'sfx_ambulance_distant',
            at: 0.85,
            volume: 0.25,
            pan: -0.25,
            caption: { en: 'Distant ambulance arriving', ar: 'إسعاف بعيد يقترب' },
          },
        ],
        notes: 'Final beat only: very distant soft ambulance + warm hopeful music.',
      },
      OB: {
        music: { mood: 'neutral', volume: 0.55, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.2, filterHz: 4000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.12, volume: 0.55 }],
        notes: 'Wrong choice reflection — zero vocals.',
      },
      OC: {
        music: { mood: 'neutral', volume: 0.55, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.2, filterHz: 4000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.12, volume: 0.55 }],
        notes: 'Wrong choice reflection — zero vocals.',
      },
    },
    userActions: {
      hotspotTap: 'sfx_ui_select',
      choiceSelect: 'sfx_ui_select',
      handPlace: 'sfx_hand_place',
      unresponsiveStep: 'sfx_aed_beep',
      pageTurn: 'sfx_ui_page',
      starChime: 'sfx_ui_star',
    },
  },

  // =========================================================================
  // C3 — CHILD MILD CHOKING (Marwan — Strong Effective Child Cough)
  // =========================================================================
  C3: {
    levelId: 'C3',
    ageGroup: 'child',
    severity: 'mild',
    calmMusicTrackId: DEFAULT_LEVEL_CALM_TRACK.C3,
    ambienceId: 'amb_school_cafeteria',
    beats: {
      S1: {
        music: { mood: 'calm', volume: 0.72, filterHz: 18000, fadeSec: 2.0 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.4, filterHz: 18000 },
        cues: [],
        notes: 'School snack time; child calm track 1 (Gymnopedie No. 1).',
      },
      S2: {
        music: { mood: 'calm', volume: 0.7, filterHz: 18000, fadeSec: 1.5 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.38, filterHz: 18000 },
        cues: [{ sound: 'sfx_utensil_drop', at: 0.3, volume: 0.4 }],
        notes: 'Marwan eats snack too fast.',
      },
      S3: {
        music: { mood: 'calm', volume: 0.56, filterHz: 12000, fadeSec: 1.4 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.32, filterHz: 14000 },
        cues: [
          {
            sound: 'body_cough_child_strong',
            at: 0.15,
            volume: 0.85,
            caption: { en: 'Strong loud child cough', ar: 'كحة قوية ومسموعة للطفل' },
          },
        ],
        notes: 'Mild choking onset — strong effective child cough.',
      },
      S4: {
        music: { mood: 'calm', volume: 0.55, filterHz: 12000, fadeSec: 1.4 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.3, filterHz: 14000 },
        cues: [
          {
            sound: 'body_cough_child_strong',
            at: 0.25,
            volume: 0.82,
            caption: { en: 'Continues coughing strongly', ar: 'يواصل الكحة بقوة' },
          },
        ],
        notes: 'Breathing between coughs.',
      },
      S5: {
        music: { mood: 'calm', volume: 0.52, filterHz: 10000, fadeSec: 1.5 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.28, filterHz: 12000 },
        cues: [{ sound: 'body_cough_child_strong', at: 0.25, volume: 0.78 }],
        notes: 'Look & Decide moment — clear effective cough.',
      },
    },
    outcomes: {
      OA1: {
        music: { mood: 'calm', volume: 0.58, filterHz: 14000, fadeSec: 1.5 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.32, filterHz: 16000 },
        cues: [{ sound: 'body_cough_child_strong', at: 0.25, volume: 0.82 }],
        notes: 'Supervisor stays calm and encourages coughing.',
      },
      OA2: {
        music: { mood: 'calm', volume: 0.62, filterHz: 16000, fadeSec: 1.5 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.34, filterHz: 18000 },
        cues: [{ sound: 'body_cough_child_strong', at: 0.2, volume: 0.8 }],
        notes: 'Watches closely without slapping back.',
      },
      OA3: {
        music: { mood: 'hopeful', volume: 0.78, filterHz: 20000, fadeSec: 3.5 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.42, filterHz: 20000 },
        cues: [
          { sound: 'sfx_object_pop', at: 0.12, volume: 0.7 },
          {
            sound: 'body_inhale_relief_female',
            at: 0.65,
            volume: 0.78,
            caption: { en: 'Relieved deep breath', ar: 'تنفّس عميق مريح' },
          },
        ],
        notes: 'Snack clears cleanly -> relieved exhale -> hopeful music opens.',
      },
      OB: {
        music: { mood: 'neutral', volume: 0.58, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.26, filterHz: 9000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.1, volume: 0.55 }],
        notes: 'Wrong choice reflection.',
      },
      OC: {
        music: { mood: 'neutral', volume: 0.58, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_school_cafeteria', volume: 0.26, filterHz: 9000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.1, volume: 0.55 }],
        notes: 'Wrong choice reflection.',
      },
    },
    userActions: {
      hotspotTap: 'sfx_ui_select',
      choiceSelect: 'sfx_ui_select',
      handPlace: 'sfx_hand_place',
      pageTurn: 'sfx_ui_page',
      starChime: 'sfx_ui_star',
    },
  },

  // =========================================================================
  // I1 — INFANT SEVERE CHOKING (Nelly, Nursery — STRICT SILENCE UNTIL CLEAR)
  // =========================================================================
  I1: {
    levelId: 'I1',
    ageGroup: 'infant',
    severity: 'severe',
    calmMusicTrackId: DEFAULT_LEVEL_CALM_TRACK.I1,
    ambienceId: 'amb_home_nursery',
    beats: {
      S1: {
        music: { mood: 'calm', volume: 0.72, filterHz: 18000, fadeSec: 2.0 },
        ambience: { id: 'amb_home_nursery', volume: 0.36, filterHz: 18000 },
        cues: [],
        notes: 'Peaceful home nursery; infant lullaby piano 1 (Avec Soin).',
      },
      S2: {
        music: { mood: 'calm', volume: 0.66, filterHz: 15000, fadeSec: 1.5 },
        ambience: { id: 'amb_home_nursery', volume: 0.34, filterHz: 16000 },
        cues: [{ sound: 'sfx_hand_place', at: 0.25, volume: 0.42 }],
        notes: 'Nelly puts small piece in mouth.',
      },
      S3: {
        music: { mood: 'tension', volume: 0.48, filterHz: 1200, fadeSec: 1.6 },
        ambience: { id: 'amb_home_nursery', volume: 0.15, filterHz: 1050 },
        cues: [
          {
            sound: 'sfx_hand_place',
            at: 0.12,
            volume: 0.48,
            caption: { en: 'Complete silence — no cry or cough', ar: 'صمت تام — بدون بكاء أو كحة' },
          },
        ],
        notes: 'STRICT SILENCE: severe infant choking produces NO cry or cough; ambience muffles.',
      },
      S4: {
        music: { mood: 'tension', volume: 0.48, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_home_nursery', volume: 0.13, filterHz: 950 },
        cues: [{ sound: 'body_heartbeat_calm', at: 0.2, volume: 0.46, loop: true }],
        notes: 'STRICT SILENCE: zero vocal sound; calm heartbeat as oxygen drops.',
      },
      S5: {
        music: { mood: 'tension', volume: 0.48, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_home_nursery', volume: 0.13, filterHz: 950 },
        cues: [{ sound: 'body_heartbeat_calm', at: 0.15, volume: 0.5, loop: true }],
        notes: 'STRICT SILENCE during Look & Decide.',
      },
    },
    outcomes: {
      OA1: {
        music: { mood: 'tension', volume: 0.48, filterHz: 1300, fadeSec: 1.2 },
        ambience: { id: 'amb_home_nursery', volume: 0.15, filterHz: 1100 },
        cues: [
          { sound: 'sfx_phone_dial', at: 0.1, volume: 0.52 },
          { sound: 'sfx_hand_place', at: 0.6, volume: 0.46 },
        ],
        notes: 'EMS alerted & baby supported face-down along forearm; baby silent.',
      },
      OA2: {
        music: { mood: 'tension', volume: 0.46, filterHz: 1400, fadeSec: 1.2 },
        ambience: { id: 'amb_home_nursery', volume: 0.14, filterHz: 1200 },
        cues: [],
        notes: 'Interactive 5 softer infant back blows + 5 two-finger chest thrusts.',
      },
      OA3: {
        music: { mood: 'hopeful', volume: 0.8, filterHz: 20000, fadeSec: 3.6 },
        ambience: { id: 'amb_home_nursery', volume: 0.38, filterHz: 20000 },
        cues: [
          {
            sound: 'sfx_object_pop',
            at: 0.12,
            volume: 0.7,
            caption: { en: 'Small object clears', ar: 'خروج الجسم الصغير' },
          },
          {
            sound: 'body_cry_infant_loud',
            at: 0.5,
            volume: 0.72,
            caption: { en: 'Short reassuring first cry', ar: 'أول بكاء مطمئن للرضيعة' },
          },
          {
            sound: 'body_inhale_relief_female',
            at: 1.65,
            volume: 0.82,
            caption: { en: 'Mother exhales in relief', ar: 'زفير ارتياح من الأم' },
          },
        ],
        notes: 'Recovery: pop -> short first infant cry -> mother relieved exhale -> hopeful music opens.',
      },
      OB: {
        music: { mood: 'neutral', volume: 0.55, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_home_nursery', volume: 0.18, filterHz: 4000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.12, volume: 0.55 }],
        notes: 'Wrong choice reflection — zero vocals.',
      },
      OC: {
        music: { mood: 'neutral', volume: 0.55, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_home_nursery', volume: 0.18, filterHz: 4000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.12, volume: 0.55 }],
        notes: 'Wrong choice reflection — zero vocals.',
      },
    },
    userActions: {
      hotspotTap: 'sfx_ui_select',
      choiceSelect: 'sfx_ui_select',
      handPlace: 'sfx_hand_place',
      backBlowPool: 'infant_blow_pool',
      frontThrustPool: 'infant_thrust_pool',
      pageTurn: 'sfx_ui_page',
      starChime: 'sfx_ui_star',
    },
  },

  // =========================================================================
  // I2 — INFANT UNRESPONSIVE (Nelly — ZERO VOCALS, ZERO CPR METRONOME)
  // =========================================================================
  I2: {
    levelId: 'I2',
    ageGroup: 'infant',
    severity: 'unresponsive',
    calmMusicTrackId: DEFAULT_LEVEL_CALM_TRACK.I2,
    ambienceId: 'amb_home_nursery',
    beats: {
      S1: {
        music: { mood: 'calm', volume: 0.6, filterHz: 9000, fadeSec: 1.8 },
        ambience: { id: 'amb_home_nursery', volume: 0.22, filterHz: 8000 },
        cues: [{ sound: 'sfx_hand_place', at: 0.2, volume: 0.45 }],
        notes: 'Infant lullaby piano 2 (Meditation Impromptu 02); zero vocals.',
      },
      S2: {
        music: { mood: 'tension', volume: 0.48, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_home_nursery', volume: 0.14, filterHz: 1050 },
        cues: [
          {
            sound: 'sfx_hand_place',
            at: 0.15,
            volume: 0.48,
            caption: { en: 'Infant becomes limp', ar: 'الرضيعة تصبح مرتخية' },
          },
        ],
        notes: 'Infant goes limp; strictly zero vocals.',
      },
      S3: {
        music: { mood: 'tension', volume: 0.48, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_home_nursery', volume: 0.14, filterHz: 1000 },
        cues: [{ sound: 'sfx_hand_place', at: 0.2, volume: 0.46 }],
        notes: 'Laid gently on firm flat surface; zero vocals.',
      },
      S4: {
        music: { mood: 'tension', volume: 0.46, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_home_nursery', volume: 0.13, filterHz: 950 },
        cues: [],
        notes: 'Unresponsive infant — zero vocals.',
      },
      S5: {
        music: { mood: 'tension', volume: 0.46, filterHz: 1200, fadeSec: 1.5 },
        ambience: { id: 'amb_home_nursery', volume: 0.13, filterHz: 950 },
        cues: [],
        notes: 'Look & Decide unresponsive — zero vocals, no CPR metronome.',
      },
    },
    outcomes: {
      OA1: {
        music: { mood: 'tension', volume: 0.46, filterHz: 1400, fadeSec: 1.4 },
        ambience: { id: 'amb_home_nursery', volume: 0.16, filterHz: 1500 },
        cues: [{ sound: 'sfx_hand_place', at: 0.15, volume: 0.46 }],
        notes: 'Firm flat surface; zero vocals.',
      },
      OA2: {
        music: { mood: 'tension', volume: 0.46, filterHz: 1600, fadeSec: 1.4 },
        ambience: { id: 'amb_home_nursery', volume: 0.18, filterHz: 1800 },
        cues: [
          { sound: 'sfx_phone_dial', at: 0.1, volume: 0.54 },
          { sound: 'sfx_aed_beep', at: 1.1, volume: 0.48 },
        ],
        notes: 'EMS call + dispatcher/AED tone; zero vocals, no CPR metronome.',
      },
      OA3: {
        music: { mood: 'hopeful', volume: 0.76, filterHz: 20000, fadeSec: 3.5 },
        ambience: { id: 'amb_home_nursery', volume: 0.32, filterHz: 18000 },
        cues: [
          { sound: 'sfx_aed_beep', at: 0.15, volume: 0.44 },
          {
            sound: 'sfx_ambulance_distant',
            at: 0.85,
            volume: 0.24,
            pan: -0.25,
            caption: { en: 'Distant ambulance arriving', ar: 'إسعاف بعيد يقترب' },
          },
        ],
        notes: 'Final beat only: very distant soft ambulance + warm hopeful music.',
      },
      OB: {
        music: { mood: 'neutral', volume: 0.55, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_home_nursery', volume: 0.18, filterHz: 4000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.12, volume: 0.55 }],
        notes: 'Wrong choice reflection — zero vocals.',
      },
      OC: {
        music: { mood: 'neutral', volume: 0.55, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_home_nursery', volume: 0.18, filterHz: 4000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.12, volume: 0.55 }],
        notes: 'Wrong choice reflection — zero vocals.',
      },
    },
    userActions: {
      hotspotTap: 'sfx_ui_select',
      choiceSelect: 'sfx_ui_select',
      handPlace: 'sfx_hand_place',
      unresponsiveStep: 'sfx_aed_beep',
      pageTurn: 'sfx_ui_page',
      starChime: 'sfx_ui_star',
    },
  },

  // =========================================================================
  // I3 — INFANT MILD CHOKING (Nelly — Loud Cry & Effective Infant Cough)
  // =========================================================================
  I3: {
    levelId: 'I3',
    ageGroup: 'infant',
    severity: 'mild',
    calmMusicTrackId: DEFAULT_LEVEL_CALM_TRACK.I3,
    ambienceId: 'amb_home_nursery',
    beats: {
      S1: {
        music: { mood: 'calm', volume: 0.72, filterHz: 18000, fadeSec: 2.0 },
        ambience: { id: 'amb_home_nursery', volume: 0.36, filterHz: 18000 },
        cues: [],
        notes: 'Calm home feeding; infant calm track 1 (Avec Soin).',
      },
      S2: {
        music: { mood: 'calm', volume: 0.7, filterHz: 18000, fadeSec: 1.5 },
        ambience: { id: 'amb_home_nursery', volume: 0.34, filterHz: 18000 },
        cues: [{ sound: 'sfx_utensil_drop', at: 0.3, volume: 0.35 }],
        notes: 'Soft fruit snack in highchair.',
      },
      S3: {
        music: { mood: 'calm', volume: 0.55, filterHz: 12000, fadeSec: 1.4 },
        ambience: { id: 'amb_home_nursery', volume: 0.3, filterHz: 14000 },
        cues: [
          {
            sound: 'body_cough_infant',
            at: 0.15,
            volume: 0.82,
            caption: { en: 'Clear infant cough', ar: 'كحة واضحة للرضيعة' },
          },
          {
            sound: 'body_cry_infant_loud',
            at: 0.9,
            volume: 0.74,
            caption: { en: 'Loud cry (airway is open)', ar: 'بكاء مسموع (مجرى النفس مفتوح)' },
          },
        ],
        notes: 'Mild infant choking — effective cough + loud cry proves air moves.',
      },
      S4: {
        music: { mood: 'calm', volume: 0.55, filterHz: 12000, fadeSec: 1.4 },
        ambience: { id: 'amb_home_nursery', volume: 0.28, filterHz: 14000 },
        cues: [
          {
            sound: 'body_cry_infant_loud',
            at: 0.2,
            volume: 0.72,
            caption: { en: 'Crying & coughing audibly', ar: 'تبكي وتكح بصوت واضح' },
          },
        ],
        notes: 'Audible cry & pink skin color confirm mild obstruction.',
      },
      S5: {
        music: { mood: 'calm', volume: 0.52, filterHz: 10000, fadeSec: 1.5 },
        ambience: { id: 'amb_home_nursery', volume: 0.28, filterHz: 12000 },
        cues: [{ sound: 'body_cough_infant', at: 0.25, volume: 0.78 }],
        notes: 'Look & Decide moment — strong infant cough & cry.',
      },
    },
    outcomes: {
      OA1: {
        music: { mood: 'calm', volume: 0.58, filterHz: 14000, fadeSec: 1.5 },
        ambience: { id: 'amb_home_nursery', volume: 0.3, filterHz: 16000 },
        cues: [{ sound: 'body_cough_infant', at: 0.25, volume: 0.78 }],
        notes: 'Mother stays calm, keeps Nelly upright, and monitors.',
      },
      OA2: {
        music: { mood: 'calm', volume: 0.62, filterHz: 16000, fadeSec: 1.5 },
        ambience: { id: 'amb_home_nursery', volume: 0.32, filterHz: 18000 },
        cues: [{ sound: 'body_cough_infant', at: 0.2, volume: 0.74 }],
        notes: 'Watches closely without slapping back or sweeping mouth.',
      },
      OA3: {
        music: { mood: 'hopeful', volume: 0.8, filterHz: 20000, fadeSec: 3.5 },
        ambience: { id: 'amb_home_nursery', volume: 0.38, filterHz: 20000 },
        cues: [
          { sound: 'sfx_object_pop', at: 0.12, volume: 0.66 },
          {
            sound: 'body_inhale_relief_female',
            at: 0.68,
            volume: 0.8,
            caption: { en: 'Mother exhales in relief', ar: 'زفير ارتياح من الأم' },
          },
        ],
        notes: 'Soft food clears -> mother relieved exhale -> warm hopeful music opens.',
      },
      OB: {
        music: { mood: 'neutral', volume: 0.58, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_home_nursery', volume: 0.24, filterHz: 9000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.1, volume: 0.55 }],
        notes: 'Wrong choice reflection.',
      },
      OC: {
        music: { mood: 'neutral', volume: 0.58, filterHz: 8500, fadeSec: 1.8 },
        ambience: { id: 'amb_home_nursery', volume: 0.24, filterHz: 9000 },
        cues: [{ sound: 'sfx_ui_wrong_soft', at: 0.1, volume: 0.55 }],
        notes: 'Wrong choice reflection.',
      },
    },
    userActions: {
      hotspotTap: 'sfx_ui_select',
      choiceSelect: 'sfx_ui_select',
      handPlace: 'sfx_hand_place',
      pageTurn: 'sfx_ui_page',
      starChime: 'sfx_ui_star',
    },
  },
};

export function getLevelAudioCueSheet(levelId: string): LevelAudioCueSheet {
  const key = levelId.toUpperCase();
  return LEVEL_AUDIO_CUE_SHEETS[key] || LEVEL_AUDIO_CUE_SHEETS.A2;
}
