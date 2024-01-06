import { z } from "zod";
import { variantSchema } from "@/app/dashboard/(pages)/products/schema/variant-schema";
import { ProductStatus } from "@prisma/client";

export const PRODUCT_STATUSES = Object.keys(ProductStatus);

export const productSchema = z.object({
  article: z.string(),
  name: z.string().min(2).max(64),
  description: z.string().max(512),
  price: z.coerce.number().min(0.0),
  compareAtPrice: z.coerce.number().min(0.0),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  variants: z.array(variantSchema).min(1),
  productCategories: z.array(z.object({ id: z.coerce.number() })).min(1),
});

export type ProductSave = z.infer<typeof productSchema>;
