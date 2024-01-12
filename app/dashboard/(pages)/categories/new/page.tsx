import { DashboardBackHeader } from "@/app/dashboard/components/dashboard-back-header";
import { CategoryForm } from "../components/category-form";

export default function Page() {
  return (
    <div className={"p-4 px-[20px]"}>
      <DashboardBackHeader title={"Додати Категорію"} />
      <CategoryForm />
    </div>
  );
}
