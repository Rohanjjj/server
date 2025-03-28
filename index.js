const express = require('express');
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Handle POST requests at the root path "/"
app.post('/', (req, res) => {
    try {
        const data = JSON.parse(req.body.sensorData); // Parse the JSON from sensorData
        console.log('Received data:', data);
        res.json({ status: 'Success', receivedData: data });
    } catch (error) {
        console.error('Error parsing data:', error);
        res.status(400).json({ status: 'Error', message: 'Invalid data format' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
