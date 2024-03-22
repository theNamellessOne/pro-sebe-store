import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@nextui-org/button";

export type TableAction = {
  name: string;
  action: () => Promise<void> | void;
};

type TableActionsProps = {
  hasSelected: boolean;
  hasPaginator: boolean;
  actions: TableAction[];
};

export function TableActions({
  hasSelected,
  hasPaginator,
  actions,
}: TableActionsProps) {
  return (
    <AnimatePresence>
      {hasSelected && (
        <motion.div
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex flex-col sm:flex-row gap-3 bg-white absolute ${
            hasPaginator ? "bottom-14" : "bottom-2"
          } right-1/2 translate-x-1/2 w-fit shadow-small rounded-xl p-2`}
        >
          {actions.map((item, idx) => {
            return (
              <Button
                key={item.name + idx}
                variant={"flat"}
                size={"sm"}
                className={"text-sm"}
                onClick={item.action}
              >
                {item.name}
              </Button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
