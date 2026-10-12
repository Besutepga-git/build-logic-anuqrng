const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const ANU_API_KEY = "m3gDJPQXaN557YWcEFtTV7dAO6JJq1Ef5Js70IpU";

app.get('/quantum-random', async (req, res) => {
    try {
        const response = await fetch('https://anu.edu.au', {
            method: 'GET',
            headers: {
                'x-api-key': ANU_API_KEY
            }
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`ANU Server Error: ${response.status} - ${errText}`);
        }

        const result = await response.json();
        
        if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
            const rawNumber = result.data[0];
            const binaryString = rawNumber.toString(2).padStart(8, '0');
            
            res.setHeader('Content-Type', 'text/plain');
            return res.send(binaryString);
        } else {
            throw new Error(result.message || "Invalid structure received from ANU Quantum API");
        }
    } catch (error) {
        res.status(500).setHeader('Content-Type', 'text/plain');
        return res.send(`Error: ${error.message}`);
    }
});

app.get('/', (req, res) => {
    res.send("Your Unlimited Quantum Binary API is active! Go to /quantum-random to test it.");
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
