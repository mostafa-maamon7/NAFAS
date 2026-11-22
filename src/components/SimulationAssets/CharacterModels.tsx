import React from 'react';
import {
  Language,
  ObstructionObjectType,
  RescuerCharacterId,
  RigPoseId,
  VictimCharacterId,
} from '../../types/nafas';

export interface CharacterModelProps {
  victim: VictimCharacterId;
  rescuer: RescuerCharacterId;
  obstruction: ObstructionObjectType;
  pose: RigPoseId;
  spo2: number;
  heartRate: number;
  language: Language;
  /** Shows internal ribcage, sternum, diaphragm, lungs, trachea & moving bolus */
  showAnatomyXray?: boolean;
  /** 0..5 interactive thrust progress during Stage 4 micro-interaction */
  thrustProgress?: number;
  /** Triggered when learner clicks directly on the character's target landmark */
  onDirectTargetClick?: () => void;
}

/**
 * Shared SVG Gradients, Soft Studio Lighting & Natural Skin/Fabric Shaders
 */
export const CharacterDefs: React.FC = () => (
  <defs>
    {/* Soft Studio Drop Shadow */}
    <filter id="char-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow
        dx="0"
        dy="8"
        stdDeviation="8"
        floodColor="#04111D"
        floodOpacity="0.38"
      />
    </filter>
    <filter id="limb-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow
        dx="0"
        dy="3"
        stdDeviation="3"
        floodColor="#04111D"
        floodOpacity="0.24"
      />
    </filter>

    {/* Warm, Appealing Human Skin Gradients (No zombie grey!) */}
    <linearGradient id="skin-adult-normal" x1="25%" y1="10%" x2="75%" y2="95%">
      <stop offset="0%" stopColor="#FFE3CC" />
      <stop offset="55%" stopColor="#F4C29F" />
      <stop offset="100%" stopColor="#DFA47B" />
    </linearGradient>
    {/* Subtle pale-warm skin when hypoxic (still looks human and warm, never corpse grey) */}
    <linearGradient
      id="skin-adult-cyanotic"
      x1="25%"
      y1="10%"
      x2="75%"
      y2="95%"
    >
      <stop offset="0%" stopColor="#F7E2DC" />
      <stop offset="55%" stopColor="#E5C5C0" />
      <stop offset="100%" stopColor="#C9A5A4" />
    </linearGradient>

    <linearGradient id="skin-child-normal" x1="25%" y1="10%" x2="75%" y2="95%">
      <stop offset="0%" stopColor="#FFE9D6" />
      <stop offset="58%" stopColor="#F8CBA9" />
      <stop offset="100%" stopColor="#E4AC84" />
    </linearGradient>
    <linearGradient
      id="skin-child-cyanotic"
      x1="25%"
      y1="10%"
      x2="75%"
      y2="95%"
    >
      <stop offset="0%" stopColor="#F9E7E2" />
      <stop offset="58%" stopColor="#E9CCC7" />
      <stop offset="100%" stopColor="#CFAEB0" />
    </linearGradient>

    <linearGradient
      id="skin-infant-normal"
      x1="25%"
      y1="10%"
      x2="75%"
      y2="95%"
    >
      <stop offset="0%" stopColor="#FFF0E3" />
      <stop offset="60%" stopColor="#FAD4B8" />
      <stop offset="100%" stopColor="#E8B794" />
    </linearGradient>
    <linearGradient
      id="skin-infant-cyanotic"
      x1="25%"
      y1="10%"
      x2="75%"
      y2="95%"
    >
      <stop offset="0%" stopColor="#FBECE8" />
      <stop offset="60%" stopColor="#EDD3CF" />
      <stop offset="100%" stopColor="#D6B7B8" />
    </linearGradient>

    <linearGradient id="skin-rescuer" x1="25%" y1="10%" x2="75%" y2="95%">
      <stop offset="0%" stopColor="#FFE1C8" />
      <stop offset="60%" stopColor="#F0BC96" />
      <stop offset="100%" stopColor="#D89E74" />
    </linearGradient>

    {/* Hair Gradients */}
    <linearGradient id="hair-dark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#2D3748" />
      <stop offset="50%" stopColor="#1A202C" />
      <stop offset="100%" stopColor="#0F141C" />
    </linearGradient>
    <linearGradient id="hair-warm-brown" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#4A3222" />
      <stop offset="55%" stopColor="#2E1E14" />
      <stop offset="100%" stopColor="#1C110B" />
    </linearGradient>

    {/* Clothing Gradients */}
    <linearGradient id="shirt-youssef" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#1D6896" />
      <stop offset="55%" stopColor="#134E73" />
      <stop offset="100%" stopColor="#0C3550" />
    </linearGradient>

    <linearGradient id="tunic-salma" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#14968B" />
      <stop offset="55%" stopColor="#0D746B" />
      <stop offset="100%" stopColor="#08504A" />
    </linearGradient>

    <linearGradient id="scarf-salma" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#1E4E68" />
      <stop offset="100%" stopColor="#103044" />
    </linearGradient>

    <linearGradient id="polo-mostafa" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#3B82F6" />
      <stop offset="55%" stopColor="#2563EB" />
      <stop offset="100%" stopColor="#1D4ED8" />
    </linearGradient>

    <linearGradient id="onesie-nelly" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#86EFAC" />
      <stop offset="60%" stopColor="#4ADE80" />
      <stop offset="100%" stopColor="#22C55E" />
    </linearGradient>

    <linearGradient id="scrubs-rescuer" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#0E9F9B" />
      <stop offset="55%" stopColor="#0A7C73" />
      <stop offset="100%" stopColor="#075650" />
    </linearGradient>

    {/* Internal Anatomy Gradients */}
    <linearGradient id="lung-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#2DD4C6" stopOpacity="0.52" />
      <stop offset="100%" stopColor="#0A7C73" stopOpacity="0.28" />
    </linearGradient>
    <linearGradient id="lung-hypoxic-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#E5484D" stopOpacity="0.48" />
      <stop offset="100%" stopColor="#881337" stopOpacity="0.28" />
    </linearGradient>
  </defs>
);

/**
 * Appealing, Friendly & Medically Clear Facial Features
 * Uses soft almond eye shapes with upper eyelids, warm brown irises, double catchlights,
 * natural nose shading, and expressive non-creepy mouth shapes.
 */
interface FaceProps {
  cx: number;
  cy: number;
  ageGroup: 'adult_male' | 'adult_female' | 'child' | 'infant';
  pose: RigPoseId;
  isCyanotic: boolean;
  isCriticalPose: boolean;
  isRecovered: boolean;
  bolusColor: string;
}

const ExpressiveFace: React.FC<FaceProps> = ({
  cx,
  cy,
  ageGroup,
  pose,
  isCyanotic,
  isCriticalPose,
  isRecovered,
  bolusColor,
}) => {
  const isInfant = ageGroup === 'infant';
  const isChild = ageGroup === 'child';

  const eyeOffsetX = isInfant ? 13.5 : isChild ? 15 : 15.5;
  const eyeY = isInfant ? cy + 2 : isChild ? cy - 1 : cy - 3;
  const eyeW = isInfant ? 6.5 : isChild ? 6.2 : 6.0;
  const eyeH = isCriticalPose
    ? isInfant
      ? 5.8
      : 5.4
    : isInfant
    ? 5.0
    : 4.5;
  const irisR = isInfant ? 4.2 : isChild ? 3.9 : 3.6;

  // Natural warm lip color vs subtle clinical cyanosis tint on lips
  const lipColor = isCyanotic
    ? '#7C6F94'
    : isRecovered
    ? '#D96B6B'
    : ageGroup === 'adult_female'
    ? '#C95F6B'
    : '#C57068';

  const cheekY = isInfant ? cy + 10 : isChild ? cy + 8 : cy + 7;
  const cheekR = isInfant ? 9.5 : isChild ? 8.5 : 7.5;
  const mouthY = isInfant ? cy + 17 : isChild ? cy + 17 : cy + 19;

  return (
    <g>
      {/* Soft Warm Cheek Blush (or gentle perioral tint in hypoxia) */}
      <ellipse
        cx={cx - eyeOffsetX - 2}
        cy={cheekY}
        rx={cheekR}
        ry={cheekR * 0.72}
        fill={
          isCyanotic
            ? 'rgba(124, 111, 148, 0.18)'
            : 'rgba(240, 128, 120, 0.24)'
        }
      />
      <ellipse
        cx={cx + eyeOffsetX + 2}
        cy={cheekY}
        rx={cheekR}
        ry={cheekR * 0.72}
        fill={
          isCyanotic
            ? 'rgba(124, 111, 148, 0.18)'
            : 'rgba(240, 128, 120, 0.24)'
        }
      />

      {/* Adult Male Neat Short Beard / Jaw Shading for Youssef */}
      {ageGroup === 'adult_male' && (
        <path
          d={`M${cx - 33} ${cy + 5} C${cx - 31} ${cy + 34} ${cx + 31} ${
            cy + 34
          } ${cx + 33} ${cy + 5} C${cx + 26} ${cy + 25} ${cx - 26} ${
            cy + 25
          } ${cx - 33} ${cy + 5} Z`}
          fill="rgba(45, 55, 72, 0.16)"
        />
      )}

      {/* Soft Sculpted Nose (No harsh dark outlines) */}
      {isInfant ? (
        <path
          d={`M${cx - 2.5} ${cy + 7.5} Q${cx} ${cy + 10} ${cx + 2.5} ${
            cy + 7.5
          }`}
          fill="none"
          stroke="#C2845E"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ) : isChild ? (
        <path
          d={`M${cx + 0.5} ${cy + 1} Q${cx - 2.5} ${cy + 8.5} ${cx + 2.5} ${
            cy + 9
          }`}
          fill="none"
          stroke="#BD7E56"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      ) : (
        <path
          d={`M${cx + 0.5} ${cy - 2} L${cx - 2} ${cy + 7.5} Q${cx + 0.5} ${
            cy + 10
          } ${cx + 3.5} ${cy + 8}`}
          fill="none"
          stroke="#B5754D"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}

      {/* EYES & EYEBROWS */}
      {pose === 'effective_cough' ? (
        /* Gentle Forceful-Cough Curved Eyes */
        <g>
          {[-1, 1].map((dir) => {
            const ex = cx + dir * eyeOffsetX;
            return (
              <g key={dir}>
                <path
                  d={`M${ex - 6} ${eyeY + 1} Q${ex} ${eyeY - 4} ${ex + 6} ${
                    eyeY + 1
                  }`}
                  fill="none"
                  stroke="#2D2018"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
                <path
                  d={`M${ex - 7} ${eyeY - 7} Q${ex} ${eyeY - 10} ${ex + 7} ${
                    eyeY - 8
                  }`}
                  fill="none"
                  stroke="#2D2018"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </g>
      ) : (
        /* Almond Eyes with Soft Eyelids, Warm Brown Irises & Double Catchlights */
        <g>
          {[-1, 1].map((dir) => {
            const ex = cx + dir * eyeOffsetX;
            return (
              <g key={dir}>
                {/* Soft Almond Sclera (No black border around the sclera!) */}
                <ellipse
                  cx={ex}
                  cy={eyeY}
                  rx={eyeW}
                  ry={eyeH}
                  fill="#FFFFFF"
                />
                {/* Warm Rich Brown Iris */}
                <circle cx={ex} cy={eyeY} r={irisR} fill="#4E3220" />
                {/* Deep Pupil */}
                <circle cx={ex} cy={eyeY} r={irisR * 0.55} fill="#180F0A" />
                {/* Primary & Secondary Specular Catchlights (Brings warmth & life!) */}
                <circle
                  cx={ex - 1.3}
                  cy={eyeY - 1.3}
                  r="1.45"
                  fill="#FFFFFF"
                />
                <circle
                  cx={ex + 1.1}
                  cy={eyeY + 1.1}
                  r="0.7"
                  fill="#FFFFFF"
                  opacity="0.85"
                />
                {/* Upper Eyelid Lash Curve */}
                <path
                  d={`M${ex - eyeW - 0.5} ${eyeY + 0.5} Q${ex} ${
                    eyeY - eyeH - 1.8
                  } ${ex + eyeW + 0.5} ${eyeY + 0.5}`}
                  fill="none"
                  stroke="#231710"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Subtle Lower Eyelid Hint */}
                <path
                  d={`M${ex - eyeW * 0.7} ${eyeY + eyeH - 0.2} Q${ex} ${
                    eyeY + eyeH + 1.2
                  } ${ex + eyeW * 0.7} ${eyeY + eyeH - 0.2}`}
                  fill="none"
                  stroke="#C48864"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
                {/* Expressive Eyebrows (Concerned upward inner tilt in distress vs warm arch) */}
                {isCriticalPose ? (
                  <path
                    d={
                      dir === -1
                        ? `M${ex - 7} ${eyeY - 7.5} Q${ex} ${eyeY - 9.5} ${
                            ex + 6.5
                          } ${eyeY - 12}`
                        : `M${ex + 7} ${eyeY - 7.5} Q${ex} ${eyeY - 9.5} ${
                            ex - 6.5
                          } ${eyeY - 12}`
                    }
                    fill="none"
                    stroke="#2A1E17"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d={`M${ex - 6.5} ${eyeY - 8.5} Q${ex} ${eyeY - 11.5} ${
                      ex + 6.5
                    } ${eyeY - 8.5}`}
                    fill="none"
                    stroke="#2A1E17"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                )}
              </g>
            );
          })}

          {/* Subtle Temple Sweat Drop in Critical Choking Pose */}
          {isCriticalPose && (
            <path
              d={`M${cx + eyeOffsetX + 13} ${eyeY - 7} C${
                cx + eyeOffsetX + 10.5
              } ${eyeY - 1} ${cx + eyeOffsetX + 15.5} ${eyeY - 1} ${
                cx + eyeOffsetX + 13
              } ${eyeY - 7} Z`}
              fill="#38BDF8"
              opacity="0.85"
            />
          )}
        </g>
      )}

      {/* MOUTH & AIRFLOW / ACOUSTIC INDICATORS */}
      {pose === 'severe_silent_choking' || pose === 'mistake_wait_delay' ? (
        <g>
          {/* Natural Strained Parted Lips (Not a giant creepy black hole!) */}
          <path
            d={`M${cx - 8} ${mouthY} Q${cx} ${mouthY - 4.5} ${cx + 8} ${mouthY} Q${cx} ${
              mouthY + 7.5
            } ${cx - 8} ${mouthY} Z`}
            fill="#5B323A"
            stroke={lipColor}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Subtle Upper Teeth Hint */}
          <path
            d={`M${cx - 5} ${mouthY - 1} Q${cx} ${mouthY - 2} ${cx + 5} ${
              mouthY - 1
            }`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Muted / Blocked Airway Indicator beside head */}
          <g transform={`translate(${cx + 38}, ${mouthY - 10})`}>
            <circle
              cx="10"
              cy="10"
              r="10"
              fill="rgba(229, 72, 77, 0.2)"
              stroke="#E5484D"
              strokeWidth="1.8"
            />
            <line
              x1="5.5"
              y1="5.5"
              x2="14.5"
              y2="14.5"
              stroke="#E5484D"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <line
              x1="14.5"
              y1="5.5"
              x2="5.5"
              y2="14.5"
              stroke="#E5484D"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>
        </g>
      ) : pose === 'effective_cough' ? (
        <g>
          {/* Open Coughing Mouth */}
          <path
            d={`M${cx - 7.5} ${mouthY - 1} Q${cx} ${mouthY - 4} ${cx + 7.5} ${
              mouthY - 1
            } Q${cx} ${mouthY + 7} ${cx - 7.5} ${mouthY - 1} Z`}
            fill="#6E3B44"
            stroke={lipColor}
            strokeWidth="2"
          />
          {/* Audible Cough Sound Waves */}
          <path
            d={`M${cx + 30} ${mouthY - 8} Q${cx + 42} ${mouthY} ${cx + 30} ${
              mouthY + 8
            }`}
            fill="none"
            stroke="#2DD4C6"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d={`M${cx + 39} ${mouthY - 13} Q${cx + 54} ${mouthY} ${cx + 39} ${
              mouthY + 13
            }`}
            fill="none"
            stroke="#2DD4C6"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>
      ) : isRecovered || pose === 'normal_chat' ? (
        <g>
          {/* Warm Relieved Smile */}
          <path
            d={`M${cx - 9.5} ${mouthY - 2} Q${cx} ${mouthY + 6.5} ${
              cx + 9.5
            } ${mouthY - 2}`}
            fill="none"
            stroke={lipColor}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {isRecovered && (
            <g>
              <g className="rig-expel">
                <circle
                  cx={cx + 28}
                  cy={mouthY - 2}
                  r={isInfant ? 6 : 8}
                  fill={bolusColor}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </g>
              <path
                d={`M${cx + 22} ${mouthY - 2} Q${cx + 66} ${mouthY - 30} ${
                  cx + 108
                } ${mouthY + 20}`}
                fill="none"
                stroke="#22A06B"
                strokeWidth="2.4"
                strokeDasharray="5 5"
              />
            </g>
          )}
        </g>
      ) : (
        /* Gentle Parted Lips during Active Rescue Maneuver */
        <path
          d={`M${cx - 6.5} ${mouthY} Q${cx} ${mouthY + 4} ${cx + 6.5} ${mouthY}`}
          fill="none"
          stroke={lipColor}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

/**
 * Friendly, Complete Adult Rescuer Figure (With warm expressive face, eyes, brows, nose, smile & NAFAS scrubs)
 */
const RescuerFigure: React.FC<{
  x: number;
  y: number;
  className?: string;
  badgeText?: string;
}> = ({ x, y, className = '', badgeText }) => (
  <g className={className} transform={`translate(${x}, ${y})`}>
    {/* Rescuer Neck */}
    <rect
      x="73"
      y="74"
      width="28"
      height="26"
      rx="10"
      fill="url(#skin-rescuer)"
    />
    {/* Soft Chin Shadow on Neck */}
    <path
      d="M73 80 Q87 90 101 80"
      fill="none"
      stroke="rgba(160, 98, 58, 0.35)"
      strokeWidth="3"
    />

    {/* Rescuer Ears */}
    <circle cx="51" cy="52" r="7.5" fill="url(#skin-rescuer)" />
    <circle cx="123" cy="52" r="7.5" fill="url(#skin-rescuer)" />

    {/* Rescuer Sculpted Head */}
    <rect
      x="52"
      y="14"
      width="70"
      height="74"
      rx="34"
      fill="url(#skin-rescuer)"
    />

    {/* Rescuer Clean Modern Haircut */}
    <path
      d="M50 44 C48 6 126 6 124 44 C122 28 112 22 88 22 C66 22 54 28 50 44 Z"
      fill="url(#hair-dark)"
    />

    {/* Rescuer Friendly Focused Face (Both eyes with catchlights, brows, nose, calm mouth) */}
    <g>
      {/* Left & Right Eyes */}
      {[-1, 1].map((dir) => {
        const ex = 90 + dir * 13;
        const ey = 48;
        return (
          <g key={dir}>
            <ellipse cx={ex} cy={ey} rx="5.2" ry="4.2" fill="#FFFFFF" />
            <circle cx={ex + 1} cy={ey} r="3.2" fill="#3B2314" />
            <circle cx={ex + 1} cy={ey} r="1.7" fill="#140B06" />
            <circle cx={ex - 0.3} cy={ey - 1.1} r="1.2" fill="#FFFFFF" />
            <path
              d={`M${ex - 5.5} ${ey + 0.5} Q${ex} ${ey - 5.2} ${ex + 5.5} ${
                ey + 0.5
              }`}
              fill="none"
              stroke="#1E293B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d={`M${ex - 5.5} ${ey - 7} Q${ex} ${ey - 9.5} ${ex + 5.5} ${
                ey - 7
              }`}
              fill="none"
              stroke="#1E293B"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        );
      })}
      {/* Nose */}
      <path
        d="M91 48 L93 57 Q91 59 88 58"
        fill="none"
        stroke="#B5754D"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Reassuring Focused Mouth */}
      <path
        d="M83 67 Q90 71 97 67"
        fill="none"
        stroke="#B05B52"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </g>

    {/* Rescuer Teal Medical Scrubs / NAFAS Polo Torso */}
    <path
      d="M30 100 C30 84 144 84 144 100 L154 305 L20 305 Z"
      fill="url(#scrubs-rescuer)"
    />
    {/* White V-Neck Undershirt & Collar Accent */}
    <path d="M72 90 L87 110 L102 90 Z" fill="#F8FAFC" />

    {badgeText && (
      <g>
        <rect
          x="14"
          y="252"
          width="148"
          height="24"
          rx="8"
          fill="rgba(7, 30, 48, 0.92)"
          stroke="#2DD4C6"
          strokeWidth="1.5"
        />
        <text
          x="88"
          y="268"
          textAnchor="middle"
          fill="#2DD4C6"
          fontSize="11"
          fontWeight="bold"
        >
          {badgeText}
        </text>
      </g>
    )}
  </g>
);

/**
 * Internal Anatomical X-Ray Overlay
 */
interface AnatomyXrayProps {
  cx: number;
  neckTopY: number;
  chestTopY: number;
  chestWidth: number;
  chestHeight: number;
  isCyanotic: boolean;
  isRecovered: boolean;
  bolusColor: string;
  thrustProgress: number;
  isPregnant?: boolean;
  isInfant?: boolean;
}

const InternalAnatomyXray: React.FC<AnatomyXrayProps> = ({
  cx,
  neckTopY,
  chestTopY,
  chestWidth,
  chestHeight,
  isCyanotic,
  isRecovered,
  bolusColor,
  thrustProgress,
  isPregnant = false,
  isInfant = false,
}) => {
  const halfW = chestWidth * 0.44;
  const tracheaBottomY = chestTopY + chestHeight * 0.28;
  const progressOffset = Math.min(5, Math.max(0, thrustProgress)) * 7;
  const bolusY = isRecovered
    ? neckTopY - 12
    : tracheaBottomY - 10 - progressOffset;

  return (
    <g className="pointer-events-none" opacity="0.92">
      <rect
        x={cx - halfW - 10}
        y={neckTopY}
        width={(halfW + 10) * 2}
        height={chestHeight + (chestTopY - neckTopY) + 18}
        rx="24"
        fill="rgba(7, 30, 48, 0.74)"
        stroke="#2DD4C6"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />

      {/* Left & Right Lungs */}
      <path
        d={`M${cx - 8} ${chestTopY + 12} C${cx - halfW} ${chestTopY + 10} ${
          cx - halfW - 4
        } ${chestTopY + chestHeight * 0.72} ${cx - halfW * 0.8} ${
          chestTopY + chestHeight * 0.85
        } C${cx - 18} ${chestTopY + chestHeight * 0.82} ${cx - 8} ${
          chestTopY + chestHeight * 0.65
        } ${cx - 8} ${chestTopY + 12} Z`}
        fill={isCyanotic ? 'url(#lung-hypoxic-grad)' : 'url(#lung-grad)'}
        stroke={isCyanotic ? '#E5484D' : '#2DD4C6'}
        strokeWidth="1.6"
      />
      <path
        d={`M${cx + 8} ${chestTopY + 12} C${cx + halfW} ${chestTopY + 10} ${
          cx + halfW + 4
        } ${chestTopY + chestHeight * 0.72} ${cx + halfW * 0.8} ${
          chestTopY + chestHeight * 0.85
        } C${cx + 18} ${chestTopY + chestHeight * 0.82} ${cx + 8} ${
          chestTopY + chestHeight * 0.65
        } ${cx + 8} ${chestTopY + 12} Z`}
        fill={isCyanotic ? 'url(#lung-hypoxic-grad)' : 'url(#lung-grad)'}
        stroke={isCyanotic ? '#E5484D' : '#2DD4C6'}
        strokeWidth="1.6"
      />

      {/* Sternum & Ribcage */}
      <line
        x1={cx}
        y1={chestTopY + 6}
        x2={cx}
        y2={chestTopY + chestHeight * 0.62}
        stroke="rgba(255, 255, 255, 0.65)"
        strokeWidth={isInfant ? '4' : '6'}
        strokeLinecap="round"
      />
      {[0.2, 0.36, 0.52, 0.68].map((ratio, idx) => {
        const ry = chestTopY + chestHeight * ratio;
        return (
          <g
            key={idx}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="2"
            fill="none"
          >
            <path
              d={`M${cx - 4} ${ry} Q${cx - halfW * 0.65} ${ry + 4} ${
                cx - halfW * 0.9
              } ${ry + 12}`}
            />
            <path
              d={`M${cx + 4} ${ry} Q${cx + halfW * 0.65} ${ry + 4} ${
                cx + halfW * 0.9
              } ${ry + 12}`}
            />
          </g>
        );
      })}

      {/* Diaphragm Dome */}
      <path
        d={`M${cx - halfW * 0.92} ${chestTopY + chestHeight * 0.86} Q${cx} ${
          chestTopY + chestHeight * (thrustProgress > 0 ? 0.64 : 0.74)
        } ${cx + halfW * 0.92} ${chestTopY + chestHeight * 0.86}`}
        fill="none"
        stroke="#FFC83D"
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {(isPregnant || isInfant) && (
        <ellipse
          cx={cx}
          cy={chestTopY + chestHeight * 1.02}
          rx={halfW * 0.78}
          ry={isPregnant ? 22 : 13}
          fill="rgba(229, 72, 77, 0.22)"
          stroke="#E5484D"
          strokeWidth="1.6"
          strokeDasharray="4 2"
        />
      )}

      {/* Trachea */}
      <path
        d={`M${cx - 6} ${neckTopY} L${cx - 6} ${tracheaBottomY} L${cx - 16} ${
          tracheaBottomY + 14
        } M${cx + 6} ${neckTopY} L${cx + 6} ${tracheaBottomY} L${cx + 16} ${
          tracheaBottomY + 14
        }`}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
      />

      {!isRecovered && (
        <circle
          cx={cx}
          cy={bolusY}
          r={isInfant ? 5.5 : 7}
          fill={bolusColor}
          stroke="#FFFFFF"
          strokeWidth="1.8"
        />
      )}
    </g>
  );
};

/**
 * Main Dispatcher: Renders Warm, Appealing, Age-Authentic Characters
 */
export const ArticulatedSceneCharacters: React.FC<CharacterModelProps> = ({
  victim,
  obstruction,
  pose,
  spo2,
  language,
  showAnatomyXray = false,
  thrustProgress = 0,
  onDirectTargetClick,
}) => {
  const isAr = language === 'ar';

  const isCyanotic =
    spo2 <= 86 ||
    pose === 'severe_silent_choking' ||
    pose === 'unresponsive_collapse' ||
    pose === 'mistake_wait_delay' ||
    pose === 'mistake_water_given' ||
    pose === 'mistake_blind_sweep';

  const isCriticalPose =
    pose === 'severe_silent_choking' ||
    pose === 'unresponsive_collapse' ||
    pose === 'mistake_water_given' ||
    pose === 'mistake_blind_sweep' ||
    pose === 'mistake_shake_upside_down' ||
    pose === 'mistake_infant_abdomen' ||
    pose === 'mistake_wait_delay';

  const isRescuePose =
    pose === 'back_blows_5' ||
    pose === 'abdominal_thrusts_5' ||
    pose === 'chest_thrusts_special' ||
    pose === 'cpr_compressions_30_2';

  const isRecovered = pose === 'object_expelled_recovery';

  const showRescuer =
    isRescuePose ||
    isRecovered ||
    pose === 'mistake_water_given' ||
    pose === 'mistake_blind_sweep' ||
    pose === 'mistake_shake_upside_down' ||
    pose === 'mistake_infant_abdomen';

  const bolusColor =
    obstruction === 'grape'
      ? '#7C3AED'
      : obstruction === 'soft_food'
      ? '#F59E0B'
      : '#B45309';

  const motionClass =
    pose === 'normal_chat' || pose === 'risk_setup' || isRecovered
      ? 'rig-breathe'
      : pose === 'effective_cough'
      ? 'rig-cough'
      : pose === 'severe_silent_choking'
      ? 'rig-tremor'
      : pose === 'back_blows_5' ||
        pose === 'abdominal_thrusts_5' ||
        pose === 'chest_thrusts_special'
      ? 'rig-thrust'
      : pose === 'cpr_compressions_30_2'
      ? 'rig-cpr'
      : '';

  // =========================================================================
  // CASE 1: SUPINE FLOOR / NURSERY PAD CPR (L3, L6, L9)
  // =========================================================================
  if (
    pose === 'unresponsive_collapse' ||
    pose === 'cpr_compressions_30_2'
  ) {
    const isInfant = victim === 'nelly_infant';
    const isChild = victim === 'mostafa_child';
    const isPregnant = victim === 'salma_pregnant';

    return (
      <g transform="translate(220, 195)" filter="url(#char-shadow)">
        {/* Rescuer Kneeling Beside Supine Patient */}
        <g transform="translate(145, -80)">
          <RescuerFigure x={5} y={0} />
          {/* Vertically Aligned CPR Arms */}
          <g className={pose === 'cpr_compressions_30_2' ? 'rig-cpr' : ''}>
            {isInfant ? (
              <>
                <line
                  x1="78"
                  y1="115"
                  x2="92"
                  y2="205"
                  stroke="url(#skin-rescuer)"
                  strokeWidth="13"
                  strokeLinecap="round"
                />
                <line
                  x1="90"
                  y1="196"
                  x2="90"
                  y2="218"
                  stroke="#FFE1C8"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <line
                  x1="98"
                  y1="196"
                  x2="98"
                  y2="218"
                  stroke="#FFE1C8"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                <line
                  x1="68"
                  y1="115"
                  x2="88"
                  y2="205"
                  stroke="url(#skin-rescuer)"
                  strokeWidth="15"
                  strokeLinecap="round"
                />
                <line
                  x1="118"
                  y1="115"
                  x2="96"
                  y2="205"
                  stroke="url(#skin-rescuer)"
                  strokeWidth="15"
                  strokeLinecap="round"
                />
              </>
            )}
          </g>
        </g>

        {/* Supine Clinical Mat */}
        <rect
          x="10"
          y="168"
          width={isInfant ? '320' : '480'}
          height="22"
          rx="11"
          fill="#0F3B57"
          stroke="#2DD4C6"
          strokeWidth="2"
        />

        {/* Supine Patient Proportioned by Age */}
        <g
          transform={
            isInfant
              ? 'translate(85, 36) scale(0.68)'
              : isChild
              ? 'translate(45, 18) scale(0.84)'
              : 'translate(0, 0)'
          }
        >
          {/* Supine Head */}
          <circle
            cx="96"
            cy="142"
            r={isInfant ? '36' : '33'}
            fill={
              isCyanotic
                ? 'url(#skin-adult-cyanotic)'
                : 'url(#skin-adult-normal)'
            }
          />
          {/* Closed Resting Eyelid on Supine Patient */}
          <path
            d="M88 134 Q96 139 104 134"
            fill="none"
            stroke="#2D2018"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Supine Torso */}
          <rect
            x="132"
            y="124"
            width={isInfant ? '145' : '195'}
            height="50"
            rx="22"
            fill={
              isInfant
                ? 'url(#onesie-nelly)'
                : isChild
                ? 'url(#polo-mostafa)'
                : isPregnant
                ? 'url(#tunic-salma)'
                : 'url(#shirt-youssef)'
            }
          />
          {isPregnant && (
            <path
              d="M205 124 Q248 82 292 124"
              fill="url(#tunic-salma)"
              stroke="#2DD4C6"
              strokeWidth="2"
            />
          )}
          {/* Supine Legs */}
          <rect
            x={isInfant ? '272' : '322'}
            y="134"
            width={isInfant ? '75' : '135'}
            height="32"
            rx="16"
            fill={isInfant ? '#4ADE80' : '#1E293B'}
          />

          {pose === 'cpr_compressions_30_2' && (
            <g
              className="rig-cpr cursor-pointer"
              onClick={onDirectTargetClick}
            >
              <circle
                cx="228"
                cy="126"
                r="22"
                fill="rgba(45, 212, 198, 0.25)"
                stroke="#2DD4C6"
                strokeWidth="2.5"
              />
              <path
                d="M228 84 L228 118 M218 108 L228 120 L238 108"
                stroke="#FFC83D"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          )}
        </g>

        <text
          x="215"
          y="222"
          textAnchor="middle"
          fill="#2DD4C6"
          fontSize="13"
          fontWeight="bold"
        >
          {isInfant
            ? isAr
              ? 'إنعاش الرضيع 30:2 بإصبعين (عمق ~4 سم) + فحص الفم البصري'
              : 'Infant 30:2 Two-Finger CPR (~4 cm depth) + Visual Mouth Check'
            : isChild
            ? isAr
              ? 'إنعاش الطفل 30:2 بيد واحدة أو كلتا اليدين (عمق ~5 سم)'
              : 'Pediatric 30:2 CPR (~5 cm depth) + Visual Mouth Check'
            : isAr
            ? 'إنعاش البالغ 30:2 بمنتصف عظمة القص + فحص الفم البصري'
            : 'Adult 30:2 Sternal CPR + Visual Mouth Check'}
        </text>
      </g>
    );
  }

  // =========================================================================
  // CASE 2: INFANT NELLY (8 MONTHS OLD) — SWEET, APPEALING BABY CHARACTER
  // =========================================================================
  if (victim === 'nelly_infant') {
    const isForearmRescue =
      pose === 'back_blows_5' || pose === 'chest_thrusts_special';

    if (isForearmRescue) {
      return (
        <g transform="translate(265, 105)" filter="url(#char-shadow)">
          {/* Parent Rescuer Supporting Baby Along Forearm */}
          <RescuerFigure x={125} y={-5} />

          {/* Parent Supporting Thigh & Forearm */}
          <path
            d="M162 280 L64 318 L82 352 L195 315 Z"
            fill="#1E293B"
          />
          <path
            d="M195 162 L78 232"
            stroke="url(#skin-rescuer)"
            strokeWidth="22"
            strokeLinecap="round"
          />

          {/* 8-Month-Old Baby Layan Angled Head-Lower-Than-Chest */}
          <g className="rig-thrust" onClick={onDirectTargetClick}>
            <ellipse
              cx="198"
              cy="185"
              rx="18"
              ry="12"
              transform="rotate(-25 198 185)"
              fill="url(#onesie-nelly)"
            />
            <ellipse
              cx="148"
              cy="202"
              rx="46"
              ry="28"
              transform="rotate(-20 148 202)"
              fill="url(#onesie-nelly)"
            />
            <path
              d="M108 204 Q124 225 138 202 Z"
              fill="#FFFFFF"
            />
            {/* Baby Head */}
            <circle
              cx="88"
              cy="228"
              r="30"
              fill={
                isCyanotic
                  ? 'url(#skin-infant-cyanotic)'
                  : 'url(#skin-infant-normal)'
              }
            />
            {/* Soft Baby Curl */}
            <path
              d="M74 202 Q66 188 82 192 Q90 185 96 196"
              fill="none"
              stroke="url(#hair-warm-brown)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Baby Rosy Cheek & Eye with Catchlight */}
            <circle
              cx="82"
              cy="236"
              r="7.5"
              fill="rgba(240, 128, 120, 0.28)"
            />
            <circle cx="76" cy="226" r="4" fill="#3B2314" />
            <circle cx="75" cy="225" r="1.4" fill="#FFFFFF" />

            {/* Rescuer C-Grip Supporting Bony Jaw */}
            <path
              d="M66 242 Q86 258 106 240"
              fill="none"
              stroke="url(#skin-rescuer)"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {showAnatomyXray && (
              <g>
                <ellipse
                  cx="148"
                  cy="202"
                  rx="32"
                  ry="18"
                  transform="rotate(-20 148 202)"
                  fill="rgba(7, 30, 48, 0.75)"
                  stroke="#2DD4C6"
                  strokeWidth="1.5"
                />
                <line
                  x1="96"
                  y1="224"
                  x2="145"
                  y2="202"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                />
                <circle
                  cx={125 - Math.min(5, thrustProgress) * 5}
                  cy={212 + Math.min(5, thrustProgress) * 2}
                  r="5.5"
                  fill={bolusColor}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              </g>
            )}

            {pose === 'back_blows_5' ? (
              <g className="cursor-pointer">
                <path
                  d="M176 116 L146 174"
                  stroke="url(#skin-rescuer)"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <circle
                  cx="146"
                  cy="176"
                  r="16"
                  fill="rgba(255, 200, 61, 0.25)"
                  stroke="#FFC83D"
                  strokeWidth="2.5"
                />
                <g stroke="#FFC83D" strokeWidth="3.5" fill="none">
                  <path d="M168 122 L140 168" />
                  <path d="M136 154 L140 170 L154 164" />
                </g>
                <text
                  x="130"
                  y="100"
                  fill="#2DD4C6"
                  fontSize="13"
                  fontWeight="bold"
                >
                  {isAr
                    ? '5 ضربات بين لوحي كتف الرضيعة (الرأس لأسفل)'
                    : '5 Infant Back Blows (Head Lower Than Chest)'}
                </text>
              </g>
            ) : (
              <g className="cursor-pointer">
                <line
                  x1="156"
                  y1="124"
                  x2="146"
                  y2="182"
                  stroke="url(#skin-rescuer)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <line
                  x1="166"
                  y1="126"
                  x2="156"
                  y2="184"
                  stroke="url(#skin-rescuer)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <circle
                  cx="150"
                  cy="184"
                  r="14"
                  fill="rgba(45, 212, 198, 0.28)"
                  stroke="#2DD4C6"
                  strokeWidth="2.5"
                />
                <text
                  x="120"
                  y="100"
                  fill="#2DD4C6"
                  fontSize="13"
                  fontWeight="bold"
                >
                  {isAr
                    ? '5 ضغطات صدرية بإصبعين فقط (يُمنع ضغط البطن!)'
                    : '5 Two-Finger Sternal Thrusts (NEVER Abdominal!)'}
                </text>
              </g>
            )}
          </g>
        </g>
      );
    }

    // Baby Layan Seated in Padded Nursery High-Chair
    return (
      <g transform="translate(365, 130)" filter="url(#char-shadow)">
        {showRescuer && <RescuerFigure x={-148} y={-22} />}

        {/* Nursery Padded Baby High-Chair */}
        <g>
          <line
            x1="55"
            y1="255"
            x2="32"
            y2="385"
            stroke="#94A3B8"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <line
            x1="175"
            y1="255"
            x2="198"
            y2="385"
            stroke="#94A3B8"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <rect
            x="42"
            y="55"
            width="146"
            height="205"
            rx="38"
            fill="#F8FAFC"
            stroke="#CBD5E1"
            strokeWidth="2.5"
          />
          <rect
            x="54"
            y="68"
            width="122"
            height="180"
            rx="28"
            fill="#E0F2FE"
          />
        </g>

        {/* Baby Layan */}
        <g className={motionClass} onClick={onDirectTargetClick}>
          {/* Chubby Baby Legs */}
          <path
            d="M80 228 Q64 256 78 274"
            fill="none"
            stroke="url(#onesie-nelly)"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M150 228 Q166 256 152 274"
            fill="none"
            stroke="url(#onesie-nelly)"
            strokeWidth="22"
            strokeLinecap="round"
          />
          {/* Rounded Baby Romper Torso */}
          <ellipse
            cx="115"
            cy="186"
            rx="45"
            ry="46"
            fill="url(#onesie-nelly)"
          />
          {/* Cute White Baby Bib */}
          <path
            d="M84 146 Q115 184 146 146 Q132 138 115 142 Q98 138 84 146 Z"
            fill="#FFFFFF"
          />

          {/* Pudgy Baby Arms with Sleeves & Soft Hands */}
          {isCriticalPose ? (
            <g filter="url(#limb-shadow)">
              <path
                d="M74 160 Q44 136 36 116"
                fill="none"
                stroke={
                  isCyanotic
                    ? 'url(#skin-infant-cyanotic)'
                    : 'url(#skin-infant-normal)'
                }
                strokeWidth="14"
                strokeLinecap="round"
              />
              <circle
                cx="35"
                cy="114"
                r="8.5"
                fill={
                  isCyanotic
                    ? 'url(#skin-infant-cyanotic)'
                    : 'url(#skin-infant-normal)'
                }
              />
              <path
                d="M156 160 Q186 136 194 116"
                fill="none"
                stroke={
                  isCyanotic
                    ? 'url(#skin-infant-cyanotic)'
                    : 'url(#skin-infant-normal)'
                }
                strokeWidth="14"
                strokeLinecap="round"
              />
              <circle
                cx="195"
                cy="114"
                r="8.5"
                fill={
                  isCyanotic
                    ? 'url(#skin-infant-cyanotic)'
                    : 'url(#skin-infant-normal)'
                }
              />
            </g>
          ) : (
            <g filter="url(#limb-shadow)">
              <path
                d="M74 166 Q58 190 78 210"
                fill="none"
                stroke="url(#skin-infant-normal)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <circle
                cx="80"
                cy="210"
                r="8"
                fill="url(#skin-infant-normal)"
              />
              <path
                d="M156 166 Q172 190 152 210"
                fill="none"
                stroke="url(#skin-infant-normal)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <circle
                cx="150"
                cy="210"
                r="8"
                fill="url(#skin-infant-normal)"
              />
            </g>
          )}

          {/* High-Chair Feeding Tray */}
          <rect
            x="28"
            y="214"
            width="174"
            height="16"
            rx="8"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="2"
          />

          {/* Soft Baby Ears & Chubby Baby Head (No harsh black borders!) */}
          <circle
            cx="71"
            cy="102"
            r="8.5"
            fill={
              isCyanotic
                ? 'url(#skin-infant-cyanotic)'
                : 'url(#skin-infant-normal)'
            }
          />
          <circle
            cx="159"
            cy="102"
            r="8.5"
            fill={
              isCyanotic
                ? 'url(#skin-infant-cyanotic)'
                : 'url(#skin-infant-normal)'
            }
          />
          <ellipse
            cx="115"
            cy="98"
            rx="44"
            ry="42"
            fill={
              isCyanotic
                ? 'url(#skin-infant-cyanotic)'
                : 'url(#skin-infant-normal)'
            }
          />

          {/* Soft Baby Hair Curl & Bow */}
          <path
            d="M96 58 Q115 44 134 58 Q122 50 112 60"
            fill="none"
            stroke="url(#hair-warm-brown)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <ellipse cx="132" cy="58" rx="7" ry="4.5" fill="#F43F5E" />
          <circle cx="132" cy="58" r="2.5" fill="#FB7185" />

          {/* Appealing Baby Face */}
          <ExpressiveFace
            cx={115}
            cy={98}
            ageGroup="infant"
            pose={pose}
            isCyanotic={isCyanotic}
            isCriticalPose={isCriticalPose}
            isRecovered={isRecovered}
            bolusColor={bolusColor}
          />

          {showAnatomyXray && (
            <InternalAnatomyXray
              cx={115}
              neckTopY={132}
              chestTopY={148}
              chestWidth={78}
              chestHeight={64}
              isCyanotic={isCyanotic}
              isRecovered={isRecovered}
              bolusColor={bolusColor}
              thrustProgress={thrustProgress}
              isInfant
            />
          )}

          {pose === 'mistake_infant_abdomen' && (
            <g>
              <circle
                cx="115"
                cy="192"
                r="28"
                fill="rgba(229, 72, 77, 0.28)"
                stroke="#E5484D"
                strokeWidth="3"
                strokeDasharray="6 3"
              />
              <text
                x="115"
                y="252"
                textAnchor="middle"
                fill="#FCA5A5"
                fontSize="12"
                fontWeight="bold"
              >
                {isAr
                  ? 'خطر إصابة كبد الرضيع — يُمنع ضغط البطن!'
                  : 'Infant Liver Trauma Hazard — NEVER Press Abdomen!'}
              </text>
            </g>
          )}
        </g>
      </g>
    );
  }

  // =========================================================================
  // CASE 3: CHILD MOSTAFA (6 YEARS OLD) — FRIENDLY SCHOOLBOY CHARACTER
  // =========================================================================
  if (victim === 'mostafa_child') {
    return (
      <g transform="translate(375, 145)" filter="url(#char-shadow)">
        {/* Adult Teacher Rescuer Kneeling Behind Youssef */}
        {showRescuer && (
          <RescuerFigure
            x={-115}
            y={-42}
            className={isRescuePose ? 'rig-thrust' : ''}
            badgeText={
              isAr
                ? 'ركوع المسعف لمستوى الطفل'
                : 'Rescuer Kneeling to Child Height'
            }
          />
        )}

        {/* 6-Year-Old Youssef */}
        <g
          className={motionClass}
          onClick={onDirectTargetClick}
          transform={
            pose === 'back_blows_5' || pose === 'effective_cough'
              ? 'rotate(15 105 230)'
              : pose === 'mistake_shake_upside_down'
              ? 'translate(0, -15) rotate(165 105 165)'
              : ''
          }
        >
          {/* School Trousers */}
          <rect
            x="73"
            y="245"
            width="23"
            height="95"
            rx="11"
            fill="#1E293B"
          />
          <rect
            x="114"
            y="245"
            width="23"
            height="95"
            rx="11"
            fill="#1E293B"
          />

          {/* Blue School Polo Shirt with Short Sleeves */}
          <path
            d="M56 116 C56 98 154 98 154 116 L158 254 L52 254 Z"
            fill="url(#polo-mostafa)"
          />
          {/* Short Polo Sleeves */}
          <path
            d="M58 112 L38 142 L54 152 L64 128 Z"
            fill="url(#polo-mostafa)"
          />
          <path
            d="M152 112 L172 142 L156 152 L146 128 Z"
            fill="url(#polo-mostafa)"
          />

          {/* School Polo Gold Stripe, White Collar & Emblem */}
          <path d="M55 156 L155 156" stroke="#FFC83D" strokeWidth="4.5" />
          <path d="M84 104 L105 126 L126 104 Z" fill="#FFFFFF" />
          <circle cx="131" cy="138" r="7" fill="#FFC83D" />

          {/* Smooth Child Neck with Soft Chin Shadow (No black outline box!) */}
          <rect
            x="93"
            y="82"
            width="24"
            height="28"
            rx="10"
            fill={
              isCyanotic
                ? 'url(#skin-child-cyanotic)'
                : 'url(#skin-child-normal)'
            }
          />
          <path
            d="M93 88 Q105 97 117 88"
            fill="none"
            stroke="rgba(165, 102, 62, 0.35)"
            strokeWidth="3"
          />

          {/* Child Ears & Sculpted Rounded Head */}
          <circle
            cx="65"
            cy="55"
            r="8"
            fill={
              isCyanotic
                ? 'url(#skin-child-cyanotic)'
                : 'url(#skin-child-normal)'
            }
          />
          <circle
            cx="145"
            cy="55"
            r="8"
            fill={
              isCyanotic
                ? 'url(#skin-child-cyanotic)'
                : 'url(#skin-child-normal)'
            }
          />
          <rect
            x="66"
            y="12"
            width="78"
            height="80"
            rx="38"
            fill={
              isCyanotic
                ? 'url(#skin-child-cyanotic)'
                : 'url(#skin-child-normal)'
            }
          />

          {/* Friendly Schoolboy Hair with Soft Fringe */}
          <path
            d="M65 44 C64 4 146 4 145 44 C138 24 122 24 108 21 C94 25 76 24 65 44 Z"
            fill="url(#hair-warm-brown)"
          />
          <path
            d="M102 11 Q112 0 120 8"
            fill="none"
            stroke="url(#hair-warm-brown)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Appealing 6-Year-Old Face */}
          <ExpressiveFace
            cx={105}
            cy={52}
            ageGroup="child"
            pose={pose}
            isCyanotic={isCyanotic}
            isCriticalPose={isCriticalPose}
            isRecovered={isRecovered}
            bolusColor={bolusColor}
          />

          {/* Articulated Child Arms & Hands */}
          {pose === 'severe_silent_choking' || pose === 'mistake_wait_delay' ? (
            <g filter="url(#limb-shadow)">
              <path
                d="M46 142 L34 114 L88 94"
                fill="none"
                stroke={
                  isCyanotic
                    ? 'url(#skin-child-cyanotic)'
                    : 'url(#skin-child-normal)'
                }
                strokeWidth="12.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="90"
                cy="93"
                r="7.5"
                fill={
                  isCyanotic
                    ? 'url(#skin-child-cyanotic)'
                    : 'url(#skin-child-normal)'
                }
              />
              <path
                d="M164 142 L176 114 L122 94"
                fill="none"
                stroke={
                  isCyanotic
                    ? 'url(#skin-child-cyanotic)'
                    : 'url(#skin-child-normal)'
                }
                strokeWidth="12.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="120"
                cy="93"
                r="7.5"
                fill={
                  isCyanotic
                    ? 'url(#skin-child-cyanotic)'
                    : 'url(#skin-child-normal)'
                }
              />
              <circle
                cx="105"
                cy="94"
                r="22"
                fill="none"
                stroke="#E5484D"
                strokeWidth="2.2"
                strokeDasharray="5 3"
              />
            </g>
          ) : (
            <g filter="url(#limb-shadow)">
              <path
                d="M46 142 L40 186 L54 218"
                fill="none"
                stroke="url(#skin-child-normal)"
                strokeWidth="12.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="55"
                cy="220"
                r="7.5"
                fill="url(#skin-child-normal)"
              />
              <path
                d="M164 142 L170 186 L156 218"
                fill="none"
                stroke="url(#skin-child-normal)"
                strokeWidth="12.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="155"
                cy="220"
                r="7.5"
                fill="url(#skin-child-normal)"
              />
            </g>
          )}

          {showAnatomyXray && (
            <InternalAnatomyXray
              cx={105}
              neckTopY={88}
              chestTopY={118}
              chestWidth={90}
              chestHeight={105}
              isCyanotic={isCyanotic}
              isRecovered={isRecovered}
              bolusColor={bolusColor}
              thrustProgress={thrustProgress}
            />
          )}

          {pose === 'back_blows_5' && (
            <g className="cursor-pointer">
              <path
                d="M-28 112 L52 138"
                stroke="url(#skin-rescuer)"
                strokeWidth="15"
                strokeLinecap="round"
              />
              <circle
                cx="56"
                cy="138"
                r="18"
                fill="rgba(255, 200, 61, 0.28)"
                stroke="#FFC83D"
                strokeWidth="2.5"
              />
              <g stroke="#FFC83D" strokeWidth="3.5" fill="none">
                <path d="M12 120 L52 136" />
                <path d="M38 124 L54 137 L36 144" />
              </g>
            </g>
          )}

          {pose === 'abdominal_thrusts_5' && (
            <g className="cursor-pointer">
              <path
                d="M-25 162 C18 190 68 202 108 196"
                fill="none"
                stroke="url(#skin-rescuer)"
                strokeWidth="15"
                strokeLinecap="round"
              />
              <circle
                cx="112"
                cy="195"
                r="13"
                fill="url(#skin-rescuer)"
                stroke="#2DD4C6"
                strokeWidth="2.8"
              />
              <g stroke="#2DD4C6" strokeWidth="3.8" fill="none">
                <path d="M138 218 L98 172" />
                <path d="M98 188 L96 170 L114 174" />
              </g>
            </g>
          )}

          {pose === 'mistake_water_given' && (
            <g>
              <rect
                x="128"
                y="60"
                width="22"
                height="30"
                rx="4"
                fill="rgba(56, 189, 248, 0.65)"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <circle
                cx="139"
                cy="75"
                r="22"
                fill="none"
                stroke="#E5484D"
                strokeWidth="3"
              />
            </g>
          )}
        </g>
      </g>
    );
  }

  // =========================================================================
  // CASE 4: ADULTS — YOUSSEF (34Y MALE) & SALMA (31Y PREGNANT WOMAN)
  // =========================================================================
  const isPregnant = victim === 'salma_pregnant';

  return (
    <g transform="translate(360, 105)" filter="url(#char-shadow)">
      {/* Complete Adult Rescuer Standing Behind Patient */}
      {showRescuer && (
        <RescuerFigure
          x={-105}
          y={-8}
          className={isRescuePose ? 'rig-thrust' : ''}
        />
      )}

      {/* Primary Adult Character */}
      <g
        className={motionClass}
        onClick={onDirectTargetClick}
        transform={
          pose === 'back_blows_5' || pose === 'effective_cough'
            ? 'rotate(14 115 260)'
            : ''
        }
      >
        {/* Adult Trousers */}
        <rect
          x="74"
          y="290"
          width="31"
          height="115"
          rx="12"
          fill="#0F172A"
        />
        <rect
          x="125"
          y="290"
          width="31"
          height="115"
          rx="12"
          fill="#0F172A"
        />

        {/* Adult Torso & Sleeves */}
        <path
          d={
            isPregnant
              ? 'M52 114 C52 94 178 94 178 114 L184 300 L46 300 Z'
              : 'M40 112 C40 90 190 90 190 112 L178 300 L52 300 Z'
          }
          fill={isPregnant ? 'url(#tunic-salma)' : 'url(#shirt-youssef)'}
        />
        {/* Sculpted Upper-Arm Shirt Sleeves */}
        <path
          d="M44 108 L22 146 L42 158 L54 128 Z"
          fill={isPregnant ? 'url(#tunic-salma)' : 'url(#shirt-youssef)'}
        />
        <path
          d="M186 108 L208 146 L188 158 L176 128 Z"
          fill={isPregnant ? 'url(#tunic-salma)' : 'url(#shirt-youssef)'}
        />

        {/* Shirt Collar & Placket Details for Youssef */}
        {!isPregnant && (
          <g>
            <path d="M90 96 L115 124 L140 96 Z" fill="#F1F5F9" />
            <line
              x1="115"
              y1="124"
              x2="115"
              y2="295"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2.5"
            />
          </g>
        )}

        {/* Prominent 3rd-Trimester Gravid Abdomen Contour for Salma */}
        {isPregnant && (
          <g>
            <path
              d="M162 162 C224 175 230 268 172 292 Z"
              fill="url(#tunic-salma)"
              stroke="#2DD4C6"
              strokeWidth="2.2"
            />
            <ellipse
              cx="192"
              cy="252"
              rx="13"
              ry="8.5"
              fill={
                isCyanotic
                  ? 'url(#skin-adult-cyanotic)'
                  : 'url(#skin-adult-normal)'
              }
            />
          </g>
        )}

        {/* Smooth Sculpted Neck with Soft Chin Shadow (No dark box border!) */}
        <rect
          x="99"
          y="74"
          width="32"
          height="34"
          rx="12"
          fill={
            isCyanotic
              ? 'url(#skin-adult-cyanotic)'
              : 'url(#skin-adult-normal)'
          }
        />
        <path
          d="M99 82 Q115 92 131 82"
          fill="none"
          stroke="rgba(160, 98, 58, 0.35)"
          strokeWidth="3.5"
        />

        {/* Adult Ears & Sculpted Head */}
        {!isPregnant && (
          <>
            <circle
              cx="74"
              cy="48"
              r="8.5"
              fill={
                isCyanotic
                  ? 'url(#skin-adult-cyanotic)'
                  : 'url(#skin-adult-normal)'
              }
            />
            <circle
              cx="156"
              cy="48"
              r="8.5"
              fill={
                isCyanotic
                  ? 'url(#skin-adult-cyanotic)'
                  : 'url(#skin-adult-normal)'
              }
            />
          </>
        )}
        <rect
          x="76"
          y="4"
          width="78"
          height="84"
          rx="38"
          fill={
            isCyanotic
              ? 'url(#skin-adult-cyanotic)'
              : 'url(#skin-adult-normal)'
          }
        />

        {/* Hair / Modest Draped Headscarf for Salma vs Modern Tapered Hair for Youssef */}
        {isPregnant ? (
          <path
            d="M72 44 C70 -6 160 -6 158 44 C162 78 154 106 140 114 C144 62 138 22 115 22 C92 22 84 60 88 112 C74 96 70 68 72 44 Z"
            fill="url(#scarf-salma)"
          />
        ) : (
          <path
            d="M75 40 C74 -4 156 -4 155 40 C152 24 136 16 115 16 C94 16 78 24 75 40 Z"
            fill="url(#hair-dark)"
          />
        )}

        {/* Appealing Adult Face */}
        <ExpressiveFace
          cx={115}
          cy={46}
          ageGroup={isPregnant ? 'adult_female' : 'adult_male'}
          pose={pose}
          isCyanotic={isCyanotic}
          isCriticalPose={isCriticalPose}
          isRecovered={isRecovered}
          bolusColor={bolusColor}
        />

        {/* Articulated Forearms & Sculpted Hands */}
        {pose === 'severe_silent_choking' || pose === 'mistake_wait_delay' ? (
          <g filter="url(#limb-shadow)">
            <path
              d="M32 148 L22 112 L94 88"
              fill="none"
              stroke={
                isCyanotic
                  ? 'url(#skin-adult-cyanotic)'
                  : 'url(#skin-adult-normal)'
              }
              strokeWidth="14.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="97"
              cy="87"
              r="8.5"
              fill={
                isCyanotic
                  ? 'url(#skin-adult-cyanotic)'
                  : 'url(#skin-adult-normal)'
              }
            />
            <path
              d="M198 148 L208 112 L136 88"
              fill="none"
              stroke={
                isCyanotic
                  ? 'url(#skin-adult-cyanotic)'
                  : 'url(#skin-adult-normal)'
              }
              strokeWidth="14.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="133"
              cy="87"
              r="8.5"
              fill={
                isCyanotic
                  ? 'url(#skin-adult-cyanotic)'
                  : 'url(#skin-adult-normal)'
              }
            />
            <circle
              cx="115"
              cy="88"
              r="24"
              fill="none"
              stroke="#E5484D"
              strokeWidth="2.2"
              strokeDasharray="6 4"
            />
          </g>
        ) : (
          <g filter="url(#limb-shadow)">
            <path
              d="M32 148 L28 198 L44 240"
              fill="none"
              stroke="url(#skin-adult-normal)"
              strokeWidth="14.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="45" cy="242" r="8.5" fill="url(#skin-adult-normal)" />
            {!isPregnant && (
              <>
                <path
                  d="M198 148 L202 198 L186 240"
                  fill="none"
                  stroke="url(#skin-adult-normal)"
                  strokeWidth="14.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="185"
                  cy="242"
                  r="8.5"
                  fill="url(#skin-adult-normal)"
                />
              </>
            )}
          </g>
        )}

        {showAnatomyXray && (
          <InternalAnatomyXray
            cx={115}
            neckTopY={78}
            chestTopY={114}
            chestWidth={122}
            chestHeight={132}
            isCyanotic={isCyanotic}
            isRecovered={isRecovered}
            bolusColor={bolusColor}
            thrustProgress={thrustProgress}
            isPregnant={isPregnant}
          />
        )}

        {/* Rescuer Maneuver Vectors */}
        {pose === 'back_blows_5' && (
          <g className="cursor-pointer">
            <path
              d="M-32 114 L52 140"
              stroke="url(#skin-rescuer)"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <circle
              cx="56"
              cy="140"
              r="20"
              fill="rgba(255, 200, 61, 0.28)"
              stroke="#FFC83D"
              strokeWidth="2.8"
            />
            <g stroke="#FFC83D" strokeWidth="4" fill="none">
              <path d="M10 122 L52 138" />
              <path d="M38 126 L54 139 L36 146" />
            </g>
          </g>
        )}

        {pose === 'abdominal_thrusts_5' && (
          <g className="cursor-pointer">
            <path
              d="M-26 172 C22 204 78 216 122 210"
              fill="none"
              stroke="url(#skin-rescuer)"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <circle
              cx="126"
              cy="208"
              r="15"
              fill="url(#skin-rescuer)"
              stroke="#2DD4C6"
              strokeWidth="3"
            />
            <g stroke="#2DD4C6" strokeWidth="4" fill="none">
              <path d="M154 232 L112 184" />
              <path d="M112 200 L110 182 L128 186" />
            </g>
          </g>
        )}

        {pose === 'chest_thrusts_special' && (
          <g className="cursor-pointer">
            <path
              d="M-24 148 C26 156 78 160 122 158"
              fill="none"
              stroke="url(#skin-rescuer)"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <circle
              cx="126"
              cy="158"
              r="15"
              fill="url(#skin-rescuer)"
              stroke="#2DD4C6"
              strokeWidth="3"
            />
            <g stroke="#2DD4C6" strokeWidth="4" fill="none">
              <path d="M162 158 L98 158" />
              <path d="M114 148 L96 158 L114 168" />
            </g>
          </g>
        )}

        {pose === 'mistake_water_given' && (
          <g>
            <rect
              x="142"
              y="56"
              width="24"
              height="32"
              rx="4"
              fill="rgba(56, 189, 248, 0.65)"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <circle
              cx="154"
              cy="72"
              r="24"
              fill="none"
              stroke="#E5484D"
              strokeWidth="3"
            />
          </g>
        )}

        {pose === 'mistake_blind_sweep' && (
          <g>
            <path
              d="M184 72 L124 68"
              stroke="url(#skin-rescuer)"
              strokeWidth="13"
              strokeLinecap="round"
            />
            <circle
              cx="126"
              cy="68"
              r="22"
              fill="rgba(229, 72, 77, 0.25)"
              stroke="#E5484D"
              strokeWidth="2.8"
            />
          </g>
        )}

        {pose === 'mistake_infant_abdomen' && (
          <g>
            <circle
              cx="168"
              cy="226"
              r="32"
              fill="rgba(229, 72, 77, 0.3)"
              stroke="#E5484D"
              strokeWidth="3"
              strokeDasharray="6 3"
            />
          </g>
        )}
      </g>
    </g>
  );
};
