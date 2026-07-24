const { io } = require("socket.io-client"); // socket.io-client library used to create a client instance

const TOKEN = process.env.JWT_TOKEN;

// Create a client instance
const socket = io(
    "http://localhost:3000",
    {
        // JWT sent during the Socket.IO handshake
        auth: {
            token: TOKEN
        },

        // Force WebSocket transport (optional for local testing)
        transports: ["websocket"],

        // stop retrying after disconnect
        reconnection: false
    }
);

socket.on("connect", () => {

    console.log("Connected to server");
    console.log("Socket ID:", socket.id);

    socket.emit("send_message", {
        message: "Hello Socket.IO"
    });

    socket.emit("typing");

    socket.emit("notification", {
        title: "Backend",
        message: "Testing notification"
    });

    socket.emit("progress_update", {
        roadmapId: "roadmap101",
        progress: 75
    });

    socket.emit("join_room", "room101");

    socket.emit("room_message", {
        roomId: "room101",
        message: "Hello Room"
    });
});

// Runs when authentication or connection fails
socket.on("connect_error", (error) => {

    console.log("Connection Error:", error.message);

});

// Runs when the client disconnects
socket.on("disconnect", () => {

    console.log("Disconnected from server");

});


// Someone came online
socket.on("user_online", (data) => {

    console.log("User Online:", data);

});

// Someone went offline
socket.on("user_offline", (data) => {

    console.log("User Offline:", data);

});

// Chat message received
socket.on("receive_message", (data) => {

    console.log("Message Received:", data);

});

// Someone is typing
socket.on("user_typing", (data) => {

    console.log("Typing:", data);

});

// Progress changed
socket.on("progress_changed", (data) => {

    console.log("Progress Updated:", data);

});

// Notification received
socket.on("new_notification", (data) => {

    console.log("Notification:", data);

});

// Room message received
socket.on("room_message", (data) => {

    console.log("Room Message:", data);

});