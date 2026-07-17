const topicService = require('../services/topicService');
const githubService = require('../integrations/githubService');
const redisClient = require('../config/redis');
const { getTopicsCacheKey } = require('../utils/cacheKeys');
const { invalidateTopicsCache } = require('../utils/cacheInvalidation');

async function createTopic(req, res, next) {
    try {
        const newTopic = await topicService.createTopic(req.body);

        await invalidateTopicsCache();

        res.status(201).json({
            message: 'Topic created successfully',
            data: newTopic,
        });
    } catch (error) {
        next(error);
    }
}

async function getTopics(req, res, next) {
    try {
        const topics = await topicService.getTopics(req.query.roadmapId);
        const cacheKey = getTopicsCacheKey(req.query.roadmapId);

        console.log("cache is empty");

        try {
            await redisClient.set( // storing in redis cache
                cacheKey,
                JSON.stringify(topics),
                {
                    EX: 300,  //5 mins
                }
            );

            console.log("TOPICS STORED IN CACHE");
        } catch (error) {
            console.log("FAILED TO STORE CACHE:", error.message);
        }

        res.json({
            message: 'Topics fetched successfully',
            total: topics.length,
            data: topics,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function searchTopics(req, res, next) {

    try {

        const { q } = req.query;

        const results =
            await topicService.searchTopics(q);

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
            message: 'Topic fetched successfully',
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

        // Clear cache since data changed
        await invalidateTopicsCache();

        res.json({
            message: 'Topic updated successfully',
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
            message: 'Topic deleted successfully',
            data: deletedTopic,
        });
    } catch (error) {
        next(error);
    }
}

async function getRelatedCommits(req, res, next) {
    try {
        console.log("ID =", req.params.id);

        const topic = await topicService.getTopicById(req.params.id);

        console.log("TOPIC =", topic);

        const commits = await githubService.getRelatedCommits(topic.title);

        res.json({
            message: 'Related commits fetched successfully',
            topicId: topic.id,
            total: commits.length,
            data: commits
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