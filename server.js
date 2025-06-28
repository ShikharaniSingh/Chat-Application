const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = 3000;

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("🔗 A user connected");

    socket.on("joinRoom", ({ username, room }) => {
        socket.join(room);
        socket.username = username;
        socket.room = room;

        socket.to(room).emit("message", {
            user: "System",
            text: `${username} has joined the room.`,
            time: new Date().toLocaleTimeString()
        });
    });

    socket.on("chatMessage", ({ username, room, message }) => {
        io.to(room).emit("message", {
            user: username,
            text: message,
            time: new Date().toLocaleTimeString()
        });
    });

    socket.on("disconnect", () => {
        if (socket.username && socket.room) {
            socket.to(socket.room).emit("message", {
                user: "System",
                text: `${socket.username} has left the room.`,
                time: new Date().toLocaleTimeString()
            });
        }
        console.log("❌ A user disconnected");
    });
});

http.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
