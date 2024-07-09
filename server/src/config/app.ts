import express from "express";
import cors from "cors";    // cross origin resource sharing
import cookieParser from "cookie-parser"; // middleware used in parsing cookies
import bodyParser from "body-parser";

const app = express();

const corsOptions = {
    origin: function(origin: string | undefined, callback: (error?: any, allow?: boolean) => void){
        // Check if origin is defined before proceeding
        if (!origin) {
            callback(new Error('Invalid origin'), false);
            return;
        }
        // Allow specific origins, replace 'http://example.com' with your actual origin
        if (origin === "http://localhost:5173") {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Reflect (pass through) the request's credentials
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" })); // to limit the size of data which express should accept
app.use(express.urlencoded({ extended: true, limit: "16kb" })) // with extended flag, we will get the nested data at deep level
app.use(express.static("public")); // it is a addres folder, where we will keep files which we want to keep in public

app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("Hello World");
});

import authRouter from "../routes/auth.routes";
app.use("/api/v1/auth", authRouter);

import problemRouter from "../routes/problem.routes";
app.use("/api/v1/problems", problemRouter);

export { app };