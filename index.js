const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3001; // Use PORT environment variable

app.use(cors());
app.use(express.json());

function mapToGesture(flex1, flex2, flex3, flex4) {
  // Gesture mapping logic (same as before)
  if (flex1 > 840 && flex2 > 810 && flex3 > 870 && flex4 > 815) {
        return "Hello";
    } else if (flex1 < 810 && flex2 < 800 && flex3 > 850 && flex4 < 800) {
        return "Yes";
    } else if (flex1 < 810 && flex2 < 770 && flex3 < 850 && flex4 < 770) {
        return "Hello";
    } else if (flex1 > 850 && flex2 < 820 && flex3 > 870 && flex4 < 800) {
        return "Stop";
    } else if (flex1 < 800 && flex2 < 770 && flex3 < 850 && flex4 < 770) {
        return "Thank You";
    } else if (flex1 > 820 && flex2 > 830 && flex3 > 860 && flex4 < 810) {
        return "Good Morning";
    } else if (flex1 < 790 && flex2 < 780 && flex3 < 810 && flex4 < 780) {
        return "Good Night";
    } else if (flex1 > 870 && flex2 > 850 && flex3 < 800 && flex4 > 860) {
        return "I Love You";
    } else if (flex1 < 750 && flex2 > 810 && flex3 < 830 && flex4 > 820) {
        return "Sorry";
    } else if (flex1 > 880 && flex2 < 790 && flex3 > 860 && flex4 > 870) {
        return "Please";
    } else if (flex1 > 830 && flex2 < 800 && flex3 > 840 && flex4 < 820) {
        return "Help";
    } else if (flex1 < 770 && flex2 > 850 && flex3 > 870 && flex4 > 840) {
        return "Welcome";
    } else if (flex1 > 860 && flex2 < 780 && flex3 > 850 && flex4 < 810) {
        return "Water";
    } else if (flex1 < 780 && flex2 > 800 && flex3 < 810 && flex4 < 780) {
        return "Food";
    } else if (flex1 > 850 && flex2 > 860 && flex3 < 780 && flex4 > 870) {
        return "Goodbye";
    } else if (flex1 < 750 && flex2 < 760 && flex3 > 830 && flex4 > 850) {
        return "Congratulations";
    } else {
        const gestures = 'abcdefghijklmnopqrstuvwxyz';
        const index = Math.floor((flex1 + flex2 + flex3 + flex4) / 160) % 26;
        return `Letter: ${gestures[index]}`;
    }
}

app.post("/gesture", async (req, res) => {
    const { flex1, flex2, flex3, flex4 } = req.body;

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
    try {
        const flaskURL = 'http://localhost:5000/data'; //Replace to correct url

        await axios.post(flaskURL, { gesture }, {
            headers: { 'Content-Type': 'application/json' }
        });

        res.json({ gesture }); // Respond to the frontend
    } catch (error) {
        console.error("Error forwarding to Flask:", error.message);
        res.status(500).json({ error: "Failed to forward to Flask" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
