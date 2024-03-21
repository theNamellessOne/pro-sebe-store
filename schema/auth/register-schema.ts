import { z } from "zod";
import { usernameSchema } from "../user/user-schema";

const phoneRegEx = new RegExp(/[0-9]{8,15}$/);

export const registerSchema = z.object({
  email: z.string().email("Некоректна пошта"),
  name: z.string().min(2, "Мінінмум 2 символи").max(100, "Максимум 100 символів"),
  username: usernameSchema,
  phone: z.string().regex(phoneRegEx, "Цей номер телефону некоректний!"),
  password: z.string().min(6, "Мінінмум 6 символів"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
