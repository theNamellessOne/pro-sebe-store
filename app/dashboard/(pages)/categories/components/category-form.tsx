"use client";

import {
  CategorySave,
  categorySchema,
} from "@/app/dashboard/(pages)/categories/schema/category-schema";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import { toast, Toaster } from "react-hot-toast";
import { Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { CategoryService } from "@/app/dashboard/(pages)/categories/service/category-service";
import { Category } from "@prisma/client";

const service = CategoryService.instance;

export function CategoryForm({ value }: { value?: Category }) {
  const [possibleParents, setPossibleParents] = useState<Category[]>([]);

  function fetchParents() {
    service.fetchPossibleParents(value?.id).then((res) => {
      const possibleParents: Category[] = [
        {
          id: 0,
          name: "No Parent",
          path: "",
          parentId: 0,
        },
      ];

      setPossibleParents(possibleParents.concat(res));
    });
  }

  useEffect(() => {
    fetchParents();
  }, []);

  const form = useForm<CategorySave>({
    mode: "onBlur",
    resolver: zodResolver(categorySchema),
    defaultValues: value,
  });

  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = async (formData: CategorySave) => {
    formData.id = value?.id;
    const { errMsg } = await service.save(formData);

    if (errMsg) {
      toast.error("Щось пішло не так");
    } else {
      toast.success("Категорію Збережено");
    }

    fetchParents();
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
          placeholder={"Шкарпетки"}
          errorMessage={errors.name?.message}
        />
        <Select
          {...form.register("parentId")}
          items={possibleParents}
          disabled={isSubmitting}
          isInvalid={!!errors.parentId}
          errorMessage={errors.parentId?.message}
        >
          {(possibleParent) => (
            <SelectItem key={possibleParent.id}>
              {possibleParent.name}
            </SelectItem>
          )}
        </Select>
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
