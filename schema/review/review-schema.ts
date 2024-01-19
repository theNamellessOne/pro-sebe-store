import {z} from "zod";

export const reviewSchema = z.object({
    id: z.coerce.number().optional(),
    userName: z.string().min(5).max(20),
    content: z.string().min(3).max(500),
    status: z.enum(["ON_MODERATION", "APPROVED"]).default("ON_MODERATION"),
});

export type ReviewSave = z.infer<typeof reviewSchema>