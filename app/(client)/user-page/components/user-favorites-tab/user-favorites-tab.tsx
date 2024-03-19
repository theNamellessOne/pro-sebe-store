"use client";

import { FavoriteService } from "@/service/favorite/favorite-service";
import { FavoriteProduct } from "./favorite-product";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Skeleton } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";

export function UserFavoritesTab() {
  const query = useQuery({
    queryKey: ["favorites", useSession().data?.user.id],
    queryFn: () => FavoriteService.instance.getAllFull(),
  });

  return (
    <div className={"gap-4 flex flex-col flex-wrap md:flex-row mt-[15px]"}>
      <AnimatePresence>
        {query.isLoading ? (
          <FavoritesSkeleton />
        ) : (
          <>
            {query.data?.value?.length === 0 && <p>ТУТ ПОКИ ЩО ПУСТО</p>}
            {query.data?.value?.map((item) => FavoriteProduct(item))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const FavoritesSkeleton = () =>
  [1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={
          "w-[373px] max-w-full shrink-0 flex flex-col gap-2 h-[500px]"
        }
        key={"product_loader" + item}
      >
        <Skeleton className="rounded-sm mb-4 h-[420px]"></Skeleton>
        <Skeleton className="rounded-sm">
          <p>{"sample text"}</p>
        </Skeleton>
        <Skeleton className="rounded-sm">
          <p>{"sample text"}</p>
        </Skeleton>
      </motion.div>
    );
  });
