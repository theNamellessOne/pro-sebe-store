"use client";

import { BannerService } from "@/service/banner/banner-service";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Banner } from "@prisma/client";
import { BannerSwiper } from "./banner-swiper";
import { Skeleton } from "@nextui-org/react";

export function TopBanners() {
  const [banners, setBanners] = useState<Banner[]>();

  useEffect(() => {
    BannerService.instance.fetchTop().then(setBanners);
  }, []);

  return (
    <div>
      <BannerSwiper>
        {!banners
          ? [1, 2, 3].map((item) => {
              return (
                <Skeleton key={item} className="rounded-lg">
                  <div
                    style={{ height: "calc(100vh - 300px)" }}
                    className="rounded-sm bg-primary"
                  ></div>
                </Skeleton>
              );
            })
          : banners.map((banner) => (
              <Image
                style={{ height: "calc(100vh - 300px)" }}
                className="rounded-sm aspect-[600/800] object-cover"
                key={banner.id}
                src={banner.imageUrl}
                alt="banner"
                height={1600}
                width={1000}
              />
            ))}
      </BannerSwiper>
    </div>
  );
}
