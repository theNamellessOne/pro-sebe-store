import { MediaUrl } from "@prisma/client";
import Image from "next/image";

export function ProductImg({ selectedVariant }: { selectedVariant: any }) {
  return (
    <div
      className={
        `masonry ${selectedVariant.mediaUrls.length < 2 ? "col-1" : "col-2"} ` +
        "max-h-[400px] h-[50vh] lg:h-auto lg:max-h-none overflow-scroll snap-x"
      }
    >
      {selectedVariant.mediaUrls.map((media: MediaUrl) => {
        return (
          <div
            key={media.id}
            className={
              "snap-start item flex justify-center items-center overflow-hidden h-full w-full max-h-[400px] lg:max-h-[768px]"
            }
          >
            <img
              src={media.url}
              key={media.id}
              alt={"media image"}
              className={"shrink-0 min-w-full min-h-full"}
            />
          </div>
        );
      })}
    </div>
  );
}
