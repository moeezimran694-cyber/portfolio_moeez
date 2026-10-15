/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection, ContactSectionHandle } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { ControlPanelModal } from './components/ControlPanelModal';
import { Project, PROJECTS_DATA } from './data/projectsData';
import { motion, type Variants } from 'motion/react';

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
    if (updatedList && Array.isArray(updatedList)) {
      setProjects(updatedList);
      localStorage.setItem('moeez_real_projects_list', JSON.stringify(updatedList));
      return;
    }

    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        if (data.projects.length > 0) {
          setProjects(data.projects);
          localStorage.setItem('moeez_real_projects_list', JSON.stringify(data.projects));
          return;
        } else {
          // If server returned 0 projects, check if localStorage has previously saved projects to sync
          const saved = localStorage.getItem('moeez_real_projects_list');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setProjects(parsed);
                // Background sync to server
                for (const proj of parsed) {
                  fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(proj),
                  }).catch(() => {});
                }
                return;
              }
            } catch {}
          }
          setProjects([]);
          localStorage.setItem('moeez_real_projects_list', JSON.stringify([]));
          return;
        }
      }
    } catch {
      // fallback to local storage
      const saved = localStorage.getItem('moeez_real_projects_list');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setProjects(parsed);
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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
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
    </div>
  );
}
