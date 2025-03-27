const express = require('express');
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Handle POST requests at the root path "/"
app.post('/', (req, res) => {
    const data = req.body; // Retrieve the JSON data
    console.log('Received data:', data);
    res.json({ status: 'Success', receivedData: data }); // Respond to the request
});

// Start the server
const PORT = process.env.PORT || 5000; // Use the provided PORT or default to 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
