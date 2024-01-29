import { Spinner } from "@nextui-org/spinner";

export default function Loading() {
  return (
    <div
      className={
        "absolute inset-0 z-50 bg-black/10 backdrop-blur flex items-center justify-center"
      }
    >
      <Spinner color={"primary"} size={"lg"} />
    </div>
  );
}
