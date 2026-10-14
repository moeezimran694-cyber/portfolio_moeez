import React from 'react';
import { Logo } from './Logo';
import { ArrowUp, Heart, Mail, MessageSquare, Lock } from 'lucide-react';
import { SITE_CONFIG } from '../data/config';

interface FooterProps {
  onNavigate?: (sectionId: string) => void;
  onOpenControlPanel?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenControlPanel }) => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#02040a] border-t border-slate-900 pt-16 pb-12 overflow-hidden">
      {/* Background ambient lighting glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-t from-purple-950/20 to-transparent blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-cyan-400/90 font-mono font-medium tracking-wide">
              {SITE_CONFIG.tagline}
            </p>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Futuristic digital solutions, intelligent AI voice agents, modern web architectures, and cinematic 3D product visuals built for global growth.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Navigation</h4>
            <div className="flex flex-col space-y-2 text-xs text-slate-400">
              <a href="#home" onClick={(e) => handleLinkClick('home', e)} className="hover:text-cyan-300 transition-colors w-fit">
                Home
              </a>
              <a href="#services" onClick={(e) => handleLinkClick('services', e)} className="hover:text-cyan-300 transition-colors w-fit">
                Services
              </a>
              <a href="#projects" onClick={(e) => handleLinkClick('projects', e)} className="hover:text-cyan-300 transition-colors w-fit">
                Selected Projects
              </a>
              <a href="#about" onClick={(e) => handleLinkClick('about', e)} className="hover:text-cyan-300 transition-colors w-fit">
                About Moeez
              </a>
              <a href="#contact" onClick={(e) => handleLinkClick('contact', e)} className="hover:text-cyan-300 transition-colors w-fit">
                Contact & Inquiries
              </a>
            </div>
          </div>

          {/* Direct Communication Channels */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Direct Inquiries</h4>
            <div className="space-y-2 text-xs">
              <a
                href={SITE_CONFIG.socials.email}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>{SITE_CONFIG.contactEmail}</span>
              </a>

              {SITE_CONFIG.socials.whatsapp && (
                <a
                  href={SITE_CONFIG.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>WhatsApp ({SITE_CONFIG.socials.whatsappNumber})</span>
                </a>
              )}
            </div>

            {/* Back to top button */}
            <div className="pt-3">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs cursor-pointer transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Back to top</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Microcopy Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {currentYear} <strong className="text-slate-300 font-medium">Moeez_Portfolio</strong>. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            {onOpenControlPanel && (
              <button
                type="button"
                onClick={onOpenControlPanel}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                title="Control Panel (Owner Access)"
              >
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>Control Panel</span>
              </button>
            )}

            <div className="flex items-center gap-1.5">
              <span>Built with passion & precision for international excellence</span>
              <Heart className="w-3 h-3 text-purple-400 fill-purple-400/40 inline" />
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
