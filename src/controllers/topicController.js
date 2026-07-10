const topicService = require('../services/topicService');

function createTopic(req, res, next) {
    try {
        const newTopic = topicService.createTopic(req.body);

        res.status(201).json({
            message: 'Topic created successfully',
            data: newTopic,
        });
    } catch (error) {
        next(error);
    }
}

function getTopics(req, res, next) {
    try {
        const topics = topicService.getTopics(req.query.roadmapId);

        res.json({
            message: 'Topics fetched successfully',
            total: topics.length,
            data: topics,
        });
    } catch (error) {
        next(error);
    }
}

function getTopicById(req, res, next) {
    try {
        const topic = topicService.getTopicById(req.params.id);

        res.json({
            message: 'Topic fetched successfully',
            data: topic,
        });
    } catch (error) {
        next(error);
    }
}

function updateTopic(req, res, next) {
    try {
        const updatedTopic = topicService.updateTopic(req.params.id, req.body);

        res.json({
            message: 'Topic updated successfully',
            data: updatedTopic,
        });
    } catch (error) {
        next(error);
    }
}

function deleteTopic(req, res, next) {
    try {
        const deletedTopic = topicService.deleteTopic(req.params.id);

        res.json({
            message: 'Topic deleted successfully',
            data: deletedTopic,
        });
    } catch (error) {
        next(error);
    }
}

function getRelatedCommits(req, res, next) {
    try {
        const topicId = Number(req.params.id);

        topicService.getTopicById(topicId);

        res.json({
            message: 'Related commits fetched successfully',
            topicId,
            data: [],
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