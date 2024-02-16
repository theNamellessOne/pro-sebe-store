import {z} from "zod";

export const userSchema = z.object({
    id: z.coerce.string().optional(),
    name: z.string().min(2).max(100),
    surname: z.string().min(2).max(100),
    patronymic: z.string().min(2).max(100),
    password: z.string().min(6),
});

export type UserSave = z.infer<typeof userSchema>;