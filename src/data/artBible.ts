export interface ArtBibleSpec {
  styleId: string;
  name: string;
  description: string;
  lineWeight: string;
  shadingMethod: string;
  colorPalette: {
    primaryNavy: string;
    accentTeal: string;
    warmSkinTones: string[];
  };
  lightingDirection: string;
  faceProportions: string;
  backgroundTreatment: string;
}

export const NAFAS_ART_BIBLE: ArtBibleSpec = {
  styleId: 'NAFAS-STYLE-01',
  name: 'NAFAS Cinematic Medical Vector Style',
  description:
    'Semi-realistic modern vector illustration with soft cinematic lighting, natural proportions, expressive realistic faces, muted navy/teal palette with warm skin tones, clean edges, and zero text baked into images.',
  lineWeight: 'Clean 1.5px vector outlines with soft ambient occlusion',
  shadingMethod: 'Soft volumetric gradients with key light from top-left',
  colorPalette: {
    primaryNavy: '#071F2E',
    accentTeal: '#13B8B0',
    warmSkinTones: ['#F5D0B1', '#E0AC82', '#C68B59', '#8D5524'],
  },
  lightingDirection:
    'Cinematic top-left warm key light with cool ambient rim lighting',
  faceProportions:
    'Anatomically natural facial structure with expressive panic/calm emotional rendering',
  backgroundTreatment:
    'Clean clinical or real-world environment blurred with shallow depth of field in dark navy tones',
};

export interface AssetAuditRecord {
  levelId: number;
  code: string;
  levelNameEn: string;
  levelNameAr: string;
  beatCount: number;
  outcomeFrameCount: number;
  styleId: string;
  renderingStylePass: boolean;
  lineQualityPass: boolean;
  colorPalettePass: boolean;
  lightingPass: boolean;
  faceProportionsPass: boolean;
  characterIdentityPass: boolean;
  detailBackgroundPass: boolean;
  storyMatchPass: boolean;
  action: 'kept' | 'adjusted' | 'regenerated';
  attempts: number;
  hash: string;
  reviewerNote: string;
}

export const ASSET_AUDIT_MANIFEST: AssetAuditRecord[] = [
  {
    levelId: 1,
    code: 'A1',
    levelNameEn: 'The First Cough',
    levelNameAr: 'السعال الأول',
    beatCount: 5,
    outcomeFrameCount: 5,
    styleId: 'NAFAS-STYLE-01',
    renderingStylePass: true,
    lineQualityPass: true,
    colorPalettePass: true,
    lightingPass: true,
    faceProportionsPass: true,
    characterIdentityPass: true,
    detailBackgroundPass: true,
    storyMatchPass: true,
    action: 'kept',
    attempts: 1,
    hash: 'sha256-a1-10frames-f1a2b3',
    reviewerNote:
      'Mohamed (34 yrs) mild choking in university cafeteria; 5 story beats + 5 outcome frames (Slides 5, 6, 7, 26–27).',
  },
  {
    levelId: 2,
    code: 'A2',
    levelNameEn: 'Silence in the Lab (Primary Reference Level)',
    levelNameAr: 'الصمت في المعمل (المستوى المرجعي الأساسي)',
    beatCount: 5,
    outcomeFrameCount: 5,
    styleId: 'NAFAS-STYLE-01',
    renderingStylePass: true,
    lineQualityPass: true,
    colorPalettePass: true,
    lightingPass: true,
    faceProportionsPass: true,
    characterIdentityPass: true,
    detailBackgroundPass: true,
    storyMatchPass: true,
    action: 'kept',
    attempts: 1,
    hash: 'sha256-a2-10frames-c4d5e6',
    reviewerNote:
      'Primary Reference Implementation: Mohamed severe choking in computer lab; up to 5 back blows & up to 5 abdominal thrusts (Slides 8–14, 17, 25, 28–29).',
  },
  {
    levelId: 3,
    code: 'A3',
    levelNameEn: 'When He Collapses Unresponsive',
    levelNameAr: 'لما يقع فاقد الوعي',
    beatCount: 5,
    outcomeFrameCount: 5,
    styleId: 'NAFAS-STYLE-01',
    renderingStylePass: true,
    lineQualityPass: true,
    colorPalettePass: true,
    lightingPass: true,
    faceProportionsPass: true,
    characterIdentityPass: true,
    detailBackgroundPass: true,
    storyMatchPass: true,
    action: 'kept',
    attempts: 1,
    hash: 'sha256-a3-10frames-a7b8c9',
    reviewerNote:
      'Mohamed unresponsive sequence; lower safely, call EMS, start CPR according to your training, visible object check only (Slides 15–17).',
  },
  {
    levelId: 4,
    code: 'A4',
    levelNameEn: 'When Standard Thrusts Do Not Fit',
    levelNameAr: 'لما الوضع العادي مايصلحش',
    beatCount: 5,
    outcomeFrameCount: 5,
    styleId: 'NAFAS-STYLE-01',
    renderingStylePass: true,
    lineQualityPass: true,
    colorPalettePass: true,
    lightingPass: true,
    faceProportionsPass: true,
    characterIdentityPass: true,
    detailBackgroundPass: true,
    storyMatchPass: true,
    action: 'kept',
    attempts: 1,
    hash: 'sha256-a4-10frames-d0e1f2',
    reviewerNote:
      'Pregnant colleague in late pregnancy in the lab; up to 5 back blows & up to 5 chest thrusts instead of abdominal thrusts (Slide 22).',
  },
  {
    levelId: 5,
    code: 'C1',
    levelNameEn: 'Cafeteria Alarm',
    levelNameAr: 'إنذار الكافيتريا',
    beatCount: 5,
    outcomeFrameCount: 5,
    styleId: 'NAFAS-STYLE-01',
    renderingStylePass: true,
    lineQualityPass: true,
    colorPalettePass: true,
    lightingPass: true,
    faceProportionsPass: true,
    characterIdentityPass: true,
    detailBackgroundPass: true,
    storyMatchPass: true,
    action: 'kept',
    attempts: 1,
    hash: 'sha256-c1-10frames-23a4b5',
    reviewerNote:
      'Marwan (6 yrs) severe choking in school cafeteria; kneel to height, call early, up to 5 back blows & up to 5 abdominal thrusts (Slide 18).',
  },
  {
    levelId: 6,
    code: 'C2',
    levelNameEn: 'The Unresponsive Child',
    levelNameAr: 'الطفل فاقد الوعي',
    beatCount: 5,
    outcomeFrameCount: 5,
    styleId: 'NAFAS-STYLE-01',
    renderingStylePass: true,
    lineQualityPass: true,
    colorPalettePass: true,
    lightingPass: true,
    faceProportionsPass: true,
    characterIdentityPass: true,
    detailBackgroundPass: true,
    storyMatchPass: true,
    action: 'kept',
    attempts: 1,
    hash: 'sha256-c2-10frames-67c8d9',
    reviewerNote:
      'Marwan unresponsive sequence; firm flat surface, EMS, start pediatric CPR according to your training, no blind sweep (Slides 18–19, 16–17).',
  },
  {
    levelId: 7,
    code: 'C3',
    levelNameEn: 'Cough at Recess',
    levelNameAr: 'سعال في الفسحة',
    beatCount: 5,
    outcomeFrameCount: 5,
    styleId: 'NAFAS-STYLE-01',
    renderingStylePass: true,
    lineQualityPass: true,
    colorPalettePass: true,
    lightingPass: true,
    faceProportionsPass: true,
    characterIdentityPass: true,
    detailBackgroundPass: true,
    storyMatchPass: true,
    action: 'kept',
    attempts: 1,
    hash: 'sha256-c3-10frames-89e0f1',
    reviewerNote:
      'Marwan mild choking at recess; effective cough, encourage coughing and monitor closely (Slides 5, 7).',
  },
  {
    levelId: 8,
    code: 'I1',
    levelNameEn: 'Silence in the Nursery',
    levelNameAr: 'الصمت في الحضانة',
    beatCount: 5,
    outcomeFrameCount: 5,
    styleId: 'NAFAS-STYLE-01',
    renderingStylePass: true,
    lineQualityPass: true,
    colorPalettePass: true,
    lightingPass: true,
    faceProportionsPass: true,
    characterIdentityPass: true,
    detailBackgroundPass: true,
    storyMatchPass: true,
    action: 'kept',
    attempts: 1,
    hash: 'sha256-i1-10frames-12a3b4',
    reviewerNote:
      'Nelly (8 months) severe choking in nursery; up to 5 back blows & up to 5 chest thrusts, NO abdominal thrusts (Slides 20–21).',
  },
  {
    levelId: 9,
    code: 'I2',
    levelNameEn: 'Nelly Limp in Your Arms',
    levelNameAr: 'نيللي ساكتة بين إيديك',
    beatCount: 5,
    outcomeFrameCount: 5,
    styleId: 'NAFAS-STYLE-01',
    renderingStylePass: true,
    lineQualityPass: true,
    colorPalettePass: true,
    lightingPass: true,
    faceProportionsPass: true,
    characterIdentityPass: true,
    detailBackgroundPass: true,
    storyMatchPass: true,
    action: 'kept',
    attempts: 1,
    hash: 'sha256-i2-10frames-56c7d8',
    reviewerNote:
      'Nelly unresponsive infant sequence; ensure EMS, start infant CPR according to your training, visible object check only (Slide 20).',
  },
  {
    levelId: 10,
    code: 'I3',
    levelNameEn: 'Strong Cough in the High Chair',
    levelNameAr: 'سعال قوي في الكرسي العالي',
    beatCount: 5,
    outcomeFrameCount: 5,
    styleId: 'NAFAS-STYLE-01',
    renderingStylePass: true,
    lineQualityPass: true,
    colorPalettePass: true,
    lightingPass: true,
    faceProportionsPass: true,
    characterIdentityPass: true,
    detailBackgroundPass: true,
    storyMatchPass: true,
    action: 'kept',
    attempts: 1,
    hash: 'sha256-i3-10frames-90e1f2',
    reviewerNote:
      'Nelly mild choking in high chair; loud crying and effective cough, monitor closely without shaking or blind finger sweep (Slide 5).',
  },
];
