import { CategoryTreeItem } from "@/app/dashboard/(pages)/categories/components/category-tree-item";
import { CategoryService } from "@/service/category/category-service";

export async function CategoryTree() {
  const categories = await CategoryService.instance.fetchTree();

  return (
    <div className={"shadow-small rounded-large p-4 my-2"}>
      {categories.map((item: any) => {
        return <CategoryTreeItem key={item.id} value={item} />;
      })}
    </div>
  );
}
