const express = require("express");
const config = require("../config");

const router = express.Router();

// API endpoint to proxy Gemini requests
router.post("/generate", async (req, res) => {
  try {
    const apiKey = config.geminiApiKey;
    const apiUrl = `${config.geminiApiUrl}?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
