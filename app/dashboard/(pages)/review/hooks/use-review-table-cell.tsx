import { Key, useCallback } from "react";
import { Review } from "@prisma/client";
import { SetStatusButton } from "@/app/dashboard/(pages)/review/modals/set-status";
import { ColorMessage } from "@/app/dashboard/components/colored-message";

export function useReviewTableCell() {
  return useCallback((review: Review, columnKey: Key) => {
    switch (columnKey) {
      case "id":
        return review.id;
      case "content":
        return review.content;
      case "rating":
        return review.rating;
      case "status":
        return (
          <ColorMessage
            text={review.status}
            color={review.status === "APPROVED" ? "green" : "yellow"}
            classNames={{
              wrapper: "p-3 rounded-medium",
              inner: "font-semibold",
            }}
          />
        );
      case "actions":
        if (columnKey === "actions") {
          return <SetStatusButton {...review} />;
        }

        return review[columnKey];
    }
  }, []);
}
