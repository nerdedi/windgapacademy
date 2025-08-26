// Basic Express server for Windgap Academy static files

const express = require('express');
const helmet = require('helmet');
const path = require('path');
const morgan = require('morgan');
const winston = require('winston');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 3000;

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

// Serve static files from the root and subfolders
app.use(express.static(__dirname));

// Fallback: serve index.html for all other routes (SPA support)
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  logger.info(`Windgap Academy server running at http://localhost:${PORT}`);
});
