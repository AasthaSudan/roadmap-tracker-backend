function loggerMiddleware(req, res, next) {
    const currentTime = new Date().toISOString(); // gives current time in a standard readable format
    console.log(`[${currentTime}] ${req.method} ${req.originalUrl}`);

    next(); // IMPORTANT: “Logger has finished its job. Continue to the next middleware / route handler.”
}

module.exports = loggerMiddleware;