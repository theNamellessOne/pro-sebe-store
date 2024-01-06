import { DashboardBackHeader } from "@/app/dashboard/components/dashboard-back-header";
import { CategoryForm } from "@/app/dashboard/(pages)/categories/components/category-form";
import { CategoryService } from "@/app/dashboard/(pages)/categories/service/category-service";

export default async function Page({ params }: { params: { id: string } }) {
  const { errMsg, value } = await CategoryService.instance.fetchById(
    +params.id,
  );

  return (
    <div className={"p-4 px-[20px]"}>
      <DashboardBackHeader title={"Редагувати Категорію"} />

      {value && <CategoryForm value={value} />}
    </div>
  );
}
