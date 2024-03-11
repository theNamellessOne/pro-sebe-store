"use client";

import { ErrorBox } from "@/app/(client)/components/ui/error-box";
import { SuccessBox } from "@/app/(client)/components/ui/success-box";
import { AuthService } from "@/service/auth/auth-service";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Page() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Відсутній токен!");
      return;
    }

    AuthService.instance
      .verify(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Щось пішло не так!");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className={"max-w-[400px] rounded-small overflow-hidden"}>
      {error && <ErrorBox message={error} />}
      {success && <SuccessBox message={success} />}
    </div>
  );
}
