import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
  Wind,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Language, RigPoseId, VictimCharacterId } from '../../types/nafas';
import {
  buildAnatomicalTorsoGeometry,
  buildAnatomicalUpperArmGeometry,
  buildSculptedLungGeometry,
  buildThoracicCageParts,
  buildLarynxAndTracheaParts,
  buildAnatomicalBronchialTreeParts,
  buildDiaphragmGeometry,
} from './anatomyGeometry';
import {
  createRefinedTorsoMaterial,
  createBoneXRayMaterial,
  createAirwayGradientMaterial,
  createRefinedLungMaterial,
  createDiaphragmFresnelMaterial,
  createRadialGlowTexture,
} from './anatomyShaders';

export type ExplorerOrganId =
  | 'airway_bolus'
  | 'trachea_bronchi'
  | 'lungs'
  | 'diaphragm'
  | 'ribcage_sternum'
  | 'rescue_zone';

export interface ExplorerLayerVisibility {
  body: boolean;
  ribcage: boolean;
  lungs: boolean;
  airway: boolean;
}

export interface AnatomicalExplorer3DProps {
  victim: VictimCharacterId;
  pose: RigPoseId;
  language: Language;
  onSelectPose?: (pose: RigPoseId) => void;
}

interface ProfileScaleConfig {
  scale: [number, number, number];
  yOffset: number;
  tracheaWidthScale: number;
  showUterus: boolean;
  showInfantLiver: boolean;
  isInfant: boolean;
  isPregnant: boolean;
  allowAbdominalThrust: boolean;
}

const PROFILE_CONFIGS: Record<VictimCharacterId, ProfileScaleConfig> = {
  youssef_adult: {
    scale: [1.0, 1.0, 1.0],
    yOffset: 0.0,
    tracheaWidthScale: 1.0,
    showUterus: false,
    showInfantLiver: false,
    isInfant: false,
    isPregnant: false,
    allowAbdominalThrust: true,
  },
  salma_pregnant: {
    scale: [0.92, 0.96, 1.03],
    yOffset: 0.01,
    tracheaWidthScale: 0.94,
    showUterus: true,
    showInfantLiver: false,
    isInfant: false,
    isPregnant: true,
    allowAbdominalThrust: false,
  },
  mostafa_child: {
    scale: [0.77, 0.79, 0.80],
    yOffset: -0.02,
    tracheaWidthScale: 0.84,
    showUterus: false,
    showInfantLiver: false,
    isInfant: false,
    isPregnant: false,
    allowAbdominalThrust: true,
  },
  nelly_infant: {
    scale: [0.64, 0.62, 0.68],
    yOffset: -0.03,
    tracheaWidthScale: 0.72,
    showUterus: false,
    showInfantLiver: true,
    isInfant: true,
    isPregnant: false,
    allowAbdominalThrust: false,
  },
};

interface OrganCopy {
  id: ExplorerOrganId;
  label: { en: string; ar: string };
  role: { en: string; ar: string };
  description: (victim: VictimCharacterId, pose: RigPoseId) => { en: string; ar: string };
  anchor: [number, number, number];
  callout: [number, number, number];
  camPos: [number, number, number];
  camTarget: [number, number, number];
}

const ORGAN_DATA: Record<ExplorerOrganId, OrganCopy> = {
  airway_bolus: {
    id: 'airway_bolus',
    label: { en: 'Larynx & Obstruction Point', ar: 'الحنجرة وموضع الانسداد' },
    role: { en: 'Upper Airway Gate', ar: 'بوابة مجرى الهواء العلوي' },
    description: (victim, pose) => {
      if (pose === 'object_expelled_recovery') {
        return {
          en: 'The foreign object has been expelled upward from the larynx, restoring full airflow to both lungs.',
          ar: 'تم طرد الجسم الغريب لأعلى خارج الحنجرة، وعاد تدفق الهواء الكامل إلى الرئتين بأمان.',
        };
      }
      if (pose === 'effective_cough') {
        return {
          en: 'Partial obstruction leaves a breathing channel open—the patient’s strong cough is the safest clearance force.',
          ar: 'الانسداد الجزئي يترك ممراً للهواء؛ السعال القوي والطبيعي للمصاب هو أقوى وأأمن وسيلة لطرد اللقمة.',
        };
      }
      if (victim === 'nelly_infant') {
        return {
          en: 'An 8-month-old infant airway is very narrow and pliable. Never perform blind finger sweeps.',
          ar: 'مجرى هواء الرضيع بعمر ٨ أشهر ضيق ومرن جداً؛ يُمنع المسح الأعمى بالإصبع نهائياً.',
        };
      }
      return {
        en: 'Complete blockage at the larynx stops air and speech immediately, requiring rapid back blows and age-safe thrusts.',
        ar: 'الانسداد الكامل عند الحنجرة يوقف مرور الهواء والكلام فوراً، ويتطلب ضربات ظهرية وضغطات إسعافية مناسبة للعمر.',
      };
    },
    anchor: [0.0, 0.45, 0.06],
    callout: [0.42, 0.56, 0.08],
    camPos: [0.22, 0.42, 1.55],
    camTarget: [0.0, 0.38, 0.02],
  },
  trachea_bronchi: {
    id: 'trachea_bronchi',
    label: { en: 'Trachea & Bronchial Tree', ar: 'القصبة الهوائية والشعب' },
    role: { en: 'Airflow Conduction Pathway', ar: 'مسار توصيل الهواء' },
    description: (victim) =>
      victim === 'nelly_infant'
        ? {
            en: 'Infant tracheal rings are soft cartilage—keep the head neutral (not hyperextended) during airway care.',
            ar: 'حلقات القصبة الهوائية لدى الرضيع غضاريف لينة؛ حافظ على الرأس في وضع محايد دون فرط إمالة.',
          }
        : {
            en: 'Cartilaginous C-rings keep the windpipe open and branch at the carina into both lungs to transmit upward cough pressure.',
            ar: 'حلقات غضروفية تحفظ القصبة مفتوحة وتتفرع إلى الرئتين لنقل موجة ضغط الهواء الصاعدة أثناء الإنقاذ.',
          },
    anchor: [0.04, 0.20, 0.06],
    callout: [0.46, 0.28, 0.08],
    camPos: [0.26, 0.22, 1.65],
    camTarget: [0.0, 0.18, 0.02],
  },
  lungs: {
    id: 'lungs',
    label: { en: 'Right & Left Lungs', ar: 'الرئتان (اليمنى واليسرى)' },
    role: { en: 'Residual Air Pressure Reservoir', ar: 'مخزون الهواء المتبقي للإنقاذ' },
    description: () => ({
      en: 'Even during complete choking, residual trapped air remains inside the lungs. Thrusts compress this air upward like a piston to pop the blockage out.',
      ar: 'حتى مع الانسداد الكامل تحتفظ الرئتان بهواء متبقٍّ؛ الضغطات الإسعافية تضغط هذا الهواء لأعلى كالمكبس لطرد الجسم العالق.',
    }),
    anchor: [-0.18, 0.10, 0.11],
    callout: [-0.50, 0.24, 0.10],
    camPos: [-0.28, 0.14, 1.80],
    camTarget: [0.0, 0.08, 0.0],
  },
  diaphragm: {
    id: 'diaphragm',
    label: { en: 'Thoracic Diaphragm', ar: 'عضلة الحجاب الحاجز' },
    role: { en: 'Upward Pressure Piston', ar: 'مكبس رفع ضغط الصدر' },
    description: (victim) =>
      victim === 'salma_pregnant'
        ? {
            en: 'In the 3rd trimester, the enlarged uterus elevates the diaphragm and blocks safe epigastric access—use mid-sternum chest thrusts instead.',
            ar: 'في الثلث الثالث يرتفع الحجاب الحاجز بسبب حجم الرحم ويُمنع الضغط على البطن—تُستخدم ضغطات الصدر بدلاً منها.',
          }
        : {
            en: 'During inward-and-upward abdominal thrusts, this muscular dome drives upward to squeeze residual lung air out through the trachea.',
            ar: 'أثناء الضغطات البطنية للداخل وللأعلى، تندفع هذه القبة العضلية لأعلى لضغط الهواء داخل الرئتين وطرد الانسداد.',
          },
    anchor: [0.10, -0.17, 0.12],
    callout: [0.48, -0.18, 0.12],
    camPos: [0.30, -0.12, 1.72],
    camTarget: [0.0, -0.15, 0.02],
  },
  ribcage_sternum: {
    id: 'ribcage_sternum',
    label: { en: 'Rib Cage & Mid-Sternum', ar: 'القفص الصدري وعظمة القص' },
    role: { en: 'Thoracic Shield & Sternal Landmark', ar: 'درع الصدر ومعلم الضغطات الصدرية' },
    description: (victim) =>
      victim === 'nelly_infant'
        ? {
            en: 'For infants under 1 year, place 2 fingers on the lower half of the sternum just below the nipple line for 5 chest thrusts.',
            ar: 'للرضع أقل من سنة: ضع إصبعين على النصف السفلي لعظمة القص أسفل خط الحلمتين مباشرة لعمل ٥ ضغطات صدرية.',
          }
        : victim === 'salma_pregnant'
        ? {
            en: 'The center of the sternum (breastbone) is the safe landmark for chest thrusts in late pregnancy, protecting the uterus below.',
            ar: 'منتصف عظمة القص هو المعلم التشريحي الآمن للضغطات الصدرية في الحمل المتقدم لحماية الأم والجنين.',
          }
        : {
            en: 'Keep abdominal thrusts strictly below the lower tip of the sternum (xiphoid process) to avoid rib or xiphoid injury.',
            ar: 'احرص أن تكون ضغطات البطن أسفل الطرف السفلي لعظمة القص (الناتئ الخنجري) وفوق السرة مباشرة.',
          },
    anchor: [0.0, 0.16, 0.22],
    callout: [0.48, 0.14, 0.18],
    camPos: [0.42, 0.18, 1.82],
    camTarget: [0.0, 0.12, 0.05],
  },
  rescue_zone: {
    id: 'rescue_zone',
    label: { en: 'Active Rescue Landmark', ar: 'معلم المناورة الإسعافية' },
    role: { en: 'Force Vector & Safety Zone', ar: 'نقطة الدفع ومنطقة الأمان' },
    description: (victim, pose) => {
      if (pose === 'back_blows_5') {
        return victim === 'nelly_infant'
          ? {
              en: 'Support the infant prone along your forearm, head lower than chest, and deliver up to 5 controlled blows between the shoulder blades.',
              ar: 'أسند الرضيعة على بطنها فوق ساعدك ورأسها أخفض من صدرها، ونفّذ حتى ٥ ضربات محسوبة بين لوحي الكتف.',
            }
          : {
              en: 'Lean the patient forward while supporting their chest, and give up to 5 firm heel-of-hand blows between the shoulder blades.',
              ar: 'أمل المصاب للأمام مع إسناد صدره، ونفّذ حتى ٥ ضربات حازمة بكعب اليد بين لوحي الكتف.',
            };
      }
      if (pose === 'abdominal_thrusts_5') {
        if (victim === 'salma_pregnant') {
          return {
            en: 'CONTRAINDICATED in late pregnancy: pressing the abdomen risks uterine and fetal injury. Switch to sternal chest thrusts.',
            ar: 'ممنوع في الحمل المتقدم: الضغط على البطن يعرّض الرحم والجنين للخطر؛ استبدلها فوراً بضغطات على عظمة القص.',
          };
        }
        if (victim === 'nelly_infant') {
          return {
            en: 'CONTRAINDICATED in infants under 1 year: pressing the soft abdomen risks liver injury. Use 2-finger chest thrusts instead.',
            ar: 'ممنوع للرضع أقل من سنة: الضغط على بطن الرضيع يعرّض الكبد لإصابة خطيرة؛ استخدم ضغطات الصدر بإصبعين.',
          };
        }
        return victim === 'mostafa_child'
          ? {
              en: 'Kneel behind the child, place fist above the navel and below the ribs, and deliver up to 5 inward-and-upward thrusts with child-calibrated force.',
              ar: 'اركع خلف الطفل، ضع قبضتك فوق السرة وأسفل الأضلاع، ونفّذ حتى ٥ ضغطات للداخل وللأعلى بقوة مناسبة لحجم الطفل.',
            }
          : {
              en: 'Place thumb-side of fist just above the navel and well below the sternum; pull sharply inward and upward (J-stroke).',
              ar: 'ضع جانب الإبهام من قبضتك فوق السرة مباشرة وأسفل عظمة القص؛ اسحب بحركة واضحة للداخل وللأعلى.',
            };
      }
      if (pose === 'chest_thrusts_special') {
        return victim === 'nelly_infant'
          ? {
              en: 'Support the infant face-up with head lower than chest and give up to 5 sharp inward chest thrusts using 2 fingers on the lower sternum.',
              ar: 'اقلب الرضيعة على ظهرها مع إبقاء الرأس أخفض من الصدر ونفّذ حتى ٥ ضغطات صدرية بإصبعين على عظمة القص.',
            }
          : {
              en: 'Wrap arms under the armpits to the center of the sternum and pull straight inward—safe and effective for late pregnancy.',
              ar: 'مرّر ذراعيك تحت الإبطين إلى منتصف عظمة القص واسحب للداخل مباشرة—آمن وفعّال في الحمل المتقدم.',
            };
      }
      return {
        en: 'Select any maneuver (Back Blows, Abdominal Thrusts, or Chest Thrusts) to see its exact 3D landmark and airflow physics.',
        ar: 'اختر أي مناورة (ضربات ظهرية، ضغطات بطنية، أو ضغطات صدرية) لرؤية المعلم التشريحي واتجاه الدفع بدقة ثلاثية الأبعاد.',
      };
    },
    anchor: [0.0, -0.34, 0.22],
    callout: [-0.46, -0.32, 0.18],
    camPos: [0.35, -0.05, 2.05],
    camTarget: [0.0, 0.0, 0.0],
  },
};

const ORGAN_ORDER: ExplorerOrganId[] = [
  'airway_bolus',
  'trachea_bronchi',
  'lungs',
  'diaphragm',
  'ribcage_sternum',
  'rescue_zone',
];

type CameraPreset = 'front' | 'side' | 'back';

function evaluateQuietBreath(t: number): number {
  const period = 4.6;
  const phase = (((t % period) + period) % period) / period;
  if (phase < 0.40) {
    const u = phase / 0.40;
    return 0.5 - 0.5 * Math.cos(u * Math.PI);
  }
  const u = (phase - 0.40) / 0.60;
  return Math.pow(0.5 + 0.5 * Math.cos(u * Math.PI), 1.3);
}

/**
 * Curved 3D J-stroke arrow geometry (inward then upward) for Abdominal Thrusts
 */
function buildJStrokeArrowGroup(colorHex: number): THREE.Group {
  const grp = new THREE.Group();
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.06, 0.18),
    new THREE.Vector3(0, -0.04, 0.08),
    new THREE.Vector3(0, 0.03, 0.01),
    new THREE.Vector3(0, 0.14, -0.02),
  ]);
  const shaftGeo = new THREE.TubeGeometry(curve, 24, 0.017, 12, false);
  const mat = new THREE.MeshStandardMaterial({
    color: colorHex,
    emissive: colorHex,
    emissiveIntensity: 0.9,
    roughness: 0.28,
    metalness: 0.1,
    transparent: true,
    opacity: 0.92,
  });
  const shaft = new THREE.Mesh(shaftGeo, mat);
  grp.add(shaft);

  const headGeo = new THREE.ConeGeometry(0.042, 0.095, 16);
  const head = new THREE.Mesh(headGeo, mat);
  head.position.set(0, 0.165, -0.025);
  head.rotation.x = -0.22;
  grp.add(head);

  // Target concentric ring on epigastrium
  const ringGeo = new THREE.TorusGeometry(0.062, 0.0085, 12, 36);
  const ringMat = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.85,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.set(0, -0.055, 0.11);
  grp.add(ring);

  return grp;
}

/**
 * Straight inward impact arrow + concentric shockwave ring for Back Blows or Chest Thrusts
 */
function buildDirectionalTargetGroup(
  colorHex: number,
  directionZ: 1 | -1,
  twoFingerMode = false
): { group: THREE.Group; pulseRing: THREE.Mesh; arrowGroup: THREE.Group } {
  const group = new THREE.Group();

  const mat = new THREE.MeshStandardMaterial({
    color: colorHex,
    emissive: colorHex,
    emissiveIntensity: 0.95,
    roughness: 0.26,
    metalness: 0.1,
    transparent: true,
    opacity: 0.92,
  });

  // Base target ring flush with body surface
  const baseRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.068, 0.0085, 12, 40),
    new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.88 })
  );
  group.add(baseRing);

  const pulseRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.088, 0.006, 10, 40),
    new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  group.add(pulseRing);

  // Dual two-finger contact points for infant sternal thrusts
  if (twoFingerMode) {
    const fingerMat = new THREE.MeshStandardMaterial({
      color: 0x9ef7ff,
      emissive: 0x35e8df,
      emissiveIntensity: 1.1,
      roughness: 0.2,
    });
    const f1 = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 12), fingerMat);
    const f2 = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 12), fingerMat);
    f1.position.set(-0.028, 0.0, 0.015 * directionZ);
    f2.position.set(0.028, 0.0, 0.015 * directionZ);
    group.add(f1, f2);
  }

  // Animated inward vector arrow
  const arrowGroup = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.15, 12), mat);
  shaft.rotation.x = Math.PI / 2;
  shaft.position.z = directionZ * 0.14;
  arrowGroup.add(shaft);

  const head = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.085, 16), mat);
  head.rotation.x = directionZ > 0 ? -Math.PI / 2 : Math.PI / 2;
  head.position.z = directionZ * 0.045;
  arrowGroup.add(head);

  group.add(arrowGroup);

  return { group, pulseRing, arrowGroup };
}

/**
 * Crimson prohibited shield + X mark for unsafe abdominal thrusts on pregnant/infant
 */
function buildContraindicationShield(): THREE.Group {
  const grp = new THREE.Group();
  const redMat = new THREE.MeshStandardMaterial({
    color: 0xff4d5a,
    emissive: 0xe62e3d,
    emissiveIntensity: 1.05,
    roughness: 0.28,
    transparent: true,
    opacity: 0.92,
  });

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.012, 12, 42), redMat);
  grp.add(ring);

  const barGeo = new THREE.BoxGeometry(0.185, 0.020, 0.014);
  const bar1 = new THREE.Mesh(barGeo, redMat);
  bar1.rotation.z = Math.PI / 4;
  const bar2 = new THREE.Mesh(barGeo, redMat);
  bar2.rotation.z = -Math.PI / 4;
  grp.add(bar1, bar2);

  const backing = new THREE.Mesh(
    new THREE.CircleGeometry(0.112, 32),
    new THREE.MeshBasicMaterial({
      color: 0xdc2626,
      transparent: true,
      opacity: 0.24,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  backing.position.z = -0.005;
  grp.add(backing);

  return grp;
}

export const AnatomicalExplorer3D: React.FC<AnatomicalExplorer3DProps> = ({
  victim,
  pose,
  language,
  onSelectPose,
}) => {
  const isAr = language === 'ar';
  const mountRef = useRef<HTMLDivElement>(null);

  const [selectedOrgan, setSelectedOrgan] = useState<ExplorerOrganId | null>(null);
  const [hoveredOrgan, setHoveredOrgan] = useState<ExplorerOrganId | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<CameraPreset>('front');
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const [layers, setLayers] = useState<ExplorerLayerVisibility>({
    body: true,
    ribcage: true,
    lungs: true,
    airway: true,
  });

  const profileCfg = PROFILE_CONFIGS[victim];
  const isUnsafeCombo =
    pose === 'abdominal_thrusts_5' && !profileCfg.allowAbdominalThrust;

  // Mutable ref read inside the WebGL tick loop without tearing down the canvas
  const stateRef = useRef({
    victim,
    pose,
    selectedOrgan: null as ExplorerOrganId | null,
    hoveredOrgan: null as ExplorerOrganId | null,
    isPlaying: true,
    layers: { body: true, ribcage: true, lungs: true, airway: true },
    cameraGoalPos: null as THREE.Vector3 | null,
    cameraGoalTarget: null as THREE.Vector3 | null,
  });

  const cmdRef = useRef<{
    setCameraPreset: (preset: CameraPreset) => void;
    zoomBy: (factor: number) => void;
    focusOrgan: (id: ExplorerOrganId) => void;
    resetView: () => void;
  } | null>(null);

  useEffect(() => {
    stateRef.current.victim = victim;
    stateRef.current.pose = pose;
    // Automatically frame the optimal angle for each maneuver so the user immediately sees what changed!
    if (cmdRef.current) {
      if (pose === 'back_blows_5') {
        setActivePreset('back');
        cmdRef.current.setCameraPreset('back');
      } else {
        setActivePreset('front');
        cmdRef.current.setCameraPreset('front');
      }
    }
  }, [victim, pose]);

  useEffect(() => {
    stateRef.current.selectedOrgan = selectedOrgan;
  }, [selectedOrgan]);

  useEffect(() => {
    stateRef.current.hoveredOrgan = hoveredOrgan;
  }, [hoveredOrgan]);

  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    stateRef.current.layers = layers;
  }, [layers]);

  const handleSelectOrgan = useCallback((id: ExplorerOrganId | null) => {
    stateRef.current.selectedOrgan = id;
    setSelectedOrgan(id);
    if (id) {
      setDrawerOpen(false);
      cmdRef.current?.focusOrgan(id);
    } else {
      cmdRef.current?.resetView();
    }
  }, []);

  const handlePresetClick = useCallback((preset: CameraPreset) => {
    stateRef.current.selectedOrgan = null;
    setSelectedOrgan(null);
    setDrawerOpen(false);
    setActivePreset(preset);
    cmdRef.current?.setCameraPreset(preset);
  }, []);

  const toggleLayer = useCallback((key: keyof ExplorerLayerVisibility) => {
    setLayers((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      stateRef.current.layers = next;
      return next;
    });
  }, []);

  // =========================================================================
  // THREE.JS SCENE LIFECYCLE (Mounted once — smooth transitions across states)
  // =========================================================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setIsPlaying(false);
      stateRef.current.isPlaying = false;
    }

    // Detect software WebGL cleanly from GPU renderer string
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl =
          probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || '');
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 240);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        preserveDrawingBuffer: isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const computeDefaultDist = (aspect: number) =>
      Math.max(2.62, 2.82 / Math.max(aspect, 0.85));
    let baseDist = computeDefaultDist(width / height);

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 40);
    camera.position.set(0.28, 0.08, baseDist);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.25;
    controls.maxDistance = 4.2;
    controls.minPolarAngle = Math.PI * 0.16;
    controls.maxPolarAngle = Math.PI * 0.84;
    controls.target.set(0, 0.04, 0);
    controls.update();

    let userInteracting = false;
    controls.addEventListener('start', () => {
      userInteracting = true;
      stateRef.current.cameraGoalPos = null;
      stateRef.current.cameraGoalTarget = null;
    });
    controls.addEventListener('end', () => {
      userInteracting = false;
    });

    // Studio lighting rig
    scene.add(new THREE.HemisphereLight(0x8be2ff, 0x051828, 1.0));
    const keyLight = new THREE.DirectionalLight(0xfff4ea, 1.85);
    keyLight.position.set(2.4, 3.0, 3.2);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x3ad4ec, 1.65);
    rimLight.position.set(-2.6, 1.8, -2.4);
    scene.add(rimLight);
    const warmCoreLight = new THREE.PointLight(0xff7444, 2.0, 3.0, 1.6);
    warmCoreLight.position.set(0, 0.1, 0.25);
    scene.add(warmCoreLight);

    // Subtle spatial calibration floor ring (replaces crude gray pedestal)
    const floorGroup = new THREE.Group();
    floorGroup.position.y = -0.68;
    const outerCalibrationRing = new THREE.Mesh(
      new THREE.RingGeometry(0.64, 0.655, 72),
      new THREE.MeshBasicMaterial({
        color: 0x35d6e4,
        transparent: true,
        opacity: 0.26,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    outerCalibrationRing.rotation.x = -Math.PI / 2;
    floorGroup.add(outerCalibrationRing);

    const innerCalibrationRing = new THREE.Mesh(
      new THREE.RingGeometry(0.42, 0.428, 56),
      new THREE.MeshBasicMaterial({
        color: 0x13b8b0,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    innerCalibrationRing.rotation.x = -Math.PI / 2;
    floorGroup.add(innerCalibrationRing);

    const floorGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.45, 1.45),
      new THREE.MeshBasicMaterial({
        map: createRadialGlowTexture([
          { offset: 0, color: 'rgba(20, 184, 176, 0.28)' },
          { offset: 0.55, color: 'rgba(20, 184, 176, 0.1)' },
          { offset: 1, color: 'rgba(7, 31, 46, 0)' },
        ]),
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    floorGlow.rotation.x = -Math.PI / 2;
    floorGlow.position.y = -0.005;
    floorGroup.add(floorGlow);
    scene.add(floorGroup);

    // =========================================================================
    // SCULPTED ANATOMICAL HIERARCHY (Reusing high-fidelity medical glass geometry)
    // =========================================================================
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Posture pivot allows smooth forward lean (adult/child back blows) or prone/supine tilt (infant)
    const postureGroup = new THREE.Group();
    rootGroup.add(postureGroup);

    // 1. Frosted Medical Glass Torso & Arms
    const bodyShellGroup = new THREE.Group();
    const torsoGeo = buildAnatomicalTorsoGeometry();
    const armLeftGeo = buildAnatomicalUpperArmGeometry(-1);
    const armRightGeo = buildAnatomicalUpperArmGeometry(1);

    const torsoBackMat = createRefinedTorsoMaterial(true, 0);
    const torsoFrontMat = createRefinedTorsoMaterial(false, 0);
    const armLMat = createRefinedTorsoMaterial(false, -1);
    const armRMat = createRefinedTorsoMaterial(false, 1);
    const torsoMats = [torsoBackMat, torsoFrontMat, armLMat, armRMat];

    const torsoBackMesh = new THREE.Mesh(torsoGeo, torsoBackMat);
    torsoBackMesh.renderOrder = 1;
    const torsoFrontMesh = new THREE.Mesh(torsoGeo, torsoFrontMat);
    torsoFrontMesh.renderOrder = 10;
    const armLMesh = new THREE.Mesh(armLeftGeo, armLMat);
    armLMesh.renderOrder = 10;
    const armRMesh = new THREE.Mesh(armRightGeo, armRMat);
    armRMesh.renderOrder = 10;
    bodyShellGroup.add(torsoBackMesh, torsoFrontMesh, armLMesh, armRMesh);
    postureGroup.add(bodyShellGroup);

    // 2. Layered X-Ray Rib Cage (posterior behind lungs, anterior in front with pleural clearance)
    const ribcageGroup = new THREE.Group();
    const thoracicPivotY = 0.08;
    ribcageGroup.position.y = thoracicPivotY;

    const cageParts = buildThoracicCageParts();
    const shiftCage = (g: THREE.BufferGeometry) => {
      g.translate(0, -thoracicPivotY, 0);
      return g;
    };

    const ribBackMat = createBoneXRayMaterial({
      coreHex: 0x1668a4,
      rimHex: 0x5cd8f8,
      baseAlpha: 0.15,
      rimAlpha: 0.44,
      specularStrength: 0.28,
      isPosterior: true,
    });
    const ribFrontMat = createBoneXRayMaterial({
      coreHex: 0x3098d0,
      rimHex: 0xbaf6ff,
      baseAlpha: 0.20,
      rimAlpha: 0.56,
      specularStrength: 0.58,
      additive: true,
    });
    const cartilageMat = createBoneXRayMaterial({
      coreHex: 0x249ec4,
      rimHex: 0x9ef4ff,
      baseAlpha: 0.16,
      rimAlpha: 0.46,
      specularStrength: 0.42,
      additive: true,
    });
    const sternumMat = createBoneXRayMaterial({
      coreHex: 0x2484be,
      rimHex: 0xa2f0ff,
      baseAlpha: 0.15,
      rimAlpha: 0.48,
      specularStrength: 0.46,
      additive: true,
    });
    const spineMat = createBoneXRayMaterial({
      coreHex: 0x165a92,
      rimHex: 0x5ccdf2,
      baseAlpha: 0.14,
      rimAlpha: 0.38,
      specularStrength: 0.24,
      isPosterior: true,
    });

    const ribsBackMesh = new THREE.Mesh(shiftCage(cageParts.ribsBackGeometry), ribBackMat);
    ribsBackMesh.renderOrder = 2;
    const spineMesh = new THREE.Mesh(shiftCage(cageParts.spineGeometry), spineMat);
    spineMesh.renderOrder = 2;
    const ribsFrontMesh = new THREE.Mesh(shiftCage(cageParts.ribsFrontGeometry), ribFrontMat);
    ribsFrontMesh.renderOrder = 7;
    const cartilageMesh = new THREE.Mesh(shiftCage(cageParts.cartilageGeometry), cartilageMat);
    cartilageMesh.renderOrder = 7;
    const sternumMesh = new THREE.Mesh(shiftCage(cageParts.sternumGeometry), sternumMat);
    sternumMesh.renderOrder = 7;
    const claviclesMesh = new THREE.Mesh(shiftCage(cageParts.claviclesGeometry), ribFrontMat);
    claviclesMesh.renderOrder = 7;

    ribcageGroup.add(
      ribsBackMesh,
      spineMesh,
      ribsFrontMesh,
      cartilageMesh,
      sternumMesh,
      claviclesMesh
    );
    postureGroup.add(ribcageGroup);

    // 3. Sculpted Multi-Lobed Translucent Lungs
    const lungsGroup = new THREE.Group();
    const rightLungGeo = buildSculptedLungGeometry(-1, 1.0);
    const leftLungGeo = buildSculptedLungGeometry(1, 1.0);
    const rightLungCoreGeo = buildSculptedLungGeometry(-1, 0.78);
    const leftLungCoreGeo = buildSculptedLungGeometry(1, 0.78);
    const lungOuterMat = createRefinedLungMaterial(false);
    const lungInnerMat = createRefinedLungMaterial(true);

    const rLungInner = new THREE.Mesh(rightLungCoreGeo, lungInnerMat);
    rLungInner.renderOrder = 3;
    const lLungInner = new THREE.Mesh(leftLungCoreGeo, lungInnerMat);
    lLungInner.renderOrder = 3;

    const rLungOuter = new THREE.Mesh(rightLungGeo, lungOuterMat);
    rLungOuter.renderOrder = 5;
    const lLungOuter = new THREE.Mesh(leftLungGeo, lungOuterMat);
    lLungOuter.renderOrder = 5;
    lungsGroup.add(rLungInner, lLungInner, rLungOuter, lLungOuter);
    postureGroup.add(lungsGroup);

    // 4. Larynx, 18-Ring Trachea & 4-Generation Bronchial Tree
    const airwayGroup = new THREE.Group();
    const tracheaParts = buildLarynxAndTracheaParts();
    const bronchialParts = buildAnatomicalBronchialTreeParts();

    const tracheaMat = createAirwayGradientMaterial({
      isCartilage: false,
      baseOpacity: 0.94,
    });
    const cartilageRingMat = createAirwayGradientMaterial({
      isCartilage: true,
      baseOpacity: 0.97,
    });
    const mainBronchiMat = createAirwayGradientMaterial({
      isCartilage: false,
      isDistal: false,
      baseOpacity: 0.96,
    });
    const distalBronchiMat = createAirwayGradientMaterial({
      isCartilage: false,
      isDistal: true,
      baseOpacity: 0.93,
    });

    const tracheaMesh = new THREE.Mesh(tracheaParts.larynxTracheaGeometry, tracheaMat);
    tracheaMesh.renderOrder = 4;
    const ringsMesh = new THREE.Mesh(tracheaParts.cartilageRingsGeometry, cartilageRingMat);
    ringsMesh.renderOrder = 4;
    const mainBronchiMesh = new THREE.Mesh(bronchialParts.mainBronchiGeometry, mainBronchiMat);
    mainBronchiMesh.renderOrder = 4;
    const distalBronchiMesh = new THREE.Mesh(
      bronchialParts.distalBronchiolesGeometry,
      distalBronchiMat
    );
    distalBronchiMesh.renderOrder = 4;

    airwayGroup.add(tracheaMesh, ringsMesh, mainBronchiMesh, distalBronchiMesh);
    postureGroup.add(airwayGroup);

    // 5. Sculpted Double-Domed Diaphragm
    const diaphragmGroup = new THREE.Group();
    const diaphragmGeo = buildDiaphragmGeometry();
    const diaphragmMat = createDiaphragmFresnelMaterial();
    const diaphragmMesh = new THREE.Mesh(diaphragmGeo, diaphragmMat);
    diaphragmMesh.position.y = -0.188;
    diaphragmMesh.renderOrder = 4;
    diaphragmGroup.add(diaphragmMesh);
    postureGroup.add(diaphragmGroup);

    // 6. Anatomical Differentiation Organs (Pregnant 3rd-Trimester Uterus + Infant Liver Zone)
    const pregnantUterusGroup = new THREE.Group();
    const uterusMat = new THREE.MeshPhysicalMaterial({
      color: 0xf4a261,
      emissive: 0xd97706,
      emissiveIntensity: 0.45,
      roughness: 0.35,
      metalness: 0.05,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    const uterusMesh = new THREE.Mesh(new THREE.SphereGeometry(0.195, 32, 24), uterusMat);
    uterusMesh.scale.set(1.05, 1.12, 0.98);
    uterusMesh.position.set(0, -0.40, 0.145);
    uterusMesh.renderOrder = 6;
    const uterusRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.185, 0.006, 10, 44),
      new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.65,
      })
    );
    uterusRim.position.set(0, -0.39, 0.185);
    uterusRim.rotation.x = 0.25;
    pregnantUterusGroup.add(uterusMesh, uterusRim);
    pregnantUterusGroup.visible = false;
    postureGroup.add(pregnantUterusGroup);

    const infantLiverGroup = new THREE.Group();
    const liverMat = new THREE.MeshPhysicalMaterial({
      color: 0xe76f51,
      emissive: 0xc2410c,
      emissiveIntensity: 0.42,
      roughness: 0.4,
      transparent: true,
      opacity: 0.44,
      depthWrite: false,
    });
    const liverMesh = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 18), liverMat);
    liverMesh.scale.set(1.25, 0.72, 0.85);
    liverMesh.position.set(-0.075, -0.295, 0.095);
    liverMesh.renderOrder = 6;
    infantLiverGroup.add(liverMesh);
    infantLiverGroup.visible = false;
    postureGroup.add(infantLiverGroup);

    // 7. Airway Obstruction Bolus + Glow Halo
    const bolusGroup = new THREE.Group();
    const bolusMat = new THREE.MeshStandardMaterial({
      color: 0xff3b4e,
      emissive: 0xff1e38,
      emissiveIntensity: 1.1,
      roughness: 0.3,
      metalness: 0.05,
      transparent: true,
      opacity: 0.96,
    });
    const bolusMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.036, 1), bolusMat);
    bolusMesh.renderOrder = 8;
    const bolusGlowMat = new THREE.SpriteMaterial({
      map: createRadialGlowTexture([
        { offset: 0, color: 'rgba(255, 110, 120, 0.96)' },
        { offset: 0.45, color: 'rgba(255, 55, 75, 0.52)' },
        { offset: 1, color: 'rgba(255, 40, 60, 0)' },
      ]),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.78,
    });
    const bolusGlow = new THREE.Sprite(bolusGlowMat);
    bolusGlow.scale.set(0.24, 0.24, 1);
    bolusGlow.renderOrder = 9;
    bolusGroup.add(bolusMesh, bolusGlow);
    bolusGroup.position.set(0, 0.45, 0.025);
    postureGroup.add(bolusGroup);

    // 8. Dynamic Airflow Particles (React visibly to Partial / Complete / Cleared states!)
    const airflowCount = 34;
    const airflowPositions = new Float32Array(airflowCount * 3);
    const airflowGeo = new THREE.BufferGeometry();
    airflowGeo.setAttribute('position', new THREE.BufferAttribute(airflowPositions, 3));
    const airflowMat = new THREE.PointsMaterial({
      size: 0.044,
      map: createRadialGlowTexture([
        { offset: 0, color: 'rgba(220, 254, 255, 1)' },
        { offset: 0.42, color: 'rgba(95, 232, 245, 0.72)' },
        { offset: 1, color: 'rgba(40, 210, 230, 0)' },
      ]),
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0x7ef7ff,
    });
    const airflowPoints = new THREE.Points(airflowGeo, airflowMat);
    airflowPoints.renderOrder = 9;
    postureGroup.add(airflowPoints);

    // 9. Interactive 3D Maneuver Landmarks (Back Blows, Abdominal J-Stroke, Chest Thrusts, Contraindication Shield)
    const backBlowVisual = buildDirectionalTargetGroup(0x2ee6d6, -1, false);
    backBlowVisual.group.position.set(0, 0.25, -0.235);
    backBlowVisual.group.visible = false;
    postureGroup.add(backBlowVisual.group);

    const abdominalJArrow = buildJStrokeArrowGroup(0x2ee6d6);
    abdominalJArrow.position.set(0, -0.34, 0.16);
    abdominalJArrow.visible = false;
    postureGroup.add(abdominalJArrow);

    const chestThrustVisualAdult = buildDirectionalTargetGroup(0x38e8df, 1, false);
    chestThrustVisualAdult.group.position.set(0, 0.14, 0.25);
    chestThrustVisualAdult.group.visible = false;
    postureGroup.add(chestThrustVisualAdult.group);

    const chestThrustVisualInfant = buildDirectionalTargetGroup(0x38e8df, 1, true);
    chestThrustVisualInfant.group.position.set(0, 0.10, 0.25);
    chestThrustVisualInfant.group.visible = false;
    postureGroup.add(chestThrustVisualInfant.group);

    const unsafeShield = buildContraindicationShield();
    unsafeShield.position.set(0, -0.36, 0.31);
    unsafeShield.visible = false;
    postureGroup.add(unsafeShield);

    // 10. Crisp 3D Leader Callout Line for Selected Organ
    const calloutGroup = new THREE.Group();
    const leaderMat = new THREE.MeshBasicMaterial({
      color: 0x7cf4ff,
      transparent: true,
      opacity: 0.92,
    });
    const leaderSeg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.0042, 0.0042, 1, 8), leaderMat);
    const leaderSeg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.0042, 0.0042, 1, 8), leaderMat);
    const anchorDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.018, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xe6ffff })
    );
    const endDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.013, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x43c7d1 })
    );
    calloutGroup.add(leaderSeg1, leaderSeg2, anchorDot, endDot);
    calloutGroup.visible = false;
    postureGroup.add(calloutGroup);

    // 11. Dedicated Invisible Raycast Hit Colliders (Layer 1) for Instant, Reliable Clicking
    const hitTargets: THREE.Object3D[] = [];
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const addHitZone = (
      id: ExplorerOrganId,
      geo: THREE.BufferGeometry,
      pos: [number, number, number]
    ) => {
      const m = new THREE.Mesh(geo, hitMat);
      m.position.set(...pos);
      m.userData.organId = id;
      m.layers.set(1);
      postureGroup.add(m);
      hitTargets.push(m);
    };
    addHitZone('airway_bolus', new THREE.SphereGeometry(0.11, 10, 10), [0, 0.45, 0.03]);
    addHitZone('trachea_bronchi', new THREE.CylinderGeometry(0.08, 0.11, 0.30, 10), [0, 0.24, 0.03]);
    addHitZone('lungs', new THREE.SphereGeometry(0.16, 10, 10), [-0.18, 0.10, 0.02]);
    addHitZone('lungs', new THREE.SphereGeometry(0.16, 10, 10), [0.18, 0.10, 0.02]);
    addHitZone('diaphragm', new THREE.BoxGeometry(0.46, 0.14, 0.30), [0, -0.18, 0.04]);
    addHitZone('ribcage_sternum', new THREE.BoxGeometry(0.14, 0.32, 0.12), [0, 0.15, 0.21]);
    addHitZone('rescue_zone', new THREE.SphereGeometry(0.17, 10, 10), [0, -0.35, 0.22]);
    addHitZone('rescue_zone', new THREE.SphereGeometry(0.17, 10, 10), [0, 0.25, -0.22]);

    // Pre-allocated math helpers (zero GC in render loop)
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointerNdc = new THREE.Vector2();
    const _up = new THREE.Vector3(0, 1, 0);
    const _dir = new THREE.Vector3();
    const _mid = new THREE.Vector3();
    const _a = new THREE.Vector3();
    const _b = new THREE.Vector3();
    const _c = new THREE.Vector3();
    const _afPt = new THREE.Vector3();
    const _targetScale = new THREE.Vector3(1, 1, 1);
    const _camCurOffset = new THREE.Vector3();
    const _camGoalOffset = new THREE.Vector3();
    const _curSph = new THREE.Spherical();
    const _goalSph = new THREE.Spherical();

    const placeLeaderSeg = (
      seg: THREE.Mesh,
      p1: THREE.Vector3,
      p2: THREE.Vector3
    ) => {
      _dir.subVectors(p2, p1);
      const len = _dir.length();
      if (len < 1e-4) return;
      seg.position.copy(p1).addScaledVector(_dir, 0.5);
      seg.scale.set(1, len, 1);
      seg.quaternion.setFromUnitVectors(_up, _dir.normalize());
    };

    // Expose imperative camera commands
    const getPresetVectors = (preset: CameraPreset) => {
      const dist = baseDist;
      if (preset === 'back') {
        return {
          pos: new THREE.Vector3(-0.76, 0.24, -dist * 0.96),
          target: new THREE.Vector3(0, 0.05, 0),
        };
      }
      if (preset === 'side') {
        return {
          pos: new THREE.Vector3(dist * 0.96, 0.12, 0.48),
          target: new THREE.Vector3(0, -0.02, 0),
        };
      }
      return {
        pos: new THREE.Vector3(0.28, 0.08, dist),
        target: new THREE.Vector3(0, -0.02, 0),
      };
    };

    cmdRef.current = {
      setCameraPreset: (preset: CameraPreset) => {
        const v = getPresetVectors(preset);
        stateRef.current.cameraGoalPos = v.pos;
        stateRef.current.cameraGoalTarget = v.target;
      },
      zoomBy: (factor: number) => {
        const offset = camera.position.clone().sub(controls.target);
        const len = THREE.MathUtils.clamp(
          offset.length() * factor,
          controls.minDistance,
          controls.maxDistance
        );
        offset.setLength(len);
        stateRef.current.cameraGoalPos = controls.target.clone().add(offset);
        stateRef.current.cameraGoalTarget = controls.target.clone();
      },
      focusOrgan: (id: ExplorerOrganId) => {
        const info = ORGAN_DATA[id];
        const cfg = PROFILE_CONFIGS[stateRef.current.victim];
        const s = cfg.scale[1];
        if (id === 'rescue_zone' && stateRef.current.pose === 'back_blows_5') {
          stateRef.current.cameraGoalPos = new THREE.Vector3(-0.68, 0.24, -baseDist * 0.9);
          stateRef.current.cameraGoalTarget = new THREE.Vector3(0, 0.14 * s, -0.06);
          return;
        }
        stateRef.current.cameraGoalTarget = new THREE.Vector3(
          info.camTarget[0] * s,
          info.camTarget[1] * s + cfg.yOffset - 0.04,
          info.camTarget[2] * s
        );
        stateRef.current.cameraGoalPos = new THREE.Vector3(
          info.camPos[0] * 1.12,
          info.camPos[1] * s + cfg.yOffset,
          info.camPos[2] * 1.18
        );
      },
      resetView: () => {
        const v = getPresetVectors(
          stateRef.current.pose === 'back_blows_5' ? 'back' : 'front'
        );
        stateRef.current.cameraGoalPos = v.pos;
        stateRef.current.cameraGoalTarget = v.target;
      },
    };

    // Pointer picking (click vs drag detection)
    let downX = 0;
    let downY = 0;
    let lastHoverCheck = 0;

    const pickOrgan = (clientX: number, clientY: number): ExplorerOrganId | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return null;
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(hitTargets, false);
      if (hits.length > 0) {
        return (hits[0].object.userData.organId as ExplorerOrganId) || null;
      }
      return null;
    };

    const onPointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
      if (dist > 7) return; // Dragged camera, not a click
      const hit = pickOrgan(e.clientX, e.clientY);
      if (hit) {
        handleSelectOrgan(hit === stateRef.current.selectedOrgan ? null : hit);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (userInteracting) return;
      const now = performance.now();
      if (now - lastHoverCheck < 75) return;
      lastHoverCheck = now;
      const hit = pickOrgan(e.clientX, e.clientY);
      renderer.domElement.style.cursor = hit ? 'pointer' : 'grab';
      if (hit !== stateRef.current.hoveredOrgan) {
        stateRef.current.hoveredOrgan = hit;
        setHoveredOrgan(hit);
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglUnavailable(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    // ResizeObserver
    const ro = new ResizeObserver(() => {
      const w = Math.max(container.clientWidth, 240);
      const h = Math.max(container.clientHeight, 200);
      baseDist = computeDefaultDist(w / h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    // =========================================================================
    // ANIMATION LOOP (Software-WebGL fenceSync + Off-screen Pause + Real Physics)
    // =========================================================================
    const clock = new THREE.Clock();
    let animTime = 0.6;
    let frameId = 0;
    let isDisposed = false;
    let isInViewport = true;
    let isTabHidden = typeof document !== 'undefined' ? document.hidden : false;
    let isLoopPaused = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
          const st = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (st === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function tick() {
      if (isDisposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const st = stateRef.current;
      const cfg = PROFILE_CONFIGS[st.victim];
      const unsafeAbdominal =
        st.pose === 'abdominal_thrusts_5' && !cfg.allowAbdominalThrust;

      if (st.isPlaying && !reducedMotion) {
        animTime += delta;
      }

      // 1. Smoothly morph anatomical proportions between Adult / Pregnant / Child / Infant
      _targetScale.set(...cfg.scale);
      postureGroup.scale.x = THREE.MathUtils.damp(postureGroup.scale.x, _targetScale.x, 7.5, delta);
      postureGroup.scale.y = THREE.MathUtils.damp(postureGroup.scale.y, _targetScale.y, 7.5, delta);
      postureGroup.scale.z = THREE.MathUtils.damp(postureGroup.scale.z, _targetScale.z, 7.5, delta);
      postureGroup.position.y = THREE.MathUtils.damp(postureGroup.position.y, cfg.yOffset, 7.5, delta);

      // Narrower pediatric/infant trachea diameter
      airwayGroup.scale.x = THREE.MathUtils.damp(airwayGroup.scale.x, cfg.tracheaWidthScale, 7.5, delta);
      airwayGroup.scale.z = THREE.MathUtils.damp(airwayGroup.scale.z, cfg.tracheaWidthScale, 7.5, delta);

      // Anatomical differentiators
      pregnantUterusGroup.visible = cfg.showUterus && st.layers.body;
      infantLiverGroup.visible = cfg.showInfantLiver && st.layers.body;

      // 2. Smooth clinical posture choreography per Age × Maneuver
      let targetTiltX = 0;
      if (st.pose === 'back_blows_5') {
        targetTiltX = cfg.isInfant ? 0.62 : 0.30; // Infant prone head-down vs Adult/Child forward lean
      } else if (st.pose === 'chest_thrusts_special' && cfg.isInfant) {
        targetTiltX = -0.46; // Infant supine head-lower-than-chest
      }
      postureGroup.rotation.x = THREE.MathUtils.damp(postureGroup.rotation.x, targetTiltX, 6.5, delta);

      // 3. Layer visibility
      bodyShellGroup.visible = st.layers.body;
      ribcageGroup.visible = st.layers.ribcage;
      lungsGroup.visible = st.layers.lungs;
      airwayGroup.visible = st.layers.airway;
      diaphragmGroup.visible = st.layers.lungs || st.layers.airway;

      // 4. Rhythm pulse for active rescue maneuvers (5 beats / cycle)
      const maneuverBeat = Math.pow(0.5 + 0.5 * Math.sin(animTime * 4.4), 3.0);
      const coughBeat = Math.pow(0.5 + 0.5 * Math.sin(animTime * 2.8), 5.0);
      const breathNorm = reducedMotion ? 0.45 : evaluateQuietBreath(animTime);
      const breathC = breathNorm - 0.5;

      // Synchronized biomechanical movement based on airway state
      let lungScaleX = 1 + breathC * 0.055;
      let lungScaleY = 1 + breathC * 0.036;
      let diaY = cfg.isPregnant ? -0.155 : -0.188;
      let diaScaleY = 1.0;

      if (st.pose === 'severe_silent_choking') {
        // Strained, shallow frustrated inspiratory effort (air cannot enter!)
        const strain = Math.sin(animTime * 3.4) * 0.012;
        lungScaleX = 0.96 + strain;
        lungScaleY = 0.97 + strain;
        diaY -= Math.sin(animTime * 3.4) * 0.01;
      } else if (st.pose === 'effective_cough') {
        // Strong natural cough bursts pushing air out
        lungScaleX = 1.02 - coughBeat * 0.055;
        lungScaleY = 1.01 - coughBeat * 0.035;
        diaY += coughBeat * 0.042;
      } else if (st.pose === 'back_blows_5') {
        // Sharp chest vibration shock with each interscapular blow
        lungScaleX = 1.0 - maneuverBeat * 0.038;
        lungScaleY = 1.0 + maneuverBeat * 0.022;
        diaY += maneuverBeat * 0.024;
      } else if (st.pose === 'abdominal_thrusts_5' && !unsafeAbdominal) {
        // Diaphragm rockets upward like a piston, compressing lungs!
        diaY += maneuverBeat * 0.072;
        diaScaleY = 1 + maneuverBeat * 0.14;
        lungScaleX = 1.0 - maneuverBeat * 0.068;
        lungScaleY = 1.0 - maneuverBeat * 0.045;
      } else if (st.pose === 'chest_thrusts_special') {
        // Direct anterior-posterior sternal compression
        lungScaleX = 1.0 - maneuverBeat * 0.052;
        lungScaleY = 1.0 + maneuverBeat * 0.018;
        diaY += maneuverBeat * 0.022;
      } else if (st.pose === 'object_expelled_recovery') {
        // Deep calm recovery breaths
        lungScaleX = 1 + breathC * 0.072;
        lungScaleY = 1 + breathC * 0.048;
        diaY -= breathC * 0.036;
        diaScaleY = 1 - breathC * 0.10;
      }

      lungsGroup.scale.set(lungScaleX, lungScaleY, lungScaleX);
      ribcageGroup.scale.set(
        1 + (lungScaleX - 1) * 0.35,
        1 + (lungScaleY - 1) * 0.35,
        1 + (lungScaleX - 1) * 0.40
      );
      diaphragmMesh.position.y = diaY;
      diaphragmMesh.scale.set(1, diaScaleY, 1);

      // 5. Obstruction bolus position & appearance
      if (st.pose === 'object_expelled_recovery') {
        const expelT = (animTime * 0.45) % 1.0;
        if (expelT < 0.45) {
          const u = expelT / 0.45;
          bolusGroup.visible = st.layers.airway;
          bolusGroup.position.set(0, THREE.MathUtils.lerp(0.45, 0.88, u), 0.025 + u * 0.14);
          bolusMat.color.setHex(0x38e8df);
          bolusMat.emissive.setHex(0x13b8b0);
          bolusMat.opacity = 1 - u * 0.9;
          bolusGlowMat.opacity = (1 - u) * 0.65;
        } else {
          bolusGroup.visible = false;
        }
      } else if (st.pose === 'effective_cough') {
        bolusGroup.visible = st.layers.airway;
        bolusGroup.scale.setScalar(0.68);
        bolusGroup.position.set(0.012, 0.45 + coughBeat * 0.035, 0.025);
        bolusMat.color.setHex(0xf59e0b);
        bolusMat.emissive.setHex(0xd97706);
        bolusMat.opacity = 0.88;
        bolusGlowMat.opacity = 0.48;
      } else {
        bolusGroup.visible = st.layers.airway;
        bolusGroup.scale.setScalar(1.06);
        const joltY =
          st.pose === 'back_blows_5' ||
          (st.pose === 'abdominal_thrusts_5' && !unsafeAbdominal) ||
          st.pose === 'chest_thrusts_special'
            ? maneuverBeat * 0.048
            : 0;
        bolusGroup.position.set(0, 0.45 + joltY, 0.025);
        bolusMat.color.setHex(0xff354a);
        bolusMat.emissive.setHex(0xff1430);
        bolusMat.opacity = 0.96;
        bolusGlowMat.opacity = 0.68 + 0.2 * Math.sin(animTime * 5.0);
      }

      // 6. Airflow Particles Physics (Crystal-Clear Visual Feedback!)
      const afAttr = airflowGeo.getAttribute('position') as THREE.BufferAttribute;
      const paths = bronchialParts.airflowPaths;
      if (st.pose === 'severe_silent_choking' || unsafeAbdominal) {
        // Blocked airway: particles stall & bounce above the larynx bolus!
        airflowMat.color.setHex(0xff6b78);
        airflowMat.opacity = st.layers.airway ? 0.72 : 0;
        for (let i = 0; i < airflowCount; i++) {
          const p = (i / airflowCount + animTime * 0.35) % 1;
          const y = 0.49 + Math.abs(Math.sin(p * Math.PI)) * 0.20;
          const x = Math.sin(i * 2.1 + animTime * 3.0) * 0.024;
          const z = 0.025 + Math.cos(i * 1.7) * 0.022;
          afAttr.setXYZ(i, x, y, z);
        }
      } else if (
        st.pose === 'back_blows_5' ||
        st.pose === 'abdominal_thrusts_5' ||
        st.pose === 'chest_thrusts_special'
      ) {
        // Upward pressure surge from lungs toward the bolus!
        airflowMat.color.setHex(0x4bf6e8);
        airflowMat.opacity = st.layers.airway ? 0.88 : 0;
        for (let i = 0; i < airflowCount; i++) {
          const path = paths[i % paths.length];
          const u = 1.0 - ((i / airflowCount + animTime * 0.42) % 1);
          path.getPointAt(THREE.MathUtils.clamp(u, 0.02, 0.98), _afPt);
          afAttr.setXYZ(i, _afPt.x, _afPt.y, _afPt.z);
        }
      } else {
        // Effective cough (partial) or Recovered (full smooth bidirectional flow!)
        airflowMat.color.setHex(st.pose === 'object_expelled_recovery' ? 0x52f7c8 : 0x7ceeff);
        airflowMat.opacity = st.layers.airway ? 0.84 : 0;
        const speed = st.pose === 'object_expelled_recovery' ? 0.24 : 0.14;
        for (let i = 0; i < airflowCount; i++) {
          const path = paths[i % paths.length];
          const u = (i / airflowCount + animTime * speed) % 1;
          path.getPointAt(u, _afPt);
          afAttr.setXYZ(i, _afPt.x, _afPt.y, _afPt.z);
        }
      }
      afAttr.needsUpdate = true;

      // 7. Rescue Landmark Visuals
      backBlowVisual.group.visible = st.pose === 'back_blows_5';
      if (backBlowVisual.group.visible) {
        backBlowVisual.arrowGroup.position.z = -maneuverBeat * 0.055;
        const ps = 1 + maneuverBeat * 0.42;
        backBlowVisual.pulseRing.scale.set(ps, ps, 1);
      }

      abdominalJArrow.visible = st.pose === 'abdominal_thrusts_5' && !unsafeAbdominal;
      if (abdominalJArrow.visible) {
        abdominalJArrow.position.set(
          0,
          -0.27 + maneuverBeat * 0.055,
          0.20 - maneuverBeat * 0.045
        );
      }

      const showChestAdult = st.pose === 'chest_thrusts_special' && !cfg.isInfant;
      const showChestInfant = st.pose === 'chest_thrusts_special' && cfg.isInfant;
      chestThrustVisualAdult.group.visible = showChestAdult;
      chestThrustVisualInfant.group.visible = showChestInfant;
      if (showChestAdult) {
        chestThrustVisualAdult.arrowGroup.position.z = -maneuverBeat * 0.055;
        const ps = 1 + maneuverBeat * 0.42;
        chestThrustVisualAdult.pulseRing.scale.set(ps, ps, 1);
      }
      if (showChestInfant) {
        chestThrustVisualInfant.arrowGroup.position.z = -maneuverBeat * 0.048;
        const ps = 1 + maneuverBeat * 0.40;
        chestThrustVisualInfant.pulseRing.scale.set(ps, ps, 1);
      }

      unsafeShield.visible = unsafeAbdominal;
      if (unsafeShield.visible) {
        const s = 1 + 0.06 * Math.sin(animTime * 6.0);
        unsafeShield.scale.set(s, s, 1);
        unsafeShield.position.y = cfg.isInfant ? -0.31 : -0.37;
      }

      // 8. Highlight / Dimming & 3D Leader Callout
      const activeFocus = st.selectedOrgan || st.hoveredOrgan;
      const dimOthers = st.selectedOrgan !== null ? 0.35 : 1.0;

      const setUniforms = (
        mats: THREE.ShaderMaterial[],
        match: boolean,
        customDim?: number
      ) => {
        const hl = match ? 1.0 : 0.0;
        const dm = activeFocus && !match ? customDim ?? dimOthers : 1.0;
        mats.forEach((m) => {
          m.uniforms.uHighlight.value = THREE.MathUtils.damp(
            m.uniforms.uHighlight.value,
            hl,
            8,
            delta
          );
          m.uniforms.uDim.value = THREE.MathUtils.damp(
            m.uniforms.uDim.value,
            dm,
            8,
            delta
          );
        });
      };

      setUniforms([ribBackMat, ribFrontMat, cartilageMat, sternumMat, spineMat], activeFocus === 'ribcage_sternum');
      setUniforms([lungOuterMat, lungInnerMat], activeFocus === 'lungs');
      setUniforms(
        [tracheaMat, cartilageRingMat, mainBronchiMat, distalBronchiMat],
        activeFocus === 'trachea_bronchi' || activeFocus === 'airway_bolus'
      );
      setUniforms([diaphragmMat], activeFocus === 'diaphragm');

      // Breathing glow uniform
      const breathGlow =
        st.pose === 'severe_silent_choking' ? -0.6 : breathC * 2.0;
      [lungOuterMat, lungInnerMat, tracheaMat, cartilageRingMat, mainBronchiMat, distalBronchiMat].forEach(
        (m) => {
          m.uniforms.uBreath.value = breathGlow;
        }
      );

      // Torso MRI scan subtle sweep
      const scanCycle = (animTime * 0.14) % 1;
      const scanY = THREE.MathUtils.lerp(0.68, -0.48, scanCycle);
      const scanFade = Math.sin(scanCycle * Math.PI) * (reducedMotion ? 0 : 0.75);
      torsoMats.forEach((m) => {
        m.uniforms.uTime.value = animTime;
        m.uniforms.uScanY.value = scanY;
        m.uniforms.uScanStrength.value = scanFade;
      });

      // 3D Leader line for selected organ
      if (st.selectedOrgan) {
        const info = ORGAN_DATA[st.selectedOrgan];
        if (st.selectedOrgan === 'rescue_zone' && st.pose === 'back_blows_5') {
          _a.set(0, 0.25, -0.22);
          _c.set(-0.44, 0.34, -0.24);
        } else if (st.selectedOrgan === 'rescue_zone' && st.pose === 'chest_thrusts_special') {
          _a.set(0, 0.14, 0.24);
          _c.set(-0.44, 0.22, 0.22);
        } else {
          _a.set(...info.anchor);
          _c.set(...info.callout);
        }
        _mid.set((_a.x + _c.x) * 0.55, _c.y, (_a.z + _c.z) * 0.55);
        placeLeaderSeg(leaderSeg1, _a, _mid);
        placeLeaderSeg(leaderSeg2, _mid, _c);
        anchorDot.position.copy(_a);
        endDot.position.copy(_c);
        calloutGroup.visible = true;
      } else {
        calloutGroup.visible = false;
      }

      // Smooth spherical orbit camera preset / focus transitions (never passes through torso)
      const camLambda = isSoftwareGl ? 18 : 8.0;
      if (st.cameraGoalTarget) {
        controls.target.x = THREE.MathUtils.damp(controls.target.x, st.cameraGoalTarget.x, camLambda, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, st.cameraGoalTarget.y, camLambda, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, st.cameraGoalTarget.z, camLambda, delta);
      }
      if (st.cameraGoalPos) {
        const goalTgt = st.cameraGoalTarget || controls.target;
        _camCurOffset.copy(camera.position).sub(controls.target);
        _camGoalOffset.copy(st.cameraGoalPos).sub(goalTgt);
        _curSph.setFromVector3(_camCurOffset);
        _goalSph.setFromVector3(_camGoalOffset);

        const dTheta = Math.atan2(
          Math.sin(_goalSph.theta - _curSph.theta),
          Math.cos(_goalSph.theta - _curSph.theta)
        );
        _curSph.theta += dTheta * (1 - Math.exp(-camLambda * delta));
        _curSph.phi = THREE.MathUtils.damp(_curSph.phi, _goalSph.phi, camLambda, delta);
        _curSph.radius = THREE.MathUtils.damp(_curSph.radius, _goalSph.radius, camLambda, delta);

        _camCurOffset.setFromSpherical(_curSph);
        camera.position.copy(controls.target).add(_camCurOffset);

        if (camera.position.distanceTo(st.cameraGoalPos) < 0.02) {
          camera.position.copy(st.cameraGoalPos);
          if (st.cameraGoalTarget) controls.target.copy(st.cameraGoalTarget);
          st.cameraGoalPos = null;
          st.cameraGoalTarget = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (!isInViewport || isTabHidden) {
        isLoopPaused = true;
        return;
      }
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    const resumeIfActive = () => {
      if (isInViewport && !isTabHidden && isLoopPaused && !isDisposed) {
        isLoopPaused = false;
        clock.getDelta();
        tick();
      }
    };

    const onVisibilityChange = () => {
      isTabHidden = document.hidden;
      if (!isTabHidden) resumeIfActive();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              const vis = entries.some((e) => e.isIntersecting);
              isInViewport = vis;
              if (vis) resumeIfActive();
            },
            { threshold: 0.02 }
          )
        : null;
    io?.observe(container);

    tick();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      ro.disconnect();
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      controls.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [handleSelectOrgan]);

  // Status banner text (never color-only: explicit icon + concise text)
  const getLiveStatus = () => {
    if (isUnsafeCombo) {
      return {
        tone: 'danger' as const,
        label: isAr
          ? 'مناورة ممنوعة لهذه الفئة · خطر إصابة داخلية'
          : 'Contraindicated for this age/profile · Internal injury risk',
      };
    }
    switch (pose) {
      case 'effective_cough':
        return {
          tone: 'warn' as const,
          label: isAr
            ? 'انسداد جزئي · الهواء يمر — شجّع السعال فقط'
            : 'Partial Flow · Air Passing — Encourage Coughing',
        };
      case 'severe_silent_choking':
        return {
          tone: 'danger' as const,
          label: isAr
            ? 'انسداد كامل · توقف تدفق الهواء للرئتين'
            : 'Complete Blockage · Zero Airflow to Lungs',
        };
      case 'back_blows_5':
        return {
          tone: 'active' as const,
          label: isAr
            ? victim === 'nelly_infant'
              ? '٥ ضربات ظهرية · الرضيعة على البطن والرأس لأسفل'
              : '٥ ضربات ظهرية · بين لوحي الكتف مع الإمالة للأمام'
            : victim === 'nelly_infant'
            ? '5 Back Blows · Prone Head-Lower-Than-Chest'
            : '5 Back Blows · Interscapular Target, Leaning Forward',
        };
      case 'abdominal_thrusts_5':
        return {
          tone: 'active' as const,
          label: isAr
            ? '٥ ضغطات بطنية · فوق السرة للداخل وللأعلى (رفع الحجاب الحاجز)'
            : '5 Abdominal Thrusts · Epigastric J-Stroke Elevating Diaphragm',
        };
      case 'chest_thrusts_special':
        return {
          tone: 'active' as const,
          label: isAr
            ? victim === 'nelly_infant'
              ? '٥ ضغطات صدرية بإصبعين · منتصف عظمة القص (آمن للرضيع)'
              : '٥ ضغطات صدرية · منتصف عظمة القص (حماية كاملة للبطن)'
            : victim === 'nelly_infant'
            ? '5 Two-Finger Chest Thrusts · Lower Sternum (Infant Safe)'
            : '5 Sternal Chest Thrusts · Mid-Sternum (Abdomen Protected)',
        };
      case 'object_expelled_recovery':
        return {
          tone: 'safe' as const,
          label: isAr
            ? 'تم فتح مجرى الهواء · عودة التدفق الكامل والتنفس'
            : 'Airway Cleared · Full Airflow & Breathing Restored',
        };
      default:
        return {
          tone: 'active' as const,
          label: isAr ? 'معاينة تشريحية تفاعلية' : 'Interactive Anatomical View',
        };
    }
  };

  const liveStatus = getLiveStatus();
  const selectedInfo = selectedOrgan ? ORGAN_DATA[selectedOrgan] : null;

  return (
    <div
      data-testid="about-anatomical-explorer-3d"
      className="relative w-full h-full select-none overflow-hidden bg-[#061A28]"
      style={{
        background:
          'radial-gradient(ellipse at 50% 44%, #0B2D42 0%, #071E2E 58%, #04131E 100%)',
      }}
    >
      {/* Dedicated WebGL Mount Container */}
      {webglUnavailable ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2 text-[#A9C0CC]">
          <AlertTriangle className="w-8 h-8 text-[#43C7D1]" />
          <div className="text-sm font-bold text-[#F3F7F8]">
            {isAr
              ? 'العرض ثلاثي الأبعاد غير متاح في هذا المتصفح'
              : '3D WebGL view is unavailable in this browser'}
          </div>
        </div>
      ) : (
        <div
          ref={mountRef}
          data-testid="about-3d-canvas-mount"
          className="w-full h-full"
        />
      )}

      {/* Top Live Clinical Status Strip (Solid dark rgba surface, zero backdrop-blur over WebGL) */}
      <div className="pointer-events-none absolute top-3 inset-x-3 z-20 flex flex-wrap items-center justify-between gap-2">
        <div
          data-testid="about-3d-status-banner"
          className={`pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold shadow-md ${
            liveStatus.tone === 'danger'
              ? 'bg-[#2B1018]/95 border-[#DC5252] text-[#FFD4D8]'
              : liveStatus.tone === 'safe'
              ? 'bg-[#092820]/95 border-[#16A36A] text-[#B9F6D8]'
              : liveStatus.tone === 'warn'
              ? 'bg-[#2B200B]/95 border-[#EAB308]/80 text-[#FDE68A]'
              : 'bg-[#072133]/95 border-[#2A627A] text-[#DDF6FA]'
          }`}
        >
          {liveStatus.tone === 'danger' ? (
            <ShieldAlert className="w-3.5 h-3.5 text-[#FF6B78] shrink-0" />
          ) : liveStatus.tone === 'safe' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
          ) : (
            <Wind className="w-3.5 h-3.5 text-[#43C7D1] shrink-0" />
          )}
          <span>{liveStatus.label}</span>
        </div>

        {/* Unsafe Maneuver 1-Click Safe Switcher Right Inside Viewport */}
        {isUnsafeCombo && onSelectPose && (
          <button
            type="button"
            data-testid="about-3d-switch-safe-btn"
            onClick={() => onSelectPose('chest_thrusts_special')}
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] text-xs font-extrabold shadow-md transition-colors cursor-pointer whitespace-nowrap"
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isAr ? 'اعرض البديل الآمن: الضغطات الصدرية' : 'Switch to Safe Chest Thrusts'}
            </span>
          </button>
        )}
      </div>

      {/* Unified Compact Bottom Dock (Unobstructed Center Viewport) */}
      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex flex-col items-center gap-2">
        {/* Educational Organ Card when an organ is clicked */}
        {selectedInfo && (
          <div
            data-testid="about-3d-organ-card"
            className="pointer-events-auto w-full max-w-lg rounded-xl bg-[#072030]/96 border border-[#2A627A] px-3.5 py-2.5 shadow-xl text-start"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-extrabold text-[#F3F7F8]">
                  {selectedInfo.label[language]}{' '}
                  <span className="font-semibold text-[#43C7D1]">
                    · {selectedInfo.role[language]}
                  </span>
                </div>
                <p className="text-[11.5px] text-[#C6DCE6] leading-relaxed mt-1">
                  {selectedInfo.description(victim, pose)[language]}
                </p>
              </div>
              <button
                type="button"
                data-testid="about-3d-organ-close"
                onClick={() => handleSelectOrgan(null)}
                aria-label={isAr ? 'إغلاق البطاقة' : 'Close card'}
                className="p-1 rounded-lg text-[#9CB8C6] hover:text-white hover:bg-[#123B50] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Expandable Organs & Layers Drawer */}
        {drawerOpen && (
          <div
            data-testid="about-3d-drawer"
            className="pointer-events-auto w-full max-w-xl rounded-xl bg-[#072030]/96 border border-[#1E4B63] p-2.5 shadow-xl space-y-2"
          >
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {ORGAN_ORDER.map((id) => {
                const active = selectedOrgan === id;
                return (
                  <button
                    key={id}
                    type="button"
                    data-testid={`about-3d-organ-btn-${id}`}
                    onClick={() => handleSelectOrgan(active ? null : id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[#13B8B0] border-[#43C7D1] text-[#061D2B]'
                        : 'bg-[#0C2D42] border-[#1E4A60] text-[#D4E8F2] hover:border-[#43C7D1]'
                    }`}
                  >
                    {ORGAN_DATA[id].label[language]}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1.5 border-t border-[#184156]">
              {(
                [
                  { key: 'body', ar: 'الجسم', en: 'Body' },
                  { key: 'ribcage', ar: 'القفص الصدري', en: 'Rib Cage' },
                  { key: 'lungs', ar: 'الرئتان', en: 'Lungs' },
                  { key: 'airway', ar: 'القصبة والشعب', en: 'Airway' },
                ] as { key: keyof ExplorerLayerVisibility; ar: string; en: string }[]
              ).map((item) => {
                const on = layers[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    data-testid={`about-3d-layer-${item.key}`}
                    onClick={() => toggleLayer(item.key)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                      on
                        ? 'bg-[#113A4F] border-[#2C6880] text-[#E6F6FA]'
                        : 'bg-[#081F2E] border-[#18384A] text-[#6F90A1]'
                    }`}
                  >
                    {on ? (
                      <Eye className="w-3 h-3 text-[#43C7D1]" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-[#6F90A1]" />
                    )}
                    <span>{isAr ? item.ar : item.en}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Primary Sleek Horizontal Control Dock */}
        <div
          data-testid="about-3d-control-dock"
          className="pointer-events-auto inline-flex flex-wrap items-center justify-center gap-1 px-2 py-1 rounded-xl bg-[#072030]/96 border border-[#1E4B63] shadow-lg"
        >
          {/* Camera View Angle Presets */}
          {(
            [
              { id: 'front', ar: 'أمامي', en: 'Front' },
              { id: 'side', ar: 'جانبي', en: 'Side' },
              { id: 'back', ar: 'خلفي', en: 'Back' },
            ] as { id: CameraPreset; ar: string; en: string }[]
          ).map((vp) => (
            <button
              key={vp.id}
              type="button"
              data-testid={`about-3d-view-${vp.id}`}
              onClick={() => handlePresetClick(vp.id)}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activePreset === vp.id && !selectedOrgan
                  ? 'bg-[#13B8B0] text-[#061D2B]'
                  : 'text-[#B9D3E0] hover:text-white hover:bg-[#123B50]'
              }`}
            >
              {isAr ? vp.ar : vp.en}
            </button>
          ))}

          <span className="w-px h-4 bg-[#204C62] mx-0.5" aria-hidden="true" />

          <button
            type="button"
            data-testid="about-3d-zoom-in"
            onClick={() => cmdRef.current?.zoomBy(0.84)}
            title={isAr ? 'تكبير' : 'Zoom in'}
            aria-label={isAr ? 'تكبير النموذج' : 'Zoom in'}
            className="p-1.5 rounded-lg text-[#B9D3E0] hover:text-white hover:bg-[#123B50] transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            data-testid="about-3d-zoom-out"
            onClick={() => cmdRef.current?.zoomBy(1.18)}
            title={isAr ? 'تصغير' : 'Zoom out'}
            aria-label={isAr ? 'تصغير النموذج' : 'Zoom out'}
            className="p-1.5 rounded-lg text-[#B9D3E0] hover:text-white hover:bg-[#123B50] transition-colors cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            data-testid="about-3d-reset"
            onClick={() => handleSelectOrgan(null)}
            title={isAr ? 'إعادة ضبط العرض' : 'Reset view'}
            aria-label={isAr ? 'إعادة ضبط العرض' : 'Reset view'}
            className="p-1.5 rounded-lg text-[#B9D3E0] hover:text-white hover:bg-[#123B50] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            data-testid="about-3d-play-toggle"
            onClick={() =>
              setIsPlaying((v) => {
                const next = !v;
                stateRef.current.isPlaying = next;
                return next;
              })
            }
            title={
              isPlaying
                ? isAr
                  ? 'إيقاف الحركة'
                  : 'Pause animation'
                : isAr
                ? 'تشغيل الحركة'
                : 'Play animation'
            }
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="p-1.5 rounded-lg text-[#B9D3E0] hover:text-white hover:bg-[#123B50] transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-[#43C7D1]" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
          </button>

          <span className="w-px h-4 bg-[#204C62] mx-0.5" aria-hidden="true" />

          <button
            type="button"
            data-testid="about-3d-drawer-btn"
            onClick={() => setDrawerOpen((v) => !v)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold text-[#DCECF3] hover:text-white hover:bg-[#123B50] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>{isAr ? 'الأعضاء والطبقات' : 'Organs & Layers'}</span>
            {drawerOpen ? (
              <ChevronDown className="w-3 h-3 text-[#43C7D1]" />
            ) : (
              <ChevronUp className="w-3 h-3 text-[#43C7D1]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
