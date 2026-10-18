/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsSection } from './components/StatsSection';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection, ContactSectionHandle } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { ControlPanelModal } from './components/ControlPanelModal';
import { Project, PROJECTS_DATA } from './data/projectsData';
import { motion, type Variants } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useSmoothScroll } from './context/SmoothScrollContext';
import { CustomCursor } from './components/CustomCursor';

const sectionContainerVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function App() {
  const contactRef = useRef<ContactSectionHandle>(null);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('moeez_real_projects_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return PROJECTS_DATA;
  });

  const fetchProjects = useCallback(async (updatedList?: Project[]) => {
    let deletedIds: string[] = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem('moeez_deleted_project_ids') || '[]');
    } catch {}

    if (updatedList && Array.isArray(updatedList)) {
      const filtered = updatedList.filter((p) => !deletedIds.includes(p.id));
      setProjects(filtered);
      localStorage.setItem('moeez_real_projects_list', JSON.stringify(filtered));
      // Also persist to server database so other devices immediately see it
      try {
        await fetch('/api/projects/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projects: filtered }),
        });
      } catch {}
      return;
    }

    try {
      // Fetch official global projects from Cloud SQL database
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
        const cleanProjects = data.projects.filter((p: Project) => !deletedIds.includes(p.id));
        setProjects(cleanProjects);
        localStorage.setItem('moeez_real_projects_list', JSON.stringify(cleanProjects));
        return;
      }
    } catch {
      // Fallback to local storage if offline
      const saved = localStorage.getItem('moeez_real_projects_list');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const filtered = parsed.filter((p: Project) => !deletedIds.includes(p.id));
            setProjects(filtered);
          }
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Keyboard shortcut: Ctrl + Shift + A to open Control Panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsControlPanelOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { scrollTo, pauseScroll, resumeScroll } = useSmoothScroll();

  useEffect(() => {
    if (isControlPanelOpen) {
      pauseScroll();
    } else {
      resumeScroll();
    }
  }, [isControlPanelOpen, pauseScroll, resumeScroll]);

  const scrollToSection = (id: string) => {
    scrollTo(id, { offset: -70 });
  };

  const handleSelectServiceFromCard = (serviceTitle: string) => {
    if (contactRef.current) {
      contactRef.current.prefillService(serviceTitle);
    } else {
      scrollToSection('contact');
    }
  };

  const handleDiscussProject = (projectTitleOrService: string) => {
    if (contactRef.current) {
      contactRef.current.prefillService(projectTitleOrService);
    } else {
      scrollToSection('contact');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 selection:bg-purple-500/30 selection:text-cyan-200">
      {/* Subtle desktop ambient cursor glow */}
      <CustomCursor />

      {/* Top thin reading scroll progress bar */}
      <ScrollProgressBar />

      {/* Sleek sticky navigation with owner control panel entry */}
      <Navbar
        onNavigate={scrollToSection}
        onOpenContact={() => scrollToSection('contact')}
        onOpenControlPanel={() => setIsControlPanelOpen(true)}
      />

      {/* Main Content Sections with Framer Motion Entrance Animations */}
      <main>
        {/* Hero Section Container */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionContainerVariants}
        >
          <Hero
            onExploreServices={() => scrollToSection('services')}
            onViewProjects={() => scrollToSection('projects')}
          />
        </motion.div>

        {/* Credibility & Animated Metrics Stats Section Container */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={sectionContainerVariants}
        >
          <StatsSection />
        </motion.div>

        {/* Complete Services Section Container */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={sectionContainerVariants}
        >
          <ServicesSection onSelectService={handleSelectServiceFromCard} />
        </motion.div>

        {/* Live Projects & Portfolio Section Container */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={sectionContainerVariants}
        >
          <ProjectsSection 
            projects={projects}
            onDiscussProject={handleDiscussProject}
            onOpenControlPanel={() => setIsControlPanelOpen(true)}
          />
        </motion.div>

        {/* About Section Container */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={sectionContainerVariants}
        >
          <AboutSection onDiscussProject={() => scrollToSection('contact')} />
        </motion.div>

        {/* Contact Section Container */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={sectionContainerVariants}
        >
          <ContactSection ref={contactRef} />
        </motion.div>
      </main>

      {/* Elegant dark footer with Control Panel access */}
      <Footer 
        onNavigate={scrollToSection} 
        onOpenControlPanel={() => setIsControlPanelOpen(true)}
      />

      {/* Owner Protected Control Panel (Password: moeezimran786) */}
      <ControlPanelModal
        isOpen={isControlPanelOpen}
        onClose={() => setIsControlPanelOpen(false)}
        projects={projects}
        onRefreshProjects={fetchProjects}
      />

      {/* Small Persistent Circular 'Get Started' Action Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center group">
        {/* Sleek Tooltip appearing on hover */}
        <div 
          className="mr-3 px-3 py-1.5 rounded-xl bg-[#090d1a]/95 border border-slate-700/80 text-xs font-semibold text-white shadow-xl backdrop-blur-md opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap hidden sm:flex items-center gap-1.5"
        >
          <span>Get Started</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        <button
          type="button"
          onClick={() => scrollToSection('contact')}
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-cyan-400 p-[1.5px] shadow-[0_4px_20px_rgba(147,51,234,0.45),0_0_15px_rgba(6,182,255,0.25)] hover:shadow-[0_6px_28px_rgba(147,51,234,0.65),0_0_22px_rgba(6,182,255,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Get Started - Contact Moeez"
          title="Get Started"
        >
          {/* Subtle breathing radar ring */}
          <span className="absolute -inset-1 rounded-full bg-cyan-400/25 animate-ping opacity-60 pointer-events-none" />

          {/* Inner circular surface */}
          <div className="w-full h-full rounded-full bg-[#0a0f1d] hover:bg-transparent transition-colors duration-300 flex flex-col items-center justify-center text-white">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300 group-hover:text-white transition-colors" />
            <span className="text-[9px] font-bold tracking-tight text-white/90 group-hover:text-white mt-0.5 leading-none">
              Start
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
