import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, Globe, Mic, Video, Palette, Box, Cpu, ArrowRight, ArrowLeft, 
  RotateCcw, Check, Sparkles, Send, Copy, Printer, MessageSquare, 
  AlertCircle, ChevronRight, ShieldCheck, Layers, ExternalLink, Mail, CheckCircle2
} from 'lucide-react';
import { CALCULATOR_CONFIG, ServiceId } from '../data/calculatorConfig';
import { 
  calculateProjectCost, formatPrice, AnyServiceOptions, 
  CalculationResult, WebsiteOptions, VoiceAgentOptions, 
  VideoAdsOptions, GraphicDesignOptions, Blender3dOptions, AutomationOptions 
} from '../utils/calculatorEngine';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectCostCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceId;
}

export const ProjectCostCalculatorModal: React.FC<ProjectCostCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialService = 'website',
}) => {
  // Step State: 1 = Choose Service, 2 = Customize Requirements, 3 = Summary & Send Inquiry
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedService, setSelectedService] = useState<ServiceId>(initialService);

  // Service A: Website State
  const [webOpts, setWebOpts] = useState<WebsiteOptions>({
    typeId: 'landing-page',
    pagesCount: 1,
    complexityId: 'professional',
    selectedFeatures: ['contact-form', 'database'],
    contentReadinessId: 'provided',
    urgencyId: 'standard',
  });

  // Service B: Voice Agent State
  const [voiceOpts, setVoiceOpts] = useState<VoiceAgentOptions>({
    agentTypeId: 'inbound',
    purposeId: 'support',
    selectedIntegrations: ['crm', 'calendar'],
    callVolumeId: 'low',
    complexityId: 'professional',
  });

  // Service C: Video Ads State
  const [videoOpts, setVideoOpts] = useState<VideoAdsOptions>({
    durationId: 'short',
    styleId: 'product-ad',
    quantity: 1,
    complexityId: 'professional',
    clientAssetId: 'full-provided',
  });

  // Service D: Graphic Design State
  const [graphicOpts, setGraphicOpts] = useState<GraphicDesignOptions>({
    designTypeId: 'social-posts',
    quantity: 5,
    complexityId: 'professional',
    brandAssetId: 'provided',
  });

  // Service E: Blender 3D State
  const [blenderOpts, setBlenderOpts] = useState<Blender3dOptions>({
    outputTypeId: 'render',
    productModelId: 'provided',
    complexityId: 'professional',
    deliverablesCount: 1,
  });

  // Service F: Automation State
  const [autoOpts, setAutoOpts] = useState<AutomationOptions>({
    automationTypeId: 'lead-management',
    stepsCount: 3,
    selectedIntegrations: ['google-suite', 'crm-sync'],
    complexityId: 'professional',
  });

  // Inquiry Form State
  const [inquiryForm, setInquiryForm] = useState({
    fullName: '',
    email: '',
    company: '',
    description: '',
    preferredContact: 'WhatsApp' as 'WhatsApp' | 'Email' | 'Phone',
    deadline: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Sync initial service if changed
  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
    }
  }, [initialService]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Pure Calculation result
  const calculationResult: CalculationResult = useMemo(() => {
    switch (selectedService) {
      case 'website':
        return calculateProjectCost({ serviceId: 'website', options: webOpts });
      case 'voiceAgent':
        return calculateProjectCost({ serviceId: 'voiceAgent', options: voiceOpts });
      case 'videoAds':
        return calculateProjectCost({ serviceId: 'videoAds', options: videoOpts });
      case 'graphicDesign':
        return calculateProjectCost({ serviceId: 'graphicDesign', options: graphicOpts });
      case 'blender3d':
        return calculateProjectCost({ serviceId: 'blender3d', options: blenderOpts });
      case 'automation':
        return calculateProjectCost({ serviceId: 'automation', options: autoOpts });
      default:
        return calculateProjectCost({ serviceId: 'website', options: webOpts });
    }
  }, [selectedService, webOpts, voiceOpts, videoOpts, graphicOpts, blenderOpts, autoOpts]);

  const handleReset = () => {
    setWebOpts({
      typeId: 'landing-page',
      pagesCount: 1,
      complexityId: 'professional',
      selectedFeatures: ['contact-form'],
      contentReadinessId: 'provided',
      urgencyId: 'standard',
    });
    setVoiceOpts({
      agentTypeId: 'inbound',
      purposeId: 'support',
      selectedIntegrations: ['crm'],
      callVolumeId: 'low',
      complexityId: 'basic',
    });
    setVideoOpts({
      durationId: 'short',
      styleId: 'product-ad',
      quantity: 1,
      complexityId: 'professional',
      clientAssetId: 'full-provided',
    });
    setGraphicOpts({
      designTypeId: 'social-posts',
      quantity: 5,
      complexityId: 'professional',
      brandAssetId: 'provided',
    });
    setBlenderOpts({
      outputTypeId: 'render',
      productModelId: 'provided',
      complexityId: 'professional',
      deliverablesCount: 1,
    });
    setAutoOpts({
      automationTypeId: 'lead-management',
      stepsCount: 3,
      selectedIntegrations: ['google-suite'],
      complexityId: 'professional',
    });
    setCurrentStep(1);
    setSubmissionSuccess(false);
  };

  const getServiceIcon = (id: ServiceId, className = 'w-6 h-6') => {
    switch (id) {
      case 'website':
        return <Globe className={`${className} text-cyan-400`} />;
      case 'voiceAgent':
        return <Mic className={`${className} text-purple-400`} />;
      case 'videoAds':
        return <Video className={`${className} text-fuchsia-400`} />;
      case 'graphicDesign':
        return <Palette className={`${className} text-pink-400`} />;
      case 'blender3d':
        return <Box className={`${className} text-cyan-300`} />;
      case 'automation':
        return <Cpu className={`${className} text-purple-300`} />;
    }
  };

  // Compile clean text estimate
  const generateFormattedSummary = () => {
    const lines = [
      `=========================================`,
      `PROJECT ESTIMATE — MOEEZ_PORTFOLIO`,
      `=========================================`,
      `Service: ${calculationResult.serviceName}`,
      `Scope Overview: ${calculationResult.summaryText}`,
      `Estimated Investment Range: ${formatPrice(calculationResult.estimatedMin)} - ${formatPrice(calculationResult.estimatedMax)} ${calculationResult.currency}`,
      ``,
      `--- Breakdown Details ---`,
      ...calculationResult.breakdown.map((b) => `• ${b.label}: ${formatPrice(b.amount)}`),
      ``,
      `Complexity Tier: ${calculationResult.complexityLabel}`,
      calculationResult.urgencyLabel ? `Urgency: ${calculationResult.urgencyLabel}` : '',
      calculationResult.thirdPartyNotice ? `Note: ${calculationResult.thirdPartyNotice}` : '',
      ``,
      `Disclaimer: ${CALCULATOR_CONFIG.preliminaryNotice}`,
      `Direct Contact: ${CALCULATOR_CONFIG.contact.email} | WhatsApp: ${CALCULATOR_CONFIG.contact.whatsappNumber}`,
      `=========================================`,
    ].filter(Boolean);
    return lines.join('\n');
  };

  const handleCopyEstimate = () => {
    const text = generateFormattedSummary();
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  const handleWhatsAppSend = () => {
    const summary = generateFormattedSummary();
    const clientIntro = inquiryForm.fullName 
      ? `Hi Moeez, I am ${inquiryForm.fullName}${inquiryForm.company ? ` from ${inquiryForm.company}` : ''}. I customized an estimate on your website:\n\n`
      : `Hi Moeez, I generated this project cost estimate on your portfolio:\n\n`;
    const message = encodeURIComponent(clientIntro + summary);
    const url = `https://wa.me/${CALCULATOR_CONFIG.contact.whatsappRaw}?text=${message}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEmailSend = () => {
    const summary = generateFormattedSummary();
    const subject = encodeURIComponent(`Project Inquiry: ${calculationResult.serviceName} (${formatPrice(calculationResult.estimatedMin)} - ${formatPrice(calculationResult.estimatedMax)})`);
    const body = encodeURIComponent(
      `Hi Moeez,\n\nI would like to discuss my project requirements based on the estimate generated on your portfolio website:\n\n` +
      `Client: ${inquiryForm.fullName || 'Client'}\n` +
      `Email: ${inquiryForm.email || 'N/A'}\n` +
      `Company: ${inquiryForm.company || 'N/A'}\n` +
      `Notes: ${inquiryForm.description || 'None'}\n\n` +
      summary
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CALCULATOR_CONFIG.contact.email)}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    window.print();
  };

  // Submit to Database & Admin Inbox
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!inquiryForm.fullName.trim()) errors.fullName = 'Please enter your full name';
    if (!inquiryForm.email.trim() || !inquiryForm.email.includes('@')) errors.email = 'Please provide a valid email';
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    const estimatedBudgetStr = `${formatPrice(calculationResult.estimatedMin)} - ${formatPrice(calculationResult.estimatedMax)}`;
    const fullInquiryDetails = `${calculationResult.summaryText}\n\nEstimated Range: ${estimatedBudgetStr}\nPreferred Contact: ${inquiryForm.preferredContact}\nDeadline: ${inquiryForm.deadline || 'Flexible'}\n\nNotes:\n${inquiryForm.description || 'None provided.'}`;

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: inquiryForm.fullName.trim(),
          email: inquiryForm.email.trim(),
          company: inquiryForm.company.trim() || undefined,
          service: calculationResult.serviceName,
          budget: estimatedBudgetStr,
          details: fullInquiryDetails,
        }),
      });
      if (res.ok) {
        setSubmissionSuccess(true);
      }
    } catch (e) {
      console.error(e);
      // fallback to WhatsApp
      handleWhatsAppSend();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-6xl bg-[#030712] border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[96vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#070b16] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600/20 to-cyan-400/20 border border-purple-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,255,0.2)]">
              {getServiceIcon(selectedService, 'w-5 h-5')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-950/70 text-purple-300 border border-purple-500/30">
                  Project Cost Calculator
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono text-cyan-400">{CALCULATOR_CONFIG.currency.code} Engine</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Calculate Your Project Investment.
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Reset all options"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer"
              aria-label="Close calculator"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-3 border-b border-slate-800/60 bg-[#050914] flex items-center justify-between gap-4 text-xs shrink-0">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2 font-semibold transition-colors cursor-pointer ${
                currentStep === 1 ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                currentStep === 1 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}>
                1
              </span>
              <span>1. Select Service</span>
            </button>

            <span className="text-slate-700">/</span>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`flex items-center gap-2 font-semibold transition-colors cursor-pointer ${
                currentStep === 2 ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                currentStep === 2 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}>
                2
              </span>
              <span>2. Customize Requirements</span>
            </button>

            <span className="text-slate-700">/</span>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className={`flex items-center gap-2 font-semibold transition-colors cursor-pointer ${
                currentStep === 3 ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                currentStep === 3 ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}>
                3
              </span>
              <span>3. Estimate & Inquire</span>
            </button>
          </div>

          {/* Quick Price Indicator in Bar */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Current Estimate:</span>
            <span className="text-cyan-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {formatPrice(calculationResult.estimatedMin)} – {formatPrice(calculationResult.estimatedMax)}
            </span>
          </div>
        </div>

        {/* Scrollable Main Area (Split: Left Form Options, Right Live Summary Card) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 bg-[#02050e]">
          
          {/* LEFT COLUMN: STEPS */}
          <div className="lg:col-span-7 xl:col-span-8 p-6 sm:p-8 space-y-6 overflow-y-auto">
            
            {/* STEP 1: SELECT SERVICE */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Step 1: Select Your Primary Service</h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Choose the core digital capability you want to develop. You can configure granular options in the next step.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(Object.keys(CALCULATOR_CONFIG.services) as ServiceId[]).map((srvKey) => {
                    const srv = CALCULATOR_CONFIG.services[srvKey];
                    const isSelected = selectedService === srvKey;

                    return (
                      <div
                        key={srvKey}
                        onClick={() => setSelectedService(srvKey)}
                        className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-gradient-to-br from-purple-950/40 via-slate-900 to-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(6,182,255,0.25)]'
                            : 'bg-[#080d19] border-slate-800 hover:border-slate-700 hover:bg-[#0c1222]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-colors ${
                            isSelected
                              ? 'bg-slate-900 border-cyan-400/80 shadow-md'
                              : 'bg-slate-900/80 border-slate-800 group-hover:border-purple-500/50'
                          }`}>
                            {getServiceIcon(srvKey, 'w-5 h-5')}
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-200 transition-colors">
                            {srv.name}
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-normal">
                            {srv.tagline}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                          <span className="text-slate-400">Baseline from:</span>
                          <span className="text-purple-300 font-semibold">{formatPrice(srv.basePrice)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400">1 of 3 Steps Completed</span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 shadow-md shadow-purple-900/30 transition-all cursor-pointer"
                  >
                    <span>Continue to Customize</span>
                    <ArrowRight className="w-4 h-4 text-cyan-200" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CUSTOMIZE REQUIREMENTS */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Step 2: Customize {CALCULATOR_CONFIG.services[selectedService].name}</h3>
                    <p className="text-xs text-slate-300">
                      Configure your project scope, design complexity, screens, and integration features.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Service</span>
                  </button>
                </div>

                {/* SERVICE A: WEBSITE OPTIONS */}
                {selectedService === 'website' && (
                  <div className="space-y-5">
                    {/* Website Type */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Website Platform & Purpose
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {CALCULATOR_CONFIG.services.website.types.map((type) => {
                          const active = webOpts.typeId === type.id;
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setWebOpts({ ...webOpts, typeId: type.id, pagesCount: Math.max(webOpts.pagesCount, type.defaultPages) })}
                              className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                                active
                                  ? 'bg-slate-900 border-cyan-400 text-white shadow-md shadow-cyan-950/30'
                                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                              }`}
                            >
                              <div className="font-bold text-white">{type.label}</div>
                              <div className="text-[10px] text-purple-300 mt-1">+{formatPrice(type.priceAdd)}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Page Count */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-slate-300">
                          Number of Major Pages / Distinct Screens
                        </label>
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          {webOpts.pagesCount} {webOpts.pagesCount === 1 ? 'Screen' : 'Screens'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={webOpts.pagesCount}
                          onChange={(e) => setWebOpts({ ...webOpts, pagesCount: Number(e.target.value) })}
                          className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                        />
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={webOpts.pagesCount}
                          onChange={(e) => setWebOpts({ ...webOpts, pagesCount: Math.max(1, Number(e.target.value)) })}
                          className="w-16 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-center text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Complexity */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Design & Technical Complexity Tier
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {CALCULATOR_CONFIG.services.website.complexity.map((comp) => {
                          const active = webOpts.complexityId === comp.id;
                          return (
                            <button
                              key={comp.id}
                              type="button"
                              onClick={() => setWebOpts({ ...webOpts, complexityId: comp.id })}
                              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                                active
                                  ? 'bg-slate-900 border-purple-400 shadow-md shadow-purple-950/40'
                                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div className="font-bold text-xs text-white">{comp.label}</div>
                              <p className="text-[11px] text-slate-400 mt-1 leading-snug">{comp.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Features (Multi-select) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Optional Functional Features & Integrations
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {CALCULATOR_CONFIG.services.website.features.map((feat) => {
                          const hasFeature = webOpts.selectedFeatures.includes(feat.id);
                          return (
                            <div
                              key={feat.id}
                              onClick={() => {
                                const next = hasFeature
                                  ? webOpts.selectedFeatures.filter((f) => f !== feat.id)
                                  : [...webOpts.selectedFeatures, feat.id];
                                setWebOpts({ ...webOpts, selectedFeatures: next });
                              }}
                              className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                                hasFeature
                                  ? 'bg-purple-950/30 border-cyan-500/60 text-white'
                                  : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:bg-slate-900'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                                  hasFeature ? 'bg-cyan-400 text-slate-950 font-bold' : 'border border-slate-700'
                                }`}>
                                  {hasFeature && <Check className="w-3 h-3 stroke-[3]" />}
                                </span>
                                <span>{feat.label}</span>
                              </div>
                              <span className="text-[11px] font-mono text-purple-300">+{formatPrice(feat.price)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Content & Urgency Split */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Content Readiness</label>
                        <select
                          value={webOpts.contentReadinessId}
                          onChange={(e) => setWebOpts({ ...webOpts, contentReadinessId: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                        >
                          {CALCULATOR_CONFIG.services.website.contentReadiness.map((c) => (
                            <option key={c.id} value={c.id}>{c.label} {c.priceAdd > 0 ? `(+${formatPrice(c.priceAdd)})` : ''}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Delivery Timeline</label>
                        <select
                          value={webOpts.urgencyId}
                          onChange={(e) => setWebOpts({ ...webOpts, urgencyId: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                        >
                          {CALCULATOR_CONFIG.services.website.urgency.map((u) => (
                            <option key={u.id} value={u.id}>{u.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* SERVICE B: AI VOICE AGENT OPTIONS */}
                {selectedService === 'voiceAgent' && (
                  <div className="space-y-5">
                    {/* Agent Direction */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Agent Direction</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {CALCULATOR_CONFIG.services.voiceAgent.agentTypes.map((ag) => {
                          const active = voiceOpts.agentTypeId === ag.id;
                          return (
                            <button
                              key={ag.id}
                              type="button"
                              onClick={() => setVoiceOpts({ ...voiceOpts, agentTypeId: ag.id })}
                              className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                                active ? 'bg-slate-900 border-cyan-400 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400'
                              }`}
                            >
                              <div className="font-bold text-white">{ag.label}</div>
                              <div className="text-[10px] text-purple-300 mt-1">+{formatPrice(ag.priceAdd)}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Main Purpose */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Main Operational Purpose</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {CALCULATOR_CONFIG.services.voiceAgent.purposes.map((p) => {
                          const active = voiceOpts.purposeId === p.id;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setVoiceOpts({ ...voiceOpts, purposeId: p.id })}
                              className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                                active ? 'bg-slate-900 border-purple-400 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400'
                              }`}
                            >
                              <div className="font-bold text-white">{p.label}</div>
                              <div className="text-[10px] text-cyan-300 mt-0.5">+{formatPrice(p.priceAdd)}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Integrations Multi-select */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Integration Needs</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {CALCULATOR_CONFIG.services.voiceAgent.integrations.map((integ) => {
                          const hasInteg = voiceOpts.selectedIntegrations.includes(integ.id);
                          return (
                            <div
                              key={integ.id}
                              onClick={() => {
                                const next = hasInteg
                                  ? voiceOpts.selectedIntegrations.filter((i) => i !== integ.id)
                                  : [...voiceOpts.selectedIntegrations, integ.id];
                                setVoiceOpts({ ...voiceOpts, selectedIntegrations: next });
                              }}
                              className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer ${
                                hasInteg ? 'bg-purple-950/40 border-cyan-400 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                                  hasInteg ? 'bg-cyan-400 text-slate-950 font-bold' : 'border border-slate-700'
                                }`}>
                                  {hasInteg && <Check className="w-3 h-3 stroke-[3]" />}
                                </span>
                                <span>{integ.label}</span>
                              </div>
                              <span className="text-[11px] font-mono text-purple-300">+{formatPrice(integ.price)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Call Volume & Complexity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Estimated Call Volume</label>
                        <select
                          value={voiceOpts.callVolumeId}
                          onChange={(e) => setVoiceOpts({ ...voiceOpts, callVolumeId: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                        >
                          {CALCULATOR_CONFIG.services.voiceAgent.callVolume.map((v) => (
                            <option key={v.id} value={v.id}>{v.label} {v.priceAdd > 0 ? `(+${formatPrice(v.priceAdd)})` : ''}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Conversational Complexity</label>
                        <select
                          value={voiceOpts.complexityId}
                          onChange={(e) => setVoiceOpts({ ...voiceOpts, complexityId: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                        >
                          {CALCULATOR_CONFIG.services.voiceAgent.complexity.map((c) => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Telephony note */}
                    <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-slate-300 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <p>{CALCULATOR_CONFIG.services.voiceAgent.thirdPartyNotice}</p>
                    </div>
                  </div>
                )}

                {/* SERVICE C: AI VIDEO ADS */}
                {selectedService === 'videoAds' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Video Style</label>
                        <select
                          value={videoOpts.styleId}
                          onChange={(e) => setVideoOpts({ ...videoOpts, styleId: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                        >
                          {CALCULATOR_CONFIG.services.videoAds.styles.map((s) => (
                            <option key={s.id} value={s.id}>{s.label} {s.priceAdd > 0 ? `(+${formatPrice(s.priceAdd)})` : ''}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Duration</label>
                        <select
                          value={videoOpts.durationId}
                          onChange={(e) => setVideoOpts({ ...videoOpts, durationId: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                        >
                          {CALCULATOR_CONFIG.services.videoAds.durations.map((d) => (
                            <option key={d.id} value={d.id}>{d.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-slate-300">Number of Video Ads</label>
                        <span className="text-xs font-mono font-bold text-cyan-400">{videoOpts.quantity} {videoOpts.quantity === 1 ? 'Video' : 'Videos'}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={videoOpts.quantity}
                        onChange={(e) => setVideoOpts({ ...videoOpts, quantity: Number(e.target.value) })}
                        className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Visual Tier</label>
                        <select
                          value={videoOpts.complexityId}
                          onChange={(e) => setVideoOpts({ ...videoOpts, complexityId: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                        >
                          {CALCULATOR_CONFIG.services.videoAds.complexity.map((c) => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Client Asset Readiness</label>
                        <select
                          value={videoOpts.clientAssetId}
                          onChange={(e) => setVideoOpts({ ...videoOpts, clientAssetId: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                        >
                          {CALCULATOR_CONFIG.services.videoAds.clientAssets.map((a) => (
                            <option key={a.id} value={a.id}>{a.label} {a.priceAdd > 0 ? `(+${formatPrice(a.priceAdd)})` : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* SERVICE D: GRAPHIC DESIGN */}
                {selectedService === 'graphicDesign' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Design Deliverable Type</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {CALCULATOR_CONFIG.services.graphicDesign.designTypes.map((d) => {
                          const active = graphicOpts.designTypeId === d.id;
                          return (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => setGraphicOpts({ ...graphicOpts, designTypeId: d.id, quantity: d.defaultQty })}
                              className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                                active ? 'bg-slate-900 border-cyan-400 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400'
                              }`}
                            >
                              <div className="font-bold text-white">{d.label}</div>
                              <div className="text-[10px] text-purple-300 mt-1">Base: {formatPrice(d.priceAdd)}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-slate-300">Deliverable Quantity</label>
                        <span className="text-xs font-mono font-bold text-cyan-400">{graphicOpts.quantity} Items</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="25"
                        value={graphicOpts.quantity}
                        onChange={(e) => setGraphicOpts({ ...graphicOpts, quantity: Number(e.target.value) })}
                        className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Art Direction & Detail Tier</label>
                        <select
                          value={graphicOpts.complexityId}
                          onChange={(e) => setGraphicOpts({ ...graphicOpts, complexityId: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                        >
                          {CALCULATOR_CONFIG.services.graphicDesign.complexity.map((c) => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Brand Asset Availability</label>
                        <select
                          value={graphicOpts.brandAssetId}
                          onChange={(e) => setGraphicOpts({ ...graphicOpts, brandAssetId: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                        >
                          {CALCULATOR_CONFIG.services.graphicDesign.brandAssets.map((b) => (
                            <option key={b.id} value={b.id}>{b.label} {b.priceAdd > 0 ? `(+${formatPrice(b.priceAdd)})` : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* SERVICE E: BLENDER 3D */}
                {selectedService === 'blender3d' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Output & Deliverable Format</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {CALCULATOR_CONFIG.services.blender3d.outputTypes.map((out) => {
                          const active = blenderOpts.outputTypeId === out.id;
                          return (
                            <button
                              key={out.id}
                              type="button"
                              onClick={() => setBlenderOpts({ ...blenderOpts, outputTypeId: out.id })}
                              className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                                active ? 'bg-slate-900 border-cyan-400 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400'
                              }`}
                            >
                              <div className="font-bold text-white">{out.label}</div>
                              <div className="text-[10px] text-purple-300 mt-1">+{formatPrice(out.priceAdd)}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">3D Model Availability</label>
                        <select
                          value={blenderOpts.productModelId}
                          onChange={(e) => setBlenderOpts({ ...blenderOpts, productModelId: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                        >
                          {CALCULATOR_CONFIG.services.blender3d.productModel.map((m) => (
                            <option key={m.id} value={m.id}>{m.label} {m.priceAdd > 0 ? `(+${formatPrice(m.priceAdd)})` : ''}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Lighting & Shading Tier</label>
                        <select
                          value={blenderOpts.complexityId}
                          onChange={(e) => setBlenderOpts({ ...blenderOpts, complexityId: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                        >
                          {CALCULATOR_CONFIG.services.blender3d.complexity.map((c) => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* SERVICE F: AUTOMATION */}
                {selectedService === 'automation' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Automation Focus</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {CALCULATOR_CONFIG.services.automation.automationTypes.map((auto) => {
                          const active = autoOpts.automationTypeId === auto.id;
                          return (
                            <button
                              key={auto.id}
                              type="button"
                              onClick={() => setAutoOpts({ ...autoOpts, automationTypeId: auto.id })}
                              className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                                active ? 'bg-slate-900 border-cyan-400 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400'
                              }`}
                            >
                              <div className="font-bold text-white">{auto.label}</div>
                              <div className="text-[10px] text-purple-300 mt-0.5">+{formatPrice(auto.priceAdd)}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-slate-300">Estimated Workflow Steps & Logic Nodes</label>
                        <span className="text-xs font-mono font-bold text-cyan-400">{autoOpts.stepsCount} Steps</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="12"
                        value={autoOpts.stepsCount}
                        onChange={(e) => setAutoOpts({ ...autoOpts, stepsCount: Number(e.target.value) })}
                        className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Platforms to Connect</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {CALCULATOR_CONFIG.services.automation.integrations.map((integ) => {
                          const hasInteg = autoOpts.selectedIntegrations.includes(integ.id);
                          return (
                            <div
                              key={integ.id}
                              onClick={() => {
                                const next = hasInteg
                                  ? autoOpts.selectedIntegrations.filter((i) => i !== integ.id)
                                  : [...autoOpts.selectedIntegrations, integ.id];
                                setAutoOpts({ ...autoOpts, selectedIntegrations: next });
                              }}
                              className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer ${
                                hasInteg ? 'bg-purple-950/40 border-cyan-400 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                                  hasInteg ? 'bg-cyan-400 text-slate-950 font-bold' : 'border border-slate-700'
                                }`}>
                                  {hasInteg && <Check className="w-3 h-3 stroke-[3]" />}
                                </span>
                                <span>{integ.label}</span>
                              </div>
                              <span className="text-[11px] font-mono text-purple-300">+{formatPrice(integ.price)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 Bottom Navigation */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 shadow-md shadow-purple-900/30 transition-all cursor-pointer"
                  >
                    <span>View Estimate & Inquire</span>
                    <ArrowRight className="w-4 h-4 text-cyan-200" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SUBMIT INQUIRY FORM */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Step 3: Submit Project Inquiry & Estimate</h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Send your customized requirements directly to Moeez via WhatsApp, Email, or through our direct database portal.
                  </p>
                </div>

                {submissionSuccess ? (
                  <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-white">Inquiry Successfully Transmitted!</h4>
                    <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                      Your estimate and requirements have been received in Moeez's Admin Panel. A private messaging thread has been logged.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleWhatsAppSend}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Open WhatsApp Chat</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyEstimate}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isCopied ? 'Copied!' : 'Copy Summary'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitInquiry} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Full Name <span className="text-purple-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={inquiryForm.fullName}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, fullName: e.target.value })}
                          placeholder="e.g. Alex Morgan"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                        />
                        {formErrors.fullName && <p className="text-[11px] text-red-400 mt-1">{formErrors.fullName}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Email Address <span className="text-purple-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={inquiryForm.email}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                          placeholder="alex@company.com"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                        />
                        {formErrors.email && <p className="text-[11px] text-red-400 mt-1">{formErrors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Organization (Optional)</label>
                        <input
                          type="text"
                          value={inquiryForm.company}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, company: e.target.value })}
                          placeholder="Your brand or agency"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Contact Channel</label>
                        <div className="flex items-center gap-2">
                          {(['WhatsApp', 'Email', 'Phone'] as const).map((ch) => (
                            <button
                              key={ch}
                              type="button"
                              onClick={() => setInquiryForm({ ...inquiryForm, preferredContact: ch })}
                              className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                                inquiryForm.preferredContact === ch
                                  ? 'bg-purple-900/40 border-cyan-400 text-white'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {ch}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Project Notes / Specifics (Optional)</label>
                      <textarea
                        rows={2}
                        value={inquiryForm.description}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, description: e.target.value })}
                        placeholder="Add links, references, specific timeline deadlines, or custom feature notes..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
                      />
                    </div>

                    {/* Action Buttons Row */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-5 rounded-xl text-xs uppercase tracking-wider font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 hover:opacity-95 shadow-md shadow-purple-900/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-4 h-4 text-cyan-200" />
                        <span>{isSubmitting ? 'Transmitting...' : 'Send Inquiry & Lock Estimate'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleWhatsAppSend}
                        className="py-3 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-500/40 transition-colors flex items-center gap-2 cursor-pointer"
                        title="Open directly in WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleEmailSend}
                        className="py-3 px-4 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                        title="Send via Email Client"
                      >
                        <Mail className="w-4 h-4 text-purple-400" />
                        <span>Email</span>
                      </button>
                    </div>
                  </form>
                )}

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Requirements</span>
                  </button>

                  <div className="flex items-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={handleCopyEstimate}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: STICKY LIVE ESTIMATE SUMMARY PANEL */}
          <div className="lg:col-span-5 xl:col-span-4 p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#060a14] flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Estimate Summary</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                  Real-Time Engine
                </span>
              </div>

              {/* Range Big Display */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900/90 to-cyan-950/30 border border-purple-500/30 shadow-inner">
                <span className="text-[11px] font-mono text-purple-300 block uppercase mb-1">Estimated Investment Range</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  <span className="bg-gradient-to-r from-purple-300 via-white to-cyan-300 bg-clip-text text-transparent">
                    {formatPrice(calculationResult.estimatedMin)} – {formatPrice(calculationResult.estimatedMax)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-purple-500/20 text-[11px] text-slate-400">
                  <span>Currency: <strong className="text-slate-200">{calculationResult.currency}</strong></span>
                  <span>Complexity: <strong className="text-cyan-300">{calculationResult.complexityLabel}</strong></span>
                </div>
              </div>

              {/* Itemized Breakdown List */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Itemized Breakdown</span>
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 divide-y divide-slate-800/40">
                  {calculationResult.breakdown.map((item, idx) => (
                    <div key={idx} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs">
                      <span className="text-slate-300 truncate max-w-[70%]">{item.label}</span>
                      <span className="font-mono text-purple-300 shrink-0 font-medium">{formatPrice(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preliminary Notice Warning / Badge */}
              {CALCULATOR_CONFIG.isPreliminaryEstimate && (
                <div className="p-3.5 rounded-xl bg-purple-950/25 border border-purple-500/30 text-[11px] text-slate-400 leading-relaxed">
                  <span className="text-purple-300 font-semibold block mb-0.5">Preliminary Pricing Notice:</span>
                  {CALCULATOR_CONFIG.preliminaryNotice}
                </div>
              )}

              {/* Third party notices if any */}
              {calculationResult.thirdPartyNotice && (
                <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-[11px] text-slate-400 leading-relaxed">
                  <span className="text-cyan-300 font-semibold block mb-0.5">Third-Party Pass-Through:</span>
                  {calculationResult.thirdPartyNotice}
                </div>
              )}
            </div>

            {/* Quick Actions at bottom of Summary */}
            <div className="pt-6 mt-6 border-t border-slate-800 space-y-3">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="w-full py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Start My Project</span>
                  <ArrowRight className="w-4 h-4 text-cyan-200" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-500/40 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyEstimate}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}

              <p className="text-[10px] text-center text-slate-500">
                Guaranteed response within 24 business hours from Moeez
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
