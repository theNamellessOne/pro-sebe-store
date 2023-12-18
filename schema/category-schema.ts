import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2).max(64),
  parentId: z.coerce.number().gte(0).nullable().optional(),
});

export type CategoryCreate = z.infer<typeof categorySchema>;
