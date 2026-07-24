module.exports = {

    collectCoverage: true,

    coverageDirectory: "coverage",

    collectCoverageFrom: [
        "src/controllers/**/*.js",
        "src/services/**/*.js",
        "src/middleware/**/*.js",

        "!src/server.js",
        "!src/config/**/*.js",
        "!src/socket/**/*.js",
        "!src/queues/**/*.js"
    ]

};