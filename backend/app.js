const express = require('express');
const dataRoutes = require('./routes/dataRoutes');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/api/data', dataRoutes);

app.get('/', (req, res) => {
  res.send('Windgap Academy Backend API');
});

app.listen(PORT, () => {
  logger.info(`Backend server running on port ${PORT}`);
});
