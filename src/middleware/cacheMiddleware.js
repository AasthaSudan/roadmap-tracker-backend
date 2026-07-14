const redisClient = require('../config/redis');
const { getTopicsCacheKey } = require('../utils/cacheKeys');

async function cacheMiddleware(req, res, next) {
    try {

        const cacheKey = getTopicsCacheKey(req.query.roadmapId);
        console.log("CACHE KEY =", cacheKey);
        const cachedData = await redisClient.get(cacheKey); //returns either string or null

        if (cachedData) {

            console.log("CACHE HIT");

            return res.json({ //it will immediately return the cached data without calling the actual route handler
                source: "Redis",
                message: 'Topics fetched successfully',
                count: JSON.parse(cachedData).length,
                data: JSON.parse(cachedData)
            });
        }

        console.log("CACHE MISS");

        // if no cached data, call the actual route handler
        next();

    } catch (error) {
        console.log("CACHE ERROR =", error);

        // Ignore Redis failure and continue to database
        next();
    }
}

module.exports = cacheMiddleware;