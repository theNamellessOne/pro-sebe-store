import { fetchCategoryTree } from "@/service/category-service";
import { CategoryTreeItem } from "@/app/dashboard/(pages)/categories/components/category-tree-item";

export async function CategoryTree() {
  const categories = await fetchCategoryTree();

  return (
    <div className={"shadow-small rounded-large p-4 my-2"}>
      {categories.map((item) => {
        //@ts-ignore
        return <CategoryTreeItem key={item.id} value={item} />;
      })}
    </div>
  );
}
