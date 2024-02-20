"use client";

import React, { ReactNode, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const BannerSwiper = ({
  maxSlidesPerView = 3,
  showPagination = false,
  children,
}: {
  maxSlidesPerView?: number;
  showPagination?: boolean;
  children: ReactNode[];
}) => {
  const swiperRef = useRef<any>();

  return (
    <Swiper
      onBeforeInit={(swiper) => {
        swiperRef.current = swiper;
      }}
      slidesPerView={1}
      spaceBetween={0}
      modules={[Pagination, Autoplay]}
      pagination={{
        enabled: showPagination,
        clickable: true,
        bulletActiveClass: "scale-[1.3]",
        bulletClass:
          "h-4 w-4 rounded-full bg-secondary cursor-pointer inline-block mx-1",
      }}
      breakpoints={{
        768: {
          slidesPerView: maxSlidesPerView - 1 > 0 ? maxSlidesPerView - 1 : 1,
          spaceBetween: 10,
        },
        1280: { slidesPerView: maxSlidesPerView, spaceBetween: 30 },
      }}
      autoplay={{ delay: 5000, pauseOnMouseEnter: true }}
      loop
    >
      {children.map((child, idx) => {
        return <SwiperSlide key={idx}>{child}</SwiperSlide>;
      })}
    </Swiper>
  );
};
