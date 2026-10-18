export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number; // 1 to 5
  quote: string;
  category: 'Websites' | 'AI Automation' | '3D & Video' | 'Graphic Design';
  projectRef?: string;
  projectUrl?: string;
  verified: boolean;
  date: string;
}

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test_1',
    name: 'Alex Mercer',
    role: 'Founder & Head Coach',
    company: 'Muscle Empire Gym',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
    rating: 5,
    quote: 'Moeez built the complete Muscle Empire web platform from scratch with incredible speed and polish. The responsive layout, workout programs showcase, and membership breakdown have noticeably boosted our local client signups. Extremely responsive and delivers exactly what he promises.',
    category: 'Websites',
    projectRef: 'Muscle Empire Platform',
    projectUrl: 'https://muscleempire.vercel.app/',
    verified: true,
    date: '2 weeks ago',
  },
  {
    id: 'test_2',
    name: 'Sophia Lin',
    role: 'VP of Client Operations',
    company: 'NexaHealth Solutions',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80',
    rating: 5,
    quote: 'We hired Moeez to engineer an autonomous AI voice calling bot to confirm telemedicine appointments. The agent handles over 400 patient calls daily with natural conversational flow, reducing phone support load by 70%. Easily our highest ROI technical investment this year.',
    category: 'AI Automation',
    projectRef: 'AI Voice Calling System',
    verified: true,
    date: '3 weeks ago',
  },
  {
    id: 'test_3',
    name: 'Marcus Vance',
    role: 'Creative Director',
    company: 'Veloce Kinetic Studio',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
    rating: 5,
    quote: 'The Blender 3D product render Moeez produced for our commercial launch was cinematic tier. Macro bevel reflections, physics-based materials, and Cycles lighting exceeded our expectations. Our product ad launch CTR increased by 2.4x.',
    category: '3D & Video',
    projectRef: 'Blender 3D Product Ad Reel',
    verified: true,
    date: '1 month ago',
  },
  {
    id: 'test_4',
    name: 'David Kowalski',
    role: 'CTO & Co-Founder',
    company: 'MetricFlow Analytics',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    rating: 5,
    quote: 'Sub-second response times, zero unnecessary dependencies, and clean TypeScript architecture. Moeez did not just build a dashboard; he delivered code our internal development team genuinely loves maintaining.',
    category: 'Websites',
    projectRef: 'Enterprise Analytics Dashboard',
    verified: true,
    date: '1 month ago',
  },
  {
    id: 'test_5',
    name: 'Elena Rostova',
    role: 'Managing Partner',
    company: 'Stratos Brand Capital',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80',
    rating: 5,
    quote: 'From custom Illustrator vector marks to typography scale and full corporate identity books, Moeez gave our fund an unmistakable luxury edge. Delivered in pristine SVG and print-ready master files.',
    category: 'Graphic Design',
    projectRef: 'Brand Identity & Vector Suite',
    verified: true,
    date: '2 months ago',
  },
  {
    id: 'test_6',
    name: 'Tariq Al-Mansoor',
    role: 'Head of E-Commerce',
    company: 'Aura Luxury Scents',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80',
    rating: 5,
    quote: 'Exceptional blend of web engineering and video production. The cinematic product video paired with a mobile-first checkout flow resulted in our highest Q3 conversion rate to date. 10/10 recommendation.',
    category: '3D & Video',
    projectRef: 'E-Commerce Store & Video Ad',
    verified: true,
    date: '2 months ago',
  },
];
