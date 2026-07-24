const express = require('express');
const { getGithubRepos } = require('../../controllers/githubController');

const router = express.Router();

// external github api route
router.get('/github/repos', getGithubRepos);

module.exports = router;