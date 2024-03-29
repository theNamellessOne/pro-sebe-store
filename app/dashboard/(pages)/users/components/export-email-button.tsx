"use client";

import { Button } from "@nextui-org/react";
import { Download } from "lucide-react";

export function ExportEmailButton(props: { href: string }) {
  return (
    <a target={"_blank"} {...props} className="block">
      <Button
        className={"font-semibold mt-2"}
        variant={"shadow"}
        color={"primary"}
        isIconOnly={true}
        startContent={<Download />}
      ></Button>
    </a>
  );
}
