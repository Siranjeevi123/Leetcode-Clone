import z from 'zod';


const SignupSchema = z.object({
    firstName:z.string().min(3).max(20),
    emailId:z.string().email(),
    password:z.string().min(6).max(20)
})

const LoginSchema = z.object({
    emailId:z.string().email(),
    password:z.string().min(6).max(20)
})

export {SignupSchema,LoginSchema};