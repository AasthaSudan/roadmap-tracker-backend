const logger = require("../utils/logger");

function errorMiddleware(error, req, res, next) {
    logger.error({
        message: error.message,
        stack: error.stack,
        method: req.method,
        url: req.originalUrl,
        statusCode: error.statusCode || 500,
    });

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
    });
}

module.exports = errorMiddleware;