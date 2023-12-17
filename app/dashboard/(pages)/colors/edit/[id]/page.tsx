import { DashboardBackHeader } from "@/app/dashboard/components/dashboard-back-header";
import { ColorForm } from "@/app/dashboard/(pages)/colors/components/color-form";
import { fetchColorById } from "@/service/color-service";

export default async function Page({ params }: { params: { id: string } }) {
  const { errMsg, value } = await fetchColorById(+params.id);

  return (
    <div className={"p-4 px-[20px]"}>
      <DashboardBackHeader title={"Редагувати Колір"} />

      {value && (
        <ColorForm
          id={+params.id}
          value={{ name: value.name, hexValue: value.hexValue }}
        />
      )}
    </div>
  );
}
