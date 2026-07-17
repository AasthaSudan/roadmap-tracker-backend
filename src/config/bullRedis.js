//BullMQ (ioredis) - for background jobs

const IORedis = require("ioredis");

const bullRedis = new IORedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,

    maxRetriesPerRequest: null,
});

bullRedis.on("connect", () => {
    console.log("BullMQ Redis Connected");
});

bullRedis.on("error", (err) => {
    console.error("BullMQ Redis Error:", err);
});

module.exports = bullRedis;