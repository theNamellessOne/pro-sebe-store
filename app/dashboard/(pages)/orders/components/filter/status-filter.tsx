"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { OrderStatus } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TranslatedStatuses } from "../../const/transl";

export function StatusFilter() {
  const statuses: string[] = [];
  statuses.push("ALL");
  statuses.push(...Object.keys(OrderStatus));

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const setFilter = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set("status", JSON.stringify(status));
    } else {
      params.delete("status");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const readFilter = () => {
    const param = searchParams.get("status");
    if (!param) {
      return "ALL";
    }

    return JSON.parse(param);
  };

  return (
    <Select
      defaultSelectedKeys={[readFilter()]}
      label="Показувати"
      className="max-w-xs"
      onSelectionChange={(selection) =>
        setFilter(Array.from(selection)[0].toString())
      }
    >
      {statuses.map((item) => (
        <SelectItem key={item} value={item}>
          {item === "ALL" ? "Усі" : TranslatedStatuses[item as OrderStatus]}
        </SelectItem>
      ))}
    </Select>
  );
}
