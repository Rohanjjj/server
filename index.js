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
  }
  return null; // No matching gesture
}

// Letter Detection Function
function getLetter(flex1, flex2, flex3, flex4) {
  if (flex1 < 800 && flex2 < 800 && flex3 < 800 && flex4 < 800) {
    return "Letter: A";
  } else if (flex1 > 850 && flex2 < 800 && flex3 < 800 && flex4 > 850) {
    return "Letter: B";
  } else if (flex1 < 820 && flex2 > 850 && flex3 < 800 && flex4 < 820) {
    return "Letter: C";
  } else if (flex1 > 870 && flex2 < 810 && flex3 > 870 && flex4 < 800) {
    return "Letter: D";
  } else if (flex1 < 800 && flex2 > 850 && flex3 > 850 && flex4 < 780) {
    return "Letter: E";
  } else if (flex1 > 860 && flex2 < 820 && flex3 < 800 && flex4 > 860) {
    return "Letter: F";
  } else if (flex1 < 790 && flex2 > 830 && flex3 > 810 && flex4 > 800) {
    return "Letter: G";
  } else if (flex1 > 850 && flex2 > 850 && flex3 < 790 && flex4 < 810) {
    return "Letter: H";
  } else if (flex1 < 810 && flex2 < 800 && flex3 > 870 && flex4 > 860) {
    return "Letter: I";
  } else if (flex1 > 880 && flex2 < 770 && flex3 > 860 && flex4 < 790) {
    return "Letter: J";
  } else if (flex1 < 820 && flex2 > 850 && flex3 > 820 && flex4 > 870) {
    return "Letter: K";
  } else if (flex1 < 810 && flex2 < 810 && flex3 > 800 && flex4 > 810) {
    return "Letter: L";
  } else if (flex1 > 850 && flex2 > 850 && flex3 > 850 && flex4 > 850) {
    return "Letter: M";
  } else if (flex1 > 860 && flex2 > 860 && flex3 > 850 && flex4 < 860) {
    return "Letter: N";
  } else if (flex1 < 790 && flex2 < 800 && flex3 < 810 && flex4 < 800) {
    return "Letter: O";
  } else if (flex1 > 870 && flex2 < 780 && flex3 > 860 && flex4 < 800) {
    return "Letter: P";
  } else {
    return "Unknown Gesture";
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

    // Detect Gesture or Letter
    const gesture = mapToGesture(flex1, flex2, flex3, flex4);
    const result = gesture || getLetter(flex1, flex2, flex3, flex4);

    // Forward result to external website
    const externalURL = 'https://vser.onrender.com';
    const dataToSend = { result, ax, ay, az, gx, gy, gz };

    try {
      await axios.post(externalURL, dataToSend, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(`Result and sensor data sent to external site: ${result}`);
    } catch (axiosError) {
      console.error("Failed to send data to external site:", axiosError.message);
    }

    // Send response back to ESP32
    res.send(result);
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

