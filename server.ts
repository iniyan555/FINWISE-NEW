import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { handleFinWiseChat } from './server/finwiseService.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '1mb' }));

  // API route for FinWise AI Chat
  app.post('/api/finwise-chat', async (req, res) => {
    try {
      const { question, financialContext, conversationHistory } = req.body;

      if (!question || typeof question !== 'string' || !question.trim()) {
        return res.status(400).json({ error: 'Question is required' });
      }

      const result = await handleFinWiseChat({
        question: question.trim(),
        financialContext: financialContext || {},
        conversationHistory: Array.isArray(conversationHistory) ? conversationHistory : [],
      });

      return res.json(result);
    } catch (error: any) {
      console.error('Unhandled error in /api/finwise-chat:', error?.message || error);
      return res.status(200).json({
        answer: "I'm having trouble analyzing that right now. Please try again.",
        breakdown: ['We experienced an unexpected error while processing your request.'],
      });
    }
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'finwise-ai' });
  });

  // Vite middleware for development vs static build serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FinWise server running on http://localhost:${PORT}`);
  });
}

startServer();
