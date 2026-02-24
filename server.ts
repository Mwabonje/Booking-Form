import express from 'express';
import { createServer as createViteServer } from 'vite';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Rate limiter: 100 requests per hour per IP
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 requests per `window` (here, per hour)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: "Too many requests, please try again later." }
});

app.use(express.json());
app.use(cors());

// Apply rate limiting to API routes
app.use('/api/', limiter);

app.post('/api/refine-message', async (req, res) => {
  const { draftMessage, subject } = req.body;

  if (!draftMessage || !subject) {
    return res.status(400).json({ error: 'Missing draftMessage or subject' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

  if (!apiKey) {
     console.warn("API Key not found.");
     return res.status(500).json({ error: 'Server configuration error' });
  }

  // Basic sanitization
  const sanitizedDraft = String(draftMessage).replace(/[{}]/g, '').trim();
  const sanitizedSubject = String(subject).replace(/[{}]/g, '').trim();

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      You are a helpful assistant for "Mwabonje", a high-end photography business. 
      Refine the following user inquiry to be more professional, polite, and concise, while keeping the original intent.
      The inquiry is about: ${sanitizedSubject}.
      
      User's rough draft: "${sanitizedDraft}"
      
      Return ONLY the refined message text. Do not add quotes or conversational filler.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const refinedMessage = response.text?.trim() || draftMessage;
    res.json({ refinedMessage });
  } catch (error) {
    console.error("Error refining message with Gemini:", error);
    res.status(500).json({ error: 'Failed to refine message' });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
