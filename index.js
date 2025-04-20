const express = require('express');
const axios = require('axios');
const mqtt = require('mqtt');
const app = express();

app.use(express.json());

// Debugging Middleware
app.use((req, res, next) => {
    console.log("Received Body:", JSON.stringify(req.body));
    next();
});

// MQTT Client Setup
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker at broker.hivemq.com');
});

// Gesture Mapping Function with MPU6050 integration
function mapToGesture(flex1, flex2, flex3, flex4, ax, ay, az, gx, gy, gz) {
    if (
        flex1 > 840 && flex2 > 810 && flex3 > 870 && flex4 > 815 &&
        ax > 0.5 && ay < 1 && gz < 0.5
    ) {
        return "Hello";
    } else if (
        flex1 < 810 && flex2 < 800 && flex3 > 850 && flex4 < 800 &&
        ax < 0.5 && gy > 1.5
    ) {
        return "Yes";
    } else if (
        flex1 < 800 && flex2 < 770 && flex3 < 850 && flex4 < 770 &&
        gx > 2.0 && gy < 1.0
    ) {
        return "No";
    } else if (
        flex1 > 850 && flex2 < 820 && flex3 > 870 && flex4 < 800 &&
        az > 0.7 && gy > 1.2
    ) {
        return "Stop";
    } else if (
        flex1 > 820 && flex2 > 830 && flex3 > 860 && flex4 < 810 &&
        az > 0.8
    ) {
        return "Good Morning";
    } else if (
        flex1 < 790 && flex2 < 780 && flex3 < 810 && flex4 < 780 &&
        gx < 1.0 && gy < 1.0
    ) {
        return "Good Night";
    } else if (
        flex1 > 870 && flex2 > 850 && flex3 < 800 && flex4 > 860 &&
        ay > 1.0
    ) {
        return "I Love You";
    } else if (
        flex1 > 850 && flex2 > 860 && flex3 < 780 && flex4 > 870 &&
        gz > 1.5
    ) {
        return "Goodbye";
    } else {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const index = Math.floor((flex1 + flex2 + flex3 + flex4) / 160) % 26;
        return letters[index];
    }
}

// API Endpoint for Prediction
app.post('/', async (req, res) => {
    try {
        const { sensorData } = req.body;

        if (!sensorData) {
            console.error("Invalid request: Missing sensorData object");
            return res.status(400).json({ error: "Missing sensorData object" });
        }

        const { flex1, flex2, flex3, flex4, ax, ay, az, gx, gy, gz } = sensorData;

        // Validate all required sensor values
        if ([flex1, flex2, flex3, flex4, ax, ay, az, gx, gy, gz].some(val => val === undefined)) {
            console.error("Invalid sensor data received");
            return res.status(400).json({ error: "Missing or invalid sensor data" });
        }

        const gesture = mapToGesture(flex1, flex2, flex3, flex4, ax, ay, az, gx, gy, gz);
        console.log(`Detected Gesture: ${gesture}`);

        // Publish to MQTT
        const mqttTopic = 'sign_language/gesture';
        mqttClient.publish(mqttTopic, gesture, { qos: 0 }, err => {
            if (err) {
                console.error("MQTT publish error:", err);
            } else {
                console.log(`Published gesture '${gesture}' to topic '${mqttTopic}'`);
            }
        });

        // Send only string to external server
        const externalURL = 'https://vser.onrender.com';
        try {
            await axios.post(externalURL, { gesture }, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(`Gesture sent to external site: ${gesture}`);
        } catch (axiosError) {
            console.error("Failed to send data to external site:", axiosError.message);
        }

        // Send response to ESP32
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
