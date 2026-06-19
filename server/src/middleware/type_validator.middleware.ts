import type { Request,Response,NextFunction } from 'express'
import z from 'zod'

const type_validator = (schema:z.ZodSchema)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        try{
            schema.parse(req.body);
            next();
        }catch(err){
            res.status(400).json({
                status:"Fail",
                err: err
            })
        }
    }
}

export default type_validator;
