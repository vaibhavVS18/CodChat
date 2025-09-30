import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async(req, res, next)=>{
    try{
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];  // must use cookie-parser in app.js

        if(!token){
            res.status(401).send({error: "unauthorized user"});
        }

        const isBlackListed = await redisClient.get(token);
        if(isBlackListed){
            res.cookie("token", "");
            return res.status(401).send({error: "unauthorized user"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    }catch(error){
        res.status(401).send({error: "unauthorized error"});
    }
}
