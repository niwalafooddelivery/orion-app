// Orion AI Assistant — Backend Server
// This server keeps your Groq API key secret and safely
// forwards chat requests from the website to the Groq API.

const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GROQ_API_KEY;

if (!API_KEY) {
  console.error('❌ ERROR: GROQ_API_KEY is not set.');
  console.error('   Create a .env file (see .env.example) and add your key there.');
  process.exit(1);
}

const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

app.use(express.json());

app.use(express.static(__dirname));

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: messages,
        max_tokens: 1200
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', data);
      return res.status(response.status).json(data);
    }

    const replyText =
      data?.choices?.[0]?.message?.content ||
      "I wasn't able to generate a response. Please try again.";

    res.json({ content: [{ type: 'text', text: replyText }] });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Orion server running at http://localhost:${PORT}`);
});
