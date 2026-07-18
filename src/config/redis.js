const { createClient } = require("redis");
const config = require("./env");

const client = createClient({ //create one redis client for entire application
    socket: {
        host: config.redis.host,
        port: config.redis.port,
    },
});

client.on("error", (err) => {
    console.log("Redis Error:", err);
});

module.exports = client;