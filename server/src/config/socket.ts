import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

io.on("connection", (socket) => {
    console.log("Socket is connected");
});

export { io };