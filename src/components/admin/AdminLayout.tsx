import React, { useState } from 'react';
import { NiraLogo } from '../common/NiraLogo.tsx';
import { SiteSettings, Project, Inquiry, Service, Skill } from '../../types/index.ts';
import { DashboardHome } from './DashboardHome.tsx';
import { ProjectsManager } from './ProjectsManager.tsx';
import { ServicesManager } from './ServicesManager.tsx';
import { SkillsManager } from './SkillsManager.tsx';
import { InquiriesManager } from './InquiriesManager.tsx';
import { AboutManager } from './AboutManager.tsx';
import { SettingsManager } from './SettingsManager.tsx';
import { SupabaseConnectManager } from './SupabaseConnectManager.tsx';
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Cpu,
  Inbox,
  User,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Database
} from 'lucide-react';

interface AdminLayoutProps {
  settings: SiteSettings;
  projects: Project[];
  services: Service[];
  skills: Skill[];
  inquiries: Inquiry[];
  stats: any;
  onRefreshAll: () => void;
  onLogout: () => void;
  onViewPublicSite: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  settings,
  projects,
  services,
  skills,
  inquiries,
  stats,
  onRefreshAll,
  onLogout,
  onViewPublicSite
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editingProjectTarget, setEditingProjectTarget] = useState<Project | null>(null);
  const [viewingInquiryTarget, setViewingInquiryTarget] = useState<Inquiry | null>(null);

  const newInquiriesCount = inquiries.filter(i => i.status === 'New').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" />, count: projects.length },
    { id: 'services', label: 'Services', icon: <Wrench className="w-4 h-4" />, count: services.length },
    { id: 'skills', label: 'Skills', icon: <Cpu className="w-4 h-4" />, count: skills.length },
    { id: 'inquiries', label: 'Inquiries', icon: <Inbox className="w-4 h-4" />, badge: newInquiriesCount > 0 ? newInquiriesCount : undefined },
    { id: 'about', label: 'About Business', icon: <User className="w-4 h-4" /> },
    { id: 'settings', label: 'Website Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'database', label: 'Connect Supabase', icon: <Database className="w-4 h-4 text-emerald-400" /> },
  ];

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleEditProjectFromDashboard = (proj: Project) => {
    setEditingProjectTarget(proj);
    setActiveTab('projects');
  };

  const handleViewInquiryFromDashboard = (inq: Inquiry) => {
    setViewingInquiryTarget(inq);
    setActiveTab('inquiries');
  };

  return (
    <div className="min-h-screen bg-[#020614] text-slate-100 flex flex-col md:flex-row relative selection:bg-[#1951fc] selection:text-white">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#03091e]/85 backdrop-blur-2xl border-b border-[#3781fc]/25 sticky top-0 z-40">
        <NiraLogo size="sm" customLogoUrl={settings.logo_url} />
        <div className="flex items-center gap-2">
          <button
            onClick={onViewPublicSite}
            className="p-1.5 text-slate-300 hover:text-white rounded-xl bg-[#08173d]/60 border border-[#3781fc]/30"
            title="View Public Website"
          >
            <ExternalLink className="w-4 h-4 text-[#cbe9fd]" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-300 hover:text-white rounded-xl bg-[#08173d]/60 border border-[#3781fc]/30"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#cbe9fd]" /> : <Menu className="w-5 h-5 text-[#cbe9fd]" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-[#040c24]/85 backdrop-blur-2xl border-r border-[#3781fc]/25 flex flex-col justify-between p-4 z-50 transition-transform duration-300 shadow-[0_8px_32px_0_rgba(3,25,91,0.4)] ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo in Sidebar */}
          <div className="pb-4 border-b border-[#3781fc]/20 mb-4 flex items-center justify-between">
            <NiraLogo size="md" customLogoUrl={settings.logo_url} />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-[#1951fc] to-[#3781fc] text-white border border-[#cbe9fd]/35 shadow-[0_0_20px_rgba(25,81,252,0.45)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]'
                    : 'text-slate-300 hover:text-white hover:bg-[#1951fc]/15 border border-transparent hover:border-[#3781fc]/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={activeTab === item.id ? 'text-white' : 'text-[#cbe9fd]'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && item.badge === undefined && (
                  <span className={`text-[10px] font-mono ${
                    activeTab === item.id ? 'text-[#cbe9fd]' : 'text-slate-500'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: Public site & Logout */}
        <div className="pt-3 border-t border-[#3781fc]/20 space-y-1.5">
          <button
            onClick={onViewPublicSite}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-[#cbe9fd] hover:text-white bg-[#08173d]/40 hover:bg-[#0f2862]/60 border border-[#3781fc]/25 transition-all cursor-pointer font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 transition-all cursor-pointer font-semibold"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-7xl overflow-y-auto">
        {activeTab === 'dashboard' && (
          <DashboardHome
            stats={stats}
            projects={projects}
            inquiries={inquiries}
            onNavigate={handleNavigate}
            onEditProject={handleEditProjectFromDashboard}
            onViewInquiry={handleViewInquiryFromDashboard}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsManager
            projects={projects}
            onRefresh={onRefreshAll}
            initialEditingProject={editingProjectTarget}
            onClearInitialEditing={() => setEditingProjectTarget(null)}
          />
        )}

        {activeTab === 'services' && (
          <ServicesManager services={services} onRefresh={onRefreshAll} />
        )}

        {activeTab === 'skills' && (
          <SkillsManager skills={skills} onRefresh={onRefreshAll} />
        )}

        {activeTab === 'inquiries' && (
          <InquiriesManager
            inquiries={inquiries}
            onRefresh={onRefreshAll}
            initialViewingInquiry={viewingInquiryTarget}
            onClearInitialViewing={() => setViewingInquiryTarget(null)}
          />
        )}

        {activeTab === 'about' && (
          <AboutManager settings={settings} onRefresh={onRefreshAll} />
        )}

        {activeTab === 'settings' && (
          <SettingsManager settings={settings} onRefresh={onRefreshAll} onNavigate={handleNavigate} />
        )}

        {activeTab === 'database' && (
          <SupabaseConnectManager onRefreshAll={onRefreshAll} />
        )}
      </main>
    </div>
  );
};
