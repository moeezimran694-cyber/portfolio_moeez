import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  ShieldCheck, 
  Quote, 
  ArrowUpRight, 
  Play, 
  Pause, 
  PlusCircle, 
  X, 
  CheckCircle2, 
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Testimonial, INITIAL_TESTIMONIALS } from '../data/testimonialsData';

interface TestimonialsSectionProps {
  onDiscussProject?: (serviceContext?: string) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ onDiscussProject }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem('moeez_live_client_testimonials');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge custom client reviews with initial reviews
          const customIds = new Set(parsed.map((t: Testimonial) => t.id));
          const combined = [
            ...parsed,
            ...INITIAL_TESTIMONIALS.filter((t) => !customIds.has(t.id))
          ];
          return combined;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_TESTIMONIALS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // New Review Form State
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [authorCompany, setAuthorCompany] = useState('');
  const [authorCategory, setAuthorCategory] = useState<'Websites' | 'AI Automation' | '3D & Video' | 'Graphic Design'>('Websites');
  const [authorRating, setAuthorRating] = useState(5);
  const [authorQuote, setAuthorQuote] = useState('');
  const [authorProjectUrl, setAuthorProjectUrl] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const categories = ['All', 'Websites', 'AI Automation', '3D & Video', 'Graphic Design'] as const;

  const filteredTestimonials = testimonials.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  // Duplicate for seamless infinite marquee loop (minimum 10 items for flawless loop)
  const marqueeItems = [...filteredTestimonials, ...filteredTestimonials, ...filteredTestimonials];

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 420;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!authorName.trim()) errors.name = 'Please provide your full name.';
    if (!authorCompany.trim()) errors.company = 'Please enter your company or project name.';
    if (!authorQuote.trim() || authorQuote.trim().length < 15) {
      errors.quote = 'Please write a review with at least 15 characters.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newReview: Testimonial = {
      id: `client_review_${Date.now()}`,
      name: authorName.trim(),
      role: authorRole.trim() || 'Client',
      company: authorCompany.trim(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80`,
      rating: authorRating,
      quote: authorQuote.trim(),
      category: authorCategory,
      projectRef: authorCompany.trim(),
      projectUrl: authorProjectUrl.trim() || undefined,
      verified: true,
      date: 'Just now',
    };

    const updated = [newReview, ...testimonials];
    setTestimonials(updated);
    try {
      localStorage.setItem('moeez_live_client_testimonials', JSON.stringify(updated));
    } catch {}

    // Reset Form
    setAuthorName('');
    setAuthorRole('');
    setAuthorCompany('');
    setAuthorQuote('');
    setAuthorProjectUrl('');
    setFormErrors({});
    setIsModalOpen(false);

    // Show toast
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  return (
    <section id="testimonials" className="relative py-28 bg-[#030712] overflow-hidden border-t border-slate-800/80">
      {/* Background ambient glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 radial-glow-purple opacity-35 pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 radial-glow-cyan opacity-35 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-purple-400 mb-3.5 shadow-inner">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real Verified Client Experiences</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Trusted by Founders &{' '}
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Growing Brands.
              </span>
            </h2>

            <p className="mt-3 text-base text-slate-300 font-normal max-w-2xl leading-relaxed">
              Read authentic feedback from business owners, agency leads, and gym founders who scaled their operations with our digital solutions.
            </p>
          </div>

          {/* Social Proof Aggregate Score & Action Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            <div className="flex items-center gap-3 p-3 px-4 rounded-2xl bg-[#0a0f1d] border border-slate-800/80 shadow-lg">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-xs">
                <p className="font-bold text-white leading-none">5.0 / 5.0 Rating</p>
                <p className="text-[11px] text-slate-400 mt-0.5">38+ Verified Deliveries</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 shadow-md shadow-purple-900/40 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-cyan-200" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>

        {/* Carousel Filter & Speed Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800/60">
          {/* Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-slate-800 text-white border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Interactive Navigation Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                isPaused 
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title={isPaused ? 'Resume auto-scrolling' : 'Pause auto-scrolling'}
            >
              {isPaused ? (
                <>
                  <Play className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 text-slate-400" />
                  <span>Pause</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleManualScroll('left')}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleManualScroll('right')}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Infinite Horizontal Carousel Container with Edge Gradient Fade */}
      <div 
        className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          ref={scrollContainerRef}
          className={`animate-marquee-track py-4 gap-6 px-4 ${isPaused ? 'is-paused' : ''}`}
        >
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="w-[340px] sm:w-[410px] shrink-0 p-6 sm:p-7 rounded-2xl bg-[#0a0f1d] border border-slate-800/80 hover:border-cyan-500/40 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_40px_-12px_rgba(6,182,212,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group cursor-default"
            >
              <div>
                {/* Card Top: Stars + Verified Badge + Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Verified Client</span>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="relative mb-5">
                  <Quote className="w-6 h-6 text-purple-500/20 absolute -top-2 -left-2 pointer-events-none" />
                  <p className="text-sm text-slate-200 leading-relaxed font-normal relative z-10 pl-2 italic">
                    "{item.quote}"
                  </p>
                </div>

                {/* Project Reference Badge */}
                {item.projectRef && (
                  <div className="mb-4">
                    {item.projectUrl ? (
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/link"
                      >
                        <span>Project: {item.projectRef}</span>
                        <ArrowUpRight className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </a>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">
                        Deliverable: {item.projectRef}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80';
                      }}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-sm"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#0a0f1d]" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-none mt-0.5">
                      {item.role}, <span className="text-slate-300 font-medium">{item.company}</span>
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-slate-500 font-mono">
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live "Leave a Review" Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#0a0f1d] border border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-6 sm:p-8 z-10 overflow-hidden"
            >
              {/* Top Accent Gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400" />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Share Your Experience</h3>
                    <p className="text-xs text-slate-400">Your feedback will be published live in the carousel</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Close review dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                  {formErrors.name && (
                    <p className="text-xs text-rose-400 mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Role / Position
                    </label>
                    <input
                      type="text"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      placeholder="e.g. Founder & CEO"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Company or Project *
                    </label>
                    <input
                      type="text"
                      value={authorCompany}
                      onChange={(e) => setAuthorCompany(e.target.value)}
                      placeholder="e.g. Muscle Empire"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                    />
                    {formErrors.company && (
                      <p className="text-xs text-rose-400 mt-1">{formErrors.company}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Service Category
                    </label>
                    <select
                      value={authorCategory}
                      onChange={(e) => setAuthorCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                    >
                      <option value="Websites">Websites & Apps</option>
                      <option value="AI Automation">AI Voice & Automation</option>
                      <option value="3D & Video">3D Visuals & Video Ads</option>
                      <option value="Graphic Design">Graphic Design & Branding</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Star Rating
                    </label>
                    <div className="flex items-center gap-1.5 py-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setAuthorRating(star)}
                          className="p-1 focus:outline-none cursor-pointer"
                        >
                          <Star 
                            className={`w-5 h-5 ${
                              star <= authorRating 
                                ? 'fill-amber-400 text-amber-400' 
                                : 'text-slate-600'
                            } transition-colors hover:scale-110`} 
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-400 ml-2">
                        {authorRating}.0 Star
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Live Project / Website Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={authorProjectUrl}
                    onChange={(e) => setAuthorProjectUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Review & Testimonial *
                  </label>
                  <textarea
                    rows={4}
                    value={authorQuote}
                    onChange={(e) => setAuthorQuote(e.target.value)}
                    placeholder="Describe the quality of delivery, communication, and business results achieved..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
                  />
                  {formErrors.quote && (
                    <p className="text-xs text-rose-400 mt-1">{formErrors.quote}</p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 shadow-md shadow-purple-900/40 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                    <span>Publish Review</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Real-time Review Published Celebration Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 max-w-sm p-4 rounded-2xl bg-[#080d1a]/95 border border-emerald-500/40 shadow-2xl backdrop-blur-md flex items-start gap-3"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white">Review Published Live</h5>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Thank you! Your testimonial has been added and is now scrolling in the live social proof carousel.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
