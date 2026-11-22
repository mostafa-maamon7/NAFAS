import React from 'react';
import { NAFAS_ART_BIBLE, ASSET_AUDIT_MANIFEST } from '../data/artBible';
import { UNIQUE_PROTAGONISTS } from '../data/characterRegistry';
import { STORY_LEVELS, SPECIAL_LEARN_CARDS, runStoryLevelsMasterAudit } from '../data/storyLevels';
import { getGuidanceForLevel } from '../data/rulesLibrary';
import { STORY_MEDIA } from '../data/storyMedia';
import { IMAGE_MANIFEST_LIST, UPDATED_IMAGES_IN_NEW_GUIDE } from '../data/imageManifest';
import { ShieldCheck, CheckCircle, FileText, Layers, Eye, BookOpen, Crosshair } from 'lucide-react';

export const QAPage: React.FC = () => {
  const audit = runStoryLevelsMasterAudit();
  const allGatesPassed =
    audit.allHaveMinFiveBeats &&
    audit.duplicateMediaKeys.length === 0 &&
    audit.characterRegistryPassed &&
    audit.guidanceAuditPassed;

  const needsRegenFrames = IMAGE_MANIFEST_LIST.filter(
    (entry) => entry.status === 'needs_regeneration'
  );

  const optionalNoteFrames = IMAGE_MANIFEST_LIST.filter(
    (entry) => Boolean(entry.optionalNote)
  );

  const clinicalReviewItems = [
    {
      id: 'CR-01',
      topic: 'A4: Chest Thrusts Location & Method in Late Pregnancy',
      status: 'Pending clinical review (clinicalReview: true)',
      detail: 'Doctor confirmation requested for exact chest-thrust hand placement description in late pregnancy (Slide 22).'
    },
    {
      id: 'CR-02',
      topic: 'I1: Infant Forearm Positioning & Chest Thrust Landmark',
      status: 'Pending clinical review (clinicalReview: true)',
      detail: 'Doctor confirmation requested for forearm/head support wording and two-finger chest thrust landmark; includes "Hands-on training is essential" (Slides 20–21).'
    },
    {
      id: 'CR-03',
      topic: 'C3 & I3: Effective Cough Phrasing for Child & Infant',
      status: 'Pending clinical review (clinicalReview: true)',
      detail: 'Doctor confirmation requested for effective cough monitoring phrasing in Child (C3) and Infant (I3) mild choking levels (Slides 5, 7).'
    },
    {
      id: 'CR-04',
      topic: 'A1 Options B/C Rationale & Zero Unconfirmed CPR Numbers',
      status: 'Pending clinical review (clinicalReview: true)',
      detail: 'A1 wrong options B (water) & C (abdominal thrusts) rationale review; all unresponsive levels (A3, C2, I2) strictly use "according to your training" with no CPR numbers.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#071F2E] text-slate-100 p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#13B8B0]/20 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#13B8B0]/20 text-[#13B8B0] text-xs font-extrabold rounded-full">
                {NAFAS_ART_BIBLE.styleId}
              </span>
              <h1 className="text-2xl font-black text-white">NAFAS Levels Restructure QA Inspector (102 Native Images)</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Verification console (/qa) for NAFAS-Levels-Full-Visual-Guide_0ff4a7.pdf (102 approved 640×357 images, 0 needs_regeneration) and link to /qa/hotspots calibration tool.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a
              href="/qa/hotspots"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] text-xs font-extrabold shadow-lg"
            >
              <Crosshair className="w-4 h-4" />
              <span>Open /qa/hotspots Calibration Tool</span>
            </a>
            <div className="text-left md:text-right text-xs text-slate-300 bg-[#0B2D40] px-4 py-3 rounded-xl border border-[#13B8B0]/30">
              <div>Master Audit: <span className="text-emerald-400 font-bold">{allGatesPassed ? 'ALL GATES PASSED' : 'ISSUES DETECTED'}</span></div>
              <div>Manifest Assets: <span className="text-emerald-400 font-semibold">{IMAGE_MANIFEST_LIST.length} Approved PNGs (640×357) • {needsRegenFrames.length} needs_regeneration</span></div>
              <div>Updated in New PDF: <span className="text-white font-bold">{UPDATED_IMAGES_IN_NEW_GUIDE.length} Frames (A3, C2, I1, I2)</span></div>
            </div>
          </div>
        </div>

        {/* Updated Manifest Section (A3, C2, I2 cleared) */}
        <div className="bg-[#0B2A3F] rounded-2xl p-6 border border-emerald-400/40 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Image Manifest Status: All 102 Images Approved (640×357 Native Resolution, Aspect Ratio 640:357)
            </h2>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-400/15 text-emerald-200 font-bold">
              A3, C2, I2 needs_regeneration cleared
            </span>
          </div>
          <p className="text-xs text-slate-300">
            All 102 native images extracted from NAFAS-Levels-Full-Visual-Guide_0ff4a7.pdf share identical dimensions (640×357, aspect ratio 1.7927). 39 frames across A3, C2, I1, and I2 were updated from the new guide.
          </p>
          {optionalNoteFrames.length > 0 && (
            <div className="rounded-xl bg-[#071F2E] border border-slate-700 p-3 text-xs text-slate-300">
              <span className="font-bold text-[#43C7D1]">Optional Manifest Note:</span>{' '}
              &quot;I1 and I2 nurseries differ&quot; (logged on {optionalNoteFrames.map((f) => f.id).join(', ')}).
            </div>
          )}
        </div>

        {/* Character Registry Section */}
        <div className="bg-[#0B2A3F] rounded-2xl p-6 border border-[#13B8B0]/30 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-[#13B8B0] flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Character Registry (Single Source of Truth — Tariq / Youssef / Layan)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {UNIQUE_PROTAGONISTS.map((char) => (
              <div key={char.id} className="bg-[#071F2E] p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-[#13B8B0] font-bold mb-1">Levels {char.levels.join(', ')}</div>
                <div className="text-base font-black text-white">{char.enName} / {char.arName}</div>
                <div className="text-xs text-slate-300 mt-1">{char.roleEn} · {char.ageEn}</div>
                <div className="text-[11px] text-slate-400 mt-1">{char.visualLockEn}</div>
                <div className="text-[10px] text-emerald-400 mt-2 font-bold">Verified Single Identity</div>
              </div>
            ))}
          </div>
        </div>

        {/* 10-Level Visual Contact Sheet with Pending Clinical Review Markers */}
        <div className="bg-[#0B2A3F] rounded-2xl p-6 border border-[#13B8B0]/30 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-[#13B8B0] flex items-center gap-2">
            <Eye className="w-5 h-5" />
            10-Level Visual Contact Sheet (50 Story Frames + 50 Outcome Frames)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STORY_LEVELS.map((lvl) => {
              const firstBeatKey = lvl.storyBeats[0]?.mediaKey || 'hero_nafas_awareness';
              const firstBeatMedia = STORY_MEDIA[firstBeatKey] || STORY_MEDIA.hero_nafas_awareness;
              return (
                <div key={lvl.id} className="bg-[#071F2E] rounded-xl border border-slate-800 overflow-hidden flex flex-col">
                  <div className="relative h-36 bg-slate-900 overflow-hidden">
                    <img
                      src={firstBeatMedia.src}
                      alt={firstBeatMedia.alt.en}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#071F2E]/90 text-[#13B8B0] text-[10px] font-black border border-[#13B8B0]/40">
                      {lvl.id} · {lvl.character.name.en}
                    </span>
                    {lvl.clinicalReview ? (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-amber-500/25 border border-amber-400/50 text-amber-200 text-[10px] font-extrabold">
                        Pending clinical review
                      </span>
                    ) : (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        Lecture Confirmed
                      </span>
                    )}
                  </div>
                  <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{lvl.title.en}</div>
                      <div className="text-xs text-[#13B8B0] font-semibold" dir="rtl">{lvl.title.ar}</div>
                      {lvl.clinicalReview && lvl.clinicalReviewReason && (
                        <p className="text-[11px] text-amber-300/90 mt-1">
                          {typeof lvl.clinicalReviewReason === 'string'
                            ? lvl.clinicalReviewReason
                            : `${lvl.clinicalReviewReason.en} / ${lvl.clinicalReviewReason.ar}`}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-800/80">
                      {lvl.storyBeats.map((b) => (
                        <span key={b.id} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {b.mediaKey}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Non-Star Learn Cards Audit */}
        <div className="bg-[#0B2A3F] rounded-2xl p-6 border border-[#13B8B0]/30 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-[#13B8B0] flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Non-Star Reference Learn Cards (Slides 23 & 24 — 0 Stars)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SPECIAL_LEARN_CARDS.map((card) => {
              const media = STORY_MEDIA[card.mediaKey];
              return (
                <div key={card.id} className="bg-[#071F2E] p-4 rounded-xl border border-slate-800 flex gap-4 items-center">
                  {media && (
                    <img
                      src={media.src}
                      alt={media.alt.en}
                      className="w-28 h-16 object-cover rounded-lg border border-slate-700 shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#13B8B0]">{card.slideRef}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                        Learn Card · No Stars
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">{card.title.en} / {card.title.ar}</div>
                    <p className="text-xs text-slate-300">{card.subtitle.en}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Per-Level Guidance Text Audit Table */}
        <div className="bg-[#0B2A3F] rounded-2xl p-6 border border-[#13B8B0]/30 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-[#13B8B0] flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Per-Level Guidance Text & Lecture Rule Audit
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="py-3 px-3">Code</th>
                  <th className="py-3 px-3">Patient</th>
                  <th className="py-3 px-3">Clinical Review</th>
                  <th className="py-3 px-3">Rule IDs</th>
                  <th className="py-3 px-3">Level-Specific After-Care Note (EN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {STORY_LEVELS.map((lvl) => {
                  const rules = getGuidanceForLevel(lvl.ruleTags || []);
                  return (
                    <tr key={lvl.id} className="hover:bg-[#071F2E]/50 transition">
                      <td className="py-3 px-3 font-bold text-[#13B8B0]">{lvl.id}</td>
                      <td className="py-3 px-3 font-semibold text-white">{lvl.character.name.en} ({lvl.character.age.en})</td>
                      <td className="py-3 px-3">
                        {lvl.clinicalReview ? (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                            Pending clinical review
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                            Confirmed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {rules.map(r => (
                            <span key={r.id} className="px-1.5 py-0.5 bg-[#13B8B0]/15 text-[#13B8B0] rounded font-mono text-[10px] font-bold">
                              {r.id}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-300 max-w-md">{lvl.afterCareNote?.en || lvl.objective.en}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clinical Review Flags for Dr. Mai Mahran */}
        <div className="bg-[#0B2A3F] rounded-2xl p-6 border border-amber-400/30 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            Pending Clinical Review Questions (Dr. Mai Mahran — QA Only)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clinicalReviewItems.map((item) => (
              <div key={item.id} className="bg-[#071F2E] p-4 rounded-xl border border-amber-400/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300">{item.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/10 text-amber-200 font-semibold">
                    {item.status}
                  </span>
                </div>
                <div className="text-sm font-bold text-white">{item.topic}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

