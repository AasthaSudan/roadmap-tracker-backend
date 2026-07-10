const { topics } = require('../data/store');

function createTopic(topicData) {
    const newTopic = {
        id: topics.length ? topics[topics.length - 1].id + 1 : 1,
        ...topicData,
    };

    topics.push(newTopic);
    return newTopic;
}

function getAllTopics() {
    return topics;
}

function getTopicsByRoadmapId(roadmapId) {
    return topics.filter((topic) => topic.roadmapId === roadmapId);
}

function getTopicById(topicId) {
    return topics.find((topic) => topic.id === topicId) || null;
}

function updateTopic(topicId, updates) {
    const topic = topics.find((item) => item.id === topicId);

    if (!topic) {
        return null;
    }

    Object.assign(topic, updates);
    return topic;
}

function deleteTopic(topicId) {
    const topicIndex = topics.findIndex((topic) => topic.id === topicId);

    if (topicIndex === -1) {
        return null;
    }

    const deletedTopic = topics[topicIndex];
    topics.splice(topicIndex, 1);

    return deletedTopic;
}

module.exports = {
    createTopic,
    getAllTopics,
    getTopicsByRoadmapId,
    getTopicById,
    updateTopic,
    deleteTopic,
};