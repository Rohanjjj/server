const express = require('express');
const { spawn } = require('child_process');
const app = express();

app.use(express.json());

app.post('/', async (req, res) => {
    try {
        if (req.body.sensorData) {
            const sensorData = req.body.sensorData;

            console.log('Received Data:', sensorData);

            // Spawn a Python process to run the model.py with input data
            const pythonProcess = spawn('python', ['model.py', JSON.stringify(sensorData)]);

            let prediction = '';

            // Capture data from the Python script
            pythonProcess.stdout.on('data', (data) => {
                prediction += data.toString();
            });

            // Handle process close
            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    res.json({ status: 'Success', prediction });
                } else {
                    res.status(500).json({ status: 'Error', message: 'Python script error' });
                }
            });

            // Handle Python script errors
            pythonProcess.stderr.on('data', (data) => {
                console.error('Python Error:', data.toString());
                res.status(500).json({ status: 'Error', message: data.toString() });
            });

            // Send data to Python script
            pythonProcess.stdin.write(JSON.stringify(sensorData));
            pythonProcess.stdin.end();
        } else {
            res.status(400).json({ status: 'Error', message: 'Missing sensorData field' });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ status: 'Error', message: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
