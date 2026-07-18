console.log("SERVER.JS RUNNING");

const app = require('./app');
const redisClient = require('./config/redis');
const elasticsearchService = require("./services/elasticsearchService");

const config = require("./config/env");

const PORT = config.port;

// Connect Redis first, then start Express
async function startServer() {
    try {
        await redisClient.connect(); //Establish Redis connection only once

        console.log("Redis Connected");

        await elasticsearchService.createIndex();

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
