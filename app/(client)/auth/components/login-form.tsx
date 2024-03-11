"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster } from "react-hot-toast";
import { LoginInput, loginSchema } from "@/schema/auth/login-schema";
import { AuthService } from "@/service/auth/auth-service";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Button } from "@/app/(client)/components/ui/button";
import { Spinner } from "@nextui-org/spinner";
import { GoogleLogin } from "@/app/(client)/auth/components/google-login";
import { useState } from "react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { PasswordInput } from "@/app/(client)/auth/components/password-input";
import { ErrorBox } from "@/app/(client)/components/ui/error-box";
import { SuccessBox } from "@/app/(client)/components/ui/success-box";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const router = useRouter();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const form = useForm<LoginInput>({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
  });

  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const [serverError, setServerError] = useState<string | null | undefined>(
    null,
  );
  const [serverSuccess, setServerSuccess] = useState<string | null | undefined>(
    null,
  );

  const handleSubmit = async (formData: LoginInput) => {
    const res = await AuthService.instance.login(formData);

    if (!res) {
      setServerError("Щось пішло не так!");
      return;
    }

    setServerError(res.error);
    setServerSuccess(res.success);

    if (res.twoFactor) {
      setShowTwoFactor(true);
    }
    if (res.redirect) {
      router.push(callbackUrl || DEFAULT_LOGIN_REDIRECT);
    }
  };

  return (
    <div className={"flex items-center justify-center w-full p-4 sm:p-8"}>
      <form
        className={
          "mt-6 p-4 min-w-[300px] w-full max-w-[600px] flex flex-col gap-4"
        }
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <h2 className={"font-semibold text-2xl mx-auto"}>Login</h2>

        {showTwoFactor && (
          <Input
            {...form.register("code")}
            variant={"underlined"}
            label={"Code"}
            disabled={isSubmitting}
            isInvalid={!!errors.code}
            errorMessage={errors.code?.message}
          />
        )}

        {!showTwoFactor && (
          <>
            <Input
              {...form.register("email")}
              variant={"underlined"}
              type={"email"}
              label={"Електронна пошта"}
              disabled={isSubmitting}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />

            <PasswordInput form={form} />

            <Link
              href={"/auth/reset-password"}
              underline={"hover"}
              className={"text-foreground/80 ml-auto"}
            >
              забули пароль?
            </Link>
          </>
        )}

        {urlError && <ErrorBox message={urlError} />}
        {serverError && <ErrorBox message={serverError} />}
        {serverSuccess && <SuccessBox message={serverSuccess} />}

        <Button
          htmlType={"submit"}
          disabled={isSubmitting || !isValid}
          type={"primary"}
          className="capitalize"
        >
          <div className={"flex items-center justify-center gap-3"}>
            {isSubmitting && <Spinner size={"sm"} color={"primary"} />}
            Увiйти
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
