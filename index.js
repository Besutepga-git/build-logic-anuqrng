const express = require('express');
const app = express();

// Render sets the port automatically, or defaults to 3000 locally
const PORT = process.env.PORT || 3000;

// This is your endpoint: https://onrender.com
app.get('/quantum-random', async (req, res) => {
    try {
        // Fetches 1 true quantum random number (uint8 ranges from 0 to 255)
        const response = await fetch('https://anu.edu.au');
        const data = await response.json();
        
        if (data && data.success && data.data.length > 0) {
            res.json({ 
                success: true,
                source: "ANU Quantum RNG Lab",
                number: data.data[0] // Extracts the raw number out of the array
            });
        } else {
            throw new Error("Invalid response structure from ANU");
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch quantum random number", 
            details: error.message 
        });
    }
});

// Root endpoint so you know your API is alive
app.get('/', (req, res) => {
    res.send("Your Quantum API is active! Go to /quantum-random to get a number.");
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
