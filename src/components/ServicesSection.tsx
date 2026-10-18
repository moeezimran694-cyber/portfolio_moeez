import React from 'react';
import { ArrowUpRight, CheckCircle2, Calculator, Layers, Sparkles, Workflow, ArrowRight } from 'lucide-react';
import { SERVICES_DATA } from '../data/servicesData';
import { ServiceAnimatedIcon } from './ServiceAnimatedIcons';
import { motion } from 'motion/react';

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
  onOpenCalculator?: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService, onOpenCalculator }) => {
  const workflowSteps = [
    {
      step: '01',
      title: 'Discovery & Strategic Architecture',
      desc: 'Deep-dive into business goals, technical feasibility, UI/UX structure, and AI roadmap.',
      tech: 'Architecture · Wireframes',
    },
    {
      step: '02',
      title: 'Visual Identity & 3D Prototyping',
      desc: 'Precision vector logos in Illustrator, cinematic 3D renders in Blender, and Photoshop retouching.',
      tech: 'Blender 3D · Adobe CC',
    },
    {
      step: '03',
      title: 'Full-Stack & Neural AI Engineering',
      desc: 'Ultra-fast responsive web apps, autonomous conversational voice agents, and workflow bots.',
      tech: 'React · TS · Voice AI',
    },
    {
      step: '04',
      title: 'Production Deployment & Optimization',
      desc: 'Zero-latency global deployment on Vercel/Cloud, verified SEO, and recurring analytics.',
      tech: 'Vercel · Cloud SQL · CI/CD',
    },
  ];

  return (
    <section id="services" className="relative py-28 bg-[#030712] overflow-hidden">
      {/* Background ambient lighting - optimized */}
      <div className="absolute top-1/2 left-0 w-80 h-80 radial-glow-purple -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 radial-glow-cyan pointer-events-none" />

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
              className="group relative flex flex-col justify-between p-8 rounded-2xl bg-[#0b0f19] border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1.5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_40px_-10px_rgba(139,92,246,0.25)] will-change-transform"
            >
              {/* Subtle card corner glow on hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div>
                {/* Top bar with Icon and Editorial Index */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-700/60 group-hover:border-slate-500/80 group-hover:bg-slate-800/80 flex items-center justify-center transition-all duration-300 shadow-inner">
                    <ServiceAnimatedIcon serviceId={service.id} iconName={service.iconName} className="w-6 h-6" />
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

        {/* Refined Connected Capability Workflow Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 pt-16 border-t border-slate-800/80"
        >
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-purple-400 mb-2">
              <Workflow className="w-3.5 h-3.5 text-purple-400" />
              <span>Production Pipeline</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              From Concept to{' '}
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Live Reality.
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 font-normal">
              A structured, transparent engineering workflow designed to deliver results on time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {workflowSteps.map((item, idx) => (
              <div 
                key={idx}
                className="relative p-6 rounded-2xl bg-[#090d1a] border border-slate-800/80 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="text-2xl font-black font-mono text-purple-500/40 group-hover:text-cyan-400/80 transition-colors mb-3">
                  {item.step}
                </div>
                <h4 className="text-sm font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {item.desc}
                </p>
                <div className="pt-3 border-t border-slate-800/60 text-[11px] font-mono text-slate-500 group-hover:text-purple-300 transition-colors">
                  {item.tech}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Project Cost Calculator Entry Point */}
        {onOpenCalculator && (
          <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-cyan-950/40 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 mb-2">
                <Calculator className="w-3.5 h-3.5" />
                <span>Instant Cost Estimator</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Need an Instant Custom Project Estimate?</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">Select your service, customize requirements, and get an automated price range in PKR.</p>
            </div>
            <button
              type="button"
              onClick={onOpenCalculator}
              className="px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-purple-900/40 shrink-0 cursor-pointer flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              <Calculator className="w-4 h-4 text-cyan-200" />
              <span>Calculate Project Cost</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
