const express = require('express');
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Endpoint to receive JSON data
app.post('/endpoint', (req, res) => {
    const data = req.body; // Retrieve the JSON data
    console.log('Received data:', data);
    res.json(data); // Echo back the received JSON
});

// Assign a port number
const PORT = process.env.PORT || 5000; // Use the port provided by Render

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
