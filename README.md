# Mora WhatsApp Sender

This project is a compact WhatsApp Cloud API sender that ships with a friendly web UI, an Express backend, and Heroku-ready configuration. Everything is written in modular, functional JavaScript so new contributors can understand the flow quickly.

## Prerequisites

- Node.js 18+
- A WhatsApp Cloud API account with:
  - Permanent access token
  - Phone number ID
  - Approved template name (for template sends)
  - API version (for example `v21.0`)

## Configuration

1. Copy `.env.example` to `.env`.
2. Fill in the WhatsApp credentials (never commit the real values).

```bash
cp .env.example .env
```

| Variable | Purpose |
| --- | --- |
| `WHATSAPP_ACCESS_TOKEN` | Long-lived or system user token used for API calls. |
| `WHATSAPP_PHONE_NUMBER_ID` | The phone number ID assigned to your WhatsApp Business account. |
| `WHATSAPP_GRAPH_API_VERSION` | Optional graph version (defaults to `v21.0`). |
| `WHATSAPP_TEMPLATE_NAME` | Default template to send when UI is set to “Template”. |
| `WHATSAPP_TEMPLATE_LANGUAGE_CODE` | Default language/locale for template sends (defaults to `en_US`). |
| `PORT` | Port for the local Express server (defaults to `3000`). |

## Local Development

```bash
npm install
npm run dev
```

Navigate to `http://localhost:3000`, enter a phone number, choose **Text** or **Template**, and press **Send Message**. The UI displays the response JSON from the WhatsApp Cloud API so you can check IDs and errors quickly.

- **Text** messages require an active customer session (the contact must have messaged you in the last 24 hours).
- **Template** messages use the defaults from `.env`, but you can override the template name and language in the form if you want to send a different approved template. Supply comma-separated parameters if the template body expects them (leave blank if not).

## Deploying to Heroku

```bash
heroku login
heroku create mora-bot # pick any unique name
git push heroku main
heroku ps:scale web=1
heroku open
```

Set the same environment variables on Heroku (e.g., `heroku config:set WHATSAPP_ACCESS_TOKEN=...`).

## Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial WhatsApp sender"
git remote add origin https://github.com/<username>/mora.git
git push -u origin main
```

## Project Structure

| Path | Description |
| --- | --- |
| `public/` | Simple HTML/JS UI that collects the phone number, message type, overrides, and parameters, then renders the API response. |
| `server.js` | Bootstraps the Express app, serves the UI, and wires routes/error handling. |
| `src/config.js` | Loads environment variables so secrets stay outside version control. |
| `src/routes/messageRoutes.js` | Request validation and HTTP response handling for WhatsApp sends. |
| `src/services/whatsappService.js` | Axios-based WhatsApp Cloud API client supporting text and template sends with overrides. |
| `src/validators/messageValidator.js` | Ensures inputs contain a phone number and the appropriate fields for text vs template sends. |

Extend the service, add tests, or plug in persistence as needed—the modular layout should make enhancements straightforward.
