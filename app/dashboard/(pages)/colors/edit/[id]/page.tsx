import { DashboardBackHeader } from "@/app/dashboard/components/dashboard-back-header";
import { ColorForm } from "@/app/dashboard/(pages)/colors/components/color-form";
import { ColorService } from "@/app/dashboard/(pages)/colors/service/color-service";

export default async function Page({ params }: { params: { id: string } }) {
  const { errMsg, value } = await ColorService.instance.fetchById(+params.id);

  return (
    <div className={"p-4 px-[20px]"}>
      <DashboardBackHeader title={"Редагувати Колір"} />

      {value && <ColorForm value={value} />}
    </div>
  );
}
