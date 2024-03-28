import { Size } from "./error-box";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { ReactNode } from "react";

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
  message: ReactNode;
  className?: string;
};

export function SuccessBox({
  message,
  size = "md",
  className = "",
}: ErrorBoxProps) {
  return (
    <div
      className={`text-success ${textSize[size]} gap-2 flex items-center bg-green-100 ${className}`}
    >
      <IoIosCheckmarkCircleOutline className={iconSize[size]} />
      <p className={`font-semibold`}>{message}</p>
    </div>
  );
}
