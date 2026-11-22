import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bug,
  CheckCircle2,
  Copy,
  Crosshair,
  Eye,
  Play,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { SharedSceneCanvas } from '../components/SharedSceneCanvas';
import {
  CALIBRATED_IMAGE_HOTSPOTS,
  CalibratedHotspot,
  getHandTargetsForImage,
  getLookHotspotsForImage,
  normToViewBox,
  validateCalibratedHotspot,
} from '../data/hotspotCalibration';
import { getManifestEntry, IMAGE_MANIFEST_LIST } from '../data/imageManifest';
import { STORY_LEVELS } from '../data/storyLevels';

export const QAHotspotsPage: React.FC = () => {
  const urlParams = useMemo(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const initialImageId = urlParams.get('image') || 'A2_S5';
  const initialTargetFilter = (urlParams.get('target') || 'all') as
    | 'all'
    | 'left'
    | 'right';
  const initialDebug = urlParams.get('debug') !== 'off';
  const initialKenBurns = urlParams.get('kenBurns') === 'on';

  const [selectedImageId, setSelectedImageId] = useState<string>(initialImageId);
  const [targetFilter, setTargetFilter] = useState<'all' | 'left' | 'right'>(
    initialTargetFilter
  );
  const [debugMode, setDebugMode] = useState<boolean>(initialDebug);
  const [kenBurnsOn, setKenBurnsOn] = useState<boolean>(initialKenBurns);
  const [editorEnabled, setEditorEnabled] = useState<boolean>(true);
  const [autoAnimateDemo, setAutoAnimateDemo] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // Build mutable dictionary of hotspots per imageId for live calibration
  const [customHotspotsMap, setCustomHotspotsMap] = useState<
    Record<string, CalibratedHotspot[]>
  >(() => {
    const initial: Record<string, CalibratedHotspot[]> = {
      ...CALIBRATED_IMAGE_HOTSPOTS,
    };
    for (const lvl of STORY_LEVELS) {
      const s5Key = `${lvl.id}_S5`;
      if (!initial[s5Key]) {
        initial[s5Key] = getLookHotspotsForImage(s5Key, lvl.sceneVisual.hotspots);
      }
      const oa2Key = `${lvl.id}_OA2`;
      if (!initial[oa2Key] && lvl.severity === 'severe') {
        initial[oa2Key] = getHandTargetsForImage(oa2Key);
      }
    }
    return initial;
  });

  const manifestEntry = useMemo(
    () => getManifestEntry(selectedImageId),
    [selectedImageId]
  );

  const imageHotspots = useMemo(() => {
    const list = customHotspotsMap[selectedImageId] || [];
    if (targetFilter === 'left') {
      return list.filter((h) => h.panel === 'left');
    }
    if (targetFilter === 'right') {
      return list.filter((h) => h.panel === 'right');
    }
    return list;
  }, [customHotspotsMap, selectedImageId, targetFilter]);

  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(
    () => imageHotspots[0]?.id ?? null
  );

  const activeSelectedHotspot = useMemo(() => {
    return (
      imageHotspots.find((h) => h.id === selectedHotspotId) ??
      imageHotspots[0] ??
      null
    );
  }, [imageHotspots, selectedHotspotId]);

  // Separate Look rings vs Active Hand Target when viewing OA2 left/right panel
  const isSingleHandTargetView =
    selectedImageId.endsWith('_OA2') &&
    (targetFilter === 'left' || targetFilter === 'right') &&
    imageHotspots.length === 1;

  const handleUpdateHotspotCoords = (
    hotspotId: string,
    newX: number,
    newY: number
  ) => {
    setCustomHotspotsMap((prev) => {
      const list = prev[selectedImageId] || [];
      return {
        ...prev,
        [selectedImageId]: list.map((h) =>
          h.id === hotspotId ? { ...h, x: newX, y: newY } : h
        ),
      };
    });
  };

  const handleUpdateHotspotRadius = (hotspotId: string, newR: number) => {
    setCustomHotspotsMap((prev) => {
      const list = prev[selectedImageId] || [];
      return {
        ...prev,
        [selectedImageId]: list.map((h) =>
          h.id === hotspotId ? { ...h, r: newR } : h
        ),
      };
    });
  };

  const validations = useMemo(() => {
    return imageHotspots.map((hs) => validateCalibratedHotspot(hs));
  }, [imageHotspots]);

  const allPassed = validations.every((v) => v.passed);

  const handleCopyJson = () => {
    const payload = JSON.stringify(imageHotspots, null, 2);
    navigator.clipboard?.writeText(payload);
    setCopiedJson(true);
    window.setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#071F2E] text-[#F3F7F8] p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B2D40] border border-[#285064] rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <a
              href="/qa"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#123B50] border border-[#285064] text-xs font-bold text-[#F3F7F8] hover:border-[#13B8B0]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>/qa</span>
            </a>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-[#F3F7F8] flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-[#13B8B0]" />
                <span>NAFAS Hotspot & Composite Target Calibration (/qa/hotspots)</span>
              </h1>
              <p className="text-xs text-[#A9C0CC]">
                Shared SVG ViewBox ({manifestEntry.width}×{manifestEntry.height}) •
                Normalized 0–1 Coordinates • Click-to-place & Drag-to-adjust
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              data-testid="qa-overall-status"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border ${
                allPassed
                  ? 'bg-[#16A36A]/20 border-[#16A36A] text-[#16A36A]'
                  : 'bg-[#DC5252]/20 border-[#DC5252] text-[#DC5252]'
              }`}
            >
              {allPassed ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span>
                {allPassed
                  ? `ALL ${validations.length} HOTSPOTS PASS`
                  : 'HOTSPOT OUT OF BOUNDS'}
              </span>
            </span>

            <button
              type="button"
              onClick={() => setDebugMode((d) => !d)}
              data-testid="toggle-debug-btn"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-colors ${
                debugMode
                  ? 'bg-[#E9A23B] text-[#071F2E] border-[#E9A23B]'
                  : 'bg-[#123B50] text-[#A9C0CC] border-[#285064]'
              }`}
            >
              <Bug className="w-3.5 h-3.5" />
              <span>?debug=hotspots: {debugMode ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => setKenBurnsOn((k) => !k)}
              data-testid="toggle-kenburns-btn"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-colors ${
                kenBurnsOn
                  ? 'bg-[#43C7D1] text-[#071F2E] border-[#43C7D1]'
                  : 'bg-[#123B50] text-[#A9C0CC] border-[#285064]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ken Burns: {kenBurnsOn ? 'ON' : 'OFF (Locked 1.0)'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] text-xs font-extrabold"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedJson ? 'Copied JSON!' : 'Copy JSON'}</span>
            </button>
          </div>
        </div>

        {/* Quick Preset Bar for All 10 Levels + All 102 Images Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B2D40] border border-[#285064] rounded-2xl p-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-extrabold text-[#43C7D1] me-1">
              S5 Look Rings (All 10):
            </span>
            {(['A1', 'A2', 'A3', 'A4', 'C1', 'C2', 'C3', 'I1', 'I2', 'I3'] as const).map(
              (lvlId) => {
                const imgId = `${lvlId}_S5`;
                const firstHs = CALIBRATED_IMAGE_HOTSPOTS[imgId]?.[0]?.id ?? null;
                return (
                  <button
                    key={imgId}
                    type="button"
                    onClick={() => {
                      setSelectedImageId(imgId);
                      setTargetFilter('all');
                      setSelectedHotspotId(firstHs);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border cursor-pointer ${
                      selectedImageId === imgId
                        ? 'bg-[#13B8B0] text-[#071F2E] border-[#13B8B0]'
                        : 'bg-[#123B50] text-[#F3F7F8] border-[#285064]'
                    }`}
                  >
                    {imgId}
                  </button>
                );
              }
            )}
            <span className="text-xs font-extrabold text-[#E9A23B] ms-2 me-1">
              OA2 Hand Targets:
            </span>
            {(['A2', 'A4', 'C1', 'I1'] as const).map((lvlId) => {
              const imgId = `${lvlId}_OA2`;
              const hsList = CALIBRATED_IMAGE_HOTSPOTS[imgId] || [];
              return (
                <React.Fragment key={imgId}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImageId(imgId);
                      setTargetFilter('left');
                      setSelectedHotspotId(
                        hsList.find((h) => h.panel === 'left')?.id ?? null
                      );
                      setAutoAnimateDemo(false);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border cursor-pointer ${
                      selectedImageId === imgId && targetFilter === 'left'
                        ? 'bg-[#13B8B0] text-[#071F2E] border-[#13B8B0]'
                        : 'bg-[#123B50] text-[#F3F7F8] border-[#285064]'
                    }`}
                  >
                    {lvlId}_OA2 (L)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImageId(imgId);
                      setTargetFilter('right');
                      setSelectedHotspotId(
                        hsList.find((h) => h.panel === 'right')?.id ?? null
                      );
                      setAutoAnimateDemo(false);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border cursor-pointer ${
                      selectedImageId === imgId && targetFilter === 'right'
                        ? 'bg-[#13B8B0] text-[#071F2E] border-[#13B8B0]'
                        : 'bg-[#123B50] text-[#F3F7F8] border-[#285064]'
                    }`}
                  >
                    {lvlId}_OA2 (R)
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-[#A9C0CC]">
              Any Image (102):
            </label>
            <select
              value={selectedImageId}
              onChange={(e) => {
                setSelectedImageId(e.target.value);
                setTargetFilter('all');
              }}
              className="bg-[#071F2E] border border-[#285064] rounded-xl px-3 py-1.5 text-xs font-bold text-[#F3F7F8]"
            >
              {IMAGE_MANIFEST_LIST.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.id} ({entry.width}×{entry.height})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Split Layout: Left = SharedSceneCanvas (exact player component), Right = Readout & Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-8 space-y-3">
            <SharedSceneCanvas
              imageId={selectedImageId}
              imageSrc={manifestEntry.src}
              imageAlt={`${selectedImageId} calibration canvas`}
              language="ar"
              hotspots={isSingleHandTargetView ? [] : imageHotspots}
              highlightedId={activeSelectedHotspot?.id ?? null}
              onSelectHotspot={(hs) => setSelectedHotspotId(hs.id)}
              activeHandTarget={
                isSingleHandTargetView ? imageHotspots[0] : null
              }
              autoAnimateHandToTarget={autoAnimateDemo}
              onHandTargetReached={() => setAutoAnimateDemo(false)}
              enableKenBurns={kenBurnsOn}
              cameraPushLocked={!kenBurnsOn}
              debugMode={debugMode}
              editorMode={editorEnabled && !isSingleHandTargetView}
              selectedEditorHotspotId={activeSelectedHotspot?.id ?? null}
              onEditorUpdateHotspot={handleUpdateHotspotCoords}
            />

            {isSingleHandTargetView && (
              <div className="rounded-2xl bg-[#0B2D40] border border-[#285064] p-3.5 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#A9C0CC]">
                  Interactive Hand-Placement Demo ({imageHotspots[0].id} • Panel:{' '}
                  {imageHotspots[0].panel})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAutoAnimateDemo(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#13B8B0] text-[#071F2E] text-xs font-extrabold"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Test &quot;Do it for me&quot; Marker Animation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAutoAnimateDemo(false);
                      setTargetFilter((f) => f);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#123B50] text-xs font-bold text-[#F3F7F8]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Marker</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Coordinate Readout & Validation Table */}
          <div className="lg:col-span-4 space-y-3">
            <div className="rounded-2xl bg-[#0B2D40] border border-[#285064] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-[#43C7D1]">
                  Hotspot Readout ({selectedImageId})
                </h2>
                <label className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A9C0CC]">
                  <input
                    type="checkbox"
                    checked={editorEnabled}
                    onChange={(e) => setEditorEnabled(e.target.checked)}
                    className="accent-[#13B8B0]"
                  />
                  <span>Click/Drag Edit</span>
                </label>
              </div>

              <div className="space-y-2.5">
                {imageHotspots.map((hs) => {
                  const v = validateCalibratedHotspot(hs);
                  const vb = normToViewBox(
                    hs.x,
                    hs.y,
                    hs.r,
                    manifestEntry.width,
                    manifestEntry.height
                  );
                  const isSel = activeSelectedHotspot?.id === hs.id;

                  return (
                    <div
                      key={hs.id}
                      data-testid={`qa-readout-card-${hs.id}`}
                      onClick={() => setSelectedHotspotId(hs.id)}
                      className={`rounded-xl p-3 border transition-all cursor-pointer space-y-2 ${
                        isSel
                          ? 'bg-[#123B50] border-[#13B8B0]'
                          : 'bg-[#071F2E] border-[#285064]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold font-mono text-[#F3F7F8]">
                          {hs.id} ({hs.region})
                        </span>
                        <span
                          data-testid={`qa-status-${hs.id}`}
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            v.passed
                              ? 'bg-[#16A36A]/20 text-[#16A36A]'
                              : 'bg-[#DC5252]/20 text-[#DC5252]'
                          }`}
                        >
                          {v.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#A9C0CC]">
                        {hs.label.ar} • {hs.label.en}
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
                        <div className="bg-[#0B2D40] rounded p-1.5 border border-[#285064]">
                          <span className="text-[#A9C0CC] block text-[9px]">
                            x (0–1)
                          </span>
                          <input
                            type="number"
                            step="0.005"
                            min="0"
                            max="1"
                            value={hs.x}
                            onChange={(e) =>
                              handleUpdateHotspotCoords(
                                hs.id,
                                parseFloat(e.target.value) || 0,
                                hs.y
                              )
                            }
                            className="w-full bg-transparent text-[#43C7D1] font-bold focus:outline-none"
                          />
                        </div>
                        <div className="bg-[#0B2D40] rounded p-1.5 border border-[#285064]">
                          <span className="text-[#A9C0CC] block text-[9px]">
                            y (0–1)
                          </span>
                          <input
                            type="number"
                            step="0.005"
                            min="0"
                            max="1"
                            value={hs.y}
                            onChange={(e) =>
                              handleUpdateHotspotCoords(
                                hs.id,
                                hs.x,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full bg-transparent text-[#43C7D1] font-bold focus:outline-none"
                          />
                        </div>
                        <div className="bg-[#0B2D40] rounded p-1.5 border border-[#285064]">
                          <span className="text-[#A9C0CC] block text-[9px]">
                            r (0–1)
                          </span>
                          <input
                            type="number"
                            step="0.002"
                            min="0.01"
                            max="0.15"
                            value={hs.r}
                            onChange={(e) =>
                              handleUpdateHotspotRadius(
                                hs.id,
                                parseFloat(e.target.value) || 0.03
                              )
                            }
                            className="w-full bg-transparent text-[#13B8B0] font-bold focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="text-[10px] font-mono text-[#A9C0CC] flex flex-wrap items-center justify-between gap-1 pt-1 border-t border-[#285064]/60">
                        <span>
                          viewBox: ({vb.cx}px, {vb.cy}px, r={vb.r}px)
                        </span>
                        <span>
                          box: [{hs.expectedBox.xMin}..{hs.expectedBox.xMax},{' '}
                          {hs.expectedBox.yMin}..{hs.expectedBox.yMax}]
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Raw JSON Preview */}
            <div className="rounded-2xl bg-[#0B2D40] border border-[#285064] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#A9C0CC]">
                  Live JSON Output
                </span>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="text-xs font-bold text-[#13B8B0] hover:underline"
                >
                  {copiedJson ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="text-[10px] font-mono text-[#43C7D1] bg-[#071F2E] border border-[#285064] rounded-xl p-3 max-h-56 overflow-auto">
                {JSON.stringify(imageHotspots, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
