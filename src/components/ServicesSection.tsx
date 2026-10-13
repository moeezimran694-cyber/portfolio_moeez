import React from 'react';
import { Globe, Mic, Video, Palette, Box, Cpu, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { SERVICES_DATA, Service } from '../data/servicesData';
import { motion } from 'motion/react';

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const getIcon = (name: Service['iconName']) => {
    switch (name) {
      case 'Globe':
        return <Globe className="w-6 h-6 text-cyan-400" />;
      case 'Mic':
        return <Mic className="w-6 h-6 text-purple-400" />;
      case 'Video':
        return <Video className="w-6 h-6 text-fuchsia-400" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-pink-400" />;
      case 'Box':
        return <Box className="w-6 h-6 text-cyan-300" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-purple-300" />;
      default:
        return <Globe className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <section id="services" className="relative py-28 bg-[#030712] overflow-hidden">
      {/* Background ambient lighting - optimized */}
      <div className="absolute top-1/2 left-0 w-80 h-80 radial-glow-purple -translate-y-1/2" />
      <div className="absolute bottom-10 right-0 w-80 h-80 radial-glow-cyan" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with smooth scroll animation */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-3">
            <span className="w-6 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400" />
            <span>Tailored Digital Capabilities</span>
            <span className="w-6 h-[2px] bg-gradient-to-l from-purple-500 to-cyan-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Grow Digitally.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal">
            A complete range of technology and creative services under one roof.
          </p>
        </motion.div>

        {/* 6 Services Grid with staggered smooth scroll entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_DATA.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col justify-between p-8 rounded-2xl bg-[#0b0f19] border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)] hover:shadow-[0_15px_35px_-10px_rgba(139,92,246,0.2)] will-change-transform"
            >
              {/* Subtle card corner glow on hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div>
                {/* Top bar with Icon and Editorial Index */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/60 group-hover:border-cyan-500/50 flex items-center justify-center transition-colors shadow-inner">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-sm font-mono font-semibold text-slate-500 group-hover:text-cyan-400 transition-colors">
                    {service.number}
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-200 transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                  {service.description}
                </p>

                {/* Feature bullet list */}
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Working Discuss Project Action */}
              <div className="pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => onSelectService(service.title)}
                  className="w-full inline-flex items-center justify-between py-2.5 px-4 text-xs font-semibold text-slate-200 hover:text-white rounded-xl bg-slate-900/60 hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 group/btn cursor-pointer"
                >
                  <span>Discuss This Service</span>
                  <ArrowUpRight className="w-4 h-4 text-cyan-400 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </button>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
