import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { 
  CheckCircle2, 
  Users, 
  Bot, 
  Award,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

interface CountUpProps {
  end: number;
  decimals?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  startWhen: boolean;
}

const CountUp: React.FC<CountUpProps> = ({
  end,
  decimals = 0,
  duration = 2200,
  suffix = '',
  prefix = '',
  startWhen,
}) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!startWhen) return;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(end);
      return;
    }

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo curve for smooth deceleration
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = easeProgress * end;

      setValue(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setValue(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration, startWhen]);

  return (
    <span className="tabular-nums font-mono">
      {prefix}
      {value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

interface StatItem {
  id: string;
  metricNumber: number;
  decimals?: number;
  suffix: string;
  prefix?: string;
  label: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
  accentGradient: string;
  glowColor: string;
  borderColor: string;
}

export const StatsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  const stats: StatItem[] = [
    {
      id: 'projects-completed',
      metricNumber: 50,
      suffix: '+',
      label: 'Projects Completed',
      description: 'Production websites, web apps, and digital platforms shipped on schedule.',
      badge: '100% Shipped',
      icon: <CheckCircle2 className="w-5 h-5 text-cyan-400" />,
      accentGradient: 'from-cyan-500 to-blue-600',
      glowColor: 'rgba(6, 182, 212, 0.25)',
      borderColor: 'border-cyan-500/30 hover:border-cyan-400/60',
    },
    {
      id: 'happy-clients',
      metricNumber: 38,
      suffix: '+',
      label: 'Happy Clients',
      description: 'Founders, gym brands, creators, and online businesses globally.',
      badge: 'Global Partners',
      icon: <Users className="w-5 h-5 text-purple-400" />,
      accentGradient: 'from-purple-500 to-fuchsia-600',
      glowColor: 'rgba(168, 85, 247, 0.25)',
      borderColor: 'border-purple-500/30 hover:border-purple-400/60',
    },
    {
      id: 'ai-models-deployed',
      metricNumber: 24,
      suffix: '+',
      label: 'AI Models Deployed',
      description: 'Autonomous voice calling agents, GPT workflows, and neural automations.',
      badge: 'Production AI',
      icon: <Bot className="w-5 h-5 text-emerald-400" />,
      accentGradient: 'from-emerald-500 to-teal-600',
      glowColor: 'rgba(16, 185, 129, 0.25)',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400/60',
    },
    {
      id: 'satisfaction-rate',
      metricNumber: 99.4,
      decimals: 1,
      suffix: '%',
      label: 'Client Satisfaction',
      description: '5-star delivery track record with verified recurring collaboration.',
      badge: 'Top Rated',
      icon: <Award className="w-5 h-5 text-amber-400" />,
      accentGradient: 'from-amber-400 to-orange-500',
      glowColor: 'rgba(251, 191, 36, 0.25)',
      borderColor: 'border-amber-500/30 hover:border-amber-400/60',
    },
  ];

  return (
    <section 
      id="stats" 
      ref={sectionRef}
      className="relative py-20 bg-[#060a14] border-y border-slate-800/80 overflow-hidden"
    >
      {/* Background radial ambient glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 radial-glow-purple opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 radial-glow-cyan opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Subtle Credibility Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-cyan-400 mb-3 shadow-inner">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Proven Track Record & Credibility</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Measurable Results Across{' '}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Every Build.
            </span>
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-slate-400 font-normal">
            Real impact delivered through modern development, AI automation pipelines, and high-conversion design.
          </p>
        </motion.div>

        {/* 4 Stats Cards Grid with Count-Up Animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#0a0f1d] border ${stat.borderColor} shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.8)] transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
            >
              {/* Subtle top accent gradient line */}
              <div 
                className={`absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r ${stat.accentGradient} opacity-80 group-hover:opacity-100 transition-opacity`} 
              />

              {/* Ambient Hover Glow */}
              <div 
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-2xl pointer-events-none"
                style={{ backgroundColor: stat.glowColor }}
              />

              <div>
                {/* Header row: Icon & Status Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                    {stat.icon}
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400 group-hover:text-slate-200 tracking-wider uppercase flex items-center gap-1.5 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:animate-pulse" />
                    {stat.badge}
                  </span>
                </div>

                {/* Big Count-Up Number Display */}
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight flex items-baseline gap-1">
                  <CountUp
                    end={stat.metricNumber}
                    decimals={stat.decimals || 0}
                    suffix={stat.suffix}
                    prefix={stat.prefix || ''}
                    startWhen={isInView}
                  />
                </div>

                {/* Metric Label */}
                <h3 className="text-base font-bold text-slate-100 mt-2 tracking-tight group-hover:text-white transition-colors">
                  {stat.label}
                </h3>

                {/* Metric Subtitle / Context */}
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-normal">
                  {stat.description}
                </p>
              </div>

              {/* Verified Security Trust Pip */}
              <div className="mt-6 pt-4 border-t border-slate-800/70 flex items-center gap-1.5 text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400/80" />
                <span>Verified Metric Tracked</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
