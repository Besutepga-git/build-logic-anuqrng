const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const ANU_API_KEY = "m3gDJPQXaN557YWcEFtTV7dAO6JJq1Ef5Js70IpU";

app.get('/quantum-random', async (req, res) => {
    try {
        const response = await axios.get('https://api.quantumnumbers.anu.edu.au', {
            params: {
                length: 1,
                type: 'uint8'
            },
            headers: {
                'x-api-key': ANU_API_KEY
            }
        });

        if (response.data && response.data.success && Array.isArray(response.data.data)) {
            const rawNumber = response.data.data[0];
            const binaryString = rawNumber.toString(2).padStart(8, '0');
            
            res.setHeader('Content-Type', 'text/plain');
            return res.send(binaryString);
        } else {
            throw new Error("Invalid response format from ANU");
        }
    } catch (error) {
        res.setHeader('Content-Type', 'text/plain');
        
        // Check if the error is a 429 Rate Limit from ANU
        if (error.response && error.response.status === 429) {
            res.status(429);
            return res.send("Slow down! You are refreshing too fast. Wait a moment and try again.");
        }
        
        return res.status(500).send(`Error: ${error.message}`);
    }
});

app.get('/', (req, res) => {
    res.send("Your Unlimited Quantum Binary API is active! Go to /quantum-random to test it.");
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

