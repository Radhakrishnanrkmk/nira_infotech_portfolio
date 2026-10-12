import React, { useState } from 'react';
import { adminLogin } from '../../services/api.ts';
import { NiraLogo } from '../common/NiraLogo.tsx';
import { Lock, Mail, AlertCircle, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [email, setEmail] = useState('admin@nirainfotech.com');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await adminLogin(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@nirainfotech.com');
    setPassword('admin123456');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020614]/80 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Ambient background glow inside the modal viewport */}
      <div className="absolute w-[450px] h-[450px] bg-gradient-to-tr from-[#03195b]/60 via-[#1951fc]/35 to-[#3781fc]/25 rounded-full blur-[110px] pointer-events-none -z-10" />

      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-[#07163c]/85 via-[#0a1e4e]/80 to-[#07163c]/85 border border-[#3781fc]/35 shadow-[0_20px_60px_rgba(3,25,91,0.65)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.3)] backdrop-blur-2xl p-7 sm:p-8 text-white">
        {/* Back button */}
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#cbe9fd] hover:text-white transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <NiraLogo size="lg" />
          <h2 className="text-2xl font-extrabold text-white mt-4 drop-shadow-[0_2px_15px_rgba(25,81,252,0.4)]">
            Admin Authentication
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Sign in to manage projects, services, skills, inquiries, and settings
          </p>
        </div>

        {error && (
          <div className="p-3.5 mb-5 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#cbe9fd] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nirainfotech.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#03091e]/85 border border-[#3781fc]/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc] transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#cbe9fd] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#03091e]/85 border border-[#3781fc]/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#3781fc] focus:ring-1 focus:ring-[#3781fc] transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-white bg-gradient-to-r from-[#1951fc] to-[#3781fc] hover:from-[#2563eb] hover:to-[#60a5fa] disabled:opacity-50 rounded-xl border border-[#cbe9fd]/40 shadow-[0_0_25px_rgba(25,81,252,0.5)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-md transition-all cursor-pointer mt-6 hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin Panel'}
          </button>
        </form>

        {/* Demo credentials helper pill */}
        <div className="mt-6 pt-4 border-t border-[#3781fc]/20 flex items-center justify-between text-xs text-slate-400">
          <span>Demo credentials ready</span>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="flex items-center gap-1 text-[#cbe9fd] hover:text-white font-bold underline cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#3781fc]" />
            <span>Use Default Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
