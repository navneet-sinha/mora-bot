# Mora WhatsApp Sender

This project is a compact WhatsApp Cloud API sender that ships with a friendly web UI, an Express backend, and Heroku-ready configuration. Everything is written in modular, functional JavaScript so new contributors can understand the flow quickly.

## Prerequisites

- Node.js 18+
- A WhatsApp Cloud API account with:
  - Permanent access token
  - Phone number ID
  - API version (for example `v21.0`)

## Configuration

1. Copy `.env.example` to `.env`.
2. Fill in the WhatsApp credentials (never commit the real values).

```bash
cp .env.example .env
```

## Local Development

```bash
npm install
npm run dev
```

Navigate to `http://localhost:3000`, enter a phone number and message, then press **Send Message**. The UI will display the response JSON that comes back from the WhatsApp Cloud API.

## Deploying to Heroku

```bash
heroku login
heroku create mora-bot # pick any unique name
git push heroku main
heroku ps:scale web=1
heroku open
```

Heroku reads the `Procfile` and starts the Express server with your environment variables configured on the platform.

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
| `public/` | Simple HTML/JS UI that collects the phone number and message, then renders the API response. |
| `server.js` | Bootstraps the Express app, serves the UI, and wires routes/error handling. |
| `src/config.js` | Loads environment variables so secrets stay outside version control. |
| `src/routes/messageRoutes.js` | Request validation and HTTP response handling for WhatsApp sends. |
| `src/services/whatsappService.js` | Axios-based WhatsApp Cloud API client. |
| `src/validators/messageValidator.js` | Ensures inputs contain a phone number and message. |

Extend the service, add tests, or plug in persistence as needed—the modular layout should make enhancements straightforward.
