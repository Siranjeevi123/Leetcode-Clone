import type {Request,Response, NextFunction } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import redis_client from "../config/redis.config";
const auth_middleware = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        let header = req.headers.authorization;
        const user_token = header?.split(' ')[1];
        if(!user_token) return res.status(401).json({
            status:"fail",
            message:"Token missing"
        })

        const blocked_user = await redis_client.get(`logout:${user_token}`);
        if(blocked_user) return res.status(401).json({
            status:"fail",
            "message":"Token has been revoked"
        })

        const valid_token = jwt.verify(user_token,String(process.env.JWT_KEY)) as JwtPayload;
        
        req.role = valid_token.role;
        req._id = valid_token._id

        // console.log(req._id);
        
        next();

    }catch(err){
        return res.status(401).json({
            status:"fail",
            err:err instanceof Error ? err.message : err
        })
    }
}

export default auth_middleware;