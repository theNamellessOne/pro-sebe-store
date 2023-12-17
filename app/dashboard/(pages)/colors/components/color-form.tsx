"use client";

import { ColorCreate, colorSchema } from "@/schema/color-schema";
import { saveColor } from "@/service/color-service";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import { toast, Toaster } from "react-hot-toast";

type ColorFormProps = {
  id?: number;
  value: ColorCreate;
};

export function ColorForm({ id, value }: ColorFormProps) {
  const form = useForm<ColorCreate>({
    mode: "onBlur",
    resolver: zodResolver(colorSchema),
    defaultValues: value,
  });

  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = async (formData: ColorCreate) => {
    const { errMsg } = await saveColor(formData, id);

    if (errMsg) {
      toast.error("Щось пішло не так");
    } else {
      toast.success("Колір Збережено");
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
          {...form.register("hexValue")}
          className={"md:w-20"}
          classNames={{
            inputWrapper: "p-0 overflow-hidden",
            innerWrapper: "p-0 overflow-hidden",
            input: "h-full",
          }}
          type={"color"}
          disabled={isSubmitting}
          isInvalid={!!errors.hexValue}
          defaultValue={value.hexValue}
          errorMessage={errors.hexValue?.message}
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
