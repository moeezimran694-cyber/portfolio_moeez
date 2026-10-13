import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true 
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Brand Logo Image with subtle ambient glow */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center group`}>
        {/* Ambient neon backglow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/50 to-cyan-400/50 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
        
        {/* Logo Container */}
        <div className="relative w-full h-full rounded-xl overflow-hidden border border-cyan-500/30 bg-[#070b16] p-0.5 shadow-[0_0_15px_rgba(6,182,255,0.2)]">
          <img
            src="/src/assets/images/logo.png"
            alt="Moeez_Portfolio Logo"
            className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <span className={`font-bold tracking-tight text-white whitespace-nowrap font-['Outfit'] ${textSizes[size]}`}>
          Moeez<span className="text-purple-400">_</span><span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Portfolio</span>
        </span>
      )}
    </div>
  );
};
