import React, { useState, useEffect } from 'react';
import { SiteSettings, Service } from '../../types/index.ts';
import { submitInquiry } from '../../services/api.ts';
import {
  MessageSquare,
  Mail,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface ContactSectionProps {
  settings: SiteSettings;
  services: Service[];
  preselectedService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  services,
  preselectedService
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: preselectedService || 'Website Development',
    project_type: 'Full Project (New Build)',
    budget: '$500 - $1,500',
    message: ''
  });

  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanPhone = (settings.whatsapp || settings.phone || '').replace(/[^0-9]/g, '');
  const defaultMsg = encodeURIComponent(
    settings.whatsapp_message || 'Hello NIRA Infotech, I am interested in your website development services.'
  );
  const whatsappUrl = `https://wa.me/${cleanPhone || '919876543210'}?text=${defaultMsg}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setError('Please describe your project or requirements (at least 10 characters).');
      return;
    }

    try {
      setLoading(true);
      await submitInquiry(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: 'Website Development',
        project_type: 'Full Project (New Build)',
        budget: '$500 - $1,500',
        message: ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please try again or WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-12 md:py-16 border-t border-[#3781fc]/20 bg-[#020614] relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[350px] bg-gradient-to-bl from-[#03195b]/40 via-[#1951fc]/25 to-[#0b2cb1]/30 rounded-full blur-[110px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Contact Info & WhatsApp Direct Launch */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-[#cbe9fd] tracking-wider uppercase mb-1.5 drop-shadow-[0_0_10px_rgba(55,129,252,0.6)]">
                Get In Touch
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3 drop-shadow-[0_2px_15px_rgba(25,81,252,0.3)]">
                Let's Build Something Exceptional Together
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Have a project in mind, need a student portfolio, or want to modernize your business website? Reach out below for an immediate consultation and transparent quote.
              </p>

              {/* Contact Details List */}
              <div className="space-y-2.5 mb-6">
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-[#3781fc]/25 hover:border-[#3781fc]/60 backdrop-blur-xl shadow-md transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0b2cb1]/60 to-[#1951fc]/40 border border-[#cbe9fd]/35 text-[#cbe9fd] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(25,81,252,0.3)]">
                    <Mail className="w-4 h-4 text-[#cbe9fd]" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] text-slate-400 font-semibold">Email Us</p>
                    <p className="text-xs sm:text-sm font-bold text-white group-hover:text-[#cbe9fd] transition-colors truncate">
                      {settings.email || 'contact@nirainfotech.com'}
                    </p>
                  </div>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-[#3781fc]/25 hover:border-emerald-400/60 backdrop-blur-xl shadow-md transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] text-slate-400 font-semibold">WhatsApp Direct</p>
                    <p className="text-xs sm:text-sm font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                      {settings.whatsapp || settings.phone || '+91 98765 43210'}
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-[#3781fc]/25 backdrop-blur-xl shadow-md">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0b2cb1]/50 to-[#1951fc]/30 border border-[#3781fc]/35 text-[#3781fc] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#cbe9fd]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold">Location & Delivery</p>
                    <p className="text-xs sm:text-sm font-medium text-white">
                      {settings.location || 'Ahmedabad, India · Remote & Global Delivery'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Response Badge */}
            <div className="p-3.5 rounded-2xl bg-[#08173d]/50 border border-[#3781fc]/25 backdrop-blur-xl flex items-center gap-3 shadow-md">
              <Clock className="w-4 h-4 text-[#3781fc] shrink-0" />
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-white">Fast Turnaround:</span> Inquiries reviewed within 2 hours. Message us on WhatsApp for instant replies!
              </p>
            </div>
          </div>

          {/* Right Column: Inquiry Form Card */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-[#07163c]/75 via-[#0a1e4e]/65 to-[#07163c]/75 border border-[#3781fc]/30 backdrop-blur-2xl shadow-[0_16px_50px_rgba(3,25,91,0.5)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.25)]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#3781fc]/20">
                <h3 className="text-base sm:text-lg font-extrabold text-white">Send Project Inquiry</h3>
                <span className="text-xs text-[#cbe9fd] font-bold drop-shadow-[0_0_8px_rgba(55,129,252,0.6)]">Direct Delivery</span>
              </div>

              {submitted ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-extrabold text-white mb-1.5">Inquiry Received!</h4>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-5">
                    Thank you for reaching out to NIRA Infotech. We have received your inquiry and will review your specifications shortly.
                  </p>
                  <div className="flex flex-wrap gap-2.5 justify-center">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-md"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Continue on WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-3.5 py-2 text-xs font-semibold text-[#cbe9fd] hover:text-white bg-[#0b1c44]/60 hover:bg-[#0f2862] border border-[#3781fc]/35 rounded-xl transition-colors"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {error && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#cbe9fd] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Patel"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#03091e]/80 border border-[#3781fc]/30 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#cbe9fd] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="aarav@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#03091e]/80 border border-[#3781fc]/30 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone & Company Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#cbe9fd] mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#03091e]/80 border border-[#3781fc]/30 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#cbe9fd] mb-1">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        placeholder="Apex Innovations (Optional)"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#03091e]/80 border border-[#3781fc]/30 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Service Required */}
                  <div>
                    <label className="block text-xs font-bold text-[#cbe9fd] mb-1">
                      Service Required
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#03091e]/80 border border-[#3781fc]/30 text-white text-xs sm:text-sm focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc] transition-colors cursor-pointer font-medium"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.title} className="bg-[#03091e] text-white">
                          {s.title}
                        </option>
                      ))}
                      <option value="Custom Consultation" className="bg-[#03091e] text-white">
                        Custom Consultation
                      </option>
                    </select>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-xs font-bold text-[#cbe9fd] mb-1">
                      Project Details & Requirements *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Tell us about your project goals, pages needed, target timeline, or features..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#03091e]/80 border border-[#3781fc]/30 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc] transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button & WhatsApp Alternative */}
                  <div className="pt-1.5 flex flex-col sm:flex-row items-center gap-2.5">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:flex-1 flex items-center justify-center gap-1.5 py-2.5 px-5 text-xs font-bold text-white bg-gradient-to-r from-[#1951fc] to-[#3781fc] hover:from-[#2563eb] hover:to-[#60a5fa] disabled:opacity-50 rounded-xl border border-[#cbe9fd]/35 shadow-[0_0_20px_rgba(25,81,252,0.45)] transition-all cursor-pointer"
                    >
                      {loading ? (
                        <span>Sending Inquiry...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-[#cbe9fd]" />
                          <span>Send Inquiry</span>
                        </>
                      )}
                    </button>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold text-white bg-emerald-600/90 hover:bg-emerald-500 rounded-xl border border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-colors whitespace-nowrap"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
