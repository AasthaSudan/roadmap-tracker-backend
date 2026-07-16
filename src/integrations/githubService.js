const axios = require('axios');
const githubMatcher = require('./githubMatcher');
const githubConfig = require('../config/github');

async function getCommits() {
    try {
        const response =
            await axios.get(
                `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/commits`
            );

        return response.data;
    }

    catch (error) {
        throw {
            statusCode: 500,
            message: "Failed to fetch GitHub commits"
        };
    }
}

async function getRelatedCommits(topicTitle) {

    const commits =
        await getCommits();

    console.log("Topic:", topicTitle);

    commits.forEach(commit => {
        console.log(commit.commit.message);
    });

    const relatedCommits =
        commits.filter(commit => {

            const result = githubMatcher.isCommitRelated(
                topicTitle,
                commit.commit.message
            );

            console.log({
                message: commit.commit.message,
                matched: result
            });

            return result;
        });

    return relatedCommits.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: commit.commit.author.date

    }));
}

module.exports = {
    getCommits,
    getRelatedCommits
};