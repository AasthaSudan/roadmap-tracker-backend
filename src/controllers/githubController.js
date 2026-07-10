const axios = require('axios');

// ===== GitHub API controller =====
// This controller makes an external API call to GitHub
// and returns a simplified list of repositories.

async function getGithubRepos(req, res) {
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({
            message: 'GitHub username is required',
        });
    }

    try {
        const githubResponse = await axios.get(
            `https://api.github.com/users/${username}/repos`
        );

        // We do not return the full giant GitHub response.
        // Instead, we transform it into a smaller cleaner response for our app.
        const repos = githubResponse.data.map((repo) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            private: repo.private,
            html_url: repo.html_url,
            description: repo.description,
        }));

        res.json({
            message: 'GitHub repositories fetched successfully',
            username,
            total: repos.length,
            data: repos,
        });
    } catch (error) {
        // If GitHub says user not found, return a cleaner 404 from our API too
        if (error.response?.status === 404) {
            return res.status(404).json({
                message: `GitHub user '${username}' not found`,
            });
        }

        return res.status(500).json({
            message: 'Failed to fetch GitHub repositories',
            error: error.response?.data || error.message,
        });
    }
}

module.exports = {
    getGithubRepos,
};