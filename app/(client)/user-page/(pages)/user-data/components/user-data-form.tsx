"use client";

import { UserService } from "@/service/user/user-service";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {UserUpdate, userUpdateFormSchema} from "@/schema/user/user-schema";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import toast, {Toaster} from "react-hot-toast";
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import {UserUpdateService} from "@/service/user-update/user-update-service";

export function UserDataForm() {
    const session = useSession();
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const id = session.data?.user.id;
        if (!id) return;
        UserService.instance.fetchById(id).then((res) => {
            if (res.errMsg) return;

            setUserData(res.value);
        });
    }, [session]);

    const form = useForm<UserUpdate>({
        mode: "onBlur",
        resolver: zodResolver(userUpdateFormSchema),
    });

    const { errors } = form.formState;
    const { isSubmitting, isValid } = form.formState;

    const handleSubmit = async (data: UserUpdate) => {
        const  {errMsg}  = await UserUpdateService.instance.updateCurrentUser(data);

        if (errMsg) {
            toast.error("Щось пішло не так!");
        }else {
            toast.success("Зміни збережено!");
        }
    }

    return (
        <FormProvider {...form}>
            <form
                className={
                "max-w-[600px] mt-[15px] p-4 shadow-small rounded-large"
                }
                onSubmit={form.handleSubmit(data => handleSubmit(data))}
            >
                {userData &&
                    <div>
                        <div className={"flex flex-col lg:flex-row gap-4"}>
                            <Input
                                {...form.register("name")}
                                label={"Ім'я"}
                                disabled={isSubmitting}
                                defaultValue={userData.name}
                                isInvalid={!!errors.name}
                                errorMessage={errors.name?.message}
                            />
                            <Input
                                {...form.register("name")}
                                label={"Прізвище"}
                                disabled={isSubmitting}
                                defaultValue={userData.name}
                                isInvalid={!!errors.name}
                                errorMessage={errors.name?.message}
                            />
                        </div>
                        <div className={"flex flex-col lg:flex-row gap-4 py-4"}>
                            <Input
                                {...form.register("username")}
                                label={"Юзернейм"}
                                disabled={isSubmitting}
                                defaultValue={userData.username}
                                isInvalid={!!errors.username}
                                errorMessage={errors.username?.message}
                            />
                            <Input
                                {...form.register("phone")}
                                label={"Телефон"}
                                disabled={isSubmitting}
                                defaultValue={userData.phone}
                                isInvalid={!!errors.phone}
                                errorMessage={errors.phone?.message}
                            />
                        </div>
                        <div className={"pb-4"}>
                            <Input
                                {...form.register("email")}
                                label={"Електронна адреса"}
                                disabled={isSubmitting}
                                defaultValue={userData.email}
                                isInvalid={!!errors.email}
                                errorMessage={errors.email?.message}
                            />
                        </div>
                    </div>
                }
                <Button
                    className={"font-semibold"}
                    color={"primary"}
                    type={"submit"}
                    isDisabled={isSubmitting || !isValid}
                    isLoading={isSubmitting}
                >
                    Зберегти
                </Button>
                <Toaster/>
            </form>
        </FormProvider>
    );
}
