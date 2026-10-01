import React, { useState, useEffect } from 'react';
import { SiteSettings, Service } from '../../types/index.ts';
import { submitInquiry } from '../../services/api.ts';
import {
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles
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

    // Validation
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
    <section id="contact" className="py-20 md:py-28 border-t border-slate-800/80 bg-[#090d16] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Contact Info & WhatsApp Direct Launch */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase mb-2">
                Get In Touch
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mb-4">
                Let's Build Something Exceptional Together
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                Have a project in mind, need a student portfolio, or want to modernize your business website? Reach out below for an immediate consultation and transparent quote.
              </p>

              {/* Contact Details List */}
              <div className="space-y-4 mb-8">
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-slate-500 font-mono">Email Us</p>
                    <p className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                      {settings.email || 'contact@nirainfotech.com'}
                    </p>
                  </div>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-slate-500 font-mono">WhatsApp Direct</p>
                    <p className="text-sm font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                      {settings.whatsapp || settings.phone || '+91 98765 43210'}
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-mono">Location & Delivery</p>
                    <p className="text-sm font-medium text-slate-200">
                      {settings.location || 'Ahmedabad, India · Remote & Global Delivery'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Response Badge */}
            <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-800/50 flex items-center gap-3.5">
              <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-white">Fast Turnaround:</span> Inquiries are typically reviewed within 2 hours. You can also chat directly on WhatsApp for instant response!
              </p>
            </div>
          </div>

          {/* Right Column: Inquiry Form Card */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <h3 className="text-xl font-bold text-slate-100">Send Project Inquiry</h3>
                <span className="text-xs font-mono text-cyan-400">Direct Delivery</span>
              </div>

              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-100 mb-2">Inquiry Received!</h4>
                  <p className="text-sm text-slate-300 max-w-md mb-6">
                    Thank you for reaching out to NIRA Infotech. We have received your inquiry and will review your specifications shortly.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Continue on WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Patel"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="aarav@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone & Company Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        placeholder="Apex Innovations (Optional)"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Service Required (Budget field removed per request) */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      Service Required
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.title} className="bg-slate-900 text-slate-100">
                          {s.title}
                        </option>
                      ))}
                      <option value="Custom Consultation" className="bg-slate-900 text-slate-100">
                        Custom Consultation
                      </option>
                    </select>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      Project Details & Requirements *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell us about your project goals, pages needed, target timeline, or features (e.g. QR code pass, Supabase database, live demos)..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button & WhatsApp Alternative */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-6 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 rounded-xl shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
                    >
                      {loading ? (
                        <span>Sending Inquiry...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Inquiry</span>
                        </>
                      )}
                    </button>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 text-sm font-medium text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-800/60 rounded-xl transition-colors whitespace-nowrap"
                    >
                      <MessageSquare className="w-4 h-4" />
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
