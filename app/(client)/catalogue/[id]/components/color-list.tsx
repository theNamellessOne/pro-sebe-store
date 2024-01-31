import { Check } from "lucide-react";

export function ColorList({
  colors,
  colorId,
  setSelectedColor,
}: {
  colors: any[];
  colorId: number;
  setSelectedColor: (colorId: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className={"text-lg xl:text-xl"}>
        Колір -{" "}
        {colors
          .filter((color: any) => color.id === colorId)
          .map((color: any) => color.name)}
      </h3>

      <div className={"flex gap-2"}>
        {colors.map((color: any) => {
          return (
            <button
              key={color.id}
              style={{ background: color.hexValue }}
              onClick={() => setSelectedColor(color.id)}
              className={
                "flex flex-col items-center justify-center h-[44px] w-[44px] rounded-sm relative"
              }
            >
              {color.id === colorId && (
                <div
                  className={
                    "absolute inset-0 flex justify-center items-center text-white"
                  }
                >
                  <Check />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
