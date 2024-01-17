import * as z from "zod";

export const newPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export type NewPasswordInput = z.infer<typeof newPasswordSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
