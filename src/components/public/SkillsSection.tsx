import React, { useState } from 'react';
import { Skill } from '../../types/index.ts';
import {
  Code,
  Palette,
  FileCode,
  Atom,
  Sparkles,
  Smartphone,
  Server,
  Cpu,
  Network,
  Database,
  HardDrive,
  GitBranch,
  Terminal,
  Layers,
  Wrench,
  Check
} from 'lucide-react';

interface SkillsSectionProps {
  skills: Skill[];
}

// Icon helper map
const renderSkillIcon = (iconName: string) => {
  const map: Record<string, React.ReactNode> = {
    Code: <Code className="w-5 h-5" />,
    Palette: <Palette className="w-5 h-5" />,
    FileCode: <FileCode className="w-5 h-5" />,
    Atom: <Atom className="w-5 h-5" />,
    Sparkles: <Sparkles className="w-5 h-5" />,
    Smartphone: <Smartphone className="w-5 h-5" />,
    Server: <Server className="w-5 h-5" />,
    Cpu: <Cpu className="w-5 h-5" />,
    Network: <Network className="w-5 h-5" />,
    Database: <Database className="w-5 h-5" />,
    HardDrive: <HardDrive className="w-5 h-5" />,
    GitBranch: <GitBranch className="w-5 h-5" />,
    Terminal: <Terminal className="w-5 h-5" />,
    Layers: <Layers className="w-5 h-5" />,
    Wrench: <Wrench className="w-5 h-5" />
  };
  return map[iconName] || <Code className="w-5 h-5" />;
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter active skills
  const activeSkills = skills.filter(s => s.active);

  const categories = ['All', 'Frontend', 'Backend', 'Database & Cloud', 'Tools & DevOps'];

  const displayedSkills = selectedCategory === 'All'
    ? activeSkills
    : activeSkills.filter(s => s.category === selectedCategory);

  return (
    <section id="skills" className="py-20 md:py-28 border-t border-slate-800/80 bg-[#0b0f19] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase mb-2">
            Technical Stack
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Technologies & Core Skills
          </h2>
          <p className="mt-3 text-base text-slate-400">
            Engineered with modern, production-grade tools. All technical proficiencies are dynamically loaded and editable via the Admin Panel.
          </p>
        </div>

        {/* Filter Segmented Control (Interactive buttons per Section 1A) */}
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

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 flex items-center justify-center group-hover:text-cyan-300 group-hover:border-cyan-500/30 transition-colors">
                    {renderSkillIcon(skill.icon)}
                  </div>
                  {/* Clean unboxed text category label per Section 1A */}
                  <span className="text-[11px] font-mono text-slate-500">
                    {skill.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {skill.name}
                </h3>

                {skill.description && (
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    {skill.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                <Check className="w-3.5 h-3.5" />
                <span>Production Proficient</span>
              </div>
            </div>
          ))}
        </div>

        {displayedSkills.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            No active skills found in this category.
          </div>
        )}
      </div>
    </section>
  );
};
