const express = require("express");
const helmet = require("helmet");
const path = require("path");
const morgan = require("morgan");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 9003;

// Security headers
app.use(helmet());

// Logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, "server.log"), { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));

// Serve favicon.ico or fallback to logo
const faviconPath = path.join(__dirname, "favicon.ico");
const logoPath = path.join(__dirname, "assets", "logo.png");
app.get("/favicon.ico", (req, res) => {
  res.sendFile(faviconPath, (err) => {
    if (err) {
      res.sendFile(logoPath);
    }
  });
});

// Serve static assets
app.use("/assets", express.static(path.join(__dirname, "dist/assets")));
app.use(express.static(path.join(__dirname, "dist")));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Windgap Academy server running at http://localhost:${PORT}`);
});
