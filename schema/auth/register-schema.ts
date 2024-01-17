import { z } from "zod";

const phoneRegEx = new RegExp(/[0-9]{8,15}$/);

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  username: z.string().min(2).max(100),
  phone: z.string().regex(phoneRegEx, "Invalid!"),
  password: z.string().min(6),
});

export type RegisterInput = z.infer<typeof registerSchema>;
