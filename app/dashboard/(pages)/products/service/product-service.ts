import { _saveProduct } from "@/app/dashboard/(pages)/products/service/impl/product-write-service";
import { _fetchProductById } from "@/app/dashboard/(pages)/products/service/impl/product-fetch-service";

export class ProductService {
  public fetchById = _fetchProductById;
  public save = _saveProduct;

  private static _instance: ProductService | undefined;

  static get instance() {
    if (!ProductService._instance) {
      ProductService._instance = new ProductService();
    }

    return ProductService._instance;
  }
}
