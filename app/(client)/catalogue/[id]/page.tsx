import { ProductService } from "@/service/product/product-service";
import { Product } from "./components/product";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export default async function Page({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute,
      },
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["product", params.id],
    queryFn: () => ProductService.instance.fetchById(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Product article={params.id} />
    </HydrationBoundary>
  );
}
