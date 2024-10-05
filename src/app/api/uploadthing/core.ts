import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
     
      const user = await currentUser(); 
      if (!user || !user.id) {
        throw new UploadThingError("Unauthorized");
      } 
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
     const createFile = await db.file.create({
        data:{
            key:file.key,
            name: file.name, 
            url: file.url,
            uploadStatus:"PROCESSING",
            userId:metadata.userId
        }
     })
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
