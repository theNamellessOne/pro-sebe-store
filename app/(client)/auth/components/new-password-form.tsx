"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  NewPasswordInput,
  newPasswordSchema,
} from "@/schema/auth/reset-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthService } from "@/service/auth/auth-service";
import { Toaster } from "react-hot-toast";
import { Button } from "@/app/(client)/components/ui/button";
import { Spinner } from "@nextui-org/spinner";
import { PasswordInput } from "@/app/(client)/auth/components/password-input";
import { ErrorBox } from "@/app/(client)/components/ui/error-box";
import { SuccessBox } from "@/app/(client)/components/ui/success-box";
import { useState } from "react";

export function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<NewPasswordInput>({
    mode: "onBlur",
    resolver: zodResolver(newPasswordSchema),
  });

  const { isSubmitting, isValid } = form.formState;

  const [serverError, setServerError] = useState<string | null | undefined>(
    null,
  );
  const [serverSuccess, setServerSuccess] = useState<string | null | undefined>(
    null,
  );

  const handleSubmit = async (formData: NewPasswordInput) => {
    const res = await AuthService.instance.newPassword(formData, token);

    setServerError(res.error);
    setServerSuccess(res.success);
  };

  return (
    <div className={"flex items-center justify-center w-full"}>
      <form
        className={
          "mt-6 p-4 min-w-[300px] w-full max-w-[600px] flex flex-col gap-4"
        }
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <h2 className={"font-semibold text-2xl mx-auto"}>Новий пароль</h2>

        <PasswordInput form={form} />

        {serverError && (
          <ErrorBox message={serverError} className={"px-5 py-3"} />
        )}
        {serverSuccess && (
          <SuccessBox message={serverSuccess} className={"px-5 py-3"} />
        )}

        <Button
          htmlType={"submit"}
          disabled={isSubmitting || !isValid}
          type={"primary"}
        >
          <div className={"flex items-center justify-center gap-3"}>
            {isSubmitting && <Spinner size={"sm"} color={"primary"} />}
            Confirm
          </div>
        </Button>
      </form>

      <Toaster />
    </div>
  );
}
