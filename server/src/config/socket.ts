import { Server } from "socket.io";
interface studentSocket {
    emailId: string;
    socketId: string;
}
const io = new Server({
    cors: {
        origin: "*", // allow to all
    }
});

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();
const lobby = "lobby";

io.on("connection", (socket) => {
    console.log("Socket connected: ", socket.id);

    socket.on("join-room", (data) => {
        const { roomId, emailId } = data;
        console.log(`User ${emailId} joined room ${roomId}`);
        emailToSocketMapping.set(emailId, socket.id);
        socketToEmailMapping.set(socket.id, emailId);
        socket.join(roomId);
        socket.join(lobby);
        socket.emit("user-connected", { emailId });
        socket.broadcast.to(roomId).emit("user-joined", { emailId });
    });

    socket.on("get-connected-users", () => {
        const users = io.sockets.adapter.rooms.get(lobby);
        const connectedUsers: Array<studentSocket> = [];
        if (users) {
            for (let userId of users) {
                const emailId = socketToEmailMapping.get(userId);
                connectedUsers.push({ emailId, socketId: userId });
            }
        }
        socket.emit("connected-users", { connectedUsers });
    });

    socket.on("connect-student", (data) => {
        const { emailId } = data;
        const studentSocketId = emailToSocketMapping.get(emailId);
        if (studentSocketId) {
            socket.to(studentSocketId).emit("connect-admin", { socketId: socket.id });
        }
    });

    socket.on("disconnect-student", (data) => { });


    socket.on("disconnect", () => {
        console.log("Socket disconnected: ", socket.id);
    });
});

export { io };