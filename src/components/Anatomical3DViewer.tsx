import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  AssessSignHotspot,
  Language,
  MicroInteractionType,
  ObstructionObjectType,
  RigPoseId,
  VictimCharacterId,
} from '../types/nafas';
import {
  Box,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  Hand,
  Info,
  Layers,
  Move3d,
  RotateCcw,
  RotateCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  X,
  Zap,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { clinicalAudio } from '../utils/clinicalAudio';

export type AnatomicalRegionId =
  | 'larynx_airway'
  | 'trachea_rings'
  | 'foreign_body'
  | 'lungs_bronchi'
  | 'diaphragm_dome'
  | 'ribcage_sternum'
  | 'landmark_back_blows'
  | 'landmark_abdominal_thrust'
  | 'landmark_sternal_thrust'
  | 'hazard_zone';

export interface AnatomicalRegionInfo {
  id: AnatomicalRegionId;
  title: { en: string; ar: string };
  category: 'airway' | 'thorax' | 'landmark' | 'hazard';
  summary: { en: string; ar: string };
  clinicalProtocol: { en: string; ar: string };
  focusTarget: [number, number, number];
  cameraOffset: [number, number, number];
}

export const ANATOMICAL_REGIONS: Record<AnatomicalRegionId, AnatomicalRegionInfo> = {
  larynx_airway: {
    id: 'larynx_airway',
    title: {
      en: 'Upper Airway, Pharynx & Larynx',
      ar: 'مجرى الهواء العلوي والبلعوم والحنجرة',
    },
    category: 'airway',
    summary: {
      en: 'The narrowest upper respiratory entry point in adults. Complete obstruction here blocks airflow to both lungs and prevents speech or coughing.',
      ar: 'أضيق مدخل تنفسي علوي لدى البالغين. الانسداد الكامل هنا يمنع مرور الهواء للرئتين ويمنع القدرة على الكلام أو السعال.',
    },
    clinicalProtocol: {
      en: 'Assess immediately: if the patient clutches their neck silently (Universal Choking Sign), begin 5 back blows and 5 thrusts.',
      ar: 'قيّم فوراً: إذا أمسك المصاب رقبته بصمت (علامة الاختناق العالمية)، ابدأ بـ ٥ ضربات ظهرية و٥ ضغطات إسعافية.',
    },
    focusTarget: [0, 1.32, 0.08],
    cameraOffset: [0.45, 1.42, 1.35],
  },
  trachea_rings: {
    id: 'trachea_rings',
    title: {
      en: 'Cartilaginous Trachea & Carina',
      ar: 'القصبة الهوائية والحلقات الغضروفية',
    },
    category: 'airway',
    summary: {
      en: 'Supported by C-shaped hyaline cartilage rings conducting air from the larynx down to the left and right mainstem bronchi.',
      ar: 'مدعومة بحلقات غضروفية على شكل حرف C تنقل الهواء من الحنجرة إلى الشعبتين الهوائيتين اليمنى واليسرى.',
    },
    clinicalProtocol: {
      en: 'In infants and children, tracheal diameter is narrow and pliable—never hyperextend the neck or perform blind finger sweeps.',
      ar: 'في الرضع والأطفال يكون قطر القصبة الهوائية ضيقاً ومرناً—يُمنع فرط تمديد الرقبة أو المسح العشوائي بالإصبع.',
    },
    focusTarget: [0, 1.15, 0.06],
    cameraOffset: [0.55, 1.25, 1.45],
  },
  foreign_body: {
    id: 'foreign_body',
    title: {
      en: 'Lodged Foreign Body (Airway Bolus)',
      ar: 'الجسم الغريب العالق بمجرى التنفس',
    },
    category: 'airway',
    summary: {
      en: 'Impacted food bolus or small object blocking tracheal ventilation. Requires an artificial intrathoracic pressure surge to expel.',
      ar: 'كتلة طعام أو جسم صغير يسد التهوية عبر القصبة الهوائية. يتطلب توليد موجة ضغط هوائي مرتدة من داخل الصدر لطرده.',
    },
    clinicalProtocol: {
      en: 'Never give water or pat the back during an effective cough; for complete obstruction, use back blows + age-specific thrusts.',
      ar: 'يُمنع إعطاء الماء؛ وفي الانسداد الكامل تُطبّق الضربات الظهرية والضغطات المناسبة للعمر لدفع الجسم للخارج.',
    },
    focusTarget: [0, 1.24, 0.08],
    cameraOffset: [0.38, 1.32, 1.2],
  },
  lungs_bronchi: {
    id: 'lungs_bronchi',
    title: {
      en: 'Bilateral Lungs & Residual Air Reservoir',
      ar: 'الرئتان ومخزون الهواء المتبقي',
    },
    category: 'thorax',
    summary: {
      en: 'Even during complete choking, the lungs retain residual air volume (FRC). Rescue thrusts compress this reservoir to blast the obstruction outward.',
      ar: 'حتى أثناء الاختناق الكامل تحتفظ الرئتان بحجم هواء متبقٍّ. تعمل الضغطات الإسعافية على ضغط هذا المخزون لدفع الجسم العالق للخارج.',
    },
    clinicalProtocol: {
      en: 'Monitor SpO₂ saturation: prolonged obstruction rapidly depletes alveolar oxygen reserves toward hypoxia.',
      ar: 'راقب تشبع الأكسجين SpO₂: استمرار الانسداد يستنزف مخزون الأكسجين الرئوي سريعاً.',
    },
    focusTarget: [0, 0.92, 0.04],
    cameraOffset: [0.7, 1.08, 1.85],
  },
  diaphragm_dome: {
    id: 'diaphragm_dome',
    title: {
      en: 'Thoracic Diaphragm Dome',
      ar: 'عضلة الحجاب الحاجز',
    },
    category: 'thorax',
    summary: {
      en: 'The muscular dome separating the abdominal cavity from the thorax. Inward-and-upward abdominal thrusts elevate the diaphragm like a piston.',
      ar: 'القبة العضلية الفاصلة بين البطن والصدر. الضغطات البطنية للداخل وللأعلى ترفع الحجاب الحاجز كالمكبس لضغط الهواء داخل الرئتين.',
    },
    clinicalProtocol: {
      en: 'Deliver each abdominal thrust with a distinct inward and upward J-motion to maximize diaphragmatic elevation.',
      ar: 'نفّذ كل ضغطة بطنية بحركة منفصلة للداخل وللأعلى (حرف J) لتحقيق أقصى رفع للحجاب الحاجز.',
    },
    focusTarget: [0, 0.68, 0.08],
    cameraOffset: [0.65, 0.85, 1.8],
  },
  ribcage_sternum: {
    id: 'ribcage_sternum',
    title: {
      en: 'Thoracic Ribcage, Sternum & Xiphoid',
      ar: 'القفص الصدري وعظمة القص والناتئ الخنجري',
    },
    category: 'thorax',
    summary: {
      en: 'Protects the heart and lungs. The mid-sternum is the target for chest thrusts in pregnancy, infants, and CPR compressions.',
      ar: 'يحمي القلب والرئتين. منتصف عظمة القص هو المعلم التشريحي للضغطات الصدرية في الحمل والرضع والإنعاش القلبي الرئوي.',
    },
    clinicalProtocol: {
      en: 'Keep abdominal thrusts strictly below the lower tip of the sternum (xiphoid process) to prevent fracture or internal injury.',
      ar: 'اجعل ضغطات البطن أسفل الطرف السفلي لعظمة القص (الناتئ الخنجري) لتجنب الكسور أو الإصابات الداخلية.',
    },
    focusTarget: [0, 0.95, 0.14],
    cameraOffset: [0.55, 1.05, 1.75],
  },
  landmark_back_blows: {
    id: 'landmark_back_blows',
    title: {
      en: 'Interscapular Back-Blow Zone (5 Blows)',
      ar: 'منطقة بين لوحي الكتف (٥ ضربات ظهرية)',
    },
    category: 'landmark',
    summary: {
      en: 'Midline between the shoulder blades. Firm blows with the heel of the hand generate a sharp vibration and pressure spike in the posterior trachea.',
      ar: 'خط المنتصف بين لوحي الكتف. الضربات الحازمة بكعب اليد تولّد اهتزازاً وموجة ضغط تساعد على تحرير الجسم الغريب.',
    },
    clinicalProtocol: {
      en: 'Lean adults/children forward; support infants prone on your forearm with head lower than chest (-15°) while supporting the jaw.',
      ar: 'أمل البالغ أو الطفل للأمام؛ وأسند الرضيع على ساعدك ورأسه أخفض من صدره (-15°) مع تثبيت الفك.',
    },
    focusTarget: [0, 1.0, -0.18],
    cameraOffset: [-0.45, 1.15, -1.85],
  },
  landmark_abdominal_thrust: {
    id: 'landmark_abdominal_thrust',
    title: {
      en: 'Epigastric Abdominal Thrust Landmark (J-Stroke)',
      ar: 'معلم ضغطات البطن فوق السرة (دفعة J)',
    },
    category: 'landmark',
    summary: {
      en: 'Midline of the abdomen just above the navel and well below the xiphoid process. Used for responsive adults and children over 1 year.',
      ar: 'خط منتصف البطن فوق السرة مباشرة وأسفل الناتئ الخنجري. يُستخدم للبالغين والأطفال أكبر من سنة.',
    },
    clinicalProtocol: {
      en: 'Place thumb-side of fist against the epigastrium, grasp with the other hand, and deliver 5 distinct inward-and-upward thrusts.',
      ar: 'ضع جانب الإبهام من قبضتك فوق السرة، أمسكها باليد الأخرى، ونفّذ ٥ ضغطات منفصلة للداخل وللأعلى.',
    },
    focusTarget: [0, 0.52, 0.22],
    cameraOffset: [0.35, 0.72, 1.7],
  },
  landmark_sternal_thrust: {
    id: 'landmark_sternal_thrust',
    title: {
      en: 'Sternal Chest-Thrust Landmark (Pregnancy / Infant / CPR)',
      ar: 'معلم الضغطات الصدرية بمنتصف القص (الحمل / الرضع / CPR)',
    },
    category: 'landmark',
    summary: {
      en: 'Center of the sternum. Used instead of abdominal thrusts for late-stage pregnant patients, infants (2 fingers below nipple line), and unresponsive CPR.',
      ar: 'منتصف عظمة القص. يُستخدم بدلاً من ضغط البطن للحوامل في المراحل المتقدمة، وللرضع (بإصبعين أسفل خط الحلمتين)، وعند فقدان الوعي.',
    },
    clinicalProtocol: {
      en: 'Compress straight inward on the sternum to pressurize the thoracic cavity directly without compressing the abdomen.',
      ar: 'اضغط بشكل مستقيم على منتصف عظمة القص لرفع الضغط داخل الصدر مباشرة دون الضغط على البطن.',
    },
    focusTarget: [0, 0.92, 0.21],
    cameraOffset: [0.3, 1.05, 1.65],
  },
  hazard_zone: {
    id: 'hazard_zone',
    title: {
      en: 'Contraindicated Anatomical Hazard Zone',
      ar: 'منطقة محظورة طبياً (خطر إصابة تشريحية)',
    },
    category: 'hazard',
    summary: {
      en: 'In infants (<1 year) and late pregnancy, abdominal compression is strictly contraindicated due to high risk of liver rupture or uterine trauma.',
      ar: 'في الرضع (أقل من سنة) والحمل المتقدم يُمنع منعاً باتاً الضغط على البطن بسبب خطر إصابة الكبد أو الرحم.',
    },
    clinicalProtocol: {
      en: 'Always switch to sternal chest thrusts for pregnant patients and two-finger lower-sternal chest thrusts for infants.',
      ar: 'انتقل دائماً إلى الضغطات الصدرية في منتصف القص للحوامل، والضغطات الصدرية بإصبعين للرضع.',
    },
    focusTarget: [0, 0.48, 0.28],
    cameraOffset: [0.5, 0.68, 1.85],
  },
};

export interface Anatomical3DViewerProps {
  victim: VictimCharacterId;
  obstruction: ObstructionObjectType;
  pose: RigPoseId;
  spo2: number;
  heartRate: number;
  language: Language;
  showInteractiveToolbar?: boolean;
  heroMode?: boolean;
  /** Play ~2.5s wireframe-to-solid teal scan intro once per visit (skipped in reduced-motion) */
  heroIntroEnabled?: boolean;
  /** Highlight a specific 3D organ when hovering hero callouts */
  highlightedOrgan?: 'throat' | 'lungs' | 'heart' | null;
  /** Subtle ~12s hero preview toggle: amber throat dot & paused airflow for 2s */
  airwayBlockedPreview?: boolean;
  /** Callback fired when hero scan-line intro completes */
  onHeroIntroComplete?: () => void;
  assessMode?: boolean;
  hotspots?: AssessSignHotspot[];
  inspectedHotspotIds?: string[];
  onInspectHotspot?: (hotspotId: string) => void;
  onSelectVictim?: (victim: VictimCharacterId) => void;
  onToggleViewMode?: () => void;
  microInteraction?: {
    active: boolean;
    type: MicroInteractionType;
    step: 'place_hands' | 'tap_rhythm' | 'completed';
    tapsCompleted: number;
    tapsRequired: number;
    onPlaceHands: (accurate: boolean) => void;
    onTapRhythm: () => void;
    onSkipMicro: () => void;
  };
}

type CameraPresetId = 'anterior' | 'lateral' | 'dorsal' | 'airway';

// Pre-allocated scratch math helpers outside the animation loop (Zero GC)
const _scratchVec3 = new THREE.Vector3();
const _scratchTargetVec3 = new THREE.Vector3();
const _scratchColor = new THREE.Color();

export const Anatomical3DViewer: React.FC<Anatomical3DViewerProps> = ({
  victim,
  pose,
  spo2,
  heartRate,
  language,
  showInteractiveToolbar = true,
  heroMode = false,
  heroIntroEnabled = false,
  highlightedOrgan = null,
  airwayBlockedPreview = false,
  onHeroIntroComplete,
  assessMode = false,
  hotspots = [],
  inspectedHotspotIds = [],
  onInspectHotspot,
  onSelectVictim,
  onToggleViewMode,
  microInteraction,
}) => {
  const isAr = language === 'ar';
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Layer Visibility States
  const [layers, setLayers] = useState({
    bodyShell: true,
    airwayBolus: true,
    lungsRibcage: true,
    rescueLandmarks: !heroMode,
  });

  // Active selected anatomical region for educational inspection drawer
  const [selectedRegionId, setSelectedRegionId] =
    useState<AnatomicalRegionId | null>(null);
  const [activePreset, setActivePreset] = useState<CameraPresetId>('anterior');
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [thrustImpulseCounter, setThrustImpulseCounter] = useState(0);

  // Mutable simulation ref read inside the Three.js animation loop without re-creating WebGL context
  const simStateRef = useRef({
    victim,
    pose,
    spo2,
    heartRate,
    layers,
    selectedRegionId,
    highlightedOrgan,
    airwayBlockedPreview,
    heroIntroEnabled,
    onHeroIntroComplete,
    thrustImpulseTime: 0,
    tapsCompleted: microInteraction?.tapsCompleted ?? 0,
    cameraGoalPos: null as THREE.Vector3 | null,
    cameraGoalTarget: null as THREE.Vector3 | null,
  });

  useEffect(() => {
    simStateRef.current.victim = victim;
    simStateRef.current.pose = pose;
    simStateRef.current.spo2 = spo2;
    simStateRef.current.heartRate = heartRate;
    simStateRef.current.layers = layers;
    simStateRef.current.selectedRegionId = selectedRegionId;
    simStateRef.current.highlightedOrgan = highlightedOrgan;
    simStateRef.current.airwayBlockedPreview = airwayBlockedPreview;
    simStateRef.current.heroIntroEnabled = heroIntroEnabled;
    simStateRef.current.onHeroIntroComplete = onHeroIntroComplete;
    simStateRef.current.tapsCompleted = microInteraction?.tapsCompleted ?? 0;
  }, [
    victim,
    pose,
    spo2,
    heartRate,
    layers,
    selectedRegionId,
    highlightedOrgan,
    airwayBlockedPreview,
    heroIntroEnabled,
    onHeroIntroComplete,
    microInteraction?.tapsCompleted,
  ]);

  // Ref callbacks for raycasting inside WebGL canvas
  const callbacksRef = useRef({
    onInspectHotspot,
    microInteraction,
    assessMode,
    hotspots,
  });
  useEffect(() => {
    callbacksRef.current = {
      onInspectHotspot,
      microInteraction,
      assessMode,
      hotspots,
    };
  }, [onInspectHotspot, microInteraction, assessMode, hotspots]);

  // Camera manipulation commands exposed via ref
  const cameraCommandRef = useRef<{
    setPreset: (preset: CameraPresetId) => void;
    orbitBy: (deltaAzimuth: number, deltaPolar: number) => void;
    zoomBy: (factor: number) => void;
    focusPoint: (target: [number, number, number], camPos: [number, number, number]) => void;
    triggerThrustPulse: () => void;
    rebuildModel: (newVictim: VictimCharacterId) => void;
  } | null>(null);

  // Trigger thrust animation whenever tapsCompleted increments
  useEffect(() => {
    if ((microInteraction?.tapsCompleted ?? 0) > 0) {
      cameraCommandRef.current?.triggerThrustPulse();
    }
  }, [microInteraction?.tapsCompleted]);

  // Rebuild 3D rig when victim age category changes
  useEffect(() => {
    cameraCommandRef.current?.rebuildModel(victim);
  }, [victim]);

  // Auto-orient camera when pose is back_blows_5 so user clearly sees interscapular action
  useEffect(() => {
    if (pose === 'back_blows_5') {
      cameraCommandRef.current?.setPreset('dorsal');
      setActivePreset('dorsal');
    } else if (
      pose === 'abdominal_thrusts_5' ||
      pose === 'chest_thrusts_special' ||
      pose === 'cpr_compressions_30_2'
    ) {
      cameraCommandRef.current?.setPreset('lateral');
      setActivePreset('lateral');
    }
  }, [pose]);

  const handleSelectRegion = useCallback(
    (regionId: AnatomicalRegionId) => {
      clinicalAudio.playInspectPing();
      setSelectedRegionId(regionId);
      const info = ANATOMICAL_REGIONS[regionId];
      if (info && cameraCommandRef.current && !heroMode) {
        cameraCommandRef.current.focusPoint(
          info.focusTarget,
          info.cameraOffset
        );
      }
    },
    [heroMode]
  );

  const handleDeliver3DImpulse = useCallback(
    (regionId?: AnatomicalRegionId) => {
      setThrustImpulseCounter((c) => c + 1);
      cameraCommandRef.current?.triggerThrustPulse();

      const mi = callbacksRef.current.microInteraction;
      if (mi && mi.active && mi.step !== 'completed') {
        if (mi.step === 'place_hands') {
          const isHazardClick =
            regionId === 'hazard_zone' ||
            (mi.type === 'infant_5_5' &&
              regionId === 'landmark_abdominal_thrust') ||
            (mi.type === 'chest_thrusts_5' &&
              regionId === 'landmark_abdominal_thrust');
          mi.onPlaceHands(!isHazardClick);
        } else if (mi.step === 'tap_rhythm') {
          mi.onTapRhythm();
        }
        return;
      }
      clinicalAudio.playThrustPulse();
    },
    []
  );

  // =========================================================================
  // INITIALIZE THREE.JS WEBGL SCENE, PBR STUDIO LIGHTING & PROCEDURAL 3D RIGS
  // =========================================================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL per threejs skill guidelines
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 240);

    const scene = new THREE.Scene();
    if (!heroMode) {
      scene.background = new THREE.Color(0x071f2e);
      scene.fog = new THREE.FogExp2(0x071f2e, 0.11);
    }

    const computeHeroCameraDist = (aspect: number) =>
      Math.max(2.04, 1.82 / Math.max(aspect, 0.55));

    const camera = new THREE.PerspectiveCamera(
      heroMode ? 34 : 40,
      width / height,
      0.1,
      50
    );
    if (heroMode) {
      const heroDist = computeHeroCameraDist(width / height);
      camera.position.set(0.0, 0.72, heroDist);
    } else {
      camera.position.set(0.35, 1.08, 2.55);
    }

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: heroMode,
      preserveDrawingBuffer: isSoftwareGl,
      powerPreference: 'high-performance',
    });
    if (heroMode) {
      renderer.setClearColor(0x000000, 0);
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = heroMode ? 1.25 : 1.15;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl && !heroMode;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Studio PBR Environment Reflection (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    pmremGenerator.dispose();

    // 3. 3-Point Warm/Cool Studio Medical Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x8be9f5, 0x071f2e, 1.15);
    hemiLight.position.set(0, 4, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e4, 2.1);
    keyLight.position.set(2.4, 3.6, 2.8);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 10;
      const d = 1.8;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x13b8b0, 1.65);
    rimLight.position.set(-2.2, 2.0, -2.4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x43c7d1, 0.85);
    fillLight.position.set(-1.8, 1.2, 2.0);
    scene.add(fillLight);

    // 4. Grounded Clinical Telemetry Platform & Radial Contact Shadow
    const platformGroup = new THREE.Group();
    platformGroup.visible = !heroMode;
    scene.add(platformGroup);

    const pedestalGeo = new THREE.CylinderGeometry(0.95, 1.05, 0.06, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0b2d40,
      roughness: 0.35,
      metalness: 0.65,
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.y = -0.03;
    pedestalMesh.receiveShadow = true;
    platformGroup.add(pedestalMesh);

    const ringGeo = new THREE.RingGeometry(0.86, 0.9, 64);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x13b8b0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = 0.003;
    platformGroup.add(ringMesh);

    // Procedural radial contact shadow texture
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 6, 64, 64, 62);
      grad.addColorStop(0, 'rgba(3, 12, 20, 0.78)');
      grad.addColorStop(0.6, 'rgba(3, 12, 20, 0.32)');
      grad.addColorStop(1, 'rgba(3, 12, 20, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const contactShadowGeo = new THREE.PlaneGeometry(1.5, 1.5);
    contactShadowGeo.rotateX(-Math.PI / 2);
    const contactShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.75,
    });
    const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
    contactShadow.position.y = 0.005;
    platformGroup.add(contactShadow);

    // 5. OrbitControls with Damping (Disabled pointer hijack in heroMode so buttons & scroll stay responsive)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.enableZoom = !heroMode;
    controls.enablePan = !heroMode;
    controls.enableRotate = !heroMode;
    controls.enabled = !heroMode;
    const initialHeroDist = computeHeroCameraDist(width / height);
    controls.minDistance = heroMode ? initialHeroDist : 0.85;
    controls.maxDistance = heroMode ? initialHeroDist : 4.6;
    controls.maxPolarAngle = heroMode ? Math.PI * 0.62 : Math.PI * 0.85;
    controls.minPolarAngle = heroMode ? Math.PI * 0.36 : 0.15;
    controls.target.set(0, heroMode ? 0.72 : 0.92, 0);

    // Cancel scripted camera transition when user grabs OrbitControls
    controls.addEventListener('start', () => {
      simStateRef.current.cameraGoalPos = null;
      simStateRef.current.cameraGoalTarget = null;
    });

    // 6. Hierarchical Anatomical Model Container & Animated Node References
    const patientRoot = new THREE.Group();
    scene.add(patientRoot);

    let clickableMeshes: THREE.Object3D[] = [];
    let bodyShellGroup = new THREE.Group();
    let airwayBolusGroup = new THREE.Group();
    let lungsRibcageGroup = new THREE.Group();
    let landmarksGroup = new THREE.Group();

    let animatedParts: {
      torsoPivot?: THREE.Group;
      headGroup?: THREE.Group;
      leftLung?: THREE.Mesh;
      rightLung?: THREE.Mesh;
      heartMesh?: THREE.Mesh;
      throatIndicator?: THREE.Mesh;
      handsGroup?: THREE.Group;
      bronchioleMat?: THREE.MeshStandardMaterial;
      tracheaMat?: THREE.MeshStandardMaterial;
      handMat?: THREE.MeshPhysicalMaterial;
      diaphragm?: THREE.Mesh;
      bolusMesh?: THREE.Mesh;
      forceArrowGroup?: THREE.Group;
      epigastricTarget?: THREE.Mesh;
      sternalTarget?: THREE.Mesh;
      backBlowTarget?: THREE.Mesh;
      hazardTarget?: THREE.Mesh;
      bolusBaseY: number;
    } = { bolusBaseY: 1.22 };

    // Hero wireframe-to-solid scan reveal objects & living particles
    const solidClipPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.45);
    const wireClipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1.45);
    let heroWireGroup: THREE.Group | null = null;
    let heroScanRing: THREE.Mesh | null = null;
    let airflowPoints: THREE.Points | null = null;
    let airflowPhases: Float32Array | null = null;
    let airflowSides: Int8Array | null = null;
    let ambientPoints: THREE.Points | null = null;
    let ambientBasePositions: Float32Array | null = null;
    let particleSpriteTex: THREE.CanvasTexture | null = null;
    let solidHeroMaterials: THREE.Material[] = [];

    const initialReducedMotion =
      document.documentElement.classList.contains('reduced-motion') ||
      (typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    let introActive =
      heroMode && simStateRef.current.heroIntroEnabled && !initialReducedMotion;
    let introStartMs = performance.now();
    let introFinishedNotified = !introActive;
    if (introActive) {
      renderer.localClippingEnabled = true;
    }

    // Shared PBR Materials for Anatomical Layers
    const createShellMaterial = () =>
      new THREE.MeshPhysicalMaterial({
        color: heroMode ? 0x1e88e5 : 0x3b7a96,
        emissive: heroMode ? 0x08335e : 0x000000,
        emissiveIntensity: heroMode ? 0.38 : 0,
        roughness: 0.22,
        metalness: 0.08,
        transmission: isSoftwareGl ? 0 : 0.64,
        transparent: true,
        opacity: isSoftwareGl ? 0.38 : 0.78,
        ior: 1.42,
        thickness: 0.6,
        clearcoat: 0.85,
        clearcoatRoughness: 0.2,
        depthWrite: false,
      });

    const createLimbMaterial = () =>
      new THREE.MeshPhysicalMaterial({
        color: heroMode ? 0x1b78bf : 0x265870,
        emissive: heroMode ? 0x072c4d : 0x000000,
        emissiveIntensity: heroMode ? 0.34 : 0,
        roughness: 0.26,
        metalness: 0.06,
        transparent: true,
        opacity: heroMode ? 0.5 : 0.82,
        clearcoat: 0.72,
        clearcoatRoughness: 0.22,
        depthWrite: false,
      });

    const createHandMaterial = () =>
      new THREE.MeshPhysicalMaterial({
        color: heroMode ? 0x45d2ea : 0x3b8ca8,
        emissive: heroMode ? 0x0e6b88 : 0x062c3d,
        emissiveIntensity: heroMode ? 0.62 : 0.25,
        roughness: 0.22,
        metalness: 0.1,
        transparent: true,
        opacity: heroMode ? 0.92 : 0.86,
        clearcoat: 0.88,
        clearcoatRoughness: 0.16,
      });

    const createBoneMaterial = () =>
      new THREE.MeshStandardMaterial({
        color: heroMode ? 0x7dd3fc : 0xdbe9ee,
        roughness: 0.38,
        metalness: 0.15,
        transparent: true,
        opacity: heroMode ? 0.45 : 0.78,
      });

    const createTracheaMaterial = () =>
      new THREE.MeshStandardMaterial({
        color: heroMode ? 0xffb38a : 0x43c7d1,
        emissive: heroMode ? 0xd94e28 : 0x0b4854,
        emissiveIntensity: heroMode ? 0.72 : 0.45,
        roughness: 0.28,
        metalness: 0.2,
      });

    const createLungMaterial = () =>
      new THREE.MeshStandardMaterial({
        color: heroMode ? 0xf05a3e : 0x13b8b0,
        emissive: heroMode ? 0x992311 : 0x073b3e,
        emissiveIntensity: heroMode ? 0.68 : 0.4,
        roughness: 0.38,
        metalness: 0.1,
        transparent: true,
        opacity: heroMode ? 0.92 : 0.85,
      });

    const createDiaphragmMaterial = () =>
      new THREE.MeshStandardMaterial({
        color: 0x298096,
        emissive: 0x0b3544,
        emissiveIntensity: 0.35,
        roughness: 0.5,
        metalness: 0.1,
        side: THREE.DoubleSide,
      });

    const createBolusMaterial = () =>
      new THREE.MeshStandardMaterial({
        color: 0xdc5252,
        emissive: 0x991b1b,
        emissiveIntensity: 0.85,
        roughness: 0.25,
        metalness: 0.2,
      });

    const createLandmarkMaterial = (hexColor: number) =>
      new THREE.MeshStandardMaterial({
        color: hexColor,
        emissive: hexColor,
        emissiveIntensity: 0.55,
        roughness: 0.2,
        metalness: 0.3,
        transparent: true,
        opacity: 0.9,
      });

    // Helper to tag meshes for raycasting
    const registerClickable = (
      obj: THREE.Object3D,
      regionId: AnatomicalRegionId
    ) => {
      obj.userData.regionId = regionId;
      obj.traverse((child) => {
        child.userData.regionId = regionId;
      });
      clickableMeshes.push(obj);
    };

    // =======================================================================
    // AGE-SPECIFIC COMPOSITE 3D ANATOMICAL RIG BUILDER
    // Builds distinct anatomical proportions for Adult, Pregnant, Child, Infant
    // =======================================================================
    const buildAgeSpecificAnatomicalRig = (currentVictim: VictimCharacterId) => {
      // Clean up existing meshes
      patientRoot.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
        }
      });
      patientRoot.clear();
      clickableMeshes = [];

      bodyShellGroup = new THREE.Group();
      airwayBolusGroup = new THREE.Group();
      lungsRibcageGroup = new THREE.Group();
      landmarksGroup = new THREE.Group();

      const torsoPivot = new THREE.Group();
      patientRoot.add(torsoPivot);
      torsoPivot.add(bodyShellGroup);
      torsoPivot.add(airwayBolusGroup);
      torsoPivot.add(lungsRibcageGroup);
      torsoPivot.add(landmarksGroup);

      const shellMat = createShellMaterial();
      const limbMat = createLimbMaterial();
      const boneMat = createBoneMaterial();
      const tracheaMat = createTracheaMaterial();
      const lungMat = createLungMaterial();
      const diaphragmMat = createDiaphragmMaterial();
      const bolusMat = createBolusMaterial();

      const isInfant = currentVictim === 'nelly_infant';
      const isChild = currentVictim === 'mostafa_child';
      const isPregnant = currentVictim === 'salma_pregnant';

      // Distinct Anthropometric Proportions per Age Category
      // Adult: 1:7.5 ratio | Pregnant: 1:7.2 + gravid dome | Child (6y): 1:5.5 | Infant (8m): 1:4.0 prone on forearm
      const torsoScaleY = isInfant ? 0.52 : isChild ? 0.74 : 1.0;
      const torsoWidth = isInfant ? 0.19 : isChild ? 0.24 : isPregnant ? 0.29 : 0.32;
      const torsoDepth = isInfant ? 0.15 : isChild ? 0.17 : 0.21;
      const headRadius = isInfant ? 0.145 : isChild ? 0.145 : 0.135;
      const legHeight = isInfant ? 0.24 : isChild ? 0.42 : 0.62;

      torsoPivot.position.set(0, heroMode ? 0 : isInfant ? 0.58 : legHeight, 0);

      // 1. LOWER LIMBS & PELVIC BASE (Omitted in heroMode so ONLY the upper-half bust is rendered)
      if (!heroMode) {
        if (isInfant) {
          // Infant Prone/Angled on Rescuer Forearm Support Cradle (-15° head lower than chest)
          torsoPivot.rotation.x = THREE.MathUtils.degToRad(68);
          torsoPivot.position.set(0, 0.78, -0.18);

          // Rescuer Forearm & Support Hand Cradle underneath Infant
          const forearmCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.82, -0.52),
            new THREE.Vector3(0, 0.68, -0.05),
            new THREE.Vector3(0, 0.56, 0.36),
          ]);
          const forearmGeo = new THREE.TubeGeometry(forearmCurve, 28, 0.085, 16, false);
          const forearmMat = new THREE.MeshStandardMaterial({
            color: 0x19465b,
            roughness: 0.45,
            metalness: 0.25,
          });
          const forearmMesh = new THREE.Mesh(forearmGeo, forearmMat);
          patientRoot.add(forearmMesh);

          // Support Stand Column connecting forearm cradle to platform
          const standGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.68, 20);
          const standMesh = new THREE.Mesh(standGeo, forearmMat);
          standMesh.position.set(0, 0.34, -0.1);
          patientRoot.add(standMesh);

          // Infant Chubby Lower Limbs (Flexed)
          [-1, 1].forEach((side) => {
            const legGeo = new THREE.CapsuleGeometry(0.048, 0.16, 8, 16);
            const legMesh = new THREE.Mesh(legGeo, limbMat);
            legMesh.position.set(side * 0.09, -0.1, 0.04);
            legMesh.rotation.x = -0.35;
            bodyShellGroup.add(legMesh);
          });
        } else {
          // Standing / Leaning Lower Limbs for Adult, Pregnant Adult, and Child
          const hipOffset = isChild ? 0.11 : 0.145;
          [-1, 1].forEach((side) => {
            const upperLegGeo = new THREE.CapsuleGeometry(
              isChild ? 0.058 : 0.075,
              legHeight * 0.48,
              8,
              16
            );
            const upperLeg = new THREE.Mesh(upperLegGeo, limbMat);
            upperLeg.position.set(side * hipOffset, legHeight * 0.72, 0);
            upperLeg.castShadow = !isSoftwareGl;
            patientRoot.add(upperLeg);

            const lowerLegGeo = new THREE.CapsuleGeometry(
              isChild ? 0.048 : 0.062,
              legHeight * 0.46,
              8,
              16
            );
            const lowerLeg = new THREE.Mesh(lowerLegGeo, limbMat);
            lowerLeg.position.set(side * hipOffset, legHeight * 0.25, 0);
            lowerLeg.castShadow = !isSoftwareGl;
            patientRoot.add(lowerLeg);
          });

          // For Child: Add subtle Kneeling Rescuer Alignment Reference Ring at child torso height
          if (isChild) {
            const alignRingGeo = new THREE.TorusGeometry(0.46, 0.008, 12, 48);
            alignRingGeo.rotateX(Math.PI / 2);
            const alignRingMat = new THREE.MeshBasicMaterial({
              color: 0x43c7d1,
              transparent: true,
              opacity: 0.45,
            });
            const alignRing = new THREE.Mesh(alignRingGeo, alignRingMat);
            alignRing.position.y = 0.35;
            torsoPivot.add(alignRing);
          }
        }
      }

      // 2. TRANSLUCENT OUTER TORSO ANATOMICAL SHELL (LatheGeometry sculpted profile)
      // In heroMode: open lower chest profile extending smoothly into the CSS alpha fade mask (no pelvis/hips/hard bottom cap)
      const lathePoints: THREE.Vector2[] = heroMode
        ? [
            new THREE.Vector2(torsoWidth * 0.78, 0.08 * torsoScaleY),
            new THREE.Vector2(torsoWidth * 0.77, 0.28 * torsoScaleY),
            new THREE.Vector2(torsoWidth * 0.96, 0.55 * torsoScaleY),
            new THREE.Vector2(torsoWidth * 1.0, 0.72 * torsoScaleY),
            new THREE.Vector2(torsoWidth * 0.45, 0.84 * torsoScaleY),
            new THREE.Vector2(0.02, 0.86 * torsoScaleY),
          ]
        : [
            new THREE.Vector2(0.02, 0.0),
            new THREE.Vector2(torsoWidth * 0.78, 0.05 * torsoScaleY),
            new THREE.Vector2(torsoWidth * 0.74, 0.25 * torsoScaleY),
            new THREE.Vector2(torsoWidth * 0.96, 0.55 * torsoScaleY),
            new THREE.Vector2(torsoWidth * 1.0, 0.72 * torsoScaleY),
            new THREE.Vector2(torsoWidth * 0.45, 0.84 * torsoScaleY),
            new THREE.Vector2(0.02, 0.86 * torsoScaleY),
          ];
      const torsoGeo = new THREE.LatheGeometry(lathePoints, 32);
      torsoGeo.scale(1, 1, torsoDepth / torsoWidth);
      const torsoMesh = new THREE.Mesh(torsoGeo, shellMat);
      torsoMesh.renderOrder = 3;
      bodyShellGroup.add(torsoMesh);

      // Pregnant 3rd-Trimester Gravid Abdomen Contour + Contraindication Shell
      if (isPregnant) {
        const gravidGeo = new THREE.SphereGeometry(0.22, 28, 24);
        gravidGeo.scale(1.05, 1.15, 0.98);
        const gravidMesh = new THREE.Mesh(gravidGeo, shellMat);
        gravidMesh.position.set(0, 0.28, 0.11);
        gravidMesh.renderOrder = 3;
        bodyShellGroup.add(gravidMesh);
      }

      // 3. HEAD, CRANIUM, JAW & CERVICAL NECK GROUP
      const headGroup = new THREE.Group();
      const neckBaseY = 0.84 * torsoScaleY;
      headGroup.position.set(0, neckBaseY, 0);
      torsoPivot.add(headGroup);

      const neckGeo = new THREE.CylinderGeometry(
        headRadius * 0.44,
        headRadius * 0.5,
        0.14 * torsoScaleY,
        24
      );
      const neckMesh = new THREE.Mesh(neckGeo, shellMat);
      neckMesh.position.y = 0.06 * torsoScaleY;
      neckMesh.renderOrder = 3;
      headGroup.add(neckMesh);

      const craniumGeo = new THREE.SphereGeometry(headRadius, 28, 24);
      craniumGeo.scale(0.92, 1.12, 1.02);
      const craniumMesh = new THREE.Mesh(craniumGeo, shellMat);
      craniumMesh.position.set(0, 0.14 * torsoScaleY + headRadius * 0.85, 0.02);
      craniumMesh.renderOrder = 3;
      headGroup.add(craniumMesh);

      // Upper Limbs & Sculpted Universal Choking Sign Hands (slimmer arms, bent elbows down/out, both hands clearly clasping throat with wrapped fingers & thumbs forward)
      const handMat = createHandMaterial();
      const handsGroup = new THREE.Group();
      bodyShellGroup.add(handsGroup);

      const buildTaperedSegment = (
        start: THREE.Vector3,
        end: THREE.Vector3,
        rStart: number,
        rEnd: number,
        mat: THREE.Material
      ) => {
        const dir = new THREE.Vector3().subVectors(end, start);
        const len = dir.length();
        const geo = new THREE.CylinderGeometry(rEnd, rStart, len, 14);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(start).add(end).multiplyScalar(0.5);
        mesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.clone().normalize()
        );
        return mesh;
      };

      [-1, 1].forEach((side) => {
        const shoulderX = side * (torsoWidth * 0.96);
        const shoulderY = 0.72 * torsoScaleY;

        if (isInfant) {
          const armCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(shoulderX, shoulderY, 0),
            new THREE.Vector3(shoulderX * 1.25, shoulderY - 0.12, 0.08),
            new THREE.Vector3(shoulderX * 0.95, shoulderY - 0.22, 0.14),
          ]);
          const armGeo = new THREE.TubeGeometry(armCurve, 20, 0.034, 12, false);
          bodyShellGroup.add(new THREE.Mesh(armGeo, limbMat));
          return;
        }

        const armScale = isChild ? 0.82 : 1.0;
        const shoulderPos = new THREE.Vector3(
          side * (torsoWidth * 0.92),
          0.725 * torsoScaleY,
          0.005
        );
        // Natural anatomical elbow bent slightly down and outward beside the ribs
        const elbowPos = new THREE.Vector3(
          side * (torsoWidth * 1.16),
          0.51 * torsoScaleY,
          0.115
        );
        // Forearm sweeps cleanly inward and upward to the wrist at the anterolateral throat
        const wristPos = new THREE.Vector3(
          side * 0.122 * armScale,
          neckBaseY + 0.015 * torsoScaleY,
          0.128
        );

        // Smooth shoulder deltoid cap
        const deltoid = new THREE.Mesh(
          new THREE.SphereGeometry(0.038 * armScale, 16, 14),
          limbMat
        );
        deltoid.scale.set(0.92, 1.06, 0.88);
        deltoid.position.copy(shoulderPos);
        bodyShellGroup.add(deltoid);

        // Slimmer natural tapered upper arm
        const upperArm = buildTaperedSegment(
          shoulderPos,
          elbowPos,
          0.034 * armScale,
          0.027 * armScale,
          limbMat
        );
        bodyShellGroup.add(upperArm);

        // Smooth rounded elbow joint
        const elbowJoint = new THREE.Mesh(
          new THREE.SphereGeometry(0.027 * armScale, 14, 12),
          limbMat
        );
        elbowJoint.position.copy(elbowPos);
        bodyShellGroup.add(elbowJoint);

        // Slimmer natural tapered forearm
        const forearm = buildTaperedSegment(
          elbowPos,
          wristPos,
          0.026 * armScale,
          0.019 * armScale,
          limbMat
        );
        bodyShellGroup.add(forearm);

        // Wrist joint transitioning cleanly into sculpted palm
        const wristJoint = new THREE.Mesh(
          new THREE.SphereGeometry(0.02 * armScale, 12, 12),
          handMat
        );
        wristJoint.position.copy(wristPos);
        handsGroup.add(wristJoint);

        // Sculpted palm curving around the side/front of the throat
        const palmCenter = new THREE.Vector3(
          side * 0.086 * armScale,
          neckBaseY + 0.046 * torsoScaleY,
          0.118
        );
        const palmGeo = new THREE.SphereGeometry(0.036 * armScale, 16, 14);
        palmGeo.scale(0.82, 1.15, 0.44);
        const palmMesh = new THREE.Mesh(palmGeo, handMat);
        palmMesh.position.copy(palmCenter);
        palmMesh.rotation.set(0.18, -side * 0.62, side * 0.32);
        palmMesh.renderOrder = 4;
        handsGroup.add(palmMesh);

        // 4 Distinct Curved Fingers wrapping symmetrically around the throat
        const fingerSpecs = [
          { yOff: 0.025, reachX: 0.015, zMid: 0.128, r: 0.0072 }, // Index
          { yOff: 0.011, reachX: 0.012, zMid: 0.132, r: 0.0074 }, // Middle
          { yOff: -0.004, reachX: 0.016, zMid: 0.128, r: 0.0069 }, // Ring
          { yOff: -0.018, reachX: 0.024, zMid: 0.122, r: 0.0062 }, // Pinky
        ];

        fingerSpecs.forEach((f) => {
          const basePt = new THREE.Vector3(
            side * 0.072 * armScale,
            palmCenter.y + f.yOff * armScale,
            0.106
          );
          const knucklePt = new THREE.Vector3(
            side * 0.046 * armScale,
            palmCenter.y + (f.yOff + 0.006) * armScale,
            f.zMid
          );
          const tipPt = new THREE.Vector3(
            side * f.reachX * armScale,
            palmCenter.y + (f.yOff + 0.002) * armScale,
            f.zMid - 0.012
          );
          const fCurve = new THREE.CatmullRomCurve3([basePt, knucklePt, tipPt]);
          const fGeo = new THREE.TubeGeometry(
            fCurve,
            10,
            f.r * armScale,
            8,
            false
          );
          const fMesh = new THREE.Mesh(fGeo, handMat);
          fMesh.renderOrder = 4;
          handsGroup.add(fMesh);

          const tipCap = new THREE.Mesh(
            new THREE.SphereGeometry(f.r * 0.95 * armScale, 8, 8),
            handMat
          );
          tipCap.position.copy(tipPt);
          tipCap.renderOrder = 4;
          handsGroup.add(tipCap);
        });

        // Opposing Thumb angled forward/upward on the front of the throat (Universal V-grip)
        const thumbBase = new THREE.Vector3(
          side * 0.072 * armScale,
          palmCenter.y - 0.016 * armScale,
          0.124
        );
        const thumbMid = new THREE.Vector3(
          side * 0.048 * armScale,
          palmCenter.y + 0.012 * armScale,
          0.142
        );
        const thumbTip = new THREE.Vector3(
          side * 0.024 * armScale,
          palmCenter.y + 0.036 * armScale,
          0.136
        );
        const thumbCurve = new THREE.CatmullRomCurve3([
          thumbBase,
          thumbMid,
          thumbTip,
        ]);
        const thumbGeo = new THREE.TubeGeometry(
          thumbCurve,
          10,
          0.0085 * armScale,
          8,
          false
        );
        const thumbMesh = new THREE.Mesh(thumbGeo, handMat);
        thumbMesh.renderOrder = 4;
        handsGroup.add(thumbMesh);

        const thumbCap = new THREE.Mesh(
          new THREE.SphereGeometry(0.0082 * armScale, 8, 8),
          handMat
        );
        thumbCap.position.copy(thumbTip);
        thumbCap.renderOrder = 4;
        handsGroup.add(thumbCap);
      });

      // 4. INTERNAL LAYER A: UPPER AIRWAY, LARYNX, TRACHEA, BRONCHI & MOVABLE FOREIGN BODY BOLUS
      const airwayTopY = neckBaseY + (heroMode ? 0.13 : 0.16) * torsoScaleY;
      const carinaY = 0.58 * torsoScaleY;

      // Pharynx & Larynx Cartilage Chamber
      const larynxGeo = new THREE.CylinderGeometry(
        0.029,
        0.024,
        0.08 * torsoScaleY,
        20
      );
      const larynxMesh = new THREE.Mesh(larynxGeo, tracheaMat);
      larynxMesh.position.set(0, airwayTopY - 0.045 * torsoScaleY, 0.03);
      airwayBolusGroup.add(larynxMesh);
      registerClickable(larynxMesh, 'larynx_airway');

      // Tracheal Tube & C-Shaped Cartilaginous Rings
      const tracheaCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, airwayTopY - 0.08 * torsoScaleY, 0.03),
        new THREE.Vector3(0, (airwayTopY + carinaY) * 0.5, 0.025),
        new THREE.Vector3(0, carinaY, 0.02),
      ]);
      const tracheaGeo = new THREE.TubeGeometry(
        tracheaCurve,
        24,
        isInfant ? 0.015 : isChild ? 0.019 : 0.023,
        16,
        false
      );
      const tracheaMesh = new THREE.Mesh(tracheaGeo, tracheaMat);
      airwayBolusGroup.add(tracheaMesh);
      registerClickable(tracheaMesh, 'trachea_rings');

      // 7 Cartilaginous Tracheal Rings
      const ringCount = 7;
      for (let i = 0; i < ringCount; i++) {
        const t = (i + 0.5) / ringCount;
        const pt = tracheaCurve.getPoint(t);
        const cRingGeo = new THREE.TorusGeometry(
          isInfant ? 0.017 : isChild ? 0.021 : 0.026,
          0.004,
          8,
          20
        );
        cRingGeo.rotateX(Math.PI / 2);
        const cRing = new THREE.Mesh(cRingGeo, boneMat);
        cRing.position.copy(pt);
        airwayBolusGroup.add(cRing);
        registerClickable(cRing, 'trachea_rings');
      }

      // Left & Right Mainstem Bronchi
      [-1, 1].forEach((side) => {
        const bronchusCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, carinaY, 0.02),
          new THREE.Vector3(
            side * torsoWidth * 0.25,
            carinaY - 0.05 * torsoScaleY,
            0.015
          ),
          new THREE.Vector3(
            side * torsoWidth * 0.44,
            carinaY - 0.11 * torsoScaleY,
            0.01
          ),
        ]);
        const bronchusGeo = new THREE.TubeGeometry(
          bronchusCurve,
          14,
          isInfant ? 0.01 : 0.015,
          12,
          false
        );
        const bronchusMesh = new THREE.Mesh(bronchusGeo, tracheaMat);
        airwayBolusGroup.add(bronchusMesh);
        registerClickable(bronchusMesh, 'trachea_rings');
      });

      // Lodged Foreign Body Bolus inside Upper Trachea / Larynx
      const bolusBaseY = airwayTopY - 0.11 * torsoScaleY;
      const bolusGeo = new THREE.DodecahedronGeometry(
        isInfant ? 0.022 : isChild ? 0.026 : 0.031,
        1
      );
      const bolusMesh = new THREE.Mesh(bolusGeo, bolusMat);
      bolusMesh.position.set(0, bolusBaseY, 0.03);
      bolusMesh.renderOrder = 5;
      airwayBolusGroup.add(bolusMesh);
      registerClickable(bolusMesh, 'foreign_body');

      // 5. INTERNAL LAYER B: BILATERAL BREATHING LUNGS, DIAPHRAGM DOME & THORACIC RIBCAGE
      const lungY = 0.53 * torsoScaleY;
      const lungOffsetX = torsoWidth * 0.42;

      const leftLungGeo = new THREE.SphereGeometry(
        torsoWidth * 0.36,
        24,
        20
      );
      leftLungGeo.scale(0.78, 1.38 * torsoScaleY, 0.68);
      const leftLung = new THREE.Mesh(leftLungGeo, lungMat);
      leftLung.position.set(lungOffsetX, lungY, 0.01);
      lungsRibcageGroup.add(leftLung);
      registerClickable(leftLung, 'lungs_bronchi');

      const rightLungGeo = new THREE.SphereGeometry(
        torsoWidth * 0.37,
        24,
        20
      );
      rightLungGeo.scale(0.8, 1.38 * torsoScaleY, 0.68);
      const rightLung = new THREE.Mesh(rightLungGeo, lungMat);
      rightLung.position.set(-lungOffsetX, lungY, 0.01);
      lungsRibcageGroup.add(rightLung);
      registerClickable(rightLung, 'lungs_bronchi');

      // Subtle glowing cardiac core nestled between medial lungs (used for hero Heart Rate highlight)
      let heartMesh: THREE.Mesh | undefined;
      let throatIndicator: THREE.Mesh | undefined;
      if (heroMode) {
        const heartMat = new THREE.MeshStandardMaterial({
          color: 0xff5e6c,
          emissive: 0xc81e3a,
          emissiveIntensity: 0.65,
          roughness: 0.3,
          metalness: 0.15,
          transparent: true,
          opacity: 0.88,
        });
        const heartGeo = new THREE.SphereGeometry(0.052, 18, 16);
        heartGeo.scale(0.88, 1.15, 0.82);
        heartMesh = new THREE.Mesh(heartGeo, heartMat);
        heartMesh.position.set(0.032, 0.49 * torsoScaleY, 0.058);
        heartMesh.rotation.z = -0.25;
        lungsRibcageGroup.add(heartMesh);

        // Throat airway status beacon dot inside upper larynx (teal when open, warm amber on blocked preview)
        const throatMat = new THREE.MeshStandardMaterial({
          color: 0x13b8b0,
          emissive: 0x13b8b0,
          emissiveIntensity: 1.05,
          roughness: 0.2,
        });
        throatIndicator = new THREE.Mesh(
          new THREE.SphereGeometry(0.022, 16, 16),
          throatMat
        );
        throatIndicator.position.set(0, neckBaseY + 0.05 * torsoScaleY, 0.068);
        throatIndicator.renderOrder = 6;
        airwayBolusGroup.add(throatIndicator);
      }

      // Internal Illuminated Bronchial Tree Branches inside Both Lungs
      const bronchioleMat = new THREE.MeshStandardMaterial({
        color: heroMode ? 0xffd199 : 0x43c7d1,
        emissive: heroMode ? 0xff7b3a : 0x13b8b0,
        emissiveIntensity: heroMode ? 0.95 : 0.6,
        roughness: 0.25,
      });
      [-1, 1].forEach((side) => {
        const rootX = side * torsoWidth * 0.32;
        const rootY = carinaY - 0.06 * torsoScaleY;
        const branchOffsets = [
          [side * torsoWidth * 0.48, rootY + 0.09 * torsoScaleY, 0.02],
          [side * torsoWidth * 0.54, rootY - 0.02 * torsoScaleY, 0.025],
          [side * torsoWidth * 0.49, rootY - 0.14 * torsoScaleY, 0.015],
          [side * torsoWidth * 0.38, rootY - 0.19 * torsoScaleY, -0.01],
        ];
        branchOffsets.forEach(([bx, by, bz]) => {
          const bCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(rootX, rootY, 0.015),
            new THREE.Vector3((rootX + bx) * 0.52, (rootY + by) * 0.5, bz),
            new THREE.Vector3(bx, by, bz),
          ]);
          const bGeo = new THREE.TubeGeometry(
            bCurve,
            10,
            isInfant ? 0.0045 : 0.007,
            8,
            false
          );
          const bMesh = new THREE.Mesh(bGeo, bronchioleMat);
          lungsRibcageGroup.add(bMesh);
          registerClickable(bMesh, 'lungs_bronchi');
        });
      });

      // Muscular Dome Diaphragm underneath Lungs
      const diaphragmGeo = new THREE.SphereGeometry(
        torsoWidth * 0.72,
        24,
        16,
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.46
      );
      diaphragmGeo.scale(1.0, 0.48, (torsoDepth / torsoWidth) * 0.88);
      const diaphragm = new THREE.Mesh(diaphragmGeo, diaphragmMat);
      diaphragm.position.set(0, 0.33 * torsoScaleY, 0.01);
      lungsRibcageGroup.add(diaphragm);
      registerClickable(diaphragm, 'diaphragm_dome');

      // Sternum (Manubrium, Body, Xiphoid Tip) & 6 Pairs of Curved Rib Arcs
      const sternumGeo = new THREE.BoxGeometry(
        0.042,
        0.31 * torsoScaleY,
        0.018
      );
      const sternumMesh = new THREE.Mesh(sternumGeo, boneMat);
      sternumMesh.position.set(0, 0.58 * torsoScaleY, torsoDepth * 0.86);
      lungsRibcageGroup.add(sternumMesh);
      registerClickable(sternumMesh, 'ribcage_sternum');

      for (let r = 0; r < 6; r++) {
        const ribY = (0.71 - r * 0.055) * torsoScaleY;
        const ribSpread = (1 - r * 0.05) * torsoWidth * 0.86;
        [-1, 1].forEach((side) => {
          const ribCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, ribY, -torsoDepth * 0.78),
            new THREE.Vector3(side * ribSpread, ribY - 0.01, 0),
            new THREE.Vector3(
              side * 0.022,
              ribY - 0.025,
              torsoDepth * 0.85
            ),
          ]);
          const ribGeo = new THREE.TubeGeometry(ribCurve, 18, 0.0085, 8, false);
          const ribMesh = new THREE.Mesh(ribGeo, boneMat);
          lungsRibcageGroup.add(ribMesh);
          registerClickable(ribMesh, 'ribcage_sternum');
        });
      }

      // 6. LAYER C: AGE-SPECIFIC 3D RESCUE LANDMARKS & CONTRAINDICATED HAZARD ZONES
      // A) Interscapular Back-Blow Zone (Posterior Midline Between Shoulder Blades)
      const backBlowMat = createLandmarkMaterial(0x13b8b0);
      const backBlowGeo = new THREE.CylinderGeometry(
        0.068,
        0.068,
        0.016,
        28
      );
      backBlowGeo.rotateX(Math.PI / 2);
      const backBlowTarget = new THREE.Mesh(backBlowGeo, backBlowMat);
      backBlowTarget.position.set(
        0,
        0.61 * torsoScaleY,
        -torsoDepth * 0.96
      );
      landmarksGroup.add(backBlowTarget);
      registerClickable(backBlowTarget, 'landmark_back_blows');

      // B) Epigastric Abdominal Thrust Target (Adult & Child) OR Contraindicated Hazard Zone (Infant & Pregnant)
      let epigastricTarget: THREE.Mesh | undefined;
      let sternalTarget: THREE.Mesh | undefined;
      let hazardTarget: THREE.Mesh | undefined;

      if (!isInfant && !isPregnant) {
        const epiMat = createLandmarkMaterial(0x43c7d1);
        const epiGeo = new THREE.CylinderGeometry(0.064, 0.064, 0.018, 28);
        epiGeo.rotateX(Math.PI / 2);
        epigastricTarget = new THREE.Mesh(epiGeo, epiMat);
        epigastricTarget.position.set(
          0,
          0.26 * torsoScaleY,
          torsoDepth * 0.94
        );
        landmarksGroup.add(epigastricTarget);
        registerClickable(epigastricTarget, 'landmark_abdominal_thrust');

        // Xiphoid Process Caution Marker right above Epigastric Zone
        const xiphoidHazardMat = createLandmarkMaterial(0xdc5252);
        const xiphoidGeo = new THREE.SphereGeometry(0.024, 16, 16);
        hazardTarget = new THREE.Mesh(xiphoidGeo, xiphoidHazardMat);
        hazardTarget.position.set(0, 0.41 * torsoScaleY, torsoDepth * 0.92);
        landmarksGroup.add(hazardTarget);
        registerClickable(hazardTarget, 'hazard_zone');
      } else {
        // Sternal Chest-Thrust Target Zone (Center of Sternum for Pregnant & Infant)
        const sternalMat = createLandmarkMaterial(0x43c7d1);
        const sternalGeo = new THREE.CylinderGeometry(
          isInfant ? 0.045 : 0.065,
          isInfant ? 0.045 : 0.065,
          0.018,
          28
        );
        sternalGeo.rotateX(Math.PI / 2);
        sternalTarget = new THREE.Mesh(sternalGeo, sternalMat);
        sternalTarget.position.set(
          0,
          0.56 * torsoScaleY,
          torsoDepth * 0.96
        );
        landmarksGroup.add(sternalTarget);
        registerClickable(sternalTarget, 'landmark_sternal_thrust');

        // Contraindicated Abdomen Hazard Boundary for Pregnant & Infant
        const hazardMat = createLandmarkMaterial(0xdc5252);
        const hazardGeo = new THREE.TorusGeometry(
          isPregnant ? 0.14 : 0.055,
          0.01,
          12,
          32
        );
        hazardTarget = new THREE.Mesh(hazardGeo, hazardMat);
        hazardTarget.position.set(
          0,
          0.26 * torsoScaleY,
          isPregnant ? 0.31 : torsoDepth * 0.95
        );
        landmarksGroup.add(hazardTarget);
        registerClickable(hazardTarget, 'hazard_zone');
      }

      // 3D Force Vector Arrow Group (animates during back blows / abdominal / sternal thrusts)
      const forceArrowGroup = new THREE.Group();
      const shaftGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.14, 12);
      const coneGeo = new THREE.ConeGeometry(0.028, 0.065, 16);
      const arrowMat = new THREE.MeshStandardMaterial({
        color: 0x43c7d1,
        emissive: 0x13b8b0,
        emissiveIntensity: 0.7,
      });
      const shaft = new THREE.Mesh(shaftGeo, arrowMat);
      const cone = new THREE.Mesh(coneGeo, arrowMat);
      cone.position.y = 0.095;
      forceArrowGroup.add(shaft, cone);

      if (isInfant || isPregnant) {
        forceArrowGroup.position.set(0, 0.56 * torsoScaleY, torsoDepth + 0.16);
        forceArrowGroup.rotation.x = -Math.PI / 2;
      } else {
        forceArrowGroup.position.set(0, 0.24 * torsoScaleY, torsoDepth + 0.16);
        forceArrowGroup.rotation.x = -Math.PI / 4; // Inward & Upward J-thrust vector
      }
      landmarksGroup.add(forceArrowGroup);

      animatedParts = {
        torsoPivot,
        headGroup,
        leftLung,
        rightLung,
        heartMesh,
        throatIndicator,
        handsGroup,
        bronchioleMat,
        tracheaMat,
        handMat,
        diaphragm,
        bolusMesh,
        forceArrowGroup,
        epigastricTarget,
        sternalTarget,
        backBlowTarget,
        hazardTarget,
        bolusBaseY,
      };

      // Hero mode: configure camera framing + wireframe scan hologram + scan ring
      if (heroMode) {
        const heroDist = computeHeroCameraDist(
          Math.max(container.clientWidth, 240) /
            Math.max(container.clientHeight, 240)
        );
        patientRoot.scale.setScalar(1.0);
        controls.target.set(0, 0.72, 0);
        controls.minDistance = heroDist;
        controls.maxDistance = heroDist;
        camera.position.set(0.0, 0.72, heroDist);
        simStateRef.current.cameraGoalTarget = null;
        simStateRef.current.cameraGoalPos = null;

        // Collect all solid materials so we can clip them during the 2.5s top-to-bottom scan intro
        solidHeroMaterials = [];
        const seenMats = new Set<THREE.Material>();
        torsoPivot.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.isMesh && mesh.material) {
            const mats = Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material];
            mats.forEach((m) => {
              if (!seenMats.has(m)) {
                seenMats.add(m);
                solidHeroMaterials.push(m);
                if (introActive) {
                  m.clippingPlanes = [solidClipPlane];
                }
              }
            });
          }
        });

        // Build wireframe hologram shell & glowing horizontal scan ring for the 2.5s intro sequence
        if (introActive) {
          const wireMat = new THREE.MeshBasicMaterial({
            color: 0x43c7d1,
            wireframe: true,
            transparent: true,
            opacity: 0.34,
            clippingPlanes: [wireClipPlane],
          });
          heroWireGroup = new THREE.Group();
          const wireTorso = new THREE.Mesh(torsoGeo, wireMat);
          const wireHead = new THREE.Mesh(craniumGeo, wireMat);
          wireHead.position.set(
            0,
            neckBaseY + 0.14 * torsoScaleY + headRadius * 0.85,
            0.02
          );
          const wireNeck = new THREE.Mesh(neckGeo, wireMat);
          wireNeck.position.set(0, neckBaseY + 0.06 * torsoScaleY, 0);
          heroWireGroup.add(wireTorso, wireHead, wireNeck);
          torsoPivot.add(heroWireGroup);

          const scanRingGeo = new THREE.TorusGeometry(0.46, 0.0045, 8, 64);
          scanRingGeo.rotateX(Math.PI / 2);
          const scanRingMat = new THREE.MeshBasicMaterial({
            color: 0x5ce2ea,
            transparent: true,
            opacity: 0.92,
          });
          heroScanRing = new THREE.Mesh(scanRingGeo, scanRingMat);
          heroScanRing.position.set(0, 1.32, 0.02);
          torsoPivot.add(heroScanRing);
        }
      } else {
        patientRoot.scale.setScalar(1.0);
        const defaultTargetY = isInfant ? 0.72 : isChild ? 0.78 : 0.98;
        simStateRef.current.cameraGoalTarget = new THREE.Vector3(
          0,
          defaultTargetY,
          0
        );
      }
    };

    // Build initial age-specific 3D rig
    buildAgeSpecificAnatomicalRig(simStateRef.current.victim);

    // Lazy-load living hero particles after first paint so first visible content stays fast (< 2s)
    let particleInitTimer: number | null = null;
    if (heroMode && !initialReducedMotion) {
      particleInitTimer = window.setTimeout(() => {
        if (isDisposed || !animatedParts.torsoPivot) return;
        const isMobileWidth = container.clientWidth < 360;

        // Soft radial glow sprite for crisp circular particles
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 32;
        pCanvas.height = 32;
        const pCtx = pCanvas.getContext('2d');
        if (pCtx) {
          const grad = pCtx.createRadialGradient(16, 16, 1, 16, 16, 15);
          grad.addColorStop(0, 'rgba(130, 245, 255, 1)');
          grad.addColorStop(0.45, 'rgba(19, 184, 176, 0.75)');
          grad.addColorStop(1, 'rgba(19, 184, 176, 0)');
          pCtx.fillStyle = grad;
          pCtx.fillRect(0, 0, 32, 32);
        }
        particleSpriteTex = new THREE.CanvasTexture(pCanvas);

        // 1. Teal Airflow Particles flowing along trachea into & out of both lungs
        const airflowCount = isMobileWidth ? 14 : 26;
        const airflowPos = new Float32Array(airflowCount * 3);
        airflowPhases = new Float32Array(airflowCount);
        airflowSides = new Int8Array(airflowCount);
        for (let i = 0; i < airflowCount; i++) {
          airflowPhases[i] = i / airflowCount;
          airflowSides[i] = i % 2 === 0 ? 1 : -1;
          airflowPos[i * 3] = 0;
          airflowPos[i * 3 + 1] = 0.8;
          airflowPos[i * 3 + 2] = 0.04;
        }
        const airflowGeo = new THREE.BufferGeometry();
        airflowGeo.setAttribute(
          'position',
          new THREE.BufferAttribute(airflowPos, 3)
        );
        const airflowMat = new THREE.PointsMaterial({
          size: 0.032,
          map: particleSpriteTex,
          color: 0x5ce2ea,
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        airflowPoints = new THREE.Points(airflowGeo, airflowMat);
        airflowPoints.renderOrder = 6;
        animatedParts.torsoPivot.add(airflowPoints);

        // 2. Faint Floating Depth Particles surrounding the bust
        const ambCount = isMobileWidth ? 16 : 34;
        const ambPos = new Float32Array(ambCount * 3);
        ambientBasePositions = new Float32Array(ambCount * 3);
        for (let i = 0; i < ambCount; i++) {
          const angle = (i / ambCount) * Math.PI * 2 + (i % 5) * 0.4;
          const radius = 0.44 + (i % 7) * 0.055;
          const y = 0.14 + ((i * 0.19) % 1.15);
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius * 0.65 - 0.12;
          ambPos[i * 3] = x;
          ambPos[i * 3 + 1] = y;
          ambPos[i * 3 + 2] = z;
          ambientBasePositions[i * 3] = x;
          ambientBasePositions[i * 3 + 1] = y;
          ambientBasePositions[i * 3 + 2] = z;
        }
        const ambGeo = new THREE.BufferGeometry();
        ambGeo.setAttribute('position', new THREE.BufferAttribute(ambPos, 3));
        const ambMat = new THREE.PointsMaterial({
          size: 0.022,
          map: particleSpriteTex,
          color: 0x43c7d1,
          transparent: true,
          opacity: 0.42,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        ambientPoints = new THREE.Points(ambGeo, ambMat);
        scene.add(ambientPoints);
      }, 150);
    }

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 7. Raycasting for 3D Anatomical Region Selection & Thrust Execution
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(
        e.clientX - pointerDownPos.x,
        e.clientY - pointerDownPos.y
      );
      // Ignore if the user was dragging to orbit the camera
      if (dist > 6) return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, true);
      if (hits.length > 0) {
        const hitObj = hits[0].object;
        const regionId = hitObj.userData.regionId as
          | AnatomicalRegionId
          | undefined;
        if (regionId) {
          handleSelectRegion(regionId);

          // If in Stage 2 (assessMode), also mark corresponding clinical sign hotspot inspected
          if (callbacksRef.current.assessMode && callbacksRef.current.hotspots) {
            const spots = callbacksRef.current.hotspots;
            const matchIdx =
              regionId === 'larynx_airway' || regionId === 'foreign_body'
                ? 0
                : regionId === 'lungs_bronchi' || regionId === 'trachea_rings'
                ? 1
                : 2;
            const matchedSpot = spots[matchIdx] || spots[0];
            if (matchedSpot && callbacksRef.current.onInspectHotspot) {
              callbacksRef.current.onInspectHotspot(matchedSpot.id);
            }
          }

          // If clicking a rescue landmark or during Stage 4 micro-interaction, trigger 3D impulse
          if (
            regionId === 'landmark_abdominal_thrust' ||
            regionId === 'landmark_sternal_thrust' ||
            regionId === 'landmark_back_blows' ||
            regionId === 'hazard_zone'
          ) {
            handleDeliver3DImpulse(regionId);
          }
        }
      }
    };

    let lastHoverTime = 0;
    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverTime < 60) return;
      lastHoverTime = now;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, true);
      renderer.domElement.style.cursor =
        hits.length > 0 ? 'pointer' : 'grab';
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown);
    domEl.addEventListener('pointerup', onPointerUp);
    domEl.addEventListener('pointermove', onPointerMove);

    // 8. Expose Programmatic Camera & Model Commands
    cameraCommandRef.current = {
      setPreset: (preset: CameraPresetId) => {
        const v = simStateRef.current.victim;
        const targetY =
          v === 'nelly_infant' ? 0.72 : v === 'mostafa_child' ? 0.78 : 0.98;
        simStateRef.current.cameraGoalTarget = new THREE.Vector3(
          0,
          targetY,
          0
        );
        if (preset === 'anterior') {
          simStateRef.current.cameraGoalPos = new THREE.Vector3(
            heroMode ? 0.14 : 0.28,
            targetY + (heroMode ? 0.08 : 0.14),
            heroMode ? 1.72 : 2.45
          );
        } else if (preset === 'lateral') {
          simStateRef.current.cameraGoalPos = new THREE.Vector3(
            2.25,
            targetY + 0.1,
            0.45
          );
        } else if (preset === 'dorsal') {
          simStateRef.current.cameraGoalPos = new THREE.Vector3(
            -0.35,
            targetY + 0.18,
            -2.35
          );
        } else if (preset === 'airway') {
          simStateRef.current.cameraGoalTarget = new THREE.Vector3(
            0,
            targetY + 0.25,
            0.05
          );
          simStateRef.current.cameraGoalPos = new THREE.Vector3(
            0.42,
            targetY + 0.34,
            1.28
          );
        }
      },
      orbitBy: (deltaAzimuth: number, deltaPolar: number) => {
        simStateRef.current.cameraGoalPos = null;
        const offset = _scratchVec3
          .copy(camera.position)
          .sub(controls.target);
        const spherical = new THREE.Spherical().setFromVector3(offset);
        spherical.theta += deltaAzimuth;
        spherical.phi = THREE.MathUtils.clamp(
          spherical.phi + deltaPolar,
          0.2,
          Math.PI * 0.82
        );
        offset.setFromSpherical(spherical);
        camera.position.copy(controls.target).add(offset);
        controls.update();
      },
      zoomBy: (factor: number) => {
        simStateRef.current.cameraGoalPos = null;
        const offset = _scratchVec3
          .copy(camera.position)
          .sub(controls.target);
        const newLen = THREE.MathUtils.clamp(
          offset.length() * factor,
          controls.minDistance,
          controls.maxDistance
        );
        offset.setLength(newLen);
        camera.position.copy(controls.target).add(offset);
        controls.update();
      },
      focusPoint: (
        target: [number, number, number],
        camPos: [number, number, number]
      ) => {
        simStateRef.current.cameraGoalTarget = new THREE.Vector3(...target);
        simStateRef.current.cameraGoalPos = new THREE.Vector3(...camPos);
      },
      triggerThrustPulse: () => {
        simStateRef.current.thrustImpulseTime = performance.now();
      },
      rebuildModel: (newVictim: VictimCharacterId) => {
        buildAgeSpecificAnatomicalRig(newVictim);
      },
    };

    // 9. Animation & Render Loop (with Software-WebGL fenceSync guard)
    const clock = new THREE.Clock();
    let frameId = 0;
    let isDisposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
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
      const elapsed = clock.getElapsedTime();
      const st = simStateRef.current;

      // Sync layer visibility
      bodyShellGroup.visible = st.layers.bodyShell;
      airwayBolusGroup.visible = st.layers.airwayBolus;
      lungsRibcageGroup.visible = st.layers.lungsRibcage;
      landmarksGroup.visible = st.layers.rescueLandmarks;

      // Smooth exponential damping for camera preset transitions
      if (st.cameraGoalTarget) {
        controls.target.x = THREE.MathUtils.damp(
          controls.target.x,
          st.cameraGoalTarget.x,
          6,
          delta
        );
        controls.target.y = THREE.MathUtils.damp(
          controls.target.y,
          st.cameraGoalTarget.y,
          6,
          delta
        );
        controls.target.z = THREE.MathUtils.damp(
          controls.target.z,
          st.cameraGoalTarget.z,
          6,
          delta
        );
      }
      if (st.cameraGoalPos) {
        camera.position.x = THREE.MathUtils.damp(
          camera.position.x,
          st.cameraGoalPos.x,
          5.5,
          delta
        );
        camera.position.y = THREE.MathUtils.damp(
          camera.position.y,
          st.cameraGoalPos.y,
          5.5,
          delta
        );
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          st.cameraGoalPos.z,
          5.5,
          delta
        );
        if (camera.position.distanceTo(st.cameraGoalPos) < 0.015) {
          st.cameraGoalPos = null;
          st.cameraGoalTarget = null;
        }
      }

      controls.update();

      // Physiological & Pose-Driven 3D Kinematics
      const isCleared = st.pose === 'object_expelled_recovery';
      const isBackBlows = st.pose === 'back_blows_5';
      const isAbdominal = st.pose === 'abdominal_thrusts_5';
      const isSternal =
        st.pose === 'chest_thrusts_special' ||
        st.pose === 'cpr_compressions_30_2';

      // Impulse wave when user clicks a 3D landmark or delivers a thrust tap
      const msSinceImpulse = performance.now() - st.thrustImpulseTime;
      const impulseCompression =
        msSinceImpulse >= 0 && msSinceImpulse < 450
          ? Math.sin((msSinceImpulse / 450) * Math.PI)
          : 0;

      // Check prefers-reduced-motion (static pose when reduced motion is active)
      const isReducedMotion =
        document.documentElement.classList.contains('reduced-motion') ||
        (typeof window !== 'undefined' &&
          typeof window.matchMedia === 'function' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches);

      // Hero 2.5s Wireframe-to-Solid Top-to-Bottom Scan Reveal Sequence
      let heroLungIntroMult = 1.0;
      if (heroMode && introActive) {
        const introSec = (performance.now() - introStartMs) / 1000;
        const progress = Math.min(1, introSec / 2.35);
        // Smooth easeInOutCubic sweep from head top (y=1.34) down to chest fade (y=0.0)
        const eased =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        const scanY = 1.34 - eased * 1.38;
        solidClipPlane.constant = -scanY;
        wireClipPlane.constant = scanY;

        if (heroScanRing) {
          heroScanRing.position.y = scanY;
          const ringScale = 0.84 + Math.sin(eased * Math.PI) * 0.24;
          heroScanRing.scale.set(ringScale, 1, ringScale);
          (heroScanRing.material as THREE.MeshBasicMaterial).opacity =
            progress > 0.85 ? (1 - progress) * 6 : 0.92;
        }

        // Progressively illuminate lungs as scan line passes chest (y ~ 0.75 -> 0.32)
        heroLungIntroMult = THREE.MathUtils.clamp((0.82 - scanY) / 0.48, 0.15, 1.0);

        if (progress >= 1) {
          introActive = false;
          // Move clipping plane far below bust instead of toggling localClippingEnabled / needsUpdate
          // to avoid any WebGL shader recompile stall on mobile GPUs or SwiftShader
          solidClipPlane.constant = 10;
          wireClipPlane.constant = -10;
          if (heroWireGroup) heroWireGroup.visible = false;
          if (heroScanRing) heroScanRing.visible = false;
          if (!introFinishedNotified) {
            introFinishedNotified = true;
            st.onHeroIntroComplete?.();
          }
        }
      }

      // Hero organ highlighting (hovering callouts) + optional ~12s subtle airwayBlockedPreview
      const isHighlightLungs = heroMode && st.highlightedOrgan === 'lungs';
      const isHighlightHeart = heroMode && st.highlightedOrgan === 'heart';
      const isHighlightThroat = heroMode && st.highlightedOrgan === 'throat';
      const isBlockedPreview = heroMode && st.airwayBlockedPreview;

      // Lung expansion & oxygenation color based on SpO2 & airway state
      const breathFreq = heroMode
        ? 1.85
        : isCleared
        ? 2.4
        : st.spo2 < 88
        ? 5.2
        : 3.4;
      const breathAmp = heroMode
        ? isBlockedPreview
          ? 0.022
          : 0.052
        : isCleared
        ? 0.08
        : st.spo2 < 88
        ? 0.018
        : 0.04;
      const breathWave = isReducedMotion
        ? 0
        : Math.sin(elapsed * breathFreq) * breathAmp;

      if (animatedParts.leftLung && animatedParts.rightLung) {
        const compressionFactor = 1 - impulseCompression * 0.14;
        animatedParts.leftLung.scale.x =
          (0.78 + breathWave) * compressionFactor;
        animatedParts.leftLung.scale.z =
          (0.68 + breathWave) * compressionFactor;
        animatedParts.rightLung.scale.x =
          (0.8 + breathWave) * compressionFactor;
        animatedParts.rightLung.scale.z =
          (0.68 + breathWave) * compressionFactor;

        const lungMat = animatedParts.leftLung
          .material as THREE.MeshStandardMaterial;
        if (heroMode) {
          _scratchColor.setHex(isHighlightLungs ? 0xff7b5a : 0xf05a3e);
          const pulseGlow = isReducedMotion
            ? 0
            : (Math.sin(elapsed * breathFreq) * 0.5 + 0.5) * 0.25;
          const targetEmissive =
            (0.64 + pulseGlow + (isHighlightLungs ? 0.55 : 0)) *
            heroLungIntroMult;
          lungMat.emissiveIntensity = THREE.MathUtils.damp(
            lungMat.emissiveIntensity,
            targetEmissive,
            6,
            delta
          );
          if (animatedParts.bronchioleMat) {
            animatedParts.bronchioleMat.emissiveIntensity =
              (0.95 + (isHighlightLungs ? 0.65 : 0)) * heroLungIntroMult;
          }
        } else if (isCleared) {
          _scratchColor.setHex(0x16a36a);
        } else if (st.spo2 <= 86) {
          _scratchColor.setHex(0x7c3f58);
        } else {
          _scratchColor.setHex(0x13b8b0);
        }
        lungMat.color.lerp(_scratchColor, 0.08);
      }

      // Hero cardiac pulse & highlight
      if (heroMode && animatedParts.heartMesh) {
        const beatCycle = isReducedMotion
          ? 0
          : Math.pow(Math.max(0, Math.sin(elapsed * 3.8)), 6);
        const hScale = 1 + beatCycle * (isHighlightHeart ? 0.18 : 0.09);
        animatedParts.heartMesh.scale.set(
          0.88 * hScale,
          1.15 * hScale,
          0.82 * hScale
        );
        const hMat = animatedParts.heartMesh
          .material as THREE.MeshStandardMaterial;
        hMat.emissiveIntensity = THREE.MathUtils.damp(
          hMat.emissiveIntensity,
          isHighlightHeart ? 1.55 : 0.65 + beatCycle * 0.4,
          8,
          delta
        );
      }

      // Hero throat airway beacon + hands rim highlight
      if (heroMode && animatedParts.throatIndicator) {
        const tMat = animatedParts.throatIndicator
          .material as THREE.MeshStandardMaterial;
        const targetHex = isBlockedPreview
          ? 0xe9a23b
          : isHighlightThroat
          ? 0x5ce2ea
          : 0x13b8b0;
        _scratchColor.setHex(targetHex);
        tMat.color.lerp(_scratchColor, 0.14);
        tMat.emissive.lerp(_scratchColor, 0.14);
        tMat.emissiveIntensity = isBlockedPreview || isHighlightThroat ? 1.6 : 0.95;
        const dotScale =
          isReducedMotion
            ? 1
            : 1 +
              Math.sin(elapsed * (isBlockedPreview ? 5.2 : 2.6)) *
                (isBlockedPreview ? 0.24 : 0.1);
        animatedParts.throatIndicator.scale.setScalar(dotScale);
      }
      if (heroMode && animatedParts.handMat) {
        animatedParts.handMat.emissiveIntensity = THREE.MathUtils.damp(
          animatedParts.handMat.emissiveIntensity,
          isHighlightThroat ? 0.95 : 0.52,
          6,
          delta
        );
      }

      // Hero living airflow particles (trachea -> bronchi -> lungs)
      if (
        heroMode &&
        airflowPoints &&
        airflowPhases &&
        airflowSides &&
        !isReducedMotion
      ) {
        const posAttr = airflowPoints.geometry.getAttribute(
          'position'
        ) as THREE.BufferAttribute;
        const speed = isBlockedPreview ? 0.08 : 0.34;
        const pMat = airflowPoints.material as THREE.PointsMaterial;
        _scratchColor.setHex(isBlockedPreview ? 0xe9a23b : 0x5ce2ea);
        pMat.color.lerp(_scratchColor, 0.1);
        pMat.opacity = isHighlightLungs || isHighlightThroat ? 0.98 : 0.82;

        for (let i = 0; i < airflowPhases.length; i++) {
          airflowPhases[i] = (airflowPhases[i] + delta * speed) % 1;
          const p = airflowPhases[i];
          // Ping-pong breathe in (0..0.55) then out (0.55..1.0)
          const depth = p < 0.55 ? p / 0.55 : 1 - (p - 0.55) / 0.45;
          const side = airflowSides[i];
          let px = 0;
          let py = 0.96 - depth * 0.44;
          let pz = 0.04;
          if (depth > 0.48) {
            const branchT = (depth - 0.48) / 0.52;
            px = side * branchT * 0.15;
            py = 0.74 - branchT * 0.26;
            pz = 0.03 + Math.sin(branchT * Math.PI) * 0.02;
          }
          posAttr.setXYZ(i, px, py, pz);
        }
        posAttr.needsUpdate = true;
      }

      // Hero faint floating depth particles
      if (
        heroMode &&
        ambientPoints &&
        ambientBasePositions &&
        !isReducedMotion
      ) {
        const posAttr = ambientPoints.geometry.getAttribute(
          'position'
        ) as THREE.BufferAttribute;
        const count = posAttr.count;
        for (let i = 0; i < count; i++) {
          const bx = ambientBasePositions[i * 3];
          const by = ambientBasePositions[i * 3 + 1];
          const bz = ambientBasePositions[i * 3 + 2];
          const driftY = ((by + elapsed * 0.032 + i * 0.05) % 1.2) + 0.08;
          const swayX = bx + Math.sin(elapsed * 0.55 + i) * 0.025;
          posAttr.setXYZ(i, swayX, driftY, bz);
        }
        posAttr.needsUpdate = true;
      }

      // Diaphragm piston elevation during abdominal/sternal thrusts
      if (animatedParts.diaphragm) {
        const baseDiaY =
          (st.victim === 'nelly_infant'
            ? 0.52
            : st.victim === 'mostafa_child'
            ? 0.74
            : 1.0) * 0.33;
        animatedParts.diaphragm.position.y =
          baseDiaY + impulseCompression * 0.055 - breathWave * 0.25;
      }

      // Foreign Body Bolus Position & Expulsion Animation
      if (animatedParts.bolusMesh) {
        const bolusMat = animatedParts.bolusMesh
          .material as THREE.MeshStandardMaterial;
        if (heroMode) {
          // Subtle unobtrusive throat marker in hero mode (controlled by throatIndicator)
          animatedParts.bolusMesh.visible = false;
        } else if (isCleared) {
          animatedParts.bolusMesh.visible = true;
          animatedParts.bolusMesh.position.y = THREE.MathUtils.damp(
            animatedParts.bolusMesh.position.y,
            animatedParts.bolusBaseY + 0.19,
            4,
            delta
          );
          animatedParts.bolusMesh.position.z = THREE.MathUtils.damp(
            animatedParts.bolusMesh.position.z,
            0.22,
            4,
            delta
          );
          bolusMat.color.setHex(0x16a36a);
          bolusMat.emissive.setHex(0x16a36a);
        } else {
          animatedParts.bolusMesh.visible = true;
          const tapLift = Math.min(st.tapsCompleted, 5) * 0.018;
          const targetY =
            animatedParts.bolusBaseY + tapLift + impulseCompression * 0.035;
          animatedParts.bolusMesh.position.y = THREE.MathUtils.damp(
            animatedParts.bolusMesh.position.y,
            targetY,
            8,
            delta
          );
          animatedParts.bolusMesh.position.z = THREE.MathUtils.damp(
            animatedParts.bolusMesh.position.z,
            0.03,
            8,
            delta
          );
          bolusMat.color.setHex(0xdc5252);
          bolusMat.emissive.setHex(0x991b1b);
        }
      }

      // Subtle posture lean for Back Blows vs Upright Thrusts (Adult & Child)
      if (animatedParts.torsoPivot && st.victim !== 'nelly_infant') {
        if (heroMode) {
          // Hero upper-half bust: upright centered with gentle ±7° slow idle Y-rotation (static when reduced motion)
          animatedParts.torsoPivot.rotation.x = 0.03;
          animatedParts.torsoPivot.rotation.y = isReducedMotion
            ? 0
            : Math.sin(elapsed * 0.38) * THREE.MathUtils.degToRad(7);
        } else {
          const targetLeanX = isBackBlows
            ? 0.38
            : isAbdominal || isSternal
            ? 0.14
            : st.pose === 'severe_silent_choking'
            ? 0.18
            : 0.06;
          animatedParts.torsoPivot.rotation.x = THREE.MathUtils.damp(
            animatedParts.torsoPivot.rotation.x,
            targetLeanX - impulseCompression * 0.08,
            6,
            delta
          );
        }
      }

      // Reposition 3D Force Vector Arrow to active rescue landmark
      if (animatedParts.forceArrowGroup) {
        const scaleY =
          st.victim === 'nelly_infant'
            ? 0.52
            : st.victim === 'mostafa_child'
            ? 0.74
            : 1.0;
        const depth =
          st.victim === 'nelly_infant'
            ? 0.15
            : st.victim === 'mostafa_child'
            ? 0.17
            : 0.21;
        const oscillate = isReducedMotion
          ? 0
          : Math.sin(elapsed * 5) * 0.025 - impulseCompression * 0.05;

        if (isBackBlows) {
          animatedParts.forceArrowGroup.position.set(
            0,
            0.61 * scaleY,
            -(depth + 0.16 + oscillate)
          );
          animatedParts.forceArrowGroup.rotation.set(Math.PI / 2, 0, 0);
        } else if (
          st.victim === 'nelly_infant' ||
          st.victim === 'salma_pregnant' ||
          isSternal
        ) {
          animatedParts.forceArrowGroup.position.set(
            0,
            0.56 * scaleY,
            depth + 0.15 + oscillate
          );
          animatedParts.forceArrowGroup.rotation.set(-Math.PI / 2, 0, 0);
        } else {
          animatedParts.forceArrowGroup.position.set(
            0,
            0.25 * scaleY - oscillate * 0.4,
            depth + 0.15 + oscillate
          );
          animatedParts.forceArrowGroup.rotation.set(-Math.PI / 3, 0, 0);
        }
      }

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

    // Pause WebGL render loop automatically when scrolled off-screen OR when browser tab is hidden
    let isInViewport = true;
    let isTabHidden = typeof document !== 'undefined' ? document.hidden : false;
    let isLoopPaused = false;

    const resumeIfActive = () => {
      if (isInViewport && !isTabHidden && isLoopPaused && !isDisposed) {
        isLoopPaused = false;
        clock.getDelta();
        tick();
      }
    };

    const onVisibilityChange = () => {
      isTabHidden = document.hidden;
      if (!isTabHidden) {
        resumeIfActive();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const visibilityObserver =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              const visible = entries.some((e) => e.isIntersecting);
              isInViewport = visible;
              if (visible) {
                resumeIfActive();
              }
            },
            { threshold: 0.02 }
          )
        : null;
    visibilityObserver?.observe(container);

    tick();

    // 10. Responsive ResizeObserver (maintains upper-half bust framing in heroMode)
    const handleResize = () => {
      if (!container || isDisposed) return;
      const w = Math.max(container.clientWidth, 200);
      const h = Math.max(container.clientHeight, 200);
      camera.aspect = w / h;
      if (heroMode) {
        const heroDist = computeHeroCameraDist(w / h);
        controls.minDistance = heroDist;
        controls.maxDistance = heroDist;
        controls.target.set(0, 0.72, 0);
        camera.position.set(0.0, 0.72, heroDist);
        controls.update();
      }
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (!isDisposed) {
        renderer.render(scene, camera);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      isDisposed = true;
      if (particleInitTimer !== null) window.clearTimeout(particleInitTimer);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      visibilityObserver?.disconnect();
      resizeObserver.disconnect();
      domEl.removeEventListener('pointerdown', onPointerDown);
      domEl.removeEventListener('pointerup', onPointerUp);
      domEl.removeEventListener('pointermove', onPointerMove);
      particleSpriteTex?.dispose();
      controls.dispose();
      renderer.dispose();
    };
  }, [handleSelectRegion, handleDeliver3DImpulse, heroMode]);

  const toggleLayer = (key: keyof typeof layers) => {
    clinicalAudio.playInspectPing();
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePresetClick = (preset: CameraPresetId) => {
    clinicalAudio.playInspectPing();
    setActivePreset(preset);
    setSelectedRegionId(null);
    cameraCommandRef.current?.setPreset(preset);
  };

  const selectedRegionInfo = selectedRegionId
    ? ANATOMICAL_REGIONS[selectedRegionId]
    : null;

  const ageModels: {
    id: VictimCharacterId;
    label: { en: string; ar: string };
    ratio: string;
  }[] = [
    {
      id: 'youssef_adult',
      label: { en: 'Adult (34y)', ar: 'بالغ (٣٤ سنة)' },
      ratio: '1:7.5',
    },
    {
      id: 'salma_pregnant',
      label: { en: 'Pregnant (3rd Trim.)', ar: 'حامل (الثلث ٣)' },
      ratio: 'Sternal',
    },
    {
      id: 'mostafa_child',
      label: { en: 'Child (6y)', ar: 'طفل (٦ سنوات)' },
      ratio: '1:5.5',
    },
    {
      id: 'nelly_infant',
      label: { en: 'Infant (8m)', ar: 'رضيع (٨ أشهر)' },
      ratio: '1:4.0',
    },
  ];

  const quickRegions: { id: AnatomicalRegionId; label: { en: string; ar: string } }[] =
    [
      {
        id: 'larynx_airway',
        label: { en: 'Larynx & Airway', ar: 'الحنجرة والمجرى' },
      },
      {
        id: 'foreign_body',
        label: { en: 'Foreign Body', ar: 'الجسم العالق' },
      },
      {
        id: 'lungs_bronchi',
        label: { en: 'Lungs & Bronchi', ar: 'الرئتان والشعب' },
      },
      {
        id: 'diaphragm_dome',
        label: { en: 'Diaphragm', ar: 'الحجاب الحاجز' },
      },
      {
        id: 'landmark_back_blows',
        label: { en: '5 Back Blows Zone', ar: 'منطقة الضربات الظهرية' },
      },
      {
        id:
          victim === 'nelly_infant' || victim === 'salma_pregnant'
            ? 'landmark_sternal_thrust'
            : 'landmark_abdominal_thrust',
        label:
          victim === 'nelly_infant' || victim === 'salma_pregnant'
            ? { en: 'Sternal Thrust Zone', ar: 'منطقة ضغطات القص' }
            : { en: 'Abdominal J-Thrust', ar: 'منطقة ضغطات البطن' },
      },
      {
        id: 'hazard_zone',
        label: { en: 'Contraindicated Zone', ar: 'المنطقة المحظورة' },
      },
    ];

  return (
    <div
      className={`relative w-full h-full select-none overflow-hidden ${
        heroMode ? 'bg-transparent' : 'bg-[#071F2E]'
      }`}
    >
      {/* =================================================================== */}
      {/*DEDICATED WEBGL 3D CANVAS CONTAINER (Isolated Ref Outside React HUD) */}
      {/* =================================================================== */}
      <div
        ref={mountRef}
        className={`w-full h-full block ${
          heroMode ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'
        }`}
        aria-label={
          isAr
            ? 'نموذج ثلاثي الأبعاد تفاعلي للتشريح ومجرى التنفس'
            : 'Interactive 3D Anatomical Airway & First-Aid Model'
        }
      />

      {/* =================================================================== */}
      {/* TOP BAR: AGE-SPECIFIC 3D MODEL SELECTOR & 3D/2D VIEW SWITCHER       */}
      {/* =================================================================== */}
      {showInteractiveToolbar && !heroMode && (
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-1.5 bg-[#0B2D40] border border-[#285064] rounded-xl px-2.5 py-1.5 shadow-xl max-w-[96%]">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#19465B] text-[#43C7D1] text-[10px] font-extrabold">
            <Move3d className="w-3.5 h-3.5" />
            <span>{isAr ? 'نموذج 3D تفاعلي' : 'LIVE 3D MODEL'}</span>
          </span>

          {/* Age-Specific Model Selector Buttons (when allowed or in sandbox/hub) */}
          {onSelectVictim && (
            <div className="flex items-center gap-1">
              {ageModels.map((m) => {
                const active = victim === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      clinicalAudio.playInspectPing();
                      onSelectVictim(m.id);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer border whitespace-nowrap ${
                      active
                        ? 'bg-[#13B8B0] text-[#071F2E] border-[#43C7D1]'
                        : 'bg-[#123B50] text-[#A9C0CC] border-[#285064] hover:text-[#F3F7F8]'
                    }`}
                  >
                    {m.label[language]}
                  </button>
                );
              })}
            </div>
          )}

          {/* Simulate Thrust Impulse Action Button */}
          <button
            type="button"
            onClick={() => handleDeliver3DImpulse()}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-[#19465B] hover:bg-[#13B8B0] text-[#43C7D1] hover:text-[#071F2E] border border-[#43C7D1]/50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Zap className="w-3 h-3" />
            <span>
              {isAr
                ? `اختبار دفعة الضغط (${thrustImpulseCounter})`
                : `Test Pressure Surge (${thrustImpulseCounter})`}
            </span>
          </button>

          {/* Switch to 2D Medical Illustration Toggle */}
          {onToggleViewMode && (
            <button
              type="button"
              onClick={onToggleViewMode}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#123B50] hover:bg-[#19465B] text-[#F3F7F8] border border-[#285064] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Box className="w-3 h-3 text-[#43C7D1]" />
              <span>
                {isAr ? 'عرض الرسم الطبي 2D' : 'Switch to 2D Illustration'}
              </span>
            </button>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* SELECTED 3D ANATOMICAL REGION EDUCATIONAL POPOVER DRAWER            */}
      {/* =================================================================== */}
      {selectedRegionInfo && (
        <div className="absolute top-14 end-3 z-25 w-72 sm:w-80 bg-[#0B2D40] border-2 border-[#43C7D1] rounded-2xl p-4 text-[#F3F7F8] shadow-2xl space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {selectedRegionInfo.category === 'hazard' ? (
                <ShieldAlert className="w-4 h-4 text-[#DC5252] shrink-0" />
              ) : selectedRegionInfo.category === 'landmark' ? (
                <Target className="w-4 h-4 text-[#43C7D1] shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-[#13B8B0] shrink-0" />
              )}
              <h4 className="text-xs sm:text-sm font-extrabold text-[#F3F7F8]">
                {selectedRegionInfo.title[language]}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setSelectedRegionId(null)}
              className="p-1 rounded-lg bg-[#123B50] hover:bg-[#19465B] text-[#A9C0CC] hover:text-[#F3F7F8] cursor-pointer"
              aria-label={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-[#A9C0CC] leading-relaxed">
            {selectedRegionInfo.summary[language]}
          </p>

          <div
            className={`p-2.5 rounded-xl border text-[11px] font-semibold leading-relaxed ${
              selectedRegionInfo.category === 'hazard'
                ? 'bg-[#DC5252]/15 border-[#DC5252]/50 text-[#F3F7F8]'
                : 'bg-[#123B50] border-[#13B8B0]/50 text-[#43C7D1]'
            }`}
          >
            <div className="font-extrabold mb-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isAr
                  ? 'البروتوكول السريري المعتمد:'
                  : 'Verified Clinical Guideline:'}
              </span>
            </div>
            {selectedRegionInfo.clinicalProtocol[language]}
          </div>

          {(selectedRegionInfo.category === 'landmark' ||
            selectedRegionInfo.category === 'hazard') && (
            <button
              type="button"
              onClick={() => handleDeliver3DImpulse(selectedRegionInfo.id)}
              className="w-full py-2 px-3 rounded-xl text-xs font-extrabold bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>
                {isAr
                  ? 'تطبيق المناورة على هذا المعلم التشريحي'
                  : 'Apply Maneuver on This 3D Landmark'}
              </span>
            </button>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* STAGE 2 OVERLAY: INTERACTIVE CLINICAL SIGN HOTSPOTS                 */}
      {/* =================================================================== */}
      {assessMode && hotspots.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-15">
          {hotspots.map((spot, idx) => {
            const inspected = inspectedHotspotIds.includes(spot.id);
            const targetRegion: AnatomicalRegionId =
              idx === 0
                ? 'larynx_airway'
                : idx === 1
                ? 'foreign_body'
                : 'lungs_bronchi';
            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => {
                  handleSelectRegion(targetRegion);
                  onInspectHotspot?.(spot.id);
                }}
                style={{
                  left: `${spot.xPct}%`,
                  top: `${spot.yPct}%`,
                }}
                className={`pointer-events-auto -translate-x-1/2 -translate-y-1/2 absolute group flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xl ${
                  inspected
                    ? 'bg-[#16A36A] text-[#F3F7F8] border-2 border-[#F3F7F8]'
                    : 'bg-[#0B2D40] text-[#F3F7F8] border-2 border-[#43C7D1] hover:bg-[#19465B] hover:scale-105'
                }`}
              >
                {inspected ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-[#43C7D1] shrink-0" />
                )}
                <span className="whitespace-nowrap">
                  {idx + 1}. {spot.label[language]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* =================================================================== */}
      {/* STAGE 4 OVERLAY: 3D LANDMARK VERIFICATION & RHYTHM EXECUTION        */}
      {/* =================================================================== */}
      {microInteraction &&
        microInteraction.active &&
        microInteraction.type !== 'none' &&
        microInteraction.step !== 'completed' && (
          <div className="absolute inset-x-0 bottom-14 flex flex-col items-center justify-end p-3 z-25 pointer-events-none">
            <div className="pointer-events-auto bg-[#0B2D40] border-2 border-[#43C7D1] rounded-2xl p-4 max-w-lg w-full text-[#F3F7F8] space-y-3 shadow-2xl">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#43C7D1]">
                  <Hand className="w-4 h-4" />
                  <span>
                    {microInteraction.step === 'place_hands'
                      ? isAr
                        ? 'الخطوة ١: اضغط على المعلم التشريحي على المجسم 3D أو اختر أدناه'
                        : 'Step 1: Click the 3D Anatomical Landmark or Select Below'
                      : isAr
                      ? 'الخطوة ٢: نفّذ ٥ دفعات إسعافية وراقب حركة الجسم الغريب 3D'
                      : 'Step 2: Deliver 5 Rescue Thrusts & Watch 3D Bolus Expulsion'}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={microInteraction.onSkipMicro}
                  className="text-xs font-semibold text-[#A9C0CC] hover:text-[#F3F7F8] underline cursor-pointer"
                >
                  {isAr ? 'تشغيل تلقائي' : 'Auto-Play / Skip'}
                </button>
              </div>

              {microInteraction.step === 'place_hands' ? (
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      cameraCommandRef.current?.triggerThrustPulse();
                      microInteraction.onPlaceHands(true);
                    }}
                    className="w-full text-start px-3.5 py-2 rounded-xl bg-[#19465B] hover:bg-[#13B8B0] hover:text-[#071F2E] border border-[#43C7D1]/50 text-xs font-bold text-[#F3F7F8] transition-colors cursor-pointer"
                  >
                    {microInteraction.type === 'infant_5_5'
                      ? isAr
                        ? '✓ بين لوحي الكتف ثم إصبعان بمنتصف القص أسفل خط الحلمتين'
                        : '✓ Between shoulder blades, then 2 fingers on sternum below nipple line'
                      : microInteraction.type === 'chest_thrusts_5' ||
                        microInteraction.type === 'cpr_compressions'
                      ? isAr
                        ? '✓ في منتصف عظمة القص بالصدر تماماً'
                        : '✓ Squarely on the center of the chest (sternum)'
                      : isAr
                      ? '✓ في خط المنتصف فوق السرة مباشرة وأسفل عظمة القص'
                      : '✓ Midline just above the navel and well below the sternum'}
                  </button>

                  <button
                    type="button"
                    onClick={() => microInteraction.onPlaceHands(false)}
                    className="w-full text-start px-3.5 py-2 rounded-xl bg-[#123B50] hover:bg-[#19465B] border border-[#285064] text-xs font-semibold text-[#A9C0CC] transition-colors cursor-pointer"
                  >
                    {microInteraction.type === 'infant_5_5'
                      ? isAr
                        ? 'على بطن الرضيع اللين فوق السرة'
                        : 'On the infant’s soft abdomen above the navel'
                      : isAr
                      ? 'فوق الطرف العظمي السفلي للقص (الناتئ الخنجري) أو الأضلاع'
                      : 'Directly over the lower breastbone tip (xiphoid) or ribs'}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: microInteraction.tapsRequired }).map(
                      (_, i) => {
                        const done = i < microInteraction.tapsCompleted;
                        return (
                          <div
                            key={i}
                            className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center tabular-nums transition-all ${
                              done
                                ? 'bg-[#16A36A] text-[#F3F7F8] border border-[#F3F7F8]'
                                : 'bg-[#123B50] text-[#A9C0CC] border border-[#285064]'
                            }`}
                          >
                            {done ? '✓' : i + 1}
                          </div>
                        );
                      }
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      cameraCommandRef.current?.triggerThrustPulse();
                      microInteraction.onTapRhythm();
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#13B8B0] hover:bg-[#43C7D1] active:scale-95 text-[#071F2E] font-extrabold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {isAr
                        ? `نفّذ الدفعة 3D (${microInteraction.tapsCompleted + 1}/${
                            microInteraction.tapsRequired
                          })`
                        : `Deliver 3D Thrust (${microInteraction.tapsCompleted + 1}/${
                            microInteraction.tapsRequired
                          })`}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      {/* =================================================================== */}
      {/* COLLAPSIBLE BOTTOM 3D CONTROL DOCK (No backdrop-filter over WebGL)  */}
      {/* =================================================================== */}
      {showInteractiveToolbar && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 w-[96%] max-w-4xl pointer-events-none flex flex-col items-center">
          {/* Collapse / Expand Handle */}
          <button
            type="button"
            onClick={() => setDockCollapsed((c) => !c)}
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-t-xl bg-[#0B2D40] border border-b-0 border-[#285064] text-[10px] font-extrabold text-[#43C7D1] hover:text-[#F3F7F8] cursor-pointer"
          >
            {dockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>
                  {isAr
                    ? 'إظهار أدوات التحكم بالنموذج 3D والطبقات التشريحية'
                    : 'Show 3D Camera & Anatomical Layer Controls'}
                </span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>
                  {isAr ? 'طيّ شريط التحكم 3D' : 'Hide 3D Controls'}
                </span>
              </>
            )}
          </button>

          {!dockCollapsed && (
            <div className="pointer-events-auto w-full bg-[#0B2D40] border border-[#285064] rounded-2xl p-2.5 shadow-2xl space-y-2">
              {/* Row 1: Camera Orbit, Zoom, Angle Presets & Anatomical Layer Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Camera Orbit / Zoom / Reset Controls */}
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => cameraCommandRef.current?.orbitBy(-0.35, 0)}
                    title={isAr ? 'تدوير لليسار' : 'Rotate Left'}
                    className="p-1.5 rounded-lg bg-[#123B50] hover:bg-[#19465B] text-[#F3F7F8] border border-[#285064] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#43C7D1]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraCommandRef.current?.orbitBy(0.35, 0)}
                    title={isAr ? 'تدوير لليمين' : 'Rotate Right'}
                    className="p-1.5 rounded-lg bg-[#123B50] hover:bg-[#19465B] text-[#F3F7F8] border border-[#285064] cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-[#43C7D1]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraCommandRef.current?.zoomBy(0.82)}
                    title={isAr ? 'تكبير (+)' : 'Zoom In (+)'}
                    className="p-1.5 rounded-lg bg-[#123B50] hover:bg-[#19465B] text-[#F3F7F8] border border-[#285064] cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-[#43C7D1]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraCommandRef.current?.zoomBy(1.22)}
                    title={isAr ? 'تصغير (-)' : 'Zoom Out (-)'}
                    className="p-1.5 rounded-lg bg-[#123B50] hover:bg-[#19465B] text-[#F3F7F8] border border-[#285064] cursor-pointer"
                  >
                    <ZoomOut className="w-3.5 h-3.5 text-[#43C7D1]" />
                  </button>

                  {/* Camera Presets */}
                  {(
                    [
                      {
                        id: 'anterior',
                        en: 'Front',
                        ar: 'أمامي',
                      },
                      {
                        id: 'lateral',
                        en: 'Side',
                        ar: 'جانبي',
                      },
                      {
                        id: 'dorsal',
                        en: 'Back Blows',
                        ar: 'خلفي (الظهر)',
                      },
                      {
                        id: 'airway',
                        en: 'Airway Zoom',
                        ar: 'مجرى الهواء',
                      },
                    ] as const
                  ).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePresetClick(p.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                        activePreset === p.id
                          ? 'bg-[#19465B] text-[#43C7D1] border-[#43C7D1]'
                          : 'bg-[#123B50] text-[#A9C0CC] border-[#285064] hover:text-[#F3F7F8]'
                      }`}
                    >
                      {isAr ? p.ar : p.en}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => handlePresetClick('anterior')}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[#071F2E] hover:bg-[#19465B] text-[#F3F7F8] border border-[#285064] cursor-pointer whitespace-nowrap"
                  >
                    {isAr ? 'إعادة ضبط الكاميرا' : 'Reset View'}
                  </button>
                </div>

                {/* Anatomical Layer Toggle Switches */}
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[10px] font-bold text-[#A9C0CC] hidden sm:inline-flex items-center gap-1 me-1">
                    <Layers className="w-3 h-3 text-[#13B8B0]" />
                    <span>{isAr ? 'الطبقات:' : 'Layers:'}</span>
                  </span>
                  {(
                    [
                      {
                        key: 'bodyShell',
                        en: 'Body Shell',
                        ar: 'الجسم الخارجي',
                      },
                      {
                        key: 'airwayBolus',
                        en: 'Airway & Bolus',
                        ar: 'القصبة والجسم العالق',
                      },
                      {
                        key: 'lungsRibcage',
                        en: 'Lungs & Ribs',
                        ar: 'الرئتان والقفص',
                      },
                      {
                        key: 'rescueLandmarks',
                        en: 'Rescue Landmarks',
                        ar: 'معالم الإنقاذ',
                      },
                    ] as const
                  ).map((layer) => {
                    const active = layers[layer.key];
                    return (
                      <button
                        key={layer.key}
                        type="button"
                        onClick={() => toggleLayer(layer.key)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-extrabold border transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-[#13B8B0] text-[#071F2E] border-[#43C7D1]'
                            : 'bg-[#071F2E] text-[#A9C0CC] border-[#285064] hover:text-[#F3F7F8]'
                        }`}
                      >
                        {isAr ? layer.ar : layer.en}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Interactive Anatomical Region Selection Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-[#285064]/80">
                <span className="text-[10px] font-extrabold text-[#43C7D1] whitespace-nowrap shrink-0">
                  {isAr ? 'افحص منطقة تشريحية:' : 'Inspect 3D Region:'}
                </span>
                {quickRegions.map((reg) => {
                  const isSel = selectedRegionId === reg.id;
                  return (
                    <button
                      key={reg.id}
                      type="button"
                      onClick={() => handleSelectRegion(reg.id)}
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isSel
                          ? 'bg-[#19465B] text-[#43C7D1] border-[#43C7D1]'
                          : 'bg-[#123B50] text-[#F3F7F8] border-[#285064] hover:border-[#13B8B0]'
                      }`}
                    >
                      {reg.label[language]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
