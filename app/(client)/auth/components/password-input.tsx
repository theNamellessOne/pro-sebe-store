"use client";

import { Input } from "@nextui-org/input";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = {
  form: UseFormReturn<any>;
};

export function PasswordInput({ form }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { errors } = form.formState;

  return (
    <Input
      {...form.register("password")}
      variant={"underlined"}
      type={showPassword ? "text" : "password"}
      label={"Пароль"}
      disabled={form.formState.isSubmitting}
      isInvalid={!!errors.password}
      //@ts-ignore
      errorMessage={errors.password?.message}
      endContent={
        showPassword ? (
          <Button
            isIconOnly
            variant={"light"}
            radius={"full"}
            onClick={() => setShowPassword(false)}
          >
            <EyeOff />
          </Button>
        ) : (
          <Button
            isIconOnly
            variant={"light"}
            radius={"full"}
            onClick={() => setShowPassword(true)}
          >
            <Eye />
          </Button>
        )
      }
    />
  );
}
