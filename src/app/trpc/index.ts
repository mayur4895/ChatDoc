import { currentUser } from '@clerk/nextjs/server';
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./trpc";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb"; // Ensure to import ObjectId from mongodb

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

    // Log user details for debugging
    console.log("User ID:", userId);
    console.log("User Email:", email);

    // Attempt to find the user in the database
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
});

export type AppRouter = typeof appRouter;
