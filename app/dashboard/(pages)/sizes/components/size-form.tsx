"use client";

import { SizeCreate, sizeSchema } from "@/schema/size-schema";
import { saveSize } from "@/service/size-service";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import { toast, Toaster } from "react-hot-toast";

type SizeFormProps = {
  id?: number;
  value: SizeCreate;
};

export function SizeForm({ id, value }: SizeFormProps) {
  const form = useForm<SizeCreate>({
    mode: "onBlur",
    resolver: zodResolver(sizeSchema),
    defaultValues: value,
  });

  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = async (formData: SizeCreate) => {
    const { errMsg } = await saveSize(formData, id);

    if (errMsg) {
      toast.error("Щось пішло не так");
    } else {
      toast.success("Розмір Збережено");
    }
  };

  return (
    <form
      className={
        "mt-6 p-4 max-w-[600px] flex flex-col gap-4 shadow-small rounded-large"
      }
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div className={"flex flex-col md:flex-row gap-2"}>
        <Input
          {...form.register("name")}
          label={"Назва"}
          disabled={isSubmitting}
          isInvalid={!!errors.name}
          defaultValue={value.name}
          errorMessage={errors.name?.message}
        />
        <Input
          {...form.register("chestSize")}
          type={"number"}
          label={"Обхват Грудей"}
          disabled={isSubmitting}
          isInvalid={!!errors.chestSize}
          defaultValue={value.chestSize.toString()}
          errorMessage={errors.chestSize?.message}
        />
        <Input
          {...form.register("waistSize")}
          type={"number"}
          label={"Обхват Талії"}
          disabled={isSubmitting}
          isInvalid={!!errors.waistSize}
          defaultValue={value.waistSize.toString()}
          errorMessage={errors.waistSize?.message}
        />
        <Input
          {...form.register("thighSize")}
          type={"number"}
          label={"Обхват Бедер"}
          disabled={isSubmitting}
          isInvalid={!!errors.thighSize}
          defaultValue={value.thighSize.toString()}
          errorMessage={errors.thighSize?.message}
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
