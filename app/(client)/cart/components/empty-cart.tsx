"use client";

import { Button } from "@nextui-org/react";

export function EmptyCart() {
  return (
    <div
      className={
        "flex flex-col gap-4 container mx-auto items-center justify-center"
      }
    >
      <h2 className={"text-xl lg:text-2xl capitalize"}>ваш кошик пустий</h2>
      <Button
        color="primary"
        size="lg"
        className={"rounded-sm uppercase text-xl lg:text-2xl py-4"}
      >
        Продовжити купування
      </Button>
    </div>
  );
}
