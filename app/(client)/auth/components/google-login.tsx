"use client";

import { Button } from "@/app/(client)/components/ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export function GoogleLogin({ disabled = false }: { disabled?: boolean }) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <Button
      disabled={disabled}
      type={"secondary"}
      onClick={() => {
        signIn("google", {
          callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        });
      }}

      className="capitalize"
    >
      <div className={"flex items-center justify-center gap-3"}>
        <FcGoogle className="h-6 w-6" />
        Увiйти за допомогою Google
      </div>
    </Button>
  );
}
