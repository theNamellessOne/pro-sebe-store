import { Key, useState } from "react";
import { useSortDescriptor } from "@/hooks/use-sort-descriptor";
import { usePaginator } from "@/hooks/use-paginator";
import { useAsyncList } from "@react-stately/data";
import { SortDirection } from "@react-types/shared";

export type FetchFunctionProps = {
  query: string;
  page: number;
  sortColumn: Key;
  sortDirection: SortDirection;
};

export function useList(
  props: FetchFunctionProps,
  fetchFunction: (props: FetchFunctionProps) => Promise<any>,
) {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const handleSort = useSortDescriptor();
  const paginator = usePaginator(total, props.page);

  const fetch = async () => {
    setLoading(true);
    const { items, pages } = await fetchFunction(props);
    setTotal(pages);
    setLoading(false);
    return { items };
  };

  return [
    loading,
    useAsyncList({
      async load() {
        return fetch();
      },
      async sort({ sortDescriptor }) {
        handleSort(sortDescriptor);
        return fetch();
      },
    }),
    paginator,
  ] as const;
}
