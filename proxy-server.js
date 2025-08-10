const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();

// Your Apps Script URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbytUmS694cVGEYG89lMy-8ORyh7Wf2JwXasVQgHky13R0fUnmGNrGzHovbf6ioiacSouw/exec';

// ✅ Allow CORS for your frontend
app.use(cors({
  origin: 'https://nakuru-ccno.github.io',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// ✅ Respond to preflight OPTIONS requests
app.options('*', cors({
  origin: 'https://nakuru-ccno.github.io',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Main route to upload evidence
app.post('/upload-evidence', async (req, res) => {
  const { subCounty } = req.body;

  // ✅ Enforce subCounty is present
  if (!subCounty || subCounty.trim() === '') {
    return res.status(400).json({
      status: 'error',
      message: 'Sub County is required before uploading.'
    });
  }

  try {
    // Forward to Apps Script
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
