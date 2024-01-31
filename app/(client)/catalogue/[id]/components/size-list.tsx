export function SizeList({
  sizes,
  sizeId,
  setSelectedSize,
}: {
  sizes: any[];
  sizeId: number;
  setSelectedSize: (sizeId: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className={"text-lg xl:text-xl"}>
        Розмір -{" "}
        {sizes
          .filter((size: any) => size.id === sizeId)
          .map((size: any) => size.name)}
      </h3>

      <div className={"flex gap-2"}>
        {sizes.map((size: any) => {
          return (
            <button
              key={size.id}
              onClick={() => setSelectedSize(size.id)}
              className={
                "flex border-foreground border-1 flex-col items-center " +
                `${size.id === sizeId ? "bg-secondary" : ""}` +
                ` justify-center h-[44px] w-[44px] rounded-sm relative`
              }
            >
              <p className={"text-xl"}>{size.name}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
