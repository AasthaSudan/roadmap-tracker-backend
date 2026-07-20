require('dotenv').config();

const morgan = require("morgan");
const logger = require("./utils/logger");

const express = require('express');
const app = express();

const prisma = require("./config/prisma");
const elasticClient = require("./config/elasticsearch");
const redisClient = require("./config/redis");

const loggerMiddleware = require('./middleware/loggerMiddleware');
const notFoundMiddleware = require('./middleware/notFoundMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

const healthRoutes = require('./routes/healthRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const authRoutes = require('./routes/authRoutes');
const githubRoutes = require('./routes/githubRoutes');
const topicRoutes = require('./routes/topicRoutes');
const emailRoutes = require('./routes/emailRoutes');

app.use( //morgan combined logs with logger stream
    morgan("combined", { //predefined format, combined = dev + common + referrer + timing (detailed production format)
        stream: logger.stream,
    })
);

// parse incoming JSON request bodies
app.use(express.json());

// log every incoming request
app.use(loggerMiddleware);

// Health Check
app.get("/health", (req, res) => {

    res.status(200).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        memory: process.memoryUsage(),
    });

});

// Readiness Check
app.get("/ready", async (req, res) => {
    try {
        // PostgreSQL
        await prisma.$queryRaw`SELECT 1`; //SELECT 1 is used for quick DB check which doesn't require any table to be there

        // Redis
        await redisClient.ping(); //checks if redis is reachable

        // Elasticsearch
        await elasticClient.ping(); //checks if elasticsearch is reachable

        res.status(200).json({
            status: "READY",
        });

    } catch (error) {

        res.status(503).json({
            status: "NOT_READY",
            error: error.message,
        });

    }

});

// route groups
app.use('/', healthRoutes);

app.use('/api/v1/', roadmapRoutes);
app.use('/api/v1', topicRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', githubRoutes);
app.use('/api/v1/email', emailRoutes);

// 404 handler -> runs only if no route matched above
app.use(notFoundMiddleware);

// global error handler -> runs when next(error) is called
app.use(errorMiddleware);

module.exports = app;