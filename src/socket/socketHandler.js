const onlineUsers = require("./onlineUsers"); // keeps track of online users
const registerEvents = require("./events");

const socketHandler = (io, socket) => { // socket is an object representing a single client connection
    console.log("User connected:", socket.id); // gives the socket id of the connected user

    const userId = socket.user?.id || "101";

    // store online user
    onlineUsers.set(userId, socket.id);

    io.emit("user_online", userId); //notify all clients that a user is online
    console.log("Online Users:", onlineUsers);

    //registering event listeners like: topic created, comment added, roadmap created, etc.(chat, typing, notifications, rooms, etc.)
    registerEvents(io, socket);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        onlineUsers.delete(userId);
        io.emit("user_offline", userId); //notify all clients that a user is offline
        console.log("Online Users:", onlineUsers);
    });
};

module.exports = socketHandler;