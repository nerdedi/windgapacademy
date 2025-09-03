// Basic Express server for Windgap Academy static files
const path = require("path");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 9003;

// Serve static files from the root and subfolders

// Serve favicon.ico from assets/logo.png if missing
const faviconPath = path.join(__dirname, "favicon.ico");
const logoPath = path.join(__dirname, "assets", "logo.png");
app.get("/favicon.ico", (req, res) => {
  res.sendFile(faviconPath, (err) => {
    if (err) {
      res.sendFile(logoPath);
    }
  });
});

app.use(express.static(path.join(__dirname)));

// Fallback: serve index.html for all unknown routes (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Windgap Academy server running and listening at http://localhost:${PORT}`);
  console.log(
    "If you are using Codespaces or a devcontainer, make sure port 9003 is forwarded and public.",
  );
});
