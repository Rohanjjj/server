const express = require('express');
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Handle POST requests at the root path "/"
app.post('/', (req, res) => {
    try {
        // Check if sensorData exists and is valid JSON
        if (req.body.sensorData) {
            let sensorData;

            // Parse sensorData if it's in string format
            if (typeof req.body.sensorData === 'string') {
                try {
                    sensorData = JSON.parse(req.body.sensorData);
                } catch (error) {
                    console.error('Invalid JSON in sensorData:', error);
                    return res.status(400).json({ status: 'Error', message: 'Invalid JSON in sensorData' });
                }
            } else {
                sensorData = req.body.sensorData;
            }

            console.log('Received Data:', sensorData);

            // Forwarding the data to another endpoint if needed
            res.json({ status: 'Success', receivedData: sensorData });
        } else {
            res.status(400).json({ status: 'Error', message: 'Missing sensorData field' });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ status: 'Error', message: 'Internal Server Error' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
