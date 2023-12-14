import { Input } from "@nextui-org/input";
import { DashboardBackHeader } from "@/app/dashboard/components/dashboard-back-header";
import { Button } from "@nextui-org/button";
import prisma from "@/lib/prisma";

export default function Page() {
  async function createColor(formData: FormData) {
    "use server";

    const name = formData.get("name")!.toString();
    const hexValue = formData.get("hexValue")!.toString();

    await prisma.color.create({
      data: {
        name,
        hexValue,
      },
    });
  }

  return (
    <div>
      <DashboardBackHeader title={"Колір"} />

      <form className={"mt-6"} action={createColor}>
        <Input label={"Name"} name={"name"} />
        <Input type={"color"} name={"hexValue"} />
        <Button color={"primary"} variant={"shadow"} type={"submit"}>
          Create
        </Button>
      </form>
    </div>
  );
}
