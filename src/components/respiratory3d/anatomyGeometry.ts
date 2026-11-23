import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// ============================================================================
// PROCEDURAL MEDICAL ANATOMY GEOMETRY BUILDERS (Pure Three.js BufferGeometry)
// High-fidelity educational adult thoracic & respiratory proportions:
//  - Recognizable sculpted upper torso + seamless deltoid shoulders & arms
//  - 12-pair thoracic rib cage (true 1-7 + costal cartilage, false 8-10 arch,
//    floating 11-12), curved sternum, S-clavicles, humeral shoulder caps,
//    and 14-segment articulated vertebral column
//  - Sculpted multi-lobed right (3 lobes: oblique + horizontal fissures) &
//    left (2 lobes: oblique fissure + pronounced cardiac notch & lingula) lungs
//    with rounded superior cupolas and sharp costophrenic margins
//  - Sculpted larynx (thyroid/cricoid), 18-ring C-cartilage trachea, carina
//  - Anatomically asymmetric 4-generation bronchial tree (6 airflow pathways)
//  - Sculpted double-domed thoracic diaphragm with central tendon attribute
// ============================================================================

const smoothstep = (e0: number, e1: number, x: number): number => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/**
 * Shared analytical torso cross-section profile matched identically inside
 * the torso/arm GLSL shader for zero-seam shoulder-deltoid integration.
 */
export function evaluateTorsoProfile(y: number): {
  rx: number;
  rz: number;
  zCenter: number;
} {
  const yMin = -0.66;
  let rx = 0.35;
  let rz = 0.215;
  let zCenter = 0;

  if (y > 0.56) {
    // Anatomically tapered neck rising gently into jawline base
    const neckT = smoothstep(0.56, 0.72, y);
    const jawT = smoothstep(0.76, 0.88, y);
    rx = THREE.MathUtils.lerp(0.148, 0.114, neckT) + jawT * 0.034;
    rz = THREE.MathUtils.lerp(0.144, 0.118, neckT) + jawT * 0.042;
    zCenter = 0.008 + jawT * 0.030;
  } else if (y > 0.42) {
    // Recognizable trapezius slope into broad acromial shoulder girdle
    const t = (y - 0.42) / 0.14;
    const s = t * t * (3 - 2 * t);
    rx = THREE.MathUtils.lerp(0.462, 0.148, s);
    rz = THREE.MathUtils.lerp(0.208, 0.144, s);
    zCenter = THREE.MathUtils.lerp(0.002, 0.008, s);
  } else if (y > 0.08) {
    // Broad upper thorax tapering naturally along latissimus dorsi
    const t = (y - 0.08) / 0.34;
    rx = THREE.MathUtils.lerp(0.372, 0.462, smoothstep(0, 1, t));
    rz = THREE.MathUtils.lerp(0.242, 0.208, t);
    zCenter = THREE.MathUtils.lerp(0.014, 0.002, t);
  } else {
    // Lower ribcage tapering organically into upper abdominal waist
    const t = (y - yMin) / (0.08 - yMin);
    rx = THREE.MathUtils.lerp(0.306, 0.372, smoothstep(0, 1, t));
    rz = THREE.MathUtils.lerp(0.206, 0.242, smoothstep(0, 1, t));
    zCenter = THREE.MathUtils.lerp(0.004, 0.014, t);
  }

  return { rx, rz, zCenter };
}

/**
 * Sculpted adult upper-torso shell with clear human anatomical landmarks:
 * sternocleidomastoid V, suprasternal notch, clavicular ridges, pectoral contours,
 * sternal furrow, thoracic rib flanks, and posterior scapular/spinal relief.
 */
export function buildAnatomicalTorsoGeometry(): THREE.BufferGeometry {
  const vSteps = 72;
  const uSteps = 66;
  const yMin = -0.66;
  const yMax = 0.88;

  const positions = new Float32Array((vSteps + 1) * (uSteps + 1) * 3);
  const uvs = new Float32Array((vSteps + 1) * (uSteps + 1) * 2);
  const indices: number[] = [];

  let pIdx = 0;
  let uvIdx = 0;

  for (let iy = 0; iy <= vSteps; iy++) {
    const v = iy / vSteps;
    const y = yMin + v * (yMax - yMin);
    const { rx, rz, zCenter } = evaluateTorsoProfile(y);

    const pecWeight = Math.exp(-Math.pow((y - 0.23) / 0.14, 2));
    const subPecWeight = Math.exp(-Math.pow((y - 0.065) / 0.058, 2));
    const clavNotchWeight = Math.exp(-Math.pow((y - 0.478) / 0.048, 2));
    const scapulaWeight = Math.exp(-Math.pow((y - 0.27) / 0.155, 2));
    const spineGrooveWeight =
      smoothstep(-0.55, -0.08, y) * (1 - smoothstep(0.44, 0.62, y));
    const scmWeight = Math.exp(-Math.pow((y - 0.655) / 0.105, 2));
    const jawWeight = smoothstep(0.76, 0.87, y);
    const shoulderRound = Math.exp(-Math.pow((y - 0.405) / 0.092, 2));

    for (let ix = 0; ix <= uSteps; ix++) {
      const u = ix / uSteps;
      const theta = u * Math.PI * 2;
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);

      let x = sinT * rx;
      let z = zCenter + cosT * rz;

      // Subtle anatomical chest-wall squaring (broad anterior/posterior planes)
      const chestBox =
        smoothstep(-0.58, 0.34, y) * (1 - smoothstep(0.42, 0.56, y));
      const sq = Math.pow(Math.sin(2 * theta), 2);
      x *= 1 + 0.050 * chestBox * sq;
      z *= 1 + 0.024 * chestBox * sq;

      // Rounded lateral acromial/deltoid cap transition
      const latMask = Math.pow(Math.abs(sinT), 3.0);
      x += Math.sign(sinT) * shoulderRound * latMask * 0.026;

      if (cosT > 0) {
        // Sculpted pectoral planes & central sternal furrow
        const pecMounds =
          Math.pow(Math.abs(sinT), 0.72) *
          (1 - 0.32 * Math.pow(Math.abs(sinT), 3.0)) *
          Math.pow(cosT, 1.35);
        const sternalFurrow =
          Math.exp(-Math.pow(sinT / 0.145, 2)) * Math.pow(cosT, 2.0);
        z += pecWeight * (0.044 * pecMounds - 0.019 * sternalFurrow);

        // Crisp lower pectoral shelf transition
        z -= subPecWeight * 0.011 * Math.pow(Math.abs(sinT), 0.65) * cosT;

        // Suprasternal (jugular) notch depression
        const notch = Math.exp(-Math.pow(sinT / 0.20, 2)) * cosT;
        z -= clavNotchWeight * 0.026 * notch;

        // Clavicular bony prominence & infraclavicular hollow
        const clavRidge =
          Math.exp(-Math.pow((y - 0.458) / 0.022, 2)) *
          smoothstep(0.11, 0.30, Math.abs(sinT)) *
          (1 - smoothstep(0.76, 0.96, Math.abs(sinT))) *
          cosT;
        const infraClav =
          Math.exp(-Math.pow((y - 0.402) / 0.030, 2)) *
          Math.exp(-Math.pow((Math.abs(sinT) - 0.56) / 0.17, 2)) *
          cosT;
        z += 0.019 * clavRidge - 0.012 * infraClav;

        // Sternocleidomastoid V-muscles along anterior-lateral neck
        const scmPos = 0.22 + (y - 0.54) * 1.15;
        const scm =
          Math.exp(
            -Math.pow((Math.abs(sinT) - Math.min(0.65, scmPos)) / 0.15, 2)
          ) * cosT;
        z += scmWeight * 0.012 * scm;

        // Subtle anterior laryngeal contour in mid-neck
        const throatFront =
          Math.exp(-Math.pow((y - 0.65) / 0.044, 2)) *
          Math.exp(-Math.pow(sinT / 0.18, 2)) *
          cosT;
        z += 0.008 * throatFront;

        // Subtle chin contour before top dissolve
        if (jawWeight > 0) {
          const chinTip = Math.exp(-Math.pow(sinT / 0.34, 2)) * cosT;
          z += jawWeight * 0.026 * chinTip;
        }
      } else {
        // Posterior anatomical contours: scapular prominences + paraspinal furrow
        const backCos = -cosT;
        const scap =
          Math.exp(-Math.pow((Math.abs(sinT) - 0.46) / 0.22, 2)) *
          Math.pow(backCos, 1.25);
        const spineGroove =
          Math.exp(-Math.pow(sinT / 0.135, 2)) * Math.pow(backCos, 1.8);
        z -= scapulaWeight * 0.030 * scap;
        z += spineGrooveWeight * 0.026 * spineGroove;
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
 * Anatomically tapered relaxed upper arm & sculpted deltoid shoulder cap.
 * Paired with exact analytical CSG clipping in the torso shader for a single
 * continuous medical-glass body contour with zero interior crossing seam.
 */
export function buildAnatomicalUpperArmGeometry(
  side: -1 | 1
): THREE.BufferGeometry {
  const vSteps = 34;
  const uSteps = 28;
  const positions = new Float32Array((vSteps + 1) * (uSteps + 1) * 3);
  const uvs = new Float32Array((vSteps + 1) * (uSteps + 1) * 2);
  const indices: number[] = [];

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(side * 0.435, 0.415, -0.006),
    new THREE.Vector3(side * 0.514, 0.295, -0.010),
    new THREE.Vector3(side * 0.542, 0.04, -0.014),
    new THREE.Vector3(side * 0.556, -0.28, -0.008),
    new THREE.Vector3(side * 0.568, -0.60, -0.002),
  ]);

  let pIdx = 0;
  let uvIdx = 0;

  for (let iy = 0; iy <= vSteps; iy++) {
    const t = iy / vSteps;
    const center = curve.getPoint(t);

    const deltoidBell = Math.exp(-Math.pow((t - 0.14) / 0.17, 2));
    const bicepBell = Math.exp(-Math.pow((t - 0.54) / 0.23, 2));
    const topPinch = smoothstep(0.0, 0.12, t);
    const rx =
      (0.086 + deltoidBell * 0.044 + bicepBell * 0.011 - t * 0.015) *
      (0.58 + 0.42 * topPinch);
    const rz =
      (0.098 + deltoidBell * 0.039 + bicepBell * 0.015 - t * 0.015) *
      (0.58 + 0.42 * topPinch);

    for (let ix = 0; ix <= uSteps; ix++) {
      const u = ix / uSteps;
      const theta = u * Math.PI * 2;
      const x = center.x + Math.cos(theta) * rx;
      const y = center.y + Math.sin(theta) * 0.007;
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
 * Medically sculpted 3D anatomical lung lobe mesh:
 *  - side = -1 => Anatomical Right Lung (viewer's left): broader, slightly shorter
 *    over liver dome, 3 distinct lobes separated by oblique & horizontal fissures.
 *  - side = +1 => Anatomical Left Lung (viewer's right): narrower, slightly taller,
 *    2 distinct lobes separated by oblique fissure + pronounced anterior-medial
 *    cardiac notch & lingula.
 *  - Graceful rounded superior cupola, clean vertical mediastinal border, sweeping
 *    convex costal curvature, and flared costophrenic inferior margin resting snugly
 *    over the concave diaphragmatic dome.
 */
export function buildSculptedLungGeometry(
  side: -1 | 1,
  scaleInset = 1.0
): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(1, 56, 48);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const fissureAttr = new Float32Array(pos.count);
  const isAnatomicalLeft = side === 1;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // Normalized height h in [0, 1] (0 = diaphragmatic base, 1 = superior cupola)
    const h = (y + 1) * 0.5;

    // 1. Natural anatomical lung envelope: rounded superior cupola + broad costal sweep
    const cupolaDome = Math.pow(Math.sin(Math.pow(h, 0.56) * Math.PI), 0.32);
    const upperFullness =
      0.86 +
      0.16 * smoothstep(0.42, 0.84, h) * (1 - smoothstep(0.91, 1.0, h));
    const lowerSweep = 0.90 + 0.24 * Math.pow(1 - h, 1.35);

    // 2. Clean nearly-vertical mediastinal medial face vs sweeping convex costal lateral face
    const isMedial = x * side < 0;
    if (isMedial) {
      x *= 0.54;
    } else {
      x *= 1.18;
    }

    // 3. Medial pulmonary hilum concavity (where main bronchus enters)
    if (isMedial) {
      const hilumDist = Math.hypot((y - 0.18) / 0.29, (z - 0.04) / 0.33);
      const hilumDip = Math.exp(-hilumDist * hilumDist * 1.9) * 0.16;
      x += side * hilumDip;
    }

    // 4. Pronounced Anatomical Cardiac Notch & Lingula on Left Lung (viewer's right)
    if (isAnatomicalLeft && x < 0.34 && y < 0.16 && y > -0.96 && z > -0.32) {
      const notchH = Math.exp(-Math.pow((y + 0.38) / 0.34, 2));
      const notchFront = smoothstep(-0.32, 0.58, z);
      const medialWeight = smoothstep(0.34, -0.50, x);
      x += 0.54 * notchH * notchFront * medialWeight;
      // Distinct lingula lip curving below cardiac notch
      const lingula =
        Math.exp(-Math.pow((y + 0.78) / 0.13, 2)) * notchFront * medialWeight;
      x -= 0.15 * lingula;
    }

    // 5. Concave diaphragmatic dome base + crisp costophrenic (costodiaphragmatic) rim flare
    if (y < -0.40) {
      const bottomT = (-0.40 - y) / 0.60;
      const radial = Math.min(1, Math.hypot(x * 0.86, z * 0.92));
      // Concave upward vault matching the thoracic diaphragm dome directly underneath
      const domeLift = 0.38 * (1 - radial * radial * 0.90);
      // Graceful downward lateral costophrenic angle flare
      const latFactor = smoothstep(-0.15, 0.85, x * side);
      const costophrenicDip =
        -0.14 * Math.pow(radial, 1.9) * (0.55 + 0.45 * latFactor) * smoothstep(0.32, 1.0, bottomT);
      y += bottomT * (domeLift + costophrenicDip);
      // Right lung base sits slightly higher over the liver
      if (!isAnatomicalLeft) {
        y += bottomT * 0.068;
      }
    }

    // 6. Posterior thoracic spine convexity
    if (z < -0.1) {
      z *= 1.08;
    }

    // 7. Distinct anatomically grooved lobar fissures (encoded in aFissure for shader accent)
    // Oblique fissure (both lungs): descends diagonally from posterior-superior to anterior-inferior
    const obliqueTargetY = 0.34 - 0.80 * (z * 0.5 + 0.5) - 0.12 * (x * side);
    const obliqueBand = Math.exp(-Math.pow((y - obliqueTargetY) / 0.050, 2));
    const costalMask = smoothstep(-0.22, 0.36, x * side);
    let fissureDepth = obliqueBand * (0.82 + 0.18 * costalMask);

    // Horizontal fissure (Right Lung ONLY — clearly separates superior & middle lobes anteriorly)
    if (!isAnatomicalLeft && z > -0.18) {
      const horizMask = smoothstep(-0.18, 0.14, z);
      const horizBand = Math.exp(-Math.pow((y - 0.06) / 0.044, 2)) * horizMask;
      fissureDepth = Math.max(fissureDepth, horizBand * 1.0);
    }

    // Subtle costal rib impressions along lateral pleural surface
    const ribRipple =
      costalMask *
      smoothstep(0.10, 0.86, h) *
      (Math.sin(y * 23.0 - z * 3.0) * 0.5 + 0.5) *
      0.008;

    const groove = fissureDepth * 0.062 + ribRipple;
    fissureAttr[i] = Math.min(1, fissureDepth);

    // Final anatomical thoracic proportions with clean pleural clearance inside rib cage
    const scaleX =
      (isAnatomicalLeft ? 0.156 : 0.172) *
      (0.58 + 0.44 * cupolaDome) *
      upperFullness *
      lowerSweep *
      scaleInset;
    const scaleY = (isAnatomicalLeft ? 0.312 : 0.302) * scaleInset;
    const scaleZ =
      0.150 *
      (0.66 + 0.38 * Math.pow(Math.sin(h * Math.PI), 0.48)) *
      scaleInset;

    // Gentle superior medial curve toward thoracic inlet
    const apexInward = side * -0.020 * Math.pow(h, 2.1);
    const outX =
      x * scaleX * (1 - groove) +
      side * (isAnatomicalLeft ? 0.156 : 0.146) +
      apexInward;
    const outY = y * scaleY + (isAnatomicalLeft ? 0.128 : 0.136);
    const outZ = z * scaleZ * (1 - groove) - 0.016 + (1 - h) * 0.015;

    pos.setXYZ(i, outX, outY, outZ);
  }

  geo.setAttribute('aFissure', new THREE.BufferAttribute(fissureAttr, 1));
  geo.computeVertexNormals();
  return geo;
}

/**
 * Custom elliptical-section anatomical rib / costal cartilage / clavicle loft
 * along a 3D CatmullRomCurve3 so bones read as realistic flat curved arches.
 */
export function buildFlatBoneArchGeometry(
  curve: THREE.CatmullRomCurve3,
  segments = 24,
  thicknessY = 0.010,
  thicknessNormal = 0.0048,
  taperEnds = true
): THREE.BufferGeometry {
  const frames = curve.computeFrenetFrames(segments, false);
  const ringPts = 12;
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

    const endTaper = taperEnds ? 0.78 + 0.22 * Math.sin(t * Math.PI) : 1.0;
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
 * Curved 3D anatomical Sternum:
 * Manubrium (jugular & clavicular notches) + Sternal Angle of Louis +
 * Body (Gladiolus) + Xiphoid Process, curved gently in Z to conform to the
 * anterior thoracic wall cleanly outside the lungs.
 */
export function buildCurvedSternumGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-0.044, 0.440);
  shape.quadraticCurveTo(0, 0.422, 0.044, 0.440);
  shape.lineTo(0.054, 0.396);
  shape.quadraticCurveTo(0.042, 0.365, 0.028, 0.344);
  shape.quadraticCurveTo(0.033, 0.256, 0.032, 0.150);
  shape.quadraticCurveTo(0.025, 0.105, 0.013, 0.082);
  shape.lineTo(0, 0.040);
  shape.lineTo(-0.013, 0.082);
  shape.quadraticCurveTo(-0.025, 0.105, -0.032, 0.150);
  shape.quadraticCurveTo(-0.033, 0.256, -0.028, 0.344);
  shape.quadraticCurveTo(-0.042, 0.365, -0.054, 0.396);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.013,
    bevelEnabled: true,
    bevelThickness: 0.0055,
    bevelSize: 0.0045,
    bevelSegments: 4,
    curveSegments: 16,
  });

  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const yNorm = THREE.MathUtils.clamp((y - 0.04) / 0.40, 0, 1);
    const anteriorCurve =
      0.184 +
      Math.sin(yNorm * Math.PI) * 0.032 -
      Math.pow(x / 0.055, 2) * 0.006;
    const louisAngle = Math.exp(-Math.pow((y - 0.344) / 0.016, 2)) * 0.005;
    pos.setZ(i, z + anteriorCurve + louisAngle);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Complete Anatomically Proportioned Thoracic Cage & Shoulder Girdle:
 *  - Curved sternum
 *  - S-curved clavicles + subtle anatomical humeral head / upper-shaft articulation
 *  - 12 pairs of thoracic ribs split cleanly into:
 *      * Posterior/lateral bony rib arcs (rendered behind lungs for crisp spatial depth)
 *      * Anterior bony rib arcs + distinct anterior costal cartilages (arching cleanly
 *        in front of the lungs with realistic pleural clearance)
 *  - 14-segment cervical/thoracic vertebral column with transverse & spinous processes
 */
export function buildThoracicCageParts(): {
  ribsBackGeometry: THREE.BufferGeometry;
  ribsFrontGeometry: THREE.BufferGeometry;
  cartilageGeometry: THREE.BufferGeometry;
  claviclesGeometry: THREE.BufferGeometry;
  sternumGeometry: THREE.BufferGeometry;
  spineGeometry: THREE.BufferGeometry;
} {
  const ribBackGeos: THREE.BufferGeometry[] = [];
  const ribFrontGeos: THREE.BufferGeometry[] = [];
  const cartilageGeos: THREE.BufferGeometry[] = [];
  const clavGeos: THREE.BufferGeometry[] = [];
  const spineGeos: THREE.BufferGeometry[] = [];

  // 1. S-Curved Clavicles with smooth acromial flare (no detached sphere look)
  ([-1, 1] as const).forEach((side) => {
    const clavCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.038, 0.436, 0.190),
      new THREE.Vector3(side * 0.150, 0.456, 0.184),
      new THREE.Vector3(side * 0.288, 0.460, 0.106),
      new THREE.Vector3(side * 0.422, 0.446, 0.014),
    ]);
    clavGeos.push(buildFlatBoneArchGeometry(clavCurve, 26, 0.0126, 0.0088, true));

    // Subtle posterior-lateral acromial arch & proximal humerus curve tucked naturally inside deltoid
    const humerusCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.432, 0.414, -0.008),
      new THREE.Vector3(side * 0.474, 0.352, -0.010),
      new THREE.Vector3(side * 0.502, 0.235, -0.012),
      new THREE.Vector3(side * 0.518, 0.085, -0.014),
    ]);
    clavGeos.push(
      buildFlatBoneArchGeometry(humerusCurve, 14, 0.0155, 0.0125, true)
    );
  });

  // 2. 12 Pairs of Anatomical Ribs (Expanded ~4.5% for clean pleural cavity clearance around lungs)
  const ribConfigs = [
    // True ribs 1–7
    { yBack: 0.464, yLat: 0.432, yCart: 0.418, yFront: 0.418, rx: 0.224, zFront: 0.192, xEnd: 0.044, type: 'true' },
    { yBack: 0.412, yLat: 0.369, yCart: 0.354, yFront: 0.350, rx: 0.274, zFront: 0.206, xEnd: 0.031, type: 'true' },
    { yBack: 0.356, yLat: 0.302, yCart: 0.286, yFront: 0.289, rx: 0.312, zFront: 0.216, xEnd: 0.031, type: 'true' },
    { yBack: 0.298, yLat: 0.233, yCart: 0.218, yFront: 0.228, rx: 0.335, zFront: 0.219, xEnd: 0.031, type: 'true' },
    { yBack: 0.238, yLat: 0.164, yCart: 0.150, yFront: 0.170, rx: 0.347, zFront: 0.216, xEnd: 0.030, type: 'true' },
    { yBack: 0.176, yLat: 0.094, yCart: 0.083, yFront: 0.118, rx: 0.350, zFront: 0.209, xEnd: 0.026, type: 'true' },
    { yBack: 0.112, yLat: 0.024, yCart: 0.016, yFront: 0.084, rx: 0.344, zFront: 0.199, xEnd: 0.024, type: 'true' },
    // False ribs 8–10 (sweeping up into smooth bilateral costal margin)
    { yBack: 0.048, yLat: -0.042, yCart: -0.046, yFront: 0.026, rx: 0.330, zFront: 0.186, xEnd: 0.074, type: 'false' },
    { yBack: -0.014, yLat: -0.106, yCart: -0.104, yFront: -0.028, rx: 0.312, zFront: 0.168, xEnd: 0.124, type: 'false' },
    { yBack: -0.074, yLat: -0.166, yCart: -0.160, yFront: -0.082, rx: 0.288, zFront: 0.146, xEnd: 0.168, type: 'false' },
    // Floating ribs 11–12 (posterior-lateral only)
    { yBack: -0.132, yLat: -0.216, yCart: -0.226, yFront: -0.226, rx: 0.256, zFront: 0.015, xEnd: 0.228, type: 'floating' },
    { yBack: -0.186, yLat: -0.254, yCart: -0.260, yFront: -0.260, rx: 0.210, zFront: -0.056, xEnd: 0.192, type: 'floating' },
  ] as const;

  ribConfigs.forEach((rc, idx) => {
    ([-1, 1] as const).forEach((side) => {
      const thicknessY = idx === 0 ? 0.0094 : idx >= 10 ? 0.0084 : 0.0114;
      const thicknessN = idx >= 10 ? 0.0045 : 0.0056;

      if (rc.type === 'floating') {
        const floatCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.026, rc.yBack, -0.146),
          new THREE.Vector3(side * (rc.rx * 0.62), rc.yBack - 0.024, -0.140),
          new THREE.Vector3(side * rc.rx, rc.yLat, -0.048),
          new THREE.Vector3(side * rc.xEnd, rc.yFront, rc.zFront),
        ]);
        ribBackGeos.push(
          buildFlatBoneArchGeometry(floatCurve, 18, thicknessY, thicknessN, true)
        );
        return;
      }

      // Split cleanly at the mid-axillary lateral apex so back arches render behind lungs
      // and front arches render crisp and pearlescent in front of lungs
      const latPt = new THREE.Vector3(side * rc.rx, rc.yLat, -0.012);
      const ccX = side * (rc.rx * 0.63);
      const ccY = rc.yCart;
      const ccZ = rc.zFront * 0.86;

      const backCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 0.024, rc.yBack, -0.152),
        new THREE.Vector3(side * (rc.rx * 0.72), rc.yBack - 0.016, -0.154),
        latPt,
      ]);
      ribBackGeos.push(
        buildFlatBoneArchGeometry(backCurve, 14, thicknessY, thicknessN, false)
      );

      const frontBonyCurve = new THREE.CatmullRomCurve3([
        latPt,
        new THREE.Vector3(
          side * (rc.rx * 0.86),
          THREE.MathUtils.lerp(rc.yLat, ccY, 0.52),
          THREE.MathUtils.lerp(-0.012, ccZ, 0.56) + 0.018
        ),
        new THREE.Vector3(ccX, ccY, ccZ),
      ]);
      ribFrontGeos.push(
        buildFlatBoneArchGeometry(frontBonyCurve, 12, thicknessY, thicknessN, false)
      );

      // Anterior costal cartilage segment sweeping cleanly to sternum / costal arch
      const cartMidX = side * THREE.MathUtils.lerp(Math.abs(ccX), rc.xEnd, 0.52);
      const cartMidY =
        THREE.MathUtils.lerp(ccY, rc.yFront, 0.45) -
        (rc.type === 'false' ? 0.014 : 0.004);
      const cartMidZ = THREE.MathUtils.lerp(ccZ, rc.zFront, 0.64);

      const cartCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(ccX, ccY, ccZ),
        new THREE.Vector3(cartMidX, cartMidY, cartMidZ),
        new THREE.Vector3(side * rc.xEnd, rc.yFront, rc.zFront),
      ]);
      cartilageGeos.push(
        buildFlatBoneArchGeometry(
          cartCurve,
          11,
          thicknessY * 0.90,
          thicknessN * 0.92,
          false
        )
      );
    });
  });

  // 3. Articulated Cervical & Thoracic Vertebral Column (14 segments)
  for (let v = 0; v < 14; v++) {
    const vy = 0.62 - v * 0.058;
    const vz = -0.102 - Math.sin((v / 13) * Math.PI) * 0.054;
    const rScale = 0.84 + (v / 13) * 0.28;

    const body = new THREE.CylinderGeometry(
      0.025 * rScale,
      0.027 * rScale,
      0.032,
      14
    );
    body.translate(0, vy, vz);
    spineGeos.push(body);

    const spinous = new THREE.BoxGeometry(0.0085, 0.014, 0.034);
    spinous.rotateX(0.42);
    spinous.translate(0, vy - 0.009, vz - 0.030);
    spineGeos.push(spinous);

    ([-1, 1] as const).forEach((side) => {
      const tp = new THREE.CylinderGeometry(
        0.0055,
        0.0065,
        0.028 * rScale,
        8
      );
      tp.rotateZ(Math.PI / 2);
      tp.rotateY(side * -0.25);
      tp.translate(side * 0.026 * rScale, vy + 0.002, vz - 0.014);
      spineGeos.push(tp);
    });
  }

  return {
    ribsBackGeometry: mergeGeometries(ribBackGeos, false)!,
    ribsFrontGeometry: mergeGeometries(ribFrontGeos, false)!,
    cartilageGeometry: mergeGeometries(cartilageGeos, false)!,
    claviclesGeometry: mergeGeometries(clavGeos, false)!,
    sternumGeometry: buildCurvedSternumGeometry(),
    spineGeometry: mergeGeometries(spineGeos, false)!,
  };
}

function attachTreeDepthAttribute(
  geo: THREE.BufferGeometry,
  depthFn: (y: number, distFromMidline: number) => number
): THREE.BufferGeometry {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const depths = new Float32Array(pos.count);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    depths[i] = depthFn(y, Math.abs(x));
  }
  geo.setAttribute('aTreeDepth', new THREE.BufferAttribute(depths, 1));
  return geo;
}

/**
 * Anatomically sculpted Larynx (Thyroid cartilage shield with laryngeal prominence,
 * Cricoid cartilage ring) + Tracheal Tube + 18 Crisp C-Shaped Hyaline Cartilage Rings + Carina.
 */
export function buildLarynxAndTracheaParts(): {
  larynxTracheaGeometry: THREE.BufferGeometry;
  cartilageRingsGeometry: THREE.BufferGeometry;
  tracheaCurve: THREE.CatmullRomCurve3;
} {
  const airwayGeos: THREE.BufferGeometry[] = [];
  const ringGeos: THREE.BufferGeometry[] = [];

  // 1. Sculpted Thyroid Cartilage Shield (anterior V-prominence + superior thyroid notch)
  const thyroidGeo = new THREE.CylinderGeometry(
    0.037,
    0.030,
    0.058,
    28,
    10,
    false
  );
  const tPos = thyroidGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < tPos.count; i++) {
    let x = tPos.getX(i);
    let y = tPos.getY(i);
    let z = tPos.getZ(i);
    const frontness = Math.max(0, z / 0.037);
    const prominence = Math.exp(-Math.pow(x / 0.015, 2)) * frontness;
    z += prominence * 0.011 * (1 - Math.abs(y) / 0.036);
    if (y > 0.016 && frontness > 0.4) {
      y -= prominence * 0.011;
    }
    x *= 1.08;
    z *= 0.90;
    tPos.setXYZ(i, x, y + 0.648, z + 0.022);
  }
  thyroidGeo.computeVertexNormals();
  airwayGeos.push(thyroidGeo);

  // 2. Cricoid Cartilage Ring (just below thyroid shield)
  const cricoidGeo = new THREE.TorusGeometry(0.0252, 0.0070, 12, 28);
  cricoidGeo.rotateX(Math.PI / 2);
  cricoidGeo.scale(1.04, 1.18, 0.96);
  cricoidGeo.translate(0, 0.602, 0.020);
  ringGeos.push(cricoidGeo);

  // 3. Smooth Tracheal Tube from Cricoid (y=0.602) down to Carina (y=0.258)
  const tracheaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.620, 0.021),
    new THREE.Vector3(0, 0.440, 0.016),
    new THREE.Vector3(0, 0.258, 0.012),
  ]);
  const tracheaTube = new THREE.TubeGeometry(tracheaCurve, 34, 0.0218, 22, false);
  const trPos = tracheaTube.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < trPos.count; i++) {
    const z = trPos.getZ(i);
    const y = trPos.getY(i);
    const zRef = THREE.MathUtils.lerp(0.012, 0.021, (y - 0.258) / 0.362);
    if (z < zRef) {
      trPos.setZ(i, zRef + (z - zRef) * 0.78);
    }
  }
  tracheaTube.computeVertexNormals();
  airwayGeos.push(tracheaTube);

  // Sculpted Carina keel bulb at tracheal bifurcation (y = 0.258)
  const carinaBulb = new THREE.SphereGeometry(0.0245, 20, 16);
  carinaBulb.scale(1.26, 0.94, 0.92);
  carinaBulb.translate(0, 0.256, 0.011);
  airwayGeos.push(carinaBulb);

  // 4. 18 Crisp Hyaline Cartilage C-Rings along anterior/lateral trachea
  for (let i = 0; i < 18; i++) {
    const t = (i + 0.55) / 18.6;
    const pt = tracheaCurve.getPointAt(t);
    const cRing = new THREE.TorusGeometry(
      0.0235,
      0.0041,
      10,
      24,
      Math.PI * 1.58
    );
    cRing.rotateX(Math.PI / 2);
    cRing.rotateY(Math.PI * 0.71);
    cRing.translate(pt.x, pt.y, pt.z);
    ringGeos.push(cRing);
  }

  const mergedAirway = attachTreeDepthAttribute(
    mergeGeometries(airwayGeos, false)!,
    (y) => THREE.MathUtils.clamp((0.67 - y) / 0.44, 0, 0.40)
  );
  const mergedRings = attachTreeDepthAttribute(
    mergeGeometries(ringGeos, false)!,
    (y) => THREE.MathUtils.clamp((0.67 - y) / 0.44, 0, 0.40)
  );

  return {
    larynxTracheaGeometry: mergedAirway,
    cartilageRingsGeometry: mergedRings,
    tracheaCurve,
  };
}

function buildTaperedBranchGeometry(
  pts: THREE.Vector3[],
  rStart: number,
  rEnd: number,
  depthStart: number,
  depthEnd: number,
  segs = 10,
  radialSegs = 9
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(pts);
  const rAvg = (rStart + rEnd) * 0.5;
  const geo = new THREE.TubeGeometry(curve, segs, rAvg, radialSegs, false);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const depths = new Float32Array(pos.count);

  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const center = curve.getPointAt(t);
    const targetR = THREE.MathUtils.lerp(rStart, rEnd, t);
    const scale = targetR / Math.max(0.0004, rAvg);
    const depthVal = THREE.MathUtils.lerp(depthStart, depthEnd, t);

    for (let j = 0; j <= radialSegs; j++) {
      const idx = i * (radialSegs + 1) + j;
      if (idx < pos.count) {
        pos.setXYZ(
          idx,
          center.x + (pos.getX(idx) - center.x) * scale,
          center.y + (pos.getY(idx) - center.y) * scale,
          center.z + (pos.getZ(idx) - center.z) * scale
        );
        depths[idx] = depthVal;
      }
    }
  }

  geo.setAttribute('aTreeDepth', new THREE.BufferAttribute(depths, 1));
  geo.computeVertexNormals();
  return geo;
}

/**
 * Anatomically Asymmetric 4-Generation Bronchial Tree + 6 Airflow Pathways:
 *  - Right Mainstem Bronchus (side = -1): shorter, wider, steeper (~25°) ->
 *    Superior (eparterial), Middle, and Inferior lobar & segmental branches.
 *  - Left Mainstem Bronchus (side = +1): longer, slightly narrower, more horizontal
 *    (~45°) clearing the cardiac notch -> Superior (+ lingular) & Inferior branches.
 */
export function buildAnatomicalBronchialTreeParts(): {
  mainBronchiGeometry: THREE.BufferGeometry;
  distalBronchiolesGeometry: THREE.BufferGeometry;
  airflowPaths: THREE.CatmullRomCurve3[];
} {
  const mainGeos: THREE.BufferGeometry[] = [];
  const distalGeos: THREE.BufferGeometry[] = [];
  const carina = new THREE.Vector3(0, 0.256, 0.011);

  const clampInsideLung = (pt: THREE.Vector3, side: -1 | 1): THREE.Vector3 => {
    const isLeft = side === 1;
    pt.y = THREE.MathUtils.clamp(pt.y, -0.095, 0.360);
    const h = THREE.MathUtils.clamp((pt.y + 0.14) / 0.56, 0, 1);
    const domeSpan = Math.sin(Math.pow(h, 0.65) * Math.PI);
    const maxLat =
      (isLeft ? 0.248 : 0.264) *
      (0.56 + 0.44 * domeSpan) *
      (1 - 0.16 * Math.pow(h, 2.2));
    const minMed = isLeft && pt.y < 0.13 ? 0.110 : 0.072;
    const absX = THREE.MathUtils.clamp(
      Math.abs(pt.x),
      minMed,
      Math.max(minMed + 0.022, maxLat)
    );
    pt.x = side * absX;
    const maxZ = 0.072 * (0.56 + 0.44 * domeSpan);
    pt.z = THREE.MathUtils.clamp(pt.z, -maxZ - 0.012, maxZ - 0.008);
    return pt;
  };

  const spawnSubBranches = (
    origin: THREE.Vector3,
    dir: THREE.Vector3,
    length: number,
    radius: number,
    depthRemaining: number,
    treeDepthStart: number,
    side: -1 | 1,
    seed: number
  ) => {
    if (depthRemaining <= 0) return;
    const tip = clampInsideLung(
      origin.clone().addScaledVector(dir, length),
      side
    );
    if (tip.distanceTo(origin) < 0.011) return;

    const mid = clampInsideLung(
      origin
        .clone()
        .lerp(tip, 0.5)
        .add(
          new THREE.Vector3(
            side * 0.004,
            Math.sin(seed * 1.4) * 0.005,
            Math.cos(seed * 1.2) * 0.005
          )
        ),
      side
    );

    const treeDepthEnd = Math.min(1.0, treeDepthStart + 0.16);
    const geo = buildTaperedBranchGeometry(
      [origin, mid, tip],
      radius,
      radius * 0.66,
      treeDepthStart,
      treeDepthEnd,
      depthRemaining >= 3 ? 8 : 6,
      depthRemaining >= 3 ? 8 : 6
    );
    if (depthRemaining >= 3) {
      mainGeos.push(geo);
    } else {
      distalGeos.push(geo);
    }

    if (depthRemaining > 1) {
      const forks = [
        { dy: 0.35, dz: 0.25, dx: 0.27 },
        { dy: -0.33, dz: -0.23, dx: 0.29 },
      ];
      forks.forEach((f, idx) => {
        const nextDir = dir
          .clone()
          .add(
            new THREE.Vector3(
              side * (f.dx + ((seed + idx) % 3) * 0.036),
              f.dy + Math.sin(seed * 2.1 + idx) * 0.11,
              f.dz * (idx === 0 ? 1 : -1)
            )
          )
          .normalize();
        spawnSubBranches(
          tip,
          nextDir,
          length * 0.74,
          radius * 0.65,
          depthRemaining - 1,
          treeDepthEnd,
          side,
          seed * 1.65 + idx + 1
        );
      });
    }
  };

  // --- RIGHT MAINSTEM BRONCHUS (side = -1: shorter, wider, steeper) ---
  const rightMid = new THREE.Vector3(-0.045, 0.226, 0.008);
  const rightHilum = new THREE.Vector3(-0.084, 0.194, 0.004);
  mainGeos.push(
    buildTaperedBranchGeometry(
      [carina, rightMid, rightHilum],
      0.0182,
      0.0144,
      0.35,
      0.52,
      14,
      12
    )
  );
  [0.32, 0.65].forEach((t) => {
    const c = new THREE.CatmullRomCurve3([carina, rightMid, rightHilum]);
    const p = c.getPointAt(t);
    const tang = c.getTangentAt(t);
    const ring = new THREE.TorusGeometry(0.0168, 0.0026, 8, 18);
    ring.applyQuaternion(
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), tang)
    );
    ring.translate(p.x, p.y, p.z);
    mainGeos.push(attachTreeDepthAttribute(ring, () => 0.38 + t * 0.12));
  });

  // Right Lobar Bronchi: Superior, Middle, Inferior
  spawnSubBranches(
    rightHilum,
    new THREE.Vector3(-0.44, 0.85, 0.05).normalize(),
    0.075,
    0.0108,
    3,
    0.52,
    -1,
    1.2
  );
  spawnSubBranches(
    rightHilum,
    new THREE.Vector3(-0.84, 0.24, 0.25).normalize(),
    0.076,
    0.0098,
    3,
    0.52,
    -1,
    2.4
  );
  spawnSubBranches(
    rightHilum,
    new THREE.Vector3(-0.86, -0.18, 0.24).normalize(),
    0.080,
    0.0100,
    3,
    0.52,
    -1,
    3.6
  );
  spawnSubBranches(
    rightHilum,
    new THREE.Vector3(-0.54, -0.80, -0.10).normalize(),
    0.098,
    0.0110,
    3,
    0.52,
    -1,
    4.7
  );
  spawnSubBranches(
    rightHilum,
    new THREE.Vector3(-0.68, -0.50, 0.25).normalize(),
    0.078,
    0.0090,
    3,
    0.54,
    -1,
    5.8
  );

  // --- LEFT MAINSTEM BRONCHUS (side = +1: longer, slightly narrower, more horizontal) ---
  const leftMid = new THREE.Vector3(0.054, 0.232, 0.008);
  const leftHilum = new THREE.Vector3(0.106, 0.202, 0.003);
  mainGeos.push(
    buildTaperedBranchGeometry(
      [carina, leftMid, leftHilum],
      0.0166,
      0.0132,
      0.35,
      0.52,
      14,
      12
    )
  );
  [0.28, 0.58, 0.85].forEach((t) => {
    const c = new THREE.CatmullRomCurve3([carina, leftMid, leftHilum]);
    const p = c.getPointAt(t);
    const tang = c.getTangentAt(t);
    const ring = new THREE.TorusGeometry(0.0154, 0.0024, 8, 18);
    ring.applyQuaternion(
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), tang)
    );
    ring.translate(p.x, p.y, p.z);
    mainGeos.push(attachTreeDepthAttribute(ring, () => 0.38 + t * 0.12));
  });

  // Left Lobar Bronchi: Superior + Lingular + Inferior
  spawnSubBranches(
    leftHilum,
    new THREE.Vector3(0.45, 0.85, 0.04).normalize(),
    0.072,
    0.0102,
    3,
    0.52,
    1,
    6.3
  );
  spawnSubBranches(
    leftHilum,
    new THREE.Vector3(0.84, 0.22, 0.22).normalize(),
    0.074,
    0.0094,
    3,
    0.52,
    1,
    7.5
  );
  spawnSubBranches(
    leftHilum,
    new THREE.Vector3(0.86, -0.15, 0.24).normalize(),
    0.074,
    0.0094,
    3,
    0.52,
    1,
    8.6
  );
  spawnSubBranches(
    leftHilum,
    new THREE.Vector3(0.56, -0.78, -0.12).normalize(),
    0.094,
    0.0104,
    3,
    0.52,
    1,
    9.4
  );
  spawnSubBranches(
    leftHilum,
    new THREE.Vector3(0.70, -0.44, 0.20).normalize(),
    0.074,
    0.0086,
    3,
    0.54,
    1,
    10.7
  );

  // 6 Physiological laminar airflow pathways: Larynx -> Trachea -> Carina -> Lobar Bronchi
  const airflowPaths = [
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.65, 0.022),
      new THREE.Vector3(0, 0.45, 0.017),
      carina,
      rightMid,
      rightHilum,
      new THREE.Vector3(-0.140, 0.29, 0.008),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.65, 0.022),
      new THREE.Vector3(0, 0.45, 0.017),
      carina,
      rightMid,
      rightHilum,
      new THREE.Vector3(-0.195, 0.14, 0.016),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.64, 0.021),
      new THREE.Vector3(0, 0.44, 0.016),
      carina,
      rightMid,
      rightHilum,
      new THREE.Vector3(-0.160, 0.02, -0.006),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.65, 0.022),
      new THREE.Vector3(0, 0.45, 0.017),
      carina,
      leftMid,
      leftHilum,
      new THREE.Vector3(0.154, 0.29, 0.008),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.65, 0.022),
      new THREE.Vector3(0, 0.45, 0.017),
      carina,
      leftMid,
      leftHilum,
      new THREE.Vector3(0.205, 0.14, 0.015),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.64, 0.021),
      new THREE.Vector3(0, 0.44, 0.016),
      carina,
      leftMid,
      leftHilum,
      new THREE.Vector3(0.172, 0.02, -0.008),
    ]),
  ];

  return {
    mainBronchiGeometry: mergeGeometries(mainGeos, false)!,
    distalBronchiolesGeometry: mergeGeometries(distalGeos, false)!,
    airflowPaths,
  };
}

/**
 * Sculpted Asymmetric Double-Domed Thoracic Diaphragm:
 *  - Right hemidiaphragm slightly higher (over liver), left dome slightly lower
 *  - Distinct central tendon saddle supporting the heart/mediastinum
 *  - Smooth costophrenic peripheral arch tucked directly underneath both lung bases
 *  - Encodes `aTendon` [0..1] for anatomical central-tendon vs muscular-fascicle shading
 */
export function buildDiaphragmGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(
    0.305,
    48,
    26,
    0,
    Math.PI * 2,
    0,
    Math.PI * 0.54
  );
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const tendonAttr = new Float32Array(pos.count);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    let y = pos.getY(i);
    const z = pos.getZ(i);

    const radial = Math.min(1, Math.hypot(x / 0.305, z / 0.305));
    // Asymmetric domes: right hemidiaphragm (x < 0) higher over liver, left slightly lower
    const rightDome = Math.exp(-Math.pow((x + 0.145) / 0.135, 2)) * 0.036;
    const leftDome = Math.exp(-Math.pow((x - 0.145) / 0.135, 2)) * 0.020;
    const centralSaddle = -Math.exp(-Math.pow(x / 0.068, 2)) * 0.024;
    // Slight posterior descent (posterior costodiaphragmatic recess sits deeper than anterior)
    const posteriorSlope = z < 0 ? z * 0.085 : 0;

    y = y * 0.42 + rightDome + leftDome + centralSaddle + posteriorSlope;
    pos.setXYZ(i, x * 1.07, y, z * 0.62);

    // Central trefoil tendon strongest near superior center
    tendonAttr[i] = Math.exp(-Math.pow(radial / 0.56, 2));
  }

  geo.setAttribute('aTendon', new THREE.BufferAttribute(tendonAttr, 1));
  geo.computeVertexNormals();
  return geo;
}
