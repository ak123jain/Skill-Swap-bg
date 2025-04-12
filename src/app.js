import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
     origin: process.env.CLIENT_URL, 
     credentials: true 
    }));
 

 
app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

app.use(cookieParser())


import userRouter from "./routes/user.router.js";
import sessionRouter from "./routes/session.router.js";
import matchRouter from "./routes/Match.router.js";

app.use("/user", userRouter)
app.use("/session", sessionRouter)
app.use("/match", matchRouter)




export { app };