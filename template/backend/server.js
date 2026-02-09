import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import cookieParser from "cookie-parser"; //
import connect from "./db/db.js";

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";

import passport from "./config/passport.js"

dotenv.config();

connect();
const app = express();

// Simplified, Express 5–safe CORS setup
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

//       Proper preflight handling for Express 5
// app.options(/.*/, cors());

app.use(passport.initialize());   // check

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
