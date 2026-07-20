const app = require("./app");

const logger = require("./utils/logger");
const config = require("./config/env");

// Database
const prisma = require("./config/prisma");

// Redis
const redisClient = require("./config/redis");

// Elasticsearch client
const elasticClient = require("./config/elasticsearch");

// Elasticsearch service (used only for creating index)
const elasticsearchService = require("./services/elasticsearchService");

// BullMQ Worker
const emailWorker = require("./queues/emailQueue");

const PORT = config.port;

async function startServer() {
    try {

        // Connect Redis before starting Express
        await redisClient.connect();
        logger.info("Redis Connected");

        // Create Elasticsearch index if it doesn't already exist
        await elasticsearchService.createIndex();

        // Start Express server
        const server = app.listen(PORT, () => {
            logger.info(`Server is running on http://localhost:${PORT}`);
            logger.info(`Health endpoint: http://localhost:${PORT}/health`);
            logger.info(`Readiness endpoint: http://localhost:${PORT}/ready`);
        });

        async function gracefulShutdown(signal) {

            logger.info(`${signal} received. Starting graceful shutdown...`);

            // Stop accepting new HTTP requests.
            // Existing requests are allowed to finish.
            server.close(async () => {

                logger.info("HTTP server closed.");

                try {
                    await prisma.$disconnect();
                    logger.info("Prisma disconnected.");
                } catch (err) {
                    logger.error("Failed to disconnect Prisma:", err);
                }

                try {
                    await redisClient.quit();
                    logger.info("Redis disconnected.");
                } catch (err) {
                    logger.error("Failed to disconnect Redis:", err);
                }

                try {
                    await emailWorker.close();
                    logger.info("BullMQ worker closed.");
                } catch (err) {
                    logger.error("Failed to close BullMQ worker:", err);
                }

                logger.info("Elasticsearch client cleanup not required.");

                logger.info("Graceful shutdown completed.");

                // Exit successfully
                process.exit(0);
            });

            // Force shutdown if cleanup hangs
            setTimeout(() => {

                logger.error("Graceful shutdown timed out. Force exiting...");

                process.exit(1); //forceful exit

            }, 10000); //10 second timeout
        }

        // Listen for Ctrl + C
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));

        // Listen for Docker/Kubernetes termination
        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

    } catch (error) {

        logger.error("Failed to start server:", error);

        process.exit(1); //startup failed
    }
}

startServer();