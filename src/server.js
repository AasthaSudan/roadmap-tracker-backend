console.log("SERVER.JS RUNNING");

const app = require('./app');
const redisClient = require('./config/redis');

const PORT = process.env.PORT || 3000;

// Connect Redis first, then start Express
async function startServer() {
    try {
        await redisClient.connect(); //Establish Redis connection only once

        console.log("Redis Connected");

        // Start Express server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Health check endpoint: http://localhost:${PORT}/health`);
        });

    } catch (error) {
        console.log("Failed to start server", error);
    }
}

startServer();
