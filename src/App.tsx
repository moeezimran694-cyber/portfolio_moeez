/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection, ContactSectionHandle } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ScrollProgressBar } from './components/ScrollProgressBar';
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

      {/* Sleek sticky navigation */}
      <Navbar
        onNavigate={scrollToSection}
        onOpenContact={() => scrollToSection('contact')}
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
          <ProjectsSection onDiscussProject={handleDiscussProject} />
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

      {/* Elegant dark footer */}
      <Footer onNavigate={scrollToSection} />
    </div>
  );
}
