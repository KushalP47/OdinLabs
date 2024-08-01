import express from "express";
import cors from "cors";    // cross origin resource sharing
import cookieParser from "cookie-parser"; // middleware used in parsing cookies

const app = express();

const corsOptions = {
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

import judgeRouter from "../routes/judge.routes";
app.use("/api/v1/judge", judgeRouter);

import assignmentRouter from "../routes/assignment.routes";
app.use("/api/v1/assignments", assignmentRouter);

import contestRouter from "../routes/contest.routes";
app.use("/api/v1/contests", contestRouter);

import userRouter from "../routes/user.routes";
app.use("/api/v1/users", userRouter);

export { app };