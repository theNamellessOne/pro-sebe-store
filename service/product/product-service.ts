import { _saveProduct } from "@/service/product/impl/product-write-service";
import {
  _fetchAndFilter,
  _fetchPriceExtremes,
  _fetchProductById,
  _fetchProducts,
} from "@/service/product/impl/product-fetch-service";

export class ProductService {
  public fetchById = _fetchProductById;
  public fetch = _fetchProducts;
  public fetchAndFilter = _fetchAndFilter;
  public fetchPriceExtremes = _fetchPriceExtremes;

  public save = _saveProduct;

  private static _instance: ProductService | undefined;

  static get instance() {
    if (!ProductService._instance) {
      ProductService._instance = new ProductService();
    }

    return ProductService._instance;
  }
}
