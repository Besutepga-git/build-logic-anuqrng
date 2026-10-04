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
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const HTML_ErrorText = await response.text();
            return res.status(502).json({
                success: false,
                error: "ANU API Gateway Redirection",
                message: "The server still redirected your request to the university homepage.",
                details: HTML_ErrorText.slice(0, 100)
            });
        }

        const data = await response.json();
        
        if (data && data.success && data.data) {
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

