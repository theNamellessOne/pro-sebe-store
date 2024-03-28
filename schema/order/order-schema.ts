import { OrderDeliveryType, OrderPaymentType } from "@prisma/client";
import { z } from "zod";

const phoneRegEx = new RegExp(/[0-9]{8,15}$/);

export const contactInfoSchema = z.object({
  email: z.string().email("Некоректна електронна пошта"),
  name: z.string().min(1, "Мінімум 1 символ").max(128, "Максимум 128 символів"),
  surname: z
    .string()
    .min(1, "Мінімум 1 символ")
    .max(128, "Максимум 128 символів"),
  middlename: z
    .string()
    .min(1, "Мінімум 1 символ")
    .max(128, "Максимум 128 символів")
    .optional(),
  phone: z.string().regex(phoneRegEx, "Цей номер телефону некоректний!"),
});

export type ContactInfoInput = z.infer<typeof contactInfoSchema>;

export const addressPartsSchema = z.object({
  street: z
    .string()
    .min(1, "Мінімум 1 символ")
    .max(256, "Максимум 256 символів"),
  houseNo: z.string().min(1, "Мінімум 1 символ").max(64, "Максимум 64 символа"),
  postalIdx: z.string().length(5, "Потрібно 5 символів"),
});

export const deliveryInfoSchema = z
  .object({
    settlementRef: z.string().length(36, "Потрібно 36 символів"),
    settlementDescription: z.string(),
    deliveryType: z.enum([
      OrderDeliveryType.COURIER,
      OrderDeliveryType.WAREHOUSE,
    ]),
    addressParts: addressPartsSchema.optional(),
    warehouseKey: z.string().min(1, "Мінімум 1 символ").optional(),
  })
  .refine((data) => {
    if (data.deliveryType === OrderDeliveryType.WAREHOUSE) {
      return data.warehouseKey && !data.addressParts;
    }

    if (data.deliveryType === OrderDeliveryType.COURIER) {
      return !data.warehouseKey && data.addressParts;
    }

    return false;
  }, "Щось одне повинно бути заповнено.");

export type DeliveryInfoInput = z.infer<typeof deliveryInfoSchema>;

export const orderSchema = z.object({
  paymentType: z.enum([OrderPaymentType.POSTPAID, OrderPaymentType.PREPAID]),
  contactInfo: contactInfoSchema,
  deliveryInfo: deliveryInfoSchema,
});

export type OrderInput = z.infer<typeof orderSchema>;
