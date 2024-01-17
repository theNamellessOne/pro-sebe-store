import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  code: z.optional(z.string()),
});

export type LoginInput = z.infer<typeof loginSchema>;
