import React from 'react';
import { motion } from 'motion/react';

interface ToolItem {
  id: string;
  name: string;
  glowColor: string;
  side: 'left' | 'right';
  yOffset: string;
  floatDuration: number;
  floatDelay: number;
  officialBadge: React.ReactNode;
}

export const FloatingToolIcons: React.FC = () => {
  const tools: ToolItem[] = [
    {
      id: 'photoshop',
      name: 'Adobe Photoshop',
      glowColor: 'rgba(49, 168, 255, 0.45)',
      side: 'left',
      yOffset: 'top-20 lg:top-28',
      floatDuration: 5.2,
      floatDelay: 0,
      officialBadge: (
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#001e36] border border-[#31a8ff]/40 shadow-[0_4px_20px_rgba(0,195,255,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center p-2.5 transition-transform duration-300">
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-[0_2px_8px_rgba(49,168,255,0.5)]">
            {/* Real Official Adobe Photoshop CC Ps Mark */}
            <path
              d="M12 11h9.5c5 0 8.5 2.8 8.5 7.5s-3.5 7.5-8.5 7.5h-4.5v11H12V11zm5 10.5h4c2.2 0 3.8-1.2 3.8-3s-1.6-3-3.8-3h-4v6z"
              fill="#31A8FF"
            />
            <path
              d="M29 32.5c1.2.9 2.8 1.6 4.8 1.6 2.2 0 3.2-1 3.2-2.3 0-1.4-1.2-2.3-3.8-3.2-3.8-1.4-5.8-3.2-5.8-6.4 0-3.8 3.2-6.4 7.6-6.4 2.4 0 4.2.7 5.3 1.5l-1.4 3.8c-1-.7-2.3-1.3-4-1.3-1.8 0-2.8.9-2.8 2 0 1.2 1.1 1.9 3.5 2.8 4.2 1.6 6.1 3.5 6.1 6.8 0 4.2-3.2 6.8-8.2 6.8-2.6 0-5.1-.9-6.3-2.1l1.9-3.6z"
              fill="#31A8FF"
            />
          </svg>
        </div>
      ),
    },
    {
      id: 'illustrator',
      name: 'Adobe Illustrator',
      glowColor: 'rgba(255, 154, 0, 0.45)',
      side: 'left',
      yOffset: 'top-72 lg:top-80',
      floatDuration: 6.0,
      floatDelay: 0.8,
      officialBadge: (
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#260500] border border-[#ff9a00]/40 shadow-[0_4px_20px_rgba(255,154,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center p-2.5 transition-transform duration-300">
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-[0_2px_8px_rgba(255,154,0,0.5)]">
            {/* Real Official Adobe Illustrator CC Ai Mark */}
            <path
              d="M11 37L19.2 11h5.2L32.6 37h-5.2l-2-6.5h-8.8l-2 6.5H11zm8-11.2h6.2l-3.1-10.2-3.1 10.2z"
              fill="#FF9A00"
            />
            <rect x="34" y="11" width="4.8" height="5.2" rx="0.5" fill="#FF9A00" />
            <rect x="34" y="18.5" width="4.8" height="18.5" rx="0.5" fill="#FF9A00" />
          </svg>
        </div>
      ),
    },
    {
      id: 'blender',
      name: 'Blender 3D',
      glowColor: 'rgba(234, 118, 0, 0.45)',
      side: 'right',
      yOffset: 'top-20 lg:top-28',
      floatDuration: 5.6,
      floatDelay: 0.4,
      officialBadge: (
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#091122] border border-[#ea7600]/40 shadow-[0_4px_20px_rgba(234,118,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center p-2.5 transition-transform duration-300">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-[0_2px_8px_rgba(234,118,0,0.5)]">
            {/* Real Official Blender Foundation Logo Vector */}
            <path
              fill="#EA7600"
              d="M12.51 13.214c.046-.8.438-1.506 1.03-2.006a3.424 3.424 0 0 1 2.212-.79c.85 0 1.631.3 2.211.79.592.5.983 1.206 1.028 2.005.045.823-.285 1.586-.865 2.153a3.389 3.389 0 0 1-2.374.938 3.393 3.393 0 0 1-2.376-.938c-.58-.567-.91-1.33-.865-2.152M7.35 14.831c.006.314.106.922.256 1.398a7.372 7.372 0 0 0 1.593 2.757 8.227 8.227 0 0 0 2.787 2.001 8.947 8.947 0 0 0 3.66.76 8.964 8.964 0 0 0 3.657-.772 8.285 8.285 0 0 0 2.785-2.01 7.428 7.428 0 0 0 1.592-2.762 6.964 6.964 0 0 0 .25-3.074 7.123 7.123 0 0 0-1.016-2.779 7.764 7.764 0 0 0-1.852-2.043h.002L13.566 2.55l-.02-.015c-.492-.378-1.319-.376-1.86.002-.547.382-.609 1.015-.123 1.415l-.001.001 3.126 2.543-9.53.01h-.013c-.788.001-1.545.518-1.695 1.172-.154.665.38 1.217 1.2 1.22V8.9l4.83-.01-8.62 6.617-.034.025c-.813.622-1.075 1.658-.563 2.313.52.667 1.625.668 2.447.004L7.414 14s-.069.52-.063.831zm12.09 1.741c-.97.988-2.326 1.548-3.795 1.55-1.47.004-2.827-.552-3.797-1.538a4.51 4.51 0 0 1-1.036-1.622 4.282 4.282 0 0 1 .282-3.519 4.702 4.702 0 0 1 1.153-1.371c.942-.768 2.141-1.183 3.396-1.185 1.256-.002 2.455.41 3.398 1.175.48.391.87.854 1.152 1.367a4.28 4.28 0 0 1 .522 1.706 4.236 4.236 0 0 1-.239 1.811 4.54 4.54 0 0 1-1.035 1.626"
            />
            {/* Blender Official Blue Center Eye */}
            <circle cx="15.75" cy="13.2" r="2.1" fill="#225799" />
          </svg>
        </div>
      ),
    },
    {
      id: 'openai',
      name: 'OpenAI / AI Engine',
      glowColor: 'rgba(16, 163, 127, 0.45)',
      side: 'right',
      yOffset: 'top-72 lg:top-80',
      floatDuration: 6.4,
      floatDelay: 1.2,
      officialBadge: (
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#081516] border border-[#10a37f]/45 shadow-[0_4px_20px_rgba(16,163,127,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center p-2.5 transition-transform duration-300">
          <svg viewBox="0 0 24 24" fill="#10A37F" className="w-full h-full drop-shadow-[0_2px_8px_rgba(16,163,127,0.5)]">
            {/* Real Official OpenAI Spiral Vortex Emblem */}
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829l2.0201-1.1639a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4023-.6818zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6818v6.7222zm1.6195-2.0012l3.073-1.7709 3.073 1.7709v3.5417l-3.073 1.7709-3.073-1.7709z" />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
      {tools.map((tool) => {
        const isLeft = tool.side === 'left';

        return (
          <div
            key={tool.id}
            className={`absolute ${tool.yOffset} ${
              isLeft ? 'left-3 sm:left-6 lg:left-10' : 'right-3 sm:right-6 lg:right-10'
            } pointer-events-auto`}
          >
            {/* Continuous 24/7 Organic Floating Physics */}
            <motion.div
              animate={{
                y: isLeft ? [-9, 9, -9] : [9, -9, 9],
                rotate: isLeft ? [-2.5, 2.5, -2.5] : [2.5, -2.5, 2.5],
              }}
              transition={{
                duration: tool.floatDuration,
                delay: tool.floatDelay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative flex items-center"
            >
              {/* Official Floating Brand Logo Icon (Stays floating, no pop-up panel) */}
              <div
                className="relative z-30 transition-transform duration-300 hover:scale-110 active:scale-95 group"
                title={tool.name}
              >
                {/* Brand Colored Ambient Glow */}
                <div
                  className="absolute -inset-1 rounded-2xl opacity-60 blur-md group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ backgroundColor: tool.glowColor }}
                />

                {/* Real Official Brand Badge */}
                <div className="relative transform-gpu">
                  {tool.officialBadge}
                </div>

                {/* Subtle Interactive Status Pip */}
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-[#030712] shadow-[0_0_8px_#22d3ee] pointer-events-none" />
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};
