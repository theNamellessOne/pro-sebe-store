import { z } from "zod";

export const colorSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(2).max(64),
  hexValue: z.string().length(7),
});

export type ColorSave = z.infer<typeof colorSchema>;
