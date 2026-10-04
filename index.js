const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const ANU_API_KEY = "m3gDJPQXaN557YWcEFtTV7dAO6JJq1Ef5Js70IpU";

app.get('/quantum-random', async (req, res) => {
    try {
        const response = await fetch('https://anu.edu.au', {
            method: 'GET',
            headers: {
                'x-api-key': ANU_API_KEY,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`ANU Server Error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        
        if (data && data.data) {
            return res.json({ 
                success: true,
                source: "ANU Quantum Cloud Cluster",
                number: data.data 
            });
        } else {
            throw new Error("Invalid structure received from ANU Quantum API");
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch cloud quantum random number", 
            details: error.message 
        });
    }
});

app.get('/', (req, res) => {
    res.send("Your Unlimited Quantum API is active! Go to /quantum-random to test it.");
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});


