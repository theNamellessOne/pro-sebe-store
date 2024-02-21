import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { useCategoryTree } from "@/app/(client)/hooks/use-category-tree";
import { CategoryWithChildren } from "@/app/(client)/components/header/header-categories";

export function CategoryBreadcrumbs({
  currentCategoryId,
}: {
  currentCategoryId: number;
}) {
  const { categories } = useCategoryTree()!;

  const reconstructPath = (
    tree: CategoryWithChildren[],
  ): CategoryWithChildren[] => {
    if (currentCategoryId === 0) return [];
    if (!tree || tree.length === 0) return [];

    for (const category of tree) {
      if (category.id === currentCategoryId) {
        return [category];
      }

      const pathInSubtree = reconstructPath(category.children);
      if (pathInSubtree !== null) {
        return [category, ...pathInSubtree];
      }
    }

    return [];
  };

  const path = reconstructPath(categories);

  return (
    <div className={"container mx-auto px-7 pt-4 pb-1"}>
      <Breadcrumbs>
        <BreadcrumbItem href={`/catalogue`}>Pro Sebe Store</BreadcrumbItem>
        {path.map((category) => (
          <BreadcrumbItem
            href={`/catalogue?categoryFilter=[${category.id}]`}
            key={category.id}
          >
            {category.name}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
}
