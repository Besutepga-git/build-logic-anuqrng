const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/quantum-random', async (req, res) => {
    try {
        const response = await fetch('https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint8');
        
        // 1. Check if ANU returned HTML/text instead of JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const textError = await response.text();
            return res.status(429).json({
                success: false,
                error: "ANU Lab Rate Limit Reached",
                details: textError.trim() // Tells you exactly what text ANU replied with
            });
        }

        // 2. If it's valid JSON, parse it safely
        const data = await response.json();
        if (data && data.success && data.data.length > 0) {
            return res.json({ 
                success: true,
                source: "ANU Quantum RNG Lab",
                number: data.data[0] 
            });
        } else {
            throw new Error("Invalid structure from ANU");
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: "Failed to connect to quantum server", 
            details: error.message 
        });
    }
});

app.get('/', (req, res) => {
    res.send("Your Quantum API is active! Go to /quantum-random to get a number.");
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});


