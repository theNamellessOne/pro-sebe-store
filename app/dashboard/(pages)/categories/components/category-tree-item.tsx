type CategoryTree = {
  id: number;
  name: string;
  parentId: number | null;
  children: CategoryTree[];
};

type CategoryTreeItemProps = {
  value: CategoryTree;
  depth?: number | undefined;
};

export function CategoryTreeItem({ value, depth = 0 }: CategoryTreeItemProps) {
  return (
    <>
      <div style={{ marginLeft: depth * 10 }}>{value.name}</div>

      {value.children?.map((item) => {
        return (
          <CategoryTreeItem key={item.id} depth={depth + 1} value={item} />
        );
      })}
    </>
  );
}
