export interface ChatMessage {
  id: number;
  inquiryId?: number | null;
  clientEmail: string;
  clientName: string;
  sender: 'client' | 'admin';
  message: string;
  createdAt: string;
}

export interface ClientThread {
  clientEmail: string;
  clientName: string;
  company?: string | null;
  service: string;
  budget?: string | null;
  inquiryId?: number;
  lastMessage: string;
  lastMessageAt: string;
  lastSender: 'client' | 'admin' | string;
  messages: ChatMessage[];
}

export const REAL_DEFAULT_THREADS: ClientThread[] = [
  {
    clientEmail: 'moeezi8e272@gmail.com',
    clientName: 'Client',
    company: null,
    service: 'General Inquiry',
    budget: 'Flexible',
    lastMessage: 'h',
    lastMessageAt: '2026-10-18T11:35:39.518Z',
    lastSender: 'client',
    messages: [
      {
        id: 10,
        inquiryId: null,
        clientEmail: 'moeezi8e272@gmail.com',
        clientName: 'Client',
        sender: 'client',
        message: 'h',
        createdAt: '2026-10-18T11:35:39.518Z',
      },
    ],
  },
  {
    clientEmail: 'moeezi396@gmail.com',
    clientName: 'Client',
    company: null,
    service: 'General Inquiry',
    budget: 'Flexible',
    lastMessage: 'k',
    lastMessageAt: '2026-10-18T11:20:40.186Z',
    lastSender: 'client',
    messages: [
      {
        id: 5,
        inquiryId: null,
        clientEmail: 'moeezi396@gmail.com',
        clientName: 'Client',
        sender: 'client',
        message: 'yy',
        createdAt: '2026-10-15T08:07:42.827Z',
      },
      {
        id: 6,
        inquiryId: null,
        clientEmail: 'moeezi396@gmail.com',
        clientName: 'Client',
        sender: 'admin',
        message: 'Hello Brother how are you',
        createdAt: '2026-10-16T04:26:42.068Z',
      },
      {
        id: 8,
        inquiryId: null,
        clientEmail: 'moeezi396@gmail.com',
        clientName: 'Client',
        sender: 'admin',
        message: 'Salam! I received your inquiry and would be glad to work on this with you.',
        createdAt: '2026-10-16T04:33:45.884Z',
      },
      {
        id: 9,
        inquiryId: null,
        clientEmail: 'moeezi396@gmail.com',
        clientName: 'Client',
        sender: 'client',
        message: 'k',
        createdAt: '2026-10-18T11:20:40.186Z',
      },
    ],
  },
  {
    clientEmail: 'usman@test.com',
    clientName: 'Usman Ali',
    company: null,
    service: 'Website Development',
    budget: '$1,000',
    inquiryId: 3,
    lastMessage: 'Yes, this can certainly be built within your expected budget. Let me know when you are ready to start.',
    lastMessageAt: '2026-10-16T04:33:40.801Z',
    lastSender: 'admin',
    messages: [
      {
        id: 3,
        inquiryId: 3,
        clientEmail: 'usman@test.com',
        clientName: 'Usman Ali',
        sender: 'client',
        message: 'Salam Moeez bhai, mujhe gym ke liye website banwani hai.',
        createdAt: '2026-10-15T07:55:27.117Z',
      },
      {
        id: 4,
        inquiryId: null,
        clientEmail: 'usman@test.com',
        clientName: 'Usman Ali',
        sender: 'admin',
        message: 'W/Salam Usman bhai! Bilkul ban jaye gi, kab call per baat karein?',
        createdAt: '2026-10-15T07:55:35.006Z',
      },
      {
        id: 7,
        inquiryId: 3,
        clientEmail: 'usman@test.com',
        clientName: 'Usman Ali',
        sender: 'admin',
        message: 'Yes, this can certainly be built within your expected budget. Let me know when you are ready to start.',
        createdAt: '2026-10-16T04:33:40.801Z',
      },
    ],
  },
];

const STORAGE_KEY = 'moeez_inbox_threads_store';

export function getAllStoredThreads(): ClientThread[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const map = new Map<string, ClientThread>();
        REAL_DEFAULT_THREADS.forEach((t) => map.set(t.clientEmail.toLowerCase(), { ...t }));
        parsed.forEach((t) => {
          if (t && t.clientEmail) {
            const key = t.clientEmail.toLowerCase();
            const existing = map.get(key);
            if (existing) {
              // Merge messages so they are never lost
              const msgMap = new Map<number | string, ChatMessage>();
              existing.messages.forEach((m) => msgMap.set(m.id || m.message, m));
              if (Array.isArray(t.messages)) {
                t.messages.forEach((m: ChatMessage) => msgMap.set(m.id || m.message, m));
              }
              // If thread had a lastMessage that wasn't in messages
              if (t.lastMessage && !Array.from(msgMap.values()).some((m) => m.message === t.lastMessage)) {
                msgMap.set('synth_' + Date.now(), {
                  id: Date.now(),
                  clientEmail: t.clientEmail,
                  clientName: t.clientName || 'Client',
                  sender: (t.lastSender as any) || 'client',
                  message: t.lastMessage,
                  createdAt: t.lastMessageAt || new Date().toISOString(),
                });
              }
              map.set(key, {
                ...existing,
                ...t,
                messages: Array.from(msgMap.values()),
              });
            } else {
              // New thread
              const messages = Array.isArray(t.messages) && t.messages.length > 0
                ? t.messages
                : t.lastMessage
                  ? [{
                      id: Date.now(),
                      clientEmail: t.clientEmail,
                      clientName: t.clientName || 'Client',
                      sender: (t.lastSender as any) || 'client',
                      message: t.lastMessage,
                      createdAt: t.lastMessageAt || new Date().toISOString(),
                    }]
                  : [];
              map.set(key, { ...t, messages });
            }
          }
        });
        const result = Array.from(map.values());
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
        } catch {}
        return result;
      }
    }
  } catch (e) {
    console.warn('Error reading stored threads:', e);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(REAL_DEFAULT_THREADS));
  } catch {}
  return REAL_DEFAULT_THREADS;
}

export function getStoredThreadByEmail(email: string): ClientThread | null {
  const normEmail = email.toLowerCase().trim();
  const all = getAllStoredThreads();
  const found = all.find((t) => t.clientEmail.toLowerCase().trim() === normEmail);
  if (found) {
    // If messages array is somehow empty but lastMessage exists, populate it!
    if (found.messages.length === 0 && found.lastMessage) {
      found.messages = [{
        id: Date.now(),
        clientEmail: found.clientEmail,
        clientName: found.clientName || 'Client',
        sender: (found.lastSender as any) || 'client',
        message: found.lastMessage,
        createdAt: found.lastMessageAt || new Date().toISOString(),
      }];
    }
    return found;
  }

  const defaultFound = REAL_DEFAULT_THREADS.find((t) => t.clientEmail.toLowerCase().trim() === normEmail);
  return defaultFound || null;
}

export function saveStoredMessage(
  clientEmail: string,
  clientName: string,
  sender: 'client' | 'admin',
  messageText: string,
  inquiryId?: number | null
): ChatMessage {
  const normEmail = clientEmail.toLowerCase().trim();
  const all = getAllStoredThreads();
  let threadIndex = all.findIndex((t) => t.clientEmail.toLowerCase().trim() === normEmail);

  const newMsg: ChatMessage = {
    id: Date.now(),
    inquiryId: inquiryId || null,
    clientEmail: normEmail,
    clientName: clientName || (sender === 'admin' ? 'Moeez (Owner)' : 'Client'),
    sender,
    message: messageText.trim(),
    createdAt: new Date().toISOString(),
  };

  if (threadIndex >= 0) {
    all[threadIndex].messages.push(newMsg);
    all[threadIndex].lastMessage = newMsg.message;
    all[threadIndex].lastMessageAt = newMsg.createdAt;
    all[threadIndex].lastSender = sender;
    if (clientName && all[threadIndex].clientName === 'Client') {
      all[threadIndex].clientName = clientName;
    }
  } else {
    const newThread: ClientThread = {
      clientEmail: normEmail,
      clientName: clientName || 'Client',
      service: 'General Inquiry',
      budget: 'Flexible',
      inquiryId: inquiryId || undefined,
      lastMessage: newMsg.message,
      lastMessageAt: newMsg.createdAt,
      lastSender: sender,
      messages: [newMsg],
    };
    all.unshift(newThread);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }

  // Notify components across window/tabs
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('moeez_inbox_updated', { detail: { email: normEmail, message: newMsg } }));
  }

  return newMsg;
}
