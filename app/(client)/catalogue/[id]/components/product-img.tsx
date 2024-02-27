import "./../masonry.css";
import { MediaUrl } from "@prisma/client";
import Image from "next/image";

export function ProductImg({ selectedVariant }: { selectedVariant: any }) {
  return (
    <div
      className={
        `gallery gap-4 ` +
        "max-h-[400px] h-[50vh] lg:h-auto lg:max-h-[680px] overflow-scroll snap-x"
      }
    >
      {selectedVariant.mediaUrls.map((media: MediaUrl) => {
        return (
          <Image
            src={media.url}
            key={media.id}
            alt={"media image"}
            height={600}
            width={600}
            className={
              "gallery-item max-h-[600px] min-w-full md:shrink object-cover rounded-sm"
            }
          />
        );
      })}
    </div>
  );
}
