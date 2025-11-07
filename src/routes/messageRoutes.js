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
      let data;
      if (value.type === 'template') {
        const resolvedTemplateName =
          value.templateName || config.whatsapp.templateName;
        const resolvedLanguageCode =
          value.templateLanguageCode || config.whatsapp.templateLanguageCode;

        if (!resolvedTemplateName) {
          throw new Error(
            'Template name is required either in configuration or request payload.',
          );
        }

        assertWhatsappConfig(
          {
            ...config,
            whatsapp: {
              ...config.whatsapp,
              templateName: resolvedTemplateName,
              templateLanguageCode: resolvedLanguageCode,
            },
          },
          { requireTemplate: true },
        );

        data = await whatsappClient.sendTemplateMessage({
          phoneNumber: value.phoneNumber,
          templateParams: value.templateParams,
          templateName: resolvedTemplateName,
          templateLanguageCode: resolvedLanguageCode,
        });
      } else {
        assertWhatsappConfig(config);
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
