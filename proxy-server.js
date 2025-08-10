const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzwnZS-ciGtFTXcwbSw1VY3doeBSkX30XDGVEeDQsjNlfy9jx0Paxn_m2nxWLyMq4AORw/exec';

// Use CORS middleware to allow requests only from your frontend origin
app.use(cors({
  origin: 'https://nakuru-ccno.github.io',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '10mb' })); // support large payloads

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

