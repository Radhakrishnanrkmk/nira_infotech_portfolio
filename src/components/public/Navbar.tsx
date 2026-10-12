import React, { useState } from 'react';
import { NiraLogo } from '../common/NiraLogo.tsx';
import { SiteSettings } from '../../types/index.ts';
import { MessageSquare, Menu, X, Send } from 'lucide-react';

interface NavbarProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenAdmin,
  isAdminLoggedIn
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanPhone = (settings.whatsapp || settings.phone || '').replace(/[^0-9]/g, '');
  const defaultMsg = encodeURIComponent(
    settings.whatsapp_message || 'Hello NIRA Infotech, I am interested in your website development services.'
  );
  const whatsappUrl = `https://wa.me/${cleanPhone || '919876543210'}?text=${defaultMsg}`;

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Services', href: '#services' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#3781fc]/25 bg-[#020718]/75 backdrop-blur-xl transition-all shadow-[0_4px_30px_rgba(3,25,91,0.35)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark / Emblem */}
        <a href="#home" className="flex items-center gap-2.5">
          <NiraLogo size="md" customLogoUrl={settings.logo_url} />
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-slate-300 hover:text-[#cbe9fd] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#3781fc] hover:after:w-full after:transition-all tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Actions (WhatsApp + Send Project Inquiry) */}
        <div className="hidden sm:flex items-center gap-2.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600/90 hover:bg-emerald-500 rounded-xl border border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-md transition-all whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          <a
            href="#contact"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#1951fc] to-[#3781fc] hover:from-[#2563eb] hover:to-[#60a5fa] rounded-xl border border-[#cbe9fd]/35 shadow-[0_0_20px_rgba(25,81,252,0.45)] backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5 text-[#cbe9fd]" />
            <span>Get in Touch</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-emerald-400 bg-emerald-950/60 border border-emerald-700/60 rounded-xl"
            aria-label="WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-300 hover:text-white bg-[#0b1b42]/60 border border-[#3781fc]/30 rounded-xl backdrop-blur-md"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#cbe9fd]" /> : <Menu className="w-5 h-5 text-[#cbe9fd]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[#3781fc]/25 bg-[#03091e]/95 backdrop-blur-2xl px-4 pt-2.5 pb-4 space-y-2.5 shadow-xl">
          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-[#cbe9fd] hover:bg-[#1951fc]/20 rounded-xl border border-transparent hover:border-[#3781fc]/30 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-2.5 border-t border-[#3781fc]/20 flex flex-col gap-2">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-bold text-white bg-gradient-to-r from-[#1951fc] to-[#3781fc] rounded-xl border border-[#cbe9fd]/30 shadow-md"
            >
              <Send className="w-3.5 h-3.5 text-[#cbe9fd]" />
              <span>Get in Touch</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold text-white bg-emerald-600/90 hover:bg-emerald-500 rounded-xl border border-emerald-400/30"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discuss on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
