import { Spinner } from "@nextui-org/spinner";

export default function Loading() {
  return (
    <div
      className={
        "fixed inset-0 z-[9999] bg-black/10 backdrop-blur flex items-center justify-center"
      }
    >
      <Spinner color={"primary"} size={"lg"} />
    </div>
  );
}
