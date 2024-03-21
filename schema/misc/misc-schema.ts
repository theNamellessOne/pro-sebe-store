import { z } from "zod";

export const miscSchema = z.object({
  id: z.coerce.number().optional(),
  secondOrderDiscount: z.coerce.number().min(0, "Не менше 0"),
  freeDeliveryMinPrice: z.coerce.number().min(0, "Не менше 0"),
  shipmentsPerDay: z.string(),
  imageUrl: z.string().url("Некоректне посилання"),
});

export type MiscSave = z.infer<typeof miscSchema>;
