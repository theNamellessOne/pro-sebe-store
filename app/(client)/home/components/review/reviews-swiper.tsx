"use client";

import { PiUserCircleLight } from "react-icons/pi";
import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRef } from "react";

export function ReviewSwiper({
  reviews,
}: {
  reviews: {
    user: { username: string | null };
    content: string;
    rating: number;
  }[];
}) {
  const swiperRef = useRef<any>();

  return (
    <div>
      <Swiper
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView={1}
        spaceBetween={0}
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 5000, pauseOnMouseEnter: true }}
        loop
      >
        {reviews.map((review, idx) => (
          <SwiperSlide key={idx} className={"flex items-center"}>
            <div className={"flex gap-2"}>
              <PiUserCircleLight className={"w-8 h-8 md:w-10 md:h-10"} />

              <div
                className={
                  "bg-secondary rounded-tl-none rounded-md p-4 h-full w-full max-w-full mt-4"
                }
              >
                <h4
                  className={
                    "text-lg font-semibold flex flex-wrap items-center justify-between pb-3"
                  }
                >
                  @{review.user.username ? review.user.username : "user"}
                  <div className={"flex items-center"}>
                    {[1, 2, 3, 4, 5].map((item) => {
                      if (review.rating >= item) {
                        return <GoStarFill className={"w-5 h-5"} />;
                      }

                      return <GoStar className={"w-5 h-5"} />;
                    })}
                  </div>
                </h4>

                <p className={"min-h-[200px]"}>{review.content}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
