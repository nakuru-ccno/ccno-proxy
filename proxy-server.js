const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const multer = require("multer");
const FormData = require("form-data");

const app = express();
const upload = multer(); // memory storage

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzExydbqCiEGu_jSfLpBC7YR9kPZH7sCcWxYv2CIg5Ixn4dWAdH9zSX87PiwXfSX_jaXA/exec";

app.use(cors({
  origin: "*",
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// Accept multiple files
app.post("/upload-evidence", upload.any(), async (req, res) => {
  try {
    if (!req.body.subCounty) {
      return res.status(400).json({ success: false, message: "subCounty is required" });
    }

    // Forward as FormData to Apps Script
    const formData = new FormData();
    formData.append("evidenceName", req.body.evidenceName);
    formData.append("category", req.body.category);
    formData.append("subCounty", req.body.subCounty);

    req.files.forEach((file, i) => {
      formData.append("file" + i, file.buffer, file.originalname);
    });

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
