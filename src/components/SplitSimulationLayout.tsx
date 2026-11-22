import React, { useState } from 'react';
import { Activity, Wind, AlertTriangle, Eye, ShieldCheck, ChevronRight, Volume2, VolumeX, Info, HelpCircle } from 'lucide-react';

interface Hotspot {
  id: string;
  xPct: number;
  yPct: number;
  label: { en: string; ar: string };
  finding: { en: string; ar: string };
  severity: 'normal' | 'warning' | 'critical';
}

interface SplitSimulationLayoutProps {
  levelTitle: { en: string; ar: string };
  levelCode: string;
  ageCategory: string;
  patientName: { en: string; ar: string };
  currentBeatIndex: number;
  totalBeats: number;
  currentCaption: { en: string; ar: string };
  ambientNote: { en: string; ar: string };
  spo2: number;
  heartRate: number;
  airwayMode: string;
  hotspots: Hotspot[];
  onHotspotSelect: (hotspot: Hotspot) => void;
  selectedHotspotId?: string;
  renderSceneCanvas: (hoveredHotspotId?: string) => React.ReactNode;
  onNextBeat?: () => void;
  onPrevBeat?: () => void;
  isRtl?: boolean;
}

export const SplitSimulationLayout: React.FC<SplitSimulationLayoutProps> = ({
  levelTitle,
  levelCode,
  ageCategory,
  patientName,
  currentBeatIndex,
  totalBeats,
  currentCaption,
  ambientNote,
  spo2,
  heartRate,
  airwayMode,
  hotspots,
  onHotspotSelect,
  selectedHotspotId,
  renderSceneCanvas,
  onNextBeat,
  onPrevBeat,
  isRtl = true
}) => {
  const [activeTab, setActiveTab] = useState<'symptoms' | 'airway' | 'explanation'>('symptoms');
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);
  const [showXrayLens, setShowXrayLens] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-full w-full bg-[#071F2E] text-slate-100 overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#0B2A3F] border-b border-[#13B8B0]/20 shrink-0">
        <div className="flex items-center space-x-3 space-x-reverse">
          <span className="px-3 py-1 bg-[#13B8B0]/20 text-[#13B8B0] text-xs font-bold rounded-full">
            {levelCode}
          </span>
          <h2 className="text-base font-bold text-white">
            {isRtl ? levelTitle.ar : levelTitle.en}
          </h2>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse text-sm text-slate-300">
          <span>{isRtl ? patientName.ar : patientName.en}</span>
          <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">
            {isRtl ? 'المشهد' : 'Beat'} {currentBeatIndex + 1} / {totalBeats}
          </span>
        </div>
      </div>

      {/* Main Split Body: Scene Frame vs Info Rail */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
        
        {/* SCENE FRAME (Desktop: col-span-7, Mobile: order-1) */}
        <div className="lg:col-span-7 flex flex-col relative bg-[#040E16] border-r border-[#13B8B0]/15 overflow-hidden">
          <div className="absolute top-3 left-3 z-10 bg-[#071F2E]/80 backdrop-blur px-3 py-1 rounded-md border border-[#13B8B0]/30 text-xs text-[#13B8B0] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#13B8B0] animate-pulse"></span>
            {isRtl ? 'إطار المشهد النقي (بدون تداخل UI)' : 'Pure Scene Frame (Zero UI Overlay)'}
          </div>

          <div className="flex-1 relative flex items-center justify-center p-4">
            {showXrayLens ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#030910] rounded-xl border border-[#13B8B0]/40 p-6 text-center">
                <Wind className="w-16 h-16 text-[#13B8B0] mb-4 animate-pulse" />
                <h4 className="text-lg font-bold text-white mb-2">
                  {isRtl ? 'منظار مجرى التنفس الشعاعي (X-Ray)' : 'Airway X-Ray Lens'}
                </h4>
                <p className="text-sm text-slate-300 max-w-md mb-6">
                  {isRtl ? 'عرض تفصيلي للانسداد والضغط الهوائي داخل القصبة الهوائية.' : 'Detailed view of tracheal obstruction and airflow pressure.'}
                </p>
                <button 
                  onClick={() => setShowXrayLens(false)}
                  className="px-4 py-2 bg-[#13B8B0] text-[#071F2E] font-bold rounded-lg text-sm hover:bg-[#43C7D1] transition"
                >
                  {isRtl ? 'العودة للمشهد العادي' : 'Return to Scene'}
                </button>
              </div>
            ) : (
              <div className="w-full h-full max-h-[600px] relative rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
                {renderSceneCanvas(hoveredHotspotId || selectedHotspotId)}
              </div>
            )}
          </div>

          {/* Bottom scene controls / caption strip */}
          <div className="px-6 py-3 bg-[#0B2A3F]/90 border-t border-[#13B8B0]/20 flex items-center justify-between shrink-0">
            <p className="text-sm text-slate-200 line-clamp-2 max-w-xl">
              {isRtl ? currentCaption.ar : currentCaption.en}
            </p>
            <div className="flex items-center gap-2">
              {onPrevBeat && (
                <button 
                  onClick={onPrevBeat}
                  disabled={currentBeatIndex === 0}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded text-xs font-semibold text-white transition"
                >
                  {isRtl ? 'السابق' : 'Prev'}
                </button>
              )}
              {onNextBeat && (
                <button 
                  onClick={onNextBeat}
                  disabled={currentBeatIndex === totalBeats - 1}
                  className="px-3 py-1.5 bg-[#13B8B0] hover:bg-[#43C7D1] disabled:opacity-40 rounded text-xs font-bold text-[#071F2E] transition"
                >
                  {isRtl ? 'التالي' : 'Next'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* INFO RAIL (Desktop: col-span-5, Mobile: order-2) */}
        <div className="lg:col-span-5 flex flex-col bg-[#071F2E] overflow-y-auto border-t lg:border-t-0 border-[#13B8B0]/20">
          {/* Info Rail Tabs */}
          <div className="flex border-b border-[#13B8B0]/20 bg-[#0B2A3F]">
            <button
              onClick={() => setActiveTab('symptoms')}
              className={`flex-1 py-3 px-4 text-xs font-bold text-center border-b-2 transition ${
                activeTab === 'symptoms' 
                  ? 'border-[#13B8B0] text-[#13B8B0] bg-[#071F2E]/50' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {isRtl ? 'الأعراض والعلامات' : 'Symptoms & Vitals'}
            </button>
            <button
              onClick={() => setActiveTab('airway')}
              className={`flex-1 py-3 px-4 text-xs font-bold text-center border-b-2 transition ${
                activeTab === 'airway' 
                  ? 'border-[#13B8B0] text-[#13B8B0] bg-[#071F2E]/50' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {isRtl ? 'منظار القصبة والهواء' : 'Airway Lens'}
            </button>
            <button
              onClick={() => setActiveTab('explanation')}
              className={`flex-1 py-3 px-4 text-xs font-bold text-center border-b-2 transition ${
                activeTab === 'explanation' 
                  ? 'border-[#13B8B0] text-[#13B8B0] bg-[#071F2E]/50' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {isRtl ? 'التوجيه الطبي' : 'Clinical Guide'}
            </button>
          </div>

          {/* Info Rail Content */}
          <div className="p-6 flex-1 space-y-6">
            
            {/* Vitals Summary Card */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0B2A3F] p-4 rounded-xl border border-[#13B8B0]/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">{isRtl ? 'مستوى الأكسجين' : 'Oxygen Level'}</span>
                  <Activity className="w-4 h-4 text-[#13B8B0]" />
                </div>
                <div className="text-2xl font-extrabold text-white">{spo2}%</div>
                <div className="text-[10px] text-emerald-400 mt-1">{isRtl ? 'مؤشر حيوي مستقر' : 'Stable Vitals'}</div>
              </div>

              <div className="bg-[#0B2A3F] p-4 rounded-xl border border-[#13B8B0]/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">{isRtl ? 'نبضات القلب' : 'Heart Rate'}</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold text-white">{heartRate} <span className="text-xs font-normal text-slate-400">BPM</span></div>
                <div className="text-[10px] text-amber-400 mt-1">{isRtl ? 'استجابة إجهاد' : 'Stress Response'}</div>
              </div>
            </div>

            {activeTab === 'symptoms' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#13B8B0] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  {isRtl ? 'نقاط الفحص والعلامات السريرية' : 'Clinical Finding Chips'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isRtl ? 'انقر على أي عارض أدناه لتسليط الضوء على نقطة الفحص المطابقة في إطار المشهد:' : 'Click any symptom chip below to highlight its matching ring in the scene frame:'}
                </p>

                <div className="space-y-3">
                  {hotspots.map((hs) => (
                    <div
                      key={hs.id}
                      onMouseEnter={() => setHoveredHotspotId(hs.id)}
                      onMouseLeave={() => setHoveredHotspotId(null)}
                      onClick={() => onHotspotSelect(hs)}
                      className={`p-4 rounded-xl border transition cursor-pointer ${
                        selectedHotspotId === hs.id || hoveredHotspotId === hs.id
                          ? 'bg-[#13B8B0]/20 border-[#13B8B0]'
                          : 'bg-[#0B2A3F]/60 border-[#13B8B0]/20 hover:border-[#13B8B0]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">
                          {isRtl ? hs.label.ar : hs.label.en}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          hs.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          hs.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {hs.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {isRtl ? hs.finding.ar : hs.finding.en}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'airway' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#13B8B0] flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  {isRtl ? 'منظار القصبة الهوائية الداخلي' : 'Airway & Trachea Lens'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isRtl ? 'حالة مجرى التنفس الحالي وموقع الجسم الغريب:' : 'Current airway status and foreign body location:'}
                </p>

                <div className="p-5 bg-[#0B2A3F] rounded-xl border border-[#13B8B0]/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-semibold">{isRtl ? 'حالة مجرى الهواء' : 'Airway Status'}</span>
                    <span className="text-xs font-bold text-[#13B8B0]">{airwayMode}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#13B8B0] h-full" style={{ width: `${spo2}%` }}></div>
                  </div>
                  <button
                    onClick={() => setShowXrayLens(true)}
                    className="w-full py-2.5 bg-[#13B8B0]/20 hover:bg-[#13B8B0]/30 text-[#13B8B0] border border-[#13B8B0]/50 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {isRtl ? 'فتح عرض المنظار الكامل' : 'Open Full X-Ray View'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'explanation' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#13B8B0] flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {isRtl ? 'الإرشادات الطبية المعتمدة' : 'Verified Clinical Guidance'}
                </h3>
                <div className="p-4 bg-[#0B2A3F] rounded-xl border border-[#13B8B0]/20 text-xs text-slate-300 leading-relaxed space-y-3">
                  <p>
                    {isRtl 
                      ? 'وفقاً لإرشادات هيئات الإنعاش المعتمدة (Resuscitation Council UK 2025 & American Red Cross)، يجب تقييم حالة الاختناق بدقة قبل الشروع بأي مناورات جسدية.'
                      : 'According to international resuscitation guidelines (Resuscitation Council UK 2025 & American Red Cross), evaluate choking severity carefully before physical intervention.'}
                  </p>
                  <p className="text-[#13B8B0] font-semibold">
                    {isRtl ? ambientNote.ar : ambientNote.en}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
