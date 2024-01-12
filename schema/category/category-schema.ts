import { z } from "zod";

export const categorySchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(2).max(64),
  parentId: z.coerce.number().gte(0).nullable().optional(),
  imageUrl: z.string().url().optional(),
});

export type CategorySave = z.infer<typeof categorySchema>;
