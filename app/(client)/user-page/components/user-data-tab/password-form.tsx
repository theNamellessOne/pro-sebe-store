"use client";

import { useForm } from "react-hook-form";
import React, { useState } from "react";
import {
  UserChangePassword,
  userChangePassword,
} from "@/schema/user/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserUpdateService } from "@/service/user-update/user-update-service";
import toast, { Toaster } from "react-hot-toast";
import { Input } from "@nextui-org/input";
import { Button } from "@/app/(client)/components/ui/button";
import { Button as NextButton } from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordForm() {
  const form = useForm<UserChangePassword>({
    mode: "onBlur",
    resolver: zodResolver(userChangePassword),
  });

  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = async (password: UserChangePassword) => {
    const { errMsg } =
      await UserUpdateService.instance.changePassword(password);

    if (errMsg) {
      toast.error("Щось пішло не так!");
    } else {
      toast.success("Зміни збережено!");
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form id={"password-reset-form"} className={"my-4 flex flex-col gap-4 "}>
      <div className={"flex flex-col"}>
        <Input
          {...form.register("password")}
          variant={"underlined"}
          type={showPassword ? "text" : "password"}
          label={"Новий пароль"}
          disabled={form.formState.isSubmitting}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          endContent={
            showPassword ? (
              <NextButton
                isIconOnly
                variant={"light"}
                radius={"full"}
                onClick={() => setShowPassword(false)}
              >
                <EyeOff />
              </NextButton>
            ) : (
              <NextButton
                isIconOnly
                variant={"light"}
                radius={"full"}
                onClick={() => setShowPassword(true)}
              >
                <Eye />
              </NextButton>
            )
          }
        />

        <Input
          {...form.register("confirmPassword")}
          label={"Підтвердіть пароль"}
          variant={"underlined"}
          type={showConfirmPassword ? "text" : "password"}
          disabled={form.formState.isSubmitting}
          isInvalid={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
          endContent={
            showConfirmPassword ? (
              <NextButton
                isIconOnly
                variant={"light"}
                radius={"full"}
                onClick={() => setShowConfirmPassword(false)}
              >
                <EyeOff />
              </NextButton>
            ) : (
              <NextButton
                isIconOnly
                variant={"light"}
                radius={"full"}
                onClick={() => setShowConfirmPassword(true)}
              >
                <Eye />
              </NextButton>
            )
          }
        />
      </div>

      <Button
        className="font-semibold flex items-center justify-center gap-4"
        type={"primary"}
        onClick={form.handleSubmit((data) => {
          return handleSubmit(data);
        })}
        disabled={isSubmitting || !isValid}
      >
        {isSubmitting && <Spinner size={"sm"} color={"primary"} />}
        Змінити пароль
      </Button>

      <Toaster />
    </form>
  );
}
