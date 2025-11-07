/**
 * Validates incoming payloads for the WhatsApp send endpoint.
 */
function validateMessagePayload(payload = {}) {
  const errors = [];
  const rawPhone = typeof payload.phoneNumber === 'string' ? payload.phoneNumber.trim() : '';
  const rawMessage = typeof payload.message === 'string' ? payload.message.trim() : '';

  if (!rawPhone) {
    errors.push('phoneNumber is required.');
  } else if (!/^\+?\d{7,15}$/.test(rawPhone)) {
    errors.push('phoneNumber must contain only digits and may start with a plus sign.');
  }

  if (!rawMessage) {
    errors.push('message is required.');
  }

  return {
    errors,
    value: {
      phoneNumber: rawPhone,
      message: rawMessage,
    },
  };
}

module.exports = { validateMessagePayload };
