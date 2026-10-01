import React from 'react';
import { Service } from '../../types/index.ts';
import {
  Globe,
  Briefcase,
  Building2,
  Zap,
  Layers,
  Wrench,
  ArrowRight,
  CheckCircle,
  Code
} from 'lucide-react';

interface ServicesSectionProps {
  services: Service[];
  onSelectService: (serviceTitle: string) => void;
}

const renderServiceIcon = (iconName: string) => {
  const map: Record<string, React.ReactNode> = {
    Globe: <Globe className="w-6 h-6" />,
    Briefcase: <Briefcase className="w-6 h-6" />,
    Building2: <Building2 className="w-6 h-6" />,
    Zap: <Zap className="w-6 h-6" />,
    Layers: <Layers className="w-6 h-6" />,
    Wrench: <Wrench className="w-6 h-6" />,
    Code: <Code className="w-6 h-6" />
  };
  return map[iconName] || <Code className="w-6 h-6" />;
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectService
}) => {
  const activeServices = services.filter(s => s.active);

  return (
    <section id="services" className="py-20 md:py-28 border-t border-slate-800/80 bg-[#090d16] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase mb-2">
            What We Deliver
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Our Services & Solutions
          </h2>
          <p className="mt-3 text-base text-slate-400">
            End-to-end web engineering crafted with clean code, modern designs, and hassle-free content management.
          </p>
        </div>

        {/* Services 3-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.map((service, index) => (
            <div
              key={service.id}
              className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 flex items-center justify-center group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition-colors">
                    {renderServiceIcon(service.icon)}
                  </div>
                  {/* Human editorial index per Section 1B (no //) */}
                  <span className="text-xs font-mono text-slate-600">
                    0{index + 1}.
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onSelectService(service.title)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Available</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
