export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  features: string[];
  iconName: 'Globe' | 'Mic' | 'Video' | 'Palette' | 'Box' | 'Cpu';
  categoryFilterTag: 'Websites' | 'AI Automation' | 'Video Ads' | '3D Products' | 'Graphic Design';
}

export const SERVICES_DATA: Service[] = [
  {
    id: 'ai-websites',
    number: '01',
    title: 'AI Websites & Web Applications',
    description: 'Modern, responsive business websites, landing pages, web apps, and AI-powered digital experiences using modern frameworks, AI builders, and high-performance stacks.',
    features: [
      'Conversion-optimized business landing pages',
      'Full-stack interactive web applications',
      'Ultra-responsive mobile-first interfaces',
      'SEO & performance optimization'
    ],
    iconName: 'Globe',
    categoryFilterTag: 'Websites'
  },
  {
    id: 'ai-voice-agents',
    number: '02',
    title: 'AI Voice Calling Agents',
    description: 'Intelligent voice agents for customer inquiries, appointment booking, lead qualification, and automated business communication using APIs and custom logic.',
    features: [
      '24/7 autonomous phone call handling',
      'Instant calendar booking & CRM sync',
      'Natural conversational cadence & tone',
      'Inbound customer support resolution'
    ],
    iconName: 'Mic',
    categoryFilterTag: 'AI Automation'
  },
  {
    id: 'ai-video-ads',
    number: '03',
    title: 'AI Advertisement Videos',
    description: 'Engaging AI-assisted commercial videos, promotional reels, product advertisements, and social media video content designed for high retention and conversion.',
    features: [
      'High-energy social media promotional reels',
      'Cinematic product showcase commercials',
      'AI-assisted scriptwriting & voiceovers',
      'Dynamic typography & visual effects'
    ],
    iconName: 'Video',
    categoryFilterTag: 'Video Ads'
  },
  {
    id: 'graphic-design',
    number: '04',
    title: 'Professional Graphic Design',
    description: 'Brand identities, social media creatives, advertising banners, promotional graphics, and marketing materials that establish commanding market presence.',
    features: [
      'Visual brand identity systems & guidelines',
      'Ad banners for Google, Meta, & LinkedIn',
      'Promotional posters & marketing collateral',
      'Clean vector typography & vector badges'
    ],
    iconName: 'Palette',
    categoryFilterTag: 'Graphic Design'
  },
  {
    id: '3d-product-ads',
    number: '05',
    title: 'Blender 3D Product Advertisements',
    description: 'Cinematic 3D product renders, product animations, realistic lighting, and premium commercial visuals tailored specifically for e-commerce brands.',
    features: [
      'Photorealistic material shaders & lighting',
      '360-degree rotating product animations',
      'High-resolution multi-angle studio renders',
      'E-commerce hero visuals & packaging shots'
    ],
    iconName: 'Box',
    categoryFilterTag: '3D Products'
  },
  {
    id: 'business-automation',
    number: '06',
    title: 'Business Automation & AI Integrations',
    description: 'Practical business workflows, tool integrations, lead management, and automation solutions tailored precisely to eliminate manual bottlenecks.',
    features: [
      'Autonomous lead qualification workflows',
      'Multi-platform webhook & API connectors',
      'Automated email & customer follow-ups',
      'Custom internal operational tools'
    ],
    iconName: 'Cpu',
    categoryFilterTag: 'AI Automation'
  }
];
