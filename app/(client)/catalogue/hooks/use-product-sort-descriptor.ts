import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SortDescriptor } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { filterEventChannel } from "../components/filters/events/filter-event-channgel";

export type NamedSortDescriptor = SortDescriptor & { name: string };

export function useProductSortDescriptor() {
  const options = [
    {
      name: "За популярністтю",
      value: {
        column: "article",
        direction: "ascending",
      },
    },
    {
      name: "Зa замовчуванням",
      value: {
        column: "article",
        direction: "ascending",
      },
    },
    {
      name: "Від дешевих до дорогих",
      value: {
        column: "price",
        direction: "ascending",
      },
    },
    {
      name: "Від дорогих до дешевих",
      value: {
        column: "price",
        direction: "descending",
      },
    },
  ];

  const [selected, setSelected] = useState(new Set(["Зa замовчуванням"]));

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const setValue = (sortDescriptor: NamedSortDescriptor) => {
    const params = new URLSearchParams(searchParams);
    if (sortDescriptor) {
      params.set("sortDescriptor", JSON.stringify(sortDescriptor));
    } else {
      params.delete("sortDescriptor");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const readValue = () => {
    const sortDescriptor = searchParams.get("sortDescriptor");
    if (!sortDescriptor) {
      return {
        name: "Зa замовчуванням",
        column: "article",
        direction: "ascending",
      } as NamedSortDescriptor;
    }

    return JSON.parse(sortDescriptor) as NamedSortDescriptor;
  };

  const load = () => {
    const descriptor = readValue();

    if (descriptor) {
      setSelected(new Set([descriptor.name]));
    } else {
      setSelected(new Set(["Зa замовчуванням"]));
    }
  };

  useEffect(() => {
    load();

    const searchUnsub = filterEventChannel.on("onSearchChange", load);

    return searchUnsub();
  }, []);

  const setSortDescriptor = (key: string) => {
    setSelected(new Set([key]));
    setValue(options.filter((item) => item.name === key)[0]);
  };

  return { options, selected, setSelected: setSortDescriptor };
}
