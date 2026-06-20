import { Router } from "express";
import auth_middleware from "../middleware/auth.middleware";
import type_validator from "../middleware/type_validator.middleware";
import submitRunSchema from "../validators/submission.validator";
import { runSubmission,submitSolution } from "../controllers/submission.controller";
const SubmissionRouter =  Router();

SubmissionRouter.post('/run/:problemId',auth_middleware,type_validator(submitRunSchema),runSubmission);
SubmissionRouter.post('/submit/:problemId',auth_middleware,type_validator(submitRunSchema),submitSolution);



export default SubmissionRouter;
