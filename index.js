const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(express.json());

// Replace this with the external server URL
const EXTERNAL_SERVER_URL = 'https://ml-new-vtfv.onrender.com';

app.post('/sensor-data', async (req, res) => {
  const sensorData = req.body;

  console.log('Received data from ESP32:', sensorData);

  try {
    const response = await axios.post(EXTERNAL_SERVER_URL, sensorData);
    console.log('Data forwarded to external server:', response.status);
    res.status(200).json({ message: 'Data received and forwarded successfully' });
  } catch (error) {
    console.error('Error forwarding data:', error.message);
    res.status(500).json({ error: 'Failed to forward data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
