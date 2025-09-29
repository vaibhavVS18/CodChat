import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import {Server} from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import ProjectModel from "./models/project.model.js";
import { generateResult } from "./services/ai.service.js";
const port =process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.use(async (socket, next)=>{
    try{
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(" ")[1];
        const projectId = socket.handshake.query.projectId;

        if(!mongoose.Types.ObjectId.isValid(projectId)){
            return next(new Error("Invalid ProjectId"));
        }

        socket.project = await ProjectModel.findById(projectId).lean();

        if(!token){
            return next(new Error("Authentication error"));
        }

        const decoded  = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return next(new Error("Authentication error"));
        }

        socket.user = decoded;
        return next()
    }
    catch(err){
        next(err);
    }
})

// io.on('connection', socket => {
//     socket.roomId = socket.project._id.toString();
//     console.log("a user connected");

//     socket.join(socket.roomId);
//     socket.on("project-message", data=>{
//         console.log(data);
//         // io.to(socket.roomId).emit("project-message", data);
//         socket.broadcast.to(socket.roomId).emit("project-message", data);
//     })

//   socket.on('event', data => { /* … */ });
//   socket.on('disconnect', () => {
//     console.log("user disconnected");
//     socket.leave(socket.roomId)
//    });
// });

io.on('connection', socket => {
    socket.roomId = socket.project._id.toString();
    // console.log("a user connected");

    socket.join(socket.roomId);
    
    socket.on("project-message", async data=>{
        const msg = data.content;

        // io.to(socket.roomId).emit("project-message", data);
        socket.broadcast.to(socket.roomId).emit("project-message", data);

        const aiIsPresentInMessage = msg.includes("@ai");
        if(aiIsPresentInMessage){
            const prompt = msg.replace("@ai", "");
            const response = await generateResult(prompt);
        
            const aiMessage = {
                content: response,
                sender: {
                    _id: 'ai',
                    email: "AI"
                }
            }

            await ProjectModel.findByIdAndUpdate(
                socket.roomId,
                {$push: {messages: aiMessage}},
                {new: true}
            )
            //       // if you want to send response of AI only to who has asked qw ,then use socket.emit()
            // socket.emit("project-message", aiMessage)

        
            //          //  if you want to send response of AI to everyone in this project (room)
            
            io.to(socket.roomId).emit("project-message", aiMessage);
            return ;
        }

    })

  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => {
    console.log("user disconnected");
    socket.leave(socket.roomId);
   });
});

server.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
});
