import { MediaUrl } from "@prisma/client";
import Image from "next/image";

export function ProductImg({ selectedVariant }: { selectedVariant: any }) {
  return (
    <div
      className={
        `flex md:block ${selectedVariant.mediaUrls.length > 1 && "md:columns-2"} ` +
        `gap-2 overflow-x-auto h-[50vh] md:h-auto`
      }
    >
      {selectedVariant.mediaUrls.map((media: MediaUrl) => {
        return (
          <Image
            key={media.id}
            src={media.url}
            alt={"media image"}
            height={800}
            width={800}
            className={
              "h-full md:h-auto object-cover " +
              "mb-2 min-w-full md:min-w-auto md:max-w-full object-cover max-h-[720px] rounded-sm overflow-hidden"
            }
          />
        );
      })}
    </div>
  );
}
