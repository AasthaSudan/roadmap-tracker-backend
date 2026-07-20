const transporter = require("../config/mail");
const { welcomeEmailTemplate } = require("../templates/welcomeEmail");
const config = require("../config/env");
const { topicCreatedTemplate } = require("../templates/topicCreatedEmail");

async function sendWelcomeEmail(email, name) {
    const info = await transporter.sendMail({
        from: config.smtp.user,
        to: email,
        subject: "🎉 Welcome to Roadmap Tracker",
        html: welcomeEmailTemplate(name),
    });

    logger.info("Welcome email sent");

    return info;
}

async function sendTopicCreatedEmail(email, name, topicTitle) {
    const info = await transporter.sendMail({
        from: config.smtp.user,
        to: email,
        subject: "📚 New Topic Created",
        html: topicCreatedTemplate(name, topicTitle),
    });

    logger.info("Topic created email sent");

    return info;
}

module.exports = {
    sendWelcomeEmail,
    sendTopicCreatedEmail,
};