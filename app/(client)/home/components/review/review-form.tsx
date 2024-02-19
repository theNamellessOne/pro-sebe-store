"use client";

import { ReviewSave, reviewSchema } from "@/schema/review/review-schema";
import { ReviewService } from "@/service/review/review-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Textarea, useDisclosure } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { SendHorizonal } from "lucide-react";
import { PiUserCircleLight } from "react-icons/pi";
import { GoStar, GoStarFill } from "react-icons/go";
import { UnauthorizedModal } from "../modal/unauthorized-modal";
import { SetUsernameModal } from "../modal/set-username-modal";

export function ReviewForm() {
  const session = useSession();
  const form = useForm<ReviewSave>({
    mode: "onBlur",
    resolver: zodResolver(reviewSchema),
  });

  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const {
    isOpen: isUnauthOpen,
    onOpen: onUnauthOpen,
    onOpenChange: onUanuthOpenChange,
  } = useDisclosure();
  const {
    isOpen: isSetnameOpen,
    onOpen: onSetnameOpen,
    onOpenChange: onSetnameOpenChange,
  } = useDisclosure();

  const handleSubmit = async (formData: ReviewSave) => {
    formData.id = undefined;

    if (!session.data?.user) return toast.error("не авторизовано");
    if (!session.data?.user.username) return toast.error("без юзернейма");

    const { errMsg } = await ReviewService.instance.save(formData);

    if (errMsg) {
      toast.error(errMsg);
    } else {
      toast.success("Ваш відгук відправлено на модерацію");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className={"flex flex-row gap-2"}>
        <PiUserCircleLight className={"w-8 h-8 md:w-10 md:h-10"} />

        <div
          className={
            "flex flex-col w-full bg-secondary p-4 rounded-tl-none rounded-md mt-4"
          }
        >
          <h4
            className={
              "text-lg font-semibold flex flex-wrap items-center justify-between pb-3"
            }
          >
            @{session.data?.user.username ? session.data.user.username : "user"}
            <div className={"flex flex-row"}>
              {[1, 2, 3, 4, 5].map((item) => {
                return (
                  <button
                    type={"button"}
                    disabled={isSubmitting}
                    className={"cursor-pointer"}
                    onMouseOver={() => {
                      if (!isSubmitting) form.setValue("rating", item);
                    }}
                    onClick={() => {
                      if (!isSubmitting) form.setValue("rating", item);
                    }}
                  >
                    {form.watch("rating") >= item ? (
                      <GoStarFill className={"w-5 h-5"} />
                    ) : (
                      <GoStar className={"w-5 h-5"} />
                    )}
                  </button>
                );
              })}
            </div>
          </h4>

          <div className={"flex gap-2 items-end"}>
            <Textarea
              {...form.register("content")}
              placeholder={"тут може бути ваш відгук"}
              minRows={1}
              maxRows={3}
              radius={"none"}
              variant={"underlined"}
              classNames={{
                base: "rounded-tl-none rounded-sm",
              }}
              isDisabled={isSubmitting}
              isInvalid={!!errors.content}
              defaultValue={form.getValues().content}
              errorMessage={errors.content?.message}
            />

            <Button
              onPress={() => {
                if (!session.data?.user) return onUnauthOpen();
                if (!session.data?.user.username) return onSetnameOpen();
              }}
              type={"submit"}
              color={"primary"}
              variant={"light"}
              className={"rounded-sm text-primary"}
              isDisabled={isSubmitting || !isValid}
              isLoading={isSubmitting}
              isIconOnly
            >
              <SendHorizonal className={"w-6 h-6"} />
            </Button>
          </div>
        </div>
      </div>

      <UnauthorizedModal
        isOpen={isUnauthOpen}
        onOpenChange={onUanuthOpenChange}
      />
      <SetUsernameModal
        isOpen={isSetnameOpen}
        onOpenChange={onSetnameOpenChange}
      />

      <Toaster />
    </form>
  );
}
