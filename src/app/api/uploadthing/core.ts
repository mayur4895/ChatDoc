import { db } from "@/lib/db";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { pinecone } from "@/lib/pinecone"; // Import the Pinecone client setup
import pRetry from 'p-retry'; // Ensure you import p-retry

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
      let createdFile:any; // Declare variable in higher scope
      try {
        // Create file record in DB
        createdFile = await db.file.create({
          data: {
            key: file.key,
            name: file.name,
            url: file.url,
            uploadStatus: "PROCESSING",
            userId: metadata.userId,
          },
        });

        // Fetch the uploaded PDF
        const response = await fetch(file.url);
        const blob = await response.blob();

        // Load PDF using PDFLoader from Langchain
        const loader = new PDFLoader(blob);
        const docs = await loader.load();

        // Initialize Pinecone Client
        const pineConeIndex = pinecone.Index("chatdoc");

        // Set up OpenAI embeddings with a specific model (e.g., text-embedding-ada-002)
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY!,
          modelName: 'text-embedding-ada-002', // Specify the model here
        });

        // Retry logic for storing documents in Pinecone
        const retryOperation = pRetry(async () => {
          return await PineconeStore.fromDocuments(docs, embeddings, {
            pineconeIndex: pineConeIndex,
            namespace: createdFile.id, // Use file ID as namespace
          });
        }, {
          retries: 5,  // Retry 5 times
          factor: 2,   // Exponential backoff
          minTimeout: 1000,  // Minimum 1 second between retries
        });
       
        await retryOperation;
     
        // Update file status in the database
        await db.file.update({
          where: {
            id: createdFile.id,
          },
          data: {
            uploadStatus: "SUCCESS",
          },
        });
      } catch (error: any) {
        console.error("Error processing PDF upload:", error);
  
        if (createdFile) {
          // Update file status to 'FAILED' if the file was created
          await db.file.update({
            where: {
              id: createdFile.id, // Access createdFile.id here
            },
            data: {
              uploadStatus: "FAILED",
            },
          });
        }
        
        throw error; // Re-throw error after handling
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
