const express = require('express');
const dataController = require('../controllers/dataController');

const router = express.Router();

router.get('/current', (req, res) => {
  res.json(dataController.getCurrentData());
});
router.get('/historical', (req, res) => {
  res.json(dataController.getHistoricalData());
});

module.exports = router;
