import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const fileRouter = {
  bannerImage: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  }).onUploadComplete(() => {}),
  productImage: f({
    image: { maxFileSize: "16MB", maxFileCount: 10 },
  }).onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof fileRouter;
