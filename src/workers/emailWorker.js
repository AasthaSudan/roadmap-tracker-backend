const { Worker } = require("bullmq"); //imports BullMQ's Worker class
const bullRedis = require("../config/bullRedis"); //imports the Redis client for BullMQ connection
const emailService = require("../services/emailService"); //imports the email service

const emailWorker = new Worker( //creates a worker instance that listens to jobs from the emailQueue
    "emailQueue", //name of the queue to listen to
    async (job) => { //processor function that runs when a job is received
        console.log(`Processing ${job.name}...`);

        switch (job.name) {
            case "welcome-email":
                await emailService.sendWelcomeEmail(
                    job.data.email,
                    job.data.name
                );

                console.log(`Welcome email sent to ${job.data.email}`);
                break;

            case "topic-created":
                await emailService.sendTopicCreatedEmail(
                    job.data.email,
                    job.data.name,
                    job.data.topicTitle
                );

                console.log(`Topic email sent to ${job.data.email}`);
                break;

            case "daily-roadmap-reminder":
                console.log("=================================");
                console.log("📚 DAILY ROADMAP REMINDER");
                console.log(job.data.message);
                console.log("=================================");
                break;

            default:
                throw new Error(`Unknown job: ${job.name}`);
        }
    },
    {
        connection: bullRedis, //sets the Redis client for the worker
    }
);

emailWorker.on("completed", (job) => { //event handler that runs when a job completes successfully
    console.log(`Job ${job.id} completed successfully`);
});

emailWorker.on("failed", (job, err) => { //event handler that runs when a job fails
    console.log("========== JOB FAILED ==========");
    console.log("Job ID:", job.id);
    console.log("Job Name:", job.name);
    console.log("Job Data:", job.data);
    console.error(err);
    console.log("================================");
});

module.exports = emailWorker; //exports the email worker