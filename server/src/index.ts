import dotenv from "dotenv";
dotenv.config({     // configure dotenv
    path: "./.env"  // set path of env
});
import connectDB from "./config/db";
import { app } from "./config/app";
// import { io } from "./config/socket";

// starting the server
app.listen(process.env.PORT || 8000, () => {
    console.log("Server is running on Port", process.env.PORT);
});

// starting the socket
// io.listen(8001);

// connecting to the database
connectDB();
