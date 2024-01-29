type ColorProps = {
  hex: string;
  className: string;
};

export function Color({ hex, className }: ColorProps) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0 18C0 8.05888 8.05888 0 18 0C27.9411 0 36 8.05888 36 18C36 27.9411 27.9411 36 18 36C8.05888 36 0 27.9411 0 18Z"
        fill={hex}
      />
      <path
        d="M0.5 18C0.5 8.33502 8.33502 0.5 18 0.5C27.665 0.5 35.5 8.33502 35.5 18C35.5 27.665 27.665 35.5 18 35.5C8.33502 35.5 0.5 27.665 0.5 18Z"
        stroke="black"
        stroke-opacity="0.5"
      />
    </svg>
  );
}
