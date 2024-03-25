"use client";

import Link from "next/link";
import { Button } from "@/app/(client)/components/ui/button";
import { Header } from "@/app/(client)/components/header/header";
import Footer from "@/app/(client)/components/footer/footer";

export function EmptyCart() {
  return (
    <div className={"flex flex-col min-h-screen"}>
      <Header />
      <div
        className={
          "flex flex-col grow gap-4 container mx-auto items-center justify-center"
        }
      >
        <h2 className={"text-xl lg:text-2xl capitalize"}>ваш кошик пустий</h2>

        <Link href="/catalogue">
          <Button type="primary" className="uppercase">
            Продовжити покупки
          </Button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}
