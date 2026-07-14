const prisma = require('../config/prisma');


// Create topic
async function createTopic(topicData) {
    return prisma.topic.create({
        data: topicData,
    });
}


// Get all topics
async function getAllTopics() {
    return prisma.topic.findMany();
}


// Get topics by roadmap
async function getTopicsByRoadmapId(roadmapId) {
    return prisma.topic.findMany({
        where: {
            roadmapId,
        },
    });
}


// Get topic by id
async function getTopicById(topicId) {
    return prisma.topic.findUnique({
        where: {
            id: topicId,
        },
    });
}


// Update topic
async function updateTopic(topicId, updates) {
    return prisma.topic.update({
        where: {
            id: topicId,
        },
        data: updates,
    });
}


// Delete topic
async function deleteTopic(topicId) {
    return prisma.topic.delete({
        where: {
            id: topicId,
        },
    });
}


module.exports = {
    createTopic,
    getAllTopics,
    getTopicsByRoadmapId,
    getTopicById,
    updateTopic,
    deleteTopic,
};