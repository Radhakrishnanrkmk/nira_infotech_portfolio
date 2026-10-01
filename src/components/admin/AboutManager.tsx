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
          <h2 className="text-xl font-bold text-slate-100">About & Founder Information</h2>
          <p className="text-xs text-slate-400">
            Edit company overview, mission, vision, and lead developer credentials
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-xl shadow-md transition-all cursor-pointer"
        >
          {saving ? 'Saving Changes...' : 'Save About Settings'}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>About section updated successfully! Public website updated.</span>
        </div>
      )}

      {/* Business Story */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200">Company Overview</h3>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5">
            About NIRA Infotech (Public Story)
          </label>
          <textarea
            rows={4}
            value={formData.about}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Mission Statement
            </label>
            <textarea
              rows={3}
              value={formData.mission}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Vision Statement
            </label>
            <textarea
              rows={3}
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Founder / Developer Profile */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
        <h3 className="text-sm font-bold text-slate-200">Founder / Lead Developer Profile</h3>

        <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-slate-800">
          <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
            {formData.founder_avatar ? (
              <img
                src={formData.founder_avatar}
                alt="Founder"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-slate-500" />
            )}
          </div>

          <div className="flex-1 space-y-2 w-full">
            <input
              type="text"
              placeholder="Founder Avatar Image URL"
              value={formData.founder_avatar || ''}
              onChange={(e) => setFormData({ ...formData, founder_avatar: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
            />
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
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
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={formData.founder_name}
              onChange={(e) => setFormData({ ...formData, founder_name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Role / Professional Title
            </label>
            <input
              type="text"
              value={formData.founder_role}
              onChange={(e) => setFormData({ ...formData, founder_role: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5">
            Founder Bio / Statement
          </label>
          <textarea
            rows={3}
            value={formData.founder_bio}
            onChange={(e) => setFormData({ ...formData, founder_bio: e.target.value })}
            className="w-full px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>
    </form>
  );
};
