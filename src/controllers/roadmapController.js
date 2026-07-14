const roadmapService = require('../services/roadmapService');

// GET all roadmaps
async function getAllRoadmaps(req, res) {
    try {
        const roadmaps =
            await roadmapService.getAllRoadmaps();

        res.json({
            message: 'All roadmaps fetched successfully',
            total: roadmaps.length,
            data: roadmaps,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
}

// POST roadmap
async function createRoadmap(req, res) {
    try {
        const roadmap =
            await roadmapService.createRoadmap(req.body);

        res.status(201).json({
            message: 'Roadmap created successfully',
            data: roadmap,
        });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
}

// PATCH roadmap
async function updateRoadmap(req, res) {
    try {
        const roadmap =
            await roadmapService.updateRoadmap(
                Number(req.params.id),
                req.body
            );

        res.json({
            message: 'Roadmap updated successfully',
            data: roadmap,
        });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
}

// DELETE roadmap
async function deleteRoadmap(req, res) {
    try {
        const roadmap =
            await roadmapService.deleteRoadmap(
                Number(req.params.id)
            );

        res.json({
            message: 'Roadmap deleted successfully',
            data: roadmap,
        });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
}

module.exports = {
    getAllRoadmaps,
    createRoadmap,
    updateRoadmap,
    deleteRoadmap,
};