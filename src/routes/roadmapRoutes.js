const express = require('express');
const {
    getAllRoadmaps,
    createRoadmap,
    deleteRoadmap,
} = require('../controllers/roadmapController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// roadmap routes
router.get('/roadmaps', getAllRoadmaps);
router.post('/roadmaps', authMiddleware, createRoadmap);
router.delete('/roadmaps/:id', authMiddleware, deleteRoadmap);

module.exports = router;