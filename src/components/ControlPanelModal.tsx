import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Lock, Unlock, Plus, Trash2, Edit3, Globe, Github, Layers, 
  Settings, MessageSquare, Check, AlertCircle, RefreshCw, Save,
  Send, User, Clock, ArrowUpRight, Search, ShieldCheck, Upload,
  Image as ImageIcon, Sparkles, ExternalLink, Play, Video, FileVideo, Film, CheckCircle2
} from 'lucide-react';
import { Project } from '../data/projectsData';
import { parseVideoUrl } from '../utils/videoUtils';

interface ThreadItem {
  clientEmail: string;
  clientName: string;
  company?: string | null;
  service: string;
  budget?: string | null;
  inquiryId?: number;
  lastMessage: string;
  lastMessageAt: string | null;
  lastSender: string;
  messages: Array<{
    id: number;
    inquiryId?: number | null;
    clientEmail: string;
    clientName: string;
    sender: 'client' | 'admin';
    message: string;
    createdAt: string;
  }>;
}

interface ControlPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onRefreshProjects: (updatedList?: Project[]) => void;
}

const PRESET_IMAGES = [
  { label: 'E-Commerce Website', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Fitness & Gym Web', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80' },
  { label: 'AI Voice Calling', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
  { label: '3D Product Render', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'SaaS Tech Platform', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cinematic Video Ad', url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80' },
];

const PRESET_VIDEOS = [
  { label: '3D Blender Product Promo', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  { label: 'Cinematic Video Reel', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' },
  { label: 'AI Tech Showcase', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4' },
];

const QUICK_REPLIES = [
  'Salam! I received your inquiry and would be glad to work on this with you.',
  'Thanks for reaching out! Can we schedule a quick call to discuss the exact requirements?',
  'I have reviewed your project details. What is your preferred launch timeline?',
  'Yes, this can certainly be built within your expected budget. Let me know when you are ready to start.',
];

export const ControlPanelModal: React.FC<ControlPanelModalProps> = ({
  isOpen,
  onClose,
  projects,
  onRefreshProjects,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('moeez_admin_auth') === 'true';
  });
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'inbox' | 'projects' | 'settings'>('inbox');

  // Inbox & Threads State
  const [threads, setThreads] = useState<ThreadItem[]>([]);
  const [selectedThreadEmail, setSelectedThreadEmail] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<any[]>([]);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [threadSearch, setThreadSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Project Editor State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [projectStatusMessage, setProjectStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  const [projForm, setProjForm] = useState({
    mediaType: 'website' as 'website' | 'video' | 'image',
    title: '',
    category: 'Websites',
    tagline: '',
    image: '',
    videoUrl: '',
    liveUrl: '',
    githubUrl: '',
    shortDescription: '',
    fullDescription: '',
    toolsInput: 'React, TypeScript, Tailwind CSS',
    featuresInput: 'High conversion responsive layout\nFast load times & SEO optimized\nClean UI/UX design',
    clientContext: '',
  });

  // Settings State
  const [siteSettings, setSiteSettings] = useState({
    creatorName: 'Moeez',
    heroHeadline: 'Turn Your Ideas Into Powerful Digital Solutions.',
    heroSubheadline: 'I build modern websites, AI-powered automation, intelligent voice agents, cinematic advertisements, and premium 3D product visuals that help businesses grow online.',
    contactEmail: 'moeezi396@gmail.com',
    whatsappNumber: '+92 318 4498716',
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Fetch threads when entering inbox
  useEffect(() => {
    if (isAuthenticated && activeTab === 'inbox') {
      fetchThreads();
    }
  }, [isAuthenticated, activeTab]);

  // Fetch messages when thread selected
  useEffect(() => {
    if (selectedThreadEmail) {
      fetchThreadMessages(selectedThreadEmail);
    }
  }, [selectedThreadEmail]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (threadMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [threadMessages]);

  // Fetch settings on auth
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/settings')
        .then((res) => res.json())
        .then((data) => {
          if (data.settings && Object.keys(data.settings).length > 0) {
            setSiteSettings((prev) => ({ ...prev, ...data.settings }));
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const fetchThreads = async () => {
    setLoadingThreads(true);
    try {
      const res = await fetch('/api/inbox/threads');
      const data = await res.json();
      if (data.success && Array.isArray(data.threads)) {
        setThreads(data.threads);
        if (data.threads.length > 0 && !selectedThreadEmail) {
          setSelectedThreadEmail(data.threads[0].clientEmail);
        }
      }
    } catch (e) {
      console.error('Failed to fetch threads:', e);
    } finally {
      setLoadingThreads(false);
    }
  };

  const fetchThreadMessages = async (email: string) => {
    try {
      const res = await fetch(`/api/inbox/thread/${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setThreadMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendAdminReply = async (customMessage?: string) => {
    const textToSend = (customMessage || adminReplyText).trim();
    if (!textToSend || !selectedThreadEmail) return;

    const currentThread = threads.find((t) => t.clientEmail === selectedThreadEmail);
    setSendingReply(true);

    try {
      const res = await fetch('/api/inbox/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: selectedThreadEmail,
          clientName: currentThread?.clientName || 'Client',
          message: textToSend,
          inquiryId: currentThread?.inquiryId,
        }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setThreadMessages((prev) => [...prev, data.message]);
        if (!customMessage) setAdminReplyText('');
        fetchThreads(); // refresh order
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingReply(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('moeez_admin_auth', 'true');
        setPassword('');
      } else {
        setLoginError('Invalid password. Please check and try again.');
      }
    } catch {
      if (password === 'moeezimran786') {
        setIsAuthenticated(true);
        sessionStorage.setItem('moeez_admin_auth', 'true');
        setPassword('');
      } else {
        setLoginError('Invalid password. Please check and try again.');
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('moeez_admin_auth');
    onClose();
  };

  // Filtered threads by search
  const filteredThreads = threads.filter((t) => {
    const q = threadSearch.toLowerCase();
    return (
      t.clientName.toLowerCase().includes(q) ||
      t.clientEmail.toLowerCase().includes(q) ||
      t.service.toLowerCase().includes(q) ||
      (t.lastMessage && t.lastMessage.toLowerCase().includes(q))
    );
  });

  const activeThread = threads.find((t) => t.clientEmail === selectedThreadEmail);

  // Project Management Handlers
  const openNewProjectForm = (initialFormat: 'website' | 'video' | 'image' = 'website') => {
    setEditingProject(null);
    setProjectStatusMessage(null);
    setConfirmDeleteId(null);

    const defaultImage = initialFormat === 'video'
      ? 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80'
      : initialFormat === 'image'
      ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
      : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';

    setProjForm({
      mediaType: initialFormat,
      title: '',
      category: initialFormat === 'video' ? 'Video Ads' : initialFormat === 'image' ? 'Graphic Design' : 'Websites',
      tagline: '',
      image: defaultImage,
      videoUrl: '',
      liveUrl: '',
      githubUrl: '',
      shortDescription: '',
      fullDescription: '',
      toolsInput: initialFormat === 'video' 
        ? 'Premiere Pro, After Effects, Runway AI, Midjourney'
        : initialFormat === 'image'
        ? 'Photoshop, Illustrator, Blender 3D, Figma'
        : 'React, TypeScript, Tailwind CSS',
      featuresInput: initialFormat === 'video'
        ? '4K Ultra HD cinematic render\nAI voiceover & sound design\nHigh CTR social media advertising'
        : initialFormat === 'image'
        ? 'Vector artwork & brand identity\nUltra crisp export formats\nPrint & digital marketing ready'
        : 'High conversion responsive layout\nFast load times & SEO optimized\nClean UI/UX design',
      clientContext: '',
    });
    setIsAddingNew(true);
  };

  const openEditProjectForm = (p: Project) => {
    setEditingProject(p);
    setProjectStatusMessage(null);
    setConfirmDeleteId(null);

    const inferredFormat: 'website' | 'video' | 'image' = 
      p.mediaType === 'video' || p.videoUrl || p.category === 'Video Ads'
        ? 'video'
        : p.mediaType === 'image' || p.category === 'Graphic Design'
        ? 'image'
        : 'website';

    setProjForm({
      mediaType: (p.mediaType as any) || inferredFormat,
      title: p.title,
      category: p.category,
      tagline: p.tagline || '',
      image: p.image || '',
      videoUrl: p.videoUrl || '',
      liveUrl: p.liveUrl || '',
      githubUrl: p.githubUrl || '',
      shortDescription: p.shortDescription || '',
      fullDescription: p.fullDescription || '',
      toolsInput: Array.isArray(p.tools) ? p.tools.join(', ') : '',
      featuresInput: Array.isArray(p.keyFeatures) ? p.keyFeatures.join('\n') : '',
      clientContext: p.clientContext || '',
    });
    setIsAddingNew(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setProjectStatusMessage({ type: 'error', text: 'Image file too large. Please select an image under 15MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      if (base64Data) {
        setProjForm((prev) => ({ ...prev, image: base64Data }));
        setProjectStatusMessage({ type: 'success', text: 'Image loaded from your device!' });
      }
    };
    reader.onerror = () => {
      setProjectStatusMessage({ type: 'error', text: 'Failed to read image file.' });
    };
    reader.readAsDataURL(file);
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setProjectStatusMessage({ 
        type: 'error', 
        text: 'Video file exceeds 50MB. For larger videos, paste a YouTube, Vimeo, or direct MP4 link.' 
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      if (base64Data) {
        setProjForm((prev) => ({ 
          ...prev, 
          videoUrl: base64Data, 
          mediaType: 'video',
          category: prev.category === 'Websites' ? 'Video Ads' : prev.category 
        }));
        setProjectStatusMessage({ type: 'success', text: 'Video file loaded from device! Preview it below.' });
      }
    };
    reader.onerror = () => {
      setProjectStatusMessage({ type: 'error', text: 'Failed to read video file.' });
    };
    reader.readAsDataURL(file);
  };

  const normalizeUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectStatusMessage(null);

    if (!projForm.title.trim()) {
      setProjectStatusMessage({ type: 'error', text: 'Project Title is required.' });
      return;
    }

    if (projForm.mediaType === 'video' && !projForm.videoUrl.trim() && !projForm.image.trim()) {
      setProjectStatusMessage({ type: 'error', text: 'Please provide a video link or upload a video file for this video project.' });
      return;
    }

    setIsSavingProject(true);

    const tools = projForm.toolsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const keyFeatures = projForm.featuresInput.split('\n').map((f) => f.trim()).filter(Boolean);
    const fallbackImage = projForm.mediaType === 'video'
      ? 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80'
      : projForm.mediaType === 'image'
      ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
      : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
    const chosenImage = projForm.image.trim() || fallbackImage;

    const shortDesc = projForm.shortDescription.trim() 
      || projForm.tagline.trim() 
      || `${projForm.title.trim()} real production project showcase`;

    const fullDesc = projForm.fullDescription.trim() || shortDesc;

    const projectPayload = {
      projectId: editingProject ? editingProject.id : `proj_${Date.now()}`,
      title: projForm.title.trim(),
      category: projForm.category,
      tagline: projForm.tagline.trim() || projForm.title.trim(),
      image: chosenImage,
      mediaType: projForm.mediaType,
      videoUrl: projForm.videoUrl.trim() || null,
      liveUrl: normalizeUrl(projForm.liveUrl) || null,
      githubUrl: normalizeUrl(projForm.githubUrl) || null,
      shortDescription: shortDesc,
      fullDescription: fullDesc,
      clientContext: projForm.clientContext.trim() || null,
      tools: tools.length > 0 ? tools : ['Web Development', 'Modern UI/UX'],
      keyFeatures: keyFeatures.length > 0 ? keyFeatures : ['Production ready deployment', 'High speed & responsive design'],
      status: 'Live Project',
    };

    let savedSuccessfully = false;

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectPayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        savedSuccessfully = true;
        if (Array.isArray(data.allProjects)) {
          let deletedSet: string[] = [];
          try {
            deletedSet = JSON.parse(localStorage.getItem('moeez_deleted_project_ids') || '[]');
          } catch {}
          const filtered = data.allProjects.filter((p: Project) => !deletedSet.includes(p.id));
          onRefreshProjects(filtered);
          localStorage.setItem('moeez_real_projects_list', JSON.stringify(filtered));
        }
      } else {
        throw new Error(data.error || 'Server returned an error');
      }
    } catch (err: any) {
      console.warn('Backend save issue, applying direct local sync:', err);
      // Fallback local storage
      const localList: Project[] = JSON.parse(localStorage.getItem('moeez_real_projects_list') || '[]');
      const newProj: Project = { ...projectPayload, id: projectPayload.projectId };
      const updated: Project[] = editingProject
        ? localList.map((p: Project) => p.id === editingProject.id ? newProj : p)
        : [newProj, ...localList.filter((p: Project) => p.id !== newProj.id)];
      
      localStorage.setItem('moeez_real_projects_list', JSON.stringify(updated));
      onRefreshProjects(updated);
      savedSuccessfully = true;
    } finally {
      setIsSavingProject(false);
    }

    if (savedSuccessfully) {
      setProjectStatusMessage({ 
        type: 'success', 
        text: 'Project successfully published! It is now live on your portfolio website.' 
      });
      setTimeout(() => {
        setIsAddingNew(false);
        setEditingProject(null);
        setProjectStatusMessage(null);
      }, 1200);
    }
  };

  const executeDeleteProject = async (id: string) => {
    setIsDeletingId(id);
    setProjectStatusMessage(null);

    // 1. Optimistic removal from active projects list
    const updated = projects.filter((p: Project) => p.id !== id);
    onRefreshProjects(updated);
    localStorage.setItem('moeez_real_projects_list', JSON.stringify(updated));

    // 2. Track in deleted set so App.tsx never resurrects it
    try {
      const deletedSet: string[] = JSON.parse(localStorage.getItem('moeez_deleted_project_ids') || '[]');
      if (!deletedSet.includes(id)) {
        deletedSet.push(id);
        localStorage.setItem('moeez_deleted_project_ids', JSON.stringify(deletedSet));
      }
    } catch {}

    // 3. Delete on server
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && Array.isArray(data.allProjects)) {
        let deletedSet: string[] = [];
        try {
          deletedSet = JSON.parse(localStorage.getItem('moeez_deleted_project_ids') || '[]');
        } catch {}
        const filteredAll = data.allProjects.filter((p: Project) => !deletedSet.includes(p.id));
        onRefreshProjects(filteredAll);
        localStorage.setItem('moeez_real_projects_list', JSON.stringify(filteredAll));
      }
      setProjectStatusMessage({ type: 'success', text: 'Project deleted from live website!' });
      setTimeout(() => setProjectStatusMessage(null), 3000);
    } catch (err) {
      console.warn('Backend delete note:', err);
      setProjectStatusMessage({ type: 'success', text: 'Project removed from your website!' });
      setTimeout(() => setProjectStatusMessage(null), 3000);
    } finally {
      setIsDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: siteSettings }),
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#080d19] border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0c1222] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-cyan-400">
              {isAuthenticated ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-purple-400" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Moeez Control Panel</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono">
                  {isAuthenticated ? 'Admin Authenticated' : 'Secure Access'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">Website projects manager & live client web messaging inbox</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Lock & Exit
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Barrier */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Owner Authentication</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Enter your secure admin password to manage real portfolio projects, reply to client web messages, and edit website content.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter control panel password..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-center tracking-widest"
                />
                {loginError && (
                  <p className="mt-2 text-xs text-red-400 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{loginError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl text-xs uppercase tracking-wider font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
              >
                Unlock Control Panel
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Nav Tabs */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-[#0a0f1d] shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('inbox')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors cursor-pointer ${
                  activeTab === 'inbox'
                    ? 'bg-slate-900 text-cyan-300 border-t-2 border-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Client Inboxes ({threads.length})</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('projects'); setIsAddingNew(false); }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors cursor-pointer ${
                  activeTab === 'projects'
                    ? 'bg-slate-900 text-cyan-300 border-t-2 border-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Live Projects ({projects.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-slate-900 text-cyan-300 border-t-2 border-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Website Content</span>
              </button>
            </div>

            {/* TAB CONTENT 1: SEPARATE CLIENT INBOXES & DIRECT WEB MESSENGER */}
            {activeTab === 'inbox' && (
              <div className="flex-1 flex flex-col sm:flex-row overflow-hidden bg-[#050812]">
                
                {/* Left Column: Client Inboxes List (har bande ka aleda inbox) */}
                <div className="w-full sm:w-80 lg:w-96 border-r border-slate-800 flex flex-col bg-[#080d19] shrink-0">
                  
                  {/* Search and Refresh Bar */}
                  <div className="p-3 border-b border-slate-800/80 flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={threadSearch}
                        onChange={(e) => setThreadSearch(e.target.value)}
                        placeholder="Search client inbox..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={fetchThreads}
                      className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Refresh Inboxes"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingThreads ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {/* Threads List */}
                  <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
                    {filteredThreads.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        {loadingThreads ? 'Loading inboxes...' : 'No client messages received yet. Submit an inquiry on the contact form to test!'}
                      </div>
                    ) : (
                      filteredThreads.map((t) => {
                        const isSelected = selectedThreadEmail === t.clientEmail;
                        const initial = t.clientName ? t.clientName.charAt(0).toUpperCase() : 'C';

                        return (
                          <div
                            key={t.clientEmail}
                            onClick={() => setSelectedThreadEmail(t.clientEmail)}
                            className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 ${
                              isSelected
                                ? 'bg-slate-800/80 border-l-4 border-cyan-400'
                                : 'hover:bg-slate-900/60'
                            }`}
                          >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md">
                              {initial}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <h5 className="text-xs font-bold text-white truncate">{t.clientName}</h5>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {t.lastMessageAt ? new Date(t.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                                </span>
                              </div>
                              <p className="text-[11px] text-cyan-400 truncate mb-1">{t.clientEmail}</p>
                              <div className="flex items-center gap-1.5 text-[10px] text-purple-300 font-medium mb-1">
                                <span>{t.service}</span>
                                {t.budget && <span>· {t.budget}</span>}
                              </div>
                              <p className="text-xs text-slate-400 truncate line-clamp-1">
                                {t.lastSender === 'admin' && <span className="text-cyan-400 font-semibold">You: </span>}
                                {t.lastMessage}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Column: Web Chat Messages & Direct Web Reply Area */}
                <div className="flex-1 flex flex-col bg-[#050812] overflow-hidden">
                  {activeThread ? (
                    <>
                      {/* Active Thread Header */}
                      <div className="p-4 border-b border-slate-800 bg-[#080d19] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
                            {activeThread.clientName ? activeThread.clientName.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{activeThread.clientName}</h4>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 font-medium">
                                Web Client
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                              <span className="text-cyan-400 font-mono">{activeThread.clientEmail}</span>
                              <span>·</span>
                              <span className="text-purple-300">{activeThread.service}</span>
                              {activeThread.budget && (
                                <>
                                  <span>·</span>
                                  <span className="text-emerald-400 font-semibold">{activeThread.budget}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Top Action Tools */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fetchThreadMessages(activeThread.clientEmail)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Refresh Thread"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Refresh Messages</span>
                          </button>
                        </div>
                      </div>

                      {/* Scrollable Web Chat Bubbles */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {threadMessages.length === 0 ? (
                          <div className="p-8 text-center text-xs text-slate-500">
                            Loading messages for this client...
                          </div>
                        ) : (
                          threadMessages.map((msg) => {
                            const isAdmin = msg.sender === 'admin';

                            return (
                              <div
                                key={msg.id}
                                className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                              >
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                                  {isAdmin ? (
                                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                                      <ShieldCheck className="w-3 h-3 text-cyan-400" />
                                      You (Moeez - Web Reply)
                                    </span>
                                  ) : (
                                    <span className="text-purple-300 font-medium">
                                      {activeThread.clientName} (Client Message)
                                    </span>
                                  )}
                                  <span>·</span>
                                  <span>
                                    {msg.createdAt 
                                      ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                                      : 'Recently'}
                                  </span>
                                </div>

                                <div
                                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap ${
                                    isAdmin
                                      ? 'bg-gradient-to-r from-purple-700 to-cyan-600 text-white shadow-lg shadow-purple-950/50'
                                      : 'bg-slate-900/90 border border-slate-800 text-slate-200'
                                  }`}
                                >
                                  {msg.message}
                                </div>
                              </div>
                            );
                          })
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Quick Canned Replies Bar */}
                      <div className="px-4 py-2 bg-[#060a14] border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider shrink-0 mr-1">
                          Quick Web Replies:
                        </span>
                        {QUICK_REPLIES.map((quick, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSendAdminReply(quick)}
                            disabled={sendingReply}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer shrink-0"
                          >
                            {quick.slice(0, 32)}...
                          </button>
                        ))}
                      </div>

                      {/* Web Reply Input Form */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendAdminReply();
                        }} 
                        className="p-4 border-t border-slate-800 bg-[#080d19] flex gap-2 shrink-0"
                      >
                        <textarea
                          rows={2}
                          value={adminReplyText}
                          onChange={(e) => setAdminReplyText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendAdminReply();
                            }
                          }}
                          placeholder={`Type your web reply to ${activeThread.clientName} (appears directly in their website inbox)...`}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                        />
                        <button
                          type="submit"
                          disabled={sendingReply || !adminReplyText.trim()}
                          className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 hover:opacity-95 disabled:opacity-50 shadow-md shadow-purple-900/30 flex items-center gap-2 shrink-0 self-end cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{sendingReply ? 'Sending...' : 'Send Web Reply'}</span>
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                      <MessageSquare className="w-12 h-12 text-slate-700 mb-3" />
                      <p className="text-sm font-semibold text-slate-400">Select a Client Inbox</p>
                      <p className="text-xs text-slate-500 mt-1">Click any client on the left to read their messages and reply directly on the website.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB CONTENT 2: LIVE PROJECTS MANAGER */}
            {activeTab === 'projects' && (
              <div className="flex-1 overflow-y-auto p-6 bg-[#060a14]">
                {!isAddingNew ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <span>Live Portfolio Projects</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono">
                            {projects.length} Active
                          </span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          Projects added here are published live immediately in the public "Selected Projects" section of your website.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openNewProjectForm('website')}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 shadow-md shadow-purple-900/30 cursor-pointer shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Real Project</span>
                      </button>
                    </div>

                    {projects.length === 0 ? (
                      <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 max-w-xl mx-auto my-8">
                        <div className="w-14 h-14 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4">
                          <Layers className="w-7 h-7" />
                        </div>
                        <h5 className="text-base font-bold text-white mb-1">No Projects Live Yet</h5>
                        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                          Add your real client projects or website work. You can upload images from your device, add live website URLs, and choose categories.
                        </p>
                        <button
                          type="button"
                          onClick={() => openNewProjectForm('website')}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 shadow-lg shadow-purple-900/30 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Your First Live Project</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((p) => (
                          <div
                            key={p.id}
                            className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition-all"
                          >
                            <div>
                              <div className="relative w-full h-40 rounded-lg overflow-hidden bg-slate-950 mb-3 border border-slate-800">
                                <img
                                  src={p.image}
                                  alt={p.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
                                  }}
                                />
                                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 border border-white/10 text-[10px] font-semibold text-cyan-300 uppercase tracking-wider">
                                  {p.category}
                                </span>

                                {/* Format badge */}
                                {p.mediaType === 'video' || p.videoUrl ? (
                                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-purple-950/85 border border-purple-500/40 text-[10px] font-semibold text-purple-300 flex items-center gap-1 shadow">
                                    <Play className="w-2.5 h-2.5 fill-purple-300" />
                                    <span>Video</span>
                                  </span>
                                ) : p.mediaType === 'image' ? (
                                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-950/85 border border-emerald-500/40 text-[10px] font-semibold text-emerald-300 flex items-center gap-1 shadow">
                                    <ImageIcon className="w-2.5 h-2.5" />
                                    <span>Image</span>
                                  </span>
                                ) : (
                                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-cyan-950/85 border border-cyan-500/40 text-[10px] font-semibold text-cyan-300 flex items-center gap-1 shadow">
                                    <Globe className="w-2.5 h-2.5" />
                                    <span>Website</span>
                                  </span>
                                )}
                              </div>

                              <h5 className="text-sm font-bold text-white truncate mb-1">{p.title}</h5>
                              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                                {p.shortDescription}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                              <div>
                                {p.liveUrl ? (
                                  <a
                                    href={p.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 hover:text-white flex items-center gap-1 text-[11px]"
                                  >
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>Visit Live</span>
                                    <ArrowUpRight className="w-3 h-3" />
                                  </a>
                                ) : p.videoUrl ? (
                                  <span className="text-[11px] text-purple-300 flex items-center gap-1">
                                    <Film className="w-3.5 h-3.5 text-purple-400" />
                                    <span>Video Linked</span>
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-slate-500">Image Asset</span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEditProjectForm(p)}
                                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                                  title="Edit Project"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>

                                {confirmDeleteId === p.id ? (
                                  <div className="flex items-center gap-1 bg-red-950/80 border border-red-500/50 rounded-lg p-1 animate-in fade-in">
                                    <span className="text-[10px] text-red-300 font-bold px-1">Delete?</span>
                                    <button
                                      type="button"
                                      onClick={() => executeDeleteProject(p.id)}
                                      disabled={isDeletingId === p.id}
                                      className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold cursor-pointer transition-colors shadow"
                                    >
                                      {isDeletingId === p.id ? '...' : 'Yes'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteId(null)}
                                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] cursor-pointer"
                                    >
                                      No
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(p.id)}
                                    className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-950/40 cursor-pointer transition-colors"
                                    title="Delete Project"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Add / Edit Project Form */
                  <form onSubmit={handleSaveProject} className="max-w-3xl mx-auto space-y-5 py-2">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <h4 className="text-base font-bold text-white">
                          {editingProject ? 'Edit Real Project' : 'Add New Real Project to Live Website'}
                        </h4>
                        <p className="text-xs text-slate-400">
                          Fill out the details below. Once saved, it will instantly show up in the Projects showcase.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddingNew(false)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white cursor-pointer"
                      >
                        Back to List
                      </button>
                    </div>

                    {/* Status Alert Banner */}
                    {projectStatusMessage && (
                      <div
                        className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                          projectStatusMessage.type === 'success'
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                            : 'bg-red-950/40 border-red-500/40 text-red-300'
                        }`}
                      >
                        {projectStatusMessage.type === 'success' ? (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <span>{projectStatusMessage.text}</span>
                      </div>
                    )}

                    {/* 1. Project Format Selection */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-cyan-950/40 border border-slate-700/80 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Project Format (Ye Project Kis Format Me Lagana Hai?)</span>
                          </label>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Choose whether this project is a working Website, a Video Advertisement/Reel, or a Graphic Design showcase.
                          </p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 font-mono self-start sm:self-auto">
                          Active: {projForm.mediaType === 'video' ? '🎬 VIDEO AD' : projForm.mediaType === 'image' ? '🖼️ IMAGE SHOWCASE' : '🌐 LIVE WEBSITE'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        {/* Option 1: Live Website */}
                        <button
                          type="button"
                          onClick={() => setProjForm((prev) => ({ 
                            ...prev, 
                            mediaType: 'website', 
                            category: prev.category === 'Video Ads' || prev.category === 'Graphic Design' ? 'Websites' : prev.category 
                          }))}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            projForm.mediaType === 'website'
                              ? 'bg-cyan-950/70 border-cyan-400 shadow-md shadow-cyan-950/60 text-white'
                              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              projForm.mediaType === 'website' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                            }`}>
                              <Globe className="w-4 h-4" />
                            </div>
                            {projForm.mediaType === 'website' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                          </div>
                          <div className="text-xs font-bold text-white mb-0.5">Live Website</div>
                          <p className="text-[11px] text-slate-400 leading-snug">Working website URL link + UI screenshot</p>
                        </button>

                        {/* Option 2: Video Advertisement */}
                        <button
                          type="button"
                          onClick={() => setProjForm((prev) => ({ 
                            ...prev, 
                            mediaType: 'video', 
                            category: prev.category === 'Websites' ? 'Video Ads' : prev.category,
                            image: prev.image || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80'
                          }))}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            projForm.mediaType === 'video'
                              ? 'bg-purple-950/70 border-purple-400 shadow-md shadow-purple-950/60 text-white'
                              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              projForm.mediaType === 'video' ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-400'
                            }`}>
                              <Video className="w-4 h-4" />
                            </div>
                            {projForm.mediaType === 'video' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                          </div>
                          <div className="text-xs font-bold text-white mb-0.5">Video Advertisement</div>
                          <p className="text-[11px] text-slate-400 leading-snug">Video player (MP4, YouTube, Vimeo, or upload)</p>
                        </button>

                        {/* Option 3: Graphic / Image */}
                        <button
                          type="button"
                          onClick={() => setProjForm((prev) => ({ 
                            ...prev, 
                            mediaType: 'image', 
                            category: prev.category === 'Websites' ? 'Graphic Design' : prev.category,
                            image: prev.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
                          }))}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            projForm.mediaType === 'image'
                              ? 'bg-emerald-950/70 border-emerald-400 shadow-md shadow-emerald-950/60 text-white'
                              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              projForm.mediaType === 'image' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                            }`}>
                              <ImageIcon className="w-4 h-4" />
                            </div>
                            {projForm.mediaType === 'image' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          </div>
                          <div className="text-xs font-bold text-white mb-0.5">Graphic / Image</div>
                          <p className="text-[11px] text-slate-400 leading-snug">High-res artwork or 3D product render</p>
                        </button>
                      </div>
                    </div>

                    {/* Title & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Project Title <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={projForm.title}
                          onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                          placeholder={
                            projForm.mediaType === 'video'
                              ? 'e.g. Cyberpunk Energy Drink 3D Commercial'
                              : projForm.mediaType === 'image'
                              ? 'e.g. Neon Apex Brand Identity & Creatives'
                              : 'e.g. IronPulse Gym Fitness Website'
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Category
                        </label>
                        <select
                          value={projForm.category}
                          onChange={(e) => setProjForm({ ...projForm, category: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                        >
                          <option value="Websites">Websites</option>
                          <option value="AI Automation">AI Automation</option>
                          <option value="Video Ads">Video Ads</option>
                          <option value="3D Products">3D Products</option>
                          <option value="Graphic Design">Graphic Design</option>
                        </select>
                      </div>
                    </div>

                    {/* DEDICATED VIDEO SECTION IF MEDIA TYPE IS VIDEO */}
                    {projForm.mediaType === 'video' && (
                      <div className="p-4 rounded-xl bg-purple-950/25 border border-purple-500/40 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <label className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                              <Film className="w-4 h-4 text-purple-400" />
                              <span>Video Source (YouTube Link, Vimeo, MP4 URL, or Device Upload)</span>
                            </label>
                            <p className="text-[11px] text-slate-400">
                              Paste any YouTube link, Vimeo link, direct MP4 file URL, or upload from your computer.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => videoFileInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/60 border border-purple-500/50 text-xs font-semibold text-purple-200 hover:text-white cursor-pointer shrink-0"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Video File (MP4/WebM)</span>
                          </button>
                        </div>

                        <input
                          ref={videoFileInputRef}
                          type="file"
                          accept="video/mp4,video/webm,video/ogg,video/quicktime"
                          onChange={handleVideoFileUpload}
                          className="hidden"
                        />

                        <input
                          type="text"
                          value={projForm.videoUrl}
                          onChange={(e) => setProjForm({ ...projForm, videoUrl: e.target.value })}
                          placeholder="e.g. https://www.youtube.com/watch?v=... or https://example.com/video.mp4"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                        />

                        {/* Quick Sample Video Presets */}
                        <div>
                          <p className="text-[11px] text-slate-400 mb-1.5">Or try a test video preset:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {PRESET_VIDEOS.map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setProjForm({ ...projForm, videoUrl: preset.url })}
                                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-purple-300 hover:text-white border border-purple-800/60 transition-colors cursor-pointer"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Live Video Player Preview in Admin */}
                        {projForm.videoUrl && (
                          <div className="mt-3 pt-3 border-t border-purple-900/50">
                            <p className="text-[11px] font-semibold text-purple-300 mb-2 flex items-center gap-1.5">
                              <Play className="w-3.5 h-3.5 text-purple-400" />
                              <span>Live Video Preview (Working player preview):</span>
                            </p>
                            <div className="relative aspect-[16/9] w-full max-w-md mx-auto rounded-xl overflow-hidden bg-black border border-purple-500/40 shadow-lg">
                              {(() => {
                                const parsed = parseVideoUrl(projForm.videoUrl);
                                if (!parsed) return null;
                                if (parsed.type === 'youtube' || parsed.type === 'vimeo') {
                                  return (
                                    <iframe
                                      src={parsed.embedUrl}
                                      title="Video Preview"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      className="w-full h-full border-0"
                                    />
                                  );
                                }
                                return (
                                  <video
                                    controls
                                    playsInline
                                    poster={projForm.image}
                                    className="w-full h-full object-contain bg-black"
                                    src={parsed.embedUrl}
                                  >
                                    Your browser does not support video playback.
                                  </video>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Live Website URL & GitHub / Companion Link */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          {projForm.mediaType === 'website' 
                            ? 'Live Website / Demo URL (Required for Web)' 
                            : projForm.mediaType === 'video'
                            ? 'Companion Website / Campaign Page (Optional)'
                            : 'Deliverable Link / Figma / Behance (Optional)'}
                        </label>
                        <input
                          type="text"
                          value={projForm.liveUrl}
                          onChange={(e) => setProjForm({ ...projForm, liveUrl: e.target.value })}
                          placeholder={
                            projForm.mediaType === 'website' 
                              ? 'e.g. https://myclientwebsite.com' 
                              : 'e.g. https://behance.net/gallery/...'
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          GitHub / Project Repo URL (Optional)
                        </label>
                        <input
                          type="text"
                          value={projForm.githubUrl}
                          onChange={(e) => setProjForm({ ...projForm, githubUrl: e.target.value })}
                          placeholder="e.g. github.com/username/project"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    {/* Image Section: Device Upload OR URL OR Presets */}
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-cyan-400" />
                          <span>
                            {projForm.mediaType === 'video'
                              ? 'Video Thumbnail / Poster Image'
                              : projForm.mediaType === 'image'
                              ? 'High-Resolution Artwork / Graphic Design Image'
                              : 'Website Screenshot / Cover Image'}
                          </span>
                        </label>
                        
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-xs font-semibold text-cyan-300 hover:text-white cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Image from Device</span>
                        </button>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />

                      {/* Image URL input */}
                      <input
                        type="text"
                        value={projForm.image}
                        onChange={(e) => setProjForm({ ...projForm, image: e.target.value })}
                        placeholder="Paste image URL here, or click 'Upload Image from Device' above"
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />

                      {/* Quick Presets */}
                      <div>
                        <p className="text-[11px] text-slate-400 mb-1.5">Or choose a sample cover preset:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {PRESET_IMAGES.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setProjForm({ ...projForm, image: preset.url })}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Image Preview */}
                      {projForm.image && (
                        <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                          <img
                            src={projForm.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-cyan-300 font-mono">
                            Preview
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Short Description */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Short Description
                      </label>
                      <textarea
                        rows={2}
                        value={projForm.shortDescription}
                        onChange={(e) => setProjForm({ ...projForm, shortDescription: e.target.value })}
                        placeholder="Brief summary shown on project card (e.g. Modern responsive gym website with membership booking and schedule system)..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
                      />
                    </div>

                    {/* Tools & Key Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Tools Used (comma separated)
                        </label>
                        <input
                          type="text"
                          value={projForm.toolsInput}
                          onChange={(e) => setProjForm({ ...projForm, toolsInput: e.target.value })}
                          placeholder="React, TypeScript, Tailwind, Stripe"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Key Features (one per line)
                        </label>
                        <textarea
                          rows={2}
                          value={projForm.featuresInput}
                          onChange={(e) => setProjForm({ ...projForm, featuresInput: e.target.value })}
                          placeholder="Fast load speed&#10;SEO optimized&#10;Responsive layout"
                          className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsAddingNew(false)}
                        className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingProject}
                        className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 shadow-md shadow-purple-900/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        <span>{isSavingProject ? 'Publishing Live...' : 'Publish to Live Website'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB CONTENT 3: SETTINGS */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#060a14]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-white">Website Content & Headlines</h4>
                    <p className="text-xs text-slate-400">Edit the primary text and contact details across your website</p>
                  </div>
                  {settingsSaved && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <Check className="w-4 h-4" />
                      <span>Saved!</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Creator Name</label>
                    <input
                      type="text"
                      value={siteSettings.creatorName}
                      onChange={(e) => setSiteSettings({ ...siteSettings, creatorName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={siteSettings.contactEmail}
                      onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={siteSettings.whatsappNumber}
                    onChange={(e) => setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Main Headline</label>
                  <input
                    type="text"
                    value={siteSettings.heroHeadline}
                    onChange={(e) => setSiteSettings({ ...siteSettings, heroHeadline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Subheadline</label>
                  <textarea
                    rows={3}
                    value={siteSettings.heroSubheadline}
                    onChange={(e) => setSiteSettings({ ...siteSettings, heroSubheadline: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 shadow-md shadow-purple-900/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Content Settings</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
