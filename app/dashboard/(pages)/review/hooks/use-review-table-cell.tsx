import {Key, useCallback} from "react";
import {Review} from "@prisma/client";

export function useReviewTableCell() {
    return useCallback(
        (review: Review, columnKey: Key) => {
            switch (columnKey) {
                case "id":
                    return review.id;
                case "content":
                    return review.content;
                case "status":
                    return review.status;
            }
        },
        []
    );
}