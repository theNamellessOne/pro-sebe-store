import { z } from "zod";

export const bannerSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(2).max(64),
  imageUrl: z.string().url(),
  shouldBeOnTop: z.boolean().default(false),
});

export type BannerSave = z.infer<typeof bannerSchema>;
