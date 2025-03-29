const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3001; // Use PORT environment variable

app.use(cors());
app.use(express.json());

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
        const gestures = 'abcdefghijklmnopqrstuvwxyz';
        const index = Math.floor((flex1 + flex2 + flex3 + flex4) / 160) % 26;
        return `Letter: ${gestures[index]}`;
    }
}

// API Endpoint for Gesture Recognition
app.post("/gesture", async (req, res) => {
    try {
        const { sensorData } = req.body;

        if (!sensorData) {
            return res.status(400).json({ error: "Missing sensorData object" });
        }

        const { flex1, flex2, flex3, flex4 } = sensorData;

        if (
            typeof flex1 !== "number" ||
            typeof flex2 !== "number" ||
            typeof flex3 !== "number" ||
            typeof flex4 !== "number"
        ) {
            return res.status(400).json({ error: "Invalid input. All values must be numbers." });
        }

        const gesture = mapToGesture(flex1, flex2, flex3, flex4);

        // Forward to Flask backend
        const flaskURL = 'http://localhost:5000/data';

        try {
            await axios.post(flaskURL, { gesture }, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(`Gesture sent to Flask: ${gesture}`);
        } catch (error) {
            console.error("Error forwarding to Flask:", error.message);
        }

        res.json({ gesture });
    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Test Route
app.get("/", (req, res) => {
    res.send("Server is running. Use POST /gesture to send data.");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
