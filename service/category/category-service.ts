import {
  _fetchAllCategories,
  _fetchCategories,
  _fetchCategoryById,
  _fetchCategoryTree,
  _fetchPossibleParents,
} from "@/service/category/impl/category-fetch-service";
import {
  _deleteCategory,
  _deleteCategoryTree,
  _deleteManyCategories,
} from "@/service/category/impl/category-delete-service";
import { _saveCategory } from "@/service/category/impl/category-write-service";

export class CategoryService {
  public fetch = _fetchCategories;
  public fetchAll = _fetchAllCategories;
  public fetchTree = _fetchCategoryTree;
  public fetchById = _fetchCategoryById;
  public fetchPossibleParents = _fetchPossibleParents;

  public save = _saveCategory;

  public delete = _deleteCategory;
  public deleteTree = _deleteCategoryTree;
  public deleteMany = _deleteManyCategories;

  private constructor() {}

  private static _instance: CategoryService | undefined;

  static get instance() {
    if (!CategoryService._instance) {
      CategoryService._instance = new CategoryService();
    }

    return CategoryService._instance;
  }
}
