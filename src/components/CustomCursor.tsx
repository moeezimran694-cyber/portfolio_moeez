import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 });
  const isHoveringInteractive = useRef(false);

  useEffect(() => {
    // Only enable on non-touch devices with fine pointers
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    setEnabled(true);

    const onMouseMove = (e: MouseEvent) => {
      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer');
        isHoveringInteractive.current = !!isClickable;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let animationId: number;

    const render = () => {
      // Lerp position for smooth cinematic follow
      const ease = 0.14;
      posRef.current.x += (posRef.current.targetX - posRef.current.x) * ease;
      posRef.current.y += (posRef.current.targetY - posRef.current.y) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) translate(-50%, -50%) scale(${
          isHoveringInteractive.current ? 1.5 : 1
        })`;
        cursorRef.current.style.opacity = isHoveringInteractive.current ? '0.6' : '0.25';
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${posRef.current.targetX}px, ${posRef.current.targetY}px, 0) translate(-50%, -50%) scale(${
          isHoveringInteractive.current ? 0.6 : 1
        })`;
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Soft atmospheric ambient glow orb */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-64 h-64 rounded-full pointer-events-none z-50 bg-gradient-to-r from-purple-500/20 via-cyan-500/15 to-transparent blur-2xl transition-opacity duration-300 will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
      />
      {/* Sleek precise center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-50 bg-cyan-400 shadow-[0_0_8px_#22d3ee] transition-transform duration-100 will-change-transform opacity-60"
        style={{ transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
      />
    </>
  );
};
