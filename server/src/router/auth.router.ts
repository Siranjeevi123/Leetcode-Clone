import { Router } from "express";
import {login,signup,adminSignup,logout,getProfile,deleteProfile} from '../controllers/auth.controller';
import type_validator from '../middleware/type_validator.middleware';
import auth_middleware from "../middleware/auth.middleware";
import required_role from "../middleware/role.middleware.ts"
import { SignupSchema,LoginSchema } from "../validators/auth.validator";
import { Role } from "../types/user.types.ts";
import slidingWindow from "../middleware/rateLimit.middleware.ts";
const authRouter = Router();

authRouter.post('/signup',slidingWindow(300,3),type_validator(SignupSchema),signup);
authRouter.post('/admin/signup',slidingWindow(300,3),type_validator(SignupSchema),auth_middleware,required_role(Role.ADMIN),adminSignup);
authRouter.post('/login',slidingWindow(60,5),type_validator(LoginSchema),login);
authRouter.post('/logout',auth_middleware,logout);
authRouter.get('/getProfile',auth_middleware,getProfile);
authRouter.delete('/',auth_middleware,deleteProfile)

export default authRouter;