import express from "express";
import morgan from "morgan";
import connect from "./db/db.js";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import authRoutes from "./routes/auth.routes.js";

import cookieParser from "cookie-parser"
import cors from "cors";

import passport from "./config/passport.js";
// import session from "express-session";

connect();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//      -> session middleware
//            // -> we are storing jwt token in localstorage ,not using session
// app.use(
//     session({
//         secret: process.env.SESSION_SECRET || "secretKey",
//         resave: false,
//         saveUninitialized: false
//     })
// );

//        // ->initialize passport and tell passport to use express session to track logged in user
app.use(passport.initialize());
// app.use(passport.session());


app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/ai", aiRoutes);
app.use("/auth", authRoutes);

app.get("/", (req,res)=>{
    res.send("hello");
});

export default app;