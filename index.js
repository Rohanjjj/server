const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Debugging Middleware to log received requests
app.use((req, res, next) => {
    console.log("Received Body:", JSON.stringify(req.body));
    next();
});

// API Endpoint for Forwarding Data
app.post('/', async (req, res) => {
    try {
        if (!req.body || !req.body.sensorData) {
            console.error("Invalid request: Missing sensorData object");
            return res.status(400).json({ error: "Missing sensorData object" });
        }

        const externalURL = 'https://vser.onrender.com';
        const dataToSend = req.body.sensorData;

        try {
            await axios.post(externalURL, dataToSend, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log("Data sent to external site:", dataToSend);
        } catch (axiosError) {
            console.error("Failed to send data to external site:", axiosError.message);
        }

        res.json({ status: "Data forwarded successfully" });
    } catch (error) {
        console.error("Error:", error.message || error);
        res.status(500).send("Internal Server Error");
    }
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
