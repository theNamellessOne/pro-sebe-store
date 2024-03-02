import { GoStar, GoStarFill } from "react-icons/go";
import { PiUserCircleLight } from "react-icons/pi";

export function ReviewItem({
  review,
}: {
  review: {
    user: { username: string | null };
    content: string;
    rating: number;
    createdAt: any;
  };
}) {
  return (
    <div className={"flex gap-2"}>
      <PiUserCircleLight className={"w-8 h-8 md:w-10 md:h-10"} />

      <div
        className={
          "relative bg-secondary rounded-tl-none rounded-md p-4 h-full w-full max-w-full mt-4"
        }
      >
        <h4
          className={
            "text-lg font-semibold flex flex-wrap items-center justify-between pb-6"
          }
        >
          @{review.user.username ? review.user.username : "user"}
          <div className={"flex items-center"}>
            {[1, 2, 3, 4, 5].map((item) => {
              if (review.rating >= item) {
                return <GoStarFill key={item} className={"w-5 h-5"} />;
              }

              return <GoStar key={item} className={"w-5 h-5"} />;
            })}
          </div>
        </h4>

        <p className={"absolute bottom-0.5 right-0.5 text-sm"}>
          {review.createdAt.toLocaleString()}
        </p>

        <p className={"min-h-[200px]"}>{review.content}</p>
      </div>
    </div>
  );
}
