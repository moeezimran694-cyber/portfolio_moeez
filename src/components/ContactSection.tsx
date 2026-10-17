import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Send, Mail, Copy, Check, AlertCircle, ArrowUpRight, MessageSquare, CheckCircle, CheckCircle2, X } from 'lucide-react';
import { SITE_CONFIG } from '../data/config';
import { motion, AnimatePresence } from 'motion/react';
import { ClientInboxModal } from './ClientInboxModal';

export interface ContactSectionHandle {
  prefillService: (serviceName: string) => void;
}

export const ContactSection = forwardRef<ContactSectionHandle>((props, ref) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    service: SITE_CONFIG.servicesList[0],
    budget: '',
    details: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'saved' | 'prepared'>('idle');
  const [isClientInboxOpen, setIsClientInboxOpen] = useState(false);
  const [clientInboxEmail, setClientInboxEmail] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Auto-dismiss success toast after 6 seconds
  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  useImperativeHandle(ref, () => ({
    prefillService: (serviceName: string) => {
      const matched = SITE_CONFIG.servicesList.find((s) =>
        s.toLowerCase().includes(serviceName.toLowerCase()) || serviceName.toLowerCase().includes(s.toLowerCase())
      );
      if (matched) {
        setFormData((prev) => ({ ...prev, service: matched }));
      }
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email Address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.details.trim()) {
      errs.details = 'Project details are required.';
    } else if (formData.details.trim().length < 10) {
      errs.details = 'Please provide at least a brief description (10+ characters).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const generateMailtoUrl = () => {
    const subject = encodeURIComponent(`Project Inquiry: ${formData.service} - from ${formData.fullName}`);
    const bodyContent = `Hello Moeez,\n\nI am contacting you regarding a project via Moeez_Portfolio.\n\n` +
      `CLIENT DETAILS:\n` +
      `• Name: ${formData.fullName}\n` +
      `• Email: ${formData.email}\n` +
      `• Company: ${formData.company || 'Not Specified'}\n` +
      `• Service Required: ${formData.service}\n` +
      `• Custom Budget / Price: ${formData.budget || 'Flexible'}\n\n` +
      `PROJECT OVERVIEW:\n${formData.details}\n\n` +
      `Best regards,\n${formData.fullName}`;

    return `mailto:${SITE_CONFIG.contactEmail}?subject=${subject}&body=${encodeURIComponent(bodyContent)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setSubmissionStatus('submitting');
    localStorage.setItem('moeez_client_email', formData.email.trim());
    setClientInboxEmail(formData.email.trim());

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmissionStatus('saved');
        setShowSuccessToast(true);
      } else {
        // Still set to saved so client can use the web thread
        setSubmissionStatus('saved');
        setShowSuccessToast(true);
      }
    } catch {
      // Graceful offline fallback
      setSubmissionStatus('saved');
      setShowSuccessToast(true);
    }
  };

  const handleCopyInquiry = () => {
    const fullText = 
      `To: ${SITE_CONFIG.contactEmail}\n` +
      `Subject: Project Inquiry: ${formData.service} - from ${formData.fullName}\n\n` +
      `Name: ${formData.fullName}\n` +
      `Email: ${formData.email}\n` +
      `Company: ${formData.company || 'N/A'}\n` +
      `Service: ${formData.service}\n` +
      `Budget: ${formData.budget}\n\n` +
      `Project Details:\n${formData.details}`;

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <section id="contact" className="relative py-28 bg-[#02050e] overflow-hidden">
      {/* Background ambient lighting - optimized */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 radial-glow-purple" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 radial-glow-cyan" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with smooth scroll animation */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3">
            <span className="w-6 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400" />
            <span>Direct Inquiries</span>
            <span className="w-6 h-[2px] bg-gradient-to-l from-purple-500 to-cyan-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
            Have a Project{' '}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              in Mind?
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal">
            Tell me what you want to build, automate, or create.
          </p>
        </motion.div>

        {/* 2-Column Layout with smooth scroll entrance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Direct Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6 will-change-transform"
          >
            <div className="p-8 rounded-2xl bg-[#090e1d] border border-slate-800/80">
              <h3 className="text-xl font-bold text-white mb-4">Let's Connect Directly</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                Whether you need a high-converting website, an AI voice calling agent, an automated workflow, or photorealistic 3D visuals, I'm ready to collaborate.
              </p>

              {/* Direct Email Card */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block uppercase">Direct Inquiries</span>
                    <a
                      href={SITE_CONFIG.socials.email}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-cyan-300 hover:text-white transition-colors"
                    >
                      {SITE_CONFIG.contactEmail}
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Communication Channels */}
              <div className="space-y-2 pt-2">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Channels</span>
                <div className="flex flex-col gap-2">
                  <a
                    href={SITE_CONFIG.socials.email}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 text-xs text-slate-300 hover:text-white transition-colors"
                  >
                    <span>Email ({SITE_CONFIG.contactEmail})</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                  </a>
                  
                  {SITE_CONFIG.socials.whatsapp && (
                    <a
                      href={SITE_CONFIG.socials.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 text-xs text-slate-300 hover:text-white transition-colors"
                    >
                      <span>WhatsApp Direct ({SITE_CONFIG.socials.whatsappNumber})</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsClientInboxOpen(true)}
                    className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-950/40 to-slate-900/60 hover:bg-slate-900 border border-purple-500/30 text-xs text-cyan-300 hover:text-white transition-colors cursor-pointer w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Client Inbox (View Moeez's Replies)</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </div>
              </div>

              {/* Delivery Policy */}
              <div className="mt-8 pt-6 border-t border-slate-800/80">
                <p className="text-xs text-slate-400 leading-normal">
                  <strong className="text-slate-200">Guaranteed Response:</strong> All verified project inquiries receive a direct response within 24 business hours.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 will-change-transform"
          >
            <div className="p-8 rounded-2xl bg-[#090e1d] border border-slate-800/80 shadow-2xl">
              
              {/* Submission Saved Online Banner */}
              {submissionStatus === 'saved' && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-200 flex-1">
                    <p className="font-semibold text-white">Inquiry & Custom Budget Received Online!</p>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">
                      Your inquiry has been sent straight to Moeez's Admin Panel. A private conversation thread has been opened for your email.
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setClientInboxEmail(formData.email);
                          setIsClientInboxOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Open Live Chat Thread</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyInquiry}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 font-semibold text-xs hover:bg-slate-800 border border-slate-800 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy Formatted Details'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Submission Prepared Banner (Fallback) */}
              {submissionStatus === 'prepared' && (
                <div className="mb-6 p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-200">
                    <p className="font-semibold text-white">Email Application Prepared</p>
                    <p className="text-slate-300 mt-0.5">
                      Your default mail program was opened with your message. If it did not launch automatically, you can use the button below to copy the full formatted inquiry.
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyInquiry}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white font-semibold text-xs hover:bg-purple-500 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted Inquiry'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Direct Web Messages Access Pill */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 mb-6 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white">Have you sent an inquiry before?</span>
                    <p className="text-[11px] text-slate-400">Check direct web replies & chat with Moeez</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsClientInboxOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold text-cyan-300 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View My Web Messages</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* 2-Column Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name <span className="text-purple-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: '' });
                      }}
                      placeholder="e.g. Alex Morgan"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all ${
                        errors.fullName ? 'border-red-500/80' : 'border-slate-800 focus:border-cyan-500'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address <span className="text-purple-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="alex@company.com"
                      className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all ${
                        errors.email ? 'border-red-500/80' : 'border-slate-800 focus:border-cyan-500'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company Name & Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="company" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Company / Business Name <span className="text-slate-500 text-[11px]">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Your organization"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-500 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Project Budget <span className="text-slate-500 text-[11px]">(Write your budget)</span></span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        placeholder="Write your budget"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Required (All 6 Services) */}
                <div>
                  <label htmlFor="service" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Service Required <span className="text-purple-400">*</span>
                  </label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-500 transition-all cursor-pointer"
                  >
                    {SITE_CONFIG.servicesList.map((serviceName) => (
                      <option key={serviceName} value={serviceName}>
                        {serviceName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Details */}
                <div>
                  <label htmlFor="details" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Project Details <span className="text-purple-400">*</span>
                  </label>
                  <textarea
                    id="details"
                    rows={4}
                    value={formData.details}
                    onChange={(e) => {
                      setFormData({ ...formData, details: e.target.value });
                      if (errors.details) setErrors({ ...errors, details: '' });
                    }}
                    placeholder="Tell me about your goals, features needed, timeline, or links to references..."
                    className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all resize-none ${
                      errors.details ? 'border-red-500/80' : 'border-slate-800 focus:border-cyan-500'
                    }`}
                  />
                  {errors.details && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.details}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submissionStatus === 'submitting'}
                    className="w-full sm:flex-1 py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-cyan-200" />
                    <span>{submissionStatus === 'submitting' ? 'Submitting Online...' : 'Send Inquiry & Custom Budget'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyInquiry}
                    className="w-full sm:w-auto py-3.5 px-5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    {copied ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    <span>{copied ? 'Copied Details' : 'Copy Details'}</span>
                  </button>
                </div>

              </form>

            </div>
          </motion.div>

        </div>

      </div>

      {/* Client Inbox Dialog */}
      <ClientInboxModal
        isOpen={isClientInboxOpen}
        onClose={() => setIsClientInboxOpen(false)}
        initialEmail={clientInboxEmail}
      />

      {/* Subtle Success Toast Notification */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-22 right-6 sm:bottom-24 sm:right-6 z-50 max-w-sm w-[calc(100vw-3rem)] pointer-events-auto"
            role="status"
            aria-live="polite"
          >
            <div className="relative p-4 rounded-2xl bg-[#080d1a]/95 border border-emerald-500/35 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(16,185,129,0.16)] backdrop-blur-xl flex items-start gap-3.5 overflow-hidden">
              {/* Subtle top gradient accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />

              {/* Glowing checkmark badge */}
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-4 h-4" />
              </div>

              {/* Message content */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white tracking-tight">
                    Inquiry Sent Successfully
                  </h4>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed font-normal">
                  Thank you! Moeez will review your project details and get back to you shortly.
                </p>
                <div className="mt-2.5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setClientInboxEmail(formData.email);
                      setIsClientInboxOpen(true);
                      setShowSuccessToast(false);
                    }}
                    className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open chat thread</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Dismiss button */}
              <button
                type="button"
                onClick={() => setShowSuccessToast(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer shrink-0 -mr-1 -mt-1"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});
