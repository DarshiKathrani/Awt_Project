import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Define a route for PDF uploads
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for url:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;