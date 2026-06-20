import type { Request, Response, NextFunction } from "express";
import Problem from "../models/problem.model";
import getLanguageById from "../utils/getLanguageById";
import submitBatch from "../utils/submitBatch";
import token_submit from "../utils/token_submitBatch";
import getStatus_id from "../utils/getStatus_id";
import User from "../models/user.model";

const createProblem = async (req: Request,res: Response,next: NextFunction) => {
    try{
       const { title, referenceSolution, visibleTestCases } = req.body;

        const isProblemExist = await Problem.findOne({ title });

        if (isProblemExist) {
            return res.status(409).json({
                success: false,
                message: "Problem already exists",
            });
        }

        for (const { language, completeCode } of referenceSolution) {
            const language_id = getLanguageById(language);

            const submissions = visibleTestCases.map(
                (testCase: { input: string; output: string }) => ({
                    source_code: completeCode,
                    language_id,
                    stdin: testCase.input,
                    expected_output: testCase.output,
                })
            );

            const submit_result = await submitBatch(submissions);

            const tokens = submit_result.map(
                (val: { token: string }) => val.token
            );

            const test_result = await token_submit(tokens);

            for (const test of test_result) {
                if (test.status.id !== 3) {
                    return res.status(400).json({
                        success: false,
                        message: getStatus_id(test.status.id),
                    });
                }
            }
        }

        const new_problem = await Problem.create({
            ...req.body,
            problemCreator: req._id, 
        });

        return res.status(201).json({
            success: true,
            problem: new_problem,
        });


    }catch(err){
        return res.status(500).json({
            success: false,
            message: err instanceof Error ? err.message : "Unknown Error",
        });
    } 
}


const getProblem = async (req:Request,res:Response)=>{
    try{
        const problem_id = req.params.id;
        if(!problem_id) return res.status(400).json({
            status:"Fail",
            message:"problem_id is not found"
        })
        const isProblemExist = await Problem.findById(problem_id).select('_id title description difficulty tags visibleTestCases startCode');
        if(!isProblemExist) return res.status(404).json({
            status:"fail",
            err:"Problem is not found"
        })

        return res.status(200).json({
            status:"successful",
            isProblemExist
        })

    }catch(err){
        return res.status(400).json({
            status:"fail",
            err: err instanceof Error ? err.message : err
        })
    }
}

const getAllProblem = async(req:Request,res:Response)=>{
    try{
        const Problems = await Problem.find({}).select('_id title tags difficulty');
        return res.status(200).json({
            Problem:Problems
        })

    }catch(err){
        return res.status(400).json({
            status:"fail",
            err: err instanceof Error ? err.message : err
        })
    }
}
const solvedProblem = async(req:Request,res:Response)=>{
    try{
        const user_id = req._id;
        
        const user  = await User.findById(user_id);
        if(!user) return res.status(404).json({
            status:"fail",
            err: "User doesn't found"
        })
        return res.status(200).json({
            solvedProblem:user.problemSolved
        })
    }catch(err){
        return res.status(400).json({
            status:"fail",
            err: err instanceof Error ? err.message : err
        })
    }
}
const deleteProblem = async(req:Request,res:Response)=>{
    try{
        const problem_id = req.params.id;
        if(!problem_id) return res.status(400).json({
            status:"fail",
            err:"Problem Id is not found"
        })
        const isProblemExist = await Problem.findById(problem_id);
        if(!isProblemExist) return res.status(400).json({
            status:"fail",
            err:"Problem is not found"
        })

        await Problem.findByIdAndDelete(problem_id);

        return res.status(200).json({
            status:"successful",
            message:"problem is Deleted"
        })



    }catch(err){
        return res.status(400).json({
            status:"fail",
            err:err instanceof Error ? err.message : err
        })
    }
}


const updateProblem = async (req:Request,res:Response)=>{
    try{
        const { title, referenceSolution, visibleTestCases } = req.body;
        const problem_id = req.params.id;
        if(!problem_id) return res.status(400).json({
            status:"fail",
            err:"Problem Id is not found"
        })

        const isProblemExist = await Problem.findById(problem_id);
        if(!isProblemExist) return res.status(400).json({
            status:"fail",
            err:"Problem is not found"
        })

        for (const { language, completeCode } of referenceSolution) {
            const language_id = getLanguageById(language);

            const submissions = visibleTestCases.map(
                (testCase: { input: string; output: string }) => ({
                    source_code: completeCode,
                    language_id,
                    stdin: testCase.input,
                    expected_output: testCase.output,
                })
            );

            const submit_result = await submitBatch(submissions);

            const tokens = submit_result.map(
                (val: { token: string }) => val.token
            );

            const test_result = await token_submit(tokens);

            for (const test of test_result) {
                if (test.status.id !== 3) {
                    return res.status(400).json({
                        success: false,
                        message: getStatus_id(test.status.id),
                    });
                }
            }
        }

        const updated_problem = await Problem.findByIdAndUpdate(problem_id,{...req.body},{runValidators:true,returnDocument:'after'});
        return res.status(200).json({
            status:"successful",
            updatedProblem:updated_problem
        })
    }catch(err){
        return res.status(400).json({
            status:"fail",
            err:err instanceof Error ? err.message : err
        })
    }
}

export  {createProblem,getProblem,getAllProblem,solvedProblem,updateProblem,deleteProblem}