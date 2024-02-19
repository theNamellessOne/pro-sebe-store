"use client";

import { twMerge } from "tailwind-merge";
import React from "react";

type ButtonProps = {
  type: "primary" | "secondary";
  htmlType?: "submit" | "button" | "reset";
  onClick?: (e: React.MouseEvent<HTMLElement> | undefined) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  htmlType = "button",
  disabled = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyle = "text-lg py-2 px-10 rounded-sm";
  const primaryStyle =
    "transition-colors border border-black bg-black text-primary-foreground hover:bg-transparent hover:text-black";
  const secondaryStyle =
    "transition-colors bg-black/10 text-black hover:bg-black hover:text-white";
  const disabledStyle =
    "disabled:border-secondary disabled:text-secondary-foreground disabled:bg-secondary";

  const isPrimary = props.type === "primary";

  return (
    <button
      className={twMerge(
        baseStyle,
        isPrimary ? primaryStyle : secondaryStyle,
        disabledStyle,
        className,
      )}
      type={htmlType}
      onClick={props.onClick}
      disabled={disabled}
    >
      {props.children}
    </button>
  );
}
