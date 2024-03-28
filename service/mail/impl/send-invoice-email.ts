"use server";

import { _sendEmail } from "@/service/mail/impl/send-email";

const domain = process.env.BASE_URL;

export async function _sendInvoiceEmail(
  email: string,
  invoiceId: string,
  orderId: string,
) {
  return _sendEmail({
    to: email,
    subject: "Створено Накладну!",
    html: `На ваше замовлення ${orderId} створено накладну з номером ${invoiceId}`,
  });
}
