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
}

export const HERO_ANATOMY_STRUCTURES: Record<HeroAnatomyStructureId, StructureEduInfo> = {
  trachea_larynx: {
    id: 'trachea_larynx',
    title: {
      ar: 'الحنجرة والقصبة الهوائية',
      en: 'Larynx & Trachea',
    },
    subtitle: {
      ar: 'المجرى التنفسي العلوي والمركزي',
      en: 'Upper & central conducting airway',
    },
    description: {
      ar: 'أنبوب مدعوم بحلقات غضروفية على شكل حرف C ينقل الهواء من الحنجرة إلى الرئتين، وهو الموقع الأكثر عرضة لانسداد الجسم الغريب في حالات الاختناق.',
      en: 'A cartilage-ringed airway conducting air from the larynx to the lungs — the primary site where foreign-body airway obstruction occurs during choking.',
    },
    cameraPos: [0.32, 0.58, 1.55],
    cameraTarget: [0, 0.46, 0.04],
  },
  bronchial_tree: {
    id: 'bronchial_tree',
    title: {
      ar: 'الشعب والشعيبات الهوائية',
      en: 'Bronchial Tree',
    },
    subtitle: {
      ar: 'التفرع الهوائي داخل الرئتين',
      en: 'Intrapulmonary airway branching',
    },
    description: {
      ar: 'تتفرع القصبة الهوائية عند الجؤجؤ إلى شعبتين رئيسيتين يمنى ويسرى ثم إلى شعب فصّية وقُطَيعية توزع الهواء بدقة إلى أنسجة الرئتين.',
      en: 'At the carina, the trachea divides into left and right mainstem bronchi, branching into lobar and segmental airways that distribute air throughout both lungs.',
    },
    cameraPos: [0.22, 0.16, 1.58],
    cameraTarget: [0, 0.14, 0.04],
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
      ar: 'تتكوّن الرئة اليمنى من ثلاثة فصوص واليسرى من فصين مع الثلمة القلبية. يحتفظان بهواء متبقٍّ يُضغط أثناء الإسعاف للمساعدة على طرد الجسم العالق.',
      en: 'The right lung has three lobes and the left has two with a cardiac notch. Both retain residual air that rescue thrusts compress to help expel an obstruction.',
    },
    cameraPos: [0.45, 0.12, 1.88],
    cameraTarget: [0, 0.12, 0.02],
  },
  ribcage_sternum: {
    id: 'ribcage_sternum',
    title: {
      ar: 'القفص الصدري وعظمة القص والترقوة',
      en: 'Ribcage, Sternum & Clavicles',
    },
    subtitle: {
      ar: 'الهيكل العظمي الحامي للصدر',
      en: 'Thoracic protective skeletal cage',
    },
    description: {
      ar: 'يحيط بالرئتين والقلب لحمايتهما ويسهم في حركة التنفس؛ وتُعد عظمة القص معلماً تشريحياً مهماً في إرشادات الضغطات الصدرية والإنعاش.',
      en: 'Encases and protects the lungs and heart while assisting ventilation; the sternum serves as a key anatomical landmark in chest-thrust and CPR protocols.',
    },
    cameraPos: [-0.58, 0.18, 1.98],
    cameraTarget: [0, 0.14, 0.02],
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
      ar: 'قبة عضلية تفصل التجويف الصدري عن البطني وتنقبض لتوليد الشهيق، ويرتفع للأعلى أثناء الضغطات البطنية الإسعافية لرفع الضغط داخل الصدر.',
      en: 'A dome-shaped muscle separating the thoracic and abdominal cavities; elevating it during abdominal thrusts increases intrathoracic pressure to clear an obstruction.',
    },
    cameraPos: [0.35, -0.14, 1.75],
    cameraTarget: [0, -0.18, 0.03],
  },
};

export interface HeroRespiratoryModel3DProps {
  language: Language;
  className?: string;
}

// Pre-allocated scratch helpers outside animation loop (Zero GC)
const _scratchVec3 = new THREE.Vector3();

// ============================================================================
// PROCEDURAL ANATOMICAL GEOMETRY BUILDERS (Pure Three.js BufferGeometry)
// ============================================================================

/**
 * Smooth parametric anatomical adult upper-torso shell:
 * Mandible/chin -> sculpted neck & sternocleidomastoid -> trapezius slope ->
 * broad deltoid shoulders -> pectoral chest with sternal furrow -> thoracic cage
 * & dorsal spinal groove -> upper abdomen fade.
 */
function buildAnatomicalTorsoGeometry(): THREE.BufferGeometry {
  const vSteps = 76;
  const uSteps = 72;
  const yMin = -0.66;
  const yMax = 0.88;

  const positions = new Float32Array((vSteps + 1) * (uSteps + 1) * 3);
  const uvs = new Float32Array((vSteps + 1) * (uSteps + 1) * 2);
  const indices: number[] = [];

  const smoothstep = (e0: number, e1: number, x: number) => {
    const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  };

  let pIdx = 0;
  let uvIdx = 0;

  for (let iy = 0; iy <= vSteps; iy++) {
    const v = iy / vSteps;
    const y = yMin + v * (yMax - yMin);

    // Base lateral half-width (rx) and anteroposterior half-depth (rz) along anatomical height
    let rx = 0.34;
    let rz = 0.21;
    let zCenter = 0;

    if (y > 0.56) {
      // Neck to jawline / chin base
      const neckT = smoothstep(0.56, 0.72, y);
      const jawT = smoothstep(0.75, 0.88, y);
      rx = THREE.MathUtils.lerp(0.148, 0.118, neckT) + jawT * 0.036;
      rz = THREE.MathUtils.lerp(0.145, 0.122, neckT) + jawT * 0.045;
      zCenter = 0.008 + jawT * 0.032;
    } else if (y > 0.42) {
      // Trapezius slope into shoulder girdle
      const t = (y - 0.42) / 0.14; // 0 at shoulders, 1 at base of neck
      const s = t * t * (3 - 2 * t);
      rx = THREE.MathUtils.lerp(0.455, 0.148, s);
      rz = THREE.MathUtils.lerp(0.205, 0.145, s);
      zCenter = THREE.MathUtils.lerp(0.0, 0.008, s);
    } else if (y > 0.12) {
      // Upper chest & deltoid breadth down to mid-thorax
      const t = (y - 0.12) / 0.30; // 0 mid-chest, 1 shoulder crown
      rx = THREE.MathUtils.lerp(0.375, 0.455, smoothstep(0, 1, t));
      rz = THREE.MathUtils.lerp(0.242, 0.205, t);
      zCenter = THREE.MathUtils.lerp(0.015, 0.0, t);
    } else {
      // Lower thorax tapering naturally into waist / upper abdomen
      const t = (y - yMin) / (0.12 - yMin); // 0 bottom, 1 mid-chest
      rx = THREE.MathUtils.lerp(0.308, 0.375, smoothstep(0, 1, t));
      rz = THREE.MathUtils.lerp(0.21, 0.242, smoothstep(0, 1, t));
      zCenter = THREE.MathUtils.lerp(0.004, 0.015, t);
    }

    // Anatomical contour weights at this height
    const pecWeight = Math.exp(-Math.pow((y - 0.22) / 0.15, 2));
    const clavNotchWeight = Math.exp(-Math.pow((y - 0.47) / 0.055, 2));
    const scapulaWeight = Math.exp(-Math.pow((y - 0.27) / 0.16, 2));
    const spineGrooveWeight = smoothstep(-0.55, -0.1, y) * (1 - smoothstep(0.45, 0.62, y));
    const scmWeight = Math.exp(-Math.pow((y - 0.66) / 0.11, 2));
    const jawWeight = smoothstep(0.76, 0.87, y);

    for (let ix = 0; ix <= uSteps; ix++) {
      const u = ix / uSteps;
      // theta = 0 is anterior midline (+Z), PI/2 is right (+X), PI is posterior (-Z)
      const theta = u * Math.PI * 2;
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);

      let x = sinT * rx;
      let z = zCenter + cosT * rz;

      // Squaring chest slightly so thorax reads anatomical (not cylindrical tube)
      const chestBox = smoothstep(-0.6, 0.35, y) * (1 - smoothstep(0.42, 0.56, y));
      const sqFactor = 1 + 0.055 * chestBox * Math.pow(Math.sin(2 * theta), 2);
      x *= sqFactor;
      z *= 1 + 0.025 * chestBox * Math.pow(Math.sin(2 * theta), 2);

      // Pectoral anterior fullness + central sternal furrow
      if (cosT > 0) {
        const pecMounds = Math.pow(Math.abs(sinT), 0.75) * Math.pow(cosT, 1.4);
        const sternalFurrow = Math.exp(-Math.pow(sinT / 0.16, 2)) * Math.pow(cosT, 2.0);
        z += pecWeight * (0.036 * pecMounds - 0.016 * sternalFurrow);

        // Suprasternal notch (jugular notch) dip at base of neck
        const notch = Math.exp(-Math.pow(sinT / 0.22, 2)) * cosT;
        z -= clavNotchWeight * 0.022 * notch;

        // Subtle clavicular ridge
        const clavRidge =
          Math.exp(-Math.pow((y - 0.45) / 0.025, 2)) *
          smoothstep(0.12, 0.35, Math.abs(sinT)) *
          (1 - smoothstep(0.75, 0.96, Math.abs(sinT))) *
          cosT;
        z += 0.014 * clavRidge;

        // Sternocleidomastoid V-contour in neck
        const scm = Math.exp(-Math.pow((Math.abs(sinT) - 0.42) / 0.18, 2)) * cosT;
        z += scmWeight * 0.009 * scm;

        // Subtle chin anterior taper
        if (jawWeight > 0) {
          const chinTip = Math.exp(-Math.pow(sinT / 0.35, 2)) * cosT;
          z += jawWeight * 0.028 * chinTip;
        }
      } else {
        // Posterior anatomy: scapular mounds + paraspinal midline groove
        const backCos = -cosT;
        const scap =
          Math.exp(-Math.pow((Math.abs(sinT) - 0.48) / 0.24, 2)) *
          Math.pow(backCos, 1.3);
        const spineGroove =
          Math.exp(-Math.pow(sinT / 0.15, 2)) * Math.pow(backCos, 1.8);
        z -= scapulaWeight * 0.026 * scap;
        z += spineGrooveWeight * 0.022 * spineGroove;
      }

      positions[pIdx++] = x;
      positions[pIdx++] = y;
      positions[pIdx++] = z;

      uvs[uvIdx++] = u;
      uvs[uvIdx++] = v;
    }
  }

  for (let iy = 0; iy < vSteps; iy++) {
    for (let ix = 0; ix < uSteps; ix++) {
      const a = iy * (uSteps + 1) + ix;
      const b = a + 1;
      const c = a + (uSteps + 1);
      const d = c + 1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Natural relaxed upper arm & deltoid contour along the side of the thorax (matches IMAGE 2)
 */
function buildAnatomicalUpperArmGeometry(side: -1 | 1): THREE.BufferGeometry {
  const vSteps = 36;
  const uSteps = 28;
  const positions = new Float32Array((vSteps + 1) * (uSteps + 1) * 3);
  const uvs = new Float32Array((vSteps + 1) * (uSteps + 1) * 2);
  const indices: number[] = [];

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(side * 0.435, 0.415, -0.01),
    new THREE.Vector3(side * 0.505, 0.275, -0.015),
    new THREE.Vector3(side * 0.532, 0.01, -0.018),
    new THREE.Vector3(side * 0.55, -0.30, -0.012),
    new THREE.Vector3(side * 0.562, -0.60, -0.005),
  ]);

  let pIdx = 0;
  let uvIdx = 0;

  for (let iy = 0; iy <= vSteps; iy++) {
    const t = iy / vSteps;
    const center = curve.getPoint(t);

    // Sculpted deltoid fullness at top, natural bicep/tricep taper downward
    const deltoidBell = Math.exp(-Math.pow((t - 0.14) / 0.17, 2));
    const bicepBell = Math.exp(-Math.pow((t - 0.52) / 0.24, 2));
    const topPinch = Math.min(1, t / 0.09);
    const rx = (0.088 + deltoidBell * 0.042 + bicepBell * 0.012 - t * 0.018) * (0.55 + 0.45 * topPinch);
    const rz = (0.098 + deltoidBell * 0.038 + bicepBell * 0.016 - t * 0.018) * (0.55 + 0.45 * topPinch);

    for (let ix = 0; ix <= uSteps; ix++) {
      const u = ix / uSteps;
      const theta = u * Math.PI * 2;
      const x = center.x + Math.cos(theta) * rx;
      const y = center.y + Math.sin(theta) * 0.008;
      const z = center.z + Math.sin(theta) * rz;

      positions[pIdx++] = x;
      positions[pIdx++] = y;
      positions[pIdx++] = z;
      uvs[uvIdx++] = u;
      uvs[uvIdx++] = 1 - t;
    }
  }

  for (let iy = 0; iy < vSteps; iy++) {
    for (let ix = 0; ix < uSteps; ix++) {
      const a = iy * (uSteps + 1) + ix;
      const b = a + 1;
      const c = a + (uSteps + 1);
      const d = c + 1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Anatomically sculpted lung lobe mesh (fuller rounded apex, broad convex costal curvature
 * filling the thoracic ribcage, mediastinal medial wall, realistic cardiac notch on left lung,
 * concave diaphragmatic base)
 * side = -1 => Anatomical Right Lung (viewer's left, 3 lobes, slightly broader)
 * side = +1 => Anatomical Left Lung (viewer's right, 2 lobes, cardiac notch)
 */
function buildAnatomicalLungGeometry(side: -1 | 1): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(1, 48, 42);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const isAnatomicalLeft = side === 1;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // Normalize height parameter h in [-1, 1] -> [0, 1]
    const h = (y + 1) * 0.5;

    // 1. Fuller rounded dome apex + broad mid-thoracic sweep + wide costodiaphragmatic base
    const domeFill = Math.pow(Math.sin(Math.pow(h, 0.78) * Math.PI), 0.72);
    const apexTaper = 1.0 - 0.34 * Math.pow(h, 2.35);
    const baseExpand = 0.86 + 0.30 * (1 - h);

    // 2. Gentle flat medial mediastinal surface (facing spine/heart) & broad costal curve laterally
    const isMedial = x * side < 0;
    if (isMedial) {
      x *= 0.62;
    } else {
      x *= 1.15;
    }

    // 3. Realistic cardiac notch scooped out of medial-inferior anterior Left Lung
    if (isAnatomicalLeft && x < 0.14 && y < 0.16 && y > -0.92 && z > -0.35) {
      const notchH = Math.exp(-Math.pow((y + 0.36) / 0.38, 2));
      const notchFront = Math.max(0, (z + 0.35) / 1.35);
      const medialWeight = Math.max(0, 1 - (x + 0.62) / 0.82);
      x += 0.38 * notchH * notchFront * medialWeight;
    }

    // 4. Concave diaphragmatic dome base resting snugly over the diaphragm
    if (y < -0.48) {
      const bottomT = (-0.48 - y) / 0.52;
      const radial = Math.min(1, Math.hypot(x, z));
      y += bottomT * (0.30 * (1 - radial * 0.82) - 0.08 * radial);
    }

    // 5. Subtle anatomical oblique fissure groove
    const fissureLine = y - (0.32 - 0.72 * (z * 0.5 + 0.5));
    const fissureIndent = Math.exp(-Math.pow(fissureLine / 0.055, 2)) * 0.026;

    // Scale to fill thoracic ribcage cleanly like IMAGE 1 & IMAGE 2
    const scaleX = (isAnatomicalLeft ? 0.162 : 0.174) * (0.64 + 0.44 * domeFill) * apexTaper * baseExpand;
    const scaleY = 0.312;
    const scaleZ = 0.148 * (0.68 + 0.42 * Math.sin(h * Math.PI)) * (1 - 0.22 * Math.pow(h, 2.2));

    const outX = x * scaleX * (1 - fissureIndent) + side * (isAnatomicalLeft ? 0.148 : 0.142);
    const outY = y * scaleY + 0.128;
    const outZ = z * scaleZ * (1 - fissureIndent) - 0.015 + (1 - h) * 0.014;

    pos.setXYZ(i, outX, outY, outZ);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Custom elliptical-section anatomical rib geometry along a 3D CatmullRomCurve3
 * so ribs read as flat realistic costal arches rather than cylindrical pipes.
 */
function buildFlatRibGeometry(
  curve: THREE.CatmullRomCurve3,
  segments = 32,
  thicknessY = 0.0105,
  thicknessNormal = 0.0052
): THREE.BufferGeometry {
  const frames = curve.computeFrenetFrames(segments, false);
  const ringPts = 10;
  const positions = new Float32Array((segments + 1) * (ringPts + 1) * 3);
  const uvs = new Float32Array((segments + 1) * (ringPts + 1) * 2);
  const indices: number[] = [];

  const pt = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const radial = new THREE.Vector3();
  const binorm = new THREE.Vector3();

  let pIdx = 0;
  let uvIdx = 0;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    curve.getPointAt(t, pt);
    const tangent = frames.tangents[i];
    radial.crossVectors(tangent, up);
    if (radial.lengthSq() < 0.0001) {
      radial.set(1, 0, 0);
    } else {
      radial.normalize();
    }
    binorm.crossVectors(radial, tangent).normalize();

    const endTaper = 0.78 + 0.22 * Math.sin(t * Math.PI);
    const ry = thicknessY * endTaper;
    const rn = thicknessNormal * endTaper;

    for (let j = 0; j <= ringPts; j++) {
      const phi = (j / ringPts) * Math.PI * 2;
      const c = Math.cos(phi) * rn;
      const s = Math.sin(phi) * ry;
      positions[pIdx++] = pt.x + radial.x * c + binorm.x * s;
      positions[pIdx++] = pt.y + radial.y * c + binorm.y * s;
      positions[pIdx++] = pt.z + radial.z * c + binorm.z * s;
      uvs[uvIdx++] = t;
      uvs[uvIdx++] = j / ringPts;
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < ringPts; j++) {
      const a = i * (ringPts + 1) + j;
      const b = a + 1;
      const c = a + (ringPts + 1);
      const d = c + 1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Multi-generation recursive bronchial tree strictly contained inside both sculpted lung lobes
 */
function buildBronchialTreeGroup(
  bronchusMat: THREE.Material,
  distalMat: THREE.Material
): THREE.Group {
  const group = new THREE.Group();
  const carina = new THREE.Vector3(0, 0.258, 0.012);

  // Height-aware containment strictly inside each sculpted lung silhouette (with clean peripheral margin)
  const clampInsideLung = (pt: THREE.Vector3, side: -1 | 1) => {
    const isLeft = side === 1;
    pt.y = THREE.MathUtils.clamp(pt.y, -0.095, 0.345);
    const h = THREE.MathUtils.clamp((pt.y - -0.14) / 0.56, 0, 1);
    // Narrower near apex (h -> 1), widest across mid/lower lobes
    const domeSpan = Math.sin(Math.pow(h, 0.72) * Math.PI);
    const maxLat = (isLeft ? 0.258 : 0.268) * (0.55 + 0.45 * domeSpan) * (1 - 0.16 * Math.pow(h, 2));
    const minMed = isLeft && pt.y < 0.12 ? 0.095 : 0.068;
    const absX = THREE.MathUtils.clamp(Math.abs(pt.x), minMed, Math.max(minMed + 0.02, maxLat));
    pt.x = side * absX;
    const maxZ = 0.072 * (0.55 + 0.45 * domeSpan);
    pt.z = THREE.MathUtils.clamp(pt.z, -maxZ - 0.012, maxZ - 0.008);
    return pt;
  };

  const addBranch = (
    pts: THREE.Vector3[],
    rStart: number,
    rEnd: number,
    mat: THREE.Material,
    segs = 9
  ) => {
    const curve = new THREE.CatmullRomCurve3(pts);
    const rAvg = (rStart + rEnd) * 0.5;
    const geo = new THREE.TubeGeometry(curve, segs, rAvg, 7, false);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const radialSegs = 7;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const center = curve.getPointAt(t);
      const scale = THREE.MathUtils.lerp(rStart, rEnd, t) / Math.max(0.0005, rAvg);
      for (let j = 0; j <= radialSegs; j++) {
        const idx = i * (radialSegs + 1) + j;
        if (idx < pos.count) {
          pos.setXYZ(
            idx,
            center.x + (pos.getX(idx) - center.x) * scale,
            center.y + (pos.getY(idx) - center.y) * scale,
            center.z + (pos.getZ(idx) - center.z) * scale
          );
        }
      }
    }
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = 4;
    group.add(mesh);
  };

  const spawnTwigs = (
    origin: THREE.Vector3,
    dir: THREE.Vector3,
    length: number,
    radius: number,
    depth: number,
    side: -1 | 1,
    seed: number
  ) => {
    if (depth <= 0) return;
    const tip = clampInsideLung(origin.clone().addScaledVector(dir, length), side);
    if (tip.distanceTo(origin) < 0.012) return;
    const mid = clampInsideLung(
      origin
        .clone()
        .lerp(tip, 0.5)
        .add(new THREE.Vector3(side * 0.004, Math.sin(seed) * 0.006, Math.cos(seed) * 0.005)),
      side
    );

    addBranch([origin, mid, tip], radius, radius * 0.62, depth >= 3 ? bronchusMat : distalMat, 7);

    if (depth > 1) {
      const angles = [
        { dy: 0.36, dz: 0.24, dx: 0.26 },
        { dy: -0.34, dz: -0.22, dx: 0.28 },
      ];
      angles.forEach((a, idx) => {
        const nextDir = dir
          .clone()
          .add(
            new THREE.Vector3(
              side * (a.dx + ((seed + idx) % 3) * 0.04),
              a.dy + Math.sin(seed * 2.1 + idx) * 0.12,
              a.dz * (idx === 0 ? 1 : -1)
            )
          )
          .normalize();
        spawnTwigs(tip, nextDir, length * 0.70, radius * 0.62, depth - 1, side, seed * 1.7 + idx + 1);
      });
    }
  };

  // Anatomical Right Mainstem Bronchus (side = -1, viewer's left: 3 lobar branches + dense fine twigs)
  const rightHilum = new THREE.Vector3(-0.082, 0.206, 0.004);
  addBranch(
    [carina, new THREE.Vector3(-0.042, 0.234, 0.008), rightHilum],
    0.0165,
    0.013,
    bronchusMat,
    12
  );
  spawnTwigs(rightHilum, new THREE.Vector3(-0.48, 0.82, 0.06).normalize(), 0.068, 0.0098, 3, -1, 1.3);
  spawnTwigs(rightHilum, new THREE.Vector3(-0.82, 0.26, 0.24).normalize(), 0.072, 0.0092, 3, -1, 2.2);
  spawnTwigs(rightHilum, new THREE.Vector3(-0.84, -0.18, 0.28).normalize(), 0.078, 0.0095, 3, -1, 3.1);
  spawnTwigs(rightHilum, new THREE.Vector3(-0.56, -0.78, -0.12).normalize(), 0.095, 0.0102, 3, -1, 4.4);
  spawnTwigs(rightHilum, new THREE.Vector3(-0.68, -0.52, 0.26).normalize(), 0.076, 0.0085, 3, -1, 5.5);

  // Anatomical Left Mainstem Bronchus (side = +1, viewer's right: 2 lobar + lingular branches)
  const leftHilum = new THREE.Vector3(0.098, 0.212, 0.003);
  addBranch(
    [carina, new THREE.Vector3(0.048, 0.236, 0.008), leftHilum],
    0.0155,
    0.0122,
    bronchusMat,
    12
  );
  spawnTwigs(leftHilum, new THREE.Vector3(0.48, 0.82, 0.05).normalize(), 0.066, 0.0094, 3, 1, 6.2);
  spawnTwigs(leftHilum, new THREE.Vector3(0.82, 0.24, 0.22).normalize(), 0.070, 0.0088, 3, 1, 7.4);
  spawnTwigs(leftHilum, new THREE.Vector3(0.84, -0.16, 0.24).normalize(), 0.074, 0.009, 3, 1, 8.3);
  spawnTwigs(leftHilum, new THREE.Vector3(0.56, -0.78, -0.14).normalize(), 0.090, 0.0098, 3, 1, 9.1);
  spawnTwigs(leftHilum, new THREE.Vector3(0.70, -0.46, 0.22).normalize(), 0.072, 0.0082, 3, 1, 10.4);

  return group;
}

// ============================================================================
// CUSTOM MEDICAL X-RAY / FRESNEL GLSL SHADER FACTORIES
// ============================================================================

function createTorsoFresnelMaterial(backFace = false, armSide: -1 | 0 | 1 = 0): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uInnerColor: { value: new THREE.Color(0x052e75) },
      uRimColor: { value: new THREE.Color(0x1da8ff) },
      uCyanEdge: { value: new THREE.Color(0x52e8ff) },
      uOpacityMult: { value: backFace ? 0.22 : 0.90 },
      uArmSide: { value: armSide },
    },
    vertexShader: `
      varying vec3 vNormalView;
      varying vec3 vViewPos;
      varying vec3 vLocalPos;
      varying vec2 vUv;

      void main() {
        vLocalPos = position;
        vUv = uv;
        vNormalView = normalize(normalMatrix * normal);
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewPos = -mvPos.xyz;
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uInnerColor;
      uniform vec3 uRimColor;
      uniform vec3 uCyanEdge;
      uniform float uOpacityMult;
      uniform float uArmSide;

      varying vec3 vNormalView;
      varying vec3 vViewPos;
      varying vec3 vLocalPos;
      varying vec2 vUv;

      void main() {
        vec3 N = normalize(vNormalView);
        vec3 V = normalize(vViewPos);
        float ndotv = abs(dot(N, V));

        // Realistic medical X-ray Fresnel rim
        float fresnelSoft = pow(1.0 - ndotv, 2.05);
        float fresnelSharp = pow(1.0 - ndotv, 4.2);

        // Restrained anatomical micro-contour lines
        float contour = sin(vLocalPos.y * 56.0) * 0.5 + 0.5;
        float subtleContour = smoothstep(0.93, 1.0, contour) * 0.065 * fresnelSoft;

        // Smooth bottom fade above control dock & smooth top jawline dissolve inside viewport
        float bottomFade = smoothstep(-0.62, -0.24, vLocalPos.y);
        float topFade = 1.0 - smoothstep(0.68, 0.85, vLocalPos.y);
        float mask = bottomFade * topFade;

        // Seamless shoulder-deltoid transition for upper arm meshes (eliminates internal seam line)
        if (abs(uArmSide) > 0.5) {
          float lat = vLocalPos.x * uArmSide;
          float topCapFade = 1.0 - smoothstep(0.32, 0.43, vLocalPos.y) * (1.0 - smoothstep(0.46, 0.54, lat));
          float medialHide = smoothstep(0.405, 0.485, lat);
          mask *= topCapFade * mix(medialHide, 1.0, smoothstep(0.24, -0.05, vLocalPos.y));
        }

        vec3 col = mix(uInnerColor, uRimColor, fresnelSoft);
        col = mix(col, uCyanEdge, fresnelSharp * 0.74);
        col += uCyanEdge * subtleContour;

        float alpha = (0.04 + fresnelSoft * 0.46 + fresnelSharp * 0.42 + subtleContour) * mask * uOpacityMult;
        if (alpha < 0.004) discard;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.90));
      }
    `,
    transparent: true,
    depthWrite: false,
    side: backFace ? THREE.BackSide : THREE.FrontSide,
    blending: THREE.NormalBlending,
  });
}

function createRibXRayMaterial(baseAlpha = 0.16, rimAlpha = 0.48): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uCoreColor: { value: new THREE.Color(0x1465b5) },
      uRimColor: { value: new THREE.Color(0x56dcff) },
      uHighlight: { value: 0.0 },
      uDim: { value: 1.0 },
      uBaseAlpha: { value: baseAlpha },
      uRimAlpha: { value: rimAlpha },
    },
    vertexShader: `
      varying vec3 vNormalView;
      varying vec3 vViewPos;
      void main() {
        vNormalView = normalize(normalMatrix * normal);
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewPos = -mvPos.xyz;
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uCoreColor;
      uniform vec3 uRimColor;
      uniform float uHighlight;
      uniform float uDim;
      uniform float uBaseAlpha;
      uniform float uRimAlpha;
      varying vec3 vNormalView;
      varying vec3 vViewPos;

      void main() {
        vec3 N = normalize(vNormalView);
        vec3 V = normalize(vViewPos);
        float ndotv = abs(dot(N, V));
        float rim = pow(1.0 - ndotv, 1.85);
        vec3 col = mix(uCoreColor, uRimColor, rim * 0.85 + uHighlight * 0.35);
        col += vec3(0.28, 0.78, 1.0) * uHighlight * 0.48;
        float alpha = (uBaseAlpha + rim * uRimAlpha + uHighlight * 0.28) * uDim;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.94));
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

function createAirwayLuminousMaterial(
  coreHex: number,
  rimHex: number,
  baseOpacity = 0.92
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uCoreColor: { value: new THREE.Color(coreHex) },
      uRimColor: { value: new THREE.Color(rimHex) },
      uHighlight: { value: 0.0 },
      uDim: { value: 1.0 },
      uBaseOpacity: { value: baseOpacity },
    },
    vertexShader: `
      varying vec3 vNormalView;
      varying vec3 vViewPos;
      void main() {
        vNormalView = normalize(normalMatrix * normal);
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewPos = -mvPos.xyz;
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uCoreColor;
      uniform vec3 uRimColor;
      uniform float uHighlight;
      uniform float uDim;
      uniform float uBaseOpacity;
      varying vec3 vNormalView;
      varying vec3 vViewPos;

      void main() {
        vec3 N = normalize(vNormalView);
        vec3 V = normalize(vViewPos);
        float ndotv = abs(dot(N, V));
        float rim = pow(1.0 - ndotv, 1.7);
        vec3 col = mix(uCoreColor, uRimColor, rim * 0.72 + 0.16);
        col *= (0.95 + 0.22 * ndotv);
        col += vec3(0.45, 0.26, 0.14) * uHighlight;
        float alpha = clamp((uBaseOpacity + uHighlight * 0.08) * uDim, 0.18, 0.98);
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    depthWrite: true,
  });
}

function createLungVolumetricMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uCoreColor: { value: new THREE.Color(0xff5238) },
      uWarmMid: { value: new THREE.Color(0xff8e52) },
      uRimColor: { value: new THREE.Color(0xffc9b8) },
      uHighlight: { value: 0.0 },
      uDim: { value: 1.0 },
    },
    vertexShader: `
      varying vec3 vNormalView;
      varying vec3 vViewPos;
      varying vec3 vLocalPos;
      void main() {
        vLocalPos = position;
        vNormalView = normalize(normalMatrix * normal);
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewPos = -mvPos.xyz;
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uCoreColor;
      uniform vec3 uWarmMid;
      uniform vec3 uRimColor;
      uniform float uHighlight;
      uniform float uDim;
      varying vec3 vNormalView;
      varying vec3 vViewPos;
      varying vec3 vLocalPos;

      void main() {
        vec3 N = normalize(vNormalView);
        vec3 V = normalize(vViewPos);
        float ndotv = abs(dot(N, V));
        float fresnel = pow(1.0 - ndotv, 1.85);
        float sharpRim = pow(1.0 - ndotv, 3.6);
        float breathGlow = 0.94 + 0.06 * sin(uTime * 1.45);

        // Subtle organic alveolar parenchyma texture modulation
        float alv = sin(vLocalPos.x * 46.0 + vLocalPos.y * 32.0) * cos(vLocalPos.z * 42.0 - vLocalPos.y * 28.0);
        float microGlow = (alv * 0.5 + 0.5) * 0.14;

        // Luminous coral-orange glowing parenchyma matching IMAGE 1
        float hGrad = clamp((vLocalPos.y + 0.22) / 0.64, 0.0, 1.0);
        vec3 base = mix(uCoreColor, uWarmMid, hGrad * 0.52 + pow(ndotv, 1.3) * 0.34 + microGlow);
        vec3 col = mix(base, uRimColor, fresnel * 0.72 + sharpRim * 0.35) * (1.16 * breathGlow);
        col += vec3(0.42, 0.22, 0.14) * uHighlight;

        // Clear central window so golden bronchial tree shines cleanly inside vibrant glowing lung contour
        float alpha = (0.34 + fresnel * 0.50 + sharpRim * 0.16 + uHighlight * 0.16) * uDim;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.94));
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });
}

function createDiaphragmFresnelMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uCoreColor: { value: new THREE.Color(0x0c5c84) },
      uRimColor: { value: new THREE.Color(0x4be4ff) },
      uHighlight: { value: 0.0 },
      uDim: { value: 1.0 },
    },
    vertexShader: `
      varying vec3 vNormalView;
      varying vec3 vViewPos;
      varying vec3 vLocalPos;
      void main() {
        vLocalPos = position;
        vNormalView = normalize(normalMatrix * normal);
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewPos = -mvPos.xyz;
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uCoreColor;
      uniform vec3 uRimColor;
      uniform float uHighlight;
      uniform float uDim;
      varying vec3 vNormalView;
      varying vec3 vViewPos;
      varying vec3 vLocalPos;

      void main() {
        vec3 N = normalize(vNormalView);
        vec3 V = normalize(vViewPos);
        float ndotv = abs(dot(N, V));
        float rim = pow(1.0 - ndotv, 1.9);

        // Soft radial feather at outer dome skirt so no hard polygonal edge shows
        float rad = length(vec2(vLocalPos.x / 0.30, vLocalPos.z / 0.18));
        float skirtFade = 1.0 - smoothstep(0.76, 1.02, rad);

        vec3 col = mix(uCoreColor, uRimColor, rim * 0.85 + 0.15 + uHighlight * 0.35);
        col += vec3(0.25, 0.72, 0.95) * uHighlight * 0.45;
        float alpha = (0.12 + rim * 0.44 + uHighlight * 0.32) * skirtFade * uDim;
        if (alpha < 0.005) discard;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.85));
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

function createOrbitalRingShaderMaterial(colorHex: number, phaseOffset: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(colorHex) },
      uPhase: { value: phaseOffset },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uPhase;
      varying vec2 vUv;

      void main() {
        // Traveling luminous arc highlight along the orbital ring
        float wave1 = pow(0.5 + 0.5 * sin(vUv.x * 6.2831853 + uTime * 0.7 + uPhase), 3.0);
        float wave2 = pow(0.5 + 0.5 * sin(vUv.x * 12.56637 - uTime * 0.45 + uPhase), 5.0);
        float intensity = 0.22 + wave1 * 0.65 + wave2 * 0.35;
        gl_FragColor = vec4(uColor * (0.9 + wave1 * 0.6), clamp(intensity * 0.78, 0.0, 0.92));
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
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
  const [autoRotate, setAutoRotate] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return true;
    return !(
      document.documentElement.classList.contains('reduced-motion') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  });
  const [controlsExpanded, setControlsExpanded] = useState<boolean>(false);
  const [layers, setLayers] = useState({
    body: true,
    ribcage: true,
    airwayLungs: true,
    hologram: true,
  });

  // Mutable ref read inside the Three.js loop without tearing down WebGL
  const stateRef = useRef({
    selectedId,
    hoveredId,
    autoRotate,
    layers,
    cameraGoalPos: null as THREE.Vector3 | null,
    cameraGoalTarget: null as THREE.Vector3 | null,
    resetRootRot: false,
  });

  useEffect(() => {
    stateRef.current.selectedId = selectedId;
    stateRef.current.hoveredId = hoveredId;
    stateRef.current.autoRotate = autoRotate;
    stateRef.current.layers = layers;
  }, [selectedId, hoveredId, autoRotate, layers]);

  const cmdRef = useRef<{
    zoomBy: (factor: number) => void;
    resetCamera: () => void;
    focusStructure: (id: HeroAnatomyStructureId) => void;
  } | null>(null);

  const handleSelectStructure = useCallback((id: HeroAnatomyStructureId | null) => {
    setSelectedId(id);
    if (id) {
      setControlsExpanded(false);
      cmdRef.current?.focusStructure(id);
    } else {
      cmdRef.current?.resetCamera();
    }
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL per threejs skill guidelines
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
      Math.max(2.34, 2.26 / Math.max(aspect, 0.65));
    const defaultDist = computeDefaultDist(width / height);

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 40);
    camera.position.set(0.0, 0.14, defaultDist);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      preserveDrawingBuffer: isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Studio Environment Reflection (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    // 3. Controlled Medical Lighting Rig (Warm thoracic interior + Cool cyan/cobalt exterior)
    const hemiLight = new THREE.HemisphereLight(0x74d8ff, 0x061d30, 1.0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xeef8ff, 1.45);
    keyLight.position.set(2.2, 2.8, 3.0);
    scene.add(keyLight);

    const rimCyanLight = new THREE.DirectionalLight(0x28c7ff, 1.85);
    rimCyanLight.position.set(-2.4, 1.6, -2.0);
    scene.add(rimCyanLight);

    const lungWarmLight = new THREE.PointLight(0xff6b3d, 2.2, 2.8, 1.6);
    lungWarmLight.position.set(0, 0.14, 0.14);
    scene.add(lungWarmLight);

    // 4. Real Interactive OrbitControls (drag to rotate 360°, pinch/button zoom; wheel disabled so page scroll stays smooth)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.065;
    controls.enableRotate = true;
    controls.enableZoom = false; // Controlled smoothly via dedicated zoom buttons + pinch to avoid trapping page scroll
    controls.enablePan = false;
    controls.minDistance = 1.32;
    controls.maxDistance = 3.35;
    controls.minPolarAngle = Math.PI * 0.25;
    controls.maxPolarAngle = Math.PI * 0.74;
    controls.target.copy(defaultCamTarget);

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
    const hologramGroup = new THREE.Group();

    rootGroup.add(bodyShellGroup);
    rootGroup.add(ribcageGroup);
    rootGroup.add(airwayGroup);
    rootGroup.add(bronchialGroupWrapper);
    rootGroup.add(lungsGroup);
    rootGroup.add(diaphragmGroup);
    scene.add(hologramGroup);

    const clickableMeshes: THREE.Object3D[] = [];
    const registerClickable = (obj: THREE.Object3D, structureId: HeroAnatomyStructureId) => {
      obj.userData.structureId = structureId;
      obj.traverse((c) => {
        c.userData.structureId = structureId;
      });
      clickableMeshes.push(obj);
    };

    // --- A. TRANSLUCENT COBALT-CYAN FRESNEL HUMAN UPPER TORSO + SEAMLESS UPPER ARMS ---
    const torsoFrontMat = createTorsoFresnelMaterial(false, 0);
    const torsoBackMat = createTorsoFresnelMaterial(true, 0);

    const torsoGeo = buildAnatomicalTorsoGeometry();
    const torsoBackMesh = new THREE.Mesh(torsoGeo, torsoBackMat);
    torsoBackMesh.renderOrder = 1;
    const torsoFrontMesh = new THREE.Mesh(torsoGeo, torsoFrontMat);
    torsoFrontMesh.renderOrder = 8;
    bodyShellGroup.add(torsoBackMesh, torsoFrontMesh);

    ([-1, 1] as const).forEach((side) => {
      const armGeo = buildAnatomicalUpperArmGeometry(side);
      const armFrontMat = createTorsoFresnelMaterial(false, side);
      const armBackMat = createTorsoFresnelMaterial(true, side);
      const armBack = new THREE.Mesh(armGeo, armBackMat);
      armBack.renderOrder = 1;
      const armFront = new THREE.Mesh(armGeo, armFrontMat);
      armFront.renderOrder = 8;
      bodyShellGroup.add(armBack, armFront);
    });

    // --- B. SKELETAL RIBCAGE, STERNUM, CLAVICLES & VERTEBRAL COLUMN ---
    const ribMat = createRibXRayMaterial(0.16, 0.48);
    // Clearer center on sternum so luminous trachea & carina shine seamlessly behind it
    const sternumMat = createRibXRayMaterial(0.05, 0.44);
    const spineMat = createRibXRayMaterial(0.08, 0.30);

    // Sculpted Sternum (Manubrium + Body + Xiphoid)
    const sternumShape = new THREE.Shape();
    sternumShape.moveTo(-0.044, 0.44);
    sternumShape.quadraticCurveTo(0, 0.422, 0.044, 0.44); // Jugular notch
    sternumShape.lineTo(0.052, 0.385);
    sternumShape.lineTo(0.028, 0.34);
    sternumShape.lineTo(0.032, 0.14);
    sternumShape.lineTo(0.014, 0.08);
    sternumShape.lineTo(0, 0.045); // Xiphoid tip
    sternumShape.lineTo(-0.014, 0.08);
    sternumShape.lineTo(-0.032, 0.14);
    sternumShape.lineTo(-0.028, 0.34);
    sternumShape.lineTo(-0.052, 0.385);
    sternumShape.closePath();

    const sternumGeo = new THREE.ExtrudeGeometry(sternumShape, {
      depth: 0.014,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.004,
      bevelSegments: 3,
    });
    sternumGeo.translate(0, 0, 0.185);
    const sternumMesh = new THREE.Mesh(sternumGeo, sternumMat);
    sternumMesh.renderOrder = 6;
    ribcageGroup.add(sternumMesh);
    registerClickable(sternumMesh, 'ribcage_sternum');

    // S-Curved Clavicles (Left & Right)
    ([-1, 1] as const).forEach((side) => {
      const clavCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 0.036, 0.432, 0.182),
        new THREE.Vector3(side * 0.14, 0.452, 0.172),
        new THREE.Vector3(side * 0.27, 0.456, 0.095),
        new THREE.Vector3(side * 0.395, 0.452, 0.015),
      ]);
      const clavGeo = buildFlatRibGeometry(clavCurve, 26, 0.0115, 0.0085);
      const clavMesh = new THREE.Mesh(clavGeo, ribMat);
      clavMesh.renderOrder = 6;
      ribcageGroup.add(clavMesh);
      registerClickable(clavMesh, 'ribcage_sternum');
    });

    // 10 Pairs of Anatomically Sloped Curved Ribs (True 1-7 + False Costal Arch 8-10)
    const ribConfigs = [
      { yBack: 0.46, yLat: 0.43, yFront: 0.41, rx: 0.205, zFront: 0.175, xEnd: 0.044 },
      { yBack: 0.405, yLat: 0.365, yFront: 0.352, rx: 0.256, zFront: 0.188, xEnd: 0.032 },
      { yBack: 0.348, yLat: 0.295, yFront: 0.288, rx: 0.292, zFront: 0.196, xEnd: 0.030 },
      { yBack: 0.288, yLat: 0.225, yFront: 0.225, rx: 0.312, zFront: 0.198, xEnd: 0.030 },
      { yBack: 0.225, yLat: 0.152, yFront: 0.162, rx: 0.322, zFront: 0.196, xEnd: 0.028 },
      { yBack: 0.16, yLat: 0.08, yFront: 0.102, rx: 0.324, zFront: 0.190, xEnd: 0.025 },
      { yBack: 0.095, yLat: 0.008, yFront: 0.052, rx: 0.318, zFront: 0.184, xEnd: 0.028 },
      { yBack: 0.028, yLat: -0.062, yFront: 0.005, rx: 0.306, zFront: 0.172, xEnd: 0.072 },
      { yBack: -0.038, yLat: -0.132, yFront: -0.055, rx: 0.288, zFront: 0.155, xEnd: 0.118 },
      { yBack: -0.102, yLat: -0.195, yFront: -0.125, rx: 0.266, zFront: 0.132, xEnd: 0.158 },
    ];

    ribConfigs.forEach((rc, idx) => {
      ([-1, 1] as const).forEach((side) => {
        const ribCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.024, rc.yBack, -0.148),
          new THREE.Vector3(side * (rc.rx * 0.72), rc.yBack - 0.015, -0.145),
          new THREE.Vector3(side * rc.rx, rc.yLat, -0.015),
          new THREE.Vector3(side * (rc.rx * 0.74), rc.yLat - 0.012, rc.zFront * 0.82),
          new THREE.Vector3(side * rc.xEnd, rc.yFront, rc.zFront),
        ]);
        const thicknessY = idx === 0 ? 0.0082 : 0.0096;
        const ribGeo = buildFlatRibGeometry(ribCurve, 30, thicknessY, 0.0046);
        const ribMesh = new THREE.Mesh(ribGeo, ribMat);
        ribMesh.renderOrder = 6;
        ribcageGroup.add(ribMesh);
        registerClickable(ribMesh, 'ribcage_sternum');
      });
    });

    // Posterior Cervical & Thoracic Vertebral Column (visible when orbiting around)
    const vertGeo = new THREE.CylinderGeometry(0.028, 0.03, 0.030, 14);
    const spinousGeo = new THREE.BoxGeometry(0.009, 0.015, 0.030);
    for (let v = 0; v < 14; v++) {
      const vy = 0.64 - v * 0.058;
      const vz = -0.098 - Math.sin((v / 13) * Math.PI) * 0.052;
      const bodyMesh = new THREE.Mesh(vertGeo, spineMat);
      bodyMesh.position.set(0, vy, vz);
      bodyMesh.renderOrder = 2;
      const spMesh = new THREE.Mesh(spinousGeo, spineMat);
      spMesh.position.set(0, vy - 0.008, vz - 0.03);
      spMesh.rotation.x = 0.35;
      spMesh.renderOrder = 2;
      ribcageGroup.add(bodyMesh, spMesh);
    }

    // --- C. LARYNX & CARTILAGINOUS C-RINGED TRACHEA (Luminous Warm Coral-Amber Shader) ---
    const tracheaMat = createAirwayLuminousMaterial(0xf27a44, 0xffd2a4, 0.92);
    const cartilageRingMat = createAirwayLuminousMaterial(0xffad6c, 0xffe6be, 0.96);

    // Thyroid & Cricoid Larynx Chamber
    const larynxGeo = new THREE.CylinderGeometry(0.035, 0.026, 0.078, 22);
    larynxGeo.scale(1.06, 1.0, 0.92);
    const larynxMesh = new THREE.Mesh(larynxGeo, tracheaMat);
    larynxMesh.position.set(0, 0.635, 0.022);
    larynxMesh.renderOrder = 4;
    airwayGroup.add(larynxMesh);
    registerClickable(larynxMesh, 'trachea_larynx');

    // Tracheal Tube (Larynx down to Carina at y=0.258)
    const tracheaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.605, 0.020),
      new THREE.Vector3(0, 0.43, 0.016),
      new THREE.Vector3(0, 0.258, 0.012),
    ]);
    const tracheaGeo = new THREE.TubeGeometry(tracheaCurve, 28, 0.021, 18, false);
    const tracheaMesh = new THREE.Mesh(tracheaGeo, tracheaMat);
    tracheaMesh.renderOrder = 4;
    airwayGroup.add(tracheaMesh);
    registerClickable(tracheaMesh, 'trachea_larynx');

    // 15 Hyaline Cartilage C-Rings along the trachea
    for (let i = 0; i < 15; i++) {
      const t = (i + 0.45) / 15;
      const pt = tracheaCurve.getPointAt(t);
      const cRingGeo = new THREE.TorusGeometry(0.0235, 0.0036, 8, 22, Math.PI * 1.65);
      cRingGeo.rotateX(Math.PI / 2);
      cRingGeo.rotateY(Math.PI * 0.68);
      const ringMesh = new THREE.Mesh(cRingGeo, cartilageRingMat);
      ringMesh.position.copy(pt);
      ringMesh.renderOrder = 4;
      airwayGroup.add(ringMesh);
      registerClickable(ringMesh, 'trachea_larynx');
    }

    // --- D. LUMINOUS MULTI-GENERATION BRONCHIAL TREE (Warm Golden-Amber Shader, Strictly Enclosed) ---
    const bronchusMat = createAirwayLuminousMaterial(0xff9242, 0xffe09c, 0.95);
    const distalBronchioleMat = createAirwayLuminousMaterial(0xffae56, 0xfff0c2, 0.92);

    const bronchialTree = buildBronchialTreeGroup(bronchusMat, distalBronchioleMat);
    bronchialGroupWrapper.add(bronchialTree);
    registerClickable(bronchialTree, 'bronchial_tree');

    // --- E. ANATOMICALLY SCULPTED LUMINOUS CORAL-ORANGE LUNGS ---
    const lungMat = createLungVolumetricMaterial();
    const rightLungGeo = buildAnatomicalLungGeometry(-1);
    const leftLungGeo = buildAnatomicalLungGeometry(1);

    const rightLungMesh = new THREE.Mesh(rightLungGeo, lungMat);
    rightLungMesh.renderOrder = 5;
    const leftLungMesh = new THREE.Mesh(leftLungGeo, lungMat);
    leftLungMesh.renderOrder = 5;
    lungsGroup.add(rightLungMesh, leftLungMesh);
    registerClickable(rightLungMesh, 'lungs');
    registerClickable(leftLungMesh, 'lungs');

    // --- F. SLEEK TRANSLUCENT FRESNEL THORACIC DIAPHRAGM DOME (Snug Under Lung Bases) ---
    const diaphragmMat = createDiaphragmFresnelMaterial();

    const diaphragmGeo = new THREE.SphereGeometry(0.288, 40, 22, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const dPos = diaphragmGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < dPos.count; i++) {
      const x = dPos.getX(i);
      let y = dPos.getY(i);
      const z = dPos.getZ(i);
      // Right hemidiaphragm slightly higher over liver; natural central tendon saddle
      const hemiAsym = x < 0 ? 0.015 : -0.008;
      const saddle = -Math.exp(-Math.pow(x / 0.075, 2)) * 0.018;
      y = y * 0.36 + hemiAsym + saddle;
      dPos.setXYZ(i, x * 1.08, y, z * 0.62);
    }
    diaphragmGeo.computeVertexNormals();
    const diaphragmMesh = new THREE.Mesh(diaphragmGeo, diaphragmMat);
    diaphragmMesh.position.set(0, -0.195, -0.012);
    diaphragmMesh.renderOrder = 3;
    diaphragmGroup.add(diaphragmMesh);
    registerClickable(diaphragmMesh, 'diaphragm');

    // --- G. HOLOGRAPHIC ATMOSPHERE: 3D TILTED ORBITAL RINGS, LIGHT BEADS & CYAN PARTICLES ---
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 64;
    glowCanvas.height = 64;
    const gCtx = glowCanvas.getContext('2d');
    if (gCtx) {
      const grad = gCtx.createRadialGradient(32, 32, 1, 32, 32, 30);
      grad.addColorStop(0, 'rgba(180, 248, 255, 1)');
      grad.addColorStop(0.35, 'rgba(56, 208, 255, 0.72)');
      grad.addColorStop(0.7, 'rgba(19, 184, 176, 0.18)');
      grad.addColorStop(1, 'rgba(19, 184, 176, 0)');
      gCtx.fillStyle = grad;
      gCtx.fillRect(0, 0, 64, 64);
    }
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    glowTex.colorSpace = THREE.SRGBColorSpace;

    // 2 Thin 3D Tilted Luminous Cyan Orbital Rings surrounding the thorax (like IMAGE 1)
    const ringMat1 = createOrbitalRingShaderMaterial(0x3ce6ff, 0.0);
    const ringMat2 = createOrbitalRingShaderMaterial(0x13b8b0, 2.4);

    const orbitRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.0042, 8, 96), ringMat1);
    orbitRing1.position.set(0, 0.14, 0);
    orbitRing1.rotation.set(Math.PI * 0.42, 0.28, -0.18);
    orbitRing1.renderOrder = 9;

    const orbitRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.0032, 8, 96), ringMat2);
    orbitRing2.position.set(0, 0.11, 0);
    orbitRing2.rotation.set(Math.PI * 0.56, -0.34, 0.22);
    orbitRing2.renderOrder = 9;

    // Subtle secondary thin horizontal scan ring behind torso
    const backHaloMat = new THREE.MeshBasicMaterial({
      color: 0x26c6da,
      transparent: true,
      opacity: 0.20,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const backHaloRing = new THREE.Mesh(new THREE.TorusGeometry(0.57, 0.0024, 8, 84), backHaloMat);
    backHaloRing.position.set(0, 0.14, -0.22);
    backHaloRing.renderOrder = 0;

    // Orbiting luminous cyan light beads traveling along the rings
    const beadSprites: { sprite: THREE.Sprite; ring: THREE.Mesh; radius: number; speed: number; angle: number }[] = [];
    [
      { ring: orbitRing1, radius: 0.65, speed: 0.52, angle: 0.4 },
      { ring: orbitRing1, radius: 0.65, speed: 0.52, angle: 3.55 },
      { ring: orbitRing2, radius: 0.72, speed: -0.38, angle: 1.7 },
    ].forEach((cfg) => {
      const sMat = new THREE.SpriteMaterial({
        map: glowTex,
        color: 0x8ef2ff,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const sp = new THREE.Sprite(sMat);
      sp.scale.set(0.068, 0.068, 1);
      sp.renderOrder = 10;
      cfg.ring.add(sp);
      beadSprites.push({ sprite: sp, ...cfg });
    });

    // Subtle floating cyan depth particles around the torso
    const pCount = 56;
    const pPositions = new Float32Array(pCount * 3);
    const pBase = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const ang = (i / pCount) * Math.PI * 2 + (i % 5) * 0.37;
      const rad = 0.50 + (i % 9) * 0.038;
      const py = -0.34 + ((i * 0.17) % 1.02);
      const px = Math.cos(ang) * rad;
      const pz = Math.sin(ang) * rad * 0.72;
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
      size: 0.032,
      map: glowTex,
      color: 0x62e8ff,
      transparent: true,
      opacity: 0.66,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    particleCloud.renderOrder = 10;

    // Soft warm volumetric core aura centered behind lungs
    const warmGlowCanvas = document.createElement('canvas');
    warmGlowCanvas.width = 64;
    warmGlowCanvas.height = 64;
    const wCtx = warmGlowCanvas.getContext('2d');
    if (wCtx) {
      const wGrad = wCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
      wGrad.addColorStop(0, 'rgba(255, 126, 72, 0.52)');
      wGrad.addColorStop(0.55, 'rgba(255, 78, 52, 0.20)');
      wGrad.addColorStop(1, 'rgba(255, 78, 52, 0)');
      wCtx.fillStyle = wGrad;
      wCtx.fillRect(0, 0, 64, 64);
    }
    const warmGlowTex = new THREE.CanvasTexture(warmGlowCanvas);
    warmGlowTex.colorSpace = THREE.SRGBColorSpace;
    const warmCoreSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: warmGlowTex,
        transparent: true,
        opacity: 0.90,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    warmCoreSprite.position.set(0, 0.14, -0.04);
    warmCoreSprite.scale.set(0.92, 0.82, 1);
    warmCoreSprite.renderOrder = 2;
    lungsGroup.add(warmCoreSprite);

    hologramGroup.add(orbitRing1, orbitRing2, backHaloRing, particleCloud);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // =========================================================================
    // 6. RAYCASTING (Click to select & inspect anatomical structures, hover cursor)
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };

    const updatePointer = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      downPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 7) return;
      updatePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const visibleClickables = clickableMeshes.filter((m) => m.visible && m.parent?.visible !== false);
      const hits = raycaster.intersectObjects(visibleClickables, true);
      if (hits.length > 0) {
        const sId = hits[0].object.userData.structureId as HeroAnatomyStructureId | undefined;
        if (sId) {
          handleSelectStructure(stateRef.current.selectedId === sId ? null : sId);
        }
      }
    };

    let lastHoverCheck = 0;
    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverCheck < 55) return;
      lastHoverCheck = now;
      updatePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const visibleClickables = clickableMeshes.filter((m) => m.visible && m.parent?.visible !== false);
      const hits = raycaster.intersectObjects(visibleClickables, true);
      if (hits.length > 0) {
        const sId = (hits[0].object.userData.structureId as HeroAnatomyStructureId) || null;
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
        const aspect = Math.max(container.clientWidth, 240) / Math.max(container.clientHeight, 240);
        const dist = computeDefaultDist(aspect);
        stateRef.current.cameraGoalTarget = defaultCamTarget.clone();
        stateRef.current.cameraGoalPos = new THREE.Vector3(0.0, 0.14, dist);
        stateRef.current.resetRootRot = true;
      },
      focusStructure: (id: HeroAnatomyStructureId) => {
        const info = HERO_ANATOMY_STRUCTURES[id];
        if (!info) return;
        stateRef.current.cameraGoalTarget = new THREE.Vector3(...info.cameraTarget);
        stateRef.current.cameraGoalPos = new THREE.Vector3(...info.cameraPos);
        stateRef.current.resetRootRot = false;
      },
    };

    // =========================================================================
    // 8. ANIMATION LOOP (Software-WebGL fenceSync guard + Off-screen/Hidden pause)
    // =========================================================================
    const clock = new THREE.Clock();
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
      const elapsed = clock.getElapsedTime();
      const st = stateRef.current;

      // Sync interactive layer toggles
      bodyShellGroup.visible = st.layers.body;
      ribcageGroup.visible = st.layers.ribcage;
      airwayGroup.visible = st.layers.airwayLungs;
      bronchialGroupWrapper.visible = st.layers.airwayLungs;
      lungsGroup.visible = st.layers.airwayLungs;
      diaphragmGroup.visible = st.layers.airwayLungs;
      hologramGroup.visible = st.layers.hologram;

      // Highlight selected / hovered anatomical structure smoothly
      const activeFocus = st.selectedId || st.hoveredId;
      const dimOthers = st.selectedId !== null ? 0.38 : 1.0;

      const ribHl = activeFocus === 'ribcage_sternum' ? 1.0 : 0.0;
      const ribDimTarget = activeFocus && activeFocus !== 'ribcage_sternum' ? dimOthers : 1.0;
      [ribMat, sternumMat, spineMat].forEach((m) => {
        m.uniforms.uHighlight.value = THREE.MathUtils.damp(m.uniforms.uHighlight.value, ribHl, 7, delta);
        m.uniforms.uDim.value = THREE.MathUtils.damp(m.uniforms.uDim.value, ribDimTarget, 7, delta);
      });

      const lungHl = activeFocus === 'lungs' ? 1.0 : 0.0;
      lungMat.uniforms.uTime.value = initialReducedMotion ? 0 : elapsed;
      lungMat.uniforms.uHighlight.value = THREE.MathUtils.damp(lungMat.uniforms.uHighlight.value, lungHl, 7, delta);
      lungMat.uniforms.uDim.value = THREE.MathUtils.damp(
        lungMat.uniforms.uDim.value,
        activeFocus === 'bronchial_tree'
          ? 0.42
          : activeFocus && activeFocus !== 'lungs'
          ? dimOthers
          : 1.0,
        7,
        delta
      );

      const trachHl = activeFocus === 'trachea_larynx' ? 1.0 : 0.0;
      const trachDim = activeFocus && activeFocus !== 'trachea_larynx' ? dimOthers : 1.0;
      [tracheaMat, cartilageRingMat].forEach((m) => {
        m.uniforms.uHighlight.value = THREE.MathUtils.damp(m.uniforms.uHighlight.value, trachHl, 7, delta);
        m.uniforms.uDim.value = THREE.MathUtils.damp(m.uniforms.uDim.value, trachDim, 7, delta);
      });

      const bronchHl = activeFocus === 'bronchial_tree' ? 1.0 : 0.0;
      const bronchDim = activeFocus && activeFocus !== 'bronchial_tree' && activeFocus !== 'lungs' ? dimOthers : 1.0;
      [bronchusMat, distalBronchioleMat].forEach((m) => {
        m.uniforms.uHighlight.value = THREE.MathUtils.damp(m.uniforms.uHighlight.value, bronchHl, 7, delta);
        m.uniforms.uDim.value = THREE.MathUtils.damp(m.uniforms.uDim.value, bronchDim, 7, delta);
      });

      const diaHl = activeFocus === 'diaphragm' ? 1.0 : 0.0;
      const diaDim = activeFocus && activeFocus !== 'diaphragm' ? dimOthers : 1.0;
      diaphragmMat.uniforms.uHighlight.value = THREE.MathUtils.damp(diaphragmMat.uniforms.uHighlight.value, diaHl, 7, delta);
      diaphragmMat.uniforms.uDim.value = THREE.MathUtils.damp(diaphragmMat.uniforms.uDim.value, diaDim, 7, delta);

      // Gentle physiological breathing motion (paused under reduced-motion)
      const breath = initialReducedMotion ? 0 : Math.sin(elapsed * 1.45);
      const lungBreathScale = 1 + breath * 0.022;
      lungsGroup.scale.set(lungBreathScale, 1 + breath * 0.013, lungBreathScale);
      bronchialGroupWrapper.scale.set(
        1 + breath * 0.014,
        1 + breath * 0.009,
        1 + breath * 0.014
      );
      diaphragmMesh.position.y = -0.195 - breath * 0.015;
      lungWarmLight.intensity = 2.1 + breath * 0.24;

      // Smooth idle sway/rotation (pauses immediately while user drags or inspects a structure)
      if (st.resetRootRot) {
        const wrapped = Math.atan2(Math.sin(rootGroup.rotation.y), Math.cos(rootGroup.rotation.y));
        rootGroup.rotation.y = THREE.MathUtils.damp(wrapped, 0, 8, delta);
        if (Math.abs(rootGroup.rotation.y) < 0.008) {
          rootGroup.rotation.y = 0;
          st.resetRootRot = false;
        }
      } else if (st.autoRotate && !initialReducedMotion && !userInteracting && !st.selectedId) {
        rootGroup.rotation.y += delta * 0.16;
      }

      // Holographic rings & particles subtle animation
      if (!initialReducedMotion && st.layers.hologram) {
        ringMat1.uniforms.uTime.value = elapsed;
        ringMat2.uniforms.uTime.value = elapsed;
        orbitRing1.rotation.z = -0.18 + Math.sin(elapsed * 0.32) * 0.08;
        orbitRing2.rotation.z = 0.22 + Math.cos(elapsed * 0.28) * 0.08;
        backHaloRing.rotation.z = elapsed * 0.12;

        beadSprites.forEach((b) => {
          const a = b.angle + elapsed * b.speed;
          b.sprite.position.set(Math.cos(a) * b.radius, Math.sin(a) * b.radius, 0);
        });

        const pAttr = particleGeo.getAttribute('position') as THREE.BufferAttribute;
        for (let i = 0; i < pCount; i++) {
          const bx = pBase[i * 3];
          const by = pBase[i * 3 + 1];
          const bz = pBase[i * 3 + 2];
          const rotA = elapsed * 0.08;
          const rx = bx * Math.cos(rotA) - bz * Math.sin(rotA);
          const rz = bx * Math.sin(rotA) + bz * Math.cos(rotA);
          const dy = Math.sin(elapsed * 0.7 + i * 0.9) * 0.026;
          pAttr.setXYZ(i, rx, by + dy, rz);
        }
        pAttr.needsUpdate = true;
      }

      // Smooth damped camera focus / zoom / reset transitions (snappy even under software WebGL)
      const camLambda = isSoftwareGl ? 14 : 7.5;
      if (st.cameraGoalTarget) {
        controls.target.x = THREE.MathUtils.damp(controls.target.x, st.cameraGoalTarget.x, camLambda, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, st.cameraGoalTarget.y, camLambda, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, st.cameraGoalTarget.z, camLambda, delta);
      }
      if (st.cameraGoalPos) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, st.cameraGoalPos.x, camLambda, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, st.cameraGoalPos.y, camLambda, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, st.cameraGoalPos.z, camLambda, delta);
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

    // Responsive ResizeObserver
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

    // Start render loop
    tick();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      io?.disconnect();
      ro.disconnect();
      domEl.removeEventListener('pointerdown', onPointerDown);
      domEl.removeEventListener('pointerup', onPointerUp);
      domEl.removeEventListener('pointermove', onPointerMove);

      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => m.dispose());
        }
      });
      envTex.dispose();
      glowTex.dispose();
      warmGlowTex.dispose();
      controls.dispose();
      renderer.dispose();
    };
  }, [handleSelectStructure]);

  const selectedInfo = selectedId ? HERO_ANATOMY_STRUCTURES[selectedId] : null;
  const structureOrder: HeroAnatomyStructureId[] = [
    'trachea_larynx',
    'bronchial_tree',
    'lungs',
    'ribcage_sternum',
    'diaphragm',
  ];

  return (
    <div
      data-testid="hero-respiratory-3d-root"
      className={`relative w-full h-full flex flex-col items-center justify-center ${className}`}
    >
      {/* Dedicated WebGL 3D Canvas Container (Real interactive 3D — drag to orbit, click structures) */}
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

      {/* Unified Bottom Stack: Educational Card + Collapsible Layer Panel + Compact Control Pill (Zero Overlap Possible) */}
      <div
        data-testid="hero-3d-control-dock"
        dir={isAr ? 'rtl' : 'ltr'}
        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 w-[calc(100%-16px)] max-w-[468px] pointer-events-none"
      >
        {/* Selected Anatomical Structure Educational Card */}
        {selectedInfo && (
          <div
            data-testid="hero-anatomy-edu-card"
            className="pointer-events-auto w-full rounded-2xl bg-[#072133]/95 border border-[#38BDF8]/45 px-3.5 py-2.5 shadow-[0_12px_30px_rgba(3,12,20,0.72)] text-start"
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
                ? 'توضيح تشريحي تعليمي · اسحب للتدوير ثلاثي الأبعاد'
                : 'Educational anatomical visualization · Drag to rotate in 3D'}
            </div>
          </div>
        )}

        {/* Expandable Anatomical Structure & Layer Panel */}
        {controlsExpanded && (
          <div
            data-testid="hero-3d-expanded-panel"
            className="pointer-events-auto w-full rounded-xl bg-[#072133]/95 border border-[#1E4B63] px-2.5 py-2 shadow-[0_10px_28px_rgba(3,12,20,0.7)] flex flex-col gap-2"
          >
            {/* Accurate Anatomical Structure Chips */}
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

            {/* Layer Visibility Toggles */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 border-t border-[#194257]">
              {(
                [
                  { key: 'body', ar: 'الجسم', en: 'Torso' },
                  { key: 'ribcage', ar: 'القفص الصدري', en: 'Ribcage' },
                  { key: 'airwayLungs', ar: 'المجرى والرئتان', en: 'Airway & Lungs' },
                  { key: 'hologram', ar: 'الحلقات', en: 'Rings' },
                ] as const
              ).map((item) => {
                const on = layers[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    data-testid={`hero-layer-toggle-${item.key}`}
                    onClick={() =>
                      setLayers((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
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

        {/* Compact Primary Controls Pill Bar (Zoom, Reset, Auto-Rotate, Expand Layers/Structures) */}
        <div className="pointer-events-auto inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#072133]/92 border border-[#1E4B63] shadow-[0_6px_20px_rgba(3,12,20,0.58)]">
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
            onClick={() => setAutoRotate((v) => !v)}
            title={
              autoRotate
                ? isAr
                  ? 'إيقاف الدوران الهادئ'
                  : 'Pause idle rotation'
                : isAr
                ? 'تشغيل الدوران الهادئ'
                : 'Resume idle rotation'
            }
            aria-label={autoRotate ? 'Pause rotation' : 'Resume rotation'}
            className="p-1.5 rounded-full text-[#B9D3E0] hover:text-[#F3F7F8] hover:bg-[#123B50] transition-colors cursor-pointer"
          >
            {autoRotate ? (
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

