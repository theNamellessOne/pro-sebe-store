import { DashboardBackHeader } from "@/app/dashboard/components/dashboard-back-header";
import { ColorForm } from "@/app/dashboard/(pages)/colors/components/color-form";

export default function Page() {
  return (
    <div className={"p-4 px-[20px]"}>
      <DashboardBackHeader title={"Додати Колір"} />
      <ColorForm value={{ name: "", hexValue: "#000000" }} />
    </div>
  );
}
