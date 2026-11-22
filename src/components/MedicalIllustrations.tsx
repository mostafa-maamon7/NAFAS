import React from 'react';
import { AgeCategory, IllustrationType, Language } from '../types/nafas';

import adultAnatomyImg from '../assets/images/medical_adult_choking_anatomy_1795127849301.jpg';
import childAnatomyImg from '../assets/images/medical_child_pediatric_anatomy_1795127851097.jpg';
import infantAnatomyImg from '../assets/images/medical_infant_forearm_anatomy_1795127850309.jpg';

export const AgeCategoryIllustration: React.FC<{
  category: AgeCategory;
  className?: string;
}> = ({ category, className = 'w-20 h-20' }) => {
  const imgSrc =
    category === 'adult'
      ? adultAnatomyImg
      : category === 'child'
      ? childAnatomyImg
      : infantAnatomyImg;

  return (
    <div
      className={`rounded-xl overflow-hidden bg-[#071F2E] border border-[#285064] ${className}`}
    >
      <img
        src={imgSrc}
        alt={`${category} medical anatomy`}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export const MedicalDiagramIllustration: React.FC<{
  type: IllustrationType;
  language: Language;
  className?: string;
}> = ({ type, language, className = 'w-full h-56' }) => {
  const isAr = language === 'ar';

  switch (type) {
    case 'airway-anatomy':
      return (
        <div
          className={`relative rounded-xl bg-[#0B2D40] border border-[#285064] p-5 text-[#F3F7F8] flex flex-col justify-between overflow-hidden ${className}`}
        >
          <div className="flex items-center justify-between text-xs text-[#43C7D1] font-semibold">
            <span>
              {isAr
                ? 'تشريح مجرى الهواء العلوي والقصبة الهوائية'
                : 'Upper Airway & Tracheal Obstruction Anatomy'}
            </span>
            <span className="tabular-nums">RCUK 2025 / ARC</span>
          </div>

          <svg viewBox="0 0 360 130" className="w-full h-32 my-1" fill="none">
            <path
              d="M180 12V62M180 62L145 90M180 62L215 90"
              stroke="#43C7D1"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M140 70C115 70 100 92 105 114C108 124 135 124 148 110C155 102 155 70 140 70Z"
              fill="#13B8B0"
              fillOpacity="0.35"
              stroke="#43C7D1"
              strokeWidth="2"
            />
            <path
              d="M220 70C245 70 260 92 255 114C252 124 225 124 212 110C205 102 205 70 220 70Z"
              fill="#13B8B0"
              fillOpacity="0.35"
              stroke="#43C7D1"
              strokeWidth="2"
            />
            <circle
              cx="180"
              cy="34"
              r="11"
              fill="#DC5252"
              stroke="#F3F7F8"
              strokeWidth="2.5"
            />
            <path
              d="M130 102L145 86M230 102L215 86"
              stroke="#F3F7F8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text
              x="25"
              y="38"
              fill="#F3F7F8"
              fontSize="11"
              fontWeight="600"
            >
              {isAr ? 'انسداد الحنجرة' : 'Laryngeal Blockage'}
            </text>
            <line
              x1="125"
              y1="34"
              x2="165"
              y2="34"
              stroke="#DC5252"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
            <text
              x="245"
              y="55"
              fill="#43C7D1"
              fontSize="11"
              fontWeight="600"
            >
              {isAr ? 'ضغط الهواء المتبقي' : 'Trapped Lung Air'}
            </text>
          </svg>

          <div className="text-xs text-[#A9C0CC] flex items-center justify-between border-t border-[#285064] pt-2">
            <span>
              {isAr
                ? 'الهدف: رفع الضغط داخل الصدر لدفع الجسم العالق للخارج'
                : 'Goal: Surge intrathoracic pressure to expel the foreign body'}
            </span>
          </div>
        </div>
      );

    case 'mild-vs-severe':
      return (
        <div
          className={`rounded-xl bg-[#0B2D40] border border-[#285064] p-4 flex flex-col justify-between ${className}`}
        >
          <div className="text-xs font-semibold text-[#43C7D1] mb-2">
            {isAr
              ? 'مقارنة سريرية: الانسداد الجزئي مقابل الانسداد الشديد'
              : 'Clinical Differential: Mild vs. Severe Airway Obstruction'}
          </div>
          <div className="grid grid-cols-2 gap-3 my-auto">
            <div className="rounded-lg bg-[#123B50] border border-[#16A36A]/45 p-3">
              <div className="text-xs font-bold text-[#16A36A] mb-1">
                {isAr ? '● انسداد جزئي (سعال فعّال)' : '● Mild (Effective Cough)'}
              </div>
              <ul className="text-xs text-[#F3F7F8] space-y-1">
                <li>
                  {isAr
                    ? '• سعال قوي ومسموع'
                    : '• Loud, forceful coughing'}
                </li>
                <li>
                  {isAr
                    ? '• قادر على الكلام أو البكاء'
                    : '• Able to speak, cry & inhale'}
                </li>
                <li className="font-semibold text-[#43C7D1]">
                  {isAr
                    ? '← شجّعه على السعال وراقبه'
                    : '→ Encourage coughing & monitor'}
                </li>
              </ul>
            </div>
            <div className="rounded-lg bg-[#123B50] border border-[#DC5252]/45 p-3">
              <div className="text-xs font-bold text-[#DC5252] mb-1">
                {isAr ? '▲ انسداد شديد (سعال صامت)' : '▲ Severe (Silent / Blocked)'}
              </div>
              <ul className="text-xs text-[#F3F7F8] space-y-1">
                <li>
                  {isAr
                    ? '• يمسك رقبته وعاجز عن الكلام'
                    : '• Universal choking sign; silent'}
                </li>
                <li>
                  {isAr
                    ? '• عجز عن التنفس أو ازرقاق'
                    : '• Unable to breathe; cyanosis'}
                </li>
                <li className="font-semibold text-[#DC5252]">
                  {isAr
                    ? '← تدخل بدني فوري + طوارئ'
                    : '→ Immediate thrusts / back blows'}
                </li>
              </ul>
            </div>
          </div>
          <div className="text-[11px] text-[#A9C0CC] mt-2">
            {isAr
              ? 'اسأل دائماً: «هل تختنق؟» لتقييم القدرة على الكلام والسعال قبل التدخل.'
              : 'Always ask "Are you choking?" to evaluate vocalization and cough power first.'}
          </div>
        </div>
      );

    case 'adult-abdominal-thrusts':
      return (
        <div
          className={`relative rounded-xl bg-[#071F2E] border border-[#285064] overflow-hidden flex flex-col justify-between ${className}`}
        >
          <img
            src={adultAnatomyImg}
            alt="Adult abdominal thrust medical illustration"
            className="absolute inset-0 w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071F2E] via-[#071F2E]/35 to-[#071F2E]/80" />
          <div className="relative z-10 p-4 flex items-center justify-between text-xs font-semibold text-[#43C7D1]">
            <span>
              {isAr
                ? 'بروتوكول البالغين (+18): ضغطات البطن (فوق السرة)'
                : 'Adult Protocol (18+): Inward & Upward Abdominal Thrusts'}
            </span>
            <span className="tabular-nums text-[#F3F7F8]">1:7.5 Adult Scale</span>
          </div>
          <div className="relative z-10 p-4 pt-0 text-xs text-[#F3F7F8] border-t border-[#285064]/80 mt-auto bg-[#0B2D40]/90">
            {isAr
              ? 'القبضة فوق السرة وأسفل الناتئ الخنجري؛ للحامل تُستبدل بضغطات صدرية في منتصف القص.'
              : 'Fist midline above navel below xiphoid; use sternal chest thrusts in pregnancy.'}
          </div>
        </div>
      );

    case 'child-choking-care':
      return (
        <div
          className={`relative rounded-xl bg-[#071F2E] border border-[#285064] overflow-hidden flex flex-col justify-between ${className}`}
        >
          <img
            src={childAnatomyImg}
            alt="Pediatric child choking rescue illustration"
            className="absolute inset-0 w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071F2E] via-[#071F2E]/35 to-[#071F2E]/80" />
          <div className="relative z-10 p-4 flex items-center justify-between text-xs font-semibold text-[#43C7D1]">
            <span>
              {isAr
                ? 'بروتوكول الأطفال (1–8 سنوات): الركوع وضبط القوة'
                : 'Child Protocol (1–8 Years): Kneeling Alignment & Calibrated Thrusts'}
            </span>
            <span className="text-[#F3F7F8]">1:5.5 Pediatric</span>
          </div>
          <div className="relative z-10 p-4 pt-0 text-xs text-[#F3F7F8] border-t border-[#285064]/80 mt-auto bg-[#0B2D40]/90">
            {isAr
              ? 'ارتكز على ركبتيك خلف الطفل لمحاذاة مستوى خصره، وناوب بين 5 ضربات ظهرية و5 ضغطات بطنية.'
              : 'Kneel behind the child to align with their waist; alternate 5 back blows & 5 abdominal thrusts.'}
          </div>
        </div>
      );

    case 'infant-back-blows-chest-thrusts':
      return (
        <div
          className={`relative rounded-xl bg-[#071F2E] border border-[#285064] overflow-hidden flex flex-col justify-between ${className}`}
        >
          <img
            src={infantAnatomyImg}
            alt="Infant forearm back-blows medical illustration"
            className="absolute inset-0 w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071F2E] via-[#071F2E]/35 to-[#071F2E]/80" />
          <div className="relative z-10 p-4 flex items-center justify-between text-xs font-semibold text-[#43C7D1]">
            <span>
              {isAr
                ? 'بروتوكول الرضّع (أقل من سنة): يُمنع ضغط البطن'
                : 'Infant Protocol (<1 Year): NO Abdominal Thrusts'}
            </span>
            <span className="text-[#E9A23B]">5 + 5 Cycle</span>
          </div>
          <div className="relative z-10 p-4 pt-0 text-xs text-[#F3F7F8] border-t border-[#285064]/80 mt-auto bg-[#0B2D40]/90">
            {isAr
              ? 'إسناد الرضيع على الساعد ورأسه أخفض من صدره: 5 ضربات ظهرية + 5 ضغطات صدرية بإصبعين.'
              : 'Support prone on forearm head-lower-than-chest: 5 back blows + 5 two-finger sternal thrusts.'}
          </div>
        </div>
      );

    case 'common-mistakes-avoid':
      return (
        <div
          className={`rounded-xl bg-[#0B2D40] border border-[#285064] p-4 flex flex-col justify-between ${className}`}
        >
          <div className="text-xs font-bold text-[#DC5252]">
            {isAr
              ? 'ممارسات خاطئة وخطيرة يجب تجنبها تماماً'
              : 'Critical First-Aid Errors & Contraindications to Avoid'}
          </div>
          <div className="grid grid-cols-2 gap-2.5 my-auto">
            <div className="p-2.5 rounded-lg bg-[#123B50] border border-[#DC5252]/40">
              <div className="text-xs font-bold text-[#DC5252]">
                {isAr ? '✕ المسح العشوائي بالإصبع' : '✕ No Blind Finger Sweeps'}
              </div>
              <p className="text-[11px] text-[#A9C0CC] mt-0.5">
                {isAr
                  ? 'يدفع الجسم الغريب أعمق داخل الحنجرة؛ لا تلتقطه إلا إذا رأيته بوضوح.'
                  : 'Pushes objects deeper into the vocal cords. Remove ONLY if visible.'}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#123B50] border border-[#DC5252]/40">
              <div className="text-xs font-bold text-[#DC5252]">
                {isAr ? '✕ إعطاء الماء أو السوائل' : '✕ Never Offer Water'}
              </div>
              <p className="text-[11px] text-[#A9C0CC] mt-0.5">
                {isAr
                  ? 'الانسداد في القصبة الهوائية وليس المريء؛ الماء يزيد الاختناق.'
                  : 'Tracheal blockage cannot be washed down and risks aspiration.'}
              </p>
            </div>
          </div>
          <div className="text-[11px] text-[#A9C0CC]">
            {isAr
              ? 'المصدر: إرشادات منع الضرر — مجلس الإنعاش البريطاني (2025) والصليب الأحمر الأمريكي.'
              : 'Source: Resuscitation Council UK (2025) & American Red Cross Guidelines.'}
          </div>
        </div>
      );

    case 'unresponsive-cpr-transition':
      return (
        <div
          className={`rounded-xl bg-[#0B2D40] border border-[#285064] p-4 text-[#F3F7F8] flex flex-col justify-between ${className}`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-[#43C7D1]">
            <span>
              {isAr
                ? 'مسار فقدان الوعي: الانتقال الفوري للإنعاش حسب التدريب'
                : 'Unresponsive Pathway: Immediate CPR & Visual Airway Check'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 my-auto text-center">
            <div className="rounded-lg bg-[#123B50] border border-[#285064] p-2.5">
              <div className="text-sm font-bold text-[#43C7D1] tabular-nums">
                01
              </div>
              <div className="text-xs font-semibold mt-0.5">
                {isAr ? 'إنزال آمن وطوارئ' : 'Safe Lowering & EMS'}
              </div>
              <p className="text-[10px] text-[#A9C0CC] mt-0.5">
                {isAr ? 'على سطح صلب ومستوٍ' : 'Firm flat floor, protect head'}
              </p>
            </div>
            <div className="rounded-lg bg-[#123B50] border border-[#285064] p-2.5">
              <div className="text-sm font-bold text-[#43C7D1] tabular-nums">
                02
              </div>
              <div className="text-xs font-semibold mt-0.5">
                {isAr ? 'ابدأ الإنعاش حسب التدريب' : 'CPR per Training'}
              </div>
              <p className="text-[10px] text-[#A9C0CC] mt-0.5">
                {isAr
                  ? 'تولّد ضغطاً لطرد الجسم'
                  : 'Pressurizes lungs & circulates blood'}
              </p>
            </div>
            <div className="rounded-lg bg-[#123B50] border border-[#285064] p-2.5">
              <div className="text-sm font-bold text-[#43C7D1] tabular-nums">
                03
              </div>
              <div className="text-xs font-semibold mt-0.5">
                {isAr ? 'انظر داخل الفم' : 'Look in Mouth'}
              </div>
              <p className="text-[10px] text-[#A9C0CC] mt-0.5">
                {isAr
                  ? 'أزله فقط إن كان مرئياً'
                  : 'Remove ONLY if clearly visible'}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-[#A9C0CC] border-t border-[#285064] pt-1.5">
            {isAr
              ? 'توقف عن ضغطات البطن فور فقدان الوعي، واعتمد ضغطات الصدر مع الفحص البصري للفم.'
              : 'Stop abdominal thrusts once unresponsive; begin chest compressions immediately.'}
          </div>
        </div>
      );

    case 'prevention-safety-guide':
    default:
      return (
        <div
          className={`rounded-xl bg-[#0B2D40] border border-[#285064] p-4 flex flex-col justify-between ${className}`}
        >
          <div className="text-xs font-bold text-[#43C7D1]">
            {isAr
              ? 'الوقاية الأولية وسلامة الأطعمة للأطفال'
              : 'Primary Choking Prevention & Pediatric Food Safety'}
          </div>
          <div className="grid grid-cols-2 gap-3 my-auto">
            <div className="rounded-lg bg-[#123B50] border border-[#285064] p-2.5">
              <div className="text-xs font-semibold text-[#F3F7F8]">
                {isAr
                  ? 'تقطيع الأطعمة الكروية طولياً'
                  : 'Slice Round Foods Lengthwise'}
              </div>
              <p className="text-[11px] text-[#A9C0CC] mt-0.5">
                {isAr
                  ? 'قطّع العنب والطماطم الكرزية والنقانق طولياً إلى أرباع صغيرة للأطفال دون 4 سنوات.'
                  : 'Cut whole grapes, cherry tomatoes, and sausages lengthwise into quarters.'}
              </p>
            </div>
            <div className="rounded-lg bg-[#123B50] border border-[#285064] p-2.5">
              <div className="text-xs font-semibold text-[#F3F7F8]">
                {isAr
                  ? 'إبعاد الأجسام الدقيقة والبالونات'
                  : 'Keep Small Objects Out of Reach'}
              </div>
              <p className="text-[11px] text-[#A9C0CC] mt-0.5">
                {isAr
                  ? 'احفظ العملات وبطاريات الأزرار والبالونات المطاطية بعيداً عن متناول الرضّع.'
                  : 'Store coins, button batteries, nuts, and latex balloons away from infants.'}
              </p>
            </div>
          </div>
          <div className="text-[11px] text-[#A9C0CC]">
            {isAr
              ? 'الجلوس بهدوء أثناء تناول الطعام يمنع معظم حوادث الاستنشاق المفاجئ.'
              : 'Sitting upright without running or laughing while chewing prevents aspiration.'}
          </div>
        </div>
      );
  }
};
