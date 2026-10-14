import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createInquiry, getInquiries } from './src/db/inquiries.ts';
import { getAllProjects, insertOrUpdateProject, deleteProjectById } from './src/db/projects.ts';
import { getSettingsMap, saveSetting } from './src/db/settings.ts';
import { addMessage, getMessagesByClientEmail, getAllThreads } from './src/db/messages.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'moeezimran786';

app.use(express.json());

// API: Admin Authentication
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ 
      success: true, 
      token: `admin_token_${Buffer.from(ADMIN_PASSWORD).toString('base64')}_${Date.now()}` 
    });
  }
  return res.status(401).json({ error: 'Incorrect control panel password' });
});

// API: Get all live projects
app.get('/api/projects', async (_req, res) => {
  try {
    const list = await getAllProjects();
    return res.json({ success: true, projects: list });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// API: Add or Update Project
app.post('/api/projects', async (req, res) => {
  try {
    const { 
      projectId, title, tagline, category, status, image, 
      shortDescription, fullDescription, clientContext, 
      tools, keyFeatures, liveUrl, githubUrl 
    } = req.body;

    if (!title || !category || !shortDescription) {
      return res.status(400).json({ error: 'Missing required project fields: title, category, shortDescription' });
    }

    const saved = await insertOrUpdateProject({
      projectId: projectId || `proj_${Date.now()}`,
      title: String(title).trim(),
      tagline: tagline ? String(tagline).trim() : null,
      category: String(category).trim(),
      status: status || 'Live Project',
      image: image ? String(image).trim() : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      shortDescription: String(shortDescription).trim(),
      fullDescription: fullDescription ? String(fullDescription).trim() : String(shortDescription).trim(),
      clientContext: clientContext ? String(clientContext).trim() : null,
      tools: Array.isArray(tools) ? tools : ['Web Development', 'UI/UX'],
      keyFeatures: Array.isArray(keyFeatures) ? keyFeatures : ['Production ready deployment'],
      liveUrl: liveUrl ? String(liveUrl).trim() : null,
      githubUrl: githubUrl ? String(githubUrl).trim() : null,
      demoType: 'real-project',
    });

    return res.status(201).json({ success: true, project: saved });
  } catch (error: any) {
    console.error('Error saving project:', error);
    return res.status(500).json({ error: 'Failed to save project' });
  }
});

// API: Delete Project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteProjectById(id);
    return res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ error: 'Failed to delete project' });
  }
});

// API: Site Settings
app.get('/api/settings', async (_req, res) => {
  try {
    const map = await getSettingsMap();
    return res.json({ success: true, settings: map });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const { settings } = req.body;
    if (typeof settings === 'object' && settings !== null) {
      for (const [k, v] of Object.entries(settings)) {
        await saveSetting(k, String(v));
      }
    }
    return res.json({ success: true });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return res.status(500).json({ error: 'Failed to save settings' });
  }
});

// API: Create new client inquiry & seed conversation thread
app.post('/api/inquiries', async (req, res) => {
  try {
    const { fullName, email, company, service, budget, details } = req.body;

    if (!fullName || !email || !service || !details) {
      return res.status(400).json({ error: 'Missing required fields: fullName, email, service, details' });
    }

    const savedInquiry = await createInquiry({
      fullName: String(fullName).trim(),
      email: String(email).trim(),
      company: company ? String(company).trim() : undefined,
      service: String(service).trim(),
      budget: budget ? String(budget).trim() : undefined,
      details: String(details).trim(),
    });

    // Also add to conversation thread so Admin has immediate reply capability
    await addMessage({
      inquiryId: savedInquiry.id,
      clientEmail: String(email).trim(),
      clientName: String(fullName).trim(),
      sender: 'client',
      message: String(details).trim(),
    });

    return res.status(201).json({ success: true, inquiry: savedInquiry });
  } catch (error: any) {
    console.error('Error handling inquiry submission:', error);
    return res.status(500).json({ error: 'Internal server error while saving inquiry' });
  }
});

// API: Get recent inquiries
app.get('/api/inquiries', async (_req, res) => {
  try {
    const list = await getInquiries();
    return res.json({ success: true, inquiries: list });
  } catch (error: any) {
    console.error('Error fetching inquiries:', error);
    return res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// ==========================================
// INBOX & THREADS API (Separate Inbox Per Client)
// ==========================================

// Get all client conversation threads
app.get('/api/inbox/threads', async (_req, res) => {
  try {
    const threads = await getAllThreads();
    return res.json({ success: true, threads });
  } catch (error: any) {
    console.error('Error fetching threads:', error);
    return res.status(500).json({ error: 'Failed to fetch threads' });
  }
});

// Get messages for a specific client thread
app.get('/api/inbox/thread/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const messages = await getMessagesByClientEmail(email);
    return res.json({ success: true, messages });
  } catch (error: any) {
    console.error('Error fetching messages for thread:', error);
    return res.status(500).json({ error: 'Failed to fetch thread messages' });
  }
});

// Admin sends reply to client thread
app.post('/api/inbox/reply', async (req, res) => {
  try {
    const { clientEmail, clientName, message, inquiryId } = req.body;
    if (!clientEmail || !message) {
      return res.status(400).json({ error: 'Missing clientEmail or message' });
    }

    const saved = await addMessage({
      inquiryId: inquiryId ? Number(inquiryId) : null,
      clientEmail: String(clientEmail).trim(),
      clientName: clientName ? String(clientName).trim() : 'Client',
      sender: 'admin',
      message: String(message).trim(),
    });

    return res.status(201).json({ success: true, message: saved });
  } catch (error: any) {
    console.error('Error saving admin reply:', error);
    return res.status(500).json({ error: 'Failed to save reply' });
  }
});

// Client sends follow-up message to Moeez
app.post('/api/inbox/client-message', async (req, res) => {
  try {
    const { clientEmail, clientName, message, inquiryId } = req.body;
    if (!clientEmail || !message) {
      return res.status(400).json({ error: 'Missing clientEmail or message' });
    }

    const saved = await addMessage({
      inquiryId: inquiryId ? Number(inquiryId) : null,
      clientEmail: String(clientEmail).trim(),
      clientName: clientName ? String(clientName).trim() : 'Client',
      sender: 'client',
      message: String(message).trim(),
    });

    return res.status(201).json({ success: true, message: saved });
  } catch (error: any) {
    console.error('Error saving client follow-up message:', error);
    return res.status(500).json({ error: 'Failed to save message' });
  }
});

// Vite Middleware for Development / Static Hosting for Production
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

setupServer();
