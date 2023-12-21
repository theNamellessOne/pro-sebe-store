"use client";

import { Checkbox, SortDescriptor } from "@nextui-org/react";
import { CategoryTable } from "@/app/dashboard/(pages)/categories/components/category-table";
import { CategoryTree } from "@/app/dashboard/(pages)/categories/components/category-tree";
import React, { Suspense, useState } from "react";
import Loading from "@/app/dashboard/loading";

export function CategoryView({
  query,
  page,
  sortDescriptor,
}: {
  query: string;
  page: number;
  sortDescriptor: SortDescriptor;
}) {
  const [showTree, setShowTree] = useState(false);

  return (
    <div>
      <Suspense
        key={query + page + sortDescriptor.direction + sortDescriptor.column}
        fallback={<Loading />}
      >
        {showTree ? (
          <CategoryTree />
        ) : (
          <CategoryTable
            query={query}
            page={page}
            sortDescriptor={sortDescriptor}
          />
        )}
      </Suspense>

      <Checkbox
        className={"ml-auto"}
        isSelected={showTree}
        onValueChange={setShowTree}
      >
        Show Tree View
      </Checkbox>
    </div>
  );
}
