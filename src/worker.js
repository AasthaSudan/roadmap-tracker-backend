// Starts all background workers
require("dotenv").config();
const logger = require("../utils/logger");

const startSchedulers = require("./schedulers/emailScheduler");

require("./workers/emailWorker");

startSchedulers();

logger.info("BullMQ Worker is running...");