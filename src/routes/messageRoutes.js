const express = require('express');
const { validateMessagePayload } = require('../validators/messageValidator');
const { createWhatsappService } = require('../services/whatsappService');
const { assertWhatsappConfig } = require('../config');

/**
 * Builds the /api/messages router with injected configuration so that
 * the logic remains testable and free from global state.
 */
function createMessageRouter(config) {
  const router = express.Router();

  router.post('/', async (req, res, next) => {
    const { errors, value } = validateMessagePayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    try {
      assertWhatsappConfig(config);
      const whatsappClient = createWhatsappService(config.whatsapp);
      const data = await whatsappClient.sendTextMessage(value);
      return res.json({ success: true, data });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

module.exports = { createMessageRouter };
