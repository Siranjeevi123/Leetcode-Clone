import type { Request, Response } from "express";
import Problem from "../models/problem.model";
import { askGemini } from "../config/genai.config";

const solveDoubt = async (req: Request, res: Response) => {
    try {

        const { message, code, language } = req.body;
        const { problemId } = req.params;

        if (!message) {
            return res.status(400).json({
                success:false,
                message:"Question is required"
            });
        }

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                success:false,
                message:"Problem not found"
            });
        }

        const prompt = `
            Problem Title:
            ${problem.title}

            Difficulty:
            ${problem.difficulty}

            Tags:
            ${problem.tags.join(", ")}

            Description:
            ${problem.description}

            Visible Test Cases:

            ${problem.visibleTestCases
            .map((t:any,index:number)=>`
            Example ${index+1}

            Input:
            ${t.input}

            Output:
            ${t.output}
            `)
            .join("\n")}

            Programming Language:
            ${language ?? "Unknown"}

            Current Code:
            ${code ?? "User hasn't written code yet."}

            User Question:
            ${message}
        `;

        const reply = await askGemini(prompt);

        return res.json({
            success:true,
            reply
        });

    } catch (err) {

        return res.status(500).json({
            success:false,
            message:err instanceof Error ? err.message : "Internal Server Error"
        });

    }
};

export { solveDoubt };