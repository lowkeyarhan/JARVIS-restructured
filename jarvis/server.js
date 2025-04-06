const express = require("express");
const cors = require("cors");
const path = require("path");
const config = require("./config");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static files
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/")));

// API routes
app.use("/api", apiRoutes);

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
