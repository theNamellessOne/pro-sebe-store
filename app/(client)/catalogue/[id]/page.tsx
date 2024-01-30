import { ProductService } from "@/service/product/product-service";
import { Product } from "./components/product";

export default async function Page({ params }: { params: { id: string } }) {
  const { value } = await ProductService.instance.fetchById(params.id);
  return <Product product={value} />;
}
