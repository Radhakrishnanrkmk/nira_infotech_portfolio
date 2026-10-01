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

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category || 'General')))];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="projects" className="py-20 md:py-28 border-t border-slate-800/80 bg-[#0b0f19] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase mb-2">
            Selected Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Featured Projects & Case Studies
          </h2>
          <p className="mt-3 text-base text-slate-400">
            Real-world applications built with React, Node.js, Express, and Supabase. Explore live interactive demos and source code.
          </p>
        </div>

        {/* Filter Tabs */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl max-w-2xl mx-auto mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col overflow-hidden shadow-lg shadow-black/40"
            >
              {/* Project Poster Container with click to preview */}
              <div
                onClick={() => setActiveModalProject(project)}
                className="relative cursor-pointer overflow-hidden"
              >
                <ProjectPoster
                  posterUrl={project.poster_url}
                  title={project.title}
                  category={project.category}
                />
                {project.featured && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 text-[11px] font-medium backdrop-blur-sm shadow-md">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Featured</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Category & Status: Unboxed Text with Separator (Section 1A) */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-2">
                    <span className="text-cyan-400 font-medium">{project.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.status}</span>
                  </div>

                  <h3
                    onClick={() => setActiveModalProject(project)}
                    className="text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors cursor-pointer mb-2"
                  >
                    {project.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4">
                    {project.description}
                  </p>

                  {/* Technologies: Unboxed clean text with typographic separators (Section 1A) */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300 font-mono py-2 border-t border-slate-800/80 mb-5">
                      {project.technologies.map((tech, i) => (
                        <React.Fragment key={tech}>
                          <span className="text-slate-300">{tech}</span>
                          {i < project.technologies.length - 1 && (
                            <span className="text-slate-600" aria-hidden="true">
                              |
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons: Live Demo, View Details, GitHub */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                  {(project.demo_url || project.live_url) && (
                    <a
                      href={project.demo_url || project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}

                  <button
                    onClick={() => setActiveModalProject(project)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Project</span>
                  </button>

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            No projects found in this category.
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0e1626] border border-slate-700 shadow-2xl p-6 sm:p-8">
            {/* Modal Close Button */}
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
              aria-label="Close project modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Poster Header */}
            <div className="rounded-2xl overflow-hidden mb-6 border border-slate-800">
              <ProjectPoster
                posterUrl={activeModalProject.poster_url}
                title={activeModalProject.title}
                category={activeModalProject.category}
                aspectRatio="wide"
              />
            </div>

            {/* Title & Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                  <span>{activeModalProject.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400">{activeModalProject.status}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                  {activeModalProject.title}
                </h3>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex items-center gap-3">
                {(activeModalProject.demo_url || activeModalProject.live_url) && (
                  <a
                    href={activeModalProject.demo_url || activeModalProject.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-md transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Live Demo</span>
                  </a>
                )}
                {activeModalProject.github_url && (
                  <a
                    href={activeModalProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>Source</span>
                  </a>
                )}
              </div>
            </div>

            {/* Project Short Description */}
            <p className="text-base text-slate-300 leading-relaxed mb-6">
              {activeModalProject.description}
            </p>

            {/* Detailed Architecture & Writeup */}
            {activeModalProject.details && (
              <div className="mb-6 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <h4 className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider mb-2">
                  System Architecture & Implementation
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeModalProject.details}
                </p>
              </div>
            )}

            {/* Key Features */}
            {activeModalProject.features && activeModalProject.features.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider mb-3">
                  Key Technical Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeModalProject.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies Grid */}
            {activeModalProject.technologies && activeModalProject.technologies.length > 0 && (
              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-mono mr-2">Built With:</span>
                {activeModalProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 rounded-lg"
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
