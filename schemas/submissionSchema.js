import { z } from "zod";

export const submissionSchema = z.object({
  username: z.string().min(1),
  codeLanguage: z.string().min(1),
  sourceCode: z.string().min(1),
  stdIn: z.string()
});