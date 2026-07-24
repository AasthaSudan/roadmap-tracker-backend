const onlineUsers = require("./onlineUsers");

const registerEvents = (io, socket) => {
    socket.on("send_message", (data) => {
        console.log("Message:", data);

        io.emit("receive_message", {  //emit message to all clients
            sender: socket.user?.id,
            message: data.message
        }
        );
    });

    socket.on("typing", () => {
        socket.broadcast.emit(  //emit typing event to all clients except the sender
            "user_typing",
            {
                userId: socket.user?.id
            }
        );
    });

    socket.on(
        "progress_update",
        (data) => {
            io.emit( //emit progress update to all clients
                "progress_changed",
                data
            );
        });

    socket.on(
        "notification",
        (data) => {
            io.emit( //emit notification to all clients
                "new_notification",
                data
            );
        });

    socket.on(
        "join_room",
        (roomId) => {
            socket.join(roomId); //join room
            console.log("Joined room", roomId);
        });

    socket.on("room_message", (data) => {

        io.to(data.roomId).emit("room_message", { //emit room message to all clients in the room
            sender: socket.user?.id,
            message: data.message,
            roomId: data.roomId
        });
    });
};

module.exports = registerEvents;