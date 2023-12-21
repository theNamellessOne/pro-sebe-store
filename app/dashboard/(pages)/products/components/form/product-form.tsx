"use client";

import { ProductCreate, productSchema } from "@/schema/product-schema";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";

import { toast, Toaster } from "react-hot-toast";
import { GeneralInfo } from "@/app/dashboard/(pages)/products/components/form/general-info";
import { PricingInfo } from "@/app/dashboard/(pages)/products/components/form/pricing-info";
import { InternalInfo } from "@/app/dashboard/(pages)/products/components/form/internal-info";
import { CategoryInfo } from "@/app/dashboard/(pages)/products/components/form/category-info";
import { OptionInfo } from "@/app/dashboard/(pages)/products/components/form/option-info";
import { VariantInfo } from "@/app/dashboard/(pages)/products/components/form/variant-info";
import { useState } from "react";
import Loading from "@/app/dashboard/loading";
import { saveProduct } from "@/service/product-service";

type ProductFormProps = {
  id?: number;
  value: ProductCreate;
};

export function ProductForm({ id, value }: ProductFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ProductCreate>({
    mode: "onBlur",
    resolver: zodResolver(productSchema),
    defaultValues: value,
  });
  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = async (formData: ProductCreate) => {
    const { errMsg, value } = await saveProduct(formData, undefined);
    console.log(value);

    if (errMsg) {
      toast.error("Щось пішло не так");
    } else {
      toast.success("Товар Збережено");
    }
  };

  return (
    <FormProvider {...form}>
      {loading && <Loading />}

      <form className={"mt-6 p-4"} onSubmit={form.handleSubmit(handleSubmit)}>
        <div className={"flex flex-col lg:flex-row gap-4"}>
          <div className={"flex flex-col gap-4 grow"}>
            <GeneralInfo />
            <PricingInfo />
            <VariantInfo />
          </div>
          <div className={"flex flex-col gap-4 lg:w-[280px] xl:w-[340px]"}>
            <InternalInfo />
            <CategoryInfo />
            <OptionInfo />
          </div>
        </div>
        <Button
          className={"font-semibold"}
          color={"primary"}
          type={"submit"}
          isDisabled={isSubmitting || !isValid}
          isLoading={isSubmitting || loading}
        >
          Зберегти
        </Button>

        <Toaster />
      </form>
    </FormProvider>
  );
}
