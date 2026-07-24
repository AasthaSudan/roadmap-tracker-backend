const express = require("express");

const {
    sendTestEmail,
    sendTopicEmail,
} = require("../../controllers/emailController");

const router = express.Router();

router.get("/test", sendTestEmail);

router.get("/topic", sendTopicEmail);

module.exports = router;