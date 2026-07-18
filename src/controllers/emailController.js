const emailService = require("../services/emailService");
const config = require("../config/env");

async function sendTestEmail(req, res, next) {
    try {

        const info = await emailService.sendWelcomeEmail(
            config.smtp.user,
            "Aastha Sudan"
        );

        res.status(200).json({
            success: true,
            message: "Email sent successfully",
            messageId: info.messageId,
            accepted: info.accepted,
        });

    } catch (error) {
        next(error);
    }
}

async function sendTopicEmail(req, res, next) {
    try {

        const info = await emailService.sendTopicCreatedEmail(
            config.smtp.user,
            "Aastha Sudan",
            "Redis Caching"
        );

        res.status(200).json({
            success: true,
            message: "Topic email sent successfully",
            messageId: info.messageId,
            accepted: info.accepted,
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    sendTestEmail,
    sendTopicEmail,
};