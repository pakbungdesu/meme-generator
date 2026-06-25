const express = require('express');
const axios = require('axios');
const app = express();

// Enable CORS for your local React application dev client
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Create the isolated proxy pipe route
app.get('/api/proxy-image', async (req, res) => {
    try {
        const targetUrl = req.query.url;
        if (!targetUrl) return res.status(400).send("Missing target image URL parameter.");

        // Fetch the raw binary array data from Imgflip imitating a safe browser origin context
        const response = await axios({
            method: 'get',
            url: targetUrl,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://imgflip.com/'
            }
        });

        // Pass along the clean image stream payload directly to your frontend app canvas
        res.setHeader('Content-Type', response.headers['content-type']);
        response.data.pipe(res);
    } catch (error) {
        res.status(500).send("Proxy transmission failed: " + error.message);
    }
});

// FIX: Changed 'print' to 'console.log' so Node.js doesn't crash!
app.listen(5000, () => console.log("Secure local proxy online on port 5000"));