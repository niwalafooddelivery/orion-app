# Orion AI Assistant — Setup Guide

This package has everything needed to run Orion as a real website that
anyone can use.

## What's inside
- `public/index.html` — the chat interface (your frontend)
- `server.js` — backend that securely talks to Anthropic's API
- `package.json` — list of required packages
- `.env.example` — template for your secret API key

---

## STEP 1 — Get an Anthropic API key
1. Go to https://console.anthropic.com/settings/keys
2. Sign up / log in, add billing (pay-as-you-go)
3. Click "Create Key" and copy it (starts with `sk-ant-...`)

## STEP 2 — Install Node.js (if not already installed)
Download from https://nodejs.org (choose the LTS version) and install it.

## STEP 3 — Set up the project on your computer
1. Unzip this folder anywhere, e.g. `Desktop/orion-app`
2. Open a terminal / command prompt inside that folder
3. Run:
   ```
   npm install
   ```
4. Copy `.env.example` to a new file named `.env`
5. Open `.env` and paste your real API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-real-key-here
   ```

## STEP 4 — Run it locally (test on your own computer first)
```
npm start
```
Then open your browser to: **http://localhost:3000**

If "hi" gets a real response — it's working! 🎉

---

## STEP 5 — Put it on the internet (so anyone can use it)

The easiest free option is **Render.com**:

1. Create a free account at https://render.com
2. Push this project to a GitHub repository (create a repo, upload these files)
3. In Render, click **New → Web Service**, connect your GitHub repo
4. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Under **Environment Variables**, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your real key
6. Click **Deploy**

After a few minutes, Render gives you a public URL like:
`https://orion-yourname.onrender.com`

Share that link with anyone — the app will work for them too, and your
API key stays hidden on the server the whole time (never visible in the
browser).

---

## Notes
- Your API key must NEVER be pasted directly into `index.html` or any
  frontend file — always keep it only in `.env` (or in Render's
  environment variable settings).
- Anthropic API usage is billed based on how much people chat — keep an
  eye on usage at https://console.anthropic.com
- If many people will use this, consider adding rate-limiting or a
  login system later to prevent abuse of your API credits.
