export type ImageManifestStatus = 'approved' | 'needs_regeneration';

export interface PanelSubRect {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}

export interface ImageManifestEntry {
  id: string;
  level: string;
  beat: string;
  src: string;
  webpSrc: string;
  originalSrc: string;
  width: number;
  height: number;
  aspectRatio: string;
  styleId: string;
  status: ImageManifestStatus;
  optionalNote?: {
    ar: string;
    en: string;
  };
  panels?: {
    left: PanelSubRect;
    right: PanelSubRect;
  };
}

const TWO_PANEL_IMAGES = new Set(['A2_OA2', 'C1_OA2', 'I1_OA2']);

const OPTIONAL_NOTES: Record<string, { ar: string; en: string }> = {
  I1_S1: {
    ar: 'ملاحظة اختيارية: تفاصيل غرفة الحضانة بين I1 و I2 تختلف طفيفاً في الإضاءة',
    en: 'I1 and I2 nurseries differ',
  },
  I2_S1: {
    ar: 'ملاحظة اختيارية: تفاصيل غرفة الحضانة بين I1 و I2 تختلف طفيفاً في الإضاءة',
    en: 'I1 and I2 nurseries differ',
  },
};

/**
 * List of 39 images updated in NAFAS-Levels-Full-Visual-Guide_c1b0fb3c.pdf
 * compared to the earlier draft PDF (all remain 640x357 native resolution).
 */
export const UPDATED_IMAGES_IN_NEW_GUIDE: string[] = [
  'A3_S1', 'A3_S2', 'A3_S3', 'A3_S4', 'A3_S5', 'A3_OA1', 'A3_OA2', 'A3_OA3', 'A3_OB', 'A3_OC',
  'C2_S1', 'C2_S2', 'C2_S3', 'C2_S4', 'C2_S5', 'C2_OA1', 'C2_OA2', 'C2_OA3', 'C2_OB', 'C2_OC',
  'I1_S1', 'I1_S2', 'I1_S3', 'I1_S4', 'I1_S5', 'I1_OA1', 'I1_OA2', 'I1_OA3', 'I1_OB', 'I1_OC',
  'I2_S2', 'I2_S3', 'I2_S4', 'I2_S5', 'I2_OA1', 'I2_OA2', 'I2_OA3', 'I2_OB', 'I2_OC',
];

const LEVEL_IDS = ['A1', 'A2', 'A3', 'A4', 'C1', 'C2', 'C3', 'I1', 'I2', 'I3'] as const;
const BEAT_IDS = ['S1', 'S2', 'S3', 'S4', 'S5', 'OA1', 'OA2', 'OA3', 'OB', 'OC'] as const;

const buildManifest = (): Record<string, ImageManifestEntry> => {
  const manifest: Record<string, ImageManifestEntry> = {};

  for (const level of LEVEL_IDS) {
    for (const beat of BEAT_IDS) {
      const id = `${level}_${beat}`;
      const isTwoPanel = TWO_PANEL_IMAGES.has(id);
      const cacheBust = id === 'C2_OA3' ? '?v=3' : '';
      const webpSrc = `/assets/levels/webp/${id}.webp${cacheBust}`;
      const originalSrc = `/assets/levels/${id}.png${cacheBust}`;
      manifest[id] = {
        id,
        level,
        beat,
        src: webpSrc,
        webpSrc,
        originalSrc,
        width: 640,
        height: 357,
        aspectRatio: '640:357',
        styleId: 'nafas-2d-illustrated-v2',
        status: 'approved',
        optionalNote: OPTIONAL_NOTES[id],
        panels: isTwoPanel
          ? {
              left: { xMin: 0, yMin: 0, xMax: 0.498, yMax: 1 },
              right: { xMin: 0.502, yMin: 0, xMax: 1, yMax: 1 },
            }
          : undefined,
      };
    }
  }

  manifest['LH_Wheelchair'] = {
    id: 'LH_Wheelchair',
    level: 'LH',
    beat: 'Slide23',
    src: '/assets/levels/webp/LH_Wheelchair.webp',
    webpSrc: '/assets/levels/webp/LH_Wheelchair.webp',
    originalSrc: '/assets/levels/LH_Wheelchair.png',
    width: 640,
    height: 357,
    aspectRatio: '640:357',
    styleId: 'nafas-2d-illustrated-v2',
    status: 'approved',
  };

  manifest['LH_ChokingAlone'] = {
    id: 'LH_ChokingAlone',
    level: 'LH',
    beat: 'Slide24',
    src: '/assets/levels/webp/LH_ChokingAlone.webp',
    webpSrc: '/assets/levels/webp/LH_ChokingAlone.webp',
    originalSrc: '/assets/levels/LH_ChokingAlone.png',
    width: 640,
    height: 357,
    aspectRatio: '640:357',
    styleId: 'nafas-2d-illustrated-v2',
    status: 'approved',
  };

  return manifest;
};

export const IMAGE_MANIFEST: Record<string, ImageManifestEntry> = buildManifest();

export const IMAGE_MANIFEST_LIST: ImageManifestEntry[] = Object.values(IMAGE_MANIFEST);

export function getManifestImageSrc(id: string): string {
  return IMAGE_MANIFEST[id]?.webpSrc ?? `/assets/levels/webp/${id}.webp`;
}

export function getManifestEntry(id: string): ImageManifestEntry {
  return (
    IMAGE_MANIFEST[id] ?? {
      id,
      level: id.split('_')[0] || 'A2',
      beat: id.split('_')[1] || 'S5',
      src: `/assets/levels/${id}.png`,
      width: 640,
      height: 357,
      aspectRatio: '640:357',
      styleId: 'nafas-2d-illustrated-v2',
      status: 'approved',
    }
  );
}
