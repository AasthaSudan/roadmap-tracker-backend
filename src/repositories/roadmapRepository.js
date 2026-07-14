const prisma = require('../config/prisma');

// Fetch all roadmaps
async function getAllRoadmaps() {
    return prisma.roadmap.findMany();
}

// Create a new roadmap
async function createRoadmap(data) {
    return prisma.roadmap.create({
        data,
    });
}

// Update roadmap
async function updateRoadmap(id, data) {
    return prisma.roadmap.update({
        where: {
            id,
        },
        data,
    });
}

// Delete roadmap
async function deleteRoadmap(id) {
    return prisma.roadmap.delete({
        where: {
            id,
        },
    });
}

module.exports = {
    getAllRoadmaps,
    createRoadmap,
    updateRoadmap,
    deleteRoadmap,
};