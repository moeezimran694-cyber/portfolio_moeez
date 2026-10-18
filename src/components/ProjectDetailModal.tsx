import React, { useEffect } from 'react';
import { X, ExternalLink, Github, MessageSquare, CheckCircle2, Layers, Calendar, Globe, Play, Video, Film, Image as ImageIcon } from 'lucide-react';
import { Project } from '../data/projectsData';
import { parseVideoUrl } from '../utils/videoUtils';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onDiscussProject: (serviceName: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onDiscussProject
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      data-lenis-prevent
    >
      <div 
        className="relative w-full max-w-4xl bg-[#090d1a] border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0c1222]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              {project.category}
            </span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-xs font-medium text-purple-300">
              {project.status || 'Live Project'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Title and Tagline */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 id="modal-project-title" className="text-2xl sm:text-3xl font-extrabold text-white">
                {project.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-1 font-normal">
                {project.tagline}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 shadow-md shadow-purple-900/40 transition-all"
                >
                  <Globe className="w-4 h-4 text-cyan-200" />
                  <span>Visit Live Project</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all"
                >
                  <Github className="w-4 h-4 text-purple-400" />
                  <span>Source Code</span>
                </a>
              )}
            </div>
          </div>

          {/* Project Media Showcase: Video Player OR Screenshot/Artwork */}
          {(() => {
            const parsedVideo = project.videoUrl ? parseVideoUrl(project.videoUrl) : null;
            if (parsedVideo) {
              return (
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-purple-500/40 bg-black shadow-2xl">
                  {parsedVideo.type === 'youtube' || parsedVideo.type === 'vimeo' ? (
                    <iframe
                      src={parsedVideo.embedUrl}
                      title={project.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <video
                      controls
                      playsInline
                      autoPlay
                      poster={project.image}
                      className="w-full h-full object-contain bg-black"
                      src={parsedVideo.embedUrl}
                    >
                      Your browser does not support video playback.
                    </video>
                  )}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-500/40 text-[10px] font-semibold text-purple-200 flex items-center gap-1.5 backdrop-blur-sm pointer-events-none">
                    <Play className="w-2.5 h-2.5 fill-purple-300" />
                    <span>Video Showcase</span>
                  </div>
                </div>
              );
            }

            return (
              <div className="relative w-full min-h-[300px] max-h-[75vh] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-3 group">
                {/* Ambient glow matching the image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center blur-2xl opacity-25 scale-110 pointer-events-none"
                  style={{ backgroundImage: `url(${project.image})` }}
                />

                <img
                  src={project.image}
                  alt={project.title}
                  className="relative z-10 max-w-full max-h-[72vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                {project.mediaType === 'image' && (
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-white/10 text-xs text-emerald-300 flex items-center gap-1.5 shadow-lg">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>High-Resolution Graphic Design</span>
                  </div>
                )}
                {project.mediaType === 'website' && project.liveUrl && (
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-white/10 text-xs text-cyan-300 flex items-center gap-1.5 shadow-lg">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Production Web Application</span>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Project Overview & Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Description & Highlights */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Project Overview</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {project.fullDescription || project.shortDescription}
                </p>
                {project.clientContext && (
                  <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                    <strong className="text-slate-300">Client Scope:</strong> {project.clientContext}
                  </p>
                )}
              </div>

              {/* Key Features */}
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Key Features & Highlights</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.keyFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Col: Tech Stack & Actions */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>Tech Stack & Tools</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Discuss Similar Project CTA */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-cyan-950/30 border border-purple-500/30 text-center">
                <h4 className="text-sm font-bold text-white mb-1.5">Need a similar solution?</h4>
                <p className="text-xs text-slate-400 mb-4">
                  Let's discuss requirements, timeline, and pricing.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onDiscussProject(project.title);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 shadow-md shadow-purple-900/40 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Discuss This Project</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
