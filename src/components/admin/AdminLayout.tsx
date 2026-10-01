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
  PlusCircle,
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
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0b0f19] border-b border-slate-800 sticky top-0 z-40">
        <NiraLogo size="sm" customLogoUrl={settings.logo_url} />
        <div className="flex items-center gap-2">
          <button
            onClick={onViewPublicSite}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            title="View Public Website"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-[#0b0f19] border-r border-slate-800/90 flex flex-col justify-between p-5 z-50 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo in Sidebar */}
          <div className="pb-6 border-b border-slate-800/80 mb-6 flex items-center justify-between">
            <NiraLogo size="md" customLogoUrl={settings.logo_url} />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    activeTab === item.id ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && item.badge === undefined && (
                  <span className={`text-[10px] font-mono ${
                    activeTab === item.id ? 'text-slate-900' : 'text-slate-500'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: Public site & Logout */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <button
            onClick={onViewPublicSite}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-cyan-400 hover:bg-slate-850 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl overflow-y-auto">
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
