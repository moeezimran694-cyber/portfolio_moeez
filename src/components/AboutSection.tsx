import React from 'react';
import { ArrowRight, Lightbulb, Wrench, Users, BookOpen } from 'lucide-react';
import { SITE_CONFIG } from '../data/config';
import { motion } from 'motion/react';

interface AboutSectionProps {
  onDiscussProject: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onDiscussProject }) => {
  const principleIcons = [
    <Lightbulb className="w-5 h-5 text-purple-400" />,
    <Wrench className="w-5 h-5 text-cyan-400" />,
    <Users className="w-5 h-5 text-fuchsia-400" />,
    <BookOpen className="w-5 h-5 text-cyan-300" />
  ];

  return (
    <section id="about" className="relative py-28 bg-[#030712] overflow-hidden">
      {/* Background ambient lighting - optimized */}
      <div className="absolute top-1/3 left-10 w-80 h-80 radial-glow-purple" />
      <div className="absolute bottom-10 right-10 w-80 h-80 radial-glow-cyan" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with smooth scroll animation */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-3">
            <span className="w-6 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400" />
            <span>Design Philosophy & Identity</span>
            <span className="w-6 h-[2px] bg-gradient-to-l from-purple-500 to-cyan-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
            Let's Build{' '}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Something Great.
            </span>
          </h2>
        </motion.div>

        {/* 2-Column Split with smooth scroll animation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Workstation Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative group will-change-transform"
          >
            {/* Ambient Backlight - optimized */}
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 via-cyan-500/15 to-purple-800/20 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-2xl">
              <img
                src="/src/assets/images/about_workstation_1791821903064.jpg"
                alt="Creative development workstation with purple and cyan ambient lighting"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/80 backdrop-blur-sm border border-slate-700/60">
                <p className="text-xs font-semibold text-white">Creative Studio & Engineering Lab</p>
                <p className="text-[11px] text-slate-400 mt-0.5">High-fidelity 3D modeling, full-stack web, and AI workflow integration</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio & 4 Principles */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center will-change-transform"
          >
            {/* Introduction prose */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#090e1d] border border-slate-800/80 mb-8">
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                I'm <strong className="text-cyan-300 font-semibold">Moeez</strong>, a digital creator focused on websites, AI-powered solutions, creative advertising, and 3D product visuals. I combine technology and creativity to build useful digital experiences for businesses. My goal is to deliver professional work, communicate clearly, and keep improving with every project.
              </p>
            </div>

            {/* 4 Guiding Principles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {SITE_CONFIG.principles.map((item, index) => (
                <div
                  key={index}
                  className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-purple-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0">
                      {principleIcons[index]}
                    </div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Discuss Project CTA Button */}
            <div>
              <button
                type="button"
                onClick={onDiscussProject}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs uppercase tracking-wider font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
              >
                <span>Discuss a Project</span>
                <ArrowRight className="w-4 h-4 text-cyan-200" />
              </button>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
