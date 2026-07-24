const express = require("express");
const {
    blockingTask,
    workerTask,
} = require("../../controllers/concurrencyController");

const router = express.Router();

router.get("/blocking", blockingTask);
router.get("/worker", workerTask);

module.exports = router;