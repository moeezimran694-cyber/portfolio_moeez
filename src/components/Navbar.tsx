import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, ArrowUpRight, MessageSquare, Lock } from 'lucide-react';

interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
  onOpenContact?: () => void;
  onOpenControlPanel?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onOpenContact, onOpenControlPanel }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // High-performance IntersectionObserver for active section (zero layout thrashing)
    const sections = ['home', 'services', 'projects', 'about', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Services', id: 'services' },
    { label: 'Projects', id: 'projects' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLetsTalkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onOpenContact) {
      onOpenContact();
    } else {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 will-change-transform ${
        isScrolled
          ? 'bg-[#030712]/90 backdrop-blur-md border-b border-slate-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
          : 'bg-transparent border-b border-white/[0.04]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand title wordmark */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick('home', e)}
            className="flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
            aria-label="Moeez_Portfolio Home"
          >
            <Logo size="md" />
          </a>

          {/* Zone 2: Navigation Links (single-line, clean typography) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleLinkClick(item.id, e)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-200 ${
                    isActive
                      ? 'text-cyan-300 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action (Let's Talk button) + Owner Control Panel */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {onOpenControlPanel && (
              <button
                type="button"
                onClick={onOpenControlPanel}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                title="Control Panel (Owner Access)"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}

            <a
              href="#contact"
              onClick={handleLetsTalkClick}
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-white transition-all duration-300 rounded-xl overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {/* Button gradient background */}
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 transition-all duration-300 group-hover:opacity-95" />
              {/* Button glow effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-400 blur-sm opacity-40 group-hover:opacity-80 transition-opacity" />
              
              <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
                <MessageSquare className="w-3.5 h-3.5" />
                Let's Talk
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-200 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0f1d]/95 backdrop-blur-xl border-b border-slate-800 px-4 pt-4 pb-6 shadow-2xl transition-all">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleLinkClick(item.id, e)}
                className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-purple-900/30 text-cyan-300 border border-purple-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2">
              <a
                href="#contact"
                onClick={handleLetsTalkClick}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 shadow-lg shadow-purple-900/40"
              >
                <MessageSquare className="w-4 h-4" />
                Let's Talk
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
