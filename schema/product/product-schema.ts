import { z } from "zod";
import { variantSchema } from "@/schema/product/variant-schema";
import { ProductStatus } from "@prisma/client";
import { sizeMeasurementSchema } from "./size-measurement-schema";

export const PRODUCT_STATUSES = Object.keys(ProductStatus);

export const createProductSchema = z.object({
  article: z.string().regex(/^[0-9A-Za-z]+$/),
});

export type ProductCreate = z.infer<typeof createProductSchema>;

export const productSchema = z.object({
  name: z.string().min(2).max(64),
  article: z.string(),
  description: z.string().max(512),
  price: z.coerce.number().min(0.0),
  compareAtPrice: z.coerce.number().min(0.0),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  variants: z.array(variantSchema).min(1),
  productCategories: z.array(z.object({ id: z.coerce.number() })).min(1),
  sizeMeasures: z.array(sizeMeasurementSchema),
});

export type ProductSave = z.infer<typeof productSchema>;
