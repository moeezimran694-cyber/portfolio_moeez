import express from 'express';

const app = express();
app.use(express.json({ limit: '15mb' }));

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'moeezimran786';

interface ServerlessChatMessage {
  id: number;
  inquiryId?: number | null;
  clientEmail: string;
  clientName: string;
  sender: 'client' | 'admin';
  message: string;
  createdAt: string;
}

interface ServerlessThread {
  clientEmail: string;
  clientName: string;
  company?: string | null;
  service: string;
  budget?: string | null;
  inquiryId?: number | null;
  lastMessage: string;
  lastMessageAt: string;
  lastSender: string;
  messages: ServerlessChatMessage[];
}

// Real default projects
const REAL_PROJECTS = [
  {
    id: 'proj_muscle_empire',
    title: 'Muscle Empire',
    tagline: 'Modern & Responsive Gym & Fitness Platform',
    category: 'Websites',
    status: 'Live Project',
    image: 'https://cdn.phototourl.com/member/2026-10-17-6162ede1-4b38-48a7-9a83-e8c2d3c4252c.png',
    shortDescription: 'A modern and responsive gym website designed to showcase fitness services, workout programs, and membership options with a premium user experience.',
    fullDescription: 'A modern and responsive gym website designed to showcase fitness services, workout programs, and membership options with a premium user experience.',
    clientContext: 'Fitness & Gym Industry',
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    keyFeatures: [
      'Modern and premium UI/UX design',
      'Responsive desktop and mobile layout',
      'Fitness programs and workout sections',
      'Gym facilities showcase',
      'Membership plans and service details',
      'Interactive navigation and call-to-action buttons',
      'Contact and membership enquiry options',
    ],
    liveUrl: 'https://muscleempire.vercel.app/',
    githubUrl: null,
    demoType: 'real-project',
    mediaType: 'website',
    videoUrl: null,
  },
];

// In-memory conversation threads for Vercel serverless execution
let memoryThreads: ServerlessThread[] = [
  {
    clientEmail: 'moeezi396@gmail.com',
    clientName: 'Client',
    company: null,
    service: 'General Inquiry',
    budget: 'Flexible',
    inquiryId: null,
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
];

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, token: 'admin_token_' + Date.now() });
  }
  return res.status(401).json({ error: 'Incorrect password' });
});

// Projects
app.get('/api/projects', (_req, res) => {
  return res.json({ success: true, projects: REAL_PROJECTS });
});

app.post('/api/projects', (req, res) => {
  const newProj = { ...req.body, id: req.body.projectId || `proj_${Date.now()}` };
  REAL_PROJECTS.unshift(newProj);
  return res.status(201).json({ success: true, project: newProj, allProjects: REAL_PROJECTS });
});

// Inbox Threads
app.get('/api/inbox/threads', (_req, res) => {
  return res.json({ success: true, threads: memoryThreads });
});

app.get('/api/inbox/thread/:email', (req, res) => {
  const email = decodeURIComponent(req.params.email || '').toLowerCase().trim();
  const thread = memoryThreads.find((t) => t.clientEmail.toLowerCase() === email);
  return res.json({ success: true, messages: thread ? thread.messages : [] });
});

app.post('/api/inbox/client-message', (req, res) => {
  const { clientEmail, clientName, message, inquiryId } = req.body;
  if (!clientEmail || !message) {
    return res.status(400).json({ error: 'Missing clientEmail or message' });
  }

  const normEmail = String(clientEmail).trim().toLowerCase();
  const newMsg: ServerlessChatMessage = {
    id: Date.now(),
    inquiryId: inquiryId || null,
    clientEmail: normEmail,
    clientName: clientName || 'Client',
    sender: 'client',
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
  };

  const thread = memoryThreads.find((t) => t.clientEmail.toLowerCase() === normEmail);
  if (thread) {
    thread.messages.push(newMsg);
    thread.lastMessage = newMsg.message;
    thread.lastMessageAt = newMsg.createdAt;
    thread.lastSender = 'client';
  } else {
    memoryThreads.unshift({
      clientEmail: normEmail,
      clientName: clientName || 'Client',
      company: null,
      service: 'General Inquiry',
      budget: 'Flexible',
      inquiryId: inquiryId || null,
      lastMessage: newMsg.message,
      lastMessageAt: newMsg.createdAt,
      lastSender: 'client',
      messages: [newMsg],
    });
  }

  return res.status(201).json({ success: true, message: newMsg });
});

app.post('/api/inbox/reply', (req, res) => {
  const { clientEmail, clientName, message, inquiryId } = req.body;
  if (!clientEmail || !message) {
    return res.status(400).json({ error: 'Missing clientEmail or message' });
  }

  const normEmail = String(clientEmail).trim().toLowerCase();
  const newMsg: ServerlessChatMessage = {
    id: Date.now(),
    inquiryId: inquiryId || null,
    clientEmail: normEmail,
    clientName: clientName || 'Client',
    sender: 'admin',
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
  };

  const thread = memoryThreads.find((t) => t.clientEmail.toLowerCase() === normEmail);
  if (thread) {
    thread.messages.push(newMsg);
    thread.lastMessage = newMsg.message;
    thread.lastMessageAt = newMsg.createdAt;
    thread.lastSender = 'admin';
  }

  return res.status(201).json({ success: true, message: newMsg });
});

app.post('/api/inquiries', (req, res) => {
  const { fullName, email, details } = req.body;
  if (!email || !details) {
    return res.status(400).json({ error: 'Missing email or details' });
  }

  const normEmail = String(email).trim().toLowerCase();
  const newMsg: ServerlessChatMessage = {
    id: Date.now(),
    inquiryId: null,
    clientEmail: normEmail,
    clientName: fullName || 'Client',
    sender: 'client',
    message: String(details).trim(),
    createdAt: new Date().toISOString(),
  };

  const thread = memoryThreads.find((t) => t.clientEmail.toLowerCase() === normEmail);
  if (thread) {
    thread.messages.push(newMsg);
  } else {
    memoryThreads.unshift({
      clientEmail: normEmail,
      clientName: fullName || 'Client',
      company: req.body.company || null,
      service: req.body.service || 'General Inquiry',
      budget: req.body.budget || 'Flexible',
      inquiryId: null,
      lastMessage: newMsg.message,
      lastMessageAt: newMsg.createdAt,
      lastSender: 'client',
      messages: [newMsg],
    });
  }

  return res.status(201).json({ success: true, inquiry: { id: Date.now(), ...req.body } });
});

export default app;
