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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark / Emblem */}
        <a href="#home" className="flex items-center gap-3">
          <NiraLogo size="md" customLogoUrl={settings.logo_url} />
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-cyan-400 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-cyan-400 hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Actions (WhatsApp + Send Project Inquiry) */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm shadow-emerald-950/40 transition-colors whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Us</span>
          </a>

          <a
            href="#contact"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg shadow-md shadow-cyan-950/40 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Project Inquiry</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded-lg"
            aria-label="WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-800 bg-[#0b0f19] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg"
            >
              <Send className="w-4 h-4" />
              <span>Send Project Inquiry</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Discuss on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
