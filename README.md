# Mora Node.js App

This is a minimal Express application ready to deploy to Heroku and push to GitHub.

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:3000` to view the JSON response.

## Production Build / Heroku

1. Create a Heroku app (replace `mora-app` with your preferred unique name):
   ```bash
   heroku create mora-app
   ```
2. Deploy via Git:
   ```bash
   git push heroku main
   ```
3. Scale the dyno and open the app:
   ```bash
   heroku ps:scale web=1
   heroku open
   ```

## GitHub Workflow

```bash
git init
npm install
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<username>/mora.git
git push -u origin main
```

Feel free to expand the routes, add tests, or wire up a frontend.
