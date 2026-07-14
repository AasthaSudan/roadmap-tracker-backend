const redisClient = require('../config/redis');

async function invalidateTopicsCache() {

    const keys = await redisClient.keys('topics*'); //find all keys starting with topics

    console.log("CACHE KEYS BEFORE DELETE =", keys);

    if (keys.length > 0) {
        await redisClient.del(keys);
    }

    console.log("CACHE INVALIDATED");

}

module.exports = {
    invalidateTopicsCache
};