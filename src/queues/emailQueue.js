const { Queue } = require("bullmq"); //imports BullMQ's Queue class
const redisClient = require("../config/bullRedis"); //imports the Redis client for BullMQ connection

// Create Email Queue
const emailQueue = new Queue("emailQueue", { //creates a new queue named "emailQueue"
    connection: redisClient, //sets the Redis client for the queue..BullMQ stores every job inside Redis
});

module.exports = emailQueue; //exports the email queue for use in other modules