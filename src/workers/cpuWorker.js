const { parentPort } = require("worker_threads");

let sum = 0;

const start = Date.now();

for (let i = 0; i < 5_000_000_000; i++) {
    sum += i;
}

const timeTaken = Date.now() - start;

parentPort.postMessage({
    message: "Worker task completed",
    timeTaken: `${timeTaken} ms`,
});