const express = require("express");

const {
    sendTestEmail,
    sendTopicEmail,
} = require("../controllers/emailController");

const router = express.Router();

router.get("/test-email", sendTestEmail);

router.get("/test-topic-email", sendTopicEmail);

module.exports = router;