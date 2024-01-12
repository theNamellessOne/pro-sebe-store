import { z } from "zod";

export const miscSchema = z.object({
  id: z.coerce.number().optional(),
  secondOrderDiscount: z.coerce.number().min(0),
  freeDeliveryMinPrice: z.coerce.number().min(0),
  avgDeliveryTime: z.coerce.number().min(0),
});

export type MiscSave = z.infer<typeof miscSchema>;
