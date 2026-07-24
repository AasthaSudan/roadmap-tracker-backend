const http = require("http");

const app = require("./app");

const logger = require("./utils/logger");
const config = require("./config/env");

const initSocket = require("./socket");

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

let isShuttingDown = false;

async function startServer() {
    try {

        // Connect Redis before starting the server
        await redisClient.connect();
        logger.info("Redis Connected");

        // Create Elasticsearch index if it doesn't already exist
        await elasticsearchService.createIndex();

        // Create the actual HTTP server using the Express app
        // Socket.IO attaches to this HTTP server, NOT directly to Express
        const httpServer = http.createServer(app);

        // Initialize Socket.IO and attach it to the HTTP server
        const io = initSocket(httpServer);

        // Start listening for both HTTP requests and WebSocket connections
        httpServer.listen(PORT, () => {
            logger.info(`Server is running on http://localhost:${PORT}`);
            logger.info(`Health endpoint: http://localhost:${PORT}/health`);
            logger.info(`Readiness endpoint: http://localhost:${PORT}/ready`);
        });

        async function gracefulShutdown(signal) {

            if (isShuttingDown) {
                return;
            }

            isShuttingDown = true;

            logger.info(`${signal} received. Starting graceful shutdown...`);

            // Stop accepting new HTTP requests and WebSocket upgrade requests.
            // Existing requests/connections are allowed to finish gracefully.
            // Close all Socket.IO connections first
            io.close(() => {
                logger.info("Socket.IO server closed.");
            });

            httpServer.close(async () => {

                logger.info("HTTP server closed.");

                try {
                    await prisma.$disconnect();
                    logger.info("Prisma disconnected.");
                } catch (err) {
                    logger.error("Failed to disconnect Prisma:", err);
                }

                try {
                    if (redisClient.isOpen) {
                        await redisClient.quit();
                        logger.info("Redis disconnected.");
                    }
                } catch (err) {
                    logger.error("Failed to disconnect Redis:", err);
                }

                try {
                    await emailWorker.close();
                    logger.info("BullMQ worker closed.");
                } catch (err) {
                    logger.error("Failed to close BullMQ worker:", err);
                }

                // Elasticsearch JS client doesn't require explicit disconnect
                logger.info("Elasticsearch client cleanup not required.");

                logger.info("Graceful shutdown completed.");

                process.exit(0);
            });

            // Force shutdown if graceful shutdown takes too long
            setTimeout(() => {

                logger.error("Graceful shutdown timed out. Force exiting...");

                process.exit(1);

            }, 10000);
        }

        // Ctrl + C
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));

        // Docker / Kubernetes shutdown
        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

    } catch (error) {

        console.error("Failed to start server:", error);

        process.exit(1);
    }
}

startServer();