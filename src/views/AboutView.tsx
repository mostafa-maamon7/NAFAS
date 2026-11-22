import React, { useState } from 'react';
import {
  Target,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Users,
  Activity,
  ShieldCheck,
  BookOpen,
  Play,
  Palette,
  Layers,
  ClipboardCheck,
} from 'lucide-react';
import { useNafas } from '../context/NafasContext';
import { STORY_LEVELS } from '../data/storyLevels';
import { RiggedSceneCanvas } from '../components/RiggedSceneCanvas';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';
import { NafasLogoLockup } from '../components/Navbar';
import {
  ObstructionObjectType,
  RescuerCharacterId,
  RigPoseId,
  SceneLocationId,
  VictimCharacterId,
} from '../types/nafas';

export const AboutView: React.FC = () => {
  const { language, t, navigateTo, startLevel } = useNafas();
  const isAr = language === 'ar';

  const [selectedCharacter, setSelectedCharacter] =
    useState<VictimCharacterId>('youssef_adult');
  const [selectedPose, setSelectedPose] = useState<RigPoseId>(
    'severe_silent_choking'
  );

  const characterProfiles: {
    id: VictimCharacterId;
    name: { en: string; ar: string };
    age: { en: string; ar: string };
    location: SceneLocationId;
    rescuer: RescuerCharacterId;
    obstruction: ObstructionObjectType;
    clinicalNote: { en: string; ar: string };
  }[] = [
    {
      id: 'youssef_adult',
      name: { en: 'Adult Patient (1:7.5 Scale)', ar: 'مريض بالغ (نسبة ١:٧.٥)' },
      age: { en: '34 Years · 175 cm', ar: '٣٤ سنة · ١٧٥ سم' },
      location: 'family_dining',
      rescuer: 'rescuer_family',
      obstruction: 'meat',
      clinicalNote: {
        en: 'Standard adult anatomy: alternate 5 back blows & 5 abdominal thrusts above the navel.',
        ar: 'تشريح البالغ القياسي: التبديل بين ٥ ضربات ظهرية و٥ ضغطات بطنية فوق السرة.',
      },
    },
    {
      id: 'salma_pregnant',
      name: {
        en: 'Pregnant Adult (3rd Trimester)',
        ar: 'سيدة حامل (الثلث الثالث)',
      },
      age: { en: '31 Years · Sternal Protocol', ar: '٣١ سنة · بروتوكول القص' },
      location: 'home_workplace_lounge',
      rescuer: 'rescuer_colleague',
      obstruction: 'meat',
      clinicalNote: {
        en: 'Never press on the abdomen in late pregnancy; use sternal chest thrusts.',
        ar: 'يُمنع الضغط على البطن في الحمل المتقدم؛ تُستبدل بضغطات صدرية في منتصف عظمة القص.',
      },
    },
    {
      id: 'mostafa_child',
      name: {
        en: 'Pediatric Child (1:5.5 Scale)',
        ar: 'طفل (نسبة تشريحية ١:٥.٥)',
      },
      age: { en: '6 Years · 115 cm', ar: '٦ سنوات · ١١٥ سم' },
      location: 'school_cafeteria',
      rescuer: 'rescuer_teacher',
      obstruction: 'grape',
      clinicalNote: {
        en: 'Kneel behind the child to align force vectors; use calibrated pediatric force.',
        ar: 'الركوع خلف الطفل لمحاذاة زاوية الدفع مع استخدام قوة متناسبة مع حجم الطفل.',
      },
    },
    {
      id: 'nelly_infant',
      name: {
        en: 'Infant Patient (1:4 Scale)',
        ar: 'رضيع (نسبة تشريحية ١:٤)',
      },
      age: { en: '8 Months · 68 cm', ar: '٨ أشهر · ٦٨ سم' },
      location: 'home_nursery',
      rescuer: 'rescuer_parent',
      obstruction: 'soft_food',
      clinicalNote: {
        en: 'Support prone on forearm head-lower-than-chest for 5 back blows + 5 two-finger chest thrusts.',
        ar: 'إسناد الرضيع على الساعد ورأسه لأسفل مع ٥ ضربات ظهرية و٥ ضغطات صدرية بإصبعين.',
      },
    },
  ];

  const poseOptions: { id: RigPoseId; label: { en: string; ar: string } }[] = [
    {
      id: 'effective_cough',
      label: { en: 'Partial Flow / Cough', ar: 'انسداد جزئي / سعال' },
    },
    {
      id: 'severe_silent_choking',
      label: { en: 'Complete Obstruction', ar: 'انسداد كامل بمجرى الهواء' },
    },
    {
      id: 'back_blows_5',
      label: { en: '5 Back Blows', ar: '٥ ضربات ظهرية' },
    },
    {
      id: 'abdominal_thrusts_5',
      label: { en: '5 Abdominal Thrusts', ar: '٥ ضغطات بطنية' },
    },
    {
      id: 'chest_thrusts_special',
      label: { en: 'Sternal Chest Thrusts', ar: 'ضغطات صدرية' },
    },
    {
      id: 'object_expelled_recovery',
      label: { en: 'Airway Cleared', ar: 'فتح مجرى الهواء والتعافي' },
    },
  ];

  const activeChar =
    characterProfiles.find((c) => c.id === selectedCharacter) ||
    characterProfiles[0];

  const colorTokens = [
    { name: 'Main BG', hex: '#071F2E' },
    { name: 'Secondary BG', hex: '#0B2D40' },
    { name: 'Card Surface', hex: '#123B50' },
    { name: 'Elevated', hex: '#19465B' },
    { name: 'Primary Teal', hex: '#13B8B0' },
    { name: 'Accent Cyan', hex: '#43C7D1' },
    { name: 'Success', hex: '#16A36A' },
    { name: 'Danger', hex: '#DC5252' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <section className="bg-[#0B2D40] border border-[#285064] rounded-2xl p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#43C7D1]">
            {t.about.kicker}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F3F7F8] text-balance">
            {t.about.title}
          </h1>
          <p className="text-base sm:text-lg text-[#A9C0CC] max-w-3xl leading-relaxed">
            {t.about.subtitle}
          </p>
        </div>
        <div className="shrink-0">
          <NafasLogoLockup className="h-12 sm:h-14 w-auto" />
        </div>
      </section>

      {/* Core Pillars: What NAFAS Is, Problem Addressed, Educational Mission */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#123B50] border border-[#285064] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#19465B] border border-[#285064] text-[#43C7D1] flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[#F3F7F8]">
            {t.about.whatIsTitle}
          </h2>
          <p className="text-sm text-[#A9C0CC] leading-relaxed">
            {t.about.whatIsBody}
          </p>
        </div>

        <div className="bg-[#123B50] border border-[#285064] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B2D40] border border-[#DC5252]/40 text-[#DC5252] flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[#F3F7F8]">
            {t.about.problemTitle}
          </h2>
          <p className="text-sm text-[#A9C0CC] leading-relaxed">
            {t.about.problemBody}
          </p>
        </div>

        <div className="bg-[#123B50] border border-[#285064] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#19465B] border border-[#285064] text-[#13B8B0] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[#F3F7F8]">
            {t.about.missionTitle}
          </h2>
          <p className="text-sm text-[#A9C0CC] leading-relaxed">
            {t.about.missionBody}
          </p>
        </div>
      </section>

      {/* INTERACTIVE ANATOMICAL VISUALIZATION & AGE DIFFERENTIATION SHOWCASE */}
      <section className="bg-[#0B2D40] text-[#F3F7F8] rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#285064] shadow-2xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#43C7D1]">
              <Layers className="w-4 h-4 text-[#13B8B0]" />
              <span>
                {isAr
                  ? 'نظام التوضيح الطبي والتشريحي للفئات العمرية'
                  : 'Age-Specific Medical Illustration & Anatomical Airway System'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F3F7F8] mt-1">
              {isAr
                ? 'استكشف الفروق التشريحية بين البالغ والحامل والطفل والرضيع'
                : 'Inspect Anatomical Proportions & Airway Overlays by Age Group'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Patient Category Selector & Clinical State Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#A9C0CC]">
                {isAr
                  ? '١. اختر الفئة العمرية والتشريحية'
                  : '1. Select Age & Anatomical Profile'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {characterProfiles.map((char) => (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => setSelectedCharacter(char.id)}
                    className={`text-start p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedCharacter === char.id
                        ? 'bg-[#13B8B0] border-[#43C7D1] text-[#071F2E] font-extrabold'
                        : 'bg-[#123B50] border-[#285064] text-[#F3F7F8] hover:bg-[#19465B]'
                    }`}
                  >
                    <div className="text-xs font-extrabold">
                      {char.name[language]}
                    </div>
                    <div
                      className={`text-[11px] ${
                        selectedCharacter === char.id
                          ? 'text-[#071F2E]/85 font-bold'
                          : 'text-[#A9C0CC]'
                      }`}
                    >
                      {char.age[language]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#A9C0CC]">
                {isAr
                  ? '٢. اختبر حالة مجرى الهواء والمناورة'
                  : '2. Inspect Airway State & Rescue Landmark'}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {poseOptions.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPose(p.id)}
                    className={`text-start px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedPose === p.id
                        ? 'bg-[#19465B] border-[#43C7D1] text-[#43C7D1]'
                        : 'bg-[#123B50] border-[#285064] text-[#A9C0CC] hover:text-[#F3F7F8]'
                    }`}
                  >
                    {p.label[language]}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#123B50] border border-[#285064] space-y-1.5">
              <div className="text-xs font-extrabold text-[#43C7D1]">
                {isAr ? 'القاعدة التشريحية المعتمدة:' : 'Clinical Anatomical Rule:'}
              </div>
              <p className="text-xs text-[#F3F7F8] leading-relaxed">
                {activeChar.clinicalNote[language]}
              </p>
            </div>
          </div>

          {/* Right: Live 3D Anatomical Model & 2D Illustration Viewport */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#285064] bg-[#071F2E] shadow-xl">
              <RiggedSceneCanvas
                location={activeChar.location}
                victim={activeChar.id}
                rescuer={activeChar.rescuer}
                obstruction={activeChar.obstruction}
                pose={selectedPose}
                spo2={selectedPose === 'severe_silent_choking' ? 83 : 97}
                heartRate={selectedPose === 'severe_silent_choking' ? 136 : 92}
                language={language}
                defaultRenderMode="3d"
                onSelectVictim={setSelectedCharacter}
              />
            </div>

            {/* 4-Category Anatomical Proportions & Scale Comparison Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                {
                  id: 'youssef_adult' as VictimCharacterId,
                  ratio: '1 : 7.5',
                  height: '175 cm',
                  tag: { en: 'Adult Thoracic Scale', ar: 'تشريح البالغ القياسي' },
                },
                {
                  id: 'salma_pregnant' as VictimCharacterId,
                  ratio: '1 : 7.2',
                  height: '166 cm',
                  tag: { en: '3rd-Trimester Sternal', ar: 'حمل بالثلث الثالث' },
                },
                {
                  id: 'mostafa_child' as VictimCharacterId,
                  ratio: '1 : 5.5',
                  height: '115 cm',
                  tag: { en: '6y Pediatric Scale', ar: 'نسب طفل ٦ سنوات' },
                },
                {
                  id: 'nelly_infant' as VictimCharacterId,
                  ratio: '1 : 4.0',
                  height: '68 cm',
                  tag: { en: '8m Infant Forearm', ar: 'نسب رضيع ٨ أشهر' },
                },
              ].map((spec) => (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => setSelectedCharacter(spec.id)}
                  className={`text-start p-2.5 rounded-xl border transition-all cursor-pointer ${
                    selectedCharacter === spec.id
                      ? 'bg-[#19465B] border-[#43C7D1] text-[#F3F7F8]'
                      : 'bg-[#123B50] border-[#285064] text-[#A9C0CC] hover:text-[#F3F7F8]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-[#43C7D1]">
                    <span>{spec.height}</span>
                    <span>{spec.ratio}</span>
                  </div>
                  <div className="text-[11px] font-bold text-[#F3F7F8] mt-0.5 truncate">
                    {spec.tag[language]}
                  </div>
                </button>
              ))}
            </div>

            {/* Dark Medical Technology Color Tokens Strip */}
            <div className="bg-[#123B50] border border-[#285064] rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#43C7D1] mb-2">
                <Palette className="w-3.5 h-3.5 text-[#13B8B0]" />
                <span>
                  {isAr
                    ? 'نظام ألوان التكنولوجيا الطبية الداكنة في نَفَس'
                    : 'NAFAS Dark Medical Technology Color System'}
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {colorTokens.map((tok) => (
                  <div
                    key={tok.name}
                    className="rounded-lg p-1.5 bg-[#071F2E] border border-[#285064] text-center"
                  >
                    <div
                      className="w-full h-5 rounded mb-1 border border-[#285064]"
                      style={{ backgroundColor: tok.hex }}
                    />
                    <div className="text-[10px] font-bold text-[#F3F7F8] truncate">
                      {tok.name}
                    </div>
                    <div className="text-[9px] text-[#A9C0CC] font-mono">
                      {tok.hex}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Age-Specific Choking Education Matters + Anatomical Comparison Matrix */}
      <section className="bg-[#0B2D40] border border-[#285064] rounded-2xl p-8 space-y-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#43C7D1]">
            <Users className="w-4 h-4 text-[#13B8B0]" />
            <span>
              {isAr
                ? 'الفروقات التشريحية والبروتوكولات العمرية'
                : 'Anatomical & Procedural Differentiation'}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#F3F7F8]">
            {t.about.ageSpecificTitle}
          </h2>
          <p className="text-sm text-[#A9C0CC] leading-relaxed">
            {t.about.ageSpecificBody}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto border border-[#285064] rounded-xl">
          <table className="w-full text-start border-collapse text-sm">
            <thead>
              <tr className="bg-[#123B50] border-b border-[#285064] text-[#F3F7F8]">
                <th className="py-3.5 px-4 font-bold text-start">
                  {isAr ? 'معيار المقارنة' : 'Clinical Parameter'}
                </th>
                <th className="py-3.5 px-4 font-bold text-start">
                  {isAr ? 'البالغون (+18 سنة)' : 'Adult (18+ Years)'}
                </th>
                <th className="py-3.5 px-4 font-bold text-start">
                  {isAr ? 'الأطفال (1–8 سنوات)' : 'Child (1–8 Years)'}
                </th>
                <th className="py-3.5 px-4 font-bold text-start">
                  {isAr ? 'الرضّع (أقل من سنة)' : 'Infant (Under 1 Year)'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#285064] text-[#A9C0CC] bg-[#071F2E]/60">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#F3F7F8]">
                  {isAr
                    ? 'الانسداد الجزئي (سعال فعّال)'
                    : 'Mild Obstruction (Effective Cough)'}
                </td>
                <td className="py-3.5 px-4">
                  {isAr
                    ? 'تشجيع السعال والمراقبة'
                    : 'Encourage coughing & monitor'}
                </td>
                <td className="py-3.5 px-4">
                  {isAr
                    ? 'تشجيع السعال والمراقبة'
                    : 'Encourage coughing & monitor'}
                </td>
                <td className="py-3.5 px-4">
                  {isAr
                    ? 'مراقبة السعال/البكاء القوي دون تدخل'
                    : 'Monitor strong cough/cry closely'}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#F3F7F8]">
                  {isAr
                    ? 'الانسداد الشديد (المصاب واعٍ)'
                    : 'Severe Obstruction (Conscious)'}
                </td>
                <td className="py-3.5 px-4">
                  {isAr
                    ? '5 ضربات ظهرية و5 ضغطات بطنية فوق السرة (أو صدرية للحامل)'
                    : '5 back blows & 5 abdominal thrusts above navel (chest thrusts in pregnancy)'}
                </td>
                <td className="py-3.5 px-4">
                  {isAr
                    ? 'الركوع خلف الطفل + 5 ضربات ظهرية و5 ضغطات بطن بقوة مناسبة'
                    : 'Kneel behind child + 5 back blows & 5 calibrated abdominal thrusts'}
                </td>
                <td className="py-3.5 px-4 font-semibold text-[#43C7D1]">
                  {isAr
                    ? '5 ضربات ظهرية + 5 ضغطات صدرية بإصبعين (يُمنع ضغط البطن)'
                    : '5 back blows + 5 two-finger chest thrusts (NO abdominal thrusts)'}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#F3F7F8]">
                  {isAr ? 'عند فقدان الوعي' : 'If Victim Becomes Unresponsive'}
                </td>
                <td className="py-3.5 px-4">
                  {isAr
                    ? 'إنعاش قلبي رئوي 30:2 + فحص الفم البصري فقط'
                    : 'Start 30:2 CPR + visual mouth check only'}
                </td>
                <td className="py-3.5 px-4">
                  {isAr
                    ? 'إنعاش قلبي رئوي 30:2 + فحص الفم البصري فقط'
                    : 'Start 30:2 CPR + visual mouth check only'}
                </td>
                <td className="py-3.5 px-4">
                  {isAr
                    ? 'إنعاش الرضيع 30:2 بإصبعين (عمق ~4 سم) + فحص الفم البصري'
                    : 'Infant 30:2 two-finger CPR (~4 cm depth) + visual mouth check'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CLINICAL REVIEW CHECKLIST TABLE */}
      <section className="bg-[#0B2D40] border border-[#285064] rounded-2xl p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#43C7D1]">
              <ClipboardCheck className="w-4 h-4 text-[#13B8B0]" />
              <span>
                {isAr
                  ? 'قائمة المراجعة الطبية للمحتوى السريري (Clinical Review Checklist)'
                  : 'Clinical Review Checklist for Licensed Medical Reviewers'}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#F3F7F8]">
              {isAr
                ? 'سجل التحقق من البروتوكولات الطبية للحالات السريرية'
                : 'Medical Protocol & Safety Verification Matrix'}
            </h2>
            <p className="text-xs sm:text-sm text-[#A9C0CC] leading-relaxed">
              {isAr
                ? 'توثق هذه القائمة القواعد الطبية الحرجة لكل حالة في المحاكاة ليتمكن الأطباء ومدربو الإنعاش القلبي الرئوي (BLS) من مراجعتها واعتمادها.'
                : 'This checklist documents the clinical focus, guideline alignment (AHA / ARC / RCUK), and safety rules for every case.'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#285064] rounded-xl">
          <table className="w-full text-start border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#123B50] text-[#F3F7F8] border-b border-[#285064]">
                <th className="py-3 px-4 font-bold text-start">
                  {isAr ? 'الحالة' : 'Case'}
                </th>
                <th className="py-3 px-4 font-bold text-start">
                  {isAr ? 'السيناريو والمصاب' : 'Scenario & Patient'}
                </th>
                <th className="py-3 px-4 font-bold text-start">
                  {isAr ? 'التركيز السريري' : 'Clinical Focus'}
                </th>
                <th className="py-3 px-4 font-bold text-start">
                  {isAr ? 'بند المراجعة الطبية' : 'Clinician Verification Note'}
                </th>
                <th className="py-3 px-4 font-bold text-start">
                  {isAr ? 'المعيار' : 'Guidelines'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#285064] text-[#A9C0CC] bg-[#071F2E]/60">
              {STORY_LEVELS.map((lvl) => (
                <tr key={lvl.id} className="hover:bg-[#123B50]/60">
                  <td className="py-3.5 px-4 font-extrabold text-[#F3F7F8] whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => startLevel(lvl.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#19465B] border border-[#285064] text-[#43C7D1] hover:bg-[#13B8B0] hover:text-[#071F2E] transition-colors cursor-pointer"
                    >
                      <span>{lvl.id}</span>
                      <Play className="w-3 h-3" />
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#F3F7F8]">
                      {lvl.title[language]}
                    </div>
                    <div className="text-xs text-[#A9C0CC]">
                      {lvl.character.name[language]} ·{' '}
                      {lvl.character.age[language]}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#43C7D1]">
                    {lvl.subtitle[language]}
                  </td>
                  <td className="py-3.5 px-4 text-xs leading-relaxed max-w-md">
                    {lvl.clinicalReview && lvl.clinicalReviewReason
                      ? typeof lvl.clinicalReviewReason === 'string'
                        ? lvl.clinicalReviewReason
                        : lvl.clinicalReviewReason[language]
                      : lvl.objective[language]}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#16A36A]/15 border border-[#16A36A]/40 text-[#16A36A] text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      RCUK 2025 · ARC
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Platform Objectives & Interactive Learning Role */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6 bg-[#123B50] border border-[#285064] rounded-2xl p-8 space-y-5">
          <h2 className="text-xl font-bold text-[#F3F7F8]">
            {t.about.objectivesTitle}
          </h2>
          <ul className="space-y-3.5">
            {t.about.objectives.map((obj, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm text-[#A9C0CC] leading-relaxed"
              >
                <CheckCircle2 className="w-5 h-5 text-[#13B8B0] shrink-0 mt-0.5" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6 bg-[#0B2D40] border border-[#285064] text-[#F3F7F8] rounded-2xl p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#43C7D1]">
              <Activity className="w-4 h-4 text-[#13B8B0]" />
              <span>
                {isAr
                  ? 'التعلّم القائم على المحاكاة السريرية'
                  : 'Decision-Based Clinical Simulation'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#F3F7F8]">
              {t.about.interactiveRoleTitle}
            </h2>
            <p className="text-sm text-[#A9C0CC] leading-relaxed">
              {t.about.interactiveRoleBody}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#285064]">
            <button
              type="button"
              onClick={() => navigateTo('learning')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#F3F7F8] bg-[#123B50] hover:bg-[#19465B] border border-[#285064] rounded-xl transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#43C7D1]" />
              <span>{t.nav.learning}</span>
            </button>
            <button
              type="button"
              onClick={() => navigateTo('simulation')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold text-[#071F2E] bg-[#13B8B0] hover:bg-[#43C7D1] rounded-xl transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{t.nav.simulation}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Medical Guideline Foundation */}
      <section className="bg-[#123B50] border border-[#285064] rounded-2xl p-8 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#43C7D1]">
          <ShieldCheck className="w-4 h-4 text-[#13B8B0]" />
          <span>
            AHA · Australian Resuscitation Council (ARC) · Resuscitation Council
            UK
          </span>
        </div>
        <h2 className="text-xl font-bold text-[#F3F7F8]">
          {t.about.guidelinesSectionTitle}
        </h2>
        <p className="text-sm text-[#A9C0CC] leading-relaxed max-w-4xl">
          {t.about.guidelinesSectionBody}
        </p>
      </section>

      <MedicalDisclaimerBanner />
    </div>
  );
};
