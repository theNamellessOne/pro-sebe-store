import { DashboardBackHeader } from "@/app/dashboard/components/dashboard-back-header";
import { SizeForm } from "@/app/dashboard/(pages)/sizes/components/size-form";

export default function Page() {
  return (
    <div className={"p-4 px-[20px]"}>
      <DashboardBackHeader title={"Додати Розмір"} />
      <SizeForm />
    </div>
  );
}
