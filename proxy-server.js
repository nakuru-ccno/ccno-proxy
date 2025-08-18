const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();

// UPDATED Apps Script Web App URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwv0jW6xF5lebEky1efxNslLc_lvAUTW3vBZ4WRZ2J_xGRbMjiv17PTiFSuDteyCzqBUQ/exec';

// Use CORS middleware to allow requests only from your frontend origin
app.use(cors({
  origin: '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '20mb' })); // support large payloads

app.post('/upload-evidence', async (req, res) => {
  try {
    const { subCounty } = req.body;

    if (!subCounty || subCounty.trim() === '') {
      return res.status(400).json({ success: false, message: 'subCounty is required' });
    }

    // Forward the request to the Apps Script Web App
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
