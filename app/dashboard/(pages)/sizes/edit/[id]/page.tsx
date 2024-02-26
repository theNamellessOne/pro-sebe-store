import { DashboardBackHeader } from "@/app/dashboard/components/dashboard-back-header";
import { SizeForm } from "@/app/dashboard/(pages)/sizes/components/size-form";
import { SizeService } from "@/service/size/size-service";

export default async function Page({ params }: { params: { id: string } }) {
  const { value } = await SizeService.instance.fetchById(+params.id);

  return (
    <div className={"p-4 px-[20px]"}>
      <DashboardBackHeader title={"Редагувати Розмір"} />

      {value && <SizeForm value={value} />}
    </div>
  );
}
