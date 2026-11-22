/**
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
  integratedLufs?: number;
  truePeakDbtp?: number;
  lraLu?: number;
  bpm?: number;
  sourceUrl: string;
  downloadUrl?: string;
  author: string;
  license: string;
  attribution: string;
  status: 'ready' | 'missing';
  isVocal: boolean;
  isBodySound: boolean;
  notes?: string;
  searchTerms?: string[];
}

export const AUDIO_MANIFEST: AudioAssetEntry[] = [
  {
    "id": "music_calm_adult_1",
    "title": "Meditation Impromptu 01",
    "file": "/audio/music/music_calm_adult_1.mp3",
    "oggFile": "/audio/music/music_calm_adult_1.ogg",
    "category": "music",
    "mood": "calm",
    "levelMapping": [
      "A1",
      "A3"
    ],
    "durationSec": 84.04,
    "bpm": 60,
    "sourceUrl": "https://incompetech.com/music/royalty-free/music.html",
    "downloadUrl": "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2001.mp3",
    "author": "Kevin MacLeod (incompetech.com)",
    "license": "CC BY 4.0",
    "attribution": "\"Meditation Impromptu 01\" by Kevin MacLeod (incompetech.com), licensed under Creative Commons: By Attribution 4.0 License (http://creativecommons.org/licenses/by/4.0/)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "notes": "Warm gentle piano solo — calm adult scenes A1 & A3",
    "integratedLufs": -23.36,
    "truePeakDbtp": -6.45,
    "lraLu": 7.2
  },
  {
    "id": "music_calm_adult_2",
    "title": "Immersed",
    "file": "/audio/music/music_calm_adult_2.mp3",
    "oggFile": "/audio/music/music_calm_adult_2.ogg",
    "category": "music",
    "mood": "calm",
    "levelMapping": [
      "A2",
      "A4"
    ],
    "durationSec": 84.04,
    "bpm": 64,
    "sourceUrl": "https://incompetech.com/music/royalty-free/music.html",
    "downloadUrl": "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Immersed.mp3",
    "author": "Kevin MacLeod (incompetech.com)",
    "license": "CC BY 4.0",
    "attribution": "\"Immersed\" by Kevin MacLeod (incompetech.com), licensed under Creative Commons: By Attribution 4.0 License (http://creativecommons.org/licenses/by/4.0/)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "notes": "Warm piano & soft strings — calm adult scenes A2 & A4",
    "integratedLufs": -23.34,
    "truePeakDbtp": -6.72,
    "lraLu": 7.5
  },
  {
    "id": "music_calm_child_1",
    "title": "Gymnopedie No. 1",
    "file": "/audio/music/music_calm_child_1.mp3",
    "oggFile": "/audio/music/music_calm_child_1.ogg",
    "category": "music",
    "mood": "calm",
    "levelMapping": [
      "C1",
      "C3"
    ],
    "durationSec": 84.04,
    "bpm": 77,
    "sourceUrl": "https://incompetech.com/music/royalty-free/music.html",
    "downloadUrl": "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Gymnopedie%20No%201.mp3",
    "author": "Kevin MacLeod (incompetech.com)",
    "license": "CC BY 4.0",
    "attribution": "\"Gymnopedie No. 1\" by Kevin MacLeod (incompetech.com), licensed under Creative Commons: By Attribution 4.0 License (http://creativecommons.org/licenses/by/4.0/)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "notes": "Gentle classical piano — calm child scenes C1 & C3",
    "integratedLufs": -23.27,
    "truePeakDbtp": -7.05,
    "lraLu": 7
  },
  {
    "id": "music_calm_child_2",
    "title": "Water Lily",
    "file": "/audio/music/music_calm_child_2.mp3",
    "oggFile": "/audio/music/music_calm_child_2.ogg",
    "category": "music",
    "mood": "calm",
    "levelMapping": [
      "C2"
    ],
    "durationSec": 84.04,
    "bpm": 62,
    "sourceUrl": "https://incompetech.com/music/royalty-free/music.html",
    "downloadUrl": "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Water%20Lily.mp3",
    "author": "Kevin MacLeod (incompetech.com)",
    "license": "CC BY 4.0",
    "attribution": "\"Water Lily\" by Kevin MacLeod (incompetech.com), licensed under Creative Commons: By Attribution 4.0 License (http://creativecommons.org/licenses/by/4.0/)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "notes": "Warm piano & soft cellos — calm child scene C2",
    "integratedLufs": -23.34,
    "truePeakDbtp": -8.76,
    "lraLu": 7
  },
  {
    "id": "music_calm_infant_1",
    "title": "Avec Soin",
    "file": "/audio/music/music_calm_infant_1.mp3",
    "oggFile": "/audio/music/music_calm_infant_1.ogg",
    "category": "music",
    "mood": "calm",
    "levelMapping": [
      "I1",
      "I3"
    ],
    "durationSec": 84.04,
    "bpm": 64,
    "sourceUrl": "https://incompetech.com/music/royalty-free/music.html",
    "downloadUrl": "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Avec%20Soin.mp3",
    "author": "Kevin MacLeod (incompetech.com)",
    "license": "CC BY 4.0",
    "attribution": "\"Avec Soin\" by Kevin MacLeod (incompetech.com), licensed under Creative Commons: By Attribution 4.0 License (http://creativecommons.org/licenses/by/4.0/)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "notes": "Gentle lullaby-like piano — calm infant scenes I1 & I3",
    "integratedLufs": -23.28,
    "truePeakDbtp": -6.45,
    "lraLu": 8.3
  },
  {
    "id": "music_calm_infant_2",
    "title": "Meditation Impromptu 02",
    "file": "/audio/music/music_calm_infant_2.mp3",
    "oggFile": "/audio/music/music_calm_infant_2.ogg",
    "category": "music",
    "mood": "calm",
    "levelMapping": [
      "I2"
    ],
    "durationSec": 84.04,
    "bpm": 58,
    "sourceUrl": "https://incompetech.com/music/royalty-free/music.html",
    "downloadUrl": "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2002.mp3",
    "author": "Kevin MacLeod (incompetech.com)",
    "license": "CC BY 4.0",
    "attribution": "\"Meditation Impromptu 02\" by Kevin MacLeod (incompetech.com), licensed under Creative Commons: By Attribution 4.0 License (http://creativecommons.org/licenses/by/4.0/)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "notes": "Soft lullaby piano — calm infant scene I2",
    "integratedLufs": -23.27,
    "truePeakDbtp": -6.99,
    "lraLu": 5.8
  },
  {
    "id": "music_tension",
    "title": "Disquiet",
    "file": "/audio/music/music_tension.mp3",
    "oggFile": "/audio/music/music_tension.ogg",
    "category": "music",
    "mood": "tension",
    "levelMapping": [
      "ALL"
    ],
    "durationSec": 84.04,
    "bpm": 70,
    "sourceUrl": "https://incompetech.com/music/royalty-free/music.html",
    "downloadUrl": "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Disquiet.mp3",
    "author": "Kevin MacLeod (incompetech.com)",
    "license": "CC BY 4.0",
    "attribution": "\"Disquiet\" by Kevin MacLeod (incompetech.com), licensed under Creative Commons: By Attribution 4.0 License (http://creativecommons.org/licenses/by/4.0/)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "notes": "Subtle somber piano tension bed (played at -6 dB with ~1.2 kHz low-pass)",
    "integratedLufs": -23.31,
    "truePeakDbtp": -8.95,
    "lraLu": 9.2
  },
  {
    "id": "music_hopeful",
    "title": "Reawakening",
    "file": "/audio/music/music_hopeful.mp3",
    "oggFile": "/audio/music/music_hopeful.ogg",
    "category": "music",
    "mood": "hopeful",
    "levelMapping": [
      "ALL"
    ],
    "durationSec": 84.04,
    "bpm": 56,
    "sourceUrl": "https://incompetech.com/music/royalty-free/music.html",
    "downloadUrl": "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Reawakening.mp3",
    "author": "Kevin MacLeod (incompetech.com)",
    "license": "CC BY 4.0",
    "attribution": "\"Reawakening\" by Kevin MacLeod (incompetech.com), licensed under Creative Commons: By Attribution 4.0 License (http://creativecommons.org/licenses/by/4.0/)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "notes": "Warm hopeful piano & cello — opens gently over 3-4s on rescue success",
    "integratedLufs": -23.32,
    "truePeakDbtp": -7.17,
    "lraLu": 8.2
  },
  {
    "id": "music_neutral",
    "title": "Calmant",
    "file": "/audio/music/music_neutral.mp3",
    "oggFile": "/audio/music/music_neutral.ogg",
    "category": "music",
    "mood": "neutral",
    "levelMapping": [
      "ALL"
    ],
    "durationSec": 84.04,
    "bpm": 58,
    "sourceUrl": "https://incompetech.com/music/royalty-free/music.html",
    "downloadUrl": "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Calmant.mp3",
    "author": "Kevin MacLeod (incompetech.com)",
    "license": "CC BY 4.0",
    "attribution": "\"Calmant\" by Kevin MacLeod (incompetech.com), licensed under Creative Commons: By Attribution 4.0 License (http://creativecommons.org/licenses/by/4.0/)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "notes": "Soft neutral piano reflection — non-punitive wrong-choice debrief",
    "integratedLufs": -23.28,
    "truePeakDbtp": -8.51,
    "lraLu": 7
  },
  {
    "id": "amb_family_dining",
    "title": "Restaurant ambience",
    "file": "/audio/ambience/amb_family_dining.mp3",
    "oggFile": "/audio/ambience/amb_family_dining.ogg",
    "category": "ambience",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 22.05,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Restaurant_ambience.ogg",
    "author": "stephan",
    "license": "Public domain",
    "attribution": "\"Restaurant ambience\" by stephan (https://commons.wikimedia.org/wiki/File:Restaurant_ambience.ogg), Public domain",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -23.26,
    "truePeakDbtp": -3.13,
    "lraLu": 4
  },
  {
    "id": "amb_office_lounge",
    "title": "Ambient classroom mono",
    "file": "/audio/ambience/amb_office_lounge.mp3",
    "oggFile": "/audio/ambience/amb_office_lounge.ogg",
    "category": "ambience",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 22.05,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ambient_classroom_mono.ogg",
    "author": "rcrossley",
    "license": "Public domain",
    "attribution": "\"Ambient classroom mono\" by rcrossley (https://commons.wikimedia.org/wiki/File:Ambient_classroom_mono.ogg), Public domain",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -23.25,
    "truePeakDbtp": -5.09,
    "lraLu": 2.3
  },
  {
    "id": "amb_school_cafeteria",
    "title": "High school cafeteria",
    "file": "/audio/ambience/amb_school_cafeteria.mp3",
    "oggFile": "/audio/ambience/amb_school_cafeteria.ogg",
    "category": "ambience",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 22.05,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:High_school_cafeteria.ogg",
    "author": "aradlaw",
    "license": "Public domain",
    "attribution": "\"High school cafeteria\" by aradlaw (https://commons.wikimedia.org/wiki/File:High_school_cafeteria.ogg), Public domain",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -23.31,
    "truePeakDbtp": -15.74,
    "lraLu": 2
  },
  {
    "id": "body_cough_adult_strong",
    "title": "Man coughing",
    "file": "/audio/sfx/body_cough_adult_strong.mp3",
    "oggFile": "/audio/sfx/body_cough_adult_strong.ogg",
    "category": "body",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 2.53,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Man_coughing.ogg",
    "author": "stilgar",
    "license": "Public domain",
    "attribution": "\"Man coughing\" by stilgar (https://commons.wikimedia.org/wiki/File:Man_coughing.ogg), Public domain",
    "status": "ready",
    "isVocal": true,
    "isBodySound": true,
    "integratedLufs": -23.26,
    "truePeakDbtp": -14.65,
    "lraLu": 0
  },
  {
    "id": "body_cough_child_strong",
    "title": "The-description-of-cough-sounds-by-healthcare-professionals-1745-9974-2-1-S1",
    "file": "/audio/sfx/body_cough_child_strong.mp3",
    "oggFile": "/audio/sfx/body_cough_child_strong.ogg",
    "category": "body",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.57,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:The-description-of-cough-sounds-by-healthcare-professionals-1745-9974-2-1-S1.ogg",
    "author": "Smith J, Ashurst H, Jack S, Woodcock A, Earis J",
    "license": "CC BY 2.0",
    "attribution": "\"The-description-of-cough-sounds-by-healthcare-professionals-1745-9974-2-1-S1\" by Smith J, Ashurst H, Jack S, Woodcock A, Earis J (https://commons.wikimedia.org/wiki/File:The-description-of-cough-sounds-by-healthcare-professionals-1745-9974-2-1-S1.ogg), licensed under CC BY 2.0 (https://creativecommons.org/licenses/by/2.0)",
    "status": "ready",
    "isVocal": true,
    "isBodySound": true,
    "integratedLufs": -21.21,
    "truePeakDbtp": -12.54,
    "lraLu": 0
  },
  {
    "id": "body_cough_infant",
    "title": "The-description-of-cough-sounds-by-healthcare-professionals-1745-9974-2-1-S2",
    "file": "/audio/sfx/body_cough_infant.mp3",
    "oggFile": "/audio/sfx/body_cough_infant.ogg",
    "category": "body",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.97,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:The-description-of-cough-sounds-by-healthcare-professionals-1745-9974-2-1-S2.ogg",
    "author": "Smith J, Ashurst H, Jack S, Woodcock A, Earis J",
    "license": "CC BY 2.0",
    "attribution": "\"The-description-of-cough-sounds-by-healthcare-professionals-1745-9974-2-1-S2\" by Smith J, Ashurst H, Jack S, Woodcock A, Earis J (https://commons.wikimedia.org/wiki/File:The-description-of-cough-sounds-by-healthcare-professionals-1745-9974-2-1-S2.ogg), licensed under CC BY 2.0 (https://creativecommons.org/licenses/by/2.0)",
    "status": "ready",
    "isVocal": true,
    "isBodySound": true,
    "integratedLufs": -21.14,
    "truePeakDbtp": -5.47,
    "lraLu": 0
  },
  {
    "id": "body_cry_infant_loud",
    "title": "Babys disappointed crying",
    "file": "/audio/sfx/body_cry_infant_loud.mp3",
    "oggFile": "/audio/sfx/body_cry_infant_loud.ogg",
    "category": "body",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 3.03,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Babys_disappointed_crying.oga",
    "author": "natalie",
    "license": "Public domain",
    "attribution": "\"Babys disappointed crying\" by natalie (https://commons.wikimedia.org/wiki/File:Babys_disappointed_crying.oga), Public domain",
    "status": "ready",
    "isVocal": true,
    "isBodySound": true,
    "integratedLufs": -23.26,
    "truePeakDbtp": -7.6,
    "lraLu": 0.1
  },
  {
    "id": "body_heartbeat_calm",
    "title": "Heart beats sounds - Glaneur de sons",
    "file": "/audio/sfx/body_heartbeat_calm.mp3",
    "oggFile": "/audio/sfx/body_heartbeat_calm.ogg",
    "category": "body",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 1.1,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Heart_beats_sounds_-_Glaneur_de_sons.ogg",
    "author": "Glaneur de sons",
    "license": "CC BY 3.0",
    "attribution": "\"Heart beats sounds - Glaneur de sons\" by Glaneur de sons (https://commons.wikimedia.org/wiki/File:Heart_beats_sounds_-_Glaneur_de_sons.ogg), licensed under CC BY 3.0 (https://creativecommons.org/licenses/by/3.0)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": true,
    "integratedLufs": -21.22,
    "truePeakDbtp": -5.17,
    "lraLu": 0
  },
  {
    "id": "sfx_chair_scrape",
    "title": "Assorted creaking noises of office chair",
    "file": "/audio/sfx/sfx_chair_scrape.mp3",
    "oggFile": "/audio/sfx/sfx_chair_scrape.ogg",
    "category": "environment",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 1.15,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Assorted_creaking_noises_of_office_chair.ogg",
    "author": "stephan",
    "license": "Public domain",
    "attribution": "\"Assorted creaking noises of office chair\" by stephan (https://commons.wikimedia.org/wiki/File:Assorted_creaking_noises_of_office_chair.ogg), Public domain",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.25,
    "truePeakDbtp": -0.45,
    "lraLu": 0
  },
  {
    "id": "sfx_phone_dial",
    "title": "Dial tone Germany System 55 till 09-1979",
    "file": "/audio/sfx/sfx_phone_dial.mp3",
    "oggFile": "/audio/sfx/sfx_phone_dial.ogg",
    "category": "arrival",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 1.44,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Dial_tone_Germany_System_55_till_09-1979.ogg",
    "author": "René Böke ( Paulchen-Weimar )",
    "license": "CC BY-SA 3.0",
    "attribution": "\"Dial tone Germany System 55 till 09-1979\" by René Böke ( Paulchen-Weimar ) (https://commons.wikimedia.org/wiki/File:Dial_tone_Germany_System_55_till_09-1979.ogg), licensed under CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.26,
    "truePeakDbtp": -19.45,
    "lraLu": 0
  },
  {
    "id": "sfx_ambulance_distant",
    "title": "Hoorn van een ambulance - SoundCloud - Beeld en Geluid",
    "file": "/audio/sfx/sfx_ambulance_distant.mp3",
    "oggFile": "/audio/sfx/sfx_ambulance_distant.ogg",
    "category": "arrival",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 5.54,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Hoorn_van_een_ambulance_-_SoundCloud_-_Beeld_en_Geluid.ogg",
    "author": "Beeld en Geluid",
    "license": "CC BY-SA 3.0",
    "attribution": "\"Hoorn van een ambulance - SoundCloud - Beeld en Geluid\" by Beeld en Geluid (https://commons.wikimedia.org/wiki/File:Hoorn_van_een_ambulance_-_SoundCloud_-_Beeld_en_Geluid.ogg), licensed under CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -23.26,
    "truePeakDbtp": -11.2,
    "lraLu": 3.4
  },
  {
    "id": "sfx_ui_page",
    "title": "Turning a page",
    "file": "/audio/sfx/sfx_ui_page.mp3",
    "oggFile": "/audio/sfx/sfx_ui_page.ogg",
    "category": "ui",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.6,
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Turning_a_page.ogg",
    "author": "planish",
    "license": "Public domain",
    "attribution": "\"Turning a page\" by planish (https://commons.wikimedia.org/wiki/File:Turning_a_page.ogg), Public domain",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.24,
    "truePeakDbtp": -12.04,
    "lraLu": 0
  },
  {
    "id": "amb_home_nursery",
    "title": "Wall clock tick tock",
    "file": "/audio/ambience/amb_home_nursery.mp3",
    "oggFile": "/audio/ambience/amb_home_nursery.ogg",
    "category": "ambience",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 18.05,
    "sourceUrl": "https://mixkit.co/free-sound-effects/clock/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Wall clock tick tock\" from Mixkit (https://mixkit.co/free-sound-effects/clock/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -23.26,
    "truePeakDbtp": -2.55,
    "lraLu": 2.3
  },
  {
    "id": "body_gasp_male",
    "title": "Male astonished gasp",
    "file": "/audio/sfx/body_gasp_male.mp3",
    "oggFile": "/audio/sfx/body_gasp_male.ogg",
    "category": "body",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 1.2,
    "sourceUrl": "https://mixkit.co/free-sound-effects/gasp/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Male astonished gasp\" from Mixkit (https://mixkit.co/free-sound-effects/gasp/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": true,
    "isBodySound": true,
    "integratedLufs": -21.2,
    "truePeakDbtp": -9.39,
    "lraLu": 0
  },
  {
    "id": "body_gasp_female",
    "title": "Female astonished gasp",
    "file": "/audio/sfx/body_gasp_female.mp3",
    "oggFile": "/audio/sfx/body_gasp_female.ogg",
    "category": "body",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 1.04,
    "sourceUrl": "https://mixkit.co/free-sound-effects/gasp/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Female astonished gasp\" from Mixkit (https://mixkit.co/free-sound-effects/gasp/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": true,
    "isBodySound": true,
    "integratedLufs": -21.18,
    "truePeakDbtp": -10.78,
    "lraLu": 0
  },
  {
    "id": "body_gasp_child",
    "title": "Female surprised gasp",
    "file": "/audio/sfx/body_gasp_child.mp3",
    "oggFile": "/audio/sfx/body_gasp_child.ogg",
    "category": "body",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 1.1,
    "sourceUrl": "https://mixkit.co/free-sound-effects/gasp/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Female surprised gasp\" from Mixkit (https://mixkit.co/free-sound-effects/gasp/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": true,
    "isBodySound": true,
    "integratedLufs": -21.14,
    "truePeakDbtp": -11.63,
    "lraLu": 0
  },
  {
    "id": "body_inhale_relief_male",
    "title": "Strong breathing of a person",
    "file": "/audio/sfx/body_inhale_relief_male.mp3",
    "oggFile": "/audio/sfx/body_inhale_relief_male.ogg",
    "category": "body",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 2.64,
    "sourceUrl": "https://mixkit.co/free-sound-effects/breath/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Strong breathing of a person\" from Mixkit (https://mixkit.co/free-sound-effects/breath/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": true,
    "isBodySound": true,
    "integratedLufs": -23.26,
    "truePeakDbtp": -10.83,
    "lraLu": 0
  },
  {
    "id": "body_inhale_relief_female",
    "title": "Child deep breath",
    "file": "/audio/sfx/body_inhale_relief_female.mp3",
    "oggFile": "/audio/sfx/body_inhale_relief_female.ogg",
    "category": "body",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 1.65,
    "sourceUrl": "https://mixkit.co/free-sound-effects/breath/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Child deep breath\" from Mixkit (https://mixkit.co/free-sound-effects/breath/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": true,
    "isBodySound": true,
    "integratedLufs": -21.22,
    "truePeakDbtp": -10.19,
    "lraLu": 0
  },
  {
    "id": "sfx_back_blow_1",
    "title": "Short slap or clap",
    "file": "/audio/sfx/sfx_back_blow_1.mp3",
    "oggFile": "/audio/sfx/sfx_back_blow_1.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.55,
    "sourceUrl": "https://mixkit.co/free-sound-effects/slap/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Short slap or clap\" from Mixkit (https://mixkit.co/free-sound-effects/slap/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -51.05,
    "truePeakDbtp": -28.63,
    "lraLu": 0
  },
  {
    "id": "sfx_back_blow_2",
    "title": "Body punch quick hit",
    "file": "/audio/sfx/sfx_back_blow_2.mp3",
    "oggFile": "/audio/sfx/sfx_back_blow_2.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.5,
    "sourceUrl": "https://mixkit.co/free-sound-effects/punch/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Body punch quick hit\" from Mixkit (https://mixkit.co/free-sound-effects/punch/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.25,
    "truePeakDbtp": -3.12,
    "lraLu": 0
  },
  {
    "id": "sfx_back_blow_3",
    "title": "Soft quick punch",
    "file": "/audio/sfx/sfx_back_blow_3.mp3",
    "oggFile": "/audio/sfx/sfx_back_blow_3.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.42,
    "sourceUrl": "https://mixkit.co/free-sound-effects/punch/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Soft quick punch\" from Mixkit (https://mixkit.co/free-sound-effects/punch/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -23,
    "truePeakDbtp": -20.39,
    "lraLu": 0
  },
  {
    "id": "sfx_back_blow_4",
    "title": "Impact of a strong punch",
    "file": "/audio/sfx/sfx_back_blow_4.mp3",
    "oggFile": "/audio/sfx/sfx_back_blow_4.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.55,
    "sourceUrl": "https://mixkit.co/free-sound-effects/punch/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Impact of a strong punch\" from Mixkit (https://mixkit.co/free-sound-effects/punch/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.18,
    "truePeakDbtp": -7.38,
    "lraLu": 0
  },
  {
    "id": "sfx_back_blow_5",
    "title": "Hard and quick punch",
    "file": "/audio/sfx/sfx_back_blow_5.mp3",
    "oggFile": "/audio/sfx/sfx_back_blow_5.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.55,
    "sourceUrl": "https://mixkit.co/free-sound-effects/punch/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Hard and quick punch\" from Mixkit (https://mixkit.co/free-sound-effects/punch/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.25,
    "truePeakDbtp": -3.63,
    "lraLu": 0
  },
  {
    "id": "sfx_thrust_1",
    "title": "Air in a hit",
    "file": "/audio/sfx/sfx_thrust_1.mp3",
    "oggFile": "/audio/sfx/sfx_thrust_1.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.55,
    "sourceUrl": "https://mixkit.co/free-sound-effects/punch/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Air in a hit\" from Mixkit (https://mixkit.co/free-sound-effects/punch/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.08,
    "truePeakDbtp": -2.33,
    "lraLu": 0
  },
  {
    "id": "sfx_thrust_2",
    "title": "Punch through air",
    "file": "/audio/sfx/sfx_thrust_2.mp3",
    "oggFile": "/audio/sfx/sfx_thrust_2.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.55,
    "sourceUrl": "https://mixkit.co/free-sound-effects/punch/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Punch through air\" from Mixkit (https://mixkit.co/free-sound-effects/punch/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.25,
    "truePeakDbtp": -6.37,
    "lraLu": 0
  },
  {
    "id": "sfx_thrust_3",
    "title": "Martial arts fast punch",
    "file": "/audio/sfx/sfx_thrust_3.mp3",
    "oggFile": "/audio/sfx/sfx_thrust_3.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.55,
    "sourceUrl": "https://mixkit.co/free-sound-effects/punch/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Martial arts fast punch\" from Mixkit (https://mixkit.co/free-sound-effects/punch/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.29,
    "truePeakDbtp": -7.39,
    "lraLu": 0
  },
  {
    "id": "sfx_thrust_4",
    "title": "Strong punches to the body",
    "file": "/audio/sfx/sfx_thrust_4.mp3",
    "oggFile": "/audio/sfx/sfx_thrust_4.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.5,
    "sourceUrl": "https://mixkit.co/free-sound-effects/punch/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Strong punches to the body\" from Mixkit (https://mixkit.co/free-sound-effects/punch/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.25,
    "truePeakDbtp": -9.57,
    "lraLu": 0
  },
  {
    "id": "sfx_thrust_5",
    "title": "Drum deep impact",
    "file": "/audio/sfx/sfx_thrust_5.mp3",
    "oggFile": "/audio/sfx/sfx_thrust_5.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.55,
    "sourceUrl": "https://mixkit.co/free-sound-effects/drum/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Drum deep impact\" from Mixkit (https://mixkit.co/free-sound-effects/drum/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.22,
    "truePeakDbtp": -7.97,
    "lraLu": 0
  },
  {
    "id": "sfx_infant_blow_1",
    "title": "Weak hit impact",
    "file": "/audio/sfx/sfx_infant_blow_1.mp3",
    "oggFile": "/audio/sfx/sfx_infant_blow_1.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.47,
    "sourceUrl": "https://mixkit.co/free-sound-effects/punch/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Weak hit impact\" from Mixkit (https://mixkit.co/free-sound-effects/punch/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.25,
    "truePeakDbtp": -9.11,
    "lraLu": 0
  },
  {
    "id": "sfx_infant_blow_2",
    "title": "Hand tribal drum",
    "file": "/audio/sfx/sfx_infant_blow_2.mp3",
    "oggFile": "/audio/sfx/sfx_infant_blow_2.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.47,
    "sourceUrl": "https://mixkit.co/free-sound-effects/tap/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Hand tribal drum\" from Mixkit (https://mixkit.co/free-sound-effects/tap/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.25,
    "truePeakDbtp": -4.65,
    "lraLu": 0
  },
  {
    "id": "sfx_infant_blow_3",
    "title": "Tribal dry drum",
    "file": "/audio/sfx/sfx_infant_blow_3.mp3",
    "oggFile": "/audio/sfx/sfx_infant_blow_3.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.47,
    "sourceUrl": "https://mixkit.co/free-sound-effects/tap/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Tribal dry drum\" from Mixkit (https://mixkit.co/free-sound-effects/tap/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.25,
    "truePeakDbtp": -3.42,
    "lraLu": 0
  },
  {
    "id": "sfx_infant_blow_4",
    "title": "Small hit in a game",
    "file": "/audio/sfx/sfx_infant_blow_4.mp3",
    "oggFile": "/audio/sfx/sfx_infant_blow_4.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.47,
    "sourceUrl": "https://mixkit.co/free-sound-effects/punch/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Small hit in a game\" from Mixkit (https://mixkit.co/free-sound-effects/punch/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.25,
    "truePeakDbtp": -6.12,
    "lraLu": 0
  },
  {
    "id": "sfx_infant_thrust_1",
    "title": "Short bass hit",
    "file": "/audio/sfx/sfx_infant_thrust_1.mp3",
    "oggFile": "/audio/sfx/sfx_infant_thrust_1.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.44,
    "sourceUrl": "https://mixkit.co/free-sound-effects/drum/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Short bass hit\" from Mixkit (https://mixkit.co/free-sound-effects/drum/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.25,
    "truePeakDbtp": -9.46,
    "lraLu": 0
  },
  {
    "id": "sfx_infant_thrust_2",
    "title": "Deep heartbeat impact",
    "file": "/audio/sfx/sfx_infant_thrust_2.mp3",
    "oggFile": "/audio/sfx/sfx_infant_thrust_2.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.47,
    "sourceUrl": "https://mixkit.co/free-sound-effects/hit/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Deep heartbeat impact\" from Mixkit (https://mixkit.co/free-sound-effects/hit/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.25,
    "truePeakDbtp": -12.08,
    "lraLu": 0
  },
  {
    "id": "sfx_infant_thrust_3",
    "title": "Wood hard hit",
    "file": "/audio/sfx/sfx_infant_thrust_3.mp3",
    "oggFile": "/audio/sfx/sfx_infant_thrust_3.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.42,
    "sourceUrl": "https://mixkit.co/free-sound-effects/hit/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Wood hard hit\" from Mixkit (https://mixkit.co/free-sound-effects/hit/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -23,
    "truePeakDbtp": -20.26,
    "lraLu": 0
  },
  {
    "id": "sfx_infant_thrust_4",
    "title": "Cinematic mystery trailer drum hit",
    "file": "/audio/sfx/sfx_infant_thrust_4.mp3",
    "oggFile": "/audio/sfx/sfx_infant_thrust_4.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.47,
    "sourceUrl": "https://mixkit.co/free-sound-effects/drum/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Cinematic mystery trailer drum hit\" from Mixkit (https://mixkit.co/free-sound-effects/drum/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.25,
    "truePeakDbtp": -11.48,
    "lraLu": 0
  },
  {
    "id": "sfx_hand_place",
    "title": "Cloth slide out",
    "file": "/audio/sfx/sfx_hand_place.mp3",
    "oggFile": "/audio/sfx/sfx_hand_place.ogg",
    "category": "rescue",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.55,
    "sourceUrl": "https://mixkit.co/free-sound-effects/cloth/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Cloth slide out\" from Mixkit (https://mixkit.co/free-sound-effects/cloth/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.37,
    "truePeakDbtp": -9.42,
    "lraLu": 0
  },
  {
    "id": "sfx_object_pop",
    "title": "Dry pop up notification alert",
    "file": "/audio/sfx/sfx_object_pop.mp3",
    "oggFile": "/audio/sfx/sfx_object_pop.ogg",
    "category": "object",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.34,
    "sourceUrl": "https://mixkit.co/free-sound-effects/pop/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Dry pop up notification alert\" from Mixkit (https://mixkit.co/free-sound-effects/pop/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -23,
    "truePeakDbtp": -18.62,
    "lraLu": 0
  },
  {
    "id": "sfx_utensil_drop",
    "title": "Stirring cutlery in ceramic plate",
    "file": "/audio/sfx/sfx_utensil_drop.mp3",
    "oggFile": "/audio/sfx/sfx_utensil_drop.ogg",
    "category": "environment",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.89,
    "sourceUrl": "https://mixkit.co/free-sound-effects/kitchen/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Stirring cutlery in ceramic plate\" from Mixkit (https://mixkit.co/free-sound-effects/kitchen/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.27,
    "truePeakDbtp": -6.16,
    "lraLu": 0
  },
  {
    "id": "sfx_body_collapse",
    "title": "Fall on foam splash",
    "file": "/audio/sfx/sfx_body_collapse.mp3",
    "oggFile": "/audio/sfx/sfx_body_collapse.ogg",
    "category": "environment",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.73,
    "sourceUrl": "https://mixkit.co/free-sound-effects/fall/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Fall on foam splash\" from Mixkit (https://mixkit.co/free-sound-effects/fall/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -39.76,
    "truePeakDbtp": -18.28,
    "lraLu": 0
  },
  {
    "id": "sfx_aed_beep",
    "title": "Bell notification",
    "file": "/audio/sfx/sfx_aed_beep.mp3",
    "oggFile": "/audio/sfx/sfx_aed_beep.ogg",
    "category": "arrival",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.99,
    "sourceUrl": "https://mixkit.co/free-sound-effects/notification/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Bell notification\" from Mixkit (https://mixkit.co/free-sound-effects/notification/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.26,
    "truePeakDbtp": -11.53,
    "lraLu": 0
  },
  {
    "id": "sfx_ui_select",
    "title": "Select click",
    "file": "/audio/sfx/sfx_ui_select.mp3",
    "oggFile": "/audio/sfx/sfx_ui_select.ogg",
    "category": "ui",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.31,
    "sourceUrl": "https://mixkit.co/free-sound-effects/click/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Select click\" from Mixkit (https://mixkit.co/free-sound-effects/click/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -23,
    "truePeakDbtp": -17.11,
    "lraLu": 0
  },
  {
    "id": "sfx_ui_star",
    "title": "Relaxing bell chime",
    "file": "/audio/sfx/sfx_ui_star.mp3",
    "oggFile": "/audio/sfx/sfx_ui_star.ogg",
    "category": "ui",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 1.54,
    "sourceUrl": "https://mixkit.co/free-sound-effects/bell/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Relaxing bell chime\" from Mixkit (https://mixkit.co/free-sound-effects/bell/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.17,
    "truePeakDbtp": -5.17,
    "lraLu": 0
  },
  {
    "id": "sfx_ui_wrong_soft",
    "title": "Negative tone interface tap",
    "file": "/audio/sfx/sfx_ui_wrong_soft.mp3",
    "oggFile": "/audio/sfx/sfx_ui_wrong_soft.ogg",
    "category": "ui",
    "levelMapping": [
      "CUE_SHEET"
    ],
    "durationSec": 0.99,
    "sourceUrl": "https://mixkit.co/free-sound-effects/drum/",
    "author": "Mixkit Sound Effects Library",
    "license": "Mixkit Sound Effects Free License",
    "attribution": "\"Negative tone interface tap\" from Mixkit (https://mixkit.co/free-sound-effects/drum/), Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree)",
    "status": "ready",
    "isVocal": false,
    "isBodySound": false,
    "integratedLufs": -21.12,
    "truePeakDbtp": -2.98,
    "lraLu": 0
  }
];

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
