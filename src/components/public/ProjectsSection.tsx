import React, { useState } from 'react';
import { Project } from '../../types/index.ts';
import { ProjectPoster } from '../common/ProjectPoster.tsx';
import { ExternalLink, Github, Eye, Sparkles, X, CheckCircle2 } from 'lucide-react';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category || 'General')))];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="projects" className="py-12 md:py-16 border-t border-[#3781fc]/20 bg-[#020614] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <p className="text-xs font-bold text-[#cbe9fd] tracking-wider uppercase mb-1.5 drop-shadow-[0_0_10px_rgba(55,129,252,0.6)]">
            Selected Works
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_15px_rgba(25,81,252,0.3)]">
            Featured Projects & Case Studies
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Real-world applications built with React, Node.js, Express, and Supabase. Explore live interactive demos and source code.
          </p>
        </div>

        {/* Filter Tabs */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-1 p-1.5 bg-[#08173d]/60 border border-[#3781fc]/30 rounded-2xl max-w-xl mx-auto mb-8 backdrop-blur-xl shadow-[0_8px_30px_rgba(3,25,91,0.4)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.2)]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#1951fc] to-[#3781fc] text-white border border-[#cbe9fd]/40 shadow-[0_0_15px_rgba(25,81,252,0.5)]'
                    : 'text-slate-300 hover:text-white hover:bg-[#1951fc]/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-[#3781fc]/25 backdrop-blur-xl shadow-[0_8px_30px_rgba(3,25,91,0.4)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.25)] hover:border-[#3781fc]/60 hover:shadow-[0_12px_40px_rgba(25,81,252,0.35)] transition-all flex flex-col overflow-hidden"
            >
              {/* Project Poster Container with click to preview */}
              <div
                onClick={() => setActiveModalProject(project)}
                className="relative cursor-pointer overflow-hidden aspect-[16/10] bg-[#03091e]"
              >
                <ProjectPoster
                  posterUrl={project.poster_url}
                  title={project.title}
                  category={project.category}
                />
                {project.featured && (
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0b2cb1]/80 border border-[#cbe9fd]/40 text-[#cbe9fd] text-[10px] font-bold backdrop-blur-md shadow-[0_0_15px_rgba(25,81,252,0.4)]">
                    <Sparkles className="w-2.5 h-2.5 text-[#cbe9fd]" />
                    <span>Featured</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Category & Status */}
                  <div className="flex items-center gap-1.5 text-xs text-[#cbe9fd] font-semibold mb-1.5">
                    <span className="text-[#3781fc]">{project.category}</span>
                    <span aria-hidden="true" className="text-slate-500">·</span>
                    <span className="text-slate-300">{project.status}</span>
                  </div>

                  <h3
                    onClick={() => setActiveModalProject(project)}
                    className="text-base sm:text-lg font-bold text-white group-hover:text-[#cbe9fd] transition-colors cursor-pointer mb-1.5"
                  >
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2 mb-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 text-xs text-slate-300 py-1.5 border-t border-[#3781fc]/20 mb-4 font-medium">
                      {project.technologies.map((tech, i) => (
                        <React.Fragment key={tech}>
                          <span className="text-slate-200">{tech}</span>
                          {i < project.technologies.length - 1 && (
                            <span className="text-[#3781fc]/60" aria-hidden="true">
                              ·
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons: Live Demo, View Details, GitHub */}
                <div className="pt-3 border-t border-[#3781fc]/20 flex flex-wrap items-center gap-2">
                  {(project.demo_url || project.live_url) && (
                    <a
                      href={project.demo_url || project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#1951fc] to-[#3781fc] hover:from-[#2563eb] hover:to-[#60a5fa] rounded-xl border border-[#cbe9fd]/35 shadow-[0_0_15px_rgba(25,81,252,0.4)] transition-all whitespace-nowrap"
                    >
                      <ExternalLink className="w-3 h-3 text-[#cbe9fd]" />
                      <span>Live Demo</span>
                    </a>
                  )}

                  <button
                    onClick={() => setActiveModalProject(project)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#cbe9fd] hover:text-white bg-[#0b1c44]/55 hover:bg-[#0f2862]/65 border border-[#3781fc]/35 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-slate-300" />
                    <span>Details</span>
                  </button>

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-300 hover:text-white bg-[#0b1c44]/55 hover:bg-[#0f2862]/65 border border-[#3781fc]/35 rounded-xl transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            No projects found in this category.
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#07173e]/95 to-[#03091e]/95 border border-[#3781fc]/40 backdrop-blur-2xl shadow-[0_16px_60px_rgba(3,25,91,0.6)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.3)] p-5 sm:p-7 text-white">
            {/* Modal Close Button */}
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#0b1b42]/80 hover:bg-[#0f245c] text-slate-300 hover:text-white border border-[#3781fc]/30 transition-colors cursor-pointer z-10"
              aria-label="Close project modal"
            >
              <X className="w-4 h-4 text-[#cbe9fd]" />
            </button>

            {/* Poster Header */}
            <div className="rounded-2xl overflow-hidden mb-5 border border-[#3781fc]/30 aspect-video bg-[#020512]">
              <ProjectPoster
                posterUrl={activeModalProject.poster_url}
                title={activeModalProject.title}
                category={activeModalProject.category}
                aspectRatio="wide"
              />
            </div>

            {/* Title & Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#cbe9fd] font-semibold mb-1">
                  <span>{activeModalProject.category}</span>
                  <span aria-hidden="true" className="text-slate-500">·</span>
                  <span className="text-slate-300">{activeModalProject.status}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {activeModalProject.title}
                </h3>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex items-center gap-2">
                {(activeModalProject.demo_url || activeModalProject.live_url) && (
                  <a
                    href={activeModalProject.demo_url || activeModalProject.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#1951fc] to-[#3781fc] hover:from-[#2563eb] hover:to-[#60a5fa] rounded-xl border border-[#cbe9fd]/35 shadow-[0_0_20px_rgba(25,81,252,0.4)] transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#cbe9fd]" />
                    <span>Live Demo</span>
                  </a>
                )}
                {activeModalProject.github_url && (
                  <a
                    href={activeModalProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#cbe9fd] bg-[#0b1c44]/60 hover:bg-[#0f2862] border border-[#3781fc]/35 rounded-xl transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Source</span>
                  </a>
                )}
              </div>
            </div>

            {/* Project Short Description */}
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {activeModalProject.description}
            </p>

            {/* Detailed Architecture & Writeup */}
            {activeModalProject.details && (
              <div className="mb-4 p-4 rounded-2xl bg-[#09183d]/60 border border-[#3781fc]/25 shadow-[inset_0_1px_1px_rgba(203,233,253,0.15)]">
                <h4 className="text-xs text-[#cbe9fd] font-bold uppercase tracking-wider mb-1.5">
                  System Architecture & Implementation
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeModalProject.details}
                </p>
              </div>
            )}

            {/* Key Features */}
            {activeModalProject.features && activeModalProject.features.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs text-[#3781fc] font-bold uppercase tracking-wider mb-2">
                  Key Technical Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModalProject.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 p-2.5 rounded-xl bg-[#071536]/50 border border-[#3781fc]/20 text-xs text-slate-200 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3781fc] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies Grid */}
            {activeModalProject.technologies && activeModalProject.technologies.length > 0 && (
              <div className="pt-4 border-t border-[#3781fc]/20 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400 font-medium mr-1.5">Built With:</span>
                {activeModalProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs text-[#cbe9fd] font-medium bg-[#0b1c44]/60 border border-[#3781fc]/30 rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
