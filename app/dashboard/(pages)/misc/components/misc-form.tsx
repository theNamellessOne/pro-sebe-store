"use client";

import { MiscSave, miscSchema } from "@/schema/misc/misc-schema";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import { toast, Toaster } from "react-hot-toast";
import { MiscService } from "@/service/misc/misc-service";
import { FileUpload } from "@/app/dashboard/components/ui/file-upload";
import { X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function MiscForm({ value }: { value?: MiscSave }) {
  const form = useForm<MiscSave>({
    mode: "onBlur",
    resolver: zodResolver(miscSchema),
    defaultValues: value,
  });

  const [redraw, setRedraw] = useState(1);

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
          {...form.register("shipmentsPerDay")}
          label={"Обiцяний час доставки"}
          disabled={isSubmitting}
          isInvalid={!!errors.shipmentsPerDay}
          defaultValue={value?.shipmentsPerDay}
          errorMessage={errors.shipmentsPerDay?.message}
        />

        <Input
          {...form.register("secondOrderDiscount")}
          label={"Скидка на друге замовлення"}
          disabled={isSubmitting}
          isInvalid={!!errors.secondOrderDiscount}
          defaultValue={value?.secondOrderDiscount?.toString()}
          errorMessage={errors.secondOrderDiscount?.message}
        />

        {!form.getValues("imageUrl") ? (
          <FileUpload
            endpoint={"bannerImage"}
            onUploadComplete={(res) => {
              if (!res) return;

              form.setValue("imageUrl", res[0].url!);
              setRedraw(redraw + 1);
            }}
          />
        ) : (
          <div
            className={"relative aspect-[3/3] rounded-large overflow-hidden"}
          >
            <Button
              className={"absolute top-2 right-2 z-50"}
              color={"danger"}
              variant={"light"}
              isIconOnly
              onClick={() => {
                form.setValue("imageUrl", "");
                setRedraw(redraw + 1);
              }}
            >
              <X />
            </Button>
            <Image fill src={form.getValues("imageUrl")} alt={"upload"} />
          </div>
        )}
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
