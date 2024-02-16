"use client";

import { RecommendationService } from "@/service/recommendation/recommendation-service";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SimilarProducts({ article }: { article: string }) {
  const [similar, setSimilar] = useState<any[]>([]);

  useEffect(() => {
    RecommendationService.instance.fetchSimilar(article).then(setSimilar);
  }, []);

  return (
    <div>
      <h2 className={"text-xl md:text-2xl"}>Вам може сподобатись</h2>

      <div className={"mt-4 gap-4 flex flex-row overflow-y-scroll"}>
        {similar?.map((item) => {
          return (
            <Link href={`/catalogue/${item.article}`}>
              <div key={item.article} className={"flex flex-col gap-2"}>
                <div
                  className={
                    "relative h-[420px] w-[373px] mb-4 rounded-sm overflow-hidden"
                  }
                >
                  <Image
                    alt={"media"}
                    className={"aspect-373/420] object-cover"}
                    src={
                      item.variants[0].mediaUrls[0]
                        ? item.variants[0].mediaUrls[0]?.url
                        : "https://utfs.io/f/9f49f263-2475-45a1-8770-479fd5cb0c80-9w6i5v.png"
                    }
                    fill
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
          );
        })}
      </div>
    </div>
  );
}
