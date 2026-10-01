import React from 'react';
import { Project, Inquiry, Service, Skill } from '../../types/index.ts';
import {
  FolderKanban,
  Wrench,
  Cpu,
  Inbox,
  CheckCircle,
  Clock,
  ArrowRight,
  Database,
  ExternalLink
} from 'lucide-react';

interface DashboardHomeProps {
  stats: {
    totalProjects: number;
    completedProjects: number;
    totalServices: number;
    totalSkills: number;
    totalInquiries: number;
    newInquiries: number;
    inProgressInquiries: number;
    isSupabaseConnected: boolean;
  };
  projects: Project[];
  inquiries: Inquiry[];
  onNavigate: (tab: string) => void;
  onEditProject: (project: Project) => void;
  onViewInquiry: (inquiry: Inquiry) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  stats,
  projects,
  inquiries,
  onNavigate,
  onEditProject,
  onViewInquiry
}) => {
  const recentProjects = projects.slice(0, 5);
  const recentInquiries = inquiries.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0e192e] to-slate-900 border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Welcome to NIRA Admin Panel</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage all projects, services, skills, customer inquiries, and brand settings in real-time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('database')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/60 text-xs transition-colors cursor-pointer"
          title="Manage Supabase Connection"
        >
          <Database className={`w-4 h-4 ${stats.isSupabaseConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className="text-slate-300 font-medium">
            {stats.isSupabaseConnected ? 'Supabase Connected' : 'Connect Supabase'}
          </span>
          <span className="text-[10px] text-cyan-400 font-mono">→</span>
        </button>
      </div>

      {/* 5 Stats Cards requested in Section 16 */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Projects */}
        <div
          onClick={() => onNavigate('projects')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400">Total Projects</span>
            <FolderKanban className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100 font-mono tabular-nums">
            {stats.totalProjects}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Manage & showcase</p>
        </div>

        {/* Total Services */}
        <div
          onClick={() => onNavigate('services')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400">Total Services</span>
            <Wrench className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100 font-mono tabular-nums">
            {stats.totalServices}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Offered solutions</p>
        </div>

        {/* Total Skills */}
        <div
          onClick={() => onNavigate('skills')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-fuchsia-500/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400">Total Skills</span>
            <Cpu className="w-4 h-4 text-fuchsia-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100 font-mono tabular-nums">
            {stats.totalSkills}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Dynamic tech stack</p>
        </div>

        {/* New Inquiries */}
        <div
          onClick={() => onNavigate('inquiries')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-colors cursor-pointer relative overflow-hidden"
        >
          {stats.newInquiries > 0 && (
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          )}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400">New Inquiries</span>
            <Inbox className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
            {stats.newInquiries}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Require response</p>
        </div>

        {/* Completed Projects */}
        <div
          onClick={() => onNavigate('projects')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400">Completed</span>
            <CheckCircle className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100 font-mono tabular-nums">
            {stats.completedProjects}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Live & delivered</p>
        </div>
      </div>

      {/* Two Columns: Recent Projects & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects Table */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-100">Recent Projects</h3>
            <button
              onClick={() => onNavigate('projects')}
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {recentProjects.map((p) => (
              <div
                key={p.id}
                className="py-3 flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-mono text-cyan-400 shrink-0 overflow-hidden">
                    {p.poster_url ? (
                      <img
                        src={p.poster_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      'NR'
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                      {p.title}
                    </p>
                    <p className="text-xs text-slate-500 font-mono truncate">
                      {p.category} · {p.status}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onEditProject(p)}
                    className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}

            {recentProjects.length === 0 && (
              <p className="py-6 text-center text-xs text-slate-500">No projects added yet.</p>
            )}
          </div>
        </div>

        {/* Recent Inquiries Table */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-100">Recent Inquiries</h3>
            <button
              onClick={() => onNavigate('inquiries')}
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {recentInquiries.map((inq) => (
              <div
                key={inq.id}
                className="py-3 flex items-center justify-between gap-3 group"
              >
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                      {inq.name}
                    </p>
                    {inq.status === 'New' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {inq.service} · {inq.company || inq.email}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onViewInquiry(inq)}
                    className="px-2.5 py-1 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 rounded-lg transition-colors cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}

            {recentInquiries.length === 0 && (
              <p className="py-6 text-center text-xs text-slate-500">No client inquiries received yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
