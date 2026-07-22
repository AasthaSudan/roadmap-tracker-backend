const crypto = require("crypto");

async function threadPoolDemo(req, res) {

    const start = Date.now();

    for (let i = 1; i <= 8; i++) {

        crypto.pbkdf2(
            "password",
            "salt",
            100000,
            512,
            "sha512",
            () => {
                console.log(
                    `Task ${i} completed in ${Date.now() - start} ms`
                );
            }
        );
    }

    res.json({
        message: "8 crypto tasks started"
    });
}

module.exports = {
    threadPoolDemo,
};