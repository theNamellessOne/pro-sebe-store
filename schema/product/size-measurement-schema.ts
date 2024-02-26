import { z } from "zod";

export const sizeMeasurementSchema = z.object({
  sizeName: z.string(),

  chestSize: z.coerce.number().min(10),
  waistSize: z.coerce.number().min(10),
  thighSize: z.coerce.number().min(10),
});

export type SizeMeasurementSave = z.infer<typeof sizeMeasurementSchema>;
