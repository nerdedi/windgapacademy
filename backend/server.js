
const express = require('express');
const cors = require('cors');
const apiRouter = require('./api');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

if (require.main === module) {
  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => {
    console.log(`Backend API server running on port ${PORT}`);
  });
}

module.exports = app;
