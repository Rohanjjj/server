const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Correct endpoint for POST
app.post('/endpoint', (req, res) => {
    const data = req.body;
    console.log('Received data:', data);
    res.json({ status: 'Success', receivedData: data });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
