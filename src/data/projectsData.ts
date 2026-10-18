export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'Websites' | 'AI Automation' | 'Video Ads' | '3D Products' | 'Graphic Design' | string;
  status?: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  clientContext?: string | null;
  tools: string[];
  keyFeatures: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  demoType?: 'website' | 'voice-agent' | '3d-product' | 'graphic-design' | 'video-ad' | 'workflow-app' | 'real-project' | string;
  mediaType?: 'website' | 'video' | 'image' | string;
  videoUrl?: string | null;
}

/**
 * Real Projects Portfolio Data
 * Persistent across all devices and accounts
 */
export const PROJECTS_DATA: Project[] = [
  {
    id: 'proj_muscle_empire',
    title: 'Muscle Empire',
    tagline: 'Modern & Responsive Gym & Fitness Platform',
    category: 'Websites',
    status: 'Live Project',
    image: 'https://cdn.phototourl.com/member/2026-10-17-6162ede1-4b38-48a7-9a83-e8c2d3c4252c.png',
    shortDescription: 'A modern and responsive gym website designed to showcase fitness services, workout programs, and membership options with a premium user experience.',
    fullDescription: 'A modern and responsive gym website designed to showcase fitness services, workout programs, and membership options with a premium user experience.',
    clientContext: 'Fitness & Gym Industry',
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    keyFeatures: [
      'Modern and premium UI/UX design',
      'Responsive desktop and mobile layout',
      'Fitness programs and workout sections',
      'Gym facilities showcase',
      'Membership plans and service details',
      'Interactive navigation and call-to-action buttons',
      'Contact and membership enquiry options',
    ],
    liveUrl: 'https://muscleempire.vercel.app/',
    githubUrl: null,
    demoType: 'real-project',
    mediaType: 'website',
    videoUrl: null,
  },
];

export const SERVICE_CATEGORIES = [
  'All Projects',
  'Websites',
  'AI Automation',
  'Video Ads',
  '3D Products',
  'Graphic Design'
] as const;
