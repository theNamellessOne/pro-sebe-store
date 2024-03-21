"use client";

import { useForm } from "react-hook-form";
import { RegisterInput, registerSchema } from "@/schema/auth/register-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthService } from "@/service/auth/auth-service";
import { Toaster } from "react-hot-toast";
import { Input } from "@nextui-org/input";
import { Button } from "@/app/(client)/components/ui/button";
import { Spinner } from "@nextui-org/spinner";
import { GoogleLogin } from "@/app/(client)/auth/components/google-login";
import { PasswordInput } from "@/app/(client)/auth/components/password-input";
import { ErrorBox } from "@/app/(client)/components/ui/error-box";
import { SuccessBox } from "@/app/(client)/components/ui/success-box";
import { useState } from "react";

export function RegisterForm() {
  const form = useForm<RegisterInput>({
    mode: "onBlur",
    resolver: zodResolver(registerSchema),
  });

  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const [serverError, setServerError] = useState<string | null | undefined>(
    null,
  );
  const [serverSuccess, setServerSuccess] = useState<string | null | undefined>(
    null,
  );

  const handleSubmit = async (formData: RegisterInput) => {
    const res = await AuthService.instance.register(formData);

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
        <h2 className={"font-semibold text-2xl mx-auto"}>Register</h2>

        <Input
          {...form.register("name")}
          variant={"underlined"}
          label={"Iм'я"}
          disabled={isSubmitting}
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
        />

        <Input
          {...form.register("username")}
          variant={"underlined"}
          label={"Username"}
          disabled={isSubmitting}
          isInvalid={!!errors.username}
          errorMessage={errors.username?.message}
        />

        <Input
          {...form.register("email")}
          variant={"underlined"}
          label={"Електронна пошта"}
          disabled={isSubmitting}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
        />

        <Input
          {...form.register("phone")}
          variant={"underlined"}
          label={"Номер телефону"}
          disabled={isSubmitting}
          isInvalid={!!errors.phone}
          errorMessage={errors.phone?.message}
        />

        <PasswordInput form={form} />

        {serverError && <ErrorBox message={serverError} />}
        {serverSuccess && <SuccessBox message={serverSuccess} />}

        <Button
          htmlType={"submit"}
          disabled={isSubmitting || !isValid}
          type={"primary"}
        >
          <div className={"flex items-center justify-center gap-3"}>
            {isSubmitting && <Spinner size={"sm"} color={"primary"} />}
            Зареєструватись
          </div>
        </Button>

        <div className={"flex items-center gap-2 w-full mx-auto"}>
          <span className={"h-0.5 w-full bg-secondary"}></span>
          <p>або</p>
          <span className={"h-0.5 w-full bg-secondary"}></span>
        </div>

        <GoogleLogin disabled={isSubmitting} />
      </form>

      <Toaster />
    </div>
  );
}
