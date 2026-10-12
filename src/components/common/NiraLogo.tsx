import React from 'react';

interface NiraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  className?: string;
  customLogoUrl?: string;
  onClick?: () => void;
}

export const NiraLogo: React.FC<NiraLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  customLogoUrl,
  onClick
}) => {
  // Size mapping
  const sizeConfig = {
    sm: { icon: 32, textNira: 'text-base', textInfo: 'text-[9px]', spacing: 'gap-2' },
    md: { icon: 42, textNira: 'text-xl', textInfo: 'text-[11px]', spacing: 'gap-2.5' },
    lg: { icon: 56, textNira: 'text-2xl', textInfo: 'text-xs', spacing: 'gap-3' },
    xl: { icon: 72, textNira: 'text-3xl', textInfo: 'text-sm', spacing: 'gap-3.5' },
    hero: { icon: 110, textNira: 'text-5xl', textInfo: 'text-lg', spacing: 'gap-5' }
  }[size];

  // If custom logo image is uploaded, render image
  if (customLogoUrl) {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center ${sizeConfig.spacing} select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <img
          src={customLogoUrl}
          alt="NIRA Infotech"
          referrerPolicy="no-referrer"
          className="object-contain rounded-xl drop-shadow-[0_0_20px_rgba(55,129,252,0.6)]"
          style={{ height: sizeConfig.icon, width: sizeConfig.icon }}
        />
        {showText && (
          <div className="flex flex-col leading-none">
            <span className={`font-black tracking-wider text-white drop-shadow-[0_2px_10px_rgba(55,129,252,0.6)] ${sizeConfig.textNira}`}>
              NIRA
            </span>
            <span className={`font-bold tracking-widest bg-gradient-to-r from-[#cbe9fd] via-[#3781fc] to-[#1951fc] bg-clip-text text-transparent uppercase ${sizeConfig.textInfo}`}>
              Infotech
            </span>
          </div>
        )}
      </div>
    );
  }

  // Render high-fidelity electric blue glass circuit monogram matching user's palette
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${sizeConfig.spacing} select-none group ${onClick ? 'cursor-pointer' : ''} ${className}`}
      role="banner"
      aria-label="NIRA Infotech Logo"
    >
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ width: sizeConfig.icon, height: sizeConfig.icon }}
      >
        {/* Ambient electric blue glass glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b2cb1]/60 via-[#1951fc]/50 to-[#3781fc]/60 rounded-2xl blur-lg -z-10 group-hover:opacity-100 opacity-80 transition-opacity" />

        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_8px_20px_rgba(25,81,252,0.5)]"
        >
          <defs>
            <linearGradient id="glassChassis" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0b2cb1" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#03195b" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#02081c" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="glassRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#cbe9fd" />
              <stop offset="70%" stopColor="#3781fc" />
              <stop offset="100%" stopColor="#1951fc" />
            </linearGradient>

            <linearGradient id="circuitElectric" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cbe9fd" />
              <stop offset="50%" stopColor="#3781fc" />
              <stop offset="100%" stopColor="#1951fc" />
            </linearGradient>

            <filter id="glassBevel" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Rounded base glass capsule */}
          <rect
            x="14"
            y="14"
            width="172"
            height="172"
            rx="38"
            fill="url(#glassChassis)"
            stroke="url(#glassRim)"
            strokeWidth="3"
          />

          {/* Specular glass reflection bar */}
          <path
            d="M 30 24 Q 100 18 170 24"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Inner subtle circuit tracks */}
          <path
            d="M30 60h30v40M170 140h-30v-40M100 25v25M100 150v25"
            stroke="#3781fc"
            strokeWidth="1.5"
            strokeOpacity="0.5"
            strokeDasharray="3 3"
          />

          {/* Intertwined 'NR' Circuit Emblem */}
          <path
            d="M 50 155 L 50 55 C 50 48 58 45 64 50 L 98 100 L 98 55 C 98 48 106 48 108 55 L 108 145 C 108 152 100 155 94 150 L 60 100 L 60 155 Z"
            fill="url(#glassRim)"
            filter="url(#glassBevel)"
          />

          <path
            d="M 102 55 L 138 55 C 158 55 165 72 155 90 C 148 98 138 100 128 100 L 158 150 C 162 156 154 160 148 155 L 122 108 L 102 108 Z"
            fill="url(#glassRim)"
            filter="url(#glassBevel)"
          />

          {/* Circuit inlay */}
          <path
            d="M 56 145 L 56 68 L 92 120 L 92 68"
            stroke="url(#circuitElectric)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Circuit nodes (dots) */}
          <circle cx="56" cy="145" r="4.5" fill="#cbe9fd" stroke="#3781fc" strokeWidth="1.5" />
          <circle cx="92" cy="68" r="4.5" fill="#3781fc" stroke="#cbe9fd" strokeWidth="1.5" />
          <circle cx="144" cy="142" r="4.5" fill="#cbe9fd" stroke="#0b2cb1" strokeWidth="1.5" />
          <circle cx="132" cy="68" r="4" fill="#3781fc" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center tracking-tight">
            <span
              className={`font-black tracking-wider text-white drop-shadow-[0_2px_12px_rgba(55,129,252,0.8)] ${sizeConfig.textNira}`}
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              NIRA
            </span>
          </div>
          <span
            className={`font-bold tracking-[0.24em] bg-gradient-to-r from-[#cbe9fd] via-[#3781fc] to-[#1951fc] bg-clip-text text-transparent uppercase drop-shadow-[0_0_8px_rgba(55,129,252,0.4)] ${sizeConfig.textInfo}`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Infotech
          </span>
        </div>
      )}
    </div>
  );
};
