import { z } from "zod";

export const categorySchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(2, "Мінінмум 2 символи").max(64, "Максимум 64 символи"),
  parentId: z.coerce.number().gte(0, "Не менше 0").nullable().optional(),
  imageUrl: z.string().url("Некоректне посилання").nullable(),
});

export type CategorySave = z.infer<typeof categorySchema>;
