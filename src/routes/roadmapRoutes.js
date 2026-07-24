const express = require('express');

const {
    getAllRoadmaps,
    createRoadmap,
    updateRoadmap,
    deleteRoadmap,
} = require('../controllers/roadmapController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/v1/roadmaps:
 *   get:
 *     summary: Get all roadmaps
 *     tags:
 *       - Roadmaps
 *     responses:
 *       200:
 *         description: Successfully fetched roadmaps
 */
router.get('/roadmaps', getAllRoadmaps);

/**
 * @swagger
 * /api/v1/roadmaps:
 *   post:
 *     summary: Create a roadmap
 *     tags:
 *       - Roadmaps
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: DSA Roadmap
 *               description:
 *                 type: string
 *                 example: Complete DSA preparation
 *               difficulty:
 *                 type: integer
 *                 example: 3
 *
 *     responses:
 *       201:
 *         description: Roadmap created successfully
 */
router.post('/roadmaps', authMiddleware, createRoadmap);

/**
 * @swagger
 * /api/v1/roadmaps/{id}:
 *   patch:
 *     summary: Update roadmap
 *     tags:
 *       - Roadmaps
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *
 *     responses:
 *       200:
 *         description: Roadmap updated successfully
 */
router.patch('/roadmaps/:id', authMiddleware, updateRoadmap);

/**
 * @swagger
 * /api/v1/roadmaps/{id}:
 *   delete:
 *     summary: Delete roadmap
 *     tags:
 *       - Roadmaps
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *
 *     responses:
 *       200:
 *         description: Roadmap deleted successfully
 */
router.delete('/roadmaps/:id', authMiddleware, deleteRoadmap);


module.exports = router;