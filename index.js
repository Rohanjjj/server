const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Debugging Middleware to log received requests
app.use((req, res, next) => {
    console.log("Received Body:", JSON.stringify(req.body));
    next();
});

// Gesture Mapping Function
function mapToGesture(flex1, flex2, flex3, flex4) {
    if (flex1 > 840 && flex2 > 810 && flex3 > 870 && flex4 > 815) {
        return "Hello";
    } else if (flex1 < 810 && flex2 < 800 && flex3 > 850 && flex4 < 800) {
        return "Yes";
    } else if (flex1 < 810 && flex2 < 770 && flex3 < 850 && flex4 < 770) {
        return "No";
    } else if (flex1 > 850 && flex2 < 820 && flex3 > 870 && flex4 < 800) {
        return "Stop";
    } else if (flex1 < 800 && flex2 < 770 && flex3 < 850 && flex4 < 770) {
        return "Thank You";
    } else {
        return "I am Rohan";
    }
}

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

        // Map to Gesture
        const gesture = mapToGesture(flex1, flex2, flex3, flex4);

        // Forward result to external website
        const externalURL = 'https://vser.onrender.com';
        const dataToSend = { gesture, ax, ay, az, gx, gy, gz };

        try {
            await axios.post(externalURL, dataToSend, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(`Gesture and sensor data sent to external site: ${gesture}`);
        } catch (axiosError) {
            console.error("Failed to send data to external site:", axiosError.message);
        }

        // Send response back to ESP32
        res.send(gesture);
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
