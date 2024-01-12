import { MiscService } from "@/service/misc/misc-service";
import { MiscForm } from "./components/misc-form";

export default async function Page() {
  const value = await MiscService.instance.fetch();

  //@ts-ignore
  return <MiscForm value={value} />;
}
