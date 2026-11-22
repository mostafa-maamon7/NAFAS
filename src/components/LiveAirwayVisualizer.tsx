import React from 'react';
import { AgeCategory, AirwayVisualMode, Language } from '../types/nafas';

interface LiveAirwayVisualizerProps {
  mode: AirwayVisualMode;
  ageCategory: AgeCategory;
  spo2: number;
  language: Language;
  /** Keep colors neutral clinical navy/teal during live acting out to prevent spoiling the verdict */
  neutralMode?: boolean;
}

export const LiveAirwayVisualizer: React.FC<LiveAirwayVisualizerProps> = ({
  mode,
  ageCategory,
  spo2,
  language,
  neutralMode = false,
}) => {
  const isAr = language === 'ar';

  const isOpen = mode === 'normal_open' || mode === 'resolved_breathing';
  const isClearing =
    mode === 'thrust_expel' ||
    mode === 'back_blow_clear' ||
    mode === 'chest_thrust_clear' ||
    mode === 'cpr_compressions';
  const isPartial = mode === 'partial_cough';
  const isHazard =
    mode === 'water_aspiration' ||
    mode === 'blind_sweep_worse' ||
    mode === 'xiphoid_hazard' ||
    mode === 'infant_liver_hazard' ||
    mode === 'delayed_hypoxia';

  // Position of foreign body bolus along trachea Y axis
  const bolusY =
    isOpen
      ? 34
      : isClearing
      ? 62
      : mode === 'blind_sweep_worse'
      ? 114
      : isPartial
      ? 92
      : 100;

  const bolusOpacity = isOpen ? 0 : isClearing ? 0.65 : 1;

  // Airway flow visual stroke color
  const flowColor = neutralMode
    ? '#43C7D1'
    : isOpen || isClearing
    ? '#43C7D1'
    : isPartial
    ? '#E9A23B'
    : '#DC5252';

  const lungFill = neutralMode
    ? 'rgba(67, 199, 209, 0.22)'
    : isOpen || isClearing
    ? 'rgba(22, 163, 106, 0.22)'
    : isPartial
    ? 'rgba(233, 162, 59, 0.22)'
    : 'rgba(220, 82, 82, 0.24)';

  const lungStroke = neutralMode
    ? '#43C7D1'
    : isOpen || isClearing
    ? '#16A36A'
    : isPartial
    ? '#E9A23B'
    : '#DC5252';

  const statusLabel: Record<AirwayVisualMode, { en: string; ar: string }> = {
    normal_open: { en: 'Airway Clear', ar: 'مجرى الهواء مفتوح' },
    partial_cough: { en: 'Partial Flow · Cough', ar: 'تدفق جزئي · سعال' },
    severe_blocked: { en: 'Trachea Blocked', ar: 'القصبة مسدودة' },
    thrust_expel: { en: 'Diaphragm Surge', ar: 'اندفاع الحجاب الحاجز' },
    back_blow_clear: { en: 'Forward Clearance', ar: 'دفع للأمام' },
    chest_thrust_clear: { en: 'Chest Pressure Wave', ar: 'موجة ضغط صدري' },
    cpr_compressions: { en: 'CPR Compressions', ar: 'ضغطات الإنعاش' },
    water_aspiration: { en: 'Fluid In Airway', ar: 'سائل في مجرى التنفس' },
    blind_sweep_worse: { en: 'Pushed Deeper', ar: 'انحشار أعمق' },
    xiphoid_hazard: { en: 'Sternum Stress', ar: 'ضغط على عظمة القص' },
    infant_liver_hazard: { en: 'Organ Stress', ar: 'ضغط على أعضاء حساسة' },
    delayed_hypoxia: { en: 'Low Air Exchange', ar: 'نقص تبادل الهواء' },
    resolved_breathing: { en: 'Breathing Restored', ar: 'عودة التنفس الطبيعي' },
  };

  const bolusColor =
    ageCategory === 'child'
      ? '#E9A23B'
      : ageCategory === 'infant'
      ? '#E9A23B'
      : '#DC5252';

  return (
    <div
      className="bg-[#0B2D40]/95 border border-[#285064] rounded-2xl p-3 text-[#F3F7F8] w-44 sm:w-48 select-none shadow-lg"
      aria-label={isAr ? 'مخطط حي لمجرى التنفس' : 'Live Airway Cross-Section'}
    >
      {/* Top Header + SpO2 */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#285064]">
        <span className="text-[11px] font-semibold text-[#43C7D1] truncate">
          {isAr ? 'مجرى التنفس' : 'Airway Telemetry'}
        </span>
        <span className="text-xs font-extrabold tabular-nums text-[#F3F7F8]">
          SpO₂ {spo2}%
        </span>
      </div>

      {/* Crisp Animated Anatomical Cross-Section SVG */}
      <div className="relative my-1.5 flex items-center justify-center">
        <svg
          viewBox="0 0 160 155"
          className="w-full h-28 sm:h-32 overflow-visible"
          role="img"
          aria-hidden="true"
        >
          {/* Subtle torso silhouette */}
          <path
            d="M36 146 C36 96 42 74 58 64 L66 50 L66 18 C66 12 94 12 94 18 L94 50 L102 64 C118 74 124 96 124 146 Z"
            fill="rgba(25, 70, 91, 0.35)"
            stroke="#285064"
            strokeWidth="1.5"
          />

          {/* Lungs Left & Right */}
          <path
            d="M72 86 C52 86 42 104 44 128 C46 138 64 140 72 130 Z"
            fill={lungFill}
            stroke={lungStroke}
            strokeWidth="1.6"
            className="transition-all duration-500"
          />
          <path
            d="M88 86 C108 86 118 104 116 128 C114 138 96 140 88 130 Z"
            fill={lungFill}
            stroke={lungStroke}
            strokeWidth="1.6"
            className="transition-all duration-500"
          />

          {/* Trachea Tube */}
          <path
            d="M74 22 L74 96 L65 108 M86 22 L86 96 L95 108"
            fill="none"
            stroke="#A9C0CC"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Tracheal rings */}
          {[36, 48, 60, 72, 84].map((y) => (
            <line
              key={y}
              x1="75"
              y1={y}
              x2="85"
              y2={y}
              stroke="#285064"
              strokeWidth="1.2"
            />
          ))}

          {/* Animated Airflow Stream */}
          {(isOpen || isPartial || isClearing) && (
            <path
              d={
                isClearing
                  ? 'M80 120 L80 28'
                  : 'M80 22 L80 96 L68 112 M80 96 L92 112'
              }
              fill="none"
              stroke={flowColor}
              strokeWidth={isPartial ? '2' : '2.8'}
              strokeDasharray="6 6"
              strokeLinecap="round"
              className="anim-airflow"
            />
          )}

          {/* Water Aspiration Pool */}
          {mode === 'water_aspiration' && (
            <path
              d="M75 68 L85 68 L85 96 L75 96 Z"
              fill="rgba(67, 199, 209, 0.55)"
            />
          )}

          {/* Foreign Body Bolus */}
          <g
            style={{
              transform: `translateY(${bolusY - 96}px)`,
              opacity: bolusOpacity,
              transition:
                'transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 450ms ease',
            }}
          >
            <circle
              cx="80"
              cy="96"
              r={ageCategory === 'infant' ? '5.2' : '6.2'}
              fill={bolusColor}
              stroke="#F3F7F8"
              strokeWidth="1.4"
            />
          </g>

          {/* Diaphragm Curve & Thrust Upward Vector */}
          <path
            d={
              mode === 'thrust_expel'
                ? 'M45 138 Q80 116 115 138'
                : 'M45 142 Q80 132 115 142'
            }
            fill="none"
            stroke={mode === 'thrust_expel' ? '#43C7D1' : '#A9C0CC'}
            strokeWidth="2.2"
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* Upward force arrows for thrust/chest/CPR maneuvers */}
          {isClearing && (
            <g
              stroke="#43C7D1"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M80 132 L80 114" />
              <path d="M74 120 L80 113 L86 120" />
            </g>
          )}

          {/* Anatomical Hazard Marker (Xiphoid or Infant Liver) */}
          {(mode === 'xiphoid_hazard' || mode === 'infant_liver_hazard') && (
            <g>
              <circle
                cx={mode === 'infant_liver_hazard' ? '64' : '80'}
                cy={mode === 'infant_liver_hazard' ? '138' : '118'}
                r="10"
                fill="rgba(233, 162, 59, 0.25)"
                stroke="#E9A23B"
                strokeWidth="1.8"
                strokeDasharray="3 2"
              />
            </g>
          )}

          {/* Blind Finger Push Downward Vector */}
          {mode === 'blind_sweep_worse' && (
            <g
              stroke="#E9A23B"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M80 42 L80 86" />
              <path d="M74 80 L80 88 L86 80" />
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Live Status Line */}
      <div className="pt-1.5 border-t border-[#285064] flex items-center justify-between gap-1.5">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{
            backgroundColor: neutralMode
              ? '#43C7D1'
              : isHazard || mode === 'severe_blocked'
              ? '#DC5252'
              : isPartial
              ? '#E9A23B'
              : '#16A36A',
          }}
        />
        <span className="text-[11px] font-semibold text-[#F3F7F8] truncate flex-1">
          {statusLabel[mode][language]}
        </span>
      </div>
    </div>
  );
};
