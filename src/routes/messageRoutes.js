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
  const whatsappClient = createWhatsappService(config.whatsapp);

  router.post('/', async (req, res, next) => {
    const { errors, value } = validateMessagePayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    try {
      assertWhatsappConfig(config, {
        requireTemplate: value.type === 'template',
      });

      let data;
      if (value.type === 'template') {
        data = await whatsappClient.sendTemplateMessage({
          phoneNumber: value.phoneNumber,
          templateParams: value.templateParams,
        });
      } else {
        data = await whatsappClient.sendTextMessage({
          phoneNumber: value.phoneNumber,
          message: value.message,
        });
      }

      return res.json({ success: true, data });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

module.exports = { createMessageRouter };
