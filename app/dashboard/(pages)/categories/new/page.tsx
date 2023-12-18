import { DashboardBackHeader } from "@/app/dashboard/components/dashboard-back-header";
import { CategoryForm } from "@/app/dashboard/(pages)/categories/components/category-form";

export default function Page() {
  return (
    <div className={"p-4 px-[20px]"}>
      <DashboardBackHeader title={"Додати Категорію"} />
      <CategoryForm value={{ name: "" }} />
    </div>
  );
}
