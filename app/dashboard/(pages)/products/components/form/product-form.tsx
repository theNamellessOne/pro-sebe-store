"use client";

import { ProductSave, productSchema } from "@/schema/product/product-schema";

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
import Loading from "@/app/loading";
import { ProductService } from "@/service/product/product-service";

export function ProductForm({
  value,
  isEditing = false,
}: {
  value?: ProductSave;
  isEditing?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  if (!value) value = {} as ProductSave;
  if (!value?.status) value.status = "DRAFT";

  const form = useForm<ProductSave>({
    mode: "onBlur",
    resolver: zodResolver(productSchema),
    defaultValues: value,
  });
  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = async (formData: ProductSave) => {
    // @ts-ignore
    const { errMsg } = await ProductService.instance.save(formData);

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
            <InternalInfo isEditing={isEditing} />
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
