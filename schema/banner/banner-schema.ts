import { z } from "zod";

export const bannerSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(2, "Мінінмум 2 символи").max(64, "Максимум 64 символи"),
  imageUrl: z.string().url("Некоректне посилання"),
  shouldBeOnTop: z.boolean().default(false),
});

export type BannerSave = z.infer<typeof bannerSchema>;
