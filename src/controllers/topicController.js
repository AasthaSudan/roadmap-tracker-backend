const topicService = require('../services/topicService');
const githubService = require('../integrations/githubService');

async function createTopic(req, res, next) {
    try {
        const newTopic = await topicService.createTopic(req.body);

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

        res.json({
            message: 'Topics fetched successfully',
            total: topics.length,
            data: topics,
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
        const topic =
            await topicService.getTopicById(
                req.params.id
            );

        const commits =
            await githubService.getRelatedCommits(
                topic.title
            );

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
    getRelatedCommits
};