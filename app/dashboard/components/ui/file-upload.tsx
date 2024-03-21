import { fileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import Compressor from "compressorjs";
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
          let promises = files.map(async (file) => {
            return new Promise((resolve, reject) => {
              let mWidth = 1600;
              let mHeight = 1600;

              new Compressor(file, {
                quality: 0.6,
                maxWidth: mWidth,
                maxHeight: mHeight,
                success(result) {
                  resolve(new File([result], file.name));
                },
                error(error) {
                  reject(error);
                },
              });
            }) as Promise<File>;
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
