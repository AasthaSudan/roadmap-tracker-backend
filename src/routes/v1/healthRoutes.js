const express = require('express');
const {
    getHome,
    getHealth,
    getReady,
    inspectRequest,
    inspectBody,
    getTopicDetails,
} = require('../../controllers/healthController');

const router = express.Router();

// basic server / inspection routes
router.get('/', getHome);
router.get('/health', getHealth);
router.get('/ready', getReady);
router.get('/inspect', inspectRequest);
router.post('/inspect-body', inspectBody);

// request content practice route
router.get('/api/v1/topics/:id/details', getTopicDetails);

module.exports = router;