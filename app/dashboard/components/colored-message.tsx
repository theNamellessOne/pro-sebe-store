export function ColorMessage(props: {
  text: string;
  color: "green" | "blue" | "red" | "yellow";
  classNames?: {
    inner?: string;
    wrapper?: string;
  };
}) {
  let innerClassName = "";
  let wrapperClassName = "";

  switch (props.color) {
    case "green":
      wrapperClassName = "bg-green-200/80";
      innerClassName += "text-green-600";
      break;
    case "blue":
      wrapperClassName = "bg-blue-200/80";
      innerClassName += "text-blue-600";
      break;
    case "red":
      wrapperClassName = "bg-red-200/80";
      innerClassName += "text-red-600";
      break;
    case "yellow":
      wrapperClassName = "bg-yellow-200/80";
      innerClassName += "text-yellow-600";
      break;
  }

  if (props.classNames?.inner) {
    innerClassName += " " + props.classNames.inner;
  }

  if (props.classNames?.wrapper) {
    wrapperClassName += " " + props.classNames.wrapper;
  }

  return (
    <div className={wrapperClassName}>
      <p className={innerClassName}>{props.text}</p>
    </div>
  );
}
