import React, { useState, useEffect } from 'react';
import {
  fetchProjects,
  fetchServices,
  fetchSkills,
  fetchInquiries,
  fetchSiteSettings,
  getDashboardStats,
  isAuthenticated,
  clearAuthToken
} from './services/api.ts';
import { SiteSettings, Project, Service, Skill, Inquiry } from './types/index.ts';
import { initialSiteSettings, initialProjects, initialServices, initialSkills, initialInquiries } from './data/initialData.ts';

// Public Components
import { Navbar } from './components/public/Navbar.tsx';
import { Hero } from './components/public/Hero.tsx';
import { AboutSection } from './components/public/AboutSection.tsx';
import { SkillsSection } from './components/public/SkillsSection.tsx';
import { ServicesSection } from './components/public/ServicesSection.tsx';
import { ProjectsSection } from './components/public/ProjectsSection.tsx';
import { ContactSection } from './components/public/ContactSection.tsx';
import { Footer } from './components/public/Footer.tsx';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout.tsx';
import { AdminLogin } from './components/admin/AdminLogin.tsx';

export default function App() {
  const [view, setView] = useState<'public' | 'admin'>('public');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Core Data States
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [stats, setStats] = useState({
    totalProjects: initialProjects.length,
    completedProjects: initialProjects.filter(p => p.status === 'Completed').length,
    totalServices: initialServices.length,
    totalSkills: initialSkills.length,
    totalInquiries: initialInquiries.length,
    newInquiries: initialInquiries.filter(i => i.status === 'New').length,
    inProgressInquiries: 0,
    isSupabaseConnected: false
  });

  const [loading, setLoading] = useState(true);
  const [preselectedService, setPreselectedService] = useState<string>('');

  // Initial load
  const loadData = async () => {
    try {
      const [fetchedSettings, fetchedProjects, fetchedServices, fetchedSkills] = await Promise.all([
        fetchSiteSettings().catch(() => initialSiteSettings),
        fetchProjects().catch(() => initialProjects),
        fetchServices().catch(() => initialServices),
        fetchSkills().catch(() => initialSkills),
      ]);

      setSettings(fetchedSettings);
      setProjects(fetchedProjects);
      setServices(fetchedServices);
      setSkills(fetchedSkills);

      // Check admin status & load admin-specific data if logged in
      const authed = isAuthenticated();
      setIsAdminLoggedIn(authed);

      if (authed) {
        const [fetchedInquiries, fetchedStats] = await Promise.all([
          fetchInquiries().catch(() => initialInquiries),
          getDashboardStats().catch(() => ({
            totalProjects: fetchedProjects.length,
            completedProjects: fetchedProjects.filter(p => p.status === 'Completed').length,
            totalServices: fetchedServices.length,
            totalSkills: fetchedSkills.length,
            totalInquiries: 0,
            newInquiries: 0,
            inProgressInquiries: 0,
            isSupabaseConnected: false
          }))
        ]);
        setInquiries(fetchedInquiries);
        setStats(fetchedStats);
      }
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdmin = () => {
    if (isAuthenticated()) {
      setIsAdminLoggedIn(true);
      setView('admin');
      loadData();
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsAdminLoggedIn(true);
    setView('admin');
    loadData();
  };

  const handleLogout = () => {
    clearAuthToken();
    setIsAdminLoggedIn(false);
    setView('public');
  };

  const handleSelectServiceFromCard = (serviceTitle: string) => {
    setPreselectedService(serviceTitle);
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {view === 'public' ? (
        <>
          <Navbar
            settings={settings}
            onOpenAdmin={handleOpenAdmin}
            isAdminLoggedIn={isAdminLoggedIn}
          />

          <main className="flex-1">
            <Hero settings={settings} projectsCount={projects.length} />
            <AboutSection settings={settings} />
            <SkillsSection skills={skills} />
            <ServicesSection
              services={services}
              onSelectService={handleSelectServiceFromCard}
            />
            <ProjectsSection projects={projects} />
            <ContactSection
              settings={settings}
              services={services}
              preselectedService={preselectedService}
            />
          </main>

          <Footer settings={settings} onOpenAdmin={handleOpenAdmin} />

          {showLoginModal && (
            <AdminLogin
              onSuccess={handleLoginSuccess}
              onCancel={() => setShowLoginModal(false)}
            />
          )}
        </>
      ) : (
        <AdminLayout
          settings={settings}
          projects={projects}
          services={services}
          skills={skills}
          inquiries={inquiries}
          stats={stats}
          onRefreshAll={loadData}
          onLogout={handleLogout}
          onViewPublicSite={() => setView('public')}
        />
      )}
    </div>
  );
}
