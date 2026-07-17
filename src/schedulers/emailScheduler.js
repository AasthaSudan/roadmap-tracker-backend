const emailQueue = require("../queues/emailQueue");

async function startSchedulers() {
    await emailQueue.upsertJobScheduler(
        "daily-roadmap-reminder",
        {
            every: 60000, // every 60 seconds (for testing)
        },
        {
            name: "daily-roadmap-reminder",
            data: {
                message: "⏰ Time to continue your Roadmap Tracker! Complete today's pending topics.",
            },
        }
    );

    console.log("Daily Roadmap Reminder Scheduler Started");
}

module.exports = startSchedulers;