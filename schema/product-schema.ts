import { z } from "zod";

export const variantSchema = z.object({
  sizeId: z.number(),
  colorId: z.number(),
});

export const productSchema = z.object({
  name: z.string().min(2).max(64),
  description: z.string().max(512),
  price: z.coerce.number().min(0.0),
  compareAtPrice: z.coerce.number().min(0.0),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  variants: z.array(variantSchema),
});

export type ProductCreate = z.infer<typeof productSchema>;
