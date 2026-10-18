import React, { useRef, useState } from 'react';
import { ExternalLink, Play, ArrowUpRight, Eye, Globe, Image as ImageIcon } from 'lucide-react';
import { Project } from '../data/projectsData';
import { motion } from 'motion/react';

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpenDetails: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onOpenDetails }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert to percentage (0 - 100)
    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;
    setMousePos({ x: xPct, y: yPct });

    // Subtle 3D tilt calculation (-6deg to +6deg)
    const rX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
    const rY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
      }}
      className="group relative flex flex-col justify-between rounded-2xl bg-[#090d1a] border border-slate-800/80 hover:border-cyan-500/50 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_-12px_rgba(6,182,212,0.2)] will-change-transform overflow-hidden"
    >
      {/* Interactive dynamic cursor spotlight border glow */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-100 z-10"
          style={{
            background: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, rgba(6, 182, 212, 0.18), transparent 70%)`,
          }}
        />
      )}

      {/* Top Image Showcase: Preserves original aspect ratio and sizing without distortion */}
      <div
        className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950 flex items-center justify-center cursor-pointer p-3 select-none"
        onClick={() => onOpenDetails(project)}
      >
        {/* Ambient atmospheric backdrop blur */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-20 scale-110 pointer-events-none"
          style={{ backgroundImage: `url(${project.image})` }}
        />

        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
          }}
          className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-105 rounded-lg shadow-md"
        />

        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090d1a] via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Format Pill (Website / Video Ad / Graphic Design) */}
        {project.mediaType === 'video' || project.videoUrl ? (
          <span className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-purple-950/90 border border-purple-500/40 text-[10px] font-semibold text-purple-200 flex items-center gap-1.5 backdrop-blur-sm shadow-md">
            <Play className="w-2.5 h-2.5 fill-purple-300" />
            <span>Video Ad</span>
          </span>
        ) : project.mediaType === 'image' ? (
          <span className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-[10px] font-semibold text-emerald-200 flex items-center gap-1.5 backdrop-blur-sm shadow-md">
            <ImageIcon className="w-2.5 h-2.5" />
            <span>Design</span>
          </span>
        ) : (
          <span className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-[10px] font-semibold text-cyan-200 flex items-center gap-1.5 backdrop-blur-sm shadow-md">
            <Globe className="w-2.5 h-2.5" />
            <span>Website</span>
          </span>
        )}

        {/* Ambient Play Overlay for Video Projects */}
        {(project.mediaType === 'video' || project.videoUrl) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-15">
            <div className="w-12 h-12 rounded-full bg-purple-600/90 border border-purple-400/50 text-white flex items-center justify-center shadow-lg shadow-purple-950/80 group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 z-20 bg-purple-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900/90 border border-cyan-400/50 shadow-xl">
            {project.mediaType === 'video' || project.videoUrl ? (
              <>
                <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                <span>Watch Video Showcase</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>View Project Details</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 flex flex-col flex-grow justify-between relative z-10">
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
              onClick={() => onOpenDetails(project)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {project.mediaType === 'video' || project.videoUrl ? (
                <>
                  <span>Play</span>
                  <Play className="w-3 h-3 fill-slate-300" />
                </>
              ) : (
                <>
                  <span>Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
