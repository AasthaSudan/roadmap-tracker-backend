const fs = require("fs");
const path = require("path");

async function syncRead(req, res) {

    const start = Date.now();

    for (let i = 0; i < 50000; i++) {
        fs.readFileSync(
            path.join(__dirname, "../../package.json")
        );
    }

    res.json({
        mode: "sync",
        timeTaken: `${Date.now() - start} ms`,
    });
}

async function asyncRead(req, res) {

    const start = Date.now();

    const tasks = [];

    for (let i = 0; i < 100; i++) {
        tasks.push(
            fs.promises.readFile(
                path.join(__dirname, "../../package.json")
            )
        );
    }

    await Promise.all(tasks);

    res.json({
        mode: "async",
        timeTaken: `${Date.now() - start} ms`,
    });
}

module.exports = {
    syncRead,
    asyncRead,
};