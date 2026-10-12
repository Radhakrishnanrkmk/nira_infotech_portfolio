import React from 'react';
import { SiteSettings } from '../../types/index.ts';
import { MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  settings: SiteSettings;
  projectsCount: number;
}

export const Hero: React.FC<HeroProps> = ({ settings, projectsCount }) => {
  const cleanPhone = (settings.whatsapp || settings.phone || '').replace(/[^0-9]/g, '');
  const defaultMsg = encodeURIComponent(
    settings.whatsapp_message || 'Hello NIRA Infotech, I am interested in your website development services.'
  );
  const whatsappUrl = `https://wa.me/${cleanPhone || '919876543210'}?text=${defaultMsg}`;

  return (
    <section id="home" className="relative pt-12 pb-16 md:pt-18 md:pb-24 overflow-hidden border-b border-[#3781fc]/20 bg-[#020614]">
      {/* 3D Glassmorphic Ambient Glow Spheres matching the user palette */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-gradient-to-tr from-[#03195b]/70 via-[#0b2cb1]/50 to-[#1951fc]/40 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[400px] bg-gradient-to-bl from-[#1951fc]/35 via-[#3781fc]/30 to-[#03195b]/50 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[350px] h-[250px] bg-[#cbe9fd]/10 rounded-full blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start text-left">
          {/* Editorial Glass Pill Kicker */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0a1838]/60 border border-[#3781fc]/40 text-[#cbe9fd] text-xs font-semibold backdrop-blur-xl shadow-[0_0_20px_rgba(25,81,252,0.35)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.3)] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#3781fc] shadow-[0_0_8px_#3781fc] animate-pulse" />
            <span>{settings.hero_kicker || 'Full Stack Web Engineering & IT Solutions'}</span>
          </div>

          {/* Brand & Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-3 text-balance drop-shadow-[0_4px_30px_rgba(25,81,252,0.4)]">
            {settings.business_name || 'NIRA Infotech'}
          </h1>

          {/* Sub-Heading with Electric Blue Glass Gradient */}
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-[#cbe9fd] via-[#3781fc] to-[#1951fc] bg-clip-text text-transparent mb-4 drop-shadow-[0_2px_15px_rgba(55,129,252,0.5)]">
            {settings.hero_title || 'Modern Websites. Smart Digital Solutions.'}
          </p>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
            {settings.hero_description ||
              'Building modern, responsive and professional websites and web applications for businesses, students, startups and individuals.'}
          </p>

          {/* Glassmorphic Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mb-10">
            <a
              href="#projects"
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#1951fc] to-[#3781fc] hover:from-[#2563eb] hover:to-[#60a5fa] rounded-xl border border-[#cbe9fd]/40 shadow-[0_0_25px_rgba(25,81,252,0.5)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>View Projects</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#cbe9fd]" />
            </a>

            <a
              href="#services"
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-[#cbe9fd] bg-[#0b1c44]/55 hover:bg-[#0f2862]/65 border border-[#3781fc]/35 rounded-xl backdrop-blur-xl shadow-[0_4px_20px_rgba(3,25,91,0.4)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.2)] transition-all"
            >
              <span>Our Services</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600/90 hover:bg-emerald-500 rounded-xl border border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.35)] backdrop-blur-md transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href="#contact"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#cbe9fd] hover:text-white hover:bg-[#1951fc]/20 rounded-xl border border-transparent hover:border-[#3781fc]/30 transition-all"
            >
              <span>Contact Us</span>
            </a>
          </div>

          {/* Glass Highlights Panel */}
          <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#07163c]/60 via-[#0a1e4e]/50 to-[#07163c]/60 border border-[#3781fc]/25 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(3,25,91,0.4)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.25)]">
            <div className="flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-300">
              <span className="flex items-center gap-2 text-slate-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#3781fc]" />
                <span>React & Node.js Architecture</span>
              </span>
              <span className="hidden sm:inline text-slate-600" aria-hidden="true">·</span>
              <span className="flex items-center gap-2 text-slate-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Supabase Cloud Database</span>
              </span>
              <span className="hidden sm:inline text-slate-600" aria-hidden="true">·</span>
              <span className="flex items-center gap-2 text-slate-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#cbe9fd]" />
                <span>100% Mobile-Responsive</span>
              </span>
              {projectsCount > 0 && (
                <>
                  <span className="hidden sm:inline text-slate-600" aria-hidden="true">·</span>
                  <span className="text-[#cbe9fd] font-bold drop-shadow-[0_0_8px_rgba(55,129,252,0.6)]">
                    {projectsCount} Active Projects
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
