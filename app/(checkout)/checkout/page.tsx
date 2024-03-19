import { auth } from "@/auth/auth";
import { Checkout } from "./components/checkout";

export default async function Page() {
  const session = await auth();

  return <Checkout user={session?.user} />;
}
