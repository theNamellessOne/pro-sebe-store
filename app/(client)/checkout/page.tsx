"use client";

import { OrderInput, orderSchema } from "@/schema/order/order-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { ContactInfo } from "./components/contact-info";
import { Divider } from "@nextui-org/react";

export default function Page() {
  const form = useForm<OrderInput>({
    mode: "onBlur",
    resolver: zodResolver(orderSchema),
  });

  return (
    <div>
      <FormProvider {...form}>
        <ContactInfo />
        <Divider />
      </FormProvider>
    </div>
  );
}
