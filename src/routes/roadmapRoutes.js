console.log("ROADMAP ROUTE FILE EXECUTED");

const express = require('express');
const {
    getAllRoadmaps,
    createRoadmap,
    updateRoadmap,
    deleteRoadmap,
} = require('../controllers/roadmapController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// roadmap routes
router.get('/roadmaps', getAllRoadmaps);
router.post('/roadmaps', authMiddleware, createRoadmap);
router.patch('/roadmaps/:id', authMiddleware, updateRoadmap);
router.delete('/roadmaps/:id', authMiddleware, deleteRoadmap);

module.exports = router;