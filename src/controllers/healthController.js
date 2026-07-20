const prisma = require("../config/prisma");
const elasticClient = require("../config/elasticsearch");
const redisClient = require("../config/redis");

function getHome(req, res) { // req-request, res-response
    res.send('Roadmap Tracker backend is running...');
}

function getHealth(req, res) {
    res.status(200).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        memory: process.memoryUsage(),
    });
}

async function getReady(req, res) {
    try {
        await prisma.$queryRaw`SELECT 1`;
        await redisClient.ping();
        await elasticClient.ping();

        return res.status(200).json({
            status: "READY",
            services: {
                database: "UP",
                redis: "UP",
                elasticsearch: "UP",
            },
        });

    } catch (error) {
        return res.status(503).json({
            status: "NOT_READY",
            error: error.message,
        });
    }
}

function inspectRequest(req, res) { // inspect -> lets your server show what request it received (method, url, headers)
    res.json({
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
    });
}

// Inspect request body -> lets you see what Express received in req.body
function inspectBody(req, res) {
    res.json({
        message: 'Request body received successfully',
        body: req.body,
    });
}

// This route is for practicing request content:
// - route params
// - query params
// - selected headers
function getTopicDetails(req, res) {
    res.json({
        message: 'Request content received successfully',
        params: req.params,
        query: req.query,
        headers: {
            authorization: req.headers.authorization || null,
            userAgent: req.headers['user-agent'] || null,
            learningMode: req.headers['x-learning-mode'] || null,
        },
    });
}

module.exports = {
    getHome,
    getHealth,
    getReady,
    inspectRequest,
    inspectBody,
    getTopicDetails,
};