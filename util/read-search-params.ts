export type SearchParams = {
  query?: string;
  page?: string;
  sortDescriptor?: string;
};

export function readSearchParams(searchParams: SearchParams | undefined) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDescriptor = searchParams?.sortDescriptor
    ? JSON.parse(searchParams?.sortDescriptor)
    : {
        column: "id",
        direction: "ascending",
      };

  return { query, currentPage, sortDescriptor };
}
