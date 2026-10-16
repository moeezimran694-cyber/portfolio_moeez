import React from 'react';

interface AnimatedIconProps {
  className?: string;
}

/**
 * 01: AI Websites & Web Applications
 * Sleek monochrome neural network nodes with animated synapses and pulsing signal pulses.
 */
export const NeuralNetworkIcon: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} text-slate-100 group-hover:text-white transition-colors duration-300`}
    >
      <defs>
        <style>
          {`
            @keyframes pulse-signal {
              0% { stroke-dashoffset: 24; opacity: 0.3; }
              50% { opacity: 1; }
              100% { stroke-dashoffset: 0; opacity: 0.3; }
            }
            @keyframes node-breathe {
              0%, 100% { transform: scale(1); opacity: 0.85; }
              50% { transform: scale(1.25); opacity: 1; filter: drop-shadow(0 0 2px #fff); }
            }
            .synapse-line {
              stroke-dasharray: 4 2;
              animation: pulse-signal 3s linear infinite;
            }
            .synapse-line-alt {
              stroke-dasharray: 3 3;
              animation: pulse-signal 2.4s linear infinite reverse;
            }
            .network-node {
              transform-origin: center;
              animation: node-breathe 2.8s ease-in-out infinite;
            }
          `}
        </style>
      </defs>

      {/* Synapse Connecting Lines */}
      <line x1="4" y1="7" x2="11" y2="5" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" className="synapse-line" />
      <line x1="4" y1="7" x2="11" y2="12" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" className="synapse-line-alt" />
      <line x1="4" y1="17" x2="11" y2="12" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" className="synapse-line" />
      <line x1="4" y1="17" x2="11" y2="19" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" className="synapse-line-alt" />
      <line x1="11" y1="5" x2="20" y2="8" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" className="synapse-line-alt" />
      <line x1="11" y1="12" x2="20" y2="8" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" className="synapse-line" />
      <line x1="11" y1="12" x2="20" y2="16" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" className="synapse-line-alt" />
      <line x1="11" y1="19" x2="20" y2="16" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" className="synapse-line" />

      {/* Input Layer Nodes */}
      <circle cx="4" cy="7" r="2.2" fill="currentColor" className="network-node" style={{ animationDelay: '0s' }} />
      <circle cx="4" cy="17" r="2.2" fill="currentColor" className="network-node" style={{ animationDelay: '0.6s' }} />

      {/* Hidden Processing Nodes */}
      <circle cx="11" cy="5" r="2" fill="currentColor" className="network-node" style={{ animationDelay: '0.3s' }} />
      <circle cx="11" cy="12" r="2.4" fill="currentColor" className="network-node" style={{ animationDelay: '0.9s' }} />
      <circle cx="11" cy="19" r="2" fill="currentColor" className="network-node" style={{ animationDelay: '1.2s' }} />

      {/* Output / Action Nodes */}
      <circle cx="20" cy="8" r="2.5" fill="currentColor" className="network-node" style={{ animationDelay: '0.5s' }} />
      <circle cx="20" cy="16" r="2.5" fill="currentColor" className="network-node" style={{ animationDelay: '1.4s' }} />

      {/* Inner subtle glow ring on primary output */}
      <circle cx="20" cy="8" r="4.2" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="2 2" className="synapse-line" />
    </svg>
  );
};

/**
 * 02: AI Voice Calling Agents
 * Sleek monochrome sound waves / voice frequency spectrum with pulsing equalizer bars and acoustic radiating arcs.
 */
export const SoundWavesIcon: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} text-slate-100 group-hover:text-white transition-colors duration-300`}
    >
      <defs>
        <style>
          {`
            @keyframes wave-bounce {
              0%, 100% { transform: scaleY(0.35); }
              50% { transform: scaleY(1); }
            }
            @keyframes acoustic-pulse {
              0%, 100% { opacity: 0.3; transform: scale(0.92); }
              50% { opacity: 0.9; transform: scale(1.06); }
            }
            .wave-bar {
              transform-box: fill-box;
              transform-origin: center;
              animation: wave-bounce 1.4s ease-in-out infinite;
            }
            .acoustic-arc {
              transform-origin: center;
              animation: acoustic-pulse 1.8s ease-in-out infinite;
            }
          `}
        </style>
      </defs>

      {/* Outer Acoustic Radiating Wave Arcs */}
      <path
        d="M2.5 8C1.5 9.2 1 10.5 1 12C1 13.5 1.5 14.8 2.5 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="acoustic-arc"
        style={{ animationDelay: '0s' }}
      />
      <path
        d="M21.5 8C22.5 9.2 23 10.5 23 12C23 13.5 22.5 14.8 21.5 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="acoustic-arc"
        style={{ animationDelay: '0.2s' }}
      />

      {/* Mid Acoustic Arcs */}
      <path
        d="M5 9.5C4.4 10.3 4 11.1 4 12C4 12.9 4.4 13.7 5 14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.75"
        className="acoustic-arc"
        style={{ animationDelay: '0.4s' }}
      />
      <path
        d="M19 9.5C19.6 10.3 20 11.1 20 12C20 12.9 19.6 13.7 19 14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.75"
        className="acoustic-arc"
        style={{ animationDelay: '0.6s' }}
      />

      {/* Voice Frequency Equalizer Spectrum Bars */}
      <rect x="7" y="7" width="1.8" height="10" rx="0.9" fill="currentColor" className="wave-bar" style={{ animationDelay: '0.2s' }} />
      <rect x="9.8" y="4.5" width="1.8" height="15" rx="0.9" fill="currentColor" className="wave-bar" style={{ animationDelay: '0.5s' }} />
      <rect x="12.6" y="3" width="1.8" height="18" rx="0.9" fill="currentColor" className="wave-bar" style={{ animationDelay: '0s' }} />
      <rect x="15.4" y="6" width="1.8" height="12" rx="0.9" fill="currentColor" className="wave-bar" style={{ animationDelay: '0.7s' }} />
    </svg>
  );
};

/**
 * 03: AI Advertisement Videos
 * Sleek monochrome cinematic aperture & viewfinder with animated scanning sweep and pulse playhead.
 */
export const CinematicVideoIcon: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} text-slate-100 group-hover:text-white transition-colors duration-300`}
    >
      <defs>
        <style>
          {`
            @keyframes scan-line {
              0% { transform: translateY(0); opacity: 0.3; }
              50% { opacity: 0.95; }
              100% { transform: translateY(12px); opacity: 0.3; }
            }
            @keyframes aperture-rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes rec-dot-blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.25; }
            }
            .scan-sweep {
              animation: scan-line 2.2s ease-in-out infinite alternate;
            }
            .aperture-ring {
              transform-origin: center;
              animation: aperture-rotate 16s linear infinite;
            }
            .rec-indicator {
              animation: rec-dot-blink 1.2s ease-in-out infinite;
            }
          `}
        </style>
      </defs>

      {/* Cinematic Viewfinder Corner Brackets */}
      <path d="M3 7V4C3 3.44772 3.44772 3 4 3H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17 3H20C20.5523 3 21 3.44772 21 4V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M21 17V20C21 20.5523 20.5523 21 20 21H17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7 21H4C3.44772 21 3 20.5523 3 20V17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />

      {/* Center Cinematic Aperture / Lens */}
      <circle cx="12" cy="12" r="6.2" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
      
      {/* Aperture Iris blades */}
      <g className="aperture-ring">
        <line x1="12" y1="5.8" x2="16.5" y2="9.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="18.2" y1="12" x2="14.5" y2="16.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="12" y1="18.2" x2="7.5" y2="14.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="5.8" y1="12" x2="9.5" y2="7.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
      </g>

      {/* Central Playhead Core */}
      <polygon points="11,10 15,12 11,14" fill="currentColor" />

      {/* Viewfinder Scanning Sweep Laser Line */}
      <line x1="5" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 1" className="scan-sweep" />

      {/* Monochrome Record Indicator Dot */}
      <circle cx="18" cy="6" r="1.2" fill="currentColor" className="rec-indicator" />
    </svg>
  );
};

/**
 * 04: Professional Graphic Design
 * Sleek monochrome vector pen tool nib with Bézier curve, anchor handles, and moving tangent nodes.
 */
export const VectorDesignIcon: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} text-slate-100 group-hover:text-white transition-colors duration-300`}
    >
      <defs>
        <style>
          {`
            @keyframes handle-pivot {
              0%, 100% { transform: rotate(-8deg); }
              50% { transform: rotate(10deg); }
            }
            @keyframes curve-draw {
              0% { stroke-dashoffset: 24; }
              50% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: -24; }
            }
            .bezier-handles {
              transform-origin: 12px 14px;
              animation: handle-pivot 3s ease-in-out infinite;
            }
            .bezier-curve {
              stroke-dasharray: 6 3;
              animation: curve-draw 4s linear infinite;
            }
          `}
        </style>
      </defs>

      {/* Smooth Vector Bézier Curve */}
      <path
        d="M3 18C7 10 17 10 21 18"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeOpacity="0.75"
        className="bezier-curve"
      />

      {/* Tangent Control Bar & Anchor Points */}
      <g className="bezier-handles">
        <line x1="6" y1="11.5" x2="18" y2="16.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="1.5 1.5" />
        <circle cx="6" cy="11.5" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="18" cy="16.5" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </g>

      {/* Central Vector Pen Nib */}
      <path
        d="M12 2L15.5 8L13 13.5L12 11.5L11 13.5L8.5 8L12 2Z"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <line x1="12" y1="5.5" x2="12" y2="9.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="14" r="1.8" fill="currentColor" />
    </svg>
  );
};

/**
 * 05: Blender 3D Product Advertisements
 * Sleek monochrome 3D isometric wireframe cube / bounding box with rotating depth axes and corner vertices.
 */
export const Isometric3DCubeIcon: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} text-slate-100 group-hover:text-white transition-colors duration-300`}
    >
      <defs>
        <style>
          {`
            @keyframes cube-float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-1.5px) rotate(1deg); }
            }
            @keyframes wire-pulse {
              0%, 100% { opacity: 0.45; }
              50% { opacity: 0.95; }
            }
            @keyframes center-spin {
              0% { transform: rotate(0deg) scale(0.9); }
              50% { transform: rotate(180deg) scale(1.1); }
              100% { transform: rotate(360deg) scale(0.9); }
            }
            .cube-group {
              transform-origin: center;
              animation: cube-float 3.5s ease-in-out infinite;
            }
            .depth-wire {
              animation: wire-pulse 2.2s ease-in-out infinite;
            }
            .inner-core {
              transform-origin: 12px 12px;
              animation: center-spin 8s linear infinite;
            }
          `}
        </style>
      </defs>

      <g className="cube-group">
        {/* Top Face */}
        <polygon
          points="12,2.5 20.5,7 12,11.5 3.5,7"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="currentColor"
          fillOpacity="0.08"
          strokeLinejoin="round"
        />

        {/* Left Face */}
        <polygon
          points="3.5,7 12,11.5 12,21 3.5,16.5"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="currentColor"
          fillOpacity="0.16"
          strokeLinejoin="round"
        />

        {/* Right Face */}
        <polygon
          points="12,11.5 20.5,7 20.5,16.5 12,21"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="currentColor"
          fillOpacity="0.24"
          strokeLinejoin="round"
        />

        {/* Internal 3D Wireframe / Spatial Axes */}
        <line x1="12" y1="11.5" x2="12" y2="21" stroke="currentColor" strokeWidth="1.2" className="depth-wire" />
        <line x1="12" y1="11.5" x2="3.5" y2="7" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="12" y1="11.5" x2="20.5" y2="7" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />

        {/* Corner 3D Vertex Nodes */}
        <circle cx="12" cy="2.5" r="1.3" fill="currentColor" />
        <circle cx="20.5" cy="7" r="1.3" fill="currentColor" />
        <circle cx="3.5" cy="7" r="1.3" fill="currentColor" />
        <circle cx="12" cy="21" r="1.3" fill="currentColor" />
        <circle cx="20.5" cy="16.5" r="1.3" fill="currentColor" />
        <circle cx="3.5" cy="16.5" r="1.3" fill="currentColor" />

        {/* Floating 3D Core */}
        <g className="inner-core">
          <circle cx="12" cy="12" r="2.2" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </g>
      </g>
    </svg>
  );
};

/**
 * 06: Business Automation & AI Integrations
 * Sleek monochrome pipeline automation circuit with moving data packets and interlocking micro-gears.
 */
export const WorkflowAutomationIcon: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} text-slate-100 group-hover:text-white transition-colors duration-300`}
    >
      <defs>
        <style>
          {`
            @keyframes flow-packet {
              0% { stroke-dashoffset: 20; opacity: 0.2; }
              50% { opacity: 1; }
              100% { stroke-dashoffset: 0; opacity: 0.2; }
            }
            @keyframes gear-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes gear-spin-reverse {
              from { transform: rotate(0deg); }
              to { transform: rotate(-360deg); }
            }
            .circuit-flow {
              stroke-dasharray: 4 2;
              animation: flow-packet 2.2s linear infinite;
            }
            .gear-one {
              transform-origin: 8px 9px;
              animation: gear-spin 7s linear infinite;
            }
            .gear-two {
              transform-origin: 16px 15px;
              animation: gear-spin-reverse 7s linear infinite;
            }
          `}
        </style>
      </defs>

      {/* Automation Pipeline Circuit Paths */}
      <path
        d="M2 9H4M20 15H22M8 2V4M16 20V22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
      <path
        d="M4 9H8M8 9V15H16M16 15H20"
        stroke="currentColor"
        strokeWidth="1.4"
        className="circuit-flow"
      />

      {/* Primary Interlocking Gear (Top Left) */}
      <g className="gear-one">
        <circle cx="8" cy="9" r="4" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="8" cy="9" r="1.5" fill="currentColor" />
        {/* Gear Teeth */}
        <line x1="8" y1="3.8" x2="8" y2="5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="8" y1="13" x2="8" y2="14.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="2.8" y1="9" x2="4" y2="9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="12" y1="9" x2="13.2" y2="9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="4.5" y1="5.5" x2="5.3" y2="6.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="10.7" y1="11.7" x2="11.5" y2="12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="4.5" y1="12.5" x2="5.3" y2="11.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="10.7" y1="6.3" x2="11.5" y2="5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* Secondary Synchronized Gear (Bottom Right) */}
      <g className="gear-two">
        <circle cx="16" cy="15" r="3.2" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="16" cy="15" r="1.2" fill="currentColor" />
        {/* Teeth */}
        <line x1="16" y1="10.8" x2="16" y2="11.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="16" y1="18.2" x2="16" y2="19.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="11.8" y1="15" x2="12.8" y2="15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="19.2" y1="15" x2="20.2" y2="15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </g>

      {/* Logic Gate Trigger Pulse Nodes */}
      <circle cx="3" cy="9" r="1.4" fill="currentColor" />
      <circle cx="21" cy="15" r="1.4" fill="currentColor" />
    </svg>
  );
};

/**
 * Helper to select the corresponding animated icon by service ID or iconName
 */
export const ServiceAnimatedIcon: React.FC<{ serviceId: string; iconName?: string; className?: string }> = ({
  serviceId,
  iconName,
  className = 'w-6 h-6'
}) => {
  switch (serviceId) {
    case 'ai-websites':
      return <NeuralNetworkIcon className={className} />;
    case 'ai-voice-agents':
      return <SoundWavesIcon className={className} />;
    case 'ai-video-ads':
      return <CinematicVideoIcon className={className} />;
    case 'graphic-design':
      return <VectorDesignIcon className={className} />;
    case '3d-product-ads':
      return <Isometric3DCubeIcon className={className} />;
    case 'business-automation':
      return <WorkflowAutomationIcon className={className} />;
    default:
      if (iconName === 'Mic') return <SoundWavesIcon className={className} />;
      if (iconName === 'Video') return <CinematicVideoIcon className={className} />;
      if (iconName === 'Palette') return <VectorDesignIcon className={className} />;
      if (iconName === 'Box') return <Isometric3DCubeIcon className={className} />;
      if (iconName === 'Cpu') return <WorkflowAutomationIcon className={className} />;
      return <NeuralNetworkIcon className={className} />;
  }
};
