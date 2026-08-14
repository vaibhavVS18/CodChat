import mongoose from "mongoose";
import dns from "dns";
import dotenv from "dotenv";
dotenv.config();

// c-ares can fall back to 127.0.0.1 here, which breaks the mongodb+srv SRV lookup
dns.setServers(["8.8.8.8", "1.1.1.1"]);

function connect(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connected to mongoDB");
    }).catch(err=>{
        console.log(err);
    });
}

export default connect;

// or you can use async-await with try catch