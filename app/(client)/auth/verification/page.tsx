"use client";

import { ErrorBox } from "@/app/(client)/components/ui/error-box";
import { SuccessBox } from "@/app/(client)/components/ui/success-box";
import { AuthService } from "@/service/auth/auth-service";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

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
    <div
      className={"container grow py-4 mx-auto flex items-center justify-center"}
    >
      <div className={"max-w-[400px] overflow-hidden"}>
        {error && <ErrorBox message={error} className={"px-6 py-4"} />}
        {success && (
          <SuccessBox
            message={
              <>
                <p>
                  <span>{success}</span>
                  <span>
                    {" "}
                    <Link
                      href={"/auth/login"}
                      className={
                        "underline underline-offset-4 hover:opacity-80"
                      }
                    >
                      Увiйти
                    </Link>
                  </span>
                </p>
              </>
            }
            className={"px-6 py-4"}
          />
        )}
      </div>
    </div>
  );
}
