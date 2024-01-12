import { DashboardBackHeader } from "@/app/dashboard/components/dashboard-back-header";
import { CategoryService } from "@/service/category/category-service";
import { CategoryForm } from "../../components/category-form";

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
