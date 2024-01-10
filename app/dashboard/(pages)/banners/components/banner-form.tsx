"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import { toast, Toaster } from "react-hot-toast";
import { FileUpload } from "@/app/dashboard/components/ui/file-upload";
import { Checkbox } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import { BannerSave, bannerSchema } from "@/schema/banner/banner-schema";
import { BannerService } from "@/service/banner/banner-service";

export function BannerForm({ value }: { value?: BannerSave }) {
  const form = useForm<BannerSave>({
    mode: "onBlur",
    resolver: zodResolver(bannerSchema),
    defaultValues: value,
  });

  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;
  const [redraw, setRedraw] = useState(1);

  const handleSubmit = async (formData: BannerSave) => {
    formData.id = value?.id;
    const { errMsg } = await BannerService.instance.save(formData);

    if (errMsg) {
      toast.error("Щось пішло не так");
    } else {
      toast.success("Банер Збережено");
    }
  };

  return (
    <form
      className={
        "mt-6 p-4 max-w-[600px] flex flex-col gap-4 shadow-small rounded-large"
      }
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div className={"flex flex-col gap-4"}>
        <Input
          {...form.register("name")}
          label={"Назва"}
          disabled={isSubmitting}
          isInvalid={!!errors.name}
          defaultValue={value?.name}
          placeholder={"Чорний"}
          errorMessage={errors.name?.message}
        />

        <Checkbox
          isSelected={form.getValues("shouldBeOnTop")}
          onValueChange={(value) => {
            form.setValue("shouldBeOnTop", value);
            setRedraw(redraw + 1);
          }}
          {...form.register("shouldBeOnTop")}
        >
          Верхнiй
        </Checkbox>

        {!form.getValues("imageUrl") ? (
          <FileUpload
            endpoint={"bannerImage"}
            onChange={(url?: string) => {
              form.setValue("imageUrl", url!);
              setRedraw(redraw + 1);
            }}
          />
        ) : (
          <div
            className={"relative aspect-[4/3] rounded-large overflow-hidden"}
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
