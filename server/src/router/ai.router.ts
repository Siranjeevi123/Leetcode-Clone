import { Router } from "express";
import auth_middleware from "../middleware/auth.middleware";
import { solveDoubt } from "../controllers/ai.controller";

const aiRouter = Router();

aiRouter.post("/chat/:problemId",auth_middleware,solveDoubt);

export default aiRouter;