// Starts all background workers
require("dotenv").config();

const startSchedulers = require("./schedulers/emailScheduler");

require("./workers/emailWorker");

startSchedulers();

console.log("BullMQ Worker is running...");