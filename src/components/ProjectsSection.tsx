import React, { useState, useMemo } from 'react';
import { Sparkles, MessageSquare, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { SERVICE_CATEGORIES, Project } from '../data/projectsData';
import { ProjectDetailModal } from './ProjectDetailModal';
import { ProjectCard } from './ProjectCard';
import { motion } from 'motion/react';

interface ProjectsSectionProps {
  projects: Project[];
  onDiscussProject: (serviceName: string) => void;
  onOpenControlPanel: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ 
  projects,
  onDiscussProject,
  onOpenControlPanel
}) => {
  const [selectedCategory, setSelectedCategory] = useState<typeof SERVICE_CATEGORIES[number]>('All Projects');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All Projects') {
      return projects;
    }
    return projects.filter((project) => project.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <section id="projects" className="relative py-28 bg-[#02050e] overflow-hidden">
      {/* Background ambient lighting - optimized */}
      <div className="absolute top-1/4 right-0 w-80 h-80 radial-glow-purple pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 radial-glow-cyan pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with smooth scroll animation */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3">
            <span className="w-6 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400" />
            <span>Curated Creative & Technical Showcase</span>
            <span className="w-6 h-[2px] bg-gradient-to-l from-purple-500 to-cyan-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
            Selected Projects.{' '}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Real-World Work.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal">
            Explore live production websites, intelligent AI solutions, and creative digital assets built for businesses.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-12 gap-2 scrollbar-none"
        >
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-sm shrink-0 shadow-lg">
            {SERVICE_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md shadow-purple-900/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Projects Display: Empty State or Grid with 3D Tilt Cards */}
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto p-10 sm:p-14 rounded-3xl bg-[#090e1d] border border-slate-800 text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 radial-glow-purple pointer-events-none opacity-40" />

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-cyan-400/20 border border-purple-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-5">
              <Sparkles className="w-7 h-7" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">Case Studies & Projects Being Updated</h3>
            <p className="text-sm text-slate-300 mb-8 leading-relaxed max-w-lg mx-auto font-normal">
              We are currently updating our portfolio with recent client websites, AI automations, and 3D visual campaigns. In the meantime, you can discuss your project requirements directly with us.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onDiscussProject('New Project')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-cyan-200" />
                <span>Discuss a Project</span>
              </button>

              <button
                type="button"
                onClick={onOpenControlPanel}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
              >
                <span>Owner Portal</span>
              </button>
            </div>
          </motion.div>
        ) : filteredProjects.length === 0 ? (
          <div className="max-w-md mx-auto p-8 rounded-2xl bg-[#090e1d] border border-slate-800 text-center">
            <p className="text-sm text-slate-300 mb-4">No projects under "{selectedCategory}" yet.</p>
            <button
              type="button"
              onClick={() => setSelectedCategory('All Projects')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 transition-all cursor-pointer"
            >
              View All {projects.length} Projects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onOpenDetails={(p) => setActiveModalProject(p)}
              />
            ))}
          </div>
        )}

      </div>

      {/* Project Detail Modal */}
      {activeModalProject && (
        <ProjectDetailModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
          onDiscussProject={(serviceName) => {
            setActiveModalProject(null);
            onDiscussProject(serviceName);
          }}
        />
      )}
    </section>
  );
};
