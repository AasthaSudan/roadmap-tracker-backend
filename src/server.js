const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Roadmap Tracker backend is running...')
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Health check endpoint: http://localhost:${PORT}/health`);
});