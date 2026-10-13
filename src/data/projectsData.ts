export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'Websites' | 'AI Automation' | 'Video Ads' | '3D Products' | 'Graphic Design';
  status: 'Concept Project' | 'Interactive Prototype' | 'Demo Project';
  image: string;
  shortDescription: string;
  fullDescription: string;
  clientContext?: string;
  tools: string[];
  keyFeatures: string[];
  liveUrl?: string | null;
  demoType: 'website' | 'voice-agent' | '3d-product' | 'graphic-design' | 'video-ad' | 'workflow-app';
}

export const PROJECTS_DATA: Project[] = [
  {
    id: 'gym-website',
    title: 'Velocity Fitness Club',
    tagline: 'Modern High-Performance Fitness Platform',
    category: 'Websites',
    status: 'Concept Project',
    image: '/assets/images/project_gym_website_1791821870661.jpg',
    shortDescription: 'Modern fitness club website with membership tiers, trainer profiles, trial-session booking, and responsive dark-mode layouts.',
    fullDescription: 'Designed and developed as a complete digital presence for a boutique fitness center. Features structured membership tiers, dynamic trainer rosters, interactive session booking calculators, and mobile-optimized responsiveness built for high conversion.',
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    keyFeatures: [
      'Interactive tiered membership selector with transparent pricing',
      'Class scheduling grid with instant filtering by workout type',
      'Trainer credentials, specialties, and 1-on-1 booking inquiry',
      'Zero-friction complimentary trial session registration form'
    ],
    liveUrl: null,
    demoType: 'website'
  },
  {
    id: 'ai-voice-agent',
    title: 'Aura Voice Concierge',
    tagline: 'Intelligent Inbound & Appointment Calling Agent',
    category: 'AI Automation',
    status: 'Interactive Prototype',
    image: '/assets/images/project_voice_agent_1791821882727.jpg',
    shortDescription: 'Interactive demonstration of an AI customer support and automated appointment scheduling assistant with real-time audio telemetry.',
    fullDescription: 'An autonomous voice agent engineered to handle incoming business inquiries, qualify potential customers, answer common service questions, and schedule consultations onto calendar software without human staff intervention.',
    tools: ['Web Audio API', 'Speech Synthesis', 'Node.js', 'WebSocket', 'LLM Function Calling'],
    keyFeatures: [
      'Natural conversational cadence with sub-500ms response latency',
      'Automated calendar slot detection and booking confirmation',
      'Real-time voice tone and sentiment analysis dashboard',
      'Automatic call transcript generation and CRM synchronization'
    ],
    liveUrl: null,
    demoType: 'voice-agent'
  },
  {
    id: '3d-product-ad',
    title: 'Aether Spatial Audio',
    tagline: 'Cinematic Blender 3D Product Commercial',
    category: '3D Products',
    status: 'Demo Project',
    image: '/assets/images/project_3d_product_1791821856558.jpg',
    shortDescription: 'Cinematic Blender 3D commercial visual featuring dark titanium finishes, vibrant violet/cyan rim illumination, and studio materials.',
    fullDescription: 'High-end 3D advertisement visual created in Blender for a luxury cyber audio device. Employs micro-scratched matte metal shaders, translucent polycarbonate speaker grilles, and dual-tone neon rim lighting tuned for premium digital marketing campaigns.',
    tools: ['Blender 3D', 'Cycles X Renderer', 'Substance Painter', 'DaVinci Resolve'],
    keyFeatures: [
      'Physically accurate dark titanium and acoustic mesh shaders',
      'Studio volumetric illumination with violet & cyan chromatic accents',
      'Multi-angle camera staging optimized for luxury consumer tech',
      'Ready for 4K video reel animation and print-resolution billboards'
    ],
    liveUrl: null,
    demoType: '3d-product'
  },
  {
    id: 'graphic-design-campaign',
    title: 'NeoMatrix Brand Identity',
    tagline: 'Futuristic Visual Identity & Social Ad Suite',
    category: 'Graphic Design',
    status: 'Demo Project',
    image: '/assets/images/project_video_ad_1791821892937.jpg', // fallback high-res graphic asset
    shortDescription: 'Cohesive brand creative system including high-impact digital advertising banners, promotional event posters, and typographic marks.',
    fullDescription: 'A multi-asset visual marketing package crafted for high-growth tech brands. Features typographic hierarchy systems, social media carousels, event launch graphics, and promotional display ads designed for immediate visual retention.',
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma', 'Grid Systems'],
    keyFeatures: [
      'Unified geometric design language across 12+ social formats',
      'High-contrast digital display ads with 4.5:1+ accessible legibility',
      'Custom futuristic vector glyphs and brand typography rules',
      'Modular layout templates adaptable for rapid campaign turnarounds'
    ],
    liveUrl: null,
    demoType: 'graphic-design'
  },
  {
    id: 'ai-video-ad',
    title: 'Neo-Run Cyber Athletics',
    tagline: 'AI-Assisted High-Impact Commercial Reel',
    category: 'Video Ads',
    status: 'Concept Project',
    image: '/assets/images/project_video_ad_1791821892937.jpg',
    shortDescription: 'Short commercial video advertisement combining generative AI visual pacing, atmospheric studio lighting, and dynamic motion.',
    fullDescription: 'A 30-second commercial concept developed using generative video workflows alongside professional color grading and sound design. Demonstrates how modern brands can produce cinematic promotional reels in a fraction of traditional production schedules.',
    tools: ['Runway Gen-3', 'Premiere Pro', 'After Effects', 'ElevenLabs Audio'],
    keyFeatures: [
      'Dynamic speed ramps synchronized to electronic beat markers',
      'Photorealistic anamorphic flares and volumetric haze aesthetics',
      'Modular scene construction for A/B testing digital ad variations',
      'Custom synthesized voiceover and spatial sound mixing'
    ],
    liveUrl: null,
    demoType: 'video-ad'
  },
  {
    id: 'ai-business-webapp',
    title: 'FlowSync AI Lead Orchestrator',
    tagline: 'Autonomous Workflow & CRM Automation Dashboard',
    category: 'AI Automation',
    status: 'Interactive Prototype',
    image: '/assets/images/project_voice_agent_1791821882727.jpg', // or dashboard visual
    shortDescription: 'Clean web dashboard demonstrating automated lead qualification, webhook routing, AI classification, and multi-channel notifications.',
    fullDescription: 'A workflow automation web app that ingests customer leads across multiple platforms, enriches lead data using AI classification models, scores purchase intent, and triggers immediate webhook actions to sales teams.',
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'REST Webhooks', 'Chart UI'],
    keyFeatures: [
      'Real-time lead ingestion stream with instant automated scoring',
      'Custom routing rules to Slack, email, and CRM software',
      'Visual workflow trigger builder with zero maintenance downtime',
      'Interactive operational metrics showing pipeline throughput'
    ],
    liveUrl: null,
    demoType: 'workflow-app'
  }
];

export const SERVICE_CATEGORIES = [
  'All Projects',
  'Websites',
  'AI Automation',
  'Video Ads',
  '3D Products',
  'Graphic Design'
] as const;
