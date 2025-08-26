// Basic Express server for Windgap Academy static files
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the root and subfolders
app.use(express.static(path.join(__dirname)));

// Fallback: serve index.html for all unknown routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Windgap Academy server running at http://localhost:${PORT}`);
});
