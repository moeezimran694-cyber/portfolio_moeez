import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createInquiry, getInquiries } from './src/db/inquiries.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API: Create new client inquiry & store in Cloud SQL
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
