import { z } from "zod";

export const colorSchema = z.object({
    name: z.string().min(2).max(64),
    hexValue: z.string().length(7),
});

export type ColorCreate = z.infer<typeof colorSchema>;

