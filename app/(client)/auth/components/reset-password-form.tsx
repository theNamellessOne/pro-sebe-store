"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordInput,
  resetPasswordSchema,
} from "@/schema/auth/reset-password-schema";
import { Toaster } from "react-hot-toast";
import { Button } from "@/app/(client)/components/ui/button";
import { Spinner } from "@nextui-org/spinner";
import { Input } from "@nextui-org/input";
import { AuthService } from "@/service/auth/auth-service";
import { useState } from "react";
import { ErrorBox } from "@/app/(client)/components/ui/error-box";
import { SuccessBox } from "@/app/(client)/components/ui/success-box";

export function ResetPasswordForm() {
  const form = useForm<ResetPasswordInput>({
    mode: "onBlur",
    resolver: zodResolver(resetPasswordSchema),
  });

  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const [serverError, setServerError] = useState<string | null | undefined>(
    null,
  );
  const [serverSuccess, setServerSuccess] = useState<string | null | undefined>(
    null,
  );

  const handleSubmit = async (formData: ResetPasswordInput) => {
    const res = await AuthService.instance.resetPassword(formData);

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
        <h2 className={"font-semibold text-2xl mx-auto"}>Reset</h2>

        <Input
          {...form.register("email")}
          variant={"underlined"}
          type={"email"}
          label={"Електронна пошта"}
          disabled={isSubmitting}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
        />

        {serverError && <ErrorBox message={serverError} />}
        {serverSuccess && <SuccessBox message={serverSuccess} />}

        <Button
          htmlType={"submit"}
          disabled={isSubmitting || !isValid}
          type={"primary"}
        >
          <div className={"flex items-center justify-center gap-3"}>
            {isSubmitting && <Spinner size={"sm"} color={"primary"} />}
            Reset
          </div>
        </Button>
      </form>

      <Toaster />
    </div>
  );
}
