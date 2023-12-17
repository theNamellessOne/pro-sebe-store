import { Pagination } from "@nextui-org/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function usePaginator(total: number, page: number) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handlePagination(page: number) {
    const params = new URLSearchParams(searchParams);
    if (page) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return total > 1 ? (
    <div className="flex w-full justify-center">
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={total}
        onChange={handlePagination}
      />
    </div>
  ) : null;
}
