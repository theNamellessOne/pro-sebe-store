"use client";

import { useFormContext } from "react-hook-form";
import { SectionTitle } from "@/app/dashboard/(pages)/products/components/form/section-title";
import { ProductCreate } from "@/schema/product-schema";
import { useEffect, useState } from "react";
import { fetchAllCategories } from "@/service/category-service";
import Loading from "@/app/dashboard/loading";
import { Select, SelectItem } from "@nextui-org/react";

export function CategoryInfo() {
  const form = useFormContext<ProductCreate>();
  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    fetchAllCategories().then((res) => {
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
        disabled={isSubmitting}
        selectionMode={"multiple"}
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
