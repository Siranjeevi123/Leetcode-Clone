import { z } from "zod";

const visibleTestCaseSchema = z.object({
  input: z.string().min(1, "Input is required"),
  output: z.string().min(1, "Output is required"),
  explanation: z.string().min(1, "Explanation is required"),
});

const hiddenTestCaseSchema = z.object({
  input: z.string().min(1, "Input is required"),
  output: z.string().min(1, "Output is required"),
});

const startCodeSchema = z.object({
  language: z.enum(["c++", "java", "javascript"]),
  initialCode: z.string().min(1, "Initial code is required"),
});

const referenceSolutionSchema = z.object({
  language: z.enum(["c++", "java", "javascript"]),
  completeCode: z.string().min(1, "Complete code is required"),
});

export const createProblemSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),

  difficulty: z.enum(["easy", "medium", "hard"]),

  tags: z
    .array(
      z.enum([
        "array",
        "linkedList",
        "graph",
        "dp",
      ])
    )
    .min(1, "At least one tag is required"),

  visibleTestCases: z
    .array(visibleTestCaseSchema)
    .min(1, "At least one visible test case is required"),

  hiddenTestCases: z
    .array(hiddenTestCaseSchema)
    .min(1, "At least one hidden test case is required"),

  startCode: z
    .array(startCodeSchema)
    .min(1, "At least one starter code is required"),

  referenceSolution: z
    .array(referenceSolutionSchema)
    .min(1, "At least one reference solution is required"),
});