import React from 'react';
import { SiteSettings } from '../../types/index.ts';
import { Target, Compass, Sparkles, User, ShieldCheck, Zap } from 'lucide-react';

interface AboutSectionProps {
  settings: SiteSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  return (
    <section id="about" className="py-12 md:py-16 border-t border-[#3781fc]/20 bg-[#020614] relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-[#03195b]/40 via-[#1951fc]/20 to-[#0b2cb1]/40 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs font-bold text-[#cbe9fd] tracking-wider uppercase mb-1.5 drop-shadow-[0_0_10px_rgba(55,129,252,0.6)]">
            Who We Are
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_15px_rgba(25,81,252,0.3)]">
            About NIRA Infotech
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-slate-300 leading-relaxed text-balance">
            {settings.about ||
              'NIRA Infotech is a dedicated freelance web development and IT services agency. We combine modern engineering with clean design to build high-performance web applications that convert visitors into clients.'}
          </p>
        </div>

        {/* 3 Pillars Grid: What We Do, Approach, Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* Card 1: What We Do */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-[#3781fc]/25 backdrop-blur-xl shadow-[0_8px_30px_rgba(3,25,91,0.4)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.25)] hover:border-[#3781fc]/60 hover:shadow-[0_12px_40px_rgba(25,81,252,0.35)] transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1951fc]/30 to-[#3781fc]/20 border border-[#cbe9fd]/35 text-[#cbe9fd] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(25,81,252,0.35)]">
                <Sparkles className="w-5 h-5 text-[#cbe9fd]" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">What We Do</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We engineer custom, responsive web solutions ranging from high-impact portfolio websites and corporate portals to full-stack web applications with authentication, databases, and client dashboards.
              </p>
            </div>
          </div>

          {/* Card 2: Mission */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-[#3781fc]/25 backdrop-blur-xl shadow-[0_8px_30px_rgba(3,25,91,0.4)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.25)] hover:border-[#3781fc]/60 hover:shadow-[0_12px_40px_rgba(25,81,252,0.35)] transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1951fc]/30 to-[#3781fc]/20 border border-[#cbe9fd]/35 text-[#cbe9fd] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(25,81,252,0.35)]">
                <Target className="w-5 h-5 text-[#cbe9fd]" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Our Mission</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {settings.mission ||
                  'To engineer reliable, visually compelling, and performant digital solutions that empower small businesses, developers, and visionaries to succeed online.'}
              </p>
            </div>
          </div>

          {/* Card 3: Vision */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-[#3781fc]/25 backdrop-blur-xl shadow-[0_8px_30px_rgba(3,25,91,0.4)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.25)] hover:border-[#3781fc]/60 hover:shadow-[0_12px_40px_rgba(25,81,252,0.35)] transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1951fc]/30 to-[#3781fc]/20 border border-[#cbe9fd]/35 text-[#cbe9fd] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(25,81,252,0.35)]">
                <Compass className="w-5 h-5 text-[#cbe9fd]" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Our Vision</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {settings.vision ||
                  'To become a globally trusted partner for modern full-stack web applications, recognized for speed, architectural clarity, and outstanding client collaboration.'}
              </p>
            </div>
          </div>
        </div>

        {/* Founder & Lead Developer Spotlight */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#07163c]/70 via-[#0a1e4e]/60 to-[#07163c]/70 border border-[#3781fc]/30 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(3,25,91,0.5)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.3)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-3 flex justify-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#03195b] via-[#1951fc] to-[#3781fc] p-1 flex items-center justify-center shadow-[0_0_25px_rgba(25,81,252,0.5)] overflow-hidden relative">
                <div className="w-full h-full rounded-xl overflow-hidden bg-[#071433] flex items-center justify-center">
                  {settings.founder_avatar ? (
                    <img
                      src={settings.founder_avatar}
                      alt={settings.founder_name || 'Founder'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-[#cbe9fd]" />
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-9 text-center md:text-left">
              {/* Unboxed Kicker */}
              <div className="text-xs font-bold text-[#cbe9fd] tracking-wider uppercase mb-1">
                Direct Freelance Collaboration
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {settings.founder_name || 'Nirav Patel'}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#3781fc] mt-0.5 mb-2.5">
                {settings.founder_role || 'Founder & Full Stack IT Specialist'}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                {settings.founder_bio ||
                  'Experienced full-stack software developer passionate about building reliable software with React, Node.js, Express, and Supabase. Every project is developed with hand-crafted attention to speed, responsiveness, and seamless content management.'}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Quality Guarantee</span>
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="flex items-center gap-1.5 font-medium text-slate-200">
                  <Zap className="w-4 h-4 text-[#3781fc]" />
                  <span>Continuous Support</span>
                </span>
                {settings.location && (
                  <>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-300">
                      <span className="font-semibold text-white">Location:</span> {settings.location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
