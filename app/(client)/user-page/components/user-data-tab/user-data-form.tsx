"use client";

import { useSession } from "next-auth/react";
import { UserUpdate, userUpdateFormSchema } from "@/schema/user/user-schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { Input } from "@nextui-org/input";
import { Button } from "@/app/(client)/components/ui/button";
import { UserUpdateService } from "@/service/user-update/user-update-service";
import { Spinner } from "@nextui-org/react";
import { useEffect } from "react";

export function UserDataForm() {
  const session = useSession();
  const userData = session.data?.user;

  const form = useForm<UserUpdate>({
    mode: "onBlur",
    resolver: zodResolver(userUpdateFormSchema),
  });

  useEffect(() => {
    if (session.data?.user.isOAuth) {
      //@ts-ignore
      form.setValue("email", userData?.email);
    }
  }, [form]);

  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = async (data: UserUpdate) => {
    const { errMsg, value } =
      await UserUpdateService.instance.updateCurrentUser(data);

    if (errMsg) {
      toast.error("Щось пішло не так!");
    } else {
      console.log(value);
      session.update(value);
      toast.success("Зміни збережено!");
    }
  };

  return (
    <FormProvider {...form}>
      <form className={"mt-[15px]"}>
        {userData && (
          <div>
            <div className={"pb-4"}>
              {session.data?.user.isOAuth ? (
                <Input
                  {...form.register("email")}
                  label={"Електронна адреса"}
                  radius="none"
                  disabled={true}
                  //@ts-ignore
                  defaultValue={userData.email}
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message}
                />
              ) : (
                <Input
                  {...form.register("email")}
                  label={"Електронна адреса"}
                  variant={"underlined"}
                  disabled={isSubmitting}
                  //@ts-ignore
                  defaultValue={userData.email}
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message}
                />
              )}
            </div>

            <div className={"flex flex-col lg:flex-row gap-4"}>
              <Input
                {...form.register("name")}
                label={"Ім'я"}
                variant={"underlined"}
                disabled={isSubmitting}
                //@ts-ignore
                defaultValue={userData.name}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
              />
              <Input
                {...form.register("surname")}
                label={"Прізвище"}
                variant={"underlined"}
                disabled={isSubmitting}
                defaultValue={userData.surname}
                isInvalid={!!errors.surname}
                errorMessage={errors.surname?.message}
              />
            </div>

            <Input
              {...form.register("patronymic")}
              label={"По батькові"}
              variant={"underlined"}
              disabled={isSubmitting}
              defaultValue={userData.patronymic}
              isInvalid={!!errors.patronymic}
              errorMessage={errors.patronymic?.message}
            />

            <div className={"flex flex-col lg:flex-row gap-4 py-4"}>
              <Input
                {...form.register("username")}
                label={"Юзернейм"}
                variant={"underlined"}
                disabled={isSubmitting}
                defaultValue={userData.username}
                isInvalid={!!errors.username}
                errorMessage={errors.username?.message}
              />
              <Input
                {...form.register("phone")}
                label={"Телефон"}
                variant={"underlined"}
                disabled={isSubmitting}
                //@ts-ignore
                defaultValue={userData.phone}
                isInvalid={!!errors.phone}
                errorMessage={errors.phone?.message}
              />
            </div>
          </div>
        )}

        <Button
          className="font-semibold flex items-center justify-center gap-4"
          type={"primary"}
          onClick={form.handleSubmit((data) => {
            return handleSubmit(data);
          })}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting && <Spinner size={"sm"} color={"primary"} />}
          Зберегти
        </Button>

        <Toaster />
      </form>
    </FormProvider>
  );
}
