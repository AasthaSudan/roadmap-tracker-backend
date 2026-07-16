const emailService = require("../services/emailService");

async function sendTestEmail(req, res, next) {
    try {

        const info = await emailService.sendWelcomeEmail(
            process.env.SMTP_USER,
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
            process.env.SMTP_USER,
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