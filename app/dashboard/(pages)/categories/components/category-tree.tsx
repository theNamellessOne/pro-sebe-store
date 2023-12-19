import { fetchCategoryTree } from "@/service/category-service";
import { CategoryTreeItem } from "@/app/dashboard/(pages)/categories/components/category-tree-item";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";

export async function CategoryTree() {
  const categories = await fetchCategoryTree();

  return (
    <>
      <DashboardHeader title={"Tree View"} showButton={false}/>
      {categories.map((item) => {
        return <CategoryTreeItem key={item.id} value={item} />;
      })}
    </>
  );
}
