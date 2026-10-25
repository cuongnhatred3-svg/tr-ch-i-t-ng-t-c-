import express from 'express';
import { createServer as createViteServer } from 'vite';
import https from 'https';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Dedicated Vietnamese Female Teacher TTS Proxy
  // Returns crystal-clear Vietnamese audio from Google's high quality Vietnamese speech engine
  app.get('/api/tts', (req, res) => {
    const text = (req.query.text as string) || '';
    if (!text.trim()) {
      res.status(400).send('Missing text query');
      return;
    }

    const cleanText = text.trim().slice(0, 250);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

    const request = https.get(ttsUrl, (ttsRes) => {
      if (ttsRes.statusCode !== 200) {
        res.status(502).send('TTS service unavailable');
        return;
      }
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      ttsRes.pipe(res);
    });

    request.on('error', (err) => {
      console.error('TTS Request Error:', err);
      res.status(500).send('Error fetching speech');
    });
  });

  // Create Vite dev server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  // Mount Vite middlewares
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
