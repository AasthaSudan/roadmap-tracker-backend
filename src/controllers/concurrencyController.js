const { Worker } = require("worker_threads");
const path = require("path");

function blockingTask(req, res) {
    const start = Date.now();

    let sum = 0;

    // Heavy CPU work
    for (let i = 0; i < 5_000_000_000; i++) {
        sum += i;
    }

    const timeTaken = Date.now() - start;

    res.json({
        message: "Blocking task completed",
        timeTaken: `${timeTaken} ms`,
    });
}

function workerTask(req, res) {

    const worker = new Worker(
        path.join(__dirname, "../workers/cpuWorker.js")
    );

    worker.on("message", (result) => {
        res.json(result);
    });

    worker.on("error", (err) => {
        res.status(500).json({
            error: err.message,
        });
    });
}

module.exports = {
    blockingTask,
    workerTask,
};