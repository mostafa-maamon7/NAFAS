import React from 'react';
import { ArrowLeft, Music, Volume2, ShieldCheck, ExternalLink } from 'lucide-react';
import { useNafas } from '../context/NafasContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import {
  AUDIO_MANIFEST,
  AMBIENCE_ASSETS,
  MUSIC_TRACKS,
  SFX_ASSETS,
} from '../data/audioManifest';

export const CreditsPage: React.FC = () => {
  const { language } = useNafas();
  const isAr = language === 'ar';

  const readyCount = AUDIO_MANIFEST.filter((a) => a.status === 'ready').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#071F2E] text-[#F3F7F8]">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#285064] pb-6">
          <div className="space-y-2">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#43C7D1] hover:text-[#5CE2EA] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
            </a>
            <h1
              data-testid="credits-page-heading"
              className="text-2xl sm:text-3xl font-extrabold text-[#F3F7F8]"
            >
              {isAr ? 'حقوق الموسيقى والمؤثرات الصوتية' : 'Audio & Music Credits'}
            </h1>
            <p className="text-sm text-[#A9C0CC] max-w-2xl">
              {isAr
                ? 'تستخدم منصة نَفَس تسجيلات موسيقية ومؤثرات صوتية حقيقية مرخّصة ومستضافة محليًا بالكامل بدون أي نغمات إلكترونية مصطنعة.'
                : 'NAFAS uses real licensed instrumental recordings and sound effects, self-hosted locally with full attribution.'}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0B2D40] border border-[#13B8B0]/40 text-xs font-bold text-[#43C7D1]">
            <ShieldCheck className="w-4 h-4 text-[#13B8B0]" />
            <span>
              {isAr
                ? `${readyCount} ملف صوتي مرخّص`
                : `${readyCount} Licensed Audio Assets`}
            </span>
          </div>
        </div>

        {/* Section 1: Music Tracks (CC BY 4.0) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Music className="w-5 h-5 text-[#13B8B0]" />
            <h2 className="text-lg sm:text-xl font-extrabold text-[#F3F7F8]">
              {isAr ? 'الموسيقى الخلفية (CC BY 4.0)' : 'Background Music (CC BY 4.0)'}
            </h2>
          </div>

          <div
            data-testid="credits-music-list"
            className="grid grid-cols-1 md:grid-cols-2 gap-3.5"
          >
            {MUSIC_TRACKS.map((track) => (
              <article
                key={track.id}
                className="rounded-2xl bg-[#0B2D40] border border-[#285064] p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#F3F7F8]">
                      {track.title}
                    </h3>
                    <p className="text-xs text-[#43C7D1] font-medium">
                      {track.author}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-[#123B50] border border-[#13B8B0]/40 text-[11px] font-bold text-[#5CE2EA] shrink-0">
                    {track.license}
                  </span>
                </div>
                <p className="text-xs text-[#B8CDD7] leading-relaxed" dir="ltr">
                  {track.attribution}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-[#A9C0CC]">
                  <span>
                    {isAr ? 'الاستخدام:' : 'Used in:'}{' '}
                    <strong className="text-[#F3F7F8]">
                      {track.mood} · {track.levelMapping.join(', ')}
                    </strong>
                  </span>
                  {track.sourceUrl && (
                    <a
                      href={track.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#43C7D1] hover:underline"
                    >
                      <span>Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Section 2: Location Ambience */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-5 h-5 text-[#43C7D1]" />
            <h2 className="text-lg sm:text-xl font-extrabold text-[#F3F7F8]">
              {isAr ? 'الأجواء المحيطة للمشاهد' : 'Location Ambience Loops'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AMBIENCE_ASSETS.map((item) => (
              <article
                key={item.id}
                className="rounded-xl bg-[#0B2D40] border border-[#285064] p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-extrabold text-[#F3F7F8]">
                    {item.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-[#123B50] text-[10px] font-bold text-[#43C7D1]">
                    {item.license || item.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#B8CDD7] leading-relaxed" dir="ltr">
                  {item.attribution || 'Pending replacement recording'}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Section 3: Real Sound Effects & Body Sounds */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-5 h-5 text-[#13B8B0]" />
            <h2 className="text-lg sm:text-xl font-extrabold text-[#F3F7F8]">
              {isAr
                ? 'المؤثرات الصوتية وأصوات الجسم الواقعية'
                : 'Real Sound Effects & Body Audio'}
            </h2>
          </div>

          <div
            data-testid="credits-sfx-list"
            className="rounded-2xl bg-[#0B2D40] border border-[#285064] overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start" dir="ltr">
                <thead className="bg-[#051C2C] text-[#A9C0CC] border-b border-[#285064]">
                  <tr>
                    <th className="py-2.5 px-3 font-bold text-left">Cue ID</th>
                    <th className="py-2.5 px-3 font-bold text-left">Recording Title</th>
                    <th className="py-2.5 px-3 font-bold text-left">Author</th>
                    <th className="py-2.5 px-3 font-bold text-left">License</th>
                    <th className="py-2.5 px-3 font-bold text-left">Attribution / Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#285064]/60">
                  {SFX_ASSETS.map((item) => (
                    <tr key={item.id} className="hover:bg-[#123B50]/40">
                      <td className="py-2 px-3 font-mono text-[11px] text-[#43C7D1] whitespace-nowrap">
                        {item.id}
                      </td>
                      <td className="py-2 px-3 font-semibold text-[#F3F7F8]">
                        {item.title}
                      </td>
                      <td className="py-2 px-3 text-[#B8CDD7] whitespace-nowrap">
                        {item.author || '—'}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'ready'
                              ? 'bg-[#123B50] text-[#5CE2EA]'
                              : 'bg-[#E9A23B]/20 text-[#E9A23B]'
                          }`}
                        >
                          {item.status === 'ready' ? item.license : 'MISSING'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[11px] text-[#A9C0CC]">
                        {item.sourceUrl ? (
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#43C7D1] hover:underline break-all"
                          >
                            {item.attribution}
                          </a>
                        ) : (
                          <span>{item.attribution || 'Not yet assigned'}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
