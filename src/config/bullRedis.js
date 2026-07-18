//BullMQ (ioredis) - for background jobs

const IORedis = require("ioredis");
const config = require("./env");

const bullRedis = new IORedis({
    host: config.redis.host,
    port: config.redis.port,
    maxRetriesPerRequest: null,
});

bullRedis.on("connect", () => {
    console.log("BullMQ Redis Connected");
});

bullRedis.on("error", (err) => {
    console.error("BullMQ Redis Error:", err);
});

module.exports = bullRedis;