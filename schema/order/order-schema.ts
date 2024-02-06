import { z } from "zod";

const phoneRegEx = new RegExp(/[0-9]{8,15}$/);

export const contactInfoSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  surname: z.string().min(2).max(100),
  phone: z.string().regex(phoneRegEx, "Invalid!"),
});

export type ContactInfoInput = z.infer<typeof contactInfoSchema>;

export const deliveryInfoSchema = z.object({
  street: z.string().min(1),
  houseNo: z.string(),
  postalIndex: z.string().length(5),
  city: z.string(),
});

export type DeliveryInfoInput = z.infer<typeof deliveryInfoSchema>;

export const orderSchema = z.object({
  contactInfo: contactInfoSchema,
  deliveryInfo: deliveryInfoSchema,
});

export type OrderInput = z.infer<typeof orderSchema>;
