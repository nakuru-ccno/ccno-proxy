const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyGwRMVtQyksOJBUeeaA6zhUvhSd5reOTdivoS8FSwvL_d-j4Iyj4zZDQrmY88EkfEpzQ/exec';

// Enable CORS for your frontend
app.use(cors({
  origin: 'https://nakuru-ccno.github.io',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// Parse JSON requests
app.use(express.json({ limit: '10mb' }));

app.post('/upload-evidence', async (req, res) => {
  try {
    // ✅ Check that subCounty is present
    if (!req.body.subCounty || req.body.subCounty.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Missing subCounty in request body'
      });
    }

    // Forward request to Google Apps Script
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
