import { Router } from "express";
import auth_middleware from "../middleware/auth.middleware";
import type_validator from "../middleware/type_validator.middleware";
import submitRunSchema from "../validators/submission.validator";
import { runSubmission,submitSolution,ProblemSubmission} from "../controllers/submission.controller";
import slidingWindow from "../middleware/rateLimit.middleware";
const SubmissionRouter =  Router();

SubmissionRouter.post('/run/:problemId',auth_middleware,type_validator(submitRunSchema),slidingWindow(60, 20),runSubmission);
SubmissionRouter.post('/submit/:problemId',auth_middleware,type_validator(submitRunSchema),slidingWindow(60, 10),submitSolution);
SubmissionRouter.get('/:problemId',auth_middleware,ProblemSubmission)


export default SubmissionRouter;
