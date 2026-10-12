import React, { useState } from 'react';
import { Layers, Globe, QrCode, Cpu, Terminal, ExternalLink } from 'lucide-react';

interface ProjectPosterProps {
  posterUrl?: string;
  title: string;
  category?: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'wide';
}

export const ProjectPoster: React.FC<ProjectPosterProps> = ({
  posterUrl,
  title,
  category = 'Full Stack',
  className = '',
  aspectRatio = 'video'
}) => {
  const [hasError, setHasError] = useState(false);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'wide': return 'aspect-[16/9]';
      case 'video':
      default: return 'aspect-[16/10]';
    }
  };

  const isQrSystem = title.toLowerCase().includes('qr') || title.toLowerCase().includes('food');
  const isBusiness = title.toLowerCase().includes('business') || category.toLowerCase().includes('business');
  const isCrm = title.toLowerCase().includes('crm') || title.toLowerCase().includes('flow');

  if (posterUrl && !hasError) {
    return (
      <div className={`relative w-full overflow-hidden bg-[#03091e] ${getAspectClass()} ${className}`}>
        <img
          src={posterUrl}
          alt={title}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020614]/80 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // Electric Blue Glass Capsule Artwork matching user's uploaded palette image
  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-br from-[#03195b] via-[#081b49] to-[#01081c] border-b border-[#3781fc]/30 flex flex-col justify-between p-5 select-none ${getAspectClass()} ${className}`}
    >
      {/* Specular glass reflection & glowing orbs */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-[#1951fc]/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#3781fc]/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top row: category kicker & status indicator */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-[#cbe9fd] font-bold drop-shadow-[0_0_8px_rgba(55,129,252,0.6)]">
          {isQrSystem ? <QrCode className="w-3.5 h-3.5 text-[#3781fc]" /> : isBusiness ? <Globe className="w-3.5 h-3.5 text-[#3781fc]" /> : isCrm ? <Cpu className="w-3.5 h-3.5 text-[#3781fc]" /> : <Layers className="w-3.5 h-3.5 text-[#3781fc]" />}
          <span>{category}</span>
        </div>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3781fc] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#cbe9fd]" />
        </span>
      </div>

      {/* Center artwork: 3D translucent glass capsule matching uploaded image */}
      <div className="relative z-10 my-auto py-2 flex justify-center">
        <div className="w-full max-w-[270px] p-3.5 rounded-2xl bg-gradient-to-r from-[#0b2cb1]/50 via-[#1951fc]/30 to-[#3781fc]/40 border border-[#cbe9fd]/35 backdrop-blur-xl shadow-[0_8px_32px_rgba(3,25,91,0.5)] shadow-[inset_0_1px_2px_rgba(203,233,253,0.5)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1951fc] to-[#3781fc] border border-[#cbe9fd]/40 flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(55,129,252,0.5)]">
            {isQrSystem ? <QrCode className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-white truncate drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{title}</h4>
            <p className="text-[11px] text-[#cbe9fd] font-semibold truncate">nira-infotech.app/live</p>
          </div>
        </div>
      </div>

      {/* Bottom row: clean glass footer bar */}
      <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-[#3781fc]/20">
        <span className="text-[#cbe9fd] font-semibold">Interactive Demo</span>
        <span className="flex items-center gap-1 text-[#3781fc] font-bold">
          <span>Preview</span>
          <ExternalLink className="w-3 h-3 text-[#cbe9fd]" />
        </span>
      </div>
    </div>
  );
};
