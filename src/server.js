const app = require('./app');
const redisClient = require('./config/redis');
const elasticsearchService = require("./services/elasticsearchService");
const logger = require("./utils/logger");

const config = require("./config/env");

const PORT = config.port;

// Connect Redis first, then start Express
async function startServer() {
    try {
        await redisClient.connect(); //Establish Redis connection only once

        logger.info("Redis Connected");

        await elasticsearchService.createIndex();

        // Start Express server
        app.listen(PORT, () => {
            logger.info(`Server is running on http://localhost:${PORT}`);
            logger.info(`Health check endpoint: http://localhost:${PORT}/health`);
        });

    } catch (error) {
        logger.info("Failed to start server", error);
    }
}

startServer();
