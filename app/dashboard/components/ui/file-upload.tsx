"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { fileRouter } from "@/app/api/uploadthing/core";

type FileUploadProps = {
  onChange: (url?: string) => void;
  endpoint: keyof typeof fileRouter;
};

export function FileUpload({ onChange, endpoint }: FileUploadProps) {
  return (
    <UploadDropzone
      className={"rounded-large border-none shadow-small py-4"}
      endpoint={endpoint}
      onClientUploadComplete={(res: any) => {
        onChange(res?.[0].url);
      }}
    />
  );
}
