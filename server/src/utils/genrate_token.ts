import jwt from 'jsonwebtoken';
import type { Role } from '../types/user.types';

export default async function generate_token(user:{_id:string,role:Role}){
    if(!process.env.JWT_KEY) throw new Error('JWT_KEY is missing');
    // console.log(jwt.sign({emailId:user.emailId,role:user.role,},process.env.JWT_KEY))
    let expire = 60*60*24*7;
    return jwt.sign({_id:user._id,role:user.role,},process.env.JWT_KEY,{expiresIn:expire});
}