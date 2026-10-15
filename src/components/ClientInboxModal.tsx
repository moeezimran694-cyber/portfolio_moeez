import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare, Check, RefreshCw, User, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  id: number;
  clientEmail: string;
  clientName: string;
  sender: 'client' | 'admin';
  message: string;
  createdAt: string;
}

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
    return initialEmail || localStorage.getItem('moeez_client_email') || '';
  });
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(() => {
    return Boolean(initialEmail || localStorage.getItem('moeez_client_email'));
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [clientName, setClientName] = useState('Client');

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
      setIsEmailSubmitted(true);
      localStorage.setItem('moeez_client_email', initialEmail);
      fetchThread(initialEmail);
    } else {
      const stored = localStorage.getItem('moeez_client_email');
      if (stored) {
        setEmail(stored);
        setIsEmailSubmitted(true);
        fetchThread(stored);
      }
    }
  }, [initialEmail]);

  useEffect(() => {
    if (isOpen && isEmailSubmitted && email) {
      fetchThread(email);
    }
  }, [isOpen, isEmailSubmitted, email]);

  const fetchThread = async (targetEmail: string) => {
    if (!targetEmail.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/inbox/thread/${encodeURIComponent(targetEmail.trim())}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
        if (data.messages.length > 0) {
          const clientMsg = data.messages.find((m: ChatMessage) => m.sender === 'client');
          if (clientMsg) setClientName(clientMsg.clientName);
        }
      }
    } catch (e) {
      console.error('Failed to load thread:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    localStorage.setItem('moeez_client_email', email.trim());
    setIsEmailSubmitted(true);
    fetchThread(email.trim());
  };

  const handleSwitchEmail = () => {
    setIsEmailSubmitted(false);
    setMessages([]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !email.trim()) return;

    setSending(true);
    try {
      const res = await fetch('/api/inbox/client-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: email.trim(),
          clientName: clientName || 'Client',
          message: newMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#090d1a] border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0c1222]">
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
              <>
                <button
                  type="button"
                  onClick={handleSwitchEmail}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Change Email
                </button>
                <button
                  type="button"
                  onClick={() => fetchThread(email)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title="Refresh messages"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </>
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

        {/* Content */}
        {!isEmailSubmitted ? (
          /* Email entry step */
          <div className="p-8 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4">
              <User className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Access Your Message Thread</h4>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Enter the email address you used when submitting your project inquiry to view Moeez's replies.
            </p>

            <form onSubmit={handleLookup} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@company.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-center"
              />
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 shadow-md shadow-purple-900/30"
              >
                Open My Messages
              </button>
            </form>
          </div>
        ) : (
          /* Chat History & Reply Composer */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px] max-h-[50vh] bg-[#050812]">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  {loading ? 'Loading message history...' : 'No message history found for this email yet. Submit an inquiry to begin!'}
                </div>
              ) : (
                messages.map((msg) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                        {isAdmin ? (
                          <span className="text-cyan-400 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-cyan-400" />
                            Moeez (Owner)
                          </span>
                        ) : (
                          <span className="text-purple-300 font-medium">You ({msg.clientName})</span>
                        )}
                        <span>·</span>
                        <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
                      </div>

                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-gradient-to-br from-purple-950/70 to-slate-900 border border-purple-500/40 text-slate-100 shadow-lg'
                            : 'bg-slate-800/80 border border-slate-700/70 text-slate-200'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Client Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-[#090d1a] flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your reply to Moeez..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 disabled:opacity-50 shadow-md shadow-purple-900/30 flex items-center gap-1.5 shrink-0"
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
