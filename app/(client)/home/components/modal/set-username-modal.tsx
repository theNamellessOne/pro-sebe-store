"use client";

import { Button } from "@/app/(client)/components/ui/button";
import { ErrorBox } from "@/app/(client)/components/ui/error-box";
import { UsernameSave, usernameFormSchema } from "@/schema/user/user-schema";
import { UserUpdateService } from "@/service/user-update/user-update-service";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function SetUsernameModal(props: {
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const form = useForm<UsernameSave>({
    resolver: zodResolver(usernameFormSchema),
  });

  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const session = useSession();

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (onClose: () => void, data: UsernameSave) => {
    const res = await UserUpdateService.instance.setUsername(data.username);

    setError(res.errMsg);
    if (!res.errMsg) {
      session.update(data);
      onClose();
      toast.success("Юзернейм обновлено");
    }
  };

  return (
    <>
      <Modal
        isDismissable={!isSubmitting}
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        classNames={{ base: "rounded-sm" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Придумайте собі нікнейм
              </ModalHeader>
              <ModalBody>
                <FormProvider {...form}>
                  <form
                    className={
                      "mt-6 p-4 min-w-[300px] w-full max-w-[600px] flex flex-col gap-4"
                    }
                    onSubmit={form.handleSubmit((data) =>
                      handleSubmit(onClose, data),
                    )}
                  >
                    <Input
                      {...form.register("username")}
                      variant={"underlined"}
                      label={"username"}
                      disabled={isSubmitting}
                      isInvalid={!!errors.username}
                      errorMessage={errors.username?.message}
                    />

                    {error && <ErrorBox message={error} />}

                    <Button
                      htmlType={"submit"}
                      disabled={isSubmitting || !isValid}
                      type={"primary"}
                      className="capitalize"
                    >
                      <div className={"flex items-center justify-center gap-3"}>
                        {isSubmitting && (
                          <Spinner size={"sm"} color={"primary"} />
                        )}
                        Обновити
                      </div>
                    </Button>
                  </form>
                </FormProvider>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
