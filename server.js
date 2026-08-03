// Orion AI Assistant — Backend Server
// This server keeps your Google Gemini API key secret and safely
// forwards chat requests from the website to the Gemini API.

const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('❌ ERROR: GEMINI_API_KEY is not set.');
  console.error('   Create a .env file (see .env.example) and add your key there.');
  process.exit(1);
}

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;

app.use(express.json());

// Serve the frontend (index.html and any other static files)
aapp.use(express.static(__dirname));

// Proxy endpoint: browser calls THIS, server calls Gemini with the secret key
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Convert our simple {role, content} history into Gemini's format
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(response.status).json(data);
    }

    // Extract the reply text from Gemini's response shape
    const replyText =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n') ||
      "I wasn't able to generate a response. Please try again.";

    // Send back in the same shape the frontend expects
    res.json({ content: [{ type: 'text', text: replyText }] });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Orion server running at http://localhost:${PORT}`);
});
