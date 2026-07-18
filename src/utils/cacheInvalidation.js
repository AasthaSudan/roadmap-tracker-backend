const redisClient = require("../config/redis");

async function invalidateTopicsCache() {
    // Delete topics cache
    const topicKeys = await redisClient.keys("topics:*"); //find all keys starting with topics

    console.log("TOPIC CACHE KEYS =", topicKeys);

    if (topicKeys.length > 0) {
        await redisClient.del(...topicKeys);
    }

    // Delete search cache
    const searchKeys = await redisClient.keys("search:*");

    console.log("SEARCH CACHE KEYS =", searchKeys);

    if (searchKeys.length > 0) {
        await redisClient.del(...searchKeys);
    }

    console.log("CACHE INVALIDATED");
}

module.exports = {
    invalidateTopicsCache,
};