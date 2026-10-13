import React, { useState, useEffect } from 'react';
import { X, ExternalLink, MessageSquare, Play, Pause, Volume2, RotateCw, Sparkles, CheckCircle2, ChevronRight, Send, ArrowRight } from 'lucide-react';
import { Project } from '../data/projectsData';

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
  const [activeTab, setActiveTab] = useState<'preview' | 'interactive-demo' | 'specs'>('interactive-demo');
  
  // Interactive Simulator States
  // 1. Voice Agent Simulator
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [voiceMessages, setVoiceMessages] = useState<Array<{ sender: 'agent' | 'user'; text: string; time: string }>>([
    { sender: 'agent', text: 'Hello! You have reached Aura Concierge. Are you looking to schedule a consultation or ask about our services?', time: '0:01' }
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 2. Gym Website Simulator
  const [selectedPlan, setSelectedPlan] = useState<'Silver' | 'Gold' | 'Platinum'>('Gold');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [passClaimed, setPassClaimed] = useState(false);

  // 3. 3D Product Simulator
  const [lightingPreset, setLightingPreset] = useState<'neon' | 'studio' | 'stealth'>('neon');
  const [rotationAngle, setRotationAngle] = useState(0);

  // 4. Video Ad Simulator
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [videoProgress, setVideoProgress] = useState(35);

  // 5. Workflow Simulator
  const [simulatedLeads, setSimulatedLeads] = useState<Array<{ name: string; intent: string; score: number; status: string }>>([
    { name: 'Apex Tech Inc.', intent: 'AI Voice Calling Setup', score: 96, status: 'Routed to Sales' },
    { name: 'Vanguard Fitness', intent: 'Custom Web Platform', score: 92, status: 'Follow-up Scheduled' }
  ]);
  const [isProcessingLead, setIsProcessingLead] = useState(false);

  // Timer for Voice Agent call duration
  useEffect(() => {
    let interval: any;
    if (callActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [callActive]);

  // Handle ESC key to close modal
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

  const handleVoiceUserAction = (text: string, response: string) => {
    if (!callActive) setCallActive(true);
    const newMsgTime = `0:${callDuration < 10 ? '0' + callDuration : callDuration}`;
    setVoiceMessages((prev) => [
      ...prev,
      { sender: 'user', text, time: newMsgTime }
    ]);

    setIsSpeaking(true);
    setTimeout(() => {
      setVoiceMessages((prev) => [
        ...prev,
        { sender: 'agent', text: response, time: `0:${callDuration + 2 < 10 ? '0' + (callDuration + 2) : callDuration + 2}` }
      ]);
      setIsSpeaking(false);
      
      // Optional subtle browser speech synthesis if available and user engaged
      if ('speechSynthesis' in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(response);
          utterance.rate = 1.05;
          utterance.pitch = 1.1;
          window.speechSynthesis.speak(utterance);
        } catch {
          // ignore synthesis if blocked
        }
      }
    }, 900);
  };

  const handleSimulateNewLead = () => {
    setIsProcessingLead(true);
    setTimeout(() => {
      const sampleNames = ['Krypton Logistics', 'Aura Health Labs', 'Prism Retail Group', 'Zenith Capital'];
      const sampleIntents = ['Blender 3D Commercial', 'AI Automation Workflow', 'E-commerce Redesign'];
      const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const randomIntent = sampleIntents[Math.floor(Math.random() * sampleIntents.length)];
      const randomScore = Math.floor(Math.random() * 15) + 85;

      setSimulatedLeads((prev) => [
        { name: randomName, intent: randomIntent, score: randomScore, status: 'Enriched & Dispatched' },
        ...prev
      ]);
      setIsProcessingLead(false);
    }, 700);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
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
            {/* Status clearly rendered as clean text without pill encapsulation */}
            <span className="text-xs font-medium text-purple-300">
              {project.status}
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
          <div>
            <h2 id="modal-project-title" className="text-2xl sm:text-3xl font-extrabold text-white">
              {project.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-1 font-normal">
              {project.tagline}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800 w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('interactive-demo')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'interactive-demo'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Live Demo
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Visual Showcase
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'specs'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Specs & Capabilities
            </button>
          </div>

          {/* TAB 1: INTERACTIVE LIVE DEMO */}
          {activeTab === 'interactive-demo' && (
            <div className="p-5 rounded-2xl bg-[#060a14] border border-slate-800/90">
              
              {/* Demo 1: Voice Calling Agent */}
              {project.demoType === 'voice-agent' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${callActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                      <span className="text-sm font-semibold text-white">
                        {callActive ? `Active Call (${callDuration}s)` : 'Aura Voice Demo (Standby)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCallActive(!callActive)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        callActive
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                      }`}
                    >
                      {callActive ? 'End Call' : 'Start Demo Call'}
                    </button>
                  </div>

                  {/* Audio Waveform Simulator */}
                  <div className="relative h-24 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-center overflow-hidden px-4">
                    <div className="flex items-center gap-1.5 h-16 w-full justify-center">
                      {[40, 65, 80, 45, 90, 70, 35, 85, 95, 60, 40, 75, 50, 85, 30, 90, 65, 45].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            height: callActive || isSpeaking ? `${Math.min(100, Math.max(15, h * (isSpeaking ? 1.2 : 0.7)))}%` : '15%',
                            transition: 'height 0.15s ease'
                          }}
                          className={`w-1.5 rounded-full ${
                            i % 2 === 0 ? 'bg-cyan-400' : 'bg-purple-500'
                          } ${callActive ? 'opacity-90' : 'opacity-30'}`}
                        />
                      ))}
                    </div>
                    <div className="absolute top-2 left-3 text-[10px] font-mono text-slate-400">
                      TELEMETRY: {callActive ? (isSpeaking ? 'AURA_SPEAKING (sub-450ms)' : 'LISTENING_INPUT') : 'IDLE'}
                    </div>
                  </div>

                  {/* Transcript Feed */}
                  <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-slate-900/40 rounded-xl border border-slate-800/60">
                    {voiceMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`text-xs p-2.5 rounded-lg ${
                          msg.sender === 'agent'
                            ? 'bg-purple-950/30 border border-purple-800/30 text-purple-200'
                            : 'bg-cyan-950/30 border border-cyan-800/30 text-cyan-200 ml-4'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                          <span>{msg.sender === 'agent' ? 'Aura (AI Voice)' : 'You (Caller)'}</span>
                          <span>{msg.time}</span>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Inbound Caller Options */}
                  <div className="pt-2">
                    <p className="text-xs text-slate-400 mb-2">Simulate caller inquiry:</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleVoiceUserAction(
                          'Can you book me for an onboarding call tomorrow at 3 PM?',
                          'Certainly! I found an available slot for tomorrow at 3:00 PM EST. I have reserved the calendar invite for you.'
                        )}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 cursor-pointer"
                      >
                        "Book onboarding call tomorrow at 3 PM"
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVoiceUserAction(
                          'What is included in the AI automation package?',
                          'The package includes multi-platform webhook integration, automatic lead scoring, CRM syncing, and personalized notifications.'
                        )}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 cursor-pointer"
                      >
                        "What is included in the automation package?"
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Demo 2: Gym Website Simulator */}
              {project.demoType === 'website' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Velocity Club Membership Simulator</h4>
                      <p className="text-xs text-slate-400">Interactive pricing calculator & tier selection</p>
                    </div>
                    <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                      <button
                        type="button"
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-2.5 py-1 rounded cursor-pointer ${billingCycle === 'monthly' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingCycle('annual')}
                        className={`px-2.5 py-1 rounded cursor-pointer ${billingCycle === 'annual' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
                      >
                        Annual (-20%)
                      </button>
                    </div>
                  </div>

                  {/* Tier Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { name: 'Silver', price: billingCycle === 'monthly' ? 79 : 63, perks: '10 Gym Passes · Studio Access' },
                      { name: 'Gold', price: billingCycle === 'monthly' ? 129 : 103, perks: 'Unlimited Gym · All Classes · Locker' },
                      { name: 'Platinum', price: billingCycle === 'monthly' ? 199 : 159, perks: 'All Access · 4x Personal Training · Spa' },
                    ].map((tier) => (
                      <div
                        key={tier.name}
                        onClick={() => setSelectedPlan(tier.name as any)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedPlan === tier.name
                            ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-900/30'
                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-white">{tier.name}</span>
                          {selectedPlan === tier.name && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                        </div>
                        <div className="text-2xl font-extrabold text-white font-mono">
                          ${tier.price}<span className="text-xs font-normal text-slate-400">/mo</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2">{tier.perks}</p>
                      </div>
                    ))}
                  </div>

                  {/* Complimentary Day Pass Trial Claim */}
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Claim Complimentary 1-Day Trial Pass</p>
                      <p className="text-[11px] text-slate-400">Selected tier: {selectedPlan} Access</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPassClaimed(true)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-cyan-500 text-white cursor-pointer hover:opacity-90"
                    >
                      {passClaimed ? 'Pass Sent To Email!' : 'Get Free Pass'}
                    </button>
                  </div>
                </div>
              )}

              {/* Demo 3: 3D Product Simulator */}
              {project.demoType === '3d-product' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Blender Lighting & Material Inspector</h4>
                      <p className="text-xs text-slate-400">Examine photorealistic dark titanium shaders & illumination</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Preset:</span>
                      {(['neon', 'studio', 'stealth'] as const).map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setLightingPreset(preset)}
                          className={`px-2.5 py-1 rounded text-xs capitalize cursor-pointer ${
                            lightingPreset === preset ? 'bg-cyan-500 text-black font-semibold' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual container with responsive lighting simulation */}
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-black flex items-center justify-center border border-slate-800">
                    <img
                      src={project.image}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      style={{
                        transform: `scale(1.02) rotate(${rotationAngle}deg)`,
                        filter: lightingPreset === 'stealth'
                          ? 'grayscale(0.7) contrast(1.2)'
                          : lightingPreset === 'studio'
                          ? 'brightness(1.1) contrast(1.05)'
                          : 'contrast(1.15) hue-rotate(5deg)'
                      }}
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-cyan-300">
                      SHADER: Cycles 3.6 Micro-Facet Metal · IOR 2.45
                    </div>
                  </div>

                  {/* Angle Rotation Slider */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Rotate View:</span>
                    <input
                      type="range"
                      min="-15"
                      max="15"
                      value={rotationAngle}
                      onChange={(e) => setRotationAngle(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => setRotationAngle(0)}
                      className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                      title="Reset angle"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Demo 4: Video Ad Simulator */}
              {project.demoType === 'video-ad' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Commercial Video Reel Preview</h4>
                      <p className="text-xs text-slate-400">30s AI-Assisted High-Impact Commercial Cut</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                      <span>4K 60FPS</span>
                      <span>·</span>
                      <span>2.39:1 ANAMORPHIC</span>
                    </div>
                  </div>

                  <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-slate-800 group">
                    <img
                      src={project.image}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-end p-4">
                      {/* Playback Controls */}
                      <div className="flex items-center justify-between text-white text-xs mb-2">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                            className="p-2 rounded-full bg-purple-600/80 hover:bg-purple-600 text-white cursor-pointer"
                          >
                            {isPlayingVideo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                          </button>
                          <span className="font-mono">00:11 / 00:30</span>
                        </div>
                        <Volume2 className="w-4 h-4 text-slate-300" />
                      </div>
                      
                      {/* Progress Bar */}
                      <div 
                        className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden cursor-pointer"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const pct = ((e.clientX - rect.left) / rect.width) * 100;
                          setVideoProgress(Math.round(pct));
                        }}
                      >
                        <div 
                          style={{ width: `${videoProgress}%` }}
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Scene Beats Timeline */}
                  <div className="grid grid-cols-4 gap-2 text-[11px] text-center">
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-purple-400 font-mono block">0:00 - 0:08</span>
                      <span className="text-slate-300">Hero Hook</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg border border-cyan-500/30">
                      <span className="text-cyan-400 font-mono block">0:08 - 0:16</span>
                      <span className="text-slate-200 font-medium">Motion Sprint</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-purple-400 font-mono block">0:16 - 0:24</span>
                      <span className="text-slate-300">Specs Beat</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-purple-400 font-mono block">0:24 - 0:30</span>
                      <span className="text-slate-300">Brand Call</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Demo 5: Workflow Automation Simulator */}
              {project.demoType === 'workflow-app' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">FlowSync Autonomous Pipeline Simulator</h4>
                      <p className="text-xs text-slate-400">Trigger simulated lead to watch classification & dispatch</p>
                    </div>
                    <button
                      type="button"
                      disabled={isProcessingLead}
                      onClick={handleSimulateNewLead}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-cyan-500 text-white cursor-pointer hover:opacity-90 disabled:opacity-50"
                    >
                      {isProcessingLead ? 'Classifying Lead...' : '+ Ingest Test Lead'}
                    </button>
                  </div>

                  {/* Stream List */}
                  <div className="space-y-2">
                    {simulatedLeads.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white">{item.name}</div>
                          <div className="text-[11px] text-slate-400">{item.intent}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">AI SCORE</span>
                            <span className="font-mono font-bold text-cyan-400">{item.score}/100</span>
                          </div>
                          <span className="px-2.5 py-1 bg-purple-950/50 border border-purple-800/40 text-purple-300 rounded text-[11px]">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Demo 6: Graphic Design Showcase */}
              {project.demoType === 'graphic-design' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Visual Design System & Brand Asset Grid</h4>
                    <p className="text-xs text-slate-400">High-resolution brand guidelines, ad banners, and layouts</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                      <div className="h-16 rounded bg-purple-950/40 border border-purple-500/20 flex items-center justify-center font-bold text-purple-300 text-sm mb-2">
                        DISPLAY ADS
                      </div>
                      <span className="text-[11px] text-slate-400">1080x1920 & 1200x628</span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                      <div className="h-16 rounded bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center font-bold text-cyan-300 text-sm mb-2">
                        TYPOGRAPHY
                      </div>
                      <span className="text-[11px] text-slate-400">Geometric Sans Scale</span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                      <div className="h-16 rounded bg-slate-800 flex items-center justify-center font-bold text-white text-sm mb-2">
                        PALETTE
                      </div>
                      <span className="text-[11px] text-slate-400">Cyan / Purple / Void</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: VISUAL SHOWCASE */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-h-[420px] flex items-center justify-center">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover max-h-[420px]"
                />
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {project.fullDescription}
              </p>
            </div>
          )}

          {/* TAB 3: SPECS & CAPABILITIES */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white mb-3">Key Capabilities</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.keyFeatures.map((feat, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-2">Technologies & Architecture</h4>
                <div className="flex flex-wrap gap-2 text-xs text-slate-400 font-mono">
                  {project.tools.map((tool, idx) => (
                    <span key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-slate-800 bg-[#0c1222]">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <span>Ready to explore a custom build like this?</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer w-full sm:w-auto"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onDiscussProject(project.title);
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 shadow-md shadow-purple-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discuss Similar Project</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
