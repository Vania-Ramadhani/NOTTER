const { Op } = require('sequelize'); // Import Op for query operators
const SensorData = require('../models/SensorData');

const getLatestSensors = async (req, res) => {
  try {
    const latest = await SensorData.findAll({
      attributes: ['type', 'value', 'timestamp'],
      order: [['timestamp', 'DESC']],
      limit: 3, // Assuming one latest per type
    });
    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sensor data' });
  }
};

const getHistoricalData = async (req, res) => {
  const { type, startDate, endDate } = req.query;
  try {
    const where = { type };
    if (startDate) where.timestamp = { ...where.timestamp, [Op.gte]: new Date(startDate) };
    if (endDate) where.timestamp = { ...where.timestamp, [Op.lte]: new Date(endDate) };

    const data = await SensorData.findAll({ where, order: [['timestamp', 'ASC']] });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
};

module.exports = { getLatestSensors, getHistoricalData };