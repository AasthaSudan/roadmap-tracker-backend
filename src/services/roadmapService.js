const roadmapRepository = require('../repositories/roadmapRepository');

// Get all roadmaps
async function getAllRoadmaps() {
    return roadmapRepository.getAllRoadmaps();
}

// Create roadmap
async function createRoadmap(data) {
    const {
        title,
        description,
        difficulty,
    } = data;

    // Validate title
    if (title === undefined) {
        throw new Error('Title is required');
    }

    if (typeof title !== 'string') {
        throw new Error('Title must be a string');
    }

    const cleanTitle = title.trim();

    if (!cleanTitle) {
        throw new Error('Title cannot be empty');
    }

    // Validate description
    let cleanDescription = '';

    if (description !== undefined) {
        if (typeof description !== 'string') {
            throw new Error('Description must be a string');
        }

        cleanDescription = description.trim();
    }

    // Validate difficulty
    let cleanDifficulty = null;

    if (difficulty !== undefined) {
        if (
            typeof difficulty !== 'number' ||
            !Number.isInteger(difficulty)
        ) {
            throw new Error(
                'Difficulty must be an integer between 1 and 5'
            );
        }

        if (difficulty < 1 || difficulty > 5) {
            throw new Error(
                'Difficulty must be an integer between 1 and 5'
            );
        }

        cleanDifficulty = difficulty;
    }

    return roadmapRepository.createRoadmap({
        title: cleanTitle,
        description: cleanDescription,
        difficulty: cleanDifficulty,
    });
}

// Update roadmap
async function updateRoadmap(id, data) {
    try {
        return await roadmapRepository.updateRoadmap(id, data);

    } catch (err) {

        // Prisma error: Record not found
        if (err.code === 'P2025') {
            throw new Error('Roadmap not found');
        }

        // Pass unknown errors forward
        throw err;
    }
}

// Delete roadmap
async function deleteRoadmap(id) {
    try {
        return await roadmapRepository.deleteRoadmap(id);

    } catch (err) {

        // Prisma error: Record not found
        if (err.code === 'P2025') {
            throw new Error('Roadmap not found');
        }

        // Pass unknown errors forward
        throw err;
    }
}

module.exports = {
    getAllRoadmaps,
    createRoadmap,
    updateRoadmap,
    deleteRoadmap,
};