"use client";

import { Button } from "../../components/ui/button";

export function EmptyCart() {
  return (
    <div
      className={
        "flex flex-col gap-4 container mx-auto items-center justify-center"
      }
    >
      <h2 className={"text-xl lg:text-2xl capitalize"}>ваш кошик пустий</h2>


      <Button type="primary" className="uppercase">
        Продовжити купування
      </Button>
    </div>
  );
}
