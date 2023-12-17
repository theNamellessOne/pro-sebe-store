import { DashboardBackHeader } from "@/app/dashboard/components/dashboard-back-header";
import { fetchSizeById } from "@/service/size-service";
import { SizeForm } from "@/app/dashboard/(pages)/sizes/components/size-form";

export default async function Page({ params }: { params: { id: string } }) {
  const { errMsg, value } = await fetchSizeById(+params.id);

  return (
    <div className={"p-4 px-[20px]"}>
      <DashboardBackHeader title={"Редагувати Розмір"} />

      {value && <SizeForm id={value.id} value={{ ...value }} />}
    </div>
  );
}
