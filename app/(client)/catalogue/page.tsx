import { ProductList } from "@/app/(client)/catalogue/components/products/product-list";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { ProductService } from "@/service/product/product-service";
import { ColorService } from "@/service/colors/color-service";
import { SizeService } from "@/service/size/size-service";
import { Filters } from "./components/filters/filters";
import { CategoryBreadcrumbs } from "./components/categories/category-breadcrumbs";
import { CategorySwiper } from "./components/categories/category-swiper";
import { CategoryService } from "@/service/category/category-service";
import { getQueryClient } from "../query-client";
import { FavoriteService } from "@/service/favorite/favorite-service";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    sortDescriptor?: string;
    colorFilter?: string;
    categoryFilter?: string;
    sizeFilter?: string;
    priceFilter?: string;
    onlyDiscounts?: boolean;
  };
}) {
  const queryClient = getQueryClient();

  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDescriptor = searchParams?.sortDescriptor
    ? JSON.parse(searchParams?.sortDescriptor)
    : null;
  const colorsFilter = searchParams?.colorFilter
    ? JSON.parse(searchParams?.colorFilter)
    : null;
  const categoryFilter = searchParams?.categoryFilter
    ? JSON.parse(searchParams?.categoryFilter)
    : null;
  const sizeFilter = searchParams?.sizeFilter
    ? JSON.parse(searchParams?.sizeFilter)
    : null;
  const priceFilter = searchParams?.priceFilter
    ? JSON.parse(searchParams?.priceFilter)
    : null;
  const discountFilter = searchParams?.onlyDiscounts?.valueOf();

  const props = {
    query: query,
    page: currentPage,
    sizes: sizeFilter ?? [],
    colors: colorsFilter ?? [],
    price: priceFilter ?? { min: -1, max: -1 },
    categories: categoryFilter ?? [],
    sortColumn: sortDescriptor?.value.column ?? "article",
    sortDirection: sortDescriptor?.value.direction ?? "ascending",
    isDiscounted: !!discountFilter,
  };

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["colors"],
      queryFn: () => ColorService.instance.fetchAll(),
    }),

    queryClient.prefetchQuery({
      queryKey: ["price-extremes"],
      queryFn: () => ProductService.instance.fetchPriceExtremes(),
    }),

    queryClient.prefetchQuery({
      queryKey: ["sizes"],
      queryFn: () => SizeService.instance.fetchAll(),
    }),

    queryClient.prefetchQuery({
      queryKey: ["favorites"],
      queryFn: () => FavoriteService.instance.getAll(),
    }),

    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: () => CategoryService.instance.fetchTree(),
    }),

    queryClient.prefetchQuery({
      queryKey: [
        "catalogue",
        props.sortDirection,
        props.sortColumn,
        props.isDiscounted,
        props.price.min,
        props.price.max,
        props.page,
        props.query,
        ...props.categories,
        ...props.sizes,
        ...props.colors,
      ],
      queryFn: () => ProductService.instance.fetchAndFilter(props),
    }),
  ]);

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CategoryBreadcrumbs
          currentCategoryId={props.categories ? props.categories[0] : 0}
        />

        <CategorySwiper
          currentCategoryId={props.categories ? props.categories[0] : 0}
        />

        <Filters />
        <ProductList
          query={props.query}
          page={props.page}
          sortColumn={props.sortColumn}
          sortDirection={props.sortDirection}
          colors={props.colors}
          sizes={props.sizes}
          price={props.price}
          categories={props.categories}
          isDiscounted={props.isDiscounted}
        />
      </HydrationBoundary>
    </>
  );
}
