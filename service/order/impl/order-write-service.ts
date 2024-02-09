import { OrderInput } from "@/schema/order/order-schema";
import { NovaPostService } from "@/service/novapost/novapost-service";
import { ProductService } from "@/service/product/product-service";

const npService = NovaPostService.instance;
const productService = ProductService.instance;

export function _placeOrder(order: OrderInput) {}
