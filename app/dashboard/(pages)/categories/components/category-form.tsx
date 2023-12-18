"use client";

import { CategoryCreate, categorySchema } from "@/schema/category-schema";
import { fetchPossibleParents, saveCategory } from "@/service/category-service";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import { toast, Toaster } from "react-hot-toast";
import { Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";

type CategoryFormProps = {
  id?: number;
  value: CategoryCreate;
};

export function CategoryForm({ id, value }: CategoryFormProps) {
  const [possibleParents, setPossibleParents] = useState<any[]>([]);

  useEffect(() => {
    fetchPossibleParents(id).then((r) => {
      r.push({
        id: 0,
        name: "",
        parentId: 0,
      });
      setPossibleParents(r);
    });
  }, []);

  const form = useForm<CategoryCreate>({
    mode: "onBlur",
    resolver: zodResolver(categorySchema),
    defaultValues: value,
  });

  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = async (formData: CategoryCreate) => {
    const { errMsg } = await saveCategory(formData, id);

    if (errMsg) {
      toast.error("Щось пішло не так");
    } else {
      toast.success("Категорію Збережено");
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
