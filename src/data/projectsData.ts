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
 * Add your real projects below or use the in-app "+ Add Real Project" button.
 */
export const PROJECTS_DATA: Project[] = [];

export const SERVICE_CATEGORIES = [
  'All Projects',
  'Websites',
  'AI Automation',
  'Video Ads',
  '3D Products',
  'Graphic Design'
] as const;
