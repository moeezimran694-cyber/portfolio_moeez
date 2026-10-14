import React, { useState, useEffect } from 'react';
import { 
  X, Lock, Unlock, Plus, Trash2, Edit3, Globe, Layers, 
  Settings, Mail, MessageSquare, Check, AlertCircle, RefreshCw, Save,
  Send, User, Clock, ArrowUpRight, Search, ShieldCheck, Phone, Reply
} from 'lucide-react';
import { Project } from '../data/projectsData';

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
  onRefreshProjects: () => void;
}

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

  // Project Editor State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [projForm, setProjForm] = useState({
    title: '',
    category: 'Websites',
    tagline: '',
    image: '',
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

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !selectedThreadEmail) return;

    const currentThread = threads.find((t) => t.clientEmail === selectedThreadEmail);
    setSendingReply(true);

    try {
      const res = await fetch('/api/inbox/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: selectedThreadEmail,
          clientName: currentThread?.clientName || 'Client',
          message: adminReplyText.trim(),
          inquiryId: currentThread?.inquiryId,
        }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setThreadMessages((prev) => [...prev, data.message]);
        setAdminReplyText('');
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

  // Projects handlers
  const openNewProjectForm = () => {
    setEditingProject(null);
    setProjForm({
      title: '',
      category: 'Websites',
      tagline: '',
      image: '',
      liveUrl: '',
      githubUrl: '',
      shortDescription: '',
      fullDescription: '',
      toolsInput: 'React, TypeScript, Tailwind CSS',
      featuresInput: 'High conversion responsive layout\nFast load times & SEO optimized\nClean UI/UX design',
      clientContext: '',
    });
    setIsAddingNew(true);
  };

  const openEditProjectForm = (p: Project) => {
    setEditingProject(p);
    setProjForm({
      title: p.title,
      category: p.category,
      tagline: p.tagline || '',
      image: p.image || '',
      liveUrl: p.liveUrl || '',
      githubUrl: p.githubUrl || '',
      shortDescription: p.shortDescription || '',
      fullDescription: p.fullDescription || '',
      toolsInput: p.tools.join(', '),
      featuresInput: p.keyFeatures.join('\n'),
      clientContext: p.clientContext || '',
    });
    setIsAddingNew(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projForm.title.trim()) return;

    const tools = projForm.toolsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const keyFeatures = projForm.featuresInput.split('\n').map((f) => f.trim()).filter(Boolean);

    const projectPayload = {
      projectId: editingProject ? editingProject.id : `proj_${Date.now()}`,
      title: projForm.title.trim(),
      category: projForm.category,
      tagline: projForm.tagline.trim() || projForm.title.trim(),
      image: projForm.image.trim() || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      liveUrl: projForm.liveUrl.trim() || null,
      githubUrl: projForm.githubUrl.trim() || null,
      shortDescription: projForm.shortDescription.trim(),
      fullDescription: projForm.fullDescription.trim() || projForm.shortDescription.trim(),
      clientContext: projForm.clientContext.trim() || null,
      tools: tools.length > 0 ? tools : ['Web Development'],
      keyFeatures: keyFeatures.length > 0 ? keyFeatures : ['Production ready deployment'],
      status: 'Live Project',
    };

    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectPayload),
      });
    } catch {
      const localList = JSON.parse(localStorage.getItem('moeez_real_projects_list') || '[]');
      const updated = editingProject
        ? localList.map((p: Project) => p.id === editingProject.id ? { ...projectPayload, id: projectPayload.projectId } : p)
        : [{ ...projectPayload, id: projectPayload.projectId }, ...localList];
      localStorage.setItem('moeez_real_projects_list', JSON.stringify(updated));
    }

    setIsAddingNew(false);
    setEditingProject(null);
    onRefreshProjects();
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    } catch {}
    const localList = JSON.parse(localStorage.getItem('moeez_real_projects_list') || '[]');
    localStorage.setItem('moeez_real_projects_list', JSON.stringify(localList.filter((p: Project) => p.id !== id)));
    onRefreshProjects();
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
              <p className="text-xs text-slate-400">Separate client inboxes, direct chat replies & website management</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Lock & Exit
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* Login Form */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto text-center my-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-cyan-400/20 border border-purple-500/40 flex items-center justify-center text-cyan-400 mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Owner Authentication</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Enter the Control Panel security password to view client message inboxes and manage real projects.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security password"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-center tracking-wider"
                />
                {loginError && (
                  <p className="text-xs text-red-400 mt-2 flex items-center justify-center gap-1">
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
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors ${
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
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors ${
                  activeTab === 'projects'
                    ? 'bg-slate-900 text-cyan-300 border-t-2 border-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Real Projects ({projects.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-slate-900 text-cyan-300 border-t-2 border-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Website Content</span>
              </button>
            </div>

            {/* TAB CONTENT 1: SEPARATE CLIENT INBOXES & INTERACTIVE CHAT */}
            {activeTab === 'inbox' && (
              <div className="flex-1 flex flex-col sm:flex-row overflow-hidden bg-[#050812]">
                
                {/* Left Column: Client Inboxes List (har bande ka aleda inbox) */}
                <div className="w-full sm:w-80 lg:w-96 border-r border-slate-800 flex flex-col bg-[#080d19] shrink-0">
                  
                  {/* Search and Refresh Bar */}
                  <div className="p-3 border-b border-slate-800/80 flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
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
                      className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
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
                                {t.lastSender === 'admin' && <span className="text-cyan-400">You: </span>}
                                {t.lastMessage}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                </div>

                {/* Right Column: Chat History & Reply Window for Selected Client */}
                <div className="flex-1 flex flex-col bg-[#060a14] overflow-hidden">
                  {activeThread ? (
                    <>
                      {/* Active Client Info Banner */}
                      <div className="px-6 py-3.5 border-b border-slate-800 bg-[#090e1d] flex flex-wrap items-center justify-between gap-3 shrink-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                            {activeThread.clientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              <span>{activeThread.clientName}</span>
                              {activeThread.company && (
                                <span className="text-xs font-normal text-slate-400">({activeThread.company})</span>
                              )}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
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

                        {/* Direct External Reply Shortcuts */}
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${encodeURIComponent(activeThread.clientEmail)}?subject=${encodeURIComponent(`Re: Inquiry for ${activeThread.service || 'your project'}`)}&body=${encodeURIComponent(`Hi ${activeThread.clientName},\n\nThank you for reaching out regarding your project inquiry.\n\nBest regards,\nMoeez\n+92 318 4498716`)}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-xs text-cyan-300 hover:text-white transition-colors"
                            title={`Send mailto: reply to ${activeThread.clientEmail}`}
                          >
                            <Reply className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Reply (Mailto)</span>
                          </a>

                          <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(activeThread.clientEmail)}&su=${encodeURIComponent(`Re: Inquiry for ${activeThread.service}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-cyan-300 transition-colors"
                            title="Open in Gmail Web Compose"
                          >
                            <Mail className="w-3.5 h-3.5 text-purple-400" />
                            <span>Gmail</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>

                          <button
                            type="button"
                            onClick={() => fetchThreadMessages(activeThread.clientEmail)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                            title="Refresh Thread"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Scrollable Chat Bubbles */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {threadMessages.length === 0 ? (
                          <div className="p-8 text-center text-xs text-slate-500">
                            Loading messages...
                          </div>
                        ) : (
                          threadMessages.map((msg) => {
                            const isAdmin = msg.sender === 'admin';
                            const mailtoLink = `mailto:${encodeURIComponent(activeThread.clientEmail)}?subject=${encodeURIComponent(`Re: Inquiry regarding ${activeThread.service || 'your project'}`)}&body=${encodeURIComponent(`Hi ${activeThread.clientName},\n\nThank you for reaching out! Regarding your message:\n"${msg.message}"\n\nI would be delighted to work with you on this.\n\nBest regards,\nMoeez\n+92 318 4498716`)}`;

                            return (
                              <div
                                key={msg.id}
                                className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                              >
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                                  {isAdmin ? (
                                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                                      <ShieldCheck className="w-3 h-3 text-cyan-400" />
                                      You (Moeez)
                                    </span>
                                  ) : (
                                    <span className="text-purple-300 font-medium">{activeThread.clientName}</span>
                                  )}
                                  <span>·</span>
                                  <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}</span>
                                  
                                  {!isAdmin && (
                                    <>
                                      <span>·</span>
                                      <a
                                        href={mailtoLink}
                                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-400 hover:text-white transition-colors ml-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700/60"
                                        title={`Reply to ${activeThread.clientEmail}`}
                                      >
                                        <Reply className="w-2.5 h-2.5" />
                                        <span>Reply</span>
                                      </a>
                                    </>
                                  )}
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

                                {!isAdmin && (
                                  <div className="mt-1 flex items-center gap-2 pl-1">
                                    <a
                                      href={mailtoLink}
                                      className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-white transition-colors"
                                      title={`Reply to ${activeThread.clientEmail} via default email client`}
                                    >
                                      <Reply className="w-3 h-3 text-cyan-400" />
                                      <span>Reply via Email</span>
                                    </a>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Reply Input Form */}
                      <form onSubmit={handleSendAdminReply} className="p-4 border-t border-slate-800 bg-[#080d19] flex gap-2 shrink-0">
                        <textarea
                          rows={2}
                          value={adminReplyText}
                          onChange={(e) => setAdminReplyText(e.target.value)}
                          placeholder={`Type your reply to ${activeThread.clientName} (will appear in their inbox)...`}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                        />
                        <button
                          type="submit"
                          disabled={sendingReply || !adminReplyText.trim()}
                          className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 hover:opacity-95 disabled:opacity-50 shadow-md shadow-purple-900/30 flex items-center gap-2 shrink-0 self-end"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{sendingReply ? 'Sending...' : 'Send Reply'}</span>
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                      <MessageSquare className="w-12 h-12 text-slate-700 mb-3" />
                      <p className="text-sm font-semibold text-slate-400">Select a Client Inbox</p>
                      <p className="text-xs text-slate-500 mt-1">Click any client on the left to read their messages and reply directly.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB CONTENT 2: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="flex-1 overflow-y-auto p-6">
                {!isAddingNew ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                      <div>
                        <h4 className="text-sm font-bold text-white">Live Portfolio Projects</h4>
                        <p className="text-xs text-slate-400">All projects here are displayed live on the public website</p>
                      </div>
                      <button
                        type="button"
                        onClick={openNewProjectForm}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 shadow-md shadow-purple-900/30"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Real Project</span>
                      </button>
                    </div>

                    {projects.length === 0 ? (
                      <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
                        <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-white mb-1">No Real Projects in Database</p>
                        <p className="text-xs text-slate-400 mb-4">Click below to add your first real website or client project.</p>
                        <button
                          type="button"
                          onClick={openNewProjectForm}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add First Real Project</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.map((p) => (
                          <div
                            key={p.id}
                            className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex flex-col justify-between"
                          >
                            <div className="flex items-start gap-3">
                              <img
                                src={p.image}
                                alt={p.title}
                                className="w-16 h-16 rounded-lg object-cover bg-slate-950 shrink-0"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80';
                                }}
                              />
                              <div className="overflow-hidden">
                                <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-mono uppercase">
                                  <span>{p.category}</span>
                                </div>
                                <h5 className="text-sm font-bold text-white truncate">{p.title}</h5>
                                <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{p.shortDescription}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-xs">
                              <div className="flex items-center gap-2">
                                {p.liveUrl && (
                                  <a
                                    href={p.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 hover:text-white flex items-center gap-1"
                                  >
                                    <Globe className="w-3 h-3" />
                                    <span>Link</span>
                                  </a>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => openEditProjectForm(p)}
                                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                                  title="Edit Project"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProject(p.id)}
                                  className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-950/40"
                                  title="Delete Project"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Add / Edit Form */
                  <form onSubmit={handleSaveProject} className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <h4 className="text-sm font-bold text-white">
                        {editingProject ? 'Edit Real Project' : 'Create Real Project'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsAddingNew(false)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Back to List
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Project Title <span className="text-purple-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={projForm.title}
                          onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                          placeholder="e.g. Modern E-Commerce Store"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Live Website URL
                        </label>
                        <input
                          type="url"
                          value={projForm.liveUrl}
                          onChange={(e) => setProjForm({ ...projForm, liveUrl: e.target.value })}
                          placeholder="https://example.com"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          GitHub Repo URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={projForm.githubUrl}
                          onChange={(e) => setProjForm({ ...projForm, githubUrl: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Screenshot / Image URL
                      </label>
                      <input
                        type="text"
                        value={projForm.image}
                        onChange={(e) => setProjForm({ ...projForm, image: e.target.value })}
                        placeholder="https://images.unsplash.com/... or /assets/images/myproject.jpg"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Short Description <span className="text-purple-400">*</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={projForm.shortDescription}
                        onChange={(e) => setProjForm({ ...projForm, shortDescription: e.target.value })}
                        placeholder="Brief summary shown on project card..."
                        className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Tools Used (comma separated)
                        </label>
                        <input
                          type="text"
                          value={projForm.toolsInput}
                          onChange={(e) => setProjForm({ ...projForm, toolsInput: e.target.value })}
                          placeholder="React, Next.js, Tailwind, Stripe"
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
                          placeholder="Responsive layout&#10;Stripe payments"
                          className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsAddingNew(false)}
                        className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 shadow-md shadow-purple-900/30 flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save to Live Website</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB CONTENT 3: SETTINGS */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="flex-1 overflow-y-auto p-6 space-y-4">
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
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 shadow-md shadow-purple-900/30 flex items-center gap-1.5"
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
