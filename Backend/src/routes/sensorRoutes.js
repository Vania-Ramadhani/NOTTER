const express = require('express');
const { getLatestSensors, getHistoricalData } = require('../controllers/sensorController');

const router = express.Router();

router.get('/latest', getLatestSensors);
router.get('/historical', getHistoricalData);

module.exports = router;