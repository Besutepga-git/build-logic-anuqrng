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
        res.status(500).setHeader('Content-Type', 'text/plain');
        const internalMessage = error.response && typeof error.response.data === 'string'
            ? error.response.data.slice(0, 100)
            : error.message;
        return res.send(`Error: ${internalMessage}`);
    }
});

app.get('/', (req, res) => {
    res.send("Your Unlimited Quantum Binary API is active! Go to /quantum-random to test it.");
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

