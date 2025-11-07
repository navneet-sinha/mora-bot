/**
 * Validates incoming payloads for the WhatsApp send endpoint.
 */
function validateMessagePayload(payload = {}) {
  const errors = [];

  const rawPhone =
    typeof payload.phoneNumber === 'string' ? payload.phoneNumber.trim() : '';
  const rawType =
    typeof payload.type === 'string' ? payload.type.trim().toLowerCase() : 'text';

  const messageType = rawType === 'template' ? 'template' : 'text';

  if (!rawPhone) {
    errors.push('phoneNumber is required.');
  } else if (!/^\+?\d{7,15}$/.test(rawPhone)) {
    errors.push('phoneNumber must contain only digits and may start with a plus sign.');
  }

  let message = '';
  let templateName = '';
  let templateLanguageCode = '';
  if (messageType === 'text') {
    message = typeof payload.message === 'string' ? payload.message.trim() : '';
    if (!message) {
      errors.push('message is required when sending a text message.');
    }
  } else {
    templateName =
      typeof payload.templateName === 'string' ? payload.templateName.trim() : '';
    templateLanguageCode =
      typeof payload.templateLanguageCode === 'string'
        ? payload.templateLanguageCode.trim()
        : '';
  }

  let templateParams = [];
  if (messageType === 'template') {
    if (Array.isArray(payload.templateParams)) {
      templateParams = payload.templateParams
        .map((value) => (typeof value === 'string' ? value.trim() : String(value)))
        .filter(Boolean);
    } else if (typeof payload.templateParams === 'string') {
      templateParams = payload.templateParams
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
    } else if (payload.templateParams != null) {
      errors.push('templateParams must be an array or comma separated string.');
    }
  }

  return {
    errors,
    value: {
      phoneNumber: rawPhone,
      type: messageType,
      message,
      templateParams,
      templateName,
      templateLanguageCode,
    },
  };
}

module.exports = { validateMessagePayload };
