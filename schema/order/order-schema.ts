import { OrderDeliveryType, OrderPaymentType } from "@prisma/client";
import { z } from "zod";

const phoneRegEx = new RegExp(/[0-9]{8,15}$/);

export const contactInfoSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(128),
  surname: z.string().min(1).max(128),
  middlename: z.string().min(1).max(128),
  phone: z.string().regex(phoneRegEx, "Цей номер телефону некоректний!"),
});

export type ContactInfoInput = z.infer<typeof contactInfoSchema>;

export const addressPartsSchema = z.object({
  street: z.string().min(1).max(256),
  houseNo: z.string().min(1).max(64),
  postalIdx: z.string().length(5),
});

export const deliveryInfoSchema = z
  .object({
    settlementRef: z.string().length(36),
    deliveryType: z.enum([
      OrderDeliveryType.COURIER,
      OrderDeliveryType.WAREHOUSE,
    ]),
    addressParts: addressPartsSchema.optional(),
    warehouseKey: z.string().min(1).optional(),
  })
  .refine((data) => {
    if (data.deliveryType === OrderDeliveryType.WAREHOUSE) {
      return data.warehouseKey && !data.addressParts;
    }

    if (data.deliveryType === OrderDeliveryType.COURIER) {
      return !data.warehouseKey && data.addressParts;
    }

    return false;
  }, "Either first or second should be filled in.");

export type DeliveryInfoInput = z.infer<typeof deliveryInfoSchema>;

export const orderSchema = z.object({
  paymentType: z.enum([OrderPaymentType.POSTPAID, OrderPaymentType.PREPAID]),
  contactInfo: contactInfoSchema,
  deliveryInfo: deliveryInfoSchema,
});

export type OrderInput = z.infer<typeof orderSchema>;
