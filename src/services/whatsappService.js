const axios = require('axios');

/**
 * Factory that returns a WhatsApp Cloud API client bound to the provided configuration.
 */
function createWhatsappService({ accessToken, phoneNumberId, graphApiVersion }) {
  const apiUrl = `https://graph.facebook.com/${graphApiVersion}/${phoneNumberId}/messages`;

  async function sendTextMessage({ phoneNumber, message }) {
    const payload = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: { body: message },
    };

    const response = await axios.post(apiUrl, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }

  return {
    sendTextMessage,
  };
}

module.exports = { createWhatsappService };
