import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../../types/index.ts';
import { updateSiteSettings, uploadImageApi, fetchSupabaseSchema } from '../../services/api.ts';
import { NiraLogo } from '../common/NiraLogo.tsx';
import {
  Upload,
  CheckCircle,
  Copy,
  Database,
  ExternalLink,
  Shield,
  HelpCircle,
  Globe,
  Sparkles,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Share2,
  FileText
} from 'lucide-react';

interface SettingsManagerProps {
  settings: SiteSettings;
  onRefresh: () => void;
  onNavigate?: (tab: string) => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ settings, onRefresh, onNavigate }) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [schemaSql, setSchemaSql] = useState('');

  // Keep in sync when parent props update
  useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  useEffect(() => {
    fetchSupabaseSchema()
      .then((sql) => setSchemaSql(sql))
      .catch(() => {});
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const url = await uploadImageApi(base64, file.name, 'logos');
          setFormData(prev => ({ ...prev, logo_url: url }));
        } catch (err: any) {
          alert('Upload failed: ' + err.message);
        } finally {
          setUploadingLogo(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSavedSuccess(false);
      await updateSiteSettings(formData);
      setSavedSuccess(true);
      onRefresh();
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      alert('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCopySchema = () => {
    if (!schemaSql) return;
    navigator.clipboard.writeText(schemaSql);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl pb-12">
      {/* Top Header & Sticky-capable Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Global Website & Brand Settings</h2>
          <p className="text-xs text-slate-400">
            Control all live text, branding, logo, contact numbers, and public copy across the website
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-xl shadow-lg shadow-cyan-950/40 transition-all cursor-pointer self-start sm:self-auto"
        >
          {saving ? 'Saving Everything...' : 'Save All Changes'}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">All settings and details saved successfully! The live public website has been updated.</span>
        </div>
      )}

      {/* 1. Brand Identity & Logo */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
        <div className="flex items-center gap-2 text-cyan-400">
          <Sparkles className="w-4 h-4" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">1. Brand Identity & Logo</h3>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
            <NiraLogo size="lg" customLogoUrl={formData.logo_url} />
          </div>

          <div className="flex-1 space-y-2.5 w-full">
            <label className="block text-xs font-mono text-slate-400">
              Custom Logo Image URL (or upload below)
            </label>
            <input
              type="text"
              placeholder="https://... custom logo URL"
              value={formData.logo_url || ''}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs cursor-pointer transition-colors border border-slate-700">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>{uploadingLogo ? 'Uploading Logo...' : 'Upload Brand Logo File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={uploadingLogo}
                />
              </label>
              {formData.logo_url && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, logo_url: '' })}
                  className="text-xs text-rose-400 hover:underline cursor-pointer"
                >
                  Reset to Default Brand Emblem
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5">
            Business / Brand Name *
          </label>
          <input
            type="text"
            required
            value={formData.business_name}
            onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* 2. Contact Details & Direct WhatsApp */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400">
          <Phone className="w-4 h-4" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">2. Contact Numbers & Direct WhatsApp</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-emerald-400 mb-1.5">
              WhatsApp Number (with country code, e.g. +91 98765 43210) *
            </label>
            <input
              type="text"
              required
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Phone Number (For calls & display) *
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Office / Service Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-emerald-400 mb-1.5">
            Default WhatsApp Pre-filled Chat Message
          </label>
          <input
            type="text"
            value={formData.whatsapp_message || ''}
            onChange={(e) => setFormData({ ...formData, whatsapp_message: e.target.value })}
            placeholder="Hello NIRA Infotech, I am interested in your website development services."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* 3. Hero Section Copy */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sky-400">
          <FileText className="w-4 h-4" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">3. Hero Section Copy</h3>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5">
            Hero Top Badge / Kicker Text
          </label>
          <input
            type="text"
            value={formData.hero_kicker || ''}
            onChange={(e) => setFormData({ ...formData, hero_kicker: e.target.value })}
            placeholder="Full Stack Web Development & IT Solutions"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5">
            Hero Heading Tagline *
          </label>
          <input
            type="text"
            required
            value={formData.hero_title}
            onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5">
            Hero Short Description *
          </label>
          <textarea
            rows={3}
            required
            value={formData.hero_description}
            onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>
      </div>

      {/* 4. About, Mission & Vision */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-fuchsia-400">
          <Globe className="w-4 h-4" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">4. About, Mission & Vision</h3>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5">
            About Company Story / Overview *
          </label>
          <textarea
            rows={3}
            required
            value={formData.about}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Mission Statement *
            </label>
            <textarea
              rows={3}
              required
              value={formData.mission}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Vision Statement *
            </label>
            <textarea
              rows={3}
              required
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* 5. Social Media Links */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400">
          <Share2 className="w-4 h-4" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">5. Social Media & Developer Profiles</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              GitHub Profile / Org URL
            </label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              LinkedIn Profile / Company URL
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Instagram Profile URL
            </label>
            <input
              type="url"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Facebook Page URL
            </label>
            <input
              type="url"
              value={formData.facebook || ''}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Twitter / X Profile URL
            </label>
            <input
              type="url"
              value={formData.twitter || ''}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* 6. Footer & Copyright Text */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">6. Footer & Copyright Text</h3>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5">
            Footer Copyright Line / Text
          </label>
          <input
            type="text"
            required
            value={formData.footer_text}
            onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* 7. Supabase Database Connection & Schema Exporter */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0a1526] to-slate-900 border border-cyan-900/50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 font-mono">Supabase PostgreSQL Connection</h3>
          </div>

          <button
            type="button"
            onClick={handleCopySchema}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-700/60 text-cyan-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedSchema ? 'SQL Copied!' : 'Copy SQL Schema'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The app connects seamlessly with your Supabase database when environment variables are supplied:
        </p>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-cyan-300 space-y-1">
          <p>SUPABASE_URL="https://your-project.supabase.co"</p>
          <p>SUPABASE_ANON_KEY="your-anon-public-key"</p>
          <p>SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" (Optional)</p>
        </div>

        {onNavigate && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('database')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900/70 border border-emerald-800/80 rounded-xl transition-all cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Paste Supabase Keys & Connect Database Live →</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Save Action */}
      <div className="pt-4 flex items-center justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 rounded-xl shadow-xl shadow-cyan-950/50 transition-all cursor-pointer"
        >
          {saving ? 'Saving Everything...' : 'Save All Changes'}
        </button>
      </div>
    </form>
  );
};
