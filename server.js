const path = require('path');
const express = require('express');
const { loadConfig } = require('./src/config');
const { createMessageRouter } = require('./src/routes/messageRoutes');

/**
 * Builds an Express application wired with static UI assets and the API router.
 */
function createApp(config) {
  const app = express();
  const publicDir = path.join(__dirname, 'public');

  // Parse JSON request bodies and serve the lightweight frontend bundle.
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(publicDir));

  // API route for sending WhatsApp messages.
  app.use('/api/messages', createMessageRouter(config));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Fallback to the UI for unmatched routes so the form is always accessible.
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });

  // Central error handler normalises errors coming from axios/validation.
  app.use((error, _req, res, _next) => {
    const status = error.response?.status ?? 500;
    const apiMessage = error.response?.data?.error?.message;
    const message = apiMessage || error.message || 'Unexpected error occurred.';
    res.status(status).json({ success: false, errors: [message] });
  });

  return app;
}

if (require.main === module) {
  const config = loadConfig();
  const app = createApp(config);
  const port = config.port;

  app.listen(port, () => {
    console.log(`Mora server listening on port ${port}`);
  });
}

module.exports = { createApp };
