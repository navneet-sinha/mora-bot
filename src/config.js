const path = require('path');
const dotenv = require('dotenv');

let cachedConfig = null;

/**
 * Loads configuration values from environment variables so secrets stay out of version control.
 */
function loadConfig() {
  if (cachedConfig) {
    return cachedConfig;
  }

  dotenv.config({ path: path.resolve(process.cwd(), '.env') });

  const config = {
    port: Number(process.env.PORT ?? 3000),
    whatsapp: {
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
      graphApiVersion: process.env.WHATSAPP_GRAPH_API_VERSION ?? 'v21.0',
    },
  };

  cachedConfig = config;
  return config;
}

/**
 * Ensures we have the required WhatsApp credentials before attempting to send messages.
 */
function assertWhatsappConfig(config) {
  const missingKeys = Object.entries(config.whatsapp)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing WhatsApp Cloud API configuration: ${missingKeys.join(', ')}`,
    );
  }
}

module.exports = { loadConfig, assertWhatsappConfig };
