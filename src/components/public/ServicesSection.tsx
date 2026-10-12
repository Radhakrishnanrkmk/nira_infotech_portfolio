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
    Globe: <Globe className="w-5 h-5" />,
    Briefcase: <Briefcase className="w-5 h-5" />,
    Building2: <Building2 className="w-5 h-5" />,
    Zap: <Zap className="w-5 h-5" />,
    Layers: <Layers className="w-5 h-5" />,
    Wrench: <Wrench className="w-5 h-5" />,
    Code: <Code className="w-5 h-5" />
  };
  return map[iconName] || <Code className="w-5 h-5" />;
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectService
}) => {
  const activeServices = services.filter(s => s.active);

  return (
    <section id="services" className="py-12 md:py-16 border-t border-[#3781fc]/20 bg-[#020614] relative">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[350px] bg-gradient-to-tr from-[#03195b]/30 via-[#1951fc]/20 to-[#3781fc]/15 rounded-full blur-[110px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs font-bold text-[#cbe9fd] tracking-wider uppercase mb-1.5 drop-shadow-[0_0_10px_rgba(55,129,252,0.6)]">
            What We Deliver
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_15px_rgba(25,81,252,0.3)]">
            Our Services & Solutions
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            End-to-end web engineering crafted with clean code, modern designs, and hassle-free content management.
          </p>
        </div>

        {/* Services 3-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeServices.map((service, index) => (
            <div
              key={service.id}
              className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#08173d]/55 to-[#040d24]/65 border border-[#3781fc]/25 backdrop-blur-xl shadow-[0_8px_30px_rgba(3,25,91,0.4)] shadow-[inset_0_1px_1px_rgba(203,233,253,0.25)] hover:border-[#3781fc]/60 hover:shadow-[0_12px_40px_rgba(25,81,252,0.35)] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0b2cb1]/60 to-[#1951fc]/40 border border-[#cbe9fd]/35 text-[#cbe9fd] flex items-center justify-center shadow-[0_0_15px_rgba(25,81,252,0.35)] transition-transform group-hover:scale-110">
                    {renderServiceIcon(service.icon)}
                  </div>
                  <span className="text-xs font-mono text-slate-400 font-semibold">
                    0{index + 1}.
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-[#cbe9fd] transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#3781fc]/20 flex items-center justify-between">
                <button
                  onClick={() => onSelectService(service.title)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#cbe9fd] hover:text-white transition-colors cursor-pointer"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
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
