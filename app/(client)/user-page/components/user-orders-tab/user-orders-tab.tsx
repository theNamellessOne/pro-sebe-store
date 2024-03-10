import { OrderService } from "@/service/order/order-service";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { UserOrder } from "./user-order";
import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "@nextui-org/react";

export function UserOrdersTab() {
  const session = useSession();
  const query = useQuery({
    queryKey: ["orders", session.data?.user.id],
    queryFn: () => OrderService.instance.fetchUserOrders(),
  });

  return (
    <div className={"gap-4 flex flex-col flex-wrap md:flex-row mt-[15px]"}>
      <AnimatePresence>
        {query.isLoading ? (
          <OrdersSkeleton />
        ) : (
          <>
            {query.data?.value?.length === 0 && <p>ТУТ ПОКИ ЩО ПУСТО</p>}
            {query.data?.value?.map((item) => UserOrder(item))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const OrdersSkeleton = () =>
  [1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={"min-w-[200px] shrink-0 flex flex-col gap-2 h-[300px]"}
        key={"product_loader" + item}
      >
        <Skeleton className="rounded-sm w-full h-full"></Skeleton>
      </motion.div>
    );
  });
