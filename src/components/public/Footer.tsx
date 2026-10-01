import React from 'react';
import { SiteSettings } from '../../types/index.ts';
import { NiraLogo } from '../common/NiraLogo.tsx';
import { Github, Linkedin, Instagram, Facebook, Twitter, Lock, ArrowUp } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800 bg-[#070b14] text-slate-400 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Col 1: Brand Wordmark & Mission */}
          <div className="md:col-span-5 space-y-4">
            <NiraLogo size="md" customLogoUrl={settings.logo_url} />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Modern full-stack web applications and IT services built with React, Node.js, Express, and Supabase. Clean code, fast delivery, and effortless CMS management.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {settings.github && (
                <a
                  href={settings.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
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
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
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
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-fuchsia-400 hover:border-fuchsia-500/40 transition-colors"
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
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-mono text-slate-200 font-semibold uppercase tracking-wider">
              Navigation
            </p>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-cyan-400 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-cyan-400 transition-colors">About Us</a></li>
              <li><a href="#skills" className="hover:text-cyan-400 transition-colors">Technical Stack</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">Services & Pricing</a></li>
              <li><a href="#projects" className="hover:text-cyan-400 transition-colors">Featured Projects</a></li>
              <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Inquiry Form</a></li>
            </ul>
          </div>

          {/* Col 3: Services Summary */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-xs font-mono text-slate-200 font-semibold uppercase tracking-wider">
              Core Offerings
            </p>
            <ul className="space-y-2 text-xs">
              <li>Modern Responsive Websites</li>
              <li>Student & Freelancer Portfolios</li>
              <li>QR Code & Scanning Systems</li>
              <li>Full Stack Node + Supabase Apps</li>
              <li>Admin CMS & Content Automation</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{settings.footer_text || '© 2026 NIRA Infotech. All rights reserved.'}</p>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer text-slate-500"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
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
