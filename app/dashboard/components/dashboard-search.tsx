"use client";

import { Input } from "@nextui-org/input";

import { debounce } from "@/util/debounce";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type DashboardSearchProps = {};

export function DashboardSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams();
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Input
      label={"Шукати..."}
      defaultValue={searchParams.get("query")?.toString()}
      onChange={debounce((e: any) => handleSearch(e.target.value))}
    />
  );
}
