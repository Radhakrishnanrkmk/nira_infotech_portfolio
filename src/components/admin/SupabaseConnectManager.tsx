import React, { useState, useEffect } from 'react';
import {
  fetchSupabaseStatus,
  testSupabaseApi,
  connectSupabaseApi,
  disconnectSupabaseApi,
  syncDataToSupabaseApi,
  fetchSupabaseSchema,
  SupabaseStatusResponse
} from '../../services/api.ts';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Link2,
  Unlink,
  RefreshCw,
  Copy,
  ExternalLink,
  Shield,
  Key,
  Globe,
  UploadCloud,
  Check,
  Eye,
  EyeOff,
  Rocket,
  Terminal,
  Layers
} from 'lucide-react';

interface SupabaseConnectManagerProps {
  onRefreshAll: () => void;
}

export const SupabaseConnectManager: React.FC<SupabaseConnectManagerProps> = ({ onRefreshAll }) => {
  const [status, setStatus] = useState<SupabaseStatusResponse | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Form inputs
  const [projectUrl, setProjectUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [serviceRoleKey, setServiceRoleKey] = useState('');
  const [showSecretKey, setShowSecretKey] = useState(false);

  // Operation states
  const [testing, setTesting] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Feedback states
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    tablesFound?: string[];
    missingTables?: string[];
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Schema state
  const [schemaSql, setSchemaSql] = useState('');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedVercelEnv, setCopiedVercelEnv] = useState(false);
  const [copiedVercelJson, setCopiedVercelJson] = useState(false);

  const loadStatus = async () => {
    try {
      setLoadingStatus(true);
      const res = await fetchSupabaseStatus();
      setStatus(res);
      if (res.url && !projectUrl) {
        setProjectUrl(res.url);
      }
    } catch (err: any) {
      console.error('Failed to fetch Supabase status:', err);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    loadStatus();
    fetchSupabaseSchema()
      .then((sql) => setSchemaSql(sql))
      .catch(() => {});
  }, []);

  const handleTest = async () => {
    if (!projectUrl.trim() || (!anonKey.trim() && !serviceRoleKey.trim())) {
      setActionMessage({
        type: 'error',
        text: 'Please paste your Project URL and at least one API Key (Anon Key or Service Role Key) to test.'
      });
      return;
    }

    setTesting(true);
    setTestResult(null);
    setActionMessage(null);

    try {
      const activeKey = serviceRoleKey.trim() || anonKey.trim();
      const res = await testSupabaseApi(projectUrl.trim(), activeKey);
      setTestResult(res);
      if (res.success) {
        setActionMessage({ type: 'success', text: res.message });
      } else {
        setActionMessage({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: `Test error: ${err.message}` });
    } finally {
      setTesting(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectUrl.trim() || (!anonKey.trim() && !serviceRoleKey.trim())) {
      setActionMessage({
        type: 'error',
        text: 'Please paste your Project URL and at least one API Key before connecting.'
      });
      return;
    }

    setConnecting(true);
    setActionMessage(null);
    setTestResult(null);

    try {
      const res = await connectSupabaseApi(projectUrl.trim(), anonKey.trim(), serviceRoleKey.trim());
      if (res.success) {
        setActionMessage({
          type: 'success',
          text: 'Connected successfully to Supabase! Your live database is now active.'
        });
        await loadStatus();
        onRefreshAll();
      } else {
        setActionMessage({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: `Connection error: ${err.message}` });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Supabase? The app will safely fall back to the local database.')) {
      return;
    }

    setDisconnecting(true);
    setActionMessage(null);

    try {
      const res = await disconnectSupabaseApi();
      setActionMessage({ type: 'success', text: res.message });
      await loadStatus();
      onRefreshAll();
    } catch (err: any) {
      setActionMessage({ type: 'error', text: `Disconnect error: ${err.message}` });
    } finally {
      setDisconnecting(false);
    }
  };

  const handleSyncData = async () => {
    if (!confirm('This will copy all current projects, services, skills, and site settings into your connected Supabase database. Proceed?')) {
      return;
    }

    setSyncing(true);
    setActionMessage(null);

    try {
      const res = await syncDataToSupabaseApi();
      if (res.success) {
        setActionMessage({ type: 'success', text: res.message });
        onRefreshAll();
      } else {
        setActionMessage({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: `Sync error: ${err.message}` });
    } finally {
      setSyncing(false);
    }
  };

  const handleCopySchema = () => {
    if (!schemaSql) return;
    navigator.clipboard.writeText(schemaSql);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <Database className="w-5 h-5 text-emerald-400" />
            <span>Supabase Cloud Database Connection</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Paste your Supabase credentials to link your cloud PostgreSQL database live
          </p>
        </div>

        <button
          type="button"
          onClick={loadStatus}
          disabled={loadingStatus}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Live Connection Status Card */}
      <div className={`p-6 rounded-2xl border transition-all ${
        status?.isConnected
          ? 'bg-emerald-950/20 border-emerald-800/80 shadow-lg shadow-emerald-950/20'
          : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${
              status?.isConnected
                ? 'bg-emerald-900/40 border-emerald-700/60 text-emerald-400'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}>
              <Database className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  status?.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`} />
                <h3 className="text-base font-bold text-slate-100">
                  {status?.isConnected ? 'Connected to Supabase Cloud' : 'Using Local JSON Database'}
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  status?.isConnected
                    ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
                    : 'bg-amber-950 border-amber-800 text-amber-300'
                }`}>
                  {status?.isConnected ? `Active (${status.source})` : 'Fallback Mode'}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-1 font-mono truncate max-w-md">
                {status?.isConnected
                  ? `Target: ${status.url}`
                  : 'Data is safely stored in local database files (/data/db.json).'}
              </p>
            </div>
          </div>

          {status?.isConnected && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSyncData}
                disabled={syncing}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl shadow-sm transition-colors cursor-pointer"
                title="Push all local projects and settings into Supabase"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{syncing ? 'Syncing...' : 'Sync Local Data'}</span>
              </button>

              <button
                type="button"
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 rounded-xl transition-colors cursor-pointer"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Alert / Feedback Banners */}
      {actionMessage && (
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-2.5 animate-in fade-in ${
          actionMessage.type === 'success'
            ? 'bg-emerald-950/70 border-emerald-700 text-emerald-200'
            : 'bg-rose-950/70 border-rose-700 text-rose-200'
        }`}>
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span className="font-medium">{actionMessage.text}</span>
        </div>
      )}

      {/* Test Result Inspection Card */}
      {testResult && (
        <div className={`p-4 rounded-xl border text-xs space-y-2 ${
          testResult.success
            ? 'bg-cyan-950/40 border-cyan-800/80 text-cyan-200'
            : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
        }`}>
          <div className="flex items-center gap-2 font-semibold">
            {testResult.success ? (
              <Check className="w-4 h-4 text-cyan-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>Connection Test Diagnostic:</span>
          </div>

          <p className="text-slate-300">{testResult.message}</p>

          {testResult.tablesFound && testResult.tablesFound.length > 0 && (
            <div className="pt-1">
              <span className="text-[11px] text-slate-400 font-mono">Found Tables: </span>
              <span className="text-[11px] text-emerald-300 font-mono">
                {testResult.tablesFound.join(', ')}
              </span>
            </div>
          )}

          {testResult.missingTables && testResult.missingTables.length > 0 && (
            <div className="pt-1">
              <span className="text-[11px] text-amber-400 font-mono">Tables Needed: </span>
              <span className="text-[11px] text-amber-200 font-mono">
                {testResult.missingTables.join(', ')}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: Click <strong>"Copy SQL Schema"</strong> below and execute it in your Supabase SQL Editor.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Connection Form */}
      <form onSubmit={handleConnect} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400">
            <Key className="w-4 h-4" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
              Paste Supabase Credentials
            </h3>
          </div>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-cyan-400 hover:underline"
          >
            <span>Open Supabase Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* 1. Project URL */}
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
            <span>1. Supabase Project URL *</span>
            <span className="text-slate-500 text-[11px]">Settings ➔ API ➔ Project URL</span>
          </label>
          <div className="relative">
            <input
              type="url"
              required
              placeholder="https://xyzabcdefghijklm.supabase.co"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm font-mono focus:outline-none focus:border-cyan-500"
            />
            <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* 2. Anon / Public Key */}
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
            <span>2. Supabase Anon / Public Key *</span>
            <span className="text-slate-500 text-[11px]">Settings ➔ API ➔ anon / public</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-cyan-500"
            />
            <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* 3. Service Role Key (Recommended for Admin) */}
        <div>
          <label className="block text-xs font-mono text-emerald-400 mb-1.5 flex items-center justify-between">
            <span>3. Supabase Service Role Key (Secret, Recommended for Full Admin Sync)</span>
            <span className="text-slate-500 text-[11px]">Settings ➔ API ➔ service_role (secret)</span>
          </label>
          <div className="relative">
            <input
              type={showSecretKey ? 'text' : 'password'}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Optional, allows full admin operations)"
              value={serviceRoleKey}
              onChange={(e) => setServiceRoleKey(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 pr-10 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
            />
            <Shield className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowSecretKey(!showSecretKey)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Using the service role key bypasses PostgreSQL Row Level Security (RLS) for admin updates and data syncing.
          </p>
        </div>

        {/* Form Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleTest}
            disabled={testing || connecting}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Testing Connection...' : 'Test Connection'}</span>
          </button>

          <button
            type="submit"
            disabled={connecting || testing}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 rounded-xl shadow-md shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Link2 className={`w-3.5 h-3.5 ${connecting ? 'animate-spin' : ''}`} />
            <span>{connecting ? 'Saving & Connecting...' : 'Connect Supabase Live'}</span>
          </button>
        </div>
      </form>

      {/* SQL Migration Script & Setup Steps */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0a1526] to-slate-900 border border-cyan-900/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 font-mono">1-Click SQL Schema Exporter</h3>
          </div>

          <button
            type="button"
            onClick={handleCopySchema}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-950 border border-cyan-700/60 text-cyan-300 hover:text-white text-xs font-mono transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedSchema ? 'SQL Script Copied!' : 'Copy SQL Schema Script'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Before connecting, make sure your Supabase project has the required tables created. Follow these 3 quick steps:
        </p>

        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <li>
            Open your <strong>Supabase Dashboard</strong> and click on the <strong>SQL Editor</strong> tab on the left.
          </li>
          <li>
            Click <strong>"Copy SQL Schema Script"</strong> above, paste it into the editor, and click <strong>"Run"</strong>.
          </li>
          <li>
            Go to <strong>Project Settings ➔ API</strong>, copy your <strong>URL</strong> and <strong>Keys</strong>, paste them into the form above, and click <strong>"Connect Supabase Live"</strong>!
          </li>
        </ol>
      </div>

      {/* Vercel Deployment Process & Config */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#101426] to-slate-900 border border-indigo-900/50 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Rocket className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-mono">Deploy in Vercel — Process & Configuration</h3>
              <p className="text-xs text-slate-400 mt-0.5">Zero-config serverless deployment ready with pre-configured <code className="text-indigo-300">vercel.json</code></p>
            </div>
          </div>

          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-950 border border-indigo-700/60 text-indigo-300 hover:text-white text-xs font-mono transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Open Vercel New Project</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4 Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-700 flex items-center justify-center text-[10px]">1</span>
              <span>Push Code to GitHub</span>
            </div>
            <p className="text-xs text-slate-400">
              Push your project repository to GitHub or GitLab. All build and serverless files (<code className="text-slate-300">vercel.json</code> &amp; <code className="text-slate-300">api/index.ts</code>) are already generated.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-700 flex items-center justify-center text-[10px]">2</span>
              <span>Import in Vercel</span>
            </div>
            <p className="text-xs text-slate-400">
              Go to <strong>vercel.com/new</strong>, select your repository, choose <strong>Vite</strong> as the framework preset, and verify:
            </p>
            <div className="text-[11px] font-mono text-slate-300 space-y-0.5 bg-slate-900/80 p-2 rounded-lg">
              <div>Build Command: <span className="text-emerald-400">npm run build</span></div>
              <div>Output Directory: <span className="text-emerald-400">dist</span></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-700 flex items-center justify-center text-[10px]">3</span>
              <span>Add Environment Variables in Vercel</span>
            </div>
            <p className="text-xs text-slate-400">
              In Vercel project settings under <strong>Environment Variables</strong>, add your Supabase credentials:
            </p>
            <div className="text-[11px] font-mono text-cyan-300 space-y-0.5 bg-slate-900/80 p-2 rounded-lg">
              <div>SUPABASE_URL</div>
              <div>SUPABASE_ANON_KEY</div>
              <div>SUPABASE_SERVICE_ROLE_KEY</div>
              <div>ADMIN_SECRET</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-700 flex items-center justify-center text-[10px]">4</span>
              <span>Deploy &amp; Launch</span>
            </div>
            <p className="text-xs text-slate-400">
              Click <strong>Deploy</strong>. Vercel builds the SPA frontend in <code className="text-slate-300">dist</code> and automatically turns <code className="text-slate-300">api/index.ts</code> into a global Serverless Function handling all CRUD routes.
            </p>
          </div>
        </div>

        {/* Copy Vercel Config & Env Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              const vercelJsonText = `{\n  "version": 2,\n  "buildCommand": "npm run build",\n  "outputDirectory": "dist",\n  "rewrites": [\n    {\n      "source": "/api/(.*)",\n      "destination": "/api"\n    },\n    {\n      "source": "/(.*)",\n      "destination": "/index.html"\n    }\n  ]\n}`;
              navigator.clipboard.writeText(vercelJsonText);
              setCopiedVercelJson(true);
              setTimeout(() => setCopiedVercelJson(false), 3000);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedVercelJson ? 'vercel.json Copied!' : 'Copy vercel.json'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const envText = `SUPABASE_URL=${projectUrl || 'https://your-project.supabase.co'}\nSUPABASE_ANON_KEY=${anonKey || 'your-anon-key'}\nSUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey || 'your-service-role-key'}\nADMIN_SECRET=admin123456`;
              navigator.clipboard.writeText(envText);
              setCopiedVercelEnv(true);
              setTimeout(() => setCopiedVercelEnv(false), 3000);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900/80 border border-indigo-700/80 text-xs font-mono text-indigo-200 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedVercelEnv ? 'Vercel Env Vars Copied!' : 'Copy Vercel .env Template'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
