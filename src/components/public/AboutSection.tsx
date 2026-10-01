import React from 'react';
import { SiteSettings } from '../../types/index.ts';
import { Target, Compass, Sparkles, User, ShieldCheck, Zap } from 'lucide-react';

interface AboutSectionProps {
  settings: SiteSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  return (
    <section id="about" className="py-12 md:py-16 border-t border-slate-800/80 bg-[#090d16] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase mb-2">
            Who We Are
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            About NIRA Infotech
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed text-balance">
            {settings.about ||
              'NIRA Infotech is a dedicated freelance web development and IT services agency. We combine modern engineering with clean design to build high-performance web applications that convert visitors into clients.'}
          </p>
        </div>

        {/* 3 Pillars Grid: What We Do, Approach, Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Card 1: What We Do */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">What We Do</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We engineer custom, responsive web solutions ranging from high-impact portfolio websites and corporate portals to full-stack web applications with authentication, databases, and client dashboards.
            </p>
          </div>

          {/* Card 2: Mission */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-sky-950 border border-sky-800/60 flex items-center justify-center text-sky-400 mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">Our Mission</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings.mission ||
                'To engineer reliable, visually compelling, and performant digital solutions that empower small businesses, developers, and visionaries to succeed online.'}
            </p>
          </div>

          {/* Card 3: Vision */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-fuchsia-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-fuchsia-950 border border-fuchsia-800/60 flex items-center justify-center text-fuchsia-400 mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">Our Vision</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings.vision ||
                'To become a globally trusted partner for modern full-stack web applications, recognized for speed, architectural clarity, and outstanding client collaboration.'}
            </p>
          </div>
        </div>

        {/* Founder & Lead Developer Spotlight */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#0e172a] to-slate-900/90 border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-3 flex justify-center">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-sky-600/30 to-fuchsia-600/20 border-2 border-cyan-400/40 flex items-center justify-center shadow-xl overflow-hidden relative">
                {settings.founder_avatar ? (
                  <img
                    src={settings.founder_avatar}
                    alt={settings.founder_name || 'Founder'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-cyan-300" />
                )}
              </div>
            </div>

            <div className="md:col-span-9 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-mono font-medium mb-2">
                <span>Direct Freelance Collaboration</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-100">
                {settings.founder_name || 'Nirav Patel'}
              </h3>
              <p className="text-sm font-medium text-cyan-400 mt-0.5 mb-3">
                {settings.founder_role || 'Founder & Full Stack IT Specialist'}
              </p>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                {settings.founder_bio ||
                  'Experienced full-stack software developer passionate about building reliable software with React, Node.js, Express, and Supabase. Every project is developed with hand-crafted attention to speed, responsiveness, and seamless content management.'}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Code Quality Guarantee</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Continuous Support & Handover</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="font-semibold text-white">Location:</span> {settings.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
