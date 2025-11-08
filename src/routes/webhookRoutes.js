const express = require('express');

/**
 * Creates the webhook router that handles the WhatsApp Cloud API callbacks.
 * The GET handler responds to the initial verification handshake required by Meta,
 * while the POST handler surfaces inbound messages and status updates.
 */
function createWebhookRouter(config) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === config.whatsapp.webhookVerifyToken) {
      return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
  });

  router.post('/', (req, res) => {
    // For now, just log the payload. In production you might persist it or trigger downstream workflows.
    console.log('Received WhatsApp webhook event:', JSON.stringify(req.body, null, 2));
    return res.sendStatus(200);
  });

  return router;
}

module.exports = { createWebhookRouter };
