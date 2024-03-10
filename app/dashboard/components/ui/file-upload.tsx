import { fileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import imageCompression from "browser-image-compression";
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
      className={"rounded-large border-none shadow-small py-6"}
      appearance={{
        button: "bg-primary px-4",
      }}
      endpoint={endpoint}
      onBeforeUploadBegin={async (files) => {
        const compress = async () => {
          const options = {
            maxWidthOrHeight: 1024,
            useWebWorker: true,
          };

          let promises = files.map(async (file) => {
            return await imageCompression(file, options);
          });

          return await Promise.all(promises);
        };

        return await compress();
      }}
      onClientUploadComplete={onUploadComplete}
      onUploadBegin={onUploadBegin}
    />
  );
}
