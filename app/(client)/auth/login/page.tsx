import { LoginForm } from "@/app/(client)/auth/components/login-form";
import { Button } from "../../components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 h-screen">
      <LoginForm />

      <div className="h-full p-4 sm:p-8 lg:w-2/5 lg:shrink-0 flex flex-col gap-8 justify-center items-center bg-secondary">
        <h2 className="text-lg xl:text-xl capitalize">це ваш перший візит?</h2>

        <Link href="/auth/register">
          <Button type="secondary" className="text-lg xl:text-xl capitalize">
            створити обліковий запис
          </Button>
        </Link>
      </div>
    </div>
  );
}
