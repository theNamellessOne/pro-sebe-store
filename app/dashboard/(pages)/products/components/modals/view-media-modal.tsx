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
import { useFormContext } from "react-hook-form";
import { ProductSave } from "@/schema/product/product-schema";
import { useProductImage } from "../../hooks/use-product-image";
import { Check } from "lucide-react";

type ViewMediaModalProps = {
  variant: VariantSave;
};

export function ViewMediaModal({ variant }: ViewMediaModalProps) {
  const form = useFormContext<ProductSave>();
  const { isSubmitting } = form.formState;

  const { urls, addUrls } = useProductImage()!;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isUploading, setIsUploading] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState(
    variant.mediaUrls.map((mu) => mu.url),
  );

  const toggle = (url: string) => {
    let index = selectedUrls.indexOf(url);
    let newSelectedUrls;

    if (index !== -1) {
      newSelectedUrls = [...selectedUrls]; // Create a copy of the original array
      newSelectedUrls.splice(index, 1);
    } else {
      newSelectedUrls = [...selectedUrls, url];
    }

    setSelectedUrls(newSelectedUrls);
  };

  return (
    <>
      <Button isDisabled={isSubmitting} onPress={onOpen}>
        Open Modal
      </Button>
      <Modal
        size={"3xl"}
        isOpen={isOpen}
        scrollBehavior={"inside"}
        isDismissable={isUploading}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Media</ModalHeader>
              <ModalBody>
                <div
                  className={
                    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
                  }
                >
                  {urls?.map((url, idx) => {
                    return (
                      <div
                        className={"relative mt-2 cursor-pointer"}
                        onClick={() => toggle(url)}
                        key={idx}
                      >
                        {selectedUrls.includes(url) && (
                          <div
                            className={
                              "absolute inset-0 flex justify-center items-center bg-black/40 text-white z-50"
                            }
                          >
                            <Check />
                          </div>
                        )}

                        <Image
                          className={"rounded-small"}
                          width={400}
                          height={400}
                          alt={"image"}
                          src={url}
                        />
                      </div>
                    );
                  })}
                  <FileUpload
                    input={{ productArticle: form.getValues("article") }}
                    endpoint={"productImage"}
                    onUploadBegin={() => setIsUploading(true)}
                    onUploadComplete={(res) => {
                      if (!res) return;

                      addUrls(res.map((res) => res.url));

                      setIsUploading(false);
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isUploading}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  isDisabled={isUploading}
                  onPress={() => {
                    const variants = form.getValues("variants");

                    if (!variants) {
                      onClose();
                      return;
                    }

                    for (let i = 0; i < variants.length; i++) {
                      if (variants[i].name === variant.name) {
                        variants[i] = {
                          ...variant,
                          mediaUrls: selectedUrls.map((url) => {
                            return { url };
                          }),
                        };
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
