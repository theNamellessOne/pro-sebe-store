"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { ContactInfo } from "./contact-info";
import { DeliveryInfo } from "./delivery-info";
import { SubmitSection } from "./submit-section";
import { PaymentMethodSelect } from "./payment-method-select";
import { OrderDeliveryType, OrderPaymentType } from "@prisma/client";
import { useCart } from "../../cart/hooks/use-cart";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { IoArrowBack } from "react-icons/io5";
import { OrderInput, orderSchema } from "@/schema/order/order-schema";

export function Checkout(props: { user: any | undefined | null }) {
  const { cart } = useCart()!;

  if (cart && cart.cartItems.length === 0) useRouter().push("/catalogue");

  const form = useForm<OrderInput>({
    mode: "onBlur",
    resolver: zodResolver(orderSchema),
    defaultValues: {
      contactInfo: {
        name: props.user?.name,
        email: props.user?.email,
        phone: props.user?.phone,
        surname: props.user?.surname,
        middlename: props.user?.patronymic,
      },
      deliveryInfo: { deliveryType: OrderDeliveryType.WAREHOUSE },
      paymentType: OrderPaymentType.PREPAID,
    },
  });

  return (
    <>
      <FormProvider {...form}>
        <div className="flex flex-col lg:flex-row min-h-screen">
          <div className="flex flex-col gap-4 w-full lg:w-3/5 p-3 sm:p-8">
            <div className="flex items-center gap-4">
              <Button
                isIconOnly
                color={"primary"}
                className={"rounded-sm"}
                variant={"light"}
                onPress={useRouter().back}
              >
                <IoArrowBack className={"w-6 h-6"} />
              </Button>

              <h2 className={"font-semibold text-2xl"}>
                Оформлення замовлення
              </h2>
            </div>

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
