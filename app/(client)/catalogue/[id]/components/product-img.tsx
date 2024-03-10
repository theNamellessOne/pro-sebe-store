import Image from "next/image";

export function ProductImg({ selectedVariant }: { selectedVariant: any }) {
  return (
    <div
      className={
        `flex md:block ${selectedVariant.mediaUrls.length > 1 && "md:columns-2"} ` +
        `gap-2 overflow-x-auto h-[50vh] md:h-auto`
      }
    >
      {selectedVariant.mediaUrls.map((media: { url: string }, idx: number) => {
        return (
          <Image
            key={idx}
            src={media.url}
            alt={"media image"}
            height={800}
            width={800}
            priority={true}
            placeholder={"blur"}
            blurDataURL={
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkeAoAAOsA57RxdOQAAAAASUVORK5CYII="
            }
            className={
              "h-full md:h-auto object-cover animate-fade " +
              "mb-2 min-w-full md:min-w-auto md:max-w-full object-cover max-h-[720px] rounded-sm overflow-hidden"
            }
          />
        );
      })}
    </div>
  );
}
