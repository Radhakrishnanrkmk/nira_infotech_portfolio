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

const renderSkillIcon = (iconName: string) => {
  const map: Record<string, React.ReactNode> = {
    Code: <Code className="w-4 h-4" />,
    Palette: <Palette className="w-4 h-4" />,
    FileCode: <FileCode className="w-4 h-4" />,
    Atom: <Atom className="w-4 h-4" />,
    Sparkles: <Sparkles className="w-4 h-4" />,
    Smartphone: <Smartphone className="w-4 h-4" />,
    Server: <Server className="w-4 h-4" />,
    Cpu: <Cpu className="w-4 h-4" />,
    Network: <Network className="w-4 h-4" />,
    Database: <Database className="w-4 h-4" />,
    HardDrive: <HardDrive className="w-4 h-4" />,
    GitBranch: <GitBranch className="w-4 h-4" />,
    Terminal: <Terminal className="w-4 h-4" />,
    Layers: <Layers className="w-4 h-4" />,
    Wrench: <Wrench className="w-4 h-4" />
  };
  return map[iconName] || <Code className="w-4 h-4" />;
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const activeSkills = skills.filter(s => s.active);
  const categories = ['All', 'Frontend', 'Backend', 'Database & Cloud', 'Tools & DevOps'];

  const displayedSkills = selectedCategory === 'All'
    ? activeSkills
    : activeSkills.filter(s => s.category === selectedCategory);

  return (
    <section id="skills" className="py-12 md:py-16 border-t border-[#3781fc]/20 bg-[#020614] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <p className="text-xs font-bold text-[#cbe9fd] tracking-wider uppercase mb-1.5 drop-shadow-[0_0_10px_rgba(55,129,252,0.6)]">
            Technical Stack
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_15px_rgba(25,81,252,0.3)]">
            Technologies & Core Skills
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Engineered with modern, production-grade tools. All technical proficiencies are dynamically loaded and editable via the Admin Panel.
          </p>
        </div>

        {/* Filter Segmented Control */}
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

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {displayedSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-[#3781fc]/25 backdrop-blur-xl shadow-[0_8px_30px_rgba(3,25,91,0.35)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.25)] hover:border-[#3781fc]/60 hover:shadow-[0_12px_40px_rgba(25,81,252,0.35)] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0b2cb1]/50 to-[#1951fc]/35 border border-[#cbe9fd]/30 text-[#cbe9fd] flex items-center justify-center shadow-[0_0_12px_rgba(25,81,252,0.3)] transition-transform group-hover:scale-110">
                    {renderSkillIcon(skill.icon)}
                  </div>
                  <span className="text-[11px] font-mono text-[#cbe9fd]/80 font-semibold">
                    {skill.category}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#cbe9fd] transition-colors">
                  {skill.name}
                </h3>

                {skill.description && (
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    {skill.description}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#3781fc]/20 flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>Production Proficient</span>
              </div>
            </div>
          ))}
        </div>

        {displayedSkills.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            No active skills found in this category.
          </div>
        )}
      </div>
    </section>
  );
};
