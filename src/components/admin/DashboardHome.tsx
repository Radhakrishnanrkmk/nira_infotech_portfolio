import React from 'react';
import { Project, Inquiry } from '../../types/index.ts';
import {
  FolderKanban,
  Wrench,
  Cpu,
  Inbox,
  CheckCircle,
  ArrowRight,
  Database,
  Sparkles
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
    <div className="space-y-6">
      {/* Welcome Banner with Glassmorphism */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-br from-[#07163c]/75 via-[#0a1e4e]/60 to-[#07163c]/75 border border-[#3781fc]/30 backdrop-blur-2xl shadow-[0_8px_32px_rgba(3,25,91,0.4)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.25)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#3781fc] shadow-[0_0_8px_#3781fc] animate-pulse" />
            <span className="text-xs font-bold text-[#cbe9fd] uppercase tracking-wider">
              Control Center
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Welcome to NIRA Admin Panel
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Manage projects, services, skills, customer inquiries, and brand settings in real-time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('database')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#08173d]/60 hover:bg-[#0f2862]/80 border border-[#3781fc]/35 text-xs transition-all cursor-pointer font-bold text-white shadow-[0_0_15px_rgba(25,81,252,0.3)] backdrop-blur-md"
          title="Manage Supabase Connection"
        >
          <Database className={`w-4 h-4 ${stats.isSupabaseConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span>
            {stats.isSupabaseConnected ? 'Supabase Connected' : 'Connect Supabase'}
          </span>
          <span className="text-xs text-[#cbe9fd]">→</span>
        </button>
      </div>

      {/* 5 Stats Cards with Frosted Glass */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Projects */}
        <div
          onClick={() => onNavigate('projects')}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-[#3781fc]/25 hover:border-[#3781fc]/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(3,25,91,0.35)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.2)] hover:shadow-[0_12px_40px_rgba(25,81,252,0.35)] hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">Projects</span>
            <div className="w-7 h-7 rounded-lg bg-[#0b2cb1]/40 border border-[#3781fc]/30 flex items-center justify-center text-[#cbe9fd] group-hover:scale-110 transition-transform">
              <FolderKanban className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white tabular-nums drop-shadow-[0_2px_10px_rgba(25,81,252,0.4)]">
            {stats.totalProjects}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Manage portfolio</p>
        </div>

        {/* Total Services */}
        <div
          onClick={() => onNavigate('services')}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-[#3781fc]/25 hover:border-[#3781fc]/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(3,25,91,0.35)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.2)] hover:shadow-[0_12px_40px_rgba(25,81,252,0.35)] hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">Services</span>
            <div className="w-7 h-7 rounded-lg bg-[#0b2cb1]/40 border border-[#3781fc]/30 flex items-center justify-center text-[#cbe9fd] group-hover:scale-110 transition-transform">
              <Wrench className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white tabular-nums drop-shadow-[0_2px_10px_rgba(25,81,252,0.4)]">
            {stats.totalServices}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Offered solutions</p>
        </div>

        {/* Total Skills */}
        <div
          onClick={() => onNavigate('skills')}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-[#3781fc]/25 hover:border-[#3781fc]/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(3,25,91,0.35)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.2)] hover:shadow-[0_12px_40px_rgba(25,81,252,0.35)] hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">Skills</span>
            <div className="w-7 h-7 rounded-lg bg-[#0b2cb1]/40 border border-[#3781fc]/30 flex items-center justify-center text-[#cbe9fd] group-hover:scale-110 transition-transform">
              <Cpu className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white tabular-nums drop-shadow-[0_2px_10px_rgba(25,81,252,0.4)]">
            {stats.totalSkills}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Dynamic stack</p>
        </div>

        {/* New Inquiries */}
        <div
          onClick={() => onNavigate('inquiries')}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-emerald-500/30 hover:border-emerald-400/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(3,25,91,0.35)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.2)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.25)] hover:-translate-y-0.5 transition-all cursor-pointer relative overflow-hidden group"
        >
          {stats.newInquiries > 0 && (
            <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          )}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">Inquiries</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Inbox className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 tabular-nums drop-shadow-[0_2px_10px_rgba(16,185,129,0.3)]">
            {stats.newInquiries}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Awaiting reply</p>
        </div>

        {/* Completed Projects */}
        <div
          onClick={() => onNavigate('projects')}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-[#3781fc]/25 hover:border-[#3781fc]/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(3,25,91,0.35)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.2)] hover:shadow-[0_12px_40px_rgba(25,81,252,0.35)] hover:-translate-y-0.5 transition-all cursor-pointer col-span-2 sm:col-span-1 group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">Completed</span>
            <div className="w-7 h-7 rounded-lg bg-[#0b2cb1]/40 border border-[#3781fc]/30 flex items-center justify-center text-[#cbe9fd] group-hover:scale-110 transition-transform">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white tabular-nums drop-shadow-[0_2px_10px_rgba(25,81,252,0.4)]">
            {stats.completedProjects}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Live delivered</p>
        </div>
      </div>

      {/* Two Columns: Recent Projects & Recent Inquiries with Frosted Glass Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects Table */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#07163c]/75 via-[#0a1e4e]/60 to-[#07163c]/75 border border-[#3781fc]/30 backdrop-blur-2xl shadow-[0_8px_32px_rgba(3,25,91,0.4)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.2)]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#3781fc]/20">
            <h3 className="text-sm font-extrabold text-white">Recent Projects</h3>
            <button
              onClick={() => onNavigate('projects')}
              className="flex items-center gap-1 text-xs text-[#cbe9fd] hover:text-white transition-colors cursor-pointer font-bold"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-[#3781fc]/15">
            {recentProjects.map((p) => (
              <div
                key={p.id}
                className="py-3 flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-[#08173d]/80 border border-[#3781fc]/30 flex items-center justify-center text-xs text-[#cbe9fd] font-bold shrink-0 overflow-hidden shadow-[0_0_10px_rgba(25,81,252,0.2)]">
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
                    <p className="text-xs sm:text-sm font-bold text-white group-hover:text-[#cbe9fd] transition-colors truncate">
                      {p.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {p.category} · {p.status}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onEditProject(p)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#cbe9fd] hover:text-white bg-[#08173d]/60 hover:bg-[#1951fc]/30 border border-[#3781fc]/30 rounded-xl transition-all cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}

            {recentProjects.length === 0 && (
              <p className="py-6 text-center text-xs text-slate-400">No projects added yet.</p>
            )}
          </div>
        </div>

        {/* Recent Inquiries Table */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#07163c]/75 via-[#0a1e4e]/60 to-[#07163c]/75 border border-[#3781fc]/30 backdrop-blur-2xl shadow-[0_8px_32px_rgba(3,25,91,0.4)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.2)]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#3781fc]/20">
            <h3 className="text-sm font-extrabold text-white">Recent Inquiries</h3>
            <button
              onClick={() => onNavigate('inquiries')}
              className="flex items-center gap-1 text-xs text-[#cbe9fd] hover:text-white transition-colors cursor-pointer font-bold"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-[#3781fc]/15">
            {recentInquiries.map((inq) => (
              <div
                key={inq.id}
                className="py-3 flex items-center justify-between gap-3 group"
              >
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm font-bold text-white group-hover:text-[#cbe9fd] transition-colors truncate">
                      {inq.name}
                    </p>
                    {inq.status === 'New' && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {inq.service} · {inq.company || inq.email}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onViewInquiry(inq)}
                    className="px-3 py-1.5 text-xs font-bold text-[#cbe9fd] hover:text-white bg-[#0b2cb1]/40 hover:bg-[#1951fc]/40 border border-[#3781fc]/35 rounded-xl transition-all cursor-pointer shadow-[0_0_12px_rgba(25,81,252,0.2)]"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}

            {recentInquiries.length === 0 && (
              <p className="py-6 text-center text-xs text-slate-400">No client inquiries received yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
