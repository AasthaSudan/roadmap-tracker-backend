const { roadmaps } = require('../data/store');

// ===== Roadmap controllers =====
// Controllers contain the actual business logic for roadmap routes.

// GET all roadmaps
function getAllRoadmaps(req, res) {
    res.json({
        message: 'All roadmaps fetched successfully',
        total: roadmaps.length, // no. of items
        data: roadmaps, // actual roadmaps
    });
}

// POST roadmap using real JSON body
function createRoadmap(req, res) {
    const { title, description, difficulty } = req.body; // read data from request body

    // validate title
    if (title === undefined) {
        return res.status(400).json({
            message: 'Title is required',
        });
    }

    if (typeof title !== 'string') {
        return res.status(400).json({
            message: 'Title must be a string',
        });
    }

    const cleanTitle = title.trim();

    if (!cleanTitle) {
        return res.status(400).json({
            message: 'Title cannot be empty',
        });
    }

    // validate description
    let cleanDescription = '';

    if (description !== undefined) {
        if (typeof description !== 'string') {
            return res.status(400).json({
                message: 'Description must be a string',
            });
        }

        cleanDescription = description.trim();
    }

    // validate difficulty
    let cleanDifficulty = null;

    if (difficulty !== undefined) {
        if (typeof difficulty !== 'number' || !Number.isInteger(difficulty)) {
            return res.status(400).json({
                message: 'Difficulty must be an integer between 1 and 5',
            });
        }

        if (difficulty < 1 || difficulty > 5) {
            return res.status(400).json({
                message: 'Difficulty must be an integer between 1 and 5',
            });
        }

        cleanDifficulty = difficulty;
    }

    const newRoadmap = { // client-driven roadmap, not hardcoded by server
        id: roadmaps.length + 1,
        title: cleanTitle,
        description: cleanDescription,
        difficulty: cleanDifficulty,
    };

    roadmaps.push(newRoadmap);

    res.status(201).json({ // request succeeded and new resource created
        message: 'Roadmap created successfully',
        data: newRoadmap,
    });
}

// DELETE roadmap by id
function deleteRoadmap(req, res) {
    const roadmapId = Number(req.params.id); // route params come as strings, so convert id to a number before comparing with numeric roadmap ids

    // validate route param id
    if (!Number.isInteger(roadmapId) || roadmapId <= 0) {
        return res.status(400).json({
            message: 'Roadmap id must be a valid positive integer',
        });
    }

    // searches the array and returns the position of the matching roadmap
    // if not found, findIndex returns -1
    const roadmapIndex = roadmaps.findIndex((roadmap) => roadmap.id === roadmapId);

    if (roadmapIndex === -1) {
        return res.status(404).json({ // 404 = resource not found
            message: `Roadmap with id ${roadmapId} not found`,
        });
    }

    const deletedRoadmap = roadmaps[roadmapIndex]; // store the roadmap before removing it
    roadmaps.splice(roadmapIndex, 1); // remove it from the array

    res.json({
        message: 'Roadmap deleted successfully',
        data: deletedRoadmap,
    });
}

module.exports = {
    getAllRoadmaps,
    createRoadmap,
    deleteRoadmap,
};