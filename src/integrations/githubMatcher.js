function normalizeText(text) {

    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim();

}

function getKeywords(text) {
    return normalizeText(text)
        .split(' ')
        .filter(word => word.length > 2);

}

function isCommitRelated(topicTitle, commitMessage) {

    const topicKeywords = getKeywords(topicTitle);
    const commitWords = getKeywords(commitMessage);

    let matchedWords = 0;

    topicKeywords.forEach(keyword => {
        if (commitWords.includes(keyword)) {
            matchedWords++;
        }

    });

    const matchScore = matchedWords / topicKeywords.length;

    logger.info({
        topicTitle,
        topicKeywords,
        commitMessage,
        matchedWords,
        matchScore
    });

    return matchScore >= 0.5;

}

module.exports = {
    isCommitRelated
};