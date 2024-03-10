import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function FavoriteProduct({ product: item }: { product: any }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key={item.article}
      className={"max-w-full shrink-0"}
    >
      <Link href={`/catalogue/${item.article}`}>
        <div className={"flex flex-col gap-2"}>
          <div className={"mb-4 rounded-sm overflow-hidden"}>
            <Image
              alt={"media"}
              className={"aspect-373/420] object-cover h-[420px]"}
              placeholder={"blur"}
              blurDataURL={
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkeAoAAOsA57RxdOQAAAAASUVORK5CYII="
              }
              src={
                item.variants[0].mediaUrls[0]
                  ? item.variants[0].mediaUrls[0]?.url
                  : "https://utfs.io/f/9f49f263-2475-45a1-8770-479fd5cb0c80-9w6i5v.png"
              }
              height={420}
              width={373}
            />
          </div>

          <p>{item.name}</p>

          {item.compareAtPrice > item.price && (
            <>
              <p className={"text-zinc-600 line-through"}>
                {(Math.round(item.compareAtPrice * 100) / 100).toFixed(2)}
              </p>
            </>
          )}

          <> {(Math.round(item.price * 100) / 100).toFixed(2)} UAH</>
        </div>
      </Link>
    </motion.div>
  );
}
