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
const emailToOfferMapping = new Map();

io.on("connection", (socket) => {
    console.log("Socket connected: ", socket.id);

    // student joins the room
    socket.on("join-room", (data) => {
        const { roomId, emailId } = data;
        console.log(`User ${emailId} joined room ${roomId} with socketId ${socket.id}`);
        emailToSocketMapping.set(emailId, socket.id);
        socket.join(roomId);
        // server sends a verification message
        socket.emit("user-connected", { emailId });
        socket.broadcast.to(roomId).emit("user-joined", { emailId });
    });

    // student sends an offer
    socket.on("send-offer", (data) => {
        const { roomId, emailId, offer } = data;
        // socket stores the the roomId, emailId, socketId and offer
        emailToOfferMapping.set(emailId, { emailId, roomId, socketId: socket.id, offer });
        // socket.emit("student-offers")
        
        console.log(emailToOfferMapping);
        console.log(`User ${emailId} created offer in room ${roomId}`);
    });

    // admin asks list of student-offers
    socket.on("get-student-offers", () => {
        const offers = Array.from(emailToOfferMapping.values());
        console.log("Admin asked offer:", offers);
        // for (const offer of offers) {
        //     console.log(offer.emailId);
        // }
        socket.emit("student-offers", { offers });
    });

    // admin sends an answer
    socket.on("send-answer", (data) => {
        const { roomId, emailId, answer } = data;
        // admin joins the student room
        socket.join(roomId);
        // admin finds the socketId of the student
        const { socketId } = emailToOfferMapping.get(emailId);
        console.log(`User ${emailId} created answer in room ${roomId}`);
        // admin sends the answer to the student
        socket.to(socketId).emit("answer-received", { emailId, answer });
    });

    // admin disconnects the student
    socket.on("disconnect-student", (data) => {
        const { emailId } = data;
        const { roomId, socketId } = emailToOfferMapping.get(emailId);
        // admin leaves the student room
        socket.leave(roomId);
        // admin sends a disconnect message to the student
        socket.to(socketId).emit("user-disconnected", { emailId });
    });

    socket.on("send-stream", (data) => {
        const { emailId } = data;
        const socketId = emailToSocketMapping.get(emailId);
        console.log(`User ${emailId} sent stream`);
        socket.to(socketId).emit("start-stream");
    });

    // student disconnects the room
    socket.on("disconnect-room", (data) => {
        const { roomId, emailId } = data;
        console.log(`User ${emailId} left room ${roomId}`);
        const users = io.sockets.adapter.rooms.get(roomId);
        if (users) {
            for (const user of users) {
                if (user === socket.id) continue;
                const socketId = emailToSocketMapping.get(user);
                socket.to(socketId).emit("room-disconnected", { emailId });
            }
        }
        socket.leave(roomId);
        socket.broadcast.to(roomId).emit("user-left", { emailId });
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected: ", socket.id);
        // Clean up mappings
        for (const [emailId, id] of emailToSocketMapping) {
            if (id === socket.id) {
                emailToSocketMapping.delete(emailId);
                emailToOfferMapping.delete(emailId);
                break;
            }
        }
    });
});

export { io };