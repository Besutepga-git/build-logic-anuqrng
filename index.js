const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const ANU_API_KEY = "m3gDJPQXaN557YWcEFtTV7dAO6JJq1Ef5Js70IpU";

app.get('/quantum-random', async (req, res) => {
    try {
        // MODIFICATION: Stripped down to the exact verified curl structure
        const response = await fetch('https://anu.edu.au', {
            method: 'GET',
            headers: {
                'x-api-key': ANU_API_KEY
            }
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const gatewayErrorText = await response.text();
            return res.status(502).json({
                success: false,
                error: "ANU Cloud Gateway Error",
                message: "The server sent back HTML text instead of numbers.",
                details: gatewayErrorText.slice(0, 150)
            });
        }

        const data = await response.json();
        
        // MODIFICATION: Adjusted property check to explicitly handle truthy response properties
        if (data && data.success && data.data) {
            return res.json({ 
                success: true,
                source: "ANU Quantum Cloud Cluster",
                number: data.data[0] // Extracts the first single number out of the returned array list
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

