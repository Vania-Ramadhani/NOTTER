const express = require('express');
const sequelize = require('./config/database');
const SensorData = require('./models/SensorData');
const sensorRoutes = require('./routes/sensorRoutes');
const mqttService = require('./services/mqttService');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }, // Adjust for production
});

app.use(express.json());

// Set io for MQTT service
mqttService.setIo(io);

// Routes
app.use('/api/sensors', sensorRoutes);

// Sync DB
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
});

module.exports = { app, server };