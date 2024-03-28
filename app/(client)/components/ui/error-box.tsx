import { VscError } from "react-icons/vsc";

export type Size = {
  sm: string;
  md: string;
  lg: string;
};

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
  className?: string;
};

export function ErrorBox({
  message,
  size = "md",
  className = "",
}: ErrorBoxProps) {
  return (
    <div
      className={`${textSize[size]} gap-2 text-danger flex items-center bg-red-100 ${className}`}
    >
      <VscError className={`${iconSize[size]}`} />
      <p className={`font-semibold`}>{message}</p>
    </div>
  );
}
