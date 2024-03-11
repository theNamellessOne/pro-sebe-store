"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  ProductCreate,
  createProductSchema,
} from "@/schema/product/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { ProductService } from "@/service/product/product-service";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export function CreateProductModal() {
  const router = useRouter();

  const form = useForm<ProductCreate>({
    mode: "onBlur",
    resolver: zodResolver(createProductSchema),
  });

  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [redraw, setRedraw] = useState(0);

  const handleSubmit = async (formData: ProductCreate) => {
    const { errMsg, value } = await ProductService.instance.create(formData);

    if (errMsg) {
      toast.error("Щось пішло не так!");
    } else {
      toast.success("Товар створено!");

      router.push(`/dashboard/products/edit/${value?.article}`);
    }
  };

  return (
    <FormProvider {...form}>
      <Button
        color={"primary"}
        variant={"shadow"}
        isIconOnly
        className={"mt-2"}
        onClick={onOpen}
      >
        <Plus />
      </Button>
      <Modal
        size={"xl"}
        isOpen={isOpen}
        isDismissable={!isSubmitting}
        scrollBehavior={"inside"}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Створити Товар
              </ModalHeader>
              <ModalBody>
                <form
                  id={"create-product-form"}
                  onSubmit={form.handleSubmit(handleSubmit)}
                >
                  <Input
                    {...form.register("article")}
                    label={"Артикул"}
                    isDisabled={isSubmitting}
                    isInvalid={!!errors.article}
                    defaultValue={form.getValues().article}
                    errorMessage={errors.article?.message}
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isSubmitting}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  form={"create-product-form"}
                  type={"submit"}
                  isDisabled={isSubmitting || !isValid}
                  isLoading={isSubmitting}
                >
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Toaster />
    </FormProvider>
  );
}
