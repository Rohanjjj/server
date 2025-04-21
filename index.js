const express = require('express');
const say = require('say');
const path = require('path');
const app = express();
let lastGesture = 'Waiting for gesture...';

app.use(express.json());
// Serve static HTML UI
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log("Received Body:", JSON.stringify(req.body));
    next();
});

function mapToGesture(flex1, flex2, flex3, flex4, ax, ay, az, gx, gy, gz) {
    if (flex1 > 840 && flex2 > 810 && flex3 > 870 && flex4 > 815 && ax > 0.5 && ay < 1 && gz < 0.5) {
        return "Hello";
    } else if (flex1 < 810 && flex2 < 800 && flex3 > 850 && flex4 < 800 && ax < 0.5 && gy > 1.5) {
        return "Yes";
    } else if (flex1 < 800 && flex2 < 770 && flex3 < 850 && flex4 < 770 && gx > 2.0 && gy < 1.0) {
        return "No";
    } else if (flex1 > 850 && flex2 < 820 && flex3 > 870 && flex4 < 800 && az > 0.7 && gy > 1.2) {
        return "Stop";
    } else if (flex1 > 820 && flex2 > 830 && flex3 > 860 && flex4 < 810 && az > 0.8) {
        return "Good Morning";
    } else if (flex1 < 790 && flex2 < 780 && flex3 < 810 && flex4 < 780 && gx < 1.0 && gy < 1.0) {
        return "Good Night";
    } else if (flex1 > 870 && flex2 > 850 && flex3 < 800 && flex4 > 860 && ay > 1.0) {
        return "I Love You";
    } else if (flex1 > 850 && flex2 > 860 && flex3 < 780 && flex4 > 870 && gz > 1.5) {
        return "Goodbye";
    } else {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const index = Math.floor((flex1 + flex2 + flex3 + flex4) / 160) % 26;
        return letters[index];
    }
}

app.post('/predict', async (req, res) => {
    try {
        console.log("Processing request body:", JSON.stringify(req.body));
        
        // Handle the double-nested sensorData structure
        let sensorData;
        if (req.body.sensorData && req.body.sensorData.sensorData) {
            // Double nested case: {"sensorData":{"sensorData":{...}}}
            sensorData = req.body.sensorData.sensorData;
        } else if (req.body.sensorData) {
            // Single nested case: {"sensorData":{...}}
            sensorData = req.body.sensorData;
        } else {
            return res.status(400).json({ error: "Missing sensorData object" });
        }

        const { flex1, flex2, flex3, flex4, ax, ay, az, gx, gy, gz } = sensorData;
        
        if ([flex1, flex2, flex3, flex4, ax, ay, az, gx, gy, gz].some(val => val === undefined)) {
            return res.status(400).json({ 
                error: "Missing or invalid sensor data",
                received: sensorData
            });
        }
        
        const gesture = mapToGesture(flex1, flex2, flex3, flex4, ax, ay, az, gx, gy, gz);
        lastGesture = gesture;
        console.log(`Detected Gesture: ${gesture}`);
        say.speak(gesture);
        res.send(gesture);
    } catch (error) {
        console.error("Error:", error.message || error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/gesture', (req, res) => {
    res.send({ gesture: lastGesture });
});

// HTML UI (served from memory instead of a separate file)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Gesture Output</title>
            <style>
                body { font-family: sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
                h1 { font-size: 2em; }
                #output { font-size: 3em; color: #007bff; margin-top: 20px; }
            </style>
        </head>
        <body>
            <h1>Detected Gesture:</h1>
            <div id="output">${lastGesture}</div>
            <script>
                setInterval(async () => {
                    const res = await fetch('/gesture');
                    const data = await res.json();
                    document.getElementById('output').textContent = data.gesture;
                }, 1000);
            </script>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
