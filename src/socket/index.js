const { Server } = require("socket.io"); // Server class from socket.io library
const socketHandler = require("./socketHandler");
const socketAuth = require("./auth");

const initSocket = (server) => { // server is the http server instance, shares thesame TCP connection
    const io = new Server(server, {
        cors: { //socket's CORS configuration (diff from express CORS)
            origin: process.env.CLIENT_URL || "http://localhost:5173", // frontend url
            credentials: true, // Allow cookies/auth credentials if needed in the future
        }
    });

    io.use(socketAuth); // authentication middleware

    // Listen for new client connections
    io.on("connection", (socket) => socketHandler(io, socket));

    return io; // return the socket.io server instance
};

module.exports = initSocket;