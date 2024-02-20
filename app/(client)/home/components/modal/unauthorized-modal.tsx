"use client";

import { Button } from "@/app/(client)/components/ui/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import Link from "next/link";

export function UnauthorizedModal(props: {
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        classNames={{ base: "rounded-sm" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Ви не авторизовані
              </ModalHeader>
              <ModalBody>
                <Link href="/auth/login" className={"w-full"}>
                  <Button type={"primary"} className={"w-full"}>
                    Увійти
                  </Button>
                </Link>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
