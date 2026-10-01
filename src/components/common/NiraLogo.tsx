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
          className="object-contain rounded-lg drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          style={{ height: sizeConfig.icon, width: sizeConfig.icon }}
        />
        {showText && (
          <div className="flex flex-col leading-none">
            <span className={`font-extrabold tracking-wider bg-gradient-to-r from-slate-100 via-cyan-100 to-slate-200 bg-clip-text text-transparent ${sizeConfig.textNira}`}>
              NIRA
            </span>
            <span className={`font-medium tracking-widest text-cyan-400 uppercase ${sizeConfig.textInfo}`}>
              Infotech
            </span>
          </div>
        )}
      </div>
    );
  }

  // Render high-fidelity metallic circuit monogram matching uploaded brand emblem
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${sizeConfig.spacing} select-none group ${onClick ? 'cursor-pointer' : ''} ${className}`}
      role="banner"
    >
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ width: sizeConfig.icon, height: sizeConfig.icon }}
      >
        {/* Ambient neon backdrop glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-sky-500/20 to-fuchsia-600/30 rounded-2xl blur-md -z-10 group-hover:opacity-100 opacity-80 transition-opacity" />

        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
        >
          <defs>
            {/* Chrome metallic gradient */}
            <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#D8E2EC" />
              <stop offset="50%" stopColor="#8FA0B5" />
              <stop offset="75%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            {/* Neon circuit gradient */}
            <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#E024C3" />
            </linearGradient>

            {/* Deep chassis fill */}
            <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0B132B" />
            </linearGradient>

            {/* Outer metallic shadow */}
            <filter id="metallicBevel" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Rounded base badge */}
          <rect
            x="14"
            y="14"
            width="172"
            height="172"
            rx="36"
            fill="url(#chassisGrad)"
            stroke="url(#chromeGrad)"
            strokeWidth="3.5"
          />

          {/* Subtle inner circuit track grid */}
          <path
            d="M30 60h30v40M170 140h-30v-40M100 25v25M100 150v25"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeOpacity="0.3"
            strokeDasharray="3 3"
          />

          {/* Intertwined 'NR' Circuit Emblem */}
          {/* N left stem with bracket & React node */}
          <path
            d="M 50 155 L 50 55 C 50 48 58 45 64 50 L 98 100 L 98 55 C 98 48 106 48 108 55 L 108 145 C 108 152 100 155 94 150 L 60 100 L 60 155 Z"
            fill="url(#chromeGrad)"
            filter="url(#metallicBevel)"
          />

          {/* R right loop & diagonal leg */}
          <path
            d="M 102 55 L 138 55 C 158 55 165 72 155 90 C 148 98 138 100 128 100 L 158 150 C 162 156 154 160 148 155 L 122 108 L 102 108 Z"
            fill="url(#chromeGrad)"
            filter="url(#metallicBevel)"
          />

          {/* Inner Cyan Circuit Inlay for N */}
          <path
            d="M 56 145 L 56 68 L 92 120 L 92 68"
            stroke="url(#circuitGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Inner Neon Inlay for R */}
          <path
            d="M 112 68 L 132 68 C 144 68 148 78 142 86 C 138 92 130 94 120 94 L 112 94 M 122 96 L 144 142"
            stroke="url(#circuitGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Circuit nodes (dots) */}
          <circle cx="56" cy="145" r="4.5" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="92" cy="68" r="4.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="144" cy="142" r="4.5" fill="#E024C3" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="132" cy="68" r="4" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* React atom icon snippet */}
          <ellipse cx="74" cy="94" rx="7" ry="2.5" transform="rotate(-30 74 94)" stroke="#00E5FF" strokeWidth="1.2" fill="none" />
          <ellipse cx="74" cy="94" rx="7" ry="2.5" transform="rotate(30 74 94)" stroke="#00E5FF" strokeWidth="1.2" fill="none" />
          <circle cx="74" cy="94" r="1.5" fill="#FFFFFF" />

          {/* Database disk layer snippet */}
          <path d="M 52 128 c 0 -2 8 -2 8 0 v 4 c 0 2 -8 2 -8 0 z" fill="#38BDF8" opacity="0.9" />
          <path d="M 52 134 c 0 -2 8 -2 8 0 v 4 c 0 2 -8 2 -8 0 z" fill="#38BDF8" opacity="0.9" />

          {/* Git branch node */}
          <circle cx="132" cy="80" r="2.5" fill="#FFFFFF" />
          <path d="M 132 82 v 8" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="132" cy="90" r="2.5" fill="#E024C3" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center tracking-tight">
            <span
              className={`font-black tracking-wider bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${sizeConfig.textNira}`}
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              NIRA
            </span>
          </div>
          <span
            className={`font-semibold tracking-[0.22em] bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400 bg-clip-text text-transparent uppercase ${sizeConfig.textInfo}`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Infotech
          </span>
        </div>
      )}
    </div>
  );
};
