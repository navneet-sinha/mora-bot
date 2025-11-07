// Handles the form submission, calls the backend API, and renders the response.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('send-form');
  const responseSection = document.getElementById('response');

  function renderStatus(type, message, payload) {
    const pre = payload ? `<pre>${JSON.stringify(payload, null, 2)}</pre>` : '';
    responseSection.innerHTML = `
      <div class="${type}">
        <p>${message}</p>
        ${pre}
      </div>
    `;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = {
      phoneNumber: formData.get('phoneNumber'),
      message: formData.get('message'),
    };

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
