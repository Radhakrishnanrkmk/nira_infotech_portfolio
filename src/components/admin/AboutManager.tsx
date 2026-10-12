import React, { useState } from 'react';
import { SiteSettings } from '../../types/index.ts';
import { updateSiteSettings, uploadImageApi } from '../../services/api.ts';
import { Upload, CheckCircle, User, Sparkles } from 'lucide-react';

interface AboutManagerProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export const AboutManager: React.FC<AboutManagerProps> = ({ settings, onRefresh }) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const url = await uploadImageApi(base64, file.name, 'profile-images');
          setFormData(prev => ({ ...prev, founder_avatar: url }));
        } catch (err: any) {
          alert('Upload failed: ' + err.message);
        } finally {
          setUploadingAvatar(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingAvatar(false);
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
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert('Error saving about settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">About & Founder Information</h2>
          <p className="text-xs text-slate-300">
            Edit company overview, mission, vision, and lead developer credentials
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#1951fc] to-[#3781fc] hover:from-[#2563eb] hover:to-[#60a5fa] disabled:opacity-50 rounded-xl border border-[#cbe9fd]/40 shadow-[0_0_20px_rgba(25,81,252,0.45)] transition-all cursor-pointer"
        >
          {saving ? 'Saving Changes...' : 'Save About Settings'}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-600/60 text-emerald-200 text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>About section updated successfully! Public website updated.</span>
        </div>
      )}

      {/* Business Story */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-[#3781fc]/25 backdrop-blur-xl shadow-[0_8px_30px_rgba(3,25,91,0.35)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.2)] space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Company Overview</h3>

        <div>
          <label className="block text-xs font-mono text-[#cbe9fd] mb-1.5">
            About NIRA Infotech (Public Story)
          </label>
          <textarea
            rows={4}
            value={formData.about}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#03091e]/85 border border-[#3781fc]/30 text-white text-sm focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#cbe9fd] mb-1.5">
              Mission Statement
            </label>
            <textarea
              rows={3}
              value={formData.mission}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#03091e]/85 border border-[#3781fc]/30 text-white text-xs focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#cbe9fd] mb-1.5">
              Vision Statement
            </label>
            <textarea
              rows={3}
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#03091e]/85 border border-[#3781fc]/30 text-white text-xs focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc]"
            />
          </div>
        </div>
      </div>

      {/* Founder / Developer Profile */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-[#3781fc]/25 backdrop-blur-xl shadow-[0_8px_30px_rgba(3,25,91,0.35)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.2)] space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Founder / Lead Developer Profile</h3>

        <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-[#3781fc]/20">
          <div className="w-24 h-24 rounded-2xl bg-[#03091e] border border-[#3781fc]/35 overflow-hidden flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(25,81,252,0.25)]">
            {formData.founder_avatar ? (
              <img
                src={formData.founder_avatar}
                alt="Founder"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-[#cbe9fd]" />
            )}
          </div>

          <div className="flex-1 space-y-2 w-full">
            <input
              type="text"
              placeholder="Founder Avatar Image URL"
              value={formData.founder_avatar || ''}
              onChange={(e) => setFormData({ ...formData, founder_avatar: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl bg-[#03091e]/85 border border-[#3781fc]/30 text-xs text-white"
            />
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#08173d]/70 hover:bg-[#0f2862] text-[#cbe9fd] text-xs cursor-pointer transition-colors border border-[#3781fc]/35 shadow-sm">
                <Upload className="w-3.5 h-3.5 text-[#3781fc]" />
                <span>{uploadingAvatar ? 'Uploading...' : 'Upload Profile Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
              </label>
              {formData.founder_avatar && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, founder_avatar: '' })}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#cbe9fd] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={formData.founder_name}
              onChange={(e) => setFormData({ ...formData, founder_name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-[#03091e]/85 border border-[#3781fc]/30 text-white text-sm focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#cbe9fd] mb-1.5">
              Role / Professional Title
            </label>
            <input
              type="text"
              value={formData.founder_role}
              onChange={(e) => setFormData({ ...formData, founder_role: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-[#03091e]/85 border border-[#3781fc]/30 text-white text-sm focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-[#cbe9fd] mb-1.5">
            Founder Bio / Statement
          </label>
          <textarea
            rows={3}
            value={formData.founder_bio}
            onChange={(e) => setFormData({ ...formData, founder_bio: e.target.value })}
            className="w-full px-4 py-2 rounded-xl bg-[#03091e]/85 border border-[#3781fc]/30 text-white text-xs focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc]"
          />
        </div>
      </div>
    </form>
  );
};
