function getTopicsCacheKey(roadmapId) {

    if (roadmapId) {
        return `topics:${roadmapId}`;
    }
    return 'topics';
}

module.exports = {
    getTopicsCacheKey
};