import { z } from "zod";

export const reviewSchema = z.object({
  id: z.coerce.number().optional(),
  content: z.string().min(3, "Мінімум 3 символи").max(500, "Не більше 500 смиволів"),
  rating: z.coerce.number().min(1, "Мінімум 1").max(5, "Максимум 5").default(5),
});

export type ReviewSave = z.infer<typeof reviewSchema>;
