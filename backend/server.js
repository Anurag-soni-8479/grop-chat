const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "https://anurag-soni-8479.github.io",
    credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [
            "https://anurag-soni-8479.github.io"
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

let users = [];
let messages = [];

io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    socket.on("join", (name) => {

        socket.username = name;

        users.push(name);

        socket.emit("oldMessages", messages);

        io.emit("users", users);
    });

    socket.on("chatMessage", (data) => {

        messages.push(data);

        io.emit("newMessage", data);
    });

    socket.on("disconnect", () => {

        users = users.filter(
            user => user !== socket.username
        );

        io.emit("users", users);

        console.log("User Disconnected:", socket.id);
    });

});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});