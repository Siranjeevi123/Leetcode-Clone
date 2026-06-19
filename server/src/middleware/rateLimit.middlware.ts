import type { Request,Response,NextFunction } from "express";
import redis_client from "../config/redis.config";
const Window_Size = 5,Window_Request = 2;
const sliding_window = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        let key = `rate_limit:${req.ip}`;

        let current_time = Number(new Date())/1000;

        let Window_time = current_time-Window_Size;

        await redis_client.zRemRangeByScore(key,0,Window_time);

        let number_request = await redis_client.zCard(key);

        if(number_request>=Window_Request) throw new Error("Limit is Exceded");

        await redis_client.zAdd(key,[{score:current_time,value:`${current_time}:${Math.random()}`}]);

        await redis_client.expire(key,Window_Size);

        next();
    }catch(err){
        res.json({
            status:"fail",
            message:"Error: "+err
        })
    }
}

export default sliding_window