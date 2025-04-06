const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiApiUrl:
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  environment: process.env.NODE_ENV || "development",
};
