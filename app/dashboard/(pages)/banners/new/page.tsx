import { DashboardBackHeader } from "@/app/dashboard/components/dashboard-back-header";
import { BannerForm } from "@/app/dashboard/(pages)/banners/components/banner-form";

export default function Page() {
  return (
    <div className={"p-4 px-[20px]"}>
      <DashboardBackHeader title={"Додати Банер"} />
      <BannerForm />
    </div>
  );
}
