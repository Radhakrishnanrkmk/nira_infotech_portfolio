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

  // Determine thematic visual styling based on project title/category
  const isQrSystem = title.toLowerCase().includes('qr') || title.toLowerCase().includes('food');
  const isBusiness = title.toLowerCase().includes('business') || category.toLowerCase().includes('business');
  const isCrm = title.toLowerCase().includes('crm') || title.toLowerCase().includes('flow');

  if (posterUrl && !hasError) {
    return (
      <div className={`relative w-full overflow-hidden bg-slate-900 ${getAspectClass()} ${className}`}>
        <img
          src={posterUrl}
          alt={title}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // High-fidelity styled fallback graphic poster
  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-br from-slate-900 via-[#0d1627] to-[#131b2e] border-b border-slate-800/80 flex flex-col justify-between p-5 select-none ${getAspectClass()} ${className}`}
    >
      {/* Background cyber grid & glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top row: category kicker & status indicator */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-medium">
          {isQrSystem ? <QrCode className="w-3.5 h-3.5" /> : isBusiness ? <Globe className="w-3.5 h-3.5" /> : isCrm ? <Cpu className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
          <span>{category}</span>
        </div>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      </div>

      {/* Center artwork: schematic tech frame */}
      <div className="relative z-10 my-auto py-2">
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 backdrop-blur-sm shadow-xl flex items-center gap-3 max-w-[280px]">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            {isQrSystem ? <QrCode className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-slate-100 truncate">{title}</h4>
            <p className="text-[11px] text-slate-400 font-mono truncate">nira-infotech.app/live</p>
          </div>
        </div>
      </div>

      {/* Bottom row: decorative footer bar */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800/60">
        <span>NIRA · PRODUCTION BUILD</span>
        <span className="flex items-center gap-1 text-slate-300">
          <span>Live Preview</span>
          <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
