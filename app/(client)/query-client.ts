import { QueryClient } from "@tanstack/react-query";

let queryClient: QueryClient | null = null;

export const getQueryClient = () => {
  if (queryClient === null) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 2 * 60 * 1000, // 2 minute
          refetchOnMount: false,
          refetchOnWindowFocus: false,
        },
      },
    });
  }

  return queryClient as QueryClient;
};
