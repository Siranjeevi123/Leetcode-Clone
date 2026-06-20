export interface Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  compiler_options?: string;
  command_line_arguments?: string;
}

export type SubmissionStatus = | "pending"| "accepted"| "wrong_answer"| "runtime_error"| "compilation_error"| "time_limit_exceeded";
