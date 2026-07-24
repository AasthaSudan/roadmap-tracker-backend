const jwt = require("jsonwebtoken");
const config = require("../config/env");

const socketAuth = (socket, next) => {
    const token = socket.handshake.auth.token; //jwt token passed in handshake

    if (!token) { //if token is not present
        return next(
            new Error("Authentication error")
        );
    }

    try {
        const decoded = jwt.verify( // verify the token
            token,
            config.jwtSecret
        );

        socket.user = decoded; // attaching the decoded token to the socket instance
        next(); //allow connection

    } catch (error) {
        next(
            new Error("Invalid token")
        );
    }
};

module.exports = socketAuth;