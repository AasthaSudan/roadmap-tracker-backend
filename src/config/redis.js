const { createClient } = require("redis");
const config = require("./env");

const logger = require("../utils/logger");

const client = createClient({ //create one redis client for entire application
    socket: {
        host: config.redis.host,
        port: config.redis.port,
    },
});

client.on("connect", () => {
    logger.info("Redis Connected");
});

client.on("error", (err) => {
    logger.error("Redis Error:", err);
});

module.exports = client;