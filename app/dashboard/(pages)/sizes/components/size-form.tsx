"use client";

import { SizeSave, sizeSchema } from "@/schema/size/size-schema";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import { toast, Toaster } from "react-hot-toast";
import { SizeService } from "@/service/size/size-service";

export function SizeForm({ value }: { value?: SizeSave }) {
  const form = useForm<SizeSave>({
    mode: "onBlur",
    resolver: zodResolver(sizeSchema),
    defaultValues: value,
  });

  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = async (formData: SizeSave) => {
    formData.id = value?.id;
    const { errMsg } = await SizeService.instance.save(formData);

    if (errMsg) {
      toast.error("Щось пішло не так!");
    } else {
      toast.success("Розмір збережено!");
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
          defaultValue={value?.name}
          placeholder={"3XL"}
          errorMessage={errors.name?.message}
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
