"use client";

import Image from "next/image";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import { toast, Toaster } from "react-hot-toast";
import { Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Category } from "@prisma/client";
import { CategoryService } from "@/service/category/category-service";
import {
  CategorySave,
  categorySchema,
} from "@/schema/category/category-schema";
import { FileUpload } from "@/app/dashboard/components/ui/file-upload";
import { X } from "lucide-react";
import { CategoryWithChildren } from "@/app/(client)/components/header/header-categories";

const service = CategoryService.instance;

export function CategoryForm({ value }: { value?: Category }) {
  const [possibleParents, setPossibleParents] = useState<Category[]>([]);
  const [redraw, setRedraw] = useState(1);
  const [items, setItems] = useState<any[]>([]);

  function fetchParents() {
    service.fetchTree().then((res) => {
      const possibleParents: Category[] = [
        {
          id: 0,
          name: "No Parent",
          path: "",
          parentId: 0,
          imageUrl: "",
        },
      ];

      setPossibleParents(possibleParents.concat(res));
    });
  }

  useEffect(() => {
    let nodes: any[] = [];

    possibleParents.map((item) => {
      //@ts-ignore
      nodes = [...nodes, ...renderTreeNode(item, 0)];
    });

    setItems(nodes);
  }, [possibleParents]);

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
      {!form.getValues("imageUrl") ? (
        <FileUpload
          endpoint={"bannerImage"}
          onUploadComplete={(res) => {
            form.setValue("imageUrl", res[0].url!);
            setRedraw(redraw + 1);
          }}
        />
      ) : (
        <div className={"relative aspect-[4/3] rounded-large overflow-hidden"}>
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
          <Image fill src={form.getValues("imageUrl")!} alt={"upload"} />
        </div>
      )}

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
          {items.map((node: any) => {
            return node;
          })}
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
