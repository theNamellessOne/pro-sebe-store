import { Size } from "./error-box";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const textSize: Size = {
  sm: "text-small",
  md: "text-medium",
  lg: "text-large",
};

const iconSize: Size = {
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-7 h-7",
};

type ErrorBoxProps = {
  size?: keyof Size;
  message: string;
};

export function SuccessBox({ message, size = "md" }: ErrorBoxProps) {
  return (
    <div className={`text-success ${textSize[size]} gap-2 flex items-center`}>
      <IoIosCheckmarkCircleOutline className={iconSize[size]} />
      <p className={`font-semibold`}>{message}</p>
    </div>
  );
}
