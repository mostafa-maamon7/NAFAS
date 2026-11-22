export type Language = 'en' | 'ar';

export type NavSection =
  | 'home'
  | 'about'
  | 'learning'
  | 'simulation'
  | 'ai-assistant';

export type AgeCategory = 'adult' | 'child' | 'infant';

export type LearningCategoryId =
  | 'understanding-choking'
  | 'recognizing-obstruction'
  | 'adult-education'
  | 'child-education'
  | 'infant-education'
  | 'prevention-safety'
  | 'common-mistakes'
  | 'emergency-awareness';

export type IllustrationType =
  | 'airway-anatomy'
  | 'mild-vs-severe'
  | 'adult-abdominal-thrusts'
  | 'child-choking-care'
  | 'infant-back-blows-chest-thrusts'
  | 'common-mistakes-avoid'
  | 'unresponsive-cpr-transition'
  | 'prevention-safety-guide';

export type StoryMediaKey =
  | 'hero_nafas_awareness'
  | 'adult_dinner_story'
  | 'adult_choking_crisis'
  | 'adult_abdominal_thrusts'
  | 'adult_cpr_recovery'
  | 'adult_pregnant_sternal'
  | 'child_cafeteria_story'
  | 'child_choking_crisis'
  | 'child_choking_rescue'
  | 'child_recess_cough'
  | 'child_hallway_cpr'
  | 'l4_frame_a_calm_lunch'
  | 'l4_frame_b_laughing_grape'
  | 'l4_frame_c_choking_onset'
  | 'l4_frame_d_cyanosis_crisis'
  | 'l4_frame_e_kneeling_back_blows'
  | 'l4_frame_f_abdominal_thrusts_expel'
  | 'l4_frame_g_error_upside_down'
  | 'l4_frame_h_error_water_cup'
  | 'infant_nursery_story'
  | 'infant_back_blows'
  | 'infant_chest_thrusts'
  | 'infant_highchair_cough'
  | 'infant_unresponsive_cpr'
  | string;

export type AirwayVisualMode =
  | 'normal_open'
  | 'partial_cough'
  | 'severe_blocked'
  | 'thrust_expel'
  | 'back_blow_clear'
  | 'chest_thrust_clear'
  | 'cpr_compressions'
  | 'water_aspiration'
  | 'blind_sweep_worse'
  | 'xiphoid_hazard'
  | 'infant_liver_hazard'
  | 'delayed_hypoxia'
  | 'resolved_breathing';

export type SceneLocationId =
  | 'family_dining'
  | 'home_workplace_lounge'
  | 'school_cafeteria'
  | 'home_nursery'
  | 'home_dining'
  | string;

export type VictimCharacterId =
  | 'youssef_adult'
  | 'salma_pregnant'
  | 'mostafa_child'
  | 'nelly_infant';

export type RescuerCharacterId =
  | 'rescuer_family'
  | 'rescuer_colleague'
  | 'rescuer_teacher'
  | 'rescuer_parent'
  | 'omar_brother'
  | string;

export type ObstructionObjectType =
  | 'meat'
  | 'grape'
  | 'soft_food'
  | 'food_piece'
  | string;

export type RigPoseId =
  | 'normal_chat'
  | 'risk_setup'
  | 'effective_cough'
  | 'severe_silent_choking'
  | 'back_blows_5'
  | 'abdominal_thrusts_5'
  | 'chest_thrusts_special'
  | 'object_expelled_recovery'
  | 'mistake_water_given'
  | 'mistake_blind_sweep'
  | 'mistake_shake_upside_down'
  | 'mistake_infant_abdomen'
  | 'mistake_wait_delay'
  | 'unresponsive_collapse'
  | 'cpr_compressions_30_2';

export type CameraCue =
  | 'slow-zoom-in'
  | 'gentle-pan'
  | 'urgent-pulse'
  | 'thrust-motion'
  | 'cpr-rhythm'
  | 'error-shake'
  | 'calm-settle';

/** 4-Stage Plain-Language Gameplay Loop (Watch -> Look -> Decide -> See Result) */
export type LevelPlayPhase =
  | 'story_intro'
  | 'assess_signs'
  | 'decision_crisis'
  | 'live_acting_out'
  | 'final_debrief';

export type MicroInteractionType =
  | 'none'
  | 'back_and_abdominal_5_5'
  | 'chest_thrusts_5'
  | 'infant_5_5'
  | 'cpr_compressions';

/** Strictly aligned with Dr. Mai Mahran's Lecture Slide 34 (AHA removed until doctor confirms) */
export type GuidelineFamily = 'RCUK' | 'ARC';

export interface BilingualText {
  en: string;
  ar: string;
}

export interface ArticleSection {
  heading: BilingualText;
  body: BilingualText;
  bulletPoints?: BilingualText[];
  calloutTitle?: BilingualText;
  calloutText?: BilingualText;
  calloutVariant?: 'info' | 'warning' | 'danger' | 'success';
}

export interface MedicalReference {
  organization: BilingualText;
  documentTitle: BilingualText;
  year: string;
}

export interface LearningArticle {
  id: string;
  categoryId: LearningCategoryId;
  ageRelevance: AgeCategory | 'all';
  readingTimeMinutes: number;
  featured?: boolean;
  illustration: IllustrationType;
  title: BilingualText;
  summary: BilingualText;
  keyTakeaways: BilingualText[];
  sections: ArticleSection[];
  references: MedicalReference[];
  relatedArticleIds: string[];
  relatedScenarioAge?: AgeCategory;
}

export type DecisionQuality = 'correct' | 'suboptimal' | 'critical_error';

export interface AssessSignHotspot {
  id: string;
  /** Percentage coordinates (0-100) on the 16:9 stage canvas */
  xPct: number;
  yPct: number;
  cueCategory?: 'cough_sound' | 'hands_posture' | 'skin_color' | 'airway_spo2';
  label: BilingualText;
  finding: BilingualText;
  severity?: 'normal' | 'warning' | 'critical';
  isCriticalSign?: boolean;
}

export interface StoryBeatItem {
  id: string;
  phase: 'intro' | 'escalation' | 'symptoms' | 'decision_prompt' | 'relief';
  durationSec: number;
  mediaKey: StoryMediaKey;
  rigPose?: RigPoseId | string;
  caption?: BilingualText;
  speaker: BilingualText;
  text: BilingualText;
  clinicalCue: BilingualText;
  spO2?: number;
  heartRate?: number;
}

export interface ConsequencePlaybackFrame {
  id: string;
  stageLabel: BilingualText;
  mediaKey: StoryMediaKey;
  caption: BilingualText;
  spO2?: number;
  heartRate?: number;
}

export interface StructuredResultExplanation {
  verdict: BilingualText;
  whatHappened: BilingualText;
  why: BilingualText;
  nextTime: BilingualText[];
  remember: BilingualText;
  afterCare?: BilingualText;
}

export interface ConsequenceBeat {
  mediaKey: StoryMediaKey;
  playbackFrames?: ConsequencePlaybackFrame[];
  title: BilingualText;
  narrative: BilingualText;
  clinicalWhy: BilingualText;
  internalEffect: BilingualText;
  explanation?: StructuredResultExplanation;
  guidelineBadge: GuidelineFamily;
  nextAction: 'complete' | 'retry';
}

export interface StoryLevelChoice {
  id: string;
  label: BilingualText;
  subLabel?: BilingualText;
  outcome: 'optimal' | 'suboptimal' | 'harmful';
  spO2Delta: number;
  obstructionDelta: number;
  consequenceBeat: ConsequenceBeat;
}

export interface SceneHotspotItem {
  id: string;
  x: number;
  y: number;
  type: 'symptom' | 'airway' | 'anatomy' | 'environment';
  label: BilingualText;
  detail: BilingualText;
}

export interface StoryLevel {
  id: string;
  levelNumber: number;
  ageGroup: AgeCategory;
  severity: 'mild' | 'severe' | 'unresponsive';
  patientState: 'conscious' | 'unconscious';
  isReferenceImplementation?: boolean;
  isSpecialMission?: boolean;
  clinicalReview?: boolean;
  clinicalReviewReason?: string | BilingualText;
  lectureSlideRefs?: string[] | string;
  ruleTags?: string[];
  title: BilingualText;
  subtitle: BilingualText;
  setting: BilingualText;
  character: {
    name: BilingualText;
    age: BilingualText;
    role: BilingualText;
  };
  hook: BilingualText;
  objective: BilingualText;
  EstimatedMinutes: number;
  PlainLanguageMap: {
    spO2: BilingualText;
    airway: BilingualText;
    cyanosis?: BilingualText;
    epiglottis?: BilingualText;
  };
  afterCareNote?: BilingualText;
  sceneVisual: {
    environment: string;
    accentColor: string;
    mood: 'calm' | 'focused' | 'urgent' | 'critical';
    obstructionLevel: number;
    spO2Start: number;
    spO2Critical: number;
    heartRateStart: number;
    respiratoryRate: number;
    hasCyanosis: boolean;
    hasStridor: boolean;
    canSpeak: boolean;
    canCough: boolean;
    caption: BilingualText;
    hotspots: SceneHotspotItem[];
  };
  storyBeats: StoryBeatItem[];
  decisionNode: {
    id: string;
    prompt: BilingualText;
    contextNote: BilingualText;
    timeLimitSec: number;
    choices: StoryLevelChoice[];
  };
  takeaways: BilingualText[];
}

export interface EmergencyContact {
  country: BilingualText;
  number: string;
  notes: BilingualText;
}

export interface LearningModule {
  id: string;
  category: 'recognition' | 'adult' | 'child' | 'infant' | 'special';
  title: BilingualText;
  summary: BilingualText;
  readTimeMin: number;
  guidelineSource: BilingualText;
  keyPoints: BilingualText[];
}


export interface VerifiedQaItem {
  id: string;
  category: AgeCategory | 'general';
  question: BilingualText;
  shortAnswer: BilingualText;
  detailedExplanation: BilingualText;
  criticalRule: BilingualText;
  sourceArticleId: string;
  guidelineCitation: BilingualText;
}
