import { Key, useCallback } from "react";
import { Review } from "@prisma/client";
import { SetStatusButton } from "@/app/dashboard/(pages)/review/modals/set-status";

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
        return review.status;
      case "actions":
        if (columnKey === "actions") {
          return <SetStatusButton {...review} />;
        }

        return review[columnKey];
    }
  }, []);
}
