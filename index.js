const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/quantum-random', async (req, res) => {
    try {
        const response = await fetch('https://anu.edu.au');
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return res.status(429).send("Rate limit reached. Please wait 1 minute.");
        }

        const data = await response.json();
        if (data && data.success && data.data.length > 0) {
            const rawNumber = data.data[0];
            
            // Converts the number to a binary string and pads it with leading zeros to ensure it is exactly 8 bits
            const binaryString = rawNumber.toString(2).padStart(8, '0');
            
            // Sets the response type to plain text and returns just the binary string
            res.setHeader('Content-Type', 'text/plain');
            return res.send(binaryString);
        } else {
            throw new Error("Invalid structure from ANU");
        }
    } catch (error) {
        res.status(500).setHeader('Content-Type', 'text/plain');
        return res.send("Error: Failed to connect to quantum server");
    }
});

app.get('/', (req, res) => {
    res.send("Your Raw Binary Quantum API is active! Go to /quantum-random to see the bits.");
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

