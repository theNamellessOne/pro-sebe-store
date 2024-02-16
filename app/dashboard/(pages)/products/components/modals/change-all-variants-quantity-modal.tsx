"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ProductSave } from "@/schema/product/product-schema";
import { Toaster } from "react-hot-toast";

export function ChangeAllVariantsQuantityModal(props: {
  isOpen: boolean;
  onOpenChange: () => void;

  header: string;
  label: string;
  fn: (value: number) => void;
}) {
  const form = useFormContext<ProductSave>();

  const [value, setValue] = useState<number>(0);
  const { header, label, fn, ...rest } = props;

  return (
    <>
      <Modal size={"xl"} scrollBehavior={"inside"} {...rest}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {header}
              </ModalHeader>
              <ModalBody>
                <Input
                  value={value.toString()}
                  onValueChange={(v) => {
                    const numValue = Number(v);
                    if (isNaN(numValue) || numValue % 1 !== 0) {
                      return;
                    }
                    setValue(numValue);
                  }}
                  label={label}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    fn(value);
                  }}
                >
                  Зберегти
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Toaster />
    </>
  );
}
