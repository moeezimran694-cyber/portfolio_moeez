import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 origin-left z-[60] pointer-events-none shadow-[0_0_10px_rgba(6,182,255,0.7)] will-change-transform"
      aria-hidden="true"
    />
  );
};
