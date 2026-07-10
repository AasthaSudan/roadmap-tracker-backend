const jwt = require('jsonwebtoken');

// middleware to authenticate token
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization; // Bearer <token>

    if (!authHeader) {
        return res.status(401).json({
            message: 'Access denied. No token provided.',
        });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>, so we split it and take the second part

    if (!token) {
        return res.status(401).json({
            message: 'Access denied. Invalid token format.',
        });
    }

    try {
        // verify token using the same JWT secret stored in .env
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user info to request
        // This lets protected route handlers access the logged-in user's data using req.user
        req.user = decodedToken;

        next(); // “Auth check passed. Continue to the actual route handler.”
        // Without next(), request would get stuck in middleware.
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token.',
        });
    }
}

module.exports = authMiddleware;