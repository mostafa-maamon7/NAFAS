import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CalibratedHotspot,
  clampNormalizedCoords,
  normToViewBox,
  validateCalibratedHotspot,
  viewBoxToNorm,
} from '../data/hotspotCalibration';
import { getManifestEntry } from '../data/imageManifest';
import { Language } from '../types/nafas';

export interface SharedSceneCanvasProps {
  imageId: string;
  imageSrc: string;
  imageAlt: string;
  language: Language;
  /** Visible Look rings or Hand Target rings rendered inside the shared SVG group */
  hotspots?: CalibratedHotspot[];
  inspectedIds?: string[];
  highlightedId?: string | null;
  onSelectHotspot?: (hotspot: CalibratedHotspot) => void;
  /** Active hand target for drag-to-landmark / tap-landmark interaction */
  activeHandTarget?: CalibratedHotspot | null;
  /** When true, smoothly animates the hand marker to activeHandTarget.(x,y) ("Do it for me") */
  autoAnimateHandToTarget?: boolean;
  onHandTargetReached?: (target: CalibratedHotspot) => void;
  /** Camera motion control: locked to scale 1.0 during Look & hand-placement steps */
  enableKenBurns?: boolean;
  cameraPushLocked?: boolean;
  prefersReducedMotion?: boolean;
  /** Rhythm tap 1-2% scene punch scale pulse */
  punchPulse?: boolean;
  desaturationPct?: number;
  isCriticalVignette?: boolean;
  isSuccessBloom?: boolean;
  /** Non-blocking thin top loading bar shown while next beat decodes on slow networks */
  isLoadingNext?: boolean;
  onSceneTap?: () => void;
  /** Debug overlay (?debug=hotspots): draws expectedBox, panel bounds, and center dots */
  debugMode?: boolean;
  /** Editor mode (/qa/hotspots): allows click-to-place and drag-to-adjust hotspots */
  editorMode?: boolean;
  selectedEditorHotspotId?: string | null;
  onEditorUpdateHotspot?: (hotspotId: string, newX: number, newY: number) => void;
}

interface BufferSlotState {
  imageId: string;
  imageSrc: string;
  imageAlt: string;
  scale: number;
  kenBurnsActive: boolean;
}

export const SharedSceneCanvas: React.FC<SharedSceneCanvasProps> = ({
  imageId,
  imageSrc,
  imageAlt,
  language,
  hotspots = [],
  inspectedIds = [],
  highlightedId = null,
  onSelectHotspot,
  activeHandTarget = null,
  autoAnimateHandToTarget = false,
  onHandTargetReached,
  enableKenBurns = false,
  cameraPushLocked = true,
  prefersReducedMotion = false,
  punchPulse = false,
  desaturationPct = 0,
  isCriticalVignette = false,
  isSuccessBloom = false,
  isLoadingNext = false,
  onSceneTap,
  debugMode = false,
  editorMode = false,
  selectedEditorHotspotId = null,
  onEditorUpdateHotspot,
}) => {
  const isAr = language === 'ar';
  const manifestEntry = useMemo(() => getManifestEntry(imageId), [imageId]);
  const naturalWidth = manifestEntry.width || 640;
  const naturalHeight = manifestEntry.height || 357;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [renderedWidth, setRenderedWidth] = useState<number>(640);
  const [parallax, setParallax] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // ============================================================================
  // SYNCHRONOUS DOUBLE-BUFFERED A/B STAGE
  // Incoming decoded image commits to the active buffer on the EXACT SAME render
  // frame as the caption (0ms skew, zero desync frames even under 4x CPU load).
  // The outgoing buffer stays underneath at its frozen Ken Burns scale while the
  // incoming buffer crossfades 0 -> 1 cleanly over 400ms (0ms reduced-motion).
  // ============================================================================
  const [bufferState, setBufferState] = useState<{
    activeSlot: 'A' | 'B';
    transitionId: number;
    slotA: BufferSlotState;
    slotB: BufferSlotState;
  }>(() => ({
    activeSlot: 'A',
    transitionId: 0,
    slotA: {
      imageId,
      imageSrc,
      imageAlt,
      scale: 1,
      kenBurnsActive: false,
    },
    slotB: {
      imageId,
      imageSrc,
      imageAlt,
      scale: 1,
      kenBurnsActive: false,
    },
  }));

  const currentActiveBuf =
    bufferState.activeSlot === 'A' ? bufferState.slotA : bufferState.slotB;

  // Synchronous state update during render when imageSrc changes (React-recommended derived commit)
  if (currentActiveBuf.imageSrc !== imageSrc) {
    const incomingSlot: 'A' | 'B' = bufferState.activeSlot === 'A' ? 'B' : 'A';
    const nextSlotData: BufferSlotState = {
      imageId,
      imageSrc,
      imageAlt,
      scale: 1,
      kenBurnsActive: false,
    };
    setBufferState({
      activeSlot: incomingSlot,
      transitionId: bufferState.transitionId + 1,
      slotA: incomingSlot === 'A' ? nextSlotData : bufferState.slotA,
      slotB: incomingSlot === 'B' ? nextSlotData : bufferState.slotB,
    });
  } else if (
    currentActiveBuf.imageId !== imageId ||
    currentActiveBuf.imageAlt !== imageAlt
  ) {
    // Sync language alt/id without re-triggering crossfade
    const updatedSlot: BufferSlotState = {
      ...currentActiveBuf,
      imageId,
      imageAlt,
    };
    setBufferState((prev) => ({
      ...prev,
      slotA: prev.activeSlot === 'A' ? updatedSlot : prev.slotA,
      slotB: prev.activeSlot === 'B' ? updatedSlot : prev.slotB,
    }));
  }

  const activeSlot = bufferState.activeSlot;
  const slotA = bufferState.slotA;
  const slotB = bufferState.slotB;

  // Ken Burns gentle camera push ONLY on the currently visible slot (never restarts or jumps outgoing slot)
  useEffect(() => {
    const canDrift = !prefersReducedMotion && !cameraPushLocked && enableKenBurns;
    if (!canDrift) {
      setParallax({ x: 0, y: 0 });
      setBufferState((prev) => {
        const cur = prev.activeSlot === 'A' ? prev.slotA : prev.slotB;
        if (cur.scale === 1 && !cur.kenBurnsActive) return prev;
        const resetSlot = { ...cur, scale: 1, kenBurnsActive: false };
        return {
          ...prev,
          slotA: prev.activeSlot === 'A' ? resetSlot : prev.slotA,
          slotB: prev.activeSlot === 'B' ? resetSlot : prev.slotB,
        };
      });
      return;
    }

    // Trigger smooth CSS Ken Burns slow drift on the newly active slot only
    const startTimer = window.setTimeout(() => {
      setBufferState((prev) => {
        const cur = prev.activeSlot === 'A' ? prev.slotA : prev.slotB;
        const drifted = { ...cur, scale: 1.036, kenBurnsActive: true };
        return {
          ...prev,
          slotA: prev.activeSlot === 'A' ? drifted : prev.slotA,
          slotB: prev.activeSlot === 'B' ? drifted : prev.slotB,
        };
      });
    }, 60);

    return () => window.clearTimeout(startTimer);
  }, [activeSlot, bufferState.transitionId, prefersReducedMotion, cameraPushLocked, enableKenBurns]);

  // Draggable hand marker position in image-normalized (0..1) units
  const [handPos, setHandPos] = useState<{ x: number; y: number }>({
    x: activeHandTarget?.initialDragPos?.x ?? 0.18,
    y: activeHandTarget?.initialDragPos?.y ?? 0.28,
  });
  const [isDraggingHand, setIsDraggingHand] = useState(false);
  const [isDraggingEditorId, setIsDraggingEditorId] = useState<string | null>(null);
  const handTargetTriggeredRef = useRef<string | null>(null);

  // Measure rendered SVG width via ResizeObserver so invisible hit targets are ALWAYS >= 44x44 CSS px
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        setRenderedWidth(rect.width);
      }
    };
    updateSize();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updateSize);
      ro.observe(el);
      return () => ro.disconnect();
    } else {
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  // Reset draggable hand marker position when activeHandTarget changes
  useEffect(() => {
    if (!activeHandTarget) {
      handTargetTriggeredRef.current = null;
      return;
    }
    handTargetTriggeredRef.current = null;
    setHandPos(
      activeHandTarget.initialDragPos ?? {
        x: activeHandTarget.panel === 'right' ? 0.88 : 0.16,
        y: 0.28,
      }
    );
  }, [activeHandTarget]);

  // "Do it for me" smooth animation of hand marker directly to target.(x, y)
  useEffect(() => {
    if (!activeHandTarget || !autoAnimateHandToTarget) return;
    const startX = handPos.x;
    const startY = handPos.y;
    const endX = activeHandTarget.x;
    const endY = activeHandTarget.y;
    const duration = prefersReducedMotion ? 50 : 520;
    const startTime = performance.now();

    let rafId = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      setHandPos({
        x: Number((startX + (endX - startX) * ease).toFixed(4)),
        y: Number((startY + (endY - startY) * ease).toFixed(4)),
      });
      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else if (handTargetTriggeredRef.current !== activeHandTarget.id) {
        handTargetTriggeredRef.current = activeHandTarget.id;
        onHandTargetReached?.(activeHandTarget);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [
    activeHandTarget,
    autoAnimateHandToTarget,
    prefersReducedMotion,
    onHandTargetReached,
    handPos.x,
    handPos.y,
  ]);

  // Active scale on the interactive overlay group (strictly 1.0 during Look & hand placement; 1.016 during rhythm punchPulse)
  const overlayScale = !prefersReducedMotion && punchPulse ? 1.016 : 1;

  const activeTranslate =
    prefersReducedMotion || cameraPushLocked || !enableKenBurns
      ? { x: 0, y: 0 }
      : parallax;

  // Convert client pointer event (mouse/touch) into image-normalized (0..1) coordinates
  const clientPointToNormalized = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const svg = svgRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return null;

      const rawVx = ((clientX - rect.left) / rect.width) * naturalWidth;
      const rawVy = ((clientY - rect.top) / rect.height) * naturalHeight;

      const cx = naturalWidth / 2;
      const cy = naturalHeight / 2;
      const vx = (rawVx - cx - activeTranslate.x) / overlayScale + cx;
      const vy = (rawVy - cy - activeTranslate.y) / overlayScale + cy;

      return viewBoxToNorm(vx, vy, naturalWidth, naturalHeight);
    },
    [naturalWidth, naturalHeight, overlayScale, activeTranslate.x, activeTranslate.y]
  );

  // Check if dragged hand marker is within activeHandTarget's magnetic tolerance radius
  const checkHandDropOnTarget = useCallback(
    (nx: number, ny: number) => {
      if (!activeHandTarget) return;
      const dx = nx - activeHandTarget.x;
      const dy = (ny - activeHandTarget.y) * (naturalHeight / naturalWidth);
      const dist = Math.hypot(dx, dy);
      const tol = activeHandTarget.toleranceR ?? 0.08;
      if (dist <= tol && handTargetTriggeredRef.current !== activeHandTarget.id) {
        handTargetTriggeredRef.current = activeHandTarget.id;
        setHandPos({ x: activeHandTarget.x, y: activeHandTarget.y });
        setIsDraggingHand(false);
        try {
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(25);
          }
        } catch {
          // ignore vibration unsupported errors
        }
        onHandTargetReached?.(activeHandTarget);
      }
    },
    [activeHandTarget, naturalHeight, naturalWidth, onHandTargetReached]
  );

  // Pointer move/up handlers for dragging hand marker or editor hotspot
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (isDraggingHand && activeHandTarget) {
        const pt = clientPointToNormalized(e.clientX, e.clientY);
        if (!pt) return;
        const panelBounds =
          manifestEntry.panels && activeHandTarget.panel === 'left'
            ? manifestEntry.panels.left
            : manifestEntry.panels && activeHandTarget.panel === 'right'
            ? manifestEntry.panels.right
            : { xMin: 0.04, yMin: 0.06, xMax: 0.96, yMax: 0.94 };
        const clamped = clampNormalizedCoords(pt.x, pt.y, panelBounds);
        setHandPos(clamped);
        checkHandDropOnTarget(clamped.x, clamped.y);
        return;
      }

      if (editorMode && isDraggingEditorId && onEditorUpdateHotspot) {
        const pt = clientPointToNormalized(e.clientX, e.clientY);
        if (!pt) return;
        const clamped = clampNormalizedCoords(pt.x, pt.y, {
          xMin: 0.02,
          yMin: 0.02,
          xMax: 0.98,
          yMax: 0.98,
        });
        onEditorUpdateHotspot(isDraggingEditorId, clamped.x, clamped.y);
        return;
      }

      if (!prefersReducedMotion && !cameraPushLocked && enableKenBurns) {
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
        setParallax({ x: Number(nx.toFixed(2)), y: Number(ny.toFixed(2)) });
      }
    },
    [
      isDraggingHand,
      activeHandTarget,
      editorMode,
      isDraggingEditorId,
      onEditorUpdateHotspot,
      prefersReducedMotion,
      cameraPushLocked,
      enableKenBurns,
      clientPointToNormalized,
      manifestEntry.panels,
      checkHandDropOnTarget,
    ]
  );

  const handlePointerUp = useCallback(() => {
    setIsDraggingHand(false);
    setIsDraggingEditorId(null);
  }, []);

  // Compute minimum viewBox radius so clickable hit area is ALWAYS >= 44x44 CSS px on screen (even at 375px mobile viewport)
  const minHitRadiusVB = useMemo(() => {
    const scaleFactor = Math.max(renderedWidth * overlayScale, 1);
    return Math.max(44, Number(((23 / scaleFactor) * naturalWidth).toFixed(2)));
  }, [renderedWidth, overlayScale, naturalWidth]);

  // Combine Look hotspots + activeHandTarget for debug rendering
  const allActiveHotspots = useMemo(() => {
    const list = [...hotspots];
    if (
      activeHandTarget &&
      !list.some((item) => item.id === activeHandTarget.id)
    ) {
      list.push(activeHandTarget);
    }
    return list;
  }, [hotspots, activeHandTarget]);

  // Selected Look hotspot for the max-25% spotlight dimming mask
  const activeSpotlightHotspot = useMemo(() => {
    if (!highlightedId || hotspots.length === 0) return null;
    return hotspots.find((h) => h.id === highlightedId) ?? null;
  }, [highlightedId, hotspots]);

  // Helper to compute SVG geometry for circle, ellipse, or rounded_rect
  const getHotspotShapeVB = useCallback(
    (hs: CalibratedHotspot) => {
      const vb = normToViewBox(hs.x, hs.y, hs.r, naturalWidth, naturalHeight);
      const rx = hs.rx ? Number((hs.rx * naturalWidth).toFixed(2)) : vb.r;
      const ry = hs.ry ? Number((hs.ry * naturalHeight).toFixed(2)) : vb.r;
      const rotation = hs.rotation ?? 0;
      const shape = hs.shape ?? 'circle';
      return { cx: vb.cx, cy: vb.cy, r: vb.r, rx, ry, rotation, shape };
    },
    [naturalWidth, naturalHeight]
  );

  const activeBuffer = activeSlot === 'A' ? slotA : slotB;
  const crossfadeDurationMs = prefersReducedMotion ? 0 : 400;

  return (
    <div
      data-testid="shared-scene-container"
      data-image-id={imageId}
      data-committed-image-id={activeBuffer.imageId}
      data-active-slot={activeSlot}
      data-active-href={activeBuffer.imageSrc}
      data-loading-next={isLoadingNext ? 'true' : 'false'}
      data-camera-locked={cameraPushLocked ? 'true' : 'false'}
      style={{
        aspectRatio: `${naturalWidth} / ${naturalHeight}`,
      }}
      className={`relative w-full rounded-3xl overflow-hidden bg-[#071F2E] border-2 transition-colors select-none ${
        onSceneTap ? 'cursor-pointer' : ''
      } ${
        isSuccessBloom
          ? 'border-[#16A36A] shadow-[0_0_35px_rgba(22,163,106,0.3)]'
          : isCriticalVignette
          ? 'border-[#DC5252]/70'
          : 'border-[#285064]'
      }`}
    >
      {/* Thin non-blocking loading progress line along top edge when decoding next image on slow networks */}
      {isLoadingNext && (
        <div
          data-testid="scene-loading-bar"
          role="progressbar"
          aria-label={isAr ? 'جاري تجهيز المشهد التالي' : 'Preparing next scene'}
          className="pointer-events-none absolute top-0 inset-x-0 z-20 h-[3px] bg-[#0B2D40]/80 overflow-hidden"
        >
          <div
            className="h-full w-2/5 bg-gradient-to-r from-[#13B8B0] via-[#5CE2EA] to-[#13B8B0] rounded-full"
            style={{
              animation: prefersReducedMotion
                ? 'none'
                : 'nafasSceneLoadSweep 0.9s ease-in-out infinite',
            }}
          />
        </div>
      )}

      <svg
        ref={svgRef}
        width={naturalWidth}
        height={naturalHeight}
        viewBox={`0 0 ${naturalWidth} ${naturalHeight}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={activeBuffer.imageAlt}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          handlePointerUp();
          setParallax({ x: 0, y: 0 });
        }}
        onClick={(e) => {
          if (editorMode && selectedEditorHotspotId && onEditorUpdateHotspot) {
            const pt = clientPointToNormalized(e.clientX, e.clientY);
            if (pt) {
              onEditorUpdateHotspot(selectedEditorHotspotId, pt.x, pt.y);
            }
            return;
          }
          onSceneTap?.();
        }}
        className="w-full h-full block touch-none"
      >
        <defs>
          {/* Edge-first radial gradient for spotlight dimming (max 25% opacity at edges, 14% interior) */}
          <radialGradient id={`spotlight-grad-${imageId}`} cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#051520" stopOpacity="0.14" />
            <stop offset="65%" stopColor="#051520" stopOpacity="0.21" />
            <stop offset="100%" stopColor="#051520" stopOpacity="0.25" />
          </radialGradient>

          {/* Spotlight cutout mask so the tapped symptom area is NEVER dimmed or covered */}
          {activeSpotlightHotspot && (() => {
            const geom = getHotspotShapeVB(activeSpotlightHotspot);
            const pad = 8;
            return (
              <mask id={`spotlight-mask-${imageId}`}>
                <rect x={0} y={0} width={naturalWidth} height={naturalHeight} fill="white" />
                {geom.shape === 'rounded_rect' ? (
                  <rect
                    x={geom.cx - geom.rx - pad}
                    y={geom.cy - geom.ry - pad}
                    width={(geom.rx + pad) * 2}
                    height={(geom.ry + pad) * 2}
                    rx={12}
                    ry={12}
                    transform={
                      geom.rotation
                        ? `rotate(${geom.rotation} ${geom.cx} ${geom.cy})`
                        : undefined
                    }
                    fill="black"
                  />
                ) : (
                  <ellipse
                    cx={geom.cx}
                    cy={geom.cy}
                    rx={geom.rx + pad}
                    ry={geom.ry + pad}
                    transform={
                      geom.rotation
                        ? `rotate(${geom.rotation} ${geom.cx} ${geom.cy})`
                        : undefined
                    }
                    fill="black"
                  />
                )}
              </mask>
            );
          })()}
        </defs>

        {/* ====================================================================
            DOUBLE-BUFFERED IMAGE LAYERS (A & B) IN THE SHARED VIEWBOX
            Each buffer retains its own Ken Burns scale during crossfade so
            camera motion NEVER jumps or restarts on transition.
            ==================================================================== */}
        <g
          data-testid="shared-scene-buffers"
          style={{
            filter:
              !prefersReducedMotion && desaturationPct > 0
                ? `grayscale(${desaturationPct}%)`
                : undefined,
            transition: 'filter 450ms ease',
          }}
        >
          {(activeSlot === 'A' ? (['B', 'A'] as const) : (['A', 'B'] as const)).map((slotKey) => {
            const buf = slotKey === 'A' ? slotA : slotB;
            const isVisible = activeSlot === slotKey;
            const slotScale =
              !prefersReducedMotion && punchPulse && isVisible
                ? Number((buf.scale * 1.016).toFixed(4))
                : buf.scale;
            const slotTx = isVisible ? activeTranslate.x : 0;
            const slotTy = isVisible ? activeTranslate.y : 0;
            const shouldAnimateIn =
              isVisible && bufferState.transitionId > 0 && crossfadeDurationMs > 0;

            return (
              <g
                key={isVisible ? `${slotKey}-t${bufferState.transitionId}` : `${slotKey}-bg`}
                data-testid={`scene-buffer-${slotKey}`}
                data-buffer-active={isVisible ? 'true' : 'false'}
                data-buffer-image-id={buf.imageId}
                style={{
                  opacity: 1,
                  animation: shouldAnimateIn
                    ? `nafasCrossfadeIn ${crossfadeDurationMs}ms ease-out both`
                    : undefined,
                  pointerEvents: 'none',
                }}
              >
                <g
                  style={{
                    transformOrigin: `${naturalWidth / 2}px ${naturalHeight / 2}px`,
                    transform: `translate3d(${slotTx}px, ${slotTy}px, 0) scale(${slotScale})`,
                    transition:
                      isDraggingHand || isDraggingEditorId
                        ? 'none'
                        : punchPulse
                        ? 'transform 110ms cubic-bezier(0.2, 0.9, 0.3, 1.1)'
                        : buf.kenBurnsActive && isVisible
                        ? 'transform 7000ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                        : 'transform 350ms ease-out',
                  }}
                >
                  <image
                    data-testid={isVisible ? 'shared-scene-image' : `shared-scene-image-standby-${slotKey}`}
                    href={buf.imageSrc}
                    x={0}
                    y={0}
                    width={naturalWidth}
                    height={naturalHeight}
                    preserveAspectRatio="none"
                  />
                </g>
              </g>
            );
          })}
        </g>

        {/* ====================================================================
            SHARED OVERLAY GROUP (<g>): Hotspots, Spotlight Mask, Hand Targets
            Shares the exact 0..naturalWidth x 0..naturalHeight viewBox!
            Locked to scale 1.0 during Look & Hand Placement.
            ==================================================================== */}
        <g
          data-testid="shared-scene-transform-group"
          data-scale={overlayScale}
          style={{
            transformOrigin: `${naturalWidth / 2}px ${naturalHeight / 2}px`,
            transform: `translate3d(${activeTranslate.x}px, ${activeTranslate.y}px, 0) scale(${overlayScale})`,
            transition:
              isDraggingHand || isDraggingEditorId
                ? 'none'
                : punchPulse
                ? 'transform 110ms cubic-bezier(0.2, 0.9, 0.3, 1.1)'
                : 'transform 350ms ease-out',
          }}
        >
          {/* 1b. Soft Spotlight Dimming Overlay (max 25%, edges first, cut out around selected symptom) */}
          {activeSpotlightHotspot && !prefersReducedMotion && (
            <rect
              data-testid="scene-spotlight-dim-overlay"
              x={0}
              y={0}
              width={naturalWidth}
              height={naturalHeight}
              fill={`url(#spotlight-grad-${imageId})`}
              mask={`url(#spotlight-mask-${imageId})`}
              pointerEvents="none"
            />
          )}

          {/* 2. Debug Mode: Composite Two-Panel Sub-Rectangles (e.g. A2_OA2 Left & Right Panels) */}
          {debugMode && manifestEntry.panels && (
            <g data-testid="debug-panel-subrects">
              {(['left', 'right'] as const).map((panelKey) => {
                const p = manifestEntry.panels![panelKey];
                const rx = p.xMin * naturalWidth;
                const ry = p.yMin * naturalHeight;
                const rw = (p.xMax - p.xMin) * naturalWidth;
                const rh = (p.yMax - p.yMin) * naturalHeight;
                return (
                  <g key={panelKey}>
                    <rect
                      x={rx + 1}
                      y={ry + 1}
                      width={rw - 2}
                      height={rh - 2}
                      fill="none"
                      stroke="#43C7D1"
                      strokeWidth={1.5}
                      strokeDasharray="6 4"
                      vectorEffect="non-scaling-stroke"
                    />
                    <rect
                      x={rx + 6}
                      y={ry + 6}
                      width={118}
                      height={18}
                      rx={4}
                      fill="rgba(7,31,46,0.88)"
                    />
                    <text
                      x={rx + 12}
                      y={ry + 18}
                      fill="#43C7D1"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      PANEL: {panelKey.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 3. Debug Mode: Expected Bounding Boxes + Center Dots + Coordinate Readouts */}
          {debugMode &&
            allActiveHotspots.map((hs) => {
              const validation = validateCalibratedHotspot(hs);
              const box = hs.expectedBox;
              const bx = box.xMin * naturalWidth;
              const by = box.yMin * naturalHeight;
              const bw = (box.xMax - box.xMin) * naturalWidth;
              const bh = (box.yMax - box.yMin) * naturalHeight;
              const vb = normToViewBox(hs.x, hs.y, hs.r, naturalWidth, naturalHeight);

              return (
                <g
                  key={`debug-${hs.id}`}
                  data-testid={`debug-expected-box-${hs.id}`}
                  data-passed={validation.passed ? 'true' : 'false'}
                >
                  <rect
                    x={bx}
                    y={by}
                    width={bw}
                    height={bh}
                    fill={
                      validation.passed
                        ? 'rgba(233,162,59,0.10)'
                        : 'rgba(220,82,82,0.20)'
                    }
                    stroke={validation.passed ? '#E9A23B' : '#DC5252'}
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    vectorEffect="non-scaling-stroke"
                  />
                  <line
                    x1={vb.cx - 7}
                    y1={vb.cy}
                    x2={vb.cx + 7}
                    y2={vb.cy}
                    stroke={validation.passed ? '#00FF88' : '#DC5252'}
                    strokeWidth={1.5}
                    vectorEffect="non-scaling-stroke"
                  />
                  <line
                    x1={vb.cx}
                    y1={vb.cy - 7}
                    x2={vb.cx}
                    y2={vb.cy + 7}
                    stroke={validation.passed ? '#00FF88' : '#DC5252'}
                    strokeWidth={1.5}
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle
                    data-testid={`debug-center-dot-${hs.id}`}
                    cx={vb.cx}
                    cy={vb.cy}
                    r={3.5}
                    fill={validation.passed ? '#00FF88' : '#DC5252'}
                    stroke="#071F2E"
                    strokeWidth={1}
                  />
                  <rect
                    x={Math.min(naturalWidth - 135, Math.max(4, bx))}
                    y={Math.max(4, by - 16)}
                    width={132}
                    height={15}
                    rx={3}
                    fill="rgba(7,31,46,0.92)"
                    stroke={validation.passed ? '#E9A23B' : '#DC5252'}
                    strokeWidth={0.8}
                  />
                  <text
                    x={Math.min(naturalWidth - 131, Math.max(8, bx + 4))}
                    y={Math.max(15, by - 5)}
                    fill={validation.passed ? '#00FF88' : '#DC5252'}
                    fontSize="8.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {hs.region} ({hs.x.toFixed(2)},{hs.y.toFixed(2)}) {validation.passed ? 'OK' : 'ERR'}
                  </text>
                </g>
              );
            })}

          {/* 4. Look Rings & Interactive Hotspots (supports circle, ellipse, and rounded_rect) */}
          {hotspots.map((hs, idx) => {
            const geom = getHotspotShapeVB(hs);
            const hitR = Math.max(geom.r, geom.rx, geom.ry, minHitRadiusVB);
            const isInspected = inspectedIds.includes(hs.id);
            const isHighlighted =
              highlightedId === hs.id || selectedEditorHotspotId === hs.id;

            const strokeColor = isHighlighted
              ? '#43C7D1'
              : isInspected
              ? '#16A36A'
              : '#13B8B0';
            const fillColor = isHighlighted
              ? 'rgba(67,199,209,0.06)'
              : isInspected
              ? 'rgba(22,163,106,0.12)'
              : 'rgba(19,184,176,0.10)';

            const rotateTransform = geom.rotation
              ? `rotate(${geom.rotation} ${geom.cx} ${geom.cy})`
              : undefined;

            return (
              <g
                key={hs.id}
                data-testid={`scene-hotspot-${hs.id}`}
                data-region={hs.region}
                data-shape={geom.shape}
                data-norm-x={hs.x}
                data-norm-y={hs.y}
                data-norm-r={hs.r}
                role="button"
                tabIndex={0}
                aria-label={`${
                  hs.kind === 'hand_target'
                    ? isAr
                      ? 'هدف وضع اليد'
                      : 'Hand placement target'
                    : isAr
                    ? `فحص علامة ${idx + 1}`
                    : `Inspect sign ${idx + 1}`
                }: ${hs.label[language]} — ${hs.meaning[language]}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot?.(hs);
                }}
                onPointerDown={(e) => {
                  if (editorMode) {
                    e.stopPropagation();
                    setIsDraggingEditorId(hs.id);
                    onSelectHotspot?.(hs);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelectHotspot?.(hs);
                  }
                }}
                className="cursor-pointer focus:outline-none group"
              >
                <circle
                  data-testid={`scene-hotspot-hit-${hs.id}`}
                  cx={geom.cx}
                  cy={geom.cy}
                  r={hitR}
                  fill="transparent"
                />

                {!prefersReducedMotion && (!isInspected || isHighlighted) && (
                  geom.shape === 'rounded_rect' ? (
                    <rect
                      x={geom.cx - geom.rx - 4}
                      y={geom.cy - geom.ry - 4}
                      width={(geom.rx + 4) * 2}
                      height={(geom.ry + 4) * 2}
                      rx={10}
                      ry={10}
                      transform={rotateTransform}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={1.5}
                      strokeOpacity={0.55}
                      vectorEffect="non-scaling-stroke"
                    >
                      <animate
                        attributeName="stroke-opacity"
                        values="0.75;0.15;0.75"
                        dur="2.2s"
                        repeatCount="indefinite"
                      />
                    </rect>
                  ) : (
                    <ellipse
                      cx={geom.cx}
                      cy={geom.cy}
                      rx={geom.rx + 4}
                      ry={geom.ry + 4}
                      transform={rotateTransform}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={1.5}
                      strokeOpacity={0.55}
                      vectorEffect="non-scaling-stroke"
                    >
                      <animate
                        attributeName="rx"
                        values={`${geom.rx};${geom.rx + 7};${geom.rx}`}
                        dur="2.2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="ry"
                        values={`${geom.ry};${geom.ry + 7};${geom.ry}`}
                        dur="2.2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="stroke-opacity"
                        values="0.75;0.12;0.75"
                        dur="2.2s"
                        repeatCount="indefinite"
                      />
                    </ellipse>
                  )
                )}

                {geom.shape === 'rounded_rect' ? (
                  <rect
                    data-testid={`scene-hotspot-ring-${hs.id}`}
                    x={geom.cx - geom.rx}
                    y={geom.cy - geom.ry}
                    width={geom.rx * 2}
                    height={geom.ry * 2}
                    rx={8}
                    ry={8}
                    transform={rotateTransform}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isHighlighted ? 2.5 : 2}
                    vectorEffect="non-scaling-stroke"
                  />
                ) : geom.shape === 'ellipse' ? (
                  <ellipse
                    data-testid={`scene-hotspot-ring-${hs.id}`}
                    cx={geom.cx}
                    cy={geom.cy}
                    rx={geom.rx}
                    ry={geom.ry}
                    transform={rotateTransform}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isHighlighted ? 2.5 : 2}
                    vectorEffect="non-scaling-stroke"
                  />
                ) : (
                  <circle
                    data-testid={`scene-hotspot-ring-${hs.id}`}
                    cx={geom.cx}
                    cy={geom.cy}
                    r={geom.r}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isHighlighted ? 2.5 : 2}
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </g>
            );
          })}

          {/* 5. Active Hand Placement Target + Ghost Outline + Direction Arrow + Draggable Hand Marker (Step 4 OA2) */}
          {activeHandTarget && (() => {
            const targetGeom = getHotspotShapeVB(activeHandTarget);
            const targetHitR = Math.max(
              targetGeom.r,
              targetGeom.rx,
              targetGeom.ry,
              minHitRadiusVB
            );
            const handVB = normToViewBox(
              handPos.x,
              handPos.y,
              0.036,
              naturalWidth,
              naturalHeight
            );
            const handHitR = Math.max(handVB.r, minHitRadiusVB);

            const arrowDir = activeHandTarget.arrowDirection ?? 'down_forward';
            const arrowPath =
              arrowDir === 'in_up'
                ? `M ${targetGeom.cx} ${targetGeom.cy + 14} L ${targetGeom.cx} ${targetGeom.cy - 10} M ${targetGeom.cx - 6} ${targetGeom.cy - 4} L ${targetGeom.cx} ${targetGeom.cy - 11} L ${targetGeom.cx + 6} ${targetGeom.cy - 4}`
                : arrowDir === 'chest_in'
                ? `M ${targetGeom.cx - 12} ${targetGeom.cy} L ${targetGeom.cx + 8} ${targetGeom.cy} M ${targetGeom.cx + 2} ${targetGeom.cy - 6} L ${targetGeom.cx + 9} ${targetGeom.cy} L ${targetGeom.cx + 2} ${targetGeom.cy + 6}`
                : `M ${targetGeom.cx - 8} ${targetGeom.cy - 10} L ${targetGeom.cx + 8} ${targetGeom.cy + 8} M ${targetGeom.cx + 1} ${targetGeom.cy + 8} L ${targetGeom.cx + 8} ${targetGeom.cy + 8} L ${targetGeom.cx + 8} ${targetGeom.cy + 1}`;

            return (
              <g data-testid="scene-hand-interaction-layer">
                <line
                  x1={handVB.cx}
                  y1={handVB.cy}
                  x2={targetGeom.cx}
                  y2={targetGeom.cy}
                  stroke="#43C7D1"
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                  strokeOpacity={0.75}
                  vectorEffect="non-scaling-stroke"
                />

                <g
                  data-testid={`scene-hand-target-${activeHandTarget.id}`}
                  data-region={activeHandTarget.region}
                  data-panel={activeHandTarget.panel || 'full'}
                  data-ghost={activeHandTarget.ghostType || 'palm_heel'}
                  data-arrow={arrowDir}
                  data-norm-x={activeHandTarget.x}
                  data-norm-y={activeHandTarget.y}
                  role="button"
                  tabIndex={0}
                  aria-label={`${activeHandTarget.label[language]} — ${activeHandTarget.meaning[language]}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setHandPos({ x: activeHandTarget.x, y: activeHandTarget.y });
                    if (handTargetTriggeredRef.current !== activeHandTarget.id) {
                      handTargetTriggeredRef.current = activeHandTarget.id;
                      try {
                        navigator.vibrate?.(25);
                      } catch {
                        // ignore
                      }
                      onHandTargetReached?.(activeHandTarget);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      setHandPos({ x: activeHandTarget.x, y: activeHandTarget.y });
                      if (handTargetTriggeredRef.current !== activeHandTarget.id) {
                        handTargetTriggeredRef.current = activeHandTarget.id;
                        onHandTargetReached?.(activeHandTarget);
                      }
                    }
                  }}
                  className="cursor-pointer focus:outline-none"
                >
                  <circle
                    cx={targetGeom.cx}
                    cy={targetGeom.cy}
                    r={targetHitR}
                    fill="transparent"
                  />
                  {!prefersReducedMotion && (
                    <ellipse
                      cx={targetGeom.cx}
                      cy={targetGeom.cy}
                      rx={targetGeom.rx + 5}
                      ry={targetGeom.ry + 5}
                      fill="none"
                      stroke="#43C7D1"
                      strokeWidth={1.5}
                      vectorEffect="non-scaling-stroke"
                    >
                      <animate
                        attributeName="rx"
                        values={`${targetGeom.rx};${targetGeom.rx + 9};${targetGeom.rx}`}
                        dur="2.0s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="ry"
                        values={`${targetGeom.ry};${targetGeom.ry + 9};${targetGeom.ry}`}
                        dur="2.0s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="stroke-opacity"
                        values="0.8;0.15;0.8"
                        dur="2.0s"
                        repeatCount="indefinite"
                      />
                    </ellipse>
                  )}

                  <ellipse
                    data-testid={`scene-hand-target-ring-${activeHandTarget.id}`}
                    cx={targetGeom.cx}
                    cy={targetGeom.cy}
                    rx={targetGeom.rx}
                    ry={targetGeom.ry}
                    fill="rgba(19,184,176,0.20)"
                    stroke="#13B8B0"
                    strokeWidth={2}
                    strokeDasharray="5 3"
                    vectorEffect="non-scaling-stroke"
                  />

                  <path
                    data-testid={`scene-hand-target-arrow-${activeHandTarget.id}`}
                    d={arrowPath}
                    fill="none"
                    stroke="#F3F7F8"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>

                <g
                  data-testid="scene-hand-drag-marker"
                  data-norm-x={handPos.x}
                  data-norm-y={handPos.y}
                  role="button"
                  tabIndex={0}
                  aria-label={
                    isAr
                      ? 'اسحب علامة اليد إلى الموضع المضيء على المصاب'
                      : 'Drag hand marker to the highlighted landmark on the patient'
                  }
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
                    setIsDraggingHand(true);
                  }}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <circle
                    cx={handVB.cx}
                    cy={handVB.cy}
                    r={handHitR}
                    fill="transparent"
                  />
                  <circle
                    cx={handVB.cx}
                    cy={handVB.cy}
                    r={18}
                    fill="#0B2D40"
                    stroke="#43C7D1"
                    strokeWidth={2}
                    vectorEffect="non-scaling-stroke"
                  />
                  <text
                    x={handVB.cx}
                    y={handVB.cy + 4}
                    textAnchor="middle"
                    fill="#F3F7F8"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {isAr ? 'اسحب' : 'DRAG'}
                  </text>
                </g>
              </g>
            );
          })()}
        </g>
      </svg>

      {/* Edge-Only Critical Vignette (NEVER covers the central safe zone; pulse < 3 Hz) */}
      {isCriticalVignette && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_55px_rgba(220,82,82,0.38)] transition-opacity duration-700"
        />
      )}

      {/* Warm Light Bloom on Rescue Success */}
      {isSuccessBloom && !prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_65px_rgba(22,163,106,0.32)] transition-opacity duration-700"
        />
      )}
    </div>
  );
};
