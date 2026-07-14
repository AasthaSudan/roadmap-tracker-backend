const express = require('express');
const {
    createTopic,
    getTopics,
    getTopicById,
    updateTopic,
    deleteTopic,
    getRelatedCommits,
} = require('../controllers/topicController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Topic CRUD routes
router.post('/topics', authMiddleware, createTopic);
router.get('/topics', getTopics);
router.get('/topics/:id', getTopicById);
router.patch('/topics/:id', authMiddleware, updateTopic);
router.delete('/topics/:id', authMiddleware, deleteTopic);
router.get('/topics/:id/related-commits', getRelatedCommits);

module.exports = router;