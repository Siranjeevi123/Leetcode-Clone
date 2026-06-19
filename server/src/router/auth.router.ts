import { Router } from "express";
import {login,signup,adminSignup,logout,getProfile} from '../controllers/auth.controller';
import type_validator from '../middleware/type_validator.middleware';
import auth_middleware from "../middleware/auth.middleware";
import required_role from "../middleware/role.middleware.ts"
import { SignupSchema,LoginSchema } from "../validators/auth.validator";
import { Role } from "../types/user.types.ts";
const authRouter = Router();

authRouter.post('/signup',type_validator(SignupSchema),signup);
authRouter.post('/admin/signup',type_validator(SignupSchema),auth_middleware,required_role(Role.ADMIN),adminSignup);
authRouter.post('/login',type_validator(LoginSchema),login);
authRouter.post('/logout',logout);
authRouter.get('/getProfile',auth_middleware,getProfile)

export default authRouter;