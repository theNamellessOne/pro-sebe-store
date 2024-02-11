"use client";

import { OrderInput, orderSchema } from "@/schema/order/order-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { ContactInfo } from "./components/contact-info";
import { DeliveryInfo } from "./components/delivery-info";
import { SubmitSection } from "./components/submit-section";
import { PaymentMethodSelect } from "./components/payment-method-select";
import { OrderDeliveryType, OrderPaymentType } from "@prisma/client";
import { useCart } from "../cart/hooks/use-cart";
import { useRouter } from "next/navigation";

export default function Page() {
  const { cart, isLoading } = useCart()!;

  if (cart && cart.cartItems.length === 0) useRouter().push("/catalogue");

  const form = useForm<OrderInput>({
    mode: "onBlur",
    resolver: zodResolver(orderSchema),
    defaultValues: {
      deliveryInfo: { deliveryType: OrderDeliveryType.COURIER },
      paymentType: OrderPaymentType.PREPAID,
    },
  });

  return (
    <>
      <FormProvider {...form}>
        <div className="flex flex-col lg:flex-row min-h-screen">
          <div className="flex flex-col gap-4 w-full lg:w-3/5 p-4 sm:p-8">
            <DeliveryInfo />
            <ContactInfo />
            <PaymentMethodSelect />
          </div>
          <SubmitSection />
        </div>
      </FormProvider>
    </>
  );
}
