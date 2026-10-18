import React, { useRef } from 'react';
import { ArrowRight, Layers, ShieldCheck, Zap, Bot, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { FloatingToolIcons } from './FloatingToolIcons';
import { useSmoothScroll } from '../context/SmoothScrollContext';

interface HeroProps {
  onExploreServices: () => void;
  onViewProjects: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreServices, onViewProjects }) => {
  const { scrollTo } = useSmoothScroll();
  const heroRef = useRef<HTMLElement>(null);

  // Parallax layers for subtle depth on scroll
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const opacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  // Words for staggered headline reveal
  const headlineWords = [
    { text: 'Turn', isGradient: false },
    { text: 'Your', isGradient: false },
    { text: 'Ideas', isGradient: false },
    { text: 'Into', isGradient: false },
    { text: 'Digital', isGradient: true },
    { text: 'Solutions.', isGradient: true },
  ];

  return (
    <section 
      id="home" 
      ref={heroRef}
      className="relative min-h-[92vh] pt-32 sm:pt-36 pb-20 flex items-center justify-center overflow-hidden"
    >
      {/* 24/7 Floating Tool Icons: Photoshop, Illustrator, Blender, and AI */}
      <FloatingToolIcons />

      {/* Layered Cinematic Parallax Background Elements */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none will-change-transform"
      >
        {/* Atmospheric glowing radial gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] radial-glow-purple opacity-90" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] radial-glow-cyan opacity-80" />
        <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-gradient-to-tr from-purple-900/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Subtle cinematic tech grid with radial mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Subtle atmospheric particle lights */}
        <div className="absolute top-24 left-[15%] w-1.5 h-1.5 rounded-full bg-cyan-400/40 animate-ping opacity-60" />
        <div className="absolute top-44 right-[20%] w-1.5 h-1.5 rounded-full bg-purple-400/50 animate-pulse opacity-70" />
        <div className="absolute bottom-32 left-[25%] w-1 h-1 rounded-full bg-fuchsia-400/40 animate-ping opacity-50" />
      </motion.div>

      {/* Main Content Container with Opacity Fade & Depth Translation */}
      <motion.div 
        style={{ y: contentY, opacity: opacityFade }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center"
      >
        {/* Domain-specific clean kicker */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-6 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 shadow-[0_0_20px_rgba(6,182,212,0.12)] backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />
          <span>Full-Stack Digital Agency & AI Creator</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400">Available For Global Projects</span>
        </motion.div>

        {/* Cinematic Headline: Word-by-Word Staggered Reveal */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12] mb-8 max-w-4xl mx-auto flex flex-wrap justify-center gap-x-3 sm:gap-x-4 gap-y-1">
          {headlineWords.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1">
              <motion.span
                initial={{ y: 50, opacity: 0, rotateZ: 2 }}
                animate={{ y: 0, opacity: 1, rotateZ: 0 }}
                transition={{
                  duration: 0.65,
                  delay: 0.15 + i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`inline-block ${
                  word.isGradient
                    ? 'bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent font-black drop-shadow-[0_4px_25px_rgba(168,85,247,0.25)]'
                    : 'text-white'
                }`}
              >
                {word.text}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto mb-10 text-balance"
        >
          I build modern websites, AI-powered automation, intelligent voice agents, cinematic advertisements, and premium 3D product visuals that help businesses grow online.
        </motion.p>

        {/* Sequenced CTA Buttons with Refined Hover Micro-Interactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            type="button"
            onClick={onExploreServices}
            className="group w-full sm:w-auto relative inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer overflow-hidden"
          >
            {/* Subtle light sweep reflection */}
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            
            <span className="relative z-10">Explore My Services</span>
            <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform relative z-10" />
          </button>

          <button
            type="button"
            onClick={onViewProjects}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-slate-200 hover:text-white rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/50 shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>View My Projects</span>
            <Layers className="w-4 h-4 text-purple-400 group-hover:text-cyan-400 transition-colors" />
          </button>
        </motion.div>

        {/* Three Compact Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center sm:justify-start gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/70 hover:border-purple-500/30 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs text-left">
              <p className="font-semibold text-slate-200 leading-snug">Digital Solutions</p>
              <p className="text-slate-400">For Global Businesses</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/70 hover:border-cyan-500/30 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="text-xs text-left">
              <p className="font-semibold text-slate-200 leading-snug">Modern AI-Powered</p>
              <p className="text-slate-400">Production Tools</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/70 hover:border-fuchsia-500/30 transition-colors">
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
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400"
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

        {/* Small Animated Cinematic Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-14 flex flex-col items-center justify-center cursor-pointer group"
          onClick={() => scrollTo('stats')}
        >
          <div className="w-5 h-9 rounded-full border-2 border-slate-700 group-hover:border-cyan-400/70 flex items-start justify-center p-1 transition-colors shadow-sm">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]"
            />
          </div>
          <span className="text-[11px] font-medium text-slate-400 group-hover:text-cyan-300 mt-2 flex items-center gap-1 transition-colors">
            Scroll to explore
            <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
          </span>
        </motion.div>

      </motion.div>
    </section>
  );
};
