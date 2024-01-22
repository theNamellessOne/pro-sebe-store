import {z} from "zod";

export const reviewSchema = z.object({
    id: z.coerce.number().optional(),
    content: z.string().min(3).max(500),
});

export type ReviewSave = z.infer<typeof reviewSchema>