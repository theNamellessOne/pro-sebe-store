import { z } from "zod";

export const colorSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(2, "Мінінмум 2 символи").max(64, "Максимум 64 символи"),
  hexValue: z.string().length(7, "Значення кольору має бути 7 символів"),
});

export type ColorSave = z.infer<typeof colorSchema>;
