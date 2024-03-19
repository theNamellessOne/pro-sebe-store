import { z } from "zod";

export const sizeSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1).max(5),
});

export type SizeSave = z.infer<typeof sizeSchema>;
