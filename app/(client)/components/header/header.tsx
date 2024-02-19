import { HeaderIcons } from "./header-icons";
import { HeaderLinks } from "./header-links";
import { HeaderLogo } from "./header-logo";
import { HeaderCategories } from "./header-categories";
import { HeaderSearch } from "./header-search";
import { CategoryService } from "@/service/category/category-service";

export async function Header() {
  const categories = await CategoryService.instance.fetchTree();

  return (
    <div className={`container mx-auto relative`}>
      <header className="px-2 md:px-4 lg:px-8 border-b">
        <div className="flex items-center justify-center">
          <HeaderLinks categories={categories} />

          <div className={"flex-1 flex justify-center items-center"}>
            <HeaderLogo />
          </div>

          <HeaderIcons />
        </div>
        <HeaderCategories categories={categories} />
      </header>
      <HeaderSearch />
    </div>
  );
}
