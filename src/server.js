const express = require('express'); //imports the Express library into file

const app = express(); //creates an Express application object (app: ur backend app instance)
const PORT = 3000; //sets the port number ur backend/server will run on(thru which requests reach ur app)

app.get('/', (req, res) => { //req-request, res-response
    res.send('Roadmap Tracker backend is running...')
});

app.get('/health', (req, res) => {
    res.json({ //sends a JSON response
        status: 'ok',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

app.get('/inspect', (req, res) => {
    res.json({
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
    });
});

app.listen(PORT, () => { //starts the server & tells it to listen for incoming req on that port
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Health check endpoint: http://localhost:${PORT}/health`);
});