import "./../masonry.css";
import { MediaUrl } from "@prisma/client";
import Image from "next/image";
import { Gallery, ThumbnailImageProps } from "react-grid-gallery";

export function ProductImg({ selectedVariant }: { selectedVariant: any }) {
  return (
    <div
      className={
        `gallery gap-4 ` +
        "max-h-[400px] h-[50vh] lg:h-auto lg:max-h-[680px]  overflow-scroll snap-x"
      }
    >
      {selectedVariant.mediaUrls.map((media: MediaUrl) => {
        return (
          <Image
            src={media.url}
            key={media.id}
            alt={"media image"}
            height={400}
            width={400}
            className={
              "gallery-item max-h-[600px] shrink-0 md:shrink w-full object-cover rounded-sm"
            }
          />
        );
      })}
    </div>
  );
}
