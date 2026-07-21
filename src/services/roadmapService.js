const roadmapRepository = require('../repositories/roadmapRepository');
const redisClient = require('../config/redis');
const logger = require("../utils/logger");

const ROADMAP_CACHE_KEY = 'roadmaps';
const CACHE_TTL = 60 * 5; // 5 minutes

// Get all roadmaps
async function getAllRoadmaps() {
    // Check cache first
    const cachedRoadmaps = await redisClient.get(ROADMAP_CACHE_KEY);

    if (cachedRoadmaps) {
        logger.info("CACHE HIT");
        return JSON.parse(cachedRoadmaps);
    }
    logger.info("CACHE MISS");

    // Get from database
    const roadmaps = await roadmapRepository.getAllRoadmaps();

    // Set cache with 5-minute TTL
    await redisClient.set(
        ROADMAP_CACHE_KEY,
        JSON.stringify(roadmaps),
        {
            EX: CACHE_TTL
        }
    );

    return roadmaps;
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

    const roadmap = await roadmapRepository.createRoadmap({
        title: cleanTitle,
        description: cleanDescription,
        difficulty: cleanDifficulty,
    });

    // Invalidate cache
    await redisClient.del(ROADMAP_CACHE_KEY);

    return roadmap;
}

// Update roadmap
async function updateRoadmap(id, data) {
    try {
        const roadmap = await roadmapRepository.updateRoadmap(id, data);

        // Invalidate cache
        await redisClient.del(ROADMAP_CACHE_KEY);

        return roadmap;

    } catch (err) {
        if (err.code === 'P2025') {
            throw new Error('Roadmap not found');
        }
        throw err;
    }
}

// Delete roadmap
async function deleteRoadmap(id) {
    try {
        const roadmap = await roadmapRepository.deleteRoadmap(id);

        // Invalidate cache
        await redisClient.del(ROADMAP_CACHE_KEY);

        return roadmap;

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