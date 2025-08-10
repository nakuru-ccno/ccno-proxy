const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyGwRMVtQyksOJBUeeaA6zhUvhSd5reOTdivoS8FSwvL_d-j4Iyj4zZDQrmY88EkfEpzQ/exec';

// Use CORS middleware to automatically set proper headers before routes
app.use(cors({
  origin: 'https://nakuru-ccno.github.io',  // allow only your frontend origin
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '10mb' })); // support large payloads if needed

app.post('/upload-evidence', async (req, res) => {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    // Just send the data back — CORS headers are handled by middleware
    res.json(data);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
