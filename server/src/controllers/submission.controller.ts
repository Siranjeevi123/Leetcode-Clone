import type { Request,Response } from "express"
import Problem from "../models/problem.model";
import Submission from "../models/submission.model";
import User from "../models/user.model";
import type { SubmissionStatus } from "../types/submission.types";
import getLanguageById from "../utils/getLanguageById";
import submitBatch from "../utils/submitBatch";
import token_submit from "../utils/token_submitBatch";
import getStatus_id from "../utils/getStatus_id";

const submitSolution = async (req: Request, res: Response) => {
  try {
    const userId = req._id;
    const { code, language } = req.body;
    const problemId = req.params.problemId as string;

    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: "Problem Id not found",
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    const submission = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesPassed: 0,
      testCasesTotal: problem.hiddenTestCases.length,
    });

    const language_id = getLanguageById(language)!;

    const submissions = problem.hiddenTestCases.map(
      (testCase: { input: string; output: string }) => ({
        source_code: code,
        language_id,
        stdin: testCase.input,
        expected_output: testCase.output,
      })
    );

    const submitResult = await submitBatch(submissions);

    const tokens = submitResult.map(
      (item: { token: string }) => item.token
    );

    const results = await token_submit(tokens);

    let passed = 0;
    let runtime = 0;
    let memory = 0;
    let status:SubmissionStatus = "accepted";
    let errorMessage = "";

    for (const test of results) {
      if (test.status.id === 3) {
        passed++;
        runtime += parseFloat(test.time ?? "0");
        memory = Math.max(memory, test.memory ?? 0);
      } else {
        status = "wrong_answer";
        errorMessage =
          test.stderr ||
          test.compile_output ||
          test.message ||
          getStatus_id(test.status.id);
      }
    }

    submission.status = status;
    submission.testCasesPassed = passed;
    submission.runtime = runtime;
    submission.memory = memory;
    submission.errorMessage = errorMessage;

    await submission.save();

    if(problem.hiddenTestCases.length == submission.testCasesPassed){
        await User.findByIdAndUpdate(userId, {
            $addToSet: {
                problemSolved: problemId,
            },
        });
    }
    return res.status(200).json({
      success: true,
      submission,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
}

const runSubmission = async (req: Request, res: Response) => {
  try {
    const { code, language } = req.body;
    const problemId = req.params.problemId as string;

    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: "Problem Id not found",
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    const language_id = getLanguageById(language)!;

    const submissions = problem.visibleTestCases.map(
      (testCase: { input: string; output: string }) => ({
        source_code: code,
        language_id,
        stdin: testCase.input,
        expected_output: testCase.output,
      })
    );

    const submitResult = await submitBatch(submissions);

    const tokens = submitResult.map(
      (item: { token: string }) => item.token
    );

    const results = await token_submit(tokens);

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
};

const ProblemSubmission = async (req:Request,res:Response)=>{
  try{
    const user_id = req._id;

    const problemId = req.params.problemId;
    if(!problemId) return res.status(400).json({
      status:'fail',
      err:"Problem Id is not found"
    })

    const submissions = await Submission.find({
      userId:user_id,
      problemId:problemId
    })

    return res.status(200).json({
      status:'successful',
      submissions
    })

  }catch(err){
    return res.status(400).json({
      status:'fail',
      err:err instanceof Error ? err.message : err
    })
  }
}

export {submitSolution,runSubmission,ProblemSubmission};