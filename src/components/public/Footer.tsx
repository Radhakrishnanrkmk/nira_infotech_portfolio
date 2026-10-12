import React from 'react';
import { SiteSettings } from '../../types/index.ts';
import { NiraLogo } from '../common/NiraLogo.tsx';
import { Github, Linkedin, Instagram, Facebook, Lock, ArrowUp, Send, Heart } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#3781fc]/25 bg-gradient-to-b from-[#020718]/85 to-[#010410]/95 text-slate-300 py-10 md:py-12 relative backdrop-blur-2xl">
      {/* Ambient background glow orb */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[200px] bg-gradient-to-r from-[#03195b]/40 via-[#1951fc]/20 to-[#0b2cb1]/30 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* Col 1: Brand Wordmark & Mission */}
          <div className="md:col-span-5 space-y-3.5">
            <NiraLogo size="md" customLogoUrl={settings.logo_url} />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              Modern full-stack web applications and IT services built with React, Node.js, Express, and Supabase. Clean code, fast delivery, and effortless CMS management.
            </p>

            {/* Social Links with frosted glass pills */}
            <div className="flex items-center gap-2 pt-1">
              {settings.github && (
                <a
                  href={settings.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-[#08173d]/60 hover:bg-[#0f2862] border border-[#3781fc]/35 text-[#cbe9fd] hover:text-white backdrop-blur-md shadow-[0_0_15px_rgba(25,81,252,0.25)] transition-all hover:scale-105"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings.linkedin && (
                <a
                  href={settings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-[#08173d]/60 hover:bg-[#0f2862] border border-[#3781fc]/35 text-[#cbe9fd] hover:text-white backdrop-blur-md shadow-[0_0_15px_rgba(25,81,252,0.25)] transition-all hover:scale-105"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-[#08173d]/60 hover:bg-[#0f2862] border border-[#3781fc]/35 text-[#cbe9fd] hover:text-pink-400 backdrop-blur-md shadow-[0_0_15px_rgba(25,81,252,0.25)] transition-all hover:scale-105"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-[#08173d]/60 hover:bg-[#0f2862] border border-[#3781fc]/35 text-[#cbe9fd] hover:text-[#3781fc] backdrop-blur-md shadow-[0_0_15px_rgba(25,81,252,0.25)] transition-all hover:scale-105"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-bold text-[#cbe9fd] uppercase tracking-wider drop-shadow-[0_0_8px_rgba(55,129,252,0.5)]">
              Navigation
            </p>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="#home" className="text-slate-300 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-slate-300 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#skills" className="text-slate-300 hover:text-white transition-colors">
                  Technical Stack
                </a>
              </li>
              <li>
                <a href="#services" className="text-slate-300 hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#projects" className="text-slate-300 hover:text-white transition-colors">
                  Featured Projects
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-300 hover:text-white transition-colors">
                  Contact & Quote
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services Summary */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-xs font-bold text-[#cbe9fd] uppercase tracking-wider drop-shadow-[0_0_8px_rgba(55,129,252,0.5)]">
              Core Offerings
            </p>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3781fc]" />
                <span>Modern Responsive Websites</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3781fc]" />
                <span>Student & Freelancer Portfolios</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3781fc]" />
                <span>QR Code & Scanning Systems</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3781fc]" />
                <span>Full Stack Node + Supabase Apps</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3781fc]" />
                <span>Admin CMS & Content Automation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#3781fc]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{settings.footer_text || '© 2026 NIRA Infotech. All rights reserved.'}</p>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#08173d]/50 hover:bg-[#0f2862]/70 border border-[#3781fc]/30 text-xs text-[#cbe9fd] hover:text-white transition-all cursor-pointer shadow-[0_0_12px_rgba(25,81,252,0.2)]"
            >
              <Lock className="w-3 h-3 text-[#3781fc]" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-[#08173d]/60 hover:bg-[#1951fc]/40 border border-[#3781fc]/35 text-[#cbe9fd] hover:text-white backdrop-blur-md shadow-[0_0_15px_rgba(25,81,252,0.25)] transition-all cursor-pointer hover:scale-105"
              title="Back to Top"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
