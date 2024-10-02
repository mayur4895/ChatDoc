// user.ts
 
import z from 'zod';
import { publicProcedure, router } from '../trpc/trpc';

export const userRouter = router({
  getUser: publicProcedure.query(() => {
    return { name: "John Doe" };
  }),
  createUser: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      return { id: "new_id", name: input.name };
    }),
});
