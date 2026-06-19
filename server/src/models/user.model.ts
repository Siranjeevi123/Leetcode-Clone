
import mongoose, { Schema } from "mongoose";
import { Role } from "../types/user.types";

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true
    },
    age:{
        type:Number,
        min:6,
        max:80
    },
    role:{
        type:String,
        enum:Object.values(Role),
        default:Role.USER
    },
    problemSolved:{
        type:[String]
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true});

const User = mongoose.model('user',userSchema);

export default User;