import { ProductService } from "@/service/product/product-service";
import { Product } from "./components/product";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const { value } = await ProductService.instance.fetchById(params.id);

  if (!value) {
    redirect("/catalogue");
  }

  return <Product product={value} />;
}
