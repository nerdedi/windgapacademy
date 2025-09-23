// Basic Express server for Windgap Academy static files - ES Module version
import path from "path";
import { fileURLToPath } from "url";

import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 9003;

// Add Content Security Policy middleware
app.use((req, res, next) => {
  // Set CSP header with appropriate directives
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self'; connect-src 'self' http://127.0.0.1:5443 http://127.0.0.1:5088 ws: wss:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; media-src 'self'; object-src 'none'; frame-src 'self';`,
  );
  next();
});

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

// Handle Chrome DevTools specific requests
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.status(200).json({
    protocol_version: "1.1",
    security: {
      allow_insecure_localhost: true,
    },
  });
});

// Serve root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Fallback: serve index.html for all other routes (SPA support)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Windgap Academy server running and listening at http://localhost:${PORT}`);
  console.log(
    "If you are using Codespaces or a devcontainer, make sure port 9003 is forwarded and public.",
  );
});
