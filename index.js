const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const ANU_API_KEY = "m3gDJPQXaN557YWcEFtTV7dAO6JJq1Ef5Js70IpU";

app.get('/quantum-random', async (req, res) => {
    try {
        // Explicitly format the GET headers for the AWS API Gateway configuration
        const response = await fetch('https://anu.edu.au', {
            method: 'GET',
            headers: {
                'x-api-key': ANU_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        // Intercept any redirected HTML error pages before trying to parse JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const errorHtmlText = await response.text();
            return res.status(502).json({
                success: false,
                error: "ANU Authentication Rejected",
                message: "The server sent back an HTML login page instead of numbers.",
                details: errorHtmlText.slice(0, 150)
            });
        }

        const result = await response.json();
        
        // Output just the raw binary string format
        if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
            const rawNumber = result.data[0];
            const binaryString = rawNumber.toString(2).padStart(8, '0');
            
            res.setHeader('Content-Type', 'text/plain');
            return res.send(binaryString);
        } else {
            throw new Error(result.message || "Invalid data layout received from ANU");
        }
    } catch (error) {
        res.status(500).setHeader('Content-Type', 'text/plain');
        return res.send(`Internal Proxy Error: ${error.message}`);
    }
});

app.get('/', (req, res) => {
    res.send("Your Unlimited Quantum Binary API is active! Go to /quantum-random to test it.");
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

