import { LoginForm } from "@/app/(client)/auth/components/login-form";
import { Button } from "../../components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="grid gap-8 lg:gap-0 grid-cols-1 lg:grid-cols-2 h-screen">
      <LoginForm />

      <div className="h-full p-8 grow flex flex-col gap-8 justify-center items-center bg-secondary">
        <h2 className="text-lg xl:text-xl capitalize">це ваш перший візит?</h2>

        <Link href="/auth/register">
          <Button
            type="secondary"
            className="text-lg xl:text-xl capitalize"
          >
            створити обліковий запис
          </Button>
        </Link>
      </div>
    </div>
  );
}
