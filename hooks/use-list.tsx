import { Key, useState } from "react";
import { useSortDescriptor } from "@/hooks/use-sort-descriptor";
import { usePaginator } from "@/hooks/use-paginator";
import { useAsyncList } from "@react-stately/data";
import { SortDirection } from "@react-types/shared";
import { SortDescriptor } from "@nextui-org/react";

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

  const sort = (sortDescriptor: SortDescriptor) => {
    setLoading(true);
    handleSort(sortDescriptor);
  };

  return {
    loading,
    setLoading,
    list: useAsyncList({
      async load({ sortDescriptor }) {
        return fetch();
      },
    }),
    sort,
    paginator,
  };
}
