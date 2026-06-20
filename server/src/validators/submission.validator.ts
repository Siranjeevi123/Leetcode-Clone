import { z } from "zod";

const submitRunSchema = z.object({
  language: z.enum(["c++", "java", "javascript"], {
    error: "Invalid language",
  }),

  code: z
    .string()
    .min(1, "Code cannot be empty")
    .trim(),
});

export default submitRunSchema;
