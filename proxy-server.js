import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbytUmS694cVGEYG89lMy-8ORyh7Wf2JwXasVQgHky13R0fUnmGNrGzHovbf6ioiacSouw/exec"; // Replace

app.post("/upload", async (req, res) => {
  const { subCounty, fileName, fileData } = req.body;

  // ✅ Block if subCounty missing or blank
  if (!subCounty || subCounty.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "Sub County is required before uploading."
    });
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
