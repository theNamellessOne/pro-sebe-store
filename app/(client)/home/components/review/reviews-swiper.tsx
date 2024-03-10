"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRef } from "react";
import { ReviewItem } from "./review-item";
import { ReviewService } from "@/service/review/review-service";
import { useState, useEffect } from "react";

export function ReviewSwiper() {
  const swiperRef = useRef<any>();
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    ReviewService.instance.fetchLatest().then(setReviews);
  }, []);

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
        {reviews.map((review) => (
          <SwiperSlide key={review.createdAt} className={"flex items-center"}>
            <ReviewItem review={review} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
