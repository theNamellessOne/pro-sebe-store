import { DashboardBackHeader } from "@/app/dashboard/components/dashboard-back-header";
import { CategoryForm } from "@/app/dashboard/(pages)/categories/components/category-form";
import { fetchCategoryById } from "@/service/category-service";

export default async function Page({ params }: { params: { id: string } }) {
  const { errMsg, value } = await fetchCategoryById(+params.id);

  return (
    <div className={"p-4 px-[20px]"}>
      <DashboardBackHeader title={"Редагувати Категорію"} />

      {value && (
        <CategoryForm
          id={+params.id}
          value={{ name: value.name, parentId: value.parentId }}
        />
      )}
    </div>
  );
}
