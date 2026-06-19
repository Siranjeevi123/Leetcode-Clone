import { Router } from "express";
import required_role from "../middleware/role.middleware.ts";
import auth_middleware from "../middleware/auth.middleware.ts";
import { createProblem,getProblem,getAllProblem,solvedProblem,updateProblem,deleteProblem} from "../controllers/problem.controller.ts";
import { Role } from "../types/user.types.ts";
import type_validator from "../middleware/type_validator.middleware.ts";
import { createProblemSchema } from "../validators/problem.validator.ts";
const ProblemRouter = Router();

//Admin Only 
ProblemRouter.post('/create',auth_middleware,type_validator(createProblemSchema),required_role(Role.ADMIN),createProblem);
ProblemRouter.put('/:id',auth_middleware,type_validator(createProblemSchema),required_role(Role.ADMIN),updateProblem);
ProblemRouter.delete('/:id',auth_middleware,required_role(Role.ADMIN),deleteProblem);

//User and Admin
ProblemRouter.get('/user',auth_middleware,solvedProblem);
ProblemRouter.get('/:id',auth_middleware,getProblem);
ProblemRouter.get('/',auth_middleware,getAllProblem);


export default ProblemRouter; 