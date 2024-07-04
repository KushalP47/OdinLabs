import { Server } from "socket.io";

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

const connectedUsers: studentSocket[] = [];

const io = new Server({
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    socket.on("join-room", ({ roomId, emailId }) => {
        console.log("Student joining room:", roomId, "Email:", emailId);
        socket.join(roomId);
        socket.emit("user-connected", roomId);
    });

    socket.on("send-offer", ({ roomId, emailId, offer }) => {
        const user: studentSocket = { emailId, socketId: socket.id, roomId, offer };
        if (connectedUsers.find((user) => user.emailId === emailId)) {
            connectedUsers.map((user) => {
                if (user.emailId === emailId) {
                    user.offer = offer;
                }
            });
        } else {
            connectedUsers.push(user);
        }
        console.log("Offer received from:", emailId);
        io.emit("student-offers", { connectedUsers });
    });

    socket.on("send-offer-again", ({ roomId, emailId, offer }) => {
        console.log("Offer received again from:", emailId);
        // const student = connectedUsers.find((user) => user.emailId === emailId);
        const socketId = socket.id;
        io.to(roomId).emit("sending-nego-offer", { emailId, socketId, roomId, offer });
    });

    socket.on("get-student-offers", () => {
        console.log("Fetching student offers");
        socket.emit("student-offers", { connectedUsers });
    });


    socket.on("send-answer", ({ emailId, roomId, answer }) => {
        console.log("Answer received for:", emailId);
        const student = connectedUsers.find((user) => user.emailId === emailId);
        if (student) {
            io.to(student.socketId).emit("answer-received", { answer, emailId });
        }
    });

    socket.on("join-student-room", ({ roomId }) => {
        console.log("Admin joining room:", roomId);
        socket.join(roomId);
    });

    socket.on("leave-student-room", ({ emailId, roomId }) => {
        console.log("Admin leaving room:", roomId);
        const student = connectedUsers.find((user) => user.emailId === emailId);
        if (student) {
            io.to(student.socketId).emit("admin-disconnected");
        }
        socket.leave(roomId);
        // io.to(roomId).emit("admin-disconnected");
    });

    socket.on("disconnect-room", ({ emailId, roomId }) => {
        console.log("Student disconnecting room:", roomId, "Email:", emailId);
        const index = connectedUsers.findIndex((user) => user.emailId === emailId);
        if (index !== -1) {
            connectedUsers.splice(index, 1);
            console.log("User disconnected:", emailId);
            io.emit("student-offers", { connectedUsers });
        }
        socket.leave(roomId);
        io.to(roomId).emit("admin-disconnected");
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
        const index = connectedUsers.findIndex((user) => user.socketId === socket.id);
        if (index !== -1) {
            connectedUsers.splice(index, 1);
            console.log("User removed:", socket.id);
            io.emit("student-offers", { connectedUsers });
        }
    });
});

export { io };