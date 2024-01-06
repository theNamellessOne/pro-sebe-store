"use client";

import { useFormContext } from "react-hook-form";
import { SectionTitle } from "@/app/dashboard/(pages)/products/components/form/section-title";
import { ProductSave } from "@/app/dashboard/(pages)/products/schema/product-schema";
import { useEffect, useState } from "react";
import Loading from "@/app/dashboard/loading";
import { Select, SelectItem } from "@nextui-org/react";
import { CategoryService } from "@/app/dashboard/(pages)/categories/service/category-service";
import { Category } from "@prisma/client";

const service = CategoryService.instance;

export function CategoryInfo() {
  const form = useFormContext<ProductSave>();
  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState(
    form
      .getValues("productCategories")
      ?.map((category) => category.id.toString()),
  );

  useEffect(() => {
    service.fetchAll().then((res) => {
      setCategories(res);
      setLoading(false);
    });
  }, []);

  return (
    <div
      className={
        "overflow-hidden relative flex flex-col gap-4 p-4 shadow-small rounded-large"
      }
    >
      <SectionTitle title={"Категорії"} />
      {loading && <Loading />}

      <Select
        label="Категорії"
        isDisabled={isSubmitting}
        selectionMode={"multiple"}
        defaultSelectedKeys={selectedCategories}
        onSelectionChange={(selection) => {
          const arr = Array.from(selection);
          const categoryArr: { id: number }[] = [];

          for (const item of arr) {
            categoryArr.push({ id: parseInt(item.toString()) });
          }

          form.setValue("productCategories", categoryArr);
        }}
      >
        {categories?.map((category: any) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}