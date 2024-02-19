import { z } from "zod";

export const reviewSchema = z.object({
  id: z.coerce.number().optional(),
  content: z.string().min(3).max(500),
  rating: z.coerce.number().min(1).max(5).default(5),
});

export type ReviewSave = z.infer<typeof reviewSchema>;
