const topicService = require("../services/topicService");
const githubService = require("../integrations/githubService");
const redisClient = require("../config/redis");
const { getTopicsCacheKey } = require("../utils/cacheKeys");
const { invalidateTopicsCache } = require("../utils/cacheInvalidation");
const logger = require("../utils/logger");

async function createTopic(req, res, next) {
    try {
        const newTopic = await topicService.createTopic(req.body);

        await invalidateTopicsCache();

        res.status(201).json({
            message: "Topic created successfully",
            data: newTopic,
        });
    } catch (error) {
        next(error);
    }
}

async function getTopics(req, res, next) {
    try {
        const cacheKey = getTopicsCacheKey(req.query.roadmapId);

        // Check cache first
        const cachedTopics = await redisClient.get(cacheKey);

        if (cachedTopics) {
            logger.info("TOPICS CACHE HIT");

            const topics = JSON.parse(cachedTopics);

            return res.json({
                message: "Topics fetched successfully (from cache)",
                total: topics.length,
                data: topics,
            });
        }

        logger.info("TOPICS CACHE MISS");

        const topics = await topicService.getTopics(req.query.roadmapId);

        await redisClient.set(
            cacheKey,
            JSON.stringify(topics),
            {
                EX: 300,
            }
        );

        logger.info("TOPICS STORED IN CACHE");

        res.json({
            message: "Topics fetched successfully",
            total: topics.length,
            data: topics,
        });

    } catch (error) {
        next(error);
    }
}

async function searchTopics(req, res, next) {
    try {

        const { q } = req.query;

        const cacheKey = `search:${q.toLowerCase()}`;

        // Check Redis first
        const cachedResults = await redisClient.get(cacheKey);

        if (cachedResults) {

            logger.info("SEARCH CACHE HIT");

            const results = JSON.parse(cachedResults);

            return res.json({
                message: "Search completed successfully (from cache)",
                total: results.length,
                data: results,
            });
        }

        logger.info("SEARCH CACHE MISS");

        const results = await topicService.searchTopics(q);

        await redisClient.set(
            cacheKey,
            JSON.stringify(results),
            {
                EX: 300,
            }
        );

        logger.info("SEARCH RESULTS STORED IN CACHE");

        res.json({
            message: "Search completed successfully",
            total: results.length,
            data: results,
        });

    } catch (error) {
        next(error);
    }
}

async function getTopicById(req, res, next) {
    try {
        const topic = await topicService.getTopicById(req.params.id);

        res.json({
            message: "Topic fetched successfully",
            data: topic,
        });

    } catch (error) {
        next(error);
    }
}

async function updateTopic(req, res, next) {
    try {

        const updatedTopic = await topicService.updateTopic(
            req.params.id,
            req.body
        );

        await invalidateTopicsCache();

        res.json({
            message: "Topic updated successfully",
            data: updatedTopic,
        });

    } catch (error) {
        next(error);
    }
}

async function deleteTopic(req, res, next) {
    try {

        const deletedTopic = await topicService.deleteTopic(req.params.id);

        await invalidateTopicsCache();

        res.json({
            message: "Topic deleted successfully",
            data: deletedTopic,
        });

    } catch (error) {
        next(error);
    }
}

async function getRelatedCommits(req, res, next) {
    try {

        logger.info("ID =", req.params.id);

        const topic = await topicService.getTopicById(req.params.id);

        logger.info("TOPIC =", topic);

        const commits = await githubService.getRelatedCommits(topic.title);

        res.json({
            message: "Related commits fetched successfully",
            topicId: topic.id,
            total: commits.length,
            data: commits,
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    createTopic,
    getTopics,
    getTopicById,
    updateTopic,
    deleteTopic,
    getRelatedCommits,
    searchTopics,
};