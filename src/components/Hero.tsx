import React from 'react';
import { ArrowRight, Layers, ShieldCheck, Zap, Bot } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onExploreServices: () => void;
  onViewProjects: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreServices, onViewProjects }) => {
  return (
    <section id="home" className="relative min-h-[85vh] pt-36 pb-24 flex items-center justify-center overflow-hidden">
      {/* Background ambient lighting glows - optimized pre-computed radial gradients without GPU blur penalty */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] radial-glow-purple" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] radial-glow-cyan" />
      
      {/* Subtle background tech grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        
        {/* Domain-specific clean kicker */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-6 px-4 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Full-Stack Digital Agency & AI Creator</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400">Available For Global Projects</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-8 text-balance max-w-4xl mx-auto"
        >
          Turn Your Ideas Into{' '}
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            Digital Solutions.
          </span>
        </motion.h1>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto mb-10"
        >
          I build modern websites, AI-powered automation, intelligent voice agents, cinematic advertisements, and premium 3D product visuals that help businesses grow online.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            type="button"
            onClick={onExploreServices}
            className="w-full sm:w-auto relative inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 hover:opacity-95 shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>Explore My Services</span>
            <ArrowRight className="w-4 h-4 text-cyan-200" />
          </button>

          <button
            type="button"
            onClick={onViewProjects}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-slate-200 hover:text-white rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/50 shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>View My Projects</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </button>
        </motion.div>

        {/* Three Compact Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center sm:justify-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs text-left">
              <p className="font-semibold text-slate-200 leading-snug">Digital Solutions</p>
              <p className="text-slate-400">For Global Businesses</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="text-xs text-left">
              <p className="font-semibold text-slate-200 leading-snug">Modern AI-Powered</p>
              <p className="text-slate-400">Production Tools</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-xs text-left">
              <p className="font-semibold text-slate-200 leading-snug">Performance-Focused</p>
              <p className="text-slate-400">Rapid Delivery</p>
            </div>
          </div>
        </motion.div>

        {/* Quiet Capability Highlights Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400"
        >
          <span>Web Applications</span>
          <span aria-hidden="true" className="text-purple-500/60 font-bold">·</span>
          <span>AI Voice Calling</span>
          <span aria-hidden="true" className="text-cyan-500/60 font-bold">·</span>
          <span>Blender 3D Visuals</span>
          <span aria-hidden="true" className="text-purple-500/60 font-bold">·</span>
          <span>Cinematic Ad Reels</span>
          <span aria-hidden="true" className="text-cyan-500/60 font-bold">·</span>
          <span>Graphic Design</span>
          <span aria-hidden="true" className="text-purple-500/60 font-bold">·</span>
          <span>Workflow Automations</span>
        </motion.div>

      </div>
    </section>
  );
};
