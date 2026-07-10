const express = require('express');
const {
    createTopic,
    getTopics,
    getTopicById,
    updateTopic,
    deleteTopic,
} = require('../controllers/topicController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Topic CRUD routes
router.post('/api/v1/topics', authMiddleware, createTopic);
router.get('/api/v1/topics', getTopics);
router.get('/api/v1/topics/:id', getTopicById);
router.patch('/api/v1/topics/:id', authMiddleware, updateTopic);
router.delete('/api/v1/topics/:id', authMiddleware, deleteTopic);

module.exports = router;