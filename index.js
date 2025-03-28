const express = require('express');
const app = express();

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
        return "I am Rohan ";
    }
}

// API Endpoint for Prediction
app.post('/predict', (req, res) => {
    try {
        const { flex1, flex2, flex3, flex4 } = req.body;

        // Input Validation
        if ([flex1, flex2, flex3, flex4].some(value => value === undefined)) {
            return res.status(400).json({ error: "Missing or invalid sensor data" });
        }

        // Map to Gesture
        const gesture = mapToGesture(flex1, flex2, flex3, flex4);
        res.json({ gesture });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
