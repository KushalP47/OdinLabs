import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

type RTCSdpType = "offer" | "answer";
interface RTCSessionDescriptionInit {
    type: RTCSdpType;
    sdp: string;
}

interface studentSocket {
    emailId: string;
    socketId: string;
    roomId: string;
    offer: RTCSessionDescriptionInit;
}

const connectedUsers: Array<studentSocket> = [];

io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on("join-room", ({ roomId, emailId }) => {
        socket.join(roomId);
        io.emit("user-connected", { roomId, emailId });
    });

    socket.on("send-offer", ({ roomId, emailId, offer }) => {
        connectedUsers.push({ emailId, socketId: socket.id, roomId, offer });
        io.emit("student-offers", { connectedUsers });
    });

    socket.on("send-answer", ({ emailId, roomId, answer }) => {
        const student = connectedUsers.find((user) => user.emailId === emailId);
        if (student) {
            io.to(student.socketId).emit("answer-received", { answer, emailId: socket.id });
        }
    });

    socket.on("disconnect-student", ({ emailId }) => {
        const index = connectedUsers.findIndex((user) => user.emailId === emailId);
        if (index !== -1) {
            connectedUsers.splice(index, 1);
            io.emit("student-offers", { connectedUsers });
        }
    });

    socket.on("disconnect-room", ({ emailId, roomId }) => {
        const index = connectedUsers.findIndex(
            (user) => user.emailId === emailId && user.roomId === roomId,
        );
        if (index !== -1) {
            connectedUsers.splice(index, 1);
            io.emit("room-disconnected", { roomId });
        }
    });

    
    socket.on("get-student-offers", () => {
        socket.emit("student-offers", { connectedUsers });
    });

    socket.on("disconnect", () => {
        const index = connectedUsers.findIndex((user) => user.socketId === socket.id);
        if (index !== -1) {
            connectedUsers.splice(index, 1);
            io.emit("student-offers", { connectedUsers });
        }
        console.log("Client disconnected", socket.id);
    });
});

// console.log("Socket.io server running on port 8001");

export { io };