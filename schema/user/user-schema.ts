import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, { message: "Username must be at least 3 characters long" })
  .max(20, { message: "Username must be at most 20 characters long" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username must contain only letters, numbers, and underscores",
  });

export const usernameFormSchema = z.object({
  username: usernameSchema,
});

export type UsernameSave = z.infer<typeof usernameFormSchema>;

const phoneRegEx = new RegExp(/[0-9]{8,15}$/);

export const userUpdateFormSchema = z.object({
  id: z.coerce.string().optional(),
  name: z.string().min(2).max(100),
  username: usernameSchema,
  phone: z.string().regex(phoneRegEx, "Invalid!"),
  email: z.string().email(),
});

export type UserUpdate = z.infer<typeof userUpdateFormSchema>;

export const userChangePassword = z.object({
  password: z.string().min(6),
  confirmPassword: z.string(),
}).refine((data)=> data.password === data.confirmPassword, {
  message: "Паролі не збігаються",
  path: ['confirmPassword'],
});

export type UserChangePassword = z.infer<typeof userChangePassword>;

export const userSchema = z.object({
  id: z.coerce.string().optional(),
  name: z.string().min(2).max(100),
  surname: z.string().min(2).max(100),
  patronymic: z.string().min(2).max(100),
  password: z.string().min(6),
});

export type UserSave = z.infer<typeof userSchema>;
