"use client";

import { Button } from "@nextui-org/react";
import { Download } from "lucide-react";

export function ExportEmailButton() {
  return (
    <a target={"_blank"} href={"/api/users/export"} className="block">
      <Button
        className={"font-semibold"}
        variant={"shadow"}
        color={"primary"}
        startContent={<Download />}
      >
        Експортувати Пошти
      </Button>
    </a>
  );
}
