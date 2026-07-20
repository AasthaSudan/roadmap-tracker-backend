const redisClient = require("../config/redis");
const logger = require("../utils/logger");

async function invalidateTopicsCache() {
    // Delete topics cache
    const topicKeys = await redisClient.keys("topics:*"); //find all keys starting with topics

    logger.info("TOPIC CACHE KEYS =", topicKeys);

    if (topicKeys.length > 0) {
        await redisClient.del(...topicKeys);
    }

    // Delete search cache
    const searchKeys = await redisClient.keys("search:*");

    logger.info("SEARCH CACHE KEYS =", searchKeys);

    if (searchKeys.length > 0) {
        await redisClient.del(...searchKeys);
    }

    logger.info("CACHE INVALIDATED");
}

module.exports = {
    invalidateTopicsCache,
};