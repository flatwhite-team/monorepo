import { createTRPCRouter, publicProcedure } from "../trpc";

export const storeRouter = createTRPCRouter({
  findFirst: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.store.findFirst();
  }),
});
