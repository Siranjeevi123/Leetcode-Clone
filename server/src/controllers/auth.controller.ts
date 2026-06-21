import type { Request,Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import generate_token from "../utils/genrate_token";
import redis_client from "../config/redis.config";
import Submission from "../models/submission.model";

const signup = async(req:Request,res:Response)=>{
    try{
        const {emailId,password} = req.body;
        const isUserExists = await User.findOne({emailId:emailId});

        if(isUserExists) return res.status(409).json({ message: "User already exists" });

        let hash_password = await bcrypt.hash(password,10);
        req.body.password = hash_password;
        req.body.role = 'user';
        const new_user = await User.create(req.body);

        return res.status(201).json({
            message: "Signup successful",
            user: {
                _id: new_user._id,
                firstName: new_user.firstName,
                emailId: new_user.emailId
            }
        });


    }catch(err){
        return res.status(500).json({
            message: "Signup failed",
            error: err instanceof Error ? err.message : err
        });
    }
}
const adminSignup = async (req:Request,res:Response)=>{
    try{
        const {emailId,password} = req.body;

        const isUserExists = await User.findOne({emailId:emailId});

        if(isUserExists)  return res.status(409).json({ message: "User already exists" });
        let hash_password = await bcrypt.hash(password,10);

        req.body.password = hash_password;

        const new_user = await User.create(req.body);
        return res.status(201).json({
            message: "Signup successful",
            user: {
                _id: new_user._id,
                firstName: new_user.firstName,
                emailId: new_user.emailId
            }
        });


    }catch(err){
        return res.status(500).json({
            message: "Admin Signup failed",
            error: err instanceof Error ? err.message : err
        });
    }
}
const login = async(req:Request,res:Response)=>{
    try{
        const {emailId,password} = req.body;
        const isUserExists= await User.findOne({emailId:emailId});

        if(!isUserExists) return res.status(401).json({ message: "Invalid credentials" });

        let hash_password = isUserExists.password;
        const isPasswordValid = await bcrypt.compare(password,hash_password);

        if(!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });
        
        return res.status(200).json({
            message: "Login successful",
            token: await generate_token({
                _id: String(isUserExists._id),      
                role: isUserExists.role
            })
        });


    }catch(err){
       return res.status(500).json({
            message:"Login fail",
            err: err instanceof Error ? err.message : err
        })
    }
}

const logout = async(req:Request,res:Response)=>{
    try{
        let header = req.headers.authorization;
        let token = header?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }

        
        if(!process.env.JWT_EXPIRY_SEC) throw new Error('JWT_EXPIRY_SEC is missing')
        const expire = 60*60*24*7;
        await redis_client.set(`logout:${token}`,1,{EX:expire});
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        })


    }catch(err){
        return res.status(500).json({
            message:"Logout Fail",
            err: err instanceof Error ? err.message : err
        })
    }
}
const getProfile = async (req:Request,res:Response)=>{
    try{
        const _id = req._id;
        const user_profile = await User.findById(_id);

        if(!user_profile) return res.status(404).json({
            status:"fail",
            message:"user not found"
        })

        return res.status(200).json({
            success: true,
            user: {
                _id: user_profile._id,
                firstName: user_profile.firstName,
                emailId: user_profile.emailId,
                role: user_profile.role,
                problemSolved: user_profile.problemSolved
            }
        })
    }catch(err){
        return res.status(500).json({
            status:"fail",
            err:err instanceof Error ? err.message : err
        })
    }
}

const deleteProfile = async (req:Request,res:Response)=>{
    try{
        
        const user_id = req._id;
        await User.findByIdAndDelete(user_id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    }catch(err){
        res.status(500).json({
            status:"fail",
            err:err instanceof Error ? err.message : err
        })
    }
}
export  {signup,login,logout,getProfile,adminSignup,deleteProfile};