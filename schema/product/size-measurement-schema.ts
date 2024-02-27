import { z } from "zod";

export const sizeMeasurementSchema = z.object({
  sizeName: z.string(),
  sizeMeasure: z.string(),
});

export type SizeMeasurementSave = z.infer<typeof sizeMeasurementSchema>;
