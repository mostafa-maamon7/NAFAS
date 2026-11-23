import * as THREE from 'three';

// ============================================================================
// STUDIO-LIT MEDICAL 3D HOLOGRAM GLSL SHADERS & PROCEDURAL TEXTURES
// Engineered for high anatomical clarity, realistic 3D glass depth, crisp
// X-ray rib-to-lung separation, frosted-pleura lungs with internal coral
// illumination, and controlled cyan-to-amber airway lighting.
// ============================================================================

/**
 * Controlled Semi-Transparent Medical Glass Upper-Torso Shader:
 *  - Recognizable human shoulders, clavicles, pectorals & waist silhouette
 *  - Exact analytical torso-arm CSG clipping (zero crossing seam lines!)
 *  - Subtle studio key/rim glass reflections & traveling cyan MRI scan highlight
 *  - Clear central thoracic window so ribs, lungs & airway stand out cleanly
 */
export function createRefinedTorsoMaterial(
  backFace = false,
  armSide: -1 | 0 | 1 = 0
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScanY: { value: 0.2 },
      uScanStrength: { value: 1.0 },
      uDeepGlass: { value: new THREE.Color(0x072b52) },
      uMidGlass: { value: new THREE.Color(0x1678c9) },
      uRimCyan: { value: new THREE.Color(0x74eeff) },
      uWarmBounce: { value: new THREE.Color(0xff7e4c) },
      uOpacityMult: { value: backFace ? 0.22 : 1.0 },
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
      uniform float uScanY;
      uniform float uScanStrength;
      uniform vec3 uDeepGlass;
      uniform vec3 uMidGlass;
      uniform vec3 uRimCyan;
      uniform vec3 uWarmBounce;
      uniform float uOpacityMult;
      uniform float uArmSide;

      varying vec3 vNormalView;
      varying vec3 vViewPos;
      varying vec3 vLocalPos;
      varying vec2 vUv;

      // Matches evaluateTorsoProfile() in anatomyGeometry.ts
      vec3 evalTorso(float y) {
        float rx = 0.35;
        float rz = 0.215;
        float zc = 0.0;
        if (y > 0.56) {
          float neckT = smoothstep(0.56, 0.72, y);
          float jawT = smoothstep(0.76, 0.88, y);
          rx = mix(0.148, 0.114, neckT) + jawT * 0.034;
          rz = mix(0.144, 0.118, neckT) + jawT * 0.042;
          zc = 0.008 + jawT * 0.030;
        } else if (y > 0.42) {
          float s = smoothstep(0.42, 0.56, y);
          rx = mix(0.462, 0.148, s);
          rz = mix(0.208, 0.144, s);
          zc = mix(0.002, 0.008, s);
        } else if (y > 0.08) {
          float t = (y - 0.08) / 0.34;
          rx = mix(0.372, 0.462, smoothstep(0.0, 1.0, t));
          rz = mix(0.242, 0.208, t);
          zc = mix(0.014, 0.002, t);
        } else {
          float t = clamp((y + 0.66) / 0.74, 0.0, 1.0);
          rx = mix(0.306, 0.372, smoothstep(0.0, 1.0, t));
          rz = mix(0.206, 0.242, smoothstep(0.0, 1.0, t));
          zc = mix(0.004, 0.014, t);
        }
        return vec3(rx, rz, zc);
      }

      void main() {
        vec3 N = normalize(vNormalView);
        vec3 V = normalize(vViewPos);
        float ndotv = clamp(abs(dot(N, V)), 0.0, 1.0);

        // 3-point medical studio reflections (defines shoulders, clavicles & pectorals)
        vec3 keyDir = normalize(vec3(0.52, 0.72, 0.86));
        vec3 rimDir = normalize(vec3(-0.78, 0.42, -0.45));
        float keyDiff = max(dot(N, keyDir), 0.0);
        vec3 H1 = normalize(keyDir + V);
        float specKey = pow(max(dot(N, H1), 0.0), 38.0);
        vec3 H2 = normalize(rimDir + V);
        float specRim = pow(max(dot(N, H2), 0.0), 20.0);

        // Layered medical glass Fresnel — crisp outer human silhouette without harsh neon
        float fresnelBroad = pow(1.0 - ndotv, 1.55);
        float fresnelCrisp = pow(1.0 - ndotv, 3.65);

        // Clean top jaw & bottom waist dissolve inside the stage
        float bottomFade = smoothstep(-0.62, -0.20, vLocalPos.y);
        float topFade = 1.0 - smoothstep(0.67, 0.85, vLocalPos.y);
        float mask = bottomFade * topFade;

        // Exact analytical CSG seam clipping between torso and upper arms
        if (abs(uArmSide) > 0.5) {
          vec3 tp = evalTorso(vLocalPos.y);
          float ellDist = length(vec2(vLocalPos.x / (tp.x * 1.03), (vLocalPos.z - tp.z) / (tp.y * 1.03)));
          if (ellDist < 0.985) discard;
          float seamFeather = smoothstep(0.985, 1.08, ellDist);
          float topMerge = 1.0 - smoothstep(0.36, 0.448, vLocalPos.y) * (1.0 - smoothstep(0.46, 0.54, vLocalPos.x * uArmSide));
          mask *= seamFeather * topMerge;
        } else {
          float ax = abs(vLocalPos.x);
          float dDeltoid = length(vec3((ax - 0.482) / 0.114, (vLocalPos.y - 0.315) / 0.145, (vLocalPos.z + 0.008) / 0.126));
          if (dDeltoid < 0.94 && vLocalPos.y < 0.425 && vLocalPos.y > 0.14) discard;
          float socketBlend = smoothstep(0.94, 1.09, dDeltoid);
          mask *= mix(1.0, socketBlend, smoothstep(0.12, 0.24, vLocalPos.y) * (1.0 - smoothstep(0.41, 0.46, vLocalPos.y)));
        }

        // Keep central window clearer over lungs while keeping shoulders & flanks clearly sculpted
        float lungProx = exp(-pow((vLocalPos.y - 0.13) / 0.27, 2.0)) * exp(-pow(vLocalPos.x / 0.28, 2.0));

        // Subtle traveling vertical scanning highlight across translucent torso
        float scanBand = exp(-pow((vLocalPos.y - uScanY) / 0.042, 2.0)) * uScanStrength;
        float scanLine = exp(-pow((vLocalPos.y - uScanY) / 0.008, 2.0)) * uScanStrength;

        // Ultra-subtle grazing contour lines
        float contour = smoothstep(0.955, 1.0, sin(vLocalPos.y * 58.0) * 0.5 + 0.5) * 0.042 * fresnelBroad;

        vec3 col = mix(uDeepGlass, uMidGlass, fresnelBroad * 0.85 + keyDiff * 0.30);
        col = mix(col, uRimCyan, fresnelCrisp * 0.84);
        col += vec3(0.80, 0.97, 1.0) * (specKey * 0.50 + specRim * 0.26);
        col += uWarmBounce * lungProx * 0.09 * (1.0 - fresnelBroad);
        col += uRimCyan * (scanBand * 0.20 + scanLine * 0.42 + contour);

        float centerClear = 1.0 - lungProx * 0.46;
        float alpha = (0.072 * centerClear + keyDiff * 0.078 * centerClear + fresnelBroad * 0.44 + fresnelCrisp * 0.44 + specKey * 0.36 + scanBand * 0.11 + scanLine * 0.22 + contour) * mask * uOpacityMult;

        if (alpha < 0.005) discard;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.92));
      }
    `,
    transparent: true,
    depthWrite: false,
    side: backFace ? THREE.BackSide : THREE.FrontSide,
    blending: THREE.NormalBlending,
  });
}

/**
 * Crisp Medical X-Ray Pearlescent Bone & Costal Cartilage Shader:
 *  - Luminous pearlescent cyan-ice Fresnel edges + translucent hollow bone core
 *  - Anterior ribs/clavicles/sternum arch vividly in front of the lungs WITHOUT
 *    darkening or muddying the lung tissue underneath
 *  - Posterior ribs & spine recede into deep cool cobalt-cyan for true 3D depth
 */
export function createBoneXRayMaterial(options: {
  coreHex: number;
  rimHex: number;
  baseAlpha: number;
  rimAlpha: number;
  specularStrength?: number;
  isPosterior?: boolean;
  additive?: boolean;
}): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uCoreColor: { value: new THREE.Color(options.coreHex) },
      uRimColor: { value: new THREE.Color(options.rimHex) },
      uHighlight: { value: 0.0 },
      uDim: { value: 1.0 },
      uBaseAlpha: { value: options.baseAlpha },
      uRimAlpha: { value: options.rimAlpha },
      uSpecStrength: { value: options.specularStrength ?? 0.48 },
      uDepthFade: { value: options.isPosterior ? 0.72 : 1.0 },
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
      uniform float uBaseAlpha;
      uniform float uRimAlpha;
      uniform float uSpecStrength;
      uniform float uDepthFade;

      varying vec3 vNormalView;
      varying vec3 vViewPos;
      varying vec3 vLocalPos;

      void main() {
        vec3 N = normalize(vNormalView);
        vec3 V = normalize(vViewPos);
        float ndotv = clamp(abs(dot(N, V)), 0.0, 1.0);
        float rim = pow(1.0 - ndotv, 1.55);
        float edgeSharp = pow(1.0 - ndotv, 3.2);

        vec3 keyDir = normalize(vec3(0.45, 0.72, 0.86));
        float diff = max(dot(N, keyDir), 0.0) * 0.58 + 0.42;
        vec3 H = normalize(keyDir + V);
        float spec = pow(max(dot(N, H), 0.0), 30.0) * uSpecStrength;

        // Smooth pearlescent medical X-ray bone look (unbroken smooth rib arches, zero dashed aliasing)
        vec3 col = mix(uCoreColor * diff, uRimColor, rim * 0.72 + edgeSharp * 0.22 + uHighlight * 0.35);
        col += vec3(0.86, 0.98, 1.0) * spec;
        col += vec3(0.36, 0.88, 1.0) * uHighlight * 0.52;
        col *= uDepthFade;

        float alpha = (uBaseAlpha + rim * uRimAlpha + spec * 0.32 + uHighlight * 0.30) * uDim * uDepthFade;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.94));
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    blending: options.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
}

/**
 * Controlled Cyan-to-Coral-Amber 3D Lit Airway Shader:
 *  - Upper larynx & upper tracheal rings: crisp luminous medical cyan-teal
 *  - Mid-to-lower trachea & carina: smooth warm sunset-coral transition
 *  - Main bronchi & 4-generation intrapulmonary tree: vivid warm coral-amber
 *    clearly readable both through the frosted lungs and when lungs are hidden
 */
export function createAirwayGradientMaterial(options: {
  isCartilage?: boolean;
  isDistal?: boolean;
  baseOpacity?: number;
}): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uBreath: { value: 0.0 },
      uUpperCyan: {
        value: new THREE.Color(options.isCartilage ? 0x9cf8ff : 0x26d9ee),
      },
      uTransPeach: {
        value: new THREE.Color(options.isCartilage ? 0xffd7b0 : 0xff9a66),
      },
      uMidCoral: {
        value: new THREE.Color(options.isCartilage ? 0xffbf82 : 0xff6d38),
      },
      uDeepAmber: {
        value: new THREE.Color(options.isDistal ? 0xffd270 : 0xffa642),
      },
      uSpecColor: { value: new THREE.Color(0xfff7ec) },
      uHighlight: { value: 0.0 },
      uDim: { value: 1.0 },
      uBaseOpacity: { value: options.baseOpacity ?? 0.96 },
      uIsCartilage: { value: options.isCartilage ? 1.0 : 0.0 },
    },
    vertexShader: `
      attribute float aTreeDepth;
      varying vec3 vNormalView;
      varying vec3 vViewPos;
      varying float vTreeDepth;

      void main() {
        vTreeDepth = aTreeDepth;
        vNormalView = normalize(normalMatrix * normal);
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewPos = -mvPos.xyz;
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform float uBreath;
      uniform vec3 uUpperCyan;
      uniform vec3 uTransPeach;
      uniform vec3 uMidCoral;
      uniform vec3 uDeepAmber;
      uniform vec3 uSpecColor;
      uniform float uHighlight;
      uniform float uDim;
      uniform float uBaseOpacity;
      uniform float uIsCartilage;

      varying vec3 vNormalView;
      varying vec3 vViewPos;
      varying float vTreeDepth;

      void main() {
        vec3 N = normalize(vNormalView);
        vec3 V = normalize(vViewPos);
        float ndotv = clamp(abs(dot(N, V)), 0.0, 1.0);
        float rim = pow(1.0 - ndotv, 1.80);

        // Crisp cylindrical studio lighting
        vec3 keyDir = normalize(vec3(0.46, 0.68, 0.88));
        float diff = max(dot(N, keyDir), 0.0) * 0.56 + 0.44;
        vec3 H = normalize(keyDir + V);
        float spec = pow(max(dot(N, H), 0.0), 40.0);

        // Clean luminous cyan -> peach -> coral -> golden-amber (zero grey midpoint)
        float t1 = smoothstep(0.06, 0.25, vTreeDepth);
        float t2 = smoothstep(0.22, 0.46, vTreeDepth);
        float t3 = smoothstep(0.44, 0.90, vTreeDepth);

        vec3 coreCol = mix(uUpperCyan, uTransPeach, t1);
        coreCol = mix(coreCol, uMidCoral, t2);
        coreCol = mix(coreCol, uDeepAmber, t3);

        vec3 rimTint = mix(
          vec3(0.62, 0.98, 1.0),
          vec3(1.0, 0.91, 0.72),
          smoothstep(0.14, 0.46, vTreeDepth)
        );

        float breathBoost = 1.0 + uBreath * 0.08 * smoothstep(0.22, 0.9, vTreeDepth);
        vec3 col = coreCol * diff * breathBoost;
        col = mix(col, rimTint * 1.18, rim * (0.58 + uIsCartilage * 0.18));
        col += uSpecColor * spec * (0.32 + uIsCartilage * 0.28);
        col += vec3(0.32, 0.84, 0.98) * uHighlight * (1.0 - t2 * 0.5)
             + vec3(0.56, 0.38, 0.14) * uHighlight * t2;

        float alpha = clamp((uBaseOpacity + uHighlight * 0.05) * uDim, 0.14, 0.99);
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    depthWrite: true,
  });
}

/**
 * Premium Medical Hologram Lung Parenchyma Shader:
 *  - Combines frosted translucent pleural glass depth (pearlescent cyan-peach edge
 *    & wet visceral pleura specular) with controlled warm coral-orange internal
 *    illumination radiating organically from the hilum & bronchial core
 *  - Clearly defined lobar fissures (`aFissure`) communicating 3 right / 2 left lobes
 *  - Subtle 3D alveolar/vascular surface detail — never flat, never cartoonish neon
 */
export function createRefinedLungMaterial(
  isInnerCore = false
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uBreath: { value: 0.0 },
      uDeepTissue: { value: new THREE.Color(0xb83a34) },
      uWarmCoral: { value: new THREE.Color(0xf66b42) },
      uCoreAmber: { value: new THREE.Color(0xffb866) },
      uPleuraFrost: { value: new THREE.Color(0xdaf4ff) },
      uPleuraPeach: { value: new THREE.Color(0xffdccb) },
      uHighlight: { value: 0.0 },
      uDim: { value: 1.0 },
      uIsInnerCore: { value: isInnerCore ? 1.0 : 0.0 },
    },
    vertexShader: `
      attribute float aFissure;
      varying vec3 vNormalView;
      varying vec3 vViewPos;
      varying vec3 vLocalPos;
      varying float vFissure;

      void main() {
        vLocalPos = position;
        vFissure = aFissure;
        vNormalView = normalize(normalMatrix * normal);
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewPos = -mvPos.xyz;
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform float uBreath;
      uniform vec3 uDeepTissue;
      uniform vec3 uWarmCoral;
      uniform vec3 uCoreAmber;
      uniform vec3 uPleuraFrost;
      uniform vec3 uPleuraPeach;
      uniform float uHighlight;
      uniform float uDim;
      uniform float uIsInnerCore;

      varying vec3 vNormalView;
      varying vec3 vViewPos;
      varying vec3 vLocalPos;
      varying float vFissure;

      // Multi-scale procedural pulmonary lobule & fine sub-pleural vascular network
      float lobulePattern(vec3 p) {
        float w1 = sin(p.x * 48.0 + p.y * 26.0) * cos(p.z * 44.0 - p.y * 32.0);
        float w2 = sin(p.y * 78.0 - p.x * 42.0 + p.z * 34.0);
        float fine = sin(p.x * 115.0 + p.z * 96.0) * cos(p.y * 108.0);
        return (w1 * 0.52 + w2 * 0.32 + fine * 0.16) * 0.5 + 0.5;
      }

      void main() {
        vec3 N = normalize(vNormalView);
        vec3 V = normalize(vViewPos);
        float ndotv = clamp(abs(dot(N, V)), 0.0, 1.0);
        float fresnel = pow(1.0 - ndotv, 1.65);
        float sharpRim = pow(1.0 - ndotv, 3.4);

        if (uIsInnerCore > 0.5) {
          // Soft controlled warm subsurface glow radiating from the hilum behind the bronchi
          float coreMask = pow(ndotv, 1.30);
          float hilumFalloff = exp(-pow((vLocalPos.y - 0.15) / 0.28, 2.0));
          vec3 innerCol = mix(uWarmCoral, uCoreAmber, 0.50 + hilumFalloff * 0.34);
          float breathGlow = 0.96 + uBreath * 0.12;
          float alpha = (0.13 + coreMask * 0.17 + uHighlight * 0.10) * breathGlow * uDim;
          gl_FragColor = vec4(innerCol * breathGlow, clamp(alpha, 0.0, 0.45));
          return;
        }

        // Real 3D studio key/rim lighting + subtle subsurface scatter
        vec3 keyDir = normalize(vec3(0.48, 0.70, 0.86));
        vec3 rimDir = normalize(vec3(-0.74, 0.38, -0.50));
        float wrappedDiff = clamp((dot(N, keyDir) + 0.40) / 1.40, 0.0, 1.0);
        float backScatter = pow(max(dot(N, rimDir), 0.0), 1.7);

        // Crisp wet visceral pleura specular reflection
        vec3 H = normalize(keyDir + V);
        float pleuraSpec = pow(max(dot(N, H), 0.0), 44.0);

        // Organic lobule texture & clearly readable anatomical lobar fissure creases
        float lob = lobulePattern(vLocalPos);
        float fissureCrease = 1.0 - vFissure * 0.58;

        // Controlled internal coral-amber illumination strongest near medial hilum,
        // transitioning gracefully to translucent frosted medical-glass pleura at margins
        float hilumProx =
          exp(-pow((vLocalPos.y - 0.16) / 0.26, 2.0)) *
          exp(-pow((abs(vLocalPos.x) - 0.125) / 0.145, 2.0));
        float breathGlow = 1.0 + uBreath * 0.08;

        vec3 tissue = mix(uDeepTissue, uWarmCoral, wrappedDiff * 0.76 + lob * 0.20);
        tissue = mix(tissue, uCoreAmber, hilumProx * 0.54 * pow(ndotv, 0.72));
        tissue *= fissureCrease;

        // Sculpted frosted-pleura contour: warm peach transition + cool cyan-ice outer rim
        vec3 col = mix(tissue, uPleuraPeach, fresnel * 0.46);
        col = mix(col, uPleuraFrost, sharpRim * 0.48 + backScatter * 0.20);
        col += vec3(0.96, 0.98, 1.0) * pleuraSpec * 0.52;
        // Delicate light catch along the sculpted fissure edge for unmistakable 3-right / 2-left lobe readability
        col += mix(uPleuraPeach, uPleuraFrost, 0.40) * vFissure * (0.18 + fresnel * 0.24);
        col *= breathGlow;
        col += vec3(0.44, 0.24, 0.14) * uHighlight;

        // Translucent mid-window so the glowing bronchial tree reads crisply inside,
        // while frosted Fresnel edges give unmistakable 3D lung volume & lobe boundaries
        float alpha = (0.27 + fresnel * 0.48 + sharpRim * 0.22 + pleuraSpec * 0.26 + vFissure * 0.16 + uHighlight * 0.18) * uDim;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.93));
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });
}

/**
 * Sculpted Anatomical Double-Domed Thoracic Diaphragm Shader:
 * Distinguishes the pearlescent central tendon from the muscular dome periphery
 * and catches subtle warm light bounce from the concave lung bases resting above it.
 */
export function createDiaphragmFresnelMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMuscleColor: { value: new THREE.Color(0x136a8f) },
      uTendonColor: { value: new THREE.Color(0x52c7dc) },
      uRimColor: { value: new THREE.Color(0x8cf4ff) },
      uWarmBounce: { value: new THREE.Color(0xff8e5c) },
      uHighlight: { value: 0.0 },
      uDim: { value: 1.0 },
    },
    vertexShader: `
      attribute float aTendon;
      varying vec3 vNormalView;
      varying vec3 vViewPos;
      varying vec3 vLocalPos;
      varying float vTendon;
      void main() {
        vLocalPos = position;
        vTendon = aTendon;
        vNormalView = normalize(normalMatrix * normal);
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewPos = -mvPos.xyz;
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uMuscleColor;
      uniform vec3 uTendonColor;
      uniform vec3 uRimColor;
      uniform vec3 uWarmBounce;
      uniform float uHighlight;
      uniform float uDim;
      varying vec3 vNormalView;
      varying vec3 vViewPos;
      varying vec3 vLocalPos;
      varying float vTendon;

      void main() {
        vec3 N = normalize(vNormalView);
        vec3 V = normalize(vViewPos);
        float ndotv = clamp(abs(dot(N, V)), 0.0, 1.0);
        float rim = pow(1.0 - ndotv, 1.70);

        vec3 keyDir = normalize(vec3(0.35, 0.85, 0.72));
        float diff = max(dot(N, keyDir), 0.0) * 0.55 + 0.45;
        vec3 H = normalize(keyDir + V);
        float spec = pow(max(dot(N, H), 0.0), 30.0);

        // Subtle radial muscular fiber striation around peripheral dome
        float angle = atan(vLocalPos.z, vLocalPos.x);
        float fibers = (sin(angle * 28.0) * 0.5 + 0.5) * (1.0 - vTendon) * 0.10;

        float rad = length(vec2(vLocalPos.x / 0.325, vLocalPos.z / 0.195));
        float skirtFade = 1.0 - smoothstep(0.76, 1.04, rad);

        vec3 baseCol = mix(uMuscleColor, uTendonColor, vTendon * 0.65 + fibers);
        vec3 col = mix(baseCol * diff, uRimColor, rim * 0.80 + 0.14 + uHighlight * 0.36);
        // Subtle warm upward reflection under both lung domes
        float domeGlow = exp(-pow((abs(vLocalPos.x) - 0.15) / 0.12, 2.0)) * 0.16;
        col += uWarmBounce * domeGlow;
        col += vec3(0.84, 0.98, 1.0) * spec * 0.34;
        col += vec3(0.30, 0.84, 1.0) * uHighlight * 0.50;

        float alpha = (0.18 + rim * 0.48 + spec * 0.22 + uHighlight * 0.34) * skirtFade * uDim;
        if (alpha < 0.005) discard;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.88));
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

/**
 * Restrained Elegant Cyan Holographic Scanning / Orbital Ring Shader
 */
export function createOrbitalRingShaderMaterial(
  colorHex: number,
  phaseOffset: number,
  opacityScale = 0.68
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(colorHex) },
      uPhase: { value: phaseOffset },
      uOpacityScale: { value: opacityScale },
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
      uniform float uOpacityScale;
      varying vec2 vUv;

      void main() {
        float wave1 = pow(0.5 + 0.5 * sin(vUv.x * 6.2831853 + uTime * 0.52 + uPhase), 3.6);
        float wave2 = pow(0.5 + 0.5 * sin(vUv.x * 12.56637 - uTime * 0.32 + uPhase), 5.5);
        float intensity = 0.16 + wave1 * 0.64 + wave2 * 0.26;
        gl_FragColor = vec4(uColor * (0.94 + wave1 * 0.52), clamp(intensity * uOpacityScale, 0.0, 0.86));
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

/**
 * Procedural soft radial glow CanvasTexture (Zero external image requests)
 */
export function createRadialGlowTexture(
  stops: { offset: number; color: string }[]
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 1, 32, 32, 31);
    stops.forEach((s) => grad.addColorStop(s.offset, s.color));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
