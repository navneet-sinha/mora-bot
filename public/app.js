// Handles the form submission, calls the backend API, and renders the response.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('send-form');
  const responseSection = document.getElementById('response');
  const messageTypeSelect = document.getElementById('messageType');
  const textFields = document.getElementById('text-fields');
  const messageInput = document.getElementById('message');
  const templateFields = document.getElementById('template-fields');
  const templateParamsInput = document.getElementById('templateParams');
  const templateNameInput = document.getElementById('templateName');
  const templateLanguageCodeInput = document.getElementById('templateLanguageCode');

  function toggleFields() {
    const type = messageTypeSelect.value;
    const isTemplate = type === 'template';

    textFields.classList.toggle('hidden', isTemplate);
    messageInput.toggleAttribute('required', !isTemplate);

    templateFields.classList.toggle('hidden', !isTemplate);
  }

  function renderStatus(type, message, payload) {
    const pre = payload ? `<pre>${JSON.stringify(payload, null, 2)}</pre>` : '';
    responseSection.innerHTML = `
      <div class="${type}">
        <p>${message}</p>
        ${pre}
      </div>
    `;
  }

  function parseTemplateParams(value) {
    if (!value) {
      return [];
    }
    return value
      .split(',')
      .map((param) => param.trim())
      .filter(Boolean);
  }

  messageTypeSelect.addEventListener('change', toggleFields);
  toggleFields();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const type = formData.get('type');

    const payload = {
      phoneNumber: formData.get('phoneNumber'),
      type,
    };

    if (type === 'template') {
      const templateName = templateNameInput.value.trim();
      const templateLanguageCode = templateLanguageCodeInput.value.trim();

      if (templateName) {
        payload.templateName = templateName;
      }
      if (templateLanguageCode) {
        payload.templateLanguageCode = templateLanguageCode;
      }

      payload.templateParams = parseTemplateParams(templateParamsInput.value);
    } else {
      payload.message = formData.get('message');
    }

    renderStatus('info', 'Sending message...');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        renderStatus('success', 'Message sent successfully!', result.data);
        form.reset();
        toggleFields();
      } else {
        renderStatus('error', 'Failed to send message.', result.errors ?? result);
      }
    } catch (error) {
      renderStatus('error', 'Unexpected error while sending message.', {
        message: error.message,
      });
    }
  });
});
