const axios = require('axios'); // used to make http requests to the github api
const githubMatcher = require('./githubMatcher'); // used to match the topic title with the commit message
const githubConfig = require('../config/github'); // contains the github repository details
const logger = require("../utils/logger");

async function getCommits() {
    try {
        const response =
            await axios.get(
                `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/commits`
            );

        return response.data;
    }

    catch (error) {

        if (error.response) {

            switch (error.response.status) {

                case 401:
                    throw {
                        statusCode: 401,
                        message: "Invalid GitHub credentials"
                    };

                case 403:
                    throw {
                        statusCode: 403,
                        message: "GitHub API rate limit exceeded"
                    };

                case 404:
                    throw {
                        statusCode: 404,
                        message: "GitHub repository not found"
                    };

                default:
                    throw {
                        statusCode: error.response.status,
                        message: "GitHub API returned an error"
                    };
            }

        }

        throw {
            statusCode: 502,
            message: "Unable to reach GitHub"
        };
    }
}

async function getRelatedCommits(topicTitle) {

    const commits =
        await getCommits();

    logger.info("Topic:", topicTitle);

    commits.forEach(commit => {
        logger.info(commit.commit.message);
    });

    const relatedCommits =
        commits.filter(commit => {

            const result = githubMatcher.isCommitRelated(
                topicTitle,
                commit.commit.message
            );

            logger.info({
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