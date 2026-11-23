import React, { useState } from 'react';
import {
  Target,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Users,
  Activity,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  Play,
  Layers,
  ClipboardCheck,
  Wind,
  Hand,
  HeartPulse,
  Move3d,
  MousePointerClick,
  RotateCw,
} from 'lucide-react';
import { useNafas } from '../context/NafasContext';
import { STORY_LEVELS } from '../data/storyLevels';
import { AnatomicalExplorer3D } from '../components/respiratory3d/AnatomicalExplorer3D';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';
import { NafasLogoLockup } from '../components/Navbar';
import { RigPoseId, VictimCharacterId } from '../types/nafas';

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
    heightLabel: { en: string; ar: string };
    ratioLtr: string;
    heightPct: number;
    tag: { en: string; ar: string };
    allowAbdominalThrust: boolean;
    preferredThrust: 'abdominal_thrusts_5' | 'chest_thrusts_special';
    clinicalNote: { en: string; ar: string };
  }[] = [
    {
      id: 'youssef_adult',
      name: { en: 'Mohamed · Adult', ar: 'محمد · مريض بالغ' },
      age: { en: '34 Years · 175 cm', ar: '٣٤ سنة · ١٧٥ سم' },
      heightLabel: { en: '175 cm', ar: '١٧٥ سم' },
      ratioLtr: '1 : 7.5',
      heightPct: 100,
      tag: { en: 'Adult Thoracic Scale', ar: 'تشريح البالغ القياسي' },
      allowAbdominalThrust: true,
      preferredThrust: 'abdominal_thrusts_5',
      clinicalNote: {
        en: 'Standard adult anatomy: alternate up to 5 back blows & up to 5 abdominal thrusts above the navel.',
        ar: 'تشريح البالغ القياسي: التبديل بين حتى ٥ ضربات ظهرية وحتى ٥ ضغطات بطنية فوق السرة.',
      },
    },
    {
      id: 'salma_pregnant',
      name: {
        en: 'Pregnant Adult (3rd Trim.)',
        ar: 'سيدة حامل (الثلث الثالث)',
      },
      age: { en: '31 Years · 166 cm', ar: '٣١ سنة · ١٦٦ سم' },
      heightLabel: { en: '166 cm', ar: '١٦٦ سم' },
      ratioLtr: '1 : 7.2',
      heightPct: 95,
      tag: { en: '3rd-Trimester Sternal', ar: 'حمل بالثلث الثالث' },
      allowAbdominalThrust: false,
      preferredThrust: 'chest_thrusts_special',
      clinicalNote: {
        en: 'Never press on the abdomen in late pregnancy; use sternal chest thrusts at mid-sternum.',
        ar: 'يُمنع الضغط على البطن في الحمل المتقدم؛ تُستبدل بضغطات صدرية في منتصف عظمة القص.',
      },
    },
    {
      id: 'mostafa_child',
      name: {
        en: 'Marwan · Child (6 yrs)',
        ar: 'مروان · طفل (٦ سنوات)',
      },
      age: { en: '6 Years · 115 cm', ar: '٦ سنوات · ١١٥ سم' },
      heightLabel: { en: '115 cm', ar: '١١٥ سم' },
      ratioLtr: '1 : 5.5',
      heightPct: 66,
      tag: { en: '6y Pediatric Scale', ar: 'نسب طفل ٦ سنوات' },
      allowAbdominalThrust: true,
      preferredThrust: 'abdominal_thrusts_5',
      clinicalNote: {
        en: 'Kneel behind the child to align force vectors; use calibrated pediatric force.',
        ar: 'الركوع خلف الطفل لمحاذاة زاوية الدفع مع استخدام قوة متناسبة مع حجم الطفل.',
      },
    },
    {
      id: 'nelly_infant',
      name: {
        en: 'Nelly · Infant (8 mos)',
        ar: 'نيللي · رضيعة (٨ أشهر)',
      },
      age: { en: '8 Months · 68 cm', ar: '٨ أشهر · ٦٨ سم' },
      heightLabel: { en: '68 cm', ar: '٦٨ سم' },
      ratioLtr: '1 : 4.0',
      heightPct: 39,
      tag: { en: '8m Infant Forearm', ar: 'نسب رضيعة ٨ أشهر' },
      allowAbdominalThrust: false,
      preferredThrust: 'chest_thrusts_special',
      clinicalNote: {
        en: 'Support prone on forearm head-lower-than-chest for up to 5 back blows + up to 5 two-finger chest thrusts.',
        ar: 'إسناد الرضيعة على الساعد ورأسها لأسفل لعمل حتى ٥ ضربات ظهرية وحتى ٥ ضغطات صدرية بإصبعين.',
      },
    },
  ];

  const poseOptions: {
    id: RigPoseId;
    label: { en: string; ar: string };
    icon: React.ReactNode;
  }[] = [
    {
      id: 'effective_cough',
      label: { en: 'Partial Flow / Cough', ar: 'انسداد جزئي / سعال' },
      icon: <Wind className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'severe_silent_choking',
      label: { en: 'Complete Obstruction', ar: 'انسداد كامل بمجرى الهواء' },
      icon: <ShieldAlert className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'back_blows_5',
      label: { en: '5 Back Blows', ar: '٥ ضربات ظهرية' },
      icon: <Hand className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'abdominal_thrusts_5',
      label: { en: '5 Abdominal Thrusts', ar: '٥ ضغطات بطنية' },
      icon: <Target className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'chest_thrusts_special',
      label: { en: 'Sternal Chest Thrusts', ar: 'ضغطات صدرية' },
      icon: <HeartPulse className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'object_expelled_recovery',
      label: { en: 'Airway Cleared', ar: 'فتح مجرى الهواء والتعافي' },
      icon: <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />,
    },
  ];

  const activeChar =
    characterProfiles.find((c) => c.id === selectedCharacter) ||
    characterProfiles[0];

  const isSelectedManeuverUnsafe =
    selectedPose === 'abdominal_thrusts_5' && !activeChar.allowAbdominalThrust;

  const getDynamicManeuverDetails = (): {
    target: { en: string; ar: string };
    technique: { en: string; ar: string };
    airflow: { en: string; ar: string };
  } => {
    if (isSelectedManeuverUnsafe) {
      return activeChar.id === 'salma_pregnant'
        ? {
            target: {
              en: 'Abdomen is protected by the 3rd-trimester uterus (unsafe)',
              ar: 'البطن مشغول بالرحم في الثلث الثالث (ممنوع الضغط عليه)',
            },
            technique: {
              en: 'Move hands up to the center of the sternum for chest thrusts',
              ar: 'ارفع يديك فوراً إلى منتصف عظمة القص لتنفيذ الضغطات الصدرية',
            },
            airflow: {
              en: 'Abdominal pressure risks uterine injury without elevating the diaphragm safely',
              ar: 'الضغط على البطن يعرّض الأم والجنين للخطر ولا يفتح مجرى الهواء بأمان',
            },
          }
        : {
            target: {
              en: 'Infant abdomen houses an unprotected liver below soft ribs (unsafe)',
              ar: 'بطن الرضيع يحتوي على كبد حساس غير محمي أسفل الأضلاع اللينة (ممنوع)',
            },
            technique: {
              en: 'Use 2 fingers on the lower half of the sternum for 5 chest thrusts',
              ar: 'استخدم إصبعين فقط على النصف السفلي لعظمة القص لعمل ٥ ضغطات صدرية',
            },
            airflow: {
              en: 'Two-finger chest thrusts compress thoracic air safely without abdominal trauma',
              ar: 'الضغطات الصدرية بإصبعين تضغط هواء الصدر بأمان تام دون إصابة البطن',
            },
          };
    }

    switch (selectedPose) {
      case 'effective_cough':
        return {
          target: {
            en: 'Upper airway partially open — no physical thrusts needed',
            ar: 'مجرى الهواء مفتوح جزئياً — لا حاجة لتدخل يدوي',
          },
          technique: {
            en:
              activeChar.id === 'nelly_infant'
                ? 'Keep upright, observe loud cry/cough closely, stay ready'
                : 'Stay close, reassure calmly, and encourage strong coughing',
            ar:
              activeChar.id === 'nelly_infant'
                ? 'أبقِ الرضيعة في وضع مريح وراقب البكاء والسعال القوي عن قرب'
                : 'ابقَ قريباً، طمئن المصاب، وشجّعه على مواصلة السعال القوي',
          },
          airflow: {
            en: 'Airflow continues passing around the loose bolus into both lungs',
            ar: 'الهواء ما زال يمر حول اللقمة إلى الرئتين مما يسمح بطردها طبيعياً',
          },
        };
      case 'severe_silent_choking':
        return {
          target: {
            en: 'Complete laryngeal obstruction — urgent intervention required',
            ar: 'انسداد كامل عند الحنجرة — يتطلب تدخلاً إسعافياً فورياً',
          },
          technique: {
            en:
              activeChar.id === 'nelly_infant'
                ? 'Start immediately: up to 5 back blows + up to 5 two-finger chest thrusts'
                : activeChar.id === 'salma_pregnant'
                ? 'Start immediately: up to 5 back blows + up to 5 sternal chest thrusts'
                : 'Call EMS and alternate up to 5 back blows + up to 5 abdominal thrusts',
            ar:
              activeChar.id === 'nelly_infant'
                ? 'ابدأ فوراً: حتى ٥ ضربات ظهرية بالتبادل مع حتى ٥ ضغطات صدرية بإصبعين'
                : activeChar.id === 'salma_pregnant'
                ? 'ابدأ فوراً: حتى ٥ ضربات ظهرية بالتبادل مع حتى ٥ ضغطات صدرية على القص'
                : 'اطلب الإسعاف وبدّل بين حتى ٥ ضربات ظهرية وحتى ٥ ضغطات بطنية',
          },
          airflow: {
            en: 'Zero air enters the bronchi; trapped residual lung air must be compressed upward',
            ar: 'توقف تام لدخول الهواء؛ نعتمد على ضغط الهواء المتبقي بالرئتين لطرد الجسم',
          },
        };
      case 'back_blows_5':
        return {
          target: {
            en: 'Midline between the shoulder blades (interscapular zone)',
            ar: 'المنتصف بين لوحي الكتف (المنطقة البين كتفية)',
          },
          technique: {
            en:
              activeChar.id === 'nelly_infant'
                ? 'Hold infant face-down along forearm, head lower than chest, supporting jaw'
                : activeChar.id === 'mostafa_child'
                ? 'Kneel behind child, support chest, lean forward, give up to 5 firm blows'
                : 'Support chest with one hand, lean torso forward, deliver up to 5 heel blows',
            ar:
              activeChar.id === 'nelly_infant'
                ? 'أسند الرضيعة على بطنها فوق ساعدك والرأس أخفض من الصدر مع تثبيت الفك'
                : activeChar.id === 'mostafa_child'
                ? 'اركع خلف الطفل، أسند صدره وأمله للأمام مع توجيه حتى ٥ ضربات محسوبة'
                : 'أسند الصدر بيد وأمل الجذع للأمام مع توجيه حتى ٥ ضربات حازمة بكعب اليد',
          },
          airflow: {
            en: 'Vibration + gravity + upward thoracic pressure jolt the blockage toward the mouth',
            ar: 'الاهتزاز والجاذبية وموجة الضغط الصاعدة تدفع الجسم العالق نحو الفم',
          },
        };
      case 'abdominal_thrusts_5':
        return {
          target: {
            en: 'Midline just above the navel and well below the sternum tip',
            ar: 'خط المنتصف فوق السرة مباشرة وأسفل طرف عظمة القص',
          },
          technique: {
            en:
              activeChar.id === 'mostafa_child'
                ? 'Kneel behind child, thumb-side of fist inward & upward with child-calibrated force'
                : 'Stand behind adult, thumb-side of fist inward & upward in distinct J-strokes',
            ar:
              activeChar.id === 'mostafa_child'
                ? 'اركع خلف الطفل واضغط بقبضتك للداخل وللأعلى بقوة مناسبة لحجم الطفل'
                : 'قف خلف البالغ واضغط بقبضتك للداخل وللأعلى بحركة J منفصلة وحازمة',
          },
          airflow: {
            en: 'Elevates the diaphragm like a piston, blasting residual lung air upward',
            ar: 'ترفع الحجاب الحاجز كالمكبس فتدفع الهواء المحبوس بالرئتين بقوة للأعلى',
          },
        };
      case 'chest_thrusts_special':
        return {
          target: {
            en:
              activeChar.id === 'nelly_infant'
                ? 'Lower half of the sternum, just below the nipple line (2 fingers)'
                : 'Center of the sternum (mid-breastbone), safely above the abdomen',
            ar:
              activeChar.id === 'nelly_infant'
                ? 'النصف السفلي لعظمة القص أسفل خط الحلمتين مباشرة (بإصبعين)'
                : 'منتصف عظمة القص في الصدر — بعيداً تماماً عن منطقة البطن',
          },
          technique: {
            en:
              activeChar.id === 'nelly_infant'
                ? 'Hold face-up head-lower-than-chest on forearm; deliver up to 5 two-finger thrusts'
                : 'Wrap arms under armpits onto mid-sternum; pull sharply straight inward',
            ar:
              activeChar.id === 'nelly_infant'
                ? 'اقلب الرضيعة على ظهرها والرأس لأسفل ونفّذ حتى ٥ ضغطات صدرية بإصبعين'
                : 'مرّر ذراعيك تحت الإبطين لمنتصف عظمة القص واسحب للداخل مباشرة',
          },
          airflow: {
            en: 'Direct sternal compression generates high intrathoracic pressure safely',
            ar: 'الضغط المباشر على الصدر يولّد ضغطاً هوائياً طارداً بأمان تام',
          },
        };
      default:
        return {
          target: {
            en: 'Larynx & trachea clear — obstruction visibly expelled',
            ar: 'الحنجرة والقصبة مفتوحتان — تم طرد الجسم الغريب بالكامل',
          },
          technique: {
            en: 'Reassure patient, monitor breathing, and arrange medical check after thrusts',
            ar: 'طمئن المصاب وراقب تنفسه، واعرضه لفحص طبي للاطمئنان بعد الضغطات',
          },
          airflow: {
            en: 'Full laminar airflow restored smoothly across all bronchial branches',
            ar: 'عاد تدفق الهواء الكامل والمنتظم إلى جميع الشعب الهوائية والرئتين',
          },
        };
    }
  };

  const activeManeuverDetails = getDynamicManeuverDetails();

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
      <section
        data-testid="about-anatomical-section"
        className="bg-[#0B2D40] text-[#F3F7F8] rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#285064] shadow-2xl space-y-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold tracking-wide text-[#43C7D1]">
              <Layers className="w-4 h-4 text-[#13B8B0]" />
              <span>
                {isAr
                  ? 'المستكشف التشريحي ثلاثي الأبعاد للفئات العمرية'
                  : 'Interactive 3D Age-Specific Anatomical & Airway Explorer'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F3F7F8] text-balance">
              {isAr
                ? 'استكشف الفروق التشريحية بين البالغ والحامل والطفل والرضيع'
                : 'Explore Anatomical Proportions & Airway Maneuvers by Age Group'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Controls Column: Patient Category + Airway State & Maneuver + Dynamic Clinical Protocol */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {/* Step 1: Age & Anatomical Profile */}
            <div className="space-y-2.5">
              <div className="text-xs font-extrabold text-[#A9C0CC]">
                {isAr
                  ? '١. اختر الفئة العمرية والتشريحية'
                  : '1. Select Age & Anatomical Profile'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {characterProfiles.map((char) => {
                  const selected = selectedCharacter === char.id;
                  return (
                    <button
                      key={char.id}
                      type="button"
                      data-testid={`about-char-btn-${char.id}`}
                      onClick={() => setSelectedCharacter(char.id)}
                      className={`text-start p-3 rounded-xl border transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#13B8B0] border-[#43C7D1] text-[#071F2E] shadow-md'
                          : 'bg-[#123B50] border-[#285064] text-[#F3F7F8] hover:bg-[#19465B] hover:border-[#43C7D1]/60'
                      }`}
                    >
                      <div className="text-xs font-extrabold leading-snug">
                        {char.name[language]}
                      </div>
                      <div
                        className={`text-[11px] mt-0.5 tabular-nums ${
                          selected
                            ? 'text-[#071F2E]/85 font-bold'
                            : 'text-[#A9C0CC]'
                        }`}
                      >
                        {char.age[language]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Airway State & Rescue Maneuver */}
            <div className="space-y-2.5">
              <div className="text-xs font-extrabold text-[#A9C0CC]">
                {isAr
                  ? '٢. اختبر حالة مجرى الهواء والمناورة'
                  : '2. Inspect Airway State & Rescue Maneuver'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {poseOptions.map((p) => {
                  const isActive = selectedPose === p.id;
                  const isUnsafeOption =
                    p.id === 'abdominal_thrusts_5' &&
                    !activeChar.allowAbdominalThrust;
                  const isRecommendedThrust = p.id === activeChar.preferredThrust;

                  return (
                    <button
                      key={p.id}
                      type="button"
                      data-testid={`about-pose-btn-${p.id}`}
                      onClick={() => setSelectedPose(p.id)}
                      className={`text-start px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col gap-1 ${
                        isActive && isUnsafeOption
                          ? 'bg-[#36141C] border-[#DC5252] text-[#FFD4D8]'
                          : isActive
                          ? 'bg-[#19465B] border-[#43C7D1] text-[#FFFFFF] shadow-sm'
                          : isUnsafeOption
                          ? 'bg-[#1D1C26] border-[#DC5252]/40 text-[#E5A9B0] hover:border-[#DC5252]'
                          : 'bg-[#123B50] border-[#285064] text-[#C6DCE6] hover:text-[#F3F7F8] hover:border-[#43C7D1]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            isUnsafeOption
                              ? 'text-[#FF6B78]'
                              : isActive
                              ? 'text-[#43C7D1]'
                              : 'text-[#7AA8BD]'
                          }
                        >
                          {p.icon}
                        </span>
                        <span className="leading-snug">{p.label[language]}</span>
                      </div>
                      {isUnsafeOption && (
                        <span className="text-[10.5px] font-extrabold text-[#FF8A95] ps-5">
                          {isAr ? 'ممنوع لهذه الفئة' : 'Contraindicated'}
                        </span>
                      )}
                      {!isUnsafeOption && isRecommendedThrust && (
                        <span className="text-[10.5px] font-bold text-[#43C7D1] ps-5">
                          {isAr ? 'الضغط المعتمد لهذه الفئة' : 'Recommended thrust'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Clinical Protocol & Safety Box */}
            <div
              data-testid="about-clinical-rule-card"
              className={`p-4 rounded-xl border space-y-2.5 ${
                isSelectedManeuverUnsafe
                  ? 'bg-[#2A1118] border-[#DC5252]'
                  : 'bg-[#123B50] border-[#285064]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div
                  className={`inline-flex items-center gap-1.5 text-xs font-extrabold ${
                    isSelectedManeuverUnsafe ? 'text-[#FF8A95]' : 'text-[#43C7D1]'
                  }`}
                >
                  {isSelectedManeuverUnsafe ? (
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                  )}
                  <span>
                    {isSelectedManeuverUnsafe
                      ? isAr
                        ? 'تنبيه أمان طبي: مناورة ممنوعة'
                        : 'Clinical Safety Alert: Contraindicated'
                      : isAr
                      ? 'التحليل التشريحي والتطبيقي'
                      : 'Live Anatomical & Protocol Breakdown'}
                  </span>
                </div>
              </div>

              <dl className="space-y-2 text-xs leading-relaxed">
                <div>
                  <dt className="font-bold text-[#9AC2D4]">
                    {isAr ? 'الموضع التشريحي:' : 'Anatomical Landmark:'}
                  </dt>
                  <dd className="text-[#F3F7F8]">
                    {activeManeuverDetails.target[language]}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-[#9AC2D4]">
                    {isAr ? 'طريقة التنفيذ:' : 'Technique & Posture:'}
                  </dt>
                  <dd className="text-[#F3F7F8]">
                    {activeManeuverDetails.technique[language]}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-[#9AC2D4]">
                    {isAr ? 'تأثير مجرى الهواء:' : 'Airway Physics:'}
                  </dt>
                  <dd className="text-[#DCECF3]">
                    {activeManeuverDetails.airflow[language]}
                  </dd>
                </div>
              </dl>

              {isSelectedManeuverUnsafe && (
                <button
                  type="button"
                  data-testid="about-panel-switch-safe-btn"
                  onClick={() => setSelectedPose('chest_thrusts_special')}
                  className="w-full mt-1 py-2 px-3 rounded-lg bg-[#13B8B0] hover:bg-[#43C7D1] text-[#071F2E] text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {isAr
                      ? 'انتقل إلى البديل الآمن: الضغطات الصدرية'
                      : 'Switch to Safe Alternative: Chest Thrusts'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* 3D Interactive Medical-Glass Viewport Column */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden border border-[#285064] bg-[#061A28] shadow-xl">
              <AnatomicalExplorer3D
                victim={activeChar.id}
                pose={selectedPose}
                language={language}
                onSelectPose={setSelectedPose}
              />
            </div>

            {/* 4-Category Anatomical Proportions & Scale Comparison Strip (RTL-Safe + Visual Height Bar) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {characterProfiles.map((spec) => {
                const isSelected = selectedCharacter === spec.id;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    data-testid={`about-scale-card-${spec.id}`}
                    onClick={() => setSelectedCharacter(spec.id)}
                    className={`text-start p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-[#19465B] border-[#43C7D1] text-[#F3F7F8]'
                        : 'bg-[#123B50] border-[#285064] text-[#A9C0CC] hover:text-[#F3F7F8] hover:border-[#43C7D1]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 text-[11px] font-extrabold text-[#43C7D1] tabular-nums">
                      <span>{spec.heightLabel[language]}</span>
                      <span dir="ltr" className="text-[#BFEBF2]">
                        {spec.ratioLtr}
                      </span>
                    </div>
                    {/* Relative Proportional Height Bar */}
                    <div className="w-full h-1.5 rounded-full bg-[#071F2E] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isSelected ? 'bg-[#13B8B0]' : 'bg-[#3C7B96]'
                        }`}
                        style={{ width: `${spec.heightPct}%` }}
                      />
                    </div>
                    <div className="text-[11px] font-bold text-[#F3F7F8] leading-snug">
                      {spec.tag[language]}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Clean Unboxed Interactive Guide Strip (Replaces Truncated Color Swatches) */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-[#071F2E]/75 border border-[#1E4458] text-xs text-[#B9D3E0]">
              <div className="inline-flex items-center gap-1.5">
                <Move3d className="w-3.5 h-3.5 text-[#43C7D1] shrink-0" />
                <span>
                  {isAr ? 'اسحب لتدوير النموذج 360°' : 'Drag to rotate 360°'}
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <MousePointerClick className="w-3.5 h-3.5 text-[#43C7D1] shrink-0" />
                <span>
                  {isAr
                    ? 'اضغط على أي عضو لمعرفة وظيفته'
                    : 'Click any organ to inspect'}
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-[#43C7D1] shrink-0" />
                <span>
                  {isAr
                    ? 'بدّل الزاوية (أمامي · جانبي · خلفي) لرؤية موضع الضربات'
                    : 'Switch Front / Side / Back views'}
                </span>
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
