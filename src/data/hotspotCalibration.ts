import { BilingualText, SceneHotspotItem } from '../types/nafas';
import { getManifestEntry, PanelSubRect } from './imageManifest';

export type AnatomicalRegion =
  | 'throat'
  | 'lips'
  | 'hands'
  | 'chest'
  | 'back'
  | 'abdomen'
  | 'mouth'
  | 'eyes'
  | 'face'
  | 'body';

export type HotspotShape = 'circle' | 'ellipse' | 'rounded_rect';

export type GhostHandType =
  | 'heel_of_hand'
  | 'fist_grasp'
  | 'chest_landmark'
  | 'infant_two_fingers';

export type ThrustArrowDirection = 'down_forward' | 'in_up' | 'chest_in';

export interface ExpectedBoundingBox {
  xMin: number; // Normalized 0..1 of image width
  yMin: number; // Normalized 0..1 of image height
  xMax: number; // Normalized 0..1 of image width
  yMax: number; // Normalized 0..1 of image height
}

export interface CalibratedHotspot {
  id: string;
  imageId: string;
  /** Image-normalized X coordinate (0..1 of natural width) */
  x: number;
  /** Image-normalized Y coordinate (0..1 of natural height) */
  y: number;
  /** Image-normalized radius (0..1 of natural width) for circle fallback & hit target */
  r: number;
  /** Shape of the ring: circle, ellipse, or rounded_rect */
  shape?: HotspotShape;
  /** Image-normalized horizontal half-size (0..1 of natural width) */
  rx?: number;
  /** Image-normalized vertical half-size (0..1 of natural height) */
  ry?: number;
  /** Optional rotation in degrees around (cx, cy) */
  rotation?: number;
  region: AnatomicalRegion;
  panel?: 'left' | 'right' | 'full';
  kind: 'look_ring' | 'hand_target';
  /** Reassuring sign for mild-cough levels (A1, C3, I3) */
  isReassuring?: boolean;
  /** Ghost target outline & direction arrow for severe hand-placement steps */
  ghostType?: GhostHandType;
  arrowDirection?: ThrustArrowDirection;
  directionHint?: BilingualText;
  /** What you see (1 short plain line) */
  label: BilingualText;
  /** What it means (1 short plain line, no medical jargon) */
  meaning: BilingualText;
  expectedBox: ExpectedBoundingBox;
  /** Optional starting point (0..1) for draggable hand marker */
  initialDragPos?: { x: number; y: number };
  /** Tolerance radius (0..1 of natural width) for magnetic snap-to-target drop */
  toleranceR?: number;
}

export interface HotspotValidationResult {
  hotspotId: string;
  imageId: string;
  region: AnatomicalRegion;
  panel: 'left' | 'right' | 'full';
  shape: HotspotShape;
  x: number;
  y: number;
  r: number;
  expectedBox: ExpectedBoundingBox;
  insideImageBounds: boolean;
  insideExpectedBox: boolean;
  insidePanelBounds: boolean;
  passed: boolean;
}

/** Convert a 0..1 or legacy 0..100 value into 0..1 image-normalized units */
export function toNormalizedUnit(val: number): number {
  if (val > 1) {
    return Number((val / 100).toFixed(4));
  }
  return Number(val.toFixed(4));
}

/** Convert image-normalized (0..1) coordinates to SVG viewBox units (W x H) */
export function normToViewBox(
  xNorm: number,
  yNorm: number,
  rNorm: number = 0.032,
  naturalWidth: number = 640,
  naturalHeight: number = 357,
  rxNorm?: number,
  ryNorm?: number
): { cx: number; cy: number; r: number; rx: number; ry: number } {
  const nx = toNormalizedUnit(xNorm);
  const ny = toNormalizedUnit(yNorm);
  const nr = toNormalizedUnit(rNorm);
  const nrx = rxNorm ? toNormalizedUnit(rxNorm) : nr;
  const nry = ryNorm ? toNormalizedUnit(ryNorm) : nr * (naturalWidth / naturalHeight) * 0.62;
  return {
    cx: Number((nx * naturalWidth).toFixed(2)),
    cy: Number((ny * naturalHeight).toFixed(2)),
    r: Number((nr * naturalWidth).toFixed(2)),
    rx: Number((nrx * naturalWidth).toFixed(2)),
    ry: Number((nry * naturalHeight).toFixed(2)),
  };
}

/** Convert SVG viewBox coordinates (0..W, 0..H) back to image-normalized (0..1) */
export function viewBoxToNorm(
  vx: number,
  vy: number,
  naturalWidth: number = 640,
  naturalHeight: number = 357
): { x: number; y: number } {
  return {
    x: Number(Math.max(0, Math.min(1, vx / naturalWidth)).toFixed(3)),
    y: Number(Math.max(0, Math.min(1, vy / naturalHeight)).toFixed(3)),
  };
}

/** Clamp normalized coordinates inside image or panel bounds */
export function clampNormalizedCoords(
  x: number,
  y: number,
  bounds: PanelSubRect = { xMin: 0.03, yMin: 0.05, xMax: 0.97, yMax: 0.95 }
): { x: number; y: number } {
  return {
    x: Number(Math.max(bounds.xMin, Math.min(bounds.xMax, x)).toFixed(3)),
    y: Number(Math.max(bounds.yMin, Math.min(bounds.yMax, y)).toFixed(3)),
  };
}

/** Validate that a hotspot/target center lies inside its expectedBox, panel bounds, and image bounds */
export function validateCalibratedHotspot(
  hs: CalibratedHotspot
): HotspotValidationResult {
  const x = toNormalizedUnit(hs.x);
  const y = toNormalizedUnit(hs.y);
  const r = toNormalizedUnit(hs.r);
  const box = hs.expectedBox;

  const insideImageBounds = x >= 0 && x <= 1 && y >= 0 && y <= 1;
  const insideExpectedBox =
    x >= box.xMin && x <= box.xMax && y >= box.yMin && y <= box.yMax;

  const manifestEntry = getManifestEntry(hs.imageId);
  let insidePanelBounds = true;
  const panel = hs.panel ?? 'full';
  if (manifestEntry.panels && panel === 'left') {
    const p = manifestEntry.panels.left;
    insidePanelBounds = x >= p.xMin && x <= p.xMax && y >= p.yMin && y <= p.yMax;
  } else if (manifestEntry.panels && panel === 'right') {
    const p = manifestEntry.panels.right;
    insidePanelBounds = x >= p.xMin && x <= p.xMax && y >= p.yMin && y <= p.yMax;
  }

  return {
    hotspotId: hs.id,
    imageId: hs.imageId,
    region: hs.region,
    panel,
    shape: hs.shape ?? 'circle',
    x,
    y,
    r,
    expectedBox: box,
    insideImageBounds,
    insideExpectedBox,
    insidePanelBounds,
    passed: insideImageBounds && insideExpectedBox && insidePanelBounds,
  };
}

/**
 * Visually calibrated hotspots & composite-panel hand targets per imageId across ALL 10 levels.
 * Every coordinate has been verified directly on the 640x357 native images from NAFAS-Levels-Full-Visual-Guide_0ff4a7.pdf.
 */
export const CALIBRATED_IMAGE_HOTSPOTS: Record<string, CalibratedHotspot[]> = {
  // ===========================================================================
  // A1_S5 — Adult Mild Choking (Tariq in University Cafeteria) — Reassuring Signs
  // ===========================================================================
  A1_S5: [
    {
      id: 'a1-hs-face',
      imageId: 'A1_S5',
      x: 0.415,
      y: 0.355,
      r: 0.034,
      shape: 'ellipse',
      rx: 0.044,
      ry: 0.048,
      region: 'face',
      panel: 'full',
      kind: 'look_ring',
      isReassuring: true,
      label: {
        en: 'Normal color',
        ar: 'لون الوجه طبيعي',
      },
      meaning: {
        en: 'His face and lips look normal with no blue tint — oxygen is reaching him.',
        ar: 'لون وشه وشفايفه طبيعي ومفيش أي زرقة — الأكسجين واصل كويس.',
      },
      expectedBox: { xMin: 0.36, yMin: 0.29, xMax: 0.47, yMax: 0.42 },
    },
    {
      id: 'a1-hs-cough',
      imageId: 'A1_S5',
      x: 0.412,
      y: 0.460,
      r: 0.028,
      shape: 'ellipse',
      rx: 0.028,
      ry: 0.036,
      region: 'mouth',
      panel: 'full',
      kind: 'look_ring',
      isReassuring: true,
      label: {
        en: 'Strong cough, can talk',
        ar: 'سعال قوي وبيتكلم',
      },
      meaning: {
        en: 'He coughs loudly and says "I am okay" — his cough is clearing the food.',
        ar: 'بيكح بصوت عالي وبيقول «أنا كويس» — كحته قوية وقادرة تطرد اللقمة.',
      },
      expectedBox: { xMin: 0.37, yMin: 0.41, xMax: 0.45, yMax: 0.51 },
    },
    {
      id: 'a1-hs-posture',
      imageId: 'A1_S5',
      x: 0.375,
      y: 0.625,
      r: 0.038,
      shape: 'rounded_rect',
      rx: 0.048,
      ry: 0.060,
      region: 'chest',
      panel: 'full',
      kind: 'look_ring',
      isReassuring: true,
      label: {
        en: 'Breathing between coughs',
        ar: 'بيتنفس بين الكحة',
      },
      meaning: {
        en: 'Air moves in and out of his chest — do not hit him, just stay close.',
        ar: 'الهواء داخل وخارج في صدره — بلاش تضربه، خليك جنبه وشجعه.',
      },
      expectedBox: { xMin: 0.31, yMin: 0.55, xMax: 0.44, yMax: 0.70 },
    },
  ],

  // ===========================================================================
  // A2_S5 — Adult Severe Choking (Tariq in Computer Lab — Reference Level)
  // ===========================================================================
  A2_S5: [
    {
      id: 'a2-hs-panic',
      imageId: 'A2_S5',
      x: 0.485,
      y: 0.310,
      r: 0.032,
      shape: 'ellipse',
      rx: 0.052,
      ry: 0.036,
      region: 'eyes',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'Scared, sweating',
        ar: 'ذعر وعرق واضح',
      },
      meaning: {
        en: 'Wide frightened eyes show he is awake and silently begging for help.',
        ar: 'عينيه مفتوحة برعب وده معناه إنه فايق وبيستغيث من غير صوت.',
      },
      expectedBox: { xMin: 0.43, yMin: 0.26, xMax: 0.55, yMax: 0.36 },
    },
    {
      id: 'a2-hs-lips',
      imageId: 'A2_S5',
      x: 0.483,
      y: 0.446,
      r: 0.026,
      shape: 'ellipse',
      rx: 0.032,
      ry: 0.026,
      region: 'lips',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'Blue lips',
        ar: 'شفاه شاحبة وزرقاء',
      },
      meaning: {
        en: 'His lips are turning pale and blue because oxygen is dropping fast.',
        ar: 'شفايفه بتشحب وتزرق لأن الأكسجين بينزل في جسمه بسرعة.',
      },
      expectedBox: { xMin: 0.45, yMin: 0.41, xMax: 0.52, yMax: 0.49 },
    },
    {
      id: 'a2-hs-voice',
      imageId: 'A2_S5',
      x: 0.548,
      y: 0.515,
      r: 0.028,
      shape: 'ellipse',
      rx: 0.034,
      ry: 0.034,
      rotation: -20,
      region: 'throat',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'No sound, no cough',
        ar: 'لا صوت ولا سعال',
      },
      meaning: {
        en: 'His breathing passage is completely blocked so no voice or cough comes out.',
        ar: 'مجرى النفس مسدود تماماً ومفيش أي صوت أو كحة طالعة.',
      },
      expectedBox: { xMin: 0.50, yMin: 0.47, xMax: 0.60, yMax: 0.57 },
    },
    {
      id: 'a2-hs-throat',
      imageId: 'A2_S5',
      x: 0.508,
      y: 0.625,
      r: 0.036,
      shape: 'rounded_rect',
      rx: 0.056,
      ry: 0.058,
      region: 'hands',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'Hands on throat',
        ar: 'إيدين على الرقبة',
      },
      meaning: {
        en: 'Both hands clutching the throat is the universal sign of severe choking.',
        ar: 'ماسك رقبته بإيديه الاتنين ودي العلامة الأكيدة للاختناق الشديد.',
      },
      expectedBox: { xMin: 0.45, yMin: 0.56, xMax: 0.57, yMax: 0.70 },
    },
  ],

  // ===========================================================================
  // A2_OA2 — Adult Severe Composite Two-Panel Hand Placement Targets
  // ===========================================================================
  A2_OA2: [
    {
      id: 'a2-target-back',
      imageId: 'A2_OA2',
      x: 0.335,
      y: 0.465,
      r: 0.045,
      shape: 'ellipse',
      rx: 0.042,
      ry: 0.052,
      rotation: -18,
      region: 'back',
      panel: 'left',
      kind: 'hand_target',
      ghostType: 'heel_of_hand',
      arrowDirection: 'down_forward',
      directionHint: {
        en: 'Firm hit between the shoulder blades while leaning him forward',
        ar: 'ضربة قوية بكعب اليد بين لوحَي الكتف وهو مائل للأمام',
      },
      label: {
        en: 'Between shoulder blades (Back Blows)',
        ar: 'بين لوحَي الكتف (ضربات الظهر)',
      },
      meaning: {
        en: 'Support his chest, lean him forward, and give up to 5 firm blows between the shoulder blades.',
        ar: 'اسند صدره، ميّله للأمام، واضرب بكعب إيدك بين لوحَي الكتف (حتى ٥ ضربات).',
      },
      expectedBox: { xMin: 0.27, yMin: 0.38, xMax: 0.40, yMax: 0.55 },
      initialDragPos: { x: 0.14, y: 0.24 },
      toleranceR: 0.085,
    },
    {
      id: 'a2-target-belly',
      imageId: 'A2_OA2',
      x: 0.725,
      y: 0.575,
      r: 0.045,
      shape: 'rounded_rect',
      rx: 0.046,
      ry: 0.048,
      region: 'abdomen',
      panel: 'right',
      kind: 'hand_target',
      ghostType: 'fist_grasp',
      arrowDirection: 'in_up',
      directionHint: {
        en: 'Pull sharply inward and upward above the navel',
        ar: 'اضغط للداخل وللأعلى فوق السرة وتحت القفص الصدري',
      },
      label: {
        en: 'Above navel, below breastbone (Belly Thrusts)',
        ar: 'فوق السرة وتحت عظمة القص (ضغطات البطن)',
      },
      meaning: {
        en: 'Place your fist above the navel and pull inward and upward (up to 5 thrusts).',
        ar: 'حط قبضة إيدك فوق السرة واضغط للداخل وللأعلى (حتى ٥ ضغطات).',
      },
      expectedBox: { xMin: 0.66, yMin: 0.49, xMax: 0.79, yMax: 0.66 },
      initialDragPos: { x: 0.88, y: 0.28 },
      toleranceR: 0.085,
    },
  ],

  // ===========================================================================
  // A3_S5 — Adult Unresponsive (Tariq slumped on chair in computer lab)
  // ===========================================================================
  A3_S5: [
    {
      id: 'a3-hs-response',
      imageId: 'A3_S5',
      x: 0.685,
      y: 0.315,
      r: 0.034,
      shape: 'ellipse',
      rx: 0.040,
      ry: 0.036,
      rotation: 18,
      region: 'eyes',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'Eyes closed, no response',
        ar: 'لا يستجيب وعيناه مغمضتان',
      },
      meaning: {
        en: 'Tariq does not wake up or respond to voice or touch.',
        ar: 'طارق فقد الوعي ومش بيرد على النداء ولا اللمس.',
      },
      expectedBox: { xMin: 0.63, yMin: 0.26, xMax: 0.74, yMax: 0.36 },
    },
    {
      id: 'a3-hs-mouth',
      imageId: 'A3_S5',
      x: 0.655,
      y: 0.368,
      r: 0.026,
      shape: 'ellipse',
      rx: 0.028,
      ry: 0.024,
      rotation: 18,
      region: 'mouth',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'No normal breathing',
        ar: 'لا يتنفس طبيعياً',
      },
      meaning: {
        en: 'No air is passing — only remove an object if you can clearly see it.',
        ar: 'مفيش نفس طبيعي — اوعى تمد صوابعك غير لو شايف الجسم بوضوح.',
      },
      expectedBox: { xMin: 0.61, yMin: 0.33, xMax: 0.70, yMax: 0.40 },
    },
    {
      id: 'a3-hs-breathing',
      imageId: 'A3_S5',
      x: 0.640,
      y: 0.620,
      r: 0.042,
      shape: 'rounded_rect',
      rx: 0.056,
      ry: 0.065,
      region: 'chest',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'Limp body, chest still',
        ar: 'جسم مرتخٍ وصدر ساكن',
      },
      meaning: {
        en: 'He cannot stay on a chair — lower him onto a firm flat floor for CPR.',
        ar: 'ماينفعش يفضل على الكرسي — نزّله على أرض صلبة وابدأ الإنعاش.',
      },
      expectedBox: { xMin: 0.57, yMin: 0.54, xMax: 0.71, yMax: 0.71 },
    },
  ],

  // ===========================================================================
  // A4_S5 — Adult Late Pregnancy Severe Choking (Pregnant colleague in lab)
  // ===========================================================================
  A4_S5: [
    {
      id: 'a4-hs-eyes',
      imageId: 'A4_S5',
      x: 0.495,
      y: 0.270,
      r: 0.030,
      shape: 'ellipse',
      rx: 0.040,
      ry: 0.032,
      region: 'eyes',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'Scared, no sound',
        ar: 'ذعر وصمت تام',
      },
      meaning: {
        en: 'She is wide-eyed and cannot speak or cough — her airway is blocked.',
        ar: 'عينيها متسعة ومش قادرة تتكلم أو تكح لأن مجرى النفس مسدود.',
      },
      expectedBox: { xMin: 0.45, yMin: 0.23, xMax: 0.55, yMax: 0.31 },
    },
    {
      id: 'a4-hs-neck',
      imageId: 'A4_S5',
      x: 0.505,
      y: 0.425,
      r: 0.034,
      shape: 'rounded_rect',
      rx: 0.044,
      ry: 0.048,
      region: 'hands',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'Hands on throat',
        ar: 'إيدين على الرقبة',
      },
      meaning: {
        en: 'Both hands on her neck show severe choking that needs immediate help.',
        ar: 'ماسكة رقبتها بإيديها الاتنين وده معناه اختناق شديد محتاج إنقاذ فوري.',
      },
      expectedBox: { xMin: 0.45, yMin: 0.37, xMax: 0.56, yMax: 0.49 },
    },
    {
      id: 'a4-hs-chest',
      imageId: 'A4_S5',
      x: 0.495,
      y: 0.545,
      r: 0.034,
      shape: 'rounded_rect',
      rx: 0.046,
      ry: 0.038,
      region: 'chest',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'Chest is the safe spot',
        ar: 'الصدر هو الموضع الآمن',
      },
      meaning: {
        en: 'In late pregnancy, we use chest thrusts instead of pressing the belly.',
        ar: 'في آخر الحمل بنستخدم ضغطات الصدر بدل ضغطات البطن.',
      },
      expectedBox: { xMin: 0.44, yMin: 0.50, xMax: 0.55, yMax: 0.59 },
    },
    {
      id: 'a4-hs-abdomen',
      imageId: 'A4_S5',
      x: 0.492,
      y: 0.725,
      r: 0.044,
      shape: 'ellipse',
      rx: 0.062,
      ry: 0.075,
      region: 'abdomen',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'Late-pregnancy belly (Do not press)',
        ar: 'بطن في آخر الحمل (ممنوع الضغط)',
      },
      meaning: {
        en: 'Never press on the belly in late pregnancy — it is unsafe for mother and baby.',
        ar: 'ممنوع تماماً الضغط على البطن في آخر شهور الحمل لحماية الأم والجنين.',
      },
      expectedBox: { xMin: 0.42, yMin: 0.63, xMax: 0.57, yMax: 0.82 },
    },
  ],

  // ===========================================================================
  // A4_OA2 — High-Level Landmark Targets for Late Pregnancy (Clinical Review)
  // ===========================================================================
  A4_OA2: [
    {
      id: 'a4-target-back',
      imageId: 'A4_OA2',
      x: 0.495,
      y: 0.395,
      r: 0.042,
      shape: 'ellipse',
      rx: 0.042,
      ry: 0.044,
      region: 'back',
      panel: 'full',
      kind: 'hand_target',
      ghostType: 'heel_of_hand',
      arrowDirection: 'down_forward',
      directionHint: {
        en: 'Back blows landmark between the shoulder blades',
        ar: 'موضع ضربات الظهر بين لوحَي الكتف',
      },
      label: {
        en: 'Upper back landmark (Back Blows)',
        ar: 'أعلى الظهر بين لوحَي الكتف (ضربات الظهر)',
      },
      meaning: {
        en: 'Support her forward and deliver up to 5 back blows.',
        ar: 'اسندها للأمام ونفّذ حتى ٥ ضربات ظهر.',
      },
      expectedBox: { xMin: 0.43, yMin: 0.33, xMax: 0.56, yMax: 0.45 },
      initialDragPos: { x: 0.24, y: 0.25 },
      toleranceR: 0.085,
    },
    {
      id: 'a4-target-chest',
      imageId: 'A4_OA2',
      x: 0.505,
      y: 0.495,
      r: 0.045,
      shape: 'rounded_rect',
      rx: 0.048,
      ry: 0.044,
      region: 'chest',
      panel: 'full',
      kind: 'hand_target',
      ghostType: 'chest_landmark',
      arrowDirection: 'chest_in',
      directionHint: {
        en: 'Use chest thrusts instead of belly thrusts to protect mother and baby',
        ar: 'استخدم ضغطات الصدر بدل ضغطات البطن لحماية الأم والجنين',
      },
      label: {
        en: 'Chest landmark (Chest Thrusts instead of belly)',
        ar: 'موضع ضغطات الصدر (بدل ضغطات البطن)',
      },
      meaning: {
        en: 'Deliver up to 5 chest thrusts instead of abdominal thrusts in late pregnancy.',
        ar: 'نفّذ حتى ٥ ضغطات صدر بدل ضغطات البطن في آخر الحمل.',
      },
      expectedBox: { xMin: 0.44, yMin: 0.44, xMax: 0.57, yMax: 0.56 },
      initialDragPos: { x: 0.76, y: 0.28 },
      toleranceR: 0.085,
    },
  ],

  // ===========================================================================
  // C1_S5 — Child Severe Choking (Youssef 6 yrs in School Cafeteria)
  // ===========================================================================
  C1_S5: [
    {
      id: 'c1-hs-eyes',
      imageId: 'C1_S5',
      x: 0.445,
      y: 0.425,
      r: 0.032,
      shape: 'ellipse',
      rx: 0.048,
      ry: 0.034,
      region: 'eyes',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'Scared, wide eyes',
        ar: 'عيون متسعة من الخوف',
      },
      meaning: {
        en: 'Youssef is terrified and cannot call out for help.',
        ar: 'يوسف خايف ومش قادر ينادي أو يطلع أي صوت.',
      },
      expectedBox: { xMin: 0.39, yMin: 0.38, xMax: 0.50, yMax: 0.47 },
    },
    {
      id: 'c1-hs-lips',
      imageId: 'C1_S5',
      x: 0.450,
      y: 0.530,
      r: 0.028,
      shape: 'ellipse',
      rx: 0.034,
      ry: 0.026,
      region: 'lips',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'Blue lips, no sound',
        ar: 'شفاه زرقاء وبلا صوت',
      },
      meaning: {
        en: 'No cough or sound comes out, and his lips are turning blue.',
        ar: 'مفيش لا صوت ولا كحة طالعة، وشفايفه بدأت تزرق.',
      },
      expectedBox: { xMin: 0.40, yMin: 0.49, xMax: 0.50, yMax: 0.57 },
    },
    {
      id: 'c1-hs-hands',
      imageId: 'C1_S5',
      x: 0.428,
      y: 0.648,
      r: 0.036,
      shape: 'rounded_rect',
      rx: 0.048,
      ry: 0.055,
      region: 'hands',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'Hands on throat',
        ar: 'إيدين على الرقبة',
      },
      meaning: {
        en: 'He is clutching his throat — kneel to his height and help him fast.',
        ar: 'ماسك رقبته بإيديه — اركع لمستوى طوله وساعده فوراً.',
      },
      expectedBox: { xMin: 0.37, yMin: 0.58, xMax: 0.49, yMax: 0.72 },
    },
  ],

  // ===========================================================================
  // C1_OA2 — Child Severe Composite Two-Panel Hand Placement Targets
  // ===========================================================================
  C1_OA2: [
    {
      id: 'c1-target-back',
      imageId: 'C1_OA2',
      x: 0.320,
      y: 0.555,
      r: 0.044,
      shape: 'ellipse',
      rx: 0.042,
      ry: 0.048,
      rotation: -15,
      region: 'back',
      panel: 'left',
      kind: 'hand_target',
      ghostType: 'heel_of_hand',
      arrowDirection: 'down_forward',
      directionHint: {
        en: 'Kneel to child height: firm hit between shoulder blades',
        ar: 'اركع بمستوى الطفل: ضربة محسوبة بين لوحَي الكتف',
      },
      label: {
        en: 'Between shoulder blades at child height (Back Blows)',
        ar: 'بين لوحَي الكتف بمستوى الطفل (ضربات الظهر)',
      },
      meaning: {
        en: 'Kneel behind Youssef, lean him forward, and give up to 5 back blows.',
        ar: 'اركع خلف يوسف، ميّله للأمام، ونفّذ حتى ٥ ضربات ظهر.',
      },
      expectedBox: { xMin: 0.26, yMin: 0.48, xMax: 0.38, yMax: 0.63 },
      initialDragPos: { x: 0.14, y: 0.28 },
      toleranceR: 0.085,
    },
    {
      id: 'c1-target-belly',
      imageId: 'C1_OA2',
      x: 0.785,
      y: 0.655,
      r: 0.044,
      shape: 'rounded_rect',
      rx: 0.045,
      ry: 0.046,
      region: 'abdomen',
      panel: 'right',
      kind: 'hand_target',
      ghostType: 'fist_grasp',
      arrowDirection: 'in_up',
      directionHint: {
        en: 'Kneel behind: pull inward and upward above the navel',
        ar: 'وأنت راكع خلفه: اضغط للداخل وللأعلى فوق السرة',
      },
      label: {
        en: 'Above navel at child height (Belly Thrusts)',
        ar: 'فوق السرة بمستوى الطفل (ضغطات البطن)',
      },
      meaning: {
        en: 'Still kneeling at his height, give up to 5 inward-and-upward belly thrusts.',
        ar: 'وأنت في مستوى طوله، نفّذ حتى ٥ ضغطات بطن للداخل وللأعلى.',
      },
      expectedBox: { xMin: 0.72, yMin: 0.58, xMax: 0.85, yMax: 0.73 },
      initialDragPos: { x: 0.88, y: 0.30 },
      toleranceR: 0.085,
    },
  ],

  // ===========================================================================
  // C2_S5 — Child Unresponsive (Youssef 6 yrs limp at cafeteria table)
  // ===========================================================================
  C2_S5: [
    {
      id: 'c2-hs-unresp',
      imageId: 'C2_S5',
      x: 0.515,
      y: 0.545,
      r: 0.032,
      shape: 'ellipse',
      rx: 0.042,
      ry: 0.034,
      rotation: 12,
      region: 'eyes',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'Eyes closed, unresponsive',
        ar: 'فاقد الوعي ولا يستجيب',
      },
      meaning: {
        en: 'Youssef went limp and does not wake up when spoken to.',
        ar: 'يوسف جسمه ارتخى ومش بيرد ولا بيفتح عينيه.',
      },
      expectedBox: { xMin: 0.46, yMin: 0.49, xMax: 0.57, yMax: 0.59 },
    },
    {
      id: 'c2-hs-breath',
      imageId: 'C2_S5',
      x: 0.510,
      y: 0.610,
      r: 0.025,
      shape: 'ellipse',
      rx: 0.028,
      ry: 0.022,
      region: 'lips',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'No normal breathing',
        ar: 'لا يتنفس طبيعياً',
      },
      meaning: {
        en: 'His airway is still blocked and he is not breathing normally.',
        ar: 'مجرى النفس لسه مسدود ومفيش أي تنفس طبيعي.',
      },
      expectedBox: { xMin: 0.47, yMin: 0.58, xMax: 0.55, yMax: 0.64 },
    },
    {
      id: 'c2-hs-surface',
      imageId: 'C2_S5',
      x: 0.445,
      y: 0.695,
      r: 0.038,
      shape: 'rounded_rect',
      rx: 0.052,
      ry: 0.055,
      region: 'chest',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'Limp body — needs flat floor',
        ar: 'جسم مرتخٍ — يحتاج أرضاً صلبة',
      },
      meaning: {
        en: 'Do not keep him on a chair — lower him onto the firm floor to start CPR.',
        ar: 'ماينفعش يفضل قاعد — نزّله على أرض صلبة ومستوية عشان تبدأ الإنعاش.',
      },
      expectedBox: { xMin: 0.38, yMin: 0.62, xMax: 0.51, yMax: 0.76 },
    },
  ],

  // ===========================================================================
  // C3_S5 — Child Mild Choking (Youssef 6 yrs in Schoolyard — Reassuring Signs)
  // ===========================================================================
  C3_S5: [
    {
      id: 'c3-hs-speak',
      imageId: 'C3_S5',
      x: 0.550,
      y: 0.355,
      r: 0.034,
      shape: 'ellipse',
      rx: 0.048,
      ry: 0.038,
      region: 'face',
      panel: 'full',
      kind: 'look_ring',
      isReassuring: true,
      label: {
        en: 'Normal color',
        ar: 'لون الوجه طبيعي',
      },
      meaning: {
        en: 'His face color is normal and healthy because air is still getting through.',
        ar: 'لون وشه طبيعي ومفيش زرقة لأن الهواء لسه بيدخل ويخرج.',
      },
      expectedBox: { xMin: 0.49, yMin: 0.30, xMax: 0.61, yMax: 0.41 },
    },
    {
      id: 'c3-hs-cough',
      imageId: 'C3_S5',
      x: 0.562,
      y: 0.455,
      r: 0.030,
      shape: 'ellipse',
      rx: 0.036,
      ry: 0.034,
      region: 'mouth',
      panel: 'full',
      kind: 'look_ring',
      isReassuring: true,
      label: {
        en: 'Strong cough, can talk',
        ar: 'سعال قوي وبيتكلم',
      },
      meaning: {
        en: 'A loud, strong cough is the safest way for his body to clear the food.',
        ar: 'الكحة القوية المسموعة هي أحسن وأأمن طريقة تطرد اللقمة لوحدها.',
      },
      expectedBox: { xMin: 0.51, yMin: 0.41, xMax: 0.61, yMax: 0.50 },
    },
    {
      id: 'c3-hs-color',
      imageId: 'C3_S5',
      x: 0.415,
      y: 0.545,
      r: 0.038,
      shape: 'rounded_rect',
      rx: 0.048,
      ry: 0.056,
      region: 'hands',
      panel: 'full',
      kind: 'look_ring',
      isReassuring: true,
      label: {
        en: 'Alert & breathing well',
        ar: 'واعي وبيتنفس كويس',
      },
      meaning: {
        en: 'He is standing and breathing between coughs — encourage him without hitting.',
        ar: 'واقف وبياخد نفسه بين الكحة — شجعه بهدوء من غير ما تخبطه.',
      },
      expectedBox: { xMin: 0.35, yMin: 0.47, xMax: 0.48, yMax: 0.62 },
    },
  ],

  // ===========================================================================
  // I1_S5 — Infant Severe Choking (Layan 8 mos in Nursery)
  // ===========================================================================
  I1_S5: [
    {
      id: 'i1-hs-cry',
      imageId: 'I1_S5',
      x: 0.635,
      y: 0.405,
      r: 0.030,
      shape: 'ellipse',
      rx: 0.038,
      ry: 0.028,
      region: 'eyes',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'Wide eyes, silent',
        ar: 'عينان واسعتان وصمت تام',
      },
      meaning: {
        en: 'Layan is wide-eyed and completely silent — she cannot cry for air.',
        ar: 'ليان عينيها مفتوحة على الآخر وساكتة خالص ومش قادرة تعيط.',
      },
      expectedBox: { xMin: 0.59, yMin: 0.36, xMax: 0.69, yMax: 0.44 },
    },
    {
      id: 'i1-hs-cough',
      imageId: 'I1_S5',
      x: 0.622,
      y: 0.462,
      r: 0.024,
      shape: 'ellipse',
      rx: 0.026,
      ry: 0.024,
      region: 'mouth',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'No cry, no cough',
        ar: 'لا بكاء ولا سعال',
      },
      meaning: {
        en: 'Her tiny breathing passage is blocked so no cry or cough comes out.',
        ar: 'مجرى النفس الصغير مسدود ومفيش أي صوت بكاء أو كحة طالع.',
      },
      expectedBox: { xMin: 0.58, yMin: 0.43, xMax: 0.66, yMax: 0.50 },
    },
    {
      id: 'i1-hs-infant',
      imageId: 'I1_S5',
      x: 0.618,
      y: 0.585,
      r: 0.036,
      shape: 'rounded_rect',
      rx: 0.046,
      ry: 0.056,
      region: 'chest',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'Infant chest (Never press belly)',
        ar: 'صدر الرضيعة (ممنوع ضغط البطن)',
      },
      meaning: {
        en: 'Babies under 1 year need back blows and chest thrusts — never belly thrusts.',
        ar: 'الرضّع أقل من سنة بنعملهم ضربات ظهر وضغطات صدر — وممنوع البطن تماماً.',
      },
      expectedBox: { xMin: 0.56, yMin: 0.51, xMax: 0.68, yMax: 0.66 },
    },
  ],

  // ===========================================================================
  // I1_OA2 — Infant Severe Composite Two-Panel High-Level Landmark Targets
  // ===========================================================================
  I1_OA2: [
    {
      id: 'i1-target-back',
      imageId: 'I1_OA2',
      x: 0.312,
      y: 0.565,
      r: 0.042,
      shape: 'ellipse',
      rx: 0.042,
      ry: 0.040,
      region: 'back',
      panel: 'left',
      kind: 'hand_target',
      ghostType: 'heel_of_hand',
      arrowDirection: 'down_forward',
      directionHint: {
        en: 'Support on forearm with head supported: 5 back blows',
        ar: 'على الساعد مع دعم الرأس: ٥ ضربات ظهر محسوبة',
      },
      label: {
        en: 'Infant back landmark (5 Back Blows)',
        ar: 'ظهر الرضيعة على الساعد (٥ ضربات ظهر)',
      },
      meaning: {
        en: 'Support the infant on your forearm with head supported and give 5 back blows.',
        ar: 'اسند الرضيعة على الساعد مع دعم الرأس ونفّذ ٥ ضربات ظهر.',
      },
      expectedBox: { xMin: 0.25, yMin: 0.49, xMax: 0.37, yMax: 0.64 },
      initialDragPos: { x: 0.14, y: 0.30 },
      toleranceR: 0.085,
    },
    {
      id: 'i1-target-chest',
      imageId: 'I1_OA2',
      x: 0.768,
      y: 0.595,
      r: 0.042,
      shape: 'ellipse',
      rx: 0.040,
      ry: 0.040,
      region: 'chest',
      panel: 'right',
      kind: 'hand_target',
      ghostType: 'infant_two_fingers',
      arrowDirection: 'chest_in',
      directionHint: {
        en: '5 chest thrusts — never press an infant’s belly',
        ar: '٥ ضغطات صدر — ممنوع ضغط البطن للرضّع تماماً',
      },
      label: {
        en: 'Infant chest landmark (5 Chest Thrusts)',
        ar: 'منتصف صدر الرضيعة (٥ ضغطات صدر)',
      },
      meaning: {
        en: 'Alternate 5 back blows and 5 chest thrusts — never abdominal thrusts.',
        ar: 'بدّل بين ٥ ضربات ظهر و٥ ضغطات صدر — ممنوع البطن تماماً.',
      },
      expectedBox: { xMin: 0.71, yMin: 0.52, xMax: 0.83, yMax: 0.67 },
      initialDragPos: { x: 0.88, y: 0.30 },
      toleranceR: 0.085,
    },
  ],

  // ===========================================================================
  // I2_S5 — Infant Unresponsive (Layan 8 mos limp in caregiver's arms)
  // ===========================================================================
  I2_S5: [
    {
      id: 'i2-hs-unresp',
      imageId: 'I2_S5',
      x: 0.625,
      y: 0.478,
      r: 0.034,
      shape: 'ellipse',
      rx: 0.046,
      ry: 0.036,
      rotation: -15,
      region: 'eyes',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'Eyes closed, unresponsive',
        ar: 'لا استجابة وعينان مغمضتان',
      },
      meaning: {
        en: 'Layan does not move or respond to voice or touch.',
        ar: 'ليان فاقدة الوعي تماماً ومش بتستجيب للصوت أو اللمس.',
      },
      expectedBox: { xMin: 0.56, yMin: 0.42, xMax: 0.69, yMax: 0.53 },
    },
    {
      id: 'i2-hs-breath',
      imageId: 'I2_S5',
      x: 0.658,
      y: 0.542,
      r: 0.025,
      shape: 'ellipse',
      rx: 0.028,
      ry: 0.024,
      rotation: -15,
      region: 'lips',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'No breathing or cry',
        ar: 'لا تنفس ولا بكاء',
      },
      meaning: {
        en: 'No normal breathing — never sweep her tiny mouth blindly with fingers.',
        ar: 'مفيش نفس طبيعي — وممنوع تماماً المسح الأعمى بالأصابع في فمها.',
      },
      expectedBox: { xMin: 0.61, yMin: 0.50, xMax: 0.70, yMax: 0.58 },
    },
    {
      id: 'i2-hs-surface',
      imageId: 'I2_S5',
      x: 0.665,
      y: 0.720,
      r: 0.042,
      shape: 'rounded_rect',
      rx: 0.062,
      ry: 0.070,
      region: 'chest',
      panel: 'full',
      kind: 'look_ring',
      label: {
        en: 'Limp body — place on firm surface',
        ar: 'جسم مرتخٍ — ضعها على سطح صلب',
      },
      meaning: {
        en: 'Place her on a firm flat surface right away and start infant CPR.',
        ar: 'حطها فوراً على سطح صلب ومستوٍ وابدأ إنعاش الرضّع حسب تدريبك.',
      },
      expectedBox: { xMin: 0.58, yMin: 0.63, xMax: 0.75, yMax: 0.81 },
    },
  ],

  // ===========================================================================
  // I3_S5 — Infant Mild Choking (Layan 8 mos in High Chair — Reassuring Signs)
  // ===========================================================================
  I3_S5: [
    {
      id: 'i3-hs-cry',
      imageId: 'I3_S5',
      x: 0.482,
      y: 0.422,
      r: 0.032,
      shape: 'ellipse',
      rx: 0.046,
      ry: 0.034,
      region: 'face',
      panel: 'full',
      kind: 'look_ring',
      isReassuring: true,
      label: {
        en: 'Normal color',
        ar: 'لون الوجه طبيعي',
      },
      meaning: {
        en: 'Her cheeks and lips have a healthy pink color with good oxygen.',
        ar: 'لون خدودها وشفايفها وردي وطبيعي وده معناه إن الأكسجين كويس.',
      },
      expectedBox: { xMin: 0.42, yMin: 0.37, xMax: 0.54, yMax: 0.47 },
    },
    {
      id: 'i3-hs-cough',
      imageId: 'I3_S5',
      x: 0.492,
      y: 0.510,
      r: 0.028,
      shape: 'ellipse',
      rx: 0.032,
      ry: 0.032,
      region: 'mouth',
      panel: 'full',
      kind: 'look_ring',
      isReassuring: true,
      label: {
        en: 'Strong cough & loud cry',
        ar: 'سعال قوي وبكاء مسموع',
      },
      meaning: {
        en: 'A loud cry and strong cough mean air is moving and clearing the food.',
        ar: 'البكاء العالي والكحة القوية معناهم إن النفس شغال وبيطرد اللقمة.',
      },
      expectedBox: { xMin: 0.45, yMin: 0.46, xMax: 0.54, yMax: 0.56 },
    },
    {
      id: 'i3-hs-color',
      imageId: 'I3_S5',
      x: 0.485,
      y: 0.635,
      r: 0.038,
      shape: 'rounded_rect',
      rx: 0.055,
      ry: 0.048,
      region: 'chest',
      panel: 'full',
      kind: 'look_ring',
      isReassuring: true,
      label: {
        en: 'Breathing well — just watch',
        ar: 'بتتنفس كويس — راقب عن قرب',
      },
      meaning: {
        en: 'Her cough is working on its own; stay close and watch without hitting.',
        ar: 'كحتها شغالة كويس لوحدها؛ خليك قريب وراقبها من غير ضربات.',
      },
      expectedBox: { xMin: 0.41, yMin: 0.57, xMax: 0.56, yMax: 0.70 },
    },
  ],
};

/**
 * Retrieve calibrated Look rings for an imageId, falling back to normalized conversion
 * of legacy SceneHotspotItem[] if needed.
 */
export function getLookHotspotsForImage(
  imageId: string,
  fallbackItems: SceneHotspotItem[] = []
): CalibratedHotspot[] {
  const calibrated = CALIBRATED_IMAGE_HOTSPOTS[imageId]?.filter(
    (h) => h.kind === 'look_ring'
  );
  if (calibrated && calibrated.length > 0) {
    return calibrated;
  }

  return fallbackItems.map((item) => {
    const nx = toNormalizedUnit(item.x);
    const ny = toNormalizedUnit(item.y);
    return {
      id: item.id,
      imageId,
      x: nx,
      y: ny,
      r: 0.032,
      shape: 'circle',
      region: item.type === 'airway' ? 'throat' : 'face',
      panel: 'full',
      kind: 'look_ring',
      label: item.label,
      meaning: item.detail,
      expectedBox: {
        xMin: Number(Math.max(0, nx - 0.06).toFixed(3)),
        yMin: Number(Math.max(0, ny - 0.06).toFixed(3)),
        xMax: Number(Math.min(1, nx + 0.06).toFixed(3)),
        yMax: Number(Math.min(1, ny + 0.06).toFixed(3)),
      },
    };
  });
}

/**
 * Retrieve calibrated hand targets (e.g., left-panel back blows and right-panel abdominal/chest thrusts)
 */
export function getHandTargetsForImage(imageId: string): CalibratedHotspot[] {
  const calibrated = CALIBRATED_IMAGE_HOTSPOTS[imageId]?.filter(
    (h) => h.kind === 'hand_target'
  );
  if (calibrated && calibrated.length > 0) {
    return calibrated;
  }

  return CALIBRATED_IMAGE_HOTSPOTS.A2_OA2;
}
