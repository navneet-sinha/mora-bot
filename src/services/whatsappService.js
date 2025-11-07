const axios = require('axios');

/**
 * Factory that returns a WhatsApp Cloud API client bound to the provided configuration.
 */
function createWhatsappService({
  accessToken,
  phoneNumberId,
  graphApiVersion,
  templateName,
  templateLanguageCode,
}) {
  const apiUrl = `https://graph.facebook.com/${graphApiVersion}/${phoneNumberId}/messages`;
  const defaultHeaders = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  async function sendTextMessage({ phoneNumber, message }) {
    const payload = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: { body: message },
    };

    const response = await axios.post(apiUrl, payload, { headers: defaultHeaders });
    return response.data;
  }

  async function sendTemplateMessage({
    phoneNumber,
    templateParams,
    templateName: overrideTemplateName,
    templateLanguageCode: overrideLanguageCode,
  }) {
    const resolvedTemplateName = overrideTemplateName || templateName;
    const resolvedLanguageCode = overrideLanguageCode || templateLanguageCode;

    const payload = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'template',
      template: {
        name: resolvedTemplateName,
        language: {
          code: resolvedLanguageCode,
        },
      },
    };

    if (templateParams.length > 0) {
      payload.template.components = [
        {
          type: 'body',
          parameters: templateParams.map((value) => ({ type: 'text', text: value })),
        },
      ];
    }

    const response = await axios.post(apiUrl, payload, { headers: defaultHeaders });
    return response.data;
  }

  return {
    sendTextMessage,
    sendTemplateMessage,
  };
}

module.exports = { createWhatsappService };
