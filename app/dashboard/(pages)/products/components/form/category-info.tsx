"use client";

import { useFormContext } from "react-hook-form";
import { SectionTitle } from "@/app/dashboard/(pages)/products/components/form/section-title";
import { ProductSave } from "@/schema/product/product-schema";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { Select, SelectItem } from "@nextui-org/react";
import { CategoryService } from "@/service/category/category-service";
import { Category } from "@prisma/client";
import { CategoryWithChildren } from "@/app/(client)/components/header/header-categories";

const service = CategoryService.instance;

export function CategoryInfo() {
  const form = useFormContext<ProductSave>();
  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const [items, setItems] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState(
    form
      .getValues("productCategories")
      ?.map((category) => category.id.toString()),
  );

  useEffect(() => {
    let nodes: any[] = [];

    categories.map((item) => {
      //@ts-ignore
      nodes = [...nodes, ...renderTreeNode(item, 0)];
    });

    setItems(nodes);
  }, [categories]);

  useEffect(() => {
    setLoading(true);
    service
      .fetchTree()
      .then((res: Category[]) => {
        setCategories(res);
      })
      .finally(() => setLoading(false));
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
        isMultiline={true}
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
          form.trigger();
        }}
      >
        {items.map((item) => item)}
      </Select>
    </div>
  );
}

const renderTreeNode = (node: CategoryWithChildren, depth: number) => {
  const items = [];

  items.push(
    <SelectItem
      key={node.id}
      value={node.id}
      style={{ marginLeft: depth * 15 }}
    >
      {node.name}
    </SelectItem>,
  );

  if (node.children) {
    node.children.forEach((childNode) => {
      items.push(renderTreeNode(childNode, depth + 1));
    });
  }

  return items;
};
