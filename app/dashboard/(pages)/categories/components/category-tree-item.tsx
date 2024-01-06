import { Category } from "@prisma/client";

type CategoryTreeItemProps = {
  value: { children: Category[] } & Category;
  depth?: number | undefined;
};

export function CategoryTreeItem({ value, depth = 0 }: CategoryTreeItemProps) {
  return (
    <>
      <div style={{ marginLeft: depth * 10 }}>{value.name}</div>

      {value.children?.map((item) => {
        return (
          //@ts-ignore
          <CategoryTreeItem key={item.id} depth={depth + 1} value={item} />
        );
      })}
    </>
  );
}
