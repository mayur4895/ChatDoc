import { currentUser } from '@clerk/nextjs/server';
import { TRPCError } from "@trpc/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { db } from "@/lib/db";
 import { z } from 'zod';


export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    // Get the current user from Clerk
    const user = await currentUser();

    // Check if the user is authenticated
    if (!user) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User is not authenticated.' });
    }

    const userId = user.id;  
    const email = user.emailAddresses[0]?.emailAddress;

   
    let dbUser;
    try {
      dbUser = await db.user.findFirst({
        where: {  externalId: userId },
      });
    } catch (error) {
      console.error("Database query failed:", error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to query the database.' });
    }

   
    if (!dbUser) {
      try {
        await db.user.create({
          data: {
            externalId: userId, 
            email,
          },
        });
        console.log("New user created in the database.");
      } catch (error) {
        console.error("Error creating user in the database:", error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create user in the database.' });
      }
    }

    return { success: true };
  }),
 
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx; 
    if (!userId) { 
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User ID not found." });
    }
     
    try {
   
      const dbUser = await db.user.findFirst({
        where: { externalId: userId },
      });
   
      if (!dbUser) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
      } 
      return await db.file.findMany({
        where: {
          userId: dbUser.externalId,  
        },
      });
    } catch (error) {
      console.error("Error fetching user files:", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch user files." });
    }
  }),

 deleteFile: privateProcedure
          .input(
         z.object({
         id:z.string()
     
      })
    ).mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { id } = input;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User ID not found." });
      }

      try {
        // Check if the file exists and belongs to the authenticated user
        const file = await db.file.findFirst({
          where: {
            id: id,
            userId: userId,
          },
        });

        
        if (!file) {
          throw new TRPCError({ code: "NOT_FOUND", message: "File not found or you don't have permission to delete this file." });
        }

        // Delete the file
        await db.file.delete({
          where: { id: id },
        });

        return { success: true, message: "File deleted successfully." };
      } catch (error) {
        console.error("Error deleting file:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete file." });
      }
  }),




getfile:privateProcedure.input(z.object({key:z.string()}))
.mutation(async({ctx,input})=>{
  const userId = ctx.userId;

  const file = await db.file.findFirst({
    where:{
      key:input.key,
      userId
    }
 
  })

  if(!file){
    throw new TRPCError({code: 'NOT_FOUND', message: 'File not found'})
  } 
  return file;
})



});

export type AppRouter = typeof appRouter;
