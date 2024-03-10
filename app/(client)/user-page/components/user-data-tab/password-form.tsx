"use client";

import { useForm } from "react-hook-form";
import React from "react";
import {
  UserChangePassword,
  userChangePassword,
} from "@/schema/user/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserUpdateService } from "@/service/user-update/user-update-service";
import toast, { Toaster } from "react-hot-toast";
import { Input } from "@nextui-org/input";
import { Button } from "@/app/(client)/components/ui/button";
import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";

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

  if (useSession().data?.user.isOAuth) {
    return null;
  }

  return (
    <form
      id={"password-reset-form"}
      className={"my-4 p-4 flex flex-col gap-4 "}
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div className={"flex flex-col"}>
        <Input
          {...form.register("password")}
          label={"Новий пароль"}
          variant={"underlined"}
          disabled={isSubmitting}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
        />
        <Input
          {...form.register("confirmPassword")}
          label={"Підтвердіть пароль"}
          variant={"underlined"}
          disabled={isSubmitting}
          isInvalid={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
        />
      </div>

      <Button
        className={"font-semibold"}
        type={"primary"}
        disabled={isSubmitting || !isValid}
      >
        {isSubmitting && <Spinner size={"sm"} color={"primary"} />}
        Змінити пароль
      </Button>
      <Toaster />
    </form>
  );
}
