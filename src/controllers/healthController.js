// ===== Basic health / inspection controllers =====
// These controllers handle simple request/response routes that help us
// check server status and inspect incoming request data.

function getHome(req, res) { // req-request, res-response
    res.send('Roadmap Tracker backend is running...');
}

function getHealth(req, res) {
    res.json({ // sends a JSON response
        status: 'ok',
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
    });
}

function inspectRequest(req, res) { // inspect -> lets your server show what request it received (method, url, headers)
    res.json({
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
    });
}

// Inspect request body -> lets you see what Express received in req.body
function inspectBody(req, res) {
    res.json({
        message: 'Request body received successfully',
        body: req.body,
    });
}

// This route is for practicing request content:
// - route params
// - query params
// - selected headers
function getTopicDetails(req, res) {
    res.json({
        message: 'Request content received successfully',
        params: req.params,
        query: req.query,
        headers: {
            authorization: req.headers.authorization || null,
            userAgent: req.headers['user-agent'] || null,
            learningMode: req.headers['x-learning-mode'] || null,
        },
    });
}

module.exports = {
    getHome,
    getHealth,
    inspectRequest,
    inspectBody,
    getTopicDetails,
};