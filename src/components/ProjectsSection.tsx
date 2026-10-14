import React, { useState, useMemo } from 'react';
import { ArrowUpRight, Eye, ExternalLink, Sparkles, MessageSquare } from 'lucide-react';
import { SERVICE_CATEGORIES, Project } from '../data/projectsData';
import { ProjectDetailModal } from './ProjectDetailModal';
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
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-sm shrink-0">
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

        {/* Projects Display: Empty State or Grid */}
        {filteredProjects.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col justify-between rounded-2xl bg-[#0a0f1d] border border-slate-800/80 hover:border-cyan-500/40 overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_40px_-10px_rgba(6,182,255,0.15)] will-change-transform"
              >
                {/* Top Image Container */}
                <div 
                  className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950 cursor-pointer"
                  onClick={() => setActiveModalProject(project)}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Scrim Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-transparent to-transparent opacity-80" />

                  {/* Hover Quick Action Overlay */}
                  <div className="absolute inset-0 bg-purple-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900/90 border border-cyan-400/50 shadow-lg">
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      View Project Details
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Metadata */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <span className="text-cyan-400 font-medium">{project.category}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-purple-300">{project.status || 'Live Project'}</span>
                    </div>

                    {/* Project Title */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">
                      {project.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-sm text-slate-300 leading-relaxed font-normal mb-6">
                      {project.shortDescription}
                    </p>
                  </div>

                  {/* Bottom Bar: Tools and Action Links */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 truncate max-w-[55%]">
                      {project.tools.slice(0, 2).map((t, i) => (
                        <span key={i} className="truncate">
                          {t}{i === 0 && project.tools.length > 1 ? ' · ' : ''}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-white transition-colors"
                          title="Open Live Website"
                        >
                          <span>Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setActiveModalProject(project)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <span>Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

              </motion.div>
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
