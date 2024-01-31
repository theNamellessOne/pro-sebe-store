import { MediaUrl } from "@prisma/client";

export function ProductImg({ selectedVariant }: { selectedVariant: any }) {
  return (
    <div
      className={`masonry ${selectedVariant.mediaUrls.length < 2 ? "col-1" : "col-2"}`}
    >
      {selectedVariant.mediaUrls.map((media: MediaUrl) => {
        return (
          <div className={"item"}>
            <img
              className={"h-full w-full"}
              src={media.url}
              key={media.id}
              alt={"media image"}
            />
          </div>
        );
      })}
    </div>
  );
}
