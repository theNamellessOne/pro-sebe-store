import { Key, useCallback } from "react";
import { Banner } from "@prisma/client";
import Image from "next/image";

export function useBannerTableCell() {
  return useCallback((banner: Banner, columnKey: Key) => {
    switch (columnKey) {
      case "id":
        return banner.id;
      case "name":
        return banner.name;
      case "imageUrl":
        return (
          <div
            className={
              "relative aspect-[4/3] h-64 rounded-large overflow-hidden"
            }
          >
            <Image fill src={banner.imageUrl} alt={"banner image"} />
          </div>
        );
      case "shouldBeOnTop":
        return banner.shouldBeOnTop.toString();
    }
  }, []);
}
