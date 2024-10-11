import { db } from "@/lib/db";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { pinecone } from "@/lib/pinecone";  
import pRetry from 'p-retry';

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const user = await currentUser();

      if (!user || !user.id) {
        console.error("User not found, authorization failed");
        throw new UploadThingError("Unauthorized");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          url: file.url,
          uploadStatus: "PROCESSING",
          userId: metadata.userId,
        },
      });

      try {  
        const response = await fetch( createdFile.url); 
        const blob = await response.blob(); 
        const loader = new PDFLoader(blob);
        const pageLevelDocs = await loader.load();  

         console.log(pageLevelDocs);
         
         const pineconeIndex = pinecone.Index("chatdoc"); 
          const embeddings = new OpenAIEmbeddings({
           openAIApiKey: process.env.OPENAI_API_KEY!, 
         });
 
        await PineconeStore.fromDocuments(pageLevelDocs,embeddings,{
          pineconeIndex,
          namespace:createdFile.id
        })
        await db.file.update({
          where: { id: createdFile.id },
          data: { uploadStatus: "SUCCESS" },
        });

         
      } catch (err) {
            console.log(err)
          await db.file.update({
            data: { uploadStatus: "FAILED" },
            where: { 
              id: createdFile.id
             },
            
          });
        }

       
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
