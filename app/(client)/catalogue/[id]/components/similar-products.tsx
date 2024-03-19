"use client";

import { Skeleton } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

export function SimilarProducts({ article }: { article: string }) {
  const query = useQuery({
    queryKey: ["similar", article],
    queryFn: async () => {
      const res = await fetch(`/api/recommender/${article}`);
      return res.json();
    },
  });

  return (
    <div className={"container mx-auto p-4"}>
      <h2 className={"text-xl md:text-2xl"}>Вам може сподобатись</h2>

      <div className={"mt-4 gap-4 flex flex-row overflow-y-scroll"}>
        <AnimatePresence>
          {query.isLoading ? (
            <SimilarSkeleton />
          ) : (
            query.data?.map((item: any) => {
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
                            {(
                              Math.round(item.compareAtPrice * 100) / 100
                            ).toFixed(2)}
                          </p>
                        </>
                      )}

                      <>
                        {" "}
                        {(Math.round(item.price * 100) / 100).toFixed(2)} UAH
                      </>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const SimilarSkeleton = () =>
  [1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={"min-w-[373px] shrink-0 flex flex-col gap-2 h-[500px]"}
        key={"product_loader" + item}
      >
        <Skeleton className="rounded-sm mb-4 h-[420px]"></Skeleton>
        <Skeleton className="rounded-sm">
          <p>{"sample text"}</p>
        </Skeleton>
        <Skeleton className="rounded-sm">
          <p>{"sample text"}</p>
        </Skeleton>
      </motion.div>
    );
  });
