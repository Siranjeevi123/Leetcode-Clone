import type { Request,Response,NextFunction } from "express";
import type { Role } from "../types/user.types";

const required_role = (role:Role)=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        if(req.role === role) return next();
        return res.status(403).json({
            status:"fail",
            message:"Invalid role"
        })
    }
}

export default required_role;