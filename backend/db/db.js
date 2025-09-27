import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

function connect(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connected to mongoDB");
    }).catch(err=>{
        console.log(err);
    });
}

export default connect;