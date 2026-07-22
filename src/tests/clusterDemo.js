const cluster = require("cluster");
const os = require("os");
const express = require("express");

const totalCPUs = os.cpus().length;

if (cluster.isPrimary) {

    console.log(`Primary Process: ${process.pid}`);
    console.log(`Creating ${totalCPUs} workers...\n`);

    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork(); //creates a new worker process
    }

} else {

    const app = express();

    app.get("/", (req, res) => {
        console.log(`Request handled by ${process.pid}`);

        res.json({
            pid: process.pid,
            worker: cluster.worker.id,
        });
    });

    app.listen(4000, () => {
        console.log(`Worker ${process.pid} started`);
    });

}