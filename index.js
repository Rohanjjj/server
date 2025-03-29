const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Debugging Middleware
app.use((req, res, next) => {
    console.log("Received Body:", JSON.stringify(req.body));
    next();
});

// API Endpoint for Prediction
app.post('/', async (req, res) => {
    try {
        if (!req.body || !req.body.sensorData) {
            console.error("Invalid request: Missing sensorData object");
            return res.status(400).json({ error: "Missing sensorData object" });
        }

        const { flex1, flex2, flex3, flex4, ax, ay, az, gx, gy, gz } = req.body.sensorData;

        // Input Validation
        if ([flex1, flex2, flex3, flex4, ax, ay, az, gx, gy, gz].some(value => value === undefined)) {
            console.error("Invalid sensor data received");
            return res.status(400).json({ error: "Missing or invalid sensor data" });
        }

        // Forward result to external website
        const externalURL = 'http://127.0.0.1:3000';
        const dataToSend = { flex1, flex2, flex3, flex4, ax, ay, az, gx, gy, gz };

        try {
            const response = await axios.post(externalURL, dataToSend, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Data sent to external site:', response.data);
        } catch (axiosError) {
            console.error("Failed to send data to external site:", axiosError.response?.data || axiosError.message);
        }

        // Send acknowledgment back to ESP32
        res.json({ message: "Data received and forwarded successfully" });
    } catch (error) {
        console.error("Error:", error.message || error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
