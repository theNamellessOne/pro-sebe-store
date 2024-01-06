import { DashboardBackHeader } from "@/app/dashboard/components/dashboard-back-header";
import { ProductForm } from "@/app/dashboard/(pages)/products/components/form/product-form";

export default function Page() {
  return (
    <div className={"p-4 px-[20px]"}>
      <DashboardBackHeader title={"Додати Товар"} />
      <ProductForm />
    </div>
  );
}
