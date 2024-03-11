import * as z from "zod";

export const newPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Мінімум 6 символів!",
  }),
});

export type NewPasswordInput = z.infer<typeof newPasswordSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email({
    message: "Необхідно вказати адресу електронної пошти!",
  }),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
