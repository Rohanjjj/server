const express = require('express');
const axios = require('axios');
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Handle POST requests at the root path "/"
app.post('/', async (req, res) => {
    try {
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

            // Prepare the data for ML model input
            const inputData = {
                flex1: sensorData.flex1,
                flex2: sensorData.flex2,
                flex3: sensorData.flex3,
                flex4: sensorData.flex4
            };

            // Send data to the ML model running on Flask
            const modelResponse = await axios.post('http://localhost:5000/predict', inputData);

            // Return prediction response from the ML model
            res.json({ status: 'Success', prediction: modelResponse.data.prediction });
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
    console.log(Server is running on port ${PORT});
});
