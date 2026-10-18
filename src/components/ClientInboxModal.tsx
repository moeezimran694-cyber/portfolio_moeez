import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare, RefreshCw, User, ShieldCheck } from 'lucide-react';
import { ChatMessage, getStoredThreadByEmail, saveStoredMessage } from '../data/inboxData';

interface ClientInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export const ClientInboxModal: React.FC<ClientInboxModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
}) => {
  const [email, setEmail] = useState(() => {
    return initialEmail || localStorage.getItem('moeez_client_email') || 'moeezi396@gmail.com';
  });
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [clientName, setClientName] = useState('Client');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadThread = async (targetEmail: string) => {
    if (!targetEmail.trim()) return;
    const cleanEmail = targetEmail.trim().toLowerCase();

    // 1. Immediately load stored real messages (zero wait time on Vercel or locally)
    const stored = getStoredThreadByEmail(cleanEmail);
    if (stored && Array.isArray(stored.messages)) {
      setMessages(stored.messages);
      if (stored.clientName) setClientName(stored.clientName);
    }

    // 2. Also check server backend if available
    setLoading(true);
    try {
      const res = await fetch(`/api/inbox/thread/${encodeURIComponent(cleanEmail)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(data.messages);
          const clientMsg = data.messages.find((m: ChatMessage) => m.sender === 'client');
          if (clientMsg) setClientName(clientMsg.clientName);
        }
      }
    } catch {
      // Graceful fallback: Stored thread already loaded
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
      setIsEmailSubmitted(true);
      localStorage.setItem('moeez_client_email', initialEmail);
      loadThread(initialEmail);
    } else {
      const stored = localStorage.getItem('moeez_client_email') || 'moeezi396@gmail.com';
      setEmail(stored);
      setIsEmailSubmitted(true);
      loadThread(stored);
    }
  }, [initialEmail]);

  useEffect(() => {
    if (isOpen && isEmailSubmitted && email) {
      loadThread(email);
    }
  }, [isOpen, isEmailSubmitted, email]);

  // Listen for real-time updates dispatched by Owner Control Panel or another tab
  useEffect(() => {
    const handleUpdate = (e: any) => {
      const updatedEmail = e.detail?.email;
      if (updatedEmail && email && updatedEmail.toLowerCase() === email.toLowerCase().trim()) {
        const stored = getStoredThreadByEmail(email);
        if (stored && Array.isArray(stored.messages)) {
          setMessages(stored.messages);
          setTimeout(scrollToBottom, 50);
        }
      }
    };

    window.addEventListener('moeez_inbox_updated', handleUpdate);
    return () => window.removeEventListener('moeez_inbox_updated', handleUpdate);
  }, [email]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    localStorage.setItem('moeez_client_email', email.trim());
    setIsEmailSubmitted(true);
    loadThread(email.trim());
  };

  const handleSwitchEmail = () => {
    setIsEmailSubmitted(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !email.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // 1. Immediately store message in real local thread store
    const savedMsg = saveStoredMessage(email, clientName || 'Client', 'client', messageText);
    setMessages((prev) => [...prev, savedMsg]);
    setTimeout(scrollToBottom, 50);

    // 2. Attempt background sync with server API if online
    try {
      await fetch('/api/inbox/client-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: email.trim(),
          clientName: clientName || 'Client',
          message: messageText,
        }),
      });
    } catch {
      // If server is not responding (e.g. on static Vercel), message is safely stored in layer 1
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      data-lenis-prevent
    >
      <div 
        className="relative w-full max-w-2xl bg-[#090d1a] border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0c1222] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Direct Web Conversation</span>
                {isEmailSubmitted && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono">
                    {email}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">Direct message exchange with Moeez (Owner)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEmailSubmitted && (
              <button
                type="button"
                onClick={handleSwitchEmail}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Change or look up a different email thread"
              >
                Change Email
              </button>
            )}

            <button
              type="button"
              onClick={() => loadThread(email)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refresh messages"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isEmailSubmitted ? (
          <div className="p-8 text-center flex-1 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 mx-auto mb-4">
              <User className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Access Your Message Thread</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
              Enter the email address you used when sending your project inquiry to view your messages and replies from Moeez.
            </p>

            <form onSubmit={handleLookup} className="max-w-md mx-auto w-full flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-semibold hover:opacity-95 transition-opacity cursor-pointer shrink-0"
              >
                Open Thread
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-[380px] max-h-[60vh] overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4" data-lenis-prevent>
              {messages.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs">
                  <p>No messages yet for this thread.</p>
                  <p className="mt-1 text-slate-500">Send a message below and Moeez will receive it directly.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isClient = msg.sender === 'client';
                  const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                        <span className={isClient ? 'text-cyan-400 font-medium' : 'text-purple-400 font-semibold'}>
                          {isClient ? 'You (Client)' : 'Moeez (Owner)'}
                        </span>
                        <span>·</span>
                        <span>{formattedTime}</span>
                        {!isClient && (
                          <span className="flex items-center gap-0.5 text-[9px] text-purple-300">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md ${
                          isClient
                            ? 'bg-gradient-to-br from-[#13203c] to-[#0f1b33] text-slate-100 border border-cyan-500/30 rounded-tr-sm'
                            : 'bg-gradient-to-br from-[#201035] to-[#160c26] text-purple-100 border border-purple-500/35 rounded-tl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#0c1222] border-t border-slate-800 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your reply to Moeez..."
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white text-xs font-semibold hover:opacity-95 disabled:opacity-50 transition-opacity cursor-pointer shrink-0 flex items-center gap-1.5 shadow-md shadow-purple-900/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
