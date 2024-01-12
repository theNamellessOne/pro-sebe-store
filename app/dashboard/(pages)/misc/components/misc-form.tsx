"use client";

import { MiscSave, miscSchema } from "@/schema/misc/misc-schema";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import { toast, Toaster } from "react-hot-toast";
import { MiscService } from "@/service/misc/misc-service";

export function MiscForm({ value }: { value?: MiscSave }) {
  const form = useForm<MiscSave>({
    mode: "onBlur",
    resolver: zodResolver(miscSchema),
    defaultValues: value,
  });

  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = async (formData: MiscSave) => {
    const { errMsg } = await MiscService.instance.save(formData);

    if (errMsg) {
      toast.error("Щось пішло не так");
    } else {
      toast.success("Збережено");
    }
  };

  console.log(value);

  return (
    <form
      className={
        "mt-6 p-4 max-w-[600px] flex flex-col gap-4 shadow-small rounded-large"
      }
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div className={"flex flex-col gap-2"}>
        <Input
          {...form.register("freeDeliveryMinPrice")}
          label={"Безкошновна доставка вiд"}
          disabled={isSubmitting}
          isInvalid={!!errors.freeDeliveryMinPrice}
          defaultValue={value?.freeDeliveryMinPrice?.toString()}
          errorMessage={errors.freeDeliveryMinPrice?.message}
        />

        <Input
          {...form.register("avgDeliveryTime")}
          label={"Обiцяний час доставки"}
          disabled={isSubmitting}
          isInvalid={!!errors.avgDeliveryTime}
          defaultValue={value?.avgDeliveryTime?.toString()}
          errorMessage={errors.avgDeliveryTime?.message}
        />

        <Input
          {...form.register("secondOrderDiscount")}
          label={"Скидка на друге замовлення"}
          disabled={isSubmitting}
          isInvalid={!!errors.secondOrderDiscount}
          defaultValue={value?.secondOrderDiscount?.toString()}
          errorMessage={errors.secondOrderDiscount?.message}
        />
      </div>

      <Button
        className={"font-semibold"}
        color={"primary"}
        type={"submit"}
        isDisabled={isSubmitting || !isValid}
        isLoading={isSubmitting}
      >
        Зберегти
      </Button>

      <Toaster />
    </form>
  );
}
