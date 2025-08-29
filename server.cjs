// Basic Express server for Windgap Academy static files

const express = require('express');
const helmet = require('helmet');
const path = require('path');
const morgan = require('morgan');
const winston = require('winston');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 9003;

// Security headers
app.use(helmet());

// Logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server.log' })
  ]
});
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Serve static files from the Vite build output (dist)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback: serve dist/index.html for all other routes (SPA support)
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
// Start the server
app.listen(PORT, () => {
  logger.info(`Windgap Academy server running and listening at http://localhost:${PORT}`);
  console.log('If you are using Codespaces or a devcontainer, make sure port 9003 is forwarded and public.');
});
// single listen retained above
