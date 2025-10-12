const mqtt = require('mqtt');
const SensorData = require('../models/SensorData');
const dotenv = require('dotenv');

dotenv.config();

let io; // Will be set from app.js for Socket.io broadcasting

const client = mqtt.connect(process.env.MQTT_HOST, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
});

client.on('connect', () => {
  console.log('Connected to RabbitMQ via MQTT');
  client.subscribe('sensor/dht22', (err) => {
    if (!err) {
      console.log('Subscribed to sensor/dht22 topic');
    } else {
      console.error('Subscription error:', err);
    }
  });
});

client.on('message', async (topic, message) => {
  try {
    // Parse the JSON payload: {"temperature": <value>, "humidity": <value>}
    const data = JSON.parse(message.toString());

    // Validate payload
    if (!data.temperature || !data.humidity) {
      throw new Error('Invalid payload: missing temperature or humidity');
    }

    // Store temperature and humidity as separate entries in the database
    const timestamp = new Date();
    await SensorData.bulkCreate([
      { type: 'temperature', value: data.temperature, timestamp },
      { type: 'humidity', value: data.humidity, timestamp },
    ]);

    // Broadcast to frontend via Socket.io
    if (io) {
      io.emit('sensorUpdate', { type: 'temperature', value: data.temperature, timestamp });
      io.emit('sensorUpdate', { type: 'humidity', value: data.humidity, timestamp });
    }

    console.log(`Received - Temperature: ${data.temperature}, Humidity: ${data.humidity}`);
  } catch (error) {
    console.error('Error processing MQTT message:', error.message);
  }
});

client.on('error', (error) => {
  console.error('MQTT Error:', error);
});

module.exports = {
  setIo: (socketIo) => { io = socketIo; },
};