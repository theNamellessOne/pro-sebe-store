import { DashboardBackHeader } from "@/app/dashboard/components/dashboard-back-header";
import { BannerForm } from "@/app/dashboard/(pages)/banners/components/banner-form";
import { BannerService } from "@/app/dashboard/(pages)/banners/service/banner-service";

export default async function Page({ params }: { params: { id: string } }) {
  const { errMsg, value } = await BannerService.instance.fetchById(+params.id);

  return (
    <div className={"p-4 px-[20px]"}>
      <DashboardBackHeader title={"Редагувати Банер"} />

      {value && <BannerForm value={value} />}
    </div>
  );
}
