"use client";

import Image from "next/image";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { VariantSave } from "@/schema/product/variant-schema";
import { FileUpload } from "@/app/dashboard/components/ui/file-upload";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ProductSave } from "@/schema/product/product-schema";

type ViewMediaModalProps = {
  form: UseFormReturn<ProductSave>;
  variant: VariantSave;
};

export function ViewMediaModal({ form, variant }: ViewMediaModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [redraw, setRedraw] = useState(0);

  return (
    <>
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal
        size={"xl"}
        isOpen={isOpen}
        scrollBehavior={"inside"}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Media</ModalHeader>
              <ModalBody>
                <div className={"grid grid-cols-3 grid-rows-3 gap-2"}>
                  {variant.mediaUrls.map((media, idx) => {
                    return (
                      <div className={"relative mt-2"}>
                        <Image
                          fill
                          className={"rounded-small"}
                          alt={"suka"}
                          src={media.url}
                          key={idx}
                        />
                      </div>
                    );
                  })}
                  <FileUpload
                    endpoint={"productImage"}
                    onChange={(url?: string) => {
                      if (!url) return;

                      let urls = variant.mediaUrls;
                      urls.push({ url });
                      variant.mediaUrls = urls;
                      setRedraw(redraw + 1);
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    const variants = form.getValues("variants");

                    if (!variants) {
                      onClose();
                      return;
                    }

                    for (let i = 0; i < variants.length; i++) {
                      if (variants[i].name === variant.name) {
                        variants[i] = variant;
                        break;
                      }
                    }

                    form.setValue("variants", variants);
                    onClose();
                  }}
                >
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
