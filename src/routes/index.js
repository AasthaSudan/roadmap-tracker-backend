const express = require("express");

const roadmapRoutes = require("./v1/roadmapRoutes");
const topicRoutes = require("./v1/topicRoutes");
const authRoutes = require("./v1/authRoutes");
const githubRoutes = require("./v1/githubRoutes");
const emailRoutes = require("./v1/emailRoutes");
const concurrencyRoutes = require("./v1/concurrencyRoutes");
const testRoutes = require("./v1/testRoutes");
const uploadRoutes = require("./v1/uploadRoutes");
const healthRoutes = require("./v1/healthRoutes");


const router = express.Router();


router.use("/api/v1", roadmapRoutes);
router.use("/api/v1", topicRoutes);
router.use("/api/v1", authRoutes);
router.use("/api/v1", githubRoutes);
router.use("/api/v1/email", emailRoutes);
router.use("/api/v1", concurrencyRoutes);
router.use("/api/v1/test", testRoutes);
router.use("/api/v1/upload", uploadRoutes);
router.use("/", healthRoutes);

module.exports = router;