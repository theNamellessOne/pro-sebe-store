import { z } from "zod";

export const mediaUrlSchema = z.object({
  url: z.string().url(),
});

export const variantSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string(),
  sizeId: z.coerce.number(),
  colorId: z.coerce.number(),
  quantity: z.coerce.number().min(0),
  reserved: z.coerce.number().optional(),
  mediaUrls: z.array(mediaUrlSchema),
});

export type VariantSave = z.infer<typeof variantSchema>;
export type MediaUrlSave = z.infer<typeof mediaUrlSchema>;
