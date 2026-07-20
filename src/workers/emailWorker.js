const { Worker } = require("bullmq"); //imports BullMQ's Worker class
const bullRedis = require("../config/bullRedis"); //imports the Redis client for BullMQ connection
const emailService = require("../services/emailService"); //imports the email service
const logger = require("../utils/logger");

const emailWorker = new Worker( //creates a worker instance that listens to jobs from the emailQueue
    "emailQueue", //name of the queue to listen to
    async (job) => { //processor function that runs when a job is received
        logger.info(`Processing ${job.name}...`);

        switch (job.name) {
            case "welcome-email":
                await emailService.sendWelcomeEmail(
                    job.data.email,
                    job.data.name
                );

                logger.info(`Welcome email sent to ${job.data.email}`);
                break;

            case "topic-created":
                await emailService.sendTopicCreatedEmail(
                    job.data.email,
                    job.data.name,
                    job.data.topicTitle
                );

                logger.info(`Topic email sent to ${job.data.email}`);
                break;

            case "daily-roadmap-reminder":
                logger.info("=================================");
                logger.info("📚 DAILY ROADMAP REMINDER");
                logger.info(job.data.message);
                logger.info("=================================");
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
    logger.info(`Job ${job.id} completed successfully`);
});

emailWorker.on("failed", (job, err) => { //event handler that runs when a job fails
    logger.info("========== JOB FAILED ==========");
    logger.info("Job ID:", job.id);
    logger.info("Job Name:", job.name);
    logger.info("Job Data:", job.data);
    logger.error(err);
    logger.info("================================");
});

module.exports = emailWorker; //exports the email worker