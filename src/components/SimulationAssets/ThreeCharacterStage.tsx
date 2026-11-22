import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Language,
  ObstructionObjectType,
  RescuerCharacterId,
  RigPoseId,
  SceneLocationId,
  VictimCharacterId,
} from '../../types/nafas';

export interface ThreeCharacterStageProps {
  location: SceneLocationId;
  victim: VictimCharacterId;
  rescuer: RescuerCharacterId;
  obstruction: ObstructionObjectType;
  pose: RigPoseId;
  spo2: number;
  heartRate: number;
  language: Language;
  showAnatomyXray: boolean;
  cameraPreset: 'front' | 'side' | 'closeup';
  thrustProgress: number;
  reactionImpulse: number;
  onCanvasCharacterClick?: () => void;
}

// Detect software WebGL once per session per threejs skill directive
const isSoftwareGl = (() => {
  if (typeof document === 'undefined') return false;
  const gl = document.createElement('canvas').getContext('webgl2');
  if (!gl) return true;
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
  const gpu = String(gl.getParameter(param));
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
})();

// Pre-allocated scratch math objects outside the render loop (Zero GC)
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 1.05, 0);
const _skinWarmColor = new THREE.Color(0xf2be98);
const _skinCyanoticColor = new THREE.Color(0xb2bfd6);
const _lipWarmColor = new THREE.Color(0xc86464);
const _lipCyanoticColor = new THREE.Color(0x4b6b9e);

interface CharacterRigRefs {
  root: THREE.Group;
  victimGroup: THREE.Group;
  torsoGroup: THREE.Group;
  headGroup: THREE.Group;
  leftArmGroup: THREE.Group;
  rightArmGroup: THREE.Group;
  leftLegGroup: THREE.Group;
  rightLegGroup: THREE.Group;
  leftEye: THREE.Mesh;
  rightEye: THREE.Mesh;
  leftBrow: THREE.Mesh;
  rightBrow: THREE.Mesh;
  mouthMesh: THREE.Mesh;
  sweatGroup: THREE.Group;
  anatomyGroup: THREE.Group;
  leftLung: THREE.Mesh;
  rightLung: THREE.Mesh;
  diaphragmMesh: THREE.Mesh;
  bolusMesh: THREE.Mesh;
  rescuerGroup: THREE.Group;
  rescuerArmsGroup: THREE.Group;
  forceArrowGroup: THREE.Group;
  highChairGroup: THREE.Group;
  skinMat: THREE.MeshStandardMaterial;
  lipMat: THREE.MeshStandardMaterial;
  torsoMat: THREE.MeshStandardMaterial;
  lungMat: THREE.MeshStandardMaterial;
}

/**
 * Builds an age-authentic, multi-part 3D human character rig with distinct proportions:
 * - Adult Male (Youssef, 34y): 1.75m scale, 1:7.5 head-to-body ratio, broad shoulders, facial stubble
 * - Pregnant Adult Female (Salma, 31y): 1.65m scale, modest headscarf, 3rd-trimester gravid abdomen
 * - Schoolchild (Youssef, 6y): 1.18m scale, 1:5.5 head-to-body ratio, rounder child face, school uniform polo
 * - Infant (Layan, 8m): 0.68m scale, 1:4 head-to-body ratio, chubby cheeks, baby curl, footed onesie + high-chair
 */
function buildAgeAuthenticCharacterRig(
  victim: VictimCharacterId,
  obstruction: ObstructionObjectType
): CharacterRigRefs {
  const root = new THREE.Group();
  const victimGroup = new THREE.Group();
  root.add(victimGroup);

  const isInfant = victim === 'nelly_infant';
  const isChild = victim === 'mostafa_child';
  const isPregnant = victim === 'salma_pregnant';

  // PBR Materials with varied roughness/metalness per threejs skill
  const skinMat = new THREE.MeshStandardMaterial({
    color: isInfant ? 0xffdcc0 : isChild ? 0xf7c9a3 : 0xecb790,
    roughness: 0.58,
    metalness: 0.04,
  });

  const lipMat = new THREE.MeshStandardMaterial({
    color: 0xc86464,
    roughness: 0.42,
    metalness: 0.05,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: isPregnant ? 0x1e293b : 0x141c2b,
    roughness: 0.78,
    metalness: 0.08,
  });

  const shirtColor = isInfant
    ? 0x6ee7b7 // Mint baby onesie
    : isChild
    ? 0x2563eb // Royal blue school polo
    : isPregnant
    ? 0x0f766e // Teal maternity tunic
    : 0x145074; // Deep navy adult button-down

  const torsoMat = new THREE.MeshStandardMaterial({
    color: shirtColor,
    roughness: 0.65,
    metalness: 0.05,
    transparent: true,
    opacity: 1.0,
  });

  const pantsMat = new THREE.MeshStandardMaterial({
    color: isInfant ? 0x6ee7b7 : 0x1e293b,
    roughness: 0.75,
    metalness: 0.05,
  });

  const rescuerSkinMat = new THREE.MeshStandardMaterial({
    color: 0xe5b28a,
    roughness: 0.55,
    metalness: 0.05,
  });

  const rescuerScrubsMat = new THREE.MeshStandardMaterial({
    color: 0x0a7c73,
    roughness: 0.52,
    metalness: 0.08,
  });

  // Age-specific dimensional parameters (True anatomical ratios!)
  const dims = isInfant
    ? {
        legH: 0.22,
        legR: 0.058,
        hipWidth: 0.085,
        torsoH: 0.32,
        torsoTopR: 0.125,
        torsoBotR: 0.135,
        neckH: 0.04,
        neckR: 0.05,
        headR: 0.155, // Large 1:4 baby cranium!
        headScaleY: 0.96,
        armLen: 0.21,
        armR: 0.046,
        shoulderX: 0.155,
      }
    : isChild
    ? {
        legH: 0.52,
        legR: 0.064,
        hipWidth: 0.11,
        torsoH: 0.46,
        torsoTopR: 0.155,
        torsoBotR: 0.14,
        neckH: 0.065,
        neckR: 0.052,
        headR: 0.165, // 1:5.5 child head-to-body ratio
        headScaleY: 1.02,
        armLen: 0.36,
        armR: 0.048,
        shoulderX: 0.195,
      }
    : isPregnant
    ? {
        legH: 0.76,
        legR: 0.082,
        hipWidth: 0.145,
        torsoH: 0.62,
        torsoTopR: 0.195,
        torsoBotR: 0.21,
        neckH: 0.085,
        neckR: 0.058,
        headR: 0.158, // 1:7.2 adult female proportion
        headScaleY: 1.12,
        armLen: 0.52,
        armR: 0.056,
        shoulderX: 0.24,
      }
    : {
        legH: 0.82,
        legR: 0.09,
        hipWidth: 0.155,
        torsoH: 0.68,
        torsoTopR: 0.24, // Broad adult male shoulders
        torsoBotR: 0.195,
        neckH: 0.095,
        neckR: 0.068,
        headR: 0.165, // 1:7.5 adult male proportion
        headScaleY: 1.15,
        armLen: 0.56,
        armR: 0.064,
        shoulderX: 0.285,
      };

  // 1. NURSERY HIGH-CHAIR FOR INFANT NELLY (So infant NEVER stands upright like an adult!)
  const highChairGroup = new THREE.Group();
  if (isInfant) {
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.3,
      metalness: 0.6,
    });
    const cushionMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      roughness: 0.7,
      metalness: 0.05,
    });
    const trayMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.1,
    });

    // 4 Angled High-Chair Legs
    const legGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.78, 12);
    [
      [-0.24, 0.38, -0.22, 0.12, 0.1],
      [0.24, 0.38, -0.22, -0.12, 0.1],
      [-0.24, 0.38, 0.22, 0.12, -0.1],
      [0.24, 0.38, 0.22, -0.12, -0.1],
    ].forEach(([x, y, z, rz, rx]) => {
      const l = new THREE.Mesh(legGeo, frameMat);
      l.position.set(x, y, z);
      l.rotation.z = rz;
      l.rotation.x = rx;
      highChairGroup.add(l);
    });

    // Seat Base & High Padded Backrest
    const seatBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.06, 0.42),
      cushionMat
    );
    seatBase.position.set(0, 0.74, 0);
    highChairGroup.add(seatBase);

    const backrest = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.52, 0.07),
      cushionMat
    );
    backrest.position.set(0, 1.0, -0.18);
    highChairGroup.add(backrest);

    // Removable Feeding Tray in front
    const tray = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.035, 0.22),
      trayMat
    );
    tray.position.set(0, 0.92, 0.24);
    highChairGroup.add(tray);
  }
  root.add(highChairGroup);

  // 2. LEGS GROUP
  const leftLegGroup = new THREE.Group();
  const rightLegGroup = new THREE.Group();
  const legGeo = new THREE.CapsuleGeometry(
    dims.legR,
    Math.max(0.08, dims.legH - dims.legR * 2),
    8,
    16
  );
  const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
  const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
  leftLegMesh.castShadow = !isSoftwareGl;
  rightLegMesh.castShadow = !isSoftwareGl;
  leftLegGroup.add(leftLegMesh);
  rightLegGroup.add(rightLegMesh);

  if (isInfant) {
    // Seated chubby baby legs extending forward on high chair seat
    leftLegGroup.position.set(-dims.hipWidth, 0.81, 0.12);
    leftLegGroup.rotation.x = Math.PI / 2.2;
    rightLegGroup.position.set(dims.hipWidth, 0.81, 0.12);
    rightLegGroup.rotation.x = Math.PI / 2.2;
  } else {
    leftLegGroup.position.set(-dims.hipWidth, dims.legH * 0.5, 0);
    rightLegGroup.position.set(dims.hipWidth, dims.legH * 0.5, 0);
  }
  victimGroup.add(leftLegGroup, rightLegGroup);

  // 3. TORSO GROUP (Pivoted at waist/hips so forward lean & back-blow bends work naturally!)
  const torsoGroup = new THREE.Group();
  const waistY = isInfant ? 0.78 : dims.legH;
  torsoGroup.position.set(0, waistY, 0);
  victimGroup.add(torsoGroup);

  const torsoGeo = new THREE.CylinderGeometry(
    dims.torsoTopR,
    dims.torsoBotR,
    dims.torsoH,
    24
  );
  const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
  torsoMesh.position.set(0, dims.torsoH * 0.5, 0);
  torsoMesh.scale.set(1.15, 1, 0.78);
  torsoMesh.castShadow = !isSoftwareGl;
  torsoGroup.add(torsoMesh);

  // Age-specific clothing accents (Bib for Infant, School Collar/Stripe for Child, Gravid Belly for Salma, Shirt Collar for Youssef)
  if (isInfant) {
    const bibGeo = new THREE.CylinderGeometry(0.11, 0.12, 0.02, 16);
    const bibMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
    });
    const bib = new THREE.Mesh(bibGeo, bibMat);
    bib.position.set(0, dims.torsoH * 0.78, 0.085);
    bib.rotation.x = Math.PI / 2.5;
    torsoGroup.add(bib);
  } else if (isChild) {
    // Gold school polo stripe & white collar
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0xffc83d,
      roughness: 0.4,
    });
    const stripe = new THREE.Mesh(
      new THREE.CylinderGeometry(
        dims.torsoTopR * 0.99,
        dims.torsoTopR * 0.97,
        0.045,
        24
      ),
      stripeMat
    );
    stripe.position.set(0, dims.torsoH * 0.65, 0);
    stripe.scale.set(1.16, 1, 0.79);
    torsoGroup.add(stripe);
  } else if (isPregnant) {
    // Prominent 3rd-Trimester Gravid Abdomen Sphere + Protective Teal Rim
    const bellyGeo = new THREE.SphereGeometry(0.185, 24, 24);
    const bellyMesh = new THREE.Mesh(bellyGeo, torsoMat);
    bellyMesh.position.set(0, dims.torsoH * 0.36, 0.095);
    bellyMesh.scale.set(1.05, 1.12, 1.05);
    torsoGroup.add(bellyMesh);
  } else {
    // Adult Male Shirt Collar
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.5,
    });
    const collar = new THREE.Mesh(
      new THREE.TorusGeometry(0.082, 0.018, 10, 20),
      collarMat
    );
    collar.position.set(0, dims.torsoH * 0.98, 0.02);
    collar.rotation.x = Math.PI / 2;
    torsoGroup.add(collar);
  }

  // 4. INTERNAL 3D TRANSLUCENT ANATOMY (Trachea, Lungs, Diaphragm, Moving Foreign Body Bolus)
  const anatomyGroup = new THREE.Group();
  anatomyGroup.position.set(0, 0, 0.03);
  torsoGroup.add(anatomyGroup);

  const lungMat = new THREE.MeshStandardMaterial({
    color: 0x2dd4c6,
    emissive: 0x0a7c73,
    emissiveIntensity: 0.35,
    roughness: 0.3,
    transparent: true,
    opacity: 0.85,
  });

  const lungR = isInfant ? 0.048 : isChild ? 0.062 : 0.082;
  const lungGeo = new THREE.SphereGeometry(lungR, 16, 16);
  const leftLung = new THREE.Mesh(lungGeo, lungMat);
  const rightLung = new THREE.Mesh(lungGeo, lungMat);
  leftLung.scale.set(0.85, 1.45, 0.7);
  rightLung.scale.set(0.85, 1.45, 0.7);
  leftLung.position.set(-lungR * 1.15, dims.torsoH * 0.66, 0.05);
  rightLung.position.set(lungR * 1.15, dims.torsoH * 0.66, 0.05);
  anatomyGroup.add(leftLung, rightLung);

  // Diaphragm Dome below lungs
  const diaphragmMat = new THREE.MeshStandardMaterial({
    color: 0xffc83d,
    emissive: 0xd97706,
    emissiveIntensity: 0.3,
    roughness: 0.4,
    side: THREE.DoubleSide,
  });
  const diaphragmGeo = new THREE.SphereGeometry(
    lungR * 2.1,
    20,
    12,
    0,
    Math.PI * 2,
    0,
    Math.PI * 0.45
  );
  const diaphragmMesh = new THREE.Mesh(diaphragmGeo, diaphragmMat);
  diaphragmMesh.position.set(0, dims.torsoH * 0.42, 0.05);
  anatomyGroup.add(diaphragmMesh);

  // Trachea Windpipe Tube
  const tracheaMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.3,
    transparent: true,
    opacity: 0.7,
  });
  const tracheaGeo = new THREE.CylinderGeometry(
    isInfant ? 0.018 : 0.024,
    isInfant ? 0.018 : 0.024,
    dims.torsoH * 0.36 + dims.neckH,
    16
  );
  const tracheaMesh = new THREE.Mesh(tracheaGeo, tracheaMat);
  tracheaMesh.position.set(0, dims.torsoH * 0.88, 0.05);
  anatomyGroup.add(tracheaMesh);

  // Foreign Body Bolus (Meat / Whole Purple Grape / Soft Fruit)
  const bolusColorHex =
    obstruction === 'grape'
      ? 0x7c3aed
      : obstruction === 'soft_food'
      ? 0xf59e0b
      : 0xb45309;
  const bolusMat = new THREE.MeshStandardMaterial({
    color: bolusColorHex,
    emissive: bolusColorHex,
    emissiveIntensity: 0.45,
    roughness: 0.25,
  });
  const bolusMesh = new THREE.Mesh(
    new THREE.SphereGeometry(isInfant ? 0.024 : 0.032, 16, 16),
    bolusMat
  );
  bolusMesh.position.set(0, dims.torsoH * 0.92, 0.06);
  anatomyGroup.add(bolusMesh);

  // 5. NECK & HEAD GROUP (With Age-Specific Cranium, Hair, Eyes, Brows, Mouth, Sweat/Tears)
  const neckMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(dims.neckR, dims.neckR * 1.05, dims.neckH, 16),
    skinMat
  );
  neckMesh.position.set(0, dims.torsoH + dims.neckH * 0.45, 0);
  torsoGroup.add(neckMesh);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, dims.torsoH + dims.neckH + dims.headR * 0.85, 0);
  torsoGroup.add(headGroup);

  const headMesh = new THREE.Mesh(
    new THREE.SphereGeometry(dims.headR, 28, 28),
    skinMat
  );
  headMesh.scale.set(1, dims.headScaleY, 0.96);
  headMesh.castShadow = !isSoftwareGl;
  headGroup.add(headMesh);

  // Chubby lower cheeks for Infant & Child
  if (isInfant || isChild) {
    const cheekR = isInfant ? 0.068 : 0.056;
    const cheekGeo = new THREE.SphereGeometry(cheekR, 16, 16);
    const leftCheek = new THREE.Mesh(cheekGeo, skinMat);
    const rightCheek = new THREE.Mesh(cheekGeo, skinMat);
    leftCheek.position.set(-dims.headR * 0.56, -dims.headR * 0.22, dims.headR * 0.55);
    rightCheek.position.set(dims.headR * 0.56, -dims.headR * 0.22, dims.headR * 0.55);
    headGroup.add(leftCheek, rightCheek);
  }

  // Distinct Hair / Headscarf / Baby Curl per Character
  if (isInfant) {
    // Wispy Baby Curl + Cute Pink Bow on Layan's Head
    const curl = new THREE.Mesh(
      new THREE.TorusGeometry(0.032, 0.012, 8, 16, Math.PI * 1.3),
      hairMat
    );
    curl.position.set(0, dims.headR * 0.94, 0.02);
    headGroup.add(curl);

    const bowMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.4,
    });
    const bow = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 12), bowMat);
    bow.scale.set(1.6, 0.9, 0.8);
    bow.position.set(0.065, dims.headR * 0.88, 0.04);
    headGroup.add(bow);
  } else if (isChild) {
    // Schoolboy Tousled Hair Cap + Playful Front Spikes
    const hairCap = new THREE.Mesh(
      new THREE.SphereGeometry(
        dims.headR * 1.04,
        24,
        16,
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.52
      ),
      hairMat
    );
    hairCap.rotation.x = -0.18;
    headGroup.add(hairCap);

    const tuft = new THREE.Mesh(
      new THREE.ConeGeometry(0.035, 0.08, 8),
      hairMat
    );
    tuft.position.set(0.02, dims.headR * 1.05, 0.08);
    tuft.rotation.x = 0.4;
    headGroup.add(tuft);
  } else if (isPregnant) {
    // Modest Draped Headscarf / Hijab Silhouette for Salma
    const scarfCap = new THREE.Mesh(
      new THREE.SphereGeometry(
        dims.headR * 1.09,
        24,
        20,
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.72
      ),
      hairMat
    );
    scarfCap.scale.set(1.02, dims.headScaleY, 1.04);
    scarfCap.rotation.x = -0.35;
    headGroup.add(scarfCap);

    const scarfDrape = new THREE.Mesh(
      new THREE.CylinderGeometry(
        dims.headR * 0.92,
        dims.headR * 1.15,
        0.22,
        20
      ),
      hairMat
    );
    scarfDrape.position.set(0, -dims.headR * 0.85, -0.02);
    headGroup.add(scarfDrape);
  } else {
    // Adult Male Tapered Hair + Subtle Beard Jawline for Youssef
    const hairCap = new THREE.Mesh(
      new THREE.SphereGeometry(
        dims.headR * 1.04,
        24,
        16,
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.48
      ),
      hairMat
    );
    hairCap.scale.set(1, dims.headScaleY, 0.98);
    hairCap.rotation.x = -0.22;
    headGroup.add(hairCap);

    const beardMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.9,
      transparent: true,
      opacity: 0.42,
    });
    const beard = new THREE.Mesh(
      new THREE.SphereGeometry(
        dims.headR * 1.01,
        20,
        14,
        0,
        Math.PI * 2,
        Math.PI * 0.55,
        Math.PI * 0.38
      ),
      beardMat
    );
    beard.scale.set(0.98, dims.headScaleY, 0.98);
    headGroup.add(beard);
  }

  // Expressive Eyes (Larger for Infant/Child, Scaled for Adult)
  const eyeScale = isInfant ? 1.35 : isChild ? 1.2 : 1.0;
  const eyeWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
  });
  const pupilMat = new THREE.MeshStandardMaterial({
    color: 0x1a120b,
    roughness: 0.15,
  });

  const makeEye = (side: -1 | 1) => {
    const eyeBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.026 * eyeScale, 14, 14),
      eyeWhiteMat
    );
    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.015 * eyeScale, 12, 12),
      pupilMat
    );
    pupil.position.set(0, 0, 0.016 * eyeScale);
    eyeBall.add(pupil);
    eyeBall.position.set(
      side * dims.headR * 0.36,
      isInfant ? -0.01 : 0.02,
      dims.headR * 0.86
    );
    return eyeBall;
  };

  const leftEye = makeEye(-1);
  const rightEye = makeEye(1);
  headGroup.add(leftEye, rightEye);

  // Expressive Eyebrows
  const browGeo = new THREE.CapsuleGeometry(0.008, 0.036, 4, 8);
  const leftBrow = new THREE.Mesh(browGeo, hairMat);
  const rightBrow = new THREE.Mesh(browGeo, hairMat);
  leftBrow.rotation.z = Math.PI / 2;
  rightBrow.rotation.z = Math.PI / 2;
  leftBrow.position.set(-dims.headR * 0.36, 0.065, dims.headR * 0.88);
  rightBrow.position.set(dims.headR * 0.36, 0.065, dims.headR * 0.88);
  headGroup.add(leftBrow, rightBrow);

  // Mouth & Lips Mesh
  const mouthMesh = new THREE.Mesh(
    new THREE.TorusGeometry(0.032, 0.011, 10, 20),
    lipMat
  );
  mouthMesh.position.set(0, -dims.headR * 0.38, dims.headR * 0.88);
  headGroup.add(mouthMesh);

  // Sweat & Tears Particles Group (Visible during Choking Crisis)
  const sweatGroup = new THREE.Group();
  const sweatMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.4,
    roughness: 0.1,
  });
  [-1, 1].forEach((side) => {
    const drop = new THREE.Mesh(
      new THREE.SphereGeometry(0.014, 10, 10),
      sweatMat
    );
    drop.scale.set(0.8, 1.4, 0.8);
    drop.position.set(side * dims.headR * 0.72, 0.05, dims.headR * 0.65);
    sweatGroup.add(drop);
  });
  headGroup.add(sweatGroup);

  // 6. ARTICULATED ARMS (Shoulder Pivot -> Upper Arm + Forearm + Hand)
  const makeArm = (side: -1 | 1) => {
    const armPivot = new THREE.Group();
    armPivot.position.set(side * dims.shoulderX, dims.torsoH * 0.88, 0);

    const limbMesh = new THREE.Mesh(
      new THREE.CapsuleGeometry(dims.armR, dims.armLen, 8, 14),
      skinMat
    );
    limbMesh.position.set(0, -dims.armLen * 0.5, 0);
    limbMesh.castShadow = !isSoftwareGl;
    armPivot.add(limbMesh);

    const handMesh = new THREE.Mesh(
      new THREE.SphereGeometry(dims.armR * 1.18, 12, 12),
      skinMat
    );
    handMesh.position.set(0, -dims.armLen, 0);
    armPivot.add(handMesh);

    return armPivot;
  };

  const leftArmGroup = makeArm(-1);
  const rightArmGroup = makeArm(1);
  torsoGroup.add(leftArmGroup, rightArmGroup);

  // 7. ADULT RESCUER RIG BEHIND PATIENT (Kneeling for Child, Seated for Infant, Standing for Adult!)
  const rescuerGroup = new THREE.Group();
  rescuerGroup.position.set(0, 0, -0.42);
  root.add(rescuerGroup);

  const rescuerBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.23, 0.2, 0.72, 20),
    rescuerScrubsMat
  );
  rescuerBody.position.set(0, isChild ? 0.78 : 1.16, 0);
  rescuerBody.scale.set(1.15, 1, 0.75);
  rescuerGroup.add(rescuerBody);

  const rescuerHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 20, 20),
    rescuerSkinMat
  );
  rescuerHead.position.set(0, isChild ? 1.32 : 1.72, 0);
  rescuerGroup.add(rescuerHead);

  const rescuerHair = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.166,
      20,
      14,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.48
    ),
    hairMat
  );
  rescuerHair.position.copy(rescuerHead.position);
  rescuerHair.rotation.x = -0.2;
  rescuerGroup.add(rescuerHair);

  // Rescuer Reach-Around Arms & Hands
  const rescuerArmsGroup = new THREE.Group();
  rescuerGroup.add(rescuerArmsGroup);

  [-1, 1].forEach((side) => {
    const rArm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.056, 0.48, 8, 12),
      rescuerSkinMat
    );
    rArm.position.set(side * 0.22, 0, 0.24);
    rArm.rotation.x = Math.PI / 2.2;
    rArm.rotation.z = -side * 0.35;
    rescuerArmsGroup.add(rArm);
  });

  // Glowing Clinical Force Vector Ring at Target Landmark
  const forceArrowGroup = new THREE.Group();
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xffc83d,
    emissive: 0xffc83d,
    emissiveIntensity: 0.7,
    roughness: 0.2,
  });
  const targetRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.11, 0.016, 12, 24),
    ringMat
  );
  forceArrowGroup.add(targetRing);
  root.add(forceArrowGroup);

  return {
    root,
    victimGroup,
    torsoGroup,
    headGroup,
    leftArmGroup,
    rightArmGroup,
    leftLegGroup,
    rightLegGroup,
    leftEye,
    rightEye,
    leftBrow,
    rightBrow,
    mouthMesh,
    sweatGroup,
    anatomyGroup,
    leftLung,
    rightLung,
    diaphragmMesh,
    bolusMesh,
    rescuerGroup,
    rescuerArmsGroup,
    forceArrowGroup,
    highChairGroup,
    skinMat,
    lipMat,
    torsoMat,
    lungMat,
  };
}

export const ThreeCharacterStage: React.FC<ThreeCharacterStageProps> = ({
  victim,
  obstruction,
  pose,
  spo2,
  showAnatomyXray,
  cameraPreset,
  thrustProgress,
  reactionImpulse,
  onCanvasCharacterClick,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rigRef = useRef<CharacterRigRefs | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  // Store latest props in a mutable ref so the 60fps loop reads them without re-mounting WebGL
  const stateRef = useRef({
    victim,
    obstruction,
    pose,
    spo2,
    showAnatomyXray,
    cameraPreset,
    thrustProgress,
    reactionImpulse,
    dragYaw: 0,
    impulseDecay: 0,
    lastImpulseId: reactionImpulse,
  });

  useEffect(() => {
    const prevImpulse = stateRef.current.lastImpulseId;
    stateRef.current = {
      ...stateRef.current,
      victim,
      obstruction,
      pose,
      spo2,
      showAnatomyXray,
      cameraPreset,
      thrustProgress,
      reactionImpulse,
      impulseDecay:
        reactionImpulse !== prevImpulse ? 1.0 : stateRef.current.impulseDecay,
      lastImpulseId: reactionImpulse,
    };
  }, [
    victim,
    obstruction,
    pose,
    spo2,
    showAnatomyXray,
    cameraPreset,
    thrustProgress,
    reactionImpulse,
  ]);

  // Rebuild character geometry when victim or obstruction changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (rigRef.current) {
      scene.remove(rigRef.current.root);
    }
    const newRig = buildAgeAuthenticCharacterRig(victim, obstruction);
    scene.add(newRig.root);
    rigRef.current = newRig;
  }, [victim, obstruction]);

  // Initialize Three.js WebGLRenderer, RoomEnvironment, Studio Lights & Loop once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 1.25, 3.35);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Environment Map (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // 3-Point Warm/Cool Studio Clinical Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x071e30, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.85);
    keyLight.position.set(2.4, 3.6, 2.8);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 10;
      const d = 2.2;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x2dd4c6, 1.15);
    rimLight.position.set(-2.5, 2.2, -2.2);
    scene.add(rimLight);

    // Contact Shadow Grounding Disc
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x030b14,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    const shadowDisc = new THREE.Mesh(
      new THREE.CircleGeometry(0.85, 32),
      shadowMat
    );
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.set(0, 0.01, 0);
    scene.add(shadowDisc);

    // Clinical Scale Platform Ring
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x12b5a8,
      emissive: 0x0a7c73,
      emissiveIntensity: 0.3,
      roughness: 0.3,
    });
    const baseRing = new THREE.Mesh(
      new THREE.RingGeometry(0.76, 0.8, 48),
      ringMat
    );
    baseRing.rotation.x = -Math.PI / 2;
    baseRing.position.set(0, 0.015, 0);
    scene.add(baseRing);

    // Build initial character
    const initialRig = buildAgeAuthenticCharacterRig(
      stateRef.current.victim,
      stateRef.current.obstruction
    );
    scene.add(initialRig.root);
    rigRef.current = initialRig;

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer drag rotation + direct click trigger
    let isDragging = false;
    let startX = 0;
    let movedDist = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      startX = e.clientX;
      movedDist = 0;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      startX = e.clientX;
      movedDist += Math.abs(dx);
      stateRef.current.dragYaw = THREE.MathUtils.clamp(
        stateRef.current.dragYaw + dx * 0.008,
        -1.15,
        1.15
      );
    };
    const onPointerUp = () => {
      if (isDragging && movedDist < 6) {
        stateRef.current.impulseDecay = 1.0;
        onCanvasCharacterClick?.();
      }
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // ResizeObserver
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    ro.observe(container);

    // Software WebGL afterDraw helper per threejs skill
    let frameId = 0;
    let isUnmounted = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync?.(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (isUnmounted) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (isUnmounted) return;
      const rawDt = clock.getDelta();
      const dt = Math.min(rawDt, 0.05);
      const t = clock.getElapsedTime();

      const st = stateRef.current;
      const rig = rigRef.current;

      // Decay interactive click/thrust impulse smoothly
      st.impulseDecay = THREE.MathUtils.damp(st.impulseDecay, 0, 7, dt);

      if (rig) {
        const isInfant = st.victim === 'nelly_infant';
        const isChild = st.victim === 'mostafa_child';
        const isCyanotic =
          st.spo2 <= 86 ||
          st.pose === 'severe_silent_choking' ||
          st.pose === 'unresponsive_collapse' ||
          st.pose === 'mistake_wait_delay' ||
          st.pose === 'mistake_water_given' ||
          st.pose === 'mistake_blind_sweep';

        const isCritical =
          st.pose === 'severe_silent_choking' ||
          st.pose === 'unresponsive_collapse' ||
          st.pose === 'mistake_water_given' ||
          st.pose === 'mistake_blind_sweep' ||
          st.pose === 'mistake_shake_upside_down' ||
          st.pose === 'mistake_infant_abdomen' ||
          st.pose === 'mistake_wait_delay';

        const isRescue =
          st.pose === 'back_blows_5' ||
          st.pose === 'abdominal_thrusts_5' ||
          st.pose === 'chest_thrusts_special' ||
          st.pose === 'cpr_compressions_30_2';

        const isSupine =
          st.pose === 'unresponsive_collapse' ||
          st.pose === 'cpr_compressions_30_2';

        const isInfantForearm =
          isInfant &&
          (st.pose === 'back_blows_5' || st.pose === 'chest_thrusts_special');

        // 1. Update Skin & Lip Cyanosis Colors Smoothly
        rig.skinMat.color.lerp(
          isCyanotic ? _skinCyanoticColor : _skinWarmColor,
          0.12
        );
        rig.lipMat.color.lerp(
          isCyanotic ? _lipCyanoticColor : _lipWarmColor,
          0.15
        );

        // 2. Toggle Translucent Anatomical X-Ray Mode
        const targetTorsoOpacity = st.showAnatomyXray ? 0.34 : 1.0;
        rig.torsoMat.opacity = THREE.MathUtils.damp(
          rig.torsoMat.opacity,
          targetTorsoOpacity,
          8,
          dt
        );
        rig.anatomyGroup.visible =
          st.showAnatomyXray || isRescue || st.impulseDecay > 0.05;
        rig.lungMat.color.setHex(isCyanotic ? 0xe5484d : 0x2dd4c6);

        // 3. Apply User Drag Yaw + Interactive Squash-and-Stretch Impulse
        rig.root.rotation.y = THREE.MathUtils.damp(
          rig.root.rotation.y,
          st.dragYaw,
          10,
          dt
        );
        const impulseScale = 1 + Math.sin(st.impulseDecay * Math.PI) * 0.07;
        rig.torsoGroup.scale.set(
          impulseScale,
          1 / Math.sqrt(impulseScale),
          impulseScale
        );

        // 4. High-Chair Visibility for Infant Layan
        rig.highChairGroup.visible =
          isInfant && !isInfantForearm && !isSupine;

        // 5. Victim Root Orientation (Supine vs Infant Forearm Hold vs Upright/Seated)
        if (isSupine) {
          rig.victimGroup.rotation.x = THREE.MathUtils.damp(
            rig.victimGroup.rotation.x,
            -Math.PI / 2,
            8,
            dt
          );
          rig.victimGroup.position.set(0, 0.22, 0.25);
        } else if (isInfantForearm) {
          // Prone/Supine Head-Lower-Than-Chest Angle on Rescuer's Forearm!
          rig.victimGroup.rotation.x = THREE.MathUtils.damp(
            rig.victimGroup.rotation.x,
            0.95,
            8,
            dt
          );
          rig.victimGroup.position.set(0, 0.45, 0.12);
        } else {
          rig.victimGroup.rotation.x = THREE.MathUtils.damp(
            rig.victimGroup.rotation.x,
            0,
            8,
            dt
          );
          rig.victimGroup.position.set(0, 0, 0);
        }

        // 6. Torso Posture & Breathing / Coughing / Choking Tremor / Thrust Rhythms
        let targetTorsoLeanX = 0;
        let targetTorsoShakeZ = 0;

        if (st.pose === 'effective_cough') {
          targetTorsoLeanX = 0.28 + Math.abs(Math.sin(t * 9)) * 0.16;
        } else if (st.pose === 'back_blows_5') {
          targetTorsoLeanX = 0.36 + Math.sin(t * 7) * 0.06;
        } else if (
          st.pose === 'abdominal_thrusts_5' ||
          st.pose === 'chest_thrusts_special'
        ) {
          const thrustWave = Math.max(0, Math.sin(t * 6.5));
          targetTorsoLeanX = 0.14 - thrustWave * 0.08;
        } else if (st.pose === 'severe_silent_choking') {
          targetTorsoLeanX = 0.15;
          targetTorsoShakeZ = Math.sin(t * 26) * 0.025;
        }

        rig.torsoGroup.rotation.x = THREE.MathUtils.damp(
          rig.torsoGroup.rotation.x,
          targetTorsoLeanX,
          10,
          dt
        );
        rig.torsoGroup.rotation.z = targetTorsoShakeZ;

        // 7. Articulated Arms: Universal Choking Sign (Adults/Child) vs Flailing Baby Arms (Infant)
        if (
          st.pose === 'severe_silent_choking' ||
          st.pose === 'mistake_wait_delay'
        ) {
          if (isInfant) {
            // Infants flail their short arms outward in panic (never adult throat clutch)
            rig.leftArmGroup.rotation.z = -1.85 + Math.sin(t * 14) * 0.22;
            rig.rightArmGroup.rotation.z = 1.85 - Math.sin(t * 14) * 0.22;
            rig.leftArmGroup.rotation.x = -0.4;
            rig.rightArmGroup.rotation.x = -0.4;
          } else {
            // Universal Choking Sign: Both hands raised clutching the throat!
            rig.leftArmGroup.rotation.x = -2.25;
            rig.rightArmGroup.rotation.x = -2.25;
            rig.leftArmGroup.rotation.z = 0.58;
            rig.rightArmGroup.rotation.z = -0.58;
          }
        } else if (st.pose === 'effective_cough') {
          rig.leftArmGroup.rotation.x = -1.2;
          rig.rightArmGroup.rotation.x = -1.4;
          rig.leftArmGroup.rotation.z = 0.25;
          rig.rightArmGroup.rotation.z = -0.3;
        } else if (st.pose === 'object_expelled_recovery') {
          rig.leftArmGroup.rotation.x = -0.45;
          rig.rightArmGroup.rotation.x = -0.45;
          rig.leftArmGroup.rotation.z = -0.25;
          rig.rightArmGroup.rotation.z = 0.25;
        } else {
          rig.leftArmGroup.rotation.x = THREE.MathUtils.damp(
            rig.leftArmGroup.rotation.x,
            -0.15,
            8,
            dt
          );
          rig.rightArmGroup.rotation.x = THREE.MathUtils.damp(
            rig.rightArmGroup.rotation.x,
            -0.15,
            8,
            dt
          );
          rig.leftArmGroup.rotation.z = THREE.MathUtils.damp(
            rig.leftArmGroup.rotation.z,
            -0.12,
            8,
            dt
          );
          rig.rightArmGroup.rotation.z = THREE.MathUtils.damp(
            rig.rightArmGroup.rotation.z,
            0.12,
            8,
            dt
          );
        }

        // 8. Expressive Facial Reactions (Subtle, natural eye & brow expressions)
        const eyeOpenY = isCritical ? 1.05 : 0.92;
        rig.leftEye.scale.set(1.08, eyeOpenY, 0.55);
        rig.rightEye.scale.set(1.08, eyeOpenY, 0.55);
        rig.leftBrow.rotation.z =
          Math.PI / 2 + (isCritical ? -0.25 : 0);
        rig.rightBrow.rotation.z =
          Math.PI / 2 + (isCritical ? 0.25 : 0);

        rig.sweatGroup.visible = isCritical || st.pose === 'effective_cough';

        // Subtle mouth animation (Note: mouthMesh is rotated z = Math.PI/2, so scale.x is vertical opening)
        if (isCritical) {
          rig.mouthMesh.scale.set(1.25 + Math.sin(t * 6) * 0.1, 0.9, 0.45);
        } else if (st.pose === 'effective_cough') {
          const coughOpen = 0.95 + Math.abs(Math.sin(t * 11)) * 0.45;
          rig.mouthMesh.scale.set(coughOpen, 0.95, 0.45);
        } else {
          rig.mouthMesh.scale.set(0.75, 1.05, 0.45);
        }

        // 9. Internal Anatomy: Lungs, Diaphragm Surge & Foreign Body Bolus Displacement
        const breathCycle = isCyanotic
          ? 1 + Math.sin(t * 2) * 0.02
          : 1 + Math.sin(t * 3.2) * 0.09;
        rig.leftLung.scale.set(0.85 * breathCycle, 1.45 * breathCycle, 0.7);
        rig.rightLung.scale.set(0.85 * breathCycle, 1.45 * breathCycle, 0.7);

        const baseTopY = isInfant ? 0.31 : isChild ? 0.44 : 0.62;
        const thrustWave =
          isRescue
            ? Math.max(0, Math.sin(t * 6.5)) * 0.045
            : 0;
        const stepAdvance =
          Math.min(5, st.thrustProgress) * 0.024 + st.impulseDecay * 0.04;

        rig.diaphragmMesh.position.y =
          baseTopY * 0.65 + thrustWave * 1.4 + st.impulseDecay * 0.03;

        if (st.pose === 'object_expelled_recovery') {
          // Bolus expelled forward out of mouth in a parabolic arc!
          const arcPhase = (t * 1.4) % 1;
          rig.bolusMesh.position.set(
            0,
            baseTopY * 1.32 + Math.sin(arcPhase * Math.PI) * 0.18,
            0.14 + arcPhase * 0.45
          );
        } else if (st.pose === 'normal_chat') {
          rig.bolusMesh.visible = false;
        } else {
          rig.bolusMesh.visible = true;
          rig.bolusMesh.position.set(
            0,
            baseTopY * 1.02 + thrustWave + stepAdvance,
            0.06
          );
        }

        // 10. Rescuer Positioning & Force Ring Alignment
        const showRescuer =
          isRescue ||
          st.pose === 'object_expelled_recovery' ||
          st.pose === 'mistake_water_given' ||
          st.pose === 'mistake_blind_sweep' ||
          st.pose === 'mistake_infant_abdomen';

        rig.rescuerGroup.visible = showRescuer;
        rig.forceArrowGroup.visible = isRescue || st.impulseDecay > 0.08;

        if (showRescuer) {
          const thrustOffsetZ =
            isRescue ? Math.max(0, Math.sin(t * 6.5)) * 0.06 : 0;
          rig.rescuerGroup.position.z = -0.38 + thrustOffsetZ;

          const targetHeightY =
            st.pose === 'chest_thrusts_special'
              ? isInfant
                ? 1.05
                : 1.24
              : st.pose === 'back_blows_5'
              ? isInfant
                ? 1.08
                : isChild
                ? 0.92
                : 1.32
              : isChild
              ? 0.78
              : 1.08;

          rig.rescuerArmsGroup.position.y = targetHeightY;
          rig.forceArrowGroup.position.set(0, targetHeightY, 0.16);
          const pulseRing = 1 + Math.sin(t * 8) * 0.15;
          rig.forceArrowGroup.scale.setScalar(pulseRing);
        }
      }

      // 11. Smooth Damped Camera Presets tailored to Character Age Height
      const isInfant = st.victim === 'nelly_infant';
      const isChild = st.victim === 'mostafa_child';
      const focalY = isInfant ? 0.98 : isChild ? 0.88 : 1.18;

      if (st.cameraPreset === 'closeup') {
        _targetCamPos.set(0.15, focalY + 0.18, isInfant ? 1.55 : 1.75);
        _targetLookAt.set(0, focalY + 0.14, 0);
      } else if (st.cameraPreset === 'side') {
        _targetCamPos.set(2.15, focalY + 0.08, 1.35);
        _targetLookAt.set(0, focalY, 0);
      } else {
        _targetCamPos.set(0, focalY + 0.08, isInfant ? 2.35 : isChild ? 2.55 : 2.95);
        _targetLookAt.set(0, focalY, 0);
      }

      camera.position.lerp(_targetCamPos, 1 - Math.exp(-6 * dt));
      _currentLookAt.lerp(_targetLookAt, 1 - Math.exp(-8 * dt));
      camera.lookAt(_currentLookAt);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      isUnmounted = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      ro.disconnect();
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      title="Drag to rotate 3D character · Click character to test physical reaction"
    />
  );
};
