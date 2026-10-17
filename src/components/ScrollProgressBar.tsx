import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 origin-left z-[60] pointer-events-none shadow-[0_0_8px_rgba(6,182,255,0.6)] transform-gpu"
      aria-hidden="true"
    />
  );
};
