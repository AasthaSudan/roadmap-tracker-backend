const transporter = require("../config/mail");

const { welcomeEmailTemplate } = require("../templates/welcomeEmail");

const { topicCreatedTemplate } = require("../templates/topicCreatedEmail");

async function sendWelcomeEmail(email, name) {
    const info = await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "🎉 Welcome to Roadmap Tracker",
        html: welcomeEmailTemplate(name),
    });

    console.log("Welcome email sent");

    return info;
}

async function sendTopicCreatedEmail(email, name, topicTitle) {
    const info = await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "📚 New Topic Created",
        html: topicCreatedTemplate(name, topicTitle),
    });

    console.log("Topic created email sent");

    return info;
}

module.exports = {
    sendWelcomeEmail,
    sendTopicCreatedEmail,
};