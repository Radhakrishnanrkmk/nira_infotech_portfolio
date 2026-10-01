import React from 'react';
import { NiraLogo } from '../common/NiraLogo.tsx';
import { SiteSettings } from '../../types/index.ts';
import { MessageSquare, ArrowRight, Code2, Database, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';

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
    <section id="home" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background Lighting & Circuit Ambient Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-sky-500/10 to-fuchsia-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start text-left">
          {/* Editorial Kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-800/60 text-cyan-300 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>{settings.hero_kicker || 'Full Stack Web Development & IT Solutions'}</span>
          </div>

          {/* Brand Title with Generous Margin */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-100 tracking-tight leading-[1.1] mb-5 text-balance">
            {settings.business_name || 'NIRA Infotech'}
          </h1>

          {/* Sub-Heading / Tagline with Generous Margin */}
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400 bg-clip-text text-transparent mb-6">
            {settings.hero_title || 'Modern Websites. Smart Digital Solutions.'}
          </p>

          {/* Short Description with Generous Margin */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-3xl mb-10">
            {settings.hero_description ||
              'Building modern, responsive and professional websites and web applications for businesses, students, startups and individuals.'}
          </p>

          {/* 4 Action Buttons with comfortable margins & padding */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 w-full sm:w-auto">
            <a
              href="#projects"
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl shadow-lg shadow-cyan-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>View My Work</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#services"
              className="flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-200 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 rounded-xl transition-colors"
            >
              <span>Our Services</span>
            </a>

            <a
              href="#contact"
              className="flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-800/60 rounded-xl transition-colors"
            >
              <span>Contact Me</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/50 hover:bg-emerald-950/80 border border-emerald-800/60 rounded-xl transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
