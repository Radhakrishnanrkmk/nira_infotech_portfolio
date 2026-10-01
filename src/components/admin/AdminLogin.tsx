import React, { useState } from 'react';
import { adminLogin } from '../../services/api.ts';
import { NiraLogo } from '../common/NiraLogo.tsx';
import { Lock, Mail, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0e1626] border border-slate-700/80 shadow-2xl p-8">
        {/* Back button */}
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <NiraLogo size="lg" />
          <h2 className="text-2xl font-bold text-slate-100 mt-4">Admin Authentication</h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to manage projects, services, skills, inquiries, and settings
          </p>
        </div>

        {error && (
          <div className="p-3.5 mb-6 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nirainfotech.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 rounded-xl shadow-lg shadow-cyan-950/50 transition-all cursor-pointer mt-6"
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin Panel'}
          </button>
        </form>

        {/* Demo credentials helper pill */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Demo credentials ready</span>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono underline cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Use Default Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
