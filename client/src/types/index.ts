export type Role = "user" | "admin";
export type Difficulty = "easy" | "medium" | "hard";
export type Tag = "array" | "linkedList" | "graph" | "dp";
export type Language = "c++" | "java" | "javascript";
export type SubmissionStatus =
  | "pending"
  | "accepted"
  | "wrong_answer"
  | "runtime_error"
  | "compilation_error"
  | "time_limit_exceeded";

export interface User {
  _id: string;
  firstName: string;
  emailId: string;
  role: Role;
  problemSolved: string[];
}

export interface ProblemListItem {
  _id: string;
  title: string;
  tags: Tag[];
  difficulty: Difficulty;
}

export interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

export interface StartCode {
  language: Language;
  initialCode: string;
}

export interface ReferenceSolution {
  language: Language;
  completeCode: string;
}

export interface ProblemDetail extends ProblemListItem {
  description: string;
  visibleTestCases: TestCase[];
  startCode: StartCode[];
}

export interface CreateProblemPayload {
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: Tag[];
  visibleTestCases: { input: string; output: string; explanation: string }[];
  hiddenTestCases: { input: string; output: string }[];
  startCode: StartCode[];
  referenceSolution: ReferenceSolution[];
}

export interface Submission {
  _id: string;
  userId: string;
  problemId: string;
  code: string;
  language: Language;
  status: SubmissionStatus;
  runtime: number;
  memory: number;
  errorMessage: string;
  testCasesPassed: number;
  testCasesTotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface JudgeResult {
  status: { id: number; description: string };
  time?: string;
  memory?: number;
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  stdin?: string | null;
  expected_output?: string | null;
}

export interface ApiError {
  status: number;
  message?: string;
  err?: unknown;
  success?: boolean;
}

export const TAGS: Tag[] = ["array", "linkedList", "graph", "dp"];
export const LANGUAGES: Language[] = ["javascript", "java", "c++"];

export const TAG_LABELS: Record<Tag, string> = {
  array: "Array",
  linkedList: "Linked List",
  graph: "Graph",
  dp: "Dynamic Programming",
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  javascript: "JavaScript",
  java: "Java",
  "c++": "C++",
};

export const MONACO_LANGUAGE: Record<Language, string> = {
  javascript: "javascript",
  java: "java",
  "c++": "cpp",
};
