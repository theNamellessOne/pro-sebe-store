"use client";

import { ReviewService } from "@/service/review/review-service";
import { Key, useEffect, useState } from "react";
import { ReviewItem } from "../../home/components/review/review-item";
import { ReviewForm } from "../../home/components/review/review-form";
import { Button } from "../../components/ui/button";
import Loading from "@/app/loading";

export function ReviewList(props: {
  page: number;
  sortColumn: Key;
  sortDirection: "descending" | "ascending";
}) {
  const [reviews, setReviews] = useState<
    {
      user: { username: string | null };
      content: string;
      rating: number;
      createdAt: any;
    }[]
  >([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    ReviewService.instance
      .fetchApproved({
        query: "",
        page: currentPage,
        sortColumn: props.sortColumn,
        sortDirection: props.sortDirection,
      })
      .then((res) => {
        setReviews([...reviews, ...res.items]);
        setTotalPages(res.pages);
      })
      .finally(() => setIsLoading(false));
  }, [currentPage]);

  return (
    <>
      {isLoading && <Loading />}
      <div className={"container mx-auto my-4"}>
        <ReviewForm />
        {reviews.map((review) => (
          <ReviewItem key={review.createdAt} review={review} />
        ))}

        {totalPages > 0 && totalPages > currentPage && (
          <div className={"flex items-center justify-center"}>
            <Button
              type={"secondary"}
              className={"capitalize my-4"}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              більше
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
