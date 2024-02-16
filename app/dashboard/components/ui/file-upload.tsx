import { UploadDropzone } from "@/lib/uploadthing";
import { fileRouter } from "@/app/api/uploadthing/core";
import { UploadFileResponse } from "uploadthing/client";

type FileUploadProps = {
  onUploadComplete?: (res: UploadFileResponse<null>[]) => void;
  onUploadBegin?: (fileName?: string) => void;
  endpoint: keyof typeof fileRouter;
  input?: any;
};

export function FileUpload({
  onUploadComplete,
  onUploadBegin,
  endpoint,
  input,
}: FileUploadProps) {
  return (
    <UploadDropzone
      input={input}
      className={"rounded-large border-none shadow-small py-4"}
      endpoint={endpoint}
      onClientUploadComplete={onUploadComplete}
      onUploadBegin={onUploadBegin}
    />
  );
}
