import React, { useState } from 'react';
import {
  AssessSignHotspot,
  Language,
  MicroInteractionType,
  ObstructionObjectType,
  RescuerCharacterId,
  RigPoseId,
  SceneLocationId,
  StoryMediaKey,
  VictimCharacterId,
} from '../types/nafas';
import { clinicalAudio } from '../utils/clinicalAudio';
import { Anatomical3DViewer } from './Anatomical3DViewer';
import { STORY_MEDIA } from '../data/storyMedia';
import { getPatientDisplayBadge } from '../data/characterRegistry';

import adultAnatomyImg from '../assets/images/medical_adult_choking_anatomy_1795127849301.jpg';
import pregnantAnatomyImg from '../assets/images/medical_pregnant_sternal_anatomy_1795127850237.jpg';
import childAnatomyImg from '../assets/images/medical_child_pediatric_anatomy_1795127851097.jpg';
import infantAnatomyImg from '../assets/images/medical_infant_forearm_anatomy_1795127850309.jpg';

interface RiggedSceneCanvasProps {
  location: SceneLocationId;
  victim: VictimCharacterId;
  rescuer: RescuerCharacterId;
  obstruction: ObstructionObjectType;
  pose: RigPoseId;
  spo2: number;
  heartRate: number;
  language: Language;
  mediaKey?: StoryMediaKey;
  defaultRenderMode?: '3d' | '2.5d';
  showInteractiveToolbar?: boolean;
  assessMode?: boolean;
  hotspots?: AssessSignHotspot[];
  inspectedHotspotIds?: string[];
  highlightedHotspotId?: string | null;
  onInspectHotspot?: (hotspotId: string) => void;
  onHoverHotspot?: (hotspotId: string | null) => void;
  onSelectVictim?: (victim: VictimCharacterId) => void;
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

export const STORY_MEDIA_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(STORY_MEDIA).map(([key, asset]) => [key, asset.src])
);

export const RiggedSceneCanvas: React.FC<RiggedSceneCanvasProps> = ({
  victim,
  obstruction,
  pose,
  spo2,
  heartRate,
  language,
  mediaKey,
  defaultRenderMode,
  showInteractiveToolbar = false,
  hotspots = [],
  inspectedHotspotIds = [],
  highlightedHotspotId = null,
  onInspectHotspot,
  onHoverHotspot,
  onSelectVictim,
  microInteraction,
}) => {
  const [renderMode, setRenderMode] = useState<'3d' | '2.5d'>(
    defaultRenderMode ?? (mediaKey ? '2.5d' : showInteractiveToolbar ? '3d' : '2.5d')
  );

  if (renderMode === '3d') {
    return (
      <Anatomical3DViewer
        victim={victim}
        obstruction={obstruction}
        pose={pose}
        spo2={spo2}
        heartRate={heartRate}
        language={language}
        showInteractiveToolbar={showInteractiveToolbar}
        assessMode={false}
        hotspots={hotspots}
        inspectedHotspotIds={inspectedHotspotIds}
        onInspectHotspot={onInspectHotspot}
        onSelectVictim={onSelectVictim}
        onToggleViewMode={() => {
          clinicalAudio.playInspectPing();
          setRenderMode('2.5d');
        }}
        microInteraction={microInteraction}
      />
    );
  }

  const medicalIllustrationMap: Record<VictimCharacterId, string> = {
    youssef_adult: adultAnatomyImg,
    salma_pregnant: pregnantAnatomyImg,
    mostafa_child: childAnatomyImg,
    nelly_infant: infantAnatomyImg,
  };

  const mediaAsset = mediaKey ? STORY_MEDIA[mediaKey] : undefined;
  const activeImageSrc = mediaAsset?.src ?? medicalIllustrationMap[victim];
  const cameraCropClass = mediaAsset?.cameraCrop ?? 'scale-100 object-center';
  const altText =
    mediaAsset?.alt[language] ?? getPatientDisplayBadge(victim)[language];

  return (
    <div
      className="relative w-full h-full select-none overflow-hidden bg-[#071F2E]"
      data-scene-frame="true"
      data-media-key={mediaKey || 'anatomical_default'}
      data-style-id="NAFAS-STYLE-01"
    >
      {/* =================================================================== */}
      {/* SCENE FRAME ILLUSTRATION ONLY (ZERO TEXT / ZERO PANELS OVER SCENE)  */}
      {/* =================================================================== */}
      <div className="relative w-full h-full overflow-hidden">
        <img
          src={activeImageSrc}
          alt={altText}
          className={`w-full h-full object-cover block transition-transform duration-500 ease-out ${cameraCropClass}`}
          draggable={false}
        />

        {/* Subtle Unified NAFAS-STYLE-01 Rim Lighting Vignette (Non-obscuring) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(7,31,46,0.02) 48%, rgba(7,31,46,0.52) 100%)',
          }}
        />
      </div>

      {/* =================================================================== */}
      {/* THIN 2PX OUTLINE RINGS ONLY ON TAPPABLE HOTSPOTS (NO FILLS/TEXT)    */}
      {/* =================================================================== */}
      {hotspots.length > 0 && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          data-hotspot-rings-layer="true"
        >
          {hotspots.map((spot) => {
            const isInspected = inspectedHotspotIds.includes(spot.id);
            const isHighlighted = highlightedHotspotId === spot.id;

            return (
              <button
                key={spot.id}
                type="button"
                data-hotspot-ring-only="true"
                data-hotspot-id={spot.id}
                onClick={() => {
                  clinicalAudio.playInspectPing();
                  onInspectHotspot?.(spot.id);
                }}
                onMouseEnter={() => onHoverHotspot?.(spot.id)}
                onMouseLeave={() => onHoverHotspot?.(null)}
                style={{
                  left: `${spot.xPct}%`,
                  top: `${spot.yPct}%`,
                }}
                aria-label={spot.label[language]}
                className={`pointer-events-auto -translate-x-1/2 -translate-y-1/2 absolute w-11 h-11 rounded-full bg-transparent transition-transform duration-200 cursor-pointer focus:outline-none ${
                  isHighlighted
                    ? 'border-2 border-[#43C7D1] scale-125 ring-2 ring-[#13B8B0]/60'
                    : isInspected
                    ? 'border-2 border-[#16A36A] scale-105'
                    : 'border-2 border-[#13B8B0] hover:scale-110'
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
