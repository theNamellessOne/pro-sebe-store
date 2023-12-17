import { z } from "zod";

export const sizeSchema = z.object({
  name: z.string().min(1).max(5),
  chestSize: z.coerce.number().gte(10),
  waistSize: z.coerce.number().gte(10),
  thighSize: z.coerce.number().gte(10),
});

export type SizeCreate = z.infer<typeof sizeSchema>;
