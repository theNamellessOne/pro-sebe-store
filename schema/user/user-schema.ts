import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, { message: "Мінімум 2 символи!" })
  .max(20, { message: "Максимум 20 символів!" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Ім'я користувача має містити лише літери, цифри та підкреслення!",
  });

export const usernameFormSchema = z.object({
  username: usernameSchema,
});

export type UsernameSave = z.infer<typeof usernameFormSchema>;

const phoneRegEx = new RegExp(/[0-9]{8,15}$/);

export const userUpdateFormSchema = z.object({
  id: z.coerce.string().optional(),
  name: z.string().min(2).max(100),
  surname: z.string().min(2).max(100),
  username: usernameSchema,
  patronymic: z.string().min(2).max(100),
  phone: z.string().regex(phoneRegEx, "Цей номер телефону не коректний!"),
  email: z.string().email(),
});

export type UserUpdate = z.infer<typeof userUpdateFormSchema>;

export const userChangePassword = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"],
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
