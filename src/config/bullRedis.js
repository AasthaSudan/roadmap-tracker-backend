//BullMQ (ioredis) - for background jobs
const logger = require("../utils/logger");

const IORedis = require("ioredis");
const config = require("./env");

const bullRedis = new IORedis({
    host: config.redis.host,
    port: config.redis.port,
    maxRetriesPerRequest: null,
});

bullRedis.on("connect", () => {
    logger.info("BullMQ Redis Connected");
});

bullRedis.on("error", (err) => {
    logger.error("BullMQ Redis Error:", err);
});

module.exports = bullRedis;