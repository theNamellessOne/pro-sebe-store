import { Key, useCallback } from "react";
import { User } from "@prisma/client";
import { SetRoleModal } from "@/app/dashboard/(pages)/users/modals/set-role-modal";

export function useUserTableCell() {
  return useCallback((user: User, columnKey: Key) => {
    if (columnKey === "actions") {
      return <SetRoleModal {...user} />;
    }

    //@ts-ignore
    return user[columnKey];
  }, []);
}
