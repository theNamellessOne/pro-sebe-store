"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRef } from "react";
import { ReviewItem } from "./review-item";

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
            <ReviewItem review={review} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
