import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Pause,
  Play,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Language } from '../types/nafas';
import {
  buildAnatomicalBronchialTreeParts,
  buildAnatomicalTorsoGeometry,
  buildAnatomicalUpperArmGeometry,
  buildDiaphragmGeometry,
  buildLarynxAndTracheaParts,
  buildSculptedLungGeometry,
  buildThoracicCageParts,
} from './respiratory3d/anatomyGeometry';
import {
  createAirwayGradientMaterial,
  createBoneXRayMaterial,
  createDiaphragmFresnelMaterial,
  createOrbitalRingShaderMaterial,
  createRadialGlowTexture,
  createRefinedLungMaterial,
  createRefinedTorsoMaterial,
} from './respiratory3d/anatomyShaders';

export type HeroAnatomyStructureId =
  | 'trachea_larynx'
  | 'bronchial_tree'
  | 'lungs'
  | 'ribcage_sternum'
  | 'diaphragm';

interface StructureEduInfo {
  id: HeroAnatomyStructureId;
  title: { ar: string; en: string };
  subtitle: { ar: string; en: string };
  description: { ar: string; en: string };
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  anchorPoint: [number, number, number];
  calloutPoint: [number, number, number];
}

export const HERO_ANATOMY_STRUCTURES: Record<
  HeroAnatomyStructureId,
  StructureEduInfo
> = {
  trachea_larynx: {
    id: 'trachea_larynx',
    title: {
      ar: 'القصبة الهوائية والحنجرة',
      en: 'Trachea & Larynx',
    },
    subtitle: {
      ar: 'المجرى التنفسي العلوي والمركزي',
      en: 'Upper & central conducting airway',
    },
    description: {
      ar: 'أنبوب مدعوم بحلقات غضروفية على شكل حرف C ينقل الهواء من الحنجرة إلى الرئتين، وهو الموضع الأساسي الذي يحدث فيه انسداد الجسم الغريب أثناء الاختناق.',
      en: 'A C-ringed cartilaginous airway conducting air from the larynx to the lungs — the primary site of foreign-body obstruction during choking.',
    },
    cameraPos: [0.30, 0.44, 1.62],
    cameraTarget: [0, 0.36, 0.03],
    anchorPoint: [0.025, 0.46, 0.035],
    calloutPoint: [0.27, 0.56, 0.11],
  },
  bronchial_tree: {
    id: 'bronchial_tree',
    title: {
      ar: 'الشعب الهوائية الرئيسية',
      en: 'Main Bronchi & Tree',
    },
    subtitle: {
      ar: 'تفرع المجرى الهوائي عند الجؤجؤ',
      en: 'Carinal bifurcation & lobar airways',
    },
    description: {
      ar: 'تنقسم القصبة الهوائية عند الجؤجؤ إلى شعبتين رئيسيتين يمنى (أقصر وأكثر استقامة) ويسرى، وتتفرعان إلى شعب فصّية وقُطَيعية توزع الهواء داخل الرئتين.',
      en: 'At the carina, the trachea splits into right (shorter, steeper) and left mainstem bronchi, branching into lobar and segmental airways inside each lung.',
    },
    cameraPos: [0.22, 0.09, 1.66],
    cameraTarget: [0, 0.05, 0.03],
    anchorPoint: [-0.068, 0.21, 0.028],
    calloutPoint: [-0.34, 0.34, 0.13],
  },
  lungs: {
    id: 'lungs',
    title: {
      ar: 'الرئتان (اليمنى واليسرى)',
      en: 'Lungs (Right & Left)',
    },
    subtitle: {
      ar: 'أعضاء تبادل الغازات ومخزون الهواء',
      en: 'Gas exchange organs & air reservoir',
    },
    description: {
      ar: 'تتكوّن الرئة اليمنى من ٣ فصوص واليسرى من فصين مع الثلمة القلبية. يحتفظان بهواء متبقٍّ يُضغط أثناء الإسعافات الأولية للمساعدة على طرد الجسم العالق.',
      en: 'The right lung has 3 lobes and the left has 2 lobes with a cardiac notch. Both retain residual air compressed during rescue maneuvers to expel a blockage.',
    },
    cameraPos: [0.38, 0.04, 1.98],
    cameraTarget: [0, 0.02, 0.02],
    anchorPoint: [0.19, 0.20, 0.10],
    calloutPoint: [0.43, 0.36, 0.16],
  },
  ribcage_sternum: {
    id: 'ribcage_sternum',
    title: {
      ar: 'القفص الصدري وعظمة القص',
      en: 'Rib Cage & Sternum',
    },
    subtitle: {
      ar: 'الهيكل العظمي الحامي للصدر',
      en: 'Thoracic protective skeletal cage',
    },
    description: {
      ar: '١٢ زوجاً من الضلوع وغضاريفها المتصلة بعظمة القص تحمي الرئتين والقلب وتتحرك بلطف مع التنفس، وتُعد عظمة القص معلماً أساسياً في ضغطات الصدر.',
      en: 'Twelve pairs of ribs and costal cartilages joined to the sternum protect the lungs and heart, expand subtly with breathing, and guide chest-thrust landmarks.',
    },
    cameraPos: [-0.52, 0.06, 2.04],
    cameraTarget: [0, 0.04, 0.02],
    anchorPoint: [-0.27, 0.22, 0.13],
    calloutPoint: [-0.45, 0.38, 0.18],
  },
  diaphragm: {
    id: 'diaphragm',
    title: {
      ar: 'الحجاب الحاجز',
      en: 'Thoracic Diaphragm',
    },
    subtitle: {
      ar: 'العضلة الرئيسية للتنفس',
      en: 'Primary respiratory muscle dome',
    },
    description: {
      ar: 'قبة عضلية تفصل التجويف الصدري عن البطني، تنقبض وتهبط بسلاسة أثناء الشهيق، ويرتفع ضغطها للأعلى أثناء الضغطات البطنية للمساعدة على فتح المجرى.',
      en: 'A dome-shaped muscle separating thorax and abdomen; it contracts downward gently on inhalation and elevates during abdominal thrusts to raise airway pressure.',
    },
    cameraPos: [0.34, -0.18, 1.82],
    cameraTarget: [0, -0.22, 0.03],
    anchorPoint: [0.12, -0.15, 0.09],
    calloutPoint: [0.39, -0.04, 0.16],
  },
};

export interface HeroRespiratoryModel3DProps {
  language: Language;
  className?: string;
}

// Pre-allocated scratch helpers outside the animation loop (Zero GC)
const _scratchVec3 = new THREE.Vector3();
const _airflowPt = new THREE.Vector3();
const _leaderA = new THREE.Vector3();
const _leaderMid = new THREE.Vector3();
const _leaderC = new THREE.Vector3();
const _leaderDir = new THREE.Vector3();
const _unitY = new THREE.Vector3(0, 1, 0);

/**
 * Physiological quiet adult breathing waveform [0..1]:
 * ~4.6 s cycle (~13 breaths/min): smooth active inspiration (40%) followed by
 * slower passive elastic recoil expiration (60%). Educational, calm, never jerky.
 */
function evaluateQuietBreath(tSec: number): number {
  const cycleSec = 4.8;
  const phase = (((tSec % cycleSec) + cycleSec) % cycleSec) / cycleSec;
  if (phase < 0.40) {
    const u = phase / 0.40;
    return 0.5 - 0.5 * Math.cos(u * Math.PI);
  }
  const u = (phase - 0.40) / 0.60;
  return Math.pow(0.5 + 0.5 * Math.cos(u * Math.PI), 1.25);
}

// ============================================================================
// MAIN INTERACTIVE HERO RESPIRATORY 3D COMPONENT
// ============================================================================

export const HeroRespiratoryModel3D: React.FC<HeroRespiratoryModel3DProps> = ({
  language,
  className = '',
}) => {
  const isAr = language === 'ar';
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [selectedId, setSelectedId] = useState<HeroAnatomyStructureId | null>(null);
  const [hoveredId, setHoveredId] = useState<HeroAnatomyStructureId | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return true;
    return !(
      document.documentElement.classList.contains('reduced-motion') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  });
  const [controlsExpanded, setControlsExpanded] = useState<boolean>(false);
  const [webglUnavailable, setWebglUnavailable] = useState<boolean>(false);
  const [layers, setLayers] = useState({
    body: true,
    ribcage: true,
    lungs: true,
    airway: true,
    hologram: true,
  });

  // Mutable ref read inside the Three.js loop without tearing down WebGL
  const stateRef = useRef({
    selectedId,
    hoveredId,
    isPlaying,
    layers,
    cameraGoalPos: null as THREE.Vector3 | null,
    cameraGoalTarget: null as THREE.Vector3 | null,
    resetRootRot: false,
  });

  useEffect(() => {
    stateRef.current.selectedId = selectedId;
    stateRef.current.hoveredId = hoveredId;
    stateRef.current.isPlaying = isPlaying;
    stateRef.current.layers = layers;
  }, [selectedId, hoveredId, isPlaying, layers]);

  const cmdRef = useRef<{
    zoomBy: (factor: number) => void;
    resetCamera: () => void;
    focusStructure: (id: HeroAnatomyStructureId) => void;
    syncVisibility: () => void;
  } | null>(null);

  const handleSelectStructure = useCallback(
    (id: HeroAnatomyStructureId | null) => {
      stateRef.current.selectedId = id;
      setSelectedId(id);
      if (id) {
        setControlsExpanded(false);
        cmdRef.current?.focusStructure(id);
      } else {
        cmdRef.current?.resetCamera();
      }
    },
    []
  );

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software-WebGL detection (GPU renderer string only, per threejs skill)
    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2') || probe.getContext('webgl');
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

    const initialReducedMotion =
      document.documentElement.classList.contains('reduced-motion') ||
      (typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    const width = Math.max(container.clientWidth, 260);
    const height = Math.max(container.clientHeight, 260);

    const scene = new THREE.Scene();

    const defaultCamTarget = new THREE.Vector3(0, 0.11, 0);
    const computeDefaultDist = (aspect: number) =>
      Math.max(2.30, 2.22 / Math.max(aspect, 0.65));
    const defaultDist = computeDefaultDist(width / height);

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 40);
    camera.position.set(0.0, 0.14, defaultDist);

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
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.setSize(width, height);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Studio Environment Reflection (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    // 3. Controlled Medical Lighting Rig (Clean focal respiratory light + Cool cyan/cobalt studio)
    const hemiLight = new THREE.HemisphereLight(0x88e6ff, 0x051a2c, 1.1);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xf2faff, 1.55);
    keyLight.position.set(2.2, 2.8, 3.2);
    scene.add(keyLight);

    const rimCyanLight = new THREE.DirectionalLight(0x38d2ff, 2.0);
    rimCyanLight.position.set(-2.4, 1.6, -2.0);
    scene.add(rimCyanLight);

    const lungWarmLight = new THREE.PointLight(0xff7242, 2.35, 3.0, 1.5);
    lungWarmLight.position.set(0, 0.14, 0.18);
    scene.add(lungWarmLight);

    // 4. Real Interactive OrbitControls (360° drag + mobile pinch-to-zoom; page scroll stays free)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.065;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 1.26;
    controls.maxDistance = 3.30;
    controls.minPolarAngle = Math.PI * 0.22;
    controls.maxPolarAngle = Math.PI * 0.76;
    controls.touches.ONE = THREE.TOUCH.ROTATE;
    controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
    controls.target.copy(defaultCamTarget);

    // Let normal mouse wheel scroll the page smoothly; allow Ctrl/Meta+wheel or pinch/buttons to zoom
    const onWheelGuard = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        e.stopImmediatePropagation();
      }
    };
    renderer.domElement.addEventListener('wheel', onWheelGuard, { capture: true, passive: true });

    let userInteracting = false;
    controls.addEventListener('start', () => {
      userInteracting = true;
      stateRef.current.cameraGoalPos = null;
      stateRef.current.cameraGoalTarget = null;
      stateRef.current.resetRootRot = false;
    });
    controls.addEventListener('end', () => {
      userInteracting = false;
    });

    // =========================================================================
    // 5. HIERARCHICAL ANATOMICAL SCENE GRAPH
    // =========================================================================
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const bodyShellGroup = new THREE.Group();
    const ribcageGroup = new THREE.Group();
    const airwayGroup = new THREE.Group();
    const bronchialGroupWrapper = new THREE.Group();
    const lungsGroup = new THREE.Group();
    const diaphragmGroup = new THREE.Group();
    const calloutGroup = new THREE.Group();
    const hologramGroup = new THREE.Group();

    // Pivot breathing groups around thoracic center (0, 0.13, 0) for anatomically realistic expansion
    const thoracicPivotY = 0.13;
    lungsGroup.position.set(0, thoracicPivotY, 0);
    bronchialGroupWrapper.position.set(0, thoracicPivotY, 0);
    ribcageGroup.position.set(0, thoracicPivotY, 0);

    const lungsInner = new THREE.Group();
    lungsInner.position.set(0, -thoracicPivotY, 0);
    lungsGroup.add(lungsInner);

    const bronchialInner = new THREE.Group();
    bronchialInner.position.set(0, -thoracicPivotY, 0);
    bronchialGroupWrapper.add(bronchialInner);

    const ribcageInner = new THREE.Group();
    ribcageInner.position.set(0, -thoracicPivotY, 0);
    ribcageGroup.add(ribcageInner);

    rootGroup.add(bodyShellGroup);
    rootGroup.add(ribcageGroup);
    rootGroup.add(airwayGroup);
    rootGroup.add(bronchialGroupWrapper);
    rootGroup.add(lungsGroup);
    rootGroup.add(diaphragmGroup);
    rootGroup.add(calloutGroup);
    scene.add(hologramGroup);

    const clickableMeshes: THREE.Object3D[] = [];
    const registerClickable = (
      obj: THREE.Object3D,
      structureId: HeroAnatomyStructureId
    ) => {
      obj.userData.structureId = structureId;
      obj.traverse((c) => {
        c.userData.structureId = structureId;
      });
      clickableMeshes.push(obj);
    };

    // --- A. TRANSLUCENT MEDICAL GLASS UPPER TORSO + SEAMLESS DELTOID ARMS ---
    const torsoFrontMat = createRefinedTorsoMaterial(false, 0);
    const torsoBackMat = createRefinedTorsoMaterial(true, 0);
    const torsoMats: THREE.ShaderMaterial[] = [torsoFrontMat, torsoBackMat];

    const torsoGeo = buildAnatomicalTorsoGeometry();
    const torsoBackMesh = new THREE.Mesh(torsoGeo, torsoBackMat);
    torsoBackMesh.renderOrder = 1;
    const torsoFrontMesh = new THREE.Mesh(torsoGeo, torsoFrontMat);
    torsoFrontMesh.renderOrder = 9;
    bodyShellGroup.add(torsoBackMesh, torsoFrontMesh);

    ([-1, 1] as const).forEach((side) => {
      const armGeo = buildAnatomicalUpperArmGeometry(side);
      const armFrontMat = createRefinedTorsoMaterial(false, side);
      const armBackMat = createRefinedTorsoMaterial(true, side);
      torsoMats.push(armFrontMat, armBackMat);
      const armBack = new THREE.Mesh(armGeo, armBackMat);
      armBack.renderOrder = 1;
      const armFront = new THREE.Mesh(armGeo, armFrontMat);
      armFront.renderOrder = 9;
      bodyShellGroup.add(armBack, armFront);
    });

    // --- B. ANATOMICALLY COHERENT THORACIC CAGE (Posterior/Anterior Depth Split + Pearlescent X-Ray) ---
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
      rimAlpha: 0.52,
      specularStrength: 0.58,
      additive: true,
    });
    const cartilageMat = createBoneXRayMaterial({
      coreHex: 0x249ec4,
      rimHex: 0x9ef4ff,
      baseAlpha: 0.16,
      rimAlpha: 0.44,
      specularStrength: 0.42,
      additive: true,
    });
    const sternumMat = createBoneXRayMaterial({
      coreHex: 0x2484be,
      rimHex: 0xa2f0ff,
      baseAlpha: 0.14,
      rimAlpha: 0.44,
      specularStrength: 0.46,
      additive: true,
    });
    const spineMat = createBoneXRayMaterial({
      coreHex: 0x165a92,
      rimHex: 0x5ccdf2,
      baseAlpha: 0.12,
      rimAlpha: 0.34,
      specularStrength: 0.24,
      isPosterior: true,
    });

    const cageParts = buildThoracicCageParts();

    const ribsBackMesh = new THREE.Mesh(cageParts.ribsBackGeometry, ribBackMat);
    ribsBackMesh.renderOrder = 2;
    const ribsFrontMesh = new THREE.Mesh(cageParts.ribsFrontGeometry, ribFrontMat);
    ribsFrontMesh.renderOrder = 7;
    const cartilageMesh = new THREE.Mesh(cageParts.cartilageGeometry, cartilageMat);
    cartilageMesh.renderOrder = 7;
    const claviclesMesh = new THREE.Mesh(cageParts.claviclesGeometry, ribFrontMat);
    claviclesMesh.renderOrder = 7;
    const sternumMesh = new THREE.Mesh(cageParts.sternumGeometry, sternumMat);
    sternumMesh.renderOrder = 7;
    const spineMesh = new THREE.Mesh(cageParts.spineGeometry, spineMat);
    spineMesh.renderOrder = 2;

    ribcageInner.add(
      ribsBackMesh,
      ribsFrontMesh,
      cartilageMesh,
      claviclesMesh,
      sternumMesh,
      spineMesh
    );
    registerClickable(ribsBackMesh, 'ribcage_sternum');
    registerClickable(ribsFrontMesh, 'ribcage_sternum');
    registerClickable(cartilageMesh, 'ribcage_sternum');
    registerClickable(claviclesMesh, 'ribcage_sternum');
    registerClickable(sternumMesh, 'ribcage_sternum');

    // --- C. SCULPTED LARYNX & C-RINGED TRACHEA (Cyan-to-Warm Gradient Shader) ---
    const tracheaMat = createAirwayGradientMaterial({
      isCartilage: false,
      baseOpacity: 0.94,
    });
    const cartilageRingMat = createAirwayGradientMaterial({
      isCartilage: true,
      baseOpacity: 0.97,
    });

    const tracheaParts = buildLarynxAndTracheaParts();
    const larynxTracheaMesh = new THREE.Mesh(
      tracheaParts.larynxTracheaGeometry,
      tracheaMat
    );
    larynxTracheaMesh.renderOrder = 5;
    const cRingsMesh = new THREE.Mesh(
      tracheaParts.cartilageRingsGeometry,
      cartilageRingMat
    );
    cRingsMesh.renderOrder = 5;

    airwayGroup.add(larynxTracheaMesh, cRingsMesh);
    registerClickable(larynxTracheaMesh, 'trachea_larynx');
    registerClickable(cRingsMesh, 'trachea_larynx');

    // --- D. ANATOMICALLY ASYMMETRIC 4-GENERATION BRONCHIAL TREE ---
    const mainBronchiMat = createAirwayGradientMaterial({
      isCartilage: false,
      isDistal: false,
      baseOpacity: 0.96,
    });
    const distalBronchiolesMat = createAirwayGradientMaterial({
      isCartilage: false,
      isDistal: true,
      baseOpacity: 0.93,
    });

    const bronchialParts = buildAnatomicalBronchialTreeParts();
    const mainBronchiMesh = new THREE.Mesh(
      bronchialParts.mainBronchiGeometry,
      mainBronchiMat
    );
    mainBronchiMesh.renderOrder = 5;
    const distalBronchiolesMesh = new THREE.Mesh(
      bronchialParts.distalBronchiolesGeometry,
      distalBronchiolesMat
    );
    distalBronchiolesMesh.renderOrder = 5;

    bronchialInner.add(mainBronchiMesh, distalBronchiolesMesh);
    registerClickable(mainBronchiMesh, 'bronchial_tree');
    registerClickable(distalBronchiolesMesh, 'bronchial_tree');

    // --- E. SCULPTED 3D MULTI-LOBED ANATOMICAL LUNGS (Visual Centerpiece) ---
    const lungOuterMat = createRefinedLungMaterial(false);
    const lungInnerCoreMat = createRefinedLungMaterial(true);

    const rightLungGeo = buildSculptedLungGeometry(-1, 1.0);
    const leftLungGeo = buildSculptedLungGeometry(1, 1.0);
    const rightCoreGeo = buildSculptedLungGeometry(-1, 0.78);
    const leftCoreGeo = buildSculptedLungGeometry(1, 0.78);

    const rightLungCore = new THREE.Mesh(rightCoreGeo, lungInnerCoreMat);
    rightLungCore.renderOrder = 4;
    const leftLungCore = new THREE.Mesh(leftCoreGeo, lungInnerCoreMat);
    leftLungCore.renderOrder = 4;

    const rightLungMesh = new THREE.Mesh(rightLungGeo, lungOuterMat);
    rightLungMesh.renderOrder = 6;
    const leftLungMesh = new THREE.Mesh(leftLungGeo, lungOuterMat);
    leftLungMesh.renderOrder = 6;

    lungsInner.add(rightLungCore, leftLungCore, rightLungMesh, leftLungMesh);
    registerClickable(rightLungMesh, 'lungs');
    registerClickable(leftLungMesh, 'lungs');

    // --- F. SCULPTED ASYMMETRIC THORACIC DIAPHRAGM ---
    const diaphragmMat = createDiaphragmFresnelMaterial();
    const diaphragmGeo = buildDiaphragmGeometry();
    const diaphragmMesh = new THREE.Mesh(diaphragmGeo, diaphragmMat);
    diaphragmMesh.position.set(0, -0.195, -0.012);
    diaphragmMesh.renderOrder = 3;
    diaphragmGroup.add(diaphragmMesh);
    registerClickable(diaphragmMesh, 'diaphragm');

    // --- G. CRISP 3D ANATOMICAL CONNECTION LEADER LINE (Visible on Structure Selection) ---
    const leaderTubeGeo = new THREE.CylinderGeometry(0.0026, 0.0026, 1, 8);
    const leaderTubeMat = new THREE.MeshBasicMaterial({
      color: 0x62ecff,
      transparent: true,
      opacity: 0.92,
      depthTest: false,
    });
    const leaderSeg1 = new THREE.Mesh(leaderTubeGeo, leaderTubeMat);
    leaderSeg1.renderOrder = 12;
    const leaderSeg2 = new THREE.Mesh(leaderTubeGeo, leaderTubeMat);
    leaderSeg2.renderOrder = 12;

    const anchorDotGeo = new THREE.SphereGeometry(0.0115, 14, 14);
    const anchorDotMat = new THREE.MeshBasicMaterial({
      color: 0xb8f8ff,
      transparent: true,
      opacity: 0.98,
      depthTest: false,
    });
    const anchorDot = new THREE.Mesh(anchorDotGeo, anchorDotMat);
    anchorDot.renderOrder = 13;

    const endDotGeo = new THREE.SphereGeometry(0.008, 12, 12);
    const endDot = new THREE.Mesh(endDotGeo, anchorDotMat);
    endDot.renderOrder = 13;

    const anchorHaloGeo = new THREE.RingGeometry(0.016, 0.024, 24);
    const anchorHaloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide,
      depthTest: false,
    });
    const anchorHalo = new THREE.Mesh(anchorHaloGeo, anchorHaloMat);
    anchorHalo.renderOrder = 13;

    const placeLeaderSegment = (
      mesh: THREE.Mesh,
      start: THREE.Vector3,
      end: THREE.Vector3
    ) => {
      _leaderDir.subVectors(end, start);
      const len = _leaderDir.length();
      if (len < 0.0001) {
        mesh.visible = false;
        return;
      }
      mesh.visible = true;
      mesh.position.copy(start).add(end).multiplyScalar(0.5);
      mesh.scale.set(1, len, 1);
      mesh.quaternion.setFromUnitVectors(_unitY, _leaderDir.normalize());
    };

    calloutGroup.add(leaderSeg1, leaderSeg2, anchorDot, endDot, anchorHalo);
    calloutGroup.visible = false;

    // --- H. SMOOTH LAMINAR AIRFLOW PARTICLES ALONG TRACHEA -> MAIN & LOBAR BRONCHI ---
    const glowTex = createRadialGlowTexture([
      { offset: 0, color: 'rgba(210, 252, 255, 1)' },
      { offset: 0.35, color: 'rgba(72, 220, 255, 0.76)' },
      { offset: 0.72, color: 'rgba(19, 184, 176, 0.16)' },
      { offset: 1, color: 'rgba(19, 184, 176, 0)' },
    ]);

    const airflowCount = 28;
    const airflowPositions = new Float32Array(airflowCount * 3);
    const airflowGeo = new THREE.BufferGeometry();
    airflowGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(airflowPositions, 3)
    );
    const airflowMat = new THREE.PointsMaterial({
      size: 0.021,
      map: glowTex,
      color: 0xa6f6ff,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const airflowPoints = new THREE.Points(airflowGeo, airflowMat);
    airflowPoints.renderOrder = 8;
    airwayGroup.add(airflowPoints);

    // --- I. RESTRAINED MEDICAL HOLOGRAM ENVIRONMENT: 1 SCAN RING + 1 SUBTLE DEPTH LINE + VOLUMETRIC GLOW ---
    const ringMat1 = createOrbitalRingShaderMaterial(0x46e8ff, 0.0, 0.68);
    const ringMat2 = createOrbitalRingShaderMaterial(0x1cc5c0, 2.6, 0.30);

    // Primary elegant circular scanning ring around the respiratory model
    const orbitRing1 = new THREE.Mesh(
      new THREE.TorusGeometry(0.67, 0.0032, 8, 96),
      ringMat1
    );
    orbitRing1.position.set(0, 0.14, 0);
    orbitRing1.rotation.set(Math.PI * 0.43, 0.26, -0.16);
    orbitRing1.renderOrder = 10;

    // Ultra-subtle secondary orbital depth line (hairline, tilted counter-plane)
    const orbitRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(0.74, 0.0016, 8, 96),
      ringMat2
    );
    orbitRing2.position.set(0, 0.12, 0);
    orbitRing2.rotation.set(Math.PI * 0.56, -0.32, 0.20);
    orbitRing2.renderOrder = 10;

    // Two restrained luminous scan beads traveling gently along the primary ring
    const beadSprites: {
      sprite: THREE.Sprite;
      ring: THREE.Mesh;
      radius: number;
      speed: number;
      angle: number;
    }[] = [];
    [
      { ring: orbitRing1, radius: 0.67, speed: 0.38, angle: 0.45 },
      { ring: orbitRing1, radius: 0.67, speed: 0.38, angle: 3.60 },
    ].forEach((cfg) => {
      const sMat = new THREE.SpriteMaterial({
        map: glowTex,
        color: 0xa4f6ff,
        transparent: true,
        opacity: 0.84,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const sp = new THREE.Sprite(sMat);
      sp.scale.set(0.050, 0.050, 1);
      sp.renderOrder = 11;
      cfg.ring.add(sp);
      beadSprites.push({ sprite: sp, ...cfg });
    });

    // Small, restrained ambient floating cyan airflow motes around the hologram
    const pCount = 26;
    const pPositions = new Float32Array(pCount * 3);
    const pBase = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const ang = (i / pCount) * Math.PI * 2 + (i % 5) * 0.43;
      const rad = 0.55 + (i % 7) * 0.038;
      const py = -0.28 + ((i * 0.19) % 0.94);
      const px = Math.cos(ang) * rad;
      const pz = Math.sin(ang) * rad * 0.68;
      pPositions[i * 3] = px;
      pPositions[i * 3 + 1] = py;
      pPositions[i * 3 + 2] = pz;
      pBase[i * 3] = px;
      pBase[i * 3 + 1] = py;
      pBase[i * 3 + 2] = pz;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.022,
      map: glowTex,
      color: 0x6eeeff,
      transparent: true,
      opacity: 0.46,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    particleCloud.renderOrder = 10;

    // Soft cyan volumetric lighting behind the torso + gentle ambient warm glow behind lungs
    const coolBackdropTex = createRadialGlowTexture([
      { offset: 0, color: 'rgba(48, 206, 255, 0.32)' },
      { offset: 0.44, color: 'rgba(18, 138, 194, 0.15)' },
      { offset: 1, color: 'rgba(7, 31, 46, 0)' },
    ]);
    const coolBackdropSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: coolBackdropTex,
        transparent: true,
        opacity: 0.94,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    coolBackdropSprite.position.set(0, 0.16, -0.36);
    coolBackdropSprite.scale.set(1.62, 1.62, 1);
    coolBackdropSprite.renderOrder = 0;

    const warmGlowTex = createRadialGlowTexture([
      { offset: 0, color: 'rgba(255, 138, 82, 0.42)' },
      { offset: 0.50, color: 'rgba(238, 88, 56, 0.16)' },
      { offset: 1, color: 'rgba(238, 88, 56, 0)' },
    ]);
    const warmCoreSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: warmGlowTex,
        transparent: true,
        opacity: 0.82,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    warmCoreSprite.position.set(0, 0.14, -0.06);
    warmCoreSprite.scale.set(0.84, 0.76, 1);
    warmCoreSprite.renderOrder = 2;
    lungsInner.add(warmCoreSprite);

    hologramGroup.add(
      coolBackdropSprite,
      orbitRing1,
      orbitRing2,
      particleCloud
    );

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // =========================================================================
    // 6. SMART ANATOMICAL RAYCASTING (Direct click for Lungs, Trachea, Main Bronchi, Rib Cage, Diaphragm)
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };

    const updatePointer = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const pickStructureFromRay = (): HeroAnatomyStructureId | null => {
      raycaster.setFromCamera(pointer, camera);
      const visibleClickables = clickableMeshes.filter((m) => {
        let cur: THREE.Object3D | null = m;
        while (cur) {
          if (!cur.visible) return false;
          cur = cur.parent;
        }
        return true;
      });
      const hits = raycaster.intersectObjects(visibleClickables, true);
      if (hits.length === 0) return null;

      // Prioritize direct trachea/larynx hits, and prioritize central carina/main-bronchi hits
      // even when the translucent lung surface sits slightly in front of them
      for (const hit of hits) {
        const sid = hit.object.userData.structureId as HeroAnatomyStructureId | undefined;
        if (sid === 'trachea_larynx') return 'trachea_larynx';
        if (sid === 'bronchial_tree' && hit.object === mainBronchiMesh) {
          return 'bronchial_tree';
        }
      }
      return (hits[0].object.userData.structureId as HeroAnatomyStructureId) || null;
    };

    const onPointerDown = (e: PointerEvent) => {
      downPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 7) return;
      updatePointer(e);
      const sId = pickStructureFromRay();
      if (sId) {
        handleSelectStructure(stateRef.current.selectedId === sId ? null : sId);
      }
    };

    let lastHoverCheck = 0;
    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverCheck < 55) return;
      lastHoverCheck = now;
      updatePointer(e);
      const sId = pickStructureFromRay();
      if (sId) {
        setHoveredId(sId);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredId(null);
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const domEl = renderer.domElement;
    domEl.style.cursor = 'grab';
    domEl.addEventListener('pointerdown', onPointerDown);
    domEl.addEventListener('pointerup', onPointerUp);
    domEl.addEventListener('pointermove', onPointerMove);

    // =========================================================================
    // 7. CAMERA COMMANDS (Zoom In/Out, Reset, Focus Structure)
    // =========================================================================
    cmdRef.current = {
      zoomBy: (factor: number) => {
        stateRef.current.cameraGoalPos = null;
        const offset = _scratchVec3.copy(camera.position).sub(controls.target);
        const targetDist = THREE.MathUtils.clamp(
          offset.length() * factor,
          controls.minDistance,
          controls.maxDistance
        );
        offset.setLength(targetDist);
        stateRef.current.cameraGoalPos = controls.target.clone().add(offset);
      },
      resetCamera: () => {
        const aspect =
          Math.max(container.clientWidth, 240) /
          Math.max(container.clientHeight, 240);
        const dist = computeDefaultDist(aspect);
        stateRef.current.cameraGoalTarget = defaultCamTarget.clone();
        stateRef.current.cameraGoalPos = new THREE.Vector3(0.0, 0.14, dist);
        stateRef.current.resetRootRot = true;
      },
      focusStructure: (id: HeroAnatomyStructureId) => {
        const info = HERO_ANATOMY_STRUCTURES[id];
        if (!info) return;
        stateRef.current.cameraGoalTarget = new THREE.Vector3(
          ...info.cameraTarget
        );
        stateRef.current.cameraGoalPos = new THREE.Vector3(...info.cameraPos);
        stateRef.current.resetRootRot = false;
      },
      syncVisibility: () => {
        const l = stateRef.current.layers;
        bodyShellGroup.visible = l.body;
        ribcageGroup.visible = l.ribcage;
        lungsGroup.visible = l.lungs;
        airwayGroup.visible = l.airway;
        bronchialGroupWrapper.visible = l.airway;
        diaphragmGroup.visible = l.lungs || l.airway;
        hologramGroup.visible = l.hologram;
        if (!isDisposed) {
          renderer.render(scene, camera);
        }
      },
    };

    // =========================================================================
    // 8. ANIMATION LOOP (Physiological Breathing + Software-WebGL fenceSync + Off-screen Pause)
    // =========================================================================
    const clock = new THREE.Clock();
    let animTime = 0.85; // Start near natural mid-inspiration for rich initial silhouette
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

      // Advance simulation clock ONLY when playing and not under reduced-motion
      if (st.isPlaying && !initialReducedMotion) {
        animTime += delta;
      }

      // Sync granular interactive layer visibility
      bodyShellGroup.visible = st.layers.body;
      ribcageGroup.visible = st.layers.ribcage;
      lungsGroup.visible = st.layers.lungs;
      airwayGroup.visible = st.layers.airway;
      bronchialGroupWrapper.visible = st.layers.airway;
      diaphragmGroup.visible = st.layers.lungs || st.layers.airway;
      hologramGroup.visible = st.layers.hologram;

      // Update crisp 3D anatomical leader tubes for active selection
      if (st.selectedId) {
        const info = HERO_ANATOMY_STRUCTURES[st.selectedId];
        _leaderA.set(...info.anchorPoint);
        _leaderC.set(...info.calloutPoint);
        _leaderMid.set(
          (_leaderA.x + _leaderC.x) * 0.56,
          _leaderC.y,
          (_leaderA.z + _leaderC.z) * 0.56
        );
        placeLeaderSegment(leaderSeg1, _leaderA, _leaderMid);
        placeLeaderSegment(leaderSeg2, _leaderMid, _leaderC);
        anchorDot.position.copy(_leaderA);
        endDot.position.copy(_leaderC);
        anchorHalo.position.copy(_leaderA);
        anchorHalo.lookAt(camera.position);
        calloutGroup.visible = true;
      } else {
        calloutGroup.visible = false;
      }

      // Smooth highlight & subtle dimming of unselected anatomical structures
      const activeFocus = st.selectedId || st.hoveredId;
      const dimOthers = st.selectedId !== null ? 0.36 : 1.0;

      const ribHl = activeFocus === 'ribcage_sternum' ? 1.0 : 0.0;
      const ribDimTarget =
        activeFocus && activeFocus !== 'ribcage_sternum' ? dimOthers : 1.0;
      [ribBackMat, ribFrontMat, cartilageMat, sternumMat, spineMat].forEach((m) => {
        m.uniforms.uHighlight.value = THREE.MathUtils.damp(
          m.uniforms.uHighlight.value,
          ribHl,
          7.5,
          delta
        );
        m.uniforms.uDim.value = THREE.MathUtils.damp(
          m.uniforms.uDim.value,
          ribDimTarget,
          7.5,
          delta
        );
      });

      const lungHl = activeFocus === 'lungs' ? 1.0 : 0.0;
      const lungDimTarget =
        activeFocus === 'bronchial_tree'
          ? 0.34
          : activeFocus && activeFocus !== 'lungs'
          ? dimOthers
          : 1.0;
      [lungOuterMat, lungInnerCoreMat].forEach((m) => {
        m.uniforms.uHighlight.value = THREE.MathUtils.damp(
          m.uniforms.uHighlight.value,
          lungHl,
          7.5,
          delta
        );
        m.uniforms.uDim.value = THREE.MathUtils.damp(
          m.uniforms.uDim.value,
          lungDimTarget,
          7.5,
          delta
        );
      });

      const trachHl = activeFocus === 'trachea_larynx' ? 1.0 : 0.0;
      const trachDim =
        activeFocus && activeFocus !== 'trachea_larynx' ? dimOthers : 1.0;
      [tracheaMat, cartilageRingMat].forEach((m) => {
        m.uniforms.uHighlight.value = THREE.MathUtils.damp(
          m.uniforms.uHighlight.value,
          trachHl,
          7.5,
          delta
        );
        m.uniforms.uDim.value = THREE.MathUtils.damp(
          m.uniforms.uDim.value,
          trachDim,
          7.5,
          delta
        );
      });

      const bronchHl = activeFocus === 'bronchial_tree' ? 1.0 : 0.0;
      const bronchDim =
        activeFocus && activeFocus !== 'bronchial_tree' && activeFocus !== 'lungs'
          ? dimOthers
          : 1.0;
      [mainBronchiMat, distalBronchiolesMat].forEach((m) => {
        m.uniforms.uHighlight.value = THREE.MathUtils.damp(
          m.uniforms.uHighlight.value,
          bronchHl,
          7.5,
          delta
        );
        m.uniforms.uDim.value = THREE.MathUtils.damp(
          m.uniforms.uDim.value,
          bronchDim,
          7.5,
          delta
        );
      });

      const diaHl = activeFocus === 'diaphragm' ? 1.0 : 0.0;
      const diaDim =
        activeFocus && activeFocus !== 'diaphragm' ? dimOthers : 1.0;
      diaphragmMat.uniforms.uHighlight.value = THREE.MathUtils.damp(
        diaphragmMat.uniforms.uHighlight.value,
        diaHl,
        7.5,
        delta
      );
      diaphragmMat.uniforms.uDim.value = THREE.MathUtils.damp(
        diaphragmMat.uniforms.uDim.value,
        diaDim,
        7.5,
        delta
      );

      // --- NATURAL PHYSIOLOGICAL BREATHING ANIMATION ---
      // breathNorm in [0..1] (0 = relaxed expiration, 1 = peak quiet inspiration)
      const breathNorm = initialReducedMotion
        ? 0.4
        : evaluateQuietBreath(animTime);
      const breathCentered = breathNorm - 0.5; // [-0.5 .. +0.5]

      // Synchronized natural lung expansion (lateral, anterior, and gentle inferior elongation)
      lungsGroup.scale.set(
        1 + breathCentered * 0.056,
        1 + breathCentered * 0.036,
        1 + breathCentered * 0.050
      );
      bronchialGroupWrapper.scale.set(
        1 + breathCentered * 0.034,
        1 + breathCentered * 0.024,
        1 + breathCentered * 0.032
      );
      // Biomechanical bucket-handle & pump-handle thoracic rib cage movement
      ribcageGroup.scale.set(
        1 + breathCentered * 0.022,
        1 + breathCentered * 0.014,
        1 + breathCentered * 0.026
      );
      ribcageGroup.position.y = thoracicPivotY + breathCentered * 0.009;
      // Diaphragm contracts smoothly downward & flattens slightly on inhalation, recoils upward on exhalation
      diaphragmMesh.position.y = -0.188 - breathCentered * 0.030;
      diaphragmMesh.scale.set(
        1 + breathCentered * 0.022,
        1 - breathCentered * 0.095,
        1 + breathCentered * 0.020
      );

      // Modulate internal warm lung & airway glow subtly with breath
      lungOuterMat.uniforms.uBreath.value = breathCentered * 2.0;
      lungInnerCoreMat.uniforms.uBreath.value = breathCentered * 2.0;
      tracheaMat.uniforms.uBreath.value = breathCentered * 2.0;
      cartilageRingMat.uniforms.uBreath.value = breathCentered * 2.0;
      mainBronchiMat.uniforms.uBreath.value = breathCentered * 2.0;
      distalBronchiolesMat.uniforms.uBreath.value = breathCentered * 2.0;
      lungWarmLight.intensity = 2.25 + breathCentered * 0.40;

      // Smooth laminar airflow particles traveling along all 6 trachea -> lobar bronchial paths
      const afAttr = airflowGeo.getAttribute('position') as THREE.BufferAttribute;
      const cyclePhase = (((animTime % 4.8) + 4.8) % 4.8) / 4.8;
      const isInhaling = cyclePhase < 0.40;
      for (let i = 0; i < airflowCount; i++) {
        const path = bronchialParts.airflowPaths[i % bronchialParts.airflowPaths.length];
        const offset = (i / airflowCount + animTime * (isInhaling ? 0.17 : -0.11)) % 1;
        const u = ((offset % 1) + 1) % 1;
        path.getPointAt(u, _airflowPt);
        afAttr.setXYZ(i, _airflowPt.x, _airflowPt.y, _airflowPt.z);
      }
      afAttr.needsUpdate = true;
      airflowMat.opacity = st.layers.hologram && !initialReducedMotion ? 0.62 : 0.0;

      // Subtle vertical scanning wave sweeping smoothly across translucent torso
      const scanCycle = ((animTime * 0.16) % 1);
      const scanY = THREE.MathUtils.lerp(0.68, -0.46, scanCycle);
      const scanFade = Math.sin(scanCycle * Math.PI);
      const scanEnabled = st.layers.hologram && !initialReducedMotion ? 1.0 : 0.0;
      torsoMats.forEach((m) => {
        m.uniforms.uTime.value = animTime;
        m.uniforms.uScanY.value = scanY;
        m.uniforms.uScanStrength.value = scanFade * scanEnabled;
      });

      // Gentle idle rotation (pauses when user pauses, drags, or inspects a structure)
      if (st.resetRootRot) {
        const wrapped = Math.atan2(
          Math.sin(rootGroup.rotation.y),
          Math.cos(rootGroup.rotation.y)
        );
        rootGroup.rotation.y = THREE.MathUtils.damp(wrapped, 0, 8, delta);
        if (Math.abs(rootGroup.rotation.y) < 0.008) {
          rootGroup.rotation.y = 0;
          st.resetRootRot = false;
        }
      } else if (
        st.isPlaying &&
        !initialReducedMotion &&
        !userInteracting &&
        !st.selectedId
      ) {
        rootGroup.rotation.y += delta * 0.13;
      }

      // Holographic rings & particles subtle animation
      if (st.layers.hologram) {
        ringMat1.uniforms.uTime.value = animTime;
        ringMat2.uniforms.uTime.value = animTime;
        orbitRing1.rotation.z = -0.16 + Math.sin(animTime * 0.26) * 0.06;
        orbitRing2.rotation.z = 0.20 + Math.cos(animTime * 0.22) * 0.05;

        beadSprites.forEach((b) => {
          const a = b.angle + animTime * b.speed;
          b.sprite.position.set(Math.cos(a) * b.radius, Math.sin(a) * b.radius, 0);
        });

        const pAttr = particleGeo.getAttribute('position') as THREE.BufferAttribute;
        const rotA = animTime * 0.07;
        const cosR = Math.cos(rotA);
        const sinR = Math.sin(rotA);
        for (let i = 0; i < pCount; i++) {
          const bx = pBase[i * 3];
          const by = pBase[i * 3 + 1];
          const bz = pBase[i * 3 + 2];
          const rx = bx * cosR - bz * sinR;
          const rz = bx * sinR + bz * cosR;
          const dy = Math.sin(animTime * 0.62 + i * 0.9) * 0.022;
          pAttr.setXYZ(i, rx, by + dy, rz);
        }
        pAttr.needsUpdate = true;
      }

      // Smooth damped camera focus / zoom / reset transitions
      const camLambda = isSoftwareGl ? 14 : 7.5;
      if (st.cameraGoalTarget) {
        controls.target.x = THREE.MathUtils.damp(
          controls.target.x,
          st.cameraGoalTarget.x,
          camLambda,
          delta
        );
        controls.target.y = THREE.MathUtils.damp(
          controls.target.y,
          st.cameraGoalTarget.y,
          camLambda,
          delta
        );
        controls.target.z = THREE.MathUtils.damp(
          controls.target.z,
          st.cameraGoalTarget.z,
          camLambda,
          delta
        );
      }
      if (st.cameraGoalPos) {
        camera.position.x = THREE.MathUtils.damp(
          camera.position.x,
          st.cameraGoalPos.x,
          camLambda,
          delta
        );
        camera.position.y = THREE.MathUtils.damp(
          camera.position.y,
          st.cameraGoalPos.y,
          camLambda,
          delta
        );
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          st.cameraGoalPos.z,
          camLambda,
          delta
        );
        if (camera.position.distanceTo(st.cameraGoalPos) < 0.015) {
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

    const handleResize = () => {
      if (!container || isDisposed) return;
      const w = Math.max(container.clientWidth, 220);
      const h = Math.max(container.clientHeight, 220);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    tick();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      io?.disconnect();
      ro.disconnect();
      domEl.removeEventListener('wheel', onWheelGuard, { capture: true });
      domEl.removeEventListener('pointerdown', onPointerDown);
      domEl.removeEventListener('pointerup', onPointerUp);
      domEl.removeEventListener('pointermove', onPointerMove);

      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const mats = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          mats.forEach((m) => m.dispose());
        }
      });
      envTex.dispose();
      glowTex.dispose();
      coolBackdropTex.dispose();
      warmGlowTex.dispose();
      controls.dispose();
      renderer.dispose();
    };
  }, [handleSelectStructure]);

  const selectedInfo = selectedId ? HERO_ANATOMY_STRUCTURES[selectedId] : null;
  const structureOrder: HeroAnatomyStructureId[] = [
    'lungs',
    'trachea_larynx',
    'bronchial_tree',
    'ribcage_sternum',
    'diaphragm',
  ];

  return (
    <div
      data-testid="hero-respiratory-3d-root"
      className={`relative w-full h-full flex flex-col items-center justify-center ${className}`}
    >
      {/* Dedicated WebGL 3D Canvas Container (Real interactive 3D — drag to orbit, pinch/button zoom, click structures) */}
      {webglUnavailable ? (
        <div
          data-testid="hero-3d-webgl-fallback"
          className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-8 rounded-2xl bg-[#072133]/80 border border-[#1E4B63] max-w-[340px]"
        >
          <p className="text-sm font-bold text-[#E6F4F8]">
            {isAr
              ? 'العرض ثلاثي الأبعاد يتطلب دعم WebGL'
              : 'Interactive 3D view requires WebGL support'}
          </p>
          <p className="mt-1.5 text-xs text-[#9AB6C4] leading-relaxed">
            {isAr
              ? 'يمكنك تصفح بطاقات التشريح من القائمة أدناه لاستكشاف القصبة الهوائية والرئتين والقفص الصدري.'
              : 'Use the anatomy selector below to explore the trachea, lungs, bronchi, rib cage, and diaphragm.'}
          </p>
        </div>
      ) : (
        <div
          ref={mountRef}
          data-testid="hero-3d-canvas-mount"
          className="relative z-10 w-full h-full touch-pan-y"
          aria-label={
            isAr
              ? 'نموذج تشريحي ثلاثي الأبعاد تفاعلي للجهاز التنفسي'
              : 'Interactive 3D anatomical respiratory upper-torso model'
          }
        />
      )}

      {/* Unified Bottom Stack: Educational Card + Collapsible Layer Panel + Compact Control Bar (Preserved Placement) */}
      <div
        data-testid="hero-3d-control-dock"
        dir={isAr ? 'rtl' : 'ltr'}
        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 w-[calc(100%-16px)] max-w-[468px] pointer-events-none"
      >
        {/* Selected Anatomical Structure Educational Card */}
        {selectedInfo && (
          <div
            data-testid="hero-anatomy-edu-card"
            className="pointer-events-auto w-full rounded-2xl bg-[#072133]/96 border border-[#38BDF8]/45 px-3.5 py-2.5 shadow-[0_12px_30px_rgba(3,12,20,0.74)] text-start"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-[13px] font-extrabold text-[#F3F7F8]">
                    {isAr ? selectedInfo.title.ar : selectedInfo.title.en}
                  </span>
                  <span className="text-[10px] font-semibold text-[#5CE2EA]">
                    {isAr ? selectedInfo.subtitle.ar : selectedInfo.subtitle.en}
                  </span>
                </div>
                <p className="mt-1 text-[11px] sm:text-xs text-[#C6DAE4] leading-relaxed">
                  {isAr ? selectedInfo.description.ar : selectedInfo.description.en}
                </p>
              </div>
              <button
                type="button"
                data-testid="hero-anatomy-edu-close"
                onClick={() => handleSelectStructure(null)}
                aria-label={isAr ? 'إغلاق البطاقة' : 'Close label'}
                className="p-1 rounded-lg text-[#9AB6C4] hover:text-[#F3F7F8] hover:bg-[#123B50] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-1.5 text-[10px] text-[#7DA2B4]">
              {isAr
                ? 'نموذج تشريحي تعليمي · اسحب للتدوير ثلاثي الأبعاد واضغط أي عضو للمعاينة'
                : 'Educational anatomical model · Drag to rotate 360° or tap any structure'}
            </div>
          </div>
        )}

        {/* Expandable Anatomical Structure & Granular Layer Panel */}
        {controlsExpanded && (
          <div
            data-testid="hero-3d-expanded-panel"
            className="pointer-events-auto w-full rounded-xl bg-[#072133]/96 border border-[#1E4B63] px-2.5 py-2 shadow-[0_10px_28px_rgba(3,12,20,0.72)] flex flex-col gap-2"
          >
            {/* Selectable Anatomical Structures */}
            <div className="flex flex-wrap items-center justify-center gap-1">
              {structureOrder.map((id) => {
                const info = HERO_ANATOMY_STRUCTURES[id];
                const active = selectedId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    data-testid={`hero-struct-btn-${id}`}
                    onClick={() => handleSelectStructure(active ? null : id)}
                    className={`px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#13B8B0] text-[#071F2E]'
                        : 'bg-[#0E3147] text-[#C8DDE7] hover:bg-[#16445F] border border-[#255269]'
                    }`}
                  >
                    {isAr ? info.title.ar : info.title.en}
                  </button>
                );
              })}
            </div>

            {/* Granular Anatomical Layer Visibility Toggles */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 border-t border-[#194257]">
              {(
                [
                  { key: 'body', ar: 'الجسم', en: 'Torso' },
                  { key: 'ribcage', ar: 'القفص الصدري', en: 'Rib Cage' },
                  { key: 'lungs', ar: 'الرئتان', en: 'Lungs' },
                  { key: 'airway', ar: 'القصبة والشعب', en: 'Airway & Bronchi' },
                  { key: 'hologram', ar: 'الحلقات', en: 'Rings & Scan' },
                ] as const
              ).map((item) => {
                const on = layers[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    data-testid={`hero-layer-toggle-${item.key}`}
                    onClick={() =>
                      setLayers((prev) => {
                        const next = {
                          ...prev,
                          [item.key]: !prev[item.key],
                        };
                        stateRef.current.layers = next;
                        cmdRef.current?.syncVisibility();
                        return next;
                      })
                    }
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors cursor-pointer border ${
                      on
                        ? 'bg-[#123E55] text-[#E6F4F8] border-[#2C6C86]'
                        : 'bg-[#082233] text-[#7D9BAC] border-[#1B3D50]'
                    }`}
                  >
                    {on ? (
                      <Eye className="w-2.5 h-2.5 text-[#43C7D1]" />
                    ) : (
                      <EyeOff className="w-2.5 h-2.5 text-[#6D8B9B]" />
                    )}
                    <span>{isAr ? item.ar : item.en}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Compact Primary Controls Bar (Zoom, Reset, Pause/Resume Animation & Breathing, Layers/Anatomy) */}
        <div className="pointer-events-auto inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#072133]/94 border border-[#1E4B63] shadow-[0_6px_20px_rgba(3,12,20,0.60)]">
          <button
            type="button"
            data-testid="hero-3d-zoom-in"
            onClick={() => cmdRef.current?.zoomBy(0.84)}
            title={isAr ? 'تكبير' : 'Zoom in'}
            aria-label={isAr ? 'تكبير النموذج' : 'Zoom in'}
            className="p-1.5 rounded-full text-[#B9D3E0] hover:text-[#F3F7F8] hover:bg-[#123B50] transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            data-testid="hero-3d-zoom-out"
            onClick={() => cmdRef.current?.zoomBy(1.18)}
            title={isAr ? 'تصغير' : 'Zoom out'}
            aria-label={isAr ? 'تصغير النموذج' : 'Zoom out'}
            className="p-1.5 rounded-full text-[#B9D3E0] hover:text-[#F3F7F8] hover:bg-[#123B50] transition-colors cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            data-testid="hero-3d-reset"
            onClick={() => handleSelectStructure(null)}
            title={isAr ? 'إعادة ضبط العرض' : 'Reset camera'}
            aria-label={isAr ? 'إعادة ضبط الكاميرا' : 'Reset camera'}
            className="p-1.5 rounded-full text-[#B9D3E0] hover:text-[#F3F7F8] hover:bg-[#123B50] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            data-testid="hero-3d-rotate-toggle"
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
                  ? 'إيقاف الحركة والتنفس'
                  : 'Pause breathing & rotation'
                : isAr
                ? 'تشغيل الحركة والتنفس'
                : 'Resume breathing & rotation'
            }
            aria-label={
              isPlaying
                ? isAr
                  ? 'إيقاف الحركة والتنفس'
                  : 'Pause animation'
                : isAr
                ? 'تشغيل الحركة والتنفس'
                : 'Resume animation'
            }
            className="p-1.5 rounded-full text-[#B9D3E0] hover:text-[#F3F7F8] hover:bg-[#123B50] transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-[#43C7D1]" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
          </button>

          <span className="w-px h-3.5 bg-[#204C62] mx-0.5" aria-hidden="true" />

          <button
            type="button"
            data-testid="hero-3d-layers-btn"
            onClick={() => setControlsExpanded((v) => !v)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold text-[#DCECF3] hover:text-[#FFFFFF] hover:bg-[#123B50] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>{isAr ? 'الطبقات والتشريح' : 'Layers & Anatomy'}</span>
            {controlsExpanded ? (
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
