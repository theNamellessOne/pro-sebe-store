import { DashboardBackHeader } from "@/app/dashboard/components/dashboard-back-header";
import { ProductService } from "@/app/dashboard/(pages)/products/service/product-service";
import { ProductForm } from "@/app/dashboard/(pages)/products/components/form/product-form";

export default async function Page({ params }: { params: { id: string } }) {
  const { errMsg, value } = await ProductService.instance.fetchById(params.id);

  return (
    <div className={"p-4 px-[20px]"}>
      <DashboardBackHeader title={"Редагувати Товар"} />
      {value && (
        //@ts-ignore
        <ProductForm value={value} isEditing={true} />
      )}
    </div>
  );
}
