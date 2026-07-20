const redisClient = require('../config/redis');
const { getTopicsCacheKey } = require('../utils/cacheKeys');
const logger = require("../utils/logger");

async function cacheMiddleware(req, res, next) {
    try {

        const cacheKey = getTopicsCacheKey(req.query.roadmapId);
        logger.info("CACHE KEY =", cacheKey);
        const cachedData = await redisClient.get(cacheKey); //returns either string or null

        if (cachedData) {

            logger.info("CACHE HIT");

            return res.json({ //it will immediately return the cached data without calling the actual route handler
                source: "Redis",
                message: 'Topics fetched successfully',
                count: JSON.parse(cachedData).length,
                data: JSON.parse(cachedData)
            });
        }

        logger.info("CACHE MISS");

        // if no cached data, call the actual route handler
        next();

    } catch (error) {
        logger.info("CACHE ERROR =", error);

        // Ignore Redis failure and continue to database
        next();
    }
}

module.exports = cacheMiddleware;